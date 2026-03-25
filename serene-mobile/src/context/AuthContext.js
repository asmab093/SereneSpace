import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Now 'user' will hold the entire object: { _id, username, email, emergencyContact,,hasAdded.. etc. }
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  //Base URL for your API
  // Replace '192.168.x.x' with your computer's actual IP address
  const API_URL = "http://10.0.2.2:5000/api";

  const login = async (userData) => {
    try {
      // 1. Update the Variable in Memory (What Splash checks)
      setUser(userData);
      setToken(userData.token);

      // 2. Update the File on Disk (What App.js checks on boot)
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setAuthChecked(true); // Mark as checked when logging in
      return true; // Success
    } catch (error) {
      console.log("Login Context Error:", error);
      return false;
    }
  };

  // Updated Logout helper that clears Disk and global state
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("userData");
    //Keep authChecked as true so the app knows it has finished the "check"
    // and is simply in an unauthenticated state
    setAuthChecked(true);
  };

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
        logout, // Pass logout so any screen can use it
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//This is the Global Brain. It stores the
// "Login State" (the Token and User info) so that once the user
// signs up, the whole app knows they are logged in without
// asking again.
