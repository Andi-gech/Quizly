import { View, Text, Image } from 'react-native'
import React from 'react'

export default function ProfileList({name ,point ,Rank}) {
  return (
    <View className="w-full h-[70px] bg-white shadow-sm shadow-zinc-400 my-2 rounded-[20px] px-[20px] flex flex-row items-center ">
        <View className="w-[20px] h-[20px] bg-orange-600 flex items-center justify-center">
            <Text className=" text-white font-bold">{Rank}</Text>
        </View>
        <View className="flex flex-row items-center mx-8">
        <Image className='w-[50px] h-[50px] rounded-full' alt='Avatar' src='https://avatar.iran.liara.run/public/44' />
      <View className="flex flex-col items-center mx-2 justify-center">
        <Text className="font-bold text-[16px]">{name}</Text>
        <Text className="text-zinc-600 text-[12px] text-zinc-200 mb-1">
           {point} points
            </Text>
            </View>
            </View>
    </View>
  )
}