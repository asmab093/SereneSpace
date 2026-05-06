import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from 'axios';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BASE_URL } from '../api/config';

const SunflowerIcon = require("../assets/SunflowerIcon.png");
const WarningIcon = require("../assets/WarningIcon.png");
const BackIcon = require("../assets/BackIcon.png");
const LockIcon = require("../assets/lockYellow.png");

const PersonalizedRecommendationsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  // If stats are locked, this array comes in as empty []
  const recommendations = route.params?.recommendations || [];
  const [dailyTip, setDailyTip] = useState("Loading tip...");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/mood/daily-tip`);
        if (res.data && res.data.text) setDailyTip(res.data.text);
      } catch (err) {
        setDailyTip("Unclench your jaw and drop your shoulders. 🧘");
      }
    };
    fetchTip();
  }, []);

  const getRecEmoji = (title) => {
    const text = title?.toLowerCase() || "";
    if (text.includes("movement") || text.includes("walk")) return "🧘‍♀️";
    if (text.includes("joy") || text.includes("weekend")) return "🪷";
    if (text.includes("breathing") || text.includes("reset") || text.includes("neutral")) return "🧘";
    return "✨";
  };

  const handleNext = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentItem = recommendations[currentIndex];

  return (
    <LinearGradient colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={BackIcon} style={styles.backIconStyle} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personalized Recommendations</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.tipCard}>
          <Image source={SunflowerIcon} style={styles.sunflower} />
          <Text style={styles.tipTitle}>Tip of the day</Text>
          <Text style={styles.tipText}>{dailyTip}</Text>
        </View>

        <View style={styles.mainContentArea}>
          <Image source={WarningIcon} style={styles.alertIcon} />
          <Text style={styles.subText}>
            Based on your weekly mood insights, here’s what may help you feel balanced and supported 🌸
          </Text>

          {/* ✅ UPDATED: Logic to show recommendations or a Locked Message */}
          {recommendations.length > 0 ? (
            <View style={styles.carouselWrapper}>
              
              <TouchableOpacity 
                onPress={handlePrev} 
                disabled={currentIndex === 0}
                style={[styles.navArrow, currentIndex === 0 && { opacity: 0.3 }]}
              >
                <Text style={styles.arrowText}>{"<"}</Text>
              </TouchableOpacity>

              <View style={styles.recCard}>
                <View style={styles.recCardHeader}>
                  <Text style={styles.recCardHeaderTitle} numberOfLines={1}>
                    {getRecEmoji(currentItem.title)} {currentItem.title}
                  </Text>
                </View>
                <View style={styles.recCardBody}>
                  <Text style={styles.recDesc}>{currentItem.description}</Text>
                </View>
                <View style={styles.pageIndicator}>
                    <Text style={styles.pageText}>{currentIndex + 1} / {recommendations.length}</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleNext} 
                disabled={currentIndex === recommendations.length - 1}
                style={[styles.navArrow, currentIndex === recommendations.length - 1 && { opacity: 0.3 }]}
              >
                <Text style={styles.arrowText}>{">"}</Text>
              </TouchableOpacity>

            </View>
          ) : (
            /* ✅ NEW: Locked State View */
            <View style={styles.emptyContainer}>
              <Image source={LockIcon} style={styles.lockImage} />
              <Text style={styles.emptyTextHeader}>Recommendations Locked!</Text>
              <Text style={styles.emptyText}>Log your mood for at least 5 days to unlock personalized insights! 🌟</Text>
            </View>
          )}

          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>Want more ideas? Try our Recommendation Guide 🌱</Text>
            <TouchableOpacity style={styles.tryBtn} onPress={() => navigation.navigate("GeneralRecs")}>
              <Text style={styles.tryText}>Try Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient colors={["#D7D9F4", "#B39DDB"]} style={styles.resourceSection}>
          <Image source={WarningIcon} style={styles.alertIcon} />
          <Text style={styles.resourceHeader}>If you're struggling, here are resources:</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("ChatBot")}>
            <Text style={styles.actionBtnText}>Chatbot therapy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("CrisisSupport")}>
            <Text style={styles.actionBtnText}>Find professional help</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    backgroundColor: "#FFFFFF", 
    paddingBottom: 15, 
    elevation: 4, 
    width: '100%' 
  },
  backIconStyle: { 
    width: 24, 
    height: 24, 
    tintColor: '#512DA8', 
    resizeMode: 'contain' 
  },
  headerTitle: { 
    fontSize: 18, 
    color: '#512DA8', 
    fontFamily: 'Quicksand-Bold', 
    marginLeft: 15 
  },
  tipCard: { backgroundColor: '#FFF', margin: 20, borderRadius: 20, padding: 15, alignItems: 'center', elevation: 3 },
  sunflower: { width: 30, height: 30, marginBottom: 5 },
  tipTitle: { fontFamily: 'Quicksand-Bold', color: '#512DA8', fontSize: 16 },
  tipText: { fontFamily: 'Quicksand-Medium', color: '#444', textAlign: 'center', marginTop: 5 },
  
  mainContentArea: { alignItems: 'center', width: '100%' },
  alertIcon: { width: 24, height: 24, marginBottom: 10 },
  subText: { textAlign: 'center', color: '#512DA8', fontFamily: 'Quicksand-SemiBold', marginBottom: 20, paddingHorizontal: 40 },

  carouselWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 10 },
  navArrow: { padding: 15, backgroundColor: '#9575CD', borderRadius: 50, elevation: 2 },
  arrowText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  
  recCard: { 
    width: 240, 
    height: 220, 
    borderRadius: 25, 
    marginHorizontal: 10, 
    overflow: 'hidden', 
    elevation: 3,
    backgroundColor: '#E8E3F9',
  },
  recCardHeader: { backgroundColor: '#9575CD', padding: 15 },
  recCardHeaderTitle: { color: '#FFF', fontFamily: 'Quicksand-Bold', fontSize: 14 },
  recCardBody: { padding: 15, flex: 1 },
  recDesc: { color: '#444', fontSize: 14, fontFamily: 'Quicksand-Medium', lineHeight: 18 },
  pageIndicator: { alignSelf: 'center', paddingBottom: 10 },
  pageText: { fontSize: 10, color: '#9575CD', fontFamily: 'Quicksand-Bold' },

  guideContainer: { alignItems: 'center', marginTop: 30 },
  guideText: { color: '#512DA8', fontFamily: 'Quicksand-Bold', marginBottom: 15, fontSize: 14, paddingHorizontal: 20,textAlign: 'center' },
  tryBtn: { backgroundColor: '#7B61FF', paddingHorizontal: 35, paddingVertical: 12, borderRadius: 12 },
  tryText: { color: '#FFF', fontFamily: 'Quicksand-Bold', fontSize: 16 },
  
 resourceSection: { 
    marginTop: 30, 
    padding: 30, 
    paddingBottom: 50,           
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    alignItems: 'center',
    flex: 1,                     
    justifyContent: 'flex-end'   
  },
  resourceHeader: { color: '#512DA8', fontFamily: 'Quicksand-Bold', marginBottom: 20, fontSize: 16 },
  actionBtn: { backgroundColor: '#7B61FF', width: '90%', padding: 15, borderRadius: 18, marginBottom: 15, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontFamily: 'Quicksand-Bold', fontSize: 16 },
  
  // ✅ NEW STYLES FOR LOCKED STATE
  emptyContainer: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: 200, 
    paddingHorizontal: 40,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 30,
    marginHorizontal: 20
  },
  lockImage: { 
    width: 40, 
    height: 40, 
    resizeMode: 'contain', 
    marginBottom: 10 
  },
  emptyTextHeader: {
    color: "#444",                  
    fontFamily: "Quicksand-Bold",   
    fontSize: 14,                   
    textAlign: 'center',
    marginTop: 10,
  },
  emptyText: {
    color: "#666",                 
    fontFamily: "Quicksand-Medium", 
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default PersonalizedRecommendationsScreen;