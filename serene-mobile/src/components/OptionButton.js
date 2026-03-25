import React, { useState } from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const OptionButton = ({
  iconSource,
  label,
  value,
  selectedValue,
  onSelect,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const isSelected = selectedValue === value;

  const buttonStyle = [
    styles.buttonBase,
    isSelected && styles.buttonSelected,
    isPressed && styles.buttonPressed,
  ];

  const handlePress = () => {
    onSelect(value);
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
    >
      <Image
        source={iconSource}
        style={[styles.icon, { tintColor: isSelected ? "#512DA8" : "#7E57C2" }]}
        resizeMode="contain"
      />
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  buttonSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#B0C4DE",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    color: "#555",
    fontFamily: "Quicksand-SemiBold",
  },
  textSelected: {
    color: "#000",
    // fontWeight: "bold",
  },
});

export default OptionButton;
