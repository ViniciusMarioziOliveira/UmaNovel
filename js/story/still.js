/* =========================================================================
   Rota de Still in Love — "Entre o Instinto e a Intuição"
   Conflito: o medo dos próprios impulsos e da intensidade dos sentimentos.
   A tela vai ficando mais avermelhada conforme os impulsos crescem.
   (As cenas são inspiradas no jogo, mas foram criadas para esta novel.)
   ========================================================================= */
VN.Script.add('still', `
== still_inicio
@musica cotidiano
@fundo portao manha preto
@som sino
Abril. As cerejeiras da Academia Tracen estavam no auge — e eu, no meu primeiro dia como {tt}.
@mostrar tazuna centro
tazuna [pulo]: Bom dia! Você deve ser {o} nov{o} {tt}! Seja muito bem-vind{o} à Academia Tracen!
tazuna: Eu sou Tazuna Hayakawa, secretária da diretoria. Vamos dar uma volta pelo campus? Tem tanta coisa pra mostrar!
Andamos pela alameda de cerejeiras. Ela falava das pistas, dos dormitórios, da cantina que serve cenoura de sete jeitos diferentes.
tazuna: ...e aqui é o portão principal, onde... hm?
tazuna [exclamacao]: Ah! Still-san! Desde quando você está aí?
Eu me virei. A meio metro das minhas costas havia uma garota pequena, de cabelos castanho-avermelhados e um véu branco preso nas orelhas.
Eu não tinha ouvido nenhum passo. Nada.
@mostrar still direita
@mover tazuna esquerda
still [gota]: D-desde o começo... desculpe. Eu não queria incomodar.
still: Eu vi você chegar pelo portão. As pétalas caíam em você de um jeito... bonito.
tazuna [gota]: A Still in Love é... muito discreta. Às vezes nem os professores percebem que ela está na sala.
tazuna: E, que coincidência, ela ainda não tem {tt}! Bem, eu tenho uma reunião. Divirtam-se!
@esconder tazuna
@mover still centro
Notei uma coisa estranha. Enquanto Tazuna falava, as orelhas de Still não se mexeram nenhuma vez.
Ficaram apontadas para mim. O tempo todo.
? Quer me mostrar a academia? => s1_tour | still+1
? Você estava me seguindo? (brincando) => s1_seguindo | flag:s_brincou
? Prazer. Eu sou {nome}. => s1_prazer | still+1

== s1_seguindo
still [susto gota]: N-não! Quer dizer... um pouco. Só desde o portão. Desculpe! Desculpe!
eu: Calma, eu estava brincando.
still [rubor]: ...Ah. Brincando. Claro. Eu... não sou muito boa com brincadeiras.
Ela riu baixinho, atrasada, como quem ensaia uma risada antes de usar.
@ir s1_passeio

== s1_tour
still [brilho]: Eu? Mostrar? ...Ninguém nunca me pediu para mostrar nada.
still: Eu conheço todos os cantos quietos da academia. Os que ninguém visita.
@ir s1_passeio

== s1_prazer
still: {nome}...
Ela repetiu o meu nome devagar, como quem experimenta um doce.
still [rubor]: Still in Love. Muito prazer. Eu... não sou digna de mais nenhuma apresentação. Prefiro guardar essas coisas pra mim.

== s1_passeio
@fundo biblioteca tarde
@mostrar still centro
Ela me mostrou a biblioteca. Parou diante de uma estante de romances históricos e passou a mão nas lombadas com carinho.
still: Eu gosto destes. Cavaleiros e damas. Amores impossíveis. Pessoas que esperam a vida inteira por alguém.
still: Nos livros, quem ama demais sempre termina sozinho... ou termina mal.
still [reticencias]: ...Eu queria um livro em que isso não acontecesse.
@fundo cafe tarde
@musica still
@ambiente cafe
Depois, ela me levou a uma cafeteria pequena, a duas ruas da escola. Madeira escura, luz de mel, cheiro de café coado.
still: Esta é a minha favorita. Eu... nunca trouxe ninguém aqui.
Ela pediu uma fatia de torta de morango e um café sem açúcar. Explicou, muito séria, que doce e café amargo "conversam entre si".
still: E você? O que vai pedir?
? O mesmo que você. => s1_igual | still+2
? Uma tortinha de frutas. => s1_torta | still+1
? Pão de alho. Estou com fome de verdade. => s1_alho | still-1, flag:s_alho

== s1_igual
still [rubor]: Iguais...
still: É como se a gente... combinasse.
Ela comeu a torta em garfadas pequeníssimas, saboreando cada uma como se fosse a última.
@ir s1_contrato

== s1_torta
still: Boa escolha. As frutas daqui são frescas. A dona compra no mercado toda manhã.
still [nota]: Se quiser... posso te apresentar todas as tortas. Uma por semana. Até o fim do ano.
@ir s1_contrato

== s1_alho
O cheiro chegou à mesa antes do prato.
still [susto gota]: ...!
Ela ficou pálida. As orelhas se dobraram para trás. Ela se levantou devagar, educadíssima.
still: C-com licença. Eu vou... só... sentar ali. Por um minutinho.
Ela foi para a mesa do canto e ficou me olhando de longe, com um guardanapo no nariz, até eu terminar.
still: Eu não me dou bem com cheiros fortes. Desculpe. É bobagem.
É claro que eu nunca mais pedi pão de alho na frente dela.

== s1_contrato
still: {t}...
still: Eu sei que eu sou... fácil de esquecer. As pessoas olham para mim e não me veem.
still: Mas se você me escolher... eu prometo que nunca vou deixar você esquecer de mim.
Ela sorriu. Era um sorriso bonito. Ensaiado, talvez. Mas bonito.
E, por algum motivo, aquela promessa me deu um arrepio leve na nuca.

== s_cap2
# Capítulo 2 | A outra Still
@musica cotidiano
@fundo pista dia preto
@ambiente vento
Uma semana antes do Oka Sho, montamos uma corrida simulada com algumas das alunas mais rápidas da geração.
@mostrar still centro corrida
still [gota]: Eu vou tentar não atrapalhar ninguém.
eu: Você vai correr. Ninguém atrapalha ninguém correndo.
still: ...Tá bom. Eu vou tentar.
@esconder todos
@musica corrida
@tracking on s_simulada
@esperar 0.6
@som portao
@tracking faixa LARGADA!
@tracking ordem 3 / 1 5 / 8 2 / 4 7 /// 6
@tracking ir 1250
@tracking foco 6
@tracking marca 6 gota
Ela largou devagar, quase tímida. Ficou atrás de todo mundo, como se pedisse desculpas por estar na pista.
@tracking ordem 3 1 / 5 8 / 2 4 / 7 // 6
@tracking ir reta
Até a reta final.
@musica still_sombra
@efeito flashvermelho
@tracking aura 6 vermelha
@tracking marca 6 ☾
@efeito vermelho 0.18
Alguma coisa mudou. Como se outra garota tivesse tomado o lugar dela.
@tracking cutin still sombra
O rosto, que eu só tinha visto gentil, ficou duro. Os olhos brilharam, vermelhos, quase felinos.
@caixa escura
@tracking rastro 6 vermelho
@tracking ordem 3 1 >>6 / 5 8 / 2 4 / 7
@tracking ir 260
still: {red}Mais.{/red}
@tracking marca 6 !!
@tracking ordem 6 /2/ 3 1 / 5 8 / 2 4 / 7
@tracking ir 120
still: {red}Eu quero mais. Quero alcançar. Quero devorar.{/red}
@tracking cutin off
@efeito tremor 14
@tracking ordem 6 /6/ 3 1 / 5 8 / 2 4 / 7
@tracking ir chegada em=2.4
@tracking marca 3 !
@tracking marca 1 ?
Ela passou pelas outras como se elas estivessem paradas. Cruzou a linha com seis corpos de vantagem.
@tracking off
@efeito vermelho 0.04
@caixa normal
@fundo pista dia rapido
@musica tensao
Quando cheguei perto, ela estava sentada na grama, abraçando os joelhos. Tremendo.
@mostrar still centro corrida arrepio
still: Eu disse alguma coisa? Durante a corrida?
still [abatida]: Eu não lembro direito. Eu só lembro de... querer. Querer muito. Desculpe. Desculpe. Desculpe.
? Aquela também é você. E foi incrível. => s2_aceita | still+1, flag:s_aceitou1
? Você está bem? Está tremendo. => s2_cuidado | still+2
? Aquilo foi assustador. => s2_medo | still-1, flag:s_medo

== s2_aceita
@anim still calma
still [exclamacao]: ...Incrível?
still: Ninguém nunca chamou aquilo de incrível. A minha colega de quarto chama de "a supernova". Os outros não chamam de nada. Só se afastam.
still: ...Obrigada. Eu ainda tenho medo dela. Mas obrigada.
@ir s2_oka

== s2_cuidado
@anim still calma
Tirei a minha jaqueta e coloquei nos ombros dela.
still [rubor]: ...Você perguntou de mim. Não da corrida.
still: Estou melhor agora. As mãos sempre tremem depois. Passa.
Ela segurou a gola da jaqueta com as duas mãos e não devolveu até o fim do dia.
@ir s2_oka

== s2_medo
@anim still calma
still [abatida]: ...Eu sei.
still: É por isso que eu fico quieta. Se eu ficar quieta o tempo todo, talvez ela não apareça.
Doeu ver o quanto ela não se surpreendeu com a minha resposta.

== s2_oka
@fundo hipodromo dia preto
@musica vitoria
@ambiente torcida
@tracking resultado s_oka 10 3:1.5 15:1/2 7:cabeça 1:pescoço
Ela venceu o Oka Sho. A primeira joia da Tríplice Tiara.
@tracking placar off
@mostrar still centro corrida
Na foto oficial, ela sorria para a câmera. Por um instante, achei ter visto presas no sorriso.
Pisquei. Era só o sol. Eu acho.
@fundo corredor tarde preto
@musica still
Dias depois, procurando por ela, encontrei-a sozinha no corredor do segundo andar. De frente para uma janela.
@mostrar still centro vira
Ela sorria para o próprio reflexo no vidro. Desfazia o sorriso. Sorria de novo. Ajustava o canto da boca com o dedo.
still [susto]: ...!
@anim still desvira
still [rubor]: V-você viu.
still: Eu treino o meu sorriso. Pra ficar... normal. Nas fotos da vitória eu pareço...
still: Eu uso as janelas porque... espelhos grandes me deixam desconfortável. Não sei explicar.
? O seu sorriso de verdade é bonito. Não precisa treinar. => s2_sorriso | still+2, flag:s_sorriso
? Você não precisa sorrir se não quiser. => s2_semsorriso | still+1
? Fingir que não viu nada. => s2_fingir

== s2_sorriso
still [exclamacao]: O de verdade?
still: Mas o de verdade é o que aparece quando eu... quando ela...
eu: O de verdade é o que aparece quando você esquece de vigiar a boca. Tipo agora, no café, quando a torta é boa.
still [rubor coracao]: ...
Ela não respondeu. Mas, no reflexo da janela, sorriu sem ajustar nada.
@ir s2_diario

== s2_semsorriso
still: Mas as pessoas esperam que a gente sorria. Que a gente pareça... seguro.
eu: As pessoas podem esperar. Você não deve nada a elas.
still [reticencias]: ...Você é a primeira pessoa que me diz isso.
@ir s2_diario

== s2_fingir
Olhei para o outro lado e comentei sobre o tempo. Ela concordou depressa demais.
still [abatida]: ...Você viu. Não viu?
Não respondi. Às vezes, fingir não ver também é uma forma de ver.

== s2_diario
@papel diario | Diário — 14 de abril
Hoje eu venci o Oka Sho.
{t} estava na cerca. As minhas orelhas viraram sozinhas pra lá. Eu acho que elas sempre viram pra lá.
Coisas que eu quero fazer:
1. Levar {t} na confeitaria da rua de trás.
2. Terminar a renda do véu novo.
3. Sorrir sem treinar antes.
4. Não deixar *ela* sair.
@fimpapel

== s_cap3
# Capítulo 3 | Geleia de frutas vermelhas
@musica still
@fundo escritorio tarde preto
@efeito vermelho 0.05
@mostrar still centro
Maio. Still apareceu na sala com um pacote embrulhado num paninho de renda.
still: Eu fiz geleia. De frutas vermelhas. Morango, framboesa e um pouco de amora.
still: E a renda... também fui eu. Renda de bilro. São dezenas de fios presos em bilros de madeira, e você vai cruzando um por um.
still: Se você puxar o fio errado, tudo desmancha. Eu gosto disso. Exige calma. Exige controle.
Ela estendeu também um livro de capa vinho. Um romance histórico, cheio de marcadores de fita.
still [rubor]: Pra você ler. Se quiser. Tem uma parte que eu sublinhei. Não precisa ler essa parte.
? Abrir a geleia e provar ali mesmo. => s3_provar | still+1
? Perguntar qual é a parte sublinhada. => s3_sublinhado | still+1

== s3_provar
Peguei uma colher e provei. Era doce, ácida e um pouco selvagem, com sementinhas que estalavam.
eu: Isso está incrível.
still [coracoes]: Sério? De verdade? Não está doce demais? Nem ácido demais?
eu: Está macio... com caráter.
still: ...Que jeito estranho de elogiar geleia. Eu gostei.
@ir s3_neo

== s3_sublinhado
still [susto rubor]: E-eu disse que não precisava ler essa parte!
still: ...É uma frase da dama. Ela diz ao cavaleiro: "Eu tenho medo do tamanho do que sinto. Ele não cabe em mim."
still [abatida]: Eu sublinhei porque... eu entendo ela.

== s3_neo
@som porta
@mostrar neo direita
@mover still esquerda
neo: Com licença... Still. Achei a sua órbita.
neo: E você deve ser {o} {tt}. Neo Universe. Eu divido o quarto com ela. Ou ela divide o quarto comigo. O universo não tem centro, então tanto faz.
still: Neo, eu já vou. Só estava entregando uma coisa.
neo: Sem pressa. Vai lavando os potes, Still. Eu quero falar um minutinho com {o} {tt}.
@esconder still
@mover neo centro
neo: Eu vou ser direta, porque estrelas não têm tempo a perder.
neo: Eu já vi o outro lado dela. À noite. Ela não dorme quando a lua fica cheia. Fica olhando pela janela, apertando os próprios braços até deixar marca.
neo: Ela tem medo. Muito mais medo do que qualquer pessoa que a vê correr.
neo [estrela]: Não tenha medo dela, {t}. O universo é cheio de coisas que parecem perigosas e só estão... queimando. Estrelas, por exemplo.
neo: Ela é uma anã vermelha. Pequena, quieta, e queima por muito, muito tempo.
neo [reticencias]: A próxima lua cheia é em julho, no acampamento de verão. Eu só achei que você devia saber.
@esconder neo
@fundo hipodromo dia preto
@musica corrida
@ambiente torcida
@tracking on s_oaks em=320
@tracking foco 14
@tracking ordem 14 /1.5/ 5 9 / 2 11 / 16 7 / *
@tracking ir chegada em=2.6
Ela venceu o Oaks. A segunda joia. Mas, depois da linha de chegada... ela não parou.
@tracking continua 14
@tracking aura 14 vermelha
@tracking marca 14 ☾ fixo
@efeito vermelho 0.14
@tracking ir +560 em=4.5
Continuou correndo. Passou pela curva, pela reta oposta, como se a corrida não tivesse acabado. Como se ainda houvesse algo para alcançar.
? Gritar o nome dela, o mais alto que puder. => s3_chamar | still+2, flag:s_chamou
? Pular a cerca e correr atrás dela. => s3_correr | still+1
? Esperar até ela parar sozinha. => s3_esperar

== s3_chamar
eu: STILL!
@tracking marca 14 !
@tracking aura 14 off
@tracking para 14
Do outro lado da pista, as orelhas dela giraram na minha direção. Antes da cabeça. Antes do corpo.
Ela parou. Ficou um tempo parada, respirando. Depois voltou andando, devagar.
@tracking off
@mostrar still centro corrida
still [abatida]: ...Eu ouvi você. Mesmo lá longe. Eu sempre ouço você.
@ir s3_diario

== s3_correr
@tracking marca 14 ?
Pulei a cerca e corri atrás dela. Obviamente, não alcancei. Ninguém alcança uma Uma correndo a pé.
@tracking aura 14 off
@tracking para 14
Mas ela me viu pelo canto do olho, ofegante, ridícul{o}, tropeçando na grama. E parou.
@tracking off
@mostrar still centro corrida
still [gota]: {t}... você não pode correr na pista. É perigoso.
eu: Você também não pode correr depois da chegada.
still: ...Justo.
@ir s3_diario

== s3_esperar
@tracking ir +1300 em=4.5
Esperei. Ela deu uma volta inteira na pista antes de diminuir. Os comissários já vinham na direção dela.
@tracking aura 14 off
@tracking para 14
@tracking off
@mostrar still centro corrida abatida
still [abatida]: Eu não queria parar. Eu queria correr até não sobrar nada.
== s3_diario
@efeito vermelho 0.08
@papel diario | Diário — 26 de maio
Hoje {t} me chamou pelo nome na frente de todo mundo.
Eu queria que só eu pudesse ouvir quando {ele} diz o meu nome.
Isso é feio? Acho que é feio.
A lua está crescendo. Eu tenho medo de mim quando ela fica redonda.
@fimpapel

== s_cap4
# Capítulo 4 | Lua cheia
@musica cotidiano
@fundo praia dia preto
@ambiente mar
@efeito vermelho 0.06
Julho. O acampamento de verão à beira-mar. Treinos na areia de manhã, melancia à tarde, fogos baratos à noite.
@mostrar still centro
Still parecia feliz. Construiu um castelo de areia com uma torre muito alta e uma ponte levadiça. Ninguém ajudou. Ela não pediu.
still: Um castelo de romance histórico. A dama mora na torre mais alta.
eu: E o cavaleiro?
still [reticencias]: ...Ainda não decidi se ele chega a tempo.
@esconder still
@fundo praia noite v=lua preto
@musica still_sombra
@ambiente mar
@efeito vermelho 0.22
Naquela noite, a lua subiu redonda e enorme sobre o mar. Neo veio bater na porta do meu quarto.
neo: Ela saiu. Não está no quarto, nem no refeitório. Eu acho que foi para a praia.
Encontrei Still sozinha na areia, de joelhos, de frente para a lua.
@mostrar still centro arrepio aura
@efeito coracao on
still: Não chega perto. Por favor.
still: Quando a lua fica assim... eu escuto o meu coração alto demais. E eu quero... coisas.
@caixa escura
still: {red}Eu quero que você fique. Só comigo. Que ninguém mais olhe pra você.{/red}
still: {shake}Eu quero morder alguma coisa até parar de doer.{/shake}
@caixa normal
still [abatida]: ...Viu? É isso que eu sou. Vai embora.
? Sentar na areia, a uma boa distância dela, e ficar. => s4_distancia | still+2, flag:s_distancia
? Se aproximar e estender a mão para ajudá-la a levantar. => s4_mao | still+1, flag:s_mordida
? Chamar a Neo para ajudar. => s4_neo | flag:s_neo_ajuda

== s4_distancia
Sentei na areia, a uns cinco metros dela. Abracei os joelhos também.
eu: Eu não vou embora. Mas também não vou chegar perto. Fico aqui.
still [exclamacao]: ...
Ficamos assim muito tempo. Só o barulho das ondas.
eu: Eu li o livro. O cavaleiro chega a tempo, sabia? No último capítulo. Todo arranhado, mas chega.
still: ...Você leu até o fim?
eu: Li. A dama também não era fácil. Ela jogou um vaso nele no capítulo nove.
still: ...Hehe.
Foi o primeiro riso dela naquela noite. Aos poucos, a respiração foi ficando mais lenta.
@anim still calma
@anim still semaura
@efeito coracao off
still [rubor]: {t}... posso só... segurar a manga da sua camisa? Só a manga.
Deixei. Ela segurou a pontinha do tecido entre dois dedos, como quem segura um fio de renda. Até a lua descer.
@ir s4_manha

== s4_mao
Me aproximei devagar e estendi a mão para ajudá-la a levantar.
still: Não—
@efeito flashvermelho
@som impacto
@efeito tremor 18
Ela agarrou o meu pulso com uma força que não combinava com aquele corpo pequeno. E mordeu a minha mão. Entre o polegar e o indicador.
Durou um segundo. Talvez menos.
@efeito coracao off
@anim still semaura
still [susto]: ...!
Ela me soltou como se tivesse tocado em fogo. Recuou na areia, de olhos arregalados.
still [arrepio]: Eu... eu... eu mordi você. Eu MORDI você.
still: Que tipo de... de monstro...
Ela correu. Desapareceu na escuridão da praia antes que eu conseguisse dizer qualquer coisa.
@ir s4_manha

== s4_neo
Mandei uma mensagem para a Neo. Ela chegou em menos de dois minutos, descalça, com um cobertor.
@mostrar neo esquerda
@mover still direita
neo: Ei, supernova. Respira comigo. Inspira... segura... solta.
@anim still calma
@anim still semaura
@efeito coracao off
Still obedeceu. Aos poucos, o tremor passou. Mas, quando os olhos dela encontraram os meus, havia neles algo que eu não queria ver.
still [abatida]: ...Você chamou alguém. Porque ficou com medo de mim.
eu: Eu chamei alguém porque não sabia como te ajudar sozinh{o}.
still: ...Desculpe ter assustado você.
@esconder neo

== s4_manha
@fundo enfermaria manha preto
@musica still
@efeito vermelho 0.1
@ambiente sala
@se flag:s_mordida => s4_medica
Na manhã seguinte, Still faltou ao treino. Foi a primeira vez.
@ir s4_diario
== s4_medica
"Médica": Hmm. Deixa eu ver essa marca.
"Médica": Picada de inseto. Daquelas bem grandes. Pernilongo de praia é um bicho terrível nessa época.
"Médica": Passa essa pomada duas vezes por dia. Em uma semana some.
@mostrar still esq2 longe
Na fresta da porta, uma orelha. Depois um olho. Still espiava, pálida, segurando o batente com as duas mãos.
Quando a médica saiu, ela entrou devagar e parou longe da maca.
@mover still centro
@tamanho still normal
still [abatida]: ...Inseto.
still: Ela disse que foi um inseto.
still: Eu passei a noite inteira acordada. Pensando que você nunca mais ia querer me ver.
eu: Ela disse que some em uma semana.
still [reticencias]: ...E eu? Eu sumo também? Da sua lista?
eu: Você ainda tem três tortas pra me apresentar. E um castelo pra terminar.
Ela começou a chorar. E depois, entre o choro, riu. As duas coisas ao mesmo tempo.

== s4_diario
@efeito vermelho 0.16
@se flag:s_mordida => s4_diario_mordida
@papel diario | Diário — 22 de julho
Ontem a lua estava redonda.
{t} ficou. Ficou longe, mas não foi embora.
Ninguém nunca ficou.
Eu acho que eu vou guardar essa noite numa caixinha de renda. Bem lá no fundo.
Pra *ela* não achar.
@fimpapel
@ir s_cap5
== s4_diario_mordida
@papel diario | Diário — 22 de julho
Eu disse que não ia deixar ela sair.
{red}Ela saiu.{/red}
A médica disse "inseto". {t} não disse nada. {Ele} não foi embora.
Por quê?
{red}O gosto ainda está aqui.{/red} Eu escovei os dentes onze vezes.
@fimpapel

== s_cap5
# Capítulo 5 | Olhos só para mim
@musica cotidiano
@fundo pista tarde preto
@efeito vermelho 0.12
Setembro. Faltava um mês para o Shuka Sho, a última joia. Eu revisava tempos na arquibancada quando alguém se sentou ao meu lado.
@mostrar ramonu direita
ramonu: Ara~ Você é {o} {tt} da Still in Love, não é? Mejiro Ramonu. Prazer.
ramonu: Que dedicação... Revisando tempos num sábado à tarde. Fico imaginando como seria ter alguém assim só para mim.
ramonu [coracao]: Talvez eu peça para treinar com você alguns dias. Para comparar métodos. A Still não se importaria, não é?
@mostrar still esquerda
still: ...Eu me importo.
@efeito flashvermelho
Ela estava ali. Atrás de nós. Ninguém tinha percebido.
ramonu [gota]: Ara. Ela estava aí o tempo todo? Que assustador. Que adorável.
ramonu: Bom, foi só uma ideia. Até o Shuka Sho, Still in Love. Estou ansiosa.
@esconder ramonu
@mover still centro
@musica still_sombra
@anim still aura
@caixa escura
still: {t}... os seus olhos estavam nela.
still: {red}Eles deviam estar aqui. Comigo. Só comigo.{/red}
@caixa normal
@anim still semaura
@musica still
still [susto abatida]: ...Desculpe. Eu não sei por que eu disse isso. Eu não... eu não sou assim. Eu não quero ser assim.
? Eu sou {o} {seu} {tt}. Isso não muda por causa de uma conversa. => s5_seguro | still+2, flag:s_seguro
? Você não pode decidir com quem eu converso. E tudo bem você sentir ciúme. => s5_limite | still+2, flag:s_limite
? Isso é ciúme? (rindo) => s5_riso | still-1

== s5_seguro
still [exclamacao]: ...Não muda?
eu: Não muda. Você não vai sumir da minha lista. Eu não tenho lista. Tenho você.
still [rubor]: ...Isso foi muito direto. Eu preciso de um minuto.
Ela se virou de costas por exatamente um minuto. Contou nos dedos.
@ir s5_rose

== s5_limite
still [abatida]: ...
eu: Eu posso conversar com quem eu quiser. E você pode sentir o que sentir. As duas coisas cabem juntas.
still: Você... me disse não.
still [brilho]: Ninguém nunca me diz não. Todo mundo tem medo de mim, ou não me vê. Então eu nunca sei onde fica o limite.
still: Obrigada. Agora eu sei onde ele fica. Isso me dá menos medo de ir longe demais.
@ir s5_rose

== s5_riso
still [raiva]: Não ria de mim.
A voz saiu baixa. Fria. Eu parei de rir na hora.
still [abatida]: ...Desculpe. Eu só... não gosto quando riem do que eu sinto. Já riram demais.

== s5_rose
@fundo hipodromo dia preto
@musica tensao
@ambiente torcida
Rose Stakes. A corrida preparatória para o Shuka Sho.
@mostrar groove direita corrida
@mostrar still esquerda corrida
groove: Still in Love. Admire Groove. Imagino que você já tenha ouvido falar de mim.
groove: Quero ver o que tem por trás desse véu. Corra com tudo. Eu vou.
still [aceno]: ...Eu vou tentar.
@esconder todos
@musica corrida
@tracking on s_rose
@esperar 0.6
@som portao
@tracking faixa LARGADA!
@tracking ordem 7 / 1 12 / 3 10 / 5 14 2 / 9 16 / 4 13 / 8 6 11 / 15
@tracking ir 1500
@esperar 2.4
@tracking foco 3
@tracking ordem 3 >10 / 7 1 / 12 5 / 14 2 / 9 16 / 4 13 / 8 6 11 / 15
@tracking ir reta
@tracking marca 3 gota
@tracking cutin still
Desta vez, ela segurou. Eu vi na reta final: os ombros tensos, o maxilar travado, a respiração contada.
@tracking aura 10 branca
@tracking rastro 10
@tracking marca 10 !!
@tracking ordem >10 /1.5/ 3 / 7 1 / 12 5 / 14 2 / 9 16 / 4 13 / 8 6 11 / 15
@tracking ir chegada em=3.4
Ela segurou *a outra* com as duas mãos. E Admire Groove passou por ela como uma rainha.
@tracking marca 3 …
@tracking placar 10 3:1.5 7:1/2 1:cabeça 12:pescoço
"Locutor": Admire Groove vence a Rose Stakes! E agora ela é a grande favorita para o Shuka Sho!
@tracking off
@fundo hipodromo dia rapido
@mostrar groove direita corrida
@mostrar still esquerda corrida abatida
groove: Você é forte, Still in Love. Mas hoje você correu com medo. Eu senti daqui.
groove: No Shuka Sho, quero a Still de verdade. Não essa. Ou não vai ter graça vencer.
@esconder groove
@mover still centro
still: Eu segurei. Eu segurei ela o tempo todo...
still [abatida]: ...e perdi.
still: Se eu deixo ela sair, eu tenho medo do que eu viro. Se eu seguro, eu perco. O que eu faço, {t}?
@efeito vermelho 0.2
@papel diario | Diário — 21 de setembro
Todo mundo agora diz: "Admire Groove é a favorita".
Ninguém diz o meu nome. Como sempre.
{t} disse. Na cerca. Baixinho. Eu ouvi mesmo assim.
{red}Eu quero que todos ouçam.{/red}
{red}Eu quero que todos olhem.{/red}
Não. Não é isso que eu quero. É?
@fimpapel

== s_cap6
# Capítulo 6 | A renda e o fio
@musica still
@fundo cafe noite chuva preto
@ambiente cafe_chuva
@efeito vermelho 0.24
Outubro. Uma semana antes do Shuka Sho. Chovia. A dona da cafeteria virou a placa para FECHADO, mas deixou a gente ficar.
@mostrar still centro
Still tirou da bolsa um quadradinho de renda. Terminado, finalmente.
O desenho era uma lua crescente. E, pendurada nela, uma ferradura minúscula.
still: Demorei quatro meses. Errei o fio três vezes. Desmanchei tudo três vezes.
still: É pra você. Se quiser.
Ela empurrou a renda pela mesa. Depois ficou olhando para a xícara vazia, as duas mãos em volta dela.
still: {t}. Eu preciso te dizer uma coisa e preciso que você me deixe terminar.
still: Quando eu corro, eu quero devorar a vitória. Não ganhar. Devorar.
still: E quando você olha pra outra pessoa, eu quero que você olhe só pra mim. Eu sei que é errado. Eu sei. Mas eu quero.
still [abatida]: Eu tenho medo de que um dia eu queira tanto, tanto... que eu machuque quem eu mais gosto.
@efeito vermelho 0.3
still: Talvez seja melhor você procurar outra Uma. Uma normal. Uma que não morda.
A chuva batia na janela. A renda estava entre nós, em cima da mesa.
? Eu fico com as duas Still. A que faz renda e a que quer devorar a pista. => s6_duas | still+3, flag:s_duas
? Então a gente segura esse fio juntos. Devagar, como na renda. => s6_fio | still+2, flag:s_fio
? Talvez você tenha razão. => s6_partir | flag:s_partiu

== s6_duas
eu: Eu não quero uma Uma normal. Eu quero você. As duas.
eu: A que faz geleia, renda e castelo de areia. E a que corre como se o mundo fosse acabar.
eu: Essa outra não é um monstro, Still. É o seu jeito de querer as coisas. Só é grande. Grande demais pra ficar trancada.
still [exclamacao]: ...
eu: E se um dia você for longe demais, eu digo não. Em voz alta. E você vai me ouvir. Você sempre me ouve.
@efeito vermelho 0.12
@efeito rosa 0.25
@musica vega_luz
still [abatida]: ...Ninguém nunca quis as duas.
Ela pegou a renda de volta, com cuidado, e a colocou na palma da minha mão. Fechou meus dedos sobre ela.
still [rubor coracao]: Então guarda. As duas Still estão costuradas aí dentro.
@ir s6_fim

== s6_fio
eu: Você mesma me disse: se puxar o fio errado, tudo desmancha. Então a gente não puxa. A gente cruza. Um por um. Com calma.
eu: Você não precisa ter medo sozinha. Quando ela vier, eu seguro o outro bilro.
still [aceno]: ...Com calma.
still: Eu consigo fazer isso. Eu acho. Se você estiver segurando o outro bilro.
@efeito vermelho 0.18
Ela pegou a renda e colocou na minha mão. As pontas dos dedos dela estavam frias. E firmes.
@ir s6_fim

== s6_partir
still [reticencias]: ...
still: É. Eu sabia.
Ela sorriu. O sorriso ensaiado. O da janela. O de fotografia.
still: Obrigada pela torta. E pelos dias de chuva. E pelo castelo. Foi... foi bom.
Ela se levantou, pegou o guarda-chuva e saiu. A renda ficou em cima da mesa.
@esconder still
@efeito vermelho 0.42
@musica still_sombra
@ambiente chuva
Fiquei um tempo olhando a porta. Quando finalmente peguei a renda, percebi que um fio tinha se soltado.
Bem no meio da lua.
@ir s_cap7

== s6_fim
@fundo rua noite chuva
@ambiente chuva
@mostrar still centro
Saímos juntos. Ela segurava o guarda-chuva. Eu segurava a renda.
still: {t}... no Shuka Sho...
still: Se ela sair... você me chama de volta?
eu: Com o pulmão inteiro.

== s_cap7
# Capítulo 7 | Shuka Sho
@musica tensao
@fundo hipodromo dia preto
@ambiente torcida
Outubro. Shuka Sho. A última joia da Tríplice Tiara.
"Locutor": E a grande favorita do público hoje é... Admire Groove!
@se flag:s_partiu || still<4 => s7_sombra
@mostrar groove direita corrida
@mostrar still esquerda corrida
groove: Still in Love. Espero que hoje você não esteja com medo.
@se flag:s_duas => s7_naosegura
still: Hoje eu vou controlar tudo. Do começo ao fim.
@ir s7_conversa
== s7_naosegura
still: Hoje eu não vou segurar.
groove [exclamacao]: ...Então finalmente.
== s7_conversa
@esconder groove
@mover still centro
still: {t}. Antes de eu ir...
? [flag:s_duas] Deixa ela correr. Eu tô aqui pra te trazer de volta. => s7_volta | still+1, flag:s_volta
? Corre com o coração. => s7_coracao | still+1
? Não perde o controle. => s7_controle | flag:s_controle

== s7_volta
still [brilho]: ...Com o pulmão inteiro?
eu: Com o pulmão inteiro.
still [coracao]: Então eu vou deixar ela sair. Só um pouquinho. Só até a linha.
@ir s7_corrida

== s7_coracao
still: Com o coração... o coração é a parte mais barulhenta de mim.
still [aceno]: Tá bom. Eu vou ouvir ele hoje.
@ir s7_corrida

== s7_controle
still [aceno]: Controle. Eu sei. É o que eu faço melhor.
Ela sorriu o sorriso ensaiado. Funcionava. Quase sempre funcionava.

== s7_corrida
@esconder todos
@musica corrida
@tracking on s_shuka
@esperar 0.6
@som portao
@tracking faixa LARGADA!
@tracking ordem 7 / 2 11 / 5 16 / 9 14 3 / 1 12 / 6 17 / 4 13 18 / 8 10 / 15
@tracking ir 1650
"Locutor": Abrem-se os portões! Começa o Shuka Sho!
@tracking foco 14
@tracking ordem 7 /1.4/ 2 11 / 5 16 / 9 3 / 14 1 12 / 6 17 / 4 13 / 18 8 / 10 15
@tracking ir oposta
@tracking marca 7 ♪
Ela largou no meio do grupo. Admire Groove ia à frente, elegante, com a confiança de quem já venceu esta corrida na cabeça.
@tracking ordem 7 / 2 11 / 5 16 / 9 3 1 / 12 6 / 14 17 / 4 13 / 18 8 / 10 15
@tracking ir ultima
@tracking marca 14 …
Última curva. Still ainda estava atrás. Eu vi os ombros dela subirem e descerem uma vez. Duas.
@se flag:s_duas && still>=8 && (flag:s_volta || still>=11) => s7_livre
@efeito vermelho 0.2
@tracking marca 14 gota fixo
@tracking cutin still
@tracking ordem 7 / 2 >14 / 11 5 / 16 9 3 / 1 12 6 / 17 4 / 13 18 / 8 10 15
@tracking ir reta
Ela segurou. Segurou com tudo o que tinha. E, mesmo segurando, avançou. Centímetro por centímetro.
@tracking ordem 7 >14 / 2 11 / 5 16 / 9 3 1 / 12 6 / 17 4 / 13 18 / 8 10 15
@tracking ir 140
@tracking marca 14 !
"Locutor": Still in Love se aproxima! Still in Love encosta em Admire Groove! As duas lado a lado!
@efeito tremor 10
@tracking aura 14 branca
@tracking ordem 7 >14+0.3 / 2 11 / 5 16 / 9 3 1 / 12 6 / 17 4 / 13 18 / 8 10 15
@tracking ir chegada
"Locutor": Still in Love! Por uma cabeça! Still in Love conquista a Tríplice Tiara!
@efeito flash
@som torcida
@tracking placar 14 7:cabeça 2:2 11:1/2 5:pescoço
@esperar 2
@tracking off
@ir s_final_normal

== s7_livre
@musica still_sombra
@efeito vermelho 0.3
@tracking aura 14 vermelha
@tracking marca 14 ☾
Então ela soltou.
@tracking cutin still aura
Não com raiva. Não com fome. Os olhos acenderam vermelhos, sim — mas o rosto... o rosto estava sorrindo.
@efeito rosa 0.35
@efeito vermelho 0.12
@musica vitoria
@tracking faixa RETA FINAL!
@tracking rastro 14 vermelho
@tracking marca 14 !!
@tracking ordem 7 >>14 / 2 11 / 5 16 / 9 3 1 / 12 6 / 17 4 / 13 18 / 8 10 15
@tracking ir 330 em=1.4 espera
@tracking ordem >>14 /1.5/ 7 / 2 11 / 5 16 / 9 3 1 / 12 6 / 17 4 / 13 18 / 8 10 15
@tracking ir 120 em=2.6
"Locutor": Still in Love! Still in Love vem como um relâmpago vermelho! Passa Admire Groove! Dispara!
@tracking marca 7 !
@tracking marca 14 ♪
@tracking ordem >>14 /3/ 7 / 2 11 / 5 16 / 9 3 1 / 12 6 / 17 4 / 13 18 / 8 10 15
Ela não estava devorando a pista. Estava dançando com ela.
@efeito tremor 12
@tracking ir chegada
"Locutor": Still in Love vence o Shuka Sho! Tríplice Tiara! Still in Love é a rainha das potrancas!
@efeito flash
@som torcida
@tracking continua 14
@tracking ir +70 em=2.4
Depois da linha, ela continuou correndo. Um, dois segundos. A outra ainda queria mais.
eu: STILL!
@tracking marca 14 !
@tracking aura 14 off
@tracking rastro 14 off
@tracking para 14
As orelhas giraram. Ela parou. Sozinha. Na hora.
@tracking placar 14 7:3 2:1/2 11:cabeça 5:1
@esperar 1.8
@tracking off
@ir s_final_verdadeiro

== s7_sombra
@musica still_sombra
@efeito vermelho 0.45
@caixa escura
@mostrar still centro corrida aura
Ela passou por mim a caminho do portão sem olhar para o lado.
Os olhos estavam vermelhos. Não o vermelho da corrida. Um vermelho parado, fundo, como vinho.
@esconder todos
@tracking on s_shuka
@esperar 0.6
@som portao
@tracking aura 14 vermelha
@tracking rastro 14 vermelho
@tracking marca 14 ☾ fixo
@tracking foco 14
@tracking ordem 14 /3/ 7 / 2 11 / 5 16 / 9 3 1 / 12 6 / 17 4 / 13 18 / 8 10 15
@tracking ir 1550
Ela não largou. Ela atacou. Do primeiro metro ao último, como um animal que finalmente encontrou a porta aberta.
@tracking ordem 14 /11/ 7 / 2 11 / 5 16 / 9 3 1 / 12 6 / 17 4 / 13 18 / 8 10 15
@tracking ir 300 em=3.6
@tracking marca 7 ?
@tracking marca 2 !
"Locutor": Still in Love... Still in Love está... meu Deus. Ela abre dez corpos. Doze. Ninguém consegue acompanhar!
@tracking ordem 14 /12/ 7 / 2 11 / 5 16 / 9 3 1 / 12 6 / 17 4 / 13 18 / 8 10 15
@tracking ir chegada
@efeito tremor 18
@efeito flashvermelho
"Locutor": Still in Love vence o Shuka Sho. Tríplice Tiara. A... a arquibancada está em silêncio.
@tracking placar 14 7:12 2:1/2 11:cabeça 5:pescoço
@esperar 2
@tracking off
@ir s_final_sombrio

== s_final_verdadeiro
@fundo hipodromo dia rapido
@caixa normal
@efeito vermelho 0
@efeito rosa 0.2
@musica still
@mostrar still centro corrida
@particulas petals 0.6
Ela voltou andando até a cerca. Ofegante, suja de grama, com o véu torto.
still [coracoes]: Eu voltei.
still: Você me chamou e eu voltei. Ela correu e eu voltei. As duas voltaram.
still [brilho]: {t}... eu acho que eu não tenho mais tanto medo dela.
@fundo cafe tarde preto
@ambiente cafe
@mostrar still centro
@efeito rosa 0.15
Na semana seguinte, voltamos à cafeteria. Duas fatias de torta de morango. Dois cafés sem açúcar.
Ela abriu o diário na mesa, na minha frente. Pela primeira vez, me deixou ver enquanto escrevia.
@papel diario | Diário — 20 de outubro
Coisas que eu quero fazer:
1. Levar {t} na confeitaria da rua de trás. ✓
2. Terminar a renda do véu novo. ✓
3. Sorrir sem treinar antes. ✓
4. Não deixar *ela* sair.
Risquei o quatro. Ela pode sair.
Ela também sou eu.
@fimpapel
still [rubor]: Pode olhar.
Ela sorriu. Sem janela, sem espelho, sem ajustar o canto da boca com o dedo.
Um sorriso com dentes demais, talvez. Um pouco selvagem. Completamente dela.
still [coracao]: Esse é o meu sorriso de verdade. Você é a primeira pessoa que vê.
@final still_true | Ainda Aqui | Final Verdadeiro | Still descobriu que a intensidade dos seus sentimentos não precisava ser trancada nem temida — só acolhida. Delicada e feroz, ela agora sabe que pode ser as duas coisas. E que alguém sempre vai chamá-la de volta.

== s_final_normal
@fundo hipodromo dia rapido
@musica still
@mostrar still centro corrida abatida
Ela voltou até a cerca com as mãos tremendo. Tinha vencido. Tinha segurado. As duas coisas.
still: Eu consegui, {t}. Eu controlei tudo. Do começo ao fim.
still: ...Mas ela ainda está aqui. Bem quietinha. Esperando.
@efeito vermelho 0.1
still [reticencias]: Ela sempre vai estar, não vai?
eu: Vai. E eu também.
@fundo cafe noite chuva preto
@mostrar still centro
Naquela noite, ela me mostrou a renda nova que estava começando. Um desenho de pétalas, fio por fio.
still: Se eu errar um fio, você me avisa?
eu: Aviso.
still [rubor]: Então eu continuo cruzando. Com calma.
@final still_normal | Pétalas de Renda | Final | Still conquistou a Tríplice Tiara mantendo seus impulsos sob controle. O medo ainda mora nela, quietinho — mas agora ela tem alguém para segurar o outro bilro enquanto aprende a tecer com ele.

== s_final_sombrio
@fundo hipodromo dia rapido
@mostrar still centro corrida aura
@efeito vermelho 0.5
@efeito vinheta 0.6
@efeito coracao on
Ela veio até a cerca devagar. A arquibancada ainda não tinha voltado a fazer barulho.
still: Você foi embora, {t}.
still: Na chuva. Você disse "talvez você tenha razão". E foi.
@caixa escura
still: {red}Então eu guardei você aqui.{/red}
Ela encostou a mão no próprio peito.
still: {red}Agora ninguém pode tirar. Nem a Ramonu. Nem a Groove. Nem você.{/red}
@efeito glitch 1.2
@fundo praia noite v=lua_vermelha preto
@musica still_sombra
@esconder still
Naquela noite, a lua estava cheia outra vez. Vermelha, sobre o mar.
O quarto dela estava vazio quando Neo foi procurar. Só ficou o diário, aberto em cima da cama.
@papel diario | Diário — 15 de outubro
Ainda.
Ainda.
Ainda estou aqui.
{red}Ainda com fome.{/red}
{red}{shake}Você ainda está aí, {t}?{/shake}{/red}
@fimpapel
@efeito glitch 1.5
still: {shake}{t}...{/shake}
still: {red}Eu ainda estou.{/red}
@final still_dark | Lua Vermelha | Final Sombrio | Sem ninguém para chamá-la de volta, Still deixou a outra correr — e não voltou. Algumas pessoas têm medo de si mesmas porque ninguém nunca ficou para mostrar que elas podiam ser amadas inteiras.
`);
