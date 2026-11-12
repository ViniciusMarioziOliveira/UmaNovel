/* Elenco e rotas. Os dados oficiais (nomes, cores, aniversários, artes)
   vêm da API do umapyoi.net — aqui ficam só os textos da novel. */
(function () {
  const VN = (window.VN = window.VN || {});

  VN.CAST = {
    vega: { api: 5191, name: 'Admire Vega', short: 'Vega' },
    loves: { api: 10388, name: 'Loves Only You', short: 'Loves' },
    still: { api: 10313, name: 'Still in Love', short: 'Still' },
    dober: { api: 5474, name: 'Mejiro Dober', short: 'Dober' },
    ramonu: { api: 8332, name: 'Mejiro Ramonu', short: 'Ramonu' },
    curren: { api: 5247, name: 'Curren Chan', short: 'Curren' },
    toproad: { api: 7426, name: 'Narita Top Road', short: 'Top Road' },
    opera: { api: 4986, name: 'T.M. Opera O', short: 'Opera O' },
    chrono: { api: 10387, name: 'Chrono Genesis', short: 'Chrono' },
    marche: { api: 10403, name: 'Marche Lorraine', short: 'Marche' },
    neo: { api: 8730, name: 'Neo Universe', short: 'Neo' },
    groove: { api: 10395, name: 'Admire Groove', short: 'Groove' },
    tazuna: { api: 5613, name: 'Tazuna Hayakawa', short: 'Tazuna' },
    ryan: { api: 5122, name: 'Mejiro Ryan', short: 'Ryan' },
    taiki: { api: 4927, name: 'Taiki Shuttle', short: 'Taiki' },
    airgroove: { api: 5021, name: 'Air Groove', short: 'Air Groove' },
    ardan: { api: 5528, name: 'Mejiro Ardan', short: 'Ardan' },
    kris: { api: 7730, name: 'Symboli Kris S', short: 'Kris S' },
    rudolf: { api: 5009, name: 'Symboli Rudolf', short: 'Rudolf' },
    mrcb: { api: 5623, name: 'Mr. C.B.', short: 'C.B.' },
  };

  /* Chibis da tela inicial (pasta img/): "a" é a pose calma e "b" a animada,
     que aparece ao passar o mouse e no pulinho da escolha.
     Medidas em pixels dos arquivos: wa×ha e wb×hb são os tamanhos, x é o centro
     do corpo na imagem "a" e y a linha do chão (onde ficam os pés). dx/dy dizem
     onde a imagem "b" se encaixa sobre a "a", para o rosto não sair do lugar
     na troca de pose. */
  VN.CHIBIS = {
    vega: { a: 'img/Vega.webp', b: 'img/Vega2.webp', wa: 256, ha: 256, wb: 160, hb: 256, x: 116.5, y: 256, dx: 72, dy: -5 },
    loves: { a: 'img/LovesOnlyYou.webp', b: 'img/LovesOnlyYou2.webp', wa: 256, ha: 256, wb: 256, hb: 256, x: 116.6, y: 256, dx: 5, dy: -6 },
    still: { a: 'img/StillInLove.webp', b: 'img/StillInLove2.webp', wa: 256, ha: 256, wb: 256, hb: 256, x: 117.8, y: 256, dx: 11, dy: -10 },
    dober: { a: 'img/Dober.webp', b: 'img/Dober2.webp', wa: 256, ha: 256, wb: 165, hb: 249, x: 119.3, y: 256, dx: 59, dy: 9 },
    ramonu: { a: 'img/Ramonu.webp', b: 'img/Ramonu2.webp', wa: 147, ha: 247, wb: 151, hb: 250, x: 70.5, y: 247, dx: -3, dy: -15 },
  };

  VN.ROUTES = {
    vega: {
      title: 'Estrela de Primeira Grandeza',
      essence: 'Uma garota que acredita precisar carregar sozinha o peso de duas vidas.',
      motif: 'estrela',
      start: 'vega_inicio',
      cast: ['vega', 'tazuna', 'curren', 'toproad', 'opera'],
      racers: ['vega', 'toproad', 'opera'],
      endings: [
        { id: 'vega_true', title: 'Duas Estrelas', kind: 'Final Verdadeiro' },
        { id: 'vega_normal', title: 'Primeira Grandeza', kind: 'Final' },
        { id: 'vega_alone', title: 'A Estrela que Fica Sozinha', kind: 'Final Solitário' },
      ],
    },
    loves: {
      title: 'Love para o Mundo Inteiro',
      essence: 'Uma garota que deseja compartilhar seu amor com o mundo — e receber esse carinho de volta.',
      motif: 'coracao',
      start: 'loves_inicio',
      cast: ['loves', 'tazuna', 'chrono', 'marche'],
      racers: ['loves', 'marche'],
      endings: [
        { id: 'loves_true', title: 'Love para o Mundo Inteiro', kind: 'Final Verdadeiro' },
        { id: 'loves_normal', title: 'Até a Próxima Live', kind: 'Final' },
        { id: 'loves_off', title: 'Transmissão Encerrada', kind: 'Final Silencioso' },
      ],
    },
    still: {
      title: 'Entre o Instinto e a Intuição',
      essence: 'Uma garota dividida entre a própria delicadeza e desejos intensos que teme não conseguir controlar.',
      motif: 'lua',
      start: 'still_inicio',
      cast: ['still', 'tazuna', 'neo', 'groove', 'ramonu'],
      racers: ['still', 'groove'],
      endings: [
        { id: 'still_true', title: 'Ainda Aqui', kind: 'Final Verdadeiro' },
        { id: 'still_normal', title: 'Pétalas de Renda', kind: 'Final' },
        { id: 'still_dark', title: 'Lua Vermelha', kind: 'Final Sombrio' },
      ],
    },
    dober: {
      title: 'Eu Quero Mudar',
      essence: 'Uma garota que deseja ser forte e independente, mas precisa aprender que confiar e demonstrar carinho não são fraqueza.',
      motif: 'lapis',
      start: 'dober_inicio',
      cast: ['dober', 'taiki', 'ryan', 'airgroove', 'ramonu'],
      racers: ['dober', 'ramonu'],
      endings: [
        { id: 'dober_true', title: 'Do Meu Jeito', kind: 'Final Verdadeiro' },
        { id: 'dober_normal', title: 'Um Passo de Cada Vez', kind: 'Final' },
        { id: 'dober_alone', title: 'Atrás da Cortina', kind: 'Final Solitário' },
      ],
    },
    ramonu: {
      title: 'Um Amor Supremo',
      essence: 'Uma garota que encontrou nas corridas seu amor mais profundo — e está disposta a dedicar a ele toda a sua existência.',
      motif: 'flor',
      start: 'ramonu_inicio',
      cast: ['ramonu', 'tazuna', 'ardan', 'kris', 'rudolf', 'mrcb'],
      racers: ['ramonu', 'rudolf', 'mrcb'],
      endings: [
        { id: 'ramonu_true', title: 'Florescer no Inverno', kind: 'Final Verdadeiro' },
        { id: 'ramonu_normal', title: 'A Corrida Perfeita', kind: 'Final' },
        { id: 'ramonu_stranger', title: 'Uma Estranha na Pista', kind: 'Final Solitário' },
      ],
    },
  };
})();
