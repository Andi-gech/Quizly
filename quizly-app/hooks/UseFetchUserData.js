import { useQuery } from "@tanstack/react-query";

import api from "../utils/Api";

export default function UseFetchUserData() {
  const FetchUserData = async () => {
    return await api.get(`/api/auth/me`);
  };

  return useQuery({
    queryKey: ["me"],
    queryFn: FetchUserData

  
  });
}