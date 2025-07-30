// app/(tabs)/progressAnalytics.tsx
import React from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { useFirebase } from '../../src/context/FirebaseContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartLine, faTrophy, faMedal } from '@fortawesome/free-solid-svg-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ProgressAnalyticsScreen() {
  const { appData } = useFirebase();

  // Safely determine current theme, with a fallback to 'dark'
  const currentTheme = appData?.settings?.theme === 'dark' ? {
    background: '#1a1a2e',
    text: '#ffffff',
    cardBg: '#16213e',
    progressBg: '#2c3e50',
    secondaryText: '#a0aec0',
    chartGridColor: 'rgba(255, 255, 255, 0.1)',
    chartLabelColor: '#fff',
    accent: '#e94560', // Ensure accent color is available for chart propsForDots
  } : {
    background: '#0f3460',
    text: '#ffffff',
    cardBg: '#16213e',
    progressBg: '#2c3e50',
    secondaryText: '#a0aec0',
    chartGridColor: 'rgba(255, 255, 255, 0.1)',
    chartLabelColor: '#fff',
    accent: '#e94560', // Ensure accent color is available
  };

  // Safely get body metrics data with fallbacks
  const bodyMetricsLabels = appData?.bodyMetrics?.labels?.length > 0 ? appData.bodyMetrics.labels : ['No Data'];
  const bodyMetricsWeight = appData?.bodyMetrics?.weight?.length > 0 ? appData.bodyMetrics.weight : [0];
  const bodyMetricsBodyFat = appData?.bodyMetrics?.bodyFat?.length > 0 ? appData.bodyMetrics.bodyFat : [0];

  // Safely get running progress data with fallbacks
  const runningProgressLabels = appData?.runningProgress?.labels?.length > 0 ? appData.runningProgress.labels : ['No Data'];
  const runningProgressDistances = appData?.runningProgress?.distances?.length > 0 ? appData.runningProgress.distances : [0];
  const runningProgressPaces = appData?.runningProgress?.paces?.length > 0 ? appData.runningProgress.paces : [0];

  // Chart Data Configuration
  const weightChartData = {
    labels: bodyMetricsLabels,
    datasets: [
      {
        data: bodyMetricsWeight,
        color: (opacity = 1) => `rgba(233, 69, 96, ${opacity})`, // demon-red
        strokeWidth: 2,
      },
      {
        data: bodyMetricsBodyFat,
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // blue
        strokeWidth: 2,
      },
    ],
    legend: ["Weight (kg)", "Body Fat (%)"]
  };

  const runningChartData = {
    labels: runningProgressLabels,
    datasets: [
      {
        data: runningProgressDistances,
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // blue
        strokeWidth: 2,
      },
      {
        data: runningProgressPaces,
        color: (opacity = 1) => `rgba(233, 69, 96, ${opacity})`, // demon-red
        strokeWidth: 2,
      },
    ],
    legend: ["Distance (km)", "Avg Pace (min/km)"]
  };

  const chartConfig = {
    backgroundColor: currentTheme.cardBg,
    backgroundGradientFrom: currentTheme.cardBg,
    backgroundGradientTo: currentTheme.cardBg,
    decimalPlaces: 1, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => currentTheme.chartLabelColor,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: currentTheme.accent,
    },
    fillShadowGradientFrom: currentTheme.accent,
    fillShadowGradientTo: currentTheme.cardBg,
    fillShadowGradientFromOpacity: 0.3,
    fillShadowGradientToOpacity: 0.1,
    barPercentage: 0.5,
  };

  // Safely calculate weight and body fat change
  const weightLength = appData?.bodyMetrics?.weight?.length || 0;
  const lastWeight = weightLength > 0 ? appData.bodyMetrics.weight[weightLength - 1] : undefined;
  const firstWeight = weightLength > 0 ? appData.bodyMetrics.weight[0] : undefined;
  const weightChange = (weightLength > 1 && typeof firstWeight === 'number' && typeof lastWeight === 'number')
    ? (firstWeight - lastWeight).toFixed(1)
    : 'N/A';

  const bodyFatLength = appData?.bodyMetrics?.bodyFat?.length || 0;
  const lastBodyFat = bodyFatLength > 0 ? appData.bodyMetrics.bodyFat[bodyFatLength - 1] : undefined;
  const firstBodyFat = bodyFatLength > 0 ? appData.bodyMetrics.bodyFat[0] : undefined;
  const bodyFatChange = (bodyFatLength > 1 && typeof firstBodyFat === 'number' && typeof lastBodyFat === 'number')
    ? (firstBodyFat - lastBodyFat).toFixed(1)
    : 'N/A';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <ScrollView contentContainerStyle={styles.sectionContent}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          <FontAwesomeIcon icon={faChartLine} size={24} color={currentTheme.text} /> Progress & Analytics
        </Text>

        {/* Body Metrics */}
        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Body Metrics</Text>
            {/* Time period buttons could go here */}
          </View>

          <View style={styles.gridContainer}>
            <View style={[styles.metricBox, { backgroundColor: currentTheme.progressBg }]}>
              <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>Weight</Text>
              <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                {typeof lastWeight === 'number' ? lastWeight : 'N/A'}<Text style={{ fontSize: 16 }}>kg</Text>
              </Text>
              <Text style={[styles.cardSmallText, styles.demonRedText]}>
                {weightLength > 1 ? `▼ ${weightChange}kg (30d)` : 'N/A'}
              </Text>
            </View>
            <View style={[styles.metricBox, { backgroundColor: currentTheme.progressBg }]}>
              <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>Body Fat %</Text>
              <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                {typeof lastBodyFat === 'number' ? lastBodyFat : 'N/A'}<Text style={{ fontSize: 16 }}>%</Text>
              </Text>
              <Text style={[styles.cardSmallText, { color: '#2ecc71' }]}>
                {bodyFatLength > 1 ? `▼ ${bodyFatChange}% (30d)` : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={weightChartData}
              width={screenWidth - 60} // card padding (15*2) + section padding (15*2)
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

          <View style={styles.muscleFrequencyContainer}>
            <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>Muscle Group Frequency (Last 30d)</Text>
            <View>
              <View style={styles.frequencyItem}>
                <Text style={[styles.cardText, { color: currentTheme.text }]}>Chest</Text>
                <Text style={[styles.cardText, { color: currentTheme.text }]}>
                  {appData?.muscleFrequency?.chest ?? 0} sessions
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, {
                  width: `${((appData?.muscleFrequency?.chest ?? 0) / (appData?.muscleFrequency?.maxSessions || 1)) * 100}%`,
                  backgroundColor: '#e94560'
                }]} />
              </View>
            </View>
            <View>
              <View style={styles.frequencyItem}>
                <Text style={[styles.cardText, { color: currentTheme.text }]}>Back</Text>
                <Text style={[styles.cardText, { color: currentTheme.text }]}>
                  {appData?.muscleFrequency?.back ?? 0} sessions
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, {
                  width: `${((appData?.muscleFrequency?.back ?? 0) / (appData?.muscleFrequency?.maxSessions || 1)) * 100}%`,
                  backgroundColor: '#3498db'
                }]} />
              </View>
            </View>
            <View>
              <View style={styles.frequencyItem}>
                <Text style={[styles.cardText, { color: currentTheme.text }]}>Legs</Text>
                <Text style={[styles.cardText, { color: currentTheme.text }]}>
                  {appData?.muscleFrequency?.legs ?? 0} sessions
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, {
                  width: `${((appData?.muscleFrequency?.legs ?? 0) / (appData?.muscleFrequency?.maxSessions || 1)) * 100}%`,
                  backgroundColor: '#9b59b6'
                }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Running Progress */}
        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>Running Progress</Text>
          <View style={styles.gridContainer}>
            <View style={[styles.metricBox, { backgroundColor: currentTheme.progressBg }]}>
              <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>VO2 Max</Text>
              <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                {appData?.runningProgress?.vo2max || 'N/A'}
              </Text>
            </View>
            <View style={[styles.metricBox, { backgroundColor: currentTheme.progressBg }]}>
              <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>5k PB</Text>
              <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                {appData?.runningProgress?.fivekPB || 'N/A'}
              </Text>
            </View>
            <View style={[styles.metricBox, { backgroundColor: currentTheme.progressBg }]}>
              <Text style={[styles.cardSmallText, { color: currentTheme.secondaryText }]}>Monthly km</Text>
              <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                {appData?.runningProgress?.monthlyKm ?? 0}
              </Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <BarChart
              data={runningChartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              verticalLabelRotation={30}
            />
          </View>
        </View>

        {/* Achievements */}
        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
            <FontAwesomeIcon icon={faTrophy} size={18} color={currentTheme.text} /> Achievements
          </Text>
          <View style={styles.demonEvolutionContainer}>
            <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>Demon Evolution</Text>
            <View style={styles.rowCentered}>
              <Text style={[styles.cardSmallText, { marginRight: 10, color: currentTheme.secondaryText }]}>
                {appData?.demonEvolution?.rank || 'Novice'}
              </Text>
              <View style={styles.progressBarWide}>
                <View style={[styles.progressFill, {
                  width: `${appData?.demonEvolution?.progress ?? 0}%`,
                  backgroundColor: '#f1c40f'
                }]} />
              </View>
            </View>
          </View>

          <View style={styles.achievementsGrid}>
            {appData?.achievements?.map(ach => (
              // Ensure ach.icon is a valid FontAwesome icon object
              <View key={ach.id} style={[styles.achievementCard, { backgroundColor: currentTheme.progressBg }]}>
                <View style={[styles.achievementIconCircle, { backgroundColor: ach.color || currentTheme.accent }]}>
                  {/* Check if ach.icon is a valid object before passing to FontAwesomeIcon */}
                  {ach.icon && <FontAwesomeIcon icon={ach.icon} size={24} color={currentTheme.text} />}
                </View>
                <Text style={[styles.achievementTitle, { color: currentTheme.text }]}>{ach.title}</Text>
                {ach.progress < 100 ? (
                  <>
                    <Text style={[styles.achievementDetails, { color: currentTheme.secondaryText }]}>{ach.details}</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, {
                        width: `${ach.progress ?? 0}%`, // Default to 0 if progress is null/undefined
                        backgroundColor: ach.color || currentTheme.accent
                      }]} />
                    </View>
                  </>
                ) : (
                  <Text style={[styles.achievementDetails, { color: currentTheme.secondaryText }]}>
                    Unlocked: {ach.unlockedDate || 'N/A'}
                  </Text>
                )}
              </View>
            )) || <Text style={[styles.cardText, { color: currentTheme.secondaryText }]}>No achievements to display.</Text>}
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: '#e94560' }]}>
            <FontAwesomeIcon icon={faMedal} size={16} color={currentTheme.text} />
            <Text style={styles.addButtonText}>View All Achievements</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardSubTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricBox: {
    borderRadius: 10,
    padding: 10,
    width: '48%',
    marginBottom: 10,
  },
  cardSmallText: {
    fontSize: 12,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  demonRedText: {
    color: '#e94560',
  },
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden', // Ensures chart respects border radius
    backgroundColor: '#2c3e50', // Background for the chart area
    marginBottom: 20,
  },
  muscleFrequencyContainer: {
    marginBottom: 20,
  },
  frequencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2c3e50',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  demonEvolutionContainer: {
    marginBottom: 20,
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarWide: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2c3e50',
    overflow: 'hidden',
    marginLeft: 10,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  achievementCard: {
    width: '48%', // Two columns
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  achievementIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementDetails: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 5,
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