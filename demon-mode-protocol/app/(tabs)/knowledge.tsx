// app/(tabs)/knowledge.tsx
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useFirebase } from '../../src/context/FirebaseContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBook, faDumbbell, faUtensils, faBrain, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

export default function KnowledgeScreen() {
  const { appData, updateAppData } = useFirebase();

  // Safely initialize codeOfConductText with a fallback if appData or settings are not ready
  const [codeOfConductText, setCodeOfConductText] = useState(
    appData?.settings?.codeOfConduct || // Use optional chaining
    `1. Wake up at 4:30 AM daily
2. No processed sugar or seed oils
3. Minimum 5L water daily
4. Train twice daily (AM cardio/PM weights)
5. No porn or meaningless stimulation
6. Cold showers only
7. Daily reflection and planning`
  );

  // Safely determine current theme, with a fallback to 'dark' if appData is not fully loaded yet
  const currentTheme = appData?.settings?.theme === 'dark' ? { // Use optional chaining
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

  const handleCodeOfConductSave = () => {
    updateAppData(['settings', 'codeOfConduct'], codeOfConductText);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <ScrollView contentContainerStyle={styles.sectionContent}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          <FontAwesomeIcon icon={faBook} size={24} color={currentTheme.text} /> Knowledge & Fuel
        </Text>

        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          <View style={styles.gridContainer}>
            {/* Workout Guides */}
            <View style={[styles.knowledgeCategoryCard, { backgroundColor: currentTheme.progressBg }]}>
              <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>
                <FontAwesomeIcon icon={faDumbbell} size={16} color={currentTheme.text} /> Workout Guides
              </Text>
              <View style={styles.knowledgeList}>
                <View style={styles.knowledgeListItem}>
                  <FontAwesomeIcon icon={faChevronRight} size={10} color={currentTheme.accent} style={{ marginRight: 8 }} />
                  <Text style={[styles.cardText, { color: currentTheme.text }]}>Gym Training Splits</Text>
                </View>
                <View style={styles.knowledgeListItem}>
                  <FontAwesomeIcon icon={faChevronRight} size={10} color={currentTheme.accent} style={{ marginRight: 8 }} />
                  <Text style={[styles.cardText, { color: currentTheme.text }]}>Resistance Band Routines</Text>
                </View>
                <View style={styles.knowledgeListItem}>
                  <FontAwesomeIcon icon={faChevronRight} size={10} color={currentTheme.accent} style={{ marginRight: 8 }} />
                  <Text style={[styles.cardText, { color: currentTheme.text }]}>Calisthenics Progressions</Text>
                </View>
              </View>
            </View>

            {/* Nutrition Principles */}
            <View style={[styles.knowledgeCategoryCard, { backgroundColor: currentTheme.progressBg }]}>
              <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>
                <FontAwesomeIcon icon={faUtensils} size={16} color={currentTheme.text} /> Nutrition Principles
              </Text>
              <View style={styles.knowledgeList}>
                <View style={styles.knowledgeListItem}>
                  <FontAwesomeIcon icon={faChevronRight} size={10} color={currentTheme.accent} style={{ marginRight: 8 }} />
                  <Text style={[styles.cardText, { color: currentTheme.text }]}>Macro Calculations</Text>
                </View>
                <View style={styles.knowledgeListItem}>
                  <FontAwesomeIcon icon={faChevronRight} size={10} color={currentTheme.accent} style={{ marginRight: 8 }} />
                  <Text style={[styles.cardText, { color: currentTheme.text }]}>Meal Timing Strategies</Text>
                </View>
                <View style={styles.knowledgeListItem}>
                  <FontAwesomeIcon icon={faChevronRight} size={10} color={currentTheme.accent} style={{ marginRight: 8 }} />
                  <Text style={[styles.cardText, { color: currentTheme.text }]}>Supplement Guide</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Mental Warfare Strategies */}
          <View style={[styles.knowledgeSectionCard, { backgroundColor: currentTheme.progressBg }]}>
            <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>
              <FontAwesomeIcon icon={faBrain} size={16} color={currentTheme.text} /> Mental Warfare Strategies
            </Text>
            <View style={styles.strategyItem}>
              <FontAwesomeIcon icon={faChevronRight} size={10} color={currentTheme.accent} style={{ marginRight: 8, marginTop: 5 }} />
              <Text style={[styles.cardText, { color: currentTheme.text }]}>
                <Text style={styles.boldText}>Dopamine Control:</Text> Techniques to reset your reward system and build discipline.
              </Text>
            </View>
            <View style={styles.strategyItem}>
              <FontAwesomeIcon icon={faChevronRight} size={10} color={currentTheme.accent} style={{ marginRight: 8, marginTop: 5 }} />
              <Text style={[styles.cardText, { color: currentTheme.text }]}>
                <Text style={styles.boldText}>Monk Mode:</Text> Deep focus protocols for maximum productivity.
              </Text>
            </View>
          </View>

          {/* Demon Mode Code of Conduct */}
          <View style={[styles.knowledgeSectionCard, { backgroundColor: currentTheme.progressBg }]}>
            <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>Demon Mode Code of Conduct</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: currentTheme.cardBg, color: currentTheme.text }]}
              value={codeOfConductText}
              onChangeText={setCodeOfConductText}
              onBlur={handleCodeOfConductSave} // Save when input loses focus
              multiline
              placeholder="Write your code of conduct here..."
              placeholderTextColor={currentTheme.secondaryText}
            />
          </View>
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  knowledgeCategoryCard: {
    width: '48%',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  knowledgeSectionCard: {
    width: '100%',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardSubTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  knowledgeList: {
    // No specific style needed, just a container for list items
  },
  knowledgeListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1, // Allows text to wrap
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  textArea: {
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    height: 120,
    textAlignVertical: 'top',
  },
});