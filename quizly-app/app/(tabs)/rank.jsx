import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import LoadingPage from '../../components/LoadingPage';
import UseFetchLeaderBoard from '../../hooks/UseFetchLeaderBoard';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

export default function Leaderboard() {
  const theme = useTheme();
  const { data, isLoading, refetch } = UseFetchLeaderBoard();
  const sortedData = data?.data?.sort((a, b) => b.totalScore - a.totalScore) || [];

  const getRank = (rank) => sortedData[rank - 1] || null;

  const renderPodium = (position) => {
    const rank = getRank(position);
    const colors = {
      1: ['#f59e0b', '#fbbf24'],
      2: ['#3b82f6', '#6366f1'],
      3: ['#1e293b', '#0f172a']
    };

    return (
      <View
      key={position}
     
        
        className={`items-center mx-2 ${position === 1 ? 'mb-8' : 'mb-4'}`}
      >
        <LinearGradient
          colors={colors[position]}
          className={`w-24 h-${position === 1 ? '32' : '24'} rounded-t-2xl items-center justify-center`}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons 
            name={position === 1 ? 'trophy' : position === 2 ? 'medal' : 'ribbon'}
            size={40}
            color="white"
          />
        </LinearGradient>
        <View style={{
           backgroundColor: theme.colors.background[1],
        }} className=" p-3 rounded-b-2xl w-full items-center shadow-lg">
          <Image
            className="w-12 h-12 rounded-full border-2 border-white -mt-8"
            source={{ uri: rank?.avatar || 'https://avatar.iran.liara.run/public/44' }}
          />
          <Text style={{
            color: theme.colors.text,
          }} className="font-bold text-white mt-2" numberOfLines={1}>
            {rank?.user || 'Anonymous'}
          </Text>
          <Text style={{
            color: theme.colors.text,
          }} className="text-amber-400 text-sm">
            {rank?.totalScore || 0} pts
          </Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
    colors={theme.colors.background}
      className="flex-1 pt-2"
      style={{ height: '100%', paddingTop: 20 }}
    >
      <Header name="Leaderboard" showback={false} />
      <StatusBar style={!theme?.isDarkMode ? "dark" : "light"} />
      {isLoading && <LoadingPage accentColor="#f59e0b" />}

      {/* Podium Section */}
      <View className="h-[40%] justify-end">
        <View className="flex-row justify-center items-end">
          {renderPodium(2)}
          {renderPodium(1)}
          {renderPodium(3)}
        </View>
      </View>

      {/* Leaderboard List */}
      <View
       
        className="flex-1   rounded-t-3xl p-4"
        style={{ 
          backgroundColor: theme.colors.background[0],
          shadowColor: '#f59e0b', 
          shadowOffset: { width: 0, height: -10 }, 
          shadowOpacity: 0.1, 
          shadowRadius: 20 
        }}
      >
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item?._id}
         
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#f59e0b"
            />
          }
          renderItem={({ item, index }) => (
            <View
            key={index}
            
             
              className="flex-row items-center  p-3 rounded-xl mb-2"
              style={{ elevation: 2 ,
                backgroundColor: theme.colors.background[1],
                shadowColor: '#f59e0b', 
                shadowOffset: { width: 0, height: 10 }, 
                shadowOpacity: 0.1, 
                shadowRadius: 20
              }}
            >
              <Text style={{
                color: theme.colors.text,

              }} className="text-amber-400 font-bold min-w-[40px]">
                #{index + 1}
              </Text>
              <Image
                className="w-10 h-10 rounded-full mr-3 border border-amber-400"
                source={{ uri: item.avatar || 'https://avatar.iran.liara.run/public/44' }}
              />
              <View className="flex-1">
                <Text  style={{
                color: theme.colors.text,
                
              }}  className="font-semibold text-white" numberOfLines={1}>
                  {item.user}
                </Text>
                <Text  style={{
                color: theme.colors.text,
                
              }}  className="text-gray-400 text-sm">
                  {item.totalScore} points
                </Text>
              </View>
              {index < 3 && (
                <Ionicons
                  name={index === 0 ? 'trophy' : index === 1 ? 'medal' : 'ribbon'}
                  size={24}
                  color="#f59e0b"
                />
              )}
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-8">
              <Ionicons name="sad-outline" size={40} color="#64748b" />
              <Text  style={{
                color: theme.colors.text,
                
              }}  className="text-slate-400 mt-4">No leaderboard data available</Text>
            </View>
          }
        />
      </View>
    </LinearGradient>
  );
}