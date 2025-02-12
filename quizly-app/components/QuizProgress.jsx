import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function QuizProgress({ addInfo, name, point, data }) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={theme.colors.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{ gap: 8 }}>
        <Text style={{
          color: theme.colors.secondaryText,
          fontSize: 14,
          fontWeight: '500',
        }}>
          {addInfo}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <LinearGradient
            colors={theme.colors.accent}
            style={{ borderRadius: 8, padding: 4 }}
          >
            <Ionicons name="headset" size={24} color="white" />
          </LinearGradient>
          <Text style={{
            color: theme.colors.text,
            fontSize: 18,
            fontWeight: '600',
          }}>
            {data?.title}
          </Text>
        </View>
      </View>

      <LinearGradient
        colors={theme.colors.highlight}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: 'white',
        }}>
          {point}
        </Text>
      </LinearGradient>
    </LinearGradient>
  );
}