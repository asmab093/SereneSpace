import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const QuestionnaireNavButton = ({ title, onPress, type = "next" }) => {
  const isDarkStyle = type === "skip" || type === "prev";

  const buttonStyle = [
    styles.buttonBase,
    isDarkStyle ? styles.skipButton : styles.nextButton,
  ];

  const textStyle = isDarkStyle ? styles.skipButtonText : styles.nextButtonText;

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.8}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    width: "35%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  skipButton: {
    backgroundColor: "#4e5b6fff",
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
  skipButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
  },
  nextButton: {
    backgroundColor: "#7E57C2",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
  },
});

export default QuestionnaireNavButton;
