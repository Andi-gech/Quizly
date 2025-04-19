import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundedButton from '../../components/RoundedButton';
import api from '../../utils/Api';
import LoadingPage from '../../components/LoadingPage';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { AnimatePresence, MotiView } from 'moti';

export default function Signup() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      return await api.post('/api/auth/signup', credentials);
    },
    onSuccess: async (response) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      router.replace({
        pathname: '/(auth)/Verification',
        params: { email },
      });
    },
    onError: (error) => {
      console.log(
        JSON.stringify(
          error.response
        )
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(error?.response?.data?.message || 'Registration failed');
      setTimeout(() => setError(''), 3000);
    },
    mutationKey: ['Register'],
  });
const theme=useTheme();
  return (
<LinearGradient
  colors={theme.colors.background}
  style={{ flex: 1, justifyContent: 'center' }}
>
  <StatusBar style={theme.isDarkMode ? "light" : "dark"} />
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    style={{ flex: 1, width: '100%' }}
  >
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}
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

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ marginBottom: 24 }}
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
      </AnimatePresence>

      {/* Input Fields */}
      <View style={{ gap: 24 }}>
        {['username', 'email', 'password'].map((type, index) => (
          <MotiView
            key={type}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100 }}
          >
            <LinearGradient
              colors={theme.colors.card}
              style={{
                borderRadius: theme.metrics.borderRadius.soft,
                padding: 4,
                ...theme.effects.shadow
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: theme.colors.card[0],
                borderRadius: theme.metrics.borderRadius.soft - 2
              }}>
                <Ionicons 
                  name={
                    type === 'email' ? 'mail-outline' :
                    type === 'password' ? 'lock-closed-outline' : 'person-outline'
                  } 
                  size={20} 
                  color={theme.colors.secondaryText} 
                />
                <TextInput
                  placeholder={
                    type === 'email' ? 'Email' :
                    type === 'password' ? 'Password' : 'Username'
                  }
                  value={type === 'email' ? email : type === 'password' ? password : username}
                  onChangeText={text => {
                    if(type === 'email') setEmail(text);
                    if(type === 'password') setPassword(text);
                    if(type === 'username') setUsername(text);
                  }}
                  placeholderTextColor={theme.colors.secondaryText}
                  style={{
                    flex: 1,
                    color: theme.colors.text,
                    fontSize: 16,
                    marginLeft: 12,
                    fontWeight: '500'
                  }}
                  secureTextEntry={type === 'password'}
                  autoCapitalize="none"
                  keyboardType={type === 'email' ? 'email-address' : 'default'}
                />
              </View>
              
            </LinearGradient>
          </MotiView>
        ))}
      </View>

      {/* Signup Button */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ marginTop: 32 }}
      >
        <RoundedButton
          label={mutation.isLoading ? "Creating Account..." : "Register"}
          onPress={() => mutation.mutate({ username, email, password })}
          gradient={theme.colors.accent}
          textColor={theme.colors.contrastText}
          icon={mutation.isLoading ? "loading" : "account-plus"}
          style={{
            height: 54,
            ...theme.effects.shadow
          }}
        />
      </MotiView>

      {/* Login Link */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ alignItems: 'center', marginTop: 24 }}
      >
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/login')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
          activeOpacity={0.7}
        >
          <Text style={{
            color: theme.colors.secondaryText,
            marginRight: 4
          }}>Already have an account?</Text>
          <LinearGradient
            colors={theme.colors.accent}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: theme.colors.contrastText,
              fontWeight: '600'
            }}>Login</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={16} 
              color={theme.colors.contrastText} 
              style={{ marginLeft: 6 }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    </MotiView>

    {mutation.isLoading && <LoadingPage />}
  </KeyboardAvoidingView>
</LinearGradient>
  );
}