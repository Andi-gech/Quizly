import { View, Text, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useState, useRef,useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import {  AnimatePresence } from 'moti';
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import LoadingPage from "../../components/LoadingPage";
import RoundedButton from "../../components/RoundedButton";
import api from "../../utils/Api";

export default function Verification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const router = useRouter();
  const inputRefs = useRef([]);
  const params = useLocalSearchParams();

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const mutation = useMutation({
    mutationKey: ["verification"],
    mutationFn: (data) => api.post("/api/auth/Verify", data),
    onSuccess: async (response) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      router.push("/(tabs)");
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(error.response?.data?.message || "Verification failed");
      setTimeout(() => setError(""), 3000);
    },
  });

  const resendCode = useMutation({
    mutationKey: ["resendCode"],
    mutationFn: (data) => api.post("/api/auth/resendCode", data),
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess("Code sent successfully");
      setResendCooldown(60);
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(error.response?.data?.message || "Error sending code");
      setTimeout(() => setError(""), 3000);
    },
  });

  return (
    <TouchableWithoutFeedback onPress={
      ()=>{
        Keyboard.dismiss();
      }
    } className="flex-1" >
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      className="flex-1 justify-center items-center"
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <StatusBar style="light" />

      <View
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="w-full px-6 items-center"
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

        {/* Status Messages */}
       
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

          {success && (
            <View
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full mb-4 bg-green-900/30 p-3 rounded-lg flex-row items-center"
            >
              <MaterialCommunityIcons 
                name="check-circle" 
                size={20} 
                color="#4ade80" 
              />
              <Text className="text-green-400 ml-2 flex-1">{success}</Text>
            </View>
          )}
       

        {/* Verification Content */}
        <View className="w-full items-center">
          <Ionicons name="mail" size={50} color="#f59e0b" className="mb-4" />
          <Text className="text-2xl text-white font-bold mb-2">
            Verify Your Email
          </Text>
          <Text className="text-slate-400 text-center mb-8">
            We've sent a verification code to your email{" "}
            <Text className="text-amber-400">
              {params?.email?.slice(0, 4)}****@gmail.com
            </Text>
          </Text>

          {/* Code Inputs */}
          <View className="flex-row justify-between w-full mb-8">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                className={`w-12 h-12 rounded-xl text-center text-lg 
                  ${digit ? 'bg-amber-400 text-black' : 'bg-slate-800/50 text-white'} 
                  font-bold border border-slate-700`}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                ref={(ref) => (inputRefs.current[index] = ref)}
              />
            ))}
          </View>

          {/* Verify Button */}
          <RoundedButton
            name="Verify"
            onPress={() => mutation.mutate({ code: code.join("") })}
            bgcolor="bg-amber-400"
            color="text-black font-bold text-lg"
            radius="rounded-xl"
            icon="check-decagram"
            loading={mutation.isPending}
            className="w-full mb-6"
          />

          {/* Resend Code */}
          <TouchableOpacity
            onPress={() => resendCode.mutate({ email: params.email })}
            disabled={resendCooldown > 0}
            className="flex-row items-center"
          >
            <Text className={`text-sm ${
              resendCooldown > 0 ? 'text-slate-500' : 'text-amber-400'
            }`}>
              Resend Verification Code
              {resendCooldown > 0 && ` (${resendCooldown})`}
            </Text>
            {resendCooldown === 0 && (
              <MaterialCommunityIcons 
                name="arrow-right" 
                size={16} 
                color="#f59e0b" 
                className="ml-2"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {(mutation.isPending || resendCode.isPending) && <LoadingPage />}
    </LinearGradient>
    </TouchableWithoutFeedback>
  );
}