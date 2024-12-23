import React from "react";
import { useColorScheme, View } from "react-native";
import { isAuthenticated } from "../utils/auth";
import { StatusBar } from "expo-status-bar";

import { useRootNavigationState, useRouter, useSegments } from "expo-router";

const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isLoggedIn = isAuthenticated();
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    if (!navigationState?.key) return;

  

    if (!isLoggedIn ) {
      router.push("/(auth)/login");
    } else if (isLoggedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, segments, navigationState?.key]);

  return (
    <View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
   
    </View>
  );
};
export default Index;