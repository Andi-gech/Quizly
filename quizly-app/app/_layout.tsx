
import { ThemeProvider } from '../context/ThemeContext';
import { useFonts } from "expo-font";
import {  Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import {
 QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useColorScheme } from "react-native";
import { useTheme } from "../context/ThemeContext";



SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <StatusBar style={!theme?.isDarkMode ? "dark" : "light"} />
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
      
    </ThemeProvider>
    </QueryClientProvider>
  );
}
