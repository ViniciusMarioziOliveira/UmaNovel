/* =========================================================================
   Rota de Loves Only You — "Love para o Mundo Inteiro"
   Conflito: a necessidade de se conectar e retribuir o carinho que recebe.
   (As cenas são inspiradas no jogo e na carreira da égua real,
   mas foram criadas para esta novel.)
   ========================================================================= */
VN.Script.add('loves', `
== loves_inicio
@musica cotidiano
@fundo portao manha preto
@som sino
Abril. As cerejeiras da Academia Tracen estavam no auge — e eu, no meu primeiro dia como {tt}.
@mostrar tazuna centro
tazuna [pulo]: Bom dia! Você deve ser {o} nov{o} {tt}! Seja muito bem-vind{o} à Academia Tracen!
tazuna: Eu sou Tazuna Hayakawa, secretária da diretoria. Vou te mostrar o campus, tudo bem?
eu: Por favor. Eu ainda me perco até no caminho do portão.
tazuna [nota]: Normal! Ah, só um aviso: se formos passar pelo pátio da fonte... sorria.
eu: Sorrir?
tazuna [gota]: Tem uma aluna que faz transmissões ao vivo de lá quase toda manhã. Você pode acabar aparecendo para alguns milhares de pessoas.
tazuna: A diretoria até criou uma regra só pra ela: "proibido transmitir dentro do vestiário". Ela respeita. Na maior parte do tempo.

== l_cap1
# Capítulo 1 | Ao vivo!
@musica loves
@fundo fonte manha
@particulas petals
@esconder tazuna
Tazuna foi chamada por um rádio e me deixou no pátio da fonte, com a estátua das Três Deusas brilhando ao sol.
Foi aí que eu ouvi.
"???": E aí, meus amores! Bom diaaa! Hoje o céu tá tão bonito que eu tinha que mostrar pra vocês! ♡
@live on 1240 Loves♡Channel — bom dia da Tracen!
@live fluxo on
@mostrar loves esquerda coracao
Uma garota de cabelos vermelhos, com um celular preso num pau de selfie, girava em frente à fonte como se fosse um palco.
loves: Olha a estátua das Três Deusas! Olha as pétalas! Olha—
loves [exclamacao]: Ah! Chat, chat, olha atrás de mim! Uma pessoa nova!
@chat moranguinho_22: QUEM É????
@chat umafan.br: {um} {tt} nov{o}?? kkkk
@chat kei_0326: 新しいトレーナーさん!?
loves [pulo]: Você é {o} {tt} nov{o} que todo mundo tá comentando? Diz oi pros meus amores!
Milhares de pessoas. Ao vivo. Às oito da manhã.
? Acenar para a câmera e cumprimentar o chat. => l1_oi | loves+2, flag:l_live_oi
? Sair do quadro, morrendo de vergonha. => l1_timido | loves+1
? Você não devia estar treinando? => l1_serio | flag:l_serio

== l1_oi
eu: Oi, pessoal! Prazer! Eu... sou {o} {tt} nov{o}.
@chat moranguinho_22: OIIIII ♡♡♡
@chat tia.sandra: que educad{o}!
@chat patas_rapidas: {t} aparecendo na live no primeiro dia kkkk lenda
loves [coracoes]: Viu?! Já amaram você! O chat nunca erra! ♡
@ir l1_gato

== l1_timido
Dei dois passos para o lado, para fora do enquadramento, com o rosto pegando fogo.
@chat pipoca.doce: kkkkkk fugiu
@chat chuchu: tímid{o}! que fofo
loves [nota]: Que fofo! Chat, {ele} é tímid{o}! A gente vai cuidar bem {dele}, né? ♡
@chat marmelada: protegeremos {o} {tt}
@ir l1_gato

== l1_serio
@chat pipoca.doce: KKKKKKKK
@chat salve.salve: tomou
loves [gota]: Eu estou treinando! Treinando o meu love! É um músculo muito importante!
loves: ...Tá, tá. Daqui a dez minutos eu vou pra pista. Prometo. Fala tchau pro chat, pelo menos!
Ela fez um biquinho tão dramático que eu ri sem querer. O chat inteiro riu junto.

== l1_gato
@som miau
loves [susto]: Hm? Ah, não. Não, não, não—
Um gato malhado saiu de trás de um arbusto, viu o rabo vermelho balançando e atacou como se fosse o maior novelo do mundo.
@efeito tremor 10
loves [salto gota]: AAAH! De novo não! Meu rabo não é brinquedo!
@chat umafan.br: GATOOOO
@chat ch1ro: o gato é o novo membro do fã-clube
@chat ayumi_r: ねこちゃんwww
@chat fã_n°1: #GatoDaLoves
O celular caiu na grama, filmando o céu. A live mostrou dois minutos de nuvens e gritos.
Quando ela finalmente recuperou o celular, o gato estava sentado na fonte, satisfeito.
loves [coracao]: ...Bom, chat. Esse é o Pudim. Ele é o meu maior fã. Eu acho. Tchau, meus amores! Até de noite! ♡
@live off
@mostrar loves centro
loves: Ufa. Desculpa por isso. Meu rabo atrai gatos. É sério. Ninguém sabe por quê.
loves: Eu sou a Loves Only You! Mas pode me chamar de Loves. Todo mundo chama.
eu: Você faz isso todo dia? Transmitir?
loves [brilho]: Todo dia! Eu tenho um fã-clube, sabia? Faço vídeos, edito, respondo comentário, mando cartinha...
loves: Meus fãs me dão tanto amor... que eu quero devolver tudo. E o jeito que eu tenho de devolver é correndo.
loves: Cada vitória é uma carta de amor pra eles. Pra todo mundo. Pro mundo inteiro!
Ela falava aquilo com tanta convicção que parecia simples.
loves: E aí, {t}? Quer ser o primeiro membro oficial do meu fã-clube...
loves [coracoes]: ...ou {o} {meu} {tt}? Ou os dois! Os dois é a resposta certa! ♡

== l_cap2
# Capítulo 2 | Cartas em forma de coração
@musica cotidiano
@fundo estudio dia preto
O ano clássico começou. Loves treinava pesado de manhã, estudava à tarde e, à noite, editava vídeos na sala de mídia da escola.
Foi lá que eu a encontrei numa tarde de março, cercada de papéis coloridos.
@mostrar chrono direita
@mostrar loves esquerda
loves [nota]: Oi, {t}! Senta! Essa aqui é a Chrono, minha colega de quarto!
chrono: Chrono Genesis. Prazer. Não repare. Ela me trouxe "para estudar junto".
Chrono tinha um livro de história do Japão aberto. Loves, atrás dela, trançava o cabelo da amiga sem pedir licença.
chrono [reticencias]: Loves. Se você continuar trançando meu cabelo, eu vou esquecer o ano da Batalha de Sekigahara.
loves [coracao]: 1600! Viu? Te ajudei!
chrono: ...Isso é verdade. Infelizmente.
Na mesa, dezenas de folhas dobradas em forma de coração, cada uma com um nome escrito em cima.
eu: Isso tudo é...?
loves: Cartinhas de agradecimento! Pra quem me mandou desenho esse mês. Eu dobro em coração antes de entregar. É a minha marca registrada!
loves: Quer aprender? É fácil! Mais ou menos. Depois do vigésimo você pega o jeito.
? Me ensina a dobrar. => l2_dobra | loves+1, flag:l_dobrou
? Melhor eu só assistir. => l2_assiste

== l2_dobra
Ela me ensinou com uma paciência que eu não esperava. Dobra aqui, vira ali, encaixa a pontinha.
Meu primeiro coração parecia uma batata. O segundo, uma batata menor.
loves [coracoes]: Ficou lindo! Torto é charme! Guarda esse, é o seu primeiro!
chrono: Historicamente, a primeira obra de qualquer artista é ruim. Você está no caminho certo.
@ir l2_desenhos

== l2_assiste
Ela dobrou três corações em menos de um minuto, cantarolando. Os dedos sabiam o caminho sozinhos.
chrono: Ela faz isso até dormindo. Literalmente. Eu já vi.

== l2_desenhos
@esconder chrono
@mover loves centro
Depois, ela me mostrou o mural na parede. Dezenas de desenhos de fãs, presos com tachinhas coloridas.
loves: Esse aqui é de uma menininha de sete anos. Olha os meus cílios! Ela fez cílios! ♡
loves: Esse veio da França. Esse da Austrália. Esse eu nem sei de onde é, mas olha que coração enorme!
loves: Antes de toda corrida eu venho aqui e olho pra eles. Aí eu lembro por que eu corro.
loves [rubor]: Eu sou péssima desenhando, sabia? Por isso eu acho que quem desenha faz mágica.
@fundo pista dia
@musica tensao
Duas semanas antes do Oka Sho, percebi que ela pisava diferente com a perna direita.
@mostrar loves centro
loves [gota]: Não é nada! Só um machucadinho. Já já passa!
@fundo enfermaria manha
@mostrar loves esquerda
"Médica": É uma infecção bacteriana. Nas duas pernas, mas a direita está pior.
"Médica": Com antibiótico e repouso, ela se recupera. Mas correr o Oka Sho daqui a duas semanas... é arriscado. Pode piorar bastante.
loves [abatida]: Mas eu prometi. Eu prometi na live. Todo mundo vai estar esperando no Oka Sho.
loves: Eles fizeram faixas. Tem gente comprando passagem pra ir ver. Eu não posso...
Ela olhou para mim. Pela primeira vez desde que a conheci, sem nenhum coração na voz.
? Sua saúde vem primeiro. Vamos mirar no Oaks. => l2_cuidou | loves+2, flag:l_cuidou
? Se você quer correr, a gente tenta. => l2_forcou | flag:l_forcou

== l2_cuidou
eu: Loves. Seus fãs te amam. Não amam o Oka Sho.
eu: Se você se machucar de verdade por causa deles, quem vai sofrer mais são eles.
loves [abatida]: ...
loves: Você vai me ajudar a explicar pra eles?
eu: Vou estar do seu lado.
@fundo estudio noite
@live on 2980 Loves♡Channel — um aviso importante
@mostrar loves centro
loves: Oi, meus amores. Hoje a live é curtinha. Eu... tenho um aviso.
loves: Eu não vou correr o Oka Sho. Machuquei as pernas e preciso me cuidar. Desculpa. Desculpa mesmo.
@chat tia.sandra: saúde em primeiro lugar, filha!
@chat moranguinho_22: a gente espera!!! ♡
@chat NightOwl: take care Loves!! we love you
@chat fã_n°1: vou te esperar no Oaks. e no próximo. e no próximo.
@chat kei_0326: ゆっくり休んでね ♡
loves [coracoes]: Vocês... vocês são...
Ela não terminou a frase. Ficou olhando a tela, os olhos brilhando, enquanto os corações subiam sem parar.
@live off
@ir l_cap3

== l2_forcou
loves [brilho]: Sério?! Obrigada, {t}! Eu sabia que você ia entender!
Ela treinou com antibiótico e gelo, sorrindo para a câmera todos os dias.
@fundo enfermaria manha preto
@musica triste
Na manhã do Oka Sho, a perna direita estava inchada demais para calçar a sapatilha.
@mostrar loves centro abatida
Ela assistiu à corrida pela televisão da enfermaria. Em silêncio. Os fãs na arquibancada seguravam faixas com o nome dela.
loves: ...Eles foram até lá. Por minha causa.
loves: E eu não estava lá.
eu: A culpa é minha. Eu devia ter te protegido. Não era hora de dizer sim.
loves [reticencias]: ...
loves: A gente errou junto, então. Tá bom. Juntos é melhor que sozinha.
loves [levanta]: Oaks. A gente vai pro Oaks. E dessa vez a gente faz direito.
@afeto loves +1
@marcar l_desculpa

== l_cap3
# Capítulo 3 | Oaks
@musica tensao
@fundo hipodromo dia preto
@ambiente torcida
Maio. Yushun Himba — o Oaks japonês. Dois mil e quatrocentos metros, a distância mais longa que ela já tinha corrido.
@mostrar loves centro corrida
Ela apareceu com o traje de corrida: preto e verde, cheio de laços e babados, com um chapéuzinho torto na cabeça.
loves [coracao]: E aí? Tô digna de Oaks? ♡
Antes de entrar, ela abriu um envelope e espiou uma pilha de desenhos de fãs. Um por um.
Depois tirou do bolso um coração de papel e enfiou no meu.
loves: Abre só depois da corrida. Promete!
? Vai lá e devolve todo esse amor! => l3_amor | loves+1
? Eu também fiz uma coisa pra você. (um desenho seu, bem torto) => l3_desenho | loves+2, flag:l_desenho
? Concentra. Lembra da estratégia: guardar até a reta. => l3_foco

== l3_amor
loves [pulo]: Deixa comigo! Love em dobro! Love ao quadrado!
@ir l3_corrida

== l3_desenho
Tirei do bolso uma folha dobrada. Eu tinha passado a noite tentando desenhá-la. O resultado era... honesto.
loves [exclamacao]: Isso sou eu?!
loves: As orelhas tão parecendo de coelho. O chapéu tá maior que a cabeça. E por que eu tô com três dedos?
eu: É estilo.
loves [coracoes]: É o melhor desenho que eu já ganhei na vida! Eu vou pendurar no meio do mural! No MEIO!
Ela guardou o papel dentro da luva, junto da mão. Correu com ele.
@ir l3_corrida

== l3_foco
loves: Guardar até a reta. Paciência. Tá bom. Eu consigo ser paciente. Às vezes.
loves [nota]: ...Tá, nunca. Mas hoje eu tento!

== l3_corrida
@esconder todos
@musica corrida
@tracking on l_oaks
@esperar 0.6
@som portao
@tracking faixa LARGADA!
@tracking ordem 4 / 8 1 / 15 6 / 12 3 9 / 17 2 / 10 14 / 5 11 13 / 7 16 / 18
@tracking ir 1950
"Locutor": Largada para o Yushun Himba! Dezoito jovens estrelas em busca da coroa!
@tracking foco 12
@tracking ordem 4 8 / 1 15 / 6 3 / 12 9 17 / 2 10 / 14 5 / 11 13 7 / 16 18
@tracking ir 600
@tracking marca 12 ♥
@tracking cutin loves
Ela ficou no meio do grupo por mil e oitocentos metros. Paciente. Mais paciente do que eu jamais a tinha visto.
@tracking ordem 4 8 / 1 15 6 / 3 9 >12 / 17 2 / 10 14 / 5 11 / 13 7 / 16 18
@tracking ir 400
@tracking marca 12 !
"Locutor": Faltam quatrocentos metros! Loves Only You começa a avançar por fora!
@tracking faixa RETA FINAL!
@tracking aura 12 branca
@tracking rastro 12
@tracking marca 12 !!
@tracking ordem >12 /1.5/ 4 8 / 1 15 6 / 3 9 / 17 2 / 10 14 / 5 11 / 13 7 / 16 18
@tracking ir 120
@efeito tremor 10
"Locutor": Loves Only You! Loves Only You dispara! Ninguém alcança! É recorde! É recorde da corrida!
@tracking ordem >12 /2.5/ 4 / 8 1 / 15 6 / 3 9 / 17 2 / 10 14 / 5 11 / 13 7 / 16 18
@tracking ir chegada
@efeito flash
@som torcida
@musica vitoria
@tracking placar 12 4:2.5 8:1/2 1:pescoço 15:1
@esperar 2.2
@tracking off
@fundo palco noite preto
@ambiente live
@particulas hearts
@mostrar loves centro corrida
Naquela noite, no Winning Live, o estádio virou um mar de bastões de luz.
Ela cantou com a voz rouca de tanto agradecer. Mandou corações para a plateia inteira. Para a câmera. Para mim, na lateral do palco.
loves [coracoes]: Obrigada, meus amores! Obrigada, obrigada, obrigada! ♡♡♡
Quando tudo acabou, lembrei do coração de papel no meu bolso.
@se flag:l_forcou => l3_carta_erro
@papel carta | Para {t} ♡
Obrigada por cuidar das minhas pernas,
do meu coração e dos meus sonhos.
Você me disse não quando eu precisava ouvir não.
Isso também é amor, né?
Agora eu sei.
— Loves ♡
@fimpapel
@ir l_cap4
== l3_carta_erro
@papel carta | Para {t} ♡
A gente errou junto no Oka Sho.
E acertou junto hoje.
Obrigada por pedir desculpa. Ninguém nunca tinha pedido desculpa pra mim por me deixar fazer o que eu queria.
Isso também é amor, né?
— Loves ♡
@fimpapel

== l_cap4
# Capítulo 4 | Um dia sem fazer nada
@musica loves_calmo
@fundo escritorio manha preto
Verão. Notei olheiras fundas no rosto dela, mesmo por baixo da maquiagem de live.
@mostrar loves centro
eu: Até que horas você ficou acordada ontem?
loves [gota]: ...Três? Três e meia? Tinha o vídeo dos bastidores do Oaks pra editar! Os fãs pediram!
eu: Hoje é folga. Folga total. Sem treino, sem live, sem edição.
loves [exclamacao]: O dia INTEIRO? Sem fazer NADA?
loves: Isso é tortura. Eu detesto passar o dia sem fazer nada. Eu fico... inquieta. Fico achando que tô devendo alguma coisa pra alguém.
loves: Descansar fazendo alguma coisa conta? Tipo... jogar? Por favor?
? Tá bom. Uma partida de jogo de luta. Uma. => l4_luta | loves+1
? Que tal um jogo de terror, bem tranquilo? => l4_terror | loves+1, flag:l_terror
? Nada. A gente deita no tapete e olha as nuvens pela janela. => l4_nuvens | loves+2, flag:l_descanso

== l4_luta
Uma partida virou dez. Dez viraram vinte. Eu perdi todas. Ela não perdia nem a concentração.
loves [brilho]: PERFECT! De novo! Mais uma! Você tá melhorando, juro! Tipo, um por cento!
Descobri que a garota mais doce da Tracen se transforma num monstro com um controle na mão.
loves: Desculpa. Eu levo jogo de luta muito a sério. É o único lugar onde eu não divido o amor com ninguém. ♡
@ir l4_marche

== l4_terror
Escolhi o jogo mais leve que encontrei: uma casa assombrada com fantasminhas fofos.
O primeiro fantasma apareceu na porta.
@efeito tremor 14
loves [salto gota]: AAAAAAAAAAH!
Ela se escondeu atrás de uma almofada do sofá. Depois atrás de duas almofadas. Depois atrás do sofá inteiro.
loves: DESLIGA! DESLIGA! Ele olhou pra mim! Ele OLHOU!
eu: Era um fantasminha de pijama.
loves [raiva]: Um fantasminha de pijama MALIGNO!
Rimos até perder o fôlego. Foi o descanso mais cansativo da história. E o mais divertido.
@ir l4_marche

== l4_nuvens
Deitamos no tapete da sala, debaixo da janela. Ela durou quarenta segundos parada.
loves [gota]: Isso é muito difícil. O céu não tem botão de curtir.
eu: Aquela nuvem parece um gato.
loves: ...Parece o Pudim. Gordinho. Aquela ali parece um coração. Torto. Igual ao seu primeiro.
Aos poucos, a voz dela foi ficando mais devagar. E mais devagar.
@emote loves zzz
Dormiu. No meio de uma frase sobre uma nuvem em forma de troféu.
Dormiu três horas seguidas, com o rabo enrolado e um sorriso bobo. Nenhum fã viu. Foi só dela.

== l4_marche
@fundo escritorio tarde
@mostrar marche direita
@mover loves esquerda
@som porta
marche: Com licença. Disseram que a Loves estava... de folga? Eu precisava ver isso com os meus próprios olhos.
loves [pulo coracoes]: MARCHE! Veio me visitar!
marche: Trouxe macarons. Os de framboesa que você gosta. Bonjour, {t}. Marche Lorraine. Amiga de infância dessa criatura.
Elas conversaram, riram, dividiram os macarons. Depois Loves saiu para buscar chá, e Marche ficou me olhando, séria.
@esconder loves
@mover marche centro
marche: Posso te dizer uma coisa sobre ela?
marche: A Loves dá tudo pra todo mundo. Sempre deu. Quando éramos pequenas, ela dava o lanche dela pra quem estivesse triste.
marche: Às vezes eu tenho medo de que não sobre nada pra ela mesma.
marche: Ela não suporta ficar longe das pessoas. O amor dela precisa ir e voltar, sabe? Como uma bola de tênis.
marche [abatida]: Se um dia ela não puder alcançar ninguém... cuida dela. Por favor.
eu: Eu prometo.
marche: Bon. Eu acredito em você. Mais ou menos. Prove.

== l_cap5
# Capítulo 5 | Dubai
@musica loves
@fundo aeroporto noite preto
@ambiente aeroporto
Fevereiro do ano sênior. Uma corrida internacional em Dubai. O primeiro voo de Loves para fora do Japão.
@mostrar loves centro
@live on 5120 Loves♡Channel — partiu Dubai!!
loves [brilho]: Meus amores do mundo inteirooo! Olha esse aeroporto! Olha esse avião! Eu vou correr no deserto!
@chat NightOwl: GO LOVES GO
@chat kei_0326: いってらっしゃい!
@chat umafan.br: traz um camelo de lembrança
loves [coracao]: Um camelo não cabe na mala! Mas eu trago a vitória! ♡
@live off
@fundo aeroporto noite v=dubai preto
@musica tensao
Dubai era quente, enorme, cheia de luzes. Por alguns dias, foi um sonho.
Então as notícias mudaram. Uma doença nova se espalhando pelo mundo. Países fechando as fronteiras. Eventos sendo cancelados um atrás do outro.
Uma noite antes da corrida, chegou o comunicado: a corrida estava cancelada. Tínhamos que voltar para casa. Imediatamente.
@mostrar loves centro
loves: Tá tudo bem! A gente volta, treina mais e vem outra vez! Né? Né, chat?
@live on 4100 Loves♡Channel — voltando pra casa
@chat tia.sandra: volta com cuidado, filha
@chat ayumi_r: 気をつけてね…
@chat marmelada: será que vai ter corrida no Japão?
@chat patas_rapidas: dizem que vão fechar tudo
loves [gota]: Vai dar tudo certo! Gente, vai dar tudo certo! Eu prometo!
A voz saiu alta demais. Animada demais.
@live off
@fundo ceu noite lento
@musica triste
No avião, as luzes da cabine já estavam apagadas. Ela olhava pela janela, para o escuro.
@mostrar loves centro abatida
loves: ...Eu não consegui nem correr. Todo mundo torcendo, e eu não consegui nem correr.
loves: E eles estão com medo. Eu vi no chat. Eu não sei o que dizer pra eles.
? Oferecer um fone de ouvido: uma playlist de músicas que os fãs fizeram pra ela. => l5_fone | loves+1
? Tudo bem ficar triste. Hoje você não precisa ser forte por ninguém. => l5_triste | loves+2, flag:l_triste_ok
? Pensa nas próximas corridas. => l5_proximas

== l5_fone
Ela pôs o fone. A primeira música era um cover desafinado de uma canção dela, gravado por uma criança.
loves [abatida coracao]: ...Isso é jogo sujo, {t}.
Ela chorou baixinho a playlist inteira. E dormiu antes da décima música.
@ir l_cap6

== l5_triste
loves: Mas se eu ficar triste... eles ficam tristes também.
eu: Hoje eles não estão vendo. Hoje sou só eu.
eu: Deixa que eu fico com a tristeza um pouco. Amanhã você volta a ser a Loves de sempre.
loves [abatida]: ...
Ela encostou a cabeça na janela e chorou. Do jeito que chora quem passou meses sorrindo para uma câmera.
loves: Obrigada por não pedir pra eu sorrir.
@ir l_cap6

== l5_proximas
loves [aceno]: É... as próximas. Tem razão. Vai ter outras.
Ela sorriu. Mas era o sorriso da live. Eu já sabia diferenciar.

== l_cap6
# Capítulo 6 | Arquibancadas vazias
@musica tensao
@fundo hipodromo dia v=vazio preto
@ambiente vazio
As corridas voltaram meses depois. Sem público.
@tracking on l_vazio em=420
@tracking foco 5
@tracking ordem 8 / 5 2 / 11 1 / 3 9 / 6 12 / 4 10 / 7
@tracking ir 170
Nunca vou esquecer o som daquela primeira corrida: os cascos, o vento, o locutor... e nada mais. Nenhum grito. Nenhuma palma.
@tracking ordem 8 /0.5/ 5 / 2 11 / 1 3 / 9 6 / 12 4 / 10 7
@tracking ir chegada
@esperar 1.6
@tracking placar 8 5:1/2 2:1 11:cabeça 1:1
@esperar 2
@tracking off
@mostrar loves centro corrida
Ela terminou em segundo. Desacelerou, acenou para a arquibancada por reflexo.
Para assentos verdes, vazios, alinhados até onde a vista alcançava.
loves [abatida]: ...
"Locutor": Informamos que, por questões de segurança, a apresentação do Winning Live está suspensa.
@fundo estudio noite preto
@musica loves_calmo
@mostrar loves centro
@live on 8800 Loves♡Channel — corrida de hoje!
Naquela noite ela abriu uma live. Mais gente do que nunca, todos presos em casa.
@chat fã_n°1: SEGUNDO LUGAR!!! ORGULHO!!
@chat moranguinho_22: eu gritei tanto que o vizinho bateu na parede kkkk
@chat NightOwl: we watched from London ♡
loves: Obrigada, meus amores... eu... eu fico tão feliz que vocês...
Ela parou no meio da frase. Ficou olhando os nomes passando na tela.
loves [abatida]: Desculpa. Eu não consigo sentir vocês. Vocês estão aí, eu sei que estão, mas eu não consigo *sentir*.
loves: A gente se fala amanhã, tá? Eu prometo. Amanhã.
@live off
@fundo palco noite v=vazio preto
@ambiente vazio
@musica parar
Mais tarde, encontrei Loves no palco do Winning Live. O estádio estava escuro. Só uma luz de serviço acesa.
@mostrar loves centro
Ela cantava baixinho. A música que teria cantado se houvesse plateia. Para cadeiras vazias.
loves: Será que o amor só funciona quando a gente vê o rosto das pessoas?
loves: Eu sempre achei que eu era forte. Mas acho que eu só era... alimentada. Por eles.
loves [abatida]: Sem eles, eu não sei correr.
Lembrei da promessa que fiz a Marche. "Se um dia ela não puder alcançar ninguém."
? Sentar na primeira fila: "Eu tô aqui. Canta pra mim." => l6_plateia | loves+2, flag:l_plateia
? [loves>=6] Mostrar o que você guardou: centenas de cartas e desenhos que os fãs mandaram pelo correio. => l6_mural | loves+2, flag:l_mural
? Vamos embora. Tá frio. => l6_embora

== l6_plateia
Desci até a primeira fila e me sentei. Liguei a lanterna do celular e levantei, como um bastão de luz.
eu: A plateia de hoje é pequena. Mas é muito exigente.
loves [exclamacao]: ...
Ela riu. Um riso molhado, tremido. Depois endireitou as costas, do jeito que faz antes de entrar no portão.
@musica loves_calmo
@particulas hearts 0.5
loves: Então... boa noite, Winning Live! Essa é pra você! ♡
Ela cantou a música inteira. Com coreografia, com sorriso, com o coração de mão no final. Para uma pessoa.
Eu balancei a lanterna o tempo todo. Errei o ritmo duas vezes. Ela fingiu não perceber.
loves [coracoes]: ...Eu senti.
loves: Eu senti você. O amor não precisa de estádio cheio pra ser de verdade. Precisa de alguém do outro lado.
@ir l6_check

== l6_mural
eu: Espera aqui. Eu já volto.
Voltei com três caixas de papelão. Durante meses, eu tinha guardado tudo o que chegava pelo correio da escola.
Cartas. Desenhos. Corações de papel tortos — os fãs tinham aprendido com ela. Bandeirinhas de vinte países.
Espalhei pelas cadeiras da primeira fila. Depois da segunda. Depois da terceira.
loves [exclamacao]: ...Isso é...
eu: Eles não puderam vir. Mas mandaram isso. Eles estão aqui, Loves. Em cada cadeira.
@musica loves_calmo
@particulas hearts 0.6
Ela desceu do palco e andou entre as fileiras, lendo nome por nome, cidade por cidade.
loves [coracoes]: Tem uma da menininha dos cílios. Ela tá maior. O desenho tá melhor.
loves: Eles continuaram aqui. Esse tempo todo. Mesmo sem me ver.
loves: ...O amor não precisa ser visto pra ser real, né?
@ir l6_check

== l6_embora
loves [abatida]: ...É. Tá frio.
Ela desceu do palco devagar. Apagou a luz de serviço. Fomos embora em silêncio.

== l6_check
@se loves<4 => l_final_off
@marcar l_ok

== l_cap7
# Capítulo 7 | Loves Only You
@musica loves
@fundo hipodromo dia v=delmar preto
@ambiente torcida
Novembro do ano seguinte. Del Mar, Califórnia. Breeders' Cup.
Palmeiras, cheiro de mar, um céu tão azul que parecia pintado. E uma arquibancada que voltava, aos poucos, a ter gente.
@mostrar marche esquerda corrida
@mostrar loves direita corrida
marche: Bon. Você no Filly & Mare Turf, eu no Distaff à noite. Duas meninas de Hokkaido nos Estados Unidos.
loves [coracoes]: Se a gente ganhar as duas, eu vou chorar tanto que vão ter que me tirar da pista de maca.
marche: Se a gente ganhar as duas, eu deixo você chorar no meu ombro. Uma vez.
@esconder marche
@mover loves centro
@live on 64200 Loves♡Channel — DIRETO DA BREEDERS' CUP!!
@live fluxo on
loves: Meus amores do mundo inteiroooo! Eu tô em Del Mar!
@chat NightOwl: GO LOVES!!! from California ♡
@chat umafan.br: VAMOS LOVES! O BRASIL TÁ ACORDADO!
@chat kei_0326: がんばれラヴズ!!!
@chat amélie_92: Allez Loves! ♡
@chat tia.sandra: estou de pé às 6h da manhã por você, filha!
@chat fã_n°1: desde a primeira live. sempre.
loves [abatida coracao]: ...Vocês tão em todo lugar.
@live off
loves: {t}. Fala alguma coisa pra mim antes de eu ir.
? O mundo inteiro tá olhando pra você. => l7_mundo | loves+1
? E eu também. Na primeira fila, como sempre. => l7_fila | loves+1
? [flag:l_dobrou] Entregar um coração de papel dobrado por você. Torto, mas seu. => l7_carta | loves+2, flag:l_carta_treinador

== l7_mundo
loves [brilho]: O mundo inteiro! Então eu vou correr pro mundo inteiro! ♡
@ir l7_corrida

== l7_fila
@se flag:l_plateia => l7_fila2
loves [coracao]: Na primeira fila. Promete que vai balançar alguma coisa?
@ir l7_corrida
== l7_fila2
loves [coracoes]: Com a lanterna do celular? Fora do ritmo?
eu: Fora do ritmo. Como sempre.
loves: Então eu vou ganhar só pra ver isso de novo. ♡
@afeto loves +1
@ir l7_corrida

== l7_carta
Tirei do bolso um coração de papel. Eu tinha treinado durante meses. Ainda estava um pouco torto.
loves [exclamacao]: Você dobrou?! Sozinh{o}?!
eu: Abre só depois da corrida. Promete.
loves [coracoes]: ...Agora eu sei como os meus fãs se sentem. Isso é muito forte, {t}. Isso é MUITO forte.
Ela guardou o coração dentro da luva. Junto da mão.

== l7_corrida
@esconder todos
@musica corrida
@tracking on l_bc
@esperar 0.6
@som portao
@tracking faixa AND THEY'RE OFF!
@tracking ordem 2 / 9 11 / 4 13 / 5 6 7 / 1 10 / 3 14 / 8 12
@tracking ir 1500
"Locutor": And they're off! Começa o Breeders' Cup Filly & Mare Turf!
@tracking foco 6
@tracking ordem 2 9 / 11 4 13 / 5 6 7 / 1 10 / 3 14 / 8 12
@tracking ir 950
@tracking marca 6 × fixo
@tracking cutin loves
Ela largou presa, espremida entre duas corredoras americanas enormes. Ficou no meio, sem espaço, por quase toda a corrida.
@tracking ordem 2 9 / 11 4 13 / 5 6 7 / 1 10 3 / 14 8 / 12
@tracking ir ultima
@tracking marca 5 #
@tracking marca 7 #
"Locutor": Loves Only You está cercada! Não tem por onde sair!
@tracking ordem 2 9 / _ 11 4 13 / 5 6 7 / 1 10 3 / 14 8 / 12
@tracking ir 380
@tracking marca 6 !
Na última curva, uma fresta se abriu por dentro, junto à cerca. Estreita. Rápida.
@tracking aura 6 branca
@tracking rastro 6
@tracking ordem 6 2 9 / 11 4 13 / 5 7 / 1 10 3 / 14 8 / 12
@tracking ir 200 em=2.2
@efeito tremor 12
@tracking marca 6 ♥
Ela passou por ela como um coração passando pelo buraco de uma fechadura.
@tracking ordem 6 /1.2/ 2 9 / 11 4 13 / 5 7 / 1 10 3 / 14 8 / 12
@tracking ir chegada
"Locutor": Loves Only You por dentro! Loves Only You! Pela primeira vez na história, uma corredora treinada no Japão vence a Breeders' Cup!
@efeito flash
@som torcida
@musica vitoria
@tracking placar 6 2:1.2 9:1/2 11:pescoço 4:cabeça
@esperar 2
@fundo hipodromo crepusculo v=delmar corte
@tracking on l_distaff em=270
@tracking foco 5
@tracking ordem 4 >5 / 9 1 / 2 7 / 10 3 / 6 8 11
@tracking ir 90
Horas depois, no fim da tarde, Marche Lorraine venceu o Distaff numa chegada de tirar o fôlego.
@tracking aura 5 branca
@tracking marca 5 !!
@tracking ordem 5 4 / 9 1 / 2 7 / 10 3 / 6 8 11
@tracking ir chegada em=1.8 espera
@tracking placar 5 4:focinho 9:2 1:1/2 2:cabeça foto
@esperar 1.8
@tracking placar 5 4:focinho 9:2 1:1/2 2:cabeça
@esperar 1.4
@tracking off
@particulas confetti
As duas meninas de Hokkaido, campeãs no mesmo dia, do outro lado do oceano.
@mostrar marche esquerda corrida
@mostrar loves direita corrida coracoes
marche [abatida]: ...Eu disse que deixava você chorar no meu ombro. Uma vez.
loves: Marche, VOCÊ tá chorando.
marche: É o vento do mar. Cala a boca. Vem cá.
@esconder marche
@se loves>=10 && (flag:l_plateia || flag:l_mural) => l_final_verdadeiro
@ir l_final_normal

== l_final_verdadeiro
@fundo estudio noite preto
@musica loves
@particulas hearts
@mostrar loves centro
@live on 128000 Loves♡Channel — obrigada, mundo ♡
De volta ao Japão, ela fez a live mais longa da história do canal. Agradeceu cidade por cidade, nome por nome.
loves: Antes de terminar, eu quero apresentar uma pessoa pra vocês. De novo. Do jeito certo.
Ela virou o celular para mim.
loves [coracoes]: Essa pessoa me ensinou que o amor também mora no silêncio. Num estádio vazio. Numa lanterna de celular fora do ritmo.
loves: Que dá pra amar o mundo inteiro... e ainda guardar um pouquinho pra quem está do lado.
@chat moranguinho_22: CHOREI
@chat NightOwl: protect this trainer at all costs
@chat fã_n°1: valeu, {t}. de verdade.
@chat kei_0326: ♡♡♡♡♡
@live off
Ela me entregou um coração de papel. O papel era dourado.
@papel carta | Para {t}, meu primeiro fã ♡
Eu achava que o amor só valia se fosse gritado de uma arquibancada.
Você me mostrou que ele também cabe numa cadeira vazia.
Loves only you...
e todo mundo. Mas você primeiro. ♡
@fimpapel
@final loves_true | Love para o Mundo Inteiro | Final Verdadeiro | Loves descobriu que o amor não precisa ser visto para ser real — e que receber carinho em silêncio também é uma forma de se conectar. Agora ela ama o mundo sem esquecer de quem está do lado.

== l_final_normal
@fundo estudio noite preto
@musica loves_calmo
@mostrar loves centro
@live on 96000 Loves♡Channel — campeã!!
Ela fez uma live enorme, cheia de gritos, corações e lágrimas. O chat não parava nem para respirar.
loves [coracoes]: Obrigada, meus amores! Isso é de vocês! Tudo de vocês!
@live off
Quando a câmera desligou, ela ficou um tempo olhando para a tela preta.
loves: ...É estranho. Quando a câmera desliga, fica tão quieto.
loves [abatida]: Eu ainda preciso aprender a gostar do silêncio, né, {t}?
eu: A gente aprende junto.
loves [coracao]: Então amanhã tem treino, depois tem live. E depois... a gente fica um pouco em silêncio. Só um pouquinho.
@final loves_normal | Até a Próxima Live | Final | Loves conquistou o mundo e devolveu cada gota de amor que recebeu. O silêncio ainda a assusta — mas, desta vez, ela não vai enfrentá-lo sozinha.

== l_final_off
@fundo estudio noite preto
@musica triste
@mostrar loves centro abatida
@live on 3100 Loves♡Channel — um recado
loves: Oi, meus amores.
loves: Eu... vou dar uma pausa nas lives. Não sei por quanto tempo.
loves: Não é culpa de ninguém. Eu só... preciso aprender a ficar sozinha sem achar que estou desaparecendo.
@chat fã_n°1: a gente espera. sempre.
@chat tia.sandra: se cuida, filha
@live off
@fundo palco noite v=vazio lento
@esconder loves
O mural de desenhos continuou na parede da sala de mídia. Ninguém teve coragem de tirar.
Às vezes eu passo pelo palco vazio à noite e penso na música que ela não cantou.
E espero que, quando ela voltar, alguém esteja na primeira fila.
@final loves_off | Transmissão Encerrada | Final Silencioso | Às vezes, quem dá amor para o mundo inteiro esquece de guardar um pouco para si. A live acabou — mas os fãs continuam esperando.
`);
