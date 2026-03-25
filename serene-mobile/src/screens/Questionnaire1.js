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
const CheckMoodIcon = require("../assets/CheckMoodIcon.png");
const GlobeIcon = require("../assets/GlobeIcon.png");
const CrossIcon = require("../assets/CrossIcon.png");

const Questionnaire1 = ({ navigation }) => {
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
      navigation.navigate("Questionnaire2");
    } else {
      Alert.alert(
        "Selection Required",
        "Please select an option before proceeding."
      );
    }
  };

  const handleSkip = () => {
    navigation.navigate("Home");
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
          <TouchableOpacity onPress={()=>navigation.navigate("Home")} style={styles.closeButton}>
            <Image
              source={CrossIcon}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Image
          source={CheckMoodIcon}
          style={styles.headerIllustration}
          resizeMode="contain"
        />

        <Text style={styles.screenTitle}>Check your Mood</Text>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            Q1. I felt calm and in control of my emotions today.
          </Text>

          <View style={styles.optionsContainer}>
            {answerOptions.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                value={option.value}
                iconSource={GlobeIcon} // ⬅️ Pass the single globe icon
                selectedValue={selectedAnswer}
                onSelect={setSelectedAnswer}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomButtons}>
          <QuestionnaireNavButton
            title="Skip"
            onPress={handleSkip} // Goes to home
            type="skip"
          />
          <QuestionnaireNavButton
            title="Next"
            onPress={handleNext}
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
    paddingTop: 30,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    marginTop:20,
    alignItems: "center",
    // borderWidth:1,
  },
  closeButton: { padding: 5 },
  closeIcon: { width: 25, height: 25, tintColor: "#555" },
  // questionNumberText: {
  //   fontSize: 16,
  //   fontFamily: "Quicksand-SemiBold",
  //   color: "#512DA8",
  //   padding: 5,
  // },
  headerIllustration: { width: "70%", height: 130, marginBottom: 10 },
  screenTitle: {
    fontSize: 22,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginBottom: 30,
  },
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
    marginTop:30,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
    marginBottom: 20,
  },
  optionsContainer: {},
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    marginTop: 40,
    // marginBottom:30,
  },
});

export default Questionnaire1;
