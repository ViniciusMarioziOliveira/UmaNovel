/* =========================================================================
   Cenários internos (v3, cartum minimalista). Parede de fundo vista de frente,
   chão de tábuas, janelas com a vista de fora (na paleta de fora) e móveis
   encostados nas laterais. À noite as lâmpadas acendem (amarelo chapado).
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const K = VN.Kit, S = K.S, P = K.P, f = K.f;
  const W = 1920, H = 1080;
  const L = (svg, depth, cls) => ({ svg, depth: depth || 0, cls: cls || '' });
  const SC = (VN.SceneDefs = VN.SceneDefs || {});
  const sv = (b, o) => S.svg(b, o);
  const c = (x) => K.c(x), sh = (x, k) => K.sh(x, k), ln = (x, k) => K.ln(x, k);
  const ambIn = (dflt) => (K.GO.rain ? 'chuva_dentro' : dflt);
  const lightsOn = () => K.GO.night || K.GO.rain;

  /* ------------------------------------------------------------ comuns */
  /** chuva escorrendo no vidro (traços chapados), recortada pela janela */
  function rainGlass(x, y, w, h, seed) {
    if (!K.GO.rain) return '';
    const r = K.rand(seed || 7);
    let d = '';
    for (let i = 0; i < Math.round((w * h) / 4200); i++) { const px = x + r() * w, py = y + r() * h; d += `M${f(px)},${f(py)} l-4,${f(16 + r() * 16)}`; }
    return `<g clip-path="${K.clip(P.r(x, y, w, h))}">${K.line(d, '#ffffff', 2, 'opacity=".5"')}</g>`;
  }
  /** janela com vista + chuva no vidro */
  function windowRain(x, y, w, h, o) {
    const m = (o && o.m) || 16;
    return K.windowOut(x, y, w, h, o) + rainGlass(x + m, y + m, w - 2 * m, h - 2 * m, (o && o.seed) || 3);
  }
  /** luminária de teto comprida (chapada; acesa à noite) */
  function ceilingLight(x, y, w) {
    const on = lightsOn();
    return K.box(x - w / 2, y, w, 18, '#ffffff', { w: K.LM, r: 8, f: on ? K.LIT : c('#ffffff'), l: on ? K.LIT_LINE : ln('#ffffff', 0.4) });
  }
  /** sofá visto de frente; (x0..x1) e chão em y */
  function sofa(x0, x1, y, col) {
    const w = x1 - x0;
    let b = K.contact((x0 + x1) / 2, y + 2, w * 0.52, 10);
    b += K.box(x0 + 30, y - 22, 16, 22, '#7a5b48', { w: K.LM, r: 3 }) + K.box(x1 - 46, y - 22, 16, 22, '#7a5b48', { w: K.LM, r: 3 });
    b += K.box(x0 + 40, y - 210, w - 80, 120, col, { w: K.LW, r: 26 });
    b += K.box(x0 + 30, y - 110, w - 60, 90, col, { w: K.LW, r: 18 });
    b += K.seg((x0 + x1) / 2, y - 104, (x0 + x1) / 2, y - 30, ln(col, 0.35), 3);
    b += K.box(x0, y - 150, 70, 130, col, { w: K.LW, r: 30 }) + K.box(x1 - 70, y - 150, 70, 130, col, { w: K.LW, r: 30 });
    return b;
  }
  /** almofada quadradinha */
  function cushion(x, y, s, col) {
    return K.shape(`M${f(x - 40 * s)},${f(y - 34 * s)} Q${f(x)},${f(y - 44 * s)} ${f(x + 40 * s)},${f(y - 34 * s)} Q${f(x + 48 * s)},${f(y)} ${f(x + 40 * s)},${f(y + 34 * s)} Q${f(x)},${f(y + 44 * s)} ${f(x - 40 * s)},${f(y + 34 * s)} Q${f(x - 48 * s)},${f(y)} ${f(x - 40 * s)},${f(y - 34 * s)} Z`, col, { w: K.LM });
  }
  /** prateleira de parede */
  function wallShelf(x, y, w, wood) {
    return K.box(x, y, w, 16, wood || '#c9996c', { w: K.LM, r: 3 }) + K.shape(`M${f(x + 24)},${f(y + 16)} l0,26 l26,-26 Z`, wood || '#c9996c', { w: 2 }) + K.shape(`M${f(x + w - 24)},${f(y + 16)} l0,26 l-26,-26 Z`, wood || '#c9996c', { w: 2 });
  }
  /** lata (de chá, de lápis...) em cima de uma prateleira; (x, y) = base */
  function can(x, y, w, h, col) {
    let b = K.box(x - w / 2, y - h, w, h, col, { w: K.LM, r: 6 });
    b += K.box(x - w / 2 - 3, y - h - 8, w + 6, 12, K.mix(col, '#ffffff', 0.35), { w: 2, r: 4 });
    b += K.disc(x, y - h * 0.5, Math.min(w, h) * 0.22, '#fffaf0', { w: 2 });
    return b;
  }
  /** calendário de parede com um dia marcado */
  function calendar(x, y, w, h) {
    let b = K.box(x, y, w, h, '#ffffff', { w: K.LM, r: 4 });
    b += S.rect(x, y, w, h * 0.22, c('#ef8f8b'), `rx="4"`) + K.seg(x, y + h * 0.22, x + w, y + h * 0.22, ln('#ffffff', 0.4), 2);
    for (let j = 0; j < 4; j++) for (let i = 0; i < 5; i++) b += S.rect(x + 12 + i * ((w - 24) / 5), y + h * 0.3 + j * ((h * 0.64) / 4), (w - 24) / 5 - 6, (h * 0.64) / 4 - 8, c('#eef0f4'), 'rx="2"');
    b += `<circle cx="${f(x + 12 + 3 * ((w - 24) / 5) + ((w - 24) / 5 - 6) / 2)}" cy="${f(y + h * 0.3 + 2 * ((h * 0.64) / 4) + ((h * 0.64) / 4 - 8) / 2)}" r="${f(Math.min(w, h) * 0.08)}" fill="none"${K.ST(c('#e2574c'), 3)}/>`;
    return b;
  }
  /** cadeira simples vista de frente; (x, y) = meio, no chão */
  function chair(x, y, col, s) {
    const k = s || 1;
    let b = K.contact(x, y + 2, 50 * k, 7);
    b += K.box(x - 44 * k, y - 210 * k, 88 * k, 110 * k, col, { w: K.LM, r: 14 * k });
    b += K.box(x - 50 * k, y - 104 * k, 100 * k, 22 * k, col, { w: K.LM, r: 8 * k });
    b += K.box(x - 42 * k, y - 82 * k, 12 * k, 82 * k, col, { w: K.LM, r: 3 }) + K.box(x + 30 * k, y - 82 * k, 12 * k, 82 * k, col, { w: K.LM, r: 3 });
    return b;
  }

  /* ----------------------------------------------- sala de aula (extra) */
  SC.sala = function () {
    K.inside();
    const FY = 790;
    let b = K.room({ wall: '#f6efe2', floor: '#dcb58b', floorY: FY, wain: 190, wainCol: '#e3cdb0', panels: 240 });
    const bx = 200, by = 190, bw = 820, bh = 360, wood = '#b98d66';
    b += K.box(bx - 18, by - 18, bw + 36, bh + 36, wood, { r: 8 });
    b += K.box(bx, by, bw, bh, '#4f7a64', { w: K.LM, r: 4 });
    // giz: a data, umas linhas de matéria e uma estrelinha
    b += S.text(330, 290, '4 / 12', '#f3f6f1', 50, 'opacity=".85"');
    // a aula de hoje: estratégia de corrida, com o desenho da pista
    b += K.txt(250, 372, 'Distribuição de energia', { size: 38, fill: '#f3f6f1', font: 'hand', anchor: 'start', op: 0.9 });
    b += K.txt(262, 432, '1ª curva → guardar', { size: 30, fill: '#f3f6f1', font: 'hand', anchor: 'start', op: 0.8 });
    b += K.txt(262, 486, 'reta final → tudo!', { size: 30, fill: '#f6c9d4', font: 'hand', anchor: 'start', op: 0.9 });
    b += `<rect x="650" y="408" width="300" height="104" rx="52" fill="none" stroke="#f3f6f1" stroke-width="5" opacity=".75"/>` + K.line('M690,420 q40,-14 90,-8 l-14,-10 M780,412 l-12,12', '#f6e7a1', 4, 'opacity=".85"');
    b += K.line(K.starD(870, 330, 46), '#f6e7a1', 4, 'opacity=".85"');
    b += K.box(bx - 10, by + bh + 16, bw + 20, 16, wood, { w: K.LM, r: 4 });
    b += K.box(bx + 90, by + bh + 6, 36, 10, '#ffffff', { w: 2, r: 4 }) + K.box(bx + 140, by + bh + 6, 30, 10, '#f6c2cd', { w: 2, r: 4 });
    b += K.wallClock(610, 100, 42);
    b += windowRain(1150, 160, 330, 440, { cols: 2, rows: 2, seed: 3 }) + windowRain(1520, 160, 330, 440, { cols: 2, rows: 2, seed: 4 });
    b += K.curtain(1112, 130, 64, 480, 'e', '#cfe3f0') + K.curtain(1888, 130, 64, 480, 'd', '#cfe3f0');
    return { layers: [L(sv(b), 0)], particles: 'none', amb: ambIn('sala'), interior: true };
  };

  /* ------------------------------------------------------------ corredor */
  SC.corredor = function () {
    K.inside();
    const FY = 800;
    let b = K.room({ wall: '#f4efe7', floor: '#d9c4a6', floorY: FY, wain: 130, wainCol: '#dccbb8', ceil: 70 });
    for (const x of [350, 960, 1570]) b += ceilingLight(x, 40, 220);
    for (const [x, seed] of [[130, 1], [750, 2], [1370, 3]]) b += windowRain(x, 150, 420, 470, { cols: 2, rows: 2, seed });
    // quadrinho de avisos entre as janelas
    const boards = [
      [650, [{ band: '#e0675f', title: 'SIMULADA', text: ['sáb · 15h', 'pista 1'] }, { band: '#6fb38f', title: 'CULINÁRIA', icon: 'cenoura' }], { band: '#7f9fd6', title: 'SELEÇÃO DE EQUIPES', text: ['inscrições abertas!'] }],
      [1270, [{ band: '#f2b45c', title: 'FESTIVAL', icon: 'flor', text: ['de verão'] }, { band: '#9a86c9', title: 'SILÊNCIO', icon: 'nota' }], { band: '#e05f7a', title: 'TWINKLE SERIES', icon: 'ferradura' }],
    ];
    for (const [x, tops, bottom] of boards) {
      b += K.box(x - 88, 236, 176, 210, '#d6ad80', { w: K.LM, r: 4 });
      b += K.poster(x - 78, 250, 74, 96, Object.assign({ rot: -2, base: '#ffffff' }, tops[0]));
      b += K.poster(x + 4, 254, 74, 96, Object.assign({ rot: 2, base: '#fff7dc', pin: '#4f8fd0' }, tops[1]));
      b += K.poster(x - 74, 356, 148, 80, Object.assign({ rot: -1, base: '#eef6fd', pin: '#5cb87a', ts: 13 }, bottom));
    }
    // extintor (消火器) no vão entre as janelas
    b += K.sign(650, 520, 86, 34, [{ t: '消火器', font: 'jp', size: 16 }], { base: '#e0453f', ink: '#ffffff', r: 4 });
    b += K.contact(650, FY + 2, 34, 5) + K.box(630, 640, 40, FY - 640, '#e0453f', { w: K.LM, r: 12 }) + K.box(638, 620, 24, 24, '#5f6478', { w: K.LM, r: 4 }) + K.tube('M662,628 q24,0 22,40', '#3c4152', 5, { w: 2 });
    return { layers: [L(sv(b), 0)], particles: 'none', amb: ambIn('corredor'), interior: true };
  };

  /* ------------------------------------------------ sala de treinadores */
  SC.escritorio = function () {
    K.inside();
    const FY = 790;
    let b = K.room({ wall: '#f1e5d6', floor: '#c99a70', floorY: FY, wain: 170, wainCol: '#d9c2a4', panels: 230 });
    // estante de pastas e papelada
    b += K.bookcase(60, 140, 390, 650, { shelves: 5, seed: 21, colors: ['#7fa6d6', '#e88f8f', '#f3cf7c', '#8fc79a', '#b9a3dd', '#f2ede2'] });
    // prateleira com as latas de chá
    b += wallShelf(500, 360, 250, '#c9996c');
    [['#e9a3a8', 70], ['#a5cfa8', 58], ['#f2d27c', 66], ['#a9bfe6', 54]].forEach(([col, h], i) => { b += can(536 + i * 58, 360, 44, h, col) + K.txt(536 + i * 58, 360 - h * 0.5 + 6, '茶', { size: 13, font: 'jp', fill: ln('#fffaf0', 0.7) }); });
    // janela com cortinas
    b += K.wallClock(1030, 90, 40);
    b += windowRain(800, 150, 460, 420, { cols: 2, rows: 2, seed: 5 });
    b += K.curtain(762, 130, 72, 470, 'e', '#a9c7e3') + K.curtain(1298, 130, 72, 470, 'd', '#a9c7e3');
    // calendário, sofá e vasinho
    b += calendar(1500, 190, 180, 200);
    // pôster da Twinkle Series e o plano de treinos da semana
    b += K.poster(1350, 196, 126, 176, { band: '#2f5fa8', title: 'TWINKLE', icon: 'trofeu', text: ['SERIES', 'temporada'], ts: 17, size: 13, rot: -1.5 });
    b += K.box(1706, 176, 176, 330, '#ffffff', { w: K.LM, r: 6 }) + K.box(1700, 498, 188, 10, '#c9d1dc', { w: 2, r: 3 });
    b += K.txt(1794, 210, 'SEMANA', { size: 18, fill: c('#e0675f'), ls: 2 });
    [['seg', 'velocidade'], ['ter', 'resistência'], ['qua', 'descanso'], ['qui', 'curvas'], ['sex', 'simulada'], ['sáb', 'livre ♪']].forEach(([d, t], i) => {
      b += K.txt(1718, 252 + i * 40, d, { size: 20, fill: c('#e0675f'), font: 'hand', anchor: 'start' }) + K.txt(1756, 252 + i * 40, t, { size: 21, fill: c('#3e5b9a'), font: 'hand', anchor: 'start' });
    });
    b += sofa(1330, 1890, FY, '#93bba9');
    b += cushion(1440, 650, 0.9, '#f6d48b') + cushion(1780, 650, 0.9, '#f2b6b5');
    b += K.potPlant(690, FY, 1.1, { seed: 6 });
    // abajur de pé ao lado do sofá (acende à noite e na chuva)
    const on = lightsOn();
    b += K.contact(1268, FY + 2, 40, 6) + K.oval(1268, FY - 6, 34, 8, '#6b5b6e', { w: K.LM });
    b += K.box(1263, 470, 10, FY - 476, '#6b5b6e', { w: K.LM, r: 3 });
    b += K.shape('M1222,474 L1314,474 L1296,404 L1240,404 Z', '#f6e3c4', { w: K.LM, f: on ? K.LIT : c('#f6e3c4'), l: on ? K.LIT_LINE : ln('#f6e3c4') });
    return { layers: [L(sv(b), 0)], particles: 'none', amb: ambIn('sala'), interior: true };
  };

  /* --------------------------------------------- sala de mídia (estúdio) */
  function doodle(kind, x, y, s, col) {
    if (kind === 'coracao') return K.shape(`M${f(x)},${f(y + 14 * s)} C${f(x - 26 * s)},${f(y - 4 * s)} ${f(x - 16 * s)},${f(y - 24 * s)} ${f(x)},${f(y - 10 * s)} C${f(x + 16 * s)},${f(y - 24 * s)} ${f(x + 26 * s)},${f(y - 4 * s)} ${f(x)},${f(y + 14 * s)} Z`, col, { w: 2 });
    if (kind === 'estrela') return K.shape(K.starD(x, y, 18 * s), col, { w: 2 });
    if (kind === 'nota') return K.disc(x - 8 * s, y + 10 * s, 7 * s, col, { w: 2 }) + K.seg(x - 1 * s, y + 10 * s, x - 1 * s, y - 16 * s, ln(col, 0.5), 3) + K.line(`M${f(x - 1 * s)},${f(y - 16 * s)} q${f(10 * s)},${f(4 * s)} ${f(12 * s)},${f(12 * s)}`, ln(col, 0.5), 3);
    if (kind === 'arco') return K.line(`M${f(x - 22 * s)},${f(y + 10 * s)} a${f(22 * s)},${f(22 * s)} 0 0 1 ${f(44 * s)},0`, c('#ef8f8b'), 4) + K.line(`M${f(x - 15 * s)},${f(y + 10 * s)} a${f(15 * s)},${f(15 * s)} 0 0 1 ${f(30 * s)},0`, c('#f6d48b'), 4) + K.line(`M${f(x - 8 * s)},${f(y + 10 * s)} a${f(8 * s)},${f(8 * s)} 0 0 1 ${f(16 * s)},0`, c('#8fc0e8'), 4);
    if (kind === 'flor') { let b = ''; for (let k = 0; k < 5; k++) { const a = (k / 5) * K.TAU; b += S.circle(x + Math.cos(a) * 9 * s, y + Math.sin(a) * 9 * s, 7 * s, c(col)); } return b + S.circle(x, y, 5 * s, c('#ffe082')); }
    return S.text(x, y + 8 * s, 'LOVE', ln(col, 0.2), Math.round(22 * s));
  }
  SC.estudio = function () {
    K.inside();
    const FY = 800;
    let b = K.room({ wall: '#fde3ea', floor: '#e6c9a8', floorY: FY, base: '#e8b9c4' });
    // varal de luzinhas (bolinhas chapadas)
    const str = K.stringLine(-20, 60, W + 20, 60, 50);
    b += K.line(str.d, ln('#fde3ea', 0.45), 2);
    const bulbs = ['#ffd6e2', '#fff1b8', '#cfe8ff', '#d9f2d0'];
    for (let i = 1; i < 26; i++) { const [lx, ly] = str.at(i / 26); b += K.disc(lx, ly + 10, 8, bulbs[i % 4], { w: 2 }); }
    // mural de desenhos
    const r = K.rand(17);
    const kinds = ['coracao', 'estrela', 'nota', 'arco', 'flor', 'love', 'coracao', 'estrela', 'flor', 'arco', 'nota', 'love'];
    const papers = ['#ffffff', '#fff4c9', '#e4f1ff', '#ffe4ec', '#e9f7e4'];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
      const k = j * 4 + i;
      const px = 110 + i * 150 + (r() - 0.5) * 16, py = 150 + j * 140 + (r() - 0.5) * 14, rot = (r() - 0.5) * 10;
      const col = ['#f28ba8', '#f6c35b', '#7fb8e8', '#9fd49a', '#c9a0e8'][k % 5];
      b += `<g transform="rotate(${f(rot)} ${f(px + 60)} ${f(py + 52)})">${K.box(px, py, 120, 104, papers[k % 5], { w: 2, r: 3 })}${doodle(kinds[k], px + 60, py + 54, 1.2, col)}${S.rect(px + 42, py - 8, 36, 16, c('#f7b6c8'), 'opacity=".75"')}</g>`;
    }
    // janelinha, com a luz de "ao vivo" em cima
    b += windowRain(790, 190, 280, 330, { cols: 2, seed: 7 });
    const onAir = K.GO.night;
    b += K.sign(930, 118, 150, 46, [{ t: '● AO VIVO', size: 20, ls: 1 }], { base: onAir ? '#e5455a' : '#8a7f8f', ink: '#ffffff', r: 8 });
    // letreiro do canal (cor chapada, sem brilho)
    b += K.sign(1580, 238, 420, 70, [{ t: 'Loves♡Channel', size: 40 }], { base: '#f27aa0', ink: '#ffffff', r: 35, inner: '#ffd1df', hang: 40, hangCol: '#c9a3b2' });
    // ring light (um aro branco, sem brilho) no tripé
    b += K.seg(1110, 400, 1110, FY - 4, ln('#5f6478'), 4) + K.line(`M1070,${FY} L1110,${FY - 60} L1150,${FY}`, ln('#5f6478'), 4);
    b += `<circle cx="1110" cy="330" r="70" fill="none" stroke="${ln('#ffffff', 0.4)}" stroke-width="26"/><circle cx="1110" cy="330" r="70" fill="none" stroke="${c('#ffffff')}" stroke-width="18"/>`;
    // mesa com dois monitores e o microfone
    const desk = '#f7f2ea';
    b += K.contact(1520, FY + 2, 360, 12);
    b += K.box(1190, 640, 720, 26, desk, { w: K.LM, r: 6 });
    b += K.box(1220, 666, 18, FY - 666, desk, { w: K.LM }) + K.box(1860, 666, 18, FY - 666, desk, { w: K.LM });
    b += K.box(1700, 666, 150, 110, desk, { w: K.LM, r: 4 }) + K.seg(1710, 720, 1840, 720, ln(desk, 0.35), 2);
    for (const [mx, mw] of [[1250, 300], [1570, 280]]) {
      b += K.box(mx + mw / 2 - 10, 560, 20, 80, '#5f6478', { w: K.LM }) + K.box(mx + mw / 2 - 50, 630, 100, 12, '#5f6478', { w: K.LM, r: 4 });
      b += K.box(mx, 380, mw, 186, '#4c5068', { w: K.LM, r: 10 });
      b += S.rect(mx + 12, 392, mw - 24, 162, '#cfe6fb', 'rx="4"');
      b += S.rect(mx + 26, 408, mw * 0.5, 70, '#ffd6e2', 'rx="6"') + S.rect(mx + 26, 492, mw - 52, 14, '#9cc7ee', 'rx="7"') + S.rect(mx + 26, 516, (mw - 52) * 0.6, 14, '#f7b6c8', 'rx="7"');
      b += doodle('coracao', mx + mw * 0.78, 444, 1, '#f28ba8') + K.txt(mx + 26 + mw * 0.25, 452, 'LIVE', { size: 24, fill: '#e5455a' });
    }
    b += K.tube('M1240,640 L1220,470 L1300,410', '#5f6478', 8, { w: 2 }) + K.box(1290, 380, 30, 50, '#9fa4b8', { w: K.LM, r: 14 });
    b += K.rug(640, 930, 380, 70, '#f6b6c8');
    return { layers: [L(sv(b), 0)], particles: 'none', amb: ambIn('sala'), interior: true };
  };

  /* ------------------------------------------------------------ cafeteria */
  function cupSaucer(x, y, s, col) {
    let b = K.oval(x, y, 26 * s, 6 * s, '#ffffff', { w: 2 });
    b += K.shape(`M${f(x - 18 * s)},${f(y - 30 * s)} L${f(x + 18 * s)},${f(y - 30 * s)} Q${f(x + 16 * s)},${f(y - 2 * s)} ${f(x)},${f(y - 2 * s)} Q${f(x - 16 * s)},${f(y - 2 * s)} ${f(x - 18 * s)},${f(y - 30 * s)} Z`, col || '#ffffff', { w: 2 });
    b += `<path d="M${f(x + 17 * s)},${f(y - 24 * s)} q${f(12 * s)},0 ${f(10 * s)},${f(10 * s)} q-2,${f(6 * s)} ${f(-12 * s)},${f(6 * s)}" fill="none"${K.ST(ln(col || '#ffffff', 0.5), 3)}/>`;
    b += S.ellipse(x, y - 30 * s, 16 * s, 3 * s, c('#7a4b33'));
    return b;
  }
  function cakeSlice(x, y, s) {
    let b = K.oval(x, y, 34 * s, 7 * s, '#ffffff', { w: 2 });
    b += K.shape(`M${f(x - 26 * s)},${f(y - 2 * s)} L${f(x + 26 * s)},${f(y - 2 * s)} L${f(x + 26 * s)},${f(y - 30 * s)} L${f(x - 26 * s)},${f(y - 16 * s)} Z`, '#fff1d6', { w: 2 });
    b += S.path(`M${f(x - 26 * s)},${f(y - 9 * s)} L${f(x + 26 * s)},${f(y - 16 * s)} L${f(x + 26 * s)},${f(y - 20 * s)} L${f(x - 26 * s)},${f(y - 12 * s)} Z`, c('#f2a1ad'));
    b += K.disc(x + 14 * s, y - 36 * s, 8 * s, '#ef5f6f', { w: 2 });
    return b;
  }
  SC.cafe = function () {
    K.inside();
    const G = K.G;
    const FY = 800;
    const dark = '#8a5b40';
    let b = K.room({ wall: '#f7e2c4', floor: '#a8714f', floorY: FY, wain: 300, wainCol: dark, panels: 210, base: '#6e4632' });
    // janela para a rua
    const street = (gx, gy, gw, gh) => {
      let v = '';
      const blocks = [['#f6d9c6', 0.05, 0.28, 0.25], ['#d6e7d4', 0.33, 0.62, 0.15], ['#e6d8f0', 0.66, 0.96, 0.3]];
      for (const [col, a, z, t] of blocks) v += K.box(gx + gw * a, gy + gh * t, gw * (z - a), gh, col, { w: 2 }) + K.win(gx + gw * a + 18, gy + gh * t + 22, 40, 50, { w: 2, lit: G.night || G.rain, cross: false });
      v += S.rect(gx, gy + gh * 0.84, gw, gh, c('#cfc8bd'));
      return v;
    };
    b += windowRain(110, 170, 470, 410, { cols: 3, rows: 2, frame: '#7b5038', seed: 9, view: street, cloud: false });
    // porta com plaquinha (ABERTO de dia; à noite a dona virou para FECHADO)
    b += K.box(640, 220, 210, FY - 220, '#7b5038', { w: K.LW, r: 6 });
    b += K.windowOut(668, 248, 154, 240, { frame: '#7b5038', cross: false, sill: false, m: 10, view: street, cloud: false });
    b += rainGlass(678, 258, 134, 220, 12);
    b += S.circle(822, 560, 8, c('#e9c46a'));
    const sign = G.night ? 'FECHADO' : 'ABERTO';
    b += K.line('M700,500 L745,470 L790,500', ln('#ffffff', 0.4), 2);
    b += K.box(686, 500, 118, 44, '#fffaf0', { w: K.LM, r: 8 }) + S.text(745, 530, sign, ln('#fffaf0', 0.75), 22);
    // quadro do cardápio e prateleiras atrás do balcão
    b += K.box(1300, 60, 320, 160, '#7b5038', { w: K.LM, r: 6 }) + S.rect(1314, 74, 292, 132, c('#3f4b48'), 'rx="3"');
    b += K.txt(1460, 106, 'MENU', { size: 26, fill: '#f3f1ea', ls: 3 });
    [['café coado', '420'], ['chá preto', '380'], ['torta de morango', '580']].forEach(([item, price], i) => {
      b += K.txt(1330, 142 + i * 26, item, { size: 23, fill: '#f3f1ea', font: 'hand', anchor: 'start' }) + K.txt(1592, 142 + i * 26, price, { size: 23, fill: '#f6d48b', font: 'hand', anchor: 'end' });
    });
    for (const sy of [330, 450]) {
      b += wallShelf(1220, sy, 660, '#c9996c');
      for (let i = 0; i < 6; i++) {
        const jx = 1270 + i * 104;
        if (i % 2) b += cupSaucer(jx, sy, 0.9, ['#ffffff', '#f6d3d0', '#d3e6f6'][i % 3]);
        else b += can(jx, sy, 46, 56 + (i % 3) * 10, ['#f2d27c', '#a5cfa8', '#e9a3a8'][i % 3]);
      }
    }
    // pendentes
    for (const [x, len] of [[360, 120], [1000, 150], [1790, 150]]) b += K.pendant(x, 0, len, { col: '#e8b26a' });
    // balcão
    b += K.box(1180, 618, 760, FY - 618, dark, { w: K.LW });
    for (let x = 1240; x < 1900; x += 150) b += K.box(x, 650, 110, 120, dark, { w: 2, l: ln(dark, 0.3), r: 4 });
    b += K.box(1160, 596, 780, 26, '#c9946a', { w: K.LW, r: 6 });
    // máquina de café, redoma de bolo e xícaras no balcão
    b += K.box(1700, 460, 170, 140, '#d8dde6', { w: K.LM, r: 12 }) + K.box(1716, 476, 138, 40, '#9fa9bb', { w: 2, r: 6 }) + K.box(1760, 530, 50, 20, '#5f6478', { w: 2, r: 4 }) + cupSaucer(1785, 596, 0.7);
    b += cakeSlice(1360, 592, 1.1) + `<path d="M1300,594 Q1300,500 1360,500 Q1420,500 1420,594" fill="${c('#eaf6fb')}" fill-opacity=".35"${K.ST(ln('#eaf6fb', 0.4), K.LM)}/>` + K.disc(1360, 496, 8, '#c9946a', { w: 2 });
    b += cupSaucer(1520, 594, 1, '#f6d3d0');
    b += K.sign(1360, 628, 78, 28, [{ t: '¥580', size: 16 }], { base: '#fffaf0', ink: c('#c9784f'), r: 4, w: 2 });
    // mesinha na janela com dois cafés e duas tortas
    b += K.contact(345, FY + 2, 110, 9);
    b += K.box(338, 680, 14, FY - 680, '#5f4436', { w: K.LM }) + K.oval(345, FY - 4, 60, 9, '#5f4436', { w: K.LM });
    b += K.oval(345, 676, 150, 22, '#c9946a', { w: K.LW });
    b += cupSaucer(270, 672, 0.9) + cupSaucer(420, 672, 0.9) + cakeSlice(345, 672, 0.8);
    b += K.potPlant(900, FY, 1.2, { seed: 4, pot: '#e8b26a' });
    return { layers: [L(sv(b), 0)], particles: 'none', amb: K.GO.rain ? 'cafe_chuva' : 'cafe', interior: true };
  };

  /* ---------------------------------------------------------- biblioteca */
  SC.biblioteca = function () {
    K.inside();
    const FY = 800;
    let b = K.room({ wall: '#efe5d3', floor: '#c39a76', floorY: FY, wain: 120, wainCol: '#d5bf9e' });
    b += K.bookcase(30, 110, 520, 690, { shelves: 6, seed: 31 }) + K.bookcase(1370, 110, 520, 690, { shelves: 6, seed: 32 });
    b += K.sign(290, 58, 230, 38, [{ t: 'ROMANCES · POESIA', size: 17, ls: 1 }], { base: '#7a5a46', ink: '#f6e7c8', r: 5 });
    b += K.sign(1630, 58, 250, 38, [{ t: 'HISTÓRIA DAS CORRIDAS', size: 16, ls: 1 }], { base: '#7a5a46', ink: '#f6e7c8', r: 5 });
    b += K.wallClock(960, 84, 38);
    b += windowRain(730, 150, 460, 420, { cols: 2, rows: 2, seed: 33 });
    b += K.curtain(700, 130, 62, 460, 'e', '#8fbfa6') + K.curtain(1220, 130, 62, 460, 'd', '#8fbfa6');
    // mesa no fundo, perto da janela, com luminária e livros
    const wood = '#a8754f';
    b += K.contact(960, FY + 2, 330, 12);
    b += K.box(650, 690, 620, 24, wood, { w: K.LW, r: 6 });
    b += K.box(676, 714, 18, FY - 714, wood, { w: K.LM }) + K.box(1226, 714, 18, FY - 714, wood, { w: K.LM });
    const on = lightsOn();
    b += K.box(1080, 676, 80, 14, '#c9a46a', { w: K.LM, r: 4 }) + K.seg(1120, 676, 1120, 610, ln('#c9a46a'), 4);
    b += K.shape('M1066,612 Q1120,566 1174,612 Z', '#5fa883', { w: K.LM }) + K.box(1066, 608, 108, 10, on ? '#fff' : '#5fa883', { w: 2, f: on ? K.LIT : c('#5fa883'), l: on ? K.LIT_LINE : ln('#5fa883'), r: 4 });
    b += K.box(740, 662, 120, 28, '#e88f8f', { w: K.LM, r: 3 }) + K.box(750, 640, 100, 24, '#8fb5e3', { w: K.LM, r: 3 }) + K.box(760, 618, 84, 24, '#f3cf7c', { w: K.LM, r: 3 });
    b += K.shape('M920,690 L940,656 L1000,656 L1020,690 Z', '#e9eef3', { w: 2 }) + K.sign(970, 620, 120, 40, [{ t: 'SILÊNCIO ♪', size: 16 }], { base: '#ffffff', ink: c('#5fa883'), r: 6 });
    return { layers: [L(sv(b), 0)], particles: 'none', amb: ambIn('biblioteca'), interior: true };
  };

  /* ---------------------------------------------------------- enfermaria */
  SC.enfermaria = function () {
    K.inside();
    const G = K.G;
    const FY = 800;
    let b = K.room({ wall: '#eef7f4', floor: '#d6e4df', floorY: FY, wain: 140, wainCol: '#cfe8e0', base: '#a9cfc4', planks: 0 });
    for (const y of [870, 960]) b += K.seg(0, y, W, y, ln('#d6e4df', 0.2), 2);
    // trilho e cortina de privacidade
    b += K.seg(30, 92, 820, 92, ln('#cfd8dc'), 6) + K.seg(30, 92, 820, 92, c('#e8eef0'), 3);
    let folds = '';
    for (let x = 50; x < 300; x += 50) folds += `M${x},104 L${x + 6},740`;
    b += K.shape('M40,96 L300,96 L312,760 Q170,772 34,760 Z', '#cdeae2', { w: K.LM }) + K.line(folds, ln('#cdeae2', 0.3), 2.5);
    for (let x = 50; x < 300; x += 50) b += K.disc(x, 96, 5, '#e8eef0', { w: 2 });
    // cama
    const metal = '#f2f5f7', sheet = '#ffffff', blanket = '#b9dcef';
    b += K.contact(450, FY + 2, 300, 12);
    b += K.box(120, 470, 22, FY - 470, metal, { w: K.LM, r: 6 }) + K.box(120, 470, 120, 20, metal, { w: K.LM, r: 8 }) + K.box(218, 470, 22, FY - 470, metal, { w: K.LM, r: 6 });
    b += K.box(150, 620, 560, 70, sheet, { w: K.LW, r: 14 });
    b += K.box(160, 576, 120, 52, '#ffffff', { w: K.LM, r: 18 });
    b += K.box(320, 606, 400, 90, blanket, { w: K.LW, r: 16 }) + K.seg(330, 636, 710, 636, ln(blanket, 0.3), 3);
    b += K.box(690, 600, 22, FY - 600, metal, { w: K.LM, r: 6 });
    b += K.box(170, 690, 14, FY - 690, metal, { w: K.LM }) + K.box(660, 690, 14, FY - 690, metal, { w: K.LM });
    // tabela de letras para o exame de vista
    b += K.box(420, 150, 150, 230, '#ffffff', { w: K.LM, r: 4 });
    [['E', 56, 214], ['F P', 32, 262], ['T O Z', 24, 298], ['L P E D', 18, 328], ['P E C F D', 14, 354]].forEach(([t, sz, y]) => { b += K.txt(495, y, t, { size: sz, fill: c('#3b3346'), weight: 700 }); });
    // janela
    b += windowRain(860, 170, 400, 400, { cols: 2, seed: 41 });
    b += K.curtain(830, 150, 56, 440, 'e', '#cdeae2') + K.curtain(1290, 150, 56, 440, 'd', '#cdeae2');
    // TV no suporte (de manhã passa a corrida; à noite, desligada)
    b += K.box(1450, 140, 20, 50, '#9aa4b3', { w: K.LM });
    b += K.box(1340, 180, 240, 150, '#4c5068', { w: K.LM, r: 10 });
    if (G.night) b += S.rect(1352, 192, 216, 126, c('#2d3142'), 'rx="4"');
    else b += S.rect(1352, 192, 216, 126, c('#bfe3f5'), 'rx="4"') + S.rect(1352, 262, 216, 56, c('#9fd48a')) + K.seg(1352, 262, 1568, 262, '#ffffff', 4) + K.seg(1352, 280, 1568, 280, '#ffffff', 2);
    // armário de remédios
    b += K.box(1640, 300, 240, 500, '#ffffff', { w: K.LW, r: 6 });
    b += K.box(1656, 316, 100, 230, '#dff1f6', { w: K.LM, r: 4 }) + K.box(1764, 316, 100, 230, '#dff1f6', { w: K.LM, r: 4 });
    b += K.seg(1656, 430, 1864, 430, ln('#ffffff', 0.4), 3);
    [['#f2b6b5', 1676, 380], ['#f3d27c', 1712, 384], ['#a5cfa8', 1786, 376], ['#a9bfe6', 1826, 382], ['#f2b6b5', 1690, 494], ['#a9bfe6', 1806, 492]].forEach(([col, x, y]) => { b += K.box(x - 12, y, 24, 46, col, { w: 2, r: 4 }); });
    b += K.box(1656, 564, 208, 220, '#ffffff', { w: K.LM, r: 4 }) + K.seg(1760, 564, 1760, 784, ln('#ffffff', 0.4), 3);
    b += K.box(1730, 236, 60, 60, '#ffffff', { w: K.LM, r: 8 }) + S.rect(1752, 244, 16, 44, c('#5cb88f')) + S.rect(1738, 258, 44, 16, c('#5cb88f'));
    b += K.sign(1760, 150, 240, 56, [{ t: '保健室', font: 'jp', size: 22 }, { t: 'ENFERMARIA', size: 12, ls: 2 }], { base: '#5cb88f', ink: '#ffffff', r: 6 });
    b += K.poster(1400, 370, 130, 160, { band: '#5aa9d6', title: 'BEBA ÁGUA', icon: 'gota', text: ['hidratação', 'antes do treino'], ts: 15, size: 12 });
    b += chair(1000, FY, '#a9cfc4', 0.9);
    return { layers: [L(sv(b), 0)], particles: 'none', amb: 'sala', interior: true };
  };

  /* ------------------------------------------------------------ aeroporto */
  function airplane(x, y, s) {
    const body = '#f6f8fb', stripe = '#6f9fd6';
    let b = '';
    // asa de trás e cauda
    b += K.shape(`M${f(x + 560 * s)},${f(y - 40 * s)} L${f(x + 690 * s)},${f(y - 200 * s)} L${f(x + 760 * s)},${f(y - 200 * s)} L${f(x + 720 * s)},${f(y - 40 * s)} Z`, stripe, { w: K.LM });
    b += K.shape(`M${f(x + 300 * s)},${f(y)} L${f(x + 470 * s)},${f(y - 70 * s)} L${f(x + 520 * s)},${f(y - 70 * s)} L${f(x + 430 * s)},${f(y)} Z`, '#c9d2de', { w: K.LM });
    // fuselagem
    const fus = `M${f(x)},${f(y)} Q${f(x - 10 * s)},${f(y - 70 * s)} ${f(x + 80 * s)},${f(y - 80 * s)} L${f(x + 700 * s)},${f(y - 80 * s)} Q${f(x + 780 * s)},${f(y - 76 * s)} ${f(x + 800 * s)},${f(y - 40 * s)} L${f(x + 780 * s)},${f(y)} Z`;
    b += K.shape(fus, body, { w: K.LM });
    b += `<g clip-path="${K.clip(P.p(fus))}">${S.rect(x - 20, y - 30 * s, 840 * s, 12 * s, c(stripe))}</g>`;
    for (let i = 0; i < 14; i++) b += S.circle(x + 130 * s + i * 40 * s, y - 52 * s, 6 * s, K.G.night ? K.LIT : c('#7a8fb0'));
    b += K.shape(`M${f(x + 30 * s)},${f(y - 60 * s)} Q${f(x + 46 * s)},${f(y - 74 * s)} ${f(x + 76 * s)},${f(y - 72 * s)} L${f(x + 70 * s)},${f(y - 56 * s)} Z`, '#5a6f92', { w: 2 });
    // asa da frente e turbina
    b += K.shape(`M${f(x + 280 * s)},${f(y - 20 * s)} L${f(x + 520 * s)},${f(y + 60 * s)} L${f(x + 580 * s)},${f(y + 60 * s)} L${f(x + 440 * s)},${f(y - 20 * s)} Z`, '#c9d2de', { w: K.LM });
    b += K.box(x + 380 * s, y + 10 * s, 110 * s, 44 * s, '#dfe5ee', { w: K.LM, r: 20 * s });
    // trem de pouso
    b += K.seg(x + 120 * s, y, x + 120 * s, y + 40 * s, ln('#7f8ba0'), 4) + K.disc(x + 120 * s, y + 46 * s, 10 * s, '#3c4152', { w: 2 });
    b += K.seg(x + 460 * s, y, x + 460 * s, y + 40 * s, ln('#7f8ba0'), 4) + K.disc(x + 450 * s, y + 46 * s, 10 * s, '#3c4152', { w: 2 }) + K.disc(x + 474 * s, y + 46 * s, 10 * s, '#3c4152', { w: 2 });
    return b;
  }
  function dubai(gx, gy, gw, gh) {
    const G = K.G;
    const base = gy + gh * 0.82;
    let v = '';
    const r = K.rand(51);
    const tower = (x, w, top, col) => {
      let t = K.box(x, top, w, base - top + 4, col, { w: 2, r: 4 });
      if (G.night) for (let wy = top + 14; wy < base - 8; wy += 22) for (let wxx = x + 8; wxx < x + w - 10; wxx += 18) if (r() < 0.5) t += S.rect(wxx, wy, 8, 10, K.LIT, 'rx="2"');
      return t;
    };
    v += tower(gx + 60, 90, base - 200, '#7d86a8') + tower(gx + 170, 70, base - 260, '#6f7a9e') + tower(gx + 1260, 110, base - 230, '#7d86a8') + tower(gx + 1400, 80, base - 170, '#6f7a9e');
    // a torre mais alta, em degraus
    const bx = gx + gw * 0.56;
    let burj = '';
    // a torre mais alta, em degraus bem marcados e com uma agulha no topo
    // cada degrau: [meia largura, até que fração da altura ele sobe]
    const top0 = gy + gh * 0.16, hb = base - top0;
    const steps = [[74, 0.34], [54, 0.52], [38, 0.7], [24, 0.86], [13, 1]];
    for (const [hw, u] of steps) burj += P.r(bx - hw, base - hb * u, hw * 2, hb * u + 4, 3);
    burj += P.p(`M${f(bx - 7)},${f(top0 + 2)} L${f(bx)},${f(gy + 4)} L${f(bx + 7)},${f(top0 + 2)} Z`);
    v += K.union(burj, '#8a93b5', { w: 2 });
    if (G.night) for (let wy = gy + gh * 0.3; wy < base - 10; wy += 26) v += S.rect(bx - 4, wy, 8, 10, K.LIT, 'rx="2"');
    // vela à direita
    v += K.shape(`M${f(gx + gw - 420)},${f(base)} L${f(gx + gw - 420)},${f(base - 220)} Q${f(gx + gw - 330)},${f(base - 140)} ${f(gx + gw - 340)},${f(base)} Z`, '#c9cde0', { w: 2 });
    v += S.rect(gx, base, gw, gh, c('#3a3550'));
    for (const px of [gx + 380, gx + 900, gx + 1500]) v += K.palm(px, base + 30, 0.42, { lean: 20, w: 2 });
    return v;
  }
  SC.aeroporto = function (o) {
    K.inside();
    const dxb = o.v === 'dubai';
    if (dxb) K.GO.sky = K.GO.night ? [['0', '#1b1d4a'], ['.7', '#4b3a74'], ['1', '#c4789a']] : [['0', '#8fc3ef'], ['1', '#f7e3c4']];
    const FY = 760;
    const frame = '#5f6b80';
    let b = S.rect(0, 0, W, FY, c('#e9ecf2'));
    // a vista pelo vidrão
    const view = (gx, gy, gw, gh) => {
      if (dxb) return dubai(gx, gy, gw, gh);
      const G = K.G;
      let v = S.rect(gx, gy + gh * 0.72, gw, gh, c('#59607a'));
      v += K.seg(gx, gy + gh * 0.72, gx + gw, gy + gh * 0.72, ln('#59607a', 0.4), 2);
      for (let x = gx + 30; x < gx + gw; x += 90) v += S.circle(x, gy + gh * 0.8, 4, G.night ? K.LIT : c('#cfd6e2'));
      v += K.box(gx + 160, gy + gh * 0.35, 60, gh * 0.37, '#c9cfdc', { w: 2 }) + K.box(gx + 140, gy + gh * 0.28, 100, 50, '#9fb3c8', { w: 2, r: 8 });
      v += airplane(gx + gw * 0.42, gy + gh * 0.78, 1.15);
      return v;
    };
    b += K.windowOut(0, 70, W, FY - 70, { frame, cols: 6, rows: 1, m: 18, sill: false, view, cloud: !dxb, seed: 52 });
    b += S.rect(0, 0, W, 70, c('#d9dee8')) + K.seg(0, 70, W, 70, ln('#d9dee8', 0.4), K.LM);
    for (let x = 160; x < W; x += 320) b += K.disc(x, 36, 12, '#ffffff', { w: 2, f: K.LIT, l: K.LIT_LINE });
    // painel de partidas pendurado
    b += K.seg(200, 70, 200, 120, ln('#9aa4b3'), 4) + K.seg(560, 70, 560, 120, ln('#9aa4b3'), 4);
    b += K.box(130, 116, 500, 190, '#2e3550', { w: K.LM, r: 10 });
    const rows = dxb ? [['TÓQUIO', '08:40'], ['LONDRES', '09:15'], ['TÓQUIO', '13:20'], ['CANCELADO', '—']] : [['DUBAI', '23:55'], ['PARIS', '00:20'], ['SEUL', '00:45'], ['HONG KONG', '01:10']];
    b += K.txt(380, 144, 'PARTIDAS · DEPARTURES', { size: 16, fill: '#9fc3ef', ls: 2 }) + K.seg(150, 154, 610, 154, '#4a5577', 2);
    rows.forEach(([city, t], i) => { b += S.text(250, 184 + i * 34, city, i === 3 && dxb ? '#ff9f9f' : '#ffd47e', 22) + S.text(560, 184 + i * 34, t, '#ffd47e', 22); });
    // placa do portão, pendurada do teto
    b += K.sign(1500, 112, 400, 58, [{ t: dxb ? 'GATE B7 · PORTÃO B7' : 'PORTÃO 12 · EMBARQUE', size: 24, ls: 2 }], { base: '#2e3550', ink: '#ffd47e', r: 8, hang: 42 });
    // chão
    const fl = '#d6dbe3';
    b += S.rect(0, FY, W, H - FY, c(fl)) + K.seg(0, FY, W, FY, ln(fl, 0.45), K.LM);
    for (const y of [820, 920]) b += K.seg(0, y, W, y, ln(fl, 0.2), 2);
    // fileira de poltronas
    const seat = '#6f9fd6';
    b += K.contact(1530, FY + 6, 360, 10);
    b += K.box(1180, 700, 700, 14, '#9aa4b3', { w: K.LM, r: 4 }) + K.box(1240, 714, 14, FY - 714, '#9aa4b3', { w: K.LM }) + K.box(1800, 714, 14, FY - 714, '#9aa4b3', { w: K.LM });
    for (let i = 0; i < 5; i++) { const sx = 1194 + i * 138; b += K.box(sx, 580, 120, 110, seat, { w: K.LM, r: 22 }) + K.box(sx - 4, 668, 128, 30, seat, { w: K.LM, r: 10 }); }
    b += K.potPlant(1080, FY, 1.3, { seed: 7, pot: '#f6f8fb' });
    return { layers: [L(sv(b), 0)], particles: 'none', amb: 'aeroporto', interior: true };
  };

  /* ----------------------------------------------- palco do Winning Live */
  SC.palco = function (o) {
    const G = K.G;
    const empty = o.v === 'vazio';
    const r = K.rand(61);
    let back = K.sky(700);
    // arquibancadas do estádio nos dois lados (e o mar de bastões de luz)
    const stand = '#4b4775';
    let st = '';
    for (const [x0, x1, dir] of [[-40, 560, 1], [1360, 1960, -1]]) {
      for (let k = 0; k < 4; k++) {
        const y = 250 + k * 110;
        st += K.shape(`M${f(x0)},${f(y + (dir > 0 ? 0 : 40))} L${f(x1)},${f(y + (dir > 0 ? 40 : 0))} L${f(x1)},${f(y + 110 + (dir > 0 ? 40 : 0))} L${f(x0)},${f(y + 110 + (dir > 0 ? 0 : 40))} Z`, k % 2 ? stand : K.mix(stand, '#ffffff', 0.08), { w: K.LF });
      }
      if (!empty) {
        // o "mar de bastões de luz": uma fileira de bastões em cada degrau da arquibancada
        const cols = ['#ff9fbf', '#9fd6ff', '#ffe08a', '#b7f0a8', '#d6b4ff'];
        let i = 0;
        for (let k = 0; k < 4; k++) {
          const y = 250 + k * 110;
          for (let x = x0 + 24; x < x1 - 10; x += 38) {
            const t = (x - x0) / (x1 - x0), top = y + 40 * (dir > 0 ? t : 1 - t);
            const sx = x + (r() - 0.5) * 10, sy = top + 54 + (r() - 0.5) * 12, a = (r() - 0.5) * 22;
            st += S.rect(sx - 4, sy - 16, 8, 32, cols[i++ % cols.length], `rx="4" transform="rotate(${f(a)} ${f(sx)} ${f(sy)})"`);
          }
        }
      }
    }
    back += st;
    // telão de LED
    const scr = empty ? '#262640' : '#3a3466';
    back += K.box(360, 150, 1200, 470, '#2b2a3d', { w: K.LM, r: 12 }) + S.rect(380, 170, 1160, 430, c(scr), 'rx="6"');
    if (!empty) {
      back += K.shape(`M960,520 C840,440 860,330 960,380 C1060,330 1080,440 960,520 Z`, '#ff9fbf', { w: K.LM, f: '#ff9fbf', l: '#d9708f' });
      for (const [sx, sy, sr, col] of [[560, 260, 26, '#ffe08a'], [1360, 260, 26, '#9fd6ff'], [700, 470, 18, '#9fd6ff'], [1220, 470, 18, '#ffe08a']]) back += S.path(K.starD(sx, sy, sr), col);
      back += S.text(960, 260, 'WINNING LIVE', '#ffffff', 46);
    } else for (let x = 420; x < 1540; x += 60) back += K.seg(x, 170, x, 600, '#2f2f4c', 2);
    // treliça com refletores
    const truss = '#8a8fa6';
    back += K.box(150, 70, 1620, 44, truss, { w: K.LM, r: 4 });
    let zz = 'M160,74';
    for (let x = 160; x < 1760; x += 40) zz += ` L${x + 20},${(x / 40) % 2 ? 110 : 74}`;
    back += K.line(zz, ln(truss, 0.3), 2);
    for (const x of [150, 1730]) back += K.box(x, 70, 40, 690, truss, { w: K.LM, r: 4 });
    const lens = ['#ff9fbf', '#ffe08a', '#9fd6ff', '#ffffff'];
    for (let i = 0; i < 9; i++) {
      const lx = 300 + i * 165;
      back += K.box(lx - 26, 114, 52, 46, '#3d3f52', { w: K.LM, r: 8 });
      // no palco vazio, todos apagados: só a luz de serviço fica acesa
      back += K.disc(lx, 160, 16, empty ? '#5a5c70' : lens[i % 4], { w: 2, f: empty ? c('#5a5c70') : lens[i % 4], l: '#2b2a3d' });
    }
    // caixas de som e o palco
    for (const x of [230, 1590]) { back += K.box(x, 560, 100, 200, '#3d3f52', { w: K.LM, r: 6 }); back += K.disc(x + 50, 610, 26, '#5a5c70', { w: 2 }) + K.disc(x + 50, 700, 36, '#5a5c70', { w: 2 }); }
    const floor = '#4d3f6e';
    back += S.rect(0, 760, W, H - 760, c(floor)) + K.seg(0, 760, W, 760, ln(floor, 0.4), K.LM);
    back += S.rect(0, 1000, W, 80, c(K.mix(floor, '#000000', 0.25)));
    for (const y of [820, 900]) back += K.seg(0, y, W, y, ln(floor, 0.25), 2);
    // luz de serviço (palco vazio): uma lâmpada num tripé, e o aviso colado na caixa de som
    if (empty) {
      back += `<g transform="rotate(-3 280 650)">${K.sign(280, 610, 150, 84, [{ t: 'AVISO', size: 16, ls: 2 }, { t: 'apresentação', size: 14 }, { t: 'suspensa', size: 14 }], { base: '#fff7dc', ink: c('#c0503f'), r: 3, w: 2 })}</g>`;
      back += K.line('M1460,760 L1500,600 L1540,760 M1500,600 L1500,760', ln('#8a8fa6'), 5);
      back += K.box(1468, 560, 64, 50, '#8a8fa6', { w: K.LM, r: 10 }) + K.disc(1500, 585, 18, '#fff', { w: 2, f: K.LIT, l: K.LIT_LINE });
    }
    return { layers: [L(sv(back), 0)], particles: 'none', amb: empty ? 'vazio' : 'live' };
  };

  /* --------------------------------------------------------------- cinema */
  function veggieGarden(x, y, w, h) {
    let v = S.rect(x, y, w, h, '#bfe6f8') + K.disc(x + w * 0.84, y + h * 0.2, h * 0.11, '#ffe9a6', { w: 2 });
    v += S.path(K.smooth([[x - 10, y + h * 0.62], [x + w * 0.3, y + h * 0.5], [x + w * 0.62, y + h * 0.6], [x + w + 10, y + h * 0.48]]) + ` L${f(x + w + 10)},${f(y + h + 10)} L${f(x - 10)},${f(y + h + 10)} Z`, '#9fd48a');
    // brócolis grandes como árvores, tomates, cenouras
    for (const [bx, s] of [[0.14, 1], [0.32, 0.8], [0.76, 1.1]]) {
      const px = x + w * bx, py = y + h * 0.66;
      v += K.box(px - 12 * s, py - 60 * s, 24 * s, 70 * s, '#b7dd8e', { w: 2 });
      v += K.union(P.c(px, py - 90 * s, 46 * s) + P.c(px - 40 * s, py - 70 * s, 32 * s) + P.c(px + 40 * s, py - 72 * s, 34 * s) + P.c(px, py - 130 * s, 30 * s), '#5fae6a', { w: 2, off: [-4, -6] });
    }
    for (const tx of [0.46, 0.56, 0.9]) { const px = x + w * tx, py = y + h * 0.78; v += K.disc(px, py, 26, '#ef5f5f', { w: 2 }) + K.shape(`M${f(px - 14)},${f(py - 24)} L${f(px)},${f(py - 34)} L${f(px + 14)},${f(py - 24)} L${f(px)},${f(py - 18)} Z`, '#5fae6a', { w: 2 }); }
    for (const tx of [0.62, 0.68]) { const px = x + w * tx, py = y + h * 0.9; v += K.shape(`M${f(px - 16)},${f(py - 30)} L${f(px + 16)},${f(py - 30)} L${f(px)},${f(py + 30)} Z`, '#f2a14f', { w: 2 }) + K.line(`M${f(px)},${f(py - 30)} l-10,-24 M${f(px)},${f(py - 30)} l0,-28 M${f(px)},${f(py - 30)} l10,-24`, '#5fae6a', 5); }
    return v;
  }
  SC.cinema = function (o) {
    const lit = o.v === 'luzes';
    K.inside();
    let b = '';
    const wall = lit ? '#8e4a5a' : '#2c2438';
    b += S.rect(0, 0, W, H, lit ? c(wall) : wall);
    if (lit) {
      for (let x = 0; x < W; x += 240) b += K.box(x + 20, 120, 200, 520, wall, { w: 2, r: 10 });
      for (const x of [140, 1780]) b += K.shape(`M${x - 30},300 L${x + 30},300 L${x + 20},340 L${x - 20},340 Z`, '#ffd9a0', { w: 2, f: K.LIT, l: K.LIT_LINE });
    }
    // cortinas e a tela
    const velvet = lit ? '#c4485a' : '#5a2a3a';
    b += K.box(320, 70, 1280, 40, velvet, { w: K.LM, r: 6, f: lit ? c(velvet) : velvet, l: '#24151e' });
    const screen = (x, y, w, h) => (lit
      ? S.rect(x, y, w, h, '#fbf6ea') + S.text(x + w / 2, y + h * 0.42, 'Veggie Caroline', '#4f9a5b', 72) + S.text(x + w / 2, y + h * 0.58, 'A Grande Horta Encantada', '#c9784f', 36) + K.disc(x + w * 0.3, y + h * 0.78, 30, '#ef5f5f', { w: 2 }) + K.union(P.c(x + w * 0.5, y + h * 0.78, 34) + P.c(x + w * 0.5 - 26, y + h * 0.8, 24) + P.c(x + w * 0.5 + 26, y + h * 0.8, 24), '#5fae6a', { w: 2 }) + K.shape(`M${f(x + w * 0.7 - 16)},${f(y + h * 0.72)} L${f(x + w * 0.7 + 16)},${f(y + h * 0.72)} L${f(x + w * 0.7)},${f(y + h * 0.88)} Z`, '#f2a14f', { w: 2 })
      : veggieGarden(x, y, w, h));
    // a tela é luz projetada: o filme aparece com as cores puras
    b += K.frameArt(380, 120, 1160, 450, { frame: '#1e1a26', m: 12, art: (x, y, w, h) => K.neutral(() => screen(x, y, w, h)) });
    b += K.shape('M300,90 L420,90 Q400,400 440,700 L300,700 Z', velvet, { w: K.LM, f: lit ? c(velvet) : velvet, l: '#24151e' }) + K.shape('M1620,90 L1500,90 Q1520,400 1480,700 L1620,700 Z', velvet, { w: K.LM, f: lit ? c(velvet) : velvet, l: '#24151e' });
    // placas de saída (verde chapado; acesas mesmo no escuro)
    for (const [x, t] of [[160, '← SAÍDA'], [1760, 'SAÍDA →']]) b += K.box(x - 80, 150, 160, 50, '#2f9a62', { w: K.LM, r: 6, f: '#2f9a62', l: '#1d5e3c' }) + K.txt(x, 184, t, { size: 22, fill: '#ffffff', ls: 1 });
    // fileiras de poltronas
    const seat = lit ? '#c4485a' : '#3a2433';
    for (const [y, w2, gap, off] of [[690, 120, 16, 0], [790, 140, 18, 70], [910, 170, 20, 10]]) {
      for (let x = -60 + off; x < W + 60; x += w2 + gap) b += K.box(x, y, w2, 140, seat, { w: K.LM, r: 24, f: lit ? c(seat) : seat, l: lit ? ln(seat, 0.5) : '#1e131b' });
    }
    return { layers: [L(sv(b), 0)], particles: 'none', amb: 'sala', interior: true };
  };

  /* ---------------------------------------------- sala de música (extra) */
  SC.salamusica = function () {
    K.inside();
    const FY = 790;
    let b = K.room({ wall: '#eef0f8', floor: '#cfa47c', floorY: FY, wain: 150, wainCol: '#d9dcec', panels: 260 });
    b += windowRain(1080, 160, 420, 430, { cols: 2, rows: 2, seed: 71 });
    b += K.curtain(1046, 140, 62, 470, 'e', '#c9c2e8') + K.curtain(1534, 140, 62, 470, 'd', '#c9c2e8');
    // pôster de partitura
    b += K.box(640, 210, 260, 180, '#ffffff', { w: K.LM, r: 4 });
    for (let k = 0; k < 5; k++) b += K.seg(660, 250 + k * 18, 880, 250 + k * 18, ln('#ffffff', 0.5), 2);
    for (const [nx, ny] of [[700, 304], [760, 286], [820, 268]]) b += S.ellipse(nx, ny, 9, 7, ln('#ffffff', 0.7)) + K.seg(nx + 8, ny, nx + 8, ny - 40, ln('#ffffff', 0.7), 3);
    b += K.poster(160, 150, 150, 196, { band: '#9a86c9', title: 'RECITAL', icon: 'nota', text: ['de primavera', 'sexta · 18h'], ts: 17, size: 13, rot: -2 });
    // piano de cauda visto de lado
    const black = '#3c3a4c';
    b += K.contact(330, FY + 2, 280, 12);
    b += K.shape('M80,560 L560,560 Q600,560 600,600 L600,640 L80,640 Z', black, { w: K.LW });
    b += K.shape('M120,560 L420,380 L440,396 L170,560 Z', black, { w: K.LM });
    b += K.box(70, 600, 150, 30, '#ffffff', { w: K.LM, r: 3 });
    for (let x = 84; x < 216; x += 18) b += S.rect(x, 600, 9, 18, c(black));
    for (const x of [110, 520]) b += K.box(x, 640, 22, FY - 640, black, { w: K.LM, r: 4 });
    b += K.box(150, 734, 120, 18, black, { w: K.LM, r: 6 });
    // estante de partitura
    b += K.seg(1700, FY, 1700, 560, ln('#5f6478'), 5) + K.line(`M1660,${FY} L1700,${FY - 50} L1740,${FY}`, ln('#5f6478'), 5);
    b += K.shape('M1630,560 L1770,560 L1760,470 L1640,470 Z', '#5f6478', { w: K.LM });
    return { layers: [L(sv(b), 0)], particles: 'none', amb: 'sala', interior: true };
  };

  /* ---------------------------------------------- ateliê de pintura (extra) */
  function easelIn(x, y, s, art) {
    const wood = '#b98b62';
    let b = K.contact(x, y + 4, 80 * s, 9);
    b += K.tube(`M${f(x - 56 * s)},${f(y)} L${f(x - 8 * s)},${f(y - 330 * s)}`, wood, 10 * s, { w: K.LM }) + K.tube(`M${f(x + 56 * s)},${f(y)} L${f(x + 8 * s)},${f(y - 330 * s)}`, wood, 10 * s, { w: K.LM });
    b += K.box(x - 96 * s, y - 150 * s, 192 * s, 12 * s, wood, { w: K.LM, r: 3 });
    b += K.frameArt(x - 90 * s, y - 310 * s, 180 * s, 160 * s, { frame: '#f3ead8', m: 8, art });
    return b;
  }
  SC.atelie = function () {
    K.inside();
    const FY = 790;
    let b = K.room({ wall: '#f5efe6', floor: '#d8c4a8', floorY: FY, base: '#c7b08f' });
    const r = K.rand(81);
    for (let i = 0; i < 30; i++) b += S.circle(r() * W, 840 + r() * 220, 3 + r() * 6, c(['#ef8f8f', '#8fb5e3', '#f3cf7c', '#9fd0a4'][i % 4]), 'opacity=".7"');
    b += windowRain(140, 140, 560, 480, { cols: 3, rows: 2, seed: 82 });
    b += wallShelf(1220, 300, 560, '#c9996c');
    b += K.sign(1500, 150, 330, 54, [{ t: 'CLUBE DE ARTES', size: 24, ls: 2 }], { base: '#f2b45c', ink: '#ffffff', r: 8, hang: 40 });
    for (let i = 0; i < 7; i++) b += can(1260 + i * 76, 300, 46, 48 + (i % 3) * 10, ['#ef8f8f', '#8fb5e3', '#f3cf7c', '#9fd0a4', '#c6a2dc'][i % 5]);
    b += easelIn(900, FY, 1, (x, y, w, h) => S.rect(x, y, w, h, '#fbf6ea') + S.circle(x + w * 0.35, y + h * 0.45, h * 0.28, '#f3cf7c') + S.rect(x + w * 0.45, y + h * 0.4, w * 0.4, h * 0.4, '#8fb5e3'));
    b += easelIn(1500, FY, 1.1, (x, y, w, h) => S.rect(x, y, w, h, '#fbf6ea') + S.path(`M${f(x)},${f(y + h)} Q${f(x + w * 0.5)},${f(y + h * 0.2)} ${f(x + w)},${f(y + h)} Z`, '#9fd0a4') + K.disc(x + w * 0.7, y + h * 0.3, 14, '#ef8f8f', { w: 2 }));
    return { layers: [L(sv(b), 0)], particles: 'none', amb: 'sala', interior: true };
  };

  /* ----------------------------------------------------- galeria (extra) */
  SC.galeria = function (o) {
    K.inside();
    const G = K.G;
    if (o.v === 'noite') { G.mixes = G.mixes.concat([['#1d1830', 0.3]]); }
    const FY = 800;
    let b = K.room({ wall: '#f7f5f2', floor: '#cbb89f', floorY: FY, base: '#d8d2c8', planks: 3 });
    b += K.seg(80, 80, 1840, 80, ln('#9aa4b3'), 4);
    for (const x of [420, 960, 1500]) b += K.seg(x, 80, x + 30, 120, ln('#5f6478'), 4) + K.box(x + 14, 112, 44, 30, '#5f6478', { w: K.LM, r: 8 });
    const arts = [
      [220, 230, 400, 300, (x, y, w, h) => S.rect(x, y, w, h, '#cfe6f5') + S.path(`M${f(x)},${f(y + h)} L${f(x + w * 0.3)},${f(y + h * 0.4)} L${f(x + w * 0.55)},${f(y + h * 0.7)} L${f(x + w * 0.8)},${f(y + h * 0.3)} L${f(x + w)},${f(y + h)} Z`, '#8fb7a6')],
      [740, 180, 440, 380, (x, y, w, h) => S.rect(x, y, w, h, '#fbe7d3') + S.circle(x + w * 0.5, y + h * 0.42, h * 0.22, '#ef8f6f') + S.rect(x, y + h * 0.7, w, h * 0.3, '#9fd0a4')],
      [1300, 230, 400, 300, (x, y, w, h) => S.rect(x, y, w, h, '#ece4f6') + S.rect(x + w * 0.15, y + h * 0.2, w * 0.3, h * 0.6, '#c6a2dc') + S.circle(x + w * 0.68, y + h * 0.5, h * 0.2, '#f3cf7c')],
    ];
    for (const [x, y, w, h, art] of arts) b += K.frameArt(x, y, w, h, { frame: '#c9a46a', m: 14, art });
    [[420, 560, 'Serra ao amanhecer'], [960, 590, 'Sol de outubro'], [1500, 560, 'Composição nº 3']].forEach(([x, y, t]) => { b += K.sign(x, y, 200, 34, [{ t, size: 15 }], { base: '#ffffff', ink: c('#6b6676'), r: 3, w: 2 }); });
    return { layers: [L(sv(b), 0)], particles: 'none', amb: 'biblioteca', interior: true };
  };

  /* ------------------------------------- quarto de tatame da pousada */
  SC.quarto_jp = function () {
    K.inside();
    const G = K.G;
    const FY = 780;
    const wood = '#b98b62', plaster = '#f3ead8';
    let b = S.rect(0, 0, W, FY, c(plaster));
    // vigas e pilares de madeira
    b += K.box(-10, 110, W + 20, 24, wood, { w: K.LM }) + K.box(-10, 0, W + 20, 40, K.mix(wood, '#ffffff', 0.15), { w: K.LM });
    for (const x of [90, 560, 1118, 1840]) b += K.box(x - 14, 40, 28, FY - 40, wood, { w: K.LM });
    // tokonoma: rolo pendurado e vaso com galho
    b += S.rect(104, 134, 442, FY - 134, sh(plaster, 0.12));
    b += K.box(100, 700, 450, 80, wood, { w: K.LM });
    b += K.seg(325, 134, 325, 170, ln(wood), 3);
    b += K.box(255, 170, 140, 400, '#f7f2e6', { w: K.LM, r: 3 }) + S.rect(255, 170, 140, 22, c('#7b9a86')) + S.rect(255, 548, 140, 22, c('#7b9a86'));
    b += S.path('M270,470 L320,370 L350,420 L370,390 L382,470 Z', c('#8f99a8')) + S.circle(350, 300, 22, c('#ef7d76'));
    b += K.line('M270,500 q40,-10 80,0 M300,520 q30,-8 60,0', ln('#f7f2e6', 0.25), 3);
    b += K.box(400, 630, 60, 70, '#6f9fc4', { w: K.LM, r: 20 });
    b += K.bareTree(430, 632, 0.42, { seed: 3, flowers: '#f7c5d4', center: '#e98a6d', depth: 2, len: 150, noSnow: true }).replace(/<ellipse[^>]*opacity[^>]*\/>/, '');
    // janela de shoji aberta para o mar
    const seaView = (gx, gy, gw, gh) => {
      const GG = K.G;
      let v = S.rect(gx, gy + gh * 0.55, gw, gh, c('#7fc4e4')) + K.seg(gx, gy + gh * 0.55, gx + gw, gy + gh * 0.55, ln('#7fc4e4', 0.4), 2);
      if (GG.night && !GG.rain) v += K.moon(gx + gw * 0.7, gy + gh * 0.24, 34) + S.rect(gx + gw * 0.7 - 30, gy + gh * 0.62, 60, 4, '#fff1c2', 'rx="2"') + S.rect(gx + gw * 0.7 - 20, gy + gh * 0.7, 40, 4, '#fff1c2', 'rx="2"');
      v += K.line(`M${f(gx + 60)},${f(gy + gh * 0.7)} q20,-6 40,0 M${f(gx + gw * 0.4)},${f(gy + gh * 0.8)} q20,-6 40,0`, K.mix(c('#7fc4e4'), '#ffffff', 0.5), 3);
      return v;
    };
    b += windowRain(1150, 160, 640, 470, { frame: wood, cols: 2, rows: 1, seed: 91, view: seaView, cloud: true, sill: false });
    // shoji fechados dos lados
    for (const x0 of [586, 1828]) {
      const w = x0 === 586 ? 500 : 0;
      if (!w) continue;
      b += K.box(x0, 150, w, 610, wood, { w: K.LM });
      b += S.rect(x0 + 12, 162, w - 24, 586, G.night ? K.mix(K.LIT, '#fbf6ea', 0.62) : c('#fbf6ea'));
      for (let x = x0 + 12 + (w - 24) / 4; x < x0 + w - 14; x += (w - 24) / 4) b += K.seg(x, 162, x, 748, ln(wood, 0.2), 3);
      for (let y = 162 + 586 / 6; y < 748; y += 586 / 6) b += K.seg(x0 + 12, y, x0 + w - 12, y, ln(wood, 0.2), 3);
    }
    // cronograma do acampamento de verão, preso no shoji
    b += `<g transform="rotate(1.5 700 330)">${K.box(612, 214, 176, 236, '#fffdf4', { w: 2, r: 3 })}${S.circle(700, 224, 5, c('#ef7d76'))}</g>`;
    b += K.txt(700, 252, 'ACAMPAMENTO', { size: 15, fill: c('#e0675f'), ls: 1 });
    [['6h', 'corrida na praia'], ['8h', 'café da manhã'], ['9h', 'treino'], ['15h', 'mar livre ♪'], ['21h', 'luzes apagadas']].forEach(([h, t], i) => {
      b += K.txt(626, 288 + i * 33, h, { size: 21, fill: c('#e0675f'), font: 'hand', anchor: 'start' }) + K.txt(666, 288 + i * 33, t, { size: 21, fill: c('#3e5b9a'), font: 'hand', anchor: 'start' });
    });
    // mesa baixa com papéis, lápis de cor e tesoura
    b += K.box(610, 700, 380, 24, wood, { w: K.LM, r: 4 }) + K.box(630, 724, 18, 56, wood, { w: K.LM }) + K.box(952, 724, 18, 56, wood, { w: K.LM });
    b += `<g transform="rotate(-6 720 690)">${K.box(660, 676, 140, 20, '#ffffff', { w: 2 })}</g>` + K.box(800, 680, 110, 18, '#fff4c9', { w: 2 });
    ['#ef8f8f', '#8fb5e3', '#f3cf7c', '#9fd0a4'].forEach((col, i) => { b += K.box(926 + i * 12, 640, 9, 58, col, { w: 2, r: 3 }); });
    b += K.box(922, 680, 56, 20, '#c9996c', { w: 2, r: 4 });
    // tatame
    const tat = '#d9d6a2', edge = '#5f7f5a';
    b += S.rect(0, FY, W, H - FY, c(tat)) + K.seg(0, FY, W, FY, ln(tat, 0.45), K.LM);
    b += S.rect(0, 860, W, 10, c(edge)) + S.rect(0, 990, W, 12, c(edge));
    for (const x of [480, 1440]) b += K.seg(x, FY, x, 860, ln(tat, 0.3), 2);
    for (const x of [960]) b += K.seg(x, 870, x, 990, ln(tat, 0.3), 2);
    // andon (luminária de papel), aceso à noite
    const on = G.night || G.rain;
    b += K.contact(1046, FY + 4, 40, 6);
    b += K.box(1016, 600, 60, 176, wood, { w: K.LM, r: 4 }) + S.rect(1026, 610, 40, 140, on ? K.LIT : c('#fbf6ea'));
    b += K.seg(1046, 610, 1046, 750, ln(wood, 0.3), 2);
    return { layers: [L(sv(b), 0)], particles: 'none', amb: 'mar', interior: true };
  };
})();
