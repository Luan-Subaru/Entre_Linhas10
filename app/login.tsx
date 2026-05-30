import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase.js'; // importando banco 

export default function LoginScreen(){
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função para logar o usuário
  const lidarComLogin = () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        Alert.alert('Sucesso', 'Bem-vindo ao Entre Linhas!');
      })
      .catch((error) => {
        Alert.alert('Erro no Login', error.message);
      });
  };

  // Função para cadastrar um novo usuário
  const lidarComCadastro = () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
      })
      .catch((error) => {
        Alert.alert('Erro no Cadastro', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Entre Linhas</Text>
      <Text style={styles.subtitulo}>Sua biblioteca comunitária</Text>

      <TextInput 
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput 
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.botao} onPress={lidarComLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, styles.botaoCadastro]} onPress={lidarComCadastro}>
        <Text style={styles.textoBotaoCadastro}>Criar Nova Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3dd', // Cor creme charmosa
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3e2723',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#a52a2a',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(165,42,42,0.2)',
  },
  botao: {
    width: '100%',
    height: 50,
    backgroundColor: '#a52a2a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  botaoCadastro: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#a52a2a',
    marginTop: 15,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textoBotaoCadastro: {
    color: '#a52a2a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});