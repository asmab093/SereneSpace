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
  Modal,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../api/config";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter";
import { Audio } from "expo-av";
import { Check, X } from "lucide-react-native";

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
  const [recordingInstance, setRecordingInstance] = useState(null);
  const scrollViewRef = useRef();

  // ✅ SCENARIO & CRISIS STATES
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  // 🚨 NEW: Alert Banner State
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

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
    fetchHistory();
  }, [token]);

  const isProcessingAction = useRef(false);

  // 🎤 RECORDING LOGIC START
  async function startRecording() {
    if (isProcessingAction.current) return;
    isProcessingAction.current = true;

    try {
      if (recordingInstance) {
        try {
          await recordingInstance.stopAndUnloadAsync();
        } catch (e) {
          console.log("Cleanup silent fail");
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
      isProcessingAction.current = false;
    }
  }

  async function stopRecording() {
    if (isProcessingAction.current || !recordingInstance) {
      setIsRecording(false);
      return;
    }
    isProcessingAction.current = true;

    try {
      setIsRecording(false);
      const status = await recordingInstance.getStatusAsync();
      if (status.isRecording || status.canRecord) {
        await recordingInstance.stopAndUnloadAsync();
      }

      const uri = recordingInstance.getURI();
      setRecordingInstance(null);

      if (uri) {
        console.log("✅ Recording saved at:", uri);
        sendAudioToBackend(uri);
      }
    } catch (err) {
      console.log("❌ Stop Recording Error:", err.message);
      setRecordingInstance(null);
    } finally {
      isProcessingAction.current = false;
    }
  }

  const sendAudioToBackend = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("audio", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        type: "audio/m4a",
        name: "speech.m4a",
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
  // 🎤 RECORDING LOGIC END

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

      const { reply, triggerCrisisModal, scenarioType, videoUrl, alertSent } =
        response.data;

      const botMsg = {
        id: Date.now() + 1,
        text: reply,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);

      // 🚨 NEW: Trigger the alert banner if SMS was sent
      if (alertSent) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 6000);
      }

      if (triggerCrisisModal) {
        setCurrentScenario(scenarioType);
        setActiveVideoUrl(videoUrl);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MODAL COMPONENT
  const CrisisModal = () => (
    <Modal transparent visible={modalVisible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Serene Support</Text>
          <Text style={styles.modalSubText}>
            {currentScenario === "CRISIS_WITH_CATEGORY"
              ? "We've noticed you're feeling overwhelmed. Your safety is our priority."
              : "I can feel your pain. Please take a moment to ground yourself."}
          </Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("VideoPlayer", { url: activeVideoUrl });
            }}
          >
            <Text style={styles.buttonText}>
              {currentScenario === "CRISIS_WITH_CATEGORY"
                ? " Watch therapeutic video"
                : " Watch grounding video"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("CrisisSupport");
            }}
          >
            <Text style={styles.buttonText}> Get crisis support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: "#F0F0F0" }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={[styles.buttonText, { color: "#666" }]}>
              I am okay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1 }}>
      <CrisisModal />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient
          colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
          style={styles.innerContainer}
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
            <Text style={styles.headerTitle}>Serene Bot</Text>
          </View>

          {/* 🚨 NEW: THE ALERT BANNER */}
          {showAlert && (
            <View style={styles.alertBanner}>
              <View style={styles.alertIconContainer}>
                <Check size={24} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={styles.alertText}>
                An alert has been successfully{"\n"}sent.
              </Text>
              <TouchableOpacity onPress={() => setShowAlert(false)}>
                <X size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg._id || msg.id || index.toString()}
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
              onPressIn={startRecording}
              onPressOut={stopRecording}
              style={styles.micButton}
            >
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
            </TouchableOpacity>

            <View style={styles.textInputContainer}>
              {isRecording ? (
                <View style={styles.recordingOverlay}>
                  <View style={styles.redDot} />
                  <Text style={styles.recordingText}>Listening...</Text>
                </View>
              ) : (
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
      <View
        style={[styles.footerWrapper, { paddingBottom: insets.bottom || 8 }]}
      >
        <HomeFooter navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //   footerWrapper: {
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: "#FFFFFF",
  //   borderTopWidth: 1,
  //   borderTopColor: "#EBE5F7",
  //   elevation: 4,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: -2 },
  //   shadowOpacity: 0.08,
  //   shadowRadius: 4,
  //   zIndex: 10,
  // },
  container: { flex: 1, backgroundColor: "#D7D9F4" },
  innerContainer: { flex: 1 },
  messageContainer: {
    flexDirection: "row",
    maxWidth: "85%",
    marginVertical: 7,
    paddingHorizontal: 15,
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
  messageBubble: { padding: 12, borderRadius: 15, maxWidth: "100%" },
  botBubble: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 0 },
  userBubble: { backgroundColor: "#A892FF", borderTopRightRadius: 0 },
  botText: { fontSize: 15, color: "#333", fontFamily: "Quicksand-Regular" },
  userText: { fontSize: 15, color: "#FFFFFF", fontFamily: "Quicksand-Regular" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EBE5F7",
  },
  textInputContainer: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    // marginBottom:20,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 15,
    fontFamily: "Quicksand-Regular",
    color: "#333",
  },
  recordingOverlay: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginRight: 8,
  },
  recordingText: {
    color: "red",
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
  },
  micButton: { padding: 5, marginRight: 8 },
  micIcon: { width: 28, height: 28, tintColor: "#512DA8" },
  sendIcon: { width: 28, height: 28, tintColor: "#512DA8" },
  loadingText: { alignSelf: "center", color: "#888", marginVertical: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(81, 45, 168, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "Quicksand-Bold",
    color: "#512DA8",
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Quicksand-Regular",
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#A892FF",
    padding: 15,
    borderRadius: 15,
    marginVertical: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "Quicksand-Bold",
    fontSize: 15,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  alertIconContainer: {
    backgroundColor: "#6BDBB5",
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  alertText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Quicksand-Bold",
    color: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    elevation: 4,
    width: "100%",
    marginBottom: 10,
  },
  backButton: {
    padding: 0,
    marginRight: 0,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#512DA8",
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginLeft: 5,
  },
});

export default ChatBotScreen;
