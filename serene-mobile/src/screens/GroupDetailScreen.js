import React, { useState } from "react";
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PostCard from "../components/PostCard"; // ⬅️ NEW IMPORT

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const BackIcon = require("../assets/BackIcon.png");
const WritePostIcon = require("../assets/WritePostIcon.png"); // Icon for writing a new post

// Placeholder Avatars (Reusing from ProfileCreation)
const FoxAvatar = require("../assets/alpine.png");
const PersonAvatar = require("../assets/owl.png");
const FlowerAvatar = require("../assets/FlowerAvatar.png");
const DogAvatar = require("../assets/bear.png");

// --- Dummy Data ---
const DUMMY_POSTS = [
  {
    id: 1,
    user: {
      name: "AnonUser123",
      avatar: FoxAvatar,
      bio: "19 y/o student dealing with exam anxiety. Just trying to breathe.",
    },
    content:
      "It's been a tough week. Just felt a sudden wave of panic hit me during a lecture today. Does anyone have quick grounding techniques that help immediately?",
    time: "5 mins ago",
    likes: 15,
    replies: 8,
  },
  {
    id: 2,
    user: {
      name: "SereneFriend",
      avatar: PersonAvatar,
      bio: "A mom of two finding my calm through daily gratitude and support groups.",
    },
    content:
      "Remember that feeling anxious doesn't make you weak. It means there's something you care deeply about. Be kind to yourselves today. Sending strength! 💪",
    time: "2 hours ago",
    likes: 45,
    replies: 12,
  },
  {
    id: 3,
    user: {
      name: "Ahmed123",
      avatar: FlowerAvatar,
      bio: "19 y/o student dealing with exam anxiety. Just trying to breathe.",
    },
    content:
      "I freeze up when I’m around people — my mind just goes blank. I really want to feel more natural in conversations. Any tips?",
    time: "2 mins ago",
    likes: 15,
    replies: 8,
  },
  {
    id: 4,
    user: {
      name: "SereneFriend",
      avatar: DogAvatar,
      bio: "A mom of two finding my calm through daily gratitude and support groups.",
    },
    content:
      "I scroll through social media and instantly feel like I’m behind in life. Everyone looks so confident and happy — I just feel stuck and not enough.",
    time: "8 hours ago",
    likes: 45,
    replies: 12,
  },
];

const GroupDetailScreen = ({ navigation,route }) => {
  const [bioPopupContent, setBioPopupContent] = useState(null); // Holds bio text if popup is visible

  // ✅ EXTRACTION: Get the groupTitle passed from the previous screen
  // If for some reason it's missing, we provide a fallback title
  const { groupTitle } = route.params || { groupTitle: "Community Group" };

  // Handler to show the bio popup when an avatar is pressed
  const handleShowBio = (bioText) => {
    setBioPopupContent(bioText);
  };

  // Handler to hide the bio popup
  const handleHideBio = () => {
    setBioPopupContent(null);
  };

  // --- Bio Popup Component (Simple, integrated Modal) ---
  const BioPopup = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!bioPopupContent}
      onRequestClose={handleHideBio}
    >
      <TouchableOpacity
        style={styles.bioOverlay}
        onPress={handleHideBio}
        activeOpacity={1}
      >
        <View style={styles.bioCard}>
          <Text style={styles.bioTextHeader}>Community Bio:</Text>
          <Text style={styles.bioText}>{bioPopupContent}</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <LinearGradient
      colors={["#fff", "#fff", "#fff"]}
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
        <View style={styles.headerGroupInfo}>
          <Text style={styles.headerTitle}>{groupTitle}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.writePostButton}
        onPress={() => navigation.navigate("WritePost")}
      >
        <Image
          source={WritePostIcon}
          style={styles.writePostIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DUMMY_POSTS.map((post) => (
          <PostCard key={post.id} post={post} onShowBio={handleShowBio} />
        ))}
        <View style={{ height: 50  }} />
      </ScrollView>

      <BioPopup />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3FF" },

  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#D7D9F4",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: { padding: 5 },
  backIcon: { width: 30, height: 30, tintColor: "#512DA8" },
  headerGroupInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  headerTitle: {
    fontSize: 18,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginRight: 5,
  },

  // --- Scroll Content ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  // --- Floating Button ---
  writePostButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  writePostIcon: {
    width: "100%",
    height: "100%",
    // tintColor: '#fffdfdff',
  },
  // --- Bio Popup Styles ---
  bioOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  bioCard: {
    width: "75%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
  },
  bioTextHeader: {
    fontSize: 14,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginBottom: 5,
  },
  bioText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Quicksand-Regular",
    lineHeight: 20,
  },
});

export default GroupDetailScreen;
