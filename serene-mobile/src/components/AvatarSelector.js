import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";

const AvatarSelector = ({ avatarSource, isSelected, onSelect, avatarId }) => {
  return (
    <TouchableOpacity
      style={[
        styles.avatarContainer,
        isSelected && styles.avatarSelected, // Apply highlight if selected
      ]}
      onPress={() => onSelect(avatarId)}
      activeOpacity={0.7}
    >
      <Image
        source={avatarSource}
        style={styles.avatarImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "transparent", // Default transparent border
  },
  avatarSelected: {
    borderColor: "#7E57C2", // Purple border for highlight
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
});

export default AvatarSelector;
