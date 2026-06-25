import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase.js'; // Sobe uma pasta para achar as configurações do Firebase

// Essa interface serve para o TypeScript saber exatamente a estrutura do nosso comentário
interface MeuComentario {
  id: string;
  idLivro: string;
  texto: string;
  dataEnvio: any;
  tituloLivro?: string; 
}

export default function MeusComentariosScreen() {
  const router = useRouter();
  
  // Estados para controlar os dados da lista e os loadings da tela
  const [comentarios, setComentarios] = useState<MeuComentario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  // Pega as informações do usuário que está logado no aparelho agora
  const usuarioAtual = auth.currentUser;

  /* 
    Opção 2: Busca os comentários no banco e, usando o idLivro, 
    faz requisições paralelas à API do Google Books para descobrir os títulos em tempo real.
  */
  const buscarMeusComentarios = React.useCallback(async () => {
    if (!usuarioAtual) {
      setCarregando(false);
      return;
    }

    try {
      const comentariosRef = collection(db, 'comentarios');
      const q = query(
        comentariosRef,
        where('usuarioId', '==', usuarioAtual.uid)
      );

      const querySnapshot = await getDocs(q);
      const listaTemporaria: MeuComentario[] = [];

      querySnapshot.forEach((docSnap) => {
        const dados = docSnap.data();
        listaTemporaria.push({
          id: docSnap.id,
          idLivro: dados.idLivro || '',
          texto: dados.texto || '',
          dataEnvio: dados.dataEnvio,
          tituloLivro: dados.tituloLivro || '', // Começa vazio para tentarmos buscar na API
        });
      });

      // API KEY usada no seu feed da biblioteca
      const MINHA_API_KEY = "AIzaSyBvAOP06d-0yrvPMfubfG7eAQxh94Hyvdo";

      /* 
        Mágica da Opção 2: Mapeamos a lista temporária e, para cada comentário que tiver um idLivro,
        disparamos uma busca assíncrona na API do Google Books para pegar o título atualizado.
      */
      const listaComTitulosAtualizados = await Promise.all(
        listaTemporaria.map(async (comentario) => {
          // Se já veio o título do banco por algum motivo, não gasta requisição
          if (comentario.tituloLivro) return comentario;

          if (comentario.idLivro) {
            try {
              const url = `https://www.googleapis.com/books/v1/volumes/${comentario.idLivro}?key=${MINHA_API_KEY}`;
              const resposta = await fetch(url);
              
              if (resposta.ok) {
                const dadosLivro = await resposta.json();
                return {
                  ...comentario,
                  tituloLivro: dadosLivro.volumeInfo?.title || 'Livro sem Título',
                };
              }
            } catch (erroApi) {
              console.log(`Não foi possível resgatar o título para o livro ID: ${comentario.idLivro}`, erroApi);
            }
          }

          // Se der erro na API ou não houver idLivro, exibe o fallback
          return {
            ...comentario,
            tituloLivro: 'Livro Desconhecido',
          };
        })
      );

      // Atualiza o estado com a lista cheia e com os nomes dos livros resolvidos!
      setComentarios(listaComTitulosAtualizados);
    } catch (error) {
      console.error("Erro ao buscar meus comentários:", error);
      Alert.alert("Erro", "Não foi possível carregar o seu histórico de comentários.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [usuarioAtual]);

  /*
    Esse useEffect roda assim que a tela abre. Como a nossa função ali de cima
    está segura com useCallback, podemos colocar ela na lista de dependências
    sem medo de gerar um loop infinito.
  */
  useEffect(() => {
    buscarMeusComentarios();
  }, [buscarMeusComentarios]);

  // Função disparada quando o usuário puxa a tela para baixo para atualizar
  const lidarComAtualizacao = () => {
    setAtualizando(true);
    buscarMeusComentarios();
  };

  // Aqui desenhamos o visual de cada cardzinho de comentário da lista
  const renderItem = ({ item }: { item: MeuComentario }) => (
    <View style={styles.cardComentario}>
      {/* Um pequeno círculo com ícone de livro marrom combinando com a identidade do app */}
      <View style={styles.containerIconeLivro}>
        <Ionicons name="book" size={20} color="#a52a2a" />
      </View>
      <View style={styles.conteudoComentario}>
        <Text style={styles.labelLivroAvaliado}>
          Livro avaliado: <Text style={styles.tituloLivro}>{item.tituloLivro}</Text>
        </Text>
        <Text style={styles.textoComentario}>{item.texto}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho da página com botão de voltar integrado ao router */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#3e2723" />
        </TouchableOpacity>
        <Text style={styles.tituloPagina}>Meus Comentários</Text>
        <Text style={styles.subtitulo}>Histórico de todas as suas avaliações</Text>
      </View>

      {/* Corpo principal da tela */}
      <View style={styles.areaLista}>
        {carregando ? (
          <ActivityIndicator size="large" color="#a52a2a" style={{ marginTop: 40 }} />
        ) : !usuarioAtual ? (
          <View style={styles.cardVazio}>
            <Ionicons name="lock-closed-outline" size={40} color="#bc9e82" />
            <Text style={styles.textoVazio}>Você precisa estar logado para ver seus comentários.</Text>
          </View>
        ) : (
          <FlatList
            data={comentarios}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listaScroll}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={lidarComAtualizacao}
                tintColor="#a52a2a"
                colors={["#a52a2a"]}
              />
            }
            ListEmptyComponent={
              <View style={styles.cardVazio}>
                <Ionicons name="chatbubble-ellipses-outline" size={40} color="#bc9e82" />
                <Text style={styles.textoVazio}>Você ainda não fez nenhum comentário ou avaliação.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

// Estilizações mantendo o tom pastel (creme e marrom) do restante do projeto
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3dd', 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 15,
  },
  botaoVoltar: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  tituloPagina: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  subtitulo: {
    fontSize: 15,
    color: '#a52a2a',
    marginTop: 4,
    fontWeight: '500',
  },
  areaLista: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listaScroll: {
    paddingBottom: 20,
  },
  cardComentario: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.08)',
    alignItems: 'flex-start',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  containerIconeLivro: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(165,42,42,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conteudoComentario: {
    flex: 1,
    marginLeft: 12,
  },
  labelLivroAvaliado: {
    fontSize: 14,
    color: '#795548', 
    marginBottom: 4,
  },
  tituloLivro: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3e2723', 
  },
  textoComentario: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 18,
    marginTop: 2,
  },
  cardVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 30,
  },
  textoVazio: {
    textAlign: 'center',
    color: '#795548',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
});