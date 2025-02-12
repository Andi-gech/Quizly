import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, ScrollView, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext'; // Adjust import path
import Header from '../../components/Header';
import LiveQuizCard from '../../components/LiveQuizCard';
import CatagoryCard from '../../components/CatagoryCard';
import UseFetchLiveQuizes from '../../hooks/UseFetchLiveQuizes';
import UseFetchCatagories from '../../hooks/UseFetchCatagories';

export default function Search() {
  const theme = useTheme();
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
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh} 
              tintColor={theme.colors.accent[0]} 
            />
          }
        >
          {categories?.data?.map((item, index) => (
            <View key={item._id} className="m-2">
              <CatagoryCard
                onpress={() => {
                  router.push({
                    pathname: '/(quiz)/Catagory',
                    params: { id: item._id, name: item.title }
                  });
                }}
                icon={<FontAwesome name={item.FontAwesomeIconName} size={24} color={theme.colors.text} />}
                name={item.title}
                gradient={theme.colors.info}
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
            <View className="mb-4 mx-4">
              <LiveQuizCard 
                data={item} 
                style={{ backgroundColor: theme.colors.card[0] }}
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
      colors={theme.colors.background}
      className="flex-1"
      style={{ height: '100%', paddingTop: 20 }}
    >
      {/* Header Section */}
      <View className="px-6 pb-4">
        <Header name="Discover Quiz" showback={false} />
        
        {/* Search Bar */}
        <View
          style={{ 
            backgroundColor: theme.colors.card[0] + '70',
            borderRadius: theme.metrics.borderRadius,
          }}
          className="p-3 flex-row items-center"
        >
          <MaterialIcons 
            name="search" 
            size={24} 
            color={theme.colors.secondaryText} 
          />
          <TextInput
            placeholder="Search quizzes..."
            placeholderTextColor={theme.colors.secondaryText}
            style={{ 
              color: theme.colors.text,
              marginLeft: theme.metrics.margin,
              fontSize: 16
            }}
            className="flex-1"
            onChangeText={(text) => {
              setParams({ searchTitle: text });
              setSelected(text ? 'Search' : 'Categories');
            }}
          />
        </View>

        {/* Toggle Buttons */}
        <View style={{ 
          backgroundColor: theme.colors.card[0] + '30',
          borderRadius: theme.metrics.borderRadius,
  
          flexDirection: 'row',
        }} className="p-1 mt-4">
          {['Categories', 'Search'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={{
                backgroundColor: selected === tab ? theme.colors.accent[1] : 'transparent',
                borderRadius: 35,
                padding: theme.metrics.padding,
                flex:1  ,
                alignItems: 'center',
                padding: 9,

                
              }}
              className="flex-1 items-center"
              onPress={() => setSelected(tab)}
            >
              <Text style={{
                color: selected === tab ? theme.colors.text : theme.colors.secondaryText,
                fontWeight: '600'
              }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content Area */}
      <View className="flex-1">
        {isQuizzesFetching || isCategoriesLoading ? (
          <View className="flex-1 items-center justify-center">
            <MaterialIcons 
              name="hourglass-top" 
              size={40} 
              color={theme.colors.accent[0]} 
            />
          </View>
        ) : (
          <View className="flex-1">
            {renderContent()}
          </View>
        )}
      </View>
    </LinearGradient>
  );
}