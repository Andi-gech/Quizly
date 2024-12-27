import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput,ScrollView, RefreshControl,ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
import SearchComponent from '../../components/SearchComponent';

import LiveQuizCard from '../../components/LiveQuizCard';
import CatagoryCard from '../../components/CatagoryCard';

import UseFetchLiveQuizes from '../../hooks/UseFetchLiveQuizes';
import UseFetchCatagories from '../../hooks/UseFetchCatagories';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Search() {
  const [selected, setSelected] = useState('Categories');
  const [refreshing, setRefreshing] = useState(false);

  const [params, setParams] = useState({});
  const { data: categories, isLoading: isCategoriesLoading,refetch:refetchCatagory } = UseFetchCatagories();
  const { data: quizzes, refetch, isFetching: isQuizzesFetching } = UseFetchLiveQuizes(params);

  useEffect(() => {
    refetch();
  }, [params]);
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchCatagory(); // Refresh the categories
    setRefreshing(false);
  };

  const renderContent = () => {
    if (selected === 'Categories') {
      return (
        <ScrollView
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',paddingBottom: 20 }}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
          {categories?.data?.map((item) => (
            <CatagoryCard
              key={item._id}
              onpress={() => {
              router.push({
                pathname: '/(quiz)/Catagory',
                params:{
                  id: item._id,
                  name: item.title
                }
              });
              }}
              icon={<FontAwesome name={item.FontAwesomeIconName} size={22} color={"white"} />}
              name={item.title}
            />
          ))}
        </ScrollView>
      );
    } else {
      return (
        <FlatList
          data={quizzes?.data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <LiveQuizCard data={item} />}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  };

  return (
    <View className="flex-1 bg-black .. items-center justify-end pt-5">
      <View className="h-1/5 w-full px-2.5 items-center justify-start">
        <Header name="Discover Quiz" showback={false} />
        <SearchComponent
          onChangeText={(text) => {
            setParams({ searchTitle: text });
            if (text === '') {
              setParams({});
              setSelected('Categories');
            } else {
              setSelected('Search');
            }
          }}
        />
      </View>
      <View className="flex-1 bg-white w-[99%] rounded-t-3xl items-center pt-2.5">
        {(isQuizzesFetching || isCategoriesLoading) ? (
          <ActivityIndicator size="large" color="rgba(0,0,0,0.3)" />
        ) : (
          <View className="w-full px-2.5 pb-25">{renderContent()}</View>
        )}
      </View>
    </View>
  );
}
