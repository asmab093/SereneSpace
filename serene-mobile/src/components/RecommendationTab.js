import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ⬅️ Must be imported

const RecommendationTab = ({ title, onPress, type, selectedType }) => {
  const isSelected = type === selectedType;

  // We define text styles here, but the background logic is in the JSX return.
  const textStyle = [
    styles.textBase,
    isSelected ? styles.textSelected : styles.textDefault,
  ];

  return (
    <TouchableOpacity
      style={styles.tabBase}
      onPress={() => onPress(type)}
      activeOpacity={0.7}
    >
      {isSelected ? (
        // 💡 RENDER LINEAR GRADIENT WHEN SELECTED
        <LinearGradient
          // Purple gradient colors
          colors={["#7B61FF", "#78469A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }} // Vertical gradient
          style={styles.gradientFill}
        >
          <Text style={textStyle}>{title}</Text>
        </LinearGradient>
      ) : (
        // RENDER STANDARD VIEW WHEN NOT SELECTED
        <View style={styles.tabDefaultView}>
          <Text style={textStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBase: {
    // Outer wrapper controls overall size/margin and border for the unselected state
    borderRadius: 8,
    marginHorizontal: 2,
    minWidth: 100,
    overflow: "hidden",
    // Defining padding and height constraints to ensure Gradient/View fills correctly
    height: 35, // Fixed height for visual consistency
    // flex: 1, // Allows equal spacing between tabs
    borderWidth: 1,
    borderColor: "#EBE5F7",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // For Android
  },

  // 💡 NEW STYLE: Used as the background for the LinearGradient when selected
  gradientFill: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    // Padding/margins are handled by the outer tabBase
  },

  // 💡 NEW STYLE: Used as the white background when unselected
  tabDefaultView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  // --- Text Styles ---
  textBase: {
    fontSize: 14,
    fontFamily: "Quicksand-Bold",
  },
  // Default (unselected) text color
  textDefault: {
    color: "#512DA8",
  },
  // Selected text color (must be white for the gradient background)
  textSelected: {
    color: "#FFFFFF",
  },
});

export default RecommendationTab;
