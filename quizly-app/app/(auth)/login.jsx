import { View, TextInput,Text } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundedButton from '../../components/RoundedButton';
import api from '../../utils/Api';

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
    
  console.log(error)
      setTimeout(() => {
        setError('');
      }, 3000);
    },
    mutationKey: ['login'],
  });

  return (
    <View className="flex-1 items-center justify-center bg-indigo-500">
     <Text className="text-3xl text-white mb-4">Login</Text>
      <View className="w-11/12 bg-gray-100 p-6 rounded-2xl shadow-lg">
        <View className="mb-4">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={"black"}
            className="w-full h-12 bg-white rounded-lg px-4 shadow-sm"
          />
        </View>
        <View className="mb-6">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={"black"}
            secureTextEntry
            className="w-full h-12 bg-white rounded-lg px-4 shadow-sm"
          />
        </View>
        <View className="items-center">
          <RoundedButton
            name="Login"
            bgcolor="bg-indigo-500"
            color="text-white"
            radius="rounded-full px-8 py-3"
            onPress={() => mutation.mutate({ email, password })}
          />
        </View>
        {error ? (
          <View className="mt-4">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
