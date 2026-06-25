import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, doc, getDocs, onSnapshot, query, setDoc, where, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase.js';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  fotoUrl?: string;
}

export default function AmigosScreen() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const [meusAmigos, setMeusAmigos] = useState<Usuario[]>([]);
  const [usuariosEncontrados, setUsuariosEncontrados] = useState<Usuario[]>([]);
  const [carregandoAmigos, setCarregandoAmigos] = useState(true);
  const [carregandoBusca, setCarregandoBusca] = useState(false);

  const usuarioAtual = auth.currentUser;

  // Escuta a lista de amigos em tempo real
  useEffect(() => {
    if (!usuarioAtual) {
      setCarregandoAmigos(false);
      return;
    }

    const amigosRef = collection(db, 'usuarios', usuarioAtual.uid, 'amigos');
    
    const desinscrever = onSnapshot(amigosRef, (snapshot) => {
      const lista: Usuario[] = [];
      snapshot.forEach((docSnap) => {
        const dados = docSnap.data();
        lista.push({
          id: docSnap.id,
          nome: dados.nome || 'Amigo Sem Nome',
          email: dados.email || '',
          fotoUrl: dados.fotoUrl
        });
      });
      setMeusAmigos(lista);
      setCarregandoAmigos(false);
    }, (error) => {
      console.error("Erro ao escutar amigos:", error);
      setCarregandoAmigos(false);
    });

    return desinscrever;
  }, [usuarioAtual]);

  // Busca usuários por nome no banco de dados
  const buscarUsuarios = async () => {
    if (!pesquisa.trim()) {
      Alert.alert('Aviso', 'Digite um nome para pesquisar.');
      return;
    }

    setCarregandoBusca(true);
    try {
      const usuariosRef = collection(db, 'usuarios');
      const q = query(
        usuariosRef,
        where('nome', '>=', pesquisa),
        where('nome', '<=', pesquisa + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const lista: Usuario[] = [];

      querySnapshot.forEach((docSnap) => {
        const dados = docSnap.data();
        const jaEAmigo = meusAmigos.some(amigo => amigo.id === docSnap.id);
        
        if (docSnap.id !== usuarioAtual?.uid && !jaEAmigo) {
          lista.push({
            id: docSnap.id,
            nome: dados.nome || 'Usuário',
            email: dados.email || '',
            fotoUrl: dados.fotoUrl
          });
        }
      });

      setUsuariosEncontrados(lista);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setCarregandoBusca(false);
    }
  };

  // Salva o vínculo de amizade no Firestore
  const adicionarAmigo = async (amigo: Usuario) => {
    if (!usuarioAtual) return;

    try {
      const amigoRef = doc(db, 'usuarios', usuarioAtual.uid, 'amigos', amigo.id);
      await setDoc(amigoRef, {
        id: amigo.id,
        nome: amigo.nome,
        email: amigo.email,
        fotoUrl: amigo.fotoUrl || '',
        adicionadoEm: new Date(),
      });

      Alert.alert('Sucesso', `${amigo.nome} foi adicionado aos seus amigos!`);
      setUsuariosEncontrados(prev => prev.filter(u => u.id !== amigo.id));
      setPesquisa('');
    } catch (error) {
      console.error("Erro ao adicionar amigo:", error);
      Alert.alert('Erro', 'Não foi possível adicionar o amigo.');
    }
  };

  // Remove o vínculo de amizade no Firestore
  const removerAmigo = async (amigo: Usuario) => {
    if (!usuarioAtual) return;

    Alert.alert(
      'Remover Amigo',
      `Tem certeza que deseja remover ${amigo.nome} da sua lista de amigos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const amigoRef = doc(db, 'usuarios', usuarioAtual.uid, 'amigos', amigo.id);
              await deleteDoc(amigoRef);
              Alert.alert('Sucesso', `${amigo.nome} foi removido.`);
            } catch (error) {
              console.error("Erro ao remover amigo:", error);
              Alert.alert('Erro', 'Não foi possível remover o amigo.');
            }
          },
        },
      ]
    );
  };

  // Renderiza cada item da lista de amigos adicionados
  const renderAmigoItem = ({ item }: { item: Usuario }) => (
    <View style={styles.cardAmigo}>
      <TouchableOpacity 
        style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
        onPress={() => router.push(`/perfilAmigo?idAmigo=${item.id}` as any)}
      >
        <View style={styles.avatarAmigo}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.nomeAmigo}>{item.nome}</Text>
          <Text style={styles.subtituloAmigo}>Ver estante de livros →</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botaoLixeira} 
        onPress={() => removerAmigo(item)}
        activeOpacity={0.6}
      >
        <Ionicons name="trash-outline" size={20} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloPagina}>Minha Rede</Text>
        <Text style={styles.subtitulo}>Acompanhe e encontre parceiros de leitura</Text>
      </View>

      {/* Lista de amigos atuais */}
      <View style={{ paddingHorizontal: 20, maxHeight: 220 }}>
        <Text style={styles.tituloSecao}>Meus Amigos ({meusAmigos.length})</Text>
        {carregandoAmigos ? (
          <ActivityIndicator color="#a52a2a" style={{ marginTop: 15 }} />
        ) : meusAmigos.length === 0 ? (
          <Text style={styles.textoListaVazia}>Você ainda não adicionou nenhum amigo.</Text>
        ) : (
          <FlatList
            data={meusAmigos}
            renderItem={renderAmigoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Busca por novos usuários */}
      <View style={{ flex: 1, marginTop: 20, paddingHorizontal: 20 }}>
        <Text style={styles.tituloSecao}>Encontrar Leitores</Text>
        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do leitor..."
            placeholderTextColor="#bc9e82"
            value={pesquisa}
            onChangeText={setPesquisa}
          />
          <TouchableOpacity style={styles.botaoLupa} onPress={buscarUsuarios}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {carregandoBusca ? (
          <ActivityIndicator color="#a52a2a" />
        ) : (
          <FlatList
            data={usuariosEncontrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardBusca}>
                <View style={[styles.avatarAmigo, { backgroundColor: '#a52a2a' }]}>
                  <Ionicons name="person" size={16} color="#fff" />
                </View>
                <Text style={styles.nomeBusca}>{item.nome}</Text>
                <TouchableOpacity style={styles.botaoAdicionar} onPress={() => adicionarAmigo(item)}>
                  <Ionicons name="person-add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff3dd' 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    marginBottom: 20 
  },
  tituloPagina: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#3e2723' 
  },
  subtitulo: { 
    fontSize: 14, 
    color: '#a52a2a', 
    marginTop: 4, 
    fontWeight: '500' 
  },
  tituloSecao: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#3e2723', 
    marginBottom: 10 
  },
  cardAmigo: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 8, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(165,42,42,0.05)' 
  },
  avatarAmigo: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#bc9e82', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  nomeAmigo: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#3e2723' 
  },
  subtituloAmigo: { 
    fontSize: 12, 
    color: '#a52a2a', 
    marginTop: 2 
  },
  textoListaVazia: { 
    color: '#795548', 
    fontSize: 13, 
    fontStyle: 'italic', 
    marginTop: 5 
  },
  containerInput: { 
    flexDirection: 'row', 
    marginBottom: 15 
  },
  input: { 
    flex: 1, 
    height: 46, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    fontSize: 15, 
    color: '#3e2723', 
    borderWidth: 1, 
    borderColor: 'rgba(165,42,42,0.1)' 
  },
  botaoLupa: { 
    width: 46, 
    height: 46, 
    backgroundColor: '#a52a2a', 
    borderRadius: 10, 
    marginLeft: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardBusca: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 8, 
    alignItems: 'center' 
  },
  nomeBusca: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#3e2723' 
  },
  botaoAdicionar: { 
    width: 36, 
    height: 36, 
    borderRadius: 8, 
    backgroundColor: '#bc9e82', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  botaoLixeira: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});