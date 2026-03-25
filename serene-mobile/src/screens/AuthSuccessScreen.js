import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../components/CustomButton"; 
const SuccessIcon = require("../assets/AuthSuccess.png"); 

const AuthSuccessScreen = ({route, navigation }) => {
  //// mode will be 'signup' from AddContact or 'login' from SignIn
  const { mode } = route.params || { mode: 'login' };
  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.contentBlock}>
        <Image
          source={SuccessIcon}
          style={styles.successIcon}
          resizeMode="contain"
        />

        <Text style={styles.title}>{mode === 'signup' ? "Welcome Aboard!" : "Authentication Successful!"}</Text>

        <CustomButton title="Continue to Home" onPress={() => navigation.navigate("Home")} />

        {/* <CustomButton title="Add Emergency Contacts" onPress={() => navigation.navigate("AddContact")} /> */}
      </View>
    </LinearGradient> // Collapse closing tags to one line or ensure they are properly aligned.
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  contentBlock: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  successIcon: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    color: "#512DA8",
    textAlign: "center",
    marginBottom: 60, // Space before the button
    fontFamily: "Quicksand-Bold", // Using the loaded font
  },
});

export default AuthSuccessScreen;
