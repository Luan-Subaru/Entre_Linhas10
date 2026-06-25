// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList,
  Image, Modal, SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../config/firebase';

interface Livro {
  id: string;
  titulo: string;
  autores: string; 
  capaUrl: string; 
  genero: string;
  descricao?: string;
  conteudo?: string;
  tipo?: 'google' | 'autoral';
}

export default function BibliotecaScreen() {
  const router = useRouter();
  const [livrosFeed, setLivrosFeed] = useState<Livro[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [atualizando, setAtualizando] = useState<boolean>(false);
  const [modalPublicar, setModalPublicar] = useState(false);
  const [lendoLivro, setLendoLivro] = useState<Livro | null>(null);
  
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');
  const [novoGenero, setNovoGenero] = useState('');
  const [enviando, setEnviando] = useState(false);

  const carregarTudo = async () => {
    try {
      setCarregando(true);
      const q = query(collection(db, 'livros'), orderBy('dataPublicacao', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const livrosAutorais = [];
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
            tipo: 'autoral'
          });
        });
        setLivrosFeed(livrosAutorais);
        setCarregando(false);
        setAtualizando(false);
      }, (error) => {
        console.error("Erro Firebase:", error);
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao banco de dados.");
        setCarregando(false);
      });
      return () => unsubscribe();
    } catch (error) {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTudo();
  }, []);

  const handlePublicar = async () => {
    console.log("Botão Publicar clicado");
    
    if (!novoTitulo || !novaDescricao || !novoConteudo) {
      Alert.alert("Campos Vazios", "Por favor, preencha o título, sinopse e conteúdo.");
      return;
    }

    setEnviando(true);
    try {
      console.log("Tentando salvar no Firebase...");
      
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

      console.log("Publicação realizada com sucesso!");
      Alert.alert("Sucesso!", "Seu livro foi publicado!");
      setModalPublicar(false);
      setNovoTitulo('');
      setNovaDescricao('');
      setNovoConteudo('');
      setNovoGenero('');
    } catch (error) {
      console.error("Erro ao publicar:", error);
      Alert.alert("Erro ao Publicar", "O Firebase recusou a publicação. Verifique as regras de segurança ou sua conexão.");
    } finally {
      setEnviando(false);
    }
  };

  const renderItem = ({ item }: { item: Livro }) => (
    <TouchableOpacity style={styles.cardLivro} onPress={() => setLendoLivro(item)}>
      <Image source={{ uri: item.capaUrl }} style={styles.capaLivro} />
      <View style={styles.infoLivro}>
        <Text style={styles.tituloLivro} numberOfLines={2}>{item.titulo}</Text>
        <Text style={styles.autorLivro}>por {item.autores}</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{item.genero}</Text></View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloPagina}>Biblioteca</Text>
        <TouchableOpacity onPress={() => setModalPublicar(true)}>
          <Ionicons name="add-circle" size={45} color="#a52a2a" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.centralizado}><ActivityIndicator size="large" color="#a52a2a" /></View>
      ) : (
        <FlatList
          data={livrosFeed}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum livro publicado ainda.</Text>}
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
  container: { flex: 1, backgroundColor: '#fff3dd', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  tituloPagina: { fontSize: 28, fontWeight: 'bold', color: '#3e2723' },
  lista: { padding: 20 },
  cardLivro: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  capaLivro: { width: 60, height: 90, borderRadius: 5 },
  infoLivro: { marginLeft: 15, flex: 1 },
  tituloLivro: { fontSize: 18, fontWeight: 'bold', color: '#3e2723' },
  autorLivro: { fontSize: 14, color: '#a52a2a' },
  badge: { backgroundColor: '#a52a2a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 5, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  modal: { flex: 1, backgroundColor: '#fff3dd' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#3e2723' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#a52a2a', padding: 18, borderRadius: 10, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  vazio: { textAlign: 'center', marginTop: 50, color: '#a52a2a' },
  leitura: { flex: 1, backgroundColor: '#fffcf5' },
  textoLeitura: { fontSize: 18, lineHeight: 28, color: '#3e2723' }
});
