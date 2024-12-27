import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CatagoryCard({icon,name,onpress}) {
  return (
    <TouchableOpacity  onPress={onpress} className="flex items-center justify-center  mx-[3px] mt-[10px] w-[100px] h-[100px] bg-indigo-200  shadow-zinc-200 shadow-sm   rounded-[10px]">
   {icon}

    </TouchableOpacity>
  )
}