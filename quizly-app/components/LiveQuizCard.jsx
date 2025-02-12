import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';

export default function LiveQuizCard({ data }) {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(quiz)/Starter",
      params: { id: data._id }
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <LinearGradient
        colors={theme.colors.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View style={{ flex: 1, gap: 12 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.colors.text,
            }}>
              {data?.title}
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <LinearGradient
                  colors={theme.colors.accent}
                  style={{ borderRadius: 4, padding: 4 }}
                >
                  <MaterialCommunityIcons
                    name="book"
                    size={16}
                    color="white"
                  />
                </LinearGradient>
                <Text style={{
                  color: theme.colors.secondaryText,
                  fontSize: 14,
                }}>
                  {data?.category}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <LinearGradient
                  colors={theme.colors.info}
                  style={{ borderRadius: 4, padding: 4 }}
                >
                  <MaterialCommunityIcons
                    name="help-circle"
                    size={16}
                    color="white"
                  />
                </LinearGradient>
                <Text style={{
                  color: theme.colors.secondaryText,
                  fontSize: 14,
                }}>
                  {data?.questions?.length} questions
                </Text>
              </View>
            </View>
            
            <View style={{
              height: 4,
              backgroundColor: theme.colors.background[0],
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <LinearGradient
                colors={theme.colors.accent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: '100%',
                  width: `${Math.min((0.4) * 100, 100)}%`,
                  borderRadius: 2
                }}
              />
            </View>
          </View>
          
          <LinearGradient
            colors={theme.colors.highlight}
            style={{ borderRadius: 20, padding: 4 }}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="white"
            />
          </LinearGradient>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}