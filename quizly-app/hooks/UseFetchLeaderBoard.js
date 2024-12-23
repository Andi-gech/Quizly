import { useQuery } from "@tanstack/react-query";

import api from "../utils/Api";

export default function UseFetchLeaderBoard() {
  const FetchLeaderBoard = async () => {
    return await api.get(`/api/quizzes/leaderboard/calculatescore`);
  };

  return useQuery({
    queryKey: ["LeaderBoard"],
    queryFn: FetchLeaderBoard,
    refetchOnWindowFocus: false,
  });
}