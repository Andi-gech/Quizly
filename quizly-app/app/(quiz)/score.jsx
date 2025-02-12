import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import RoundedButton from '../../components/RoundedButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
export default function ScoreScreen() {
  const { score } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  const handleClick = () => {
    router.replace("/(tabs)");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <LinearGradient
      colors={theme.colors.background}
      className="flex-1 items-center justify-center"
      style={{
        flex:1,
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
      }}
    >
      <View
     
        className="w-full items-center"
      >
        <View style={{
          backgroundColor: theme.colors.card[0],
        }} className=" p-8 rounded-3xl border border-slate-600 items-center">
          <View className="bg-amber-400/20 p-6 rounded-full mb-6">
            <MaterialCommunityIcons 
              name="trophy" 
              size={60} 
              color="#f59e0b" 
            />
          </View>

          <Text className="text-4xl font-bold text-amber-400 mb-2">
            {score}
          </Text>
          
          <Text style={
            {
              color:theme.colors.text
            }
          } className=" text-xl font-semibold mb-6">
            Quiz Completed!
          </Text>

          <View
           
          >
            <RoundedButton 
              label="Back to Home"
              icon="home"
              onPress={handleClick}
           
             
            
              gradient={theme.colors.accent}
            />
          </View>
        </View>

        {/* Decorative Stars */}
        <View className="absolute -top-8 -right-8 opacity-30">
          <MaterialCommunityIcons name="star" size={40} color="#f59e0b" />
        </View>
        <View className="absolute -bottom-8 -left-8 opacity-30">
          <MaterialCommunityIcons name="star" size={40} color="#f59e0b" />
        </View>
      </View>
    </LinearGradient>
  );
}