import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert, // Added Alert import
} from "react-native";

const TrashIcon = require("../assets/TrashCan.png");

const ReplyModal = ({
  isVisible,
  onClose,
  post,
  onSendReply,
  isSending,
  currentUserId,
  onDeleteReply,
}) => {
  const [replyText, setReplyText] = useState("");

  const displayName = post?.isAnonymous
    ? "Anonymous"
    : post?.user?.username || "User";

  // ✅ Moved inside to access props correctly
  const confirmDeleteReply = (replyId) => {
    Alert.alert("Delete Reply", "Are you sure you want to delete this reply?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDeleteReply(post._id, replyId),
      },
    ]);
  };

  const handleSend = () => {
    if (replyText.trim()) {
      onSendReply(post._id, replyText);
      setReplyText("");
    }
  };

 return (
  <Modal
    visible={isVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
    statusBarTranslucent // This helps Android ignore top/bottom bars
  >
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Replies</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* SCROLLABLE LIST */}
        <ScrollView
          style={styles.repliesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollPadding}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainPostContext}>
            <Text style={styles.contextUser}>{displayName}</Text>
            <Text style={styles.contextText}>{post?.content}</Text>
          </View>
          <View style={styles.divider} />
          {post?.replies?.map((item) => (
            <View key={item._id} style={styles.replyItemContainer}>
              <View style={styles.replyItem}>
                <Text style={styles.replyUser}>{item.user?.username}</Text>
                <Text style={styles.replyText}>{item.content}</Text>
              </View>
              {item.user?._id === currentUserId && (
                <TouchableOpacity onPress={() => confirmDeleteReply(item._id)} style={styles.trashTouchArea}>
                  <Image source={TrashIcon} style={styles.trashIconStyle} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        {/* INPUT AREA - Absolute bottom logic */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Write a reply..."
              value={replyText}
              onChangeText={setReplyText}
              multiline
              placeholderTextColor="#A3A3A3"
            />
            <TouchableOpacity onPress={handleSend} disabled={isSending || !replyText.trim()} style={styles.sendBtn}>
              <Text style={styles.sendBtnText}>{isSending ? "..." : "Post"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  </Modal>
);
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // Remove justifyContent: 'flex-end' here to prevent center-bias
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    position: 'absolute', 
    bottom: 0,          
    left: 0,
    right: 0,
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    backgroundColor: "white",
    // This padding covers the Android navigation bar area
    paddingBottom: Platform.OS === "ios" ? 30 : 20, 
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    marginHorizontal: -20, // Expand to edges
    paddingHorizontal: 20,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
  },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },
  headerTitle: { fontFamily: "Quicksand-Bold", fontSize: 18, color: "#512DA8" },
  closeBtn: { color: "#FF5252", fontFamily: "Quicksand-Bold", fontSize: 16 },
  scrollPadding: { paddingBottom: 20 },
  mainPostContext: {
    padding: 15,
    backgroundColor: "#F4F3FF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E8E3F9",
  },
  contextUser: { fontFamily: "Quicksand-Bold", color: "#512DA8", fontSize: 15 },
  contextText: {
    fontFamily: "Quicksand-Regular",
    marginTop: 5,
    color: "#444",
    lineHeight: 20,
  },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 20 },

  // ✅ Updated Container for horizontal alignment
  replyItemContainer: {
    flexDirection: "row",
    alignItems: "center", // Centers trash icon vertically relative to the reply block
    marginBottom: 18,
  },
  replyItem: {
    flex: 1, // ✅ Essential: forces the reply to fill space
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#D7D9F4",
  },
  replyUser: { fontFamily: "Quicksand-Bold", fontSize: 14, color: "#333" },
  replyText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  trashTouchArea: {
    padding: 10, // Increases tap target for the user
  },
  trashIconStyle: {
    width: 20,
    height: 20,
    tintColor: "#FF5252",
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 10,
    backgroundColor: "white",
    marginBottom: Platform.OS === "android" ? 5 : 0,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    maxHeight: 100,
    fontFamily: "Quicksand-Regular",
    color: "#333",
    fontSize: 14,
  },
  sendBtn: { marginLeft: 10, paddingVertical: 8 },
  sendBtnText: { color: "#512DA8", fontFamily: "Quicksand-Bold", fontSize: 16 },
});

export default ReplyModal;
