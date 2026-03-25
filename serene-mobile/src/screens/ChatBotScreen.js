import React, { useState, useRef, useEffect } from "react";
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter"; // ⬅️ Add Footer Import

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const BackIcon = require("../assets/BackIcon.png");
const SendIcon = require("../assets/SendIcon.png"); // Icon for sending messages
const ChatBotAvatar = require("../assets/ChatbotAvatarIcon.png"); // Placeholder for the bot's avatar
const MicIcon = require("../assets/MicIcon.png");

// --- Dummy Chat Data ---
const DUMMY_MESSAGES = [
  {
    id: 1,
    text: "Welcome back! How are you feeling today?",
    sender: "bot",
    time: "10:00 AM",
  },
  {
    id: 2,
    text: "I've been feeling overwhelmed and stressed about work lately.",
    sender: "user",
    time: "10:01 AM",
  },
  {
    id: 3,
    text: "I understand. Stress is common, but let's explore that. Would you like to try a quick breathing exercise?",
    sender: "bot",
    time: "10:02 AM",
  },
  {
    id: 4,
    text: "Yes, please. I need to clear my mind.",
    sender: "user",
    time: "10:03 AM",
  },
];

// --- Chat Message Component ---
const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <View
      style={[
        styles.messageContainer,
        isBot ? styles.botMessageContainer : styles.userMessageContainer,
      ]}
    >
      {isBot && (
        <Image
          source={ChatBotAvatar}
          style={styles.botAvatar}
          resizeMode="cover"
        />
      )}

      <View
        style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text style={isBot ? styles.botText : styles.userText}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

const ChatBotScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets(); // ⬅️ Handle safe area for footer
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef();

  // Scroll to the bottom when messages load/update
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [DUMMY_MESSAGES]);

  const handleSend = () => {
    if (inputText.trim()) {
      console.log("Sending message: " + inputText);
      // Future implementation: Add new message to DUMMY_MESSAGES array and clear input
      setInputText("");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <LinearGradient
          colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.innerContainer}
        >
          <View style={styles.header}>
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
            <Text style={styles.headerTitle}>Serene Bot</Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {DUMMY_MESSAGES.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <View style={{ height: 10 }} />
          </ScrollView>

          <View style={styles.inputBar}>
            <TouchableOpacity
              onPress={() => console.log("Mic activated")}
              style={styles.micButton}
            >
              <Image
                source={MicIcon}
                style={styles.micIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#A3A3A3"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />

            <TouchableOpacity
              onPress={handleSend}
              style={styles.sendButton}
              disabled={!inputText.trim()}
            >
              <Image
                source={SendIcon}
                style={[
                  styles.sendIcon,
                  !inputText.trim() && styles.disabledIcon,
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
      {/* ✅ ADDED FOOTER: Outside KeyboardAvoidingView to stay at bottom */}
      <View style={{ paddingBottom: insets.bottom, backgroundColor: "#fff" }}>
        <HomeFooter navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7D9F4",
  },
  innerContainer: {
    flex: 1,
  },

  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF", // White background
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EBE5F7",
  },
  backButton: { padding: 5 },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#512DA8", // Purple tint
  },
  headerTitle: {
    fontSize: 20,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginLeft: 15,
  },

  // --- Chat Content ---
  chatContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: "row",
    maxWidth: "85%",
    marginVertical: 10,
  },
  botMessageContainer: {
    alignSelf: "flex-start",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginTop: 5,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 15,
    maxWidth: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: "#FFFFFF", // White bubble for bot
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: "#A892FF", // Light purple for user
    borderTopRightRadius: 0,
  },
  botText: {
    fontSize: 15,
    color: "#333",
    fontFamily: "Quicksand-Regular",
  },
  userText: {
    fontSize: 15,
    color: "#FFFFFF", // White text for user
    fontFamily: "Quicksand-Regular",
  },

  // --- Input Bar ---
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF", // White background
    borderTopWidth: 1,
    borderTopColor: "#EBE5F7",
    marginBottom: 30,
    // height:80,
  },
  micButton: {
    padding: 5,
    marginRight: 8, // Space between mic icon and text input
  },
  micIcon: {
    width: 28,
    height: 28,
    tintColor: "#512DA8", // Use the app's primary color
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    // Ensure space on the right (before send icon) and flex correctly
    marginRight: 10,
    fontSize: 15,
    fontFamily: "Quicksand-Regular",
    color: "#333",
  },
  sendButton: {
    padding: 8,
  },
  sendIcon: {
    width: 28,
    height: 28,
    tintColor: "#512DA8", // Purple tint when active
  },
  disabledIcon: {
    tintColor: "#512DA8", // Grey tint when disabled
  },
});

export default ChatBotScreen;
