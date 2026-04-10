import React from "react";
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,Dimensions,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Asset Imports
const BackIcon = require("../assets/BackIcon.png");
const FlowerIcon = require("../assets/SunflowerIcon.png");
const WarningIcon = require("../assets/WarningIcon.png");
const CloudIcon = require("../assets/YogaIcon.png");
const SunIcon = require("../assets/flower.png");
const JournalIcon = require("../assets/JournalIcon.png");
const MOOD_GRADIENT_COLORS = ["#7B61FF", "#78469A"];

const screenWidth = Dimensions.get("window").width;

// --- Dummy Data ---
const RECOMMENDATION_CARDS = [
  {
    id: 1,
    icon: CloudIcon,
    title: "Midweek Reset Breaks",
    text: "Take short 5-10 minute breathing or stretching breaks during Tuesday-Thursday to release stress and prevent emotional build-up.",
  },
  {
    id: 2,
    icon: SunIcon,
    title: "Bring Weekend Joy to Weekdays",
    text: "Identify what made you feel relaxed and happy on the weekend, and bring a small piece of it into your weekday—like music, walking, or hobbies.",
  },
  {
    id: 3,
    icon: JournalIcon,
    title: "Journaling Habit",
    text: "Spend 5 minutes each evening writing down your thoughts or any lingering feelings to clear your mind before sleep.",
  },
];

// 💡 navigation is the primary prop
const PersonalizedRecommendationsScreen = ({ navigation }) => {
  const RecommendationCard = ({ data }) => (
    <LinearGradient
      colors={["#7B61FF", "#78469A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.recommendationCard}
    >
      <View style={styles.cardHeader}>
        <Image
          source={data.icon}
          style={styles.cardIcon}
          resizeMode="contain"
        />
        <Text style={styles.cardTitle}>{data.title}</Text>
      </View>
      <Text style={styles.cardText}>{data.text}</Text>
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
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
        <Text style={styles.headerTitle}>Personalized Recommendations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tipBox}>
          <View style={styles.tipHeader}>
            <Image
              source={FlowerIcon}
              style={styles.tipIcon}
              resizeMode="contain"
            />
            <Text style={styles.tipHeaderTitle}>Tip of the day</Text>
          </View>
          <Text style={styles.tipText}>
            Take a 5-minutes breathing break!🌿
          </Text>
        </View>

        <View style={styles.insightBox}>
          <Image
            source={WarningIcon}
            style={styles.resourceWarningIcon}
            resizeMode="contain"
          />
          <Text style={styles.insightText}>
            Based on your weekly mood insights, here's what may help you feel
            relaxed and supported 🌸
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardScrollArea}
        >
          {RECOMMENDATION_CARDS.map((card) => (
            <RecommendationCard key={card.id} data={card} />
          ))}
        </ScrollView>

        <Text style={styles.guideText}>
          Want more ideas? Try our Recommendation Guide 🌱
        </Text>

        <TouchableOpacity
          style={styles.tryNowButton}
          // {/* ✅ FIXED: Navigate to Recommendation Guide */}
          onPress={() => navigation.navigate("GeneralRecs")}
        >
          <Text style={styles.tryNowButtonText}>Try Now</Text>
        </TouchableOpacity>

        <LinearGradient
          colors={["#cacdf3ff", "#E8E3F9", "#F4F3FF"]}
          style={styles.resourcesPanel}
        >
          <Image
            source={WarningIcon}
            style={styles.resourceWarningIcon}
            resizeMode="contain"
          />
          <Text style={styles.resourcesHeader}>
            If you're struggling, here are resources:
          </Text>

          <TouchableOpacity
            style={[styles.buttonWrapper]}
            // {/* ✅ FIXED: Navigate to ChatBot */}
            onPress={() => navigation.navigate("ChatBot")}
          >
            <LinearGradient
              colors={MOOD_GRADIENT_COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.resourceButtonText}>Chatbot therapy</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonWrapper]}
            // {/* ✅ FIXED: Navigate to CrisisSupport with professional tab param */}
            onPress={() =>
              navigation.navigate("CrisisSupport", { tab: "professional" })
            }
          >
            <LinearGradient
              colors={MOOD_GRADIENT_COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.resourceButtonText}>
                Find professional help
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Gradient Button Styles
  buttonWrapper: {
    width: "70%",
    marginTop: 10,
    alignSelf: "center",
  },
  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    paddingBottom: 10,
    // borderWidth:1
  },
  backButton: { padding: 5, paddingLeft: 0, paddingRight: 0 },
  backIcon: { width: 30, height: 30, tintColor: "#512DA8" },
  headerTitle: {
    fontSize: 20,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    // marginLeft: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  gradient: {
    height: 45,
    width: "100%",
    paddingVertical: 0,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  // --- Tip of the Day ---
  tipBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  tipIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  tipHeaderTitle: {
    fontSize: 14,
    color: "#512DA8",
    fontFamily: "Quicksand-SemiBold",
  },
  tipText: {
    fontSize: 18,
    // fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Quicksand-Bold",
    color: "#333",
  },
  tipBreathingIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },

  // --- Insight Text ---
  insightBox: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
    // borderWidth:1,
  },
  insightIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    // borderWidth:1,
    // tintColor: '#9370DB',
  },
  insightText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Quicksand-Regular",
    textAlign: "center",
    maxWidth: "80%",
  },

  // --- Horizontally Scrollable Cards ---
  cardScrollArea: {
    paddingHorizontal: 5,
    marginBottom: 25,
  },
  recommendationCard: {
    width: screenWidth * 0.45, // About half the screen width
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Quicksand-Bold",
    flexShrink: 1,
  },
  cardText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: "Quicksand-Regular",
    lineHeight: 16,
  },

  // --- Guide Link / Try Now Button ---
  guideText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
    marginBottom: 7,
    textAlign: "center",
  },
  tryNowButton: {
    backgroundColor: "#835ed8ff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 35,
    marginBottom: 40,
  },
  tryNowButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
  },

  // --- Resources Panel ---
  resourcesPanel: {
    width: "100%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },

  resourcesHeader: {
    fontSize: 16,
    color: "#512DA8",
    fontFamily: "Quicksand-SemiBold",
    textAlign: "center",
    marginBottom: 15,
  },
  resourceWarningIcon: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  resourceButton: {
    width: "75%",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    height: 20,
  },
  resourceButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
  },
});

export default PersonalizedRecommendationsScreen;
