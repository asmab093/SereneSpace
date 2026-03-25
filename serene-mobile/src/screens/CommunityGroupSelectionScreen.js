import React, { useState } from "react";
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CommunityTabButton from "../components/CommunityTabButton";
import CustomButton from "../components/CustomButton";
import CustomCheckbox from "../components/CustomCheckBox"; // ⬅️ ASSUMED: This component is created
import CommunityInfoPopup from "../components/CommunityInfoPopup";
import JoinSuccessPopup from "../components/JoinSuccessPopup";

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const BackIcon = require("../assets/BackIcon.png");
const InfoIcon = require("../assets/InfoIcon.png");
const SearchIcon = require("../assets/SearchIcon.png");

// Placeholder Icons (Matching the image)
const AnxietyIcon = require("../assets/AnxietyIcon.png");
const DepressionIcon = require("../assets/DepressionIcon.png");
const AdhdIcon = require("../assets/AdhdIcon.png");
const SelfEsteemIcon = require("../assets/SelfEsteemIcon.png");
const MindfulnessIcon = require("../assets/MindfulnessIcon.png");

// --- Data ---
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
  const [activeTab, setActiveTab] = useState("browse"); // 'browse' or 'circles'
  const [selectedGroups, setSelectedGroups] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  // Toggle Checkbox state
  const toggleGroup = (id) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedCount = Object.values(selectedGroups).filter((v) => v).length;
  const isJoinEnabled = selectedCount > 0;

  const handleJoinNow = () => {
    if (isJoinEnabled) {
      console.log(`Joining ${selectedCount} groups.`); // In a real app: call API here // 💡 NEW LOGIC: Show success popup
      setIsSuccessPopupVisible(true);
    }
  };

  // 💡 NEW LOGIC: Handler for when the user dismisses the popup
  const handlePopupClose = () => {
    setIsSuccessPopupVisible(false);
    navigation.navigate("Home");
  };

  // --- Group Card Component (Complete Replacement) ---
  const GroupCard = ({ data, isChecked, onToggle }) => {
    // NOTE: 'activeTab' is available because GroupCard is defined inside CommunityGroupSelectionScreen
    const isCirclesTab = activeTab === "circles";

    // 1. Conditional Wrapper: TouchableOpacity for Circles tab, View otherwise
    const CardWrapper = isCirclesTab ? TouchableOpacity : View;

    return (
      <CardWrapper
        style={styles.groupCard}
        // 3. Apply click logic only if it's the Circles tab
        onPress={isCirclesTab ? () => navigation.navigate("GroupDetail", { groupTitle: data.title }) : undefined}
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
              onPress={() => console.log(`Leaving ${data.title}`)}
            >
              <Text style={styles.leaveButtonText}>Leave</Text>
            </TouchableOpacity>
          ) : (
            // In 'Browse Groups' tab, show Visit and Checkbox
            <View style={styles.verticalActions}>
              <TouchableOpacity
                style={styles.visitButton}
                onPress={() => console.log(`Visiting ${data.title}`)}
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

  // --- Content Rendering ---
  const renderContent = () => {
    // Data for "Your Circles" is simplified dummy data
    const displayData =
      activeTab === "browse" ? GROUPS_DATA : GROUPS_DATA.slice(0, 3);

    return displayData.map((group) => (
      <GroupCard
        key={group.id}
        data={group}
        isChecked={!!selectedGroups[group.id]}
        onToggle={toggleGroup}
      />
    ));
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={BackIcon}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity
            onPress={() => console.log("Search")}
            style={styles.headerIconWrapper}
          >
            <Image
              source={SearchIcon}
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
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
          title="Your Circles"
          isSelected={activeTab === "circles"}
          onPress={() => setActiveTab("circles")}
        />
      </View>

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

  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    paddingBottom: 10,
  },
  backButton: { padding: 5 },
  backIcon: { width: 30, height: 30, tintColor: "#512DA8" },
  headerTitle: {
    fontSize: 20,
    // fontWeight: "bold",
    color: "#512DA8",
    marginTop: 30,
    fontFamily: "Quicksand-Bold",
    position: "absolute",
    left: 55,
  },
  headerRightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconWrapper: {
    padding: 5,
    marginLeft: 10,
  },
  searchIcon: { width: 20, height: 20, tintColor: "#512DA8" },
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
    height:'13%',
    padding: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  joinButton: {
    width: 280, // Fixed width for the custom button
    height: 50, // Fixed height for the custom button
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CommunityGroupSelectionScreen;
