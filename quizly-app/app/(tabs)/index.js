import { View, Text, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import RoundedButton from "../../components/RoundedButton";
import ProfileView from "../../components/ProfileView";
import UseFetchMyQuiz from "../../hooks/UseFetchMyQuiz";
import LiveQuizCard from "../../components/LiveQuizCard";

export default function HomeScreen() {
  const theme = useTheme();
  const { data, isLoading, refetch } = UseFetchMyQuiz();
  const router = useRouter();

  const navigateToQuizzes = () => router.push("/search");

  return (
    <LinearGradient
      colors={theme.colors.background}
      style={{ 
        flex: 1,
        paddingTop: theme.metrics.spacing.comfortable,
      }}>
      <StatusBar style={theme.isDarkMode ? "light" : "dark"} />
      
      {/* Header Section */}
      <View style={{ 
        paddingHorizontal: theme.metrics.spacing.comfortable, 
        marginBottom: theme.metrics.spacing.dense 
      }}>
        <ProfileView />
      </View>

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        {/* Welcome Card */}
        <View style={{ 
          paddingHorizontal: theme.metrics.spacing.comfortable, 
          marginBottom: theme.metrics.spacing.comfortable 
        }}>
          <LinearGradient
            colors={theme.colors.card}
            style={{
              padding: theme.metrics.spacing.comfortable,
              borderRadius: theme.metrics.borderRadius.medium,
              shadowColor: theme.colors.text,
              shadowOpacity: 0.05,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <View style={{ gap: theme.metrics.spacing.dense }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: theme.metrics.spacing.dense 
              }}>
                <LinearGradient
                  colors={theme.colors.accent}
                  style={{ 
                    borderRadius: theme.metrics.borderRadius.soft,
                    padding: theme.metrics.spacing.dense,
                    ...theme.effects.shadow
                  }}
                >
                  <MaterialCommunityIcons 
                    name="brain" 
                    size={theme.metrics.iconSize.large} 
                    color={theme.colors.contrastText} 
                  />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: theme.typography.fontWeights.bold,
                    color: theme.colors.primaryText,
                    marginBottom: theme.metrics.spacing.dense/2,
                    letterSpacing: theme.typography.letterSpacing.tight
                  }}>
                    Knowledge Awaits!
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    color: theme.colors.secondaryText,
                    lineHeight: 24,
                    fontWeight: theme.typography.fontWeights.regular,
                    letterSpacing: theme.typography.letterSpacing.normal
                  }}>
                    Ready to challenge yourself? Explore our curated collection of quizzes.
                  </Text>
                </View>
              </View>
              
              <RoundedButton
                label="Browse Quizzes"
                icon="compass-outline"
                onPress={navigateToQuizzes}
                gradient={theme.colors.accent}
                style={{ 
                 
                  ...theme.effects.shadow
                }}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Activities Section */}
        <View style={{ flex: 1 }}>
          <View style={{ 
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: theme.metrics.spacing.comfortable,
            marginBottom: theme.metrics.spacing.dense
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: theme.typography.fontWeights.bold,
              color: theme.colors.text,
              letterSpacing: theme.typography.letterSpacing.tight
            }}>
              Recent Activities
            </Text>
            <Text style={{
              fontSize: 14,
              color: theme.colors.secondaryText,
              fontWeight: theme.typography.fontWeights.medium
            }}>
              {data?.data?.length || 0} available
            </Text>
          </View>
          
          <FlatList
            data={data?.data}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: theme.metrics.spacing.comfortable 
            }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                colors={theme.colors.accent}
                progressBackgroundColor={theme.colors.card[0]}
              />
            }
            renderItem={({ item }) => (
              <LiveQuizCard 
                data={item} 
                style={{ 
                  marginBottom: theme.metrics.spacing.dense,
                  borderRadius: theme.metrics.borderRadius.soft,
                  padding: theme.metrics.spacing.dense,
                  backgroundColor: theme.colors.card[0],
                  ...theme.effects.shadow
                }}
              />
            )}
            ListEmptyComponent={
              <View style={{ 
                paddingHorizontal: theme.metrics.spacing.comfortable,
                paddingVertical: theme.metrics.spacing.expansive,
                alignItems: 'center'
              }}>
                <LinearGradient
                  colors={theme.colors.highlight}
                  style={{
                    padding: theme.metrics.spacing.dense,
                    borderRadius: theme.metrics.borderRadius.pill,
                    marginBottom: theme.metrics.spacing.dense
                  }}
                >
                  <MaterialCommunityIcons 
                    name="book-open-outline" 
                    size={theme.metrics.iconSize.large} 
                    color={theme.colors.contrastText} 
                  />
                </LinearGradient>
                <Text style={{
                  color: theme.colors.secondaryText,
                  fontSize: 16,
                  textAlign: 'center',
                  lineHeight: 24,
                  fontWeight: theme.typography.fontWeights.medium
                }}>
                  No recent activities yet.{"\n"}
                  Start by exploring our quiz collection!
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </LinearGradient>
  );
}