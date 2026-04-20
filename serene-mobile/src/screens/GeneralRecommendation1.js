import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from 'axios';
import { AuthContext } from "../context/AuthContext"; 
import { BASE_URL } from '../api/config';
import { useSafeAreaInsets } from "react-native-safe-area-context"; // ✅ Imported safe area for matching top spacing

// Assets
const BackArrow = require("../assets/BackIcon.png");
const WarningIcon = require("../assets/WarningIcon.png");
const ButtonLeftArrow = require("../assets/ButtonLeftArrow.png");

const CARD_GRADIENT_COLORS = ["#7B61FF", "#78469A"];
const MOOD_GRADIENT_COLORS = ["#7B61FF", "#78469A"];

// Custom Recommendation Tab Component built directly into this file
const CustomTab = ({ title, type, selectedType, onPress }) => {
  const isSelected = selectedType === type;

  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        isSelected && styles.activeTabButton
      ]}
      onPress={() => onPress(type)}
    >
      <Text
        style={[
          styles.tabText,
          isSelected && styles.activeTabText
        ]}
        numberOfLines={1} 
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const GeneralRecommendation1 = ({ navigation }) => {
  const insets = useSafeAreaInsets(); // ✅ Initialize safe area insets
  const { token } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState("daily_uplift");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/mood/general-recommendations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching general recs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleTabSelect = (category) => {
    setSelectedCategory(category);
  };

  const getEmojiForRec = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("sun") || lowerText.includes("morning") || lowerText.includes("outside")) return "🌻"; 
    if (lowerText.includes("water") || lowerText.includes("hydration") || lowerText.includes("shower") || lowerText.includes("tea")) return "💧";
    if (lowerText.includes("breath") || lowerText.includes("pause") || lowerText.includes("body scan") || lowerText.includes("stretch")) return "🍃"; 
    if (lowerText.includes("music") || lowerText.includes("listen") || lowerText.includes("ambient")) return "🎶"; 
    if (lowerText.includes("mindset") || lowerText.includes("replace") || lowerText.includes("gratitude") || lowerText.includes("compliment")) return "🌸"; 
    if (lowerText.includes("phone") || lowerText.includes("screen") || lowerText.includes("unplugged") || lowerText.includes("focus")) return "🪴"; 
    if (lowerText.includes("rest") || lowerText.includes("nap") || lowerText.includes("sleep")) return "🌙"; 

    return "🌿"; 
  };

  const StepCard = ({ emoji, text, style }) => (
    <View style={[styles.stepBubbleContainer, style]}>
      <View style={styles.stepCardBase}>
        <LinearGradient
          colors={CARD_GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.stepHeaderGradient}
        >
          <Text style={styles.stepEmoji}>{emoji}</Text>
        </LinearGradient>
        <View style={styles.stepBody}>
          <Text style={styles.stepTextBody}>{text}</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#7B61FF" style={{ marginTop: 50 }} />;
    }

    const filteredData = recommendations.filter(rec => rec.category === selectedCategory);

    if (filteredData.length === 0) {
      return <Text style={styles.emptyText}>No recommendations found for this category yet.</Text>;
    }

    return (
      <View style={styles.stepsContainer}>
        {filteredData.map((item, index) => {
          const alignmentStyle = index % 2 === 0 ? styles.stepBubble : styles.stepBubbleRight;
          
          return (
            <StepCard
              key={item._id || index}
              emoji={getEmojiForRec(item.description)}
              text={item.description}
              style={alignmentStyle}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* ✅ MOVED HEADER OUTSIDE OF THE PADDED contentView */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={BackArrow} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Recommendation Guide🌱</Text>
      </View>

      <View style={styles.contentView}>
        <View style={styles.warningBox}>
          <Image source={WarningIcon} style={styles.warningIcon} resizeMode="contain" />
          <Text style={styles.warningText}>
            These are general well-being suggestions. Explore what feels right for you.
          </Text>
        </View>

        <View style={styles.tabsContainer}>
          <CustomTab title="Daily Uplift" type="daily_uplift" selectedType={selectedCategory} onPress={handleTabSelect} />
          <CustomTab title="Mindful Moments" type="mindful_moments" selectedType={selectedCategory} onPress={handleTabSelect} />
          <CustomTab title="Reset & Recharge" type="reset_recharge" selectedType={selectedCategory} onPress={handleTabSelect} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScrollArea}>
          {renderContent()}
        </ScrollView>

        <TouchableOpacity
          style={styles.tryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <LinearGradient
            colors={MOOD_GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View style={styles.buttonContent}>
              <Image source={ButtonLeftArrow} style={styles.buttonArrowIcon} resizeMode="contain" />
              <Text style={styles.tryButtonText}>Try These This Week</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentView: { flex: 1, paddingHorizontal: 20, alignItems: "center" },
  contentScrollArea: { flex: 1, width: "100%" },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#512DA8', fontFamily: 'Quicksand-Medium' },

  // ✅ PERFECTLY MATCHED HEADER STYLES (No 115% width hack)
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    backgroundColor: "#FFFFFF", 
    paddingBottom: 15, 
    elevation: 4, 
    width: "100%", 
    marginBottom: 10,
  },
  backButton: { 
    padding: 0, 
    marginRight: 0 // Neutralized so it doesn't add extra unseen space
  }, 
  backIcon: { 
    width: 24, 
    height: 24, 
    tintColor: "#512DA8", 
    resizeMode: 'contain' 
  }, 
  screenTitle: { 
    fontSize: 18, 
    color: "#512DA8", 
    fontFamily: "Quicksand-Bold", 
    marginLeft: 15 // Added to exactly match the other screens
  },

  // --- Warning Box ---
  warningBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
  },
  warningIcon: {
    width: 20,
    height: 20,
    marginBottom: 5, 
  },
  warningText: {
    fontSize: 14,
    color: "#512DA8",
    textAlign: "center",
    fontFamily: "Quicksand-Regular",
  },

  tabsContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%",
    marginBottom: 5, 
    marginTop: 10, 
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E3F9',
  },
  activeTabButton: {
    backgroundColor: '#7B61FF',
    borderColor: '#7B61FF',
  },
  tabText: {
    fontSize: 11,
    fontFamily: 'Quicksand-Bold',
    color: '#512DA8',
  },
  activeTabText: {
    color: '#FFFFFF',
  },

  stepsContainer: { width: "100%", marginBottom: 5, marginTop: 10 },
  stepCardBase: {
    width: "90%", borderRadius: 15, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 5, elevation: 6,
    backgroundColor: "#D7D9F4", 
  },
  stepBubbleContainer: { width: "80%", marginBottom: 15 },
  stepBubble: { alignSelf: "flex-start" },
  stepBubbleRight: { alignSelf: "flex-end" },

  stepHeaderGradient: { height: 50, alignItems: "center", justifyContent: "center" },
  stepEmoji: { fontSize: 22 },

  stepBody: { backgroundColor: "#D7D9F4", paddingHorizontal: 15, paddingBottom: 15, paddingTop: 10 },
  stepTextBody: { fontSize: 13, color: "#000", fontFamily: "Quicksand-Medium", textAlign: "justify", lineHeight: 20 },
  
  gradient: {
    height: 50, width: "90%", paddingVertical: 10, borderRadius: 10, alignItems: "center", justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 15,
  },
  buttonArrowIcon: { width: 18, height: 18, marginRight: 8 },
  tryButton: {
    width: 250, borderRadius: 25, marginBottom: 10, alignSelf: "center", marginTop: 10, alignItems: "center",
  },
  tryButtonText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Quicksand-SemiBold" },
});

export default GeneralRecommendation1;