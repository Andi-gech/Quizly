import { View, Text,TextInput } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

export default function SearchComponent() {
  return (
    <View className="flex items-center justify-center w-full h-[50px] mt-[10px] bg-[rgba(0,0,0,0.2)] rounded-[10px] px-[10px] relative">
        <FontAwesome name="search" size={22} color="white" className="text-white absolute top-[13px] left-[5px]"/>
<TextInput placeholder="Search Quiz" placeholderTextColor="white" className="w-full h-full px-[20px] text-white"/>
    </View>
  )
}