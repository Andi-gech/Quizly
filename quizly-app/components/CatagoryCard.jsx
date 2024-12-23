import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CatagoryCard({icon,name,onpress}) {
  return (
    <TouchableOpacity  onPress={onpress} className="flex items-center justify-center  mx-[10px] mt-[10px] w-[100px] h-[100px] bg-white  shadow-zinc-200 shadow-sm   rounded-[30px]">
   {icon}
<Text className="text-black text-[13px] ">{name}</Text>
    </TouchableOpacity>
  )
}