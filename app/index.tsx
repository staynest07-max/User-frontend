import { Redirect } from 'expo-router';
import { useAppStore } from '@/stores/appStore';
import { useAuthSessionStore } from '@/stores/authSessionStore';

export default function Index() {
  const hydrated = useAppStore((s) => s.hydrated);
  const status = useAuthSessionStore((s) => s.status);

  if (!hydrated || status === 'initializing') return null;
  if (status === 'unauthenticated') {
    return <Redirect href="/(onboarding)/welcome" />;
  }
  return <Redirect href="/(user)/(tabs)" />;
}
