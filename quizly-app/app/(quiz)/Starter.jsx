import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import RoundedButton from '../../components/RoundedButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import UseFetchQuiz from '../../hooks/UseFetchQuiz';
import LoadingPage from '../../components/LoadingPage';
import Question from '../../components/Question';
import { useMutation } from "@tanstack/react-query";
import api from '../../utils/Api';

export default function Starter() {
  const { id } = useLocalSearchParams();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  const { data, isLoading } = UseFetchQuiz({ id });
  const handleclose = () => {
    mutation.mutate();

  
  }

  const mutation = useMutation(
    async () => {
      const response = await api.post(`/api/quizzes/${id}/score`, {
       
        answers,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        router.push({
          pathname: "/(quiz)/score",
          params: {
            score: data.score,
          },
        })
        setAnswers([]);
        setStarted(false);
      },
    }
  );

  const handleNext = () => {
    if (currentQuestion < data?.data?.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      mutation.mutate();
    }
  };

  const handleClick = () => {
    if (data?.data?.questions?.length > 0) {
      setStarted(true);
    }
  };

  if (!started) {
    return (
      <View className="flex flex-1 flex-col bg-indigo-500 items-center justify-start pt-[20px]">
        <Header name="Quiz" />
        {isLoading && <LoadingPage />}
        <View className="flex items-center justify-center flex-col h-[80%] w-[98%] rounded-[30px]">
          <Text className="text-3xl text-white">Welcome to Quizly</Text>
          <Text className="text-xl text-white">Start your quiz now</Text>
          <RoundedButton
            name="Start Quiz"
            radius="rounded-full"
            color="text-black"
            bgcolor="bg-white px-[30px] rounded-full py-[20px]"
            onPress={handleClick}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex relative flex-1 flex-col bg-indigo-500 items-center justify-start pt-[20px]">
      <Header name="Quiz Started" />
      {mutation.isLoading && <LoadingPage />}
      <Question
        AnswerQuestion={(answer, question) => {
          setAnswers([...answers, { questionId:question, answerId: answer }]);
        }}
        current={currentQuestion}
        onclose={handleclose}
        id={data?.data?.questions[currentQuestion]?._id}
        question={data?.data?.questions[currentQuestion]?.questionText}
        answers={data?.data?.questions[currentQuestion]?.answers.sort(() => Math.random() - 0.5)}
        onnext={handleNext}
      />
    </View>
  );
}
