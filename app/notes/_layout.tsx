import React from 'react';
import { Stack } from 'expo-router';

export default function NotesLayout() {
  return (
    <Stack>
      <Stack.Screen name="new" options={{ title: 'New Note', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Note Detail' }} />
    </Stack>
  );
}
