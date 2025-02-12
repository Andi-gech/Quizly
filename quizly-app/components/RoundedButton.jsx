import { TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function RoundedButton({
  label,
  onPress,
  icon,
  style,
  othercolor
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[{ borderRadius: 12, overflow: 'hidden' }, style]}
    >
      <LinearGradient
        colors={othercolor||theme.colors.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          paddingVertical: 16,
          paddingHorizontal: 24,
        }}
      >
        <Text style={{
          color: theme.colors.text,
          fontSize: 16,
          fontWeight: '600',
        }}>
          {label}
        </Text>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color="white"
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}