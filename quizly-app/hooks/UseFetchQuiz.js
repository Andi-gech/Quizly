import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/Api';
import useNetworkStatus from '../hooks/useNetworkStatus';

export default function UseFetchQuiz({ id }) {
  const isConnected = useNetworkStatus();

  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const response = await api.get(`/api/quizzes/${id}`);
      await AsyncStorage.setItem(`quiz-${id}`, JSON.stringify(response.data));
      return response.data;
    },
    enabled: isConnected||!!id,
    // fallback to AsyncStorage when offline
    suspense: true,
    initialData: async () => {
      const stored = await AsyncStorage.getItem(`quiz-${id}`);
      return stored ? JSON.parse(stored) : null;
    }
  });
}
