/* =========================================================================
   Cenários externos (v3, cartum minimalista). Cada função recebe
   { time, weather, v } e devolve { layers: [{svg, depth, cls}], particles, amb, light? }.
   depth = parallax (0 = parado). Sem pessoas nem animais: só lugares.
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const K = VN.Kit, S = K.S, P = K.P, f = K.f;
  const W = 1920, H = 1080;
  const L = (svg, depth, cls) => ({ svg, depth: depth || 0, cls: cls || '' });
  const SC = (VN.SceneDefs = VN.SceneDefs || {});
  const sv = (b, o) => S.svg(b, o);
  const c = (x) => K.c(x), sh = (x, k) => K.sh(x, k), ln = (x, k) => K.ln(x, k);

  /* ------------------------------------------------------------ comuns */
  const CLOUDS = [[240, 230, 290], [1660, 170, 240], [1000, 110, 160]];
  const CLOUDS_RAIN = [[160, 130, 520], [700, 70, 560], [1280, 120, 540], [1820, 90, 520], [420, 270, 420], [1540, 280, 440]];
  /** partículas e som conforme o clima */
  const wx = (dflt) => (K.G.rain ? 'rain' : K.G.snow ? 'snow' : dflt || 'none');
  const ambOut = (dflt) => (K.G.rain ? 'chuva' : K.G.night ? 'noite' : dflt || 'vento');

  /** céu, astros e nuvens */
  function skyLayers(q) {
    const o = q || {};
    const G = K.G;
    const hz = o.horizon || 620;
    const out = [L(K.sky(hz), 0)];
    let astro = '';
    if (G.night && !G.rain && o.stars !== 0) astro += K.stars(o.starSeed || 5, o.stars || 70, { y1: Math.min(hz - 40, o.starY1 || 520), avoid: o.avoid });
    // sol e lua só onde a cena pede, num lugar livre (sem esbarrar em árvore ou prédio)
    if (o.sunAt && G.sunC && !G.night) astro += K.sun(o.sunAt.x, o.sunAt.y, o.sunAt.r || 50);
    if (o.moonAt && G.night && !G.rain) astro += K.moon(o.moonAt.x, o.moonAt.y, o.moonAt.r || 38);
    if (o.extraSky) astro += o.extraSky;
    if (astro) out.push(L(sv(astro), 0.02));
    if (o.clouds !== false) {
      let list = G.rain ? CLOUDS_RAIN : o.clouds || CLOUDS;
      if (G.night && !G.rain) list = list.slice(0, 2);
      out.push(L(K.cloudLayer(list, { night: G.night }), 0.04, 'drift'));
    }
    return out;
  }
  SC._skyLayers = skyLayers;

  /** relógio redondo de fachada (marca a hora do dia da cena) */
  function clockFace(x, y, r) {
    const t = { manha: [8, 5], dia: [12, 30], tarde: [17, 10], crepusculo: [18, 40], noite: [21, 15] }[K.GO.time] || [10, 10];
    const ha = ((t[0] % 12) / 12 + t[1] / 720) * K.TAU - Math.PI / 2, ma = (t[1] / 60) * K.TAU - Math.PI / 2;
    let b = K.disc(x, y, r, '#ffffff', { w: K.LM });
    b += S.circle(x, y, r * 0.78, c('#fffaf0'));
    for (let i = 0; i < 12; i += 3) { const a = (i / 12) * K.TAU; b += S.circle(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, Math.max(1.5, r * 0.07), ln('#ffffff', 0.6)); }
    b += K.seg(x, y, x + Math.cos(ha) * r * 0.42, y + Math.sin(ha) * r * 0.42, ln('#ffffff', 0.7), Math.max(2, r * 0.11));
    b += K.seg(x, y, x + Math.cos(ma) * r * 0.62, y + Math.sin(ma) * r * 0.62, ln('#ffffff', 0.7), Math.max(2, r * 0.08));
    return b;
  }
  /**
   * prédio principal da Academia Tracen visto de frente: alas com janelas em
   * arco, torre do relógio no meio e porta. (cx, y) = meio da base.
   */
  function academy(cx, y, s, o) {
    const q = o || {};
    const G = K.G;
    const lw = q.w || K.LM;
    const wall = '#fbefdc', roof = '#6aa698', door = '#7c9fb5';
    const w = 900 * s, h = 230 * s, x0 = cx - w / 2;
    const tw = 180 * s, th = 190 * s;
    const r = K.rand(q.seed || 3);
    let b = K.box(x0, y - h, w, h, wall, { w: lw });
    b += K.box(x0 - 14 * s, y - h - 24 * s, w + 28 * s, 30 * s, roof, { w: lw, r: 8 * s });
    const ww = 40 * s, wh = 62 * s;
    for (let row = 0; row < 2; row++) {
      const wy = y - h + 36 * s + row * 98 * s;
      for (let i = 0; i < 4; i++) {
        const dx = tw / 2 + 42 * s + i * 84 * s;
        b += K.win(cx - dx - ww, wy, ww, wh, { arch: true, lit: G.night && r() < 0.6, w: lw - 1, cross: 'v' });
        b += K.win(cx + dx, wy, ww, wh, { arch: true, lit: G.night && r() < 0.6, w: lw - 1, cross: 'v' });
      }
    }
    b += K.box(cx - tw / 2, y - h - th, tw, h + th, wall, { w: lw });
    b += K.shape(`M${f(cx - tw / 2 - 22 * s)},${f(y - h - th + 8 * s)} L${f(cx)},${f(y - h - th - 100 * s)} L${f(cx + tw / 2 + 22 * s)},${f(y - h - th + 8 * s)} Z`, roof, { w: lw });
    b += clockFace(cx, y - h - th + 72 * s, 40 * s);
    b += K.win(cx - 30 * s, y - h - 10 * s, 60 * s, 70 * s, { arch: true, lit: G.night, w: lw - 1, cross: 'v' });
    b += K.shape(K.archD(cx - 52 * s, y - 128 * s, 104 * s, 128 * s, 52 * s), door, { w: lw });
    b += K.seg(cx, y - 116 * s, cx, y - 2, ln(door, 0.5), 2);
    b += K.box(cx - 86 * s, y - 12 * s, 172 * s, 12 * s, '#e9e1d4', { w: lw - 1 });
    return b;
  }
  /** pilar de portão com lanterna em cima; (x, y) = meio da base */
  function gatePillar(x, y, s, plaque) {
    const stone = '#e9e3d8', lw = K.LW;
    let b = K.contact(x, y + 2, 60 * s, 8 * s);
    b += K.box(x - 36 * s, y - 300 * s, 72 * s, 300 * s, stone, { w: lw });
    b += K.box(x - 46 * s, y - 322 * s, 92 * s, 24 * s, stone, { w: lw, r: 4 * s });
    b += K.box(x - 42 * s, y - 24 * s, 84 * s, 24 * s, stone, { w: lw, r: 3 * s });
    b += K.lamp(x, y - 320 * s, 28 * s, { col: '#5d6b86' });
    if (plaque === 'latim') {
      // placa de bronze com o nome em letras
      b += K.sign(x, y - 248 * s, 68 * s, 64 * s, [{ t: 'ACADEMIA', size: 9 * s, ls: 0.5 }, { t: 'TRACEN', size: 15 * s }], { base: '#d9b46a', ink: ln('#d9b46a', 0.72), r: 3, inner: ln('#d9b46a', 0.3) });
      b += K.ICONS.ferradura(x, y - 160 * s, 13 * s, '#d9b46a');
    } else if (plaque) {
      b += K.box(x - 24 * s, y - 250 * s, 48 * s, 150 * s, '#f1dfb4', { w: K.LM, r: 3 });
      const chars = ['ト', 'レ', 'セ', 'ン', '学', '園'];
      chars.forEach((ch, i) => { b += K.txt(x, y - 224 * s + i * 22 * s + 6, ch, { fill: ln('#f1dfb4', 0.75), size: Math.round(18 * s), font: 'jp' }); });
    }
    return b;
  }
  /** grade de ferro baixa (de x0 a x1), com pontas */
  function ironFence(x0, x1, y, h) {
    const col = '#66788a';
    let bars = '';
    for (let x = x0; x <= x1; x += 26) bars += `M${f(x)},${f(y)} L${f(x)},${f(y - h)}`;
    let b = K.line(bars, ln(col, 0.35), 8) + K.line(bars, c(col), 4);
    b += K.box(x0 - 6, y - h * 0.82, x1 - x0 + 12, 8, col, { w: 2, r: 3 }) + K.box(x0 - 6, y - h * 0.3, x1 - x0 + 12, 8, col, { w: 2, r: 3 });
    for (let x = x0; x <= x1; x += 26) b += S.path(`M${f(x - 6)},${f(y - h + 2)} L${f(x)},${f(y - h - 12)} L${f(x + 6)},${f(y - h + 2)} Z`, c(col));
    return b;
  }

  /* ------------------------------------------------------ portão da escola */
  SC.portao = function () {
    const G = K.G;
    const HZ = 600;
    const layers = skyLayers({ horizon: HZ, clouds: [[220, 210, 270], [1720, 150, 230], [1200, 90, 150]] });
    // fundo: gramado, prédio da escola e cerejeiras ao longe
    let far = K.ground(HZ, '#b7de96', { w: K.LF });
    far += K.treeRow(31, -80, 520, HZ + 14, 3, 0.62, 0.78, 'sakura', { w: K.LF });
    far += K.treeRow(32, 1400, 2000, HZ + 14, 3, 0.62, 0.78, 'sakura', { w: K.LF });
    far += academy(960, HZ + 8, 0.92);
    for (const [x0, x1] of [[150, 880], [1040, 1770]]) {
      for (let x = x0; x < x1; x += 120) far += K.bush(x + 60, HZ + 34, 128, 46, K.LEAF.escuro, { w: K.LF, seed: x });
    }
    layers.push(L(sv(far), 0.05));
    // meio: caminho, grade e pilares do portão
    const pv = '#efe2cc';
    let mid = K.shape(`M${f(880)},${f(HZ + 30)} L${f(1040)},${f(HZ + 30)} L${f(1330)},${f(H + 20)} L${f(590)},${f(H + 20)} Z`, pv, { w: K.LM });
    for (const t of [0.18, 0.4, 0.66]) {
      const y = HZ + 30 + (H - HZ - 30) * t, half = 80 + (370 - 80) * t;
      mid += K.seg(960 - half, y, 960 + half, y, ln(pv, 0.25), 2);
    }
    mid += ironFence(-20, 280, 720, 150) + ironFence(1640, 1940, 720, 150);
    mid += gatePillar(330, 730, 1, true) + gatePillar(1590, 730, 1, 'latim');
    // abril: a placa da cerimônia de entrada, como nos portões das escolas japonesas
    mid += K.contact(490, 742, 80, 8);
    mid += K.sign(490, 392, 124, 312, [{ t: '入', font: 'jp', size: 46 }, { t: '学', font: 'jp', size: 46 }, { t: '式', font: 'jp', size: 46 }, { t: 'CERIMÔNIA', size: 13, ls: 0.5 }, { t: 'DE ENTRADA', size: 13, ls: 0.5 }], { base: '#ffffff', ink: c('#3b3346'), posts: 34, post: '#b39b84', r: 4, inner: ln('#ffffff', 0.2) });
    mid += S.path(`M${f(434)},${f(392)} q22,-26 56,-10 q34,-16 56,10 Z`, c('#f2a3b8')) + K.line(`M${f(434)},${f(392)} q22,-26 56,-10 q34,-16 56,10`, ln('#f2a3b8', 0.4), 2);
    layers.push(L(sv(mid), 0.12));
    // perto: duas cerejeiras emoldurando e pétalas no chão
    // as copas ficam afastadas das lanternas dos pilares (x 330 e 1590)
    let near = K.tree(64, 860, 1.5, { kind: 'sakura', trunk: 250, R: 118, seed: 21, lean: -8 });
    near += K.tree(1856, 860, 1.5, { kind: 'sakura', trunk: 250, R: 118, seed: 22, lean: 8 });
    if (!G.snow) {
      const r = K.rand(9);
      for (let i = 0; i < 26; i++) {
        const x = 200 + r() * 1520, y = 660 + r() * 140;
        near += S.ellipse(x, y, 5 + r() * 3, 3 + r() * 1.5, c('#f7c5d4'), `transform="rotate(${f(r() * 180)} ${f(x)} ${f(y)})"`);
      }
    }
    layers.push(L(sv(near), 0.25));
    return { layers, particles: wx('petals'), amb: ambOut('passaros') };
  };

  /* ------------------------------------------- pátio da fonte das Três Deusas */
  function fountain(x, y, s) {
    const stone = '#ebe3d6', water = '#a6d8ee', lw = K.LW;
    const G = K.G;
    let b = K.contact(x, y + 6 * s, 270 * s, 18 * s);
    // tanque de baixo: borda da frente e água
    b += K.shape(`M${f(x - 250 * s)},${f(y - 30 * s)} L${f(x - 250 * s)},${f(y)} Q${f(x)},${f(y + 46 * s)} ${f(x + 250 * s)},${f(y)} L${f(x + 250 * s)},${f(y - 30 * s)} Z`, stone, { w: lw });
    b += K.oval(x, y - 30 * s, 250 * s, 44 * s, stone, { w: lw });
    b += S.ellipse(x, y - 30 * s, 226 * s, 33 * s, c(G.snow ? '#e7eef6' : water));
    if (!G.snow) b += K.line(`M${f(x - 150 * s)},${f(y - 30 * s)} q${f(20 * s)},${f(-6 * s)} ${f(40 * s)},0 M${f(x + 90 * s)},${f(y - 22 * s)} q${f(20 * s)},${f(-6 * s)} ${f(40 * s)},0`, '#ffffff', 3, 'opacity=".8"');
    // coluna e duas taças
    b += K.box(x - 22 * s, y - 250 * s, 44 * s, 222 * s, stone, { w: lw, r: 6 * s });
    for (const [ty, tr] of [[-240, 136], [-350, 78]]) {
      const yy = y + ty * s, rr = tr * s;
      b += K.shape(`M${f(x - rr)},${f(yy)} Q${f(x - rr * 0.5)},${f(yy + rr * 0.42)} ${f(x)},${f(yy + rr * 0.44)} Q${f(x + rr * 0.5)},${f(yy + rr * 0.42)} ${f(x + rr)},${f(yy)} Z`, stone, { w: lw });
      b += K.oval(x, yy, rr, rr * 0.16, stone, { w: lw });
      b += S.ellipse(x, yy, rr * 0.86, rr * 0.1, c(G.snow ? '#e7eef6' : water));
    }
    b += K.box(x - 14 * s, y - 470 * s, 28 * s, 120 * s, stone, { w: lw, r: 5 * s });
    // enfeite do topo: três folhas de pedra (as Três Deusas)
    let leaves = '';
    for (const a of [-0.55, 0, 0.55]) {
      const ex = x + Math.sin(a) * 52 * s, ey = y - 470 * s - Math.cos(a) * 60 * s;
      leaves += P.p(`M${f(x)},${f(y - 462 * s)} Q${f((x + ex) / 2 - 18 * s)},${f((y - 462 * s + ey) / 2)} ${f(ex)},${f(ey)} Q${f((x + ex) / 2 + 18 * s)},${f((y - 462 * s + ey) / 2)} ${f(x)},${f(y - 462 * s)} Z`);
    }
    b += K.union(leaves, stone, { w: lw, off: [0, -4 * s] });
    b += K.disc(x, y - 462 * s, 12 * s, stone, { w: lw });
    // plaquinha na borda do tanque
    b += K.sign(x, y - 20 * s, 196 * s, 46 * s, [{ t: '三女神', font: 'jp', size: 21 * s }, { t: 'AS TRÊS DEUSAS', size: 11 * s, ls: 1 }], { base: '#d9cfbd', ink: ln('#d9cfbd', 0.7), r: 6 * s, inner: ln('#d9cfbd', 0.25) });
    // água caindo das taças
    if (!G.snow) {
      let arcs = '';
      for (const sx of [-1, 1]) {
        arcs += `M${f(x + sx * 76 * s)},${f(y - 348 * s)} Q${f(x + sx * 110 * s)},${f(y - 330 * s)} ${f(x + sx * 112 * s)},${f(y - 248 * s)}`;
        arcs += `M${f(x + sx * 134 * s)},${f(y - 238 * s)} Q${f(x + sx * 196 * s)},${f(y - 214 * s)} ${f(x + sx * 200 * s)},${f(y - 40 * s)}`;
      }
      b += K.line(arcs, ln(water, 0.3), 9) + K.line(arcs, c(water), 5);
    }
    return b;
  }
  /** placa em forma de seta (dir = 1 aponta para a direita) */
  function arrowSign(x, y, w, h, dir, lines, base) {
    const tip = 22, x0 = dir > 0 ? x : x - w, x1 = dir > 0 ? x + w : x;
    const d = dir > 0
      ? `M${f(x0)},${f(y)} L${f(x1 - tip)},${f(y)} L${f(x1)},${f(y + h / 2)} L${f(x1 - tip)},${f(y + h)} L${f(x0)},${f(y + h)} Z`
      : `M${f(x1)},${f(y)} L${f(x0 + tip)},${f(y)} L${f(x0)},${f(y + h / 2)} L${f(x0 + tip)},${f(y + h)} L${f(x1)},${f(y + h)} Z`;
    let b = K.shape(d, base, { w: K.LM });
    const cx = (x0 + x1) / 2 - (dir > 0 ? tip / 3 : -tip / 3);
    const L = [].concat(lines);
    L.forEach((t, i) => { b += K.txt(cx, y + h / 2 + (i - (L.length - 1) / 2) * 15 + (i === 0 ? 6 : 4), t, { size: i === 0 ? 17 : 12, fill: ln(base, 0.78) }); });
    return b;
  }
  SC.fonte = function () {
    const G = K.G;
    const HZ = 590;
    const layers = skyLayers({ horizon: HZ, clouds: [[260, 190, 290], [1600, 130, 230]] });
    // fundo: ala da escola à esquerda, árvores à direita
    const pave = '#ece2d2';
    let far = K.ground(HZ, K.groundCol(pave), { w: K.LF });
    far += K.treeRow(41, 940, 2000, HZ + 10, 5, 0.6, 0.8, 'verde', { w: K.LF });
    const wall = '#fbefdc', roof = '#6aa698';
    far += K.box(-30, HZ - 270, 1000, 278, wall, { w: K.LM });
    far += K.box(-40, HZ - 292, 1020, 28, roof, { w: K.LM, r: 8 });
    far += K.windows(40, HZ - 236, 9, 2, 54, 72, 50, 44, { arch: true, cross: 'v', lit: G.night ? 0.6 : false, seed: 6 });
    for (let x = 30; x < 1880; x += 132) far += K.bush(x + 60, HZ + 36, 140, 50, K.LEAF.escuro, { w: K.LF, seed: x + 3 });
    layers.push(L(sv(far), 0.05));
    // meio: piso em anéis e a fonte
    let mid = '';
    for (const [rx, ry] of [[560, 120], [400, 86]]) mid += `<ellipse cx="1330" cy="772" rx="${rx}" ry="${ry}" fill="none"${K.ST(ln(pave, 0.22), 2)}/>`;
    mid += fountain(1330, 770, 1);
    layers.push(L(sv(mid), 0.12));
    // perto: poste, banco e canteiro à esquerda
    let near = K.lamp(150, 880, 330);
    // poste de direções: pista, refeitório e os dois dormitórios
    near += K.box(354, 596, 12, 284, '#9a8574', { w: K.LM, r: 3 }) + K.contact(360, 882, 40, 6);
    near += arrowSign(360, 604, 184, 42, 1, 'PISTA DE TREINO', '#f6e7c8');
    near += arrowSign(360, 656, 168, 42, -1, 'REFEITÓRIO', '#dcebd6');
    near += arrowSign(360, 708, 184, 52, 1, ['DORMITÓRIOS', 'Miho · Ritto'], '#e6dcf2');
    near += K.bench(640, 846, 220);
    near += K.bush(830, 874, 150, 60, K.LEAF.verde, { seed: 4 });
    if (!G.snow) near += K.flowers(7, 770, 890, 820, 850, 5, ['#f6a7b8', '#ffffff', '#f9d36b']);
    layers.push(L(sv(near), 0.22));
    return { layers, particles: wx('none'), amb: G.rain ? 'chuva' : 'fonte' };
  };

  /* -------------------------------------------------- pista de treino */
  function floodlight(x, y, h) {
    const G = K.G;
    const col = '#8a97ab';
    let b = K.box(x - 7, y - h, 14, h, col, { w: K.LM, r: 3 });
    for (let k = 1; k < 6; k++) b += K.seg(x - 7, y - h + (k * h) / 6, x + 7, y - h + (k * h) / 6 - 14, ln(col, 0.4), 2);
    b += K.box(x - 62, y - h - 60, 124, 66, col, { w: K.LM, r: 6 });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
      const on = G.night || G.rain;
      b += K.disc(x - 38 + i * 38, y - h - 40 + j * 28, 11, on ? K.LIT : '#eef3f8', { w: 2, f: on ? K.LIT : c('#eef3f8'), l: on ? K.LIT_LINE : ln('#eef3f8', 0.4) });
    }
    return b;
  }
  /** arquibancada coberta de treino, vista de frente: degraus de concreto com
   *  bancos azuis, dois pilares e a cobertura; (x0..x1, base y) */
  function bleachers(x0, x1, y, top) {
    const roof = '#6aa698', post = '#9aa7b8', conc = '#e3e7ee', seat = '#8fb7e0';
    const body = top + 44, rows = 5, rh = (y - body - 22) / rows;
    let b = K.box(x0, body, x1 - x0, y - body, conc, { w: K.LM });
    for (let i = 0; i < rows; i++) {
      const ry = body + i * rh;
      if (i) b += K.seg(x0 + 2, ry, x1 - 2, ry, ln(conc, 0.3), 2);
      b += K.box(x0 + 16, ry + rh * 0.34, x1 - x0 - 32, rh * 0.34, seat, { w: 2, r: 4 });
    }
    b += K.box(x0 - 6, y - 22, x1 - x0 + 12, 22, '#cfd6e0', { w: K.LM, r: 3 });
    for (const x of [x0 + 14, x1 - 14]) b += K.box(x - 7, top + 20, 14, y - top - 20, post, { w: K.LM, r: 3 });
    b += K.box(x0 - 24, top, x1 - x0 + 48, 26, roof, { w: K.LM, r: 8 });
    return b;
  }
  SC.pista = function () {
    const G = K.G;
    const HZ = 476;
    const vega = G.night && !G.rain ? S.path(K.starD(430, 150, 17), '#fff4c8') + K.line(K.starD(430, 150, 17), '#e5cf8f', 2) : '';
    const layers = skyLayers({ horizon: HZ, moon: false, extraSky: vega, clouds: [[300, 230, 280], [1620, 150, 230], [1060, 100, 160]] });
    // fundo: árvores, prédio da escola, refletores e arquibancada
    let far = K.ground(HZ, '#a9d98c', { w: K.LF });
    far += K.treeRow(51, -80, 2000, HZ + 8, 12, 0.56, 0.76, 'escuro', { w: K.LF });
    far += academy(1540, HZ + 4, 0.54, { w: K.LF });
    far += floodlight(96, HZ + 2, 330) + floodlight(1840, HZ + 2, 330);
    far += bleachers(150, 760, HZ + 4, 290);
    // placar eletrônico em cima da arquibancada
    far += K.sign(455, 168, 300, 104, [{ t: 'TREINO · 1000 m', size: 17, fill: '#9fe3b0', ls: 1 }, { t: '1:02.4', size: 46, font: 'jp', fill: '#ffd47e' }], { base: '#3a3f52', posts: 20, post: '#8d98aa', r: 8 });
    layers.push(L(sv(far), 0.05));
    // meio: cerca do outro lado, areia, gramado de dentro e a pista da frente
    const dirt = K.groundCol('#e8c79d'), turf = K.groundCol('#a8d98a');
    let mid = S.rect(-40, HZ + 6, W + 80, 34, c(dirt)) + S.rect(-40, HZ + 40, W + 80, 92, c(turf));
    mid += S.rect(-40, HZ + 64, W + 80, 26, c(K.mix(turf, '#ffffff', 0.12)));
    mid += K.seg(-40, HZ + 40, W + 40, HZ + 40, ln(turf, 0.3), 2) + K.seg(-40, HZ + 132, W + 40, HZ + 132, ln(turf, 0.35), K.LM);
    mid += S.rect(-40, HZ + 132, W + 80, H, c(dirt));
    mid += K.rail(-40, W + 40, HZ - 10, 22, { w: K.LF, pw: 6, rh: 7, every: 80, single: true });
    mid += K.sign(1370, HZ - 4, 360, 30, [{ t: 'PISTA DE TREINO Nº 1 · ACADEMIA TRACEN', size: 15, ls: 1 }], { base: '#6aa698', ink: '#ffffff', r: 4, w: K.LF });
    if (G.rain) for (const [px, py, pr] of [[420, 690, 70], [1180, 660, 54], [1580, 712, 80]]) mid += S.ellipse(px, py, pr, pr * 0.16, c(K.mix(dirt, '#9fb2c8', 0.5)));
    else mid += K.line('M-40,650 L1960,650 M-40,690 L1960,690', ln(dirt, 0.18), 2);
    layers.push(L(sv(mid), 0.1));
    // perto: a cerca do lado de cá e a grama
    let near = K.ground(742, '#b2db94', { w: K.LM }) + K.tufts(5, 0, W, 790, 1060, 40, K.groundCol('#b2db94'));
    near += K.rail(-40, W + 40, 672, 92, { every: 210, start: 90 });
    near += K.distPost(1740, 790, '400', 0.85);
    // quadro branco com o treino do dia, num cavalete
    near += K.contact(330, 852, 120, 9);
    for (const lx of [250, 410]) near += K.box(lx - 6, 640, 12, 212, '#a9b4c3', { w: K.LM, r: 3 });
    near += K.box(214, 520, 232, 156, '#ffffff', { w: K.LM, r: 6 }) + K.box(220, 668, 220, 10, '#c9d1dc', { w: 2, r: 3 });
    near += K.txt(330, 552, 'TREINO DE HOJE', { size: 16, fill: c('#e0675f'), ls: 1 });
    near += K.txt(330, 592, '3 × 1000 m', { size: 30, fill: c('#3e5b9a'), font: 'hand' }) + K.txt(330, 624, 'descanso: 2 min', { size: 24, fill: c('#3e5b9a'), font: 'hand' }) + K.txt(330, 654, 'ritmo 13s / 200 m', { size: 22, fill: c('#3e5b9a'), font: 'hand' });
    layers.push(L(sv(near), 0.18));
    return { layers, particles: wx(G.night ? 'none' : 'leaves'), amb: ambOut('vento') };
  };

  /* ------------------------------------------------------ terraço da escola */
  SC.terraco = function () {
    const G = K.G;
    const HZ = 600;
    const layers = skyLayers({ horizon: HZ, sunAt: { x: 1340, y: 130, r: 46 }, clouds: [[260, 220, 300], [1700, 170, 250], [900, 110, 160]] });
    // fundo: cidade bem clarinha lá embaixo
    const r = K.rand(61);
    let far = K.hills(62, HZ - 70, 50, '#a9c7c0', { w: 0 });
    for (let x = -20; x < W + 20;) {
      const w = 90 + r() * 110, h = 70 + r() * 140;
      const col = ['#c9d6e6', '#d8d2e6', '#cfe0d9', '#e2d6cc'][Math.floor(r() * 4)];
      far += K.box(x, HZ + 30 - h, w, h + 40, col, { w: K.LF, r: 4 });
      if (G.night) for (let wy = HZ + 50 - h; wy < HZ + 20; wy += 30) for (let wxx = x + 14; wxx < x + w - 20; wxx += 26) if (r() < 0.45) far += S.rect(wxx, wy, 12, 14, K.LIT, 'rx="2"');
      x += w + 6 + r() * 18;
    }
    layers.push(L(sv(far), 0.04));
    // meio: mureta com grade e o chão de concreto
    const conc = K.groundCol('#e1e3e8'), metal = '#a9c4d6';
    let mid = S.rect(-40, 700, W + 80, H, c(conc));
    for (const t of [0.12, 0.34, 0.68]) mid += K.seg(-40, 700 + 380 * t, W + 40, 700 + 380 * t, ln(conc, 0.2), 2);
    mid += K.box(-40, 624, W + 80, 78, '#d9dce3', { w: K.LM });
    mid += K.seg(-40, 702, W + 40, 702, ln(conc, 0.45), K.LM);
    for (let x = 60; x < W; x += 190) mid += K.box(x - 6, 450, 12, 176, metal, { w: K.LM, r: 3 });
    mid += K.box(-40, 444, W + 80, 14, metal, { w: K.LM, r: 7 }) + K.box(-40, 536, W + 80, 10, metal, { w: K.LM, r: 5 });
    mid += K.sign(725, 462, 156, 60, [{ t: 'PROIBIDO', size: 16 }, { t: 'SUBIR NA GRADE', size: 12 }], { base: '#ffffff', ink: c('#d0453f'), inner: c('#ec9a94'), r: 4, hang: 10 });
    layers.push(L(sv(mid), 0.1));
    // perto: casinha da escada à esquerda e caixa d'água à direita
    const wall = '#ecebe6';
    let near = K.box(-40, 250, 370, 470, wall, { w: K.LW });
    near += K.box(-50, 230, 390, 30, '#cfd4dc', { w: K.LW, r: 6 });
    near += K.sign(188, 330, 132, 42, [{ t: '↓ ESCADA', size: 19 }], { base: '#4fae7c', ink: '#ffffff', r: 6 });
    near += K.box(118, 466, 140, 254, '#9fb8cb', { w: K.LW, r: 6 });
    near += K.win(150, 500, 76, 70, { w: K.LM, cross: false, glass: '#cfe6f2' });
    near += K.disc(236, 600, 7, '#e9eef3', { w: 2 });
    // arandela sobre a porta (acesa à noite)
    const on = G.night || G.rain;
    near += K.box(176, 408, 24, 12, '#7f8ea3', { w: K.LM, r: 3 });
    near += K.shape('M170,420 L206,420 L200,452 L176,452 Z', '#eef3f8', { w: K.LM, f: on ? K.LIT : c('#eef3f8'), l: on ? K.LIT_LINE : ln('#eef3f8') });
    const tank = '#dbe7ef';
    for (const lx of [1590, 1690, 1790]) near += K.box(lx - 7, 520, 14, 190, '#a7b6c6', { w: K.LM, r: 3 });
    near += K.box(1556, 504, 270, 22, '#a7b6c6', { w: K.LM, r: 4 });
    near += K.box(1570, 300, 242, 210, tank, { w: K.LW, r: 30 });
    near += K.seg(1574, 360, 1808, 360, ln(tank, 0.3), 2) + K.seg(1574, 450, 1808, 450, ln(tank, 0.3), 2);
    near += K.txt(1691, 420, 'TRACEN', { size: 34, fill: ln(tank, 0.3), ls: 3 });
    near += K.contact(1690, 712, 170, 12);
    layers.push(L(sv(near), 0.2));
    return { layers, particles: wx('none'), amb: G.rain ? 'chuva' : 'vento' };
  };

  /* -------------------------------------------- colina atrás da escola */
  SC.colina = function (o) {
    const G = K.G;
    const con = o.v === 'constelacao';
    const HZ = 660;
    let extra = '';
    if (con && G.night && !G.rain) {
      // Triângulo de Verão: Vega (a mais brilhante, um pouco à direita), Deneb e Altair, e a Lira
      const vega = [1190, 196], deneb = [1470, 110], altair = [1380, 440];
      const lyra = [[1226, 250], [1252, 312], [1300, 300], [1272, 238]];
      extra += K.line(`M${vega} L${deneb} L${altair} Z`, '#fff1c8', 2, 'opacity=".45" stroke-dasharray="3 12"');
      extra += K.line(`M${vega} L${lyra[0]} L${lyra[1]} L${lyra[2]} L${lyra[3]} L${lyra[0]}`, '#fff1c8', 2, 'opacity=".6"');
      for (const p of lyra) extra += S.path(K.twinkleD(p[0], p[1], 7), '#fff6d6');
      extra += S.path(K.starD(deneb[0], deneb[1], 12), '#fff6d6') + S.path(K.starD(altair[0], altair[1], 13), '#fff6d6');
      extra += S.path(K.starD(vega[0], vega[1], 19), '#fff4c4') + K.line(K.starD(vega[0], vega[1], 19), '#e6cf8c', 2);
    }
    const layers = skyLayers({ horizon: HZ, stars: 150, starY1: 600, moonAt: con ? null : { x: 360, y: 170, r: 36 }, extraSky: extra, clouds: con ? false : [[300, 260, 240], [1640, 330, 200]] });
    // fundo: serra e a cidade com o festival lá embaixo (luzinhas à noite)
    let far = K.hills(71, HZ - 10, 50, '#8fb79a', { w: K.LF, n: 4 });
    if (G.night) {
      const r = K.rand(72);
      for (let i = 0; i < 70; i++) {
        const x = 1280 + r() * 560, y = HZ + 6 + r() * 34;
        far += S.circle(x, y, 2 + r() * 2.2, i % 5 ? K.LIT : '#ffb3a6');
      }
    }
    layers.push(L(sv(far), 0.04));
    // meio: o morro de grama
    const grass = K.groundCol('#a3d58f');
    const top = K.smooth([[-40, 790], [380, 712], [980, 700], [1500, 732], [1960, 800]]);
    let mid = S.path(`${top} L1960,${H + 20} L-40,${H + 20} Z`, c(grass)) + K.line(top, ln(grass, 0.4), K.LM);
    mid += K.tufts(73, 60, 1860, 760, 1060, 34, grass);
    if (!G.night && !G.snow) mid += K.flowers(74, 120, 1800, 780, 900, 14, ['#ffffff', '#f6c3d0', '#fbe08a']);
    mid += K.contact(486, 734, 40, 6) + K.sign(486, 622, 160, 54, [{ t: 'MIRANTE', size: 20, ls: 1 }, { t: '← academia 1 km', size: 12 }], { base: '#c79a6c', ink: '#5a3d2a', pole: 100, post: '#9a7556', r: 5 });
    layers.push(L(sv(mid), 0.12));
    // perto: uma árvore sozinha na encosta
    layers.push(L(sv(K.tree(250, 726, 1.05, { kind: 'escuro', seed: 75, trunk: 130 })), 0.2));
    return { layers, particles: wx('none'), amb: ambOut('vento') };
  };

  /* ------------------------------------------------ beira do rio (extra) */
  function moonPath(x, y0, y1, red) {
    let b = '';
    const col = red ? '#e86a63' : '#fff1c2';
    for (let yy = y0, i = 0; yy < y1; yy += 14, i++) {
      const w = 26 + (yy - y0) * 0.55 + (i % 2) * 14;
      b += S.rect(x - w / 2 + (i % 3 - 1) * 8, yy, w, 4, col, `rx="2" opacity="${f(0.85 - ((yy - y0) / (y1 - y0)) * 0.4)}"`);
    }
    return b;
  }
  /** noite de lua vermelha: tudo puxa para o vinho */
  function redNight() {
    const G = K.G;
    G.sky = [['0', '#22091d'], ['.6', '#4c142c'], ['1', '#7a2338']];
    G.hor = '#7a2338';
    G.mixes = [['#7a2038', 0.34]];
    G.mul = [0.7, 0.45, 0.52];
    G.desat = 0.2; G.ink = '#1c0711'; G.shade = '#3d0f23'; G.cloud = '#5a2236';
  }
  SC.rio = function (o) {
    const G = K.G;
    const red = o.v === 'lua_vermelha' && G.night;
    const moonOn = (o.v === 'lua' || red) && G.night && !G.rain;
    if (red) redNight();
    const HZ = 570;
    const mx = 1320, my = 260, mr = red ? 80 : 64;
    const layers = skyLayers({ horizon: HZ, extraSky: moonOn ? K.moon(mx, my, mr, red) : '', clouds: [[240, 230, 260], [1700, 170, 220]] });
    // fundo: cidade do outro lado e a ponte
    const r = K.rand(81);
    let far = '';
    for (let x = -20; x < W + 20;) {
      const w = 80 + r() * 120, h = 50 + r() * 120;
      far += K.box(x, HZ - h, w, h + 20, ['#cdd7e6', '#ddd6e8', '#d3e3da'][Math.floor(r() * 3)], { w: K.LF, r: 4 });
      if (G.night) for (let wy = HZ - h + 16; wy < HZ - 10; wy += 26) for (let wxx = x + 12; wxx < x + w - 16; wxx += 22) if (r() < 0.4) far += S.rect(wxx, wy, 10, 12, red ? '#ff9a7a' : K.LIT, 'rx="2"');
      x += w + 8 + r() * 20;
    }
    const br = '#d9dce6';
    far += K.box(-40, 520, W + 80, 26, br, { w: K.LM, r: 4 });
    for (let x = 120; x < W; x += 420) far += K.shape(`M${f(x)},${f(546)} L${f(x)},${f(600)} L${f(x + 50)},${f(600)} L${f(x + 50)},${f(546)} Z`, br, { w: K.LM });
    far += K.ground(HZ + 14, '#a6d28e', { w: K.LF });
    layers.push(L(sv(far), 0.04));
    // meio: o rio
    const water = '#8cc7e3';
    let mid = S.rect(-40, 610, W + 80, 110, c(water)) + K.seg(-40, 610, W + 40, 610, ln(water, 0.35), K.LM);
    mid += K.line('M180,650 q30,-8 60,0 M640,690 q30,-8 60,0 M1060,640 q30,-8 60,0 M1500,680 q30,-8 60,0', K.mix(c(water), '#ffffff', 0.5), 3);
    if (moonOn) mid += moonPath(mx, 616, 716, red);
    layers.push(L(sv(mid), 0.08));
    // perto: a margem de grama e o caminho
    const grass = K.groundCol('#acd890');
    let near = K.ground(718, grass, { w: K.LM }) + K.tufts(82, 0, W, 760, 1060, 34, grass);
    near += K.shape('M-40,800 L1960,770 L1960,830 L-40,860 Z', '#e6dfd0', { w: K.LM });
    near += K.lamp(1640, 800, 300);
    near += K.contact(300, 800, 40, 6) + K.sign(300, 686, 170, 66, [{ t: '多摩川', font: 'jp', size: 24 }, { t: 'RIO TAMA', size: 14, ls: 2 }], { base: '#4f7fbf', ink: '#ffffff', pole: 112, r: 6 });
    layers.push(L(sv(near), 0.16));
    return { layers, particles: wx('none'), amb: G.rain ? 'chuva' : 'rio', light: red ? 'vermelho' : undefined };
  };

  /* ----------------------------------------------------------- praia */
  function sandCastle(x, y, s) {
    const sand = '#ecd29c', lw = K.LM;
    let b = K.contact(x, y + 4, 150 * s, 12 * s);
    const crenel = (cx, top, w) => { let d = ''; for (let i = 0; i < 3; i++) d += K.box(cx - w / 2 + i * (w / 3) + 2, top - 12 * s, w / 3 - 6, 14 * s, sand, { w: 2, r: 2 }); return d; };
    b += K.box(x - 130 * s, y - 70 * s, 260 * s, 70 * s, sand, { w: lw, r: 6 * s });
    for (const tx of [-110, 110]) { b += crenel(x + tx * s, y - 120 * s, 50 * s) + K.box(x + (tx - 25) * s, y - 120 * s, 50 * s, 120 * s, sand, { w: lw, r: 4 * s }); }
    b += crenel(x, y - 230 * s, 60 * s) + K.box(x - 30 * s, y - 230 * s, 60 * s, 230 * s, sand, { w: lw, r: 4 * s });
    b += K.seg(x, y - 242 * s, x, y - 290 * s, ln('#8a6a55'), 3);
    b += K.shape(`M${f(x)},${f(y - 290 * s)} L${f(x + 34 * s)},${f(y - 278 * s)} L${f(x)},${f(y - 266 * s)} Z`, '#ef7d76', { w: 2 });
    b += K.shape(K.archD(x - 18 * s, y - 52 * s, 36 * s, 52 * s, 18 * s), '#9c7d5e', { w: lw });
    b += K.shape(`M${f(x - 20 * s)},${f(y)} L${f(x + 20 * s)},${f(y)} L${f(x + 34 * s)},${f(y + 26 * s)} L${f(x - 34 * s)},${f(y + 26 * s)} Z`, '#c49a6c', { w: 2 });
    for (const wx2 of [-110, 110]) b += K.win(x + wx2 * s - 9 * s, y - 92 * s, 18 * s, 24 * s, { cross: false, glass: '#9c7d5e', frame: sand, w: 2, m: 3 });
    return b;
  }
  SC.praia = function (o) {
    const G = K.G;
    const red = o.v === 'lua_vermelha' && G.night;
    const moonOn = (o.v === 'lua' || red) && G.night && !G.rain;
    if (red) redNight();
    const HZ = 560;
    const mx = 1300, my = red ? 300 : 290, mr = red ? 86 : 70;
    const sunAt = G.time === 'tarde' ? { x: 1240, y: 476, r: 66 } : undefined;
    const layers = skyLayers({ horizon: HZ, sunAt, extraSky: moonOn ? K.moon(mx, my, mr, red) : '', clouds: [[260, 210, 280], [1700, 150, 230]] });
    // fundo: o mar e uma ilhota
    const sea = '#7fc4e4';
    let far = S.rect(-40, HZ, W + 80, 170, c(sea)) + S.rect(-40, HZ, W + 80, 46, c(K.mix(sea, '#ffffff', 0.18)));
    far += K.seg(-40, HZ, W + 40, HZ, ln(sea, 0.4), K.LM);
    far += K.shape(`M1440,${HZ} Q1520,${HZ - 52} 1610,${HZ - 40} Q1690,${HZ - 64} 1780,${HZ} Z`, '#8db7a6', { w: K.LF });
    far += K.line('M220,620 q24,-8 48,0 M700,660 q24,-8 48,0 M1030,610 q24,-8 48,0 M1560,640 q24,-8 48,0 M420,690 q24,-8 48,0', K.mix(c(sea), '#ffffff', 0.55), 3);
    if (moonOn) far += moonPath(mx, HZ + 8, 712, red);
    else if (sunAt && !G.rain) far += moonPath(sunAt.x, HZ + 8, 700, false).replace(/#fff1c2/g, '#ffe4b0');
    layers.push(L(sv(far), 0.04));
    // meio: espuma e areia
    const sand = K.groundCol('#f5e2b8');
    const foam = K.smooth([[-40, 716], [200, 708], [420, 720], [700, 706], [980, 718], [1260, 704], [1540, 718], [1800, 708], [1960, 716]]);
    let mid = S.rect(-40, 712, W + 80, H, c(sand));
    mid += S.path(`${foam} L1960,740 L-40,740 Z`, c('#ffffff')) + K.line(foam, ln('#ffffff', 0.35), K.LM);
    mid += K.seg(-40, 740, W + 40, 740, ln(sand, 0.3), 2);
    if (!G.night) {
      const r = K.rand(91);
      for (let i = 0; i < 6; i++) { const x = 300 + r() * 1400, y = 800 + r() * 200; mid += S.path(`M${f(x - 7)},${f(y)} Q${f(x)},${f(y - 12)} ${f(x + 7)},${f(y)} Z`, c(i % 2 ? '#f6c9c0' : '#fff2e6'), `stroke="${ln('#f6c9c0', 0.3)}" stroke-width="2"`); }
    }
    layers.push(L(sv(mid), 0.1));
    // perto: pinheiro de praia à esquerda, pedras à direita e o castelo de areia
    let near = K.pine(150, 860, 1.25);
    near += K.contact(1760, 800, 230, 14) + K.rock(1700, 790, 230, 120) + K.rock(1860, 800, 170, 150, '#a9a6b8') + K.rock(1590, 806, 110, 56);
    if (!G.night && !G.rain) near += sandCastle(520, 806, 0.95);
    near += K.contact(1420, 790, 90, 8) + K.sign(1420, 664, 196, 66, [{ t: 'ÁREA DE BANHO', size: 17, ls: 1 }, { t: 'das 9h às 17h', size: 13 }], { base: '#ffffff', ink: c('#3f86c9'), inner: c('#9cc9ee'), posts: 62, post: '#c9a27a', r: 5 });
    layers.push(L(sv(near), 0.2));
    return { layers, particles: wx('none'), amb: 'mar', light: red ? 'vermelho' : undefined };
  };

  /* ------------------------------------------------------- hipódromo */
  /** mastro com bandeirinha; (x, y) = pé do mastro (em cima da cobertura) */
  function flagPole(x, y, h, col) {
    let b = K.seg(x, y, x, y - h, ln('#9aa4b3'), 3);
    b += `<g class="flag">${K.shape(`M${f(x)},${f(y - h)} L${f(x + 46)},${f(y - h + 12)} L${f(x)},${f(y - h + 26)} Z`, col, { w: 2 })}</g>`;
    return b;
  }
  /** arquibancada grande de concreto e vidro (sem público) */
  function grandstand(x0, x1, y) {
    const G = K.G;
    const roof = '#6f9fc4', body = '#eef1f5';
    let b = K.box(x0, y - 300, x1 - x0, 300, body, { w: K.LM });
    // fileiras de assentos (dois andares) e a faixa de vidro do meio
    for (let i = 0; i < 4; i++) b += K.box(x0 + 16, y - 278 + i * 24, x1 - x0 - 32, 16, i % 2 ? '#7fb1dc' : '#9cc3e6', { w: 2, r: 3 });
    b += K.box(x0 + 10, y - 176, x1 - x0 - 20, 44, '#bfe0f1', { w: K.LM, f: G.night ? K.LIT : c('#bfe0f1'), l: G.night ? K.LIT_LINE : ln('#bfe0f1', 0.45) });
    for (let x = x0 + 70; x < x1 - 20; x += 70) b += K.seg(x, y - 176, x, y - 132, ln(body, 0.4), 2);
    for (let i = 0; i < 4; i++) b += K.box(x0 + 16, y - 120 + i * 24, x1 - x0 - 32, 16, i % 2 ? '#7fb1dc' : '#9cc3e6', { w: 2, r: 3 });
    b += K.box(x0 - 6, y - 24, x1 - x0 + 12, 24, '#d7dde6', { w: K.LM, r: 3 });
    // pilares e cobertura em onda
    for (let x = x0 + 40; x < x1; x += (x1 - x0 - 80) / 5) b += K.box(x - 7, y - 330, 14, 312, '#b6c0cc', { w: K.LM, r: 3 });
    b += K.shape(`M${f(x0 - 40)},${f(y - 330)} Q${f((x0 + x1) / 2)},${f(y - 380)} ${f(x1 + 40)},${f(y - 330)} L${f(x1 + 40)},${f(y - 306)} Q${f((x0 + x1) / 2)},${f(y - 352)} ${f(x0 - 40)},${f(y - 306)} Z`, roof, { w: K.LM });
    return b;
  }
  /** arquibancada em estilo missão (Del Mar): paredes brancas, arcos e telhas */
  function missionStand(x0, x1, y) {
    const wall = '#fbf6ee', tile = '#e58b5c';
    let b = K.box(x0, y - 250, x1 - x0, 250, wall, { w: K.LM });
    for (let x = x0 + 30; x < x1 - 90; x += 110) b += K.shape(K.archD(x, y - 120, 80, 120, 40), '#c9a98a', { w: K.LM });
    for (let x = x0 + 40; x < x1 - 80; x += 110) b += K.win(x, y - 220, 60, 60, { arch: true, w: 2, cross: 'v' });
    b += K.shape(`M${f(x0 - 30)},${f(y - 250)} L${f(x0 + 40)},${f(y - 300)} L${f(x1 - 40)},${f(y - 300)} L${f(x1 + 30)},${f(y - 250)} Z`, tile, { w: K.LM });
    for (let x = x0; x < x1; x += 30) b += K.seg(x, y - 296, x - 8, y - 254, ln(tile, 0.3), 2);
    // torre do sino
    const tx = (x0 + x1) / 2;
    b += K.box(tx - 60, y - 400, 120, 160, wall, { w: K.LM });
    b += K.shape(K.archD(tx - 26, y - 380, 52, 70, 26), '#c9a98a', { w: K.LM });
    b += K.shape(`M${f(tx - 76)},${f(y - 400)} L${f(tx)},${f(y - 460)} L${f(tx + 76)},${f(y - 400)} Z`, tile, { w: K.LM });
    return b;
  }
  /** placa de distância da pista */
  function marker(x, y) {
    let b = K.box(x - 6, y - 190, 12, 190, '#ffffff', { w: K.LM, r: 3 });
    for (let k = 0; k < 4; k++) b += S.rect(x - 4, y - 180 + k * 40, 8, 18, c('#ef7d76'));
    b += K.box(x - 44, y - 250, 88, 62, '#ffffff', { w: K.LM, r: 8 });
    b += S.text(x, y - 207, '200', ln('#ffffff', 0.8), 30);
    return b;
  }
  SC.hipodromo = function (o) {
    const G = K.G;
    const delmar = o.v === 'delmar';
    if (delmar && !G.night && !G.rain) { G.sky = [['0', '#4aa3e8'], ['1', '#c7e9fb']]; G.hor = '#c7e9fb'; }
    const HZ = 600;
    const layers = skyLayers({ horizon: HZ, clouds: [[260, 170, 260], [1660, 120, 220]] });
    let far = '';
    if (delmar) {
      far += K.hills(101, HZ - 150, 70, '#c9b59a', { w: K.LF, n: 4 });
      far += K.ground(HZ - 30, '#a9d78c', { w: K.LF });
      far += missionStand(260, 1660, HZ + 4);
      far += K.sign(960, HZ - 154, 760, 30, [{ t: 'DEL MAR · WHERE THE TURF MEETS THE SURF', size: 16, ls: 2 }], { base: '#2f6fa8', ink: '#ffffff', r: 4, w: K.LF });
      far += K.palm(140, HZ + 40, 1.1, { lean: 30 }) + K.palm(1790, HZ + 40, 1.15, { lean: -40 });
    } else {
      far += K.treeRow(102, -80, 2000, HZ - 60, 10, 0.45, 0.6, 'escuro', { w: K.LF });
      far += K.ground(HZ - 30, '#a9d78c', { w: K.LF });
      // os mastros nascem da cobertura em onda (mesma curva da função grandstand)
      const roofTop = (x) => { const t = (x - 260) / 1480; return HZ + 4 - 330 - 100 * t * (1 - t); };
      for (const [x, col] of [[520, '#f2a9b8'], [860, '#f7d57a'], [1200, '#9fd0f2'], [1540, '#b9e3a5']]) far += flagPole(x, roofTop(x) + 6, 76, col);
      far += grandstand(300, 1700, HZ + 4);
      // faixas da Twinkle Series nas laterais da arquibancada
      far += K.sign(540, HZ - 66, 300, 34, [{ t: 'TWINKLE SERIES', size: 18, ls: 3 }], { base: '#2f5fa8', ink: '#ffffff', r: 4, w: K.LF });
      far += K.sign(1460, HZ - 66, 300, 34, [{ t: 'トゥインクル・シリーズ', font: 'jp', size: 17 }], { base: '#e05f7a', ink: '#ffffff', r: 4, w: K.LF });
      // telão
      far += K.box(28, 230, 236, 150, '#56627b', { w: K.LM, r: 8 });
      far += S.rect(42, 244, 208, 122, o.v === 'vazio' ? c('#2c3448') : c('#3b4f78'), 'rx="4"');
      if (o.v === 'vazio') far += K.txt(146, 304, 'SEM PÚBLICO', { size: 21, fill: '#ff9a9a', ls: 1 }) + K.txt(146, 330, 'portões fechados', { size: 13, fill: '#c9d1e6' });
      else {
        far += K.txt(146, 266, 'TWINKLE SERIES', { size: 14, fill: '#ffd47e', ls: 1.5 });
        far += `<rect x="78" y="280" width="136" height="44" rx="22" fill="none"${K.ST('#9fd48a', 4)}/>` + S.circle(186, 282, 6, '#ffffff');
        far += K.txt(146, 348, 'PRÓXIMA CORRIDA 15:40', { size: 12, fill: '#ffffff' });
      }
      far += K.box(108, 380, 16, 222, '#9aa4b3', { w: K.LM }) + K.box(168, 380, 16, 222, '#9aa4b3', { w: K.LM });
    }
    layers.push(L(sv(far), 0.05));
    // meio: cerca branca na frente da arquibancada e a grama da pista
    const turf = K.groundCol('#a4d887');
    let mid = S.rect(-40, HZ + 6, W + 80, H, c(turf));
    const bands = [[HZ + 40, 34], [HZ + 120, 52], [HZ + 250, 76]];
    for (const [by, bh] of bands) mid += S.rect(-40, by, W + 80, bh, c(K.mix(turf, '#ffffff', 0.13)));
    mid += K.rail(-40, W + 40, HZ - 34, 46, { every: 110, pw: 9, rh: 10 });
    // poste de chegada: o disco redondo junto da cerca
    mid += K.box(414, HZ - 196, 12, 172, '#ffffff', { w: K.LM, r: 3 }) + K.contact(420, HZ - 22, 26, 4);
    mid += K.disc(420, HZ - 214, 36, '#ffffff', { w: K.LM }) + K.disc(420, HZ - 214, 22, '#e5534b', { w: 2 }) + S.circle(420, HZ - 214, 7, c('#ffffff'));
    layers.push(L(sv(mid), 0.1));
    let near = marker(1760, 900);
    layers.push(L(sv(near), 0.18));
    return { layers, particles: wx('none'), amb: o.v === 'vazio' ? 'vento' : 'torcida' };
  };

  /* -------------------------------- corrida (fundo deslizando para o lado) */
  // cada faixa tem 1920 px e é desenhada duas vezes: o SVG tem 3840 px e
  // a animação "drift" o desloca em meia largura, sem emenda
  const tile2 = (fn) => fn(0) + fn(W);
  /** morros que se repetem a cada 1920 px (para as faixas deslizantes) */
  function periodicHills(seed, y, amp, base) {
    const r = K.rand(seed);
    const n = 5, ys = [];
    for (let i = 0; i < n; i++) ys.push(y - r() * amp);
    const pts = [];
    for (let k = -1; k <= 2 * n + 1; k++) pts.push([(k * W) / n, ys[((k % n) + n) % n]]);
    const top = K.smooth(pts);
    return S.path(`${top} L${f(2 * W + (2 * W) / n)},${H} L${f(-W / n)},${H} Z`, c(base)) + K.line(top, ln(base, 0.4), K.LF);
  }
  /** cerca para a faixa deslizante: postes repetidos a cada "every" (divisor de
   *  1920) e travessas inteiriças nos 3840 px, para não aparecer emenda */
  function railStrip(y, h, every, pw, rh, lw, single) {
    const col = '#ffffff';
    let b = '';
    for (let x = every / 2; x < W * 2; x += every) b += K.box(x - pw / 2, y, pw, h, col, { w: lw, r: 2 });
    b += K.box(-30, y, W * 2 + 60, rh, col, { w: lw, r: rh / 2 });
    if (!single) b += K.box(-30, y + h * 0.48, W * 2 + 60, rh * 0.75, col, { w: lw, r: rh / 3 });
    return b;
  }
  SC.corrida = function (o) {
    const G = K.G;
    const delmar = o.v === 'delmar';
    if (delmar && !G.night && !G.rain) { G.sky = [['0', '#4aa3e8'], ['1', '#c7e9fb']]; G.hor = '#c7e9fb'; }
    const HZ = 520;
    const layers = skyLayers({ horizon: HZ, clouds: [[300, 170, 260], [1500, 120, 220]] });
    // longe: árvores e arquibancada (ou palmeiras)
    const far = (delmar ? periodicHills(103, HZ - 70, 60, '#c9b59a') : '') + S.rect(0, HZ, W * 2, 60, c(K.groundCol('#a4d887'))) + tile2((ox) => {
      let b = '';
      if (delmar) {
        for (let i = 0; i < 4; i++) b += K.palm(ox + 240 + i * 480, HZ + 4, 0.7, { lean: i % 2 ? -30 : 30 });
      } else {
        b += K.treeRow(104, ox + 60, ox + W - 60, HZ + 4, 9, 0.42, 0.56, 'escuro', { w: K.LF });
        b += K.box(ox + 400, HZ - 150, 900, 150, '#eef1f5', { w: K.LF });
        for (let i = 0; i < 3; i++) b += K.box(ox + 412, HZ - 136 + i * 22, 876, 14, i % 2 ? '#7fb1dc' : '#9cc3e6', { w: K.LF, r: 3 });
        b += K.shape(`M${ox + 370},${HZ - 160} L${ox + 1330},${HZ - 160} L${ox + 1330},${HZ - 146} L${ox + 370},${HZ - 146} Z`, '#6f9fc4', { w: K.LF });
      }
      return b;
    });
    layers.push(L(sv(far, { w: W * 2, par: 'none' }), 0, 'scroll-far'));
    // meio: cerca do outro lado
    const turf = K.groundCol('#a4d887');
    let ground = S.rect(-40, HZ + 40, W + 80, H, c(turf));
    for (const [by, bh] of [[HZ + 90, 40], [HZ + 200, 70], [HZ + 360, 100]]) ground += S.rect(-40, by, W + 80, bh, c(K.mix(turf, '#ffffff', 0.13)));
    layers.push(L(sv(ground), 0));
    layers.push(L(sv(railStrip(HZ + 4, 34, 96, 7, 8, K.LF, true), { w: W * 2, par: 'none' }), 0, 'scroll-mid'));
    // perto: a cerca branca passando rápido
    layers.push(L(sv(railStrip(700, 110, 320, 16, 18, K.LM), { w: W * 2, par: 'none' }), 0, 'scroll-fast'));
    return { layers, particles: G.rain ? 'rain' : 'speed', amb: o.v === 'vazio' ? 'vento' : 'torcida' };
  };

  /* --------------------------------------------------- rua comercial */
  const ICON = {
    xicara: (x, y, s) => `<path d="M${f(x + 12 * s)},${f(y - 6 * s)} q${f(15 * s)},${f(-2 * s)} ${f(13 * s)},${f(9 * s)} q${f(-2 * s)},${f(8 * s)} ${f(-15 * s)},${f(7 * s)}" fill="none"${K.ST(ln('#ffffff', 0.6), 6)}/><path d="M${f(x + 12 * s)},${f(y - 6 * s)} q${f(15 * s)},${f(-2 * s)} ${f(13 * s)},${f(9 * s)} q${f(-2 * s)},${f(8 * s)} ${f(-15 * s)},${f(7 * s)}" fill="none"${K.ST(c('#ffffff'), 3)}/>` +
      K.shape(`M${f(x - 22 * s)},${f(y - 12 * s)} L${f(x + 16 * s)},${f(y - 12 * s)} L${f(x + 12 * s)},${f(y + 10 * s)} Q${f(x - 3 * s)},${f(y + 16 * s)} ${f(x - 18 * s)},${f(y + 10 * s)} Z`, '#ffffff', { w: 3 }) +
      K.line(`M${f(x - 28 * s)},${f(y + 16 * s)} L${f(x + 22 * s)},${f(y + 16 * s)}`, c('#ffffff'), 4) +
      K.line(`M${f(x - 10 * s)},${f(y - 18 * s)} q${f(-6 * s)},${f(-6 * s)} 0,${f(-12 * s)} M${f(x + 4 * s)},${f(y - 18 * s)} q${f(-6 * s)},${f(-6 * s)} 0,${f(-12 * s)}`, c('#ffffff'), 3),
    livro: (x, y, s) => K.shape(`M${f(x)},${f(y - 14 * s)} Q${f(x - 14 * s)},${f(y - 20 * s)} ${f(x - 30 * s)},${f(y - 14 * s)} L${f(x - 30 * s)},${f(y + 16 * s)} Q${f(x - 14 * s)},${f(y + 10 * s)} ${f(x)},${f(y + 16 * s)} Q${f(x + 14 * s)},${f(y + 10 * s)} ${f(x + 30 * s)},${f(y + 16 * s)} L${f(x + 30 * s)},${f(y - 14 * s)} Q${f(x + 14 * s)},${f(y - 20 * s)} ${f(x)},${f(y - 14 * s)} Z`, '#ffffff', { w: 3 }) + K.seg(x, y - 14 * s, x, y + 16 * s, ln('#ffffff', 0.6), 3),
    flor: (x, y, s) => { let b = ''; for (let k = 0; k < 5; k++) { const a = (k / 5) * K.TAU - Math.PI / 2; b += K.disc(x + Math.cos(a) * 12 * s, y + Math.sin(a) * 12 * s, 9 * s, '#ffffff', { w: 2 }); } return b + K.disc(x, y, 7 * s, '#f9d36b', { w: 2 }); },
    pao: (x, y, s) => K.shape(`M${f(x - 30 * s)},${f(y + 12 * s)} Q${f(x - 34 * s)},${f(y - 16 * s)} ${f(x)},${f(y - 16 * s)} Q${f(x + 34 * s)},${f(y - 16 * s)} ${f(x + 30 * s)},${f(y + 12 * s)} Z`, '#ffffff', { w: 3 }) + K.line(`M${f(x - 12 * s)},${f(y - 10 * s)} l${f(-6 * s)},${f(14 * s)} M${f(x + 2 * s)},${f(y - 10 * s)} l${f(-6 * s)},${f(14 * s)} M${f(x + 16 * s)},${f(y - 10 * s)} l${f(-6 * s)},${f(14 * s)}`, ln('#ffffff', 0.5), 3),
  };
  /** fachada de loja: parede, janelas de cima, letreiro, toldo listrado e vitrine */
  function shop(x0, x1, top, y, o) {
    const G = K.G;
    const q = o || {};
    const wall = q.wall, aw = q.awning;
    const w = x1 - x0, cx = (x0 + x1) / 2;
    let b = K.box(x0, top, w, y - top + 6, wall, { w: K.LM });
    b += K.box(x0 - 8, top - 16, w + 16, 22, K.mix(wall, '#7a6a80', 0.25), { w: K.LM, r: 4 });
    const n = w > 360 ? 3 : 2;
    const ww = 64, wh = 84;
    for (let i = 0; i < n; i++) {
      const wxx = x0 + ((i + 0.5) * w) / n - ww / 2;
      b += K.win(wxx, top + 40, ww, wh, { lit: G.night && (i + Math.round(x0)) % 3 !== 0, curtain: q.curtain || '#f6d3d0', w: K.LM });
    }
    // letreiro
    const sy = top + 160;
    if (q.cinema) {
      b += K.box(cx - 150, sy - 10, 300, 70, '#3e3a5c', { w: K.LM, r: 10 });
      for (let i = 0; i < 12; i++) b += S.circle(cx - 132 + i * 24, sy - 1, 4, G.night ? K.LIT : c('#ffe9a8'));
      b += S.text(cx, sy + 40, 'CINEMA', G.night ? K.LIT : c('#ffe9a8'), 34);
    } else {
      if (q.name) {
        b += K.box(cx - 120, sy, 240, 56, aw, { w: K.LM, r: 12 });
        if (q.icon) b += ICON[q.icon](cx - 82, sy + 28, 0.62);
        b += K.txt(cx + 22, sy + 36, q.name, { size: 19, fill: '#ffffff' });
      } else {
        b += K.box(cx - 70, sy, 140, 56, aw, { w: K.LM, r: 12 });
        if (q.icon) b += ICON[q.icon](cx, sy + 28, 0.8);
      }
    }
    // toldo listrado com borda ondulada
    const ay = top + 236, ah = 52;
    let stripes = '';
    for (let x = x0 - 10, i = 0; x < x1 + 10; x += 34, i++) if (i % 2 === 0) stripes += S.rect(x, ay, 34, ah, c('#ffffff'));
    // borda ondulada: um número inteiro de ondas, terminando certinho na ponta do toldo
    const scal = (() => {
      const span = x1 - x0 + 24, n = Math.max(1, Math.round(span / 34)), sw = span / n;
      let d = `M${f(x0 - 12)},${f(ay)} L${f(x1 + 12)},${f(ay)} L${f(x1 + 12)},${f(ay + ah)}`;
      for (let i = 0; i < n; i++) { const xa = x1 + 12 - i * sw; d += ` Q${f(xa - sw / 2)},${f(ay + ah + 18)} ${f(xa - sw)},${f(ay + ah)}`; }
      return d + ' Z';
    })();
    b += K.shape(scal, aw, { w: K.LM });
    b += `<g clip-path="${K.clip(P.p(scal))}">${stripes}</g>`;
    b += `<path d="${scal}" fill="none"${K.ST(ln(aw, 0.5), K.LM)}/>`;
    // vitrine e porta
    const fy = ay + ah + 26;
    const doorW = 92;
    const doorX = q.doorLeft ? x0 + 30 : x1 - 30 - doorW;
    const vitX = q.doorLeft ? doorX + doorW + 24 : x0 + 30;
    const vitW = w - doorW - 84;
    b += K.box(vitX, fy, vitW, y - fy - 40, '#ffffff', { w: K.LM, r: 4 });
    b += S.rect(vitX + 10, fy + 10, vitW - 20, y - fy - 60, G.night ? K.LIT : c('#cfe8f3'), 'rx="2"');
    b += K.box(doorX, fy, doorW, y - fy, K.mix(wall, '#7a6a80', 0.3), { w: K.LM, r: 4 });
    b += S.rect(doorX + 14, fy + 14, doorW - 28, 90, G.night ? K.LIT : c('#cfe8f3'), 'rx="3"');
    b += S.circle(doorX + doorW - 18, fy + (y - fy) * 0.58, 5, c('#e9c46a'));
    return b;
  }
  /** bambu de Tanabata com tiras de desejo; (x, y) = pé do bambu */
  function tanabata(x, y, h, lean, seed) {
    const r = K.rand(seed);
    const tx = x + lean, ty = y - h;
    let b = K.tube(`M${f(x)},${f(y)} Q${f(x + lean * 0.3)},${f(y - h * 0.5)} ${f(tx)},${f(ty)}`, '#8cc58a', 18, { w: K.LM });
    for (let k = 1; k < 6; k++) { const t = k / 6, px = x + lean * (0.6 * t * (1 - t) + t * t), py = y - h * t; b += K.seg(px - 10, py, px + 10, py, ln('#8cc58a', 0.45), 3); }
    // ramos curtos no alto, folhas grandes e as tiras de desejo penduradas
    let leaves = '';
    const branches = [];
    for (let k = 0; k < 4; k++) {
      const t = 0.5 + k * 0.13, px = x + lean * (0.6 * t * (1 - t) + t * t), py = y - h * t;
      const dir = k % 2 ? 1 : -1, ex = px + dir * (100 + r() * 30), ey = py + 34 + r() * 16;
      branches.push([px, py, ex, ey]);
      for (const lt of [0.45, 0.8, 1]) {
        const lx = px + (ex - px) * lt, ly = py + (ey - py) * lt;
        leaves += P.p(`M${f(lx)},${f(ly)} q${f(dir * 22)},${f(-22)} ${f(dir * 62)},${f(-10)} q${f(-dir * 28)},${f(20)} ${f(-dir * 62)},${f(10)} Z`);
      }
    }
    // tufo de folhas na ponta
    for (const a of [-0.5, 0, 0.5]) {
      const lx = tx, ly = ty;
      const ex = lx + Math.sin(a) * 70, ey = ly - Math.cos(a) * 70;
      leaves += P.p(`M${f(lx)},${f(ly)} Q${f((lx + ex) / 2 + 14)},${f((ly + ey) / 2)} ${f(ex)},${f(ey)} Q${f((lx + ex) / 2 - 14)},${f((ly + ey) / 2)} ${f(lx)},${f(ly)} Z`);
    }
    for (const [px, py, ex, ey] of branches) b += K.tube(`M${f(px)},${f(py)} L${f(ex)},${f(ey)}`, '#8cc58a', 4, { w: 2 });
    b += K.union(leaves, '#7fc07a', { w: 2, off: [0, -3] });
    const cols = ['#f6a3b5', '#9fcff2', '#f9dc76', '#b8e3a8', '#cbb2ea'];
    let ci = Math.floor(r() * cols.length);
    for (const [px, py, ex, ey] of branches) {
      for (const t of [0.3, 0.7]) {
        const sx = px + (ex - px) * t, sy = py + (ey - py) * t;
        b += K.seg(sx, sy, sx, sy + 10, ln('#ffffff', 0.5), 1.5);
        b += K.box(sx - 9, sy + 10, 18, 48, cols[ci++ % cols.length], { w: 2, r: 2 });
      }
    }
    return b;
  }
  SC.rua = function (o) {
    const G = K.G;
    const tana = o.v === 'tanabata';
    const HZ = 724;
    const layers = skyLayers({ horizon: 400, clouds: [[300, 110, 220], [1640, 80, 200]] });
    // fundo: fileira de lojas
    let far = '';
    const shops = [
      [-30, 370, 180, { wall: '#f6d9c6', awning: '#ef8e86', icon: 'xicara', name: 'Café Lua' }],
      [370, 770, 240, { wall: '#d6e7d4', awning: '#6fb38f', icon: 'livro', doorLeft: true, name: 'Livraria Sirius' }],
      [770, 1150, 150, { wall: '#f6e5bc', awning: '#f2b45c', icon: 'flor', name: 'Flores Sakura' }],
      [1150, 1560, 210, { wall: '#e6d8f0', awning: '#9a86c9', cinema: true, doorLeft: true }],
      [1560, 1950, 170, { wall: '#d9dff2', awning: '#7f9fd6', icon: 'pao', name: 'Padaria Cenoura' }],
    ];
    for (const [x0, x1, top, q] of shops) far += shop(x0, x1, top, HZ, q);
    layers.push(L(sv(far), 0.05));
    // meio: calçada, postes e vasos
    const pave = K.groundCol('#ebe3d6');
    let mid = S.rect(-40, HZ, W + 80, H, c(pave)) + K.seg(-40, HZ, W + 40, HZ, ln(pave, 0.45), K.LM);
    for (const y of [770, 840, 940]) mid += K.seg(-40, y, W + 40, y, ln(pave, 0.2), 2);
    for (let x = 60; x < W; x += 180) mid += K.seg(x + ((x / 180) % 2) * 60, HZ, x + ((x / 180) % 2) * 60 - 30, 770, ln(pave, 0.18), 2);
    if (G.rain) for (const [px, py, pr] of [[520, 800, 90], [1300, 860, 120]]) mid += S.ellipse(px, py, pr, pr * 0.14, c(K.mix(pave, '#9fb2c8', 0.45)));
    mid += K.potPlant(330, HZ + 4, 0.9, { seed: 3 }) + K.potPlant(1600, HZ + 4, 0.9, { seed: 5, pot: '#9fb7d8' });
    // cavalete de giz na frente da cafeteria
    mid += K.contact(150, HZ + 6, 70, 6);
    mid += K.shape(`M${f(96)},${f(HZ + 4)} L${f(112)},${f(HZ - 128)} L${f(188)},${f(HZ - 128)} L${f(204)},${f(HZ + 4)}`, '#b98b62', { w: K.LM, f: 'none' });
    mid += K.box(100, HZ - 138, 100, 116, '#3f5446', { w: K.LM, r: 4 }) + K.box(100, HZ - 138, 100, 116, '#3f5446', { w: 0, r: 4, f: 'none', l: c('#b98b62'), x: '' });
    mid += K.txt(150, HZ - 110, 'HOJE', { size: 14, fill: '#f3f1ea', ls: 2 }) + K.txt(150, HZ - 82, 'torta de', { size: 21, fill: '#f6c9d4', font: 'hand' }) + K.txt(150, HZ - 58, 'morango', { size: 21, fill: '#f6c9d4', font: 'hand' });
    mid += K.ICONS.coracao(150, HZ - 38, 8, '#f27aa0');
    mid += K.lamp(470, 790, 330) + K.lamp(1450, 790, 330);
    layers.push(L(sv(mid), 0.1));
    if (tana) {
      let deco = '';
      const str = K.stringLine(-20, 130, W + 20, 130, 90);
      deco += str.rope();
      for (let i = 1; i < 12; i++) { const [lx, ly] = str.at(i / 12); deco += K.chochin(lx, ly + 34, 0.9, { col: i % 2 ? '#ef6f63' : '#f6f0e4' }); }
      deco += tanabata(110, 900, 640, 50, 1) + tanabata(1810, 900, 640, -50, 2);
      layers.push(L(sv(deco), 0.16));
    }
    return { layers, particles: wx('none'), amb: G.rain ? 'chuva' : tana ? 'festival' : 'rua' };
  };

  /* ------------------------------------------- toco na clareira (extra) */
  SC.toco = function () {
    const G = K.G;
    const HZ = 620;
    const layers = skyLayers({ horizon: HZ });
    let far = K.ground(HZ, '#a7d58e', { w: K.LF });
    far += K.treeRow(111, -80, 2000, HZ + 6, 12, 0.6, 0.85, 'escuro', { w: K.LF });
    far += K.treeRow(112, -80, 2000, HZ + 40, 9, 0.55, 0.75, 'verde', { w: K.LF });
    layers.push(L(sv(far), 0.05));
    const grass = K.groundCol('#b2dc94');
    let mid = K.ground(HZ + 50, grass, { w: K.LM }) + K.tufts(113, 0, W, 700, 1060, 36, grass);
    // o toco
    const x = 1360, y = 790, bark = '#a77d63';
    mid += K.contact(x, y + 6, 190, 18);
    mid += K.shape(`M${x - 150},${y} L${x - 120},${y - 110} L${x + 120},${y - 110} L${x + 150},${y} Q${x + 170},${y + 16} ${x + 120},${y + 10} L${x - 120},${y + 10} Q${x - 170},${y + 16} ${x - 150},${y} Z`, bark);
    mid += K.oval(x, y - 110, 122, 30, '#e3c08f');
    mid += `<ellipse cx="${x}" cy="${y - 110}" rx="80" ry="19" fill="none"${K.ST(ln('#e3c08f', 0.35), 2)}/><ellipse cx="${x}" cy="${y - 110}" rx="40" ry="9" fill="none"${K.ST(ln('#e3c08f', 0.35), 2)}/>`;
    mid += K.line(`M${x - 90},${y - 80} l10,60 M${x + 40},${y - 84} l-6,70 M${x + 100},${y - 70} l8,50`, ln(bark, 0.35), 3);
    if (!G.snow) for (const [mx, my, ms] of [[1180, 800, 1], [1215, 812, 0.7]]) {
      mid += K.box(mx - 8 * ms, my - 26 * ms, 16 * ms, 26 * ms, '#fff4e6', { w: 2, r: 4 });
      mid += K.shape(`M${f(mx - 30 * ms)},${f(my - 22 * ms)} Q${f(mx)},${f(my - 64 * ms)} ${f(mx + 30 * ms)},${f(my - 22 * ms)} Z`, '#ef7d76', { w: 2 });
      mid += S.circle(mx - 8 * ms, my - 38 * ms, 4 * ms, c('#ffffff')) + S.circle(mx + 10 * ms, my - 34 * ms, 3 * ms, c('#ffffff'));
    }
    layers.push(L(sv(mid), 0.12));
    layers.push(L(sv(K.tree(170, 880, 1.45, { trunk: 240, R: 120, seed: 114, kind: 'escuro' })), 0.22));
    return { layers, particles: wx(G.night ? 'none' : 'leaves'), amb: G.night ? 'noite' : 'passaros' };
  };

  /* ------------------------------------------------ festival de verão */
  function yatai(x, w, y, sign, aw) {
    const G = K.G;
    const wood = '#b8875f';
    let b = K.contact(x + w / 2, y + 4, w * 0.6, 10);
    b += K.box(x + 10, y - 290, 16, 290, wood, { w: K.LM }) + K.box(x + w - 26, y - 290, 16, 290, wood, { w: K.LM });
    b += K.box(x + 26, y - 250, w - 52, 150, '#fff1d8', { w: K.LM, f: G.night ? K.mix(K.LIT, '#ffffff', 0.25) : c('#fff1d8') });
    // telhado listrado
    const ry = y - 330;
    let stripes = '';
    for (let xx = x - 20, i = 0; xx < x + w + 20; xx += 30, i++) if (i % 2 === 0) stripes += S.rect(xx, ry, 30, 50, c('#ffffff'));
    const roofD = `M${f(x - 20)},${f(ry + 50)} L${f(x + 10)},${f(ry)} L${f(x + w - 10)},${f(ry)} L${f(x + w + 20)},${f(ry + 50)} Z`;
    b += K.shape(roofD, aw, { w: K.LM }) + `<g clip-path="${K.clip(P.p(roofD))}">${stripes}</g><path d="${roofD}" fill="none"${K.ST(ln(aw, 0.5), K.LM)}/>`;
    // placa com o nome da barraca
    b += K.box(x + w / 2 - 90, y - 300, 180, 48, '#fff8ea', { w: K.LM, r: 6 });
    b += S.text(x + w / 2, y - 266, sign, ln(aw, 0.7), 30);
    // balcão e cortininha (noren)
    b += K.box(x, y - 104, w, 104, wood, { w: K.LM, r: 4 });
    b += K.box(x - 8, y - 112, w + 16, 16, K.mix(wood, '#ffffff', 0.2), { w: K.LM, r: 4 });
    for (let i = 0; i < 4; i++) b += K.box(x + 30 + (i * (w - 60)) / 4 + 2, y - 250, (w - 60) / 4 - 4, 56, aw, { w: 2, r: 3 });
    // plaquinha de preço no balcão
    b += K.sign(x + w * 0.74, y - 84, 82, 32, [{ t: '300円', font: 'jp', size: 18 }], { base: '#ffffff', ink: c('#d0453f'), r: 4, w: 2 });
    return b;
  }
  function firework(x, y, r, col, delay) {
    let d = '';
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * K.TAU;
      d += `M${f(x + Math.cos(a) * r * 0.35)},${f(y + Math.sin(a) * r * 0.35)} L${f(x + Math.cos(a) * r)},${f(y + Math.sin(a) * r)}`;
    }
    let dots = '';
    for (let i = 0; i < 14; i++) { const a = ((i + 0.5) / 14) * K.TAU; dots += S.circle(x + Math.cos(a) * r * 1.12, y + Math.sin(a) * r * 1.12, 4, col); }
    return `<g class="firework" style="animation-delay:${delay}s;transform-origin:${f(x)}px ${f(y)}px">${K.line(d, col, 5)}${dots}</g>`;
  }
  SC.festival = function () {
    const G = K.G;
    const HZ = 640;
    const fw = G.night && !G.rain ? firework(560, 200, 110, '#ff9fb6', 0) + firework(1380, 150, 90, '#9fd6ff', -1.4) + firework(980, 110, 70, '#ffe08a', -2.8) : '';
    const layers = skyLayers({ horizon: HZ, stars: 30, moon: false, clouds: [[300, 280, 220], [1700, 240, 200]] });
    if (fw) layers.push(L(sv(fw), 0.02));
    // fundo: árvores escuras e um torii
    let far = K.treeRow(121, -80, 2000, HZ + 6, 11, 0.6, 0.8, 'escuro', { w: K.LF });
    far += K.ground(HZ, '#d9c19c', { w: K.LF });
    const red = '#e2574c';
    far += K.box(838, 380, 28, 266, red, { w: K.LM }) + K.box(1054, 380, 28, 266, red, { w: K.LM });
    far += K.shape('M800,372 Q960,350 1120,372 L1124,392 Q960,372 796,392 Z', '#3d3a4c', { w: K.LM });
    far += K.box(818, 392, 284, 22, red, { w: K.LM, r: 4 }) + K.box(826, 430, 268, 18, red, { w: K.LM, r: 4 });
    far += K.sign(960, 404, 34, 56, [{ t: '神', font: 'jp', size: 15 }, { t: '社', font: 'jp', size: 15 }], { base: '#3d3a4c', ink: '#f2d27a', r: 3, w: 2 });
    layers.push(L(sv(far), 0.05));
    // meio: barracas dos dois lados
    let mid = '';
    mid += yatai(40, 380, 780, 'りんご飴', '#ef6f63') + yatai(1500, 380, 780, 'かき氷', '#6fa8dc');
    mid += yatai(470, 300, 730, 'わたあめ', '#f39fb7') + yatai(1150, 300, 730, 'やきそば', '#f2b45c');
    layers.push(L(sv(mid), 0.1));
    // perto: varais de lanternas
    let near = '';
    for (const [x0, y0, x1, y1] of [[-30, 70, 940, 120], [980, 120, 1950, 70]]) {
      const str = K.stringLine(x0, y0, x1, y1, 80);
      near += str.rope();
      for (let i = 1; i < 8; i++) { const [lx, ly] = str.at(i / 8); near += K.chochin(lx, ly + 36, 1, { col: i % 2 ? '#ef6f63' : '#fbf3e4', mark: '祭' }); }
    }
    layers.push(L(sv(near), 0.18));
    return { layers, particles: wx('none'), amb: 'festival' };
  };

  /* ------------------------------------------------- mansão Mejiro */
  function mansion(cx, y) {
    const G = K.G;
    const wall = '#f8f0e3', roof = '#6f80a9', trim = '#ffffff';
    const r = K.rand(131);
    const w = 1300, x0 = cx - w / 2, h = 300;
    let b = '';
    // telhado mansarda com águas-furtadas
    b += K.shape(`M${f(x0 - 10)},${f(y - h)} L${f(x0 + 50)},${f(y - h - 80)} L${f(x0 + w - 50)},${f(y - h - 80)} L${f(x0 + w + 10)},${f(y - h)} Z`, roof, { w: K.LM });
    for (const x of [x0 + 150, x0 + 330, x0 + w - 330, x0 + w - 150]) {
      b += K.box(x - 30, y - h - 70, 60, 64, wall, { w: K.LM, r: 4 });
      b += K.shape(`M${f(x - 38)},${f(y - h - 66)} L${f(x)},${f(y - h - 100)} L${f(x + 38)},${f(y - h - 66)} Z`, roof, { w: K.LM });
      b += K.win(x - 16, y - h - 56, 32, 40, { lit: G.night && r() < 0.6, w: 2, cross: 'v' });
    }
    for (const x of [x0 + 240, x0 + w - 240]) b += K.box(x - 22, y - h - 130, 44, 70, '#d9c7b4', { w: K.LM, r: 3 });
    b += K.box(x0, y - h, w, h, wall, { w: K.LM });
    b += K.box(x0 - 8, y - h - 6, w + 16, 16, trim, { w: K.LM, r: 4 });
    b += K.box(x0 - 8, y - h / 2 - 8, w + 16, 14, trim, { w: K.LM, r: 4 });
    // janelas das alas
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const wxx = cx + side * (230 + i * 104) - (side < 0 ? 54 : 0);
        b += K.win(wxx, y - h + 30, 54, 96, { lit: G.night && r() < 0.65, w: K.LM, curtain: '#e9cfd6' });
        b += K.win(wxx, y - h / 2 + 22, 54, 108, { arch: true, lit: G.night && r() < 0.7, w: K.LM, cross: 'v' });
      }
    }
    // pavilhão do meio: frontão, varanda e colunas
    const pw = 340;
    b += K.box(cx - pw / 2, y - h - 60, pw, h + 60, wall, { w: K.LM });
    b += K.shape(`M${f(cx - pw / 2 - 20)},${f(y - h - 58)} L${f(cx)},${f(y - h - 140)} L${f(cx + pw / 2 + 20)},${f(y - h - 58)} Z`, wall, { w: K.LM });
    b += K.disc(cx, y - h - 86, 22, '#c9b47d', { w: K.LM }) + K.txt(cx, y - h - 78, 'M', { size: 24, fill: ln('#c9b47d', 0.62) });
    b += K.win(cx - 110, y - h - 30, 60, 100, { arch: true, lit: G.night, w: K.LM, cross: 'v' }) + K.win(cx + 50, y - h - 30, 60, 100, { arch: true, lit: G.night, w: K.LM, cross: 'v' });
    b += K.win(cx - 30, y - h - 40, 60, 112, { arch: true, lit: G.night, w: K.LM, cross: 'v' });
    // varanda com balaústre
    b += K.box(cx - pw / 2 - 20, y - 168, pw + 40, 14, trim, { w: K.LM, r: 3 });
    for (let x = cx - pw / 2 - 10; x < cx + pw / 2 + 14; x += 22) b += K.box(x, y - 154, 10, 30, trim, { w: 2, r: 4 });
    b += K.box(cx - pw / 2 - 20, y - 126, pw + 40, 10, trim, { w: K.LM, r: 3 });
    for (const x of [cx - 140, cx - 50, cx + 50, cx + 140]) b += K.box(x - 12, y - 116, 24, 116, trim, { w: K.LM, r: 3 });
    b += K.shape(K.archD(cx - 36, y - 108, 72, 108, 36), '#8a6a5c', { w: K.LM });
    b += K.sign(cx + 95, y - 92, 66, 36, [{ t: 'MEJIRO', size: 12, ls: 1 }], { base: '#d9b46a', ink: ln('#d9b46a', 0.7), r: 3, w: 2 });
    b += K.box(cx - pw / 2 - 30, y - 14, pw + 60, 14, '#e6ddd0', { w: K.LM });
    return b;
  }
  SC.mansao = function () {
    const G = K.G;
    const HZ = 620;
    const layers = skyLayers({ horizon: HZ, clouds: [[200, 170, 250], [1720, 130, 220]] });
    let far = K.treeRow(132, -80, 2000, HZ + 4, 11, 0.62, 0.84, 'escuro', { w: K.LF });
    far += K.ground(HZ, '#acd890', { w: K.LF });
    far += mansion(960, HZ + 6);
    layers.push(L(sv(far), 0.05));
    // meio: pátio de cascalho, topiarias e postes
    const grav = K.groundCol('#ece2d0');
    let mid = K.shape(`M${560},${HZ + 30} L${1360},${HZ + 30} L${1700},${H + 20} L${220},${H + 20} Z`, grav, { w: K.LM });
    // topiarias em vasos: as bolas de folhas encaixam na boca do vaso
    for (const x of [700, 1220]) {
      const balls = P.c(x, HZ - 18, 52) + P.c(x, HZ - 86, 38);
      mid += K.contact(x, HZ + 76, 50, 7);
      mid += K.union(balls, K.LEAF.escuro, { off: [-6, -8] });
      if (G.snow) mid += K.snowCap(balls, x, HZ - 126, 76);
      mid += K.shape(`M${x - 40},${HZ + 22} L${x + 40},${HZ + 22} L${x + 32},${HZ + 76} L${x - 32},${HZ + 76} Z`, '#e7a48a', { w: K.LM });
      mid += K.box(x - 46, HZ + 14, 92, 16, '#e7a48a', { w: K.LM, r: 5 });
    }
    mid += K.lamp(470, 760, 300) + K.lamp(1450, 760, 300);
    layers.push(L(sv(mid), 0.1));
    // perto: sebes com rosas nos cantos
    let near = K.bush(170, 900, 420, 110, K.LEAF.escuro, { seed: 133 }) + K.bush(1750, 900, 420, 110, K.LEAF.escuro, { seed: 134 });
    if (!G.snow) near += K.flowers(135, 40, 360, 806, 850, 9, ['#f28b9b', '#ffffff']) + K.flowers(136, 1560, 1880, 806, 850, 9, ['#f28b9b', '#ffffff']);
    layers.push(L(sv(near), 0.18));
    return { layers, particles: wx(G.time === 'tarde' && !G.night ? 'leaves' : 'none'), amb: ambOut('passaros') };
  };

  /* ------------------------------------------ jardim de inverno com o robai */
  function toro(x, y, s) {
    const stone = '#c9c7cf';
    const G = K.G;
    let b = K.contact(x, y + 4, 80 * s, 10 * s);
    b += K.box(x - 60 * s, y - 26 * s, 120 * s, 26 * s, stone, { w: K.LM, r: 6 * s });
    b += K.box(x - 18 * s, y - 130 * s, 36 * s, 106 * s, stone, { w: K.LM, r: 4 * s });
    b += K.box(x - 54 * s, y - 150 * s, 108 * s, 24 * s, stone, { w: K.LM, r: 6 * s });
    b += K.box(x - 40 * s, y - 214 * s, 80 * s, 66 * s, stone, { w: K.LM, r: 4 * s });
    b += K.box(x - 18 * s, y - 200 * s, 36 * s, 40 * s, G.night ? '#000' : '#8d8a98', { w: 2, f: G.night ? K.LIT : c('#8d8a98'), l: G.night ? K.LIT_LINE : ln('#8d8a98') });
    const roofD = `M${f(x - 92 * s)},${f(y - 210 * s)} Q${f(x - 40 * s)},${f(y - 230 * s)} ${f(x)},${f(y - 270 * s)} Q${f(x + 40 * s)},${f(y - 230 * s)} ${f(x + 92 * s)},${f(y - 210 * s)} Q${f(x)},${f(y - 222 * s)} ${f(x - 92 * s)},${f(y - 210 * s)} Z`;
    b += K.shape(roofD, stone, { w: K.LM });
    if (G.snow) b += `<g clip-path="${K.clip(P.p(roofD))}">${S.rect(x - 100 * s, y - 280 * s, 200 * s, 52 * s, c(K.SNOWC))}</g><path d="${roofD}" fill="none"${K.ST(ln(stone), K.LM)}/>`;
    b += K.disc(x, y - 276 * s, 12 * s, stone, { w: K.LM });
    return b;
  }
  SC.jardim = function (o) {
    if (o.v === 'sem-neve' && o.weather === 'neve') K.setTime(o.time, 'limpo');
    const G = K.G;
    const HZ = 580;
    const layers = skyLayers({ horizon: HZ, clouds: [[260, 200, 260], [1700, 150, 220]] });
    // fundo: muro de reboco com telhadinho e árvores atrás
    let far = K.treeRow(141, -80, 2000, 450, 10, 0.5, 0.7, 'pinho', { w: K.LF });
    const wall = '#f3eee6', tile = '#6d7488';
    far += K.box(-40, 430, W + 80, 170, wall, { w: K.LM });
    far += K.box(-50, 408, W + 100, 30, tile, { w: K.LM, r: 6 });
    if (G.snow) far += K.box(-50, 398, W + 100, 18, K.SNOWC, { w: K.LF, r: 9 });
    for (let x = 0; x < W; x += 240) far += K.seg(x, 438, x, 600, ln(wall, 0.25), 2);
    far += K.ground(HZ + 14, G.snow ? K.SNOWC : '#9fcf8c', { w: K.LF });
    layers.push(L(sv(far), 0.05));
    // meio: lanterna de pedra, pedras do caminho e um arbusto
    const groundC = G.snow ? K.SNOWC : '#a9d58f';
    let mid = K.ground(640, groundC, { w: K.LM, noSnow: true });
    for (const [x, y, rx] of [[560, 700, 60], [720, 742, 70], [900, 790, 80], [1110, 850, 90]]) mid += K.oval(x, y, rx, rx * 0.3, '#cfcdd6', { w: K.LM });
    if (G.snow) mid += K.line('M300,700 q60,-14 120,0 M1260,760 q60,-14 120,0 M780,900 q60,-14 120,0', ln(K.SNOWC, 0.2), 3);
    mid += toro(330, 760, 1.05);
    mid += K.bush(170, 820, 260, 90, K.LEAF.escuro, { seed: 142 });
    layers.push(L(sv(mid), 0.12));
    // perto: o robai, de florzinhas amarelas
    let near = K.contact(1240, 846, 34, 5) + K.sign(1240, 744, 124, 60, [{ t: '蝋梅', font: 'jp', size: 23 }, { t: 'ROBAI', size: 12, ls: 2 }], { base: '#c79a6c', ink: '#4f3524', pole: 44, post: '#9a7556', r: 5 });
    if (G.snow) near += K.box(1176, 738, 128, 12, K.SNOWC, { w: K.LF, r: 6 });
    near += K.bareTree(1460, 820, 1.55, { seed: 9, flowers: '#f7d35c', center: '#c98a2e', depth: 3, len: 160 });
    layers.push(L(sv(near), 0.2));
    return { layers, particles: wx('none'), amb: G.night ? 'noite' : 'vento' };
  };

  /* ----------------------------------------------- parque do lago */
  function easel(x, y, s, autumn) {
    const wood = '#b98b62';
    let b = K.contact(x, y + 4, 90 * s, 10 * s);
    b += K.tube(`M${f(x - 60 * s)},${f(y)} L${f(x - 10 * s)},${f(y - 300 * s)}`, wood, 10 * s, { w: K.LM });
    b += K.tube(`M${f(x + 60 * s)},${f(y)} L${f(x + 10 * s)},${f(y - 300 * s)}`, wood, 10 * s, { w: K.LM });
    b += K.tube(`M${f(x)},${f(y - 280 * s)} L${f(x + 20 * s)},${f(y)}`, wood, 9 * s, { w: K.LM });
    const cw = 170 * s, ch = 130 * s, cx = x - cw / 2, cy = y - 270 * s;
    b += K.box(cx - 8 * s, cy + ch, cw + 16 * s, 12 * s, wood, { w: K.LM, r: 3 });
    // a tela: no outono, quase toda vermelha com três manchas negras numa curva;
    // antes, uma explosão de vermelho e azul cortada por uma linha negra
    const art = (ax, ay, aw, ah) => autumn
      ? S.rect(ax, ay, aw, ah, '#d9493f') + S.ellipse(ax + aw * 0.3, ay + ah * 0.62, aw * 0.1, ah * 0.11, '#2b2130') + S.ellipse(ax + aw * 0.5, ay + ah * 0.48, aw * 0.11, ah * 0.12, '#2b2130') + S.ellipse(ax + aw * 0.7, ay + ah * 0.6, aw * 0.1, ah * 0.11, '#2b2130')
      : S.rect(ax, ay, aw, ah, '#f6f1e6') + S.path(`M${f(ax)},${f(ay + ah)} L${f(ax)},${f(ay + ah * 0.2)} Q${f(ax + aw * 0.4)},${f(ay)} ${f(ax + aw * 0.55)},${f(ay + ah * 0.5)} Q${f(ax + aw * 0.3)},${f(ay + ah)} ${f(ax)},${f(ay + ah)} Z`, '#d9493f') + S.path(`M${f(ax + aw)},${f(ay)} L${f(ax + aw)},${f(ay + ah * 0.8)} Q${f(ax + aw * 0.55)},${f(ay + ah * 0.9)} ${f(ax + aw * 0.6)},${f(ay + ah * 0.3)} Q${f(ax + aw * 0.75)},${f(ay)} ${f(ax + aw)},${f(ay)} Z`, '#4f7fd0') + K.line(`M${f(ax + aw * 0.05)},${f(ay + ah * 0.85)} L${f(ax + aw * 0.95)},${f(ay + ah * 0.15)}`, '#2b2130', 6 * s);
    b += K.frameArt(cx, cy, cw, ch, { frame: '#f3ead8', m: 8 * s, art });
    return b;
  }
  SC.parque = function (o) {
    const G = K.G;
    const aut = o.v === 'outono';
    const HZ = 570;
    const layers = skyLayers({ horizon: HZ, clouds: [[300, 200, 270], [1640, 150, 230]] });
    const kindA = aut ? 'outono' : 'verde', kindB = aut ? 'vermelho' : 'escuro', kindC = aut ? 'amarelo' : 'claro';
    // fundo: árvores do outro lado do lago e um coreto
    let far = K.ground(HZ, aut ? '#c9d48c' : '#a9d58e', { w: K.LF });
    far += K.treeRow(151, -80, 2000, HZ + 8, 10, 0.5, 0.7, kindB, { w: K.LF });
    far += K.treeRow(152, -40, 1960, HZ + 22, 7, 0.45, 0.6, kindA, { w: K.LF });
    const gz = 1500;
    far += K.box(gz - 92, HZ - 10, 184, 18, '#ffffff', { w: K.LF, r: 4 });
    for (const dx of [-80, -26, 26, 80]) far += K.box(gz + dx - 5, HZ - 110, 10, 102, '#ffffff', { w: K.LF });
    far += K.shape(`M${gz - 110},${HZ - 108} L${gz},${HZ - 170} L${gz + 110},${HZ - 108} Z`, '#6aa698', { w: K.LF });
    layers.push(L(sv(far), 0.04));
    // o lago
    const water = '#8fcbe6';
    let lake = S.rect(-40, HZ + 26, W + 80, 92, c(G.snow ? '#dfe9f3' : water)) + K.seg(-40, HZ + 26, W + 40, HZ + 26, ln(water, 0.35), K.LM);
    if (!G.snow) lake += K.line('M240,620 q24,-8 48,0 M760,650 q24,-8 48,0 M1190,616 q24,-8 48,0 M1640,640 q24,-8 48,0', K.mix(c(water), '#ffffff', 0.55), 3);
    layers.push(L(sv(lake), 0.06));
    // meio: margem, caminho, banco e poste
    const grass = K.groundCol(aut ? '#c5d98e' : '#b2dc93');
    let mid = K.ground(686, grass, { w: K.LM }) + K.tufts(153, 0, W, 740, 1060, 30, grass);
    const path = '#efe2c8';
    mid += K.shape(`M${1960},${720} Q${1300},${740} ${1000},${820} T${-40},${980} L${-40},${1060} Q${700},${930} ${1120},${870} T${1960},${790} Z`, K.groundCol(path), { w: K.LM });
    if (aut && !G.snow) { const r = K.rand(154); for (let i = 0; i < 40; i++) { const x = r() * W, y = 700 + r() * 340; mid += S.ellipse(x, y, 7, 4, c(['#f2a862', '#e98a6d', '#f2ca62'][i % 3]), `transform="rotate(${f(r() * 180)} ${f(x)} ${f(y)})"`); } }
    mid += K.bench(1480, 790, 250) + K.lamp(1720, 800, 320);
    mid += K.contact(1806, 862, 40, 6) + K.sign(1806, 640, 150, 78, [{ t: 'PARQUE', size: 18, ls: 2 }, { t: 'DO LAGO', size: 18, ls: 2 }, { t: 'coreto · barcos', size: 12 }], { base: '#6aa698', ink: '#ffffff', pole: 144, r: 6 });
    layers.push(L(sv(mid), 0.12));
    // perto: a árvore grande e o cavalete na sombra dela
    let near = K.tree(190, 880, 1.45, { kind: kindA, trunk: 240, R: 128, seed: 155, lean: 40 });
    near += S.ellipse(470, 846, 190, 22, K.G.ink, 'opacity=".1"');
    near += easel(500, 846, 1, aut);
    layers.push(L(sv(near), 0.2));
    return { layers, particles: wx(aut ? 'leaves' : 'none'), amb: ambOut('passaros') };
  };

  /* ------------------------------------------------------------ céu aberto */
  SC.ceu = function () {
    const G = K.G;
    const layers = skyLayers({ horizon: 900, stars: 160, starY1: 700, moonAt: { x: 1500, y: 200, r: 44 }, sunAt: { x: 1500, y: 200, r: 54 }, clouds: [[300, 330, 260], [1100, 420, 230]] });
    // mar de nuvens lá embaixo
    const r = K.rand(161);
    let parts = '';
    for (let x = -60; x < W + 120; x += 150 + r() * 60) parts += P.c(x, 860 + r() * 40, 90 + r() * 50);
    parts += P.r(-60, 880, W + 120, 260);
    const col = G.night ? K.mix(G.cloud, '#1b2550', 0.2) : G.cloud;
    layers.push(L(sv(K.union(parts, col, { f: col, l: K.mix(col, G.ink, 0.35), s: K.mix(col, G.shade, 0.25), off: [0, 22], w: K.LM })), 0.08));
    return { layers, particles: wx('none'), amb: G.night ? 'noite' : 'vento' };
  };

  SC.preto = () => ({ layers: [L(S.svg(S.rect(0, 0, W, H, '#07060a')), 0)], particles: 'none', amb: null });
  SC.branco = () => ({ layers: [L(S.svg(S.rect(0, 0, W, H, '#fffdfa')), 0)], particles: 'none', amb: null });
})();
