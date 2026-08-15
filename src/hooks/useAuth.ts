'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UserRole, UserStatus } from '@/models/User';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phoneNumber?: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<AuthUser | null>({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.success) {
          return response.data.data.user;
        }
        return null;
      } catch (err: unknown) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
      const res = await axios.post('/api/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.data?.user) {
        queryClient.setQueryData(['authUser'], data.data.user);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/api/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null);
      router.push('/login');
      router.refresh();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    refetch,
  };
}

export default useAuth;
