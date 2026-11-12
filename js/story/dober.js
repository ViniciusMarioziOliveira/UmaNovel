/* =========================================================================
   Rota de Mejiro Dober — "Eu Quero Mudar"
   Conflito: medo de julgamento e insegurança; aprender a mostrar o que sente.
   Linhas com [m] aparecem com Treinador; com [f], com Treinadora — como no
   jogo, Dober é mais defensiva com treinadores e mais aberta com treinadoras.
   (Cenas inspiradas no jogo, mas criadas para esta novel.)
   ========================================================================= */
VN.Script.add('dober', `
== dober_inicio
@musica cotidiano
@fundo portao manha preto
@som sino
Abril. As cerejeiras da Academia Tracen estavam no auge — e eu, no meu primeiro dia.
Não como {tt} titular, ainda. Eu tinha sido contratad{o} como assistente de uma veterana.
@fundo escritorio manha
"Treinadora Hoshino": Então você é {o} nov{o} assistente. Entre, entre. Não repare na bagunça. Trinta anos de papelada não cabem em gaveta nenhuma.
Ela tinha cabelos grisalhos presos num coque e um sorriso que parecia ter visto muitas largadas.
"Treinadora Hoshino": Vou ser honesta com você. Eu não vou ficar muito tempo. O médico já marcou a data da minha aposentadoria. Fim da temporada.
"Treinadora Hoshino": Até lá, quero que você aprenda tudo o que puder. E quero que conheça a minha menina.
"Treinadora Hoshino": Ela é talentosa. Muito mais do que acredita. Esse é justamente o problema.
@som porta
@mostrar dober centro surgir

== d_cap1
# Capítulo 1 | Cool Beauty
@musica dober
Uma garota alta, de cabelos escuros e longos, entrou sem bater. Postura impecável, laço verde no cabelo, olhar frio.
"Treinadora Hoshino": Dober, este é {o} assistente de quem falei.
[m] dober [reticencias]: ...
[m] dober: Um homem.
[m] Ela deu um passo para trás. Depois outro, até encostar na porta. Os olhos não encontravam os meus.
[m] dober [vira]: ...Mejiro Dober. Prazer. Não precisa ficar me encarando.
[f] dober [rubor]: Ah... b-bom dia. Mejiro Dober. Muito prazer.
[f] Ela fez uma reverência rápida, educada demais, e ficou mexendo na ponta do próprio cabelo.
[f] dober: A Treinadora Hoshino disse que você é... de confiança. Eu espero que sim.
"Treinadora Hoshino": A Dober é da família Mejiro. Aquela família. Muita tradição, muita expectativa.
dober [abatida]: ...Não precisa dizer isso para todo mundo.
"Treinadora Hoshino": Desculpe, querida. Vamos tomar um chá antes do treino? Você escolhe as folhas, como sempre.
Dober foi até o armário sem dizer nada. Abriu três latas, cheirou, escolheu uma sem hesitar.
dober: Darjeeling, colheita de primavera. Combina com a manhã. A Treinadora gosta com um pouco de mel.
Ela preparou o chá com uma precisão quase cerimonial. A água na temperatura certa, o tempo contado no relógio.
? Este chá está incrível. Você entende muito disso. => d1_cha | dober+1
? Prefiro café, na verdade. => d1_cafe
? Agradecer em silêncio e beber devagar. => d1_silencio | dober+1, flag:d_respeito

== d1_cha
[m] dober [raiva rubor]: N-não precisa elogiar. É só chá. Qualquer um sabe fazer.
[m] "Treinadora Hoshino": Qualquer um não, querida. Ela passa horas lendo sobre isso.
[m] dober [vira]: ...Treinadora!
[f] dober [rubor]: Ah... obrigada. Eu gosto de chá. De verdade. Fico feliz que tenha gostado.
[f] dober: Se quiser, depois eu te mostro as minhas latas favoritas. Quer dizer... se não for incômodo.
@ir d1_pista

== d1_cafe
dober [reticencias]: ...Café.
dober: Então da próxima vez eu não faço para você.
"Treinadora Hoshino": Hahaha! Ela vai fazer. Ela sempre faz. Só vai reclamar antes.
@ir d1_pista

== d1_silencio
Bebi devagar, sem dizer nada. O chá era delicado, quase floral.
Dober me observou de canto de olho. Quando terminei a xícara, ela a recolheu antes que eu pedisse.
[m] dober: ...Pelo menos você não fala de boca cheia.
[f] dober [rubor]: Você... bebeu tudo. Que bom.

== d1_pista
@fundo pista manha
@ambiente vento
@mostrar dober centro
No treino, entendi o que a Treinadora Hoshino quis dizer. Dober corria lindamente. Passada longa, controle perfeito.
Até perceber que alguém estava olhando.
Um grupo de alunas parou na cerca para assistir. Uma delas apontou. Outra riu de alguma coisa no celular.
@anim dober tremor
Dober errou a passada. Depois errou a respiração. Terminou o tiro dois segundos mais lenta que no aquecimento.
dober [abatida]: ...Elas estavam rindo.
"Treinadora Hoshino": Estavam rindo de um vídeo, Dober. Não de você.
dober: A senhora não tem como saber.
Ela foi até o bebedouro, longe de todos. A Treinadora suspirou e se apoiou em mim.
"Treinadora Hoshino": É isso que eu queria que você visse. Ela não perde para as outras. Ela perde para os olhares.
"Treinadora Hoshino": Eu não tenho mais tempo para ensiná-la a não ter medo deles. Talvez você tenha.

== d_cap2
# Capítulo 2 | Cadernos escondidos
@musica dober
@fundo biblioteca tarde preto
Maio. Fui à biblioteca procurar um livro sobre biomecânica e acabei numa mesa no fundo, perto da janela.
Dober estava lá. Tão concentrada que não me ouviu chegar. Desenhava num caderno com capa de flores.
@mostrar dober centro
Uma cenoura com tranças de folhas. Um tomate sorridente. Uma berinjela tímida.
Eram os personagens de *Veggie Caroline*, um desenho animado infantil.
dober [susto exclamacao]: —!
@anim dober tremor
Ela fechou o caderno com tanta força que uma folha solta escapou e deslizou até os meus pés.
Não era a Veggie Caroline. Era uma página de mangá. Uma garota de cabelos longos esbarrando num desconhecido sob uma chuva de pétalas. "O encontro que estava escrito."
[m] dober [raiva rubor]: Isso é MEU. Devolve!
[m] dober: E não olha. Você não viu nada. Entendeu? Nada!
[f] dober [rubor gota]: Ah... ah, não. Por favor, não olha isso...
[f] dober: É... uma coisa boba. Eu desenho escondido. Ninguém sabe. Nem a Ryan.
? Devolver a folha e dizer, com sinceridade, que o desenho é muito bonito. => d2_elogio | dober+2, flag:d_desenho
? Devolver sem olhar e prometer guardar segredo. => d2_segredo | dober+1, flag:d_segredo
? Perguntar se ela não está grande demais para Veggie Caroline. => d2_provoca | dober-1

== d2_elogio
eu: O traço é muito bonito. A garota tem uma expressão tão... cheia de esperança.
[m] dober [reticencias]: ...
[m] dober: Você está só sendo educado.
[m] eu: Eu não sou tão educado assim.
[m] dober [vira rubor]: ...Hmph. Isso é verdade. Você não bateu na porta da biblioteca.
[m] Ela pegou a folha. Mas antes de guardar, olhou para o desenho como se o visse pela primeira vez.
[f] dober [exclamacao]: Você... achou bonito? De verdade?
[f] dober: Ninguém nunca viu. Eu tinha medo de que, se alguém visse, fosse rir.
[f] Ela abraçou o caderno contra o peito. Dava para ver um sorriso pequeno, escapando sem permissão.
@ir d2_irmaos

== d2_segredo
Devolvi a folha virada para baixo, sem olhar.
eu: Fica entre a gente. Eu não vi nada.
dober [exclamacao]: ...
dober: Você... não olhou mesmo?
eu: Não. Mas pelo seu jeito, devia ser bonito.
[m] dober [rubor vira]: Não faz suposições. ...Mas obrigada por não olhar.
[f] dober [rubor]: Obrigada. De verdade. Eu... vou te mostrar um dia. Quando estiver pronto.
@ir d2_irmaos

== d2_provoca
dober [raiva]: ...Grande demais?
dober: É para os meus irmãos. Eles adoram. Eu desenho para eles.
dober [abatida]: Mas é claro. Uma Mejiro desenhando vegetais. Ridículo. Pode rir.
Eu não ri. Mas o estrago estava feito. Ela juntou as coisas e saiu sem olhar para trás.
@esconder dober
Mais tarde, fiquei sabendo pela Treinadora que os irmãos dela tinham quatro e seis anos. E que ela desenhava cartas para eles toda semana.
@ir d_cap3

== d2_irmaos
dober: Os personagens da Veggie Caroline são para os meus irmãos. Eles têm quatro e seis anos.
dober: Eu desenho cartinhas para eles toda semana. A Caroline sempre aparece ensinando a comer verdura.
dober [abatida]: O mangá... aquilo é só meu. Uma história de uma garota que encontra o destino dela.
dober: Bobagem. Eu sei.
Nesse momento, alguém atravessou a biblioteca como um furacão educado.
@mostrar taiki esquerda pulando
@mover dober direita
taiki [pulo]: Howdy! Dober! Te achei! Sabia que estava aqui escondida!
taiki: Ah! E você é {o} assistente! Taiki Shuttle! Colega de quarto da Dober! Nice to meet you!
dober [gota]: Taiki, estamos numa biblioteca.
taiki [nota]: Sorry, sorry! Mas é que tem treino de largada agora e a Ryan pediu pra te chamar!
taiki: A Dober é super fofa quando desenha, né? Ela fica com a língua um pouquinho pra fora!
dober [raiva rubor]: TAIKI!
Taiki a puxou pelo braço, rindo. Antes de sair, Dober olhou para trás uma única vez.
@esconder todos

== d_cap3
# Capítulo 3 | Olhares na arquibancada
@musica tensao
@fundo hipodromo dia preto
@ambiente torcida
Junho. A corrida de avaliação. Não era uma corrida importante. Mas havia público.
@mostrar dober centro corrida
Dober saiu do vestiário com o traje de corrida: azul-escuro, elegante, com detalhes dourados. Estava pálida.
dober: Tem gente demais.
dober [abatida]: Estão todos olhando. Se eu errar... todo mundo vai ver.
"Treinadora Hoshino": Lembra do que treinamos, Dober. Só você e a pista.
? Segurar o olhar dela: "Eu estou olhando também. E eu acredito em você." => d3_acredito | dober+1
? Contar uma piada boba para quebrar a tensão. => d3_piada
? Não dizer nada e deixar a Treinadora conduzir. => d3_quieto

== d3_acredito
[m] dober [vira]: ...Isso não ajuda. Agora é mais uma pessoa olhando.
[m] Mas, enquanto caminhava para o portão, ela olhou para trás. Para mim.
[f] dober [abatida]: Você acredita... Eu queria acreditar também.
[f] Ela respirou fundo e caminhou para o portão. Olhou para trás uma vez. Para mim.
@ir d3_corrida

== d3_piada
eu: Sabe por que a cenoura sempre ganha corrida? Porque ela tem raiz forte.
dober [reticencias]: ...
dober: Essa foi a piada mais horrível que eu já ouvi.
O canto da boca dela tremeu, só um pouco. Foi o suficiente para ela respirar.
@ir d3_corrida

== d3_quieto
A Treinadora segurou as mãos dela e disse algo baixinho. Dober assentiu sem convicção.

== d3_corrida
@esconder todos
@musica corrida
@tracking on d_avaliacao
@esperar 0.6
@som portao
@tracking faixa LARGADA!
@tracking ordem 6 / 4 2 / 9 1 / 7 3 / 10 5 / 8
@tracking ir 1500
"Locutor": Largada da corrida de avaliação!
@tracking foco 4
@tracking ordem 6 4 / 2 9 / 1 7 / 3 10 / 5 8
@tracking ir 800
@tracking marca 4 ♪
Ela largou bem. Nos primeiros mil metros, foi a mesma Dober dos treinos.
@tracking ordem 6 >4+0.5 / 2 9 / 1 7 3 / 10 5 / 8
@tracking ir 330
Na reta final, passou rente à arquibancada. Rostos, celulares, gritos.
@efeito vinheta 0.4
@caixa escura
@tracking marca 4 gota fixo
dober: *Estão rindo. Estão rindo de mim. Estão todos rindo.*
@caixa normal
@efeito vinheta 0
@tracking cutin off
@tracking marca 4 …
@tracking ordem 6 / 9+0.5 2 / >4 / 1 7 3 / 10 5 / 8
@tracking ir chegada em=3.4
Ela travou. A passada encurtou. Três corredoras passaram por ela nos últimos duzentos metros.
"Locutor": E a chegada! Mejiro Dober termina em quarto lugar.
@tracking placar 6 9:1/2 2:cabeça 4:1 1:2
@esperar 1.8
@tracking off
@fundo pista tarde chuva preto
@musica triste
@som trovao
@efeito flash
Naquela tarde, o céu fechou. Uma tempestade de verão desabou sobre a escola.
@fundo escritorio tarde chuva
@ambiente chuva_dentro
Encontrei Dober na sala de treinadores, encolhida no canto do sofá, de costas para a janela.
@mostrar dober centro arrepio
@som trovao
@efeito tremor 8
dober [susto]: —!
Ela tapou os ouvidos. Os ombros tremiam a cada trovão.
dober: Não... não fala nada. Eu sei que perdi. Eu sei que travei. Eu sei que eles estavam rindo.
? Sentar no outro canto do sofá e falar baixinho de outra coisa: da Veggie Caroline. => d3_caroline | dober+2, flag:d_tempestade
? Fechar as cortinas e ligar a luz, sem dizer nada. => d3_cortinas | dober+1
? Dizer que trovão é só barulho, que não precisa ter medo. => d3_racional

== d3_caroline
eu: No episódio que eu vi ontem, a Caroline tenta convencer o Tomatinho a comer brócolis.
dober [exclamacao]: ...Você viu Veggie Caroline?
eu: Pesquisei depois daquele dia na biblioteca. O brócolis tem nome?
dober: É o Senhor Brócolis. Ele é... um general aposentado. Ele conta histórias de guerra contra as batatas fritas.
@som trovao
dober [arrepio]: ...!
eu: E como termina? A guerra das batatas fritas?
dober: Termina em... em paz. Num piquenique. Todo mundo come junto.
Continuamos assim até a tempestade passar. Ela contando, eu perguntando. A voz dela foi ficando mais firme.
@anim dober calma
[m] dober [rubor]: ...Você fez isso de propósito. Pra me distrair.
[m] eu: Funcionou?
[m] dober [vira]: Não vou responder.
[f] dober [rubor]: Obrigada. Eu... tenho medo de trovão desde pequena. A Ryan também conversava comigo assim.
[f] dober: Você me lembra ela um pouco.
@ir d3_hoshino

== d3_cortinas
Fechei as cortinas, liguei a luz do teto e o abajur. Coloquei uma xícara de chá na mesinha perto dela.
dober [reticencias]: ...
@som trovao
Ela ainda tremeu no trovão seguinte. Mas pegou a xícara com as duas mãos e não soltou mais.
dober: ...O chá está forte demais.
@anim dober calma
@ir d3_hoshino

== d3_racional
eu: Trovão é só barulho. Não pode te machucar aqui dentro.
dober [raiva]: Eu SEI disso!
dober: Saber não adianta nada. Eu sei que as pessoas talvez não estejam rindo também. E daí?
Ela escondeu o rosto nos joelhos. Tinha razão. Saber nunca foi o problema.

== d3_hoshino
@fundo escritorio noite
@ambiente sala
@mostrar dober centro
Quando a chuva parou, a Treinadora Hoshino entrou devagar, apoiada numa bengala que eu nunca tinha visto.
"Treinadora Hoshino": Dober. Eu preciso te contar uma coisa.
"Treinadora Hoshino": Minha última corrida como sua treinadora vai ser o Oaks. Em maio do ano que vem. Depois disso, eu paro.
dober [abatida]: ...O Oaks.
dober: Então eu tenho até o Oaks para mostrar que... que valeu a pena. Tudo isso.
"Treinadora Hoshino": Você não me deve nada, querida.
dober: Devo sim. Eu ainda não mostrei nada. Nada!
Ela saiu correndo. A Treinadora olhou para mim, cansada.
"Treinadora Hoshino": Ela vai precisar de alguém depois de mim. Alguém que fique.

== d_cap4
# Capítulo 4 | Veggie Caroline
@musica dober
@fundo rua dia preto
Agosto. Num domingo de folga, fui ao cinema da rua comercial sem nenhum plano.
@fundo cinema noite v=luzes
@ambiente sala
Na fila da pipoca, reconheci um laço verde. Dober, sozinha, segurando um ingresso para *Veggie Caroline — O Filme: A Grande Horta Encantada*.
@mostrar dober centro
dober [susto exclamacao]: ...!
dober: O que você está fazendo aqui?!
eu: Eu ia ver um filme. Qualquer um.
dober [abatida]: A Ryan ia vir comigo. Ela teve um compromisso de família. Eu ia ver sozinha.
dober: Não ri. É para os meus irmãos. O filme dá um brinde colecionável. Eles querem muito.
? Comprar um ingresso para a mesma sessão. => d4_juntos | dober+1, flag:d_cinema
? Oferecer-se para ir embora e deixá-la à vontade. => d4_embora | dober+1
? Brincar: "Ah, então é PARA OS IRMÃOS, claro." => d4_brinca

== d4_juntos
Comprei um ingresso para a mesma sessão. Ela me olhou como se eu tivesse feito algo absurdo.
[m] dober [vira]: ...Faça o que quiser. Mas senta longe. Pelo menos duas cadeiras.
[f] dober [rubor]: Você vai assistir? Comigo? ...Tudo bem. Senta do meu lado, então. Mas não fala durante o filme.
@ir d4_menu

== d4_embora
eu: Se você preferir, eu vejo outro filme. Não quero atrapalhar.
dober [reticencias]: ...
dober: Não precisa. Quer dizer... a sala é grande. Eu não sou dona do cinema.
Ela não disse "fica". Mas também não disse "vai".
@marcar d_cinema
@ir d4_menu

== d4_brinca
eu: Ah, então é PARA OS IRMÃOS. Claro, claro.
dober [raiva]: É sim!
dober: ...Você é igualzinh{o} à Taiki. Só que menos simpátic{o}.
Ela entrou na sala sem esperar. Eu acabei vendo o filme três fileiras atrás dela.
@ir d4_filme

== d4_menu
No balcão de lanches, mostrei o cardápio no celular.
eu: Vai querer alguma coisa? Eu pago.
[m] dober: Não preciso de nada.
[m] eu: Nem pipoca?
[m] dober [vira]: ...
[m] eu: Nem um suco?
[m] dober [rubor]: ...Pipoca doce. Pequena. E não fica olhando enquanto eu como.
[f] Ela se inclinou sobre o celular sem pensar, os olhos brilhando, e pôs a mão em cima da tela.
[f] dober [brilho]: Pipoca doce! E... esse suco de morango com o copo da Caroline! Olha, o copo tem a Caroline!
[f] dober [rubor]: Ah... desculpa. Eu me empolguei.

== d4_filme
@fundo cinema noite
@ambiente sala
As luzes se apagaram. Na tela, a Caroline e o Senhor Brócolis atravessavam uma horta encantada.
Dober não tirou os olhos da tela nem uma vez. Nas partes engraçadas, ela tapava a boca para não rir alto.
Na parte triste, quando o Tomatinho se perde na tempestade, ela apertou o braço da poltrona.
@fundo rua tarde
@mostrar dober centro
Na saída, ela segurava dois chaveirinhos colecionáveis: a Caroline e o Tomatinho.
dober: Um para cada um. A Mana vai querer a Caroline. O Kou vai brigar pelo Tomatinho, mas no fim vai aceitar.
dober: Eles sempre fazem isso. Eu olho nos olhos deles e explico. Funciona.
[m] dober [reticencias]: ...Você... tem irmãos mais novos?
[m] Perguntou isso olhando para a vitrine de uma loja, como se fosse uma pergunta qualquer.
[m] eu: Tenho. Um primo pequeno, também.
[m] dober: Hm. ...Então você sabe que chaveiro resolve muita coisa.
[f] dober: Me diz uma coisa. O que você faria pra deixar uma criança feliz? Eu quero aprender mais jeitos.
[f] eu: Deixar ela me ensinar alguma coisa. Crianças adoram ensinar.
[f] dober [brilho]: ...Que ideia boa. Eu vou deixar o Kou me ensinar a desenhar o Tomatinho.
dober: Obrigada por hoje. ...Não conta pra ninguém que eu chorei no final.
eu: Você chorou?
dober [raiva rubor]: NÃO chorei.

== d_cap5
# Capítulo 5 | O festival que eu não fui
@musica cotidiano
@fundo praia tarde preto
@ambiente mar
Julho do ano seguinte. Acampamento de verão à beira-mar. No último dia, haveria um festival na cidade ao lado.
Todas as garotas se arrumavam com yukatas coloridos. Menos uma.
@fundo quarto_jp tarde
@ambiente mar
Encontrei Dober numa saleta da pousada, cercada de folhas de papel, lápis de cor e tesoura.
@mostrar dober centro
dober: Não vou ao festival. Tenho que terminar isto.
Era um teatrinho de papel: uma Veggie Caroline em cartões ilustrados, para contar uma história.
dober: Meus irmãos vão passar o fim de semana com os primos. Prometi uma apresentação. Tem doze crianças.
dober [abatida]: Eu queria que fosse perfeito. Eles merecem.
@mostrar ryan esquerda pulando
@mover dober direita
ryan [pulo]: Dober! Ainda aqui? O festival começa em uma hora!
ryan: Ah, oi! Mejiro Ryan, prima dela! Você é {o} assistente da Treinadora Hoshino, né? Tô sabendo de tudo, hein!
dober [gota]: Ryan...
ryan: Quando a gente era pequena, a Dober tinha medo da multidão do festival. Eu segurava a mão dela o tempo todo.
ryan: Ela ficava tão feliz com uma maçã do amor que esquecia o medo. Lembra, Dober?
dober [rubor]: ...Lembro. Você comprava duas e me dava a maior.
dober: Eu quero fazer isso pelos meus irmãos. O que você fazia por mim.
ryan [coracao]: Ah, para. Vai me fazer chorar antes do festival.
@esconder ryan
@mover dober centro
? Sentar e ajudar: recortar, colorir, ensaiar as vozes dos personagens. => d5_ajuda | dober+2, flag:d_teatro
? Ir ao festival e voltar com uma maçã do amor para ela. => d5_maca | dober+1, flag:d_maca
? Insistir que ela vá ao festival: "Você também merece se divertir." => d5_insiste

== d5_ajuda
Sentei no chão ao lado dela e peguei uma tesoura.
eu: Qual é o próximo cartão?
[m] dober [exclamacao]: ...Você vai ajudar? Com... recorte?
[m] dober: Corta direito. Na linha. Se cortar torto eu refaço.
[m] Eu cortei torto. Ela refez. Mas deixou que eu continuasse.
[f] dober [brilho]: Você vai ajudar? Então... você faz a voz do Senhor Brócolis. Ele é grave, tipo um general.
[f] Eu fiz a voz do Senhor Brócolis. Ela riu tanto que precisou parar de colorir.
Ensaiamos a história três vezes. Na terceira, Dober fez a voz da Caroline sem nenhuma vergonha.
dober: ...Isso é divertido. Fazer junto.
@fundo festival noite
@ambiente festival
@mostrar dober centro
Terminamos a tempo de pegar os últimos fogos. Ela ficou parada no meio da multidão, sem medo, olhando o céu.
dober [rubor]: Ninguém está olhando pra mim. Estão todos olhando pros fogos.
dober: Eu acho que... é isso. A maioria das pessoas está olhando pra outra coisa.
@ir d_cap6

== d5_maca
@fundo festival noite
@ambiente festival
Fui ao festival. As lanternas balançavam, os fogos estouravam, as barracas cheiravam a caramelo.
Comprei duas maçãs do amor. Voltei e dei a maior para ela.
@fundo quarto_jp noite
@mostrar dober centro
dober [exclamacao]: ...A maior.
dober [rubor]: Você conversou com a Ryan, não foi?
eu: Talvez.
Ela comeu a maçã em silêncio, colorindo com a outra mão. Os cartões ficaram com marcas de caramelo. Ficaram perfeitos assim mesmo.
@ir d_cap6

== d5_insiste
eu: Você também merece se divertir, Dober.
dober [raiva]: Eu sei o que eu mereço!
dober [abatida]: Desculpa. É que... eu prometi. Se eu não cumprir, eles vão achar que a irmã deles é igual a todo mundo que promete e esquece.
Eu fui ao festival sozinh{o}. Quando voltei, a luz da saleta ainda estava acesa.

== d_cap6
# Capítulo 6 | A Gala Mejiro
@musica cotidiano
@fundo mansao tarde preto
@ambiente passaros
Outono. A família Mejiro realizava uma gala anual na mansão: jantar, música e, no fim da tarde, uma corrida amistosa de estilo livre.
Este ano, Dober tinha sido sorteada para correr contra a prima mais imponente da família.
@mostrar ramonu direita corrida
@mostrar dober esquerda corrida
ramonu: Dober. Que bom. Faz tempo que não corro com você.
ramonu: Você ainda corre como quem pede desculpas?
dober [raiva]: ...Eu não peço desculpas.
ramonu [reticencias]: Veremos.
@esconder ramonu
@mover dober centro
Mejiro Ramonu. Elegante, distante, com um olhar que parecia pesar tudo e achar quase tudo leve demais.
dober [abatida]: Eu nunca venci a Ramonu. Nem nos treinos de criança.
@esconder todos
@musica corrida
@tracking on d_amistosa
@esperar 0.6
@som portao
@tracking ordem 2 / 1
@tracking ir 1300
@tracking marca 2 ♪
@tracking marca 1 gota
Na corrida, Ramonu parecia passear. Dober se esforçava em cada passada para não ficar para trás.
@tracking ordem 2 /0.6/ >1
@tracking ir reta
@tracking aura 2 branca
@tracking rastro 2
@tracking ordem 2 /3/ 1
@tracking ir chegada em=3.4
Na reta final, Ramonu acelerou como quem vira a página de um livro. Venceu por três corpos, sem suar.
@tracking placar 2 1:3
@esperar 1.8
@tracking off
@fundo mansao tarde rapido
@musica dober
@mostrar ramonu direita corrida
@mostrar dober esquerda corrida abatida
ramonu: Melhor que da última vez. Mas você olhou para a plateia três vezes. Eu contei.
ramonu: Na pista, só existem as rivais e o vento. O resto é paisagem.
@esconder ramonu
@mover dober centro
@mostrar airgroove direita
Uma Uma de postura impecável se aproximou. Air Groove. A Imperatriz.
dober [exclamacao]: A-Air Groove-san?!
airgroove: Mejiro Dober. Assisti à corrida.
airgroove: Você perdeu. Mas correu até o fim sem desistir. Isso não é pouca coisa.
airgroove: Não dobre suas convicções por causa de uma derrota. Ideais crescem devagar.
@esconder airgroove
dober [abatida]: A Air Groove-san falou comigo...
dober: Mas eu perdi. De novo. Eu não sou a Ramonu. Eu não sou a Air Groove-san. Eu não sou a Ryan.
dober: Eu queria mudar. Eu queria ser alguém que não precisa ter medo. E eu continuo a mesma.
? "Você não precisa ser nenhuma delas. Eu treino a Dober." => d6_dober | dober+2, flag:d_ela
? "Você vai alcançá-la. É questão de tempo e treino." => d6_tempo | dober+1
? "Ninguém vence a Ramonu. Não se cobre tanto." => d6_ninguem

== d6_dober
[m] dober [reticencias]: ...
[m] dober: Você fala isso com uma cara tão séria.
[m] eu: É porque é sério.
[m] dober [vira rubor]: ...Hmph. Então... continua treinando a Dober. Já que insiste.
[f] dober [exclamacao]: ...A Dober.
[f] dober: Eu passei a vida inteira querendo ser outra pessoa. Mais forte, mais segura, mais Mejiro.
[f] dober [rubor]: Ninguém nunca disse que queria só... eu. Obrigada.
@ir d6_fim

== d6_tempo
dober: Tempo. Eu não tenho tempo. O Oaks é em maio.
dober: ...Mas obrigada. Vou treinar mais.
@ir d6_fim

== d6_ninguem
dober [raiva]: Então pra que eu treino?
dober: Se ninguém vence, por que eu me esforço tanto? Pra perder bonito?
Eu tinha tentado consolar. Mas, para ela, soou como desistir dela.

== d6_fim
@fundo mansao noite
Mais tarde, na varanda, a Treinadora Hoshino me chamou de lado. Tossia mais do que no começo do ano.
"Treinadora Hoshino": Você é bom com ela. Melhor do que eu esperava.
"Treinadora Hoshino": Quando eu sair, ela vai precisar de alguém. Ela não vai pedir. Ela nunca pede.
"Treinadora Hoshino": Então eu estou pedindo por ela.

== d_cap7
# Capítulo 7 | Os rostos que acreditam
@musica tensao
@fundo hipodromo dia preto
@ambiente torcida
Maio. Yushun Himba — o Oaks. A última corrida da Treinadora Hoshino.
Mais de cem mil pessoas no hipódromo.
@mostrar dober centro corrida
dober: Tem gente demais. De novo.
dober [abatida]: Eu vou travar. Eu sei que vou. E vai ser na última corrida dela.
@se dober<4 => d_final_cortina
"Treinadora Hoshino": Dober. Olha para mim.
"Treinadora Hoshino": Você não precisa olhar para todo mundo. Procura na arquibancada só os rostos de quem acredita em você.
"Treinadora Hoshino": Os outros são paisagem.
dober: ...Rostos de quem acredita.
? Apontar para a arquibancada: "A Ryan e a Taiki estão ali. Seus irmãos também vieram." => d7_rostos | dober+1, flag:d_rostos
? "Procura o meu também. Eu vou estar na cerca, perto da chegada." => d7_cerca | dober+1, flag:d_cerca
? "Corre pela Treinadora Hoshino." => d7_hoshino

== d7_rostos
Na arquibancada, uma faixa enorme, mal pintada, com letras coloridas: "VAI, DOBER-NEE!!". Duas crianças a seguravam, uma de cada lado. Ryan e Taiki pulavam atrás.
dober [exclamacao]: ...A Mana e o Kou.
dober [rubor]: Eles escreveram errado. É "Dober-nee-chan".
Ela riu. De verdade. No meio de cem mil pessoas.
@ir d7_corrida

== d7_cerca
[m] dober [vira]: ...Você na cerca. Com essa cara.
[m] dober: Tá bom. Eu procuro. Mas não acena feito bob{o}.
[f] dober [rubor]: Na cerca. Perto da chegada. Eu vou te procurar. Promete que vai estar lá?
[f] eu: Prometo.
@ir d7_corrida

== d7_hoshino
dober [aceno]: Pela Treinadora. Sim.
O peso da frase caiu sobre os ombros dela. Eu vi.

== d7_corrida
@esconder todos
@musica corrida
@tracking on d_oaks
@esperar 0.6
@som portao
@tracking faixa LARGADA!
@tracking ordem 3 / 11 7 / 1 15 / 9 5 / 13 2 17 / 8 4 / 16 10 / 6 12 14 / 18
@tracking ir 1950
"Locutor": Largada do Yushun Himba!
@tracking foco 9
@tracking ordem 3 11 / 7 1 / 15 5 / 13 9 2 / 17 8 / 4 16 / 10 6 / 12 14 18
@tracking ir 480
@tracking ordem 3 11 / 7 1 / 15 5 >9 / 13 2 / 17 8 / 4 16 / 10 6 / 12 14 18
Ela largou bem e se acomodou no meio do pelotão. Na reta final, passou rente à arquibancada outra vez. Rostos. Celulares. Gritos.
@efeito vinheta 0.35
@tracking marca 9 gota fixo
@se flag:d_rostos || flag:d_cerca => d7_procura
dober: *Estão olhando... estão todos olhando...*
@efeito vinheta 0
@tracking cutin off
@tracking marca 9 !
@tracking ordem 3 11 / 7 1 / 15 5 / 13 >9 / 2 17 / 8 4 / 16 10 / 6 12 14 / 18
@tracking ir 330
Ela vacilou. Mas, no último instante, ouviu a voz rouca da Treinadora acima de todas as outras: "DOBER!".
@ir d7_chegada
== d7_procura
@efeito vinheta 0
@tracking marca 9 !
@se flag:d_rostos => d7_faixa
dober: *Na cerca... perto da chegada... ali.*
@ir d7_chegada
== d7_faixa
dober: *"VAI, DOBER-NEE"... escrito errado... ali.*
== d7_chegada
@tracking cutin off
@tracking marca 9 -
@tracking faixa RETA FINAL!
@tracking aura 9 branca
@tracking rastro 9
@tracking marca 9 !!
@tracking ordem 3 11 >>9 / 7 1 / 15 5 / 13 2 / 17 8 / 4 16 / 10 6 / 12 14 18
@tracking ir 240 em=1.2 espera
@tracking ordem >>9 /1.5/ 3 11 / 7 1 / 15 5 / 13 2 / 17 8 / 4 16 / 10 6 / 12 14 18
@tracking ir chegada em=3.6
@efeito tremor 12
"Locutor": Mejiro Dober abre caminho por fora! Mejiro Dober dispara! Mejiro Dober vence o Oaks!
@efeito flash
@som torcida
@musica vitoria
@tracking placar 9 3:1.5 11:cabeça 7:1/2 1:pescoço
@esperar 2
@tracking off
@fundo hipodromo dia rapido
@particulas confetti 0.6
A arquibancada explodiu. Dober desacelerou devagar, olhando para cima. Depois procurou alguém na multidão.
@se dober>=9 && flag:d_ela => d_final_verdadeiro
@ir d_final_normal

== d_final_verdadeiro
@mostrar dober centro corrida
Encontrou a Treinadora Hoshino, de pé, chorando sem nenhuma vergonha. Encontrou os irmãos, a faixa, a Ryan.
E então encontrou meus olhos. E não desviou.
dober [brilho]: Treinadora! Eu consegui! A senhora viu?!
"Treinadora Hoshino": Vi, querida. Vi tudo. Agora eu posso ir em paz.
@fundo escritorio tarde preto
@musica dober
@mostrar dober centro
Uma semana depois, a sala da Treinadora Hoshino ficou vazia. Só sobraram as latas de chá.
Dober entrou sem bater, como sempre. Mas desta vez trazia um caderno de capa de flores.
[m] dober [rubor]: Toma. ...Não é nada de mais. É o capítulo um. Do mangá.
[m] dober: A garota esbarra num treinador muito chato, muito teimoso, que não sabe cortar papel na linha.
[m] dober [vira]: Não é você. Qualquer semelhança é coincidência.
[m] dober: ...Eu decidi continuar com você. Eu estava com medo no começo. Mas agora eu já me acostumei. Então fica.
[f] dober [rubor]: Eu queria te mostrar uma coisa. O capítulo um do meu mangá. Você é a primeira pessoa a ler.
[f] dober: A garota encontra uma treinadora que fala do Senhor Brócolis no meio de uma tempestade.
[f] dober: Eu estava insegura no começo. Mas decidi seguir em frente com você. Daqui em diante, também.
dober: E... obrigada. Por tudo. Eu ainda tenho dificuldade de dizer isso. Então vou escrever num balão de fala, depois.
@final dober_true | Do Meu Jeito | Final Verdadeiro | Dober aprendeu a procurar, na multidão, os rostos de quem acredita nela — e descobriu que mostrar carinho não é fraqueza. Ela ainda fica vermelha. Mas agora fala.

== d_final_normal
@mostrar dober centro corrida
Ela encontrou a Treinadora Hoshino, de pé, aplaudindo. Fez uma reverência longa, impecável, de Mejiro.
@fundo escritorio tarde preto
@musica dober
@mostrar dober centro
Uma semana depois, a sala da Treinadora ficou vazia. Dober entrou, olhou as latas de chá e escolheu uma.
dober: Darjeeling. Colheita de primavera. Ela gostava com mel.
[m] dober: ...Você vai continuar sendo meu treinador. A Treinadora pediu. Não pense que fui eu.
[f] dober: Você vai continuar sendo minha treinadora? A Treinadora pediu. E... eu também queria.
Ela ainda não conseguia dizer tudo. Mas fez chá para dois.
@final dober_normal | Um Passo de Cada Vez | Final | Dober venceu o Oaks e se despediu da Treinadora Hoshino com a vitória que tanto queria dar. O medo dos olhares não sumiu de vez — mas, a cada corrida, ela olha um pouco menos para a plateia e um pouco mais para quem acredita nela.

== d_final_cortina
@musica triste
Ela olhou para a arquibancada. Para os cem mil rostos. E não conseguiu encontrar nenhum que fosse dela.
@esconder todos
@tracking on d_oaks em=520
@tracking foco 9
@tracking ordem 3 11 / 7 9 1 / 15 5 / 13 2 / 17 8 / 4 16 / 10 6 / 12 14 18
@efeito vinheta 0.5
@tracking marca 9 … fixo
@tracking ordem 3 / 11 7 / 1 15 / 5 13 / 2 / 9 17 / 8 4 / 16 10 / 6 12 14 / 18
@tracking ir chegada em=4.2
Na reta final, ela travou. Como na avaliação. Como sempre.
"Locutor": Mejiro Dober termina em nono lugar.
@efeito vinheta 0
@tracking off
@fundo escritorio noite preto
@mostrar dober centro abatida
A Treinadora Hoshino se aposentou na semana seguinte, como planejado. Dober foi a última a sair da festa de despedida.
dober: A Treinadora disse que eu não devo nada a ela.
dober: Mas eu devia. E não paguei.
dober: Eu vou pedir para treinar com outra pessoa. Não é culpa sua. Eu só... preciso começar de novo, longe de quem me viu falhar.
@esconder dober
@final dober_alone | Atrás da Cortina | Final Solitário | Dober ainda procura a coragem de correr sob tantos olhares. Talvez, um dia, alguém consiga mostrar a ela que a maior parte da plateia está torcendo — e não rindo.
`);
