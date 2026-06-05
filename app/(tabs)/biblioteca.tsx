import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

// Interface para os livros
interface Livro {
  id: string;
  titulo: string;
  autor: string;
  capa: string;
  descricao: string;
  conteudo: string;
}

// Dados de exemplo (podem ser movidos para o Firebase depois)
const LIVROS_DISPONIVEIS: Livro[] = [
  {
    id: '1',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    capa: 'https://m.media-amazon.com/images/I/817O5y8kR2L._AC_UF1000,1000_QL80_.jpg',
    descricao: 'A história de Bento Santiago, o Bentinho, e seu ciúme obsessivo por Capitu.',
    conteudo: 'Capítulo 1: Do título. Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos...'
  },
  {
    id: '2',
    titulo: 'Memórias Postumas de Brás Cubas',
    autor: 'Machado de Assis',
    capa: 'https://m.media-amazon.com/images/I/717vT8L-9uL._AC_UF1000,1000_QL80_.jpg',
    descricao: 'Um defunto autor narra suas memórias com ironia e pessimismo.',
    conteudo: 'Algum tempo hesitei se devia abrir estas memórias pelo princípio ou pelo fim, isto é, se poria em primeiro lugar o meu nascimento ou a minha morte. Suposto o uso vulgar seja começar pelo nascimento, duas considerações me levaram a adotar diferente método...'
  },
  {
    id: '3',
    titulo: 'O Cortiço',
    autor: 'Aluísio Azevedo',
    capa: 'https://m.media-amazon.com/images/I/81S6UqWv9DL._AC_UF1000,1000_QL80_.jpg',
    descricao: 'O cotidiano e a degradação dos moradores de um cortiço no Rio de Janeiro.',
    conteudo: 'João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro que enriquecera entre as quatro paredes de uma suja e escura taverna. Quando o patrão se retirou para a terra, João Romão ficou com o negócio...'
  }
];

export default function BibliotecaScreen() {
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [lendoLivro, setLendoLivro] = useState<Livro | null>(null);

  const renderItem = ({ item }: { item: Livro }) => (
    <TouchableOpacity 
      style={styles.cardLivro} 
      onPress={() => setLivroSelecionado(item)}
    >
      <Image source={{ uri: item.capa }} style={styles.capaLivro} />
      <View style={styles.infoLivro}>
        <Text style={styles.tituloLivro} numberOfLines={2}>{item.titulo}</Text>
        <Text style={styles.autorLivro}>{item.autor}</Text>
        <TouchableOpacity 
          style={styles.botaoLer}
          onPress={() => setLendoLivro(item)}
        >
          <Text style={styles.textoBotaoLer}>Ler Agora</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloPagina}>Minha Biblioteca</Text>
        <Text style={styles.subtitulo}>Livros selecionados para você</Text>
      </View>

      <FlatList
        data={LIVROS_DISPONIVEIS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal de Detalhes */}
      <Modal
        visible={!!livroSelecionado && !lendoLivro}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <TouchableOpacity 
              style={styles.botaoFechar} 
              onPress={() => setLivroSelecionado(null)}
            >
              <Ionicons name="close" size={28} color="#a52a2a" />
            </TouchableOpacity>
            
            <Image source={{ uri: livroSelecionado?.capa }} style={styles.capaDetalhe} />
            <Text style={styles.tituloDetalhe}>{livroSelecionado?.titulo}</Text>
            <Text style={styles.autorDetalhe}>{livroSelecionado?.autor}</Text>
            
            <ScrollView style={styles.scrollDescricao}>
              <Text style={styles.descricaoTexto}>{livroSelecionado?.descricao}</Text>
            </ScrollView>

            <TouchableOpacity 
              style={styles.botaoConfirmarLeitura}
              onPress={() => {
                setLendoLivro(livroSelecionado);
                setLivroSelecionado(null);
              }}
            >
              <Text style={styles.textoBotaoConfirmar}>Começar Leitura</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Leitura */}
      <Modal
        visible={!!lendoLivro}
        animationType="fade"
      >
        <View style={styles.leituraContainer}>
          <View style={styles.leituraHeader}>
            <TouchableOpacity onPress={() => setLendoLivro(null)}>
              <Ionicons name="arrow-back" size={28} color="#3e2723" />
            </TouchableOpacity>
            <Text style={styles.leituraTitulo} numberOfLines={1}>{lendoLivro?.titulo}</Text>
            <View style={{ width: 28 }} />
          </View>
          
          <ScrollView contentContainerStyle={styles.leituraTextoContainer}>
            <Text style={styles.textoLivro}>{lendoLivro?.conteudo}</Text>
          </ScrollView>
        </View>
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
    fontSize: 16,
    color: '#a52a2a',
    marginTop: 5,
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  infoLivro: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  tituloLivro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  autorLivro: {
    fontSize: 14,
    color: '#a52a2a',
  },
  botaoLer: {
    backgroundColor: '#a52a2a',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  textoBotaoLer: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: '#fff3dd',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  botaoFechar: {
    alignSelf: 'flex-end',
  },
  capaDetalhe: {
    width: 150,
    height: 220,
    borderRadius: 10,
    marginBottom: 15,
  },
  tituloDetalhe: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3e2723',
    textAlign: 'center',
  },
  autorDetalhe: {
    fontSize: 16,
    color: '#a52a2a',
    marginBottom: 15,
  },
  scrollDescricao: {
    width: '100%',
    marginBottom: 20,
  },
  descricaoTexto: {
    fontSize: 15,
    color: '#5d4037',
    lineHeight: 22,
    textAlign: 'justify',
  },
  botaoConfirmarLeitura: {
    backgroundColor: '#a52a2a',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoConfirmar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leituraContainer: {
    flex: 1,
    backgroundColor: '#fffcf5',
  },
  leituraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leituraTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3e2723',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  leituraTextoContainer: {
    padding: 25,
  },
  textoLivro: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2b1d1a',
    textAlign: 'justify',
  },
});
