import React, { useState } from "react";
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RecommendationTab from "../components/RecommendationTab";

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const BackArrow = require("../assets/BackIcon.png");
const WarningIcon = require("../assets/WarningIcon.png");
const StarIcon = require("../assets/StarsIcon.png");
const SunIcon = require("../assets/SunIcon.png");
const MusicIcon = require("../assets/MusicIcon.png");
const MeditationIcon = require("../assets/MeditationIcon.png");
const CloudIcon = require("../assets/CloudIcon.png");
const PhoneIcon = require("../assets/PhoneIcon.png");
const ButtonLeftArrow = require("../assets/ButtonLeftArrow.png");

// Reusing CustomButton import is good practice, but not strictly necessary here since it's not used.
const MOOD_GRADIENT_COLORS = ["#7B61FF", "#78469A"];

const GeneralRecommendation1 = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("daily_uplift");
  // NOTE: Gradient colors are moved inside the component definition as they are constants
  const CARD_GRADIENT_COLORS = ["#7B61FF", "#78469A"];

  const handleTabSelect = (category) => {
    setSelectedCategory(category);
  };
  // --- Data Arrays for Tab Content ---
  const DAILY_UPLIFT_DATA = [
    {
      icon: StarIcon,
      text: "Start your morning with 3 deep breaths and a light stretch.",
      align: "flex-start",
    },
    {
      icon: SunIcon,
      text: "Step outside for 10 minutes of sunlight after lunch.",
      align: "flex-end",
    },
    {
      icon: MusicIcon,
      text: "Play upbeat music while getting ready to boost your mood.",
      align: "flex-start",
    },
    {
      icon: SunIcon,
      text: "Step outside for 10 minutes of sunlight after lunch.",
      align: "flex-end",
    },
    {
      icon: MusicIcon,
      text: "Play upbeat music while getting ready to boost your mood.",
      align: "flex-start",
    },
  ];

  const MINDFUL_MOMENTS_DATA = [
    {
      icon: MeditationIcon,
      text: "Pause for 2 minutes of breathing when you feel stressed.",
      align: "flex-start",
    },
    {
      icon: CloudIcon,
      text: " Replace “I have to” with “I get to” for a positive mindset shift ",
      align: "flex-end",
    },
    {
      icon: PhoneIcon,
      text: " Use your phone's focus mode for 30 minutes of calmtime.",
      align: "flex-start",
    },
  ];

  const RESET_RECHARGE_DATA = [
    {
      icon: SunIcon,
      text: "Schedule a 30-minute nap or quiet rest period in the afternoon.",
      align: "flex-start",
    },
    {
      icon: MusicIcon,
      text: "Listen to ambient or binaural music to reset your focus.",
      align: "flex-end",
    },
    {
      icon: StarIcon,
      text: "Write down three things you are grateful for today.",
      align: "flex-start",
    },
  ];

  const StepCard = ({ iconSource, text, style }) => (
    <View style={[styles.stepBubbleContainer, style]}>
      <View style={styles.stepCardBase}>
        <LinearGradient
          colors={CARD_GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.stepHeaderGradient}
        >
          <Image source={iconSource} style={styles.stepIcon} resizeMode="contain" />
        </LinearGradient>
        <View style={styles.stepBody}>
          <Text style={styles.stepTextBody}>{text}</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    let data;
    if (selectedCategory === "mindful_moments") data = MINDFUL_MOMENTS_DATA;
    else if (selectedCategory === "reset_recharge") data = RESET_RECHARGE_DATA;
    else data = DAILY_UPLIFT_DATA;

    return (
      <View style={styles.stepsContainer}>
        {data.map((item, index) => (
          <StepCard
            key={index}
            iconSource={item.icon}
            text={item.text}
            style={item.align === "flex-start" ? styles.stepBubble : styles.stepBubbleRight}
          />
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.contentView}>
        <View style={styles.header}>
          {/* ✅ FIXED: Use navigation.goBack() */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={BackArrow} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Recommendation Guide🌱</Text>
        </View>

        <View style={styles.warningBox}>
          <Image source={WarningIcon} style={styles.warningIcon} resizeMode="contain" />
          <Text style={styles.warningText}>
            These are general well-being suggestions. Explore what feels right for you.
          </Text>
        </View>

        <View style={styles.tabsContainer}>
          <RecommendationTab title="Daily Uplift" type="daily_uplift" selectedType={selectedCategory} onPress={handleTabSelect} />
          <RecommendationTab title="Mindful Moments" type="mindful_moments" selectedType={selectedCategory} onPress={handleTabSelect} />
          <RecommendationTab title="Reset & Recharge" type="reset_recharge" selectedType={selectedCategory} onPress={handleTabSelect} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScrollArea}>
          {renderContent()}
        </ScrollView>

        <TouchableOpacity
          style={styles.tryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <LinearGradient
            colors={MOOD_GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View style={styles.buttonContent}>
              <Image source={ButtonLeftArrow} style={styles.buttonArrowIcon} resizeMode="contain" />
              <Text style={styles.tryButtonText}>Try These This Week</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 0,
    alignItems: "center",
  },
  contentScrollArea: {
    flex: 1,
    width: "100%",
  },

  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF", // White background
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EBE5F7",
    width:"115%",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#512DA8",
  },
  screenTitle: {
    fontSize: 20,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
  },

  // --- Warning Box ---
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    alignItems: "flex-start",
    width: "90%",
  },
  warningIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#512DA8",
    textAlign: "center",
    fontFamily: "Quicksand-Regular",
  },

  // --- Tabs ---
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom:5,
    marginTop: 10,
    paddingHorizontal: 0,
  },

  // --- Step Bubbles (The Complex Card Structure) ---
  stepsContainer: {
    width: "100%",
    marginBottom: 5,
    marginTop: 10,
  },
  stepCardBase: {
    // 💡 Outer Card: Base structure, corner radius, and uplifted shadow
    width: "90%",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    backgroundColor: "#D7D9F4", // Light background color of the overall app
  },
  stepBubbleContainer: {
    width: "80%",
    marginBottom: 30,
  },
  stepBubble: {
    alignSelf: "flex-start",
  },
  stepBubbleRight: {
    alignSelf: "flex-end",
  },

  // 1. Gradient Header Section
  stepHeaderGradient: {
    height: 50, // Increased height for better icon centering/spacing
    alignItems: "center",
    justifyContent: "center",
  },
  stepIcon: {
    width: 20, 
    height: 20,
    tintColor: "#FFFFFF",
  },

  // 2. Text Body Section
  stepBody: {
    backgroundColor: "#D7D9F4",
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 10,
  },
  stepTextBody: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Quicksand-Medium",
    textAlign: "center",
    lineHeight: 20,
  },
  gradient: {
    height: 50,
    width: "90%",
    paddingVertical: 10, // Re-added padding visually
    borderRadius: 10, // Matches the outer container radius
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContent: {
    flexDirection: "row", // Aligns icon and text horizontally
    alignItems: "center", // Centers icon and text vertically
    justifyContent: "center", // Centers the whole content block horizontally inside the gradient
    paddingHorizontal: 15, // Add some internal padding
    // borderWidth:1,
  },

  buttonArrowIcon: {
    width: 18,
    height: 18,
    marginRight: 8, // Space between arrow and text
  },
  tryButton: {
    width: 250, // Fixed width
    borderRadius: 25, // Outer radius for the button wrapper
    marginBottom: 30,
    alignSelf: "center",
    marginTop: 10,
    alignItems: "center",
  },
  tryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
  },
});

export default GeneralRecommendation1;
