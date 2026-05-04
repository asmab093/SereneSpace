import React, { useState, useEffect, useContext } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { Asset } from "expo-asset";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack"; // ✅ Added CardStyleInterpolators
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";

// --- SCREEN IMPORTS ---
import SplashScreen from "./src/screens/SplashScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import AuthSuccessScreen from "./src/screens/AuthSuccessScreen";
import AddContactScreen from "./src/screens/AddContactScreen";
import HomeScreen from "./src/screens/HomeScreen";
import Questionnaire1 from "./src/screens/Questionnaire1";
import Questionnaire2 from "./src/screens/Questionnaire2";
import Questionnaire3 from "./src/screens/Questionnaire3";
import Questionnaire4 from "./src/screens/Questionnaire4";
import Questionnaire5 from "./src/screens/Questionnaire5"; // ⬅️ ADD THIS
import Questionnaire6 from "./src/screens/Questionnaire6"; // ⬅️ ADD THIS
import Questionnaire7 from "./src/screens/Questionnaire7"; // ⬅️ ADD THIS
import MoodStatsScreen from "./src/screens/MoodStatsScreen";
import PersonalizedRecommendationsScreen from "./src/screens/PersonalizedRecommendationScreen";
import QuizCompletionScreen from "./src/screens/QuizCompletionScreen";
import TermsAndConditionsScreen from "./src/screens/Terms&ConditionScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AccountSecurityScreen from "./src/screens/AccountSecurityScreen";
import CommunityProfileCreation from "./src/screens/CommunityProfileCreation";
import CommunityGroupSelectionScreen from "./src/screens/CommunityGroupSelectionScreen";
import GroupDetailScreen from "./src/screens/GroupDetailScreen";
import WritePostScreen from "./src/screens/WritePostScreen";
import CrisisSupportScreen from "./src/screens/CrisisSupportScreen";
import ChatBotScreen from "./src/screens/ChatBotScreen";
import CustomDrawer from "./src/components/CustomDrawer";
import GeneralRecommendationsScreen from "./src/screens/GeneralRecommendation1";
import VideoPlayerScreen from "./src/screens/VideoPlayerScreen";
const requiredImages = [
  require("./src/assets/BackIcon.png"),
  require("./src/assets/AccountsSecurityIcon.png"),
  require("./src/assets/AddUser.png"),
  require("./src/assets/AnxietyIcon.png"),
  require("./src/assets/AuthSuccess.png"),
  require("./src/assets/BearAvatar.png"),
  require("./src/assets/BioIcon.png"),
  require("./src/assets/BirdAvatar.png"),
  require("./src/assets/BotIcon.png"),
  require("./src/assets/ButterflyAvatar.png"),
  require("./src/assets/ButtonLeftArrow.png"),
  require("./src/assets/CallIcon.png"),
  require("./src/assets/CallIcon2.png"),
  require("./src/assets/CelebrationIcon.png"),
  require("./src/assets/ChatbotAvatarIcon.png"),
  require("./src/assets/CheckMoodIcon.png"),
  require("./src/assets/CircleSupportArtIcon.png"),
  require("./src/assets/CloudIcon.png"),
  require("./src/assets/CommentIcon.png"),
  require("./src/assets/ContactEditIcon.png"),
  require("./src/assets/ContactIcon.png"),
  require("./src/assets/ContactSupportIcon.png"),
  require("./src/assets/ContactSupportIcon2.png"),
  require("./src/assets/CountryCode.png"),
  require("./src/assets/CrossIcon.png"),
  require("./src/assets/DailyDoseIcon.png"),
  require("./src/assets/DepressionIcon.png"),
  require("./src/assets/DogAvatar.png"),
  require("./src/assets/dove-logo.png"),
  require("./src/assets/Email.png"),
  require("./src/assets/EmogiGroup.png"),
  require("./src/assets/Excited.png"),
  require("./src/assets/FlowerAvatar.png"),
  require("./src/assets/Frustrated.png"),
  require("./src/assets/GlobeIcon.png"),
  require("./src/assets/HamburgerIcon.png"),
  require("./src/assets/HaniAvatarInitial.png"),
  require("./src/assets/HappyRelaxed.png"),
  require("./src/assets/HeartFilledRed.png"),
  require("./src/assets/HeartOutline.png"),
  require("./src/assets/HomeIcon.png"),
  require("./src/assets/HotlineIcon.png"),
  require("./src/assets/InfoIcon.png"),
  require("./src/assets/JoinCircleIcon.png"),
  require("./src/assets/LeafAvatar.png"),
  require("./src/assets/LocationIcon.png"),
  require("./src/assets/lock.png"),
  require("./src/assets/LogoutIcon.png"),
  require("./src/assets/LotusFlowerIcon.png"),
  require("./src/assets/MeditationIcon.png"),
  require("./src/assets/MenuBackgroundLeaves.png"),
  require("./src/assets/MicIcon.png"),
  require("./src/assets/MindfulnessIcon.png"),
  require("./src/assets/MoodChartWeek1.png"),
  require("./src/assets/MoodChartWeek2.png"),
  require("./src/assets/MoodFrameWeek2.png"),
  require("./src/assets/MoodTrends.png"),
  require("./src/assets/MusicIcon.png"),
  require("./src/assets/NeutralIcon.png"),
  require("./src/assets/OpenBookIcon.png"),
  require("./src/assets/PersonAvatar.png"),
  require("./src/assets/PhoneIcon.png"),
  require("./src/assets/PrivacyLockIcon.png"),
  require("./src/assets/PrivacyPolicyScreenIcon.png"),
  require("./src/assets/ProfessionalIcon.png"),
  require("./src/assets/ProfileAvatar.png"),
  require("./src/assets/ProfileAvatar2.png"),
  require("./src/assets/ProfileBackgroundLeaves.png"),
  require("./src/assets/ProfileIcon.png"),
  require("./src/assets/PurpleInfoIcon.png"),
  require("./src/assets/QuickChatIcon.png"),
  require("./src/assets/RelationIcon.png"),
  require("./src/assets/RightArrowIcon.png"),
  require("./src/assets/RightArrowIcon2.png"),
  require("./src/assets/SadIcon.png"),
  require("./src/assets/SafetyStopIcon.png"),
  require("./src/assets/SearchIcon.png"),
  require("./src/assets/SelfEsteemIcon.png"),
  require("./src/assets/SendIcon.png"),
  require("./src/assets/ShareSupportIcon.png"),
  require("./src/assets/SnowflakeAvatar.png"),
  require("./src/assets/StarsIcon.png"),
  require("./src/assets/StatsIcon.png"),
  require("./src/assets/SunflowerIcon.png"),
  require("./src/assets/SunIcon.png"),
  require("./src/assets/Terms&ConditionScreenIcon.png"),
  require("./src/assets/TermsIcon.png"),
  require("./src/assets/TermsIcon2.png"),
  require("./src/assets/TimeIcon.png"),
  require("./src/assets/TiredStressed.png"),
  require("./src/assets/UserGroupIcon.png"),
  require("./src/assets/Username.png"),
  require("./src/assets/WarningIcon.png"),
  require("./src/assets/WebsiteIcon.png"),
  require("./src/assets/WomanAvatar.png"),
  require("./src/assets/WritePostIcon.png"),
  require("./src/assets/YogaIcon.png"),
  require("./src/assets/AdhdIcon.png"),
  require("./src/assets/JournalIcon.png"),
  require("./src/assets/CelebrationIcon2.png"),
  require("./src/assets/phone-call.png"),
  require("./src/assets/flower.png"),
  require("./src/assets/owl.png"),
  require("./src/assets/woman.png"),
  require("./src/assets/bear.png"),
  require("./src/assets/profile.png"),
  require("./src/assets/cat.png"),
  require("./src/assets/PrivacyPolicyIcon.png"),
  require("./src/assets/LadyAvatar.png"),
  require("./src/assets/PenguinAvatar.png"),
  require("./src/assets/AnonymousUser.png"),
];

