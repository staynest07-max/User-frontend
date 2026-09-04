import { configureAuthRecovery } from '@/api/client';
import { ApiError } from '@/api/errors';
import { queryClient } from '@/query/client';
import { queryKeys } from '@/query/keys';
import { useAuthSessionStore } from '@/stores/authSessionStore';
import { authService } from './api/authService';
import { authErrorMessage, isInvalidSessionError } from './errors';

let initializationPromise: Promise<void> | null = null;

export async function clearAuthSession(clearCredential = true): Promise<void> {
  if (clearCredential) await authService.clearLocalCredentials();
  queryClient.removeQueries({ queryKey: queryKeys.auth.all });
  queryClient.removeQueries({ queryKey: queryKeys.user.all });
  queryClient.removeQueries({ queryKey: queryKeys.preferences.all });
  queryClient.removeQueries({ queryKey: queryKeys.savedPgs.all });
  queryClient.removeQueries({ queryKey: queryKeys.enquiries.all });
  queryClient.removeQueries({ queryKey: queryKeys.visits.all });
  queryClient.removeQueries({ queryKey: queryKeys.notifications.all });
  useAuthSessionStore.getState().setUnauthenticated();
}

export function initializeAuthSession(): Promise<void> {
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    const store = useAuthSessionStore.getState();
    store.beginInitialization();
    try {
      const principal = await authService.refreshSession();
      if (!principal) {
        store.setUnauthenticated();
        return;
      }
      queryClient.setQueryData(queryKeys.auth.me(), principal);
      store.setAuthenticated(principal);
    } catch (error) {
      // Invalid/forbidden sessions are discarded. On a network outage the
      // rotated or existing refresh token is retained for a later sign-in retry.
      const clearCredential = isInvalidSessionError(error) || !(error instanceof ApiError);
      if (clearCredential) await authService.clearLocalCredentials();
      store.setUnauthenticated(authErrorMessage(error));
    }
  })();

  return initializationPromise;
}

export function installAuthRecovery(): () => void {
  return configureAuthRecovery({
    refreshAccessToken: async () => {
      await authService.refreshAccessToken();
    },
    onSessionInvalid: () => clearAuthSession(true),
  });
}
