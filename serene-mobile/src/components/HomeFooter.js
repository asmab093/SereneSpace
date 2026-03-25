import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
// 💡 Import useRoute to detect which screen is active (optional but good for reuse)
import { useRoute } from '@react-navigation/native';

const HomeIcon = require("../assets/HomeIcon.png");
const ChatIcon = require("../assets/BotIcon.png");
const StatsIcon = require("../assets/StatsIcon.png");
const ProfileIcon = require("../assets/ProfileIcon.png");

// 💡 navigation prop is passed from HomeScreen.js
const HomeFooter = ({ navigation }) => {
const route = useRoute();

  const handleNavigation = (key) => {
    if (key === "Home") {
      navigation.navigate("Home");
    } else if (key === "Chat") {
      navigation.navigate("ChatBot"); // ✅ Matches App.js name
    } else if (key === "Stats") {
      navigation.navigate("MoodStats"); // ✅ Matches App.js name
    } else if (key === "Profile") {
      navigation.navigate("Profile"); // ✅ Matches App.js name
    }
  };

  const navItems = [
    { name: "Home", icon: HomeIcon, key: "Home" },
    { name: "Chat", icon: ChatIcon, key: "Chat" },
    { name: "Stats", icon: StatsIcon, key: "Stats" },
    { name: "Profile", icon: ProfileIcon, key: "Profile" },
  ];

  return (
    <View style={styles.footerContainer}>
      {navItems.map((item) => {
        const isSelected = 
          (item.key === "Home" && route.name === "Home") ||
          (item.key === "Chat" && route.name === "ChatBot") ||
          (item.key === "Stats" && route.name === "MoodStats") ||
          (item.key === "Profile" && route.name === "Profile");

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => handleNavigation(item.key)}
            activeOpacity={0.7}
          >
            <Image
              source={item.icon}
              style={[
                styles.navIcon,
                isSelected ? styles.selectedIcon : null,
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.navText,
                isSelected ? styles.selectedText : null,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60, // Slightly taller for better thumb reach
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EBE5F7",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#A3A3A3", 
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: "#A3A3A3",
    fontFamily: "Quicksand-Bold",
  },
  selectedIcon: {
    tintColor: "#7E57C2", 
  },
  selectedText: {
    color: "#7E57C2",
    fontFamily: "Quicksand-Bold",
  },
});

export default HomeFooter;