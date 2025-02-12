import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
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

  // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId: '159666388412-m52o9ge39kddgkr6f0thcgrlv57b873p.apps.googleusercontent.com',
    iosClientId: '159666388412-07hc4npl8a7qlntd5up7n9gqc1ll15su.apps.googleusercontent.com',
    scopes: ['profile', 'email'], 
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });


  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/api/auth/login', credentials);
      return data;
    },
    onSuccess: async (data) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  
      
      if(data?.data?.user?.isVerified) {
        await AsyncStorage.setItem('token', data?.token);
        router.replace('/(tabs)');
      } else {
        router.replace({
          pathname: '/(auth)/Verification',
          params: { email },
        });
      }
    },
    onError: (error) => {
      handleAuthError(error);
    }
  });


  const googleMutation = useMutation({
    mutationFn: async (idToken) => {
      const { data } = await api.post('/api/auth/google', { idToken });
      return data;
    },
    onSuccess: async (data) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await AsyncStorage.setItem('token', data.token);
      console.log(data.data);
      if(data.data.user.isVerified) {
        router.replace('/(tabs)');
      } else {
        router.replace({
          pathname: '/(auth)/Verification',
          params: { email: data.data.user.email },
        });
      }
    },
    onError: (error) => {
      handleAuthError(error);
    }
  });

  const handleAuthError = (error) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    const message = error.response?.data?.message || 'Authentication failed';
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {data} = await GoogleSignin.signIn();
      googleMutation.mutate(data.idToken);
      
    } catch (error) {
      let errorMessage = 'Google Sign-In failed';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign in cancelled';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign in already in progress';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Play services not available';
      }
      
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View className="w-full items-center px-6">
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
          <View className="w-full mb-4 bg-amber-900/30 p-3 rounded-lg flex-row items-center">
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
              autoCorrect={false}
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
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Login Button */}
        <View className="w-full mt-8">
          <RoundedButton
            label="Login"
            onPress={() => loginMutation.mutate({ email, password })}
            bgcolor="bg-amber-400"
            color="text-black font-bold text-lg"
            radius="rounded-xl"
            icon="login"
            loading={loginMutation.isLoading}
          />
        </View>

        {/* Google Sign-In Button */}
        <View className="w-full mt-6">
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
            disabled={googleMutation.isLoading}
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

      {(loginMutation.isLoading || googleMutation.isLoading) && <LoadingPage />}
    </LinearGradient>
  );
}