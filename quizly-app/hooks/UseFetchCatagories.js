import { useQuery } from "@tanstack/react-query";

import api from "../utils/Api";

export default function UseFetchCatagories() {
  const FetchCatagories = async () => {
    return await api.get(`/api/categories`);
  };

  return useQuery({
    queryKey: ["Catagories"],
    queryFn: FetchCatagories,
    refetchOnWindowFocus: false,
  });
}