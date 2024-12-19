import { View, Text, FlatList } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import SearchComponent from '../../components/SearchComponent'
import CatagorySelector from '../../components/CatagorySelector'
import LiveQuizCard from '../../components/LiveQuizCard'
import { useState } from 'react'

export default function search() {
  const selections=["Top","Recents","Catagories"]
  const [selected, setselected] = useState("Catagories")
  const HandleSelection=(name)=>{
    setselected(name)
  }

  const CaseSelector=()=>{

    switch (selected) {
      case "Top":
        return <FlatList 
        data={[{key: 'a'}, {key: 'b'}]}
       showsVerticalScrollIndicator={false}
        renderItem={({item}) => <LiveQuizCard />}
    />
        break;
      case "Recents":
        return <FlatList 
        data={[{key: 'a'}, {key: 'b'},{key: '4'}]}
       showsVerticalScrollIndicator={false}
        renderItem={({item}) => <LiveQuizCard />}
    />
        break;
      case "Catagories":
        return <FlatList 
        data={[{key: 'a'}, {key: 'b'},{key: '4'}, {key: '5'},{key: '6'}, {key: '7'},{key: '8'}, {key: '9'}]}
       showsVerticalScrollIndicator={false}
        renderItem={({item}) => <LiveQuizCard />}
    />
        break;
      default:
        break;
    }
  }

  return (
    <View className="flex  relative flex-1 flex-col bg-indigo-500 items-center justify-end pt-[20px]">
        <View className="h-[20%] w-full px-[10px] flex items-center justify-start">
          <Header/>
          <SearchComponent/>
     
          </View>
        
       
        
   
      <View className="flex items-center justify-start flex-col bg-white h-[80%] w-[98%] rounded-[30px]" >
        <View className="flex items-center justify-center flex-row  w-full  mb-3  h-[10%]">
  <CatagorySelector name="Top" selected={
    selected==="Top"
  } onPress={
    ()=>HandleSelection("Top")
  } />
  <CatagorySelector name="Recents" selected={
    selected==="Recents"
  } onPress={
    ()=>HandleSelection("Recents")
  } />
  <CatagorySelector name="Catagories"  selected={
    selected==="Catagories"
  } onPress={
    ()=>HandleSelection("Catagories")
  } />


          </View>
          <View className="w-full px-[10px] h-[90%]">
        
         {{
            ...CaseSelector()
         }}
         </View>
      </View>
    </View>
  )
}