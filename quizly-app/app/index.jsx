import React, { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { isAuthenticated } from "../utils/auth";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../context/ThemeContext";

import { useRootNavigationState, useRouter, useSegments } from "expo-router";

const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const { theme } = useTheme();

  const navigationState = useRootNavigationState();


  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";
    const checkAuth = async () => {
      const loggedIn = await isAuthenticated();
      
      if (!loggedIn && !inAuthGroup) {
    
        router.push("/(auth)/login");
      } else {
      
        router.replace("/(tabs)");
      }
    };

    checkAuth();
  }, [ navigationState?.key]);
  

  return (
    <View>
  
    </View>
  );
};
export default Index;