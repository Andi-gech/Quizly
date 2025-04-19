import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/Api';

export default function UseFetchQuiz({ id }) {
 

  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const response = await api.get(`/api/quizzes/${id}`);
  
      return response;
    },
    enabled: !!id,
  
  });
}
