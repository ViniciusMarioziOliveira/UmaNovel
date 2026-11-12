/* =========================================================================
   Pistas e corridas do Tracking System (js/tracking.js).

   PISTAS: o desenho de cada hipódromo, simplificado num oval.
     volta  comprimento de uma volta, em metros
     reta   reta final: da saída da última curva até o poste de chegada
     mao    'direita' (sentido horário, como Quioto e Hanshin) ou
            'esquerda' (anti-horário, como Tóquio e os hipódromos americanos)
     sobra  quanto a reta continua depois do poste (define onde ficam as largadas)
     interna / externa   outra pista desenhada por dentro ou por fora
     lago   desenha o lago do gramado central

   CORRIDAS: quem corre e onde. Em "quem", o número do portão de cada
   personagem do elenco; as outras corredoras não têm nome e aparecem com
   retículas em preto e branco, como nos mangás.
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});

  VN.PISTAS = {
    tokyo: { nome: 'Tóquio', hipodromo: 'HIPÓDROMO DE TÓQUIO', volta: 2083, reta: 526, mao: 'esquerda', interna: 'terra', lago: true },
    kyoto: { nome: 'Quioto', hipodromo: 'HIPÓDROMO DE QUIOTO', volta: 1894, reta: 404, mao: 'direita', interna: 'terra', lago: true },
    hanshin: { nome: 'Hanshin', hipodromo: 'HIPÓDROMO DE HANSHIN', volta: 2089, reta: 474, sobra: 200, mao: 'direita', interna: 'terra' },
    tracen: { nome: 'Pista da Tracen', hipodromo: 'ACADEMIA TRACEN', volta: 1800, reta: 400, mao: 'direita', interna: 'terra' },
    mejiro: { nome: 'Pista particular Mejiro', hipodromo: 'PROPRIEDADE MEJIRO', volta: 1600, reta: 360, mao: 'direita' },
    delmar: { nome: 'Del Mar', hipodromo: 'DEL MAR', volta: 1408, reta: 300, mao: 'esquerda', externa: 'terra' },
    delmar_terra: { nome: 'Del Mar', hipodromo: 'DEL MAR', volta: 1609, reta: 290, mao: 'esquerda', interna: 'grama' },
  };

  VN.CORRIDAS = {
    // Admire Vega
    v_estreia: { titulo: 'Corrida de estreia', grau: 'ESTREIA', pista: 'kyoto', piso: 'grama', dist: 1600, cond: 'boa', n: 16, tempo: '1:36.1', quem: { 7: 'vega' } },
    v_derby: { titulo: 'Tokyo Yushun — Derby do Japão', grau: 'G1', pista: 'tokyo', piso: 'grama', dist: 2400, cond: 'boa', n: 18, tempo: '2:29.6', quem: { 4: 'toproad', 6: 'opera', 11: 'vega' } },

    // Still in Love
    s_simulada: { titulo: 'Corrida simulada', grau: 'TREINO', pista: 'tracen', piso: 'grama', dist: 1600, cond: 'boa', n: 8, quem: { 6: 'still' } },
    s_oaks: { titulo: 'Yushun Himba — Oaks', grau: 'G1', pista: 'tokyo', piso: 'grama', dist: 2400, cond: 'boa', n: 18, tempo: '2:27.5', quem: { 14: 'still' } },
    s_rose: { titulo: 'Rose Stakes', grau: 'G2', pista: 'hanshin', piso: 'grama', dist: 2000, cond: 'boa', n: 16, tempo: '1:59.9', quem: { 3: 'still', 10: 'groove' } },
    s_shuka: { titulo: 'Shuka Sho', grau: 'G1', pista: 'kyoto', piso: 'grama', dist: 2000, cond: 'boa', n: 18, tempo: '2:02.2', quem: { 7: 'groove', 14: 'still' } },
    s_oka: { titulo: 'Oka Sho', grau: 'G1', pista: 'hanshin', piso: 'grama', dist: 1600, cond: 'boa', n: 18, tempo: '1:34.9', quem: { 10: 'still' } },

    // Loves Only You
    l_oaks: { titulo: 'Yushun Himba — Oaks', grau: 'G1', pista: 'tokyo', piso: 'grama', dist: 2400, cond: 'boa', n: 18, tempo: '2:22.8', recorde: true, quem: { 12: 'loves' } },
    l_vazio: { titulo: 'Corrida de retorno', grau: 'G2', pista: 'hanshin', piso: 'grama', dist: 2200, cond: 'boa', n: 12, tempo: '2:12.4', publico: false, quem: { 5: 'loves' } },
    l_bc: { titulo: "Breeders' Cup Filly & Mare Turf", grau: 'G1', pista: 'delmar', piso: 'grama', dist: 1900, cond: 'firme', n: 14, tempo: '1:54.1', quem: { 6: 'loves' } },
    l_distaff: { titulo: "Breeders' Cup Distaff", grau: 'G1', pista: 'delmar_terra', piso: 'terra', dist: 1800, cond: 'rápida', n: 11, tempo: '1:47.8', quem: { 5: 'marche' } },

    // Mejiro Dober
    d_avaliacao: { titulo: 'Corrida de avaliação', grau: 'AVALIAÇÃO', pista: 'hanshin', piso: 'grama', dist: 1800, cond: 'boa', n: 10, tempo: '1:48.7', quem: { 4: 'dober' } },
    d_amistosa: { titulo: 'Prova amistosa da família Mejiro', grau: 'AMISTOSA', pista: 'mejiro', piso: 'grama', dist: 2000, cond: 'boa', n: 2, quem: { 1: 'dober', 2: 'ramonu' } },
    d_oaks: { titulo: 'Yushun Himba — Oaks', grau: 'G1', pista: 'tokyo', piso: 'grama', dist: 2400, cond: 'boa', n: 18, tempo: '2:26.3', quem: { 9: 'dober' } },

    // Mejiro Ramonu
    r_simulada: { titulo: 'Corrida simulada', grau: 'TREINO', pista: 'tracen', piso: 'grama', dist: 2000, cond: 'boa', n: 8, quem: { 5: 'ramonu' } },
    r_oka: { titulo: 'Oka Sho', grau: 'G1', pista: 'hanshin', piso: 'grama', dist: 1600, cond: 'boa', n: 18, tempo: '1:35.0', quem: { 8: 'ramonu' } },
    r_oaks: { titulo: 'Yushun Himba — Oaks', grau: 'G1', pista: 'tokyo', piso: 'grama', dist: 2400, cond: 'boa', n: 18, tempo: '2:26.0', quem: { 5: 'ramonu' } },
    r_shuka: { titulo: 'Shuka Sho', grau: 'G1', pista: 'kyoto', piso: 'grama', dist: 2000, cond: 'boa', n: 18, tempo: '2:00.9', quem: { 12: 'ramonu' } },
    r_jc: { titulo: 'Japan Cup', grau: 'G1', pista: 'tokyo', piso: 'grama', dist: 2400, cond: 'boa', n: 18, tempo: '2:23.4', quem: { 1: 'rudolf', 9: 'ramonu', 15: 'mrcb' } },
  };
})();
