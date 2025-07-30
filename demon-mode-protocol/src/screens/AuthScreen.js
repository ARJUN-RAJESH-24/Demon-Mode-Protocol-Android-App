// src/screens/AuthScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFire, faEnvelope, faLock, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useFirebase } from '../context/FirebaseContext';

const AuthScreen = () => {
  const { handleLogin, handleRegister, isAuthReady, appData } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Define a simple default theme for the loading state or fallback
  const staticThemeColors = {
    background: '#1a1a2e',
    accent: '#e94560',
    text: '#ffffff',
  };

  // Handle the initial loading state gracefully *before* using appData
  if (!isAuthReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: staticThemeColors.background }]}>
        <ActivityIndicator size="large" color={staticThemeColors.accent} />
        <Text style={[styles.loadingText, { color: staticThemeColors.text }]}>Initializing Firebase...</Text>
      </View>
    );
  }

  // Now that isAuthReady is true, we can safely access appData.settings.theme
  const currentTheme = appData.settings.theme === 'dark' ? {
    background: '#1a1a2e',
    cardBg: '#16213e',
    text: '#ffffff',
    secondaryText: '#a0aec0',
    accent: '#e94560', // demon-red
    inputBg: '#2c3e50',
  } : {
    background: '#0f3460', // Inferno background color
    cardBg: '#16213e',
    text: '#ffffff',
    secondaryText: '#a0aec0',
    accent: '#e94560',
    inputBg: '#2c3e50',
  };

  const handleAuthAction = async () => {
    setLoading(true);
    setError('');
    let result;
    if (isRegistering) {
      result = await handleRegister(email, password);
    } else {
      result = await handleLogin(email, password);
    }

    if (!result.success) {
      setError(result.error || 'An unknown error occurred.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <FontAwesomeIcon icon={faFire} size={60} color={currentTheme.accent} style={styles.logoIcon} />
          <Text style={[styles.title, { color: currentTheme.text }]}>DEMON MODE PROTOCOL</Text>
          <Text style={[styles.subtitle, { color: currentTheme.secondaryText }]}>
            {isRegistering ? 'Create Your Demon Account' : 'Unleash Your Inner Demon'}
          </Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: currentTheme.cardBg }]}>
          <View style={styles.inputGroup}>
            <FontAwesomeIcon icon={faEnvelope} size={20} color={currentTheme.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.inputBg, color: currentTheme.text }]}
              placeholder="Email"
              placeholderTextColor={currentTheme.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesomeIcon icon={faLock} size={20} color={currentTheme.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.inputBg, color: currentTheme.text }]}
              placeholder="Password"
              placeholderTextColor={currentTheme.secondaryText}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: currentTheme.accent }]}
            onPress={handleAuthAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <FontAwesomeIcon icon={isRegistering ? faUserPlus : faSignInAlt} size={20} color="#ffffff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>
                  {isRegistering ? 'Register' : 'Login'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleAuthButton}
            onPress={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            <Text style={[styles.toggleAuthButtonText, { color: currentTheme.secondaryText }]}>
              {isRegistering ? 'Already have an account? Login' : 'New here? Create an Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  authButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleAuthButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleAuthButtonText: {
    fontSize: 14,
  },
});

export default AuthScreen;