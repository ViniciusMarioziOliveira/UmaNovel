# Uma Novel — dias na Academia Tracen

Visual novel de fã de **Umamusume: Pretty Derby**, no estilo de Doki Doki Literature Club: caixa de texto, escolhas que mudam o final, salvamentos e trilha sonora. Você é o(a) novo(a) treinador(a) da Academia Tracen e escolhe com quem passar o tempo:

| Uma | Rota | Finais |
|---|---|---|
| **Admire Vega** | *Estrela de Primeira Grandeza*: culpa, estrelas e dois bolos de aniversário | Duas Estrelas · Primeira Grandeza · A Estrela que Fica Sozinha |
| **Loves Only You** | *Love para o Mundo Inteiro*: lives, cartas em forma de coração e arquibancadas vazias | Love para o Mundo Inteiro · Até a Próxima Live · Transmissão Encerrada |
| **Still in Love** | *Entre o Instinto e a Intuição*: cafeterias, renda de bilro e a lua cheia | Ainda Aqui · Pétalas de Renda · Lua Vermelha |
| **Mejiro Dober** | *Eu Quero Mudar*: a treinadora que se aposenta, Veggie Caroline e os rostos na arquibancada | Do Meu Jeito · Um Passo de Cada Vez · Atrás da Cortina |
| **Mejiro Ramonu** | *Um Amor Supremo*: a pintura no parque, a irmã Ardan e a árvore que floresce no inverno | Florescer no Inverno · A Corrida Perfeita · Uma Estranha na Pista |

São 5 rotas, cada uma com 7 capítulos e 3 finais, num total de cerca de 1.450 falas.

