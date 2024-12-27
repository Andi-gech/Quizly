import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Header from '../../components/Header'
import UseFetchLiveQuizes from '@/hooks/UseFetchLiveQuizes'
import LiveQuizCard from '@/components/LiveQuizCard'
import LoadingPage from '@/components/LoadingPage'



export default function Catagory() {
    const {id,name}=useLocalSearchParams()
    const datas={
      catagory: id
    }
    const {data,isLoading,isFetching,refetch}=UseFetchLiveQuizes(datas)
    useEffect(() => {
      refetch()
    }, [id])
    console.log(data?.data)
  return (
    <View className="flex-1 h-screen w-screen  bg-black .. items-center justify-between  px-[10px] py-[10px] pt-5">

  {(isLoading||isFetching) && <LoadingPage />}
      <Header showback={true} name={name} />
      <View className="w-full  items-start pt-[20px] px-[10px] min-h-[90%] rounded-t-[30px] bg-white justify-center flex-row">
      <FlatList 
      data={data?.data}
      keyExtractor={item=>item._id}
      renderItem={({item})=>(
        <LiveQuizCard key={item._id} data={item} />
      )}
      /></View>

   </View>
  )
}

const styles = StyleSheet.create({})