import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const ForgotPasswordScreen = ({ navigation }) => {
  const { API_URL } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP/New Password
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    setLoading(true);
    try {
      // ✅ Added backticks around the URL string here
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      if (res.data.success) {
        Alert.alert("Success", "Check your email/console for the OTP.");
        setStep(2);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      // ✅ Added backticks around the URL string here
      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (res.data.success) {
        Alert.alert("Success", "Password updated! Please Sign In.");
        navigation.navigate("SignIn");
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#D7D9F4", "#F4F3FF"]} style={styles.container}>
      <Text style={styles.title}>
        {step === 1 ? "Forgot Password" : "Reset Password"}
      </Text>

      {step === 1 ? (
        <View style={styles.content}>
          <InputField
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
          />
          <CustomButton
            title={loading ? "Sending..." : "Send OTP"}
            onPress={handleRequestOTP}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <InputField
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <InputField
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <CustomButton
            title={loading ? "Resetting..." : "Reset Password"}
            onPress={handleResetPassword}
          />
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontFamily: "Quicksand-Bold",
    color: "#512DA8",
    textAlign: "center",
    marginBottom: 30,
  },
  content: { width: "100%" },
});

export default ForgotPasswordScreen;