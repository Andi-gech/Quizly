import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import RoundedButton from './RoundedButton';
import AnswerComponent from './AnswerComponent';
import { Ionicons } from '@expo/vector-icons';

export default function Question({
  current,
  question,
  answers,
  id,
  onnext,
  onclose,

  AnswerQuestion,
}) {
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
    <View className="flex absolute h-screen w-screen flex-col items-center justify-center pt-[20px]">
      <View className="absolute w-screen h-screen bg-black opacity-50" />

      <View className="flex items-center justify-start flex-col mt-5 bg-white py-[20px] px-[5px] w-[98%] rounded-[30px]">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="w-full py-[20px] px-3">
            <Text className="font-bold text-[17px]">
              {current + 1}. {question}
            </Text>
            {answers.map((answer) => (
              <AnswerComponent
                key={answer._id}
                selected={selectedAnswer}
                id={answer._id}
                iscorrect={Boolean(answer.isCorrect)}
                onPress={() => handleAnswerPress(answer._id)}
                name={answer.text}
              />
            ))}
          </View>

          {selectedAnswer && (
            <RoundedButton
              name="Explain Gemini✨"
              bgcolor="bg-black px-[20px] py-[20px] w-[200px] rounded-full"
              color="text-white"
              onPress={() => setExplanationVisible(true)}
            />
          )}

          {explanationVisible && (
            <Text className="text-sm px-3 font-bold">
              <Text className="text-indigo-700 font-bold text-[20px]">
                Explanation
              </Text>{" "}
              Plausible but incorrect answers designed to challenge the respondent's knowledge. Randomize options to minimize bias. Use "All of the Above" sparingly.
            </Text>
          )}

          <RoundedButton
            name="Next"
            onPress={onnext}
            bgcolor="bg-black px-[60px] py-[20px] min-h-[60px] rounded-full"
            color="text-white"
          />
        </ScrollView>
      </View>
      <RoundedButton name="Close Quiz" onPress={onclose} bgcolor="bg-red-500 px-[60px] py-[20px] min-h-[40px] rounded-full" color="text-white" />

    </View>
  );
}
