import React, { useState, useContext } from "react";
import {View,Text,StyleSheet,ScrollView,Image,Alert,TouchableOpacity,Modal} from "react-native";
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

const countryData = [
  { label: "Pakistan (+92)", value: "+92" },
  { label: "USA (+1)", value: "+1" },
  { label: "UK (+44)", value: "+44" },
  { label: "India (+91)", value: "+91" },
  { label: "UAE (+971)", value: "+971" },
];

const AddContactScreen = ({ route, navigation }) => {
  const { API_URL, setUser, user,login } = useContext(AuthContext); 
  // Use optional chaining for userId to prevent crashes on reload
  const { userId, existingContact } = route?.params || {}; // Get existingContact
  const [name, setName] = useState(existingContact?.name || "");
  const [relation, setRelation] = useState(existingContact?.relation || null);
  const [countryCode, setCountryCode] = useState(existingContact?.countryCode || null);
  const [phone, setPhone] = useState(existingContact?.phone || "");

  const [isFocus, setIsFocus] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleAddContact = async () => {
    if (!name.trim() || !relation || !countryCode || !phone.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    //FIX 2: Ensure we have a valid ID even if route.params was lost
    const activeUserId = userId || user?._id;

    try {
      const response = await axios.put(`${API_URL}/auth/add-contact`, {
        userId:activeUserId,
        contactName: name,
        relation,
        countryCode,
        contactPhone: phone,
      });

     if (response.data.success) {
        // ✅ THE FIX: Create the full updated user object
        const updatedUser = { 
          ...user, 
          hasAddedContact: true, 
          emergencyContact: { name, relation, countryCode, phone } 
        };
        // This ensures the new contact is saved to AsyncStorage (Disk)
        await login(updatedUser);
        //DYNAMIC TOAST LOGIC >existCon{name:"ali",rel:"bro"}, object is truthy, ! of truth is false, ! of F=T, so if isUpdating is True?
            const isUpdating = !!existingContact; // true if data was passed from Profile

            Toast.show({
                type: "success",
                text1: isUpdating ? "Updated! ✅" : "Success! 🌱",
                text2: isUpdating 
                    ? "Emergency contact updated successfully." 
                    : "Emergency contact added successfully.",
                position: "bottom",
                visibilityTime: 3000,
            });
        //Redirect Logic: If we came from Profile, go back to Profile
        if (existingContact) {
          navigation.goBack(); // Takes user back to Profile
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
      {/* ✅ 2. Information Icon Button */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setShowInfo(true)}
      >
        <Info size={28} color="#512DA8" />
      </TouchableOpacity>

      {/* ✅ 3. Information Modal */}
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

          {/* ✅ Relation Dropdown */}
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

          {/* ✅ Country Code Dropdown */}
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
              onChange={(item) => setCountryCode(item.value)}
            />
          </View>

          <InputField
            IconSource={ContactIcon}
            placeholder="Contact no..."
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
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
    top: 50,
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
    fontSize: 22,
    fontWeight: "600",
    color: "#512DA8",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Quicksand-Bold",
  },
  inputBlock: { width: "100%", marginBottom: 20 },

  // Styles for the Dropdowns
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginVertical: 8,
    // Shadow for iOS/Android
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
