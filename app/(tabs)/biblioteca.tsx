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
    conteudo: 'Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conhe¸co de vista e de chap´eu. Cumprimentou-me, sentou-se ao p´e de mim, falou da Lua e dos ministros, e acabou recitando-me versos.
`'A viagem era curta, e os versos pode ser que n˜ao fossem inteiramente maus. Sucedeu, por´em, que, como eu estava cansado,
fechei os olhos trˆes ou quatro vezes; tanto bastou para que ele
interrompesse a leitura e metesse os versos no bolso.
— Continue, disse eu acordando.
— J´a acabei, murmurou ele.
— S˜ao muito bonitos.
Vi-lhe fazer um gesto para tir´a-los outra vez do bolso, mas
n˜ao passou do gesto; estava amuado. No dia seguinte entrou a dizer de mim nomes feios, e acabou alcunhando-me Dom Casmurro.
Os vizinhos, que n˜ao gostam dos meus h´abitos reclusos e calados,
deram curso a alcunha, que afinal pegou. Nem por isso me zanguei. Contei a anedota aos amigos da cidade, e eles, por gra¸ca,
chamam-me assim, alguns em bilhetes: “Dom Casmurro, domingo
vou jantar com vocˆe.” — “Vou para Petr´opolis, Dom Casmurro; a
casa ´e a mesma da Renˆania; vˆe se deixas essa caverna do Engenho
Novo, e vai l´a passar uns quinze dias comigo.” — “Meu caro Dom
10 Dom Casmurro
Casmurro, n˜ao cuide que o dispenso do teatro amanh˜a; venha e
dormir´a aqui na cidade; dou-lhe camarote, dou-lhe ch´a, dou-lhe
cama; s´o n˜ao lhe dou mo¸ca.”
N˜ao consultes dicion´arios. Casmurro n˜ao est´a aqui no sentido
que eles lhe d˜ao, mas no que lhe pˆos o vulgo de homem calado
e metido consigo. Dom veio por ironia, para atribuir-me fumos
de fidalgo. Tudo por estar cochilando! Tamb´em n˜ao achei melhor
t´ıtulo para a minha narra¸c˜ao; se n˜ao tiver outro daqui at´e ao fim
do livro, vai este mesmo. O meu poeta do trem ficar´a sabendo
que n˜ao lhe guardo rancor. E com pequeno esfor¸co, sendo o t´ıtulo
seu, poder´a cuidar que a obra ´e sua. H´a livros que apenas ter˜ao
isso dos seus autores; alguns nem tanto.
II
Do livro
Agora que expliquei o t´ıtulo, passo a escrever o livro. Antes
disso, por´em, digamos os motivos que me p˜oem a pena na m˜ao.
Vivo s´o, com um criado. A casa em que moro ´e pr´opria; fi-la
construir de prop´osito, levado de um desejo t˜ao particular que me
vexa imprimi-lo, mas v´a l´a. Um dia, h´a bastantes anos, lembroume reproduzir no Engenho Novo a casa em que me criei na antiga Rua de Mata-cavalos, dando-lhe o mesmo aspecto e economia
daquela outra, que desapareceu. Construtor e pintor entenderam
bem as indica¸c˜oes que lhes fiz: ´e o mesmo pr´edio assobradado, trˆes
janelas de frente, varanda ao fundo, as mesmas alcovas e salas. Na
principal destas, a pintura do teto e das paredes ´e mais ou menos
igual, umas grinaldas de flores mi´udas e grandes p´assaros que as
tomam nos bicos, de espa¸co a espa¸co. Nos quatro cantos do teto
as figuras das esta¸c˜oes, e ao centro das paredes os medalh˜oes de
C´esar, Augusto, Nero e Massinissa, com os nomes por baixo... N˜ao
alcan¸co a raz˜ao de tais personagens. Quando fomos para a casa
de Mata-cavalos, j´a ela estava assim decorada; vinha do decˆenio
anterior. Naturalmente era gosto do tempo meter sabor cl´assico e
figuras antigas em pinturas americanas. O mais ´e tamb´em an´alogo
e parecido. Tenho chacarinha, flores, legume, uma casuarina, um
po¸co e lavadouro. Uso lou¸ca velha e mob´ılia velha. Enfim, agora,
12 Dom Casmurro
como outrora, h´a aqui o mesmo contraste da vida interior, que ´e
pacata, com a exterior, que ´e ruidosa.
O meu fim evidente era atar as duas pontas da vida, e restaurar
na velhice a adolescˆencia. Pois, senhor, n˜ao consegui recompor o
que foi nem o que fui. Em tudo, se o rosto ´e igual, a fisionomia ´e
diferente. Se s´o me faltassem os outros, v´a; um homem consola-se
mais ou menos das pessoas que perde; mas falto eu mesmo, e esta
lacuna ´e tudo. O que aqui est´a ´e, mal comparando, semelhante 'a
pintura que se p˜oe na barba e nos cabelos, e que apenas conserva o
h´abito externo, como se diz nas aut´opsias; o interno n˜ao ag¨uenta
tinta. Uma certid˜ao que me d´esse vinte anos de idade poderia
enganar os estranhos, como todos os documentos falsos, mas n˜ao
a mim. Os amigos que me restam s˜ao de data recente; todos
os antigos foram estudar a geologia dos campos-santos. Quanto
as amigas, algumas datam de quinze anos, outras de menos, e
quase todas crˆeem na mocidade. Duas ou trˆes fariam crer nela
aos outros, mas a l´ıngua que falam obriga muita vez a consultar
os dicion´arios, e tal freq¨uˆencia ´e cansativa.
Entretanto, vida diferente n˜ao quer dizer vida pior; ´e outra
coisa. A certos respeitos, aquela vida antiga aparece-me despida
de muitos encantos que lhe achei; mas ´e tamb´em exato que perdeu
muito espinho que a fez molesta, e, de mem´oria, conservo alguma
recorda¸c˜ao doce e feiticeira. Em verdade, pouco apare¸co e menos falo. Distra¸c˜oes raras. O mais do tempo ´e gasto em hortar,
jardinar e ler; como bem e n˜ao durmo mal.
Ora, como tudo cansa, esta monotonia acabou por exaurir-me
tamb´em. Quis variar, e lembrou-me escrever um livro. Jurisprudˆencia, filosofia e pol´ıtica acudiram-me, mas n˜ao me acudiram
as for¸cas necess´arias. Depois, pensei em fazer uma Hist´oria dos
Sub´urbios, menos seca que as mem´orias do padre Lu´ıs Gon¸calves
dos Santos, relativas a cidade; era obra modesta, mas exigia documentos e datas, como preliminares, tudo ´arido e longo. Foi
ent˜ao que os bustos pintados nas paredes entraram a falar-me e a
Dom Casmurro 13
dizer-me que, uma vez que eles n˜ao alcan¸cavam reconstituir-me os
tempos idos, pegasse da pena e contasse alguns. Talvez a narra¸c˜ao
me d´esse a ilus˜ao, e as sombras viessem perpassar ligeiras, como
ao poeta, n˜ao o do trem, mas o do Fausto: A´ı vindes outra vez,
inquietas sombras...?
Fiquei t˜ao alegre com esta id´eia, que ainda agora me treme
a pena na m˜ao. Sim, Nero, Augusto, Massinissa, e tu, grande
C´esar, que me incitas a fazer os meus coment´arios, agrade¸co-vos
o conselho, e vou deitar ao papel as reminiscˆencias que me vierem
vindo. Deste modo, viverei o que vivi, e assentarei a m˜ao para
alguma obra de maior tomo. Eia, comecemos a evoca¸c˜ao por uma
c´elebre tarde de novembro, que nunca me esqueceu. Tive outras
muitas, melhores, e piores, mas aquela nunca se me apagou do
esp´ırito. E o que vais entender, lendo. ´
III
A den´uncia
Ia a entrar na sala de visitas, quando ouvi proferir o meu nome
e escondi-me atr´as da porta. A casa era a da Rua de Mata-cavalos,
o mˆes novembro, o ano ´e que ´e um tanto remoto, mas eu n˜ao hei
de trocar as datas a minha vida s´o para agradar as pessoas que
n˜ao amam hist´orias velhas; o ano era de 1857.
— D. Gl´oria, a senhora persiste na id´eia de meter o nosso
Bentinho no semin´ario? E mais que tempo, e j´a agora pode haver ´
uma dificuldade.
— Que dificuldade?
— Uma grande dificuldade.
Minha m˜ae quis saber o que era. Jos´e Dias, depois de alguns
instantes de concentra¸c˜ao, veio ver se havia algu´em no corredor;
n˜ao deu por mim, voltou e, abafando a voz, disse que a dificuldade
estava na casa ao p´e, a gente do P´adua.
— A gente do P´adua?
— H´a algum tempo estou para lhe dizer isto, mas n˜ao me
atrevia. N˜ao me parece bonito que o nosso Bentinho ande metido
nos cantos com a filha do Tartaruga, e esta ´e a dificuldade, porque
se eles pegam de namoro, a senhora ter´a muito que lutar para
separ´a-los.
— N˜ao acho. Metidos nos cantos?
Dom Casmurro 15
— E um modo de falar. Em segredinhos, sempre juntos. Ben- ´
tinho quase que n˜ao sai de l´a. A pequena ´e uma desmiolada; o
pai faz que n˜ao vˆe; tomara ele que as coisas corressem de maneira
que... Compreendo o seu gesto; a senhora n˜ao crˆe em tais c´alculos,
parece-lhe que todos tˆem a alma cˆandida...
— Mas, Sr. Jos´e Dias, tenho visto os pequenos brincando, e
nunca vi nada que fa¸ca desconfiar. Basta a idade; Bentinho mal
tem quinze anos. Capitu fez quatorze a semana passada; s˜ao dois
crian¸colas. N˜ao se esque¸ca que foram criados juntos, desde aquela
grande enchente, h´a dez anos, em que a fam´ılia P´adua perdeu
tanta coisa; da´ı vieram as nossas rela¸c˜oes. Pois eu hei de crer?...
Mano Cosme, vocˆe que acha?
Tio Cosme respondeu com um “Ora!” que, traduzido em vulgar, queria dizer: “S˜ao imagina¸c˜oes do Jos´e Dias; os pequenos
divertem-se, eu divirto-me; onde est´a o gam˜ao?”
— Sim, creio que o senhor est´a enganado.
— Pode ser, minha senhora. Oxal´a tenham raz˜ao; mas creia
que n˜ao falei sen˜ao depois de muito examinar...
— Em todo caso, vai sendo tempo, interrompeu minha m˜ae;
vou tratar de metˆe-lo no semin´ario quanto antes.
— Bem, uma vez que n˜ao perdeu a id´eia de o fazer padre,
tem-se ganho o principal. Bentinho h´a de satisfazer os desejos de
sua m˜ae. E depois a Igreja brasileira tem altos destinos. N˜ao
esque¸camos que um bispo presidiu a Constituinte, e que o padre
Feij´o governou o Imp´erio...
— Governou como a cara dele! atalhou tio Cosme, cedendo a
antigos rancores pol´ıticos.
— Perd˜ao, doutor, n˜ao estou defendendo ningu´em, estou citando. O que eu quero ´e dizer que o clero ainda tem grande papel
no Brasil.
— Vocˆe o que quer ´e um capote; ande, v´a buscar o gam˜ao.
Quanto ao pequeno, se tem de ser padre, realmente ´e melhor que
n˜ao comece a dizer missa atr´as das portas. Mas, olhe c´a, mana
16 Dom Casmurro
Gl´oria, h´a mesmo necessidade de fazˆe-lo padre?
— E promessa, h´a de cumprir-se. ´
— Sei que vocˆe fez promessa... mas uma promessa assim... n˜ao
sei... Creio que, bem pensado... Vocˆe que acha, prima Justina?
— Eu?
— Verdade ´e que cada um sabe melhor de si, continuou tio
Cosme — Deus ´e que sabe de todos. Contudo, uma promessa de
tantos anos... Mas, que ´e isso, mana Gl´oria? Est´a chorando? Ora
esta! Pois isto ´e coisa de l´agrimas?
Minha m˜ae assoou-se sem responder. Prima Justina creio que
se levantou e foi ter com ela. Seguiu-se um alto silˆencio, durante
o qual estive a pique de entrar na sala, mas outra for¸ca maior,
outra emo¸c˜ao... N˜ao pude ouvir as palavras que tio Cosme entrou
a dizer. Prima Justina exortava: “Prima Gl´oria! Prima Gl´oria!”
Jos´e Dias desculpava-se: “Se soubesse, n˜ao teria falado, mas falei
pela venera¸c˜ao, pela estima, pelo afeto, para cumprir um dever
amargo, um dever amar´ıssimo...”
IV
Um dever amar´ıssimo!
Jos´e Dias amava os superlativos. Era um modo de dar fei¸c˜ao
monumental as id´eias; n˜ao as havendo, serviam a prolongar as
frases. Levantou-se para ir buscar o gam˜ao, que estava no interior da casa. Cosi-me muito a parede, e vi-o passar com as suas
cal¸cas brancas engomadas, presilhas, rodaque e gravata de mola.
Foi dos ´ultimos que usaram presilhas no Rio de Janeiro, e talvez neste mundo. Trazia as cal¸cas curtas para que lhe ficassem
bem esticadas. A gravata de cetim preto, com um aro de a¸co por
dentro, imobilizava-lhe o pesco¸co; era ent˜ao moda. O rodaque de
chita, veste caseira e leve, parecia nele uma casaca de cerimˆonia.
Era magro, chupado, com um princ´ıpio de calva; teria os seus
cinq¨uenta e cinco anos. Levantou-se com o passo vagaroso do costume, n˜ao aquele vagar arrastado dos pregui¸cosos, mas um vagar
calculado e deduzido, um silogismo completo, a premissa antes
da conseq¨uˆencia, a conseq¨uˆencia antes da conclus˜ao. Um dever
amar´ıssimo!
V
O agregado
Nem sempre ia naquele passo vagaroso e r´ıgido. Tamb´em se
descompunha em acionados, era muita vez r´apido e l´epido nos
movimentos, t˜ao natural nesta como naquela maneira. Outrossim,
ria largo, se era preciso, de um grande riso sem vontade, mas
comunicativo, a tal ponto as bochechas, os dentes, os olhos, toda
a cara, toda a pessoa, todo o mundo pareciam rir nele. Nos lances
graves, grav´ıssimo.
Era nosso agregado desde muitos anos; meu pai ainda estava
na antiga fazenda de Itagua´ı, e eu acabava de nascer. Um dia
apareceu ali vendendo-se por m´edico homeopata; levava um Manual e uma botica. Havia ent˜ao um anda¸co de febres; Jos´e Dias
curou o feitor e uma escrava, e n˜ao quis receber nenhuma remunera¸c˜ao. Ent˜ao meu pai propˆos-lhe ficar ali vivendo, com pequeno
ordenado. Jos´e Dias recusou, dizendo que era justo levar a sa´ude
a casa de sap´e do pobre.
— Quem lhe impede que v´a a outras partes? V´a aonde quiser,
mas fique morando conosco.
— Voltarei daqui a trˆes meses.
Voltou dali a duas semanas, aceitou casa e comida sem outro
estipˆendio, salvo o que quisessem dar por festas. Quando meu pai
foi eleito deputado e veio para o Rio de Janeiro com a fam´ılia,
Dom Casmurro 19
ele veio tamb´em, e teve o seu quarto ao fundo da ch´acara. Um
dia, reinando outra vez febres em Itagua´ı, disse-lhe meu pai que
fosse ver a nossa escravatura. Jos´e Dias deixou-se estar calado,
suspirou e acabou confessando que n˜ao era m´edico. Tomara este
t´ıtulo para ajudar a propaganda da nova escola, e n˜ao o fez sem
estudar muito e muito; mas a consciˆencia n˜ao lhe permitia aceitar
mais doentes.
— Mas, vocˆe curou das outras vezes.
— Creio que sim; o mais acertado, por´em, ´e dizer que foram os
rem´edios indicados nos livros. Eles, sim, eles, abaixo de Deus. Eu
era um charlat˜ao... N˜ao negue; os motivos do meu procedimento
podiam ser e eram dignos; a homeopatia ´e a verdade, e, para servir
a verdade, menti; mas ´e tempo de restabelecer tudo.
N˜ao foi despedido, como pedia ent˜ao; meu pai j´a n˜ao podia
dispens´a-lo. Tinha o dom de se fazer aceito e necess´ario; davase por falta dele, como de pessoa de fam´ılia. Quando meu pai
morreu, a dor que o pungiu foi enorme, disseram-me; n˜ao me lembra. Minha m˜ae ficou-lhe muito grata, e n˜ao consentiu que ele
deixasse o quarto da ch´acara; ao s´etimo dia, depois da missa, ele
foi despedir-se dela.
— Fique, Jos´e Dias.
— Obede¸co, minha senhora.
Teve um pequeno legado no testamento, uma ap´olice e quatro
palavras de louvor. Copiou as palavras, encaixilhou-as e pendurouas no quarto, por cima da cama. “Esta ´e a melhor ap´olice”, dizia ele muita vez. Com o tempo, adquiriu certa autoridade na
fam´ılia, certa audiˆencia, ao menos; n˜ao abusava, e sabia opinar
obedecendo. Ao cabo, era amigo, n˜ao direi ´otimo, mas nem tudo
´e ´otimo neste mundo. E n˜ao lhe suponhas alma subalterna; as
cortesias que fizesse vinham antes do c´alculo que da ´ındole. A
roupa durava-lhe muito; ao contr´ario das pessoas que enxovalham
depressa o vestido novo, ele trazia o velho escovado e liso, cerzido,
abotoado, de uma elegˆancia pobre e modesta. Era lido, posto que
20 Dom Casmurro
de atropˆelo, o bastante para divertir ao ser˜ao e a sobremesa, ou
explicar algum fenˆomeno, falar dos efeitos do calor e do frio, dos
p´olos e de Robespierre. Contava muita vez uma viagem que fizera
a Europa, e confessava que a n˜ao sermos n´os, j´a teria voltado para
l´a; tinha amigos em Lisboa, mas a nossa fam´ılia, dizia ele, abaixo
de Deus, era tudo.
— Abaixo ou acima? perguntou-lhe tio Cosme um dia.
— Abaixo, repetiu Jos´e Dias cheio de venera¸c˜ao.
E minha m˜ae, que era religiosa, gostou de ver que ele punha
Deus no devido lugar, e sorriu aprovando. Jos´e Dias agradeceu de
cabe¸ca. Minha m˜ae dava-lhe de quando em quando alguns cobres.
Tio Cosme, que era advogado, confiava-lhe a c´opia de pap´eis de
autos.
VI
Tio Cosme
Tio Cosme vivia com minha m˜ae, desde que ela enviuvou. J´a
ent˜ao era vi´uvo, como prima Justina; era a casa dos trˆes vi´uvos.
A fortuna troca muita vez as m˜aos a natureza. Formado para
as serenas fun¸c˜oes do capitalismo, tio Cosme n˜ao enriquecia no
foro: ia comendo. Tinha o escrit´orio na antiga Rua das Violas,
perto do j´uri, que era no extinto Aljube. Trabalhava no crime.
Jos´e Dias n˜ao perdia as defesas orais de tio Cosme. Era quem lhe
vestia e despia a toga, com muitos cumprimentos no fim. Em casa,
referia os debates. Tio Cosme, por mais modesto que quisesse ser,
sorria de persuas˜ao.
Era gordo e pesado, tinha a respira¸c˜ao curta e os olhos dorminhocos. Uma das minhas recorda¸c˜oes mais antigas era vˆe-lo
montar todas as manh˜as a besta que minha m˜ae lhe deu e que o
levava ao escrit´orio. O preto que a tinha ido buscar a cocheira
segurava o freio, enquanto ele erguia o p´e e pousava no estribo; a
isto seguia-se um minuto de descanso ou reflex˜ao. Depois, dava
um impulso, o primeiro, o corpo amea¸cava subir, mas n˜ao subia;
segundo impulso, igual efeito. Enfim, ap´os alguns instantes largos,
tio Cosme enfeixava todas as for¸cas f´ısicas e morais, dava o ´ultimo
surto da terra, e desta vez ca´ıa em cima do selim. Raramente a
22 Dom Casmurro
besta deixava de mostrar por um gesto que acabava de receber o
mundo. Tio Cosme acomodava as carnes, e a besta partia a trote.
Tamb´em n˜ao me esqueceu o que ele me fez uma tarde. Posto
que nascido na ro¸ca (donde vim com dois anos) e apesar dos costumes do tempo, eu n˜ao sabia montar, e tinha medo ao cavalo. Tio
Cosme pegou em mim e escanchou-me em cima da besta. Quando
me vi no alto (tinha nove anos), sozinho e desamparado, o ch˜ao
l´a embaixo, entrei a gritar desesperadamente: “Mam˜ae! mam˜ae!”
Ela acudiu p´alida e trˆemula, cuidou que me estivessem matando,
apeou-me, afagou-me, enquanto o irm˜ao perguntava:
— Mana Gl´oria, pois um tamanh˜ao destes tem medo de besta
mansa?
— N˜ao est´a acostumado.
— Deve acostumar-se. Padre que seja, se for vig´ario na ro¸ca,
´e preciso que monte a cavalo; e, aqui mesmo, ainda n˜ao sendo
padre, se quiser florear como os outros rapazes, e n˜ao souber, h´a
de queixar-se de vocˆe, mana Gl´oria.
— Pois que se queixe; tenho medo.
— Medo! Ora, medo!
A verdade ´e que eu s´o vim a aprender equita¸c˜ao mais tarde,
menos por gosto que por vergonha de dizer que n˜ao sabia montar.
“Agora ´e que ele vai namorar deveras”, disseram quando eu comecei as li¸c˜oes. N˜ao se diria o mesmo de tio Cosme. Nele era velho
costume e necessidade. J´a n˜ao dava para namoros. Contam que,
em rapaz, foi aceito de muitas damas, al´em de partid´ario exaltado;
mas os anos levaram-lhe o mais do ardor pol´ıtico e sexual, e a gordura acabou com o resto de id´eias p´ublicas e espec´ıficas. Agora
s´o cumpria as obriga¸c˜oes do of´ıcio e sem amor. Nas horas de lazer
vivia olhando ou jogava. Uma ou outra vez dizia pilh´erias.'
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
    conteudo: 'O Cortiço — Capítulo I 
João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro que enriqueceu entre as quatro paredes de uma suja e obscura taverna nos refolhos do bairro de Botafogo; e tanto economizou do pouco que ganhara nessa dúzia de anos, que, ao retirar-se o patrão para a terra, pôde comprar o estabelecimento por uma quantia que não chegava a um terço do que ele realmente valia.  

Dali por diante, a sua vida foi um desespero de acumular dinheiro. Almoçava pão dormido e pontas de queijo; jantava azeite, feijão e farinha; a sua única despesa de luxo era o fumo de rolo, de que gastava dois tostões por semana. Dormia sobre o balcão da taverna, em cima de uma esteira rasgada, tendo por travesseiro um saco de estopas cheio de palha de milho. Não vinha nunca à rua senão para ir às compras no mercado; trazia as calças arregaçadas para não as sujar e andava descalço, descarregando ele próprio as carroças e arrumando os caixotes no armazém.

Por esse tempo, havia ao lado da taverna, à esquerda, uma quitandeira, preta, quase velha, chamada Bertoleza. Essa mulher, que era escrava de um velho cego residente em Juiz de Fora, vivia ali na cidade há muitos anos, à mercê de um jornal que pagava pontualmente ao seu senhor. Ganhara com que fartar o corpo e ainda lhe sobrava uma economiazita, que ela guardava em uma meia de lã, por baixo do colchão, com o fim de comprar um dia a sua liberdade.

João Romão propôs-lhe sociedade. Bertoleza aceitou, mudando-se com as suas panelas e os seus balaios para a taverna. Ela entrava com o trabalho e o seu pecúlio; ele com o estabelecimento e com a sua gerência. Daí em diante, as coisas correram de vento em popa. A crioula era uma verdadeira máquina de ganhar dinheiro; trabalhava das quatro da manhã às dez da noite, lavando, cozinhando, vendendo na quitanda e estendendo a roupa no varal.

Quando João Romão soube que a meia de lã da preta continha já a soma necessária para a alforria, propôs-se ele próprio a ir comprá-la ao senhor em Juiz de Fora. Fingiu que fizera a transação e entregou à crioula um papel falsificado como sendo a carta de liberdade. Bertoleza, que não sabia ler, chorou de gratidão e entregou-se de corpo e alma ao seu "salvador".

Atrás da taverna de João Romão estendia-se um grande terreno baldio, que ele conseguiu comprar por uma bagatela. Foi nesse terreno que o taverneiro começou a erguer o seu império. Comprou uma pedreira nos fundos e começou a vender pedra; com os lucros da pedreira e da taverna, comprou materiais de refugo e construiu as três primeiras casinhas de aluguel.

Eram três casinhas de porta e janela, feias, malfeitas, mas que se alugaram num abrir e fechar de olhos. João Romão viu ali a sua mina de ouro. Construiu mais seis, depois mais doze, depois trinta. Em menos de cinco anos, o terreno baldio transformara-se numa imensa estalagem, uma verdadeira colmeia humana.

E naquela terra encharcada e fumegante, naquela umidade quente e lodosa, começou a minhocar, a esfervilhar, a crescer, um mundo, uma coisa viva, uma geração, que parecia brotar espontânea, ali mesmo, daquele lameiro, e multiplicar-se como larvas no esterco.

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

E João Romão, fechado na sua taverna, contava o dinheiro do dia, ouvindo de longe o som dos violões e as gargalhadas da mulata, sorrindo satisfeito porque sabia que, no dia seguinte, toda aquela gente voltaria a trabalhar para ele, desde o amanhecer até o cair da noite.'
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
