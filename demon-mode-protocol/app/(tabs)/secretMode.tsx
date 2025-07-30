// app/(tabs)/secretMode.tsx
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Modal, Pressable, Platform } from 'react-native';
import { useFirebase } from '../../src/context/FirebaseContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faLock, faSkull, faMobileAlt, faList, faTimes, faPlay, faPause, faPlus, faTrash,
} from '@fortawesome/free-solid-svg-icons';

// Removed PanicModal component definition from here.
// It is now managed centrally in src/components/SharedModals.js

export default function SecretModeScreen() {
  const { appData, updateAppData } = useFirebase();
  // Removed local panicModalVisible and isAudioPlaying states.
  // These should be managed by the parent layout and passed to SharedModals.
  const [newAppWhitelistInput, setNewAppWhitelistInput] = useState('');

  // Safely determine current theme, with a fallback to 'dark'
  const currentTheme = appData?.settings?.theme === 'dark' ? {
    background: '#1a1a2e',
    text: '#ffffff',
    cardBg: '#16213e',
    progressBg: '#2c3e50',
    secondaryText: '#a0aec0',
    accent: '#e94560',
  } : {
    background: '#0f3460',
    text: '#ffffff',
    cardBg: '#16213e',
    progressBg: '#2c3e50',
    secondaryText: '#a0aec0',
    accent: '#e94560',
  };

  const handleAddAppToWhitelist = () => {
    // Access appWhitelist safely
    const currentWhitelist = appData?.focusMode?.appWhitelist || [];
    if (newAppWhitelistInput.trim() && !currentWhitelist.includes(newAppWhitelistInput.trim())) {
      updateAppData(['focusMode', 'appWhitelist'], [...currentWhitelist, newAppWhitelistInput.trim()]);
      setNewAppWhitelistInput('');
    }
  };

  const handleRemoveAppFromWhitelist = (index) => {
    // Access appWhitelist safely
    const currentWhitelist = appData?.focusMode?.appWhitelist || [];
    const updatedWhitelist = currentWhitelist.filter((_, i) => i !== index);
    updateAppData(['focusMode', 'appWhitelist'], updatedWhitelist);
  };

  // IMPORTANT: The Panic Button here no longer directly controls a local modal.
  // It should likely trigger a state change in the parent layout (app/(tabs)/_layout.tsx)
  // that then makes the SharedModals' PanicModal visible.
  // For this, you would pass `setPanicModalVisible` as a prop to SecretModeScreen from its parent.
  // For now, I'm removing the `onPress` to avoid a crash, assuming the functionality needs to be re-wired.
  // If you intend for this button to trigger the *centralized* PanicModal,
  // SecretModeScreen needs to receive `setPanicModalVisible` as a prop from `app/(tabs)/_layout.tsx`.
  // Example:
  // In app/(tabs)/_layout.tsx: <Tabs.Screen name="secretMode" options={{...}} initialParams={{ setPanicModalVisible }} />
  // In SecretModeScreen: const { setPanicModalVisible } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <ScrollView contentContainerStyle={styles.sectionContent}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          <FontAwesomeIcon icon={faLock} size={24} color={currentTheme.text} /> Secret Mode
        </Text>

        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          {/* Emergency Demon Activation / Panic Button */}
          <View style={styles.panicButtonContainer}>
            <View style={[styles.panicIconCircle, { backgroundColor: currentTheme.accent }]}>
              <FontAwesomeIcon icon={faSkull} size={40} color={currentTheme.text} />
            </View>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Emergency Demon Activation</Text>
            <Text style={[styles.cardText, { color: currentTheme.secondaryText }]}>For when weakness tries to creep in</Text>
            {/* The onPress handler needs to call the setPanicModalVisible prop from the parent */}
            <TouchableOpacity style={[styles.panicButton, { backgroundColor: currentTheme.accent }]}
              // onPress={() => setPanicModalVisible(true)} // This line would only work if setPanicModalVisible was a prop
            >
              <Text style={styles.panicButtonText}>PANIC BUTTON</Text>
            </TouchableOpacity>
          </View>

          {/* Focus Mode */}
          <View style={[styles.focusModeSection, { backgroundColor: currentTheme.progressBg }]}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
              <FontAwesomeIcon icon={faMobileAlt} size={18} color={currentTheme.text} /> Focus Mode
            </Text>
            <View style={styles.settingRow}>
              <Text style={[styles.cardText, { color: currentTheme.text }]}>Phone Lock Timer</Text>
              {/* Access phoneLockTimer safely */}
              <Text style={[styles.cardText, { color: currentTheme.text }]}>
                {appData?.focusMode?.phoneLockTimer || 'N/A'}
              </Text>
            </View>
          </View>

          {/* App Whitelist */}
          <View style={[styles.appWhitelistSection, { backgroundColor: currentTheme.progressBg }]}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
              <FontAwesomeIcon icon={faList} size={18} color={currentTheme.text} /> App Whitelist
            </Text>
            <View style={styles.whitelistItemsContainer}>
              {/* Access appWhitelist safely and provide a fallback if empty */}
              {(appData?.focusMode?.appWhitelist || []).map((app, index) => (
                <View key={index} style={styles.whitelistItem}>
                  <Text style={[styles.cardText, { color: currentTheme.text }]}>{app}</Text>
                  <TouchableOpacity onPress={() => handleRemoveAppFromWhitelist(index)}>
                    <FontAwesomeIcon icon={faTrash} size={16} color="#e94560" />
                  </TouchableOpacity>
                </View>
              ))}
              {(appData?.focusMode?.appWhitelist?.length === 0) && (
                <Text style={[styles.cardText, { color: currentTheme.secondaryText, textAlign: 'center', marginTop: 10 }]}>
                  No apps whitelisted yet.
                </Text>
              )}
            </View>
            <TextInput
              style={[styles.textInput, { backgroundColor: currentTheme.cardBg, color: currentTheme.text }]}
              placeholder="Add app to whitelist"
              placeholderTextColor={currentTheme.secondaryText}
              value={newAppWhitelistInput}
              onChangeText={setNewAppWhitelistInput}
              onSubmitEditing={handleAddAppToWhitelist}
            />
            <TouchableOpacity style={[styles.addButton, { backgroundColor: currentTheme.cardBg }]} onPress={handleAddAppToWhitelist}>
              <FontAwesomeIcon icon={faPlus} size={16} color={currentTheme.text} />
              <Text style={styles.addButtonText}>Add App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Panic Modal is NOT rendered here directly anymore.
          It is rendered by SharedModals in app/(tabs)/_layout.tsx */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  sectionContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  panicButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  panicIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  panicButton: {
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  panicButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  focusModeSection: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4a5e',
  },
  appWhitelistSection: {
    borderRadius: 10,
    padding: 15,
  },
  whitelistItemsContainer: {
    marginBottom: 10,
  },
  whitelistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4a5e',
  },
  textInput: {
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  addButton: {
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
// Removed modalStyles definition from here. It is now centralized in SharedModals.js