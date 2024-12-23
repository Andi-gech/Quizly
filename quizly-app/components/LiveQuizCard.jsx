import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesome ,MaterialCommunityIcons} from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function LiveQuizCard({data}) {
 
  const router=useRouter()
  const handleclick=()=>{
   router.navigate({
    pathname:"/(quiz)/Starter",
    params:{
      id:data._id
    }
   })

  }
  return (
    <TouchableOpacity onPress={handleclick} className="w-full bg-white shadow-sm my-[5px] flex flex-row h-[80px] rounded-lg justify-between items-center px-[10px]">
   <View className='w-[60px] h-[60px] bg-blue-200 raduis-md flex items-center justify-center' >
   <MaterialCommunityIcons name="brain" size={24} color="black" />

    </View>
    <View className='flex flex-col items-center justify-center'>
       <Text className='font-bold text-[16px]'>{data?.title}</Text>
         <Text className='text-zinc-600 text-[12px]  mb-1'>{data?.numberOfQuestions} Questions Available</Text>

    </View>
    <FontAwesome name="angle-right" size={24} color="black" />
    </TouchableOpacity>
  )
}

