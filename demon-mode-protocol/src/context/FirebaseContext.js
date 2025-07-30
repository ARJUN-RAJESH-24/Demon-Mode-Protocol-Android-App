// src/context/FirebaseContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Firebase Imports (ensure these are installed: firebase, @react-native-firebase/app, @react-native-firebase/auth, @react-native-firebase/firestore)
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  // signInAnonymously, // Not used directly in this provider's logic
  onAuthStateChanged,
  signOut,
  // signInWithCustomToken, // Not used directly in this provider's logic
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// Import your Firebase config from src/config/firebase.js
import { firebaseConfig as importedFirebaseConfig } from '../config/firebase';

// Global variables for Canvas environment (MUST BE USED)
// These are provided by the Canvas runtime, so we check for their existence.
// Ensure these globals are available in your specific Expo/React Native environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfigFromCanvas = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : importedFirebaseConfig;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase App
const app = initializeApp(firebaseConfigFromCanvas);
const auth = getAuth(app);
const db = getFirestore(app);

// Default App Data for a new user - all stats start from 0 or N/A
const defaultAppData = {
  demonScore: 0,
  demonScoreWeeklyChange: "0%",
  calories: {
    in: 0,
    out: 0,
    targetIn: 2000, // Default target, user can change
  },
  workouts: {
    am: { type: "N/A", details: "No AM workout logged" },
    pm: { type: "N/A", details: "No PM workout logged" },
  },
  steps: {
    current: 0,
    target: 10000, // Default target
  },
  hydration: {
    waterLiters: 0,
    waterTarget: 3.0, // Default target
    coffeeCups: 0,
    coffeeTarget: 2, // Default target
  },
  streak: 0,
  moodFocus: 50, // Neutral start
  moodNote: "",
  nutritionLog: [],
  supplements: [],
  workoutLog: [],
  disciplineChecks: {
    noSugar: false,
    noOil: false,
    noCheatMeals: false,
    noEjaculation: false,
    protocolFollowed: false,
  },
  remarks: "",
  reflection: "",
  journalConquests: "",
  affirmations: [
    "Discipline is choosing between what you want now and what you want most.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  ],
  currentAffirmationIndex: 0,
  bodyMetrics: {
    weight: [], // Will be populated by user profile
    bodyFat: [], // Will be populated by user profile
    labels: [], // Will be populated dynamically
  },
  muscleFrequency: {
    chest: 0,
    back: 0,
    legs: 0,
    maxSessions: 10, // For progress bar calculation
  },
  runningProgress: {
    vo2max: "N/A",
    fivekPB: "N/A",
    monthlyKm: 0,
    distances: [],
    paces: [],
    labels: [],
  },
  achievements: [
    { id: 1, title: "7 Days No Cheat", unlockedDate: null, details: "Current streak: 0d", icon: 'faFire', color: '#e94560', progress: 0 },
    { id: 2, title: "Max Hydration Demon", unlockedDate: null, details: "0/5L daily for 7d", icon: 'faTint', color: '#3498db', progress: 0 },
  ],
  demonEvolution: {
    rank: "Novice",
    progress: 0,
  },
  settings: {
    theme: "dark", // Default to dark mode
    notifications: {
      morningWakeup: false,
      workoutReminders: false,
      hydrationAlerts: false,
    },
    profile: {
      name: "New Demon",
      age: null,
      gender: null,
      heightCm: null,
      weightKg: null,
      activityLevel: 1.2, // Sedentary default
      weightGoal: "",
      calorieTarget: 0,
    },
    codeOfConduct: `1. Wake up at 4:30 AM daily
2. No processed sugar or seed oils
3. Minimum 5L water daily
4. Train twice daily (AM cardio/PM weights)
5. No porn or meaningless stimulation
6. Cold showers only
7. Daily reflection and planning`,
  },
  focusMode: {
    phoneLockTimer: "30 min",
    appWhitelist: [],
  },
};

// Deep merge utility function (for combining defaultAppData with savedData)
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

const mergeDeep = (target, source) => {
  let output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

export const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [appData, setAppData] = useState(defaultAppData);
  const [loading, setLoading] = useState(true); // Initial state: app is loading
  const [user, setUser] = useState(null); // Firebase authenticated user object
  const [userId, setUserId] = useState(null); // User ID for Firestore path
  const [isAuthReady, setIsAuthReady] = useState(false); // Tracks if initial auth state has been checked

  // --- Firebase Authentication State Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const currentUserId = currentUser.uid;
        setUserId(currentUserId);
        console.log("Authenticated user ID:", currentUserId);

        // Fetch user-specific data from Firestore
        const userDocRef = doc(db, `artifacts/${appId}/users/${currentUserId}/userData/profile`);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            // Merge loaded data with defaults to ensure schema consistency
            setAppData(mergeDeep(JSON.parse(JSON.stringify(defaultAppData)), docSnap.data()));
            console.log("User data loaded from Firestore.");
          } else {
            console.log("No user data found in Firestore. Initializing with default.");
            const initialData = JSON.parse(JSON.stringify(defaultAppData)); // Deep copy default
            await setDoc(userDocRef, initialData); // Save initial data to Firestore
            setAppData(initialData);
          }
        } catch (e) {
          console.error("Error loading user data from Firestore:", e);
          setAppData(JSON.parse(JSON.stringify(defaultAppData))); // Fallback to default on error
        }
      } else {
        // If no user, reset to default app data and clear userId
        setUser(null);
        setUserId(null);
        setAppData(JSON.parse(JSON.stringify(defaultAppData))); // Deep copy default
        console.log("No user authenticated. Resetting app data.");
      }
      setIsAuthReady(true); // Authentication state has been determined
      setLoading(false); // Initial loading is complete
    });

    return () => unsubscribe(); // Cleanup auth listener on component unmount
  }, []); // Empty dependency array means this effect runs only once on mount

  // --- Data Persistence to Firestore (runs when appData or userId changes AFTER auth is ready) ---
  useEffect(() => {
    // Only attempt to save if auth state is ready AND a user is logged in
    if (isAuthReady && userId) {
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/userData/profile`);
      try {
        setDoc(userDocRef, appData); // Use setDoc to overwrite or create
        console.log("Attempting to save appData to Firestore:", appData);
      } catch (e) {
        console.error("Error saving user data to Firestore:", e);
      }
    }
  }, [appData, userId, isAuthReady]); // Dependencies: save when these change after auth check

  // Function to update nested state immutably
  const updateAppData = useCallback((path, value) => {
    setAppData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {}; // Ensure nested objects exist
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  }, []); // No dependencies for updateAppData as it always operates on prevData

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // New authentication functions
  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user.uid);
      return { success: true };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, error: error.message };
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user.uid);
      return { success: true };
    } catch (error) {
      console.error("Error logging in user:", error);
      return { success: false, error: error.message };
    }
  };

  // Display a loading screen until authentication state is determined and initial data is loaded
  if (loading || !isAuthReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading Demon Protocol...</Text>
      </View>
    );
  }

  return (
    <FirebaseContext.Provider value={{
      appData,
      updateAppData,
      user,
      userId,
      handleLogout,
      handleRegister,
      handleLogin,
      auth,
      db,
      isAuthReady, // Provide auth readiness status
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 20,
    marginTop: 10,
  },
});