import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios"; //
import ReplyModal from "../components/ReplyModal"; //
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BackIcon = require("../assets/BackIcon.png");
const WritePostIcon = require("../assets/WritePostIcon.png");

const GroupDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { user, API_URL, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  // const isMember = isGroupJoined(groupTitle);
  const [bioPopupContent, setBioPopupContent] = useState(null); // Holds bio text if popup is visible
  // Extract groupId along with groupTitle and isMember
  const { groupTitle, isMember, groupId } = route.params || {
    groupTitle: "Community Group",
    isMember: false,
    groupId: "",
  };
  const [selectedPostForReply, setSelectedPostForReply] = useState(null);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [groupId]), //eg: grpId="depression"
  );

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId)); // Remove from UI
    } catch (error) {
      Alert.alert("Error", "Could not delete post.");
    }
  };

  const handleDeleteReply = async (postId, replyId) => {
    try {
      await axios.delete(`${API_URL}/posts/replies/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update Modal UI
      setSelectedPostForReply((prev) => ({
        ...prev,
        replies: prev.replies.filter((r) => r._id !== replyId),
      }));
      fetchPosts(); // Update main count
    } catch (error) {
      Alert.alert("Error", "Could not delete reply.");
    }
  };

  // Function to open modal
  const handleOpenReplies = (post) => {
    setSelectedPostForReply(post);
    setIsReplyModalVisible(true);
  };

  // Corrected handleSendReply function
  const handleSendReply = async (postId, content) => {
    setIsSendingReply(true);
    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/replies`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        const newReply = response.data.data;
        setSelectedPostForReply((prevPost) => ({
          ...prevPost,
          replies: [...(prevPost.replies || []), newReply],
        }));
        fetchPosts();
      }
    } catch (error) {
      // 1. Log the full error to your terminal so we can see the hidden details
      console.log(
        "AXIOS ERROR OBJECT:",
        JSON.stringify(error.response?.data, null, 2),
      );

      // 2. Extract the message correctly
      // We look for error.response.data.message (which matches your res.status(400).json)
      const serverMessage =
        error.response?.data?.message || "Something went wrong";

      // 3. Show the Alert
      Alert.alert("Action Blocked", serverMessage);
    } finally {
      setIsSendingReply(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${groupId}`);
      setPosts(response.data.data);
    } catch (error) {
      console.log("error in fetching posts", error);
    }
  };
  // Handler to show the bio popup when an avatar is pressed
  const handleShowBio = (bioText) => {
    setBioPopupContent(bioText);
  };

  // Handle trying to write a post
  const handleWritePost = () => {
    if (isMember) {
      // Pass the groupTitle and groupId to the WritePost screen
      navigation.navigate("WritePost", {
        groupTitle: groupTitle,
        groupId: groupId,
      });
    } else {
      Alert.alert("Join Group", "You must join this group to create a post.");
    }
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
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
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
        <Text style={styles.headerTitle}>{groupTitle}</Text>
      </View>

      <TouchableOpacity
        style={[styles.writePostButton, !isMember && { opacity: 0.5 }]}
        onPress={handleWritePost}
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
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id} // MongoDB uses _id
              post={post}
              onShowBio={handleShowBio}
              isInteractionDisabled={!isMember}
              onDeletePost={handleDeletePost}
              onReplyPress={() => handleOpenReplies(post)}
            />
          ))
        ) : (
          <Text style={styles.noPostsText}>
            No posts yet. Be the first to share!
          </Text>
        )}
        <View style={{ height: 50 }} />
      </ScrollView>
      <ReplyModal
        currentUserId={user?._id} // ✅ Pass user ID
        onDeleteReply={handleDeleteReply} // ✅ Pass function
        isVisible={isReplyModalVisible}
        onClose={() => setIsReplyModalVisible(false)}
        post={selectedPostForReply}
        onSendReply={handleSendReply}
        isSending={isSendingReply}
      />

      <BioPopup />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3FF" },

  // --- Header ---
  // --- Header ---
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    backgroundColor: "#D7D9F4", 
    paddingBottom: 15, 
    elevation: 4, 
    width: "100%", 
    marginBottom: 10,
  },
  backButton: { 
    padding: 0, 
    marginRight: 0 
  }, 
  backIcon: { 
    width: 24, 
    height: 24, 
    tintColor: "#512DA8", 
    resizeMode: 'contain' 
  }, 
  headerTitle: { 
    flex: 1, 
    fontSize: 18, 
    color: "#512DA8", 
    fontFamily: "Quicksand-Bold", 
    marginLeft: 15 
  },
  headerGroupInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
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
