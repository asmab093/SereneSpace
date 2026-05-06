import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

// Asset Imports
const BackgroundLeaves = require("../assets/MenuBackgroundLeaves.png");
const CloseIcon = require("../assets/CrossIcon.png");
const TermsIcon = require("../assets/TermsIcon.png");
const PrivacyIcon = require("../assets/PrivacyPolicyIcon.png");
const ContactIcon = require("../assets/ContactSupportIcon.png");
const ContactIcon2 = require("../assets/ContactSupportIcon2.png");
const LogoutIcon = require("../assets/LogoutIcon.png");

// Custom component for menu items
const MenuItem = ({ icon, text, onPress, isLogout = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Image
      source={icon}
      style={[styles.menuIcon, isLogout && styles.logoutIcon]}
      resizeMode="contain"
    />
    <Text style={[styles.menuText, isLogout && styles.logoutText]}>{text}</Text>
  </TouchableOpacity>
);

const CustomDrawer = ({ isVisible, onClose, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { logout, setAuthChecked, user } = useContext(AuthContext);

  // 1. Handle Slide Animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  // 2. Updated Logout Logic
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive", // Red text on iOS
        onPress: async () => {
          onClose(); // Close the drawer UI
          // 2. Clear Disk (AsyncStorage) and Global State
          await logout();
          // 3. Reset the whole app stack to SignIn
          // Using 'reset' ensures they can't swipe back into the Home screen
          navigation.reset({
            index: 0,
            routes: [{ name: "SignIn" }],
          });
          // 4. Reset the splash check so the next login sees the dove
          setAuthChecked(false);
        },
      },
    ]);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      {/* Dark background overlay that closes drawer on tap */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        activeOpacity={1}
      />

      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.headerSection}>
          <Image
            source={BackgroundLeaves}
            style={styles.headerBackground}
            resizeMode="cover"
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Image
              source={CloseIcon}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.greetingText}>
              Hi, {user?.username || "Friend"}!
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.aboutUsHeader}>About Us</Text>

          <MenuItem
            icon={TermsIcon}
            text="Terms & Conditions"
            onPress={() => {
              onClose(); // Close drawer first
              navigation.navigate("Terms");
            }}
          />
          <MenuItem
            icon={PrivacyIcon}
            text="Privacy Policy"
            onPress={() => {
              onClose(); // Close drawer first
              navigation.navigate("Privacy");
            }}
          />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsContactOpen(!isContactOpen)}
          >
            <Image
              source={ContactIcon}
              style={styles.menuIcon}
              resizeMode="contain"
            />
            <Text style={styles.menuText}>Contact Support</Text>

            <Image
              source={ContactIcon2}
              style={[
                styles.dropdownArrow,
                isContactOpen && styles.dropdownArrowOpen,
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {isContactOpen && (
            <View style={styles.contactDropdown}>
              <Text style={styles.contactEmailText}>Email</Text>
              <Text style={styles.contactEmailValue}>
                support@serenehealth.com
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footerSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Image
              source={LogoutIcon}
              style={styles.logoutIcon}
              resizeMode="contain"
            />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <Text style={styles.appVersionText}>App Version: 1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (existing styles like overlay, drawerContainer, headerSection, etc.) ...
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 10,
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#FFFFFF",
    zIndex: 11,
  },
  headerSection: {
    height: 180,
    backgroundColor: "#F7F4FD",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "115%",
    height: "135%",
    opacity: 0.8,
  },
  closeButton: {
    position: "absolute",
    top: 25,
    right: 10,
    padding: 10,
    zIndex: 12,
  },
  closeIcon: {
    width: 25,
    height: 25,
    tintColor: "#512DA8",
  },
  profileInfo: {
    marginTop: 140,
    alignItems: "flex-start",
  },
  greetingText: {
    marginTop: -60,
    fontSize: 18,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
  },

  // --- Menu Items Section ---
  menuSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  aboutUsHeader: {
    fontSize: 14,
    // fontWeight: "bold",
    color: "#A3A3A3",
    fontFamily: "Quicksand-Bold",
    marginBottom: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    tintColor: "#A3A3A3",
  },
  menuText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Quicksand-Medium",
    // 💡 Allows arrow to be pushed to the far right
    flex: 1,
  },

  // 💡 NEW STYLES FOR DROPDOWN ARROW
  dropdownArrow: {
    width: 15,
    height: 15,
    tintColor: "#555", // Default color for the chevron
    transform: [{ rotate: "0deg" }], // Default direction (down)
    marginLeft: 10,
  },
  dropdownArrowOpen: {
    transform: [{ rotate: "180deg" }], // Rotates when open
  },

  // 💡 NEW STYLES FOR DROPDOWN CONTENT
  contactDropdown: {
    paddingVertical: 10,
    paddingHorizontal: 35, // Aligns content correctly below the Contact Support icon
    backgroundColor: "#e7e9f9ff", // Light background for the dropdown section
  },
  contactEmailText: {
    fontSize: 12,
    color: "#A3A3A3",
    fontFamily: "Quicksand-Regular",
    marginBottom: 2,
  },
  contactEmailValue: {
    fontSize: 14,
    color: "#7E57C2", // Purple color for the email address
    fontFamily: "Quicksand-SemiBold",
  },

  // --- Footer Section ---
  footerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    // borderWidth:1,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    tintColor: "#E91E63",
  },
  logoutText: {
    fontSize: 16,
    color: "#E91E63",
    fontFamily: "Quicksand-SemiBold",
  },
  appVersionText: {
    fontSize: 12,
    color: "#A3A3A3",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Quicksand-Regular",
  },
});

export default CustomDrawer;
