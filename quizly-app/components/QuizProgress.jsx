import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function QuizProgress({addInfo,name,point,data}) {
  console.log(data,"da")
  return (
    <View    className=" flex flex-row justify-between w-full bg-slate-700/20 p-6 rounded-3xl ">
      <View >
        {addInfo &&
        <Text className=" text-[18px] text-zinc-200 font-semibold mb-1">{addInfo}</Text>}
        <View className="flex flex-row items-center justify-between">
            <Ionicons name="headset" size={24} color="white" />
            <Text className='font-bold text-[16px] text-white'>{data?.title}</Text> 
            
        </View>
        
      </View>
      <View className='w-[50px] h-[50px] bg-amber-400 rounded-full items-center justify-center' >
        <Text className=' text-[17px] text-black font-bold  '>{point} </Text>
      </View>
     
    </View>
  )
}

