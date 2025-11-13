import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}
