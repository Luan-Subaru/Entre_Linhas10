import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth, db } from '../../config/firebase'; // Note os dois pontos ../../ para subir duas pastas
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [nomeUsuario, setNomeUsuario] = useState('Leitor');
  const [carregando, setCarregando] = useState(true);

  // Buscar o nome do usuário que está logado direto no Firestore
  useEffect(() => {
    const buscarDadosUsuario = async () => {
      const usuarioAtual = auth.currentUser;
      
      if (usuarioAtual) {
        try {
          const docRef = doc(db, 'usuarios', usuarioAtual.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setNomeUsuario(docSnap.data().nome);
          }
        } catch (error) {
          console.log("Erro ao buscar nome do usuário:", error);
        }
      }
      setCarregando(false);
    };

    buscarDadosUsuario();
  }, []);

  if (carregando) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color="#a52a2a" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho de Boas-Vindas */}
      <View style={styles.header}>
        <Text style={styles.saudacao}>Olá, {nomeUsuario}! 👋</Text>
        <Text style={styles.subsaudacao}>O que vamos ler hoje no Entre Linhas?</Text>
      </View>

      {/* Seção 1: Minha Estante Atual */}
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Lendo Atualmente</Text>
        <View style={styles.cardLivroVazio}>
          <Text style={styles.textoVazio}>Você não tem livros na sua estante ainda.</Text>
          <TouchableOpacity style={styles.botaoAdicionar}>
            <Text style={styles.textoBotaoAdicionar}>+ Adicionar Livro</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção 2: Sugestões da Comunidade */}
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Destaques da Comunidade</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.FeedHorizontal}>
          <View style={styles.miniCardLivro}>
            <Text style={styles.tituloLivroExemplo}>O Alquimista</Text>
            <Text style={styles.autorLivroExemplo}>Paulo Coelho</Text>
          </View>
          <View style={styles.miniCardLivro}>
            <Text style={styles.tituloLivroExemplo}>Dom Casmurro</Text>
            <Text style={styles.autorLivroExemplo}>Machado de Assis</Text>
          </View>
          <View style={styles.miniCardLivro}>
            <Text style={styles.tituloLivroExemplo}>1984</Text>
            <Text style={styles.autorLivroExemplo}>George Orwell</Text>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff3dd', // Fundo creme
    padding: 20,
    paddingTop: 40,
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
  },
  saudacao: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  subsaudacao: {
    fontSize: 16,
    color: '#a52a2a',
    marginTop: 5,
  },
  secao: {
    marginBottom: 30,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3e2723',
    marginBottom: 15,
  },
  cardLivroVazio: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.1)',
  },
  textoVazio: {
    color: '#777',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  botaoAdicionar: {
    backgroundColor: '#a52a2a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBotaoAdicionar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  FeedHorizontal: {
    flexDirection: 'row',
  },
  miniCardLivro: {
    width: 130,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginRight: 15,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.1)',
  },
  tituloLivroExemplo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  autorLivroExemplo: {
    fontSize: 12,
    color: '#a52a2a',
    marginTop: 4,
  },
});