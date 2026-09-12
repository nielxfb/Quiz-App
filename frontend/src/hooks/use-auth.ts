import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';

const ME_KEY = ['auth', 'me'];

export function useCurrentUser() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: () => api<User>('/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

interface Credentials {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: Credentials) =>
      api<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onSuccess: (user) => {
      queryClient.setQueryData(ME_KEY, user);
    },
  });
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      api<User>('/users', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>('/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData(ME_KEY, null);
    },
  });
}
