import { create } from 'zustand';
import type { AuthPrincipal } from '@/contracts/auth';

export type AuthSessionStatus = 'initializing' | 'unauthenticated' | 'authenticated';

interface AuthSessionState {
  status: AuthSessionStatus;
  principal: AuthPrincipal | null;
  error: string | null;
  beginInitialization: () => void;
  setAuthenticated: (principal: AuthPrincipal) => void;
  setUnauthenticated: (error?: string | null) => void;
}

/**
 * Ephemeral session state only. It is intentionally not persisted and has no
 * client-side role setter. Principals must come from the backend auth contract.
 */
export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  status: 'initializing',
  principal: null,
  error: null,
  beginInitialization: () => set({ status: 'initializing', error: null }),
  setAuthenticated: (principal) => {
    if (principal.role !== 'USER') throw new Error('User Mobile only accepts USER principals');
    set({ principal, status: 'authenticated', error: null });
  },
  setUnauthenticated: (error = null) => set({ principal: null, status: 'unauthenticated', error }),
}));
