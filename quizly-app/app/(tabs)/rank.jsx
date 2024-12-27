import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import ProfileList from '../../components/ProfileList'
import Rank1 from '../../assets/Rank1.png'
import Rank2 from '../../assets/Rank2.png'
import Rank3 from '../../assets/Rank3.png'
import Header from '../../components/Header'
import LoadingPage from '../../components/LoadingPage'
import UseFetchLeaderBoard from '../../hooks/UseFetchLeaderBoard'

export default function rank() {
  const {data,isLoading}=UseFetchLeaderBoard()

  const getRank=(rank)=>{
    if (!data?.data) return null;
const sortdata=data?.data?.sort((a,b)=>b.totalScore-a.totalScore)
const rankData=sortdata[rank-1]
return rankData
  }
  




  return (
      <View className="flex  flex-1 flex-col bg-black .. items-center justify-center w-screen ">
<Header name={"Leader Board"}/>
{isLoading && <LoadingPage />}
<View className="h-[50%] relative w-full px-[10px]  flex  items-center justify-center">
  <View className=" absolute  w-full flex -bottom-[50px]   flex-row items-end  justify-center">
  <View className="  w-[100px] items-center " >
   <Image className='w-[50px] h-[50px] rounded-full' alt='Avatar' src='https://avatar.iran.liara.run/public/44' />
    <Text className="text-white text-[20px] font-bold">{    getRank(2)?.user}</Text>
    <Text className="text-white text-[14px] px-[12px] py-[3px] my-2 rounded-full bg-indigo-400 font-bold">{getRank(2)?.totalScore||0} pts</Text>
    <Image  source={Rank2} className="h-[200px] w-[100px]" />
    </View>
 
    <View className=" w-[100px] mx-[10px] items-center" >
       <Image className='w-[50px] h-[50px] rounded-full' alt='Avatar' src='https://avatar.iran.liara.run/public/44' />
   
    <Text className="text-white text-[20px] font-bold">{getRank(1)?.user}</Text>
    <Text className="text-white text-[14px] px-[12px] py-[3px] my-2 rounded-full bg-indigo-400 font-bold">{getRank(1)?.totalScore||0} pts</Text>
   
    <Image  source={Rank1} className="h-[250px]  w-[100px]" />
    </View>
    <View className=" w-[100px]  items-center " >
       <Image className='w-[50px] h-[50px] rounded-full' alt='Avatar' src='https://avatar.iran.liara.run/public/44' />
   
    <Text className="text-white text-[20px] font-bold">{getRank(3)?.user||"Not Seted"}</Text>
    <Text className="text-white text-[14px] px-[12px] py-[3px] my-2 rounded-full bg-indigo-400 font-bold">{getRank(3)?.totalScore||0} pts</Text>
   
    <Image  source={Rank3} className="h-[200px] w-[100px]" />
    </View>
   



  </View>

  </View>
      <View className="flex items-center justify-start flex-col pb-[40px] pt-[5px] bg-[#f7f7f7] h-[40%] w-[97.7%] rounded-[30px]" >
        <FlatList
        data={
         data?.data.sort((a,b)=>b.totalScore-a.totalScore)
        }
        className="w-full pt-3 px-4 "
        renderItem={({item,index}) => <ProfileList key={item.key} name={item.user} Rank={index+1} point={item.totalScore} />}
        />
            </View>
    </View>
  )
}