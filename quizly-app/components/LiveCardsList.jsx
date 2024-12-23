import React, { useState, useRef } from 'react';
import { Animated, FlatList, Text, TouchableOpacity, View } from 'react-native';
import TextButtons from './TextButtons';
import LiveQuizCard from './LiveQuizCard';

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
        <Text className="text-black text-xl font-bold">Live Quizzes</Text>
        <TextButtons name={expanded ? 'Hide' : 'Show All'} onPress={toggleExpansion} />
      </View>
      <FlatList
        data={data}
        onRefresh={
         ()=>{
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
