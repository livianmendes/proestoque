import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect } from 'react';

import { SplashScreen } from '../src/components/SplashScreen';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="dark" />
      </NavigationGuard>
    </AuthProvider>
  );
}

function NavigationGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();

  const inAuthGroup = segments[0] === '(auth)';
  const shouldGoToLogin = !isAuthenticated && !inAuthGroup;
  const shouldGoToApp = isAuthenticated && inAuthGroup;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (shouldGoToLogin) {
      router.replace('/login');
      return;
    }

    if (shouldGoToApp) {
      router.replace('/(tabs)');
    }
  }, [isLoading, router, shouldGoToApp, shouldGoToLogin]);

  if (isLoading || shouldGoToLogin || shouldGoToApp) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
