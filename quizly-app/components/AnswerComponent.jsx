import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function AnswerComponent({ name, onPress, iscorrect, selected }) {

  const getBackgroundColor = () => {
    if (selected === name) {
      return iscorrect ? 'bg-green-400' : 'bg-red-400';
    }
    if(selected&&iscorrect){
        return 'border-green-400 border-[2px] bg-indigo-400'
    }
    return 'bg-indigo-400';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex w-full h-[60px] ${getBackgroundColor()} rounded-full flex-row items-center justify-center mt-5`}
    >
      <Text className="text-white">{name}</Text>
      {iscorrect && selected === name && (
        <Ionicons name="checkmark-circle" size={24} className="absolute right-[30px]" color="white" />
      )}
    </TouchableOpacity>
  );
}
