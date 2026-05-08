import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const CloseIcon = require("../assets/CrossIcon.png"); // Assuming you have a standard Close/Cross Icon
const JoinIcon = require("../assets/JoinCircleIcon.png"); // Green leaf/plant icon
const ShareIcon = require("../assets/ShareSupportIcon.png"); // Chat icon with arrows
const PrivacyLockIcon = require("../assets/PrivacyLockIcon.png"); // Lock icon
const SafetyStopIcon = require("../assets/SafetyStopIcon.png"); // Stop sign icon

const InfoRow = ({ icon, title, description }) => (
  <View style={styles.infoRow}>
    <Image source={icon} style={styles.rowIcon} resizeMode="contain" />
    <View style={styles.textContainer}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowDescription}>{description}</Text>
    </View>
  </View>
);

const CommunityInfoPopup = ({ isVisible, onClose }) => {
  // Data structured to match the popup content
  const infoData = [
    {
      icon: JoinIcon,
      title: "Join a Circle",
      description:
        "Find a group that fits what you are going through: anxiety, focus, self-esteem, depression",
    },
    {
      icon: ShareIcon,
      title: "Share & Support",
      description:
        "Post anonymously, reply to others with kindness, and uplift one another.",
    },
    {
      icon: PrivacyLockIcon,
      title: "Privacy matters",
      description:
        "Your identity and personal data are always protected. You can choose to stay anonymous.",
    },
    {
      icon: SafetyStopIcon,
      title: "Safety First",
      description:
        "Posts that mention harm, bullying, or triggering content are reviewed for everyone’s wellbeing.",
    },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupCard}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>About Circle Support</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Image
                source={CloseIcon}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.subHeader}>
            A safe space for emotional connection.
          </Text>

          <View style={styles.infoList}>
            {infoData.map((item, index) => (
              <InfoRow
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </View>


          <View style={styles.footerWarning}>
            <Text style={styles.warningText}>
              Remember: This is not a replacement for professional therapy. If
              you are struggling deeply, please connect with one of our
              recommended professional.
            </Text>
          </View>


          <TouchableOpacity style={styles.gotItButton} onPress={onClose}>
            <Text style={styles.gotItButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Quicksand-Bold",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 5,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: "#A3A3A3",
  },
  subHeader: {
    fontSize: 14,
    color: "#512DA8",
    fontFamily: "Quicksand-Medium",
    textAlign: "center",
    marginBottom: 20,
  },
  infoList: {
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 10,
  },
  rowIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    tintColor: "#7a64e8ff", // Example tint for the icons
  },
  textContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
    marginBottom: 5,
  },
  rowDescription: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Quicksand-Regular",
    lineHeight: 18,
  },

  footerWarning: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  warningText: {
    fontSize: 12,
    color: "#E91E63", // Red color for warning text
    fontFamily: "Quicksand-SemiBold",
    textAlign: "center",
    lineHeight: 16,
  },

  // --- Got It Button ---
  gotItButton: {
    backgroundColor: "#7a64e8ff",
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 5,
    alignSelf: "center",
  },
  gotItButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
  },
});

export default CommunityInfoPopup;
