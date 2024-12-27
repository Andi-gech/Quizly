import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CatagoryCard({icon,name,onpress}) {
  return (
    <TouchableOpacity  onPress={onpress} className="flex text-white items-center justify-center  mx-[3px] mt-[10px] w-[100px] h-[100px] bg-zinc-900  shadow-zinc-200 shadow-sm   rounded-[10px]">
   {icon}
<Text numberOfLines={1} className="text-white text-[9px] font-bold mt-2">{name}</Text>
    </TouchableOpacity>
  )
}