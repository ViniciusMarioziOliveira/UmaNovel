/* =========================================================================
   Kit de cenários (v3) — cartum minimalista.

   Regras do estilo:
   - cores chapadas, com no máximo uma sombra por volume (sem degradês nos
     objetos, sem brilhos, reflexos, texturas ou luzes que brilham);
   - contorno colorido, um pouco mais escuro que o preenchimento, sempre com
     a mesma espessura para a mesma distância (perto 4, meio 3, longe 2);
   - cada hora do dia e clima tem uma paleta: toda cor passa por c() (cor),
     sh() (sombra) e ln() (contorno), e o mesmo desenho serve para manhã,
     tarde, crepúsculo, noite, chuva e neve;
   - o meio da tela fica calmo, porque é ali que as personagens aparecem.
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const W = 1920, H = 1080, TAU = Math.PI * 2;

  /* ---------------------------------------------------------------- cores */
  function rgb(col) {
    let h = String(col).replace('#', '');
    if (h.length === 3) h = h.split('').map((x) => x + x).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function hex(r, g, b) {
    const q = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    return '#' + q(r) + q(g) + q(b);
  }
  function mix(a, b, t) {
    const A = rgb(a), B = rgb(b);
    return hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  }
  function desat(col, t) {
    const [r, g, b] = rgb(col);
    const l = 0.3 * r + 0.59 * g + 0.11 * b;
    return hex(r + (l - r) * t, g + (l - g) * t, b + (l - b) * t);
  }
  const lighten = (col, t) => mix(col, '#ffffff', t);
  const darken = (col, t) => mix(col, '#000000', t);

  /* ------------------------------------------------- horas do dia e clima */
  const TIMES = {
    manha: {
      sky: [['0', '#9fd1f2'], ['.62', '#d8ecf7'], ['1', '#ffe6d8']],
      mixes: [['#ffd8c6', 0.07]], desat: 0, ink: '#594c6f', shade: '#aa9ed3', cloud: '#fffaf6', sunC: '#fff3d4',
    },
    dia: {
      sky: [['0', '#7fbdec'], ['1', '#d4eefb']],
      mixes: [], desat: 0, ink: '#4a5678', shade: '#97a4d4', cloud: '#ffffff', sunC: '#fffbea',
    },
    tarde: {
      sky: [['0', '#a6a9db'], ['.52', '#f3b49f'], ['1', '#ffe0a9']],
      mixes: [['#ffa274', 0.13], ['#7a4466', 0.03]], desat: 0, ink: '#683f59', shade: '#c08aa6', cloud: '#fff0e4', sunC: '#fff1c9',
    },
    crepusculo: {
      sky: [['0', '#4a4b93'], ['.55', '#937ab8'], ['1', '#f0ab9e']],
      mixes: [['#8a76c0', 0.2]], mul: [0.84, 0.8, 0.94], desat: 0.06, ink: '#2f264e', shade: '#5d508c', cloud: '#e3c0d1',
    },
    noite: {
      sky: [['0', '#17224b'], ['.6', '#273772'], ['1', '#384e8b']],
      mixes: [['#4a5fb8', 0.28]], mul: [0.6, 0.66, 0.86], desat: 0.1, ink: '#141a3a', shade: '#2a3470', cloud: '#56679f',
    },
  };
  const RAIN = {
    mixes: [['#8e98ae', 0.26]], desat: 0.38,
    sky: { dia: [['0', '#8995ab'], ['1', '#c3cad6']], tarde: [['0', '#787d97'], ['1', '#bbb0b8']], noite: [['0', '#151b29'], ['1', '#2f394f']] },
    cloud: '#c6cdd8', cloudN: '#3b455b',
  };
  const SNOW = {
    mixes: [['#e8eff9', 0.1]], desat: 0.12,
    sky: { dia: [['0', '#b3c8e3'], ['1', '#eef3fa']], tarde: [['0', '#b8b3d7'], ['1', '#f6dfd4']], noite: [['0', '#1b2850'], ['1', '#3c5189']] },
  };
  // cores fixas que não mudam com a hora (luz acesa à noite, chapada, sem brilho)
  const LIT = '#ffd47e';
  const LIT_LINE = '#d9a24f';

  let G = null, GO = null;
  function setTime(time, weather) {
    const key = TIMES[time] ? time : 'dia';
    const T = TIMES[key];
    const night = key === 'noite' || key === 'crepusculo';
    const sk = key === 'noite' || key === 'crepusculo' ? 'noite' : key === 'tarde' ? 'tarde' : 'dia';
    G = {
      time: key, weather: weather || 'limpo', night, sky: T.sky, mixes: T.mixes.slice(), mul: T.mul || null, desat: T.desat,
      ink: T.ink, shade: T.shade, cloud: T.cloud, sunC: T.sunC || null, rain: false, snow: false, inside: false,
    };
    if (weather === 'chuva') {
      G.rain = true;
      G.desat = Math.max(G.desat, RAIN.desat);
      G.mixes = G.mixes.concat(RAIN.mixes);
      G.sky = key === 'crepusculo' ? RAIN.sky.noite : RAIN.sky[sk];
      G.cloud = night ? RAIN.cloudN : RAIN.cloud;
      G.sunC = null;
    } else if (weather === 'neve') {
      G.snow = true;
      G.desat = Math.max(G.desat, SNOW.desat);
      G.mixes = G.mixes.concat(SNOW.mixes);
      G.sky = SNOW.sky[sk];
      if (!night) G.sunC = null;
    }
    G.hor = G.sky[G.sky.length - 1][1];
    GO = G;
    return G;
  }
  setTime('dia');

  /** dentro de casa: as lâmpadas seguram as cores à noite e na chuva */
  function inside() {
    const I = Object.assign({}, GO, { inside: true });
    const t = GO.time;
    I.mul = null;
    if (t === 'noite' || t === 'crepusculo') {
      // luz de lâmpada: quente e aconchegante, sem acinzentar
      I.mixes = [['#ffc98a', 0.12]]; I.mul = t === 'noite' ? [0.86, 0.82, 0.86] : [0.92, 0.88, 0.9];
      I.desat = 0.04; I.ink = '#4a3a4c'; I.shade = '#9a7a96';
    } else if (t === 'tarde') {
      I.mixes = [['#ffb784', 0.1]]; I.desat = 0; I.ink = '#5e4152'; I.shade = '#c896a2';
    } else if (t === 'manha') {
      I.mixes = [['#ffe2cf', 0.05]]; I.desat = 0; I.ink = '#574a63'; I.shade = '#b3a4cf';
    } else {
      I.mixes = []; I.desat = 0; I.ink = '#4f5470'; I.shade = '#a6a9d0';
    }
    if (GO.rain) { I.mixes = I.mixes.concat([['#9aa3b8', 0.12]]); I.desat = Math.max(I.desat, 0.14); }
    G = I;
    return G;
  }
  /** desenha com as cores de fora (a vista de uma janela, por exemplo) */
  function outside(fn) { const keep = G; G = GO; try { return fn(); } finally { G = keep; } }
  /** desenha com as cores puras do dia (o que aparece numa tela acesa) */
  function neutral(fn) {
    const keep = G;
    G = Object.assign({}, keep, { mixes: [], mul: null, desat: 0, ink: TIMES.dia.ink, shade: TIMES.dia.shade, night: false, snow: false, rain: false });
    try { return fn(); } finally { G = keep; }
  }

  /** cor do objeto na luz atual */
  function c(base) {
    let x = base;
    if (G.desat) x = desat(x, G.desat);
    for (const [m, t] of G.mixes) x = mix(x, m, t);
    if (G.mul) { const [r, g, b] = rgb(x); x = hex(r * G.mul[0], g * G.mul[1], b * G.mul[2]); }
    return x;
  }
  /** sombra chapada e contorno do objeto */
  const sh = (base, k) => mix(c(base), G.shade, k == null ? 0.26 : k);
  const ln = (base, k) => mix(c(base), G.ink, k == null ? 0.55 : k);

  /* --------------------------------------------------- aleatório com semente */
  function rand(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ------------------------------------------- registro de defs por cenário */
  let prefix = 'k0_', counter = 0, DEFS = {}, auto = 0;
  function newPrefix() { counter += 1; prefix = 'k' + counter + '_'; DEFS = {}; auto = 0; return prefix; }
  const safe = (k) => String(k).replace(/[^\w-]/g, '_');
  /** registra uma definição (degradê, recorte...) uma única vez */
  function def(key, make) { const k = safe(key); if (!DEFS[k]) DEFS[k] = make(prefix + k); return 'url(#' + prefix + k + ')'; }
  function takeDefs() { const s = Object.values(DEFS).join(''); DEFS = {}; return s; }
  const f = (n) => (Math.round(n * 10) / 10).toString();
  /** degradê vertical em coordenadas da cena (só para céus e vistas de janela) */
  function vgrad(stops, y1, y2) {
    return def('vg' + auto++, (i) => `<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(y1)}" x2="0" y2="${f(y2)}">${stops.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"/>`).join('')}</linearGradient>`);
  }
  /** recorte a partir de formas */
  function clip(parts) { return def('cl' + auto++, (i) => `<clipPath id="${i}">${parts}</clipPath>`); }

  /* ------------------------------------------------------- construtores SVG */
  const S = {
    svg(body, o) {
      const q = o || {};
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${q.w || W} ${q.h || H}" preserveAspectRatio="${q.par || 'xMidYMid slice'}" width="100%" height="100%">${body}</svg>`;
    },
    rect: (x, y, w, h, fill, x2) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"${x2 ? ' ' + x2 : ''}/>`,
    circle: (cx, cy, r, fill, x2) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${x2 ? ' ' + x2 : ''}/>`,
    ellipse: (cx, cy, rx, ry, fill, x2) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${x2 ? ' ' + x2 : ''}/>`,
    path: (d, fill, x2) => `<path d="${d}" fill="${fill}"${x2 ? ' ' + x2 : ''}/>`,
    g: (body, x2) => `<g${x2 ? ' ' + x2 : ''}>${body}</g>`,
    text: (x, y, str, fill, size, x2) => `<text x="${f(x)}" y="${f(y)}" fill="${fill}" font-family="Fredoka, 'M PLUS Rounded 1c', sans-serif" font-weight="600" font-size="${size}" text-anchor="middle"${x2 ? ' ' + x2 : ''}>${str}</text>`,
  };
  // formas "sem cor", para usar dentro de union() e clip()
  const P = {
    c: (cx, cy, r) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"/>`,
    e: (cx, cy, rx, ry) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}"/>`,
    r: (x, y, w, h, rx) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${rx ? ` rx="${f(rx)}"` : ''}/>`,
    p: (d) => `<path d="${d}"/>`,
  };

  /* --------------------------------------------------------- traço e forma */
  const LW = 4, LM = 3, LF = 2;
  const ST = (col, w) => (w ? ` stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"` : '');
  /** caminho preenchido com contorno */
  function shape(d, base, o) {
    const q = o || {};
    const w = q.w == null ? LW : q.w;
    return `<path d="${d}" fill="${q.f || c(base)}"${ST(q.l || ln(base, q.lk), w)}${q.x ? ' ' + q.x : ''}/>`;
  }
  /** retângulo (arredondado) com contorno */
  function box(x, y, w, h, base, o) {
    const q = o || {};
    const lw = q.w == null ? LW : q.w;
    return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${q.r ? ` rx="${f(q.r)}"` : ''} fill="${q.f || c(base)}"${ST(q.l || ln(base, q.lk), lw)}${q.x ? ' ' + q.x : ''}/>`;
  }
  function disc(cx, cy, r, base, o) {
    const q = o || {};
    const w = q.w == null ? LW : q.w;
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${q.f || c(base)}"${ST(q.l || ln(base, q.lk), w)}${q.x ? ' ' + q.x : ''}/>`;
  }
  function oval(cx, cy, rx, ry, base, o) {
    const q = o || {};
    const w = q.w == null ? LW : q.w;
    return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${q.f || c(base)}"${ST(q.l || ln(base, q.lk), w)}${q.x ? ' ' + q.x : ''}/>`;
  }
  /** linha solta (detalhes) */
  function line(d, col, w, x2) { return `<path d="${d}" fill="none"${ST(col, w)}${x2 ? ' ' + x2 : ''}/>`; }
  /** linha reta */
  function seg(x1, y1, x2, y2, col, w) { return `<path d="M${f(x1)},${f(y1)}L${f(x2)},${f(y2)}" fill="none"${ST(col, w)}/>`; }
  /**
   * várias formas fundidas numa só: o contorno fica só por fora e, com
   * "off", a mesma forma deslocada (e recortada pela original) desenha uma
   * sombra chapada na borda oposta à luz.
   */
  function union(parts, base, o) {
    const q = o || {};
    const w = q.w == null ? LW : q.w;
    const fc = q.f || c(base), lc = q.l || ln(base, q.lk), scol = q.s || sh(base, q.sk);
    let s = '';
    if (w) s += `<g fill="${lc}" stroke="${lc}" stroke-width="${2 * w}" stroke-linejoin="round">${parts}</g>`;
    if (q.off) {
      s += `<g fill="${scol}">${parts}</g><g clip-path="${clip(parts)}"><g fill="${fc}" transform="translate(${f(q.off[0])} ${f(q.off[1])})">${parts}</g></g>`;
    } else s += `<g fill="${fc}">${parts}</g>`;
    return s;
  }
  /** traços grossos com contorno (galhos, postes, arames) */
  function tube(d, base, width, o) {
    const q = o || {};
    const w = q.w == null ? LM : q.w;
    const fc = q.f || c(base), lc = q.l || ln(base, q.lk);
    return (w ? `<path d="${d}" fill="none" stroke="${lc}" stroke-width="${f(width + 2 * w)}" stroke-linecap="round" stroke-linejoin="round"/>` : '') +
      `<path d="${d}" fill="none" stroke="${fc}" stroke-width="${f(width)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  /** sombra de contato chapada no chão */
  function contact(cx, cy, rx, ry, k) { return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${G.ink}" opacity="${k || 0.14}"/>`; }

  /* ------------------------------------------------------------ geometria */
  /** caminho suave por pontos (Catmull-Rom → Bézier) */
  function smooth(pts, close) {
    if (pts.length < 2) return '';
    const n = pts.length;
    const Pt = (i) => (close ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    const segs = close ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = Pt(i - 1), p1 = Pt(i), p2 = Pt(i + 1), p3 = Pt(i + 2);
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
    }
    return d + (close ? ' Z' : '');
  }
  /** retângulo com cantos de cima arredondados (portas, janelas em arco) */
  function archD(x, y, w, h, r) {
    const rr = Math.min(r, w / 2);
    return `M${f(x)},${f(y + h)} L${f(x)},${f(y + rr)} A${f(rr)},${f(rr)} 0 0 1 ${f(x + rr)},${f(y)} L${f(x + w - rr)},${f(y)} A${f(rr)},${f(rr)} 0 0 1 ${f(x + w)},${f(y + rr)} L${f(x + w)},${f(y + h)} Z`;
  }
  /** estrela de quatro pontas (brilho de cartum, chapado) */
  function twinkleD(x, y, r) {
    const k = r * 0.22;
    return `M${f(x)},${f(y - r)} Q${f(x + k)},${f(y - k)} ${f(x + r)},${f(y)} Q${f(x + k)},${f(y + k)} ${f(x)},${f(y + r)} Q${f(x - k)},${f(y + k)} ${f(x - r)},${f(y)} Q${f(x - k)},${f(y - k)} ${f(x)},${f(y - r)} Z`;
  }
  /** estrela de cinco pontas arredondada */
  function starD(x, y, r, rot) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = (rot || 0) - Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.48 : r;
      d += (i ? 'L' : 'M') + f(x + Math.cos(a) * rr) + ',' + f(y + Math.sin(a) * rr);
    }
    return d + 'Z';
  }

  /* ================================================================ CÉU */
  /** céu: o único degradê do estilo, suave, do alto até o horizonte */
  function sky(horizon) {
    const hz = horizon || 640;
    return S.svg(S.rect(0, 0, W, H, vgrad(G.sky, 0, hz)));
  }
  /** sol chapado, sem brilho */
  function sun(x, y, r, col) {
    const cc = col || G.sunC || '#fff3d4';
    return disc(x, y, r, cc, { f: cc, l: mix(cc, G.ink, 0.22), w: LM });
  }
  /** lua cheia com duas crateras; red = lua vermelha */
  function moon(x, y, r, red) {
    const body = red ? '#e05a55' : '#fff1c2';
    const line2 = red ? '#9e2f3a' : '#d8c38c';
    const crater = red ? '#c94a49' : '#f2e0aa';
    return disc(x, y, r, body, { f: body, l: line2, w: LM }) +
      S.circle(x - r * 0.3, y - r * 0.18, r * 0.2, crater) + S.circle(x + r * 0.28, y + r * 0.3, r * 0.13, crater) + S.circle(x + r * 0.2, y - r * 0.38, r * 0.08, crater);
  }
  /** estrelinhas paradas: pontinhos e algumas de quatro pontas */
  function stars(seed, n, o) {
    const q = o || {};
    const r = rand(seed);
    const y0 = q.y0 || 20, y1 = q.y1 || 520;
    const avoid = q.avoid; // [x0, x1, y1]: área a evitar (atrás da cabeça das personagens)
    let b = '';
    let placed = 0, tries = 0;
    while (placed < n && tries < n * 6) {
      tries++;
      const x = r() * W, y = y0 + Math.pow(r(), 1.35) * (y1 - y0);
      if (avoid && x > avoid[0] && x < avoid[1] && y < avoid[2]) continue;
      const k = r();
      const col = k < 0.5 ? '#fff6d2' : k < 0.8 ? '#ffffff' : '#ffe6a6';
      if (k < 0.16) b += S.path(twinkleD(x, y, 5 + r() * 5), col);
      else b += S.circle(x, y, 1.2 + r() * 1.6, col, `opacity="${f(0.55 + r() * 0.45)}"`);
      placed++;
    }
    return b;
  }

  /** nuvem de cartum com fundo reto; (x, y) = meio da base */
  function cloudParts(x, y, w, r) {
    const h = w * 0.34;
    let p = P.r(x - w / 2, y - h * 0.42, w, h * 0.42, h * 0.21);
    p += P.c(x - w * 0.27, y - h * 0.4, h * 0.36 + r() * h * 0.06);
    p += P.c(x - w * 0.02, y - h * 0.56, h * 0.5 + r() * h * 0.08);
    p += P.c(x + w * 0.26, y - h * 0.42, h * 0.34 + r() * h * 0.06);
    return p;
  }
  function cloud(x, y, w, seed, o) {
    const q = o || {};
    const r = rand(seed || 3);
    const base = q.color || G.cloud;
    return union(cloudParts(x, y, w, r), base, { f: base, l: mix(base, G.ink, q.night ? 0.42 : 0.3), s: mix(base, G.shade, 0.28), off: [0, -w * 0.05], w: q.w || LM });
  }
  /**
   * camada de nuvens que desliza devagar: as nuvens são desenhadas duas
   * vezes (em x e x + 1920) num SVG de 3840 px, para o laço não ter emenda
   */
  function cloudLayer(list, o) {
    let b = '';
    list.forEach((cl, i) => {
      const [x, y, w] = cl;
      b += cloud(x, y, w, 11 + i * 7, o) + cloud(x + W, y, w, 11 + i * 7, o);
    });
    return S.svg(b, { w: W * 2, par: 'none' });
  }

  /* ============================================================ NATUREZA */
  const LEAF = {
    verde: '#86c993', escuro: '#68b38c', claro: '#a9d98f', sakura: '#f7c5d4', outono: '#f2a862',
    vermelho: '#e98a6d', amarelo: '#f2ca62', pinho: '#6aa889', palmeira: '#7cc58c',
  };
  const TRUNK = '#a77d63', TRUNK_SAKURA = '#8f6b73';
  const SNOWC = '#f7faff';

  /** copa redonda de cartum: um centro e bolhas em volta */
  function canopyParts(cx, cy, R, r, n, sq) {
    const k = n || 7;
    const s2 = sq || 0.9;
    let p = P.e(cx, cy, R * 0.74, R * 0.74 * s2);
    const a0 = r() * TAU;
    for (let i = 0; i < k; i++) {
      const a = a0 + (i / k) * TAU;
      const rr = R * (0.42 + r() * 0.12);
      const d = R - rr;
      p += P.c(cx + Math.cos(a) * d, cy + Math.sin(a) * d * s2, rr);
    }
    return p;
  }
  /** neve em cima de uma forma (recortada por ela) */
  function snowCap(parts, cx, top, w) {
    const cap = P.e(cx, top, w * 0.55, w * 0.2) + P.e(cx - w * 0.28, top + w * 0.08, w * 0.3, w * 0.14) + P.e(cx + w * 0.3, top + w * 0.07, w * 0.28, w * 0.13);
    return `<g clip-path="${clip(parts)}" fill="${c(SNOWC)}">${cap}</g>`;
  }
  /**
   * árvore de cartum. (x, y) = pé do tronco no chão; s = escala
   * (1 ≈ 330 px de altura). kind: verde, escuro, claro, sakura, outono,
   * vermelho, amarelo.
   */
  function tree(x, y, s, o) {
    const q = o || {};
    const r = rand(q.seed || 7);
    const kind = q.kind || 'verde';
    const leaf = LEAF[kind] || kind;
    const w = q.w == null ? LW : q.w;
    const th = (q.trunk || 120) * s, R = (q.R || 96) * s;
    const tb = 17 * s, tt = 10 * s;
    const cx = x + (q.lean || 0) * s, cy = y - th - R * 0.6;
    const trunkCol = kind === 'sakura' ? TRUNK_SAKURA : TRUNK;
    let b = '';
    if (!q.noShadow) b += contact(x, y + 2, R * 0.72, Math.max(6, R * 0.11));
    const top = y - th - R * 0.35;
    const trunkD = `M${f(x - tb)},${f(y)} C${f(x - tb * 0.7)},${f(y - th * 0.35)} ${f(x - tt)},${f(y - th * 0.7)} ${f(cx - tt)},${f(top)} L${f(cx + tt)},${f(top)} C${f(x + tt)},${f(y - th * 0.7)} ${f(x + tb * 0.7)},${f(y - th * 0.35)} ${f(x + tb)},${f(y)} Z`;
    b += shape(trunkD, trunkCol, { w });
    // galhinho saindo do tronco
    if (s > 0.5 && !q.plain) b += tube(`M${f(x + tt * 0.4)},${f(y - th * 0.62)} q${f(16 * s)},${f(-10 * s)} ${f(30 * s)},${f(-30 * s)}`, trunkCol, 7 * s, { w: Math.max(2, w - 1) });
    // sombra da copa no alto do tronco (o mesmo marrom, mais escuro)
    b += `<g clip-path="${clip(P.p(trunkD))}">${S.rect(x - tb * 2, top, tb * 4, th * 0.2 + R * 0.35, ln(trunkCol, 0.26))}</g>`;
    const parts = canopyParts(cx, cy, R, r, q.n, q.sq);
    b += union(parts, leaf, { w, off: [-R * 0.1, -R * 0.13], sk: 0.3 });
    if (G.snow) b += snowCap(parts, cx - R * 0.08, cy - R * 0.86, R * 1.25);
    if (kind === 'sakura' && !G.snow) {
      // florzinhas mais claras espalhadas pela copa
      for (let i = 0; i < 9; i++) {
        const a = r() * TAU, d = Math.sqrt(r()) * R * 0.62;
        b += S.circle(cx + Math.cos(a) * d - R * 0.08, cy + Math.sin(a) * d * 0.8 - R * 0.1, (4 + r() * 3) * s * 1.4, c('#ffe8ef'));
      }
    }
    return b;
  }
  /** fileira de árvores ao longe (só copas, sem detalhes) */
  function treeRow(seed, x0, x1, y, n, s0, s1, kind, o) {
    const q = o || {};
    const r = rand(seed);
    let b = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + ((x1 - x0) * (i + 0.2 + r() * 0.6)) / n;
      const s = s0 + r() * (s1 - s0);
      const R = 96 * s;
      const parts = canopyParts(x, y - R * 0.55, R, r, 6, 0.95);
      b += union(parts, q.leaf || LEAF[kind || 'verde'], { w: q.w == null ? LF : q.w, off: [-R * 0.08, -R * 0.12], f: q.f, l: q.l, s: q.s });
      if (G.snow) b += snowCap(parts, x - R * 0.08, y - R * 0.55 - R * 0.86, R * 1.2);
    }
    return b;
  }
  /** pinheiro japonês (jardins): tronco torto e almofadas de folhas */
  function pine(x, y, s, o) {
    const q = o || {};
    const w = q.w == null ? LW : q.w;
    const leaf = LEAF.pinho;
    let b = contact(x, y + 2, 120 * s, 12 * s);
    b += tube(`M${f(x)},${f(y)} C${f(x - 10 * s)},${f(y - 90 * s)} ${f(x + 50 * s)},${f(y - 140 * s)} ${f(x + 20 * s)},${f(y - 230 * s)}`, '#8f6a55', 26 * s, { w });
    b += tube(`M${f(x + 26 * s)},${f(y - 150 * s)} q${f(-60 * s)},${f(-10 * s)} ${f(-120 * s)},${f(-20 * s)}`, '#8f6a55', 13 * s, { w: w - 1 });
    b += tube(`M${f(x + 30 * s)},${f(y - 190 * s)} q${f(60 * s)},${f(-6 * s)} ${f(110 * s)},${f(-30 * s)}`, '#8f6a55', 11 * s, { w: w - 1 });
    const pads = [[x - 110 * s, y - 182 * s, 92 * s], [x + 140 * s, y - 232 * s, 82 * s], [x + 18 * s, y - 262 * s, 104 * s]];
    for (const [px, py, pw] of pads) {
      const parts = P.e(px, py, pw, pw * 0.3) + P.e(px - pw * 0.42, py + pw * 0.06, pw * 0.48, pw * 0.24) + P.e(px + pw * 0.44, py + pw * 0.05, pw * 0.46, pw * 0.23) + P.e(px + pw * 0.05, py - pw * 0.18, pw * 0.55, pw * 0.22);
      b += union(parts, leaf, { w, off: [0, -pw * 0.1], sk: 0.32 });
      if (G.snow) b += `<g clip-path="${clip(parts)}" fill="${c(SNOWC)}">${P.e(px, py - pw * 0.3, pw * 1.1, pw * 0.22)}</g>`;
    }
    return b;
  }
  /** conífera em três andares */
  function conifer(x, y, s, o) {
    const q = o || {};
    const w = q.w == null ? LM : q.w;
    let b = contact(x, y + 2, 60 * s, 8 * s);
    b += box(x - 9 * s, y - 40 * s, 18 * s, 40 * s, TRUNK, { w });
    let parts = '';
    for (let i = 0; i < 3; i++) {
      const wd = (118 - i * 26) * s, yb = y - 32 * s - i * 62 * s, yt = yb - 100 * s;
      parts += P.p(`M${f(x - wd / 2)},${f(yb)} Q${f(x)},${f(yb + 16 * s)} ${f(x + wd / 2)},${f(yb)} L${f(x + 6 * s)},${f(yt)} Q${f(x)},${f(yt - 8 * s)} ${f(x - 6 * s)},${f(yt)} Z`);
    }
    b += union(parts, q.leaf || LEAF.pinho, { w, off: [-8 * s, -10 * s], sk: 0.3 });
    if (G.snow) b += `<g clip-path="${clip(parts)}" fill="${c(SNOWC)}">${P.e(x, y - 260 * s, 30 * s, 18 * s)}${P.e(x - 20 * s, y - 196 * s, 30 * s, 10 * s)}${P.e(x + 26 * s, y - 132 * s, 34 * s, 10 * s)}</g>`;
    return b;
  }
  /** palmeira (Del Mar, Dubai) */
  function palm(x, y, s, o) {
    const q = o || {};
    const w = q.w == null ? LW : q.w;
    const lean = (q.lean || 40) * s, h = (q.h || 380) * s;
    const tx = x + lean, ty = y - h;
    let b = contact(x, y + 2, 60 * s, 8 * s);
    const trunkD = `M${f(x)},${f(y)} Q${f(x + lean * 0.1)},${f(y - h * 0.55)} ${f(tx)},${f(ty)}`;
    b += tube(trunkD, '#c39a72', 24 * s, { w });
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
      const px = x + (lean * 0.1) * 2 * t * (1 - t) + lean * t * t, py = y - h * (2 * 0.55 * t * (1 - t)) - h * t * t;
      b += seg(px - 11 * s, py, px + 11 * s, py + 3 * s, ln('#c39a72', 0.4), 2);
    }
    const leaf = q.leaf || LEAF.palmeira;
    const angles = [-160, -128, -96, -64, -28, 6, 34];
    let parts = '';
    for (const a of angles) {
      const rad = (a * Math.PI) / 180;
      const L = (150 + (a > -100 && a < -60 ? -30 : 0)) * s;
      const ex = tx + Math.cos(rad) * L, ey = ty + Math.sin(rad) * L * 0.75 + 46 * s;
      const mx = tx + Math.cos(rad) * L * 0.55, my = ty + Math.sin(rad) * L * 0.55 - 24 * s;
      const nx = -Math.sin(rad) * 20 * s, ny = Math.cos(rad) * 20 * s;
      parts += P.p(`M${f(tx)},${f(ty)} Q${f(mx + nx)},${f(my + ny)} ${f(ex)},${f(ey)} Q${f(mx - nx)},${f(my - ny)} ${f(tx)},${f(ty)} Z`);
    }
    b += union(parts, leaf, { w, off: [0, -6 * s], sk: 0.3 });
    b += disc(tx, ty + 4 * s, 12 * s, '#a67c52', { w: w - 1 });
    return b;
  }
  /** árvore de galhos (inverno), com florzinhas opcionais */
  function bareTree(x, y, s, o) {
    const q = o || {};
    const r = rand(q.seed || 5);
    const w = q.w == null ? LW : q.w;
    const col = q.bark || '#8b6a58';
    const tips = [];
    let paths = [];
    function branch(x0, y0, ang, len, wd, depth) {
      const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
      const bend = (r() - 0.5) * len * 0.3;
      const mx = (x0 + x1) / 2 + Math.cos(ang + Math.PI / 2) * bend, my = (y0 + y1) / 2 + Math.sin(ang + Math.PI / 2) * bend;
      paths.push([`M${f(x0)},${f(y0)} Q${f(mx)},${f(my)} ${f(x1)},${f(y1)}`, wd]);
      if (depth <= 0) { tips.push([x1, y1]); return; }
      const n = depth > 1 ? 2 : 3;
      for (let i = 0; i < n; i++) {
        const na = ang + (i - (n - 1) / 2) * (0.55 + r() * 0.25) + (r() - 0.5) * 0.2;
        branch(x1, y1, na, len * (0.68 + r() * 0.12), wd * 0.6, depth - 1);
      }
      if (depth < 3) tips.push([(x0 + x1) / 2, (y0 + y1) / 2]);
    }
    branch(x, y, -Math.PI / 2 + (q.tilt || 0), (q.len || 150) * s, 30 * s, q.depth || 3);
    let b = contact(x, y + 2, 120 * s, 12 * s);
    // contorno de todos os galhos de uma vez, depois o miolo (as junções ficam limpas)
    const lc = ln(col);
    b += paths.map(([d, wd]) => `<path d="${d}" fill="none" stroke="${lc}" stroke-width="${f(wd + 2 * w)}" stroke-linecap="round"/>`).join('');
    b += paths.map(([d, wd]) => `<path d="${d}" fill="none" stroke="${c(col)}" stroke-width="${f(wd)}" stroke-linecap="round"/>`).join('');
    if (G.snow && !q.noSnow) b += paths.filter(([, wd]) => wd > 6 * s).map(([d, wd]) => `<path d="${d}" fill="none" stroke="${c(SNOWC)}" stroke-width="${f(wd * 0.45)}" stroke-linecap="round" transform="translate(0 ${f(-wd * 0.38)})"/>`).join('');
    if (q.flowers) {
      // florzinhas de cinco pétalas nas pontas dos galhos
      const fc = q.flowers;
      for (const [tx, ty] of tips) {
        const k = 2 + Math.floor(r() * 3);
        for (let i = 0; i < k; i++) {
          const fx = tx + (r() - 0.5) * 34 * s, fy = ty + (r() - 0.5) * 26 * s, fr = (5.5 + r() * 2.5) * s;
          const a0 = r() * TAU;
          let petals = '';
          for (let p = 0; p < 5; p++) { const a = a0 + (p / 5) * TAU; petals += P.c(fx + Math.cos(a) * fr * 0.62, fy + Math.sin(a) * fr * 0.62, fr * 0.52); }
          b += union(petals, fc, { w: 1.6, l: ln(fc, 0.45) }) + S.circle(fx, fy, fr * 0.3, c(q.center || '#c9852c'));
        }
      }
    }
    return b;
  }
  /** pedra de cartum: base reta e topo arredondado; (x, y) = meio da base */
  function rock(x, y, w, h, base, o) {
    const q = o || {};
    const col = base || '#b4b1c2';
    const d = `M${f(x - w / 2)},${f(y)} Q${f(x - w * 0.52)},${f(y - h * 0.62)} ${f(x - w * 0.22)},${f(y - h * 0.9)} Q${f(x + w * 0.02)},${f(y - h * 1.08)} ${f(x + w * 0.26)},${f(y - h * 0.84)} Q${f(x + w * 0.5)},${f(y - h * 0.6)} ${f(x + w / 2)},${f(y)} Z`;
    let b = shape(d, col, { w: q.w == null ? LW : q.w });
    // sombra chapada do lado direito
    b += `<g clip-path="${clip(P.p(d))}">${S.path(`M${f(x + w * 0.08)},${f(y + 4)} Q${f(x + w * 0.2)},${f(y - h * 0.5)} ${f(x + w * 0.16)},${f(y - h * 1.1)} L${f(x + w)},${f(y - h * 1.1)} L${f(x + w)},${f(y + 4)} Z`, sh(col, 0.32))}</g>`;
    b += `<path d="${d}" fill="none"${ST(ln(col), q.w == null ? LW : q.w)}/>`;
    if (G.snow) b += `<g clip-path="${clip(P.p(d))}">${P.e(x - w * 0.05, y - h * 0.98, w * 0.42, h * 0.2).replace('/>', ` fill="${c(SNOWC)}"/>`)}</g>`;
    return b;
  }
  /** arbusto de bolhas; (x, y) = meio da base */
  function bush(x, y, w, h, base, o) {
    const q = o || {};
    const r = rand(q.seed || 9);
    let parts = P.r(x - w / 2, y - h * 0.5, w, h * 0.5, Math.min(h * 0.25, w * 0.2));
    const n = Math.max(3, Math.round(w / (h * 0.9)));
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const rr = h * (0.42 + r() * 0.14);
      parts += P.c(x - w / 2 + w * t, y - h + rr, rr);
    }
    let b = union(parts, base || LEAF.escuro, { w: q.w == null ? LW : q.w, off: [-h * 0.06, -h * 0.12], sk: 0.3 });
    if (G.snow) b += `<g clip-path="${clip(parts)}" fill="${c(SNOWC)}">${P.r(x - w / 2 - 10, y - h - 10, w + 20, h * 0.3 + 10, h * 0.15)}</g>`;
    return b;
  }
  /** tufinhos de grama (traços em "v") */
  function tufts(seed, x0, x1, y0, y1, n, base, o) {
    const r = rand(seed);
    const col = ln(base, (o && o.k) || 0.35);
    let d = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0);
      const s = 0.7 + ((y - y0) / Math.max(1, y1 - y0)) * 0.6;
      d += `M${f(x - 7 * s)},${f(y - 8 * s)} L${f(x - 2 * s)},${f(y)} L${f(x + 1 * s)},${f(y - 10 * s)} L${f(x + 4 * s)},${f(y)} L${f(x + 9 * s)},${f(y - 7 * s)}`;
    }
    return line(d, col, 2.5);
  }
  /** florzinhas no chão */
  function flowers(seed, x0, x1, y0, y1, n, colors) {
    const r = rand(seed);
    let b = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0);
      const col = colors[Math.floor(r() * colors.length)];
      const s = 4 + r() * 2;
      for (let k = 0; k < 5; k++) { const a = (k / 5) * TAU; b += S.circle(x + Math.cos(a) * s, y + Math.sin(a) * s * 0.8, s * 0.7, c(col)); }
      b += S.circle(x, y, s * 0.5, c('#ffe082'));
    }
    return b;
  }
  /** morros: contorno só em cima */
  function hills(seed, y, amp, base, o) {
    const q = o || {};
    const r = rand(seed);
    const n = q.n || 5;
    const pts = [[-40, y + (r() - 0.5) * amp]];
    for (let i = 1; i < n; i++) pts.push([(W * i) / n + (r() - 0.5) * 120, y - r() * amp]);
    pts.push([W + 40, y + (r() - 0.5) * amp]);
    const top = smooth(pts);
    const lw = q.w == null ? LF : q.w;
    return S.path(`${top} L${W + 40},${H + 20} L-40,${H + 20} Z`, q.f || c(base)) + (lw ? line(top, q.l || ln(base, 0.4), lw) : '');
  }
  /** chão chapado com a linha do horizonte */
  function ground(y, base, o) {
    const q = o || {};
    const col = G.snow && !q.noSnow ? SNOWC : base;
    const lw = q.w == null ? LM : q.w;
    return S.rect(-40, y, W + 80, H - y + 40, q.f || c(col)) + (lw ? seg(-40, y, W + 40, y, q.l || ln(col, 0.42), lw) : '');
  }
  /** cor de chão que vira neve quando neva */
  const groundCol = (base) => (G.snow ? SNOWC : base);

  /* ========================================================= CONSTRUÇÕES */
  /** janela simples: moldura, vidro chapado e cruz; acende à noite (lit) */
  function win(x, y, w, h, o) {
    const q = o || {};
    const lw = q.w == null ? LM : q.w;
    const frame = q.frame || '#ffffff';
    const on = q.lit && G.night;
    const glass = on ? LIT : c(q.glass || '#bfe0f1');
    const gl = on ? LIT_LINE : ln(q.glass || '#bfe0f1', 0.45);
    let b = '';
    if (q.arch) b += shape(archD(x, y, w, h, w / 2), frame, { w: lw });
    else b += box(x, y, w, h, frame, { w: lw, r: q.r || 3 });
    const m = q.m || Math.max(5, Math.min(w, h) * 0.09);
    if (q.arch) b += S.path(archD(x + m, y + m, w - 2 * m, h - 2 * m, (w - 2 * m) / 2), glass);
    else b += S.rect(x + m, y + m, w - 2 * m, h - 2 * m, glass, q.r ? `rx="${f(Math.max(0, q.r - 2))}"` : '');
    if (q.cross !== false) {
      const fc = c(frame);
      b += S.rect(x + w / 2 - m * 0.4, y + m, m * 0.8, h - 2 * m, fc);
      if (q.cross !== 'v') b += S.rect(x + m, y + (q.arch ? h * 0.58 : h / 2) - m * 0.4, w - 2 * m, m * 0.8, fc);
    }
    if (q.curtain && !on) b += S.rect(x + m, y + m, w - 2 * m, (h - 2 * m) * 0.22, c(q.curtain));
    void gl;
    if (q.sill) b += box(x - 6, y + h - 2, w + 12, 9, frame, { w: lw, r: 2 });
    return b;
  }
  /** grade de janelas iguais */
  function windows(x, y, cols, rows, w, h, gx, gy, o) {
    const q = o || {};
    const r = rand(q.seed || 4);
    let b = '';
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const lit = q.lit == null ? r() < 0.55 : typeof q.lit === 'number' ? r() < q.lit : q.lit;
        b += win(x + i * (w + gx), y + j * (h + gy), w, h, Object.assign({}, q, { lit }));
      }
    }
    return b;
  }
  /** cerca branca de pista: postes + duas travessas; y = topo, chão = y + h */
  function rail(x0, x1, y, h, o) {
    const q = o || {};
    const lw = q.w == null ? LM : q.w;
    const col = q.col || '#ffffff';
    const pw = q.pw || 12, rh = q.rh || 14, every = q.every || 150;
    let b = '';
    for (let x = x0 + (q.start || 40); x < x1; x += every) b += box(x - pw / 2, y, pw, h, col, { w: lw, r: 2 });
    b += box(x0 - 20, y, x1 - x0 + 40, rh, col, { w: lw, r: rh / 2 });
    if (!q.single) b += box(x0 - 20, y + h * 0.48, x1 - x0 + 40, rh * 0.75, col, { w: lw, r: rh / 3 });
    return b;
  }
  /** poste de luz; (x, y) = pé no chão. À noite a cúpula fica amarela chapada */
  function lamp(x, y, h, o) {
    const q = o || {};
    const lw = q.w == null ? LM : q.w;
    const col = q.col || '#5d6b86';
    const on = G.night || G.rain || q.on;
    let b = contact(x, y + 2, 26, 6);
    b += box(x - 14, y - 20, 28, 20, col, { w: lw, r: 4 });
    b += box(x - 5, y - h, 10, h - 18, col, { w: lw, r: 3 });
    const hy = y - h;
    b += shape(`M${f(x - 22)},${f(hy + 4)} L${f(x - 14)},${f(hy - 34)} L${f(x + 14)},${f(hy - 34)} L${f(x + 22)},${f(hy + 4)} Z`, on ? LIT : '#eef3f8', { w: lw, f: on ? LIT : c('#eef3f8'), l: on ? LIT_LINE : ln('#eef3f8') });
    b += box(x - 26, hy + 2, 52, 9, col, { w: lw, r: 4 });
    b += shape(`M${f(x - 18)},${f(hy - 32)} Q${f(x)},${f(hy - 56)} ${f(x + 18)},${f(hy - 32)} Z`, col, { w: lw });
    return b;
  }
  /** banco de praça visto de frente; (x, y) = meio, no chão */
  function bench(x, y, w, o) {
    const q = o || {};
    const lw = q.w == null ? LM : q.w;
    const wood = q.wood || '#c9946a', iron = q.iron || '#5f6a80';
    let b = contact(x, y + 2, w * 0.55, 8);
    b += box(x - w / 2 + 14, y - 46, 10, 46, iron, { w: lw, r: 2 }) + box(x + w / 2 - 24, y - 46, 10, 46, iron, { w: lw, r: 2 });
    b += box(x - w / 2 + 14, y - 104, 10, 60, iron, { w: lw, r: 2 }) + box(x + w / 2 - 24, y - 104, 10, 60, iron, { w: lw, r: 2 });
    b += box(x - w / 2, y - 112, w, 16, wood, { w: lw, r: 5 }) + box(x - w / 2, y - 88, w, 16, wood, { w: lw, r: 5 });
    b += box(x - w / 2 - 6, y - 56, w + 12, 16, wood, { w: lw, r: 5 });
    return b;
  }
  /** vaso com planta; (x, y) = base do vaso */
  function potPlant(x, y, s, o) {
    const q = o || {};
    const lw = q.w == null ? LM : q.w;
    const pot = q.pot || '#e59f7d';
    const r = rand(q.seed || 2);
    let b = contact(x, y + 2, 34 * s, 6 * s);
    let parts = '';
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.42;
      const L = (64 + r() * 22) * s;
      const ex = x + Math.cos(a) * L, ey = y - 58 * s + Math.sin(a) * L;
      const nx = -Math.sin(a) * 12 * s, ny = Math.cos(a) * 12 * s;
      parts += P.p(`M${f(x)},${f(y - 52 * s)} Q${f((x + ex) / 2 + nx)},${f((y - 52 * s + ey) / 2 + ny)} ${f(ex)},${f(ey)} Q${f((x + ex) / 2 - nx)},${f((y - 52 * s + ey) / 2 - ny)} ${f(x)},${f(y - 52 * s)} Z`);
    }
    b += union(parts, q.leaf || '#7fc492', { w: lw, off: [0, -4 * s] });
    b += shape(`M${f(x - 32 * s)},${f(y - 58 * s)} L${f(x + 32 * s)},${f(y - 58 * s)} L${f(x + 24 * s)},${f(y)} L${f(x - 24 * s)},${f(y)} Z`, pot, { w: lw });
    b += box(x - 36 * s, y - 66 * s, 72 * s, 14 * s, pot, { w: lw, r: 4 * s });
    return b;
  }
  /** lanterna de papel japonesa (chochin); acesa à noite */
  function chochin(x, y, s, o) {
    const q = o || {};
    const col = q.col || '#ee6b5f';
    const on = G.night || q.on;
    const body = on ? mix(col, '#ffd7a0', 0.25) : c(col);
    let b = seg(x, y - 36 * s, x, y - 20 * s, ROPE(), 2.5);
    b += box(x - 12 * s, y - 24 * s, 24 * s, 8 * s, '#3c3c4a', { w: 2, r: 2 });
    b += oval(x, y + 6 * s, 22 * s, 28 * s, col, { w: LM, f: body, l: ln(col, 0.5) });
    b += line(`M${f(x - 21 * s)},${f(y - 2 * s)} Q${f(x)},${f(y + 2 * s)} ${f(x + 21 * s)},${f(y - 2 * s)} M${f(x - 21 * s)},${f(y + 14 * s)} Q${f(x)},${f(y + 18 * s)} ${f(x + 21 * s)},${f(y + 14 * s)}`, ln(col, 0.35), 2);
    b += box(x - 11 * s, y + 31 * s, 22 * s, 7 * s, '#3c3c4a', { w: 2, r: 2 });
    if (q.mark) b += txt(x, y + 12 * s, q.mark, { size: 15 * s, font: 'jp', fill: on ? '#7a2d22' : ln(col, 0.7) });
    return b;
  }
  /** cor de corda/varal que aparece tanto de dia quanto contra o céu da noite */
  const ROPE = () => (G.night ? mix(c('#efe4d4'), '#ffffff', 0.25) : ln('#efe4d4', 0.45));
  /** varal de bandeirinhas ou lanternas entre dois pontos (catenária simples) */
  function stringLine(x0, y0, x1, y1, sag) {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag;
    return {
      d: `M${f(x0)},${f(y0)} Q${f(mx)},${f(my)} ${f(x1)},${f(y1)}`,
      at: (t) => [(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1],
      rope: () => line(`M${f(x0)},${f(y0)} Q${f(mx)},${f(my)} ${f(x1)},${f(y1)}`, ROPE(), 2.5),
    };
  }

  /* ============================================================ INTERIOR */
  /**
   * parede de fundo + rodapé + chão de tábuas visto de frente.
   * o: wall, floor, floorY (onde a parede encontra o chão), wain (altura do lambri),
   *    wainCol, ceil (faixa de teto), planks (n de linhas no chão)
   */
  function room(o) {
    const q = o || {};
    const fy = q.floorY || 780;
    let b = S.rect(0, 0, W, fy, c(q.wall || '#fdf2e4'));
    if (q.ceil) b += S.rect(0, 0, W, q.ceil, sh(q.wall || '#fdf2e4', 0.18)) + seg(0, q.ceil, W, q.ceil, ln(q.wall || '#fdf2e4', 0.35), LM);
    if (q.wain) {
      const wc = q.wainCol || '#e9d6c0';
      b += S.rect(0, fy - q.wain, W, q.wain, c(wc)) + seg(0, fy - q.wain, W, fy - q.wain, ln(wc, 0.45), LM);
      b += box(-10, fy - q.wain - 8, W + 20, 12, wc, { w: LM, r: 3 });
      if (q.panels) for (let x = q.panels / 2; x < W; x += q.panels) b += box(x - q.panels / 2 + 24, fy - q.wain + 26, q.panels - 48, q.wain - 60, wc, { w: 2, f: c(wc), l: ln(wc, 0.3), r: 6 });
    }
    const fl = q.floor || '#ddb88e';
    b += S.rect(0, fy, W, H - fy, c(fl));
    const n = q.planks == null ? 4 : q.planks;
    for (let i = 1; i <= n; i++) {
      const y = fy + (H - fy) * Math.pow(i / (n + 1), 1.35);
      b += seg(0, y, W, y, ln(fl, 0.25), 2);
    }
    b += S.rect(0, fy - 18, W, 18, c(q.base || '#c99a72')) + seg(0, fy - 18, W, fy - 18, ln(q.base || '#c99a72', 0.45), LM) + seg(0, fy, W, fy, ln(fl, 0.45), LM);
    return b;
  }
  /**
   * janela para fora: a vista usa a paleta de fora (céu, nuvens, morros,
   * árvores), depois a moldura. o: frame, cross, view(x,y,w,h) → svg extra
   */
  function windowOut(x, y, w, h, o) {
    const q = o || {};
    const lw = q.w == null ? LW : q.w;
    const frame = q.frame || '#ffffff';
    const m = q.m || 16;
    let view = '';
    outside(() => {
      const gx = x + m, gy = y + m, gw = w - 2 * m, gh = h - 2 * m;
      view += S.rect(gx, gy, gw, gh, vgrad(G.sky, gy - gh * 0.2, gy + gh * 1.1));
      if (G.night && !G.rain) {
        const r = rand(q.seed || 31);
        for (let i = 0; i < Math.round((gw * gh) / 9000); i++) view += S.circle(gx + r() * gw, gy + r() * gh * 0.6, 1.2 + r() * 1.3, '#fff6d2', `opacity="${f(0.5 + r() * 0.5)}"`);
      }
      if (q.cloud !== false && !G.night) view += cloud(gx + gw * 0.3, gy + gh * 0.32, Math.min(gw * 0.5, 220), 5);
      if (q.view) view += q.view(gx, gy, gw, gh);
      else {
        // morrinhos e copas de árvore ao longe, só na parte de baixo
        const hy = gy + gh * 0.78;
        view += S.path(smooth([[gx - 10, hy + 6], [gx + gw * 0.3, hy - gh * 0.08], [gx + gw * 0.62, hy], [gx + gw + 10, hy - gh * 0.1]]) + ` L${f(gx + gw + 10)},${f(gy + gh + 10)} L${f(gx - 10)},${f(gy + gh + 10)} Z`, c('#9fcf9a'));
        view += treeRow(q.seed || 8, gx - 20, gx + gw + 20, gy + gh + 6, Math.max(2, Math.round(gw / 150)), 0.32, 0.46, 'verde');
      }
    });
    let b = `<g clip-path="${clip(P.r(x + m, y + m, w - 2 * m, h - 2 * m))}">${view}</g>`;
    // moldura: 4 lados + travessas
    const fc = c(frame), lc = ln(frame, 0.45);
    const fr = `M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)} Z M${f(x + m)},${f(y + m)} v${f(h - 2 * m)} h${f(w - 2 * m)} v${f(-(h - 2 * m))} Z`;
    b += `<path d="${fr}" fill="${fc}" fill-rule="evenodd"${ST(lc, lw)}/>`;
    if (q.cross !== false) {
      const cols = q.cols || 2, rows = q.rows || 1;
      for (let i = 1; i < cols; i++) b += box(x + (w * i) / cols - m * 0.35, y + m - 1, m * 0.7, h - 2 * m + 2, frame, { w: 2, l: lc });
      for (let j = 1; j < rows; j++) b += box(x + m - 1, y + (h * j) / rows - m * 0.35, w - 2 * m + 2, m * 0.7, frame, { w: 2, l: lc });
    }
    if (q.sill !== false) b += box(x - 14, y + h - 4, w + 28, 16, frame, { w: lw, r: 4 });
    return b;
  }
  /** cortina presa de lado; side: 'e' (esquerda) ou 'd' */
  function curtain(x, y, w, h, side, base) {
    const col = base || '#f3b6b2';
    const dir = side === 'd' ? -1 : 1;
    const x0 = x, x1 = x + w * dir;
    const tie = y + h * 0.58;
    const d = `M${f(x0)},${f(y)} L${f(x1)},${f(y)} Q${f(x1 - dir * w * 0.1)},${f(tie - h * 0.2)} ${f(x0 + dir * w * 0.42)},${f(tie)} Q${f(x0 + dir * w * 0.5)},${f(y + h * 0.82)} ${f(x0 + dir * w * 0.62)},${f(y + h)} L${f(x0)},${f(y + h)} Z`;
    let b = shape(d, col, { w: LM });
    b += line(`M${f(x0 + dir * w * 0.25)},${f(y + 6)} Q${f(x0 + dir * w * 0.28)},${f(tie - 60)} ${f(x0 + dir * w * 0.22)},${f(tie)} M${f(x0 + dir * w * 0.12)},${f(tie + 20)} L${f(x0 + dir * w * 0.2)},${f(y + h - 6)}`, ln(col, 0.4), 2.5);
    b += box(x0 + dir * w * 0.3 - 8, tie - 8, 26, 16, '#e3c27a', { w: 2, r: 6 });
    return b;
  }
  /** estante com livros; (x, y) = canto de cima à esquerda */
  function bookcase(x, y, w, h, o) {
    const q = o || {};
    const r = rand(q.seed || 12);
    const wood = q.wood || '#b98a63';
    const shelves = q.shelves || 4;
    let b = box(x, y, w, h, wood, { w: LW, r: 4 });
    const inner = sh(wood, 0.45);
    const sx = x + 14, sw = w - 28;
    const sh2 = (h - 28) / shelves;
    const colors = q.colors || ['#e98f8b', '#8fb5e3', '#f3cf7c', '#9fd0a4', '#c6a2dc', '#f2a978', '#8fc7c4'];
    for (let i = 0; i < shelves; i++) {
      const top = y + 14 + i * sh2;
      b += S.rect(sx, top, sw, sh2 - 12, inner);
      let bx = sx + 6;
      const lean = r() < 0.5;
      while (bx < sx + sw - 18) {
        if (r() < 0.12) { bx += 18 + r() * 20; continue; }
        const bw = 14 + r() * 14, bh = (sh2 - 12) * (0.62 + r() * 0.3);
        if (bx + bw > sx + sw - 6) break;
        const col = colors[Math.floor(r() * colors.length)];
        b += box(bx, top + sh2 - 12 - bh, bw, bh, col, { w: 2, r: 2 });
        if (r() < 0.5) b += S.rect(bx + 3, top + sh2 - 12 - bh * 0.72, bw - 6, 4, sh(col, 0.4));
        bx += bw + 2;
      }
      if (lean && bx < sx + sw - 40) {
        const col = colors[Math.floor(r() * colors.length)];
        const bh = (sh2 - 12) * 0.7;
        b += `<g transform="rotate(14 ${f(bx + 4)} ${f(top + sh2 - 12)})">${box(bx + 4, top + sh2 - 12 - bh, 16, bh, col, { w: 2, r: 2 })}</g>`;
      }
      b += box(x + 6, top + sh2 - 14, w - 12, 12, wood, { w: LM, r: 2 });
    }
    return b;
  }
  /** quadro com moldura e uma imagem simples dentro (art(x,y,w,h) → svg) */
  function frameArt(x, y, w, h, o) {
    const q = o || {};
    const fr = q.frame || '#c99a6a';
    let b = box(x, y, w, h, fr, { w: LM, r: 3 });
    const m = q.m || 10;
    const inner = S.rect(x + m, y + m, w - 2 * m, h - 2 * m, c(q.bg || '#fdf8ee'));
    b += inner;
    if (q.art) b += `<g clip-path="${clip(P.r(x + m, y + m, w - 2 * m, h - 2 * m))}">${q.art(x + m, y + m, w - 2 * m, h - 2 * m)}</g>`;
    b += `<rect x="${f(x + m)}" y="${f(y + m)}" width="${f(w - 2 * m)}" height="${f(h - 2 * m)}" fill="none"${ST(ln(fr, 0.4), 2)}/>`;
    return b;
  }
  /** relógio de parede */
  function wallClock(x, y, r, o) {
    const q = o || {};
    const t = { manha: [8, 5], dia: [12, 30], tarde: [17, 10], crepusculo: [18, 40], noite: [21, 15] }[GO.time] || [10, 10];
    const ha = ((t[0] % 12) / 12 + t[1] / 720) * TAU - Math.PI / 2, ma = (t[1] / 60) * TAU - Math.PI / 2;
    let b = disc(x, y, r, q.rim || '#8f7a9a', { w: LM });
    b += S.circle(x, y, r * 0.82, c('#fffdf6'));
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; b += S.circle(x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66, i % 3 ? 1.6 : 2.8, ln('#fffdf6', 0.6)); }
    b += seg(x, y, x + Math.cos(ha) * r * 0.4, y + Math.sin(ha) * r * 0.4, ln('#fffdf6', 0.7), 4);
    b += seg(x, y, x + Math.cos(ma) * r * 0.6, y + Math.sin(ma) * r * 0.6, ln('#fffdf6', 0.7), 3);
    return b;
  }
  /** luminária pendente de teto; acesa à noite (cúpula amarela chapada) */
  function pendant(x, y, len, o) {
    const q = o || {};
    const col = q.col || '#f2c27a';
    const on = q.on != null ? q.on : GO.night || GO.rain;
    let b = seg(x, y, x, y + len, ln('#6b5b6e'), 2.5);
    const sy = y + len;
    b += shape(`M${f(x - 40)},${f(sy + 34)} Q${f(x - 34)},${f(sy)} ${f(x)},${f(sy)} Q${f(x + 34)},${f(sy)} ${f(x + 40)},${f(sy + 34)} Z`, col, { w: LM });
    b += oval(x, sy + 34, 40, 7, on ? LIT : '#fff4dc', { w: 2, f: on ? LIT : c('#fff4dc'), l: on ? LIT_LINE : ln('#fff4dc', 0.4) });
    return b;
  }
  /** tapete oval no chão */
  function rug(x, y, rx, ry, base, o) {
    const q = o || {};
    let b = oval(x, y, rx, ry, base, { w: LM });
    b += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx - 22)}" ry="${f(ry - 8)}" fill="none"${ST(q.inner || lighten(c(base), 0.4), 3)} stroke-dasharray="2 12"/>`;
    return b;
  }

  /* --------------------------------------------- escritas, placas e cartazes
     Letreiros e avisos dão a cada lugar um detalhe próprio (o nome da loja,
     o horário do treino, a placa da árvore), sem textura: só cor chapada,
     contorno e letra. */
  const FONTS = { sign: "Fredoka, 'M PLUS Rounded 1c', sans-serif", jp: "'M PLUS Rounded 1c', Fredoka, sans-serif", hand: "Caveat, 'Segoe Print', cursive" };
  const escT = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /** texto do cenário: { size, fill, font: sign | jp | hand, weight, anchor, rot, op, ls } */
  function txt(x, y, str, o) {
    const q = o || {};
    const rot = q.rot ? ` transform="rotate(${f(q.rot)} ${f(x)} ${f(y)})"` : '';
    const wt = q.weight || (q.font === 'hand' ? 700 : q.font === 'jp' ? 800 : 600);
    return `<text x="${f(x)}" y="${f(y)}" fill="${q.fill || c('#4a4458')}" font-family="${FONTS[q.font || 'sign']}" font-weight="${wt}" font-size="${f(q.size || 24)}" text-anchor="${q.anchor || 'middle'}"${q.ls ? ` letter-spacing="${q.ls}"` : ''}${q.op ? ` opacity="${q.op}"` : ''}${rot}>${escT(str)}</text>`;
  }
  /** placa retangular com uma ou mais linhas de texto; (x = meio, y = topo).
   *  Cada linha pode ser texto ou { t, size, fill, font }. Opções: base, ink, size, sub,
   *  font, r, w, inner (filete), posts (altura dos pés), hang (altura das correntes). */
  function sign(x, y, w, h, lines, o) {
    const q = o || {};
    const base = q.base || '#ffffff';
    let b = '';
    if (q.posts) for (const px of [x - w / 2 + Math.min(26, w * 0.2), x + w / 2 - Math.min(26, w * 0.2)]) b += box(px - 5, y + h - 6, 10, q.posts + 6, q.post || '#9a8574', { w: LM, r: 3 });
    if (q.pole) b += box(x - 6, y + h - 6, 12, q.pole + 6, q.post || '#8d98aa', { w: LM, r: 3 });
    if (q.hang) for (const px of [x - w * 0.3, x + w * 0.3]) b += seg(px, y - q.hang, px, y + 4, ln(q.hangCol || '#9aa4b3'), 2.5);
    b += box(x - w / 2, y, w, h, base, { w: q.w == null ? LM : q.w, r: q.r == null ? 8 : q.r, f: q.f, l: q.l });
    if (q.inner) b += `<rect x="${f(x - w / 2 + 7)}" y="${f(y + 7)}" width="${f(w - 14)}" height="${f(h - 14)}" rx="${f(Math.max(2, (q.r == null ? 8 : q.r) - 4))}" fill="none"${ST(q.inner, 2)}/>`;
    const L = [].concat(lines).map((s) => (typeof s === 'string' ? { t: s } : s));
    const size = q.size || Math.min((h / L.length) * 0.62, 34);
    const sizes = L.map((s, i) => s.size || (i === 0 ? size : size * (q.sub || 0.72)));
    const total = sizes.reduce((a, s) => a + s * 1.16, 0);
    let yy = y + h / 2 - total / 2;
    L.forEach((s, i) => {
      yy += sizes[i] * 1.16;
      b += txt(x, yy - sizes[i] * 0.24, s.t, { size: sizes[i], fill: s.fill || q.ink || ln(base, 0.78), font: s.font || q.font, weight: s.weight || q.weight, ls: s.ls || q.ls });
    });
    return b;
  }
  /** iconezinhos chapados para cartazes e placas */
  const ICONS = {
    estrela: (x, y, r, col) => shape(starD(x, y, r), col || '#f7c948', { w: 2 }),
    coracao: (x, y, r, col) => shape(`M${f(x)},${f(y + r * 0.9)} C${f(x - r * 1.3)},${f(y + r * 0.1)} ${f(x - r * 1.1)},${f(y - r * 1.05)} ${f(x)},${f(y - r * 0.38)} C${f(x + r * 1.1)},${f(y - r * 1.05)} ${f(x + r * 1.3)},${f(y + r * 0.1)} ${f(x)},${f(y + r * 0.9)} Z`, col || '#f27aa0', { w: 2 }),
    ferradura: (x, y, r, col) => tube(`M${f(x - r * 0.7)},${f(y + r * 0.8)} L${f(x - r * 0.7)},${f(y)} A${f(r * 0.7)},${f(r * 0.7)} 0 0 1 ${f(x + r * 0.7)},${f(y)} L${f(x + r * 0.7)},${f(y + r * 0.8)}`, col || '#b9c3d1', r * 0.36, { w: 2 }),
    cenoura: (x, y, r, col) => shape(`M${f(x - r * 0.42)},${f(y - r * 0.5)} L${f(x + r * 0.42)},${f(y - r * 0.5)} L${f(x)},${f(y + r)} Z`, col || '#f29a4a', { w: 2 }) + shape(`M${f(x)},${f(y - r * 0.5)} q${f(-r * 0.5)},${f(-r * 0.4)} ${f(-r * 0.3)},${f(-r * 0.75)} q${f(r * 0.2)},${f(r * 0.1)} ${f(r * 0.3)},${f(r * 0.45)} q${f(r * 0.1)},${f(-r * 0.35)} ${f(r * 0.3)},${f(-r * 0.45)} q${f(r * 0.2)},${f(r * 0.35)} ${f(-r * 0.3)},${f(r * 0.75)} Z`, '#7fc07a', { w: 2 }),
    nota: (x, y, r, col) => tube(`M${f(x + r * 0.3)},${f(y + r * 0.5)} L${f(x + r * 0.3)},${f(y - r * 0.8)} L${f(x + r * 0.8)},${f(y - r * 0.5)}`, col || '#7f9fd6', r * 0.2, { w: 2 }) + disc(x, y + r * 0.55, r * 0.36, col || '#7f9fd6', { w: 2 }),
    trofeu: (x, y, r, col) => shape(`M${f(x - r * 0.7)},${f(y - r * 0.8)} L${f(x + r * 0.7)},${f(y - r * 0.8)} Q${f(x + r * 0.7)},${f(y + r * 0.1)} ${f(x)},${f(y + r * 0.2)} Q${f(x - r * 0.7)},${f(y + r * 0.1)} ${f(x - r * 0.7)},${f(y - r * 0.8)} Z`, col || '#f2c94c', { w: 2 }) + box(x - r * 0.15, y + r * 0.2, r * 0.3, r * 0.4, col || '#f2c94c', { w: 2 }) + box(x - r * 0.5, y + r * 0.6, r, r * 0.25, col || '#f2c94c', { w: 2, r: 2 }),
    flor: (x, y, r, col) => { let b = ''; for (let k = 0; k < 5; k++) { const a = (k / 5) * TAU - Math.PI / 2; b += disc(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.42, col || '#f6a7b8', { w: 2 }); } return b + disc(x, y, r * 0.3, '#f9d36b', { w: 2 }); },
    sol: (x, y, r, col) => disc(x, y, r * 0.75, col || '#f9c74f', { w: 2 }),
    gota: (x, y, r, col) => shape(`M${f(x)},${f(y - r)} C${f(x + r * 0.2)},${f(y - r * 0.5)} ${f(x + r * 0.75)},${f(y)} ${f(x + r * 0.75)},${f(y + r * 0.35)} A${f(r * 0.75)},${f(r * 0.75)} 0 0 1 ${f(x - r * 0.75)},${f(y + r * 0.35)} C${f(x - r * 0.75)},${f(y)} ${f(x - r * 0.2)},${f(y - r * 0.5)} ${f(x)},${f(y - r)} Z`, col || '#8fd3ff', { w: 2 }),
  };
  /** cartaz de papel preso com tachinha: faixa colorida, título, ícone e linhas */
  function poster(x, y, w, h, o) {
    const q = o || {};
    const base = q.base || '#fffdf6';
    let b = box(x, y, w, h, base, { w: LF + 0.5, r: 3 });
    if (q.band) b += box(x + 5, y + 5, w - 10, Math.max(14, h * 0.24), q.band, { w: 0, r: 2 });
    let ty = y + Math.max(14, h * 0.24) / 2 + 5;
    if (q.title) b += txt(x + w / 2, ty + (q.ts || Math.min(w * 0.14, 20)) * 0.36, q.title, { size: q.ts || Math.min(w * 0.14, 20), fill: q.band ? '#ffffff' : q.tc || ln(base, 0.75), font: q.font, weight: 700 });
    const iy = q.title ? y + h * 0.52 : y + h * 0.42;
    if (q.icon && ICONS[q.icon]) b += ICONS[q.icon](x + w / 2, iy, Math.min(w, h) * 0.17, q.ic);
    if (q.text) [].concat(q.text).forEach((s, i) => { b += txt(x + w / 2, y + h * (q.icon ? 0.78 : 0.56) + i * (q.ls2 || 15), s, { size: q.size || Math.min(w * 0.1, 15), fill: ln(base, 0.65), font: q.tfont || q.font }); });
    else for (let i = 0; i < (q.lines == null ? 2 : q.lines); i++) { const ly = y + h * 0.76 + i * 9; b += seg(x + w * 0.2, ly, x + w * (0.8 - (i % 2) * 0.16), ly, ln(base, 0.3), 2); }
    b += S.circle(x + w / 2, y + 7, 4.5, c(q.pin || '#ef7d76')) + S.circle(x + w / 2 - 1.5, y + 5.5, 1.5, c('#ffffff'));
    return q.rot ? `<g transform="rotate(${f(q.rot)} ${f(x + w / 2)} ${f(y + h / 2)})">${b}</g>` : b;
  }
  /** poste de distância com a placa em cima (como os das pistas de corrida) */
  function distPost(x, y, label, s) {
    const k = s || 1;
    let b = box(x - 6 * k, y - 190 * k, 12 * k, 190 * k, '#ffffff', { w: LM, r: 3 });
    for (let i = 0; i < 4; i++) b += S.rect(x - 4 * k, y - 180 * k + i * 40 * k, 8 * k, 18 * k, c('#ef7d76'));
    b += box(x - 46 * k, y - 252 * k, 92 * k, 62 * k, '#ffffff', { w: LM, r: 8 * k });
    b += txt(x, y - 209 * k, label, { size: 30 * k, fill: ln('#ffffff', 0.8) });
    return b;
  }

  VN.Kit = {
    txt, sign, poster, distPost, ICONS, FONTS,
    W, H, TAU, TIMES, S, P,
    rgb, hex, mix, desat, lighten, darken, c, sh, ln, LIT, LIT_LINE, SNOWC,
    rand, def, takeDefs, newPrefix, f, vgrad, clip,
    setTime, inside, outside, neutral,
    get G() { return G; },
    get GO() { return GO; },
    LW, LM, LF, ST, shape, box, disc, oval, line, seg, union, tube, contact,
    smooth, archD, twinkleD, starD,
    sky, sun, moon, stars, cloud, cloudParts, cloudLayer,
    LEAF, TRUNK, canopyParts, snowCap, tree, treeRow, pine, conifer, palm, bareTree, rock, bush, tufts, flowers, hills, ground, groundCol,
    win, windows, rail, lamp, bench, potPlant, chochin, stringLine,
    room, windowOut, curtain, bookcase, frameArt, wallClock, pendant, rug,
  };
})();
