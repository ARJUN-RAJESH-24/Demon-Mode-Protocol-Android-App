// app/_layout.tsx
import { Stack } from 'expo-router';
import { FirebaseProvider, useFirebase } from '../src/context/FirebaseContext';
import AuthScreen from '../src/screens/AuthScreen';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// This component will conditionally render AuthScreen or the main app tabs
function AppContentRouter() {
  const { user, isAuthReady } = useFirebase();

  if (!isAuthReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading App...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// This is the root layout for your app.
// It wraps all your routes with the FirebaseProvider.
export default function RootLayout() {
  return (
    <FirebaseProvider>
      <AppContentRouter />
    </FirebaseProvider>
  );
}

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