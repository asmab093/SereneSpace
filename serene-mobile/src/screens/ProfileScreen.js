import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter";
import { AuthContext } from "../context/AuthContext";
import { useIsFocused } from "@react-navigation/native"; // ✅ Add this import

const BackIcon = require("../assets/BackIcon.png");
const BackgroundLeaves = require("../assets/ProfileBackgroundLeaves.png");
const BioIcon = require("../assets/AnonymousUser.png");
const ContactEditIcon = require("../assets/ContactEditIcon.png");
const SecurityIcon = require("../assets/AccountsSecurityIcon.png");
const RightArrow = require("../assets/RightArrowIcon.png");
const LogOutIcon = require("../assets/LogoutIcon.png");

// 💡 navigation is the only prop needed now
const ProfileScreen = ({ navigation }) => {
  const { user, logout, setAuthChecked } = useContext(AuthContext);
  const isFocused = useIsFocused(); // ✅ Detects when user lands on this screen

  // 1. Map IDs to Assets (Make sure this matches CommunityProfileCreation.js)
  const avatarMap = {
    1: require("../assets/FlowerAvatar.png"),
    2: require("../assets/PersonAvatar.png"),
    3: require("../assets/flower.png"),
    4: require("../assets/cat.png"),
    5: require("../assets/bear.png"),
    6: require("../assets/woman.png"),
    7: require("../assets/PenguinAvatar.png"),
    8: require("../assets/LadyAvatar.png"),
    9: require("../assets/owl.png"),
    10: require("../assets/profile.png"),
  };
  // 2. Get the current avatar or fallback to a default
  const communityAvatar = user?.communityProfile?.avatarId
    ? avatarMap[user.communityProfile.avatarId]
    : BioIcon; // Default icon if none set
  const communityBio = user?.communityProfile?.bio || "No bio added yet.";

  // We use optional chaining (?.) and fallback to "U" (for User) if username is null
  const userInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  console.log("Current User Data:", JSON.stringify(user, null, 2));
  const insets = useSafeAreaInsets();
  const contactInfo = user?.emergencyContact
    ? `${user.emergencyContact.name} | ${user.emergencyContact.relation} | ${user.emergencyContact.countryCode}${user.emergencyContact.phone}`
    : "No emergency contact added yet";

  // ✅ 1. Create a formatted date string
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  // Debug Log: This will fire every time you open the profile
  useEffect(() => {
    if (isFocused) {
      console.log("👤 Profile Refreshed. Current User:", user?.username);
      console.log(
        "☎️ Emergency Contact in State:",
        user?.emergencyContact?.name || "None",
      );
    }
  }, [isFocused, user]);

  // --- Reusable Menu Item Component ---
  const ProfileMenuItem = ({
    icon,
    text,
    subtext,
    actionText,
    onPress,
    isArrow = false,
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Image source={icon} style={styles.menuIcon} resizeMode="contain" />

      <View style={styles.menuTextContainer}>
        <Text style={styles.menuText}>{text}</Text>
        {subtext && <Text style={styles.menuSubText}>{subtext}</Text>}
      </View>

      {isArrow ? (
        <Image
          source={RightArrow}
          style={styles.arrowIcon}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.actionText}>{actionText}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#fff", "#fff", "#fff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Image
              source={BackgroundLeaves}
              style={styles.headerBackground}
              resizeMode="cover"
            />

            {/*Uses goBack() to return to the previous screen */}
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

            <View style={styles.profileInfo}>
              {/* <Image
                source={HaniAvatar}
                style={styles.avatar}
                resizeMode="cover"
              /> */}
              {/* ✅ ADD this: Dynamic Initial Avatar Circle */}
              <View style={styles.initialAvatarCircle}>
                <Text style={styles.initialAvatarText}>{userInitial}</Text>
              </View>
              <Text style={styles.nameText}>{user?.username}</Text>
              <Text style={styles.detailsText}>created on {formattedDate}</Text>
            </View>
          </View>

          <View style={styles.menuSection}>
            <ProfileMenuItem
              icon={communityAvatar} // Displays selected avatar image
              text="Bio & Community Avatar"
              subtext={communityBio} // Displays saved bio
              actionText="Edit"
              onPress={() =>
                navigation.navigate("CommunityProfileCreation", {
                  isEditing: true,
                })
              }
            />

            <ProfileMenuItem
              icon={ContactEditIcon}
              text="Emergency Contacts"
              subtext={contactInfo}
              actionText="Edit"
              onPress={() =>
                navigation.navigate("AddContact", {
                  userId: user?._id,
                  existingContact: user?.emergencyContact, // Pass existing data so that contactScreen can be populated
                })
              }
            />

            <ProfileMenuItem
              icon={SecurityIcon}
              text="Accounts & Security"
              isArrow={true}
              onPress={() => navigation.navigate("AccountSecurity")}
            />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert("Logout", "Are you sure you want to logout?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  style: "destructive", // Red text on iOS
                  onPress: () => {
                    //Clear Global State
                    logout();
                    // reset wipes the memory of the previous screens entirely.
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "SignIn" }],
                    });
                  },
                },
              ]);
            }}
          >
            <Image
              source={LogOutIcon}
              style={styles.logoutIcon}
              resizeMode="contain"
            />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
      {/* ✅ FIXED FOOTER: Placed at the very bottom */}
      <View style={{ paddingBottom: insets.bottom, backgroundColor: "#fff" }}>
        <HomeFooter navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  // --- Header Section ---
  headerSection: {
    height: 270,
    backgroundColor: "#F7F4FD",
    alignItems: "center",
    paddingTop: 40,
    marginBottom: 20,
    // borderWidth:1
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "125%",
    // opacity: 0.8,
  },
  backButton: {
    position: "absolute",
    top: 22,
    left: 5,
    padding: 10,
    zIndex: 1,
  },
  backIcon: {
    width: 35,
    height: 35,
    tintColor: "#512DA8",
  },
  profileInfo: {
    marginTop: 180,
    alignItems: "center",
    // borderWidth:1,
  },
  profileInfo: {
    marginTop: 180,
    alignItems: "center",
  },
  initialAvatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45, // width / 2 makes it a perfect circle
    backgroundColor: "#7E57C2", // Use one of your theme's purple colors
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    marginBottom: 0,
    // Optional: Add a subtle white border to pop against background leaves
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  // ✅ Add this: The style for the text inside the circle
  initialAvatarText: {
    fontSize: 35, // Large and bold
    color: "#FFFFFF",
    fontFamily: "Quicksand-Bold",
    // Adjusting line height slightly can help center certain fonts perfectly
    lineHeight: 45,
  },
  nameText: {
    fontSize: 20,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
  },
  detailsText: {
    fontSize: 12,
    color: "#9a9595",
    fontFamily: "Quicksand-Regular",
    marginTop: 0,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 90,
    width: "100%",
    // borderWidth:1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to the top for multi-line subtext
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    // tintColor: '#512DA8',
    marginTop: 5, // Vertically align with the start of the text
  },
  menuTextContainer: {
    flex: 1, // Allows text content to grow and wrap
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
  },
  menuSubText: {
    fontSize: 12,
    color: "#686767",
    fontFamily: "Quicksand-Medium",
    marginTop: 4,
    lineHeight: 18,
  },
  actionText: {
    fontSize: 14,
    color: "#9370DB",
    fontFamily: "Quicksand-SemiBold",
  },
  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: "#512DA8",
    marginTop: 5, // Vertically align with the text
  },
  // --- Log Out Button ---
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FFE5E5", // Light red background
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 90,
    width: "60%",
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#E91E63", // Red color
  },
  logoutText: {
    fontSize: 16,
    color: "#E91E63",
    fontFamily: "Quicksand-SemiBold",
  },
});

export default ProfileScreen;
