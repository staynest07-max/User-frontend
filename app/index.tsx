import { Redirect } from 'expo-router';
import { useAppStore } from '@/stores/appStore';

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const role = useAppStore((s) => s.role);

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }
  if (role === 'merchant') {
    return <Redirect href="/(merchant)/(tabs)" />;
  }
  if (role === 'admin') {
    return <Redirect href="/(admin)/(tabs)" />;
  }
  return <Redirect href="/(user)/(tabs)" />;
}
