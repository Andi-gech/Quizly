import React, { useRef, useEffect } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function AnswerComponent({ name, id,onPress, iscorrect, selected }) {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const getBackgroundColor = () => {
    if (selected === id) {
      return iscorrect ? 'bg-green-400' : 'bg-red-400';
    }
    if (selected && iscorrect) {
      return 'border-green-400 border-[2px] bg-indigo-400';
    }
    return 'bg-indigo-400';
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

  useEffect(() => {
    if (selected === id && !iscorrect) {
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [selected]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
      <TouchableOpacity
      disabled={selected?true:false}
        onPress={onPress}
        className={`flex w-full min-h-[60px] ${getBackgroundColor()} rounded-full  text-start flex-row items-center justify-center mt-5 p-[10px] `}
      >
        <Text className="text-white text-center">{name}</Text>
        {iscorrect && selected === id && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            className="absolute right-[30px]"
            color="white"
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
