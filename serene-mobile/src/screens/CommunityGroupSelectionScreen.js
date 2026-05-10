import React, { useState, useContext } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CommunityTabButton from "../components/CommunityTabButton";
import CustomButton from "../components/CustomButton";
import CustomCheckbox from "../components/CustomCheckBox"; // ⬅️ ASSUMED: This component is created
import CommunityInfoPopup from "../components/CommunityInfoPopup";
import JoinSuccessPopup from "../components/JoinSuccessPopup";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BackIcon = require("../assets/BackIcon.png");
const InfoIcon = require("../assets/InfoIcon.png");
const SearchIcon = require("../assets/SearchIcon.png");

// Placeholder Icons (Matching the image)
const AnxietyIcon = require("../assets/AnxietyIcon.png");
const DepressionIcon = require("../assets/DepressionIcon.png");
const AdhdIcon = require("../assets/AdhdIcon.png");
const SelfEsteemIcon = require("../assets/SelfEsteemIcon.png");
const MindfulnessIcon = require("../assets/MindfulnessIcon.png");

// --- Data for Groups---
const GROUPS_DATA = [
  {
    id: "anxiety",
    icon: AnxietyIcon,
    title: "Anxiety & Stress Relief",
    description: "For users who often feel overwhelmed, nervous, or anxious.",
  },
  {
    id: "depression",
    icon: DepressionIcon,
    title: "Depression & Low Mood",
    description:
      "A safe space for those feeling emotionally down, unmotivated or lonely.",
  },
  {
    id: "adhd",
    icon: AdhdIcon,
    title: "ADHD & Focus Support",
    description:
      "For people struggling with concentration, organization, or energy swings.",
  },
  {
    id: "self_esteem",
    icon: SelfEsteemIcon,
    title: "Self-Esteem & Confidence Boost",
    description: "To build positive self-image, confidence, and inner growth.",
  },
  {
    id: "mindfulness",
    icon: MindfulnessIcon,
    title: "Mindfulness & Positivity",
    description:
      "For users who want to cultivate mindfulness, gratitude, and calmness.",
  },
];

const CommunityGroupSelectionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, setUser, API_URL, token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse"); // 'browse' as default
  const [selectedGroups, setSelectedGroups] = useState({}); //If you select a group with ID 123, the state becomes { "123": true }.
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  // function updates the selectedGroups state object.
  //User taps Group "Stress" (ID: 2): State becomes { "depression": true, "anxiety": true }
  //User taps Group "Anxiety" again: State becomes { "depression": false, "anxiety": true }
  const toggleGroup = (id) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //selectedCount>a derived variable to count how many true values are in selectedGroups.
  const selectedCount = Object.values(selectedGroups).filter((v) => v).length;
  // console.log(selectedCount);
  const isJoinEnabled = selectedCount > 0;

  const handleJoinNow = async () => {
    const newGroupsList = Object.keys(selectedGroups).filter(
      (id) => selectedGroups[id],
    ); //It converts the selectedGroups object into a simple array of IDs (e.g., ["depression", "anxiety"]).
    const combinedGroups = [...(user?.joinedGroups || []), ...newGroupsList];
    //combinedGroups takes the groups the user already had in user.joinedGroups and adds the new ones
    //combinedGroups ["adhd", "depression", "anxiety", "self_esteem"]
    try {
      // 1. Save to Backend (MongoDB)
      const response = await axios.put(
        `${API_URL}/users/joined-groups`,
        { groups: combinedGroups },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        // 2. Update Context locally
        setUser(response.data.data);
        setSelectedGroups({});
        setIsSuccessPopupVisible(true); //shows the popup
      }
    } catch (error) {
      console.error("Error joining groups:", error);
      Alert.alert(
        "Error",
        "Could not join groups. Please check your connection.",
      );
    }
  };

  //Handler for when the user dismisses the popup
  const handlePopupClose = () => {
    setIsSuccessPopupVisible(false);
    setActiveTab("circles");
  };

  // Inside CommunityGroupSelectionScreen component
  const handleLeaveGroup = async (groupId) => {
    // 1. Create the new list by filtering OUT the group being left
    const updatedGroups = user.joinedGroups.filter((id) => id !== groupId);
    try {
      const response = await axios.put(
        `${API_URL}/users/joined-groups`,
        { groups: updatedGroups },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        // 3. Update local Context state
        // This will automatically move the group back to "Browse"
        // because our renderContent filters by user.joinedGroups
        setUser(response.data.data);
        console.log("Successfully left the group");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      Alert.alert("Error", "Could not leave the group. Please try again.");
    }
  };

  // --- Group Card Component
  const GroupCard = ({ data, isChecked, onToggle }) => {
    // 'activeTab' is available because GroupCard is defined inside CommunityGroupSelectionScreen
    const isCirclesTab = activeTab === "circles";
    // Conditional Wrapper: TouchableOpacity for Circles tab, View otherwise
    const CardWrapper = isCirclesTab ? TouchableOpacity : View;
    return (
      <CardWrapper
        style={styles.groupCard}
        //Apply click logic only if it's the Circles tab
        onPress={
          isCirclesTab
            ? () =>
                navigation.navigate("GroupDetail", {
                  groupTitle: data.title,
                  groupId: data.id,
                  isMember: true,
                })
            : undefined
        }
        activeOpacity={isCirclesTab ? 0.8 : 1}
      >
        <View style={styles.groupInfo}>
          <Image
            source={data.icon}
            style={styles.groupIcon}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.groupTitle}>{data.title}</Text>
            <Text style={styles.groupDescription}>{data.description}</Text>
          </View>
        </View>

        <View style={styles.groupActions}>
          {isCirclesTab ? (
            // In 'Your Circles' tab, show only the Leave button
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={() => handleLeaveGroup(data.id)} //data has whole group
            >
              <Text style={styles.leaveButtonText}>Leave</Text>
            </TouchableOpacity>
          ) : (
            // In 'Browse Groups' tab, show Visit and Checkbox
            <View style={styles.verticalActions}>
              <TouchableOpacity
                style={styles.visitButton}
                // NAVIGATION FOR BROWSE: isMember is FALSE
                onPress={() =>
                  navigation.navigate("GroupDetail", {
                    groupTitle: data.title,
                    groupId: data.id,
                    isMember: false,
                  })
                }
              >
                <Text style={styles.visitButtonText}>visit</Text>
              </TouchableOpacity>

              <CustomCheckbox
                isChecked={isChecked}
                onToggle={() => onToggle(data.id)}
              />
            </View>
          )}
        </View>
      </CardWrapper>
    );
  };

  const renderContent = () => {
    if (activeTab === "browse") {
      //Filter out to find groups not joined by user.
      let filteredGroups = GROUPS_DATA.filter(
        (group) => !user?.joinedGroups?.includes(group.id),
      );

      //Apply Search Logic. now filteredGroups contain those groups that map keyword against search
      if (searchQuery.trim().length > 0) {
        filteredGroups = filteredGroups.filter(
          (group) =>
            group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.description.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      return filteredGroups.map((group) => (
        <GroupCard
          key={group.id}
          data={group}
          isChecked={!!selectedGroups[group.id]}
          onToggle={toggleGroup}
        />
      ));
    } else {
      // Show only joined groups in "Your Circles"
      const myGroups = GROUPS_DATA.filter((group) =>
        user?.joinedGroups?.includes(group.id),
      );

      return myGroups.map((group) => (
        <GroupCard
          key={group.id}
          data={group}
          isChecked={false}
          onToggle={() => {}}
        />
      ));
    }
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 7 }]}>
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
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity
            onPress={() => setIsPopupVisible(true)}
            style={styles.headerIconWrapper}
          >
            <Image
              source={InfoIcon}
              style={styles.infoIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        <CommunityTabButton
          title="Browse Groups"
          isSelected={activeTab === "browse"}
          onPress={() => setActiveTab("browse")}
        />
        <CommunityTabButton
          title="My Circles"
          isSelected={activeTab === "circles"}
          onPress={() => setActiveTab("circles")}
        />
      </View>
      {activeTab === "browse" && (
        <View style={styles.searchBar}>
          <Image
            source={SearchIcon}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a group using keywords.."
            placeholderTextColor="#A3A3A3"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)} // ✅ Updates the state
          />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderContent()}
      </ScrollView>

      {activeTab === "browse" && (
        <View style={styles.joinButtonWrapper}>
          <CustomButton
            title={`Join Now (${selectedCount})`}
            onPress={handleJoinNow}
            // Disable button if no groups are selected
            style={[styles.joinButton, !isJoinEnabled && styles.disabledButton]}
            disabled={!isJoinEnabled}
          />
        </View>
      )}

      <CommunityInfoPopup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)} // Handler to close the popup
      />

      <JoinSuccessPopup
        isVisible={isSuccessPopupVisible}
        onClose={handlePopupClose} // Calls the handler that navigates to HOME
        groupsJoinedCount={selectedCount}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3FF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    paddingBottom: 8,
    elevation: 4,
    width: "100%",
    marginBottom: 0,
  },
  backButton: { padding: 5 },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#512DA8",
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    color: "#512DA8",
    marginLeft: 5,
    fontFamily: "Quicksand-Bold",
    flex: 1,
  },
  headerRightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconWrapper: {
    padding: 5,
    marginLeft: 0,
  },
  // searchIcon: { width: 20, height: 20, tintColor: "#512DA8" },
  infoIcon: { width: 20, height: 20, tintColor: "#512DA8" },

  // --- Tabs ---
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#dadbf3ff",
  },
  // --- Scroll Content & Cards ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 120, // Ensure space for join button wrapper
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "flex-start", // Use flex-start to align icon with text container
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  groupInfo: {
    flexDirection: "row",
    flex: 1,
    marginRight: 10,
  },
  groupIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    marginTop: 5, // Vertically align with the start of the title/description
  },
  textContainer: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Quicksand-Regular",
    lineHeight: 18,
  },

  // --- Action Buttons/Checkboxes Container ---
  groupActions: {
    flexDirection: "row",
    alignItems: "flex-start",
    // Ensures actions sit on the far right and don't take up too much width
    // Adjust the width constraint here if buttons/checkboxes are too squashed
  },

  verticalActions: {
    flexDirection: "column",
    alignItems: "center", // Center the checkbox/button horizontally within the column
    marginLeft: 10,
  },
  visitButton: {
    backgroundColor: "#7a64e8ff",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // marginLeft: 5, // Space between action elements
    // marginTop: 5, // Align with the top of the card/icon
    width: 65,
    marginBottom: 8, // Space below the visit button (above the checkbox)
    marginTop: 5,
    alignItems: "center", // Center text inside the button
  },
  visitButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Quicksand-SemiBold",
  },
  leaveButton: {
    backgroundColor: "#E91E63",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 5,
    marginTop: 5,
  },
  leaveButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
  },

  // --- Join Now Button ---
  joinButtonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "11.5%",
    padding: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    // borderWidth:1,
  },
  joinButton: {
    width: 280, // Fixed width for the custom button
    height: 50, // Fixed height for the custom button
  },
  disabledButton: {
    opacity: 0.6,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: "#A3A3A3",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#333",
  },
});

export default CommunityGroupSelectionScreen;
