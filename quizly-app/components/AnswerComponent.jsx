// AnswerComponent.js
import React, { useRef, useEffect } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function AnswerComponent({ name, id, onPress, iscorrect, selected }) {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const getBackground = () => {
    if (selected === id) {
      return iscorrect 
        ? ['#10b981', '#059669']
        : ['#ef4444', '#dc2626'];
    }
    if (selected && iscorrect) {
      return ['#3b82f6', '#2563eb'];
    }
    return ['#334155', '#1e293b'];
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const bounce = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (selected === id) {
      if (iscorrect) {
        bounce();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        shake();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [selected]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnimation }, { scale: scaleAnimation }] }}>
      <TouchableOpacity
        disabled={!!selected}
        onPress={onPress}
        className="w-full  rounded-xl overflow-hidden my-2"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getBackground()}
          className="flex-row items-center justify-between p-9"
          style={{ padding: 20, borderRadius: 20, overflow: 'hidden',display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center" }}
          start={[0, 0.5]}
          end={[1, 0.5]}
        >
          <Text 
            className="text-white text-sm flex-1 pr-6"
            numberOfLines={4}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          
          <AnimatePresence>
            {iscorrect && selected === id && (
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#fff"
                />
              </MotiView>
            )}
          </AnimatePresence>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}