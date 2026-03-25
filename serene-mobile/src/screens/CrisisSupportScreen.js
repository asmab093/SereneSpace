import React, { useState, useEffect } from "react";
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,TextInput,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CommunityTabButton from "../components/CommunityTabButton"; // Reused for tabs

// NOTE: Ensure these PNG assets exist in your src/assets/ folder:
const BackIcon = require("../assets/BackIcon.png");
const PhoneIcon = require("../assets/phone-call.png"); // Icon for phone/call action
const TimeIcon = require("../assets/clock.png"); // Icon for time/schedule
const UserGroupIcon = require("../assets/group.png"); // Icon for Counselors/Volunteers
const WebsiteIcon = require("../assets/global.png"); // Icon for website link
const LocationIcon = require("../assets/LocationIcon.png"); // Icon for website link
const SearchIcon = require("../assets/SearchIcon.png"); // Icon for search bar
const WhatsappIcon = require("../assets/whatsapp.png");
const CallIcon2 = require("../assets/phone-call.png");

// --- Dummy Data ---
const HOTLINE_DATA = [
  {
    id: 1,
    name: "Rozan Counseling Help Line (RCHL)",
    tags: ["Everyone"],
    hours: "9:00 AM - 5:00 PM",
    staff: "Counselors",
    phone: "051-5150992",
    web: "rozan.org",
  },
  {
    id: 2,
    name: "Bedari Helpline",
    tags: ["Women"],
    hours: "9:00 AM - 5:00 PM",
    staff: "Volunteers",
    phone: "0300-5251717",
    web: "bedari.org.pk",
  },
  {
    id: 3,
    name: "Umang",
    tags: ["Women", "Youth", "Children"],
    hours: "9:00 AM - 5:00 PM",
    staff: "Volunteers",
    phone: "0300-5251717",
    web: "umang.org.pk",
  },
  {
    id: 4,
    name: "Rozan Counseling Help Line (RCHL)",
    tags: ["Everyone"],
    hours: "9:00 AM - 5:00 PM",
    staff: "Counselors",
    phone: "051-5150992",
    web: "rozan.org",
  },
  {
    id: 5,
    name: "Bedari Helpline",
    tags: ["Women"],
    hours: "9:00 AM - 5:00 PM",
    staff: "Volunteers",
    phone: "0300-5251717",
    web: "bedari.org.pk",
  },
];

const PROFESSIONAL_DATA = [
  {
    id: 1,
    name: "Dr. Ayesha Khan",
    expertise: ["Trauma", "Abuse Cases",'stress','domestic abuse'],
    years: "3+",
    fee: "$50 for 50mins",
    location: "F-7, Islamabad Medical Complex",
  },
  {
    id: 2,
    name: "Dr. Umer Aalam",
    expertise: ["Stress Relief", "Anger control", "Bipolar Disorder"],
    years: "7+",
    fee: "$25 for 50mins",
    location: "DHA, phase 2, Sector -B, street 9",
  },
  {
    id: 3,
    name: "Dr. Mahnoor Fahad",
    expertise: ["Trauma", "Abuse Cases","anxiety"],
    years: "5+",
    fee: "$42 for 60mins",
    location: "DHA, phase 2, Sector -B, street 9",
  },
  {
    id: 4,
    name: "Dr. Abdul Ahad",
    expertise: ["Stress", "stress control", "Bipolar Disorder"],
    years: "7+",
    fee: "$25 for 50mins",
    location: "DHA, phase 2, Sector -B, street 9",
  },
  
];

const CrisisSupportScreen = ({ navigation ,route}) => {
  // Use the initialTab prop to set the starting state
  // ✅ EXTRACTION: Get initial tab from route params, fallback to 'hotlines'
  const { tab } = route.params || { tab: "hotlines" };
  const [activeTab, setActiveTab] = useState(tab);

  // Sync state if the user navigates here again with a different tab parameter
  useEffect(() => {
    if (route.params?.tab) {
      setActiveTab(route.params.tab);
    }
  }, [route.params?.tab]);

  // --- Expandable Text Component (FIXED LOGIC) ---
  const ExpandableText = ({ fullText, maxLines = 3 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 💡 FIX 1: Define condensed text length
    const MAX_CHARACTERS = 80;
    const condensedText =
      fullText.length > MAX_CHARACTERS
        ? fullText.substring(0, MAX_CHARACTERS) + "..."
        : fullText;

    // 💡 FIX 2: Determine if the button should exist by comparing content length
    const needsExpansionButton = fullText.length > MAX_CHARACTERS;
    const displayContent = isExpanded ? fullText : condensedText;
    const buttonText = isExpanded ? "Read less ᐱ" : "Read more ⇣";

    return (
      <View>
        <Text
          style={styles.description}
          // Apply truncation (numberOfLines) only when condensed and if it needs expansion
          numberOfLines={isExpanded ? undefined : maxLines}
        >
          {displayContent}
        </Text>

        {needsExpansionButton && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.readMore}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // --- Reusable Hotline Card Component ---
  const HotlineCard = ({ data }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={PhoneIcon}
          style={styles.phoneIcon}
          resizeMode="contain"
        />
        <View style={styles.headerText}>
          <Text style={styles.cardTitle}>{data.name}</Text>

          <ExpandableText
            fullText={
              "It offers a confidential, non-judgmental space for young people, women, and children to share.We have also established a survivor centered, multisectoral response mechanism to deal cases of gender based violence (GBV).  The contact details of our services are given below."
            }
          />
        </View>
      </View>
      <View style={styles.cardDetails}>
        <View style={styles.detailsColumn}>
          <View style={styles.detailRow}>
            <Image
              source={TimeIcon}
              style={styles.detailIcon}
              resizeMode="contain"
            />
            <Text style={styles.detailText}>{data.hours}</Text>
          </View>
          <View style={styles.detailRow}>
            <Image
              source={UserGroupIcon}
              style={styles.detailIcon}
              resizeMode="contain"
            />
            <Text style={styles.detailText}>{data.staff}</Text>
          </View>
        </View>

        <View style={styles.detailsColumn}>
          <View style={styles.detailRow}>
            <Image
              source={PhoneIcon}
              style={styles.contactIcon}
              resizeMode="contain"
            />
            <Text style={styles.contactText}>{data.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Image
              source={WebsiteIcon}
              style={styles.contactIcon}
              resizeMode="contain"
            />
            <Text style={styles.contactText}>{data.web}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // --- Reusable Professional Card Component (WITH REQUIRED CHANGES) ---
  const ProfessionalCard = ({ data }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={ProfessionalDataImages[data.id]}
          style={styles.professionalAvatar}
          resizeMode="cover"
        />
        
        {/* MODIFIED: headerText now manages the right-aligned buttons */}
        <View style={styles.headerText}>
          <View style={styles.nameAndActionsRow}>
            <View style={styles.nameColumn}>
              <Text style={styles.cardTitle}>{data.name}</Text>
              <Text style={styles.experienceText}>{data.years} of experience</Text>
            </View>

            {/* ✅ MODIFICATION: Call and WhatsApp buttons moved here (Top-Right) */}
            <View style={styles.topRightActions}>
              <TouchableOpacity onPress={() => console.log(`Call ${data.name}`)}>
                <Image
                  source={CallIcon2}
                  style={styles.actionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log(`WhatsApp ${data.name}`)}>
                <Image
                  source={WhatsappIcon}
                  style={styles.actionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.feeText}>{data.fee}</Text>

          {/* ✅ MODIFICATION 2: Interchange Location and Expertise */}
          
          {/* LOCATION (Now first) */}
          <View style={styles.locationRow}>
            <Image
              source={LocationIcon}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.locationText}>{data.location}</Text>
          </View>

          {/* EXPERTISE (Now second) */}
          <View style={styles.expertiseContainer}>
            <Text style={styles.expertiseLabel}>Expertise:</Text>
            {data.expertise.map((exp) => (
              <Text key={exp} style={styles.expertiseTag}>
                {exp}
              </Text>
            ))}
          </View>

        </View>
      </View>

      {/* ✅ MODIFICATION 3: Removed professionalActions entirely (No Profile button) */}
    </View>
  );





















  // Dummy images for professional cards
  const ProfessionalDataImages = {
    1: require("../assets/Doctor1.png"),
    2: require("../assets/Doctor2.png"),
    3: require("../assets/Doctor1.png"),
    4: require("../assets/Doctor2.png"),
  };

const renderContent = () => {
    if (activeTab === "hotlines") {
      return HOTLINE_DATA.map((data) => <HotlineCard key={data.id} data={data} />);
    } else {
      return PROFESSIONAL_DATA.map((data) => <ProfessionalCard key={data.id} data={data} />);
    }
  };

  return (
    <LinearGradient
      colors={["#D7D9F4", "#E8E3F9", "#F4F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={BackIcon} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crisis Support</Text>
      </View>

      <View style={styles.tabBar}>
        <CommunityTabButton title="Crisis Hot-lines" isSelected={activeTab === "hotlines"} onPress={() => setActiveTab("hotlines")} />
        <CommunityTabButton title="Professional help" isSelected={activeTab === "professional"} onPress={() => setActiveTab("professional")} />
      </View>

      {activeTab === "professional" && (
        <View style={styles.searchBar}>
          <Image source={SearchIcon} style={styles.searchIcon} resizeMode="contain" />
          <TextInput style={styles.searchInput} placeholder="Search by city or area..." placeholderTextColor="#A3A3A3" />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },

  // --- Header ---
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 20, height: 60, marginTop: 50
  },
  backButton: { padding: 5 },
  backIcon: { width: 30, height: 30, tintColor: "#512DA8" },
  headerTitle: {
    fontSize: 20,
    // fontWeight: "bold",
    color: "#512DA8",
    fontFamily: "Quicksand-Bold",
    marginLeft: 20,
  },
  // --- Tab Bar ---
  tabBar: {
    flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 30, marginBottom: 20
  },

  // --- Search Bar ---
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    // backgroundColor: '#F0F0F0',
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: "#A3A3A3",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontFamily: "Quicksand-Regular",
    color: "#333",
  },

  // --- Scroll Content & Cards ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  card: {
    backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 15, marginBottom: 15, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
  },

  // --- Hotline Card Specific Styles ---
  cardHeader: {
    flexDirection: "row"
  },
  phoneIcon: {
    width: 40, height: 40, marginRight: 15,tintColor: "#7E57C2",
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#333",
    fontFamily: "Quicksand-Bold",
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  tagText: {
    fontSize: 11,
    color: "#7E57C2",
    backgroundColor: "#E8E3F9",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 5,
    fontFamily: "Quicksand-Medium",
  },
  description: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Quicksand-Regular",
    marginTop: 5,
  },
  readMore: {
    fontSize: 12,
    color: "#7E57C2",
    fontFamily: "Quicksand-Medium",
    marginTop: 2,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  detailsColumn: {
    width: "45%", // Ensures columns sit side-by-side
    flexDirection: "column",
    justifyContent: "flex-start",
        // borderWidth:1,
        marginLeft:20,
   
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%", // Allocate space
    marginBottom: 10,
  },
  detailIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: "#7E57C2",
  },
  detailText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Quicksand-Regular",
  },
  contactIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: "#7E57C2",
  },
  contactText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Quicksand-Regular",
    // marginRight: 15,
  },

  // --- Professional Card Specific Styles ---
  professionalAvatar: {
    width: 75,
    height: 95,
    borderRadius: 5,
    marginRight: 10,
    borderColor: "#7E57C2",
    borderWidth: 2,
    borderRadius: 12,
  },
  feeText: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Quicksand-Regular",
  },
  expertiseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  expertiseLabel: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Quicksand-SemiBold",
    marginRight: 5,
  },
  expertiseTag: {
    fontSize: 11,
    color: "#FFFFFF",
    backgroundColor: "#7E57C2",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 5,
    marginBottom: 6,
    fontFamily: "Quicksand-Medium",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    // borderWidth:1,
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: "#A3A3A3",
  },
  locationText: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Quicksand-Regular",
  },
  professionalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 0,
    marginTop: 0,
    // borderWidth:1,
    borderTopColor: "#F0F0F0",
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: '#7E57C2',
    // tintColor: '#835ed8ff',
    marginLeft: 15,
  },
  viewProfileButton: {
    backgroundColor: "#7E57C2",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 15,
  },
  viewProfileText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Quicksand-SemiBold",
  },
  // ✅ MODIFIED STYLES
  nameAndActionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  nameColumn: { flex: 1, marginRight: 10 },
  topRightActions: { flexDirection: "row", alignItems: "center" },
  actionIcon: { width: 22, height: 22, marginLeft: 10,tintColor: "#7E57C2", }, // Call/WhatsApp size and spacing
});

export default CrisisSupportScreen;
