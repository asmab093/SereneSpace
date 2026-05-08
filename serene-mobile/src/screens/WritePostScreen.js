import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BackIcon = require("../assets/BackIcon.png");
// const AvatarIcon = require("../assets/woman.png"); // User's profile image

const WritePostScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { user, API_URL, token } = useContext(AuthContext);
  const { groupTitle, groupId } = route.params || {}; // Pass these from GroupDetail
  // 1. REMOVED: State for 'title' is no longer needed but kept for handler logic update
  // const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine if the Post button should be enabled.
  // 💡 UPDATED LOGIC: Only check if the body has content, as title is removed.
  const isPostEnabled = body.trim().length > 0;

  /// ✅ Comprehensive avatar mapping
  const getAvatarSource = (id) => {
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
    return avatarMap[id] || require("../assets/profile.png");
  };

  const handlePostPress = async () => {
    setLoading(true);
    console.log("handle Post press triggered");
    try {
      await axios.post(
        `${API_URL}/posts`,
        {
          content: body,
          group: groupId,
          isAnonymous: isAnonymous,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Toast.show({ type: "success", text1: "Posted successfully!" });
      navigation.goBack();
    } catch (error) {
      const serverMessage = error.response?.data?.message || "Failed to post.";
      Alert.alert("Post Refused", serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#fff", "#fff", "#fff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Image
            source={BackIcon}
            style={styles.BackIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePostPress}
          disabled={!isPostEnabled || loading}
          style={[
            styles.headerButton,
            styles.postButton,
            (!isPostEnabled || loading) && styles.disabledButton,
          ]}
        >
          <Text style={styles.postButtonText}>
            {loading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.userInfoContainer}>
          {/* {console.log("avatar id", user?.communityProfile?.avatarId)} */}
          <Image
            source={
              isAnonymous
                ? require("../assets/AnonymousUser.png")
                : getAvatarSource(user?.communityProfile?.avatarId)
            }
            style={styles.avatar}
          />
          <Text style={styles.userName}>
            {isAnonymous ? "Anonymous" : user?.username}
          </Text>
        </View>

        <TextInput
          style={styles.bodyInput}
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
    paddingTop: 15,
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
