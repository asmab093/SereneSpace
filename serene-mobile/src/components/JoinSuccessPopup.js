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
const SuccessIcon = require("../assets/PurpleInfoIcon.png"); // Assuming the purple icon at the top of the popup

const JoinSuccessPopup = ({ isVisible, onClose, groupsJoinedCount }) => {
  // Determine the pluralization for the message
  const groupText =
    groupsJoinedCount === 1 ? "support group" : "support group(s)";
  const joinText =
    groupsJoinedCount === 1
      ? "You've joined your new"
      : "You've joined your new";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupCard}>
          <Image
            source={SuccessIcon}
            style={styles.successIcon}
            resizeMode="contain"
          />

          <Text style={styles.joinMessage}>
            {joinText} {groupText}.
          </Text>

          <Text style={styles.instructionText}>
            🌼 Take a moment to explore the space, share your thoughts, or
            simply read what others have shared.
          </Text>

          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>Ok</Text>
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
    width: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    // Optional: Add shadow if needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    elevation: 10,
  },

  // --- Content Styles ---
  successIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
    // The icon in the image has a specific color/design.
  },
  joinMessage: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Quicksand-Regular",
    textAlign: "center",
    lineHeight: 20,
  },

  // --- OK Button ---
  okButton: {
    backgroundColor: "#7a64e8ff", // Purple button background
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  okButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
    // fontWeight: "bold",
  },
});

export default JoinSuccessPopup;
