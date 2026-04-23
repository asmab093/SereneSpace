import React, { useState, useRef, useEffect, useContext } from "react"; // Added useContext
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,TextInput,KeyboardAvoidingView,
  Platform,} from "react-native";
import axios from "axios"; // Added axios import
import { AuthContext } from "../context/AuthContext"; // Added AuthContext import
import { BASE_URL } from "../api/config"; // Added BASE_URL import
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter"; // ⬅️ Add Footer Import

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const BackIcon = require("../assets/BackIcon.png");
const SendIcon = require("../assets/SendIcon.png"); // Icon for sending messages
const ChatBotAvatar = require("../assets/ChatbotAvatarIcon.png"); // Placeholder for the bot's avatar
const MicIcon = require("../assets/MicIcon.png");

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
  const insets = useSafeAreaInsets();
  const { token } = useContext(AuthContext); // Access token from context
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]); // Start with empty array
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  //Added useEffect to auto-scroll whenever the messages array changes
  // Load History on Screen Mount
  useEffect(() => {
  const fetchHistory = async () => {
    // 1. Only run if we have a token
    if (!token) {
      console.log("🕒 Waiting for token...");
      return;
    }

    try {
      console.log("🔄 Fetching history from:", `${BASE_URL}/api/chat/history`);
      
      const res = await axios.get(`${BASE_URL}/api/chat/history`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache' // Prevent stale data
        },
        timeout: 5000 // 5 second timeout
      });

      if (res.data.success) {
        setMessages(res.data.history);
        console.log("✅ History loaded successfully");
      }
    } catch (err) {
      // 2. Log more detail to see exactly why it failed
      console.error("❌ History Load Details:", err.message);
      if (err.code === 'ECONNABORTED') console.log("⚠️ Request timed out");
    }
  };

  // 3. Give the app 500ms to breathe before fetching
  const delayDebounceFn = setTimeout(() => {
    fetchHistory();
  }, 500);

  return () => clearTimeout(delayDebounceFn);
}, [token]); // Re-run if token becomes available

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/chat/message`,
        { message: userMsg.text },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const botMsg = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
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
          <View style={[styles.header, { paddingTop: insets.top }]}>
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

          <ScrollView ref={scrollViewRef}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && (
              <Text style={{ alignSelf: "center", color: "#888" }}>
                Bot is thinking...
              </Text>
            )}
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
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF", // White background
    paddingVertical: 10,
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
    marginVertical: 7,
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
    // marginBottom: 30,
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
