import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase.js'; // conexao com o firebase do seu projeto

export default function HomeScreen() {
  const [nomeUsuario, setNomeUsuario] = useState('Leitor');
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  
  // variaveis reais para controlar a busca na api publica do google
  const [busca, setBusca] = useState('');
  const [livros, setLivros] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);

  // busca o nome do usuario logado no firestore para personalizar o topo
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
          console.log("erro ao buscar nome do usuario:", error);
        }
      }
      setCarregandoUsuario(false);
    };
    buscarDadosUsuario();
  }, []);

  // funcao principal conectada com a api do google books
  const buscarLivrosNoGoogle = async () => {
    if (!busca || busca.trim() === '') {
      Alert.alert('Aviso', 'Digite o nome de um livro ou autor.');
      return;
    }

    setBuscando(true);
    try {
      const termoFormatado = busca.trim().toLowerCase();
      
      // sua chave inserida para autenticacao no painel do google cloud
      const MINHA_API_KEY = "AIzaSyBvAOP06d-0yrvPMfubfG7eAQxh94Hyvdo"; 
      
      // link de requisicao direta para buscar ate 10 volumes na base oficial
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termoFormatado)}&maxResults=10&key=${MINHA_API_KEY}`;
      
      const resposta = await fetch(url);
      const dados = await resposta.json(); 

      // se a api responder com sucesso e trouxer itens guardamos no estado
      if (dados && dados.items && dados.items.length > 0) {
        setLivros(dados.items);
      } else {
        // se nao vier nada do google limpamos a tela e avisamos o usuario
        setLivros([]);
        Alert.alert('Informacao', 'Nenhum livro foi encontrado na base do google books.');
      }
    } catch (error) {
      console.log("erro na api do google books:", error);
      setLivros([]);
      Alert.alert('Erro', 'Nao foi possivel conectar ao servidor do google books.');
    } finally {
      setBuscando(false);
    }
  };

  if (carregandoUsuario) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color="#a52a2a" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* cabecalho da tela inicial */}
      <View style={styles.header}>
        <Text style={styles.saudacao}>Olá, {nomeUsuario}!</Text>
        <Text style={styles.subsaudacao}>Encontre seu proximo livro no Entre Linhas</Text>
      </View>

      {/* barra de pesquisa estilizada */}
      <View style={styles.containerBusca}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por titulo ou autor de verdade..."
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={buscarLivrosNoGoogle}
        />
        <TouchableOpacity style={styles.botaoBusca} onPress={buscarLivrosNoGoogle}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* container de resultados */}
      <View style={styles.secao}>
        {buscando ? (
          <ActivityIndicator size="large" color="#a52a2a" style={{ marginTop: 20 }} />
        ) : livros.length > 0 ? (
          <>
            <Text style={styles.tituloSecao}>Resultados Encontrados</Text>
            {livros.map((item) => {
              const info = item.volumeInfo;
              let capa = info.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
              
              // forca o link de imagem a virar https para o celular nao bloquear a foto
              if (capa.startsWith('http://')) {
                capa = capa.replace('http://', 'https://');
              }

              const autores = info.authors ? info.authors.join(', ') : 'Autor desconhecido';

              return (
                <View key={item.id} style={styles.cardLivro}>
                  <Image source={{ uri: capa }} style={styles.capaLivro} key={capa} />
                  <View style={styles.infoLivro}>
                    <Text style={styles.tituloLivro} numberOfLines={2}>{info.title}</Text>
                    <Text style={styles.autorLivro} numberOfLines={1}>{autores}</Text>
                    
                    <TouchableOpacity style={styles.botaoFavoritarPequeno}>
                      <Ionicons name="heart-outline" size={16} color="#a52a2a" />
                      <Text style={styles.textoFavoritarPequeno}>favoritar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          /* estado inicial limpo antes da primeira pesquisa */
          <View style={styles.cardInfoInicial}>
            <Ionicons name="book-outline" size={40} color="#a52a2a" style={{ marginBottom: 10 }} />
            <Text style={styles.textoInfoInicial}>Use a barra acima para pesquisar milhoes de livros disponiveis na base do google.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff3dd',
    padding: 20,
    paddingTop: 60,
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 25,
  },
  saudacao: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  subsaudacao: {
    fontSize: 15,
    color: '#a52a2a',
    marginTop: 5,
  },
  containerBusca: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.2)',
    marginBottom: 30,
  },
  inputBusca: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  botaoBusca: {
    width: 55,
    height: '100%',
    backgroundColor: '#a52a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secao: {
    width: '100%',
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3e2723',
    marginBottom: 15,
  },
  cardLivro: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.1)',
  },
  capaLivro: {
    width: 70,
    height: 105,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  infoLivro: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  tituloLivro: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  autorLivro: {
    fontSize: 14,
    color: '#a52a2a',
    marginTop: 4,
    marginBottom: 8,
  },
  botaoFavoritarPequeno: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a52a2a',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  textoFavoritarPequeno: {
    fontSize: 12,
    color: '#a52a2a',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  cardInfoInicial: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#a52a2a',
    marginTop: 20,
  },
  textoInfoInicial: {
    textAlign: 'center',
    color: '#5d4037',
    fontSize: 14,
    lineHeight: 20,
  },
});