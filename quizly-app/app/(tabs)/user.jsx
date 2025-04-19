import { View, Text, Image, TextInput, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RoundedButton from '../../components/RoundedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UseFetchStats from '../../hooks/UseFetchStats';
import UseFetchUserData from '../../hooks/UseFetchUserData';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/Api';
import LoadingPage from '../../components/LoadingPage';
import { useTheme } from '../../context/ThemeContext';
import { MotiView, AnimatePresence } from 'moti';

export default function UserProfile() {
  const router = useRouter();
  const { data: user, isLoading, error: userError } = UseFetchUserData();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const { data, error: statsError } = UseFetchStats();
  const theme = useTheme();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const quiryClient =new useQueryClient();

  const updateUsername = async ({ username }) => {
    return await api.put('/api/auth/update', { username });
  };

  const mutation = useMutation(updateUsername, {
    onSuccess: () => {
      setSuccess('Username updated successfully!');
      quiryClient.invalidateQueries({
        queryKey: ['me']
      });
      resetMessages();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Update failed. Please try again.');
      resetMessages();
    },
  });

  const resetMessages = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setSuccess('');
          setError('');
        });
      }, 3000);
    });
  };

  const handleUpdate = () => {
    if (!username.trim() || username === user?.data?.username) return;
    mutation.mutate({ username });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/(auth)/login');
  };

  if (isLoading || mutation.isLoading) return <LoadingPage accentColor={theme.colors.accent[0]} />;

  return (
    <LinearGradient
      colors={[theme.colors.background[1], theme.colors.background[0]]}
      style={{ flex: 1 }}
    >
      <AnimatePresence>
        {/* Error Messages */}
        {(error || userError || statsError) && (
          <MotiView
            from={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -100, opacity: 0 }}
            style={{
              position: 'absolute',
              top: 100,
              left: 20,
              right: 20,
              zIndex: 50,
              backgroundColor: theme.colors.danger[0],
              padding: 16,
              borderRadius: theme.metrics.borderRadius.soft,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Ionicons name="close-circle" size={24} color={theme.colors.contrastText} />
            <Text style={{ color: theme.colors.contrastText, flex: 1 }}>
              {error || userError?.message || statsError?.message}
            </Text>
          </MotiView>
        )}

        {/* Success Message */}
        {success && (
          <MotiView
            from={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -100, opacity: 0 }}
            style={{
              position: 'absolute',
              top: 60,
              left: 20,
              right: 20,
              zIndex: 50,
              backgroundColor: theme.colors.success[0],
              padding: 16,
              borderRadius: theme.metrics.borderRadius.soft,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.contrastText} />
            <Text style={{ color: theme.colors.contrastText, flex: 1 }}>{success}</Text>
          </MotiView>
        )}
      </AnimatePresence>

      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{ paddingTop: 60, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'flex-end' }}
      >
        <TouchableOpacity 
          onPress={logout}
          style={{
            backgroundColor: theme.colors.danger[0] + '20',
            padding: 8,
            borderRadius: theme.metrics.borderRadius.soft,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Ionicons name="log-out" size={20} color={theme.colors.danger[0]} />
          <Text style={{ color: theme.colors.danger[0], marginLeft: 8 }}>Logout</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Profile Content */}
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{
          flex: 1,
          marginTop: 80,
          padding: 24,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: theme.colors.background[0],
          ...theme.effects.shadow
        }}
      >
        {/* Profile Image */}
        <MotiView
          style={{
            position: 'absolute',
            top: -80,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LinearGradient
            colors={theme.colors.accent}
            style={{
              padding: 4,
              borderRadius: 100,
              ...theme.effects.shadow
            }}
          >
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: theme.colors.contrastText
              }}
              source={{ uri: user?.data?.photo || 'https://avatar.iran.liara.run/public/44' }}
            />
          </LinearGradient>
        </MotiView>

        {/* Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
          <StatCard
            icon="gift"
            value={`${data?.data?.totalPoints || 0} pts`}
            label="Points"
            theme={theme}
            color={theme.colors.accent[0]}
          />
          <StatCard
            icon="file-tray"
            value={`${data?.data?.totalQuizzesTaken || 0}`}
            label="Quizzes"
            theme={theme}
            color={theme.colors.info[0]}
          />
          <StatCard
            icon="bulb"
            value={`${data?.data?.totalQuestionsDone || 0}`}
            label="Questions"
            theme={theme}
            color={theme.colors.success[0]}
          />
        </View>

        {/* Form Fields */}
        <View style={{ gap: 24 }}>
          <FormField
            label="Username"
            theme={theme}
            icon="person"
            value={username}
            placeholder={user?.data?.username || 'Loading...'}
            onChangeText={setUsername}
            editable={!mutation.isLoading}
          />
          <FormField
            label="Email"
            theme={theme}
            icon="mail"
            value={user?.data?.email || 'Loading...'}
            editable={false}
          />
        </View>

        {/* Update Button */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginTop: 32 }}
        >
          <RoundedButton
            label={mutation.isLoading ? "Updating..." : "Update Profile"}
            onPress={handleUpdate}
            gradient={theme.colors.accent}
            textColor={theme.colors.contrastText}
            disabled={mutation.isLoading || !username.trim() || username === user?.data?.username}
          />
        </MotiView>
      </MotiView>
    </LinearGradient>
  );
}

const StatCard = ({ icon, value, label, color, theme }) => (
  <MotiView
    from={{ scale: 0.9 }}
    animate={{ scale: 1 }}
    style={{
      flex: 1,
      marginHorizontal: 4,
      padding: 16,
      borderRadius: theme.metrics.borderRadius.soft,
      backgroundColor: theme.colors.card[0],
      alignItems: 'center',
      ...theme.effects.shadow
    }}
  >
    <View style={{
      backgroundColor: color + '20',
      padding: 8,
      borderRadius: theme.metrics.borderRadius.pill,
      marginBottom: 8
    }}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={{
      color: color,
      fontSize: 18,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 4
    }}>{value}</Text>
    <Text style={{
      color: theme.colors.secondaryText,
      fontSize: 12
    }}>{label}</Text>
  </MotiView>
);

const FormField = ({ label, icon, theme, ...props }) => (
  <MotiView
    from={{ opacity: 0, translateX: -10 }}
    animate={{ opacity: 1, translateX: 0 }}
    style={{ gap: 8 }}
  >
    <View style={{
      backgroundColor: theme.colors.card[0],
      borderRadius: theme.metrics.borderRadius.soft,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      height: 56,
      ...theme.effects.shadow
    }}>
      <Ionicons name={icon} size={20} color={theme.colors.secondaryText} />
      <TextInput
        style={{
          flex: 1,
          marginLeft: 12,
          color: theme.colors.text,
          fontSize: 16,
          fontWeight: theme.typography.fontWeights.medium
        }}
        placeholderTextColor={theme.colors.secondaryText}
        {...props}
      />
    </View>
  </MotiView>
);