import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { auth } from '../../config/firebase.js'; // Sobe duas pastas para achar o arquivo de configuração do firebase

export default function TabsLayout() {

  useEffect(() => {
    // Esse listener monitora em tempo real se o usuário está logado ou não
    const desinscrever = onAuthStateChanged(auth, (usuario) => {
      /* 
        TEMPORÁRIO: Deixamos a verificação comentada por enquanto para os testes
        não barrarem vocês na tela de login caso o simulador deslogue.
        
        if (!usuario) {
          router.replace('/login');
        }
      */
    });

    // Função de limpeza que roda quando o componente é desmontado
    return desinscrever;
  }, []);

  // Toda a nossa estrutura de abas e rotas do app
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#a52a2a' }}>
      
      {/* Aba do Início (Visível no menu de baixo) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      {/* 2. Aba da Biblioteca (Visível no menu de baixo) */}
      <Tabs.Screen
        name="biblioteca"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
      {/* 3. Aba do Perfil do Usuário (Visível no menu de baixo) */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="detalhes"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="favoritos"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="comentariosLivro"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="meusComentarios"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="pesquisarAmigos"
        options={{
          title: 'Amigos',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="perfilAmigo" 
        options={{ 
          href: null 
        }} 
      />
    </Tabs>
  );
}

// Estilos padrões da tela de carregamento do Entre Linhas
/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3dd', // Cor creme aconchegante do projeto
    justifyContent: 'center',
    alignItems: 'center',
  },
});*/