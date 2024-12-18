import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import TextButtons from './TextButtons'
import LiveQuizCard from './LiveQuizCard'

export default function LiveCardsList() {
    const [full, setfull] = useState(false)
    const HandleShowPress=()=>{
        setfull(!full)
    }
    

  return (
    <View style={{
        height:full?'100%':'40%',
    }} className={` absolute bottom-0  w-[98%] bg-white rounded-t-[30] flex-end px-[10px]`}>
    <View className="flex items-center justify-center flex flex-row justify-between py-2 px-[10px]">
      <Text className="text-black text-[20px] font-bold">Live Quizes</Text>
     <TextButtons name={full ? "hide":"show all"} onPress={HandleShowPress}/>
      </View>
    <View className='w-full  pb-[100px]'>
    <FlatList 
        data={[{key: 'a'}, {key: 'b'},{key: '4'}, {key: '5'},{key: '6'}, {key: '7'},{key: '8'}, {key: '9'}]}
      
        renderItem={({item}) => <LiveQuizCard />}
    />
    </View>
    </View>
  )
}

