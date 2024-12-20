import { View, Text } from 'react-native'
import React from 'react'

export default function CatagoryCard({icon}) {
  return (
    <View className="flex items-center justify-center  mt-[10px] w-[100px] h-[100px] bg-yellow-400 shadow-sm   rounded-[30px]">
   {icon}
    </View>
  )
}