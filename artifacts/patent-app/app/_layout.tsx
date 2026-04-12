import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginModal from "@/components/LoginModal";
import OfflineBanner from "@/components/OfflineBanner";
import Toast from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { FeedProvider } from "@/context/FeedContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { SocialProvider } from "@/context/SocialContext";
import { ToastProvider } from "@/context/ToastContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function PushNotificationSetup() {
  const { user } = useAuth();
  usePushNotifications(user?.id ?? null);
  return null;
}

function RootLayoutNav() {
  useEffect(() => {
    AsyncStorage.getItem("@patent:onboarded").then((val) => {
      if (!val) router.replace("/onboarding");
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="post" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="settings" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="privacy" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[userId]" options={{ headerShown: false }} />
      <Stack.Screen name="auth/google/callback" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <ToastProvider>
              <AuthProvider>
                <SocialProvider>
                  <FeedProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <KeyboardProvider>
                        <PushNotificationSetup />
                        <RootLayoutNav />
                        <LoginModal />
                        <Toast />
                        <OfflineBanner />
                      </KeyboardProvider>
                    </GestureHandlerRootView>
                  </FeedProvider>
                </SocialProvider>
              </AuthProvider>
            </ToastProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
