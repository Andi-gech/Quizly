import { FlatList, View,Text } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import UseFetchLiveQuizes from '@/hooks/UseFetchLiveQuizes';
import LiveQuizCard from '@/components/LiveQuizCard';
import { MaterialIcons } from '@expo/vector-icons';

export default function Category() {
  const { id, name } = useLocalSearchParams();
  const datas = { category: id };
  const { data, isLoading, isFetching, refetch, error } = UseFetchLiveQuizes(datas);

  useEffect(() => {
    refetch();
  }, [id]);

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      className="flex-1"
      style={{ height: '100%' }}
    >
      {/* Header Section */}
      <View className="pt-14 px-6 pb-4">
        <Header showback={true} name={name} />
        
        {/* Category Title */}
        <View
          
          className="mt-4"
        >
          <MaterialIcons name="category" size={28} color="#f59e0b" />
          <Text className="text-white text-xl font-bold mt-2">
            {name} Quizzes
          </Text>
        </View>
      </View>

      {/* Content Area */}
      <View className="flex-1 px-4">
        {(isLoading || isFetching) ? (
          <View
           
          className="flex-1 items-center justify-center"
          >
            <MaterialIcons name="hourglass-top" size={40} color="#f59e0b" />
          </View>
        ) : (
      
            <View
              
              className="flex-1"
            >
              <FlatList 
                data={data?.data}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <View
                   
                    className="mb-4"
                  >
                    <LiveQuizCard 
                      data={item}
                    key={item._id}
                    />
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
         
        )}
      </View>
    </LinearGradient>
  );
}