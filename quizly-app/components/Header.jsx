import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {FontAwesome} from "@expo/vector-icons"
import { useRouter } from 'expo-router'
import { useTheme } from '../context/ThemeContext'

export default function Header({name,showback}) {
  const router=useRouter()
  const theme = useTheme();
  return (
    <View style={{
      justifyContent:showback?"space-between":"center",
    }} className="w-full h-[50px]   flex items-center  flex-row">
     {showback && <TouchableOpacity onPress={
        ()=>{
          router.back()
      }} className='h-[50px] w-[50px] flex items-center justify-center'>
        <FontAwesome  name='angle-left' size={24} color={theme.colors.text} className="text-white text-[20px] font-bold"/>
        </TouchableOpacity>
}
        <Text style={{
          color: theme.colors.text,
        }} className="text-white text-[20px] font-bold">{name}</Text>
        
        <View></View>
    </View>
  )
}