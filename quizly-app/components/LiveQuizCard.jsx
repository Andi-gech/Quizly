import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesome ,MaterialCommunityIcons} from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function LiveQuizCard({data}) {
  console.log(data,"Ss")
  const router=useRouter()
  const handleclick=()=>{
   router.navigate({
    pathname:"/(quiz)/Starter",
    params:{
      question:data.question,
      answers: JSON.stringify([
        {
          answer:data.correct_answer,
          correct:true
        }
        ,{
          answer:data.incorrect_answers[0],
          correct:false
        },
        {
          answer:data.incorrect_answers[1],
          correct:false
        },
        {
          answer:data.incorrect_answers[2],
          correct:false
        }
      ])
    }
   })

  }
  return (
    <TouchableOpacity onPress={handleclick} className="w-full bg-white shadow-sm my-[5px] flex flex-row h-[80px] rounded-lg justify-between items-center px-[10px]">
   <View className='w-[60px] h-[60px] bg-blue-200 raduis-md flex items-center justify-center' >
   <MaterialCommunityIcons name="brain" size={24} color="black" />

    </View>
    <View className='flex flex-col items-center justify-center'>
       <Text className='font-bold text-[16px]'>{data?.category}</Text>
         <Text className='text-zinc-600 text-[12px] text-zinc-200  mb-1'>Correct 20 out of 100 </Text>

    </View>
    <FontAwesome name="angle-right" size={24} color="black" />
    </TouchableOpacity>
  )
}

