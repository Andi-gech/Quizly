import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundedButton from '../../components/RoundedButton';
import api from '../../utils/Api';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import LoadingPage from '../../components/LoadingPage';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { AnimatePresence, MotiView } from 'moti';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  // Configure Google Sign-In
  // GoogleSignin.configure({
  //   webClientId: '159666388412-m52o9ge39kddgkr6f0thcgrlv57b873p.apps.googleusercontent.com',
  //   iosClientId: '159666388412-07hc4npl8a7qlntd5up7n9gqc1ll15su.apps.googleusercontent.com',
  //   scopes: ['profile', 'email'], 
  //   offlineAccess: true,
  //   forceCodeForRefreshToken: true,
  // });


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

  // const handleGoogleSignIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const {data} = await GoogleSignin.signIn();
  //     googleMutation.mutate(data.idToken);
      
  //   } catch (error) {
  //     let errorMessage = 'Google Sign-In failed';
      
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       errorMessage = 'Sign in cancelled';
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       errorMessage = 'Sign in already in progress';
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       errorMessage = 'Play services not available';
  //     }
      
  //     setError(errorMessage);
  //     setTimeout(() => setError(''), 3000);
  //   }
  // };

  return (
    <LinearGradient
    colors={theme.colors.background}
    style={{ flex: 1, justifyContent: 'center' }}
  >
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className="w-full items-center px-6"
    >
      {/* Logo Header */}
      <MotiView 
        from={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="flex-row items-center mb-12"
      >
      
        <LinearGradient
          colors={theme.colors.accent}
          style={{
            padding: 12,
            borderRadius: theme.metrics.borderRadius.medium,
            marginRight: 10
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
            className="w-full mb-6"
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
              <Text className="text-red-600" style={{
                
                marginLeft: 8,
                flex: 1
              }}>{error}</Text>
            </LinearGradient>
          </MotiView>
        )}
      </AnimatePresence>
  
      {/* Input Fields */}
      <View className="w-full space-y-6">
        {['email', 'password'].map((type, index) => (
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
                padding: 14,
                backgroundColor: theme.colors.card[0],
                borderRadius: theme.metrics.borderRadius.soft - 2
              }}>
                <Ionicons 
                  name={type === 'email' ? 'mail-outline' : 'lock-closed-outline'} 
                  size={20} 
                  color={theme.colors.secondaryText} 
                />
                <TextInput
                  placeholder={type === 'email' ? 'Email' : 'Password'}
                  value={type === 'email' ? email : password}
                  onChangeText={type === 'email' ? setEmail : setPassword}
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
  
      {/* Login Button */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full mt-10"
      >
        <RoundedButton
          label={loginMutation.isLoading ? "Authenticating..." : "Login"}
          onPress={() => loginMutation.mutate({ email, password })}
          gradient={theme.colors.accent}
          textColor={theme.colors.contrastText}
          icon={loginMutation.isLoading ? "loading" : "login"}
          style={{
            height: 54,
            ...theme.effects.shadow
          }}
        />
      </MotiView>
  
      {/* Signup Link */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full items-center mt-8"
      >
        <TouchableOpacity 
          onPress={() => router.replace('/(auth)/Signup')}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Text style={{
            color: theme.colors.secondaryText,
            marginRight: 4
          }}>Don't have an account?</Text>
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
            }}>Register now</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={16} 
              color={theme.colors.contrastText} 
              style={{ marginLeft: 6 }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
   {/* <View className="w-full mt-6">
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
            disabled={googleMutation.isLoading}
          />
        </View> */}
      {(loginMutation.isLoading || googleMutation.isLoading) && <LoadingPage />}
    </MotiView>
  </LinearGradient>
  );
}



