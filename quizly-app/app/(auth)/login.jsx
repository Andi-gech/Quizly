import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundedButton from '../../components/RoundedButton';
import api from '../../utils/Api';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import LoadingPage from '../../components/LoadingPage';
import * as Haptics from 'expo-haptics';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      return await api.post('/api/auth/login', credentials);
    },
    onSuccess: async (response) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      
      if(response.data.isVerified) {
      
        router.replace('/(tabs)');
      }
      router.replace({
        pathname: '/(auth)/Verification',
        params: { email },
      });
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(error.response?.data?.message || 'An error occurred');
      setTimeout(() => setError(''), 3000);
    },
    mutationKey: ['login'],
  });

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
     
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

      }}
    >
      <View
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="w-full items-center px-6"
      >
        {/* Logo Header */}
        <View className="flex-row items-center mb-12">
          <MaterialCommunityIcons 
            name="brain" 
            size={64} 
            color="#f59e0b" 
            style={{ marginRight: 10 }}
          />
          <Text className="text-amber-400 text-5xl font-bold">QUIZLY</Text>
        </View>

        {/* Error Message */}
      
          {error && (
            <View
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full mb-4 bg-amber-900/30 p-3 rounded-lg flex-row items-center"
            >
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={20} 
                color="#f59e0b" 
              />
              <Text className="text-amber-400 ml-2 flex-1">{error}</Text>
            </View>
          )}
     

        {/* Input Fields */}
        <View className="w-full space-y-6">
          <View className="bg-slate-800/50 rounded-xl p-3 flex-row items-center">
            <Ionicons name="mail-outline" size={20} color="#64748b" />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#64748b"
              className="flex-1 text-white text-base ml-3"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="bg-slate-800/50 mt-2 rounded-xl p-3 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#64748b"
              className="flex-1 text-white text-base ml-3"
              secureTextEntry
            />
          </View>
        </View>

        {/* Login Button */}
        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          className="w-full mt-8"
        >
          <RoundedButton
            name="Login"
            onPress={() => mutation.mutate({ email, password })}
            bgcolor="bg-amber-400"
            color="text-black font-bold text-lg"
            radius="rounded-xl"
            icon="login"
            loading={mutation.isLoading}
          />
        </View>

        {/* Signup Link */}
        <TouchableOpacity 
          onPress={() => router.replace('/(auth)/Signup')}
          className="flex-row items-center p-6"
        >
          <Text className="text-slate-400">Don't have an account? </Text>
          <Text className="text-amber-400 font-semibold">Register now</Text>
          <MaterialCommunityIcons 
            name="arrow-right" 
            size={16} 
            color="#f59e0b" 
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>

      {mutation.isLoading && <LoadingPage />}
    </LinearGradient>
  );
}