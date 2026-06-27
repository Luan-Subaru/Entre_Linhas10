import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  // este arquivo organiza as telas principais do aplicativo em formato de pilha
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* define a tela de login como uma das rotas principais */}
      <Stack.Screen name="login" />
      
      {/* define a pasta de abas como outra rota principal */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};