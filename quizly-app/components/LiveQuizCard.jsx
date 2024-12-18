import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesome ,MaterialCommunityIcons} from '@expo/vector-icons'

export default function LiveQuizCard() {
  return (
    <View className="w-full bg-white shadow-sm my-[5px] flex flex-row h-[80px] rounded-lg justify-between items-center px-[10px]">
   <View className='w-[60px] h-[60px] bg-blue-200 raduis-md flex items-center justify-center' >
   <MaterialCommunityIcons name="brain" size={24} color="black" />

    </View>
    <View className='flex flex-col items-center justify-center'>
       <Text className='font-bold text-[16px]'>Music Quiz(Biginner)</Text>
         <Text className='text-zinc-600 text-[12px] text-zinc-200  mb-1'>Correct 20 out of 100 </Text>

    </View>
    <FontAwesome name="angle-right" size={24} color="black" />
    </View>
  )
}

