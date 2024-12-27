import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import UserFetchUserData from '../hooks/UseFetchUserData'

export default function ProfileView() {
  const {data}=UserFetchUserData()
  const GetwellcomeMessage=()=>{
    let today = new Date();
    let curHr = today.getHours();
    if (curHr < 12) {
      return 'Good Morning 𖤓';
    } else if (curHr < 18) {
      return 'Good Afternoon 𖤓';
    } else {
      return 'Good Evening 𖤓';
    }
  }
  return (
    <View className='w-full flex items-center  justify-between flex-row'>
        <View className='flex item-center justify-center'>
            <Text className='text-[12px] text-zinc-200 font-semibold mb-1'>{GetwellcomeMessage()}</Text>
            <Text className='text-[19px] text-zinc-200 font-semibold mb-1'>{data?.data.username}</Text>

        </View>
        <Image className='w-[40px] h-[40px] rounded-full' alt='Avatar' src='https://avatar.iran.liara.run/public/44' />
      
    </View>
  )
}

