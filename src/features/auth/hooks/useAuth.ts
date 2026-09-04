import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { initializeAuthSession, installAuthRecovery } from '../session';
import { queryClient } from '@/query/client';
import { queryKeys } from '@/query/keys';
import { useAuthSessionStore } from '@/stores/authSessionStore';

export function useInitializeAuth(): void {
  const started = useRef(false);
  useEffect(() => {
    const uninstallRecovery = installAuthRecovery();
    if (!started.current) {
      started.current = true;
      void initializeAuthSession();
    }
    return uninstallRecovery;
  }, []);
}

export function useRequestOtp() {
  return useMutation({ mutationFn: (phone: string) => authService.requestOtp(phone) });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => authService.verifyOtp(phone, otp),
    onSuccess: (principal) => {
      queryClient.setQueryData(queryKeys.auth.me(), principal);
      useAuthSessionStore.getState().setAuthenticated(principal);
    },
  });
}

export function useCurrentUser() {
  const authenticated = useAuthSessionStore((state) => state.status === 'authenticated');
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getCurrentUser(),
    enabled: authenticated,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: async () => {
      queryClient.clear();
      useAuthSessionStore.getState().setUnauthenticated();
    },
  });
}
