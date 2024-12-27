import { View, TextInput,Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundedButton from '../../components/RoundedButton';
import api from '../../utils/Api';
import { Ionicons as Ioicon } from '@expo/vector-icons';
import LoadingPage from '../../components/LoadingPage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      return await api.post(
        '/api/auth/login',
        credentials
      );
    },
    onSuccess: async (response) => {
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      router.replace('/(tabs)');
    },
    onError: (error) => {
    setError(error.response.data.message)
  console.log(error)
      setTimeout(() => {
        setError('');
      }, 3000);
    },
    mutationKey: ['login'],
  });

  return (
    <View className="flex-1 items-center h-screen justify-center bg-black ..">
   <View className="w-full h-[100px] items-center justify-center flex-row">
   <MaterialCommunityIcons name="brain" size={74} color="white" />
    <Text className="text-white text-[60px] font-bold">QUIZLY</Text>
    </View>
    {mutation.isLoading &&
    <LoadingPage />}
      <View className="  w-full  p-6 rounded-2xl">
        <View className="h-[40px] items-center justify-center flex-row">
      {error ? (
          <View className="mt-4">
            <Text className="text-yellow-400 text-center">{error}</Text>
          </View>
        ) : null}
        </View>
        <View className="mb-4">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={"white"}
            className="w-full h-[50px]  text-white rounded-[10px] bg-zinc-900   px-4 "
          />
        </View>
        <View className="mb-6">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={"white"}
            secureTextEntry
            className="w-full h-[50px]  text-white rounded-[10px] bg-zinc-900   px-4 "
          />
        </View>
        <View className="items-center justify-center flex-col w-full h-[100px] mx-auto">
          <RoundedButton
            name="Login"
            bgcolor="bg-white shadow-sm shadow-zinc-200"
            color="text-black text-[20px] font-bold"
            radius=" rounded-full px-[20px] w-full h-[50px]  py-[15px]"
            onPress={() => {
              mutation.mutate({ email, password });
            }}
          />
        </View>
        <View className="items-center justify-center flex-col w-full h-[100px] mx-auto">
        
          <TouchableOpacity onPress={() => router.push('/(auth)/Signup')} className="w-full   rounded-[10px] items-center justify-start flex flex-row">
            <Text className="text-white text-[14px] font-bold">Dont Have An Account??</Text>
            <Text className="text-orange-400 text-[14px] font-bold">Register</Text>
          </TouchableOpacity>
        </View>
       
      </View>
    </View>
  );
}
