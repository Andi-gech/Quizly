import { View, Text,Button } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header';
import RoundedButton from '../../components/RoundedButton';
import { Ionicons } from '@expo/vector-icons';
import AnswerComponent from '../../components/AnswerComponent';
import { useLocalSearchParams, useRouter } from 'expo-router';


export default function question() {
    const [done,setdone]=useState(false)
    const [explanation,setexplanation]=useState()
    const [selected ,setselected]=useState()
    const { id } = useLocalSearchParams();
    const incrementId = (currentId) => {
        return Number(currentId) + 1;
      };
      
    const router=useRouter()
    const AnswerQuestion=(answer)=>{
        setselected(answer)

    }
  return (
     <View className="flex  flex-1 flex-col bg-indigo-500 items-center justify-start pt-[20px]">
    <Header name={"Create Quiz"} />
    
    
    <View className="flex items-center justify-start flex-col mt-5 bg-white  py-[20px] w-[98%] rounded-[30px]">
        <View className="w-full   py-[20px] px-3">
            <Text className="font-bold text-[17px] " >
            {id}. Which of the following is a fundamental data structure in computer science?
            </Text>
           <AnswerComponent selected={selected} onPress={()=>{
            AnswerQuestion("Array")
           }}  name={"Array"}/>
        <AnswerComponent selected={selected} iscorrect={true} onPress={()=>{
            AnswerQuestion("Linked List")
           }}   name={"Linked List"}/>

   <AnswerComponent selected={selected}  onPress={()=>{
            AnswerQuestion("Stack")
           }}   name={"Stack"}/>
   <AnswerComponent selected={selected} onPress={()=>{
            AnswerQuestion("All of the above")
           }}    name={"All of the above"}/>

        </View>
        {selected &&
       <RoundedButton name={"Get Explanation"} bgcolor={"bg-indigo-400 px-[20px] py-[10px] rounded-full"} color={"text-white"}/>
        }
       {explanation &&<Text className="text-sm px-3  font-bold ">
      <Text className="text-indigo-700 font-bold  text-[20px] " >Explanation</Text> Plausible but incorrect answers designed to challenge the respondent's knowledge.Randomize Options: Present answer choices in a random order to minimize bias.
Use "All of the Above" Sparingly: 
       </Text>}
       {

      id<3?
       <RoundedButton name={"next"} onPress={()=>{
router.navigate('/(quiz)/'+incrementId(id))
       }} bgcolor={"bg-black px-[50px] py-[20px] rounded-full"} color={"text-white"}/>:
        <RoundedButton name={"Finish"} onPress={()=>{
router.navigate('/(quiz)/score')
        }
        } bgcolor={"bg-black px-[50px] py-[20px] rounded-full"} color={"text-white"}/>
        }
         
        
     
    </View>
    </View>
  )
}