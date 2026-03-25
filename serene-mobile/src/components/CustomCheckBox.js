import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Assuming you have expo vector icons installed

const CustomCheckbox = ({ isChecked, onToggle }) => {
  // Determine the style based on state
  const boxStyle = isChecked ? styles.checkboxChecked : styles.checkboxDefault;

  return (
    <TouchableOpacity style={boxStyle} onPress={onToggle} activeOpacity={0.8}>
      {isChecked && <MaterialIcons name="check" size={18} color="#512DA8" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Default (Unchecked) State
  checkboxDefault: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#9370DB", // Purple border
    backgroundColor: "#FFFFFF", // White background
    alignItems: "center",
    justifyContent: "center",
  },
  // Checked State
  checkboxChecked: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#9370DB",
    backgroundColor: "#D7D9F4", // Light purple background
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomCheckbox;
