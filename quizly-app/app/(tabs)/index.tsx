import {  View, Text, FlatList} from "react-native";
import TransparentBanner from "../../components/TransparentBanner";
import RoundedButton from "../../components/RoundedButton";
import QuizProgress from "../../components/QuizProgress";
import Profileview from "../../components/ProfileView";
import LiveCardsList from "../../components/LiveCardsList";
import "../../global.css";
import { useRouter } from "expo-router";
import LoadingPage from "../../components/LoadingPage";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
useEffect(() => {
  setTimeout(() => {
    setLoading(false);
  }, 3000);
}
);
  const router = useRouter();
  const NavigateToQuizes = () => {
    router.replace("/search");
    
  };
  return (
   <View className="flex  relative flex-1 flex-col bg-indigo-500 items-center justify-start">
      <View className="h-[60%] w-full px-[10px] flex items-center justify-center">
       <Profileview />
       
    
        <QuizProgress addInfo={"Recent Quiz"} name={"Advanced Javascript"} point={"20/23"}/>
        
        <TransparentBanner children={
          <View className="flex items-center justify-center">
            <Text className="text-white text-[26px] font-bold">👋 Welcome to Quizly </Text>
            <Text  className=" text-white text-[13px "> Find More Quizes and Have Fun </Text>
            <RoundedButton   name={"Find Quizes ׂ╰┈➤"}  bgcolor={"bg-white"}  color={"text-black"} onPress={
  NavigateToQuizes
            } radius={"rounded-full"}/>
          </View>
        }
       
        />
      </View>
      {loading &&
      <LoadingPage/>
      }
        <LiveCardsList />
    
   
   

   </View>
  );
}
