// Question.js
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import RoundedButton from './RoundedButton';
import AnswerComponent from './AnswerComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Question({
  current,
  question,
  answers,
  id,
  onnext,
  onclose,
  AnswerQuestion,
}) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  useEffect(() => {
    setSelectedAnswer("");
    setExplanationVisible(false);
  }, [current]);

  const handleAnswerPress = (answerId) => {
    setSelectedAnswer(answerId);
    AnswerQuestion(answerId, id);
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1 justify-between px-4">
        {/* Question Container */}
        <View style={{ flex: 1, marginTop: 16 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View className="px-4 py-6">
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
              >
                <Text className="font-bold text-[18px] text-white mb-6 leading-6">
                  {current + 1}. {question}
                </Text>
              </MotiView>

              {answers.map((answer, index) => (
                <MotiView
                  key={answer._id}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 50 }}
                  style={{ marginBottom: 12 }}
                >
                  <AnswerComponent
                    selected={selectedAnswer}
                    id={answer._id}
                    iscorrect={Boolean(answer.isCorrect)}
                    onPress={() => handleAnswerPress(answer._id)}
                    name={answer.text}
                  />
                </MotiView>
              ))}
            </View>

            {/* Explanation */}
            <AnimatePresence>
              {explanationVisible && (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-700/30 mx-4 p-4 rounded-2xl border border-slate-600 my-4"
                >
                  <View className="flex-row items-center mb-2">
                    <MaterialCommunityIcons 
                      name="brain" 
                      size={20} 
                      color="#f59e0b" 
                    />
                    <Text className="text-amber-400 font-bold text-lg ml-2">
                      Explanation
                    </Text>
                  </View>
                  <Text className="text-amber-100 text-sm leading-5">
                    Plausible but incorrect answers designed to challenge the respondent's knowledge. 
                    Randomize options to minimize bias. Use "All of the Above" sparingly.
                  </Text>
                </MotiView>
              )}
            </AnimatePresence>
          </ScrollView>
        </View>

        {/* Bottom Buttons */}
        <View className="flex-row justify-between px-4 mb-6" style={{ maxHeight: 70 }}>
          <RoundedButton
            name="Close"
            onPress={onclose}
            bgcolor="bg-slate-700 px-6 py-4 rounded-xl"
            color="text-white"
            icon="close"
            style={{ flex: 0.48 }}
          />
          <RoundedButton
            name="Next"
            onPress={onnext}
            bgcolor="bg-amber-400 px-6 py-4 rounded-xl"
            color="text-black font-bold"
            icon="arrow-right"
            style={{ flex: 0.48 }}
          />
        </View>

        {/* Explain Button */}
        <AnimatePresence>
          {selectedAnswer && !explanationVisible && (
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-24 w-full items-center"
            >
              <RoundedButton
                name="Explain Answer"
                bgcolor="bg-amber-400 px-8 py-4 rounded-xl"
                color="text-black font-bold"
                icon="lightbulb-on"
                onPress={() => setExplanationVisible(true)}
              />
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </LinearGradient>
  );
}