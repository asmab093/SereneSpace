import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from 'react-native-progress';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from '../api/config';
import QuestionnaireNavButton from "../components/QuestionnaireNavButton";

const CheckMoodIcon = require("../assets/CheckMoodIcon.png");
const screenWidth = Dimensions.get('window').width;

const Questionnaire7 = ({ navigation, route }) => {
  const { q1, q2, q3, q4, q5, q6 } = route.params;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

 const handleSubmit = async () => {
    if (selectedAnswer === null) {
      return Alert.alert("Selection Required", "Please answer the final question.");
    }

    setLoading(true);

    // 1. Prepare the individual scores
    const s1 = Number(q1);
    const s2 = Number(q2);
    const s3 = Number(q3);
    const s4 = Number(q4);
    const s5 = Number(q5);
    const s6 = Number(q6);
    const s7 = Number(selectedAnswer);

    // 2. Calculate averageScore
    const totalScore = s1 + s2 + s3 + s4 + s5 + s6 + s7;
    const averageScore = totalScore / 7;

    // 3. Logic to determine finalMood string
    // This matches the categories you mentioned (Neutral, Sad / Low, etc.)
    let finalMood = "Neutral";
    if (averageScore > 1.0) {
      finalMood = "Happy / Content";
    } else if (averageScore > 0.3) {
      finalMood = "Happy / Content";
    } else if (averageScore >= -0.3) {
      finalMood = "Neutral";
    } else if (averageScore >= -1.0) {
      finalMood = "Sad / Low";
    } else {
      finalMood = "Tired / Exhausted";
    }

    // 4. Construct the Payload to match your Mood.js Schema exactly
    const payload = {
      scores: {
        q1: s1,
        q2: s2,
        q3: s3,
        q4: s4,
        q5: s5,
        q6: s6,
        q7: s7
      },
      averageScore: averageScore, 
      finalMood: finalMood        
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/mood/log`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend returns the created object on success
      if (response.data) {
        navigation.navigate("QuizComplete");
      }
    } catch (error) {
      console.error("Submission Error Details:", error.response?.data);
      Alert.alert("Submission Failed", "There was an error saving your mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressHeader}>
          <Progress.Bar progress={1.0} width={screenWidth * 0.8} color="#7E57C2" unfilledColor="rgba(255, 255, 255, 0.3)" borderWidth={2} height={16} borderRadius={10} borderColor="#FFFFFF" />
        </View>
        <Image source={CheckMoodIcon} style={styles.headerIllustration} resizeMode="contain" />
        <Text style={styles.screenTitle}>Final Step!</Text>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>Q7. I was patient and easily managed my frustrations.</Text>
          <View style={styles.optionsContainer}>
             {[-2, -1, 0, 1, 2].map((val) => (
               <TouchableOpacity key={val} activeOpacity={0.8} style={[styles.option, selectedAnswer === val && styles.selectedOption]} onPress={() => setSelectedAnswer(val)}>
                 <Text style={[styles.optionText, selectedAnswer === val && styles.selectedOptionText]}>
                    {val === -2 ? "Strongly Disagree" : val === 2 ? "Strongly Agree" : val === -1 ? "Slightly Disagree" : val === 1 ? "Slightly Agree" : "Neutral"}
                 </Text>
               </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.bottomButtons}>
          <QuestionnaireNavButton title="Prev" onPress={() => navigation.goBack()} type="prev" />
          {loading ? (
            <View style={styles.loaderContainer}><ActivityIndicator size="small" color="#7E57C2" /></View>
          ) : (
            <QuestionnaireNavButton title="Submit" onPress={handleSubmit} type="next" />
          )}
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
    paddingTop: 15, // ✅ Matches the new higher alignment
    paddingBottom: 40 // ✅ Guarantees the buttons never touch the screen edge
  },
  progressHeader: { 
    marginTop: 15, // ✅ REDUCED FROM 60! This was the culprit pushing buttons off screen.
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
  questionText: { fontSize: 18, color: "#333", fontFamily: "Quicksand-SemiBold", marginBottom: 20 },
  optionsContainer: { width: "100%" },
  option: { 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: "#F8F9FE", 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: "#E8E3F9" 
  },
  selectedOption: { backgroundColor: "#E8E3F9", borderColor: "#7E57C2" },
  optionText: { fontSize: 16, color: "#555", fontFamily: "Quicksand-Medium" },
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

export default Questionnaire7;