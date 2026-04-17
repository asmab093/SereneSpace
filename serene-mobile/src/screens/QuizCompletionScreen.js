import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from 'react-native-progress';

// Asset Imports
const CelebrationIcon = require("../assets/CelebrationIcon2.png"); 
const screenWidth = Dimensions.get('window').width;

const QuizCompletionScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]} style={styles.container}>
      <View style={styles.content}>
        
        {/* 1. Full Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar 
            progress={1} 
            width={screenWidth * 0.8} 
            color="#7E57C2" 
            unfilledColor="#E0E0E0" 
            borderWidth={2} 
            borderColor="#FFFFFF"
            height={16}
            borderRadius={10}
          />
        </View>
 <Text style={styles.title}>You did it! 👏</Text>
        {/* 2. Celebration Illustration */}
        <Image source={CelebrationIcon} style={styles.illustration} resizeMode="contain" />

        {/* 3. Title Text */}
       

        {/* 4. The White Info Card */}
        <View style={styles.textCard}>
          <Text style={styles.description}>
            Thank you for completing the test! We’ve analyzed your responses and have tailored recommendations for you! 🥂
          </Text>
        </View>

        {/* 5. Action Buttons */}
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity 
            style={styles.buttonWrapper} 
            onPress={() => navigation.navigate("MoodStats")}
          >
            <LinearGradient 
              colors={["#8E74F0", "#7358D5"]} 
              style={styles.gradientButton}
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}}
            >
              <Text style={styles.buttonText}>View My Mood Insights</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonWrapper} 
            onPress={() => navigation.navigate("Home")}
          >
            <LinearGradient 
              colors={["#8E74F0", "#7358D5"]} 
              style={styles.gradientButton}
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}}
            >
              <Text style={styles.buttonText}>Return to Dashboard</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 80, // Matches the higher placement in screenshot
    paddingHorizontal: 30 
  },
  progressContainer: { 
    marginBottom: 15
  },
  illustration: { 
    width: screenWidth * 0.55, 
    height: 180, 
    marginBottom: 30 
  },
  title: { 
    fontSize: 26, 
    color: "#512DA8", 
    fontFamily: "Quicksand-Bold", 
    marginBottom: 25 
  },
  textCard: { 
    backgroundColor: '#fff', 
    paddingVertical: 25, 
    paddingHorizontal: 20, 
    borderRadius: 15, 
    width: '100%', 
    // Subtle shadow for the white box
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4, 
    marginBottom: 50 
  },
  description: { 
    fontSize: 15, 
    color: "#444", 
    fontFamily: "Quicksand-Medium", 
    textAlign: 'center', 
    lineHeight: 22 
  },
  buttonContainer: { 
    width: '100%', 
    alignItems: 'center' 
  },
  buttonWrapper: { 
    width: '85%', 
    marginBottom: 15 
  },
  gradientButton: { 
    paddingVertical: 14, 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 17, 
    fontFamily: 'Quicksand-Bold' 
  },
});

export default QuizCompletionScreen;