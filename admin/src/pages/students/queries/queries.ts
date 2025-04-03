import { 
  getSingleUser,
  getUserAnalytics,
  getUsers, 
  handleBlockUser, 
  handleDeleteUser, 
  handleUnBlockUser, 
  restrictUser
} from '@/lib/api';
import { RestrictUserProps } from '@/types';
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

export const useGetSingleUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => getSingleUser(id)
  });
};

export const useGetUserAnalytics = (id: string) => {
  return useQuery({
    queryKey: ['userAnalytics', id],
    queryFn: async () => getUserAnalytics(id)
  });
};

export const useRestrictUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: RestrictUserProps) => restrictUser(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAnalytics'] });
    }
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

export const useUnblockUser = (useType: "Analytics" | "Users") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => handleUnBlockUser(id),
    onSuccess: () => {
      const queryKey = useType === "Analytics" ? ["userAnalytics"] : ["users"];
      queryClient.invalidateQueries({ queryKey });
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

