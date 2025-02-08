import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from '../../components/Header';

import LiveQuizCard from '../../components/LiveQuizCard';
import CatagoryCard from '../../components/CatagoryCard';
import UseFetchLiveQuizes from '../../hooks/UseFetchLiveQuizes';
import UseFetchCatagories from '../../hooks/UseFetchCatagories';

export default function Search() {
  const [selected, setSelected] = useState('Categories');
  const [refreshing, setRefreshing] = useState(false);
  const [params, setParams] = useState({});
  
  const { data: categories, isLoading: isCategoriesLoading, refetch: refetchCatagory } = UseFetchCatagories();
  const { data: quizzes, refetch, isFetching: isQuizzesFetching } = UseFetchLiveQuizes(params);

  useEffect(() => { refetch(); }, [params]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchCatagory();
    setRefreshing(false);
  };

  const renderContent = () => {
    if (selected === 'Categories') {
      return (
        <ScrollView
          contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#f59e0b" />}
        >
          {categories?.data?.map((item, index) => (
            <View
              key={item._id}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 50 }}
              className="m-2"
            >
              <CatagoryCard
                onpress={() => {
                  router.push({
                    pathname: '/(quiz)/Catagory',
                    params:{
                      id: item._id,
                      name: item.title
                    }
                  });
                }}
                
                icon={<FontAwesome name={item.FontAwesomeIconName} size={24} color="white" />}
                name={item.title}
                gradient={['#3b82f6', '#6366f1']}
              />
            </View>
          ))}
        </ScrollView>
      );
    } else {
      return (
        <FlatList
          data={quizzes?.data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="mb-4 mx-4"
            >
              <LiveQuizCard 
                data={item} 
                style={{ backgroundColor: '#1e293b' }}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      );
    }
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      className="flex-1"
      style={{
        height: '100%',
      }}
    >
      {/* Header Section */}
      <View className="pt-14 px-6 pb-4">
        <Header name="Discover Quiz" showback={false} />
        
        {/* Search Bar */}
        <View
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="bg-slate-800/40 rounded-xl p-3 flex-row items-center"
        >
          <MaterialIcons name="search" size={24} color="#64748b" />
          <TextInput
            placeholder="Search quizzes..."
            placeholderTextColor="#64748b"
            className="flex-1 text-white text-base ml-2"
            onChangeText={(text) => {
              setParams({ searchTitle: text });
              setSelected(text ? 'Search' : 'Categories');
            }}
          />
        </View>

        {/* Toggle Buttons */}
        <View className="flex-row bg-slate-800/30 rounded-xl p-1 mt-4">
          {['Categories', 'Search'].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 items-center py-2 rounded-lg ${selected === tab ? 'bg-amber-400' : ''}`}
              onPress={() => setSelected(tab)}
            >
              <Text className={`font-semibold ${selected === tab ? 'text-black' : 'text-slate-400'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content Area */}
      <View className="flex-1">
        {(isQuizzesFetching || isCategoriesLoading) ? (
          <View
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{ loop: true, type: 'timing', duration: 1000 }}
            className="flex-1 items-center justify-center"
          >
            <MaterialIcons name="hourglass-top" size={40} color="#f59e0b" />
          </View>
        ) : (
          
            <View
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1"
            >
              {renderContent()}
            </View>
         
        )}
      </View>
    </LinearGradient>
  );
}