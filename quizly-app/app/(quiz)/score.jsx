import { View, Text } from 'react-native'
import React from 'react'
import RoundedButton from '../../components/RoundedButton'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'

export default function score() {
const {score}=useLocalSearchParams()

    const router=useRouter()
    const handleclick=()=>{
        router.navigate('/')
     
      }
  return (
    <View className="flex  flex-1 flex-col bg-indigo-500 items-center justify-start pt-[20px]">
       
            <View className="flex items-center justify-center flex-col  h-[80%] w-[98%] rounded-[30px]">
                <View className="flex items-center justify-center flex-col  bg-yellow-400  border-[10px] border-white h-[300px] w-[300px] rounded-full">
                    <Text className="text-3xl text-black font-extrabold">Your Score</Text>
                    <Text className="text-xl text-black font-extrabold">You scored {score}</Text>
                    <Text className="text-xl text-black font-extrabold">Better luck next time</Text>
                    <RoundedButton name="Back To Home page" radius="rounded-full" color="text-black" bgcolor="bg-white px-[30px] rounded-full py-[20px]" onPress={()=>{
                        handleclick()
                    }}/>

                    </View> 
          </View>
    </View>
  )
}