import React, { useState, useContext } from "react";
import {View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Modal} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dropdown } from "react-native-element-dropdown";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { Info } from "lucide-react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Toast from 'react-native-toast-message'; 

const UserIcon = require("../assets/Username.png");
const LinkIcon = require("../assets/RelationIcon.png");
const PhoneIcon = require("../assets/CountryCode.png");
const ContactIcon = require("../assets/ContactIcon.png");
const HeaderGraphic = require("../assets/AddUser.png");

// 📊 Data for Dropdowns
const relationData = [
  { label: "Sister", value: "Sister" },
  { label: "Brother", value: "Brother" },
  { label: "Mother", value: "Mother" },
  { label: "Father", value: "Father" },
  { label: "Spouse", value: "Spouse" },
  { label: "Friend", value: "Friend" },
];

// 🌍 Expanded Country Data with specific digit limits
const countryData = [
  { label: "Pakistan (+92)", value: "+92", maxLength: 10 }, // ⬅️ UPDATED: Max length is now 10
  { label: "USA/Canada (+1)", value: "+1", maxLength: 10 },
  { label: "UK (+44)", value: "+44", maxLength: 11 },
  { label: "India (+91)", value: "+91", maxLength: 10 },
  { label: "UAE (+971)", value: "+971", maxLength: 9 },
  { label: "Australia (+61)", value: "+61", maxLength: 9 },
  { label: "Saudi Arabia (+966)", value: "+966", maxLength: 9 },
  { label: "Germany (+49)", value: "+49", maxLength: 11 },
  { label: "France (+33)", value: "+33", maxLength: 9 },
  { label: "China (+86)", value: "+86", maxLength: 11 },
  { label: "Japan (+81)", value: "+81", maxLength: 10 },
  { label: "South Korea (+82)", value: "+82", maxLength: 10 },
  { label: "Bangladesh (+880)", value: "+880", maxLength: 10 },
  { label: "Malaysia (+60)", value: "+60", maxLength: 10 },
  { label: "South Africa (+27)", value: "+27", maxLength: 9 },
  { label: "Other", value: "other", maxLength: 15 }, 
];

