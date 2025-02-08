import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RoundedButton from '../../components/RoundedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UseFetchStats from '../../hooks/UseFetchStats';
import UseFetchUserData from '../../hooks/UseFetchUserData';
import { useMutation } from '@tanstack/react-query';
import api from '../../utils/Api';
import LoadingPage from '../../components/LoadingPage';

export default function UserProfile() {
  const router = useRouter();
  const { data: user } = UseFetchUserData();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState('');
  const { data } = UseFetchStats();

  const updateUsername = async ({ username }) => {
    return await api.put('/api/auth/update', { username });
  };

  const mutation = useMutation(updateUsername, {
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: () => {
      setError(true);
      setTimeout(() => setError(false), 3000);
    },
  });

  const handleUpdate = () => mutation.mutate({ username });

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/(auth)/login');
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      className="flex-1 relative"
      style={{
        height:"100%"
      }}
    >
      {/* Notification Toasts */}
    
        {success && (
          <View
            from={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -100, opacity: 0 }}
            className="absolute top-14 left-5 right-5 z-50 bg-emerald-500/90 p-4 rounded-xl flex-row items-center space-x-2"
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="text-white font-medium">Username updated successfully!</Text>
          </View>
        )}
        
        {error && (
          <View
            from={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -100, opacity: 0 }}
            className="absolute top-14 left-5 right-5 z-50 bg-red-500/90 p-4 rounded-xl flex-row items-center space-x-2"
          >
            <Ionicons name="close-circle" size={24} color="white" />
            <Text className="text-white font-medium">Update failed. Please try again.</Text>
          </View>
        )}
     

      {/* Header */}
      <View
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="pt-14 px-6 flex-row justify-end"
      >
        <TouchableOpacity 
          onPress={logout}
          className="bg-red-500/20 p-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text className="text-red-400 ml-2 font-medium">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <View
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="flex-1 relative bg-white dark:bg-zinc-900 rounded-t-[40px] mt-20 p-6"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20 }}
      >
        {/* Profile Image */}
        <View
          className="absolute -top-[60px] w-full flex items-center  justify-center"
          style={{ transform: [{ translateX: -60 }] }}
          from={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          
        >
          <LinearGradient
            colors={['#f59e0b', '#fbbf24']}
            className="p-1 rounded-full"
            style={{
              padding: 2,
              borderRadius: 100,
              width: 120,
            }}
          >
            <Image
              className="w-32 h-32 rounded-full border-4 border-white"
              source={{ uri: 'https://avatar.iran.liara.run/public/44' }}
            />
          </LinearGradient>
        </View>

        {/* Stats Cards */}
        <View className="flex-row mt-[100px] justify-between mb-8">
          <StatCard
            icon="gift"
            value={`${data?.data?.totalPoints} pts`}
            label="Points"
            color="#f59e0b"
          />
          <StatCard
            icon="file-tray"
            value={`${data?.data?.totalQuizzesTaken}`}
            label="Quizzes"
            color="#3b82f6"
          />
          <StatCard
            icon="bulb"
            value={`${data?.data?.totalQuestionsDone}`}
            label="Questions"
            color="#10b981"
          />
        </View>

        {/* Form Fields */}
        <View className="space-y-6">
          <FormField
            label="Username"
            icon="person"
            value={username}
            placeholder={user?.data?.username}
            onChangeText={setUsername}
          />
          <FormField
            label="Email"
            
            icon="mail"
            value={user?.data?.email}
            editable={false}
          />
        </View>

        {/* Update Button */}
        <View
          className="mt-8"
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <RoundedButton
            name={mutation.isLoading ? "Updating..." : "Update Profile"}
            onPress={handleUpdate}
            bgcolor="bg-amber-400"
            color="text-black text-lg font-bold"
            radius="rounded-xl"
            icon={mutation.isLoading ? "refresh" : "save"}
            disabled={mutation.isLoading}
          />
        </View>
      </View>

      {mutation.isLoading && <LoadingPage accentColor="#f59e0b" />}
    </LinearGradient>
  );
}

const StatCard = ({ icon, value, label, color }) => (
  <View
    className="bg-white dark:bg-zinc-800 p-4 rounded-xl items-center flex-1 mx-1"
    style={{ shadowColor: color, shadowOpacity: 0.1, shadowRadius: 10 }}
    from={{ scale: 0.9 }}
    animate={{ scale: 1 }}
  >
    <View className="bg-black/5 p-2 rounded-full mb-2">
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text className="text-black dark:text-white font-bold text-lg">{value}</Text>
    <Text className="text-zinc-500 dark:text-zinc-400 text-xs">{label}</Text>
  </View>
);

const FormField = ({ label, icon, ...props }) => (
  <View
    className="space-y-2"
    from={{ opacity: 0, translateX: -10 }}
    animate={{ opacity: 1, translateX: 0 }}
  >
    <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 h-14">
      <Ionicons name={icon} size={20} color="#64748b" />
      <TextInput
        className="flex-1 ml-3 text-zinc-800 dark:text-white text-base"
        placeholderTextColor="#94a3b8"
        {...props}
      />
    </View>
  </View>
);