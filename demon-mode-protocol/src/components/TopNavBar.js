// src/components/TopNavBar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFire, faCog, faUser, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useFirebase } from '../context/FirebaseContext';

const TopNavBar = ({ currentTheme, setSettingsModalVisible }) => {
  const { user, userId, handleLogout, auth } = useFirebase();

  return (
    <View style={[styles.navBar, { backgroundColor: currentTheme.accent }]}>
      <View style={styles.navTitleContainer}>
        <FontAwesomeIcon icon={faFire} size={24} color={currentTheme.text} />
        <Text style={styles.navTitle}>DEMON MODE PROTOCOL</Text>
      </View>
      <View style={styles.navIcons}>
        {userId && (
          <Text style={styles.userIdDisplay}>ID: {userId}</Text>
        )}
        <TouchableOpacity style={styles.navIconBtn} onPress={() => setSettingsModalVisible(true)}>
          <FontAwesomeIcon icon={faCog} size={20} color={currentTheme.text} />
        </TouchableOpacity>
        {user ? (
          <TouchableOpacity style={styles.navIconBtn} onPress={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} size={20} color={currentTheme.text} />
          </TouchableOpacity>
        ) : (
          // This sign-in is typically handled by AuthScreen.
          // Keeping an empty View here to prevent layout issues if no user icon is desired.
          <View />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  navTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  navIconBtn: {
    padding: 5,
    borderRadius: 20,
  },
  userIdDisplay: {
    color: '#ffffff',
    fontSize: 12,
    marginRight: 10,
  },
});

export default TopNavBar;