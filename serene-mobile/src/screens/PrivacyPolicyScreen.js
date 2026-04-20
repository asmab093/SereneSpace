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

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const BackIcon = require("../assets/BackIcon.png");
const PrivacyIcon = require("../assets/PrivacyPolicyScreenIcon.png"); // Header icon for Privacy

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={["#fff", "#fff", "#fff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={BackIcon}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <View style={styles.bannerHeader}>
            <Image
              source={PrivacyIcon}
              style={styles.bannerIcon}
              resizeMode="contain"
            />
            <Text style={styles.bannerTitle}>Privacy Policy</Text>
            <Text style={styles.missionText}>Serene Space privacy policy</Text>
          </View>
          <View style={styles.updateBox}>
            <Text style={styles.updateText}>
              Our Privacy Policy has been updated on 25th July, 2025
            </Text>
          </View>
        </View>

        <View style={styles.contentSections}>
          <Text style={styles.bodyText}>
            At <Text style={styles.highlightText}>Serene Space</Text>, your
            privacy and emotional safety are our top priorities. This policy
            explains what we collect, how we use it, and how we keep it safe.
          </Text>

          <Text style={styles.sectionHeader}>1. Information We Collect</Text>
          <Text style={styles.bodyText}>
            We only collect information that helps improve your experience, such
            as:
            <Text style={styles.listText}>
              {"\n"}• Your username and optional profile bio
              {"\n"}• Posts or comments you share in Circle Support
              {"\n"}• Journal entries or mood check data (stored privately)
              {"\n"}• Basic device info for app performance
            </Text>
            {"\n"}You may use many parts of the app without sharing personal
            details.
          </Text>

          <Text style={styles.sectionHeader}>
            2. How We Use Your Information
          </Text>
          <Text style={styles.bodyText}>
            We use your data to:
            <Text style={styles.listText}>
              {"\n"}• Personalize your experience and chat-bot responses
              {"\n"}• Improve app features and user safety
              {"\n"}• Show your chosen profile or bio in the community (if
              shared)
              {"\n"}• Connect you to helplines or professionals if you request
              it
            </Text>
            {"\n"}We never sell or share your personal data with advertisers or
            third parties.
          </Text>

          <Text style={styles.sectionHeader}>3. Data Protection</Text>
          <Text style={styles.bodyText}>
            Your data is stored securely and encrypted where possible. You can
            edit or delete your information anytime from your profile. If you
            delete your account, all personal data linked to you is removed
            permanently.
          </Text>

          <Text style={styles.sectionHeader}>
            4. Anonymity in Circle Support
          </Text>
          <Text style={styles.bodyText}>
            You may post anonymously or under a display name. Other users can
            only see what you choose to share - your personal identity stays
            hidden.
          </Text>

          <Text style={styles.sectionHeader}>5. AI Chat-bot</Text>
          <Text style={styles.bodyText}>
            Our AI chat-bot is designed for emotional guidance only.
            Conversations may be analyzed anonymously to improve responses, but
            no identifiable information is stored.
          </Text>

          <Text style={styles.sectionHeader}>6. Changes to This Policy</Text>
          <Text style={styles.bodyText}>
            We may update this Privacy Policy from time to time. We'll notify
            you in the app if major updates occur.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Reusing styles from TermsAndConditionsScreen.js for consistency
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

export default PrivacyPolicyScreen;
