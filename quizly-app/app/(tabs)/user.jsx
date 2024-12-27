import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import { Ionicons } from '@expo/vector-icons'
import RoundedButton from '../../components/RoundedButton'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UseFetchStats from '../../hooks/UseFetchStats'
import UseFetchUserData from '../../hooks/UseFetchUserData'
import api from '../../utils/Api'
import { useMutation } from '@tanstack/react-query';
import LoadingPage from '../../components/LoadingPage'
export default function user() {
  const router = useRouter();
  const { data: user } = UseFetchUserData();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [username, setUsername] = useState('');
  const updateUsername = async ({ username }) => {
    return await api.put('/api/auth/update', { username });
  };
  const mutation = useMutation(updateUsername, {
    onSuccess: (data) => {
 setSuccess(true)
 setTimeout(()=>{
    setSuccess(false)
  },3000)
    },
    onError: (error) => {
    setError(true)
    setTimeout(()=>{
      setError(false)
    },3000)
    },
  });

  const handleUpdate = () => {
    mutation.mutate({ username });
  };


  const logout = async () => {
    await AsyncStorage.removeItem("token");
  
    router.replace("/(auth)/login");
  };
  const {data}=UseFetchStats()
  console.log(data?.data)

  return (
    <View  className="flex  relative flex-1 flex-col bg-black .. items-center justify-end pt-[20px]">
      <TouchableOpacity onPress={logout} className="absolute top-0 right-0 m-5">
        <Ionicons name="log-out" size={24} color="white" />
      </TouchableOpacity>
      {mutation.isLoading && <LoadingPage/>}
      {success&&<View className="absolute top-0 left-0 z-40 w-screen h-screen flex items-center justify-center ">
        <View className="bg-white rounded-full w-[110px] h-[110px] flex items-center justify-center flex-col">
         <Ionicons name="checkmark-circle" size={100} color="green" className="opacity-20" />
        </View>
     </View>}
     {error&&<View className="absolute top-0 left-0 z-40 w-screen h-screen flex items-center justify-center ">
        <View className="bg-white rounded-full w-[110px] h-[110px] flex items-center justify-center flex-col">
          <Ionicons name="close-circle" size={100} color="red" className="opacity-20" />
        </View>
      </View>}
          <View className="flex items-center justify-start relative px-[10px] pt-[75px] flex-col pb-[40px]  bg-white h-[80%] w-[100%] rounded-t-[30px]" >
           <Image className=' absolute   -top-[75px] border-[10px]  border-white w-[150px] h-[150px] rounded-full' alt='Avatar' src='https://avatar.iran.liara.run/public/44' />
             <View className="flex items-center justify-between flex-row w-full  h-[120px] rounded-lg bg-black ..">
             <View className="flex items-center justify-center  mx-5 flex-col  h-[90px]">
              <Ionicons name="gift" size={24} color="white" className="text-white "/>
              <Text className=" text-white">{data?.data?.totalPoints} pts</Text>
              </View>
              <View className="flex items-center justify-center  mx-5 flex-col  h-[90px]">
              <Ionicons name="file-tray" size={24} color="white" className="text-white "/>
              <Text className=" text-white">{data?.data?.totalQuizzesTaken} Quizes</Text>
              </View>
              <View className="flex items-center justify-center  mx-5 flex-col  h-[90px]">
              <Ionicons name="bulb" size={24} color="white" className="text-white "/>
              <Text className=" text-white">{data?.data?.totalQuestionsDone}  questions</Text>
              </View>
              </View>
              <View className="flex items-start justify-center flex-col w-full h-[90px]">
                <Text className="text-lg font-bold">Username</Text>
                <TextInput placeholder={user?.data?.username} placeholderTextColor={"black"} onChangeText={
                  (text) => setUsername(text)
                } className="w-[100%] h-[50px] bg-zinc-100 rounded-[10px] px-[10px] mt-[5px]"/>
                </View>
                <View className="flex items-start justify-center  flex-col w-full h-[90px]">
                <Text className="text-lg font-bold">email</Text>
                <TextInput editable={false}  placeholderTextColor={"black"} placeholder={user?.data?.email} className="w-[100%] h-[50px] bg-zinc-100 rounded-[10px] px-[10px] mt-[5px]"/>
                </View>
                <View className="flex items-center justify-center  flex-col w-full h-[90px]">
                  <RoundedButton name={"Change"} onPress={
                    handleUpdate
                  }  bgcolor={"bg-zinc-900"}  color={"text-white"} 
            radius={"rounded-full px-[50px] py-[16px]"} />
</View> 
                  </View>
    </View>
  )
}