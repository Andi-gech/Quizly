import { View, Text, FlatList, TouchableOpacity,RefreshControl } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import RoundedButton from "../../components/RoundedButton";
import QuizProgress from "../../components/QuizProgress";
import Profileview from "../../components/ProfileView";
import UseFetchMyQuiz from "../../hooks/UseFetchMyQuiz";
import LoadingPage from "../../components/LoadingPage";
import LiveQuizCard from "@/components/LiveQuizCard";

export default function HomeScreen() {
  const { data, isLoading, refetch } = UseFetchMyQuiz();
  const router = useRouter();

  const NavigateToQuizes = () => router.replace("/search");

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      className="flex-1 min-h-screen relative"
      style={{ width:"100%", height:"100%" }}
    >
      {/* Header Section */}
      <View className="pt-14 px-9 pb-4">
        <View className="flex-row justify-between items-center mb-6">
          <Profileview />
          
        </View>

        {/* Current Progress */}
        {data?.data[0] && (
          <View
            
          >
            <QuizProgress 
              addInfo="Recent Quiz"
            data={data?.data[0]}
            name={data?.data[0].title}
            
              point="20"
            />
          </View>
        )}
      </View>

      {/* Welcome Section */}
      <View
        
        className="mx-6 my-6 bg-slate-700/20 p-6 rounded-3xl"
      >
        <View className="space-y-4">
          <View className="flex-row items-center space-x-3">
            <MaterialCommunityIcons 
              name="rocket-launch" 
              size={32} 
              color="#f59e0b" 
            />
            <Text className="text-2xl font-bold text-white">
              Welcome to Quizly
            </Text>
          </View>
          
          <Text className="text-slate-400 text-base">
            Discover new challenges and expand your knowledge
          </Text>
          
          <RoundedButton
            name="Explore Quizzes"
            icon="arrow-right"
            bgcolor="bg-amber-400"
            color="text-black text-lg font-bold"
            radius="rounded-xl"
            onPress={NavigateToQuizes}
            style={{ shadowColor: '#f59e0b', shadowOpacity: 0.4 }}
          />
        </View>
      </View>

      {/* Quiz List Section */}
      
        <View className="flex-1 px-4">
          <Text className="text-white text-xl font-bold mb-4 ml-2">
            Live Quizzes
          </Text>
          
          <FlatList
            data={data?.data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                tintColor="#f59e0b"
              />
            }

            renderItem={({ item, index }) => (
              <View
               
                className="mb-4"
              >
               <LiveQuizCard data={item} />
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-8">
                <MaterialCommunityIcons 
                  name="magnify" 
                  size={48} 
                  color="#475569" 
                />
                <Text className="text-slate-500 mt-4">
                  No quizzes available yet
                </Text>
              </View>
            }
          />
        </View>
    
    </LinearGradient>
  );
}