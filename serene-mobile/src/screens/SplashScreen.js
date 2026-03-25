import React, { useEffect, useRef, useContext } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";

const SplashScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const authChecked = authContext?.authChecked;

  const translateYAnim = useRef(new Animated.Value(-300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // --- Animation Sequence ---
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      //Only navigate if App.js says it's done checking the disk
      if (authChecked) {
        console.log(
          "🔍 Navigation Decision: Auth is checked. User is:",
          user?.username || "Guest",
        );
        if (user) {
          //if user obj exists in context
          navigation.replace("Home");
        } else {
          navigation.replace("SignUp");
        }
      } else {
        // If auth isn't checked yet, wait another 500ms and try again
        console.log("⏳ Still waiting for App.js to finish disk read...");
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigation, user, authChecked]); // ✅ Depend on authChecked

  const animatedLogoStyle = {
    opacity: opacityAnim,
    transform: [{ translateY: translateYAnim }],
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      style={styles.container}
    >
      <Animated.Image
        source={require("../assets/dove-logo.png")}
        style={[styles.logo, animatedLogoStyle]}
      />
      <Text style={styles.appName}>Serene Space</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20, // IMPORTANT: The initial off-screen position is set by translateYAnim = -300.
  },
  appName: {
    fontSize: 30,
    fontFamily: "Quicksand-Bold",
    fontStyle: "italic",
    color: "#78469A",
    marginBottom: 10,
  },
});

export default SplashScreen;
