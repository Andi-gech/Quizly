import { useQuery } from "@tanstack/react-query";

import api from "../utils/Api";

export default function UseFetchQuiz({id}) {
  const FetchQuiz = async () => {
    return await api.get(`/api/quizzes/${id}`);
  };

  return useQuery({
    queryKey: ["Quiz"],
    queryFn: FetchQuiz,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}