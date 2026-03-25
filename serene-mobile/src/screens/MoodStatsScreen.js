import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CommunityTabButton from "../components/CommunityTabButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter"; 

// Asset Imports
const BackIcon = require("../assets/BackIcon.png");
const ArrowIcon = require("../assets/RightArrowIcon.png");
const MoodChartWeek1 = require("../assets/MoodChartWeek1.png");
const MoodChartWeek2 = require("../assets/MoodFrameWeek2.png");

const CHART_IMAGE_HEIGHT = 280;
const screenWidth = Dimensions.get("window").width;
const MOOD_GRADIENT_COLORS = ["#7B61FF", "#78469A"];

// 💡 navigation is now the primary prop
const MoodStatsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState("firstHalf");
  const [timeframe, setTimeframe] = useState("thisWeek");

  const currentChartImage =
    view === "firstHalf" ? MoodChartWeek1 : MoodChartWeek2;

  const handleNext = () => {
    if (view === "firstHalf") setView("secondHalf");
  };

  const handlePrevious = () => {
    if (view === "secondHalf") setView("firstHalf");
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          {/* ✅ FIXED: Use navigation.goBack() */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={BackIcon}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Mood Stats</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.toggleContainer}>
            <View style={styles.tabBar}>
              <CommunityTabButton
                title="This Week"
                isSelected={timeframe === "thisWeek"}
                onPress={() => setTimeframe("thisWeek")}
              />
              <CommunityTabButton
                title="Last Week"
                isSelected={timeframe === "lastWeek"}
                onPress={() => setTimeframe("lastWeek")}
              />
            </View>
          </View>

          <View style={styles.moodStatsPanel}>
            <View style={styles.chartWrapper}>
              {view === "secondHalf" && (
                <TouchableOpacity
                  style={styles.navArrow}
                  onPress={handlePrevious}
                >
                  <Image
                    source={ArrowIcon}
                    style={styles.leftArrowIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}

              <Image
                source={currentChartImage}
                style={styles.chartImage}
                resizeMode="contain"
              />

              {view === "firstHalf" && (
                <TouchableOpacity style={styles.navArrow} onPress={handleNext}>
                  <Image
                    source={ArrowIcon}
                    style={styles.rightArrowIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.dotContainer}>
              <View
                style={[styles.dot, view === "firstHalf" && styles.dotActive]}
              />
              <View
                style={[styles.dot, view === "secondHalf" && styles.dotActive]}
              />
            </View>
          </View>

          <View style={styles.insightsCard}>
            <Text style={styles.insightsHeader}>Weekly Insights ✨</Text>
            <Text style={styles.insightsText}>
              Your week was fairly mixed with a slight negative tilt. There were
              some high points (Calm, Happy) but also some challenges (Angry,
              Sad, Anxious). Mid-week looked tough, but you ended on a stronger
              note. Keep focusing on what helped you feel better towards the
              weekend 💜
            </Text>
          </View>

          <TouchableOpacity
            style={styles.recommendationsButton}
            onPress={() => navigation.navigate("PersonalRecs")}
          >
            <LinearGradient
              colors={MOOD_GRADIENT_COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.recommendationsButtonText}>
                View Recommendations
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
      <View style={{ paddingBottom: insets.bottom, backgroundColor: "#fff" }}>
        <HomeFooter navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: {
    height: 45,
    width: "100%",
    paddingVertical: 0,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    paddingBottom: 10,
  },
  backButton: { padding: 5 },
  backIcon: { width: 30, height: 30, tintColor: "#512DA8" },
  headerTitle: {
    fontSize: 20,
    // fontWeight: "bold",
    color: "#333",
    fontFamily: "Quicksand-Bold",
    marginLeft: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between", // Try 'space-between' or 'space-around'
    alignItems: "center",
    borderRadius: 20,
    padding: 5,
    width: "100%", // Ensure it spans the full width of its parent (scrollContent)
    marginBottom: 10,
  },
  // --- Mood Stats Panel (Chart) ---
  moodStatsPanel: {
    width: "95%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    height: "42%",
    // borderWidth:1,
    position: "relative",
  },
  chartWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    height: "95%",
    //  borderWidth:1,
  },
  chartImage: {
    // Adjust width based on screen size minus padding/arrows
    width: screenWidth - 100,
    height: CHART_IMAGE_HEIGHT,
  },

  // Navigation Arrows
  navArrow: {
    padding: 5,
  },
  leftArrowIcon: {
    width: 20,
    height: 20,
    transform: [{ rotate: "180deg" }], // Rotate for left arrow
    tintColor: "#512DA8",
    marginHorizontal: -10,
    // borderWidth:1,
  },
  rightArrowIcon: {
    width: 20,
    height: 20,
    marginHorizontal: -20,
    // borderWidth:1,
    tintColor: "#512DA8",
  },

  // Dots
  dotContainer: {
    flexDirection: "row",
    marginTop: 0,
    // borderWidth:1,
    zIndex: 1,
    position: "absolute",
    bottom: -20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: "#D7D9F4",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#512DA8",
  },

  // --- Insights Card ---
  insightsCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginTop: 35,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  insightsHeader: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginBottom: 10,
  },
  insightsText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Quicksand-Regular",
    lineHeight: 20,
  },

  // --- Recommendations Button ---
  recommendationsButton: {
    width: 250,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  recommendationsButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Quicksand-SemiBold",
    fontWeight: "600",
  },
});

export default MoodStatsScreen;
