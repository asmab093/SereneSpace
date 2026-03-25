
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BackIcon = require("../assets/BackIcon.png"); 
const AvatarIcon = require("../assets/woman.png"); // User's profile image

const WritePostScreen = ({ navigation }) => {
  // 1. REMOVED: State for 'title' is no longer needed but kept for handler logic update
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Determine if the Post button should be enabled.
  // 💡 UPDATED LOGIC: Only check if the body has content, as title is removed.
  const isPostEnabled = body.trim().length > 0;

  const handlePostPress = () => {
    if (isPostEnabled) {
      // 💡 UPDATED LOG: Title check removed
      console.log(`Posting: Body='${body}', Anonymous=${isAnonymous}`);
      // In a real app: call API to submit post
      navigation.goBack();
    }
  };

  return (
    <LinearGradient
      colors={["#fff", "#fff", "#fff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Image
            source={BackIcon}
            style={styles.BackIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePostPress}
          disabled={!isPostEnabled}
          style={[
            styles.headerButton,
            styles.postButton,
            !isPostEnabled && styles.disabledButton,
          ]}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.userInfoContainer}>
          <Image source={AvatarIcon} style={styles.avatar} resizeMode="cover" />
          <Text style={styles.userName}>Hani Malik</Text>
        </View>

        <TextInput
          style={styles.bodyInput} // 💡 STYLE APPLIED HERE FOR BORDER
          placeholder="Write your post here..."
          placeholderTextColor="#A3A3A3"
          value={body}
          onChangeText={setBody}
          multiline
          maxLength={1000}
          textAlignVertical="top"
        />

        <View style={styles.anonymityToggle}>
          <Text style={styles.anonymityText}>Post anonymously</Text>
          <Switch
            // CHANGE 3: Custom toggle colors
            trackColor={{ false: "#767577", true: "#D7D9F4" }}
            thumbColor={isAnonymous ? "#512DA8" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsAnonymous}
            value={isAnonymous}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // --- Header ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#D7D9F4",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D7D9F4",
  },
  headerButton: {
    padding: 5,
  },
  BackIcon: {
    width: 30,
    height: 30,
    tintColor: "#512DA8",
  },
  postButton: {
    backgroundColor: "#512DA8", // Purple background
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 5,
    // marginTop:2
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
  },
  disabledButton: {
    opacity: 0.5,
  },

  // --- Content ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
  },

  bodyInput: {
    borderWidth: 1,
    borderColor: "#EBE5F7",
    borderRadius: 10, 

    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-Regular",
    minHeight: 200,
    paddingHorizontal: 15, // Added horizontal padding for content inside the border
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF", // Ensures clean background inside the box
  },

  // --- Toggle ---
  anonymityToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    paddingVertical: 0,
    // borderTopWidth: 1,
    // borderTopColor: "#EBE5F7",
  },
  anonymityText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Quicksand-Medium",
  },
});

export default WritePostScreen;
