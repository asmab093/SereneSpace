import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const BackIcon = require("../assets/BackIcon.png");
const TermsIcon = require("../assets/Terms&ConditionScreenIcon.png"); // Header icon for Terms

  const TermsAndConditionsScreen = ({  navigation  }) => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={["#fff", "#fff", "#fff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={BackIcon}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <View style={styles.bannerHeader}>
            <Image
              source={TermsIcon}
              style={styles.bannerIcon}
              resizeMode="contain"
            />
            <Text style={styles.bannerTitle}>Terms & Conditions</Text>
            <Text style={styles.missionText}>
              our mission is to help shape happy productive lives
            </Text>
          </View>
          <View style={styles.updateBox}>
            <Text style={styles.updateText}>
              Our terms and Conditions have been updated on 25th July, 2025
            </Text>
          </View>
        </View>

        
        <View style={styles.contentSections}>
          <Text style={styles.bodyText}>
            Welcome to <Text style={styles.highlightText}>Serene Space</Text>,
            your safe space for mental health awareness and emotional support.
            By using this app, you agree to follow the terms below.
          </Text>

          <Text style={styles.sectionHeader}>1. Purpose of the App</Text>
          <Text style={styles.bodyText}>
            This app is created to promote mental well-being through
            self-reflection tools, a supportive chat-bot, and safe community
            spaces. It is not a replacement for professional therapy or medical
            advice. If you are in crisis or experiencing suicidal thoughts,
            please reach out to a qualified therapist or use the emergency
            helplines provided in the app.
          </Text>

          <Text style={styles.sectionHeader}>2. User Conduct</Text>
          <Text style={styles.bodyText}>
            We expect kindness and respect in all interactions. Please do not
            post or share content that is:
            <Text style={styles.listText}>
              {"\n"}• Harmful, hateful, or offensive
              {"\n"}• Promoting self-harm or violence
              {"\n"}• Spam or advertising
            </Text>
            {"\n"}We may remove content or suspend accounts that violate these
            guidelines.
          </Text>

          <Text style={styles.sectionHeader}>3. Privacy</Text>
          <Text style={styles.bodyText}>
            We care deeply about your privacy. Personal data (like your bio or
            posts) is stored securely and not shared publicly unless you choose
            to post in the community. You can edit or delete your data anytime
            from your profile.
          </Text>

          <Text style={styles.sectionHeader}>4. Content Ownership</Text>
          <Text style={styles.bodyText}>
            You own the content you share. By posting, you allow us to display
            it within the app's community feature only.
          </Text>

          <Text style={styles.sectionHeader}>5. Disclaimer</Text>
          <Text style={styles.bodyText}>
            The chat-bot and app are for emotional support and reflection only.
            They do not provide clinical or medical diagnosis. Always seek help
            from professionals for serious mental health issues.
          </Text>

          <Text style={styles.sectionHeader}>6. Account & Termination</Text>
          <Text style={styles.bodyText}>
            You may log out or delete your account anytime. We reserve the right
            to restrict access if the app is misused or community rules are
            violated.
          </Text>

          <Text style={styles.sectionHeader}>7. Updates to Terms</Text>
          <Text style={styles.bodyText}>
            We may update these Terms occasionally. Continuing to use the app
            means you accept the latest version.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: { padding: 5 },
  backIcon: { width: 30, height: 30, tintColor: "#512DA8" },
  headerTitle: {
    fontSize: 18,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // --- Banner Styles ---
  banner: {
    backgroundColor: "#D7D9F4",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 20,
    alignSelf: "center",
    width: "90%",
    paddingBottom: 60,
    marginBottom: 20,

    position: "relative",
  },
  bannerHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  bannerIcon: {
    width: 38,
    height: 38,
    // tintColor: '#702a7eff',
    marginBottom: 5,
  },
  bannerTitle: {
    fontSize: 22,
    // fontWeight: "bold",
    color: "#000",
    fontFamily: "Quicksand-Bold",
  },
  missionText: {
    fontSize: 12,
    color: "#512DA8",
    fontFamily: "Quicksand-Regular",
    textAlign: "center",
    marginBottom: 15,
  },
  updateBox: {
    backgroundColor: "#8C73F4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "100%",
    position: "absolute",
    bottom: 10, // Adjust bottom value to sit slightly above the very bottom edge/radius
    left: 20, // Match parent horizontal padding
    right: 20, // Match parent horizontal padding
  },
  updateText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: "Quicksand-SemiBold",
    textAlign: "center",
  },

  // --- Content Styles ---
  contentSections: {
    paddingHorizontal: 20,
  },
  bodyText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Quicksand-Regular",
    lineHeight: 22,
    marginBottom: 15,
  },
  highlightText: {
    fontFamily: "Quicksand-Bold",
    color: "#512DA8",
  },
  sectionHeader: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#333",
    fontFamily: "Quicksand-Bold",
    marginTop: 10,
    marginBottom: 5,
  },
  listText: {
    fontFamily: "Quicksand-Regular",
    lineHeight: 22,
  },
});

export default TermsAndConditionsScreen;
