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
      console.error(JSON.stringify(error.response));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(error.response?.data?.message || "Verification failed");
      setTimeout(() => setError(""), 3000);
    },
  });

  const resendCode = useMutation({
    mutationKey: ["resendCode"],
    mutationFn: (data) => api.post("/api/auth/resendVerificationCode", data),
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess("Code sent successfully");
      setResendCooldown(60);
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (error) => {
      console.error(JSON.stringify(error.response));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(error.response?.data?.message || "Error sending code");
      setTimeout(() => setError(""), 3000);
    },
  });

  return (
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <LinearGradient
    colors={theme.colors.background}
    style={{ flex: 1, justifyContent: 'center' }}
  >
    <StatusBar style={theme.isDarkMode ? "light" : "dark"} />

    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={{ paddingHorizontal: 24 }}
    >
      {/* Logo Header */}
      <MotiView 
        from={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        style={{ alignItems: 'center', marginBottom: 40 }}
      >
        <LinearGradient
          colors={theme.colors.accent}
          style={{
            padding: 16,
            borderRadius: theme.metrics.borderRadius.medium,
            marginBottom: 16
          }}
        >
          <MaterialCommunityIcons 
            name="brain" 
            size={52} 
            color={theme.colors.contrastText} 
          />
        </LinearGradient>
        <Text style={{
          color: theme.colors.accent[0],
          fontSize: 42,
          fontWeight: '900',
          letterSpacing: -2,
          textShadowColor: theme.colors.accent[0] + '50',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 20
        }}>QUIZLY</Text>
      </MotiView>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ marginBottom: 16 }}
          >
            <LinearGradient
              colors={theme.colors.danger}
              style={{
                padding: 16,
                borderRadius: theme.metrics.borderRadius.soft,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={20} 
                color={theme.colors.contrastText} 
              />
              <Text style={{
                color: theme.colors.contrastText,
                marginLeft: 8,
                flex: 1
              }}>{error}</Text>
            </LinearGradient>
          </MotiView>
        )}

        {success && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ marginBottom: 16 }}
          >
            <LinearGradient
              colors={theme.colors.success}
              style={{
                padding: 16,
                borderRadius: theme.metrics.borderRadius.soft,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <MaterialCommunityIcons 
                name="check-circle" 
                size={20} 
                color={theme.colors.contrastText} 
              />
              <Text style={{
                color: theme.colors.contrastText,
                marginLeft: 8,
                flex: 1
              }}>{success}</Text>
            </LinearGradient>
          </MotiView>
        )}
      </AnimatePresence>

      {/* Verification Content */}
      <View style={{ alignItems: 'center' }}>
        <MotiView
          from={{ rotate: '-10deg', scale: 0.9 }}
          animate={{ rotate: '0deg', scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <Ionicons 
            name="mail" 
            size={50} 
            color={theme.colors.accent[0]} 
            style={{ marginBottom: 24 }}
          />
        </MotiView>

        <Text style={{
          color: theme.colors.text,
          fontSize: 24,
          fontWeight: '700',
          marginBottom: 8
        }}>
          Verify Your Email
        </Text>

        <Text style={{
          color: theme.colors.secondaryText,
          textAlign: 'center',
          marginBottom: 32
        }}>
          We've sent a verification code to{"\n"}
          <Text style={{ color: theme.colors.accent[0] }}>
            {params?.email?.slice(0, 4)}****@gmail.com
          </Text>
        </Text>

        {/* Code Inputs */}
        <View style={{ 
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 32
        }}>
          {code.map((digit, index) => (
            <MotiView
              key={index}
              from={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 50 }}
            >
              <TextInput
                style={[{
                  width: 52,
                  height: 52,
                  borderRadius: theme.metrics.borderRadius.soft,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '700',
                  borderWidth: 2,
                  backgroundColor: digit ? theme.colors.accent[0] : theme.colors.card[0],
                  borderColor: theme.colors.border,
                  color: digit ? theme.colors.contrastText : theme.colors.text
                }, theme.effects.shadow]}
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                ref={(ref) => (inputRefs.current[index] = ref)}
              />
            </MotiView>
          ))}
        </View>

        {/* Verify Button */}
        <RoundedButton
          label={mutation.isPending ? "Verifying..." : "Verify"}
          onPress={() => mutation.mutate({ code: code.join(""), email: params.email })}
          gradient={theme.colors.accent}
          textColor={theme.colors.contrastText}
          icon={mutation.isPending ? "loading" : "check-decagram"}
          style={{
            height: 54,
            width: '100%',
            ...theme.effects.shadow
          }}
        />

        {/* Resend Code */}
        <MotiView
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}
        >
          <TouchableOpacity
            onPress={() => resendCode.mutate({ email: params.email })}
            disabled={resendCooldown > 0}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{
              color: resendCooldown > 0 ? theme.colors.secondaryText : theme.colors.accent[0],
              fontSize: 14
            }}>
              Resend Code{resendCooldown > 0 && ` (${resendCooldown})`}
            </Text>
            {resendCooldown === 0 && (
              <MaterialCommunityIcons 
                name="arrow-right" 
                size={20} 
                color={theme.colors.accent[0]} 
                style={{ marginLeft: 8 }}
              />
            )}
          </TouchableOpacity>
        </MotiView>
      </View>
    </MotiView>

    {(mutation.isPending || resendCode.isPending) && <LoadingPage />}
  </LinearGradient>
</TouchableWithoutFeedback>
  );
}