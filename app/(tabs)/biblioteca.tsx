// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Adicionado useLocalSearchParams aqui
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase.js';

interface Livro {
  id: string;
  titulo: string;
  autores: string;
  capaUrl: string;
  genero: string;
  editora?: string;
  dataPublicacao?: string;
  paginas?: string;
  idioma?: string;
  status?: 'Quero Ler' | 'Lendo' | 'Lido';
}

export default function BibliotecaScreen() {
  const router = useRouter();
  
  // Captura o gênero vindo por parâmetro da Tela de Perfil
  const { filtroGenero } = useLocalSearchParams<{ filtroGenero?: string }>();

  // Estados para controle de abas e carregamento
  const [statusFiltro, setStatusFiltro] = useState<'Quero Ler' | 'Lendo' | 'Lido'>('Lendo');
  const [carregandoGeral, setCarregandoGeral] = useState<boolean>(true);
  const [atualizandoFeed, setAtualizandoFeed] = useState<boolean>(false);

  // Estados para dados do Firestore (Lendo e Lido)
  const [livrosSalvos, setLivrosSalvos] = useState<Livro[]>([]);

  // Estados para dados da API do Google Books (Quero Ler / Recomendacoes)
  const [livrosFeed, setLivrosFeed] = useState<Livro[]>([]);
  
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');
  const [novoGenero, setNovoGenero] = useState('');
  const [enviando, setEnviando] = useState(false);

  // 1. Monitoramento em tempo real dos livros do Firestore (Abas Lendo e Lido)
  useEffect(() => {
    if (!usuarioAtual) {
      setCarregandoGeral(false);
      return;
    }

    const bibliotecaRef = collection(db, 'usuarios', usuarioAtual.uid, 'biblioteca');
    
    const desinscrever = onSnapshot(bibliotecaRef, (snapshot) => {
      const lista: Livro[] = [];
      snapshot.forEach((docSnap) => {
        const dados = docSnap.data();
        if (dados.titulo || dados.autor) {
          lista.push({
            id: docSnap.id,
            titulo: dados.titulo || 'Título Desconhecido',
            autores: dados.autor || 'Autor Desconhecido',
            capaUrl: dados.capaUrl || 'https://via.placeholder.com/150x220.png?text=Sem+Capa',
            genero: dados.genero || 'Não informado',
            status: dados.status || 'Lendo',
          });
        }
      });
      setLivrosSalvos(lista);
      if (statusFiltro !== 'Quero Ler') {
        setCarregandoGeral(false);
      }
    }, (error) => {
      console.error("Erro ao carregando Firestore:", error);
    });

    return desinscrever;
  }, [usuarioAtual, statusFiltro]);

  // 2. Carregamento do feed do Google Books (Aba Quero Ler) alterado para aceitar gênero dinâmico
  const carregarFeedDoGoogleBooks = async (generoEspecifico?: string) => {
    try {
      let generosDeBusca: string[] = [];

      // Se veio um gênero do perfil, usamos apenas ele. Caso contrário, puxa a lista tradicional do banco
      if (generoEspecifico) {
        generosDeBusca = [generoEspecifico];
      } else if (usuarioAtual) {
        const userDocRef = doc(db, 'usuarios', usuarioAtual.uid);
        const userSnap = await getDoc(userDocRef);
        
        if (userSnap.exists() && userSnap.data().generosFavoritos) {
          generosDeBusca = userSnap.data().generosFavoritos;
        }
      }

      if (!generosDeBusca || generosDeBusca.length === 0) {
        generosDeBusca = ['Literatura', 'Ficção', 'Romance', 'História'];
      }

      const MINHA_API_KEY = "AIzaSyBvAOP06d-0yrvPMfubfG7eAQxh94Hyvdo";
      let todosOsLivrosPuxados: Livro[] = [];
      const idsVistos = new Set<string>();

      const promessasDeBusca = generosDeBusca.map(async (genero) => {
        try {
          const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`subject:"${genero}"`)}&maxResults=20&key=${MINHA_API_KEY}`;
          const resposta = await fetch(url);
          const dados = await resposta.json();
          return dados.items || [];
        } catch (err) {
          console.log(`Erro ao buscar gênero ${genero}:`, err);
          return [];
        }
      });

      const resultadosPorGenero = await Promise.all(promessasDeBusca);

      resultadosPorGenero.forEach((listaDeItens) => {
        listaDeItens.forEach((item: any) => {
          if (!idsVistos.has(item.id)) {
            idsVistos.add(item.id);

            const info = item.volumeInfo;
            let capa = info.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
            if (capa.startsWith('http://')) {
              capa = capa.replace('http://', 'https://');
            }

            todosOsLivrosPuxados.push({
              id: item.id,
              titulo: info.title || 'Sem Título',
              autores: info.authors ? info.authors.join(', ') : 'Autor desconhecido',
              capaUrl: capa,
              genero: info.categories ? info.categories.join(', ') : 'Não informado',
              editora: info.publisher || 'Não informada',
              dataPublicacao: info.publishedDate || 'Não informada',
              paginas: info.pageCount ? info.pageCount.toString() : 'Não informado',
              idioma: info.language ? info.language.toUpperCase() : 'Não informado',
              status: 'Quero Ler'
            });
          }
        });
        setLivrosFeed(livrosAutorais);
        setCarregando(false);
        setAtualizando(false);
      }, (error) => {
        console.error("Erro Firebase:", error);
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao banco de dados.");
        setCarregando(false);
      });

      if (todosOsLivrosPuxados.length === 0) {
        try {
          const urlGeral = `https://www.googleapis.com/books/v1/volumes?q=Livros&maxResults=30&key=${MINHA_API_KEY}`;
          const respostaGeral = await fetch(urlGeral);
          const dadosGerais = await respostaGeral.json();
          const itensGerais = dadosGerais.items || [];

          itensGerais.forEach((item: any) => {
            const info = item.volumeInfo;
            let capa = info.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
            if (capa.startsWith('http://')) capa = capa.replace('http://', 'https://');

            todosOsLivrosPuxados.push({
              id: item.id,
              titulo: info.title || 'Sem Título',
              autores: info.authors ? info.authors.join(', ') : 'Autor desconhecido',
              capaUrl: capa,
              genero: info.categories ? info.categories.join(', ') : 'Geral',
              editora: info.publisher || 'Não informada',
              dataPublicacao: info.publishedDate || 'Não informada',
              paginas: info.pageCount ? info.pageCount.toString() : 'Não informado',
              idioma: info.language ? info.language.toUpperCase() : 'Não informado',
              status: 'Quero Ler'
            });
          });
        } catch (erroGeral) {
          console.log("Erro ao buscar fallback geral:", erroGeral);
        }
      }

      // Se for um filtro vindo do perfil, não embaralhamos para manter a precisão da categoria
      const listaFinal = generoEspecifico ? todosOsLivrosPuxados : todosOsLivrosPuxados.sort(() => Math.random() - 0.5);
      setLivrosFeed(listaFinal.slice(0, 30));

    } catch (error) {
      console.error("Erro geral ao montar feed:", error);
    } finally {
      setCarregandoGeral(false);
      setAtualizandoFeed(false);
    }
  };

  // Modificado: Ouve as mudanças do parâmetro "filtroGenero" enviado pela tela de Perfil
  useEffect(() => {
    if (filtroGenero) {
      setStatusFiltro('Quero Ler'); // Muda para a aba correta
      setCarregandoGeral(true);
      carregarFeedDoGoogleBooks(filtroGenero); // Executa a busca focada
    } else {
      carregarFeedDoGoogleBooks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioAtual, filtroGenero]);

  const lidarComAtualizacaoFeed = () => {
    setAtualizandoFeed(true);
    carregarFeedDoGoogleBooks(filtroGenero);
  };

  const abrirDetalhesDoLivro = (livro: Livro) => {
    router.push({
      pathname: '/detalhes', 
      params: { 
        id: String(livro.id),
        titulo: String(livro.titulo),
        autores: String(livro.autores),
        capaUrl: String(livro.capaUrl),
        genero: String(livro.genero),
        editora: String(livro.editora || 'Não informada'),
        dataPublicacao: String(livro.dataPublicacao || 'Não informada'),
        paginas: String(livro.paginas || 'Não informado'),
        idioma: String(livro.idioma || 'Não informado')
      }
    });
  };

  const dadosLista = statusFiltro === 'Quero Ler' 
    ? livrosFeed 
    : livrosSalvos.filter(livro => livro.status === statusFiltro);

  const renderItem = ({ item }: { item: Livro }) => (
    <TouchableOpacity 
      style={styles.cardLivro} 
      onPress={() => abrirDetalhesDoLivro(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.capaUrl }} style={styles.capaLivro} />
      
      <View style={styles.infoLivro}>
        <View>
          <Text style={styles.tituloLivro} numberOfLines={2}>{item.titulo}</Text>
          <Text style={styles.autorLivro} numberOfLines={1}>por {item.autores}</Text>
          {statusFiltro === 'Quero Ler' && (
            <Text style={styles.tagGeneroMini} numberOfLines={1}>{item.genero}</Text>
          )}
        </View>
        
        <View style={styles.containerVerMais}>
          <Text style={styles.textoVerMais}>Ver detalhes</Text>
          <Ionicons name="chevron-forward" size={14} color="#a52a2a" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloPagina}>Minha Estante</Text>
        <Text style={styles.subtitulo}>
          {statusFiltro === 'Quero Ler' && filtroGenero 
            ? `Filtrando por: ${filtroGenero}` 
            : statusFiltro === 'Quero Ler' 
              ? "Recomendações baseadas nos seus gêneros" 
              : "Organize suas leituras atuais e finalizadas"}
        </Text>
      </View>

      {/* Menu Seletor de Abas */}
      <View style={styles.containerAbas}>
        {(['Lendo', 'Quero Ler', 'Lido'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.aba, statusFiltro === status && styles.abaAtiva]}
            onPress={() => setStatusFiltro(status)}
          >
            <Text style={[styles.textoAba, statusFiltro === status && styles.textoAbaAtiva]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {carregandoGeral ? (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color="#a52a2a" />
        </View>
      ) : dadosLista.length === 0 ? (
        <View style={styles.centralizado}>
          <Ionicons name="book-outline" size={48} color="#bc9e82" />
          <Text style={styles.textoVazio}>Nenhum livro encontrado em &quot;{statusFiltro}&quot;.</Text>
        </View>
      ) : (
        <FlatList
          data={dadosLista}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            statusFiltro === 'Quero Ler' ? (
              <RefreshControl
                refreshing={atualizandoFeed}
                onRefresh={lidarComAtualizacaoFeed}
                tintColor="#a52a2a"
                colors={["#a52a2a"]}
              />
            ) : undefined
          }
        />
      )}

      <Modal visible={modalPublicar} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalPublicar(false)}><Ionicons name="close" size={30} color="#a52a2a" /></TouchableOpacity>
            <Text style={styles.modalTitulo}>Publicar Livro</Text>
            <View style={{ width: 30 }} />
          </View>
          <ScrollView style={{ padding: 20 }}>
            <TextInput style={styles.input} placeholder="Título" value={novoTitulo} onChangeText={setNovoTitulo} />
            <TextInput style={styles.input} placeholder="Gênero" value={novoGenero} onChangeText={setNovoGenero} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Sinopse" multiline value={novaDescricao} onChangeText={setNovaDescricao} />
            <TextInput style={[styles.input, { height: 150, textAlignVertical: 'top' }]} placeholder="Conteúdo do Livro" multiline value={novoConteudo} onChangeText={setNovoConteudo} />
            
            <TouchableOpacity 
              style={[styles.botao, enviando && { opacity: 0.5 }]} 
              onPress={() => {
                console.log("Clique detectado no botão Publicar");
                handlePublicar();
              }} 
              disabled={enviando}
            >
              {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Publicar Agora</Text>}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={!!lendoLivro} animationType="slide">
        <SafeAreaView style={styles.leitura}>
          <TouchableOpacity onPress={() => setLendoLivro(null)} style={{ padding: 20 }}><Ionicons name="arrow-back" size={30} color="#3e2723" /></TouchableOpacity>
          <ScrollView style={{ padding: 20 }}><Text style={styles.textoLeitura}>{lendoLivro?.conteudo}</Text></ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3dd',
    paddingTop: 60,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tituloPagina: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  subtitulo: {
    fontSize: 14,
    color: '#a52a2a',
    marginTop: 5,
  },
  containerAbas: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  aba: {
    flex: 1,
    height: 38,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.1)',
  },
  abaAtiva: {
    backgroundColor: '#a52a2a',
    borderColor: '#a52a2a',
  },
  textoAba: {
    fontSize: 13,
    fontWeight: '600',
    color: '#795548',
  },
  textoAbaAtiva: {
    color: '#fff',
  },
  cardLivro: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    justifyContent: 'space-between',
  },
  tituloLivro: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  autorLivro: {
    fontSize: 14,
    color: '#795548',
    marginTop: 2,
  },
  tagGeneroMini: {
    fontSize: 11,
    color: '#a52a2a',
    backgroundColor: 'rgba(165,42,42,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
    fontWeight: 'bold',
  },
  containerVerMais: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  textoVerMais: {
    color: '#a52a2a',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  textoVazio: {
    marginTop: 10,
    color: '#795548',
    textAlign: 'center',
    fontSize: 16,
  }
});
