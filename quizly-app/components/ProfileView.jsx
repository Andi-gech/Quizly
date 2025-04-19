import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';
import UserFetchUserData from '../hooks/UseFetchUserData';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning 🌅';
  if (hour < 18) return 'Good Afternoon 🌞';
  return 'Good Evening 🌙';
};

export default function ProfileView() {
  const theme = useTheme();
  const { data } = UserFetchUserData();

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={{
        backgroundColor: theme.colors.card[0],
        borderRadius: theme.metrics.borderRadius.medium,
        padding: theme.metrics.spacing.comfortable,
        marginBottom: theme.metrics.spacing.comfortable,
        ...theme.effects.shadow
      }}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Left Content */}
        <View>
          <Text style={{
            color: theme.colors.secondaryText,
            fontSize: 14,
            marginBottom: 4,
            letterSpacing: 0.5,
          }}>
            {getGreeting()}
          </Text>
          <Text style={{
            color: theme.colors.text,
            fontSize: 22,
            fontWeight: '700',
            letterSpacing: -0.5,
            marginBottom: 4,
          }}>
            {data?.data?.username}
          </Text>
          <View style={{
            height: 2,
            width: 40,
            backgroundColor: theme.colors.accent[0],
            borderRadius: 2
          }} />
        </View>
        
        {/* Right Content */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <MotiView
            from={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <TouchableOpacity 
              onPress={() => theme.toggleTheme()}
              style={{
                backgroundColor: theme.colors.background[1],
                padding: 10,
                borderRadius: theme.metrics.borderRadius.pill,
                ...theme.effects.shadow
              }}
            >
              <MaterialCommunityIcons
                name={theme.isDarkMode ? 'white-balance-sunny' : 'moon-waxing-crescent'}
                size={24}
                color={theme.colors.accent[0]}
              />
            </TouchableOpacity>
          </MotiView>

          <LinearGradient
            colors={theme.colors.accent}
            style={{
              padding: 2,
              borderRadius: theme.metrics.borderRadius.pill,
              ...theme.effects.shadow
            }}
          >
            <Image
              source={{ uri: data?.data?.photo || 'https://avatar.iran.liara.run/public/44' }}
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 24,
                borderWidth: 2,
                borderColor: theme.colors.background[0]
              }}
            />
          </LinearGradient>
        </View>
      </View>
    </MotiView>
  );
}