import React, { useState, useContext } from "react";
import CustomDrawer from "../components/CustomDrawer";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";

// Asset Imports
const MenuIcon = require("../assets/HamburgerIcon.png");
// const AvatarIcon = require("../assets/ProfileAvatar.png");
const MoodGraph = require("../assets/MoodTrends.png");
const QuickChatIcon = require("../assets/QuickChatIcon.png");
const DailyDoseIcon = require("../assets/OpenBookIcon.png");
const ProfessionalIcon = require("../assets/ProfessionalIcon.png");
const HotlineIcon = require("../assets/HotlineIcon.png");
const CircleSupportArt = require("../assets/CircleSupportArtIcon.png");
const MoodEmojis = require("../assets/EmogiGroup.png");

// --- 1. DEFINE THE MISSING CONSTANT ---
const SUPPORT_CARD_BASE = {
  backgroundColor: "#FFFFFF",
  borderRadius: 15,
  padding: 5,
  height: 140,
  flex: 1,
  marginHorizontal: 5,
};

// 💡 navigation is now the primary prop
const HomeScreen = ({ navigation }) => {
  const { user, handleCommunityNavigation } = useContext(AuthContext);

  const insets = useSafeAreaInsets();
  const MOOD_GRADIENT_COLORS = ["#7B61FF", "#78469A"];

  const [drawerVisible, setDrawerVisible] = useState(false);
  // const userInitial = user?.username
  //   ? user.username.charAt(0).toUpperCase()
  //   : "U";

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <View style={styles.fullScreenContainer}>
          {/* HEADER AREA */}
          <View style={[styles.headerArea, { paddingTop: insets.top }]}>
            <View style={styles.headerContainer}>
              {/* 🛑 FIX: Open Drawer (We will set up the Drawer Navigator later) */}
              <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                <Image
                  source={MenuIcon}
                  style={styles.headerIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Hi, {user?.username}</Text>

              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={() => navigation.navigate("Profile")} //  Navigate to Profile
              >
                  <View style={styles.initialAvatarContainer}>
                    <Text style={styles.initialAvatarText}>
                      {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* MOOD CHECK-IN CARD */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>How are you feeling?</Text>
              <Text style={styles.cardSubText}>
                Track your mood and notice patterns.
              </Text>
              <Image
                source={MoodEmojis}
                style={styles.moodEmojisImage}
                resizeMode="contain"
              />

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.buttonWrapper}
                onPress={() => navigation.navigate("Questionnaire1")} // ⬅️ Start Check-in
              >
                <LinearGradient
                  colors={MOOD_GRADIENT_COLORS}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  <Text style={styles.buttonText}>Quick Check-in</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* MOOD TRENDS CARD */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Your mood trends</Text>
              <Image
                source={MoodGraph}
                style={styles.moodGraph}
                resizeMode="stretch"
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("MoodStats")}
              >
                <Text style={styles.linkText}>View Full Stats</Text>
              </TouchableOpacity>
            </View>

            {/* QUICK CHAT & DAILY DOSE GROUP */}
            <View style={styles.horizontalGroup}>
              <TouchableOpacity
                style={[styles.smallCard, styles.flexItem]}
                onPress={() => navigation.navigate("ChatBot")} // ⬅️ Open Chatbot
                activeOpacity={0.8}
              >
                <View style={styles.quickChatContent}>
                  <Image
                    source={QuickChatIcon}
                    style={styles.smallCardIcon1}
                    resizeMode="contain"
                  />
                  <View style={styles.quickChatTextContainer}>
                    <Text style={styles.smallCardHeader}>Quick Chat</Text>
                    <Text style={styles.smallCardSubText}>
                      Tap to talk to your AI companion
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallCard, styles.flexItem]}
                onPress={() => navigation.navigate("GeneralRecs")} // ⬅️ Placeholder for Recommendations
                activeOpacity={0.8}
              >
                <View style={styles.dailyDoseContent}>
                  <Image
                    source={DailyDoseIcon}
                    style={styles.smallCardIcon2}
                    resizeMode="contain"
                  />
                  <Text style={styles.smallCardHeader}>
                    Daily dose of Calmness
                  </Text>
                  <Text style={styles.smallCardSubText}>
                    Try Serene's Space Recommendation Guide
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* URGENT SUPPORT CARD */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Need Urgent Support?</Text>
              <View style={styles.horizontalGroupSupport}>
                <TouchableOpacity
                  style={styles.supportBoxLeft}
                  onPress={() =>
                    navigation.navigate("CrisisSupport", {
                      tab: "professional",
                    })
                  } // ⬅️ Pass params
                  activeOpacity={0.8}
                >
                  <View style={styles.supportTextContainer}>
                    <Text style={styles.supportTextLeft}>
                      Find a professional best suited for your needs
                    </Text>
                  </View>
                  <Image
                    source={ProfessionalIcon}
                    style={styles.supportIconLeft}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.supportBoxRight}
                  onPress={() =>
                    navigation.navigate("CrisisSupport", { tab: "hotlines" })
                  } // ⬅️ Pass params
                  activeOpacity={0.8}
                >
                  <Image
                    source={HotlineIcon}
                    style={styles.supportIconRight}
                    resizeMode="contain"
                  />
                  <Text style={styles.supportTextRight}>
                    Contact Crisis Hot-lines
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* COMMUNITY CARD */}
            <TouchableOpacity
              onPress={() => handleCommunityNavigation(navigation)} // Community Navigation
              style={styles.card}
            >
              <Text style={styles.cardHeader}>Circle Support</Text>
              <Text style={styles.cardSubText}>
                Share how you feel today on the Serene Space community
              </Text>
              <Text style={styles.cardBodyText}>
                Enter your selected groups, talk about your struggles and find
                support from others
              </Text>
              <Image
                source={CircleSupportArt}
                style={styles.circleSupportArt}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* FOOTER */}
          <View
            style={[styles.footerWrapper, { paddingBottom: insets.bottom }]}
          >
            <HomeFooter navigation={navigation} />
          </View>
        </View>
      </LinearGradient>

      <CustomDrawer
        isVisible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
  },

  headerArea: {
    backgroundColor: "#F7F4FD",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: "#512DA8",
  },
  headerTitle: {
    fontSize: 22,
    color: "#512DA8",
    fontFamily: "Quicksand-SemiBold",
    textAlign: "center",
  },
  avatarCircle: {
    width: 35, 
    height: 35,
    borderRadius: 20,
    backgroundColor: "#7E57C2", 
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#7E57C2",
    elevation: 2, // Tiny shadow for Android
    shadowColor: "#000", // Tiny shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  initialAvatarText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Quicksand-Bold",
    textAlignVertical: "center",
  },

  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
  },
  footerContainer: {
    // Used for marginBottom calculation in ScrollView
    height: 65,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Quicksand-Bold",
    marginBottom: 2,
  },
  cardSubText: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Quicksand-Regular",
    marginBottom: 10,
  },
  cardBodyText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Quicksand-Regular",
    marginBottom: 10,
  },

  buttonWrapper: {
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
  },
  gradient: {
    height: 45,
    width: "100%",
    paddingVertical: 0,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Quicksand-SemiBold",
    fontWeight: "600",
  },
  linkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Quicksand-SemiBold",
    // justifyContent:'center',
    // alignContent:'center',
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: "#835ed8ff",
    width: 120,
    height: 27,
    borderRadius: 10,
    paddingVertical: 3,
  },
  moodGraph: {
    width: "100%",
    height: 90,
    marginTop: 10,
    marginBottom: 0,
  },
  moodEmojisImage: {
    width: "100%",
    height: 45,
    alignSelf: "center",
    marginBottom: 2,
    marginTop: 2,
  },

  // --- Horizontal Groups (Quick Chat / Daily Dose) ---
  horizontalGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  flexItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  smallCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 5,
    height: 140,
  },

  quickChatContent: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  smallCardIcon1: {
    width: 90,
    height: 95,
    marginRight: 0,
  },
  quickChatTextContainer: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
  },

  // Daily Dose Card Styles
  dailyDoseContent: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  smallCardIcon2: {
    width: 30,
    height: 30,
    tintColor: "#7f60c7ff",
  },

  smallCardHeader: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Quicksand-Bold",
    textAlign: "center",
    marginBottom: 0,
  },
  smallCardSubText: {
    fontSize: 14,
    color: "#585454ff",
    fontFamily: "Quicksand-Regular",
    textAlign: "center",
  },

  // --- Urgent Support Group Styles ---
  horizontalGroupSupport: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: 10,
  },

  // LEFT BOX (Professional) Styles: Horizontal Layout (Matching Quick Chat)
  supportBoxLeft: {
    ...SUPPORT_CARD_BASE, 
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8DAF4",
    padding: 10, 
  },
  supportIconLeft: {
    width: 45,
    height: 50,
    marginLeft: -5, // Pull icon slightly to the left edge of the box
    tintColor: "#7E57C2",
  },
  supportTextContainer: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 5,
  },
  supportTextLeft: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Quicksand-Regular",
    lineHeight: 18,
  },

  // RIGHT BOX (Hotline) Styles: Vertical and Centered Layout (Matching Daily Dose)
  supportBoxRight: {
    ...SUPPORT_CARD_BASE, // ⬅️ Compose base style
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#D8DAF4",
    padding: 15, // Override base padding for vertical layout
  },
  supportIconRight: {
    width: 45,
    height: 45,
    marginBottom: 5,
    tintColor: "#7E57C2",
  },
  supportTextRight: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Quicksand-Bold",
    textAlign: "center",
    lineHeight: 18,
  },

  circleSupportArt: {
    width: "100%",
    height: 180,
    marginTop: 15,
    marginBottom: 20,
  },
});

export default HomeScreen;
