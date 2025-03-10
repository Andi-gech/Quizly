import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from "@tanstack/react-query";

import Header from '../../components/Header';
import RoundedButton from '../../components/RoundedButton';
import UseFetchQuiz from '../../hooks/UseFetchQuiz';
import LoadingPage from '../../components/LoadingPage';
import Question from '../../components/Question';
import api from '../../utils/Api';
import { useState,useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

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
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

useEffect(() => {
  if (data?.data?.questions[currentQuestion]?.answers) {
    setShuffledAnswers([...data.data.questions[currentQuestion].answers].sort(() => Math.random() - 0.5));
  }
}, [currentQuestion, data]);

  const mutation = useMutation(
   
 
  {
    mutationFn: async () => {
      const response = await api.post(`/api/quizzes/${id}/score`, {
    
      
          answers,
        });
        return response.data;
      }
      ,
    mutationKey: ["quiz", id, "score"],
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
  const theme = useTheme();
  if (!started) {
    return (
      <LinearGradient
      colors={theme.colors.background}
       
        className="flex-1"
        style={{ height: '100%',paddingTop: 20 }}
      >
        <Header name="Quiz Preparation" showback={true} />
        
        {isLoading && <LoadingPage quiz={true} />}

        <View
          
          className="flex-1 items-center justify-center px-4"
        >
          <View
          
            className="items-center"
          >
            <Ionicons
              name="rocket-outline"
              size={80}
              color="#f59e0b"
              className="mb-8"
            />
            <Text className="text-4xl font-bold text-amber-400 mb-2">
              {data?.data?.title}
            </Text>
            <Text style={{
            color: theme.colors.text
            }} className=" text-lg text-center mb-8">
              Get ready for {data?.data?.questions?.length} questions
            </Text>
            
            <RoundedButton
              label="Start Challenge"
              icon={mutation.isLoading ? "refresh" : "play"}
              bgcolor="bg-amber-500"
              radius="rounded-xl"
              color="text-white"
              padding="px-8 py-4"
              customStyle={{
                shadowColor: '#f59e0b',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
              onPress={handleClick}
            />
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme.colors.background}
      className="flex-1 pt-[20px]"
      style={{ height: '100%',paddingTop: 20 }}
    >
      <Header 
        name={`Question ${currentQuestion + 1}/${data?.data?.questions?.length}`} 
        showback={false}
      />
      
      {mutation.isLoading && <LoadingPage />}

      <View
       
        className="flex-1"
      >
        <Question
          AnswerQuestion={(answer, question) => {
            setAnswers([...answers, { questionId:question, answerId: answer }]);
          }}
          current={currentQuestion}
          onclose={handleclose}
          id={data?.data?.questions[currentQuestion]?._id}
          question={data?.data?.questions[currentQuestion]?.questionText}
          answers={shuffledAnswers}
          onnext={handleNext}
        />
      </View>

      {/* Progress Indicator */}
      <View className="px-4 pb-4">
        <View className="bg-slate-800 rounded-full h-2">
          <View 
            className="bg-amber-400 h-2 rounded-full" 
            style={{ width: `${(currentQuestion + 1) / data?.data?.questions?.length * 100}%` }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}