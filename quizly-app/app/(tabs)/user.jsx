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
    <View  className="flex  relative flex-1 flex-col bg-indigo-500 items-center justify-end pt-[20px]">
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
          <View className="flex items-center justify-start relative px-[10px] pt-[75px] flex-col pb-[40px]  bg-white h-[80%] w-[99%] rounded-[30px]" >
           <Image className=' absolute   -top-[75px] border-[10px]  border-white w-[150px] h-[150px] rounded-full' alt='Avatar' src='data:image/png;base64,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' />
             <View className="flex items-center justify-between flex-row w-full  h-[120px] rounded-lg bg-indigo-500">
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
                  }  bgcolor={"bg-indigo-400"}  color={"text-white"} 
            radius={"rounded-full px-[50px] py-[16px]"} />
</View> 
                  </View>
    </View>
  )
}