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
  console.log(data,"data")
  return (
    <TouchableOpacity
                  className="bg-slate-800/40 p-4 rounded-2xl"
                  onPress={handleclick}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 space-y-2">
                      <Text className="text-white text-lg font-semibold">
                        {data?.title}
                      </Text>
                      
                      <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center space-x-1">
                          <MaterialCommunityIcons 
                            name="book" 
                            size={16} 
                            color="#94a3b8" 
                          />
                          <Text className="text-slate-400 text-sm">
                            {data?.category}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center space-x-1">
                          <MaterialCommunityIcons 
                            name="help-circle" 
                            size={16} 
                            color="#94a3b8" 
                          />
                          <Text className="text-slate-400 text-sm">
                            {data?.questions?.length} questions
                          </Text>
                        </View>
                      </View>
                      
                      <View className="w-full bg-slate-700/30 h-1 rounded-full">
                        <View 
                          className="h-full bg-amber-400 rounded-full" 
                          style={{ width: `${Math.min((data?.progress || 0) * 100, 100)}%` }}
                        />
                      </View>
                    </View>
                    
                    <MaterialCommunityIcons 
                      name="chevron-right" 
                      size={24} 
                      color="#f59e0b" 
                    />
                  </View>
                </TouchableOpacity>
  )
}