- **Dober e o gênero do(a) treinador(a):** como no jogo, a Dober reage de forma diferente com treinador e com treinadora. É mais defensiva e ríspida com um treinador, e mais aberta e carinhosa com uma treinadora.
- **Rotas que se cruzam:** a Ramonu aparece na rota da Dober, na Gala Mejiro. A provocação dela à Still, que aparece na rota da Still, também é mostrada pelo lado da Ramonu, na rota dela.
- **Tela inicial:** cada uma aparece em versão chibi. Ao passar o mouse (ou focar o card com Tab), ela troca para a pose animada; ao ser escolhida, dá um pulinho antes de a rota começar.
- **Corridas no Tracking System:** as 17 corridas da história são mostradas de cima, como nos mangás e animes, com as corredoras como marcadores numerados correndo pela pista de verdade de cada hipódromo (veja [Corridas: o Tracking System](#corridas-o-tracking-system)).

## Como jogar

Abra o `index.html` no navegador (Chrome, Edge ou Firefox). Não precisa instalar nada. Se preferir um servidor local:

```bash
python -m http.server 8000
# depois abra http://localhost:8000
```

É preciso internet: as artes e os dados das personagens vêm da API do umapyoi.net, e as fontes, do Google Fonts.

### Controles

| Ação | Teclado / mouse |
|---|---|
| Avançar | clique, Espaço ou Enter |
| Pular falas já lidas | segurar **Ctrl**, ou **S** para ligar/desligar |
| Modo automático | **A** |
| Esconder a caixa de texto | **H** ou botão direito |
| Histórico | rolar o mouse para cima ou PageUp |
| Escolher opção | teclas **1** a **4** |
| Salvar / carregar rápido | **F5** / **F9** |
| Menu de pausa | **Esc** |

O jogo salva sozinho no início de cada capítulo (espaço "Automático"). Salvamentos, finais encontrados e falas lidas ficam no navegador (`localStorage`). O tratamento (Treinador ou Treinadora) é escolhido no primeiro jogo e pode ser trocado em **Ajustes**.

## Como a API do umapyoi.net é usada

`js/api.js` consulta `https://umapyoi.net/api/v1`:

- `GET /character/{id}`: nome, nome em japonês, cores oficiais, aniversário, altura, retrato, ícone e o **clipe de voz** oficial (botão "voz" na tela inicial);
- `GET /character/images/{id}`: as artes de corpo inteiro. A novel usa o **uniforme da Tracen** (`Uniform`) no dia a dia e o **traje de corrida** (`Racewear`) antes, durante e depois das corridas e no Winning Live.

São 20 personagens no total: as 5 protagonistas e mais 15 do elenco de apoio, como Curren Chan, Mejiro Ryan, Taiki Shuttle, Air Groove, Mejiro Ardan, Symboli Rudolf e Mr. C.B.

As artes vêm do CDN da microCMS, já redimensionadas e em WebP (`?w=1100&fm=webp`). As respostas ficam em cache no navegador por 3 dias, para não sobrecarregar a API (que também é um projeto de fã). Se a API estiver fora do ar, o jogo usa a cópia em `js/data/fallback.js`. As cores oficiais pintam a placa de nome, os cartões de capítulo e a tela de final de cada uma.

## Cenários

Não há imagens de cenário: os 32 lugares são desenhados em SVG por código (`js/scenery/`), num estilo de cartum minimalista, pensado para a personagem ser sempre o destaque.

- **Traço e cor:** cores chapadas, uma única sombra por volume e contorno colorido, um pouco mais escuro que o preenchimento e com a mesma espessura em todo o cenário. Os objetos não têm brilho, reflexo, textura nem degradê; só o céu tem um degradê suave.
- **Composição:** o meio da tela fica calmo, porque é ali que as personagens aparecem, e os detalhes ficam nas laterais. Não há pessoas nem animais, só os lugares.
- **Horários e clima:** cada lugar funciona em 5 horários (`manha`, `dia`, `tarde`, `crepusculo`, `noite`), com chuva (`chuva`) ou neve (`neve`), e a paleta inteira muda junto. À noite, janelas e postes acendem em amarelo chapado; dentro de casa, a luz das lâmpadas deixa tudo mais quente.
- **Personagens:** as artes da API aparecem como são. Fora de casa, no fim da tarde, à noite, na chuva e sob a lua vermelha, recebem só um tom bem leve do ambiente.
- **Detalhes das histórias:** o robai de florzinhas amarelas no jardim, o quadro da Ramonu no cavalete (que muda no outono), a placa ABERTO/FECHADO da cafeteria, o filme da Veggie Caroline no cinema, a estrela Vega sobre a arquibancada da pista, os bastões de luz do Winning Live e o castelo de areia na praia.
- **Escritas e placas:** cada lugar tem letreiros, avisos e painéis próprios, no mesmo traço chapado.
  - **Na escola:** a placa 入学式 da cerimônia de entrada no portão, o relógio da torre que marca a hora da cena e a placa 三女神 da fonte. Há também o poste de direções para a pista e os dormitórios Miho e Ritto, a aula de estratégia no quadro de giz e os cartazes do corredor com o extintor 消火器.
  - **Nas pistas:** o placar e o quadro do treino do dia na pista da Tracen, o telão e as faixas da Twinkle Series, o poste de chegada e os postes de distância no hipódromo, e a faixa "Where the turf meets the surf" em Del Mar.
  - **Fora da escola:** o cardápio com preços e a torta do dia na cafeteria, os nomes das lojas da rua, o letreiro Loves♡Channel e a luz "AO VIVO", as lanternas 祭 do festival e a plaquinha 蝋梅 do robai.
  - **Interiores:** a tabela de letras da enfermaria, o plano da semana na sala de treinadores, o painel de partidas do aeroporto e o cronograma do acampamento de verão.

Lugares disponíveis:

`portao` · `fonte` (pátio das Três Deusas) · `sala` · `corredor` · `pista` · `terraco` · `escritorio` · `estudio` · `cafe` · `colina` (`v=constelacao`) · `rio` (`v=lua`, `v=lua_vermelha`) · `praia` (`v=lua`, `v=lua_vermelha`) · `biblioteca` · `enfermaria` · `toco` · `hipodromo` (`v=vazio`, `v=delmar`) · `corrida` (fundo em movimento) · `palco` (Winning Live; `v=vazio`) · `rua` (`v=tanabata`) · `aeroporto` (`v=dubai`) · `festival` (festival de verão com fogos) · `mansao` (propriedade Mejiro) · `jardim` (jardim de inverno com o robai) · `parque` (`v=outono`) · `cinema` (`v=luzes`) · `salamusica` · `atelie` · `galeria` · `quarto_jp` (quarto de tatame do acampamento) · `ceu` · `preto` · `branco`

Música, ambientes e efeitos sonoros também são sintetizados no navegador (`js/audio.js`). Cada protagonista tem sua trilha.

## Corridas: o Tracking System

As corridas são vistas de cima, como nos mangás e animes de Umamusume (`js/tracking.js`).

- **Marcadores:** cada corredora é uma gota numerada que aponta para onde ela corre. As personagens do elenco usam as cores oficiais da API, e as outras usam retículas em preto e branco (lisa, pontilhada, listrada, xadrez).
- **Nomes:** um feixe branco liga cada personagem ao rótulo com o nome dela e a colocação no momento.
- **Pista:** cada hipódromo tem o próprio desenho: o tamanho da volta, a reta final, o sentido horário ou anti-horário, a pista de terra por dentro ou por fora e o lago do gramado. Na pista estão a cerca, os postes de distância a cada 200 m, o poste e a linha de chegada e os portões de largada. Quando a largada cai numa curva, a corrida começa num prolongamento reto, como nos hipódromos de verdade. A câmera segue o pelotão e gira com a pista nas curvas.
- **Painel:** mostra a placa da corrida (grau, hipódromo, piso, distância, sentido e condição), o trecho da pista ("3ª CURVA", "ÚLTIMA CURVA", "RETA FINAL"), quanto falta, o tempo de prova e um minimapa.
- **Emoção:** a corrida acelera entre uma fala e outra e vira câmera lenta enquanto você lê. Há símbolos sobre as corredoras (! !! ? # … ♪ ♥ ★ ☾ × e gota de suor), auras, rastros (de cor, de relâmpago vermelho, de estrela cadente), choques, faixas grandes como "LARGADA!" e "RETA FINAL!" e o som das passadas.
- **Cut-in:** quando uma corredora fala ou pensa, aparece um recorte do rosto dela, com linhas de foco. A câmera abre espaço para o recorte.
- **Placar:** no fim, o placar do hipódromo mostra colocações, margens (focinho, cabeça, pescoço, corpos) e tempo, com as lâmpadas 確定 CONFIRMADO, 審議 INQUÉRITO e 写真 FOTOGRAFIA e o aviso 降着 REBAIXADA.

As pistas e as corridas ficam em `js/data/races.js`. Em cada corrida, `quem` diz o número do portão de cada personagem.

### Comandos

```
@tracking on v_derby [em=400]          abre a corrida (com em=, já começa no meio, faltando 400 m)
@tracking ordem 6 / 4 8 // * /// 11    formação: fileiras da frente para trás, de dentro (cerca) para fora
@tracking ir ultima [em=2.5] [espera]  avança até um ponto
@tracking foco 11 [perto|medio|longe]  a câmera acompanha uma corredora (foco campo: o pelotão todo)
@tracking marca 11 !! [fixo]           símbolo: ! !! ? # … ♪ ♥ ★ ☾ × gota (e - para tirar)
@tracking aura 11 branca|vermelha|dourada|off
@tracking rastro 11 [cor|vermelho|estrela|off]
@tracking choque 7 6                   trombada entre duas corredoras
@tracking faixa RETA FINAL!            faixa grande atravessando a tela
@tracking cutin vega [pensamento|sombra|aura|off]   recorte para a próxima fala
@tracking continua 14 / para 14        segue correndo depois da chegada / para
@tracking placar 11 4:pescoço 6:1/2 [inquerito|foto] [rebaixada=7] [tempo=2:29.6]
@tracking resultado s_oka 10 3:1.5     só o placar, por cima do cenário (some na troca de cenário)
@tracking off
```

Na formação, `/` abre uma fileira 1,2 corpo atrás, `//` 2,5 corpos, `///` 5 corpos e `/3/` o número de corpos que você quiser. `_` deixa uma raia vazia (a brecha), `>13` põe a corredora uma raia mais para fora, `13+0.5` a põe meio corpo à frente da fileira e `*` coloca todas as que faltam, na ordem em que estavam. Os pontos do `ir` podem ser os metros que faltam (`400`), um avanço (`+600`) ou um nome: `largada`, `curva1`, `curva2`, `oposta`, `curva3`, `curva4`, `ultima`, `reta`, `chegada` e `apos`. O modo `?teste=1` confere se cada formação tem todas as corredoras e se a pista passa pelo ponto pedido.

## Estrutura

```
index.html            página única (tela inicial + jogo)
css/style.css         visual de tudo
img/                  chibis da tela inicial (pose calma e pose animada de cada uma)
js/data/cast.js       elenco e rotas (IDs do umapyoi, títulos, finais)
js/data/races.js      pistas e corridas do Tracking System
js/data/fallback.js   cópia de segurança dos dados da API
js/api.js             cliente da API umapyoi.net
js/audio.js           músicas, ambientes e efeitos (WebAudio)
js/scenery/kit.js     ferramentas de desenho (paletas por hora e clima, contorno, árvores, janelas...)
js/scenery/scenes_ext.js / scenes_int.js   os cenários externos e internos
js/scenery/render.js  monta as camadas e escolhe o tom leve das personagens
js/fx.js              partículas e efeitos de tela
js/tracking.js        Tracking System: as corridas vistas de cima
js/engine.js          motor: roteiro, palco, texto, escolhas, saves
js/ui.js              tela inicial, menus e controles
js/story/*.js         as cinco rotas
js/main.js            inicialização e modos de teste
```

## Escrevendo cenas

As rotas ficam em `js/story/`, numa linguagem simples:

```
== nome_do_trecho
# Capítulo 1 | Título do capítulo
@fundo pista tarde chuva            cenário, hora, clima (chuva/neve), v=variante, transição (preto, branco, lento, rapido, corte)
@musica vega                         titulo, cotidiano, vega, vega_luz, loves, loves_calmo, still, still_sombra, dober, ramonu, corrida, vitoria, triste, noite, tensao, parar
@mostrar vega centro corrida         posição (esq2, esquerda, meioesq, centro, meiodir, direita, dir2), roupa (uniforme, corrida), tamanho (perto, normal, longe)
vega [pulo coracao]: Fala com animação e emote.
eu: Fala do(a) jogador(a).
"Locutor": Fala com um nome livre.
Uma linha sem nome é narração. *itálico*, {red}vermelho{/red}, {shake}tremendo{/shake}
[m] dober: Esta fala só aparece com Treinador.
[f] dober: Esta só aparece com Treinadora.
? Opção => outro_trecho | vega+1, flag:nome
? [vega>=5] Opção que só aparece com afeto => outro_trecho
@se vega>=9 && flag:nome => trecho_do_final
@se fem => trecho_so_para_treinadora
@ir outro_trecho
@final id | Título | Tipo | Texto do final
```

Outros comandos: `@tracking` (as corridas, veja acima), `@esconder vega|todos`, `@mover`, `@roupa`, `@tamanho`, `@anim`, `@emote`, `@som`, `@ambiente`, `@particulas`, `@efeito` (tremor, flash, flashvermelho, vermelho 0.3, rosa, vinheta, glitch, coracao on/off, faixas on/off), `@esperar 1.5`, `@afeto vega +1`, `@marcar`, `@desmarcar`, `@caixa escura|normal`, `@live on 1200 Título` / `@chat usuario: mensagem` / `@live off` e `@papel diario|carta|livro|tanzaku|nota | Título` … `@fimpapel`.

- **Animações:** pulo, salto, tremor, aceno, inclina, susto. Persistentes: abatida, vira, aura, correr, arrepio. Para desfazer: levanta, desvira, semaura, parar, calma.
- **Emotes:** coracao, coracoes, nota, gota, raiva, exclamacao, interrogacao, reticencias, estrela, brilho, zzz, lua, nuvem, rubor.
- **Gênero e nome:** `{t}` vira Treinador/Treinadora, `{tt}` a forma minúscula, `{o}`/`{O}` viram o/a, `{um}` um/uma, `{seu}` seu/sua, `{ele}` ele/ela, `{dele}` dele/dela, `{meu}` meu/minha e `{nome}` o nome escolhido.

Para adicionar outra uma: inclua-a em `VN.CAST` (com o `id` dela no umapyoi.net), crie a rota em `VN.ROUTES`, escreva `js/story/<id>.js`, adicione o `<script>` no `index.html` e o id na lista `MAIN` de `js/ui.js`. Para o card da tela inicial, coloque os dois chibis dela em `img/` e registre as medidas em `VN.CHIBIS` (`js/data/cast.js`): tamanho de cada imagem, centro do corpo, linha do chão e o encaixe da pose animada sobre a calma.

### Modos de teste (pela URL)

- `index.html?teste=1` confere o roteiro inteiro (rótulos, saltos, cenários, músicas).
- `index.html?cenas=1` desenha todos os cenários em todas as horas, climas e variantes, e aponta erros.
- `index.html?simular=dober&estrategia=melhor&genero=f` joga a rota sozinho e mostra o final alcançado. As estratégias são `melhor`, `pior`, `primeira`, `segunda`, `terceira` e `aleatoria`. Também dá para passar a sequência de escolhas: `estrategia=lista&picks=1,2,1,3`.
- `index.html?rota=ramonu&rotulo=r_cap5&afeto=8` começa num ponto da história.
- `index.html?cena=jardim&hora=tarde&clima=neve&chars=ramonu:centro` mostra só um cenário.

## Créditos

- Personagens e artes: **Umamusume: Pretty Derby © Cygames, Inc.**
- Dados e imagens: API pública do [umapyoi.net](https://umapyoi.net).
- As cenas se inspiram em acontecimentos do jogo e da carreira real das éguas, mas as cenas e diálogos foram criados para esta novel e não são canônicos.
- Projeto de fã, sem fins lucrativos.
