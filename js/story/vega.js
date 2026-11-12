/* =========================================================================
   Rota de Admire Vega — "Estrela de Primeira Grandeza"
   Conflito: culpa, isolamento e dificuldade de aceitar a felicidade.
   (As cenas são inspiradas no jogo, mas criadas para esta novel.)
   ========================================================================= */
VN.Script.add('vega', `
== vega_inicio
@musica cotidiano
@fundo portao manha preto
@som sino
Abril. As cerejeiras da Academia Tracen estavam no auge — e eu, no meu primeiro dia como {tt}.
Diziam que ali treinavam as garotas mais rápidas do Japão. Que algumas delas corriam carregando sonhos maiores que o próprio corpo.
@mostrar tazuna centro
tazuna [pulo]: Bom dia! Você deve ser {o} nov{o} {tt}, não é? Seja muito bem-vind{o} à Academia Tracen!
tazuna: Eu sou Tazuna Hayakawa, secretária da diretoria. Qualquer dúvida, qualquer coisinha mesmo, pode contar comigo.
eu: Muito prazer. Eu... ainda não acredito que estou aqui.
tazuna [nota]: Todo mundo diz isso no primeiro dia! Vamos, vou te entregar a lista das alunas que ainda procuram alguém para treiná-las.
Ela me passou uma prancheta. Nomes, tempos, observações. Um deles tinha uma anotação em vermelho ao lado.
eu: "Admire Vega — recusou seis treinadores"?
tazuna [gota]: Ah... a Vega-san. Ela é talentosíssima, mas diz que não precisa de ninguém. Treina sozinha até tarde, todos os dias.
tazuna: Se quiser conhecê-la, é só ir até a pista depois que o sol se põe. Ela sempre está lá.
tazuna: Mas não leve para o lado pessoal se ela te mandar embora, tá?
@esconder tazuna
Eu olhei para aquele nome por um bom tempo. Seis recusas.
Não sei por quê, mas tive certeza de que precisava ver aquela garota correr.

== v_cap1
# Capítulo 1 | Uma estrela que brilha sozinha
@musica noite
@fundo pista tarde preto
O dia passou em reuniões e formulários. Quando enfim saí, o céu já tinha a cor de um pêssego maduro.
A pista estava quase vazia. Quase.
@fundo pista crepusculo lento
@som passos
Uma garota corria sozinha pela reta. Passada longa, postura perfeita, os cabelos castanhos riscando o ar.
Era bonito de ver. E, ao mesmo tempo, havia algo estranho no jeito dela correr.
Ela não corria como quem quer chegar a algum lugar. Corria como quem foge de alguma coisa.
Volta após volta. Até que diminuiu o ritmo, parou junto à cerca... e me viu.
@musica vega
@mostrar vega centro
vega [reticencias]: ...
vega: Se veio me oferecer um contrato, a resposta é não.
eu: Eu nem disse nada ainda.
vega: Não precisa. Todos dizem a mesma coisa. "Você tem talento." "Eu posso te levar longe."
vega [vira]: Eu não preciso que ninguém me leve a lugar nenhum.
vega: ...Já posso ir? Preciso treinar mais. Vencer mais. Preciso me tornar uma estrela de primeira grandeza.
Ela já tinha virado as costas. Se eu não dissesse algo agora, não haveria uma segunda chance.
? Sua passada esquerda encurta nas curvas. Você está poupando a perna? => v1_olho | vega+2, flag:v_olho
? Por que "primeira grandeza"? => v1_grandeza | vega+1
? Tudo bem. Eu volto amanhã. => v1_amanha

== v1_olho
@anim vega desvira
vega [exclamacao]: ...!
Ela parou no meio do passo. As orelhas giraram na minha direção antes do resto do corpo.
vega: Como você percebeu isso? Ninguém nunca...
vega [abatida]: É o tornozelo. Torci no inverno. Já sarou. Só que... o corpo ainda lembra.
eu: O corpo lembra antes da cabeça. Dá para corrigir com exercícios de apoio. Sem forçar.
vega [levanta]: ...Hmph. Você tem olho bom. Isso não muda a minha resposta.
Mas ela não foi embora. Ficou ali, me olhando de canto, como quem mede a distância de uma estrela.
@ir v1_fim

== v1_grandeza
@anim vega desvira
vega: ...
vega: Estrelas de primeira grandeza são as mais brilhantes do céu. As que ninguém consegue ignorar.
vega: Elas brilham sozinhas. Não precisam de ninguém do lado.
eu: Mesmo as estrelas mais brilhantes fazem parte de constelações.
vega [aceno]: ...Isso é coisa de quem lê livro de autoajuda.
Achei ter visto o canto da boca dela se mexer. Talvez tenha sido só a luz.
@ir v1_fim

== v1_amanha
vega: Faça como quiser. A resposta vai ser a mesma.
eu: Então eu volto depois de amanhã também.
vega [reticencias]: ...Você é teimos{o}.
eu: Você treina sozinha todo dia até essa hora. Acho que somos parecidos.
Ela não respondeu. Mas também não me mandou embora uma terceira vez.

== v1_fim
@esconder vega
@fundo pista noite lento
Ela voltou para a pista. Eu fiquei na cerca até as luzes se acenderem.
Lá em cima, sobre as arquibancadas, uma estrela muito brilhante aparecia antes de todas as outras.
Sozinha.

== v_cap2
# Capítulo 2 | Leitura em voz alta
@musica cotidiano
@fundo biblioteca tarde preto
Maio. Fui à pista quase todas as tardes. Vega fingia não me ver; eu fingia não perceber que ela fingia.
Numa sexta-feira, procurando um livro sobre fisiologia, ouvi uma voz baixa entre as estantes.
Clara, bem pronunciada. Alguém lendo em voz alta.
@musica vega
@mostrar vega centro
Era ela. Sentada no peitoril do janelão, com um livro grosso de capa azul. *Mitos do Céu de Verão.*
@papel livro | Mitos do Céu de Verão — A Lira
...e Orfeu desceu ao mundo dos mortos para buscar Eurídice, e tocou sua lira com tanta tristeza que até as sombras choraram.
Os deuses permitiram que ela voltasse, com uma única condição: que ele não olhasse para trás até chegarem à luz.
Orfeu caminhou. Ouvia apenas o silêncio às suas costas.
E, a um passo da saída, não aguentou —
@fimpapel
vega [reticencias]: ...
A voz parou ali. Ela fechou o livro com cuidado, como quem fecha uma porta.
? Bater palmas, baixinho. => v2_palmas | vega+1
? Por que parou? => v2_parou | vega+1
? Sair em silêncio, sem atrapalhar. => v2_silencio | flag:v_respeitou

== v2_palmas
@anim vega susto
vega [exclamacao]: —!
vega [rubor]: H-há quanto tempo você está aí?
eu: Desde Eurídice. Você lê muito bem.
vega [vira]: ...Ler em voz alta me acalma. Só isso. Não tem nada de especial.
As orelhas dela diziam outra coisa. Estavam em pé, inquietas, viradas para mim.
@ir v2_lira

== v2_parou
vega: ...Porque eu sei como termina.
vega: Ele olha para trás. E perde ela para sempre.
vega [abatida]: A lira dele virou constelação depois. A Lira. A estrela mais brilhante dela é Vega.
eu: Como você.
vega: Como eu.
@ir v2_lira

== v2_silencio
@esconder vega
Achei que aquela leitura não era para ninguém ouvir. Saí sem fazer barulho.
No dia seguinte, na pista, ela veio até a cerca antes de começar o treino.
@mostrar vega centro
vega: Você estava na biblioteca ontem.
eu: ...Estava.
vega [reticencias]: Você ouviu e foi embora sem dizer nada.
vega: ...Obrigada.
@afeto vega +1

== v2_lira
@fundo pista tarde
@mostrar vega centro
vega: Escute. Minha estreia é em outubro.
vega: Até lá, você pode cuidar dos meus treinos. Se eu achar que você atrapalha, acabou. Sem discussão.
eu: Isso é um contrato?
vega [vira]: É um período de teste. Não se anime.
Eu me animei. Muito. Mas tentei não deixar transparecer.
@musica cotidiano
O primeiro treino foi de resistência. Ela cumpriu tudo antes do tempo. E depois continuou.
Mais uma volta. E outra. A respiração ficando curta, o rosto pálido sob o sol de maio.
@anim vega desvira
vega: Mais uma... eu ainda consigo.
? Chega por hoje. => v2_limite | vega+1, flag:v_limite
? Tudo bem. Só mais uma, então. => v2_forcou | flag:v_forcou

== v2_limite
eu: Não. Hoje acabou.
vega [raiva]: Eu disse que ainda consigo!
eu: Eu sei que consegue. É exatamente por isso que estou mandando parar.
eu: Se você se quebrar em maio, não vai ter estreia em outubro.
vega [reticencias]: ...
Ela me encarou por um longo segundo. Depois tirou as sapatilhas com força demais.
vega: ...Teimos{o}.
Mas, no dia seguinte, chegou dez minutos antes e me perguntou qual era o plano.
@ir v_cap3

== v2_forcou
vega [aceno]: ...Hmph.
Ela voltou para a pista. Na curva final, as pernas falharam e ela caiu de joelhos na grama.
@efeito tremor 8
eu: Vega!
vega: Estou bem. Viu? Eu... ainda consigo.
Ela se levantou sozinha. Recusou minha mão.
Naquela noite eu fiquei pensando que algumas pessoas não correm para ganhar. Correm para pagar alguma coisa.

== v_cap3
# Capítulo 3 | Coisas macias
@musica cotidiano
@fundo rua dia chuva preto
Junho chegou com a estação das chuvas. Num domingo cinzento, fui à rua comercial comprar toalhas novas para o clube.
@mostrar curren esquerda deslizar
curren [pulo]: Kawaii! Isso é {um} {tt} na rua comercial num domingo de chuva?!
Uma garota de cabelos claros, com um guarda-chuva de babados, apareceu na minha frente com o celular em punho.
curren: Ayabe-san, Ayabe-san! Não é {o} {seu} {tt}?
@mostrar vega direita
vega [reticencias]: ...Não é "meu". É temporári{o}.
curren [coracao]: Temporári{o}, é? Hmmm~ ♡
curren: Eu sou a Curren Chan, colega de quarto da Ayabe-san! A Curren decidiu que hoje a Ayabe-san ia comprar chinelos novos!
curren: Os dela estão mais duros que papelão, mas ela não troca porque nenhum é "macio do jeito certo".
vega [rubor]: Eu só tenho padrões.
curren [nota]: Padrões altíssimos! Ela é a pessoa mais exigente do mundo com coisas fofinhas!
curren: Ah! A luz da chuva está perfeita pro Umastagram! A Curren já volta! Fiquem aí!
@esconder curren
@mover vega centro
E, assim, eu e Vega ficamos sozinhos diante de uma prateleira de chinelos de pelúcia.
Ela pegou o primeiro. Apertou. Franziu a testa. Devolveu.
vega: Macio demais vira mole. Mole demais perde a forma.
vega: Tem que ser macio... com caráter.
Ela dizia aquilo com a mesma seriedade com que analisava tempos de volta. Era a coisa mais adorável que eu já tinha visto.
? Esse azul-clarinho, com estrelas bordadas. => v3_estrelas | vega+1, flag:v_chinelo
? O mais caro deve ser o melhor. => v3_caro
? Me deixa testar também. Com seriedade. => v3_testar | vega+2, flag:v_chinelo

== v3_estrelas
vega: ...Tem estrelas. Isso não muda nada na maciez.
Ela apertou. Uma vez. Duas. Três.
vega [brilho]: ...
vega: Vou levar. Pela costura. Que é boa.
As orelhas dela tinham ficado completamente em pé.
@ir v3_toldo

== v3_caro
vega [reticencias]: Preço não é maciez.
eu: ...Justo.
Ela acabou escolhendo sozinha um par cinza, simples, depois de vinte minutos de testes rigorosos.
@ir v3_toldo

== v3_testar
Peguei um par e apertei com a mesma concentração dela. Ela me observou, desconfiada.
eu: Esse aqui tem a sola firme, mas o forro cede bem. Esse outro é bonito, mas a espuma volta devagar.
vega [exclamacao]: ...Você entende.
vega: Ninguém entende. A Curren diz que "é tudo fofinho igual".
eu: Não é tudo igual. Esse azul com estrelas é o melhor da prateleira.
vega [rubor]: ...Foi o que eu pensei também.
@ir v3_toldo

== v3_toldo
@fundo rua tarde chuva
@mostrar curren esquerda
@mover vega direita
curren: Voltei! Achou? Achou?! Kawaii! Agora a Ayabe-san vai dormir feliz!
curren: Sabia que ela dorme abraçada no próprio rabo? Todas as noites! É a coisa mais kawaii do dorm—
vega [raiva tremor]: CURREN.
curren [gota]: Ops. Segredo de Estado. A Curren não disse nada!
curren: Ah, e eu chamei ela pro ofurô de novo ontem, e ela recusou de novo! Fala alguma coisa pra ela, {t}!
vega: Eu gosto de tomar banho sozinha.
Esperamos a chuva diminuir debaixo do toldo de uma padaria. Curren tirou dezessete fotos do céu cinza.
@esconder curren
vega: ...Ela é barulhenta.
vega: Mas não desiste de mim. Mesmo quando eu fecho a porta.
vega [abatida]: Igual a você.
Ela disse aquilo baixinho, quase para a chuva. Depois pareceu perceber o que tinha dito, e ficou em silêncio.
A chuva parou alguns minutos depois. Nenhum de nós comentou mais nada. Não precisava.

== v_cap4
# Capítulo 4 | Tanabata
@musica cotidiano
@fundo rua noite v=tanabata preto
@ambiente festival
Sete de julho. A rua comercial virou um rio de papel colorido: bambus carregados de tiras de desejo, serpentinas, lanternas.
Dizem que nessa noite Orihime e Hikoboshi — Vega e Altair — atravessam a Via Láctea para se encontrar. Uma única vez por ano.
Vega tinha vindo. Eu, sinceramente, não esperava.
@mostrar toproad esquerda
@mostrar opera direita
@mostrar vega centro
toproad [pulo]: Ayabe-san! Você veio mesmo! Eu falei pra Opera que você vinha!
opera [brilho]: Hahaha! Naturalmente! Até as estrelas descem à Terra quando esta Soberana se apresenta!
opera: Admire Vega! Narita Top Road! E... {um} {tt}! Excelente! Toda grande ópera precisa de plateia!
vega [reticencias]: Você não está se apresentando. Isso é um festival.
opera: O mundo inteiro é um palco, minha cara!
toproad: Desculpa, {t}... ela é sempre assim. Eu sou a Narita Top Road. A Ayabe-san fala de você, sabia?
vega [exclamacao]: Eu não falo.
toproad [nota]: Fala sim. "{Ele} mandou eu parar de novo." "{Ele} acha que entende de chinelo."
Eu não soube onde enfiar a cara. Vega também não.
toproad: Olha, eu vou escrever o meu: "Ganhar o Kikuka Sho!" E a Opera...
opera: "Que o mundo inteiro se curve à minha ópera." Simples. Modesto.
Elas penduraram as tiras e foram atrás de uma barraca de algodão-doce, discutindo qual sabor era mais "digno de uma Soberana".
@esconder toproad
@esconder opera
@musica vega
Vega ficou parada diante do bambu. Segurava uma tira azul em branco.
vega: ...Vega é a Orihime. A estrela que só pode encontrar quem ama uma vez por ano.
vega: Eu tenho uma irmã.
As orelhas dela se moveram sozinhas quando disse a palavra. Como se ouvissem algo que eu não ouvia.
vega [abatida]: ...Tinha.
Ela não explicou. E eu entendi que não era hora de perguntar. Peguei uma tira para mim.
? Escrever: "Que a Vega possa correr por ela mesma." => v4_desejo_ela | vega+2, flag:v_desejo_ela
? Escrever: "Vencer o Derby juntos." => v4_derby | vega+1
? Mostrar a tira em branco: "Eu também não sei o que pedir." => v4_branco | vega+1, flag:v_branco

== v4_desejo_ela
Escrevi rápido, antes que pudesse me arrepender, e pendurei num galho baixo.
Ela leu. Ficou muito tempo lendo.
vega: ...Você não sabe do que está falando.
Mas não tirou a minha tira do bambu. E eu reparei que ela ajeitou o barbante para não cair.
@ir v4_dela

== v4_derby
vega: ...Isso é óbvio.
vega: Mas se está escrito, vira compromisso. Não esqueça.
@ir v4_dela

== v4_branco
vega: ...Então somos dois.
Pela primeira vez, a voz dela soou quase como uma risada. Quase.
@ir v4_dela

== v4_dela
Por fim, ela escreveu. Uma frase curta, com a letra mais cuidadosa que já vi.
@papel tanzaku | desejo de Vega
Que você possa
correr no céu.
@fimpapel
Não era um pedido para ela. Eu sabia. Ela sabia que eu sabia.
vega: Vamos sair daqui. Tem gente demais.
@fundo colina noite v=constelacao preto
@mostrar vega centro
@musica noite
Subimos a colina atrás da escola. Lá embaixo, o festival virou um punhado de luzes quentes. Lá em cima, o céu inteiro.
vega: Ali. A mais brilhante, um pouco à direita. É Vega.
vega: Do outro lado do rio de estrelas, aquela é Altair. E aquela, no meio da Via Láctea, é Deneb.
vega: Juntas, formam o Triângulo de Verão. Três estrelas que nem são vizinhas... mas daqui parecem estar de mãos dadas.
eu: Você entende muito de estrelas.
vega: Eu olho para cima desde pequena. É onde eu acho que ela está.
vega: Se eu brilhar forte o bastante... uma estrela de primeira grandeza... talvez ela consiga me ver de onde estiver.
vega [abatida]: Talvez ela saiba que eu não desperdicei nada.
O vento passou pela grama. Um vaga-lume pousou no ombro dela e partiu de novo.
vega: ...Esqueça o que eu disse.
vega [levanta]: Mas... obrigada. Por hoje.

== v_cap5
# Capítulo 5 | A estreia
@musica tensao
@fundo hipodromo dia preto
@ambiente torcida
Outubro. O dia da estreia.
A arquibancada estava cheia. O vento tinha cheiro de grama cortada e de nervosismo.
@mostrar vega centro corrida
Vega saiu do vestiário com o traje de corrida. Azul profundo, detalhes dourados, como um pedaço de céu noturno costurado à mão.
vega: Hoje eu venço.
vega: Por ela.
Ela tremia. Pouco, quase nada. Só nas pontas dos dedos.
? Corre por você também. => v5_voce
? Respira. Lembra do treino: espaço nas curvas. => v5_tatica | vega+1, flag:v_tatica
? [flag:v_chinelo] Entregar uma almofadinha macia que você trouxe. => v5_almofada | vega+2, flag:v_almofada

== v5_voce
@se flag:v_desejo_ela => v5_voce2
vega: ...Não tenho tempo para isso agora.
@ir v5_corrida
== v5_voce2
vega [raiva]: Não diga isso agora. Não hoje.
Ela fechou os olhos com força. Eu tinha tocado num lugar que ainda sangrava.
@ir v5_corrida

== v5_tatica
vega: ...Espaço nas curvas. Eu sei.
vega [aceno]: Eu sei. Obrigada.
@ir v5_corrida

== v5_almofada
Tirei da mochila uma almofadinha do tamanho de uma mão, azul, com uma estrela costurada. Achei numa lojinha perto da padaria.
vega [exclamacao]: ...
Ela apertou. Uma vez. Duas. Fechou os olhos.
vega [brilho]: ...Macio. Com caráter.
vega: Guarda para mim até eu voltar. Não deixa ninguém apertar.
O tremor nas mãos dela tinha passado.
@ir v5_corrida

== v5_corrida
@esconder todos
@musica corrida
@tracking on v_estreia
@som portao
@tracking faixa LARGADA!
@tracking ordem 3 / 1 5 / 9 2 12 / 14 7 / 4 10 6 / 16 11 / 8 13 15
@tracking ir 1250
"Locutor": E abrem-se os portões! Largada limpa para as dezesseis competidoras!
@tracking foco 7
@tracking ordem 3 5 / 1 9 / 2 12 / 14 7 6 / 4 10 / 16 11 8 / 13 15
@tracking ir 950
Vega largou bem e se acomodou no meio do pelotão, guardando energia. Exatamente como treinamos.
"Locutor": Admire Vega guardada no meio do grupo, olhos fixos na frente!
@tracking ordem 3 5 9 / 1 2 12 / 14 _ 6 / >7 4 10 / 16 11 8 / 13 15
@tracking ir ultima
Última curva. O grupo se fechou como uma parede. Uma brecha estreita surgiu entre duas corredoras.
@tracking marca 7 !
@se flag:v_tatica => v5_hesita
Ela não hesitou.
@ir v5_forca
== v5_hesita
@tracking marca 7 ?
Por um instante, achei que ela fosse dar a volta por fora, com espaço, como tínhamos treinado.
@tracking marca 7 ★
Mas ela olhou para cima. Para o céu. E não hesitou.
== v5_forca
@tracking ordem 3 5 / 1 7 9 / 2 12 // 14 4 >6 / 10 16 / 11 8 / 13 15
@tracking ir 420 em=1.3
@tracking choque 7 6
@tracking marca 6 !
@tracking marca 14 #
@efeito tremor 16
@som impacto
Vega forçou a passagem. Uma das garotas desequilibrou. Outra teve que puxar o freio.
@tracking faixa RETA FINAL!
@tracking aura 7 branca
@tracking rastro 7
@tracking ordem 7 3 / 5 1 / 9 2 / 12 4 / 10 14 6 / 16 11 / 8 13 15
@tracking ir 220
"Locutor": Admire Vega por dentro! Admire Vega dispara! É ela! É ela!
@tracking ordem 7 /2/ 3 / 5 1 / 9 2 / 12 4 10 / 14 6 / 16 11 / 8 13 15
@tracking ir chegada
@efeito flash
@som torcida
Ela cruzou a linha em primeiro, com dois corpos de vantagem.
@tracking off
@fundo hipodromo dia rapido
@ambiente torcida
A arquibancada explodiu. E então, aos poucos, foi ficando em silêncio.
@tracking resultado v_estreia 7 3:2 5:1/2 1:cabeça 9:1 inquerito
No telão, uma palavra começou a piscar. "INQUÉRITO".
@musica tensao
@tracking resultado v_estreia 3 5:1/2 1:cabeça 7 9:1 confirmado rebaixada=7
"Locutor": Atenção. Após análise dos comissários, por interferência na reta final... a número sete, Admire Vega, é rebaixada para a quarta colocação.
@fundo pista tarde chuva lento
@musica triste
Choveu naquela tarde. Encontrei Vega atrás do galpão de treino, ainda com o traje de corrida, encharcada.
@mostrar vega centro corrida abatida
vega: Eu cheguei primeiro.
vega: E não valeu nada.
vega: Eu quase derrubei alguém. Por quê? Pra quê? Por ela? Ela nunca pediria isso. Ela nunca...
A voz se quebrou no meio. Ela apertou os punhos até as juntas ficarem brancas.
? Você colocou outras corredoras em perigo. => v5_bronca | vega-1, flag:v_bronca
? Abrir o guarda-chuva sobre ela e ficar em silêncio. => v5_guarda | vega+2, flag:v_guarda_chuva
? Não foi culpa sua. => v5_mentira

== v5_bronca
vega [raiva]: Eu sei! Você acha que eu não sei?!
vega: Vai embora. Por favor. Só... vai embora.
Eu fui. Mas fiquei a vinte metros, sob a chuva, até ela também ir.
@ir v5_check

== v5_guarda
Abri o guarda-chuva sobre ela. Não disse nada. Fiquei ali.
A chuva batia no náilon como dedos impacientes. Os minutos passaram.
vega: ...Por que você ainda está aqui?
eu: Porque eu sou {o} {seu} {tt}. Inclusive nos dias ruins. Principalmente neles.
vega [abatida]: ...
Ela não chorou na minha frente. Mas encostou a testa no meu ombro por três segundos, talvez quatro. E depois se afastou.
vega: Isso não aconteceu.
eu: Não aconteceu.
@ir v5_check

== v5_mentira
vega: Foi culpa minha.
vega: Não minta pra mim. Todo mundo mente pra mim nesse assunto. Não você também.
Ela foi embora sozinha. Eu fiquei com as palavras que não deveria ter dito.

== v5_check
@se vega<3 => v_final_solitario
@fundo pista noite
@mostrar vega centro abatida
Mais tarde, quando a chuva parou, ela me mandou uma única mensagem.
vega: "Meu aniversário é em março."
vega: "...Esquece."

== v_cap6
# Capítulo 6 | Dois bolos
@musica cotidiano
@fundo escritorio tarde preto
Depois daquele dia, Vega venceu. E venceu de novo. Sempre limpa, sempre com espaço.
Mas nunca sorria na chegada. Cruzava a linha e olhava para o céu, como quem presta contas.
Doze de março. O inverno ainda não tinha ido embora quando a porta da sala se abriu num estrondo.
@mostrar curren centro pulando
curren [exclamacao]: {t}! Emergência kawaii! Quer dizer... emergência não-kawaii!
curren: Hoje é aniversário da Ayabe-san! E ela está fazendo dois bolos de novo!
eu: Dois?
curren [abatida]: Todo ano. Dois bolos iguais. E ela não come nenhum. Só leva os dois pra colina de noite e fica lá, sozinha.
curren: A Curren tentou ir junto uma vez. Ela me pediu, muito educada, pra nunca mais fazer isso.
curren: Mas você... você é diferente. Ela deixa você ficar perto. A Curren percebeu.
curren [coracao]: Por favor. Não deixa ela sozinha hoje.
@esconder curren
@fundo colina noite preto
@musica vega
@particulas snow 0.4
Fazia frio. Do jeito que ela gosta. Encontrei Vega sentada na grama, com duas caixinhas brancas ao lado.
@mostrar vega centro
vega: ...A Curren te contou.
eu: Contou. Trouxe um cobertor. É macio. Testei com seriedade.
vega [reticencias]: ...
Ela aceitou o cobertor. Ficamos em silêncio um tempo. Depois ela abriu as caixas: dois bolinhos de morango, iguais, com uma vela cada.
vega: Hoje também é aniversário da minha irmã.
vega: Nós éramos gêmeas. Ela não sobreviveu ao parto. Eu sobrevivi.
vega [abatida]: Às vezes eu acho que fiquei com a vida que era dela. Que respirei o ar que era pra ela respirar.
vega: Por isso eu corro. Por isso eu preciso vencer. Cada vitória é dela. Não minha.
vega: Eu não tenho o direito de... de ser feliz no lugar dela.
O vento apagou uma das velas antes mesmo de ela acender. Ela não se mexeu.
Lembrei da tira azul no bambu. Do livro fechado antes do fim. Da corrida na chuva.
? Me conta sobre ela. => v6_irma | vega+2, flag:v_irma
? Sua irmã ia querer que você fosse feliz. => v6_errou | vega-1, flag:v_errou
? Acender as duas velas: "Então hoje a gente comemora as duas." => v6_velas | vega+2, flag:v_vela

== v6_irma
vega [exclamacao]: ...Sobre ela?
Ninguém nunca tinha pedido aquilo. Dava para ver no rosto dela.
vega: Eu... acho que ela seria barulhenta. Igual à Curren.
vega: Ia gostar de doces. Ia rir alto. Ia me puxar para festivais lotados, e eu ia reclamar o caminho inteiro.
vega: Ia dormir abraçada no próprio rabo, igual a mim. Ia ser a única pessoa autorizada a comentar isso.
Ela riu. Uma risadinha curta, surpresa, como se tivesse escapado sem permissão.
vega [abatida]: ...Eu nunca falei dela assim. Como alguém. Só como uma dívida.
@ir v6_bolo

== v6_errou
vega [raiva]: Você não sabe o que ela ia querer!
vega: Ninguém sabe! Ela nunca teve a chance de querer nada!
Eu tinha tentado falar pela irmã dela. Falar por quem não pode falar. Era a pior coisa que eu podia ter feito.
eu: ...Você tem razão. Desculpa. Eu não sei.
vega [abatida]: ...
vega: Fica. Só... não fala nada.
Fiquei. Não falei. Vimos as estrelas girarem devagar sobre a cidade.
@ir v6_fim

== v6_velas
Peguei o isqueiro da mão dela e acendi a vela apagada. Depois a outra.
eu: Então hoje a gente comemora as duas. Uma vela para cada.
vega [exclamacao]: ...
Ela olhou para as duas chamas pequenas tremendo no vento. Os olhos brilharam de um jeito que não era só reflexo.
vega: Feliz aniversário...
vega: ...pra nós duas.
@ir v6_bolo

== v6_bolo
@musica vega_luz
@particulas snow 0.2
Ela partiu o próprio bolo. Pela primeira vez na vida, comeu um pedaço.
vega [abatida]: ...É doce.
vega: Eu sempre achei que, se comesse, estaria roubando alguma coisa dela.
eu: E agora?
vega: Agora... eu acho que ela ia ficar brava se eu desperdiçasse um bolo tão bom.
Ela chorou. Em silêncio, com o rosto escondido no cobertor macio. Eu não disse nada. Algumas coisas só precisam de testemunha.

== v6_fim
@fundo colina noite v=constelacao lento
vega: Ano passado eu teria passado essa noite sozinha.
vega: ...{t}.
vega: No Derby... você vai estar lá?
eu: Na primeira fila.
vega: Na cerca. Perto da chegada. Para eu ver você quando passar.

== v_cap7
# Capítulo 7 | Primeira grandeza
@musica tensao
@fundo hipodromo dia preto
@ambiente torcida
Junho. Derby do Japão. A corrida que toda uma geração sonha em vencer, uma única vez na vida.
@mostrar toproad esquerda corrida
@mostrar opera direita corrida
@mostrar vega centro corrida
toproad: Ayabe-san! Hoje eu não vou perder. Nem pra você.
opera [brilho]: Hahaha! Hoje esta Soberana escreverá o terceiro ato de sua lenda! Preparem-se para aplaudir!
vega: ...Boa sorte para vocês duas. De verdade.
toproad [exclamacao]: ...Ayabe-san desejou sorte?!
opera [gota]: Isso é... inédito. Talvez o mundo esteja acabando.
@esconder toproad
@esconder opera
@mover vega centro
vega: {t}.
vega: Diga alguma coisa. Antes de eu ir.
? [flag:v_irma || flag:v_vela] Corre por vocês duas. => v7_duas | vega+1, flag:v_duas
? Eu vou estar olhando só pra você. => v7_olhar | vega+1
? Vence por ela. => v7_ela | flag:v_so_ela

== v7_duas
vega [exclamacao]: ...
vega: Por nós duas.
vega [aceno]: ...Sim. Eu vou.
@ir v7_corrida

== v7_olhar
vega [rubor]: ...Isso é constrangedor.
vega: Mas eu vou procurar você. Na cerca.
@ir v7_corrida

== v7_ela
vega [aceno]: Por ela. Como sempre.
Era a resposta que ela queria ouvir. Não sei se era a que ela precisava.

== v7_corrida
@esconder todos
@musica corrida
@tracking on v_derby
@som portao
@tracking faixa LARGADA!
@tracking ordem 2 / 9 15 / 1 13 >4 / 8 3 / 6 17 12 / 5 10 / 18 7 14 / 16 // 11
@tracking ir 1950
"Locutor": Largada para o Derby do Japão! Dezoito corredoras rumo à glória!
@tracking foco 11
@tracking ordem 2 9 / 15 1 / 13 8 >4 / 3 6 17 / 12 5 / 10 18 / 7 14 16 /// 11
@tracking ir oposta
Vega saiu e se guardou atrás, paciente. Top Road ia firme por fora. Opera O comandava o meio do grupo como uma regente.
@tracking marca 6 ♪
@tracking foco campo
@tracking ordem 6 >4 / 2 9 / 15 1 13 / 8 3 / 17 12 5 / 10 18 / 7 14 16 // 11
@tracking ir ultima
"Locutor": T.M. Opera O assume a ponta na curva final! Narita Top Road vem junto! E Admire Vega... Admire Vega ainda lá atrás!
@tracking foco 11
@tracking ordem 6 4 / 2 9 15 / _ 1 13 / 8 3 17 / 12 5 / 10 18 / 7 14 16 / 11
@tracking ir 560
Na última curva, o grupo se fechou de novo. Igual à estreia. Uma brecha estreita surgiu por dentro.
@tracking marca 11 ?
@se flag:v_tatica => v7_espaco
Ela olhou para a brecha. Depois olhou para fora. E escolheu o caminho largo.
@ir v7_final
== v7_espaco
@tracking marca 11 ★
Ela olhou para a brecha... e sorriu. "Espaço nas curvas." Abriu por fora, onde o caminho era largo e limpo.
== v7_final
@tracking ordem 6 4 / 2 9 15 / 1 13 / 8 3 17 / 12 5 >>11 / 10 18 / 7 14 16
@tracking ir reta
@efeito vinheta 0.3
@tracking cutin vega pensamento
@se flag:v_duas => v7_pensa_duas
*Ela está aqui. Eu sinto. Ela sempre esteve.*
@ir v7_reta
== v7_pensa_duas
@tracking cutin vega pensamento
*Ela está aqui. Eu sinto. Mas desta vez... desta vez eu também estou.*
== v7_reta
@efeito vinheta 0
@tracking cutin off
@tracking faixa RETA FINAL!
@tracking aura 11 dourada
@tracking rastro 11 estrela
@tracking marca 11 !!
@tracking ordem 6 4 >>11 / 2 9 / 15 1 13 / 8 3 17 / 12 5 / 10 18 / 7 14 16
@tracking ir 200
@efeito tremor 10
"Locutor": Admire Vega vem por fora! Vem como uma estrela cadente! Passa Top Road! Encosta em Opera O!
@tracking ordem >>>11 /0.4/ >4 /0.5/ 6 / 2 9 / 15 1 13 / 8 3 17 / 12 5 / 10 18 / 7 14 16
@tracking ir chegada
"Locutor": Admire Vega! Admire Vega! Admire Vega vence o Derby do Japão!
@efeito flash
@som torcida
@musica vitoria
@tracking placar 11 4:pescoço 6:1/2 2:2 9:cabeça
A arquibancada inteira se levantou. O barulho era tão grande que parecia silêncio.
@tracking placar off
@tracking foco 11 perto
@tracking ir apos
Vega desacelerou devagar. Olhou para o céu, como sempre.
@tracking off
@fundo hipodromo dia rapido
@particulas confetti 0.6
@se vega>=9 && flag:v_duas => v_final_verdadeiro
@ir v_final_normal

== v_final_verdadeiro
@mostrar vega centro corrida
E depois... olhou para a cerca. Para mim.
E sorriu.
Não o sorriso educado das fotos. Um sorriso inteiro, torto, com os olhos molhados. O primeiro que eu via.
vega [brilho]: {t}! Você viu?
vega: Eu corri... e foi bom. Foi tão bom. Eu nem lembrava que correr era assim.
vega: Quando eu era pequena, na minha primeira corrida, eu senti que estava voando. E logo depois eu lembrei dela, e fiquei com vergonha de ter sido feliz.
vega [abatida]: Hoje eu lembrei dela também. Mas não fiquei com vergonha.
vega [levanta coracao]: Acho que ela estava torcendo.
@fundo colina noite v=constelacao preto
@musica vega_luz
@mostrar vega centro
Naquela noite, subimos a colina mais uma vez. Ela trouxe uma caixinha. Dentro, três fatias de bolo de morango.
vega: Uma pra mim. Uma pra ela. E uma pra você.
vega: Não é aniversário de ninguém. Eu só... quis.
Lá em cima, Vega brilhava como sempre. Mas ela já não parecia tão sozinha no céu.
vega: Eu vou viver pelas duas, {t}.
vega [coracao]: Mas... também por mim.
@final vega_true | Duas Estrelas | Final Verdadeiro | Vega aprendeu que lembrar de quem se ama não exige carregar sozinha o peso de duas vidas. E que a felicidade, às vezes, também é uma forma de homenagem.

== v_final_normal
@mostrar vega centro corrida
Depois, ela veio até a cerca. Ofegante, coberta de grama, com a medalha balançando no peito.
vega: Eu venci, {t}.
vega: Por ela.
@se flag:v_so_ela => v_normal_ela
vega: ...E um pouco por você, talvez. Não espalhe.
@ir v_normal_fim
== v_normal_ela
Ela disse aquilo com firmeza. Não com alegria. Como quem quita uma parcela de uma dívida muito longa.
== v_normal_fim
@fundo colina noite v=constelacao preto
@musica noite
@mostrar vega centro
Naquela noite, ela me levou à colina. Apontou para Vega, brilhando sozinha acima do horizonte.
vega: Uma estrela de primeira grandeza. Eu consegui.
vega [abatida]: ...Então por que ela ainda parece tão longe?
Eu não tinha resposta. Só fiquei ali, ao lado dela, sob o frio que ela tanto gosta.
vega: Fica comigo, {t}. Até eu aprender a brilhar por mim também.
eu: Fico.
@final vega_normal | Primeira Grandeza | Final | Vega alcançou o céu que perseguia — mas ainda carrega duas vidas nos ombros. Pelo menos agora alguém caminha ao lado dela enquanto aprende a soltar uma delas.

== v_final_solitario
@musica triste
@fundo pista noite preto
@mostrar vega centro abatida
Alguns dias depois, ela me esperou na cerca da pista. Já sabia o que ela ia dizer antes de ela abrir a boca.
vega: Eu disse que, se você atrapalhasse, acabava.
vega: ...Não foi você quem atrapalhou. Fui eu.
vega: É por isso que eu tenho que fazer isso sozinha. Eu não posso arrastar mais ninguém para dentro disso.
vega [vira]: Obrigada pelos treinos. De verdade.
@esconder vega
@fundo pista noite lento
Ela continuou correndo. Venceu muitas corridas, nos meses seguintes. Eu acompanhava pelos jornais.
Às vezes, à noite, passando perto da pista, eu via uma silhueta sozinha dando voltas sob as luzes.
E, lá em cima, uma estrela muito brilhante. Sozinha.
@final vega_alone | A Estrela que Fica Sozinha | Final Solitário | Algumas estrelas brilham tanto que esquecem que fazem parte de uma constelação. Talvez, um dia, alguém consiga lembrá-la disso.
`);
