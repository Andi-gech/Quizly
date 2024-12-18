import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function RoundedButton({ radius,color,bgcolor,name,onPress}
) {
  return (
    <TouchableOpacity  className={` px-[10px] py-[5px] my-[10px] ${radius} ${bgcolor} ${color} flex items-center justify-center`} onPress={onPress}>
      <Text className={`${color}`}>{name}</Text>
    </TouchableOpacity>
  )
}