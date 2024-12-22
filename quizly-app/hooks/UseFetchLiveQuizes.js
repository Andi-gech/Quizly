import { useQuery } from "@tanstack/react-query";

import api from "../utils/Api";

export default function UseFetchLiveQuizes() {
  const FetchLiveQuizes = async () => {
    return await api.get(`/api/quizzes`);
  };

  return useQuery({
    queryKey: ["LiveQuizes"],
    queryFn: FetchLiveQuizes,
    refetchOnWindowFocus: false,
  });
}