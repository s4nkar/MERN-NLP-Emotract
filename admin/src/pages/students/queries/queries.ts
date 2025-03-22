import { 
  getUsers, 
  handleBlockUser, 
  handleDeleteUser, 
  handleUnBlockUser 
} from '@/lib/api';
import { 
  useMutation, 
  useQueryClient, 
  useQuery 
} from '@tanstack/react-query';

export const useGetStudents = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => getUsers()
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => handleBlockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Refresh users list
    }
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => handleUnBlockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Refresh users list
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => handleDeleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Refresh users list
    }
  });
};

