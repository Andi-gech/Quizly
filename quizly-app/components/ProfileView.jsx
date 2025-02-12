import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import UserFetchUserData from '../hooks/UseFetchUserData';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning 𖤓';
  if (hour < 18) return 'Good Afternoon 𖤓';
  return 'Good Evening 𖤓';
};

export default function ProfileView() {
  const theme = useTheme();
  const { data } = UserFetchUserData();

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    }}>
      <View>
        <Text style={{
          color: theme.colors.secondaryText,
          fontSize: 14,
          marginBottom: 4,
        }}>
          {getGreeting()}
        </Text>
        <Text style={{
          color: theme.colors.text,
          fontSize: 20,
          fontWeight: '600',
        }}>
          {data?.data?.username}
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={
          () => theme.toggleTheme()
        }>
          <MaterialCommunityIcons
            name={theme.isDarkMode ? 'weather-sunny' : 'weather-night'}
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://avatar.iran.liara.run/public/44' }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
      </View>
    </View>
  );
}