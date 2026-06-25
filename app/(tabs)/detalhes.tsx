import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { arrayRemove, arrayUnion, doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase.js';

type StatusTipo = 'Quero Ler' | 'Lendo' | 'Lido' | null;

export default function TelaDetalhes() {
  const router = useRouter();
  
  const { id, titulo, autores, editora, dataPublicacao, paginas, idioma, genero, capaUrl } = useLocalSearchParams<{
    id: string;
    titulo: string;
    autores: string;
    editora: string;
    dataPublicacao: string;
    paginas: string;
    idioma: string;
    genero: string;
    capaUrl: string;
  }>();

  const [totalFavoritos, setTotalFavoritos] = useState<number>(0);
  const [jaFavoritou, setJaFavoritou] = useState<boolean>(false);
  const [carregandoFavorito, setCarregandoFavorito] = useState<boolean>(true);
  
  const [statusLeitura, setStatusLeitura] = useState<StatusTipo>(null);
  const [salvandoStatus, setSalvandoStatus] = useState<boolean>(false);

  const usuarioAtual = auth.currentUser;

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, 'livros', id);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const dados = docSnap.data();
        setTotalFavoritos(dados.totalFavoritos || 0);
        
        if (usuarioAtual && dados.usuariosQueFavoritaram) {
          setJaFavoritou(dados.usuariosQueFavoritaram.includes(usuarioAtual.uid));
        }
      } else {
        setTotalFavoritos(0);
        setJaFavoritou(false);
      }
      setCarregandoFavorito(false);
    }, (error) => {
      console.log("Erro ao escutar favoritos:", error);
      setCarregandoFavorito(false);
    });

    // Busca o status de leitura salvo na subcolecao biblioteca do usuario atual
    if (usuarioAtual) {
      const bibRef = doc(db, 'usuarios', usuarioAtual.uid, 'biblioteca', id);
      getDoc(bibRef).then((docSnap) => {
        if (docSnap.exists()) {
          setStatusLeitura(docSnap.data().status || null);
        }
      }).catch(err => console.log("Erro ao buscar status do livro:", err));
    }

    return () => unsubscribe();
  }, [id, usuarioAtual]);

  const irParaComentarios = () => {
    if (!id) {
      Alert.alert("Erro", "ID do livro não encontrado para abrir os comentários.");
      return;
    }
    router.push({
      pathname: '/comentariosLivro', 
      params: { id: String(id), titulo: String(titulo || 'Livro') },
    });
  };

  // Atualiza o status de leitura do livro garantindo a correspondencia com a tela da biblioteca
  const atualizarStatusLeitura = async (novoStatus: StatusTipo) => {
    if (!usuarioAtual) {
      Alert.alert('Erro', 'Você precisa estar logado para atualizar o status.');
      return;
    }

    setSalvandoStatus(true);
    const libroGeralRef = doc(db, 'livros', id);
    const livroUsuarioRef = doc(db, 'usuarios', usuarioAtual.uid, 'biblioteca', id);

    try {
      if (novoStatus === null) {
        // Se removeu o status, limpa a estante do usuario
        await setDoc(livroUsuarioRef, {}, { merge: false });
        
        // Remove tambem o vinculo do usuario com o documento global do livro
        await updateDoc(libroGeralRef, {
          totalFavoritos: increment(-1),
          usuariosQueFavoritaram: arrayRemove(usuarioAtual.uid)
        });
        
        setStatusLeitura(null);
        setJaFavoritou(false);
      } else {
        // 1. Salva na subcolecao biblioteca do usuario logado (para as abas Lendo/Lido)
        await setDoc(livroUsuarioRef, {
          titulo: titulo || 'Sem Título',
          autor: autores || 'Autor desconhecido',
          capaUrl: capaUrl || '',
          genero: genero || 'Não informado',
          status: novoStatus,
          atualizadoEm: new Date()
        }, { merge: true });

        // 2. Garante a criacao ou atualizacao do documento na colecao global 'livros' 
        const docSnapGeral = await getDoc(libroGeralRef);
        
        if (!docSnapGeral.exists()) {
          // Se o livro nao existia no banco global, cria injetando todas as propriedades
          await setDoc(libroGeralRef, {
            titulo: titulo || 'Sem Título',
            autores: autores || 'Autor desconhecido',
            capaUrl: capaUrl || '',
            editora: editora || 'Não informada',
            dataPublicacao: dataPublicacao || 'Não informada',
            paginas: paginas || 'Não informado',
            idioma: idioma || 'Não informado',
            genero: genero || 'Não informado',
            totalFavoritos: 1,
            usuariosQueFavoritaram: [usuarioAtual.uid]
          });
        } else if (!jaFavoritou) {
          // Se o livro ja existe mas o usuario nao estava no array, adiciona-o e incrementa o contador
          await updateDoc(libroGeralRef, {
            totalFavoritos: increment(1),
            usuariosQueFavoritaram: arrayUnion(usuarioAtual.uid)
          });
        }

        setStatusLeitura(novoStatus);
        setJaFavoritou(true);
      }
    } catch (error) {
      console.error("Erro ao salvar status de leitura:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status de leitura.");
    } finally {
      setSalvandoStatus(false);
    }
  };
  const alternarFavoritoAntigo = async () => {
    if (statusLeitura) {
      await atualizarStatusLeitura(null);
    } else {
      await atualizarStatusLeitura('Quero Ler');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#3e2723" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {capaUrl && (
          <Image source={{ uri: capaUrl }} style={styles.capaGrande} resizeMode="contain" />
        )}

        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.autorSubtitulo}>por {autores}</Text>

        <View style={styles.containerContadorFavoritos}>
          <Ionicons name="heart" size={18} color="#a52a2a" />
          {carregandoFavorito ? (
            <ActivityIndicator size="small" color="#a52a2a" style={{ marginLeft: 5 }} />
          ) : (
            <Text style={styles.textoContadorFavoritos}>
              {totalFavoritos === 1 ? "1 pessoa favoritou" : `${totalFavoritos} pessoas favoritaram`}
            </Text>
          )}
        </View>

        {/* Componente seletor para alteracao de status */}
        <View style={styles.containerStatusLivro}>
          <Text style={styles.tituloStatus}>Status de Leitura:</Text>
          <View style={styles.grupoBotoesStatus}>
            {(['Lendo', 'Quero Ler', 'Lido'] as const).map((status) => {
              const ativo = statusLeitura === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.botaoStatus, ativo && styles.botaoStatusAtivo]}
                  disabled={salvandoStatus}
                  onPress={() => atualizarStatusLeitura(status)}
                >
                  <Text style={[styles.textoBotaoStatus, ativo && styles.textoBotaoStatusAtivo]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divisor} />

        <View style={styles.containerInfo}>
          <View style={styles.linhaInfo}>
            <Text style={styles.label}>Editora:</Text>
            <Text style={styles.valor}>{editora}</Text>
          </View>
          <View style={styles.linhaInfo}>
            <Text style={styles.label}>Data de Publicação:</Text>
            <Text style={styles.valor}>{dataPublicacao}</Text>
          </View>
          <View style={styles.linhaInfo}>
            <Text style={styles.label}>Número de Páginas:</Text>
            <Text style={styles.valor}>{paginas}</Text>
          </View>
          <View style={styles.linhaInfo}>
            <Text style={styles.label}>Idioma:</Text>
            <Text style={styles.valor}>{idioma}</Text>
          </View>
          <View style={styles.linhaInfo}>
            <Text style={styles.label}>Assunto / Gênero:</Text>
            <Text style={styles.valor}>{genero}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.containerBotoes}>
        <TouchableOpacity 
          style={[styles.botao, styles.botaoFavoritar, jaFavoritou && styles.botaoJaFavoritado]} 
          onPress={alternarFavoritoAntigo}
          disabled={carregandoFavorito || salvandoStatus}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={jaFavoritou ? "heart" : "heart-outline"} 
            size={20} 
            color="#fff" 
            style={{ marginRight: 8 }} 
          />
          <Text style={styles.textoBotao}>
            {jaFavoritou ? `Salvo (${statusLeitura || 'Favorito'})` : "Salvar na Estante"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botao, styles.botaoComentar]} 
          onPress={irParaComentarios}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.textoBotao}>Comentar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3dd',
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  botaoVoltar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  divisor: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(165,42,42,0.1)',
    marginVertical: 15,
  },
  capaGrande: {
    width: 160,
    height: 240,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3e2723',
    textAlign: 'center',
    marginBottom: 6,
  },
  autorSubtitulo: {
    fontSize: 16,
    color: '#a52a2a',
    textAlign: 'center',
    marginBottom: 10,
  },
  containerContadorFavoritos: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(165,42,42,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  textoContadorFavoritos: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a52a2a',
    marginLeft: 6,
  },
  containerStatusLivro: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.1)',
    marginTop: 5,
  },
  tituloStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3e2723',
    marginBottom: 10,
  },
  grupoBotoesStatus: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoStatus: {
    flex: 1,
    height: 36,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  botaoStatusAtivo: {
    backgroundColor: '#a52a2a',
    borderColor: '#a52a2a',
  },
  textoBotaoStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  textoBotaoStatusAtivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  containerInfo: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.1)',
    gap: 12,
  },
  linhaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3e2723',
    flex: 1,
  },
  valor: {
    fontSize: 14,
    color: '#5d4037',
    flex: 1.5,
    textAlign: 'right',
  },
  containerBotoes: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(165,42,42,0.1)',
    gap: 12,
    zIndex: 99,
    elevation: 10,
  },
  botao: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoFavoritar: {
    backgroundColor: '#a52a2a',
  },
  botaoJaFavoritado: {
    backgroundColor: '#27ae60',
  },
  botaoComentar: {
    backgroundColor: '#3e2723',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});