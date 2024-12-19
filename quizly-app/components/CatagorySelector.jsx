import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';

export default function CatagorySelector({name,selected,onPress}) {
  return (
    <TouchableOpacity onPress={onPress} className="flex items-center  justify-center mx-2 px-2 flex-col ">
      <Entypo name="dot-single" size={28} color={selected?"lightblue":"black"} />
      <Text className={`${selected ? "text-blue-500":"text-black"}`}>{name}</Text>
    </TouchableOpacity>
  )
}