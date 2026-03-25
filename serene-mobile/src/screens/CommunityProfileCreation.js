import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../components/CustomButton";
import AvatarSelector from "../components/AvatarSelector";

const BackIcon = require("../assets/BackIcon.png");
const FoxAvatar = require("../assets/flower.png");
const PersonAvatar = require("../assets/PersonAvatar.png");
const FlowerAvatar = require("../assets/FlowerAvatar.png");
const BearAvatar = require("../assets/owl.png");
const WomanAvatar = require("../assets/woman.png");
const SnowflakeAvatar = require("../assets/bear.png");
const DogAvatar = require("../assets/profile.png");
const LeafAvatar = require("../assets/cat.png");

const avatarOptions = [
  { id: 1, source: FoxAvatar },
  { id: 2, source: PersonAvatar },
  { id: 3, source: FlowerAvatar },
  { id: 4, source: LeafAvatar },
  { id: 5, source: SnowflakeAvatar },
  { id: 6, source: WomanAvatar },
  { id: 7, source: DogAvatar },
  { id: 8, source: LeafAvatar },
  { id: 9, source: BearAvatar },
  { id: 10, source: DogAvatar },
];

const CommunityProfileCreation = ({ navigation }) => { // ⬅️ Use navigation prop
  const [bioText, setBioText] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  const handleSave = () => {
    if (!bioText.trim() || !selectedAvatarId) {
      Alert.alert(
        "Incomplete Profile",
        "Please enter your bio and select an avatar."
      );
      return;
    }
    console.log(`Saving Profile: Bio: ${bioText}, Avatar ID: ${selectedAvatarId}`);
    
    // Navigate to the groups selection after saving
    navigation.navigate("CommunityGroups"); 
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        {/* ✅ FIXED: Use navigation.goBack() */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={BackIcon}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Let's create your profile and get started.
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
            title="SAVE"
            onPress={handleSave}
            style={styles.saveButton}
          />
          {/* ✅ FIXED: Use navigation.goBack() to return to Profile */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.skipText}>I'LL DO THIS LATER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// ... keep your styles as they were

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3FF" },
  header: {
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  backButton: {
    padding: 5,
    alignSelf: "flex-start",
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#512DA8",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
    width: "100%",
  },
  sectionHeader: {
    fontSize: 18,
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
