import { useQuery } from "@tanstack/react-query";

import api from "../utils/Api";

export default function UseFetchStats() {
  const FetchStats = async () => {
    console.log("fetching my stats");
    return await api.get(`/api/quizzes/profile/stats`);
  };

  return useQuery({
    queryKey: ["Stats"],
    queryFn: FetchStats,
    
    refetchOnWindowFocus: false,
  });
}