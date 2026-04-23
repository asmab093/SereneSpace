import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";

const UserIcon = require("../assets/Username.png");
const MailIcon = require("../assets/Email.png");
const LockIcon = require("../assets/lock.png");
const EyeOpen = require("../assets/eye-open.png");
const EyeClosed = require("../assets/eye-close.png");

const SignUpScreen = ({ navigation }) => {
  // ✅ Get the 'login' helper instead of manual setStates
  const { API_URL, login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const handleCreateAccount = async () => {
    setError("");

    //Basic Validations
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // 🚀 2. API CALL
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      //response.data >{"_id": "69c2c", "createdAt": "2026-0...", "email", "hasAddedContact": false, "success": true, "token": "eyJ", "username": "zara"}
      if (response.data.success) {
        // USE LOGIN HELPER> This is the "Magic" line. It calls your AuthContext function which:
        // - Sets setUser(response.data) // - Sets setToken(response.data.token)
        // - Saves to AsyncStorage.setItem("userData", ...)
        await login(response.data);
        const userId = response.data._id;
        // Use a slight timeout or navigate immediately
        // replace ensures they cannot 'Back' into the SignUp screen
        navigation.replace("AddContact", { userId: userId });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <ScrollView>
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      style={styles.container}
    >
      {/* --- Top Section --- */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/dove-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Start your journey with us!</Text>

        <View style={styles.inputBlock}>
          <InputField
            IconSource={UserIcon}
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
          />

          <InputField
            IconSource={MailIcon}
            placeholder="Email Address"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />

          <InputField
            IconSource={LockIcon}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={!isPasswordVisible}
            RightIcon={isPasswordVisible ? EyeOpen : EyeClosed}
            onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />

          <InputField
            IconSource={LockIcon}
            placeholder="Confirm Password"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={!isConfirmVisible}
            RightIcon={isConfirmVisible ? EyeOpen : EyeClosed}
            onRightIconPress={() => setIsConfirmVisible(!isConfirmVisible)}
          />
        </View>
      </View>

      {/* ✅ 1. This spacer pushes everything below it to the bottom */}
      <View style={styles.spacer} />

      {/* --- Bottom Section --- */}
      <View style={styles.bottomBlock}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <CustomButton
          title={loading ? "Creating Account..." : "Create Account"}
          onPress={handleCreateAccount}
          disabled={loading}
        />

        <View style={styles.signInLinkContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
   // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    // paddingBottom: 30 is handled by the bottomBlock marginBottom
  },
  topSection: {
    width: "100%",
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    color: "#512DA8",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 15,
    fontFamily: "Quicksand-Bold",
  },
  inputBlock: {
    width: "100%",
  },
  // ✅ This makes the middle area grow, pushing the button down
  spacer: {
    flex: 1,
  },
  bottomBlock: {
    width: "100%",
    alignItems: "center",
    marginBottom: 55,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    width: "100%",
    fontFamily: "Quicksand-SemiBold",
  },
  signInLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0, // Added some space between button and link,
    // borderWidth:1,
  },
  signInText: {
    color: "#555",
    fontSize: 15,
    fontFamily: "Quicksand-Regular",
  },
  signInLink: {
    color: "#7E57C2",
    fontSize: 15,
    fontFamily: "Quicksand-SemiBold",
  },
});

export default SignUpScreen;
