import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// Placeholder Icons
const HeartOutline = require("../assets/HeartOutline.png");
const HeartFilled = require("../assets/HeartFilledRed.png");
const CommentIcon = require("../assets/CommentIcon.png");
const TrashIcon = require("../assets/TrashCan.png");

const PostCard = ({
  post,
  onShowBio,
  isInteractionDisabled,
  onReplyPress,
  onDeletePost,
}) => {
  const { user, API_URL } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const isOwner = user?._id === post.user?._id;

  const confirmDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDeletePost(post._id),
      },
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `created on ${day}/${month}/${year} at ${hours}:${minutes}`;
  };

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

  const displayName = post.isAnonymous
    ? "Anonymous"
    : post.user?.username || "User";
  const displayAvatar = post.isAnonymous
    ? require("../assets/AnonymousUser.png")
    : getAvatarSource(post.user?.communityProfile?.avatarId);

  // ✅ Function to handle showing the bio
  const handleShowUserBio = () => {
    if (!post.isAnonymous && post.user?.communityProfile?.bio) {
      onShowBio(post.user.communityProfile.bio);
    } else if (post.isAnonymous) {
      // Optional: don't show anything for anonymous users
      return;
    } else {
      onShowBio("This user hasn't added a bio yet.");
    }
  };

  const handleLike = async () => {
    if (isInteractionDisabled) {
      Alert.alert("Join Group", "You must join this group to like posts!");
      return;
    }
    const action = isLiked ? "unlike" : "like";
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      await axios.put(`${API_URL}/posts/${post._id}/like`, { action });
    } catch (error) {
      setIsLiked(!newLikedState);
      setLikeCount((prev) => (!newLikedState ? prev + 1 : prev - 1));
      Alert.alert("Error", "Could not sync like to server.");
    }
  };

  const handleReply = () => {
    if (isInteractionDisabled) {
      Alert.alert(
        "Join Group",
        "You must join this group to like or reply to posts!",
      );
      return;
    }
    if (onReplyPress) {
      onReplyPress();
    }
  };

  return (
    <View
      style={[styles.cardContainer, isInteractionDisabled && { opacity: 0.9 }]}
    >
      <View style={styles.postHeader}>
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
          {/* ✅ AVATAR: Now triggers bio */}
          <TouchableOpacity
            onPress={handleShowUserBio}
            disabled={post.isAnonymous}
          >
            <Image
              source={displayAvatar}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            {/* ✅ USERNAME: Now triggers bio */}
            <TouchableOpacity
              onPress={handleShowUserBio}
              disabled={post.isAnonymous}
            >
              <Text style={styles.username}>{displayName}</Text>
            </TouchableOpacity>
            <Text style={styles.time}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>

        {isOwner && (
          <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
            <Image
              source={TrashIcon}
              style={styles.trashIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.postText}>{post.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity
          onPress={handleLike}
          style={[
            styles.actionButton,
            isInteractionDisabled && { opacity: 0.4 },
          ]}
        >
          <Image
            source={isLiked ? HeartFilled : HeartOutline}
            style={[styles.actionIcon, isLiked && styles.likedIcon]}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>{likeCount} Likes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReply}
          style={[
            styles.actionButton,
            isInteractionDisabled && { opacity: 0.4 },
          ]}
        >
          <Image
            source={CommentIcon}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>
            {post.replies?.length || 0} Replies
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
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
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
  },
  time: {
    fontSize: 11,
    color: "#A3A3A3",
    fontFamily: "Quicksand-Regular",
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: "#FF5252",
  },
  deleteButton: {
    padding: 5,
  },
  postText: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Quicksand-Medium",
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
  },
  actionIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: "#A3A3A3",
  },
  likedIcon: {
    tintColor: "#f61111",
  },
  actionText: {
    fontSize: 13,
    color: "#757575",
    fontFamily: "Quicksand-Medium",
  },
});

export default PostCard;
