import { View, Text } from 'react-native'
import React from 'react'
import {FontAwesome} from "@expo/vector-icons"

export default function Header({name}) {
  return (
    <View className="w-full h-[50px]  px-4  flex items-center justify-between flex-row">
        <FontAwesome  name='angle-left' size={24} color={"white"} className="text-white text-[20px] font-bold"/>
        <Text className="text-white text-[20px] font-bold">{name}</Text>
        <View></View>
    </View>
  )
}