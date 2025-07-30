// app/(tabs)/_layout.tsx
import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFire, faCalendarAlt, faChartLine, faBook, faLock } from '@fortawesome/free-solid-svg-icons';
import { useFirebase } from '../../src/context/FirebaseContext';
import { SafeAreaView, StyleSheet } from 'react-native';
import TopNavBar from '../../src/components/TopNavBar';
import SharedModals from '../../src/components/SharedModals';

export default function TabLayout() {
  const { appData } = useFirebase();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [panicModalVisible, setPanicModalVisible] = useState(false);

  // Safely determine current theme, with a fallback
  const currentTheme = appData?.settings?.theme === 'dark' ? { // Added optional chaining for appData.settings
    tabBarActiveTintColor: '#e94560',
    tabBarInactiveTintColor: '#a0aec0',
    tabBarStyle: { backgroundColor: '#10101a', borderTopWidth: 0, height: 60, paddingBottom: 5 },
    headerShown: false,
    background: '#1a1a2e',
  } : {
    tabBarActiveTintColor: '#e94560',
    tabBarInactiveTintColor: '#a0aec0',
    tabBarStyle: { backgroundColor: '#10101a', borderTopWidth: 0, height: 60, paddingBottom: 5 },
    headerShown: false,
    background: '#0f3460',
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <TopNavBar
        currentTheme={currentTheme}
        setSettingsModalVisible={setSettingsModalVisible}
        // If TopNavBar also needs to open the Panic Modal, uncomment and pass the prop:
        // setPanicModalVisible={setPanicModalVisible}
      />

      <Tabs screenOptions={currentTheme}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faFire} color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="protocolLogger"
          options={{
            title: 'Logger',
            tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faCalendarAlt} color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="progressAnalytics"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faChartLine} color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="knowledge"
          options={{
            title: 'Knowledge',
            tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faBook} color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="secretMode"
          options={{
            title: 'Secret',
            tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faLock} color={color} size={20} />,
          }}
          // Pass setPanicModalVisible as an initialParam to secretMode.tsx
          initialParams={{ setPanicModalVisible: setPanicModalVisible }}
        />
      </Tabs>

      <SharedModals
        settingsModalVisible={settingsModalVisible}
        setSettingsModalVisible={setSettingsModalVisible}
        panicModalVisible={panicModalVisible}
        setPanicModalVisible={setPanicModalVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});