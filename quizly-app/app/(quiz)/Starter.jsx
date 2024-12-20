import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import RoundedButton from '../../components/RoundedButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
import question from './[id]'


export default function Starter() {
    const {question,answers}=useLocalSearchParams()
    console.log(question,answers,"params")
    
    const router=useRouter()
      const handleclick=()=>{
       router.navigate(
        {
          pathname:"/(quiz)/Quiz",
          params:{
            
                question:question,
                answers:answers
            
          }
        }
       )
    
      }
  return (
    <View className="flex  flex-1 flex-col bg-indigo-500 items-center justify-start pt-[20px]">
       <Header name={"Quiz"} />
         <View className="flex items-center justify-center flex-col  h-[80%] w-[98%] rounded-[30px]">
            <Text className="text-3xl text-white">Welcome to Quizly</Text>
            <Text className="text-xl text-white">Start your quiz now</Text>
            <RoundedButton name="Start Quiz" radius="rounded-full" color="text-black" bgcolor="bg-white px-[30px] rounded-full py-[20px]" onPress={handleclick}/>

        </View> 

    </View>
  )
}