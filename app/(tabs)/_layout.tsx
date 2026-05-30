import React, { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase.js'; // sobe duas pastas para achar o firebase
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function TabsLayout() {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // monitora em tempo real se o usuario esta logado no firebase
    const desinscrever = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) {
        // se nao houver usuario logado chuta ele direto para tela de login
        router.replace('/login');
      }
      // encerra a tela de carregamento
      setCarregando(false);
    });

    // limpa o monitorador ao fechar o componente
    return desinscrever;
  }, []);

  // enquanto o firebase responde mostra um icone de carregando na tela creme
  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#a52a2a" />
      </View>
    );
  }

  // estrutura de abas do menu inferior do aplicativo
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#a52a2a' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
    </Tabs>
  );
}

// estilos da tela de carregamento inicial
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3dd', // cor creme padrao do entre linhas
    justifyContent: 'center',
    alignItems: 'center',
  },
});