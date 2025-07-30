// app/(tabs)/protocolLogger.tsx
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Switch, Modal, Pressable, Platform } from 'react-native';
import { useFirebase } from '../../src/context/FirebaseContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCalendarAlt, faUtensils, faPlus, faDumbbell, faTint, faCoffee,
  faShieldAlt, faTimes, faEdit, faTrash, faWater,
} from '@fortawesome/free-solid-svg-icons';

// Import modalStyles from SharedModals.js instead of defining it here
import { modalStyles } from '../../src/components/SharedModals';

// Modal for adding/editing meals
const MealModal = ({ visible, onClose, onSave, meal = null }) => {
  const [time, setTime] = useState(meal?.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
  const [calories, setCalories] = useState(String(meal?.calories || 0));
  const [protein, setProtein] = useState(String(meal?.protein || 0));
  const [carbs, setCarbs] = useState(String(meal?.carbs || 0));
  const [fats, setFats] = useState(String(meal?.fats || 0));
  const [description, setDescription] = useState(meal?.description || "");

  const handleSave = () => {
    onSave({
      id: meal?.id || Date.now(),
      time,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0,
      description,
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>{meal ? 'Edit Meal' : 'Add New Meal'}</Text>
            <Pressable onPress={onClose}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
            </Pressable>
          </View>
          <ScrollView style={modalStyles.modalBody}>
            <Text style={modalStyles.inputLabel}>Time</Text>
            <TextInput style={modalStyles.input} value={time} onChangeText={setTime} placeholder="e.g., 08:00 AM" placeholderTextColor="#a0aec0" />

            <Text style={modalStyles.inputLabel}>Calories</Text>
            <TextInput style={modalStyles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" placeholder="kcal" placeholderTextColor="#a0aec0" />

            <View style={modalStyles.macroInputs}>
              <View style={modalStyles.macroInputGroup}>
                <Text style={modalStyles.inputLabel}>Protein (g)</Text>
                <TextInput style={modalStyles.input} value={protein} onChangeText={setProtein} keyboardType="numeric" placeholder="g" placeholderTextColor="#a0aec0" />
              </View>
              <View style={modalStyles.macroInputGroup}>
                <Text style={modalStyles.inputLabel}>Carbs (g)</Text>
                <TextInput style={modalStyles.input} value={carbs} onChangeText={setCarbs} keyboardType="numeric" placeholder="g" placeholderTextColor="#a0aec0" />
              </View>
              <View style={modalStyles.macroInputGroup}>
                <Text style={modalStyles.inputLabel}>Fats (g)</Text>
                <TextInput style={modalStyles.input} value={fats} onChangeText={setFats} keyboardType="numeric" placeholder="g" placeholderTextColor="#a0aec0" />
              </View>
            </View>

            <Text style={modalStyles.inputLabel}>Description</Text>
            <TextInput style={[modalStyles.input, modalStyles.textArea]} value={description} onChangeText={setDescription} multiline placeholder="e.g., 4 eggs, 100g oats" placeholderTextColor="#a0aec0" />

            <TouchableOpacity style={modalStyles.saveButton} onPress={handleSave}>
              <Text style={modalStyles.saveButtonText}>Save Meal</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Modal for adding/editing workouts
const WorkoutModal = ({ visible, onClose, onSave, workout = null }) => {
  const [type, setType] = useState(workout?.type || "");
  const [entries, setEntries] = useState(workout?.entries.join('\n') || "");

  const handleSave = () => {
    onSave({
      id: workout?.id || Date.now(),
      type,
      entries: entries.split('\n').filter(e => e.trim() !== ''),
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>{workout ? 'Edit Workout' : 'Add New Workout'}</Text>
            <Pressable onPress={onClose}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
            </Pressable>
          </View>
          <ScrollView style={modalStyles.modalBody}>
            <Text style={modalStyles.inputLabel}>Workout Type</Text>
            <TextInput style={modalStyles.input} value={type} onChangeText={setType} placeholder="e.g., Morning Run, Chest & Triceps" placeholderTextColor="#a0aec0" />

            <Text style={modalStyles.inputLabel}>Entries (one per line)</Text>
            <TextInput style={[modalStyles.input, modalStyles.textArea]} value={entries} onChangeText={setEntries} multiline placeholder="e.g., Bench Press: 4x8 @80kg" placeholderTextColor="#a0aec0" />

            <TouchableOpacity style={modalStyles.saveButton} onPress={handleSave}>
              <Text style={modalStyles.saveButtonText}>Save Workout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};


export default function ProtocolLoggerScreen() { // Corrected: Exporting ProtocolLoggerScreen
  const { appData, updateAppData } = useFirebase();
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [newSupplementInput, setNewSupplementInput] = useState('');

  const currentTheme = appData.settings.theme === 'dark' ? {
    background: '#1a1a2e',
    text: '#ffffff',
    cardBg: '#16213e',
    progressBg: '#2c3e50',
    secondaryText: '#a0aec0',
  } : {
    background: '#0f3460',
    text: '#ffffff',
    cardBg: '#16213e',
    progressBg: '#2c3e50',
    secondaryText: '#a0aec0',
  };

  // Nutrition Log Handlers
  const handleAddMeal = () => {
    setCurrentMeal(null);
    setMealModalVisible(true);
  };

  const handleEditMeal = (meal) => {
    setCurrentMeal(meal);
    setMealModalVisible(true);
  };

  const handleSaveMeal = (savedMeal) => {
    let updatedMeals;
    if (appData.nutritionLog.some(m => m.id === savedMeal.id)) {
      updatedMeals = appData.nutritionLog.map(m => m.id === savedMeal.id ? savedMeal : m);
    } else {
      updatedMeals = [...appData.nutritionLog, savedMeal];
    }
    updateAppData(['nutritionLog'], updatedMeals);
    // Update total calories in
    const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    updateAppData(['calories', 'in'], totalCalories);
  };

  const handleRemoveMeal = (id) => {
    const updatedMeals = appData.nutritionLog.filter(meal => meal.id !== id);
    updateAppData(['nutritionLog'], updatedMeals);
    const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    updateAppData(['calories', 'in'], totalCalories);
  };

  const handleOmadToggle = (value) => {
    // For simplicity, OMAD status is not stored per meal, but as a general setting
    // You might want to adjust this based on how OMAD affects your calculations
    // For now, it just updates the toggle state.
    // updateAppData(['nutritionLog', 'omad'], value); // This path doesn't exist.
    // This would ideally be a separate setting in appData.settings.
  };

  // Supplement Handlers
  const handleAddSupplement = () => {
    if (newSupplementInput.trim() && !appData.supplements.includes(newSupplementInput.trim())) {
      updateAppData(['supplements'], [...appData.supplements, newSupplementInput.trim()]);
      setNewSupplementInput('');
    }
  };

  const handleRemoveSupplement = (index) => {
    const updatedSupplements = appData.supplements.filter((_, i) => i !== index);
    updateAppData(['supplements'], updatedSupplements);
  };

  // Workout Log Handlers
  const handleAddWorkout = () => {
    setCurrentWorkout(null);
    setWorkoutModalVisible(true);
  };

  const handleEditWorkout = (workout) => {
    setCurrentWorkout(workout);
    setWorkoutModalVisible(true);
  };

  const handleSaveWorkout = (savedWorkout) => {
    let updatedWorkouts;
    if (appData.workoutLog.some(w => w.id === savedWorkout.id)) {
      updatedWorkouts = appData.workoutLog.map(w => w.id === savedWorkout.id ? savedWorkout : w);
    } else {
      updatedWorkouts = [...appData.workoutLog, savedWorkout];
    }
    updateAppData(['workoutLog'], updatedWorkouts);
    // You might want to update workout summary on dashboard here
  };

  const handleRemoveWorkout = (id) => {
    const updatedWorkouts = appData.workoutLog.filter(workout => workout.id !== id);
    updateAppData(['workoutLog'], updatedWorkouts);
  };

  // Hydration Handlers
  const handleAddWater = (amount) => {
    const newWater = Math.min(appData.hydration.waterTarget, appData.hydration.waterLiters + amount);
    updateAppData(['hydration', 'waterLiters'], newWater);
  };

  const handleAddCoffee = () => {
    const newCoffee = Math.min(appData.hydration.coffeeTarget, appData.hydration.coffeeCups + 1);
    updateAppData(['hydration', 'coffeeCups'], newCoffee);
  };

  // Discipline & Compliance Handlers
  const handleDisciplineToggle = (key, value) => {
    updateAppData(['disciplineChecks', key], value);
  };

  const handleRemarksChange = (text) => {
    updateAppData(['remarks'], text);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <ScrollView contentContainerStyle={styles.sectionContent}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          <FontAwesomeIcon icon={faCalendarAlt} size={24} color={currentTheme.text} /> Daily Protocol Logger
        </Text>

        {/* Nutrition Log */}
        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
              <FontAwesomeIcon icon={faUtensils} size={18} color={currentTheme.text} /> Nutrition Log
            </Text>
            <View style={styles.rowCentered}>
              <Text style={[styles.cardSmallText, { marginRight: 10, color: currentTheme.secondaryText }]}>OMAD:</Text>
              <Switch
                trackColor={{ false: currentTheme.progressBg, true: '#2ecc71' }}
                thumbColor={Platform.OS === 'android' ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={currentTheme.progressBg}
                onValueChange={handleOmadToggle}
                value={false} // Placeholder, as OMAD is not dynamically managed per meal
              />
            </View>
          </View>

          <View style={styles.logContainer}>
            {appData.nutritionLog.map(meal => (
              <View key={meal.id} style={styles.logEntry}>
                <View>
                  <Text style={[styles.logEntryTitle, { color: currentTheme.text }]}>Meal - {meal.time}</Text>
                  <Text style={[styles.logEntryDetails, { color: currentTheme.secondaryText }]}>
                    {meal.calories} kcal | P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g
                  </Text>
                  <Text style={[styles.logEntryDescription, { color: currentTheme.text }]}>{meal.description}</Text>
                </View>
                <View style={styles.logEntryActions}>
                  <TouchableOpacity onPress={() => handleEditMeal(meal)}>
                    <FontAwesomeIcon icon={faEdit} size={18} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveMeal(meal.id)}>
                    <FontAwesomeIcon icon={faTrash} size={18} color="#e94560" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.supplementContainer}>
            <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>Supplements</Text>
            <View style={styles.supplementTags}>
              {appData.supplements.map((sup, index) => (
                <View key={index} style={styles.supplementTag}>
                  <Text style={[styles.supplementText, { color: currentTheme.text }]}>{sup}</Text>
                  <TouchableOpacity onPress={() => handleRemoveSupplement(index)}>
                    <FontAwesomeIcon icon={faTimes} size={12} color="#e94560" style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TextInput
              style={[styles.textInput, { backgroundColor: currentTheme.progressBg, color: currentTheme.text }]}
              placeholder="Add new supplement (e.g., Vitamin D)"
              placeholderTextColor={currentTheme.secondaryText}
              value={newSupplementInput}
              onChangeText={setNewSupplementInput}
              onSubmitEditing={handleAddSupplement}
            />
            <TouchableOpacity style={[styles.addButton, { backgroundColor: currentTheme.progressBg }]} onPress={handleAddSupplement}>
              <FontAwesomeIcon icon={faPlus} size={16} color={currentTheme.text} />
              <Text style={styles.addButtonText}>Add Supplement</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.addButton, { backgroundColor: '#e94560' }]} onPress={handleAddMeal}>
            <FontAwesomeIcon icon={faPlus} size={16} color={currentTheme.text} />
            <Text style={styles.addButtonText}>Add Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Workout Log */}
        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
            <FontAwesomeIcon icon={faDumbbell} size={18} color={currentTheme.text} /> Workout Log
          </Text>
          <View style={styles.logContainer}>
            {appData.workoutLog.map(workout => (
              <View key={workout.id} style={styles.logEntry}>
                <View>
                  <Text style={[styles.logEntryTitle, { color: currentTheme.text }]}>{workout.type}</Text>
                  {workout.entries.map((entry, idx) => (
                    <Text key={idx} style={[styles.logEntryDetails, { color: currentTheme.secondaryText }]}>{entry}</Text>
                  ))}
                </View>
                <View style={styles.logEntryActions}>
                  <TouchableOpacity onPress={() => handleEditWorkout(workout)}>
                    <FontAwesomeIcon icon={faEdit} size={18} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveWorkout(workout.id)}>
                    <FontAwesomeIcon icon={faTrash} size={18} color="#e94560" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: '#e94560' }]} onPress={handleAddWorkout}>
            <FontAwesomeIcon icon={faPlus} size={16} color={currentTheme.text} />
            <Text style={styles.addButtonText}>Add Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Hydration Tracker */}
        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
            <FontAwesomeIcon icon={faTint} size={18} color={currentTheme.text} /> Hydration Tracker
          </Text>
          <View style={styles.hydrationSection}>
            <View>
              <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>Water Intake</Text>
              <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                {appData.hydration.waterLiters.toFixed(1)}<Text style={{ fontSize: 16 }}>/{appData.hydration.waterTarget.toFixed(1)}L</Text>
              </Text>
            </View>
            <View style={styles.waterDropContainer}>
              {Array.from({ length: 5 }).map((_, i) => {
                const literPerDrop = appData.hydration.waterTarget / 5;
                return (
                  <View
                    key={i}
                    style={[
                      styles.waterDrop,
                      { backgroundColor: i * literPerDrop < appData.hydration.waterLiters ? '#3498db' : currentTheme.progressBg },
                      i * literPerDrop < appData.hydration.waterLiters ? {} : { opacity: 0.3 }
                    ]}
                  >
                    {i * literPerDrop < appData.hydration.waterLiters && <View style={styles.waterDropHighlight} />}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.hydrationSection}>
            <View>
              <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>Caffeine Intake</Text>
              <Text style={[styles.cardValue, { color: currentTheme.text }]}>
                {appData.hydration.coffeeCups}<Text style={{ fontSize: 16 }}>/{appData.hydration.coffeeTarget} cups</Text>
              </Text>
            </View>
            <View style={styles.coffeeIconContainer}>
              {Array.from({ length: appData.hydration.coffeeTarget }).map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faCoffee}
                  size={24}
                  color={i < appData.hydration.coffeeCups ? currentTheme.secondaryText : '#555'}
                />
              ))}
            </View>
          </View>

          <View style={styles.hydrationButtons}>
            <TouchableOpacity style={[styles.hydrationButton, { backgroundColor: currentTheme.progressBg }]} onPress={() => handleAddWater(0.25)}>
              <FontAwesomeIcon icon={faPlus} size={16} color={currentTheme.text} />
              <Text style={styles.hydrationButtonText}>250ml</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.hydrationButton, { backgroundColor: currentTheme.progressBg }]} onPress={() => handleAddWater(0.5)}>
              <FontAwesomeIcon icon={faPlus} size={16} color={currentTheme.text} />
              <Text style={styles.hydrationButtonText}>500ml</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.hydrationButton, { backgroundColor: currentTheme.progressBg }]} onPress={handleAddCoffee}>
              <FontAwesomeIcon icon={faCoffee} size={16} color={currentTheme.text} />
              <Text style={styles.hydrationButtonText}>+1</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Discipline & Compliance */}
        <View style={[styles.card, { backgroundColor: currentTheme.cardBg }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
            <FontAwesomeIcon icon={faShieldAlt} size={18} color={currentTheme.text} /> Discipline & Compliance
          </Text>
          <View style={styles.disciplineChecksContainer}>
            {Object.keys(appData.disciplineChecks).map((key) => (
              <View key={key} style={modalStyles.settingRow}> {/* Use modalStyles.settingRow now from import */}
                <Text style={[modalStyles.settingText, { color: currentTheme.text }]}> {/* Use modalStyles.settingText now from import */}
                  ✅ {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
                <Switch
                  trackColor={{ false: currentTheme.progressBg, true: '#2ecc71' }}
                  thumbColor={Platform.OS === 'android' ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={currentTheme.progressBg}
                  onValueChange={(value) => handleDisciplineToggle(key, value)}
                  value={appData.disciplineChecks[key]}
                />
              </View>
            ))}
          </View>
          <View style={styles.remarksContainer}>
            <Text style={[styles.cardSubTitle, { color: currentTheme.text }]}>Remarks</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: currentTheme.progressBg, color: currentTheme.text, height: 80, textAlignVertical: 'top' }]}
              placeholder="Add remarks (e.g., 'Pain in delt', 'Slight fatigue', 'Felt godlike')"
              placeholderTextColor={currentTheme.secondaryText}
              value={appData.remarks}
              onChangeText={handleRemarksChange}
              multiline
            />
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <MealModal
        visible={mealModalVisible}
        onClose={() => setMealModalVisible(false)}
        onSave={handleSaveMeal}
        meal={currentMeal}
      />
      <WorkoutModal
        visible={workoutModalVisible}
        onClose={() => setWorkoutModalVisible(false)}
        onSave={handleSaveWorkout}
        workout={currentWorkout}
      />
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
    width: '100%', // Changed to 100% for single column layout, adjust as needed
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
    color: '#ffffff',
    marginBottom: 5,
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
    backgroundColor: '#2c3e50',
    overflow: 'hidden', // Ensures fill stays within bounds
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
    color: '#ffffff',
    lineHeight: 20,
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
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  streakBarContainer: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 10,
    height: 15,
  },
  streakBarSegment: {
    flex: 1,
    borderRadius: 3,
  },
  exampleLogEntry: {
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  exampleLogTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  exampleLogDetails: {
    fontSize: 14,
    color: '#a0aec0',
  },
  addButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 15,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricBox: {
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 10,
    width: '48%',
  },
  knowledgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  knowledgeIcon: {
    marginRight: 10,
  },
  knowledgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  panicButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  panicIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  panicButton: {
    backgroundColor: '#e94560',
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
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  appWhitelistSection: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 10,
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
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#10101a',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  navTab: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  navTabText: {
    fontSize: 10,
    marginTop: 5,
  },
  logContainer: {
    marginBottom: 15,
  },
  logEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  logEntryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logEntryDetails: {
    fontSize: 14,
    color: '#a0aec0',
  },
  logEntryDescription: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 5,
  },
  logEntryActions: {
    flexDirection: 'row',
    gap: 15,
  },
  supplementContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#2c3e50',
  },
  cardSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  supplementTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  supplementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a4a5e',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  supplementText: {
    color: '#ffffff',
    fontSize: 13,
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hydrationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  waterDropContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  waterDrop: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterDropHighlight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  coffeeIconContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  hydrationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  hydrationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 8,
  },
  hydrationButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  disciplineChecksContainer: {
    marginBottom: 15,
  },
  remarksContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#2c3e50',
  },
});