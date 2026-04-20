import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from 'react-native-progress';

const CelebrationIcon = require("../assets/CelebrationIcon2.png"); 
const screenWidth = Dimensions.get('window').width;

const QuizCompletionScreen = ({ navigation }) => {

  // ✅ PREVENT GOING BACK TO QUESTIONS
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Home"); // Redirect to Home instead of going back
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <LinearGradient colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]} style={styles.container}>
      <View style={styles.content}>
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
        <Image source={CelebrationIcon} style={styles.illustration} resizeMode="contain" />

        <View style={styles.textCard}>
          <Text style={styles.description}>
            Thank you for completing the test! We’ve analyzed your responses and have tailored recommendations for you! 🥂
          </Text>
        </View>

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

// ... Styles remain exactly the same as your previous code
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: 30 },
  progressContainer: { marginBottom: 15 },
  illustration: { width: screenWidth * 0.55, height: 180, marginBottom: 30 },
  title: { fontSize: 26, color: "#512DA8", fontFamily: "Quicksand-Bold", marginBottom: 25 },
  textCard: { backgroundColor: '#fff', paddingVertical: 25, paddingHorizontal: 20, borderRadius: 15, width: '100%', elevation: 4, marginBottom: 50 },
  description: { fontSize: 15, color: "#444", fontFamily: "Quicksand-Medium", textAlign: 'center', lineHeight: 22 },
  buttonContainer: { width: '100%', alignItems: 'center' },
  buttonWrapper: { width: '85%', marginBottom: 15 },
  gradientButton: { paddingVertical: 14, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontFamily: 'Quicksand-Bold' },
});

export default QuizCompletionScreen;