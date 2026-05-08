import { Alert } from "react-native";
import axios from 'axios'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '../api/config';
import React, { useState, useContext } from "react";
import CustomDrawer from "../components/CustomDrawer";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";

// Asset Imports
const MenuIcon = require("../assets/HamburgerIcon.png");
// const AvatarIcon = require("../assets/ProfileAvatar.png");
const MoodGraph = require("../assets/MoodTrends.png");
const QuickChatIcon = require("../assets/QuickChatIcon1.png");
const DailyDoseIcon = require("../assets/OpenBookIcon4.png");
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
  const { user, token, handleCommunityNavigation } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [alertVisible, setAlertVisible] = useState(false);
  const MOOD_GRADIENT_COLORS = ["#7B61FF", "#78469A"];
  const [drawerVisible, setDrawerVisible] = useState(false);
const handleMoodCheckIn = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/mood/check-today`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    
    // ✅ ACTIVE LOGIC: Only navigate if the backend says we can
    if (res.data.canLog) {
      navigation.navigate("Questionnaire1");
    } else {
      // ✅ Show your custom centered alert if already logged today
      setAlertVisible(true);
    }

  } catch (err) {
    console.error("Check log error:", err);
    // On error, we navigate as a fallback so the app doesn't "freeze"
    navigation.navigate("Questionnaire1");
  }
};
  return (
    // <ScrollView>
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
                onPress={handleMoodCheckIn} // ⬅️ Start Check-in
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
  <TouchableOpacity style={styles.smallCardVertical} onPress={() => navigation.navigate("ChatBot")}>
    <Image source={QuickChatIcon} style={styles.centeredIconSmall} resizeMode="contain" />
    <Text style={styles.smallCardHeader}>Quick Chat</Text>
    <Text style={styles.smallCardSubText}>Tap to talk to your AI companion</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.smallCardVertical} onPress={() => navigation.navigate("GeneralRecs")}>
    <Image source={DailyDoseIcon} style={styles.centeredIconPurple} resizeMode="contain" />
    <Text style={styles.smallCardHeader}>Daily Dose</Text>
    <Text style={styles.smallCardSubText}>Try Serene Space's Recommendation Guide</Text>
  </TouchableOpacity>
</View>

{/* URGENT SUPPORT CARD */}
<View style={styles.card}>
  <Text style={styles.cardHeader}>Need Urgent Support?</Text>
  <View style={styles.horizontalGroupSupport}>
    <TouchableOpacity style={styles.supportBoxVertical} onPress={() => navigation.navigate("CrisisSupport", { tab: "professional" })}>
      <Image source={ProfessionalIcon} style={styles.centeredIconLarge} resizeMode="contain" />
      <Text style={styles.supportTextBold}>Get Professional Help</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.supportBoxVertical} onPress={() => navigation.navigate("CrisisSupport", { tab: "hotlines" })}>
      <Image source={HotlineIcon} style={styles.centeredIconLarge} resizeMode="contain" />
      <Text style={styles.supportTextBold}>Crisis Hotlines</Text>
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
      {/* ✅ CENTERED CUSTOM ALERT MODAL */}
<Modal transparent={true} visible={alertVisible} animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.customAlert}>
      <Text style={styles.alertTitle}>Check-in Restricted</Text>
      <Text style={styles.alertMessage}>
        You've already logged your mood for today! One entry per day helps us give you more accurate trends. See you tomorrow! 🌸
      </Text>
      <TouchableOpacity style={styles.alertButton} onPress={() => setAlertVisible(false)}>
        <Text style={styles.alertButtonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
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
    width: 22,
    height: 22,
    tintColor: "#512DA8",
  },
  headerTitle: {
    fontSize: 18,
    color: "#512DA8",
    fontFamily: "Quicksand-SemiBold",
    textAlign: "center",
  },
  avatarCircle: {
    width: 32, 
    height: 32,
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
    width: 125,
    height: 30,
    borderRadius: 5,
    paddingVertical: 3,
    //  marginBottom: 0,
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
 smallCardVertical: { 
    ...SUPPORT_CARD_BASE,
    alignItems: "center", 
    justifyContent: "center",
    padding: 10 
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
  },
 smallCardSubText: {
    fontSize: 12, // Slightly smaller to fit the longer text
    marginTop: 5,
    color: "#555",
    fontFamily: "Quicksand-Regular",
    textAlign: "center",
    lineHeight: 14,
  },

  // --- Urgent Support Group Styles ---
  horizontalGroupSupport: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: 10,
  },

  

 supportBoxVertical: { 
    ...SUPPORT_CARD_BASE, 
    backgroundColor: "#D8DAF4",
    alignItems: "center", 
    justifyContent: "center",
    padding: 10
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



 centeredIconSmall: { 
    width: 45, 
    height: 45, 
    marginBottom: 5 
  },
  centeredIconLarge: { 
    width: 50, 
    height: 50, 
    marginBottom: 8, 
    tintColor: "#7E57C2" 
  },
 supportTextBold: { 
    fontSize: 13, 
    color: "#512DA8", 
    fontFamily: "Quicksand-Bold", 
    textAlign: "center" 
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
  // ✅ CUSTOM MODAL STYLES (CENTERED)
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', // Centers vertically
    alignItems: 'center'      // Centers horizontally
  },
  customAlert: { 
    width: '85%', 
    backgroundColor: '#FFF', 
    borderRadius: 25, 
    padding: 25, 
    alignItems: 'center',     // Centers children (title, message, button)
    elevation: 10 
  },
  alertTitle: { 
    fontSize: 18, 
    fontFamily: 'Quicksand-Bold', 
    color: '#512DA8', 
    marginBottom: 12 
  },
  alertMessage: { 
    fontSize: 14, 
    fontFamily: 'Quicksand-Medium', 
    color: '#444', 
    textAlign: 'center',      // ✅ This specifically centers the text lines
    lineHeight: 22, 
    marginBottom: 10 
  },
  alertButton: { 
    backgroundColor: '#7B61FF', 
    paddingVertical: 12, 
    paddingHorizontal: 40, 
    borderRadius: 15 
  },
  alertButtonText: { 
    color: '#FFF', 
    fontFamily: 'Quicksand-Bold', 
    fontSize: 16 
  },
  centeredIconPurple: { 
    width: 35, 
    height: 35, 
    marginBottom: 8, 
    // tintColor: "#7E57C2" // ✅ Keeps Daily Dose icon purple
  },
  centeredIconLarge: { 
    width: 50, 
    height: 50, 
    marginBottom: 8, 
    tintColor: "#7E57C2" 
  },
});

export default HomeScreen;
