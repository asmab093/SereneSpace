import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import CustomButton from "../components/CustomButton";
import AvatarSelector from "../components/AvatarSelector";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BackIcon = require("../assets/BackIcon.png");
const FoxAvatar = require("../assets/flower.png");
const PersonAvatar = require("../assets/PersonAvatar.png");
const FlowerAvatar = require("../assets/FlowerAvatar.png");
const BearAvatar = require("../assets/owl.png");
const WomanAvatar = require("../assets/woman.png");
const SnowflakeAvatar = require("../assets/bear.png");
const DogAvatar = require("../assets/profile.png");
const LeafAvatar = require("../assets/cat.png");
const LadyAvatar = require("../assets/LadyAvatar.png");
const PenguinAvatar = require("../assets/PenguinAvatar.png");

const avatarOptions = [
  { id: 1, source: FlowerAvatar },
  { id: 2, source: PersonAvatar },
  { id: 3, source: FoxAvatar },
  { id: 4, source: LeafAvatar },
  { id: 5, source: SnowflakeAvatar },
  { id: 6, source: WomanAvatar },
  { id: 7, source: PenguinAvatar },
  { id: 8, source: LadyAvatar },
  { id: 9, source: BearAvatar },
  { id: 10, source: DogAvatar },
];

const CommunityProfileCreation = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, setUser, API_URL, token } = useContext(AuthContext);
  const route = useRoute();
  const [bioText, setBioText] = useState(user?.communityProfile?.bio || "");
  const [selectedAvatarId, setSelectedAvatarId] = useState(
    user?.communityProfile?.avatarId || null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = route.params?.isEditing || false; // Check if we came from Profile

  const handleSave = async () => {
    if (!bioText.trim() || !selectedAvatarId) {
      Alert.alert(
        "Incomplete Profile",
        "Please enter your bio and select an avatar.",
      );
      return;
    }
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${API_URL}/users/community-profile`,
        {
          bio: bioText,
          avatarId: selectedAvatarId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        // DYNAMIC TOAST MESSAGE
        Toast.show({
          type: "success",
          text1: isEditing ? "Success! ✨" : "Success! 🎉",
          text2: isEditing
            ? "Your community profile has been updated."
            : "Your community profile has been created.",
          position: "bottom",
          visibilityTime: 3000,
        });
        // Update local context with the new user object from MongoDB
        setUser(response.data.data);
        setTimeout(() => {
          // 2. CONDITIONAL NAVIGATION
          if (isEditing) {
            // If we came from Profile, go back to Profile
            navigation.goBack();
          } else {
            // If first time creation, go to Groups
            navigation.navigate("CommunityGroups");
          }
        }, 1500);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Could not save your profile. Please try again.",
        position: "bottom",
      });
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        {/*  FIXED: Use navigation.goBack() */}
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
        <Text style={styles.headerTitle}>Community Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {isEditing
            ? "Update your community presence."
            : "Let's create your profile and get started."}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>1. Add your bio</Text>
          <Text style={styles.sectionSubText}>
            Tell other community members something about you. This will help
            them know you better.
          </Text>
          <TextInput
            style={styles.bioInput}
            multiline
            placeholder="Type here..."
            placeholderTextColor="#A3A3A3"
            value={bioText}
            onChangeText={setBioText}
            maxLength={250}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            2. Choose your profile picture
          </Text>
          <Text style={styles.sectionSubText}>
            pick a profile picture from any of the avatars below to use Serene
            community.
          </Text>

          <View style={styles.avatarGrid}>
            {avatarOptions.map((avatar) => (
              <AvatarSelector
                key={avatar.id}
                avatarId={avatar.id}
                avatarSource={avatar.source}
                isSelected={selectedAvatarId === avatar.id}
                onSelect={setSelectedAvatarId}
              />
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={isSaving ? "SAVING..." : "SAVE"}
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    elevation: 4,
    width: "100%",
    marginBottom: 10,
  },
  backButton: {
    padding: 0,
    marginRight: 0,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#512DA8",
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginLeft: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
    width: "100%",
  },
  sectionHeader: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-Bold",
    marginBottom: 5,
  },
  sectionSubText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Quicksand-Regular",
    marginBottom: 15,
  },
  bioInput: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-Regular",
    borderWidth: 1,
    borderColor: "#EBE5F7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10, // Adjust for inner margins of avatars
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  saveButton: {
    width: 230,
    marginBottom: 20,
  },
  skipText: {
    fontSize: 16,
    color: "#7E57C2",
    fontFamily: "Quicksand-SemiBold",
  },
});

export default CommunityProfileCreation;
