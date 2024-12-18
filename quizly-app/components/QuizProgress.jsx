import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function QuizProgress({addInfo}) {
  return (
    <View className="w-full bg-pink-200 my-[10px] flex flex-row h-[80px] rounded-lg justify-between items-center px-[10px]">
      <View >
        {addInfo &&
        <Text className="text-zinc-600 text-[18px] text-zinc-200 font-semibold mb-1">{addInfo}</Text>}
        <View className="flex flex-row items-center justify-between">
            <Ionicons name="headset" size={24} color="black" />
            <Text className='font-bold text-[16px]'>Music Quiz(Biginner)</Text> 
            
        </View>
        
      </View>
      <View className='w-[50px] h-[50px] bg-orange-300 rounded-full items-center justify-center' >
        <Text className=' text-[12px] text-white font-bold  mb-1'>20/10 </Text>
      </View>
     
    </View>
  )
}

