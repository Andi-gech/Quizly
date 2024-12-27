import React, { useState, useRef } from 'react';
import { Animated, FlatList, Text, TouchableOpacity, View } from 'react-native';
import TextButtons from './TextButtons';
import LiveQuizCard from './LiveQuizCard';
import { router } from 'expo-router';

const LiveCardsList = ({data,onrefresh}) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const toggleExpansion = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };
  console.log(data,"cc")
  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['40%', '95%'],
  });

  return (
    <Animated.View style={{ height: containerHeight }} className="absolute bottom-0 w-[98%] bg-white rounded-t-3xl px-2.5">
      <View className="flex-row justify-between items-center py-2 px-2.5">
        <Text className="text-black text-xl font-bold">My Quizzes</Text>
        <TextButtons name={expanded ? 'Hide' : 'Show All'} onPress={toggleExpansion} />
      </View>
      {
        data?.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-black text-lg">No quizzes found</Text>
            <TouchableOpacity onPress={
        ()=>{
          router.push('/(tabs)/add')
        }
            } className="bg-indigo-400 px-4 py-2 rounded-lg mt-4">
              <Text className="text-white">Generate Quiz</Text>
            </TouchableOpacity>
          </View>
        )
      }
      <FlatList
        data={data}
        onRefresh={
         (ref)=>{
          onrefresh()
       setRefreshing(true)
         }
        }
        
        
       refreshing={refreshing}
        renderItem={({ item }) => <LiveQuizCard  key={item._id} data={item}/>}
      
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </Animated.View>
  );
};

export default LiveCardsList;
