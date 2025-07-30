// src/components/AppContent.js
import React, { useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';

import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faTachometerAlt,
  faFire,
  faUtensils,
  faDumbbell,
  faTint,
  faCoffee,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

import { useFirebase } from '../context/FirebaseContext';

const AppContent = () => {
  const { appData, updateAppData } = useFirebase();

  const themeColors = {
    dark: {
      background: '#1a1a2e',
      cardBg: '#16213e',
      text: '#ffffff',
      secondaryText: '#a0aec0',
      accent: '#e94560',
      progressBg: '#2c3e50',
      progressFill: '#e94560',
      navBg: '#10101a',
    },
    inferno: {
      background: '#0f3460',
      cardBg: '#16213e',
      text: '#ffffff',
      secondaryText: '#a0aec0',
      accent: '#e94560',
      progressBg: '#2c3e50',
      progressFill: '#e94560',
      navBg: '#10101a',
    },
  };

  const currentTheme =
    appData?.settings?.theme === 'dark' ? themeColors.dark : themeColors.inferno;

  // Health calculations
  const calculateBMI = (weightKg, heightCm) => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    if (isNaN(w) || isNaN(h) || h === 0) return 'N/A';
    const heightM = h / 100;
    return (w / (heightM * heightM)).toFixed(2);
  };

  const getBMICategory = (bmi) => {
    const num = parseFloat(bmi);
    if (isNaN(num)) return '';
    if (num < 18.5) return 'Underweight';
    if (num >= 18.5 && num <= 24.9) return 'Normal weight';
    if (num >= 25 && num <= 29.9) return 'Overweight';
    return 'Obese';
  };

  const calculateBMR = (weightKg, heightCm, age, gender) => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    const a = parseInt(age);
    if (isNaN(w) || isNaN(h) || isNaN(a) || !gender) return 'N/A';
    if (gender.toLowerCase() === 'male') {
      return Math.round(9.99 * w + 6.25 * h - 4.92 * a + 5);
    }
    if (gender.toLowerCase() === 'female') {
      return Math.round(9.99 * w + 6.25 * h - 4.92 * a - 161);
    }
    return 'N/A';
  };

  const calculateTDEE = (bmr, activityLevel) => {
    const activity = parseFloat(activityLevel);
    if (bmr === 'N/A' || isNaN(activity)) return 'N/A';
    return Math.round(bmr * activity);
  };

  useEffect(() => {
    if (appData?.settings?.profile) {
      const profile = appData.settings.profile;
      console.log('Current Profile Data in DashboardSection:', profile);
      console.log('BMI:', calculateBMI(profile.weightKg, profile.heightCm));
      console.log(
        'BMR:',
        calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender)
      );
      console.log(
        'TDEE:',
        calculateTDEE(
          calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender),
          profile.activityLevel
        )
      );

      console.log('Historical Weights:', appData?.bodyMetrics?.weight);
      console.log('Historical Labels:', appData?.bodyMetrics?.labels);
    }
  }, [appData?.settings?.profile, appData?.bodyMetrics?.weight, appData?.bodyMetrics?.labels]);

  const DashboardSection = () => {
    const profile = appData?.settings?.profile || {};
    const appCalories = appData?.calories || {};
    const appWorkouts = appData?.workouts || {};
    const appSteps = appData?.steps || {};
    const appHydration = appData?.hydration || {};
    const appMoodFocus = appData?.moodFocus ?? 50;
    const appMoodNote = appData?.moodNote || '';
    const appStreak = appData?.streak ?? 0;

    const tdee = calculateTDEE(
      calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender),
      profile.activityLevel
    );
    const caloriesOut = tdee !== 'N/A' ? tdee : 0;
    const caloriesDeficit =
      caloriesOut !== 'N/A' ? caloriesOut - (appCalories.in || 0) : 'N/A';

    const bmiValue = calculateBMI(profile.weightKg, profile.heightCm);
    const bmiCategory = getBMICategory(bmiValue);

    const stepsProgressWidth =
      ((appSteps.current || 0) / (appSteps.target || 1)) * 100;
    const hydrationProgressWidth =
      ((appHydration.waterLiters || 0) / (appHydration.waterTarget || 1)) * 100;

    return (
      <ScrollView contentContainerStyle={styles.sectionContent}>
        {/* Home Dashboard Title */}
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          <FontAwesomeIcon
            icon={faTachometerAlt}
            size={24}
            color={currentTheme.text}
            style={styles.sectionTitleIcon}
          />
          Home Dashboard
        </Text>

        <View style={styles.gridContainer}>
          {/* Demon Score Card */}
          <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
                Demon Score
              </Text>
              <Text
                style={[styles.demonRedText, styles.cardValue]}
              >{`${appData?.demonScore ?? 0}%`}</Text>
            </View>
            <View
              style={[styles.progressBar, { backgroundColor: currentTheme.progressBg }]}
            >
              <View
                style={[
                  styles.progressFill,
                  { width: `${appData?.demonScore ?? 0}%`, backgroundColor: currentTheme.accent },
                ]}
              />
            </View>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>
                Today
              </Text>
              <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>
                Weekly: {appData?.demonScoreWeeklyChange || '0%'}
              </Text>
            </View>
          </View>

          {/* Calories Card */}
          <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Calories</Text>
            <View style={styles.calorieRow}>
              <Text style={[styles.cardText, { color: currentTheme.text }]}>
                In: {appCalories.in ?? 0}
              </Text>
              <Text style={[styles.cardText, { color: currentTheme.text }]}>
                Out: {caloriesOut}
              </Text>
            </View>
            <View
              style={[styles.progressBar, { backgroundColor: currentTheme.progressBg }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((appCalories.in || 0) / (appCalories.targetIn || 1)) * 100}%`,
                    backgroundColor: '#3498db',
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.cardSmallText,
                { textAlign: 'right', marginTop: 5, color: currentTheme.secondaryText },
              ]}
            >
              Deficit: {caloriesDeficit}
            </Text>
          </View>

          {/* Workout Summary Card */}
          <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Workout Summary</Text>
            <View style={styles.workoutSummaryRow}>
              <View>
                <Text
                  style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}
                >
                  {appWorkouts?.am?.type || 'N/A'}
                </Text>
                <Text style={[styles.cardText, { color: currentTheme.text }]}>
                  {appWorkouts?.am?.details || 'No AM workout logged'}
                </Text>
              </View>
              <View>
                <Text
                  style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}
                >
                  {appWorkouts?.pm?.type || 'N/A'}
                </Text>
                <Text style={[styles.cardText, { color: currentTheme.text }]}>
                  {appWorkouts?.pm?.details || 'No PM workout logged'}
                </Text>
              </View>
            </View>
          </View>

          {/* Steps & Hydration Card */}
          <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
            <View style={styles.stepsHydrationRow}>
              <View>
                <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Steps</Text>
                <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                  {appSteps.current ?? 0}{' '}
                  <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>
                    /{(appSteps.target ?? 0) / 1000}k
                  </Text>
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Hydration</Text>
                <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                  {(appHydration.waterLiters ?? 0).toFixed(1)}L{' '}
                  <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>
                    /{(appHydration.waterTarget ?? 0).toFixed(1)}L
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.progressBarsRow}>
              <View
                style={[
                  styles.progressBar,
                  { flex: 1, marginRight: 5, backgroundColor: currentTheme.progressBg },
                ]}
              >
                <View
                  style={[styles.progressFill, { width: `${stepsProgressWidth}%`, backgroundColor: '#2ecc71' }]}
                />
              </View>
              <View style={[styles.progressBar, { flex: 1, backgroundColor: currentTheme.progressBg }]}>
                <View
                  style={[styles.progressFill, { width: `${hydrationProgressWidth}%`, backgroundColor: '#3498db' }]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Body Mass Index (BMI)</Text>
            <Text style={[styles.cardValue, { color: currentTheme.text }]}>{bmiValue}</Text>
            <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>{bmiCategory}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Basal Metabolic Rate (BMR)</Text>
            <Text style={[styles.cardValue, { color: currentTheme.text }]}>
              {calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender)} kcal/day
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Total Daily Energy Expenditure (TDEE)</Text>
            <Text style={[styles.cardValue, { color: currentTheme.text }]}>{caloriesOut} kcal/day</Text>
          </View>
        </View>

        <View style={[styles.card, { width: '100%', backgroundColor: currentTheme.cardBg }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Mood & Focus Meter</Text>
          <View style={styles.moodLabels}>
            <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>😔 Weak</Text>
            <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>😐 Neutral</Text>
            <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>😤 Focused</Text>
            <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>😈 Demon Mode</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={appMoodFocus}
            onValueChange={(value) => updateAppData(['moodFocus'], value)}
            minimumTrackTintColor={currentTheme.accent}
            maximumTrackTintColor={currentTheme.progressBg}
            thumbTintColor={currentTheme.accent}
          />
          <TextInput
            style={[styles.textInput, { marginTop: 10, backgroundColor: currentTheme.progressBg, color: currentTheme.text }]}
            value={appMoodNote}
            onChangeText={(text) => updateAppData(['moodNote'], text)}
            placeholder="Add a note for your mood/focus..."
            placeholderTextColor={currentTheme.secondaryText}
          />
        </View>

        <View style={[styles.card, { width: '100%', backgroundColor: currentTheme.cardBg }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Current Streak: {appStreak} days</Text>
          <View style={styles.streakBarContainer}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.streakBarSegment,
                  {
                    backgroundColor:
                      i < (appStreak ?? 0) ? '#2ecc71' : currentTheme.progressBg,
                    marginRight: i < 19 ? 3 : 0, // spacing between streak bars
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <DashboardSection />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  sectionContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleIcon: {
    marginRight: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    width: '48%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#ffffff',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  demonRedText: {
    color: '#e94560',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#2c3e50',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  cardSmallText: {
    fontSize: 12,
    color: '#a0aec0',
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffff',
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  workoutSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepsHydrationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressBarsRow: {
    flexDirection: 'row',
  },
  moodLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  textInput: {
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 5,
    backgroundColor: '#2c3e50',
    color: '#ffffff',
  },
  streakBarContainer: {
    flexDirection: 'row',
    marginTop: 10,
    height: 15,
  },
  streakBarSegment: {
    flex: 1,
    borderRadius: 3,
    height: '100%',
  },
});

export default AppContent;
