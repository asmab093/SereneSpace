import React, { useContext, useState } from "react";
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,Modal,Alert,TextInput,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Toast from "react-native-toast-message";
import CustomButton from "../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BackIcon = require("../assets/BackIcon.png");

// --- Reusable Row Component ---
// Added 'isEditable' prop to control the button and styling
const AccountDetailRow = ({
  label,
  value,
  onPress,
  valueSubText,
  isEditable = true,
}) => (
  <View style={[styles.detailRow, !isEditable && styles.disabledRow]}>
    <View style={styles.textColumn}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, !isEditable && styles.disabledValue]}>
        {value}
      </Text>
      {valueSubText && <Text style={styles.subText}>{valueSubText}</Text>}
    </View>

    {/* ✅ Only show the Edit button if isEditable is true */}
    {isEditable && (
      <TouchableOpacity style={styles.editButton} onPress={onPress}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    )}
  </View>
);

const AccountSecurityScreen = ({ navigation }) => {
   const insets = useSafeAreaInsets();
  // ✅ 1. Get the dynamic user data from Context
  const { user, setUser, login, API_URL } = useContext(AuthContext);

  // States for Modals
  const [nameModal, setNameModal] = useState(false);
  const [passModal, setPassModal] = useState(false);

  //ADD THESE: Loading states for buttons
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [isPassLoading, setIsPassLoading] = useState(false);

  // States for Inputs
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- Update Name Logic ---
  const handleUpdateName = async () => {
    if (!newUsername.trim())
      return Alert.alert("Error", "Username cannot be empty");
    setIsNameLoading(true); // ✅ Start Loading
    try {
      const res = await axios.put(`${API_URL}/auth/update-username`, {
        userId: user._id,
        newUsername,
      });
      if (res.data.success) {
        // Create the updated user object. We spread the existing user and overwrite the username
        const updatedUser = { ...user, username: newUsername };
        //Use login() to save to AsyncStorage (Disk)
        await login(updatedUser);
        setNameModal(false);
        Toast.show({
          type: "success",
          text1: "Name Updated! ✅",
          position: "bottom",
          visibilityTime: 3000,
        });
      }
    } catch (err) {
      console.log("error in catch is", err.resonse);
      Alert.alert("Error", "Could not update username.");
    }finally {
    setIsNameLoading(false); // ✅ Stop Loading
  }
  };

  // --- Update Password Logic ---
  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword)
      return Alert.alert("Error", "Fill all fields");
    setIsPassLoading(true); // ✅ Start Loading
    try {
      const res = await axios.put(`${API_URL}/auth/update-password`, {
        userId: user._id,
        oldPassword,
        newPassword,
      });
      if (res.data.success) {
        setPassModal(false);
        setOldPassword("");
        setNewPassword("");
        Toast.show({
          type: "success",
          text1: "Password Secured! 🛡️",
          position: "bottom",
          visibilityTime: 3000,
        });
      }
    } catch (err) {
      console.log("error in catch is", err.resonse);
      Alert.alert("Error", err.response?.data?.message || "Update failed");
    }finally {
    setIsPassLoading(false); // ✅ Stop Loading
  }
  };

  return (
    <View style={styles.container}>
      {/* ✅ 1. Header Section (Was missing from your return) */}
      <View  style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={BackIcon}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account & Security</Text>
      </View>

      {/* ✅ 2. ScrollView to hold the rows */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AccountDetailRow
          label="Username"
          value={user?.username}
          onPress={() => setNameModal(true)}
        />
        <AccountDetailRow
          label="Email Address"
          value={user?.email}
          isEditable={false}
        />
        <AccountDetailRow
          label="Password"
          value="••••••••••••"
          onPress={() => setPassModal(true)}
        />
      </ScrollView>

      {/* USERNAME MODAL */}
      <Modal visible={nameModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Username</Text>
            <TextInput
              style={styles.input}
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username"
            />
            <CustomButton title={isNameLoading ? "Saving..." : "Save Name"} 
            onPress={handleUpdateName}
            disabled={isNameLoading} //Disable button while saving
             />
            <TouchableOpacity onPress={() => setNameModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PASSWORD MODAL */}
      <Modal visible={passModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Old Password"
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="New Password"
              onChangeText={setNewPassword}
            />
            <CustomButton
              title={isPassLoading ? "Updating..." : "Update Password"}
              onPress={handleUpdatePassword}
              disabled={isPassLoading}
            />
            <TouchableOpacity onPress={() => setPassModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#512DA8",
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom: 20,
    padding: 10,
    fontFamily: "Quicksand-Regular",
  },
  cancelText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    color: "#888",
    fontFamily: "Quicksand-Bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 15,
    backgroundColor: "#D7D9F4",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 8,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#512DA8",
  },
  headerTitle: {
    fontSize: 18,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginLeft: 5,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
  },
  textColumn: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#636060",
    fontFamily: "Quicksand-Medium",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editButtonText: {
    fontSize: 14,
    color: "#9370DB", // Purple color for Edit button
    fontFamily: "Quicksand-SemiBold",
  },
  //Grey out styles
  disabledValue: { color: "#AAA" }, // Makes the text grey
  disabledRow: { opacity: 0.8 }, // Optional: slightly fades the whole row
});

export default AccountSecurityScreen;
