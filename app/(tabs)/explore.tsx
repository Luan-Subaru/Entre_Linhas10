import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // biblioteca para fotos
import { auth, db } from '../../config/firebase.js'; // conexao com firebase
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // icones nativos do expo

export default function ExploreScreen() {
  const [usuario, setUsuario] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [foto, setFoto] = useState<string | null>(null);

  // busca dados do usuario ao abrir a tela
  useEffect(() => {
    const buscarDados = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsuario(docSnap.data());
        }
      }
      setCarregando(false);
    };
    buscarDados();
  }, []);

  // funcao para escolher foto da galeria ou tirar agora
  const escolherFoto = async () => {
    Alert.alert(
      "Foto de Perfil",
      "Deseja tirar uma foto nova ou escolher da galeria?",
      [
        { text: "Camera", onPress: () => abrirCamera() },
        { text: "Galeria", onPress: () => abrirGaleria() },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const abrirCamera = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (permissao.granted === false) {
      Alert.alert("Erro", "Precisamos de acesso a camera");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const abrirGaleria = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  // funcao para deslogar
  const lidarComSair = () => {
    signOut(auth).then(() => {
      router.replace('/login');
    });
  };

  if (carregando) {
    return (
      <View style={styles.containerCentralizado}>
        <ActivityIndicator size="large" color="#a52a2a" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* area do perfil com foto e nome */}
      <View style={styles.cabecalhoPerfil}>
        <TouchableOpacity onPress={escolherFoto}>
          <View style={styles.molduraFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.fotoPerfil} />
            ) : (
              <Ionicons name="camera" size={40} color="#a52a2a" />
            )}
          </View>
          <Text style={styles.textoMudarFoto}>mudar foto</Text>
        </TouchableOpacity>

        <Text style={styles.nomeUsuario}>{usuario?.nome} {usuario?.sobrenome}</Text>
        <Text style={styles.emailUsuario}>{usuario?.email}</Text>
      </View>

      {/* menu de opcoes */}
      <View style={styles.menuOpcoes}>
        <TouchableOpacity style={styles.itemMenu}>
          <Ionicons name="heart" size={24} color="#a52a2a" />
          <Text style={styles.textoItemMenu}>meus favoritos</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemMenu}>
          <Ionicons name="chatbubbles" size={24} color="#a52a2a" />
          <Text style={styles.textoItemMenu}>meus comentarios</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemMenu}>
          <Ionicons name="people" size={24} color="#a52a2a" />
          <Text style={styles.textoItemMenu}>amigos</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.itemMenu, styles.itemSair]} onPress={lidarComSair}>
          <Ionicons name="log-out" size={24} color="#ff4444" />
          <Text style={[styles.textoItemMenu, { color: '#ff4444' }]}>sair da conta</Text>
        </TouchableOpacity>
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
  containerCentralizado: {
    flex: 1,
    backgroundColor: '#fff3dd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cabecalhoPerfil: {
    alignItems: 'center',
    marginBottom: 40,
  },
  molduraFoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#a52a2a',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fotoPerfil: {
    width: '100%',
    height: '100%',
  },
  textoMudarFoto: {
    textAlign: 'center',
    color: '#a52a2a',
    fontSize: 12,
    marginTop: 5,
  },
  nomeUsuario: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3e2723',
    marginTop: 15,
  },
  emailUsuario: {
    fontSize: 14,
    color: '#777',
  },
  menuOpcoes: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    elevation: 2,
  },
  itemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemSair: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  textoItemMenu: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#3e2723',
  }
});