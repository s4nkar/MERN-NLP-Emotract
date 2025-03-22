import { getUsers } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useGetStudents = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => getUsers()
  });
};
