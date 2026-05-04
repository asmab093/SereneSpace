import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const API_URL = "http://10.0.2.2:5000/api";
  //  = "http://10.94.247.196:5000/api";
  // const API_URL = "http://192.168.1.11:5000/api"; // Use this for Android emulator

  // ✅ HELPER: Check if user is a member of a group
  // Returns true if the groupTitle exists in the user's joinedGroups array
  const isGroupJoined = (groupTitle) => {
    return user?.joinedGroups?.includes(groupTitle) || false;
  };

  // ✅ HELPER: Update user data locally and in AsyncStorage
  // Use this when joining a group or updating a profile to keep UI in sync
  const updateLocalUser = async (newData) => {
    try {
      const updatedUser = { ...user, ...newData };
      setUser(updatedUser);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
    } catch (error) {
      console.log("Error updating local user context:", error);
    }
  };

  const login = async (userData) => {
    try {
      setUser(userData);
      setToken(userData.token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setAuthChecked(true);
      return true;
    } catch (error) {
      console.log("Login Context Error:", error);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("userData");
    setAuthChecked(true);
  };

  const handleCommunityNavigation = (navigation) => {
    // iMPROVED LOGIC: Check if the profile exists AND the completion flag is true
    const isProfileComplete =
      user?.communityProfile?.hasCompletedProfile === true;

    if (isProfileComplete) {
      // Already has a profile? Go to the groups
      navigation.navigate("CommunityGroups");
    } else {
      // New user? Go to profile creation
      navigation.navigate("CommunityProfileCreation");
    }
  };

  //NEW: Keep AsyncStorage in sync whenever the user object changes
  useEffect(() => {
    const syncUserToDisk = async () => {
      if (user) {
        try {
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify({ ...user, token }),
          );
          console.log("💾 User data synced to disk (Profile/Groups updated)");
        } catch (e) {
          console.error("Failed to sync user to disk", e);
        }
      }
    };

    syncUserToDisk();
  }, [user]); // Runs every time 'user' state is updated

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        login,
        authChecked,
        setAuthChecked,
        API_URL,
        handleCommunityNavigation,
        isGroupJoined,
        updateLocalUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
