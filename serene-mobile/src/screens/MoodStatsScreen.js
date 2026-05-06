import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { BarChart } from "react-native-gifted-charts";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../api/config";
import CommunityTabButton from "../components/CommunityTabButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeFooter from "../components/HomeFooter";

// Asset Paths
const BackIcon = require("../assets/BackIcon.png");
const GreatIcon = require("../assets/GreatIcon.png");
const GoodIcon = require("../assets/GoodIcon.png");
const OkayIcon = require("../assets/OkayIcon.png");
const BadIcon = require("../assets/BadIcon.png");
const TerribleIcon = require("../assets/TerribleIcon.png");
const LockIcon = require("../assets/lockYellow.png");

const MoodStatsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [timeframe, setTimeframe] = useState("thisWeek");

  const getMoodColor = (moodName) => {
    if (!moodName) return "#808080";
    const m = moodName.toLowerCase();
    if (
      m.includes("happy") ||
      m.includes("content") ||
      m.includes("excited") ||
      m.includes("joyful")
    )
      return "#FFA500";
    if (m.includes("sad") || m.includes("low") || m.includes("lonely"))
      return "#76d1f5";
    if (m.includes("neutral") || m.includes("okay")) return "#808080";
    return "#FF0000";
  };

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/mood/insights?timeframe=${timeframe}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setStats(response.data);
    } catch (error) {
      console.error("Stats Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderChartData = () => {
    if (!stats?.moodData) return [];

    return stats.moodData.map((item) => {
      const avg = item.averageScore;
      const mood = item.finalMood;

      let chartValue = 3;
      if (avg > 1.0) chartValue = 5;
      else if (avg > 0.3) chartValue = 4;
      else if (avg >= -0.3) chartValue = 3;
      else if (avg >= -1.0) chartValue = 2;
      else chartValue = 1;

      let color = "#808080";

      if (
        mood.includes("Happy") ||
        mood.includes("Content") ||
        mood.includes("Excited") ||
        mood.includes("Joyful")
      ) {
        color = "#FFA500";
      } else if (
        mood.includes("Sad") ||
        mood.includes("Low") ||
        mood.includes("Lonely")
      ) {
        color = "#76d1f5";
      } else if (mood.includes("Neutral") || mood.includes("Okay")) {
        color = "#808080";
      } else {
        color = "#FF0000";
      }

      return {
        value: chartValue,
        label: new Date(item.createdAt).toLocaleDateString([], {
          weekday: "short",
        }),
        frontColor: color,
      };
    });
  };

  const renderWeeklySummary = () => {
    if (!stats || stats.summaryLocked) {
      return (
        <Text style={styles.summaryText}>
          Keep tracking your mood! You have to log for at least 5 days for your
          personalized weekly insights to be generated.
        </Text>
      );
    }

    // Safely extract the array of winning moods
    const dominantMoods = stats.dominantMoods || [];

    // ✅ SCENARIO 1: A single dominant mood
    if (dominantMoods.length === 1) {
      const mood = dominantMoods[0];
      let summaryContent =
        " Consistent tracking is a powerful tool for self-awareness.";

      if (mood.includes("Happy") || mood.includes("Content")) {
        summaryContent =
          " It looks like you've had a balanced and peaceful period. Continue leaning into the healthy routines that brought you this peace.";
      } else if (mood.includes("Sad") || mood.includes("Low")) {
        summaryContent =
          " It's okay to feel low. Remember to be gentle with yourself and lean on your support system.";
      } else if (mood.includes("Neutral")) {
        summaryContent =
          " A neutral week represents a stable baseline. Use this time to maintain your healthy habits.";
      }

      return (
        <Text style={styles.summaryText}>
          Based on your logs, your dominant mood was{" "}
          <Text style={[styles.boldMoodText, { color: getMoodColor(mood) }]}>
            {mood}
          </Text>
          .{summaryContent}
        </Text>
      );
    }

    // ✅ SCENARIO 2: A tied mixture of moods!
    else if (dominantMoods.length > 1) {
      let combinedSummary =
        " Consistent tracking is a powerful tool for self-awareness.";

      // Append the specific advice line for each mood they experienced
      dominantMoods.forEach((mood) => {
        if (mood.includes("Happy") || mood.includes("Content")) {
          combinedSummary +=
            " It looks like you've had a balanced and peaceful period.";
        } else if (mood.includes("Sad") || mood.includes("Low")) {
          combinedSummary +=
            " You also had low days; remember to be gentle with yourself and lean on your support system.";
        } else if (mood.includes("Neutral")) {
          combinedSummary +=
            " You've maintained a stable baseline on some days, which is great for healthy habits.";
        }
      });

      // Format the colored text variables: e.g., "Happy and Sad"
      const coloredMoods = dominantMoods.map((m, index) => (
        <Text key={index}>
          <Text style={[styles.boldMoodText, { color: getMoodColor(m) }]}>
            {m}
          </Text>
          {index < dominantMoods.length - 1 ? " and " : ""}
        </Text>
      ));

      return (
        <Text style={styles.summaryText}>
          Based on your logs, your mood was a mixture of {coloredMoods}.
          {combinedSummary}
        </Text>
      );
    }

    return null;
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7E57C2" />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
        style={styles.container}
      >
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={BackIcon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Mood Stats</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.tabBar}>
            <CommunityTabButton
              title="This Week"
              isSelected={timeframe === "thisWeek"}
              onPress={() => setTimeframe("thisWeek")}
            />
            <CommunityTabButton
              title="Last Week"
              isSelected={timeframe === "lastWeek"}
              onPress={() => setTimeframe("lastWeek")}
            />
          </View>

          {/* CHART CARD */}
          <View style={styles.whiteCard}>
            {stats?.chartLocked ? (
              <View style={styles.lockContent}>
                <Image source={LockIcon} style={styles.lockImage} />
                <Text style={styles.cardHeader}>Insight Chart Locked</Text>
                <Text style={styles.lockMessage}>
                  {timeframe === "lastWeek"
                    ? "Not enough data from last week."
                    : "Log your mood today to start your chart!"}
                </Text>
              </View>
            ) : (
              <View style={styles.chartWrapper}>
                <View style={styles.customYAxis}>
                  <View style={styles.yLevel}>
                    <Image source={GreatIcon} style={styles.customYIcon} />
                    <Text style={[styles.yText, { color: "#FFA500" }]}>
                      Excited
                    </Text>
                  </View>
                  <View style={styles.yLevel}>
                    <Image source={GoodIcon} style={styles.customYIcon} />
                    <Text style={[styles.yText, { color: "#FFA500" }]}>
                      Happy
                    </Text>
                  </View>
                  <View style={styles.yLevel}>
                    <Image source={OkayIcon} style={styles.customYIcon} />
                    <Text style={[styles.yText, { color: "#808080" }]}>
                      Okay
                    </Text>
                  </View>
                  <View style={styles.yLevel}>
                    <Image source={BadIcon} style={styles.customYIcon} />
                    <Text style={[styles.yText, { color: "#76d1f5" }]}>
                      Sad
                    </Text>
                  </View>
                  <View style={styles.yLevel}>
                    <Image source={TerribleIcon} style={styles.customYIcon} />
                    <Text style={[styles.yText, { color: "#FF0000" }]}>
                      Distressed
                    </Text>
                  </View>
                  <View style={{ height: 20 }} />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ flex: 1 }}
                >
                  <BarChart
                    data={renderChartData()}
                    height={200}
                    barWidth={20}
                    spacing={25}
                    roundedTop
                    hideRules
                    xAxisThickness={0}
                    yAxisThickness={0}
                    noOfSections={5}
                    maxValue={5}
                    hideYAxisText={true}
                    barBorderRadius={12}
                  />
                </ScrollView>
              </View>
            )}
          </View>

          {/* SUMMARY CARD */}
          <View style={[styles.whiteCard, styles.insightsCard]}>
            <Text style={styles.cardHeader}>
              {timeframe === "thisWeek" ? "Weekly" : "Last Week"} Insights ✨
            </Text>
            <ScrollView
              nestedScrollEnabled={true}
              style={styles.summaryScrollView}
            >
              {renderWeeklySummary()}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.recommendationBtn}
            onPress={() =>
              navigation.navigate("PersonalRecs", {
                recommendations: stats?.recommendations,
              })
            }
          >
            <LinearGradient
              colors={["#7B61FF", "#78469A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Personalized Recommendations</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View
        style={{
          paddingBottom: insets.bottom,
          backgroundColor: "#fff",
        }}
      >
        <HomeFooter navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#FFF",
    width: "100%",
    elevation: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#512DA8",
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginLeft: 15,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 85,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  whiteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    marginBottom: 15,
    width: "100%",
  },
  cardHeader: {
    fontSize: 18,
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  insightsCard: { maxHeight: 180 },
  summaryScrollView: { marginTop: 5 },
  summaryText: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Quicksand-Medium",
    textAlign: "center",
    lineHeight: 22,
  },
  boldMoodText: { fontFamily: "Quicksand-Bold", color: "#FFA500" },
  chartWrapper: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
  },
  customYAxis: {
    justifyContent: "space-between",
    height: 240,
    paddingRight: 10,
  },
  yLevel: { alignItems: "center", justifyContent: "center" },
  customYIcon: { width: 26, height: 26, resizeMode: "contain" },
  yText: { fontSize: 8, fontWeight: "bold", marginTop: 0 },
  recommendationBtn: {
    width: "90%",
    marginTop: 15,
    marginBottom: 20,
    alignSelf: "center",
  },
  btnGradient: {
    height: 55,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "rgb(255, 255, 255)", fontSize: 16, fontFamily: "Quicksand-Bold" },
  footerWrapper: { position: "absolute", bottom: 0, width: "100%" },
  lockContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  lockImage: { width: 50, height: 50, resizeMode: "contain", marginBottom: 10 },
  lockMessage: {
    fontFamily: "Quicksand-Medium",
    color: "#666",
    textAlign: "center",
  },
});

export default MoodStatsScreen;