const AddContactScreen = ({ route, navigation }) => {
  const { API_URL, setUser, user, login } = useContext(AuthContext); 
  const { userId, existingContact } = route?.params || {}; 
  
  const [name, setName] = useState(existingContact?.name || "");
  const [relation, setRelation] = useState(existingContact?.relation || null);
  const [countryCode, setCountryCode] = useState(existingContact?.countryCode || null);
  const [phone, setPhone] = useState(existingContact?.phone || "");

  const [isFocus, setIsFocus] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // 🧠 Dynamically calculate the max length based on the selected country
  const selectedCountry = countryData.find(c => c.value === countryCode);
  const currentMaxLength = selectedCountry ? selectedCountry.maxLength : 15;

  // 🚨 NEW: Actively block leading zeros and non-numbers in real-time
  const handlePhoneChange = (text) => {
    let cleanedText = text.replace(/[^0-9]/g, ""); // Keep only numbers
    
    // If they try to type a 0 as the very first digit, delete it immediately
    if (cleanedText.startsWith("0")) {
      cleanedText = cleanedText.substring(1);
    }
    
    setPhone(cleanedText);
  };

  const handleAddContact = async () => {
    if (!name.trim() || !relation || !countryCode || !phone.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    // Optional Validation: Ensure they hit the exact length requirement
    if (phone.length !== currentMaxLength && countryCode !== "other") {
        Alert.alert("Invalid Length", `Phone numbers for this country must be exactly ${currentMaxLength} digits.`);
        return;
    }

    const activeUserId = userId || user?._id;

    try {
      const response = await axios.put(`${API_URL}/auth/add-contact`, {
        userId: activeUserId,
        contactName: name,
        relation,
        countryCode,
        contactPhone: phone, 
      });

      if (response.data.success) {
        const updatedUser = { 
          ...user, 
          hasAddedContact: true, 
          emergencyContact: { name, relation, countryCode, phone } 
        };
        
        await login(updatedUser);
        
        const isUpdating = !!existingContact; 

        Toast.show({
            type: "success",
            text1: isUpdating ? "Updated! ✅" : "Success! 🌱",
            text2: isUpdating 
                ? "Emergency contact updated successfully." 
                : "Emergency contact added successfully.",
            position: "bottom",
            visibilityTime: 3000,
        });

        if (existingContact) {
          navigation.goBack(); 
        } else {
          navigation.replace("AuthSuccess", { mode: "signup" });
        }
      }
    } catch (err) {
      console.log("AddContact Error:", err.message);
      Alert.alert("Error", "Could not save contact.");
    }
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setShowInfo(true)}
      >
        <Info size={28} color="#512DA8" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showInfo}
        animationType="fade"
        onRequestClose={() => setShowInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Why we need this? 🌱</Text>
            <Text style={styles.modalText}>
              Serene Space is committed to your safety. We require an emergency
              contact to ensure that if you are ever in extreme distress or
              indicate a crisis, a trusted person can be notified immediately.
            </Text>
            <Text style={styles.modalSubText}>
              • We only use this in emergency situations.{"\n"}• Your contact is
              stored securely and privately.{"\n"}• Our chatbot uses this data
              to send SOS alerts if needed.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInfo(false)}
            >
              <Text style={styles.closeButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={HeaderGraphic}
          style={styles.headerGraphic}
          resizeMode="contain"
        />
        <Text style={styles.title}>{existingContact ? "Update Emergency Contact" : "Add Emergency Contact"}</Text>

        <View style={styles.inputBlock}>
          <InputField
            IconSource={UserIcon}
            placeholder="Enter Name..."
            value={name}
            onChangeText={setName}
          />

          <View style={styles.dropdownContainer}>
            <Image source={LinkIcon} style={styles.inputIcon} />
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "#512DA8" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={relationData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Relation"
              value={relation}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setRelation(item.value);
                setIsFocus(false);
              }}
            />
          </View>

          <View style={styles.dropdownContainer}>
            <Image source={PhoneIcon} style={styles.inputIcon} />
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "#512DA8" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={countryData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Country Code"
              value={countryCode}
              onChange={(item) => {
                setCountryCode(item.value);
                setPhone(""); 
              }}
            />
          </View>

          <InputField
            IconSource={ContactIcon}
            placeholder={`Contact no. (Max ${currentMaxLength} digits)`}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={handlePhoneChange} // ⬅️ UPDATED: using the new zero-blocker function
            maxLength={currentMaxLength} 
          />
        </View>

        <View style={styles.bottomBlock}>
          <CustomButton title="Add to Contacts" onPress={handleAddContact} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoButton: {
    position: "absolute",
    top: 30,
    right: 25,
    zIndex: 10,
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
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: "#512DA8",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Quicksand-Bold",
  },
  modalText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    textAlign: "center",
    fontFamily: "Quicksand-SemiBold",
  },
  modalSubText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 15,
    lineHeight: 20,
    fontFamily: "Quicksand-Medium",
  },
  closeButton: {
    backgroundColor: "#7a64e8ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize:16,
    color: "#FFF",
    fontFamily: "Quicksand-Bold",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 90,
    paddingBottom: 30,
  },
  headerGraphic: { width: 250, height: 150, marginBottom: 30 },
  title: {
    fontWeight: "600",
    color: "#512DA8",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Quicksand-Bold",
  },
  inputBlock: { width: "100%", marginBottom: 20 },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "#999",
    resizeMode: "contain",
  },
  dropdown: {
    flex: 1,
    height: 50,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9E9E9E",
    fontFamily: "Quicksand-Medium",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-Medium",
  },
  bottomBlock: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
});

export default AddContactScreen;