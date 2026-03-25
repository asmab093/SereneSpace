import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import OptionButton from "../components/OptionButton";
import QuestionnaireNavButton from "../components/QuestionnaireNavButton";

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const CrossIcon = require("../assets/CrossIcon.png");
const GlobeIcon = require("../assets/GlobeIcon.png");
// We reuse the CheckMoodIcon image for the illustration area if needed

// 💡 Props: onGoBack (to Q2), onNext (to Q4), and onExit (to Home)
const Questionnaire3 = ({ navigation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const answerOptions = [
    { label: "Strongly Disagree", value: 1 },
    { label: "Slightly Disagree", value: 2 },
    { label: "Neutral", value: 3 },
    { label: "Slightly Agree", value: 4 },
    { label: "Strongly Agree", value: 5 },
  ];

 const handleNext = () => {
     if (selectedAnswer !== null) {
       console.log(`Answer selected: ${selectedAnswer}. Proceeding to Q2.`);
       navigation.navigate("Questionnaire4");
     } else {
       Alert.alert(
         "Selection Required",
         "Please select an option before proceeding.",
       );
     }
   };
 
  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.closeButton}>
            <Image
              source={CrossIcon}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ width: 25 }} />
        </View>

        <View style={styles.progressArea}>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={["#7E57C2", "#4A3A99"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.progressBarFill, { width: "50%" }]} // ⬅️ PROGRESS INCREASED to 40%
            />
          </View>
        </View>


        <Text style={styles.feedbackText}>Great focus, keep going!💪</Text>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            Q3. I felt cheerful, optimistic, and in a good mood today.
          </Text>

          <View style={styles.optionsContainer}>
            {answerOptions.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                value={option.value}
                iconSource={GlobeIcon}
                selectedValue={selectedAnswer}
                onSelect={setSelectedAnswer}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomButtons}>
          <QuestionnaireNavButton
            title="Prev"
            onPress={() => navigation.goBack()} // Navigate back to Q2
            type="prev"
          />
          <QuestionnaireNavButton
            title="Next"
            onPress={handleNext} // Navigate to Q4
            type="next"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: "flex-start",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 10,
  },
  closeButton: { padding: 5 },
  closeIcon: { width: 25, height: 25, tintColor: "#555" },

  // --- Progress Bar Styles ---
  progressArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 45,
    marginTop: 35,
    paddingHorizontal: 15,
  },
  progressBarContainer: {
    width: "100%",
    height: 20, // Adjusted height for sleekness
    backgroundColor: "#EBEBEB",
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },

  // --- Header & Text Styles ---
  feedbackText: {
    fontSize: 22,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginBottom: 30,
    alignSelf: "center",
  },

  // --- Question Card Styles ---
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 60,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
    marginBottom: 20,
  },
  optionsContainer: {},

  // --- Bottom Navigation ---
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
});

export default Questionnaire3;
