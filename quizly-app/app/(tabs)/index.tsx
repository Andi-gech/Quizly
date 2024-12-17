import { Image, StyleSheet, View, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import "../../global.css";
export default function HomeScreen() {
  return (
   <View className="flex  flex-1 bg-indigo-500 items-center justify-center">
      <View className="h-[50%] w-full flex-end">
      </View>
    <View className="h-[50%] w-[100%] bg-white rounded-t-[30] flex-end">
      </View>
   

   </View>
  );
}
