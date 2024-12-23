import { useQuery } from "@tanstack/react-query";

import api from "../utils/Api";

export default function UseFetchLiveQuizes(data) {
  
  const FetchLiveQuizes = async () => {
    console.log(data, "data");
    const params = new URLSearchParams();
    console.log(data?.catagory, "catagory");
    if (data?.catagory) params.append("catagory", data?.catagory);
    if (data?.searchTitle) params.append("searchTitle", data.searchTitle);
    if (data?.sortByHistory) params.append("sortByHistory", data.sortByHistory);

    return await api.get(`/api/quizzes?${params.toString()}`);
  };

  return useQuery({
    queryKey: ["LiveQuizes"],
    queryFn: FetchLiveQuizes,
    refetchOnWindowFocus: false,
  });
}