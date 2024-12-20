import React, { useState, useRef } from 'react';
import { Animated, FlatList, Text, TouchableOpacity, View } from 'react-native';
import TextButtons from './TextButtons';
import LiveQuizCard from './LiveQuizCard';

const LiveCardsList = () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpansion = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

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
        data={[{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }]}
        renderItem={({ item }) => <LiveQuizCard />}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </Animated.View>
  );
};

export default LiveCardsList;