const Stack = createStackNavigator();

function cacheImages(images) {
  return images.map((image) => Asset.fromModule(image).downloadAsync());
}

const AppMain = () => {
  const [assetsReady, setAssetsReady] = useState(false);
  const { login, setAuthChecked } = useContext(AuthContext);

  const [fontsLoaded] = useFonts({
    "Quicksand-Light": require("./src/assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Bold": require("./src/assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("./src/assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("./src/assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("./src/assets/fonts/Quicksand-SemiBold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        const imagePromises = cacheImages(requiredImages);
        await Promise.all(imagePromises);

        const savedUser = await AsyncStorage.getItem("userData");

        if (savedUser) {
          const userData = JSON.parse(savedUser);
          await login(userData);
        }
      } catch (e) {
        console.warn("Prepare Error:", e);
      } finally {
        setTimeout(() => {
          setAuthChecked(true);
          setAssetsReady(true);
        }, 500);
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded || !assetsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F4FD" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true, // Allows swipe back gestures
            animationEnabled: true,
            // ✅ Added CardStyleInterpolator for smooth horizontal sliding
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="AuthSuccess" component={AuthSuccessScreen} />
          <Stack.Screen name="AddContact" component={AddContactScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />

          {/* Main App */}
          <Stack.Screen name="Home" component={HomeScreen} />

          {/* Questionnaire Flow */}
          <Stack.Screen name="Questionnaire1" component={Questionnaire1} />
          <Stack.Screen name="Questionnaire2" component={Questionnaire2} />
          <Stack.Screen name="Questionnaire3" component={Questionnaire3} />
          <Stack.Screen name="Questionnaire4" component={Questionnaire4} />
          <Stack.Screen name="Questionnaire5" component={Questionnaire5} />
          <Stack.Screen name="Questionnaire6" component={Questionnaire6} />
          <Stack.Screen name="Questionnaire7" component={Questionnaire7} />
          <Stack.Screen name="QuizComplete" component={QuizCompletionScreen} />

          {/* Support & Community */}

          <Stack.Screen name="WritePost" component={WritePostScreen} />

          {/* Profile & Stats */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="MoodStats" component={MoodStatsScreen} />
          <Stack.Screen
            name="PersonalRecs"
            component={PersonalizedRecommendationsScreen}
          />
          <Stack.Screen
            name="GeneralRecs"
            component={GeneralRecommendationsScreen}
          />

          {/* Legal */}
          <Stack.Screen name="Terms" component={TermsAndConditionsScreen} />
          <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} />

          {/* Accounts related */}
          <Stack.Screen
            name="AccountSecurity"
            component={AccountSecurityScreen}
          />

          {/* Chatbot */}
          <Stack.Screen name="ChatBot" component={ChatBotScreen} />

          {/* Community Creation */}
          <Stack.Screen
            name="CommunityProfileCreation"
            component={CommunityProfileCreation}
          />
          <Stack.Screen
            name="CommunityGroups"
            component={CommunityGroupSelectionScreen}
          />
          <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
          <Stack.Screen name="CrisisSupport" component={CrisisSupportScreen} />

          <Stack.Screen
            name="VideoPlayer"
            component={VideoPlayerScreen}
            options={{
              presentation: "modal",
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Slide up effect
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppMain />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F4FD",
  },
});

export default App;
