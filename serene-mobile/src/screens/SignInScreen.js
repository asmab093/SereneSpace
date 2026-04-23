import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const EyeOpen = require("../assets/eye-open.png");
const EyeClosed = require("../assets/eye-close.png");
const MailIcon = require("../assets/Email.png");
const LockIcon = require("../assets/lock.png");

const SignInScreen = ({ navigation }) => {
  const { API_URL, setUser, setToken, user, logout, login } =
    useContext(AuthContext);
  //its a connectivity test. It runs automatically as soon as the screen
  //  is loaded to make sure the mobile app can actually "talk" to your
  //  backend server.
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await axios.get(`${API_URL}/test`);
        console.log("🟢 Connection Success:", res.data.message);
        console.log("Current User Data:", JSON.stringify(user, null, 2));
      } catch (err) {
        console.log("🔴 Connection Failed:", err.message);
      }
    };
    checkServer();
  }, []); // The empty array means "Only run once when the screen opens"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false); // Added to stop loading spinner
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      console.log("response is", response.data);

      if (response.data.success) {
        console.log(response.data);
        // This saves 'response.data{entire user object}' to both State and AsyncStorage
        await login(response.data);
        // Use the specific boolean from the object to decide where to go
        if (response.data.hasAddedContact) {
          navigation.replace("AuthSuccess", { mode: "login" });
        } else {
          navigation.replace("AddContact", { userId: response.data._id });
        }
      }
    } catch (err) {
      console.log("FULL ERROR OBJECT:", err);
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Image source={require("../assets/dove-logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.inputBlock}>
        <InputField
          IconSource={MailIcon}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          IconSource={LockIcon}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          RightIcon={isPasswordVisible ? EyeOpen : EyeClosed}
          onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
        />
      </View>

      <View style={styles.spacer} />

      <View style={styles.bottomBlock}>
        <CustomButton
          title={loading ? "Signing In..." : "Sign In"}
          onPress={handleSignIn}
          disabled={loading} // Disable during request
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          style={styles.signUpTouch}
        >
          <Text style={styles.signUpText}>
            Don't have an account?
            <Text style={styles.signUpLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 30, // Controls the margin below the final elements
  },

  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center", // Center the logo horizontally
    marginTop: 15,
    // marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#512DA8",
    marginBottom: 40,
    marginTop: 15,
    fontFamily: "Quicksand-Bold",
    alignSelf: "center",
  },

  inputBlock: {
    width: "100%",
  },
  signUpText: {
    color: "#555",
    fontSize: 15,
    marginTop: 10,
    fontFamily: "Quicksand-Regular",
  },
  spacer: {
    flex: 1,
  },

  bottomBlock: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },

  forgotPasswordText: {
    color: "#7E57C2",
    fontSize: 14,
    textAlign: "center",
    marginTop: 0,
    fontFamily: "Quicksand-SemiBold",
  },
  signUpLink: {
    color: "#7E57C2",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Quicksand-SemiBold",
  },
});

export default SignInScreen;
