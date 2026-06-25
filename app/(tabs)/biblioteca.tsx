import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, addDoc, query, onSnapshot, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  Image, 
  RefreshControl, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  TextInput, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { auth, db } from '../../config/firebase.js';

interface Livro {
  id: string;
  titulo: string;
  autores: string; 
  capaUrl: string; 
  genero: string;
  descricao?: string;
  conteudo?: string;
  editora?: string;
  dataPublicacao?: any;
  paginas?: string;
  idioma?: string;
  tipo?: 'google' | 'autoral';
}

export default function BibliotecaScreen() {
  const router = useRouter();
  const [livrosFeed, setLivrosFeed] = useState<Livro[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [atualizando, setAtualizando] = useState<boolean>(false);
  const [modalPublicar, setModalPublicar] = useState(false);
  const [lendoLivro, setLendoLivro] = useState<Livro | null>(null);
  
  // Estados do Formulário de Publicação
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');
  const [novoGenero, setNovoGenero] = useState('');
  const [enviando, setEnviando] = useState(false);

  const usuarioAtual = auth.currentUser;

  const carregarTudo = async () => {
    try {
      setCarregando(true);
      
      // 1. Puxar Livros do Google Books (como estava antes)
      const MINHA_API_KEY = "AIzaSyBvAOP06d-0yrvPMfubfG7eAQxh94Hyvdo";
      const urlGeral = `https://www.googleapis.com/books/v1/volumes?q=Livros&maxResults=20&key=${MINHA_API_KEY}`;
      const respostaGeral = await fetch(urlGeral);
      const dadosGerais = await respostaGeral.json();
      const itensGerais = dadosGerais.items || [];

      const livrosGoogle: Livro[] = itensGerais.map((item: any) => {
        const info = item.volumeInfo;
        let capa = info.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
        if (capa.startsWith('http://')) capa = capa.replace('http://', 'https://');
        return {
          id: item.id,
          titulo: info.title || 'Sem Título',
          autores: info.authors ? info.authors.join(', ') : 'Autor desconhecido',
          capaUrl: capa,
          genero: info.categories ? info.categories.join(', ') : 'Geral',
          descricao: info.description || 'Sem descrição disponível.',
          tipo: 'google'
        };
      });

      // 2. Puxar Livros Autorais do Firebase
      const q = query(collection(db, 'livros'), orderBy('dataPublicacao', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const livrosAutorais: Livro[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          livrosAutorais.push({
            id: doc.id,
            titulo: data.titulo,
            autores: data.autor,
            capaUrl: data.capa || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop',
            genero: data.genero || 'Autoral',
            descricao: data.descricao,
            conteudo: data.conteudo,
            tipo: 'autoral',
            dataPublicacao: data.dataPublicacao
          } as Livro);
        });

        // Junta os dois e embaralha
        const todos = [...livrosAutorais, ...livrosGoogle].sort(() => Math.random() - 0.5);
        setLivrosFeed(todos);
        setCarregando(false);
        setAtualizando(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
      setCarregando(false);
      setAtualizando(false);
    }
  };

  useEffect(() => {
    carregarTudo();
  }, []);

  const handlePublicar = async () => {
    if (!novoTitulo || !novaDescricao || !novoConteudo) {
      Alert.alert("Erro", "Preencha título, descrição e conteúdo para publicar.");
      return;
    }

    setEnviando(true);
    try {
      const autorFinal = auth.currentUser?.email?.split('@')[0] || "Escritor Anônimo";
      await addDoc(collection(db, 'livros'), {
        titulo: novoTitulo,
        autor: autorFinal,
        descricao: novaDescricao,
        conteudo: novoConteudo,
        genero: novoGenero || 'Autoral',
        capa: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop',
        dataPublicacao: Timestamp.now(),
        userId: auth.currentUser?.uid || 'anonimo'
      });

      Alert.alert("Sucesso!", "Sua obra foi publicada na rede Entre Linhas!");
      setModalPublicar(false);
      setNovoTitulo('');
      setNovaDescricao('');
      setNovoConteudo('');
      setNovoGenero('');
    } catch (error) {
      console.error("Erro ao publicar:", error);
      Alert.alert("Erro", "Falha ao publicar. Verifique sua conexão.");
    } finally {
      setEnviando(false);
    }
  };

  const abrirLivro = (livro: Livro) => {
    if (livro.tipo === 'autoral') {
      setLendoLivro(livro);
    } else {
      router.push({
        pathname: '/detalhes', 
        params: { 
          id: livro.id,
          titulo: livro.titulo,
          autores: livro.autores,
          capaUrl: livro.capaUrl,
          genero: livro.genero
        }
      });
    }
  };

  const renderItem = ({ item }: { item: Livro }) => (
    <TouchableOpacity 
      style={styles.cardLivro} 
      onPress={() => abrirLivro(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.capaUrl }} style={styles.capaLivro} />
      <View style={styles.infoLivro}>
        <View>
          <Text style={styles.tituloLivro} numberOfLines={2}>{item.titulo}</Text>
          <Text style={styles.autorLivro} numberOfLines={1}>por {item.autores}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.tagGeneroMini}>{item.genero}</Text>
            {item.tipo === 'autoral' && (
              <Text style={[styles.tagGeneroMini, { backgroundColor: '#4caf50', marginLeft: 5 }]}>AUTORAL</Text>
            )}
          </View>
        </View>
        <View style={styles.containerVerMais}>
          <Text style={styles.textoVerMais}>{item.tipo === 'autoral' ? 'Ler agora' : 'Ver detalhes'}</Text>
          <Ionicons name="chevron-forward" size={14} color="#a52a2a" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.tituloPagina}>Biblioteca</Text>
          <Text style={styles.subtitulo}>Descubra e publique novas histórias</Text>
        </View>
        <TouchableOpacity onPress={() => setModalPublicar(true)}>
          <Ionicons name="add-circle" size={45} color="#a52a2a" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color="#a52a2a" />
        </View>
      ) : (
        <FlatList
          data={livrosFeed}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={carregarTudo} tintColor="#a52a2a" />
          }
        />
      )}

      {/* Modal Publicar */}
      <Modal visible={modalPublicar} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalPublicar(false)}>
                <Ionicons name="close" size={30} color="#a52a2a" />
              </TouchableOpacity>
              <Text style={styles.modalTitulo}>Publicar Obra</Text>
              <View style={{ width: 30 }} />
            </View>
            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Título</Text>
              <TextInput style={styles.input} value={novoTitulo} onChangeText={setNovoTitulo} placeholder="Nome do seu livro" />
              
              <Text style={styles.label}>Gênero</Text>
              <TextInput style={styles.input} value={novoGenero} onChangeText={setNovoGenero} placeholder="Ex: Romance, Ficção..." />

              <Text style={styles.label}>Sinopse</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline value={novaDescricao} onChangeText={setNovaDescricao} placeholder="Sobre o que é sua história?" />

              <Text style={styles.label}>Conteúdo</Text>
              <TextInput style={[styles.input, { height: 200, textAlignVertical: 'top' }]} multiline value={novoConteudo} onChangeText={setNovoConteudo} placeholder="Escreva aqui seu livro..." />

              <TouchableOpacity style={styles.botaoEnviar} onPress={handlePublicar} disabled={enviando}>
                {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotaoEnviar}>Publicar Agora</Text>}
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Modal Leitura */}
      <Modal visible={!!lendoLivro} animationType="slide">
        <View style={styles.leituraContainer}>
          <View style={styles.leituraHeader}>
            <TouchableOpacity onPress={() => setLendoLivro(null)}>
              <Ionicons name="arrow-back" size={28} color="#3e2723" />
            </TouchableOpacity>
            <Text style={styles.leituraTitulo} numberOfLines={1}>{lendoLivro?.titulo}</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView contentContainerStyle={styles.leituraScroll}>
            <Text style={styles.textoConteudo}>{lendoLivro?.conteudo}</Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3dd', paddingTop: 60 },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  tituloPagina: { fontSize: 28, fontWeight: 'bold', color: '#3e2723' },
  subtitulo: { fontSize: 14, color: '#a52a2a' },
  lista: { paddingHorizontal: 20, paddingBottom: 20 },
  cardLivro: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 15, elevation: 3 },
  capaLivro: { width: 70, height: 105, borderRadius: 6, backgroundColor: '#eee' },
  infoLivro: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  tituloLivro: { fontSize: 16, fontWeight: 'bold', color: '#3e2723' },
  autorLivro: { fontSize: 14, color: '#795548' },
  badgeContainer: { flexDirection: 'row', marginTop: 5 },
  tagGeneroMini: { fontSize: 10, color: '#fff', backgroundColor: '#a52a2a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: 'bold' },
  containerVerMais: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' },
  textoVerMais: { color: '#a52a2a', fontSize: 13, fontWeight: '600', marginRight: 4 },
  
  modalContainer: { flex: 1, backgroundColor: '#fff3dd' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#3e2723' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#3e2723', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  botaoEnviar: { backgroundColor: '#a52a2a', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
  textoBotaoEnviar: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  leituraContainer: { flex: 1, backgroundColor: '#fffcf5' },
  leituraHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  leituraTitulo: { fontSize: 18, fontWeight: 'bold', color: '#3e2723', flex: 1, textAlign: 'center' },
  leituraScroll: { padding: 25 },
  textoConteudo: { fontSize: 18, lineHeight: 30, color: '#2b1d1a', textAlign: 'justify' },
});
