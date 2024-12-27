import { useQuery } from "@tanstack/react-query";

import api from "../utils/Api";

export default function UseFetchMyQuiz() {
  const FetchMyQuiz = async () => {
    console.log("fetching my quiz");
    return await api.get(`/api/quizzes/quiz/mine`);
  };

  return useQuery({
    queryKey: ["MyQuiz"],
    queryFn: FetchMyQuiz,
    
    refetchOnWindowFocus: false,
  });
}