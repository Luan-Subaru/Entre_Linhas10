import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';


interface Livro {
  id: string;
  titulo: string;
  autor: string;
  capa: string;
  descricao: string;
  conteudo: string;
}


const LIVROS_DISPONIVEIS: Livro[] = [
  {
    id: '1',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    capa: 'https://images-na.ssl-images-amazon.com/images/I/817O5y8kR2L.jpg',
    descricao: 'A história de Bento Santiago, o Bentinho, e seu ciúme obsessivo por Capitu.',
    conteudo: `Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da Lua e dos ministros, e acabou recitando-me versos.
A viagem era curta, e os versos pode ser que não fossem inteiramente maus. Sucedeu, porém, que, como eu estava cansado, fechei os olhos três ou quatro vezes; tanto bastou para que ele interrompesse a leitura e metesse os versos no bolso.
— Continue, disse eu acordando.
— Já acabei, murmurou ele.
— São muito bonitos.
Vi-lhe fazer um gesto para tirá-los outra vez do bolso, mas não passou do gesto; estava amuado. No dia seguinte entrou a dizer de mim nomes feios, e acabou alcunhando-me Dom Casmurro. Os vizinhos, que não gostam dos meus hábitos reclusos e calados, deram curso a alcunha, que afinal pegou. Nem por isso me zanguei. Contei a anedota aos amigos da cidade, e eles, por graça, chamam-me assim, alguns em bilhetes: “Dom Casmurro, domingo vou jantar com você.” — “Vou para Petrópolis, Dom Casmurro; a casa é a mesma da Renânia; vê se deixas essa caverna do Engenho Novo, e vai lá passar uns quinze dias comigo.” — “Meu caro Dom 10 Dom Casmurro Casmurro, não cuide que o dispenso do teatro amanhã; venha e dormiria aqui na cidade; dou-lhe camarote, dou-lhe chá, dou-lhe cama; só não lhe dou moça.”
Não consultes dicionários. Casmurro não está aqui no sentido que eles lhe dão, mas no que lhe pôs o vulgo de homem calado e metido consigo. Dom veio por ironia, para atribuir-me fumos de fidalgo. Tudo por estar cochilando! Também não achei melhor título para a minha narração; se não tiver outro daqui até ao fim do livro, vai este mesmo. O meu poeta do trem ficará sabendo que não lhe guardo rancor. E com pequeno esforço, sendo o título seu, poderá cuidar que a obra é sua. Há livros que apenas terão isso dos seus autores; alguns nem tanto.
II
Do livro
Agora que expliquei o título, passo a escrever o livro. Antes disso, porém, digamos os motivos que me põem a pena na mão. Vivo só, com um criado. A casa em que moro é própria; fi-la construir de propósito, levado de um desejo tão particular que me vexa imprimi-lo, mas vá lá. Um dia, há bastantes anos, lembrou-me reproduzir no Engenho Novo a casa em que me criei na antiga Rua de Mata-cavalos, dando-lhe o mesmo aspecto e economia daquela outra, que desapareceu. Construtor e pintor entenderam bem as indicações que lhes fiz: é o mesmo prédio assobradado, três janelas de frente, varanda ao fundo, as mesmas alcovas e salas. Na principal destas, a pintura do teto e das paredes é mais ou menos igual, umas grinaldas de flores miúdas e grandes pássaros que as tomam nos bicos, de espaço a espaço. Nos quatro cantos do teto as figuras das estações, e ao centro das paredes os medalhões de César, Augusto, Nero e Massinissa, com os nomes por baixo... Não alcanço a razão de tais personagens. Quando fomos para a casa de Mata-cavalos, já ela estava assim decorada; vinha do decênio anterior. Naturalmente era gosto do tempo meter sabor clássico e figuras antigas em pinturas americanas. O mais é também análogo e parecido. Tenho chacarinha, flores, legume, uma casuarina, um poço e lavadouro. Uso louça velha e mobília velha. Enfim, agora, 12 Dom Casmurro como outrora, há aqui o mesmo contraste da vida interior, que é pacata, com a exterior, que é ruidosa.
O meu fim evidente era atar as duas pontas da vida, e restaurar na velhice a adolescência. Pois, senhor, não consegui recompor o que foi nem o que fui. Em tudo, se o rosto é igual, a fisionomia é diferente. Se só me faltassem os outros, vá; um homem consola-se mais ou menos das pessoas que perde; mas falto eu mesmo, e esta lacuna é tudo. O que aqui está é, mal comparando, semelhante 'a pintura que se põe na barba e nos cabelos, e que apenas conserva o hábito externo, como se diz nas autópsias; o interno não aguenta tinta. Uma certidão que me desse vinte anos de idade poderia enganar os estranhos, como todos os documentos falsos, mas não a mim. Os amigos que me restam são de data recente; todos os antigos foram estudar a geologia dos campos-santos. Quanto as amigas, algumas datam de quinze anos, outras de menos, e quase todas creem na mocidade. Duas ou três fariam crer nela aos outros, mas a língua que falam obriga muita vez a consultar os dicionários, e tal frequência é cansativa.
Entretanto, vida diferente não quer dizer vida pior; é outra coisa. A certos respeitos, aquela vida antiga aparece-me despida de muitos encantos que lhe achei; mas é também exato que perdeu muito espinho que a fez molesta, e, de memória, conservo alguma recordação doce e feiticeira. Em verdade, pouco apareço e menos falo. Distrações raras. O mais do tempo é gasto em hortar, jardinar e ler; como bem e não durmo mal.
Ora, como tudo cansa, esta monotonia acabou por exaurir-me também. Quis variar, e lembrou-me escrever um livro. Jurisprudência, filosofia e política acudiram-me, mas não me acudiram as forças necessárias. Depois, pensei em fazer uma História dos Subúrbios, menos seca que as memórias do padre Luís Gonçalves dos Santos, relativas a cidade; era obra modesta, mas exigia documentos e datas, como preliminares, tudo árido e longo. Foi então que os bustos pintados nas paredes entraram a falar-me e a dizer-me que, uma vez que eles não alcançavam reconstituir-me os tempos idos, pegasse da pena e contasse alguns. Talvez a narração me desse a ilusão, e as sombras viessem perpassar ligeiras, como ao poeta, não o do trem, mas o do Fausto: Aí vindes outra vez, inquietas sombras...?
Fiquei tão alegre com esta ideia, que ainda agora me treme a pena na mão. Sim, Nero, Augusto, Massinissa, e tu, grande César, que me incitas a fazer os meus comentários, agradeço-vos o conselho, e vou deitar ao papel as reminiscências que me vierem vindo. Deste modo, viverei o que vivi, e assentarei a mão para alguma obra de maior tomo. Eia, comecemos a evocação por uma célebre tarde de novembro, que nunca me esqueceu. Tive outras muitas, melhores, e piores, mas aquela nunca se me apagou do espírito. E o que vais entender, lendo.
III
A denúncia
Ia a entrar na sala de visitas, quando ouvi proferir o meu nome e escondi-me atrás da porta. A casa era a da Rua de Mata-cavalos, o mês novembro, o ano é que é um tanto remoto, mas eu não hei de trocar as datas a minha vida só para agradar as pessoas que não amam histórias velhas; o ano era de 1857.
— D. Glória, a senhora persiste na ideia de meter o nosso Bentinho no seminário? E mais que tempo, e já agora pode haver uma dificuldade.
— Que dificuldade?
— Uma grande dificuldade.
Minha mãe quis saber o que era. José Dias, depois de alguns instantes de concentração, veio ver se havia alguém no corredor; não deu por mim, voltou e, abafando a voz, disse que a dificuldade estava na casa ao pé, a gente do Pádua.
— A gente do Pádua?
— Há algum tempo estou para lhe dizer isto, mas não me atrevia. Não me parece bonito que o nosso Bentinho ande metido nos cantos com a filha do Tartaruga, e esta é a dificuldade, porque se eles pegam de namoro, a senhora terá muito que lutar para separá-los.
— Não acho. Metidos nos cantos?
— E um modo de falar. Em segredinhos, sempre juntos. Bentinho quase que não sai de lá. A pequena é uma desmiolada; o pai faz que não vê; tomara ele que as coisas corressem de maneira que... Compreendo o seu gesto; a senhora não crê em tais cálculos, parece-lhe que todos têm a alma cândida...
— Mas, Sr. José Dias, tenho visto os pequenos brincando, e nunca vi nada que faça desconfiar. Basta a idade; Bentinho mal tem quinze anos. Capitu fez quatorze a semana passada; são dois criançolas. Não se esqueça que foram criados juntos, desde aquela grande enchente, há dez anos, em que a família Pádua perdeu tanta coisa; daí vieram as nossas relações. Pois eu hei de crer?... Mano Cosme, você que acha?
Tio Cosme respondeu com um “Ora!” que, traduzido em vulgar, queria dizer: “São imaginações do José Dias; os pequenos divertem-se, eu divirto-me; onde está o gamão?”
— Sim, creio que o senhor está enganado.
— Pode ser, minha senhora. Oxalá tenham razão; mas creia que não falei senão depois de muito examinar...
— Em todo caso, vai sendo tempo, interrompeu minha mãe; vou tratar de metê-lo no seminário quanto antes.
— Bem, uma vez que não perdeu a ideia de o fazer padre, tem-se ganho o principal. Bentinho há de satisfazer os desejos de sua mãe. E depois a Igreja brasileira tem altos destinos. Não esqueçamos que um bispo presidiu a Constituinte, e que o padre Feijó governou o Império...
— Governou como a cara dele! atalhou tio Cosme, cedendo a antigos rancores políticos.
— Perdão, doutor, não estou defendendo ninguém, estou citando. O que eu quero é dizer que o clero ainda tem grande papel no Brasil.
— Você o que quer é um capote; ande, vá buscar o gamão. Quanto ao pequeno, se tem de ser padre, realmente é melhor que não comece a dizer missa atrás das portas. Mas, olhe cá, mana Glória, há mesmo necessidade de fazê-lo padre?
— E promessa, há de cumprir-se.
— Sei que você fez promessa... mas uma promessa assim... não sei... Creio que, bem pensado... Você que acha, prima Justina?
— Eu?
— Verdade é que cada um sabe melhor de si, continuou tio Cosme — Deus é que sabe de todos. Contudo, uma promessa de tantos anos... Mas, que é isso, mana Glória? Está chorando? Ora esta! Pois isto é coisa de lágrimas?
Minha mãe assoou-se sem responder. Prima Justina creio que se levantou e foi ter com ela. Seguiu-se um alto silêncio, durante o qual estive a pique de entrar na sala, mas outra força maior, outra emoção... Não pude ouvir as palavras que tio Cosme entrou a dizer. Prima Justina exortava: “Prima Glória! Prima Glória!” José Dias desculpava-se: “Se soubesse, não teria falado, mas falei pela veneração, pela estima, pelo afeto, para cumprir um dever amargo, um dever amaríssimo...”`
  },
  {
    id: '2',
    titulo: 'Memórias Póstumas de Brás Cubas',
    autor: 'Machado de Assis',
    capa: 'https://images-na.ssl-images-amazon.com/images/I/717vT8L-9uL.jpg',
    descricao: 'Um defunto autor narra suas memórias com ironia e pessimismo.',
    conteudo: `Algum tempo hesitei se devia abrir estas memórias pelo princípio ou pelo fim, isto é, se poria em primeiro lugar o meu nascimento ou a minha morte. Suposto o uso vulgar seja começar pelo nascimento, duas considerações me levaram a adotar diferente método...`
  },
  {
    id: '3',
    titulo: 'O Cortiço',
    autor: 'Aluísio Azevedo',
    capa: 'https://images-na.ssl-images-amazon.com/images/I/81S6UqWv9DL.jpg',
    descricao: 'O cotidiano e a degradação dos moradores de um cortiço no Rio de Janeiro.',
    conteudo: `O Cortiço — Capítulo I 
João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro que enriqueceu entre as quatro paredes de uma suja e obscura taverna nos refolhos do bairro de Botafogo; e tanto economizou do pouco que ganhara nessa dúzia de anos, que, ao retirar-se o patrão para a terra, pôde comprar o estabelecimento por uma quantia que não chegava a um terço do que ele realmente valia.  

Dali por diante, a sua vida foi um desespero de acumular dinheiro. Almoçava pão dormido e pontas de queijo; jantava azeite, feijão e farinha; a sua única despesa de luxo era o fumo de rolo, de que gastava dois tostões por semana. Dormia sobre o balcão da taverna, em cima de uma esteira rasgada, tendo por travesseiro um saco de estopas cheio de palha de milho. Não vinha nunca à rua senão para ir às compras no mercado; trazia as calças arregaçadas para não as sujar e andava descalço, descarregando ele próprio as carroças e arrumando os caixotes no armazém.

Por esse tempo, havia ao lado da taverna, à esquerda, uma quitandeira, preta, quase velha, chamada Bertoleza. Essa mulher, que era escrava de um velho cego residente em Juiz de Fora, vivia ali na cidade há muitos anos, à mercê de um jornal que pagava pontualmente ao seu senhor. Ganhara com que fartar o corpo e ainda lhe sobrava uma economiazita, que ela guardava em uma meia de lã, por baixo do colchão, com o fim de comprar um dia a sua liberdade.

João Romão propôs-lhe sociedade. Bertoleza aceitou, mudando-se com as suas panelas e os seus balaios para a taverna. Ela entrava com o trabalho e o seu pecúlio; ele com o estabelecimento e com a sua gerência. Daí em diante, as coisas correram de vento em popa. A crioula era uma verdadeira máquina de ganhar dinheiro; trabalhava das quatro da manhã às dez da noite, lavando, cozinhando, vendendo na quitanda e estendendo a roupa no varal.

Quando João Romão soube que a meia de lã da preta continha já a soma necessária para a alforria, propôs-se ele próprio a ir comprá-la ao senhor em Juiz de Fora. Fingiu que fizera a transação e entregou à crioula um papel falsificado como sendo a carta de liberdade. Bertoleza, que não sabia ler, chorou de gratidão e entregou-se de corpo e alma ao seu "salvador".

Atrás da taverna de João Romão estendia-se um grande terreno baldio, que ele conseguiu comprar por uma bagatela. Foi nesse terreno que o taverneiro começou a erguer o seu império. Comprou uma pedreira nos fundos e começou a vender pedra; com os lucros da pedreira e da taverna, comprou materiais de refugo e construiu as três primeiras casinhas de aluguel.

Eram três casinhas de porta e janela, feias, malfeitas, mas que se alugaram num abrir e fechar de olhos. João Romão viu ali a sua mina de ouro. Construiu mais seis, depois mais doze, depois trinta. Em menos de cinco anos, o terreno baldio transformara-se numa imensa estalagem, uma verdadeira colmeia humana.

E naquela terra encharcada e fumegante, naquela umidade quente e lodosa, começou a minhocar, a esfervilhar, a crescer, um mundo, uma coisa viva, uma generation, que parecia brotar espontânea, ali mesmo, daquele lameiro, e multiplicar-se como larvas no esterco.

Ao lado do cortiço, comprou também um terreno o Sr. Miranda, negociante de fazendas por atacado, português enrichmentado, que ali ergueu um belo palacete, com jardim e cocheira. Entre a casa rica de Miranda e a estalagem miserável de João Romão começou logo uma guerra surda e implacável de vizinhos, nascida do orgulho ferido do burguês, que não tolerava viver parede meia com a gentalha do cortiço, e da avareza do taverneiro, que não perdia uma polegada de terreno que pudesse render-lhe um tostão.

(...)

Às cinco horas da manhã o cortiço acordava, acendendo os seus primeiros fogos. O rumor crescia; começava o trabalho. Vinham as lavadeiras para as tinas; os pedreiros e os carpinteiros saíam com as suas ferramentas a tiracolo; os caixeiros de taverna varriam as calçadas.

Era o acordar da colmeia. Um acordar alegre, ruidoso, cheio de uma vitalidade animal.

As lavadeiras, de braços nus, metidas em saias de riscado, começavam a ensaboar as roupas nas tinas de pedra, cantando modinhas e fados. A água corria pelos canos, ensaboada e espumosa, levando o cheiro de sabão da Costa e de gordura. O chão do pátio ficava logo inundado, refletindo o céu azul da manhã.

— Ó de casa! dize ao teu homem que me mude esta tina! — gritava uma.
— Sai daí, rapariga, que me estás salpicando a roupa limpa! — respondia outra de mais longe.

No meio daquele alvoroço, cruzavam-se os homens que iam para o trabalho. Uns engoliam à pressa um trago de parati na taverna de João Romão; outros compravam um tostão de pão dormido na quitanda de Bertoleza.

A filha da vizinha, a Pombinha, uma moça pálida, educada, que todos respeitavam no cortiço por saber ler e escrever e por estar de casamento marcado com um caixeiro, passava timidamente entre as lavadeiras, a caminho da sua costura.

— Deus a leve em bem, menina! — diziam as mulheres, interrompendo o canto para vê-la passar. Pombinha agradecia com um sorriso doce e sumia-se no portão.

Mais adiante, na última casinha do corredor, morava a Rita Baiana. Era a mulata mais cobiçada do cortiço, que passava os dias a cantarolar e a rir, com os seus dentes claríssimos e os seus olhos acesos de desejo. Quando ela aparecia à porta, de braços cruzados, balanceando os quadris, o pátio inteiro parecia parar para olhá-la. Os homens suspendiam o trabalho e as outras mulheres olhavam-no com uma ponta de inveja e admiração.

João Romão, do alto do seu balcão, vigiava tudo. Nada lhe escapava: nem a tina que quebrava, nem o aluguel que atrasava, nem o pedaço de pão que Bertoleza porventura comesse a mais. O seu olho clínico e avarento computava cada gota de suor daquela gente em moedas de ouro que iam enriquecer a sua arca de ferro.

O sol, entretanto, ia subindo no horizonte, crestante e impiedoso. O calor começava a abafar o cortiço. A poeira da pedreira subia em nuvens brancas, sufocando os trabalhadores que quebravam o granito a golpes de picareta. O cheiro de suor humano, misturado ao cheiro da comida que começava a ferver nas panelas de barro e ao odor fétido das latrinas, formava uma atmosfera pesada, uma névoa quente que pairava sobre a estalagem.

Miranda, do seu palacete, olhava com nojo pela janela do andar superior. Via aquela miséria fervilhante, ouvia aquela gritaria de mulheres, aquele linguajar rústico e obsceno, e sentia-se insultado na sua dignidade de comendador. Jurava a si mesmo que haveria de correr com João Romão dali, ou comprar-lhe a propriedade por qualquer preço, para limpar o seu bairro daquela praga.

Mas João Romão não se importava com os olhares do vizinho rico. Pelo contrário, cada tijolo que assentava no seu terreno, cada nova casinha que cobria de telhas, era uma vitória contra o palacete do Miranda. Sabia que o futuro lhe pertencia e que, enquanto o comendador gastava o seu dinheiro em carruagens e jantares luxuosos, ele, João Romão, ia acumulando o capital que um dia o faria senhor de tudo e de todos ali em Botafogo.

À noite, o ritmo do cortiço mudava. O trabalho pesado cessava, mas a atividade não parava. O pátio enchia-se novamente, mas agora para o descanso e para a festa. Os homens sentavam-se às portas das casinhas, fumando os seus cachimbos de barro e conversando sobre a jornada de trabalho. As lavadeiras, cansadas de passar o dia de pé junto às tinas, estendiam esteiras no chão e catavam piolhos na cabeça dos filhos.

Era então que surgiam os violões. Alguém começava a pontear uma corda, timidamente, num canto do pátio. Outro acompanhava de longe. Daí a pouco, a música espalhava-se por todo o cortiço, atraindo os moradores como um ímã.

Rita Baiana aparecia na roda, com a sua saia branca engomada e os seus brincos de ouro que faiscavam à luz dos lampiões de querosene. Começava o chorado, a dança sensual e frenética que fazia ferver o sangue daquela gente. Os corpos balançavam-se no ritmo da música, os pés batiam no chão de terra batida, e o cortiço esquecia, por algumas horas, a miséria, o cansaço e a exploração do dia a dia, entregando-se inteiramente ao prazer bruto e violento da vida.

E João Romão, fechado na sua taverna, contava o dinheiro do dia, ouvindo de longe o som dos violões e as gargalhadas da mulata, sorrindo satisfeito porque sabia que, no dia seguinte, toda aquela gente voltaria a trabalhar para ele, desde o amanhecer até o cair da noite.`
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
