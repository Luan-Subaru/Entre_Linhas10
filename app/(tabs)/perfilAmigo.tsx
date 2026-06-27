import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/firebase.js';

export default function PerfilAmigoScreen() {
  const router = useRouter();
  const { idAmigo } = useLocalSearchParams(); // Pega o ID enviado pela lista de amigos
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [generos, setGeneros] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDadosAmigo = async () => {
      if (!idAmigo) return;
      try {
        const docRef = doc(db, 'usuarios', idAmigo as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          setNome(`${dados.nome || 'Leitor'} ${dados.sobrenome || ''}`.trim());
          setEmail(dados.email || '');
          setFotoUrl(dados.fotoUrl || '');
          setGeneros(dados.generosFavoritos || []);
        }
      } catch (error) {
        console.error("Erro ao abrir perfil do amigo:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosAmigo();
  }, [idAmigo]);

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#a52a2a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão para voltar para a lista de amigos */}
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#3e2723" />
      </TouchableOpacity>

      {/* Bloco Superior (Avatar, Nome e Email do Amigo) */}
      <View style={styles.containerTopo}>
        <Image 
          source={{ uri: fotoUrl || 'https://via.placeholder.com/150/3e2723/fff?text=Leitor' }} 
          style={styles.avatar} 
        />
        <Text style={styles.textoNome}>{nome}</Text>
        <Text style={styles.textoEmail}>{email}</Text>
      </View>

      {/* Seção de Preferências Literárias */}
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Gêneros Favoritos de {nome.split(' ')[0]}</Text>
        {generos.length === 0 ? (
          <Text style={styles.textoVazio}>Este leitor ainda não escolheu seus gêneros favoritos.</Text>
        ) : (
          <View style={styles.containerTags}>
            {generos.map((gen, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.textoTag}>{gen}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff3dd', 
    paddingHorizontal: 20, 
    paddingTop: 60 
  },
  botaoVoltar: { 
    marginBottom: 20, 
    alignSelf: 'flex-start' 
  },
  containerTopo: { 
    alignItems: 'center', 
    marginBottom: 30 
  },
  avatar: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 3, 
    borderColor: '#a52a2a', 
    backgroundColor: '#fff' 
  },
  textoNome: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#3e2723', 
    marginTop: 12 
  },
  textoEmail: { 
    fontSize: 14, 
    color: '#795548', 
    marginTop: 2 
  },
  secao: { 
    marginTop: 10 
  },
  tituloSecao: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#3e2723', 
    marginBottom: 12 
  },
  containerTags: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 6 
  },
  tag: { 
    backgroundColor: '#a52a2a', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 15 
  },
  textoTag: { 
    color: '#fff', 
    fontSize: 13, 
    fontWeight: '600' 
  },
  textoVazio: { 
    color: '#795548', 
    fontSize: 13, 
    fontStyle: 'italic' 
  }
});