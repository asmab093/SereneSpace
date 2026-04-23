import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../api/config";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter";
import { Audio } from "expo-av";

const BackIcon = require("../assets/BackIcon.png");
const SendIcon = require("../assets/SendIcon.png");
const ChatBotAvatar = require("../assets/ChatbotAvatarIcon.png");
const MicIcon = require("../assets/MicIcon.png");

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
  const { token } = useContext(AuthContext);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null); // Renamed to avoid confusion
  const scrollViewRef = useRef();

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } catch (err) {
        console.log("Audio Setup Error:", err);
      }
    };
    setupAudio();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });
        if (res.data.success) setMessages(res.data.history);
      } catch (err) {
        console.error("❌ History Load Error:", err.message);
      }
    };
    const delayDebounceFn = setTimeout(() => fetchHistory(), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [token]);

  const isProcessingAction = useRef(false);

  async function startRecording() {
    if (isProcessingAction.current) return; // Ignore if we are already busy
    isProcessingAction.current = true;

    console.log("🔘 MIC BUTTON PRESSED IN");
    try {
      // 1. Force cleanup of any existing instance before starting
      if (recordingInstance) {
        try {
          await recordingInstance.stopAndUnloadAsync();
        } catch (e) {
          console.log("Cleanup silent fail (expected)");
        }
        setRecordingInstance(null);
      }

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        isProcessingAction.current = false;
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      setRecordingInstance(recording);
      setIsRecording(true);
      console.log("🔴 RECORDING STARTED");
    } catch (err) {
      console.error("❌ Failed to start recording", err);
      setIsRecording(false);
    } finally {
      isProcessingAction.current = false; // Unlock
    }
  }

  async function stopRecording() {
    if (isProcessingAction.current || !recordingInstance) {
      setIsRecording(false);
      return;
    }
    isProcessingAction.current = true;

    console.log("🔘 MIC BUTTON RELEASED");
    try {
      setIsRecording(false);

      // 2. Double check status before unloading
      const status = await recordingInstance.getStatusAsync();
      if (status.isRecording || status.canRecord) {
        await recordingInstance.stopAndUnloadAsync();
      }

      const uri = recordingInstance.getURI();
      setRecordingInstance(null); // Clear instance immediately

      if (uri) {
        console.log("✅ Recording saved at:", uri);
        sendAudioToBackend(uri);
      }
    } catch (err) {
      console.log("❌ Stop Recording Error:", err.message);
      setRecordingInstance(null);
    } finally {
      isProcessingAction.current = false; // Unlock
    }
  }

  // 3. Helper function to keep stopRecording clean
  const sendAudioToBackend = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("audio", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        type: "audio/m4a", // 👈 Ensure this matches
        name: "speech.m4a", // 👈 And this matches
      });

      const res = await axios.post(
        `${BASE_URL}/api/chat/transcribe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.text) {
        setInputText(res.data.text);
      }
    } catch (err) {
      console.log("❌ STT Error:", err.message);
    }
  };

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
      >
        <LinearGradient
          colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
          style={styles.innerContainer}
        >
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={BackIcon} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Serene Bot</Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          >
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg._id || msg.id || `msg-${index}`}
                message={msg}
              />
            ))}
            {loading && (
              <Text style={styles.loadingText}>Bot is thinking...</Text>
            )}
          </ScrollView>

          <View style={styles.inputBar}>
            <TouchableOpacity
              activeOpacity={1}
              delayLongPress={0}
              onPressIn={startRecording}
              onPressOut={stopRecording}
              style={styles.micButton}
            >
              <View pointerEvents="none">
                <Image
                  source={MicIcon}
                  style={[
                    styles.micIcon,
                    isRecording && {
                      tintColor: "red",
                      transform: [{ scale: 1.2 }],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.textInputContainer}>
              {isRecording ? (
                /* 🎤 This is shown ONLY when recording */
                <View style={styles.recordingOverlay}>
                  <View style={styles.redDot} />
                  <Text style={styles.recordingText}>Listening...</Text>
                </View>
              ) : (
                /* ⌨️ This is shown normally */
                <TextInput
                  style={styles.textInput}
                  placeholder="Type a message..."
                  value={inputText}
                  onChangeText={setInputText}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || isRecording}
            >
              <Image
                source={SendIcon}
                style={[
                  styles.sendIcon,
                  (!inputText.trim() || isRecording) && { opacity: 0.3 },
                ]}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
      <View style={{ paddingBottom: insets.bottom, backgroundColor: "#fff" }}>
        <HomeFooter navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center', // Centers the "Listening" text vertically
  },
  recordingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: '100%',
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 8,
  },
  recordingText: {
    color: 'red',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 15,
    fontFamily: "Quicksand-Regular",
    color: "#333",
  },
  container: { flex: 1, backgroundColor: "#D7D9F4" },
  innerContainer: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EBE5F7",
  },
  backIcon: { width: 18, height: 18, tintColor: "#512DA8" },
  headerTitle: {
    fontSize: 20,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginLeft: 15,
  },
  chatContent: { paddingHorizontal: 15, paddingVertical: 10 },
  messageContainer: {
    flexDirection: "row",
    maxWidth: "85%",
    marginVertical: 7,
  },
  botMessageContainer: { alignSelf: "flex-start" },
  userMessageContainer: { alignSelf: "flex-end", justifyContent: "flex-end" },
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
    elevation: 2,
  },
  botBubble: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 0 },
  userBubble: { backgroundColor: "#A892FF", borderTopRightRadius: 0 },
  botText: { fontSize: 15, color: "#333" },
  userText: { fontSize: 15, color: "#FFFFFF" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EBE5F7",
  },
  micButton: { padding: 5, marginRight: 8 },
  micIcon: { width: 28, height: 28, tintColor: "#512DA8" },
  sendIcon: { width: 28, height: 28, tintColor: "#512DA8" },
  loadingText: { alignSelf: "center", color: "#888", marginVertical: 10 },
});

export default ChatBotScreen;
