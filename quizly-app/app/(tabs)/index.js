import { View, Text, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../context/ThemeContext";
import RoundedButton from "../../components/RoundedButton";
import QuizProgress from "../../components/QuizProgress";
import ProfileView from "../../components/ProfileView";
import UseFetchMyQuiz from "../../hooks/UseFetchMyQuiz";
import LoadingPage from "../../components/LoadingPage";
import LiveQuizCard from "../../components/LiveQuizCard";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const theme = useTheme();
  const { data, isLoading, refetch } = UseFetchMyQuiz();
  const router = useRouter();

  const NavigateToQuizes = () => router.push("/search");
console.log(data?.data)
  return (
    <LinearGradient
      colors={theme.colors.background}
      style={{ 
        flex: 1,
        paddingTop: 50,
      }}>
      <StatusBar style={!theme?.isDarkMode ? "dark" : "light"} />
      
      <View style={{ paddingHorizontal: 24 }}>
        <ProfileView />
        
        {data?.data[0] && (
          <QuizProgress 
            addInfo="Recent Quiz"
            data={data?.data[0]}
            name={data?.data[0].title}
            point={data?.data[0].point}
          />
        )}
      </View>

      <LinearGradient
        colors={theme.colors.card}
        style={{
          marginInline: 24,
          padding: 20,
          borderRadius: 20,
          shadowColor: theme?.colors.text,
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }}
      >
        <View style={{ gap: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <LinearGradient
              colors={theme.colors.accent}
              style={{ borderRadius: 8, padding: 4,
              shadowColor: theme?.colors.text,
              shadowOpacity: 0.1,
              shadowRadius: 10,
               }}
            >
              <MaterialCommunityIcons 
                name="rocket-launch" 
                size={28} 
                color="white" 
              />
            </LinearGradient>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              background: theme.colors.textGradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
             color: "orange",
            }}>
              Welcome to Quizly
            </Text>
          </View>
          
          <Text style={{
            fontSize: 16,
            color: theme?.colors.secondaryText,
            lineHeight: 24,
          }}>
            Discover new challenges and expand your knowledge
          </Text>
          
          <RoundedButton
            label="Explore Quizzes"
            icon="arrow-right"
            onPress={NavigateToQuizes}
            gradient={theme.colors.accent}
          />
        </View>
      </LinearGradient>

      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View 
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginBottom: 16
          }}
        >
          <Text style={{

            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.text
          }}>
            Your Quizzes
          </Text>
        </View>
        
        <FlatList
          data={data?.data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={theme?.colors.accent}
            />
          }
          renderItem={({ item }) => (
            <LiveQuizCard data={item} />
          )}
          ListEmptyComponent={
            <LinearGradient
              colors={theme.colors.card}
              style={{ 
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 32,
                gap: 16,
              }}
            >
              <LinearGradient
                colors={theme.colors.highlight}
                style={{ 
                  borderRadius: 20,
                  padding: 12
                }}
              >
                <MaterialCommunityIcons 
                  name="magnify" 
                  size={40} 
                  color="white" 
                />
              </LinearGradient>
              <Text style={{
                color: theme?.colors.secondaryText,
                fontSize: 16,
              }}>
                No quizzes available yet
              </Text>
            </LinearGradient>
          }
        />
      </View>
    </LinearGradient>
  );
}