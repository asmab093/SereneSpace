import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

// Placeholder Icons
const HeartOutline = require("../assets/HeartOutline.png"); // Empty heart
const HeartFilled = require("../assets/HeartFilledRed.png"); // Filled red heart
const CommentIcon = require("../assets/CommentIcon.png"); // Comment icon

// Placeholder Avatar for hovering (should be passed via props)
const DummyAvatar = require("../assets/ProfileAvatar.png");

const PostCard = ({ post, onShowBio }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // Function to handle reply click (currently placeholder)
  const handleReply = () => {
    console.log(`Replies clicked for post ${post.id}`);
    // Future implementation for opening replies modal/screen
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.postHeader}>
        <TouchableOpacity
          onPress={() => onShowBio(post.user.bio)} // Pass bio content up
          style={styles.avatarWrapper}
        >
          <Image
            source={post.user.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.name}</Text>
          <Text style={styles.time}>{post.time}</Text>
        </View>
      </View>

      <Text style={styles.postText}>{post.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Image
            source={isLiked ? HeartFilled : HeartOutline}
            style={[styles.actionIcon, isLiked && styles.likedIcon]}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>{likeCount} Likes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReply} style={styles.actionButton}>
          <Image
            source={CommentIcon}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>{post.replies} Replies</Text>
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
    marginBottom: 10,
    // Match standard card shadow
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
  avatarWrapper: {
    padding: 2, // Space for the hover effect border if implemented
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
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
  },
  time: {
    fontSize: 12,
    color: "#A3A3A3",
    fontFamily: "Quicksand-Regular",
  },
  postText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Quicksand-Medium",
    lineHeight: 20,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 10,
    marginTop: 5,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: "#A3A3A3",
  },
  likedIcon: {
    tintColor: "#f61111ff", // Red filled heart
  },
  actionText: {
    fontSize: 13,
    color: "#A3A3A3",
    fontFamily: "Quicksand-Medium",
  },
});

export default PostCard;
