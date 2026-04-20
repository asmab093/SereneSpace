// Social / Connection
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from 'react-native-progress';
import QuestionnaireNavButton from "../components/QuestionnaireNavButton";

const CheckMoodIcon = require("../assets/CheckMoodIcon.png");
const screenWidth = Dimensions.get('window').width;

const Questionnaire6 = ({ navigation, route }) => {
  const { q1, q2, q3, q4, q5 } = route.params;
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleNext = () => {
    if (selectedAnswer !== null) {
      navigation.navigate("Questionnaire7", { q1, q2, q3, q4, q5, q6: selectedAnswer });
    } else {
      Alert.alert("Selection Required", "Please select an option.");
    }
  };

  return (
    <LinearGradient colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressHeader}>
          <Progress.Bar 
            progress={0.83} 
            width={screenWidth * 0.8} 
            color="#7E57C2" 
            unfilledColor="rgba(255, 255, 255, 0.3)" 
            borderWidth={2} 
            height={16} 
            borderRadius={10} 
            borderColor="#FFFFFF" 
          />
        </View>

        <Image source={CheckMoodIcon} style={styles.headerIllustration} resizeMode="contain" />
        <Text style={styles.screenTitle}>Almost there!</Text>
        
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>Q6. I felt connected to and supported by others.</Text>
          <View style={styles.optionsContainer}>
             {[-2, -1, 0, 1, 2].map((val) => (
               <TouchableOpacity 
                  key={val} 
                  style={[styles.option, selectedAnswer === val && styles.selectedOption]} 
                  onPress={() => setSelectedAnswer(val)}
               >
                 <Text style={[styles.optionText, selectedAnswer === val && styles.selectedOptionText]}>
                    {val === -2 ? "🔮 Strongly Disagree" : val === 2 ? "🔮 Strongly Agree" : val === -1 ? "🔮 Slightly Disagree" : val === 1 ? "🔮 Slightly Agree" : "🔮 Neutral"}
                 </Text>
               </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomButtons}>
          <QuestionnaireNavButton title="Prev" onPress={() => navigation.goBack()} type="prev" />
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
    paddingTop: 50, // ✅ Increased to 50 to safely clear the notch/status bar
    paddingBottom: 40 
  },
  progressHeader: { 
    marginTop: 15, // ✅ Set to 0 since paddingTop now handles the spacing
    marginBottom: 15 
  },
  headerIllustration: { width: "70%", height: 130, marginBottom: 10 },
  screenTitle: { 
    fontSize: 22, 
    color: "#512DA8", 
    fontFamily: "Quicksand-Bold", 
    marginBottom: 20 // ✅ Slightly tightened to save space
  },
  questionCard: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 15, 
    padding: 20, 
    width: "100%", 
    elevation: 3 
  },
  questionText: { fontSize: 16, color: "#333", fontFamily: "Quicksand-SemiBold", marginBottom: 20 },
  optionsContainer: { width: "100%" },
  option: { 
    padding: 10, 
    borderRadius: 10, 
    backgroundColor: "#F8F9FE", 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: "#E8E3F9" 
  },
  selectedOption: { backgroundColor: "#E8E3F9", borderColor: "#7E57C2" },
  optionText: { fontSize: 14, color: "#555", fontFamily: "Quicksand-Medium" },
  selectedOptionText: { color: "#512DA8", fontFamily: "Quicksand-Bold" },
  
  bottomButtons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    width: "95%", 
    marginTop: 30, // ✅ Tightened up
    paddingBottom: 10 
  },
  loaderContainer: { width: 100, alignItems: "center" } // Only used in Q7, but harmless to have in all
});

export default Questionnaire6;