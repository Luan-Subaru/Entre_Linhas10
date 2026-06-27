// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState, useLayoutEffect } from "react";
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
} from "react-native";
import { auth, db } from "../../config/firebase.js";

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
  status?: "Quero Ler" | "Lendo" | "Lido";
}

export default function BibliotecaScreen() {
  const router = useRouter();
  const { filtroGenero } = useLocalSearchParams<{ filtroGenero?: string }>();

  // ========== ESTADOS PARA ABAS ==========
  const [statusFiltro, setStatusFiltro] = useState<
    "Quero Ler" | "Lendo" | "Lido"
  >("Lendo");
  const [carregandoGeral, setCarregandoGeral] = useState<boolean>(true);
  const [atualizandoFeed, setAtualizandoFeed] = useState<boolean>(false);

  // ========== ESTADOS PARA DADOS ==========
  const [livrosSalvos, setLivrosSalvos] = useState<Livro[]>([]);
  const [livrosFeed, setLivrosFeed] = useState<Livro[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<any>(null);

  // ========== ESTADOS PARA MODAL DE ADICIONAR LIVRO ==========
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novoLivroTitulo, setNovoLivroTitulo] = useState("");
  const [novoLivroAutor, setNovoLivroAutor] = useState("");
  const [novoLivroGenero, setNovoLivroGenero] = useState("");
  const [novoLivroCapaUrl, setNovoLivroCapaUrl] = useState("");
  const [novoLivroStatus, setNovoLivroStatus] = useState<
    "Quero Ler" | "Lendo" | "Lido"
  >("Quero Ler");
  const [enviandoLivro, setEnviandoLivro] = useState(false);

  // ========== EFEITO: AUTENTICAÇÃO ==========
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUsuarioAtual(user);
    });
    return unsubscribe;
  }, []);

  // ========== EFEITO: BOTÃO "+" NO HEADER ==========
  useLayoutEffect(() => {
    router.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setModalVisivel(true)}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="add-circle" size={28} color="#a52a2a" />
        </TouchableOpacity>
      ),
    });
  }, [router]);

  // ========== EFEITO: CARREGAR LIVROS DO FIRESTORE ==========
  useEffect(() => {
    if (!usuarioAtual) {
      setCarregandoGeral(false);
      return;
    }

    const bibliotecaRef = collection(
      db,
      "usuarios",
      usuarioAtual.uid,
      "biblioteca",
    );
    const desinscrever = onSnapshot(
      bibliotecaRef,
      (snapshot) => {
        const lista: Livro[] = [];
        snapshot.forEach((docSnap) => {
          const dados = docSnap.data();
          if (dados.titulo || dados.autor) {
            lista.push({
              id: docSnap.id,
              titulo: dados.titulo || "Título Desconhecido",
              autores: dados.autor || "Autor Desconhecido",
              capaUrl:
                dados.capaUrl ||
                "https://via.placeholder.com/150x220.png?text=Sem+Capa",
              genero: dados.genero || "Não informado",
              status: dados.status || "Lendo",
            });
          }
        });
        setLivrosSalvos(lista);
        if (statusFiltro !== "Quero Ler") {
          setCarregandoGeral(false);
        }
      },
      (error) => {
        console.error("Erro ao carregar Firestore:", error);
        setCarregandoGeral(false);
      },
    );

    return desinscrever;
  }, [usuarioAtual, statusFiltro]);

  // ========== FUNÇÃO: ADICIONAR LIVRO ==========
  const adicionarLivro = async () => {
    if (!novoLivroTitulo.trim()) {
      Alert.alert("Erro", "Por favor, insira o título do livro");
      return;
    }

    try {
      setEnviandoLivro(true);

      if (!usuarioAtual) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      const bibliotecaRef = collection(
        db,
        "usuarios",
        usuarioAtual.uid,
        "biblioteca",
      );

      await addDoc(bibliotecaRef, {
        titulo: novoLivroTitulo,
        autor: novoLivroAutor || "Autor Desconhecido",
        genero: novoLivroGenero || "Não informado",
        capaUrl:
          novoLivroCapaUrl ||
          "https://via.placeholder.com/150x220.png?text=Sem+Capa",
        status: novoLivroStatus,
        dataCriacao: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Livro adicionado à sua biblioteca!");

      // Limpar campos
      setNovoLivroTitulo("");
      setNovoLivroAutor("");
      setNovoLivroGenero("");
      setNovoLivroCapaUrl("");
      setNovoLivroStatus("Quero Ler");
      setModalVisivel(false);
    } catch (erro) {
      console.error("Erro ao adicionar livro:", erro);
      Alert.alert("Erro", "Falha ao adicionar livro. Tente novamente.");
    } finally {
      setEnviandoLivro(false);
    }
  };

  // ========== FUNÇÃO: FILTRAR LIVROS ==========
  const livrosFiltrados = livrosSalvos.filter(
    (livro) => livro.status === statusFiltro,
  );

  // ========== RENDERIZAR CARD DO LIVRO ==========
  const renderLivro = ({ item }: { item: Livro }) => (
    <TouchableOpacity
      onPress={() => router.push(`/detalhes?id=${item.id}`)}
      style={styles.cardLivro}
    >
      <Image
        source={{ uri: item.capaUrl }}
        style={styles.capaLivro}
        onError={() => console.log("Erro ao carregar imagem:", item.capaUrl)}
      />
      <View style={styles.infoLivro}>
        <Text style={styles.tituloLivro} numberOfLines={2}>
          {item.titulo}
        </Text>
        <Text style={styles.autorLivro} numberOfLines={1}>
          {item.autores}
        </Text>
        <Text style={styles.tagGeneroMini}>{item.genero}</Text>
        <View style={styles.containerVerMais}>
          <Text style={styles.textoVerMais}>Ver mais</Text>
          <Ionicons name="chevron-forward" size={16} color="#a52a2a" />
        </View>
      </View>
    </TouchableOpacity>
  );

  // ========== RENDERIZAR LISTA VAZIA ==========
  const renderListaVazia = () => (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <Ionicons name="book-outline" size={64} color="#ccc" />
      <Text style={styles.textoVazio}>
        {statusFiltro === "Quero Ler"
          ? "Nenhum livro para ler"
          : statusFiltro === "Lendo"
            ? "Comece a ler um livro!"
            : "Nenhum livro finalizado"}
      </Text>
    </View>
  );

  // ========== RENDERIZAR PRINCIPAL ==========
  return (
    <View style={styles.container}>
      {/* ABAS */}
      <View style={styles.containerAbas}>
        {["Quero Ler", "Lendo", "Lido"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() =>
              setStatusFiltro(status as "Quero Ler" | "Lendo" | "Lido")
            }
            style={[styles.aba, statusFiltro === status && styles.abaAtiva]}
          >
            <Text
              style={[
                styles.textoAba,
                statusFiltro === status && styles.textoAbaAtiva,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA DE LIVROS */}
      {carregandoGeral ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#a52a2a" />
        </View>
      ) : (
        <FlatList
          data={livrosFiltrados}
          renderItem={renderLivro}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listaConteudo}
          ListEmptyComponent={renderListaVazia}
          refreshControl={
            <RefreshControl
              refreshing={atualizandoFeed}
              onRefresh={() => {
                setAtualizandoFeed(true);
                setTimeout(() => setAtualizandoFeed(false), 1000);
              }}
            />
          }
        />
      )}

      {/* MODAL PARA ADICIONAR LIVRO */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalBackground}>
          <ScrollView
            style={styles.modalConteudo}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalTitulo}>Adicionar Novo Livro</Text>

            {/* Campo: Título */}
            <TextInput
              placeholder="Título do Livro *"
              value={novoLivroTitulo}
              onChangeText={setNovoLivroTitulo}
              style={styles.input}
              placeholderTextColor="#999"
            />

            {/* Campo: Autor */}
            <TextInput
              placeholder="Autor"
              value={novoLivroAutor}
              onChangeText={setNovoLivroAutor}
              style={styles.input}
              placeholderTextColor="#999"
            />

            {/* Campo: Gênero */}
            <TextInput
              placeholder="Gênero"
              value={novoLivroGenero}
              onChangeText={setNovoLivroGenero}
              style={styles.input}
              placeholderTextColor="#999"
            />

            {/* Campo: URL da Capa */}
            <TextInput
              placeholder="URL da Capa (opcional)"
              value={novoLivroCapaUrl}
              onChangeText={setNovoLivroCapaUrl}
              style={styles.input}
              placeholderTextColor="#999"
            />

            {/* Seletor de Status */}
            <Text style={styles.labelStatus}>Status:</Text>
            <View style={styles.statusContainer}>
              {(["Quero Ler", "Lendo", "Lido"] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setNovoLivroStatus(status)}
                  style={[
                    styles.statusBotao,
                    novoLivroStatus === status && styles.statusBotaoAtivo,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTexto,
                      novoLivroStatus === status && styles.statusTextoAtivo,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão: Adicionar */}
            <TouchableOpacity
              onPress={adicionarLivro}
              disabled={enviandoLivro}
              style={[
                styles.botaoAdicionar,
                enviandoLivro && styles.botaoDesabilitado,
              ]}
            >
              {enviandoLivro ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBotaoAdicionar}>Adicionar Livro</Text>
              )}
            </TouchableOpacity>

            {/* Botão: Cancelar */}
            <TouchableOpacity
              onPress={() => setModalVisivel(false)}
              style={styles.botaoCancelar}
            >
              <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ========== ESTILOS ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  containerAbas: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  aba: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  abaAtiva: {
    borderBottomColor: "#a52a2a",
    backgroundColor: "rgba(165, 42, 42, 0.05)",
  },
  textoAba: {
    fontSize: 13,
    fontWeight: "600",
    color: "#795548",
  },
  textoAbaAtiva: {
    color: "#a52a2a",
  },
  listaConteudo: {
    padding: 12,
    paddingBottom: 20,
  },
  cardLivro: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  capaLivro: {
    width: 70,
    height: 105,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  infoLivro: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  tituloLivro: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3e2723",
  },
  autorLivro: {
    fontSize: 14,
    color: "#795548",
    marginTop: 2,
  },
  tagGeneroMini: {
    fontSize: 11,
    color: "#a52a2a",
    backgroundColor: "rgba(165,42,42,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
    fontWeight: "bold",
    overflow: "hidden",
  },
  containerVerMais: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  textoVerMais: {
    color: "#a52a2a",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
  textoVazio: {
    marginTop: 10,
    color: "#795548",
    textAlign: "center",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalConteudo: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3e2723",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#3e2723",
  },
  labelStatus: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#3e2723",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statusBotao: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  statusBotaoAtivo: {
    backgroundColor: "#a52a2a",
  },
  statusTexto: {
    color: "#3e2723",
    fontWeight: "600",
    fontSize: 13,
  },
  statusTextoAtivo: {
    color: "#fff",
  },
  botaoAdicionar: {
    backgroundColor: "#a52a2a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoAdicionar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoCancelar: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotaoCancelar: {
    color: "#3e2723",
    fontSize: 16,
    fontWeight: "bold",
  },
});
