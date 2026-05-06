// Energy/Motivation dimension
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QuestionnaireNavButton from "../components/QuestionnaireNavButton";

const CheckMoodIcon = require("../assets/CheckMoodIcon.png");
const CrossIcon = require("../assets/CrossIcon.png");
const screenWidth = Dimensions.get('window').width;

const Questionnaire1 = ({ navigation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Unified answer options for all questionnaire screens
  const answerOptions = [
    { label: "🔮 Strongly Disagree", value: -2 },
    { label: "🔮 Slightly Disagree", value: -1 },
    { label: "🔮 Neutral", value: 0 },
    { label: "🔮 Slightly Agree", value: 1 },
    { label: "🔮 Strongly Agree", value: 2 },
  ];

  const handleNext = () => {
    if (selectedAnswer !== null) {
      // Navigating to Q2 with the first score passed in params
      navigation.navigate("Questionnaire2", { q1: selectedAnswer });
    } else {
      Alert.alert("Selection Required", "Please select an option.");
    }
  };

  return (
    <LinearGradient colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Top Bar with "X" aligned to the left */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.closeButton}>
            <Image source={CrossIcon} style={styles.closeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <Image source={CheckMoodIcon} style={styles.headerIllustration} resizeMode="contain" />
        <Text style={styles.screenTitle}>Check your Mood</Text>
        
        <View style={styles.questionCard}>
          {/* UPDATED QUESTION: Energy Dimension */}
          <Text style={styles.questionText}>
            Q1. I felt energetic and motivated to complete my tasks today.
          </Text>
          <View style={styles.optionsContainer}>
            {/* ✅ Replaced OptionButton with standardized TouchableOpacity mapping */}
            {answerOptions.map((option) => (
              <TouchableOpacity 
                key={option.value} 
                style={[styles.option, selectedAnswer === option.value && styles.selectedOption]} 
                onPress={() => setSelectedAnswer(option.value)}
              >
                <Text style={[styles.optionText, selectedAnswer === option.value && styles.selectedOptionText]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomButtons}>
          <QuestionnaireNavButton title="Skip" onPress={() => navigation.navigate("Home")} type="skip" />
          <QuestionnaireNavButton title="Next" onPress={handleNext} type="next" />
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
    paddingTop: 30, 
    paddingBottom: 40 
  },
  topBar: { 
    flexDirection: "row", 
    justifyContent: "flex-start", 
    width: "100%", 
    marginBottom: 10, 
    marginTop: 0 // ✅ Set to 0 since paddingTop now handles the spacing
  },
  closeButton: { padding: 5, paddingLeft: 0,},
  closeIcon: { width: 25, height: 25, tintColor: "#555" },
  headerIllustration: { width: "70%", height: 130, marginBottom: 10 },
  screenTitle: { 
    fontSize: 22, 
    color: "#512DA8", 
    fontFamily: "Quicksand-Bold", 
    marginBottom: 30 
  },
  questionCard: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 15, 
    padding: 20, 
    width: "100%", 
    elevation: 3, 
    marginTop: 10 
  },
  questionText: { 
    fontSize: 16, 
    color: "#333", 
    fontFamily: "Quicksand-SemiBold", 
    marginBottom: 20 
  },
  
  // ✅ Added standardized option styles from Q2-Q7 to ensure left-alignment and purple highlights
  optionsContainer: { width: "100%" },
  option: { 
    padding: 10, 
    borderRadius: 10, 
    backgroundColor: "#F8F9FE", 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: "#E8E3F9",
    alignItems: "flex-start" // Ensures left alignment
  },
  selectedOption: { backgroundColor: "#E8E3F9", borderColor: "#7E57C2" },
  optionText: { fontSize: 14, color: "#555", fontFamily: "Quicksand-Medium" },
  selectedOptionText: { color: "#512DA8", fontFamily: "Quicksand-Bold" },
  
  bottomButtons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "95%", 
    marginTop: 40 
  },
});

export default Questionnaire1;