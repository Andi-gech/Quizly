import { View, Text } from 'react-native';
import React from 'react';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {useTheme} from "../context/ThemeContext"

export default function LoadingPage( {quiz} ) {
  const theme = useTheme();
  return (
    <LinearGradient
    colors={theme.colors.background}
      style={
        {
         display:"flex",
         flex: 1,
         position:"absolute",
         width:"100%",
         height:"100%",
         zIndex:50,
         alignItems:"center",
         justifyContent:"center"
        }
      }
      className="flex-1 absolute w-full h-full z-50 items-center justify-center"
    >
      <MotiView
        from={{ rotate: '0deg', scale: 0.8 }}
        animate={{ rotate: '360deg', scale: 1 }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 1200,
          scale: { type: 'spring' }
        }}
        className="items-center justify-center"
      >
        <LinearGradient
          colors={['#f59e0b', '#fbbf24']}
          className="w-24 h-24 rounded-full items-center justify-center"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MotiView
            from={{ rotate: '0deg', scale: 1 }}
            animate={{ rotate: '-360deg', scale: 1.2 }}
            transition={{
              loop: true,
              type: 'timing',
              duration: 1500
            }}
          >
            <Ionicons 
              name="reload-circle" 
              size={56} 
              color="#0f172a" 
              style={{ transform: [{ scale: 1.2 }] }}
            />
          </MotiView>
        </LinearGradient>
      </MotiView>
{quiz ? (
      <MotiView
        from={{ opacity: 0.5, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', loop: true, duration: 1200 }}
        className="mt-8"
      >
        <Text className="text-amber-400 text-lg font-semibold">
          Generating Magic...
        </Text>
        <Text style={
          {
            color:theme.colors.text
          }
        } className=" text-center mt-2">
          Crafting your quiz experience
        </Text>
      </MotiView>
):(
      <MotiView
        from={{ opacity: 0.5, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', loop: true, duration: 1200 }}
        className="mt-8"
      >
        <Text className="text-amber-400 text-lg font-semibold">
          Loading...
        </Text>
        <Text style={
          {
            color:theme.colors.text
          }
        } className=" text-center mt-2">
          Please wait a moment
        </Text>
      </MotiView>
)}

      {/* Floating particles */}
      <MotiView
        from={{ opacity: 0, translateY: 0 }}
        animate={{ opacity: 1, translateY: -20 }}
        transition={{ type: 'timing', loop: true, duration: 2000 }}
        className="absolute top-1/3 left-1/4"
      >
        <Ionicons name="sparkles" size={24} color="#f59e0b" />
      </MotiView>
      <MotiView
        from={{ opacity: 0, translateY: 0 }}
        animate={{ opacity: 1, translateY: -20 }}
        transition={{ type: 'timing', loop: true, duration: 2200, delay: 300 }}
        className="absolute top-1/4 right-1/4"
      >
        <Ionicons name="sparkles" size={20} color="#f59e0b" />
      </MotiView>
    </LinearGradient>
  );
}