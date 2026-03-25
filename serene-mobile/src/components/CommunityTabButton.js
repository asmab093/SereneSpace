import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CommunityTabButton = ({ title, onPress, isSelected }) => {
  // Gradient used for the selected state
  const GRADIENT_COLORS = ["#7B61FF", "#78469A"];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.buttonWrapper}
    >
      {isSelected ? (
        // Selected: Show gradient background
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.selectedContainer}
        >
          <Text style={styles.selectedText}>{title}</Text>
        </LinearGradient>
      ) : (
        // Unselected: White background with purple border
        <View style={styles.defaultContainer}>
          <Text style={styles.defaultText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 1, // Allows buttons to take equal space
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
    height: 40,
  },
  // --- Selected Styles (Gradient) ---
  selectedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  selectedText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Quicksand-Bold",
  },
  // --- Default Styles (Bordered White) ---
  defaultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EBE5F7",
  },
  defaultText: {
    fontSize: 14,
    color: "#512DA8", // Purple text
    fontFamily: "Quicksand-SemiBold",
  },
});

export default CommunityTabButton;
