import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function QuizProgress({addInfo,name,point,data}) {
  console.log(data,"da")
  return (
    <View className="w-full bg-[rgba(255,255,255,0.1)] my-[10px] flex flex-row h-[80px] rounded-lg justify-between items-center px-[10px]">
      <View >
        {addInfo &&
        <Text className=" text-[18px] text-zinc-200 font-semibold mb-1">{addInfo}</Text>}
        <View className="flex flex-row items-center justify-between">
            <Ionicons name="headset" size={24} color="white" />
            <Text className='font-bold text-[16px] text-white'>{data?.title}</Text> 
            
        </View>
        
      </View>
      <View className='w-[50px] h-[50px] bg-orange-300 rounded-full items-center justify-center' >
        <Text className=' text-[12px] text-white font-bold  mb-1'>{point} </Text>
      </View>
     
    </View>
  )
}

