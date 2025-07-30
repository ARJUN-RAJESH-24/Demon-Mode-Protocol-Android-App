// src/components/SharedModals.js
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Platform,
  Pressable,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faPlay, faPause, faSkull } from '@fortawesome/free-solid-svg-icons';
import { useFirebase } from '../context/FirebaseContext';

// Consolidated modal styles - NOW EXPORTED
export const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  settingsModalContainer: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContent: {
    padding: 15,
  },
  settingGroup: {
    marginBottom: 20,
  },
  settingGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: '#e94560',
  },
  themeButtonInactive: {
    backgroundColor: '#2c3e50',
  },
  themeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  settingText: {
    fontSize: 15,
    color: '#ffffff',
  },
  profileInputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    color: '#a0aec0',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#16213e',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  modalBody: {
    padding: 20,
  },
  input: {
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  macroInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  macroInputGroup: {
    width: '30%',
  },
  panicModalContainer: {
    width: '90%',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  panicIconCircleLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  panicTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  panicMessage: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
  },
  panicMantraContainer: {
    marginBottom: 25,
  },
  panicMantra: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  panicMantraAuthor: {
    fontSize: 12,
    textAlign: 'center',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  audioButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  returnButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  returnButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// --- Settings Modal Component ---
const SettingsModal = ({ visible, onClose, appData, updateAppData, currentTheme }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={modalStyles.modalOverlay}>
      <View style={[modalStyles.settingsModalContainer, { backgroundColor: currentTheme.cardBg }]}>
        <View style={modalStyles.modalHeader}>
          <Text style={modalStyles.modalTitle}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <FontAwesomeIcon icon={faTimes} size={20} color={currentTheme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={modalStyles.modalContent}>
          {/* Theme Settings */}
          <View style={modalStyles.settingGroup}>
            <Text style={modalStyles.settingGroupTitle}>Theme</Text>
            <View style={modalStyles.themeButtons}>
              <TouchableOpacity
                style={[
                  modalStyles.themeButton,
                  appData?.settings?.theme === 'dark' ? modalStyles.themeButtonActive : modalStyles.themeButtonInactive, // Added optional chaining
                ]}
                onPress={() => updateAppData(['settings', 'theme'], 'dark')}
              >
                <Text style={modalStyles.themeButtonText}>Dark Mode</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.themeButton,
                  appData?.settings?.theme === 'inferno' ? modalStyles.themeButtonActive : modalStyles.themeButtonInactive, // Added optional chaining
                ]}
                onPress={() => updateAppData(['settings', 'theme'], 'inferno')}
              >
                <Text style={modalStyles.themeButtonText}>Inferno Mode</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications */}
          <View style={modalStyles.settingGroup}>
            <Text style={modalStyles.settingGroupTitle}>Notifications</Text>
            <View style={modalStyles.settingRow}>
              <Text style={modalStyles.settingText}>Morning Demon Wake-up</Text>
              <Switch
                trackColor={{ false: currentTheme.progressBg, true: '#3498db' }}
                thumbColor={Platform.OS === 'android' ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={currentTheme.progressBg}
                onValueChange={(value) => updateAppData(['settings', 'notifications', 'morningWakeup'], value)}
                value={appData?.settings?.notifications?.morningWakeup ?? false} // Added optional chaining and nullish coalescing
              />
            </View>
            <View style={modalStyles.settingRow}>
              <Text style={modalStyles.settingText}>Workout Reminders</Text>
              <Switch
                trackColor={{ false: currentTheme.progressBg, true: '#3498db' }}
                thumbColor={Platform.OS === 'android' ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={currentTheme.progressBg}
                onValueChange={(value) => updateAppData(['settings', 'notifications', 'workoutReminders'], value)}
                value={appData?.settings?.notifications?.workoutReminders ?? false} // Added optional chaining and nullish coalescing
              />
            </View>
            <View style={modalStyles.settingRow}>
              <Text style={modalStyles.settingText}>Hydration Alerts</Text>
              <Switch
                trackColor={{ false: currentTheme.progressBg, true: '#3498db' }}
                thumbColor={Platform.OS === 'android' ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={currentTheme.progressBg}
                onValueChange={(value) => updateAppData(['settings', 'notifications', 'hydrationAlerts'], value)}
                value={appData?.settings?.notifications?.hydrationAlerts ?? false} // Added optional chaining and nullish coalescing
              />
            </View>
          </View>

          {/* Profile Settings */}
          <View style={modalStyles.settingGroup}>
            <Text style={modalStyles.settingGroupTitle}>Profile</Text>
            <View style={modalStyles.profileInputGroup}>
              <Text style={modalStyles.inputLabel}>Name</Text>
              <TextInput
                style={modalStyles.textInput}
                value={appData?.settings?.profile?.name || ''} // Added optional chaining and fallback
                onChangeText={(text) => updateAppData(['settings', 'profile', 'name'], text)}
                placeholder="Your Demon Name"
                placeholderTextColor={currentTheme.secondaryText}
              />
            </View>
            <View style={modalStyles.profileInputGroup}>
              <Text style={modalStyles.inputLabel}>Age</Text>
              <TextInput
                style={modalStyles.textInput}
                value={String(appData?.settings?.profile?.age ?? '')} // Added optional chaining and nullish coalescing
                onChangeText={(text) => updateAppData(['settings', 'profile', 'age'], parseInt(text) || null)}
                keyboardType="numeric"
                placeholder="Age"
                placeholderTextColor={currentTheme.secondaryText}
              />
            </View>
            <View style={modalStyles.profileInputGroup}>
              <Text style={modalStyles.inputLabel}>Gender</Text>
              <TextInput
                style={modalStyles.textInput}
                value={appData?.settings?.profile?.gender || ''} // Added optional chaining and fallback
                onChangeText={(text) => updateAppData(['settings', 'profile', 'gender'], text)}
                placeholder="Male/Female"
                placeholderTextColor={currentTheme.secondaryText}
              />
            </View>
            <View style={modalStyles.profileInputGroup}>
              <Text style={modalStyles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={modalStyles.textInput}
                value={String(appData?.settings?.profile?.heightCm ?? '')} // Added optional chaining and nullish coalescing
                onChangeText={(text) => updateAppData(['settings', 'profile', 'heightCm'], parseFloat(text) || null)}
                keyboardType="numeric"
                placeholder="Height in cm"
                placeholderTextColor={currentTheme.secondaryText}
              />
            </View>
            <View style={modalStyles.profileInputGroup}>
              <Text style={modalStyles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={modalStyles.textInput}
                value={String(appData?.settings?.profile?.weightKg ?? '')} // Added optional chaining and nullish coalescing
                onChangeText={(text) => {
                  const newWeight = parseFloat(text) || null;
                  updateAppData(['settings', 'profile', 'weightKg'], newWeight);
                  // Ensure bodyMetrics exists before trying to update
                  updateAppData(prevData => {
                    const updatedData = { ...prevData };
                    if (newWeight !== null && !isNaN(newWeight) && updatedData.bodyMetrics) {
                      const today = new Date();
                      const todayLabel = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      // Ensure bodyMetrics.labels and bodyMetrics.weight are arrays
                      updatedData.bodyMetrics.labels = updatedData.bodyMetrics.labels || [];
                      updatedData.bodyMetrics.weight = updatedData.bodyMetrics.weight || [];

                      const lastEntryLabel = updatedData.bodyMetrics.labels[updatedData.bodyMetrics.labels.length - 1];
                      if (lastEntryLabel === todayLabel) {
                        updatedData.bodyMetrics.weight[updatedData.bodyMetrics.weight.length - 1] = newWeight;
                      } else {
                        updatedData.bodyMetrics.weight.push(newWeight);
                        updatedData.bodyMetrics.labels.push(todayLabel);
                      }
                    }
                    return updatedData;
                  });
                }}
                keyboardType="numeric"
                placeholder="Weight in kg"
                placeholderTextColor={currentTheme.secondaryText}
              />
            </View>
            <View style={modalStyles.profileInputGroup}>
              <Text style={modalStyles.inputLabel}>Activity Level</Text>
              <TextInput
                style={modalStyles.textInput}
                value={String(appData?.settings?.profile?.activityLevel ?? '')} // Added optional chaining and nullish coalescing
                onChangeText={(text) => updateAppData(['settings', 'profile', 'activityLevel'], parseFloat(text) || null)}
                keyboardType="numeric"
                placeholder="e.g., 1.55 (Moderately Active)"
                placeholderTextColor={currentTheme.secondaryText}
              />
            </View>
            <View style={modalStyles.profileInputGroup}>
              <Text style={modalStyles.inputLabel}>Weight Goal</Text>
              <TextInput
                style={modalStyles.textInput}
                value={appData?.settings?.profile?.weightGoal || ''} // Added optional chaining and fallback
                onChangeText={(text) => updateAppData(['settings', 'profile', 'weightGoal'], text)}
                placeholder="e.g., 75kg (10% BF)"
                placeholderTextColor={currentTheme.secondaryText}
              />
            </View>
            <View style={modalStyles.profileInputGroup}>
              <Text style={modalStyles.inputLabel}>Daily Calorie Target (manual override)</Text>
              <TextInput
                style={modalStyles.textInput}
                value={String(appData?.settings?.profile?.calorieTarget ?? '')} // Added optional chaining and nullish coalescing
                onChangeText={(text) => updateAppData(['settings', 'profile', 'calorieTarget'], parseInt(text) || null)}
                keyboardType="numeric"
                placeholder="e.g., 1800"
                placeholderTextColor={currentTheme.secondaryText}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[modalStyles.saveButton, { backgroundColor: currentTheme.accent }]}
            onPress={onClose}
          >
            <Text style={modalStyles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

// --- Panic Modal Component ---
const PanicModal = ({ visible, onClose, isAudioPlaying, setIsAudioPlaying, currentTheme }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={modalStyles.modalOverlay}>
      <View style={[modalStyles.panicModalContainer, { backgroundColor: currentTheme.cardBg }]}>
        <View style={[modalStyles.panicIconCircleLarge, { backgroundColor: currentTheme.accent }]}>
          <FontAwesomeIcon icon={faSkull} size={50} color={currentTheme.text} />
        </View>
        <Text style={[modalStyles.panicTitle, { color: currentTheme.text }]}>DEMON ACTIVATED</Text>
        <Text style={[modalStyles.panicMessage, { color: currentTheme.secondaryText }]}>Weakness has been purged from your system.</Text>

        <View style={modalStyles.panicMantraContainer}>
          <Text style={[modalStyles.panicMantra, { color: currentTheme.text }]}>"THE PAIN YOU FEEL TODAY WILL BE THE STRENGTH YOU FEEL TOMORROW."</Text>
          <Text style={[modalStyles.panicMantraAuthor, { color: currentTheme.secondaryText }]}>- Demon Mode Mantra</Text>
        </View>

        {/* Audio playback is complex in RN without specific libraries.
            This is a placeholder for the UI, actual audio logic omitted for simplicity. */}
        <TouchableOpacity
          style={[modalStyles.audioButton, { backgroundColor: currentTheme.progressBg }]}
          onPress={() => setIsAudioPlaying(!isAudioPlaying)}
        >
          <FontAwesomeIcon icon={isAudioPlaying ? faPause : faPlay} size={16} color={currentTheme.text} />
          <Text style={[modalStyles.audioButtonText, { color: currentTheme.text }]}>{isAudioPlaying ? 'Pause Audio' : 'Play Motivation Audio'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[modalStyles.returnButton, { backgroundColor: currentTheme.accent }]}
          onPress={() => {
            onClose();
            setIsAudioPlaying(false);
          }}
        >
          <Text style={modalStyles.returnButtonText}>RETURN TO BATTLE</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// --- Main SharedModals Component ---
const SharedModals = ({
  settingsModalVisible,
  setSettingsModalVisible,
  panicModalVisible,
  setPanicModalVisible,
}) => {
  const { appData, updateAppData } = useFirebase();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // State for panic modal audio

  // Determine current theme based on appData
  const currentTheme = appData?.settings?.theme === 'dark' ? { // Added optional chaining
    background: '#1a1a2e',
    text: '#ffffff',
    cardBg: '#16213e',
    progressBg: '#2c3e50',
    secondaryText: '#a0aec0',
    accent: '#e94560', // Added accent color for buttons
  } : {
    background: '#0f3460',
    text: '#ffffff',
    cardBg: '#16213e',
    progressBg: '#2c3e50',
    secondaryText: '#a0aec0',
    accent: '#e94560', // Added accent color for buttons
  };

  return (
    <>
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        appData={appData}
        updateAppData={updateAppData}
        currentTheme={currentTheme}
      />
      <PanicModal
        visible={panicModalVisible}
        onClose={() => setPanicModalVisible(false)}
        isAudioPlaying={isAudioPlaying}
        setIsAudioPlaying={setIsAudioPlaying}
        currentTheme={currentTheme}
      />
    </>
  );
};

export default SharedModals;