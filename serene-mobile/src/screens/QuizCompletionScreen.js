import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../components/CustomButton";

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const CompletionIllustration = require("../assets/CelebrationIcon2.png"); // Based on your "You did it!" image

// 💡 Props: onViewInsights, onReturnToDashboard (both lead to further actions/Home)
const QuizCompletionScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.progressArea}>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={["#7E57C2", "#4A3A99"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.progressBarFill, { width: "100%" }]} // ⬅️ PROGRESS INCREASED to 40%
            />
          </View>
        </View>

        <Image
          source={CompletionIllustration}
          style={styles.illustration}
          resizeMode="contain"
        />

        <Text style={styles.title}>You did it! 👏</Text>

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            Thank you for completing the test! We've analyzed your responses and
            have tailored recommendations for you! 🥂
          </Text>
        </View>

        <View style={styles.buttonBlock}>
          <CustomButton
            title="View My Mood Insights"
            onPress={()=>navigation.navigate("PersonalRecs")} // Leads to Insights (Placeholder/Future Screen)
            style={styles.insightsButton}
          />
          <CustomButton
            title="Return to Dashboard"
            onPress={()=>navigation.navigate("Home")} // Leads back to Home
            style={styles.dashboardButton}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "85%",
    alignItems: "center",
    paddingVertical: 50,
  },
  // --- Progress Bar Styles ---
  progressArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 0,
    paddingHorizontal: 15,
  },
  progressBarContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#EBEBEB",
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },

  illustration: {
    width: "100%",
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginBottom: 10,
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  messageText: {
    fontSize: 14,
    color: "#0c0b0bff",
    textAlign: "center",
    fontFamily: "Quicksand-Medium",
    lineHeight: 24,
  },
  buttonBlock: {
    width: "100%",
  },
});

export default QuizCompletionScreen;
