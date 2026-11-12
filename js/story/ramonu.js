/* =========================================================================
   Rota de Mejiro Ramonu — "Um Amor Supremo"
   Conflito: a busca pela perfeição e um amor tão grande pelas corridas que
   todo o resto parece secundário — até aprender a valorizar os vínculos.
   (Cenas inspiradas no jogo, mas criadas para esta novel.)
   ========================================================================= */
VN.Script.add('ramonu', `
== ramonu_inicio
@musica cotidiano
@fundo portao manha preto
@som sino
Abril. As cerejeiras da Academia Tracen estavam no auge — e eu, no meu primeiro dia como {tt}.
@mostrar tazuna centro
tazuna [pulo]: Bom dia! Você deve ser {o} nov{o} {tt}! Seja muito bem-vind{o} à Academia Tracen!
tazuna: Hoje à tarde tem uma corrida simulada na pista principal. Algumas das alunas mais fortes da geração. Vale a pena assistir!
tazuna [gota]: Ah, e se você for... cuidado para não se apaixonar pela primeira corredora que vir. Acontece muito por aqui.

== r_cap1
# Capítulo 1 | Um amor supremo
@musica tensao
@fundo pista tarde preto
@ambiente vento
A corrida simulada já tinha começado quando cheguei à cerca. Oito garotas, dois mil metros.
@esconder todos
@musica corrida
@tracking on r_simulada em=1250
@tracking foco 5
@tracking ordem 3 / 7 5 / 1 8 / 2 6 / 4
@tracking ir 1000
@tracking marca 5 ♪
E uma delas não parecia estar correndo. Parecia estar dançando com as outras.
@tracking cutin ramonu
@tracking ordem 5 / 3 7 / 1 8 / 2 6 / 4
@tracking ir ultima
Cabelos negros com uma mecha branca, passada longa, olhos semicerrados como quem ouve uma música que mais ninguém escuta.
@tracking ordem 5 3 7 / 1 8 / 2 6 / 4
@tracking ir 480
Na última curva, ela deixou as rivais chegarem perto. Bem perto. Como se quisesse sentir a respiração delas.
@tracking aura 5 branca
@tracking rastro 5
@tracking marca 5 ♥
@tracking marca 3 !
@tracking marca 7 !
@tracking ordem 5 /5/ 3 7 / 1 8 / 2 6 / 4
@tracking ir chegada em=3.6
E então acelerou. Não como quem foge. Como quem abraça.
@tracking placar 5 3:5 7:1/2 1:1 8:cabeça
@esperar 1.8
@tracking off
@fundo pista tarde rapido
@musica ramonu
Ela venceu por cinco corpos. E, ao invés de comemorar, caminhou devagar até a cerca. Até mim.
@mostrar ramonu centro corrida
ramonu: Você.
ramonu: Estava olhando do jeito certo. Não para o placar. Não para mim. Para a corrida.
ramonu: Mejiro Ramonu. Lembre-se, porque eu não vou repetir.
? "Foi a corrida mais bonita que eu já vi." => r1_bonita | ramonu+1
? "Você deixou as outras se aproximarem de propósito na curva. Por quê?" => r1_porque | ramonu+2, flag:r_olhar
? "Prazer. Eu sou {o} nov{o} {tt}." => r1_prazer

== r1_bonita
ramonu: Bonita. Hm. Quase.
ramonu: Faltaram rivais. Uma corrida bela precisa de quem entregue tudo. Hoje, ninguém entregou.
@ir r1_decide

== r1_porque
ramonu [exclamacao]: ...
ramonu: Você percebeu.
ramonu: Porque uma vitória sem tensão é uma vitória sem gosto. Eu queria ouvir os passos delas perto de mim.
ramonu: Dezoito passadas na última curva. É o som mais bonito do mundo.
@ir r1_decide

== r1_prazer
ramonu: Eu sei o que você é. Tem o crachá no peito.
ramonu: O que eu não sei é se você é interessante.

== r1_decide
ramonu: Está decidido. Você será {o} meu {tt}.
eu: Assim? Sem conversa?
ramonu: Conversas são para quem tem dúvidas.
Ela se virou e foi embora, o rabo negro balançando como um pincel.
@esconder ramonu
@fundo escritorio manha preto
@musica cotidiano
No dia seguinte, esperei por ela na sala de treinadores com um plano de treino de doze páginas.
Ela não veio. Nem no outro dia. Nem no terceiro.
@fundo corredor dia
No quarto dia, cruzei com ela no corredor. Acenei.
@mostrar ramonu centro
ramonu: ...
ramonu: Nós nos conhecemos?
@esconder ramonu
E seguiu andando, como se eu fosse parte da paisagem.

== r_cap2
# Capítulo 2 | Pernas de vidro
@musica cotidiano
@fundo fonte tarde preto
@ambiente fonte
Uma semana depois, sentado diante da fonte das Três Deusas, eu ainda tentava entender o que tinha acontecido.
@mostrar ardan centro
ardan: Com licença... você é {o} {tt} da Ramonu-neesama?
ardan: Ah, desculpe! Mejiro Ardan. Sou a irmã mais nova dela.
Uma garota de cabelos claros, voz suave, postura delicada. Sentou-se ao meu lado com cuidado, como quem poupa as pernas.
ardan [gota]: Ela esqueceu de você, não foi? Eu imaginei.
ardan: Não é por mal. A Neesama ama uma única coisa no mundo: correr. Tudo o que não é corrida, ela... deixa cair.
ardan: Outros treinadores tentaram. Ela os escolhia, depois esquecia. Eles desistiam. Todos desistiram.
ardan [abatida]: E ela nunca soube por que eles foram embora. Acho que nem percebeu que eles vieram.
ardan: Eu tenho as pernas fracas. Pernas de vidro, os médicos dizem. A Neesama também era assim, quando éramos pequenas. Ela passou dois invernos inteiros sem poder correr.
ardan: Acho que é por isso que ela ama tanto. Porque um dia não pôde.
? "Eu não vou desistir dela." => r2_persiste | ramonu+1, flag:r_persiste
? "E você, Ardan? Como estão as suas pernas?" => r2_ardan | ramonu+1, flag:r_ardan
? "Talvez seja melhor eu procurar outra aluna." => r2_desiste | ramonu-1, flag:r_hesitou

== r2_persiste
ardan [brilho]: ...Não vai?
ardan: Então eu vou te contar um segredo. Aos domingos, a Neesama pinta no parque do lago. Sozinha. Sem celular. Ela nunca leva o celular.
ardan [coracao]: Se você for até lá... talvez ela te veja de verdade.
@ir r_cap3

== r2_ardan
ardan [exclamacao]: As minhas?
ardan [rubor]: Ninguém pergunta das minhas pernas quando a conversa é sobre a Neesama.
ardan: Estão... frágeis. Mas eu corro mesmo assim. Uma corrida curta e brilhante já me basta.
ardan: Você é gentil. A Neesama vai gostar de você, quando lembrar que você existe.
ardan: Aos domingos, ela pinta no parque do lago. Sem celular, claro. Ela nunca leva o celular.
@ir r_cap3

== r2_desiste
ardan [abatida]: ...Entendo. Todo mundo diz isso.
ardan: Se mudar de ideia... aos domingos ela pinta no parque do lago.
Ela se levantou devagar e foi embora. Eu fiquei com aquela informação pesando no bolso a semana inteira.

== r_cap3
# Capítulo 3 | Tinta a óleo
@musica ramonu
@fundo parque dia preto
@ambiente passaros
Domingo. O parque do lago estava cheio de famílias, patos e cachorros. E, num canto à sombra, um cavalete.
@mostrar ramonu centro
Ramonu pintava de óculos redondos, antigos, com aros dourados. A tela era uma explosão de vermelho, azul e uma linha negra que cortava tudo.
ramonu: ...Você está bloqueando a minha luz.
ramonu: Nós nos conhecemos?
? "Eu vi a sua corrida simulada. Quero uma campanha perfeita com você: a Tríplice Tiara, e depois as maiores rivais do país." => r3_promessa | ramonu+3, flag:r_reconheceu
? "O que você está pintando?" => r3_pintura | ramonu+1
? "Você fica ainda mais bonita de perto." => r3_elogio

== r3_pintura
ramonu: O som de dezoito passadas na última curva.
ramonu: As pessoas olham e veem manchas. Quem já correu de verdade vê a curva.
ramonu: Interessante você perguntar. Mas ainda não é suficiente para eu lembrar de você.
@ir r3_segunda

== r3_elogio
ramonu: Doze pessoas me disseram isso esta semana.
ramonu: Entediante.
Ela voltou a pintar como se eu tivesse evaporado.

== r3_segunda
Era agora ou nunca. Eu sabia que não teria outro domingo.
? Dizer tudo de uma vez: a corrida simulada, a curva, a promessa de uma campanha perfeita. => r3_promessa2 | ramonu+2, flag:r_reconheceu
? Ir embora em silêncio. => r_final_estranha

== r3_promessa2
@ir r3_promessa

== r3_promessa
eu: Eu vi você deixar as rivais chegarem perto na última curva. Vi você acelerar como quem abraça.
eu: Eu quero isso de novo. A Tríplice Tiara. E depois as rivais mais fortes que existirem. Uma campanha perfeita. Eu me dedico inteiramente a isso.
ramonu [exclamacao]: ...
Ela tirou os óculos devagar. Pela primeira vez, me olhou de verdade.
ramonu: Ah. Você.
ramonu: O que olhava do jeito certo.
ramonu: Ninguém nunca voltou para dizer isso. Eles voltavam para reclamar que eu tinha esquecido.
ramonu: Muito bem. Agora eu vou lembrar. Prometo.
Ela tirou da bolsa uma câmera antiga, de filme, e a estendeu para mim.
ramonu: Fotografe-me. Aqui, com a tela. Eu gosto de ser fotografada.
@som obturador
@efeito flash
ramonu [brilho]: Mais uma. Do lado esquerdo. É o meu melhor perfil.
@som obturador
@efeito flash

== r_cap4
# Capítulo 4 | Tríplice Tiara
@se !flag:r_reconheceu => r_final_estranha
@musica ramonu
@fundo terraco manha preto
@ambiente vento
Daquele dia em diante, Ramonu nunca mais esqueceu um treino. Esquecia o celular, a carteira, o almoço. Os treinos, nunca.
Toda manhã, antes de correr, ela fazia ioga no terraço. Eu aprendi a chegar em silêncio.
@mostrar ramonu centro
ramonu: Respirar é a primeira parte da corrida. Quem respira mal, corre com pressa. Quem corre com pressa, não ouve.
ramonu: E na pista é preciso ouvir tudo.
@mostrar kris esquerda
kris: ...Ramonu. Seu celular. Ficou no quarto. Tocou onze vezes.
ramonu: Obrigada, Kris. Pode deixar tocar mais.
kris: ...Entendido.
kris: Você é {o} {tt} dela? A Ramonu fala de um jeito fácil de entender. Diz o que quer. Faz o que diz. Não perca isso.
@esconder kris
@mover ramonu centro
@fundo hipodromo dia preto
@musica vitoria
@ambiente torcida
@mostrar ramonu centro corrida
@tracking resultado r_oka 8 11:2 3:1/2 14:pescoço 6:1
Oka Sho. Ela venceu como quem assina uma tela.
@tracking resultado r_oaks 5 2:1.5 9:cabeça 12:1/2 16:1
Yushun Himba. Venceu de novo, deixando as rivais chegarem perto na curva, como sempre.
@tracking placar off
@fundo pista tarde preto
@musica ramonu
@ambiente vento
Em setembro, num treino à tarde, Ramonu parou de repente e olhou para a arquibancada.
@mostrar ramonu centro
ramonu: Ali. Está vendo aquela menina pequena, de véu? Ao lado do treinador dela?
ramonu: Still in Love. A próxima a tentar a Tríplice Tiara. Quero ver uma coisa.
@esconder ramonu
Ela subiu as escadas da arquibancada com elegância. Conversou alguma coisa com o treinador da menina. Inclinou a cabeça, sorriu.
Mesmo de longe, eu vi a garota de véu aparecer atrás deles. Do nada. Como se sempre tivesse estado ali.
E vi o ar mudar ao redor dela.
@mostrar ramonu centro
Ramonu voltou rindo baixinho, satisfeita.
ramonu: Fascinante. Aquela menina ama com os dentes.
ramonu: Eu sugeri que poderia pegar o treinador dela emprestado. Para comparar métodos. Ela disse "eu me importo" num tom que me deu arrepios.
ramonu [brilho]: Agora ela vai correr com fogo. Uma rival sem fogo não serve para nada.
? "Isso foi cruel." => r4_cruel | ramonu+1
? "Você reconhece muito bem o que os outros sentem." => r4_sentir | ramonu+2, flag:r_sentir
? Rir junto. => r4_rir

== r4_cruel
ramonu: Talvez.
ramonu: Mas ela vai correr melhor. E eu nunca menti. Só disse o que poderia acontecer.
ramonu: Você é honesto comigo. Isso não é entediante.
@ir r4_shuka

== r4_sentir
ramonu [reticencias]: ...
ramonu: Reconhecer não é o mesmo que sentir.
ramonu: Eu vejo o que as pessoas sentem como vejo cores numa tela. Sei onde estão. Sei como usar.
ramonu: Senti-las... é outra coisa. Isso eu deixei para a pista.
Ela disse aquilo sem tristeza. Mas olhou para o próprio reflexo no vidro da arquibancada por um tempo longo demais.
@ir r4_shuka

== r4_rir
ramonu: Você ri fácil. Bom.
ramonu: As pessoas sérias demais esquecem que corrida também é festa.

== r4_shuka
@fundo hipodromo tarde preto
@musica vitoria
@ambiente torcida
@mostrar ramonu centro corrida
@tracking resultado r_shuka 12 4:1.5 9:1/2 1:cabeça 17:1
Em outubro, ela venceu o Shuka Sho. A Tríplice Tiara. A primeira da história da academia em muitos anos.
@tracking resultado d_amistosa 2 1:3
Na festa da família Mejiro, correu uma prova amistosa contra a prima Mejiro Dober e venceu sem suar.
@tracking placar off
ramonu: A Dober corre como quem pede desculpas. Um dia ela vai parar de pedir. Vai ser uma rival magnífica.
ramonu: Eu quero estar lá quando acontecer.

== r_cap5
# Capítulo 5 | Brasa de inverno
@musica ramonu
@fundo jardim dia neve preto
@ambiente vento
Inverno. A família Mejiro me convidou para o Ano-Novo na mansão. Ardan me levou para ver o jardim coberto de neve.
@mostrar ardan centro
ardan: Está vendo aquela árvore? A das florzinhas amarelas?
ardan: É um robai. Floresce no meio do inverno, quando todo o resto parece morto. O perfume é doce, doce.
ardan [coracao]: Foi a Neesama que plantou. Quando tinha nove anos. É a árvore favorita da família inteira.
ardan: Eu quero te mostrar outra coisa. Mas... não conta que fui eu.
Ela tirou de uma pasta uma pintura infantil, em papel amarelado. Uma janela cinzenta, pequena. Do lado de fora, figuras minúsculas correndo num campo verde.
ardan: A Neesama pintou isto quando estava doente. Dois invernos de cama. Ela via as outras correndo pela janela.
@mostrar ramonu direita
@mover ardan esquerda
ramonu: Ardan.
ardan [susto]: N-Neesama!
ramonu: Guarde isso.
A voz dela estava diferente. Seca. Quase ríspida. Eu nunca tinha visto Ramonu irritada.
ardan [abatida]: Desculpa... eu só queria mostrar que...
ramonu: Guarde. Agora.
Ardan guardou a pintura, com os olhos marejados. O jardim ficou tão silencioso que dava para ouvir a neve cair.
? Ficar ao lado de Ramonu, perto do robai, em silêncio. => r5_silencio | ramonu+2, flag:r_inverno
? Cuidar primeiro da Ardan, que está quase chorando. => r5_ardan | ramonu+1, flag:r_ardan2
? "Você não é mais aquela menina doente." => r5_menina | ramonu-1

== r5_silencio
@esconder ardan
@mover ramonu centro
Fiquei ao lado dela, diante da árvore. Sem dizer nada. O perfume das flores chegava em ondas, doce e frio.
ramonu: ...
ramonu: Eu odiava cada uma daquelas meninas da janela.
ramonu: E amava. As duas coisas ao mesmo tempo. Eu as via correndo e sentia que meu coração ia sair pela boca.
ramonu: Quando fiquei boa, plantei esta árvore. Porque ela floresce quando tudo parece morto.
ramonu [reticencias]: Foi a primeira coisa que eu fiz florescer no inverno. Depois vim eu.
Ela ficou em silêncio. Depois, sem me olhar, disse:
ramonu: Ardan está chorando ali atrás, não está?
ramonu: Eu vou arrumar o cabelo dela. Ela sempre se acalma quando eu arrumo o cabelo dela.
@ir r5_cabelo

== r5_ardan
@esconder ramonu
@mover ardan centro
Fui até Ardan e ofereci um lenço. Ela riu baixinho, envergonhada, e enxugou os olhos.
ardan [rubor]: Obrigada. A Neesama não é má. Só... aquela pintura dói nela.
@mostrar ramonu direita
ramonu: ...Você cuidou da Ardan primeiro.
ramonu: Bom. Era o certo.
@ir r5_cabelo

== r5_menina
ramonu: Não diga o que eu sou.
ramonu: Ninguém aqui tem o direito de dizer isso. Nem você.
Ela foi embora pela neve. Ardan me olhou com pena.
ardan: Não foi culpa sua. Ninguém sabe o que dizer sobre aquilo. Nem eu.
@ir r_cap6

== r5_cabelo
@mostrar ramonu meiodir
@mostrar ardan meioesq
Ramonu desfez o laço do cabelo da irmã e começou a trançá-lo, com os dedos frios e precisos.
ardan [coracao]: Neesama...
ramonu: Fica quieta. Está torto.
ardan: Está sempre torto quando você faz.
ramonu [reticencias]: ...Está.
Pela primeira vez, ouvi Ramonu rir. Um riso curto, de nariz, que ela tentou esconder atrás da mão.

== r_cap6
# Capítulo 6 | O Imperador e o vento livre
@musica tensao
@fundo pista tarde preto
@ambiente vento
Novembro do ano seguinte. A Japan Cup. As adversárias de Ramonu tinham nomes que faziam as outras alunas abaixarem a voz.
@mostrar rudolf esquerda
@mostrar mrcb direita
@mostrar ramonu centro
rudolf: Mejiro Ramonu. A Imperatriz das Tiaras. Será uma honra correr contra você.
rudolf: Dizem que a Japan Cup é dura. Mas eu prometo uma corrida que vai "cupar" o coração de todos.
mrcb [pulo nota]: Ahahaha! Essa foi horrível, Rudolf! Horrível!
mrcb: Mr. C.B. Prazer. Vai ser uma corrida de vento bom. Daquelas que levam a gente pra longe.
ramonu [brilho]: ...Finalmente.
ramonu: Finalmente uma corrida digna. Vocês duas vão entregar tudo. Eu sei. Eu sinto daqui.
Ela estava sorrindo. Não o sorriso calmo de sempre. Um sorriso largo, ansioso, quase infantil.
@esconder rudolf
@esconder mrcb
@mover ramonu centro
@fundo escritorio noite
@musica triste
@ambiente sala
Na véspera da corrida, à noite, o telefone da sala tocou. Era Kris.
kris: ...A Ardan caiu no treino. As pernas. Está na enfermaria. Chamaram a família.
@mostrar ramonu centro
Ramonu estava sentada no sofá, revisando o vídeo da última curva de Rudolf pela vigésima vez.
ramonu: O treino final é às cinco da manhã. Eu preciso dormir às dez.
ramonu: A Ardan tem a família. Os médicos. Eu tenho a Japan Cup.
Ela disse aquilo sem levantar os olhos da tela. Mas a mão que segurava o controle remoto estava tremendo.
? "Vá ver a Ardan. O treino espera. A corrida também." => r6_ardan | ramonu+2, flag:r_vinculo
? "O treino é o que importa amanhã. Foque." => r6_treino | flag:r_perfeicao
? "Faça o que achar melhor." => r6_neutro

== r6_ardan
ramonu [exclamacao]: ...
ramonu: Uma campanha perfeita. Foi o que você prometeu.
eu: Prometi. E uma campanha perfeita não tem você correndo com a cabeça na enfermaria.
ramonu [reticencias]: ...
Ela desligou a tela. Ficou um tempo parada. Depois pegou o casaco.
@fundo enfermaria noite preto
@mostrar ardan esquerda abatida
@mostrar ramonu direita
ardan: Neesama...? Você veio? Mas amanhã é a...
ramonu: Fica quieta. Seu cabelo está torto de novo.
Ramonu sentou na beira da cama e trançou o cabelo da irmã. Ardan riu e chorou ao mesmo tempo.
ardan [coracao]: Neesama, corre por você amanhã. E... um pouquinho por mim. Pelas duas meninas da janela.
ramonu: ...Por nós.
ardan: E deixa eu massagear suas orelhas antes de dormir. Até a pontinha. Você sempre corre melhor depois.
ramonu [rubor]: ...Ardan. Tem gente olhando.
ardan [nota]: {O} {tt} não conta pra ninguém.
@ir r_cap7

== r6_treino
ramonu: Foque. Sim. É o que eu sempre fiz.
Ela voltou para o vídeo. Às dez em ponto, foi dormir. Às cinco, estava na pista.
Durante o treino, olhou três vezes na direção da enfermaria.
@ir r_cap7

== r6_neutro
ramonu: O que eu achar melhor.
ramonu: Ninguém nunca me disse isso. Todos sempre souberam o que era melhor para mim.
Ela ficou sentada a noite inteira diante da tela desligada. De manhã, foi treinar com olheiras.

== r_cap7
# Capítulo 7 | Um amor supremo
@musica tensao
@fundo hipodromo dia preto
@ambiente torcida
A Japan Cup. Mais de cento e vinte mil pessoas. As melhores do país e do mundo no mesmo portão.
@mostrar ramonu centro corrida
ramonu: Ouça, {t}. Está ouvindo?
ramonu: O estádio inteiro respirando junto. Daqui a pouco, dezoito passadas na última curva.
ramonu: Diga alguma coisa. Para eu levar para a pista.
? [flag:r_vinculo] "A Ardan está assistindo da enfermaria. Corre por vocês duas." => r7_ardan | ramonu+1, flag:r_nos
? "Vai lá e ama essa corrida como você nunca amou." => r7_ama | ramonu+1
? "Vença. É o único resultado perfeito." => r7_venca

== r7_ardan
ramonu: As duas meninas da janela.
ramonu [brilho]: ...Sim. Vamos correr lá fora, então.
@ir r7_corrida

== r7_ama
ramonu: Como eu nunca amei.
ramonu: Você não sabe o quanto eu já amei. Mas vou te mostrar.
@ir r7_corrida

== r7_venca
ramonu: Vencer. Sim. É claro.
Ela assentiu, perfeita, distante. Já estava em outro lugar.

== r7_corrida
@esconder todos
@musica corrida
@tracking on r_jc
@esperar 0.6
@som portao
@tracking faixa LARGADA!
@tracking ordem 1 / 6 11 / 3 9 / 14 7 / 2 17 12 / 5 10 / 16 8 / 4 13 / 18 // 15
@tracking ir 1950
"Locutor": Abrem-se os portões da Japan Cup!
@tracking ordem 1 /1.5/ 6 11 / 3 14 / 9 7 / 2 17 / 12 5 10 / 16 8 / 4 13 18 /// 15
@tracking ir oposta
Rudolf tomou a frente como uma imperatriz assume o trono. Mr. C.B. ficou atrás, solta, deixando o vento escolher o caminho.
@tracking foco 9
@tracking marca 9 ♪
@tracking cutin ramonu
Ramonu ficou no meio. Ouvindo.
@tracking foco campo
@tracking rastro 15
@tracking ordem 1 / 6 11 >>15 / 3 9 / 14 7 / 2 17 / 12 5 10 / 16 8 / 4 13 18
@tracking ir ultima
"Locutor": Última curva! Symboli Rudolf na frente! Mr. C.B. vem por fora como um furacão! E Mejiro Ramonu... Mejiro Ramonu encosta nas duas!
@tracking rastro 15 off
@tracking ordem 1 9 15 / 6 11 / 3 14 / 7 2 / 17 12 / 5 10 16 / 8 4 / 13 18
@tracking ir 450
Na curva, as três ficaram tão perto que, da cerca, parecia uma única sombra de três cabeças.
@efeito vinheta 0.3
@tracking foco 9 perto
ramonu: *Isso. Isso. É este som.*
@se flag:r_nos => r7_nos
ramonu: *Dezoito passadas. As melhores do mundo. Perfeito.*
@ir r7_reta
== r7_nos
ramonu: *Está vendo, Ardan? Lá fora é assim.*
== r7_reta
@efeito vinheta 0
@tracking cutin off
@tracking foco campo
@tracking faixa RETA FINAL!
@tracking aura 1 branca
@tracking aura 15 branca
@tracking aura 9 branca
@tracking marca 9 !!
@tracking ordem 1 9 15 / 6 11 / 3 14 / 7 2 / 17 12 / 5 10 16 / 8 4 / 13 18
@tracking ir 160
@efeito tremor 12
"Locutor": As três lado a lado! Rudolf! Mr. C.B.! Ramonu! Que corrida! QUE CORRIDA!
@tracking ordem 1 9+0.45 15 / 6 11 / 3 14 / 7 2 / 17 12 / 5 10 16 / 8 4 / 13 18
@tracking ir chegada
"Locutor": Mejiro Ramonu! Por uma cabeça! Mejiro Ramonu vence a Japan Cup!
@efeito flash
@som torcida
@musica vitoria
@tracking placar 9 1:cabeça 15:focinho 6:3 11:1/2
@esperar 2
@tracking off
@fundo hipodromo dia rapido
@particulas confetti 0.6
@se ramonu>=9 && flag:r_vinculo => r_final_verdadeiro
@ir r_final_normal

== r_final_verdadeiro
@mostrar ramonu centro corrida
Ela não foi até o centro da pista. Não ergueu os braços. Veio direto até a cerca. Até mim.
ramonu [brilho]: {t}. Você viu?
ramonu: Foi perfeita. E não porque eu venci.
ramonu: Foi perfeita porque, pela primeira vez, eu sabia quem estava esperando do lado de fora.
@fundo jardim tarde neve preto
@musica ramonu
@mostrar ramonu meiodir
@mostrar ardan meioesq
Em janeiro, voltamos ao jardim. O robai estava em flor. Ardan andava de muletas, mas sorria.
ramonu: {t}. Fotografe-nos. As duas. Com a árvore.
ardan [coracao]: E {o} {tt} também! Com o temporizador!
ramonu: ...Com {o} {tt} também.
@som obturador
@efeito flash
@papel nota | Uma fotografia
Três pessoas diante de uma árvore florida na neve.
Uma está de muletas e ri.
Outra arruma o cabelo da primeira, distraída, olhando para o lado.
E a terceira foi pega no meio de um espirro. Ramonu insistiu em revelar mesmo assim.
@fimpapel
ramonu: O amor pelas corridas é o maior que eu tenho. Isso não mudou.
ramonu [rubor]: Mas descobri que não é o único.
@final ramonu_true | Florescer no Inverno | Final Verdadeiro | Ramonu continua amando as corridas acima de tudo — mas aprendeu que há flores que só desabrocham quando alguém fica ao lado no inverno. A menina da janela finalmente saiu para correr lá fora. E não está mais sozinha.

== r_final_normal
@mostrar ramonu centro corrida
Ela ergueu um braço para a arquibancada, impecável, como a capa de uma revista.
Depois caminhou até a cerca, ofegante, e me olhou.
ramonu: Uma campanha perfeita. Como você prometeu.
ramonu: Obrigada, {t}. Eu lembrei de você todos os dias. Isso já é muito, para mim.
@se flag:r_perfeicao => r_normal_ardan
@ir r_normal_fim
== r_normal_ardan
Mais tarde, quando ela soube que Ardan tinha assistido sozinha pela televisão da enfermaria, ficou um longo tempo em silêncio.
== r_normal_fim
@fundo parque tarde v=outono preto
@musica ramonu
@mostrar ramonu centro
No domingo seguinte, ela voltou a pintar no parque. Desta vez, me deixou ficar ao lado do cavalete.
A tela nova era quase toda vermelha. No meio, três manchas negras, juntas, numa curva.
ramonu: Ainda falta alguma coisa nesta tela. Não sei o quê.
ramonu: Talvez você descubra antes de mim.
@final ramonu_normal | A Corrida Perfeita | Final | Ramonu conquistou tudo o que perseguia, numa campanha sem falhas. Ela agora lembra de você todos os dias — e, aos poucos, começa a perceber que há coisas que não cabem numa tela, nem numa pista.

== r_final_estranha
@musica triste
@fundo parque tarde preto
Fui embora em silêncio. Ela nem levantou os olhos da tela.
@fundo hipodromo dia lento
Meses depois, vi Ramonu vencer a Tríplice Tiara da arquibancada, misturad{o} à multidão. Ela tinha encontrado outro treinador. E esquecido dele também, imagino.
Ela corria lindamente. Deixava as rivais chegarem perto na última curva, como sempre.
E eu nunca soube se, por um segundo, ela procurou na cerca alguém que olhasse do jeito certo.
@final ramonu_stranger | Uma Estranha na Pista | Final Solitário | Ramonu continua amando as corridas com toda a sua existência — e esquecendo tudo o que não é corrida. Talvez um dia alguém volte ao parque do lago e diga as palavras certas.
`);
