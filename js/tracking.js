/* =========================================================================
   Tracking System: as corridas vistas de cima, como nos mangás e animes de
   Umamusume. Cada corredora é uma gota numerada que aponta para onde corre.
   As personagens do elenco usam as cores oficiais (da API); as demais usam
   retículas em preto e branco. A câmera acompanha o pelotão pela pista de
   verdade de cada hipódromo (curvas, postes de distância, linha de chegada),
   e o roteiro conduz a corrida com @tracking:

     @tracking on v_derby                  abre o painel, todas no portão
     @tracking ordem 6 / 4 8 // * /// 11    formação (fileiras de dentro para fora)
     @tracking ir ultima                   avança até a última curva
     @tracking marca 11 !!                 símbolo sobre a corredora
     @tracking off                         fecha

   (lista completa no README, seção "Tracking System")
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const NS = 'http://www.w3.org/2000/svg';
  const LEN = 3.0; // um "corpo" no desenho, em metros (exagerado para os marcadores não se encostarem)
  const LANE = 3.0; // distância entre raias, em metros
  const RAIL0 = 1.6; // da cerca interna até a raia 0
  const INK = '#26222d';
  const ROW = { '/': 1.18, '//': 2.5, '///': 5.0 }; // espaço entre fileiras, em corpos
  const R0 = 30; // raio de desenho dos marcadores (depois escalado)
  const SYMS = ['!', '!!', '?', '#', '…', '...', '♪', '♥', '★', '☾', '×', 'gota', '-'];
  const AURAS = ['branca', 'vermelha', 'dourada', 'off'];
  const TRAILS = ['cor', 'vermelho', 'estrela', 'off'];
  const ZOOMS = { perto: 30, medio: 21, longe: 12 };
  const POINTS = ['largada', 'curva1', 'curva2', 'oposta', 'curva3', 'curva4', 'ultima', 'reta', 'chegada', 'apos'];
  const MARGINS = { focinho: 'focinho', cabeca: 'cabeça', 'cabeça': 'cabeça', pescoco: 'pescoço', 'pescoço': 'pescoço' };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mod = (a, n) => ((a % n) + n) % n;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const f1 = (v) => Math.round(v * 10) / 10;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
  function svg(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function div(cls, parent, tag) {
    const e = document.createElement(tag || 'div');
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }
  function rgb(h) { const n = parseInt(String(h).replace('#', '').slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t) { const A = rgb(a), B = rgb(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }

  /* ================================================== geometria da pista
     A pista é um oval: duas retas e duas curvas de raio R. Coordenadas do
     "mundo" em metros, com y para baixo. A reta da chegada fica embaixo,
     com a arquibancada por fora. A posição de cada corredora é dada por
     s (metros desde a largada) e d (metros a partir da cerca interna). */
  function makeTrack(pista, dist, n) {
    const C = pista.volta;
    const Ls = pista.reta + (pista.sobra || 110);
    const R = (C - 2 * Ls) / (2 * Math.PI);
    const P1 = Ls, P2 = C / 2, P3 = C / 2 + Ls, Q = (Math.PI * R) / 2;
    const cw = pista.mao === 'direita';
    const pf = pista.reta;
    const p0 = mod(pf - dist, C);
    const Wt = Math.max(30, RAIL0 + n * LANE + 3);
    // largada dentro de uma curva: a corrida começa num prolongamento reto (os "bolsões")
    let chute = null;
    if (p0 >= P1 && p0 < P2) chute = { kind: 'oposta', len: P2 - p0 };
    else if (p0 >= P3) chute = { kind: 'casa', len: C - p0 };
    function raw(p, d) {
      p = mod(p, C);
      if (p < P1) return { x: -Ls / 2 + p, y: R + d, th: 0 };
      if (p < P2) { const a = Math.PI / 2 - (p - P1) / R; return { x: Ls / 2 + (R + d) * Math.cos(a), y: (R + d) * Math.sin(a), th: Math.atan2(-Math.cos(a), Math.sin(a)) }; }
      if (p < P3) return { x: Ls / 2 - (p - P2), y: -(R + d), th: Math.PI };
      const a = -Math.PI / 2 - (p - P3) / R;
      return { x: -Ls / 2 + (R + d) * Math.cos(a), y: (R + d) * Math.sin(a), th: Math.atan2(-Math.cos(a), Math.sin(a)) };
    }
    const flip = (o) => (cw ? { x: -o.x, y: o.y, th: Math.PI - o.th } : o);
    /** ponto pela posição na volta (p) */
    function atP(p, d) { return flip(raw(p, d)); }
    /** ponto pela distância corrida (s) */
    function at(s, d) {
      if (chute && s < chute.len) {
        const e = chute.len - s;
        return flip(chute.kind === 'oposta' ? { x: Ls / 2 + e, y: -(R + d), th: Math.PI } : { x: -Ls / 2 - e, y: R + d, th: 0 });
      }
      return atP(p0 + s, d);
    }
    function segP(p) {
      p = mod(p, C);
      return p < P1 ? 'casa' : p < P1 + Q ? 'c1' : p < P2 ? 'c2' : p < P3 ? 'oposta' : p < P3 + Q ? 'c3' : 'c4';
    }
    function seg(s) { if (chute && s < chute.len) return chute.kind; return segP(p0 + s); }
    // pontos de referência da corrida (primeira 1ª curva, última 3ª curva...)
    const firstOf = {}, lastOf = {};
    let prev = seg(0);
    for (let s = 1; s <= dist; s++) {
      const k = seg(s);
      if (k !== prev) { if (firstOf[k] == null) firstOf[k] = s; lastOf[k] = s; prev = k; }
    }
    const wp = {
      largada: 0,
      curva1: firstOf.c1, curva2: firstOf.c2, oposta: firstOf.oposta,
      curva3: lastOf.c3, curva4: lastOf.c4, ultima: lastOf.c3 != null ? lastOf.c3 : lastOf.c4,
      reta: dist - pf, chegada: dist,
    };
    return { C, Ls, R, P1, P2, P3, Q, cw, pf, p0, Wt, chute, at, atP, seg, wp, dist };
  }

  /* ================================================== formação
     "5 / 2 // 14 7 / 3 _ 9 / *"
       fileiras da frente para trás; em cada fileira, de dentro (cerca) para fora
       /  //  ///  /2.5/    espaço até a próxima fileira (1, 2,4, 5 ou 2,5 corpos)
       _                    raia vazia        >13   uma raia mais para fora
       13+0.5               meio corpo à frente da fileira (13-0.5: atrás)
       *                    todas as que faltam, na ordem em que estavam */
  function parseFormation(src, nums, prevOrder) {
    const errors = [];
    const known = new Set(nums);
    let toks = String(src || '').replace(/(\/\d+(?:[.,]\d+)?\/|\/+)/g, ' $1 ').trim().split(/\s+/).filter(Boolean);
    const RE = /^(>*)(\d+)([+-]\d+(?:[.,]\d+)?)?$/;
    const listed = [];
    for (const t of toks) {
      const m = RE.exec(t);
      if (m) {
        const n = +m[2];
        if (!known.has(n)) errors.push(`não há a corredora ${n} nesta corrida`);
        else if (listed.includes(n)) errors.push(`a corredora ${n} aparece duas vezes`);
        listed.push(n);
      } else if (!(t in ROW) && !/^\/\d+(?:[.,]\d+)?\/$/.test(t) && t !== '_' && t !== '*') errors.push(`não entendi "${t}"`);
    }
    const stars = toks.filter((t) => t === '*').length;
    if (stars > 1) errors.push('use * uma vez só');
    const rest = (prevOrder || nums).filter((n) => known.has(n) && !listed.includes(n));
    if (!stars && rest.length) errors.push('faltam as corredoras ' + rest.join(', ') + ' (ou use *)');
    if (stars) {
      const out = [];
      for (const t of toks) {
        if (t !== '*') { out.push(t); continue; }
        let k = 0, size = 3;
        while (k < rest.length) {
          if (k > 0) out.push('/');
          out.push(...rest.slice(k, k + size).map(String));
          k += size;
          size = size === 3 ? 2 : 3;
        }
      }
      toks = out;
    }
    const pos = {};
    let row = 0, lane = 0, inRow = 0;
    for (const t of toks) {
      if (t in ROW || /^\/\d/.test(t)) {
        row += t in ROW ? ROW[t] : parseFloat(t.slice(1, -1).replace(',', '.'));
        lane = 0; inRow = 0;
        continue;
      }
      if (t === '_') { lane++; continue; }
      const m = RE.exec(t);
      if (!m || !known.has(+m[2])) continue;
      lane += m[1].length;
      const n = +m[2];
      const adj = m[3] ? parseFloat(m[3].replace(',', '.')) : 0;
      pos[n] = { off: (row + inRow * 0.25 + (hash(n) - 0.5) * 0.14 - adj) * LEN, lane };
      lane++; inRow++;
    }
    let min = Infinity;
    for (const k in pos) min = Math.min(min, pos[k].off);
    for (const k in pos) pos[k].off -= min;
    return { pos, errors };
  }

  /* ================================================== estado */
  const T = {
    built: false, on: false, els: {}, raf: 0, last: 0, time: 0,
    id: null, race: null, pista: null, tr: null, D: 0, vavg: 16.3,
    R: [], byN: {},
    S: 0, sAnim: null, crawl: null, started: false, finished: false, pend: false,
    cam: { off: 0, lane: 3, z: 12, ax: 0, rot: 0 },
    focus: null, zoom: 'auto', names: true, phaseKey: '',
    streaks: [], fx: [], cut: null, cutNext: false, board: null, boardStandalone: false, sound: 0,
  };

  /* ================================================== DOM */
  function build() {
    if (T.built) return;
    T.built = true;
    const game = document.getElementById('game');
    const root = div('', null);
    root.id = 'tk';
    root.className = 'hidden';
    const chars = document.getElementById('chars');
    game.insertBefore(root, chars.nextSibling);
    const s = svg('svg', { class: 'tk-svg', viewBox: '0 0 1920 1080', preserveAspectRatio: 'none' }, root);
    s.innerHTML = `<defs>
      <pattern id="tkp-tone" width="12" height="9" patternUnits="userSpaceOnUse"><rect y="0" width="12" height="1.7" fill="${INK}"/></pattern>
      <pattern id="tkp-dots" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#f4f2f6"/><circle cx="3.5" cy="3.5" r="1.7" fill="#77727f"/></pattern>
      <pattern id="tkp-dotsd" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#a19cab"/><circle cx="3" cy="3" r="1.6" fill="#55505e"/></pattern>
      <pattern id="tkp-lines" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#f4f2f6"/><rect width="2.6" height="7" fill="#8b8695"/></pattern>
      <pattern id="tkp-cross" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#e6e3ea"/><rect width="2" height="8" fill="#8b8695"/><rect width="8" height="2" fill="#8b8695"/></pattern>
    </defs>
    <rect class="tk-ground" width="1920" height="1080"/>
    <g class="tk-world"></g>
    <rect class="tk-tone" width="1920" height="1080" fill="url(#tkp-tone)"/>
    <path class="tk-streaks"/>
    <g class="tk-wedges"></g>
    <g class="tk-trails"></g>
    <g class="tk-runners"></g>
    <g class="tk-fx"></g>`;
    const E = (T.els = {
      root, svg: s,
      world: s.querySelector('.tk-world'), streaks: s.querySelector('.tk-streaks'), wedges: s.querySelector('.tk-wedges'),
      runners: s.querySelector('.tk-runners'), trails: s.querySelector('.tk-trails'), fx: s.querySelector('.tk-fx'),
    });
    E.labels = div('tk-labels', root);
    E.plate = div('tk-plate', root);
    E.plate.innerHTML = '<span class="tk-grade"></span><div class="tk-title"></div><div class="tk-sub"></div>';
    E.dist = div('tk-dist', root);
    E.dist.innerHTML = '<div class="tk-phase"></div><div class="tk-rem"><small>FALTAM</small><b>0</b><small>m</small></div><div class="tk-bar"><i></i></div><div class="tk-minibox"><svg class="tk-mini"></svg></div><div class="tk-clock">0:00.0</div>';
    E.phaseEl = E.dist.querySelector('.tk-phase');
    E.remEl = E.dist.querySelector('.tk-rem b');
    E.barEl = E.dist.querySelector('.tk-bar i');
    E.clockEl = E.dist.querySelector('.tk-clock');
    E.banner = div('tk-banner', root);
    E.cut = div('tk-cut', root);
    E.cut.innerHTML = '<div class="tk-cut-frame"><div class="tk-cut-bg"></div><img class="tk-cut-img" alt="" draggable="false"></div><div class="tk-cut-name"></div>';
    E.flash = div('tk-flash', root);
    E.board = div('tk-board hidden', null);
    E.board.id = 'tk-board';
    game.insertBefore(E.board, document.getElementById('fx-canvas'));
    // rastros de velocidade (linhas finas que passam pela tela)
    T.streaks = [];
    for (let i = 0; i < 34; i++) T.streaks.push(newStreak(true));
  }
  function newStreak(anywhere) {
    return { x: anywhere ? Math.random() * 1920 : 1920 + Math.random() * 300, y: 40 + Math.random() * 1000, len: 90 + Math.random() * 360, v: 0.7 + Math.random() * 0.8 };
  }

  /* ================================================== cores das corredoras */
  // retículas das corredoras sem nome (como no mangá): branca, pontilhada, listrada...
  const ANON = [
    { fill: '#ffffff', tail: '#a7a2b0' },
    { fill: 'url(#tkp-lines)', tail: '#5f5a69', inner: true },
    { fill: '#ffffff', tail: 'url(#tkp-dotsd)' },
    { fill: 'url(#tkp-dots)', tail: '#77727f', inner: true },
    { fill: '#cfcbd5', tail: '#8d8898', inner: true },
    { fill: '#ffffff', tail: '#6b6676' },
    { fill: 'url(#tkp-cross)', tail: '#6b6676', inner: true },
    { fill: '#3b3644', tail: '#a7a2b0', num: '#ffffff' },
  ];
  const ANON_ORDER = [0, 3, 1, 5, 2, 4, 0, 6, 1, 3, 5, 0, 2, 4, 7, 1, 3, 6];
  function colorsOf(who) {
    const d = who && VN.API && VN.API.get(who);
    const fb = who && VN.FALLBACK && VN.FALLBACK[who];
    let c1 = (d && d.color) || (fb && fb.color_main) || '#8a7a9a';
    let c2 = (d && d.colorSub) || (fb && fb.color_sub) || '#d9cfe3';
    return { main: c1, sub: c2 };
  }

  /* ================================================== abrir / fechar */
  function open(id, opts) {
    const race = VN.CORRIDAS[id];
    if (!race) { console.warn('Corrida desconhecida:', id); return; }
    const pista = VN.PISTAS[race.pista];
    build();
    clearRace();
    T.id = id; T.race = race; T.pista = pista; T.D = race.dist;
    T.tr = makeTrack(pista, race.dist, race.n);
    T.vavg = race.tempo ? race.dist / toSeconds(race.tempo) : race.piso === 'terra' ? 16.6 : 16.3;
    const E = T.els;
    // corredoras
    for (let n = 1; n <= race.n; n++) {
      const who = race.quem && race.quem[n];
      const named = !!(who && VN.CAST[who]);
      const col = named ? colorsOf(who) : null;
      const r = {
        n, who: named ? who : null, named,
        name: named ? VN.CAST[who].name : 'Nº ' + n,
        main: col ? col.main : null, sub: col ? col.sub : null, sty: ANON[ANON_ORDER[(n - 1) % ANON_ORDER.length]],
        off: 0, lane: n - 1, f: null, s: 0, cap: null, keep: false, lastLane: n - 1,
        x: 0, y: 0, hd: 0, k: 1, sym: null, aura: null, trail: null, shake: 0, medal: 0, rank: n,
      };
      T.R.push(r);
      T.byN[n] = r;
      buildRunner(r);
    }
    E.world.innerHTML = drawWorld();
    E.gate = E.world.querySelector('.tk-gate');
    E.mini = E.dist.querySelector('.tk-mini');
    drawMini();
    // placa da corrida
    const grade = E.plate.querySelector('.tk-grade');
    grade.textContent = race.grau || '';
    grade.dataset.g = race.grau || '';
    E.plate.querySelector('.tk-title').textContent = race.titulo;
    const sentido = pista.mao === 'direita' ? '↻ horário' : '↺ anti-horário';
    const piso = race.piso === 'terra' ? 'Terra' : 'Grama';
    const extra = race.publico === false ? ' · sem público' : '';
    E.plate.querySelector('.tk-sub').textContent = `${pista.nome} · ${piso} ${fmt(race.dist)} m · ${sentido} · pista ${race.cond || 'boa'} · ${race.n} corredoras${extra}`;
    E.root.dataset.piso = race.piso || 'grama';
    E.root.dataset.publico = race.publico === false ? 'nao' : 'sim';
    // ponto de partida
    T.S = 0;
    T.started = false;
    if (opts && opts.em != null) {
      const s0 = target(opts.em);
      if (s0 != null) {
        T.S = s0;
        T.started = s0 > 0;
        const order = T.R.map((r) => r.n);
        const f = parseFormation('*', order, order).pos;
        for (const r of T.R) { r.off = f[r.n].off; r.lane = f[r.n].lane; r.lastLane = r.lane; }
        T.snapNext = true; // a primeira formação já entra no lugar
      }
    }
    for (const r of T.R) r.s = T.S - r.off;
    T.finished = T.S >= T.D;
    // câmera já no lugar
    T.cam.off = 0;
    fitCamera(1, true);
    E.root.classList.remove('hidden', 'leaving');
    E.root.style.animation = 'none';
    void E.root.offsetWidth;
    E.root.style.animation = '';
    T.on = true;
    T.last = performance.now();
    hud(true);
    if (!T.raf) T.raf = requestAnimationFrame(frame);
    startSound();
  }
  function clearRace() {
    const E = T.els;
    T.R = []; T.byN = {};
    T.sAnim = null; T.crawl = null; T.pend = false; T.fx = [];
    T.focus = null; T.zoom = 'auto'; T.names = true; T.phaseKey = ''; T.finished = false;
    T.cut = null; T.cutNext = false;
    if (!E.root) return;
    E.runners.innerHTML = ''; E.trails.innerHTML = ''; E.wedges.innerHTML = ''; E.fx.innerHTML = ''; E.labels.innerHTML = '';
    E.cut.classList.remove('on');
    E.banner.className = 'tk-banner';
    hideBoard(true);
  }
  function close(fast) {
    if (!T.on) return Promise.resolve();
    T.on = false;
    stopSound();
    const E = T.els;
    const done = () => { E.root.classList.add('hidden'); E.root.classList.remove('leaving'); clearRace(); cancelAnimationFrame(T.raf); T.raf = 0; };
    if (fast) { done(); return Promise.resolve(); }
    E.root.classList.add('leaving');
    return new Promise((r) => setTimeout(() => { done(); r(); }, 420));
  }
  function toSeconds(t) { const m = /^(\d+):(\d+(?:\.\d+)?)$/.exec(String(t)); return m ? +m[1] * 60 + parseFloat(m[2]) : parseFloat(t) || 100; }

  /* ================================================== desenho do mundo (pista) */
  function stadium(Ls, r) {
    const a = (v) => v.toFixed(1);
    return `M${a(-Ls / 2)} ${a(r)}L${a(Ls / 2)} ${a(r)}A${a(r)} ${a(r)} 0 0 0 ${a(Ls / 2)} ${a(-r)}L${a(-Ls / 2)} ${a(-r)}A${a(r)} ${a(r)} 0 0 0 ${a(-Ls / 2)} ${a(r)}Z`;
  }
  function drawWorld() {
    const tr = T.tr, P = T.pista, race = T.race;
    const { Ls, R, Wt, cw } = tr;
    const surf = race.piso === 'terra' ? '#ddcaa8' : '#c3dbab';
    const other = (k) => (k === 'terra' ? '#dfcdab' : '#c6ddaf');
    const infield = '#b2d29c';
    const o = [];
    const rail = (d, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${(w || 1) * 1.15}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="${(w || 1) * 0.62}" stroke-linejoin="round"/>`;
    const pt = (p, d) => tr.atP(p, d);
    const big = Ls / 2 + R + Wt + 400;
    o.push(`<rect x="${-big}" y="${-big}" width="${big * 2}" height="${big * 2}" fill="#ebe7df"/>`);
    // pista externa (Del Mar: a pista de terra fica por fora da grama)
    if (P.externa) {
      o.push(`<path d="${stadium(Ls, R + Wt + 24)}" fill="${other(P.externa)}" stroke="${INK}" stroke-width="0.5"/>`);
      o.push(`<path d="${stadium(Ls, R + Wt + 5)}" fill="#ebe7df"/>`);
    }
    // arquibancada (sem ninguém) por fora da reta de chegada
    if (P.hipodromo && race.pista !== 'mejiro') {
      const y0 = R + Wt + (P.externa ? 34 : 10), y1 = y0 + 46;
      const x0 = -Ls / 2 + 40, x1 = Ls / 2 - 60;
      const X = (x) => (cw ? -x : x);
      const xa = Math.min(X(x0), X(x1)), xb = Math.max(X(x0), X(x1));
      o.push(`<rect x="${xa}" y="${y0}" width="${xb - xa}" height="${y1 - y0}" fill="#d6d9e2" stroke="${INK}" stroke-width="0.6"/>`);
      for (let k = 1; k < 9; k++) o.push(`<path d="M${xa} ${y0 + k * 4} H${xb}" stroke="#b4b9c8" stroke-width="0.6"/>`);
      o.push(`<rect x="${xa}" y="${y1 - 12}" width="${xb - xa}" height="12" fill="#a9b0c2" stroke="${INK}" stroke-width="0.6"/>`);
      // nome do hipódromo no telhado, legível de dentro da pista
      const cx = (xa + xb) / 2, rot = cw ? 180 : 0;
      for (const fx of [-0.3, 0.3]) o.push(`<text x="${cx + (xb - xa) * fx}" y="${y1 - 3.2}" transform="rotate(${rot} ${cx + (xb - xa) * fx} ${y1 - 6})" class="tkw-txt" font-size="7.2" fill="#ffffff" text-anchor="middle">${esc(P.hipodromo)}</text>`);
    }
    // pista principal
    o.push(`<path d="${stadium(Ls, R + Wt)}" fill="${surf}"/>`);
    // pista interna (terra nos hipódromos japoneses) e gramado central
    if (P.interna) {
      o.push(`<path d="${stadium(Ls, R - 4)}" fill="${other(P.interna)}"/>`);
      o.push(rail(stadium(Ls, R - 4.4), 0.7));
      o.push(`<path d="${stadium(Ls, R - 22)}" fill="${infield}"/>`);
      o.push(rail(stadium(Ls, R - 21.6), 0.7));
    } else o.push(`<path d="${stadium(Ls, R - 0.2)}" fill="${infield}"/>`);
    if (P.lago) o.push(`<ellipse cx="0" cy="0" rx="${Ls * 0.32}" ry="${Math.max(10, R * 0.34)}" fill="#bcd9e4" stroke="${INK}" stroke-width="0.6"/>`);
    // telão no gramado central, de frente para a arquibancada
    if (P.hipodromo && race.pista !== 'mejiro') {
      const sx = cw ? 40 : -40, sy = R * 0.55;
      o.push(`<rect x="${sx - 26}" y="${sy - 5}" width="52" height="10" fill="#3a3646" stroke="${INK}" stroke-width="0.6"/>`);
    }
    // cercas
    o.push(rail(stadium(Ls, R - 0.6)));
    o.push(rail(stadium(Ls, R + Wt + 0.6)));
    // estacas da cerca interna (dão a sensação de velocidade)
    let posts = '';
    for (let p = 0; p < tr.C; p += 7) {
      const a = pt(p, -1.1), b = pt(p, -0.1);
      posts += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    o.push(`<path d="${posts}" stroke="${INK}" stroke-width="0.32"/>`);
    // postes de distância: a cada 200 m até a chegada
    for (let k = 1; k * 200 < tr.C - 60; k++) {
      const p = tr.pf - k * 200;
      const a = pt(p, -0.9), b = pt(p, -4.4), q = pt(p, -5.9), deg = (q.th * 180) / Math.PI;
      const label = String(k * 200);
      o.push(`<path d="M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}" stroke="${INK}" stroke-width="0.95" stroke-linecap="round"/>`
        + `<path d="M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}" stroke="#e8455a" stroke-width="0.5" stroke-linecap="round"/>`);
      o.push(`<g transform="translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${deg.toFixed(1)})">`
        + `<rect x="${-label.length * 0.62 - 0.5}" y="-1.3" width="${label.length * 1.24 + 1}" height="2.6" rx="0.5" fill="#ffffff" stroke="${INK}" stroke-width="0.3"/>`
        + `<text y="0.72" class="tkw-txt" font-size="2.1" text-anchor="middle" fill="${INK}">${label}</text></g>`);
    }
    // bolsão de largada: um prolongamento reto que atravessa a curva e abre a cerca externa
    if (tr.chute) {
      const len = tr.chute.len + 40;
      const at0 = (d) => (tr.chute.kind === 'oposta' ? pt(tr.P2, d) : pt(0, d));
      const a0 = at0(0);
      const ux = -Math.cos(a0.th), uy = -Math.sin(a0.th); // para trás
      const A = at0(0.4), B = at0(Wt);
      const c = [A, B, { x: B.x + ux * len, y: B.y + uy * len }, { x: A.x + ux * len, y: A.y + uy * len }];
      o.push(`<path d="M${c.map((q) => q.x.toFixed(1) + ' ' + q.y.toFixed(1)).join('L')}Z" fill="${surf}"/>`);
      // a cerca de dentro do bolsão só começa depois que ele sai do oval
      const eIn = Math.sqrt(Math.max(0, (R + Wt + 1) * (R + Wt + 1) - (R - 0.6) * (R - 0.6)));
      const I = at0(-0.6), O = at0(Wt + 0.6);
      o.push(rail(`M${(I.x + ux * eIn).toFixed(1)} ${(I.y + uy * eIn).toFixed(1)}L${(I.x + ux * len).toFixed(1)} ${(I.y + uy * len).toFixed(1)}`));
      o.push(rail(`M${O.x.toFixed(1)} ${O.y.toFixed(1)}L${(O.x + ux * len).toFixed(1)} ${(O.y + uy * len).toFixed(1)}`));
    }
    // linha e poste de chegada
    {
      const a = pt(tr.pf, -0.6), b = pt(tr.pf, Wt + 0.6), q = pt(tr.pf, -3.2), ql = pt(tr.pf, -6.6);
      o.push(`<path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="${INK}" stroke-width="1.5"/><path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="#ffffff" stroke-width="0.8"/>`);
      const deg = (q.th * 180) / Math.PI;
      o.push(`<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="1.5" fill="#ffffff" stroke="${INK}" stroke-width="0.35"/><circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="0.85" fill="#e8455a"/>`);
      o.push(`<g transform="translate(${ql.x.toFixed(1)} ${ql.y.toFixed(1)}) rotate(${deg.toFixed(1)})"><rect x="-5.2" y="-1.3" width="10.4" height="2.6" rx="0.6" fill="${INK}"/><text y="0.68" class="tkw-txt" font-size="1.9" text-anchor="middle" fill="#ffffff">CHEGADA</text></g>`);
      const ph = pt(tr.pf, Wt + 5);
      o.push(`<rect x="${ph.x - 2}" y="${ph.y - 2}" width="4" height="4" fill="#dfe2ea" stroke="${INK}" stroke-width="0.4" transform="rotate(${((ph.th * 180) / Math.PI).toFixed(1)} ${ph.x} ${ph.y})"/>`);
    }
    // portões de largada
    {
      const n = race.n;
      let g = '';
      for (let i = 0; i <= n; i++) {
        const d = RAIL0 + (i - 0.5) * LANE;
        const a = tr.at(-1.6, d), b = tr.at(1.6, d);
        g += `M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
      }
      const f0 = tr.at(1.6, RAIL0 - 0.5 * LANE), f1 = tr.at(1.6, RAIL0 + (n - 0.5) * LANE);
      const b0 = tr.at(-1.6, RAIL0 - 0.5 * LANE), b1 = tr.at(-1.6, RAIL0 + (n - 0.5) * LANE);
      o.push(`<g class="tk-gate"><path d="M${b0.x} ${b0.y}L${f0.x} ${f0.y}L${f1.x} ${f1.y}L${b1.x} ${b1.y}Z" fill="#d9d6de" stroke="${INK}" stroke-width="0.5" opacity="0.9"/>`);
      o.push(`<path d="${g}" stroke="${INK}" stroke-width="0.4"/></g>`);
    }
    return o.join('');
  }

  /* ---------------------------------------------- minimapa */
  function drawMini() {
    const tr = T.tr, E = T.els;
    const pad = 26, ext = tr.Ls / 2 + tr.R + 30;
    let x0 = -ext, x1 = ext;
    if (tr.chute) {
      const far = tr.at(0, 0);
      x0 = Math.min(x0, far.x - pad); x1 = Math.max(x1, far.x + pad);
    }
    const y0 = -(tr.R + 30), y1 = tr.R + 30;
    E.mini.setAttribute('viewBox', `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
    const sw = (x1 - x0) / 300;
    let chute = '';
    if (tr.chute) {
      const a = tr.at(0, 4), b = tr.at(tr.chute.len, 4);
      chute = `<path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="${INK}" stroke-width="${sw * 9}" stroke-linecap="round"/><path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="#ffffff" stroke-width="${sw * 5}" stroke-linecap="round"/>`;
    }
    const f0 = tr.atP(tr.pf, -8), f1 = tr.atP(tr.pf, 16);
    E.mini.innerHTML = `<path d="${stadium(tr.Ls, tr.R + 4)}" fill="none" stroke="${INK}" stroke-width="${sw * 9}"/>`
      + `<path d="${stadium(tr.Ls, tr.R + 4)}" fill="none" stroke="#ffffff" stroke-width="${sw * 5}"/>${chute}`
      + `<path d="M${f0.x} ${f0.y}L${f1.x} ${f1.y}" stroke="#e8455a" stroke-width="${sw * 3}"/>`
      + `<g class="tk-mini-dots"></g>`;
    const g = E.mini.querySelector('.tk-mini-dots');
    for (const r of [...T.R].sort((a, b) => a.named - b.named)) {
      r.mini = svg('circle', { r: sw * (r.named ? 7.5 : 4.2), fill: r.named ? r.main : '#b9b4c2', stroke: INK, 'stroke-width': sw * (r.named ? 2.2 : 1) }, g);
    }
  }

  /* ================================================== marcadores */
  function dropPath(r, L) {
    const a = Math.acos(r / L), cx = r * Math.cos(a), cy = r * Math.sin(a);
    return `M${cx.toFixed(2)} ${(-cy).toFixed(2)}L${L} 0L${cx.toFixed(2)} ${cy.toFixed(2)}A${r} ${r} 0 1 1 ${cx.toFixed(2)} ${(-cy).toFixed(2)}Z`;
  }
  function burst(n, ro, ri) {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? ri : ro * (0.86 + 0.14 * hash(i * 3.1));
      d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1);
    }
    return d + 'Z';
  }
  function buildRunner(r) {
    const E = T.els;
    const g = svg('g', { class: 'tk-r' + (r.named ? ' named' : '') }, E.runners);
    r.g = g;
    r.halo = svg('path', { class: 'tk-halo', d: burst(20, 68, 44) }, g);
    r.body = svg('g', { class: 'tk-body' }, g);
    r.trailEl = svg('g', { class: 'tk-trail' }, T.els.trails);
    const tail = r.named ? mix(r.main, '#000000', 0.32) : r.sty.tail;
    svg('path', { d: dropPath(R0, 54), fill: tail, stroke: INK, 'stroke-width': 4.6, 'stroke-linejoin': 'round' }, r.body);
    svg('circle', { cx: -4, cy: 0, r: R0 - 3.4, fill: r.named ? r.main : r.sty.fill }, r.body);
    if (r.named) svg('circle', { cx: -4, cy: 0, r: R0 - 9.5, fill: 'none', stroke: '#ffffff', 'stroke-width': 2.6, opacity: 0.85 }, r.body);
    else if (r.sty.inner) svg('circle', { cx: -4, cy: 0, r: R0 - 12, fill: '#ffffff' }, r.body);
    r.num = svg('text', { class: 'tk-num', 'text-anchor': 'middle', dy: '0.36em', 'font-size': r.n >= 10 ? 25 : 29 }, g);
    r.num.textContent = r.n;
    if (r.named) { r.num.setAttribute('fill', '#ffffff'); r.num.setAttribute('stroke', INK); r.num.setAttribute('stroke-width', '4.2'); r.num.setAttribute('paint-order', 'stroke'); }
    else r.num.setAttribute('fill', r.sty.num || INK);
    r.medalEl = svg('g', { class: 'tk-medal' }, g);
    if (r.named) {
      r.wedge = svg('path', { class: 'tk-wedge' }, E.wedges);
      r.label = div('tk-label', E.labels);
      r.label.style.setProperty('--c', r.main);
      r.label.style.setProperty('--c2', r.sub);
      r.label.innerHTML = `<b class="tk-pos">${r.n}º</b><span>${esc(r.name)}</span>`;
      r.posEl = r.label.querySelector('.tk-pos');
      r.lx = null;
    }
  }
  function setTrail(r, kind) {
    r.trail = kind && kind !== 'off' ? kind : null;
    const t = r.trailEl;
    t.innerHTML = '';
    if (!r.trail) return;
    const base = r.trail === 'vermelho' ? '#ff2d4b' : r.trail === 'estrela' ? '#ffd24a' : /^#/.test(r.trail) ? r.trail : r.main || '#8e8999';
    if (r.trail === 'vermelho') {
      svg('path', { d: 'M-12 0L-46 -18L-70 10L-104 -14L-132 8L-176 -6L-214 4', fill: 'none', stroke: base, 'stroke-width': 14, 'stroke-linejoin': 'miter', 'stroke-linecap': 'round', opacity: 0.9 }, t);
      svg('path', { d: 'M-12 0L-46 -18L-70 10L-104 -14L-132 8L-176 -6L-214 4', fill: 'none', stroke: '#ffe1e6', 'stroke-width': 4, 'stroke-linejoin': 'miter' }, t);
      return;
    }
    svg('path', { d: 'M-10 -25L-210 -5L-210 5L-10 25Z', fill: base, opacity: 0.55 }, t);
    svg('path', { d: 'M-10 -14L-150 -3L-150 3L-10 14Z', fill: '#ffffff', opacity: 0.7 }, t);
    for (const y of [-34, 34]) svg('path', { d: `M-30 ${y}L-170 ${y * 0.4}`, stroke: INK, 'stroke-width': 2.4, opacity: 0.45 }, t);
    if (r.trail === 'estrela') {
      for (const [x, y, s] of [[-80, -22, 1], [-140, 16, 0.8], [-196, -8, 0.6]]) {
        svg('path', { d: 'M0 -9L2.6 -2.6L9 0L2.6 2.6L0 9L-2.6 2.6L-9 0L-2.6 -2.6Z', fill: '#fff6c8', stroke: '#d9a400', 'stroke-width': 1.4, transform: `translate(${x} ${y}) scale(${s})` }, t);
      }
    }
  }
  function setAura(r, kind) {
    r.aura = kind && kind !== 'off' ? kind : null;
    r.halo.setAttribute('class', 'tk-halo' + (r.aura ? ' on ' + r.aura : ''));
  }
  function setMedal(r, place) {
    r.medal = place || 0;
    const m = r.medalEl;
    m.innerHTML = '';
    if (!place) return;
    const col = place === 1 ? '#ffd24a' : place === 2 ? '#dfe3ea' : place === 3 ? '#e9a46a' : '#ffffff';
    svg('circle', { cx: 0, cy: 0, r: 15, fill: col, stroke: INK, 'stroke-width': 3.2 }, m);
    const t = svg('text', { class: 'tk-num', 'text-anchor': 'middle', dy: '0.36em', 'font-size': 15, fill: INK }, m);
    t.textContent = place + 'º';
  }

  /* ---------------------------------------------- símbolos e choques */
  function symbolSVG(k) {
    return `<path d="M-6 12L-30 50L12 16Z" fill="#ffffff" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>` + symbolBody(k);
  }
  function symbolBody(k) {
    const txt = (s, size, fill, extra) => `<text class="tk-symt" text-anchor="middle" dy="0.36em" font-size="${size}" fill="${fill}" ${extra || ''}>${s}</text>`;
    switch (k) {
      case '!': return `<path d="${burst(9, 31, 22)}" fill="#ffffff" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>${txt('!', 34, INK)}`;
      case '!!': return `<path d="${burst(11, 42, 28)}" fill="#ffe14d" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>${txt('!!', 36, INK)}`;
      case '?': return `<circle r="25" fill="#ffffff" stroke="${INK}" stroke-width="3.6"/><path d="M-8 20L-14 33L2 23" fill="#ffffff" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>${txt('?', 32, '#4b5fd6')}`;
      case '#': return `<path d="${burst(10, 31, 22)}" fill="#e8344a" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>${txt('#', 32, '#ffffff')}`;
      case '…': case '...': return `<rect x="-32" y="-20" width="64" height="40" rx="20" fill="#ffffff" stroke="${INK}" stroke-width="3.4"/><path d="M-10 18L-18 32L4 19" fill="#ffffff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><circle cx="-14" r="4" fill="${INK}"/><circle r="4" fill="${INK}"/><circle cx="14" r="4" fill="${INK}"/>`;
      case '♪': return `<circle r="25" fill="#ffffff" stroke="${INK}" stroke-width="3.6"/>${txt('♪', 32, '#3a7bd5')}`;
      case '♥': return `<path d="M0 22C-26 6-30-10-20-18C-12-24-4-20 0-12C4-20 12-24 20-18C30-10 26 6 0 22Z" fill="#ff6fa8" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>`;
      case '★': return `<path d="M0 -30L8.5 -10L30 -9L13 5L19 27L0 15L-19 27L-13 5L-30 -9L-8.5 -10Z" fill="#ffd84a" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>`;
      case '☾': return `<path d="M8 -28A28 28 0 1 0 26 14A21 21 0 1 1 8 -28Z" fill="#e8344a" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>`;
      case '×': return `<circle r="25" fill="${INK}" stroke="#ffffff" stroke-width="3"/>${txt('×', 38, '#ffffff')}`;
      case 'gota': return `<path d="M0 -28C8 -12 20 0 20 10A20 20 0 0 1 -20 10C-20 0 -8 -12 0 -28Z" fill="#8fd3ff" stroke="${INK}" stroke-width="3.4"/><ellipse cx="-7" cy="8" rx="4" ry="7" fill="#ffffff" opacity="0.8"/>`;
      default: return '';
    }
  }
  function mark(r, k, fixed, fast) {
    if (r.symEl) { r.symEl.remove(); r.symEl = null; }
    r.sym = null;
    if (!k || k === '-') return;
    if (fast && !fixed) return;
    const g = svg('g', { class: 'tk-sym' }, T.els.fx);
    g.innerHTML = symbolSVG(k);
    r.symEl = g;
    r.sym = { k, t0: T.time - (fast ? 1 : 0), fixed: !!fixed, dur: k === '!!' ? 3.6 : 3.1 };
    if (!fast && VN.Audio) VN.Audio.sfx(k === '#' || k === '×' ? 'tk_tranco' : k === '!!' ? 'tk_brilho' : 'pop');
  }
  function impact(a, b, fast) {
    if (fast) return;
    const g = svg('g', { class: 'tk-impact' }, T.els.fx);
    g.innerHTML = `<path d="${burst(14, 74, 34)}" fill="#ffe04a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="${burst(10, 40, 20)}" fill="#ffffff"/>`;
    T.fx.push({ g, a, b, t0: T.time, dur: 1.1 });
    a.shake = 1; b.shake = 1.4;
  }

  /* ================================================== comandos de corrida */
  /** ponto da corrida: metros que faltam (400), +N (avança N metros) ou nome */
  function target(spec) {
    const tr = T.tr;
    if (spec == null || !tr) return null;
    const x = String(spec).toLowerCase();
    if (/^\+\d+(\.\d+)?$/.test(x)) return T.S + parseFloat(x);
    if (/^\d+(\.\d+)?$/.test(x)) return T.D - parseFloat(x);
    if (x === 'apos') return T.D + 40;
    if (x === 'chegada') return T.D + 7;
    const v = tr.wp[x];
    return v == null ? null : v;
  }
  function currentOrder() { return [...T.R].sort((a, b) => b.s - a.s).map((r) => r.n); }
  function setFormation(src, dur, fast) {
    if (T.snapNext) { T.snapNext = false; fast = true; }
    const { pos, errors } = parseFormation(src, T.R.map((r) => r.n), currentOrder());
    if (errors.length) console.warn('@tracking ordem:', errors.join('; '));
    for (const r of T.R) {
      const p = pos[r.n];
      if (!p) continue;
      if (fast) { r.off = p.off; r.lane = p.lane; r.f = null; continue; }
      const gain = r.off - p.off; // >0: ganhou terreno
      const bulge = gain > 1.2 * LEN && p.lane >= r.lane ? clamp(gain / (LEN * 3), 0.5, 1.4) : 0;
      r.f = { fo: r.off, fl: r.lane, to: p.off, tl: p.lane, t0: null, dur: dur || 1.5, bulge, delay: hash(r.n + 7) * 0.12 };
    }
    T.pend = true;
  }
  function go(spec, dur, fast) {
    const s1 = target(spec);
    if (s1 == null) { console.warn('@tracking ir: ponto desconhecido', spec); return 0; }
    T.started = true;
    T.crawl = null;
    T.snapNext = false;
    if (fast) { T.S = s1; T.sAnim = null; settle(); return 0; }
    const ds = Math.abs(s1 - T.S);
    const d = dur || clamp(0.9 + ds / 430, 1.1, 4.2);
    T.sAnim = { from: T.S, to: s1, t0: null, dur: d };
    T.pend = true;
    return d;
  }
  /** aplica tudo de uma vez (pular falas, carregar jogo) */
  function settle() {
    if (T.sAnim) { T.S = T.sAnim.to; T.sAnim = null; }
    for (const r of T.R) if (r.f) { r.off = r.f.to; r.lane = r.f.tl; r.f = null; }
    T.crawl = null;
    finishCheck(true);
    for (const r of T.R) r.s = runnerS(r);
  }

  /* ================================================== animação */
  function frame(now) {
    T.raf = 0;
    if (!T.on) return;
    const dt = Math.min(0.05, (now - T.last) / 1000);
    T.last = now;
    T.time += dt;
    step(dt);
    render();
    T.raf = requestAnimationFrame(frame);
  }
  function step(dt) {
    const t = T.time;
    // ordem + ir no mesmo instante: a formação muda durante o avanço
    if (T.pend) {
      T.pend = false;
      const sd = T.sAnim && T.sAnim.t0 == null ? T.sAnim.dur : 0;
      if (T.sAnim && T.sAnim.t0 == null) T.sAnim.t0 = t;
      for (const r of T.R) if (r.f && r.f.t0 == null) { r.f.t0 = t; if (sd) r.f.dur = Math.max(r.f.dur, sd * 0.95); }
    }
    // avanço da corrida
    if (T.sAnim) {
      const a = T.sAnim, k = clamp((t - a.t0) / a.dur, 0, 1);
      T.S = lerp(a.from, a.to, ease(k));
      if (k >= 1) { T.sAnim = null; T.crawl = { base: T.S, t0: t, max: crawlRoom(T.S) }; }
    } else if (T.crawl && T.started) {
      const c = T.crawl;
      T.S = c.base + c.max * (1 - Math.exp(-(t - c.t0) / 9));
    }
    // formação
    for (const r of T.R) {
      const f = r.f;
      if (f && f.t0 != null) {
        const k = clamp((t - f.t0 - f.delay * f.dur) / (f.dur * (1 - f.delay)), 0, 1);
        const e = ease(k);
        r.off = lerp(f.fo, f.to, e);
        r.lane = lerp(f.fl, f.tl, e) + f.bulge * Math.sin(Math.PI * e);
        if (k >= 1) { r.off = f.to; r.lane = f.tl; r.f = null; }
      }
      if (r.shake > 0) r.shake = Math.max(0, r.shake - dt * 1.6);
    }
    finishCheck(false);
    for (const r of T.R) {
      const ns = runnerS(r);
      r.v = (ns - r.s) / Math.max(dt, 0.001);
      r.dl = (r.lane - r.lastLane) / Math.max(dt, 0.001);
      r.lastLane = r.lane;
      r.s = ns;
    }
    // câmera
    fitCamera(dt, false);
    // rastros de velocidade
    const fast = T.sAnim ? 2.6 : 1;
    const ph = T.tr.seg(refRunner().s);
    const hot = T.started && !T.finished && T.D - leader().s <= T.tr.pf + 10 ? 1.7 : 1;
    const v = T.started && !(T.finished && !T.R.some((r) => r.keep)) ? 1700 * fast * hot : T.finished ? 260 : 0;
    for (const sk of T.streaks) {
      sk.x -= sk.v * v * dt;
      if (sk.x + sk.len < 0) Object.assign(sk, newStreak(false));
    }
    T.streakOn = v > 0 ? clamp(v / 1700, 0.25, 1) : 0;
    T.hot = hot > 1;
    T.phSeg = ph;
  }
  function crawlRoom(S) {
    // devagar, como câmera lenta, sem cruzar a linha de chegada antes da hora
    if (S < T.D) return Math.max(0, Math.min(24, T.D - S - 6));
    return 24;
  }
  function runnerS(r) {
    const raw = T.S - r.off;
    if (r.cap == null || r.keep) return raw;
    const c = r.cap, soft = 22;
    return raw < c - soft ? raw : c - soft * Math.exp(-(raw - (c - soft)) / soft);
  }
  function leader() { let L = T.R[0]; for (const r of T.R) if (r.s > L.s) L = r; return L; }
  function refRunner() {
    const F = T.focus && T.byN[T.focus];
    return F && T.finished && F.keep ? F : leader();
  }
  function finishCheck(instant) {
    if (T.finished || !T.started) return;
    let L = T.R[0];
    for (const r of T.R) if (r.off < L.off) L = r;
    if (T.S - L.off < T.D) return;
    T.finished = true;
    // depois da linha, cada uma desacelera mantendo a distância em que cruzou
    for (const r of T.R) if (!r.keep) r.cap = T.S - r.off + 50;
    T.finishT = T.time;
    if (!instant) flash();
    setMedal(L, 1);
  }
  function flash() {
    const f = T.els.flash;
    f.classList.remove('on');
    void f.offsetWidth;
    f.classList.add('on');
  }

  /* ---------------------------------------------- câmera */
  function fitCamera(dt, snap) {
    const cam = T.cam;
    const list = T.R.filter((r) => !(T.finished && !r.keep && T.R.some((q) => q.keep)));
    let sMax = -Infinity, sMin = Infinity, lMax = -Infinity, lMin = Infinity;
    for (const r of list) { sMax = Math.max(sMax, r.s); sMin = Math.min(sMin, r.s); lMax = Math.max(lMax, r.lane); lMin = Math.min(lMin, r.lane); }
    if (!list.length) { sMax = sMin = T.S; lMax = lMin = 2; }
    const F = T.focus && T.byN[T.focus];
    if (F) {
      const near = list.filter((r) => Math.abs(r.s - F.s) < 90);
      if (near.length) { sMax = -Infinity; sMin = Infinity; lMax = -Infinity; lMin = Infinity; for (const r of near) { sMax = Math.max(sMax, r.s); sMin = Math.min(sMin, r.s); lMax = Math.max(lMax, r.lane); lMin = Math.min(lMin, r.lane); } }
    }
    let zT;
    if (!T.started) zT = Math.min(26, 640 / (T.race.n * LANE + 2));
    else if (T.zoom !== 'auto' && ZOOMS[T.zoom]) zT = ZOOMS[T.zoom];
    else {
      const spanS = (F ? Math.max(sMax - F.s, F.s - sMin) * 2 : sMax - sMin) + 16;
      const spanL = (lMax - lMin) * LANE + 9;
      zT = clamp(Math.min(1500 / spanS, 500 / spanL), 10, 34);
    }
    let sT, lT, axT = 0;
    if (F) {
      sT = F.s; lT = clamp(F.lane, lMin + 0.5, Math.max(lMin + 0.5, lMax - 0.5));
      // se o resto do grupo está à frente, a câmera deixa espaço à direita
      const mid = (sMax + sMin) / 2;
      axT = clamp(-(mid - F.s) * zT * 0.55, -420, 420);
    } else { sT = (sMax + sMin) / 2; lT = (lMax + lMin) / 2; }
    const offT = T.S - sT;
    const k = snap ? 1 : 1 - Math.exp(-dt * 3.2);
    cam.off = lerp(cam.off, offT, k);
    cam.lane = lerp(cam.lane, lT, k);
    cam.z = lerp(cam.z, zT, snap ? 1 : 1 - Math.exp(-dt * 1.8));
    cam.ax = lerp(cam.ax, axT, snap ? 1 : 1 - Math.exp(-dt * 2));
    const cutT = T.cut && T.els.cut.classList.contains('on') ? (T.els.cut.dataset.side === 'dir' ? -300 : 300) : 0;
    cam.cut = lerp(cam.cut || 0, cutT, snap ? 1 : 1 - Math.exp(-dt * 3));
  }
  function camMatrix() {
    const cam = T.cam, tr = T.tr;
    const c = tr.at(T.S - cam.off, RAIL0 + cam.lane * LANE);
    const ax = 960 + cam.ax + (cam.cut || 0), ay = tr.cw ? 470 : 500;
    const cos = Math.cos(c.th), sin = Math.sin(c.th), z = cam.z;
    // tela = âncora + z · R(-th) · (p - c)
    return {
      th: c.th, z, ax, ay, cx: c.x, cy: c.y,
      apply(x, y) { const u = x - c.x, v = y - c.y; return [ax + z * (u * cos + v * sin), ay + z * (-u * sin + v * cos)]; },
    };
  }

  /* ---------------------------------------------- desenho por quadro */
  function render() {
    const E = T.els, M = camMatrix(), tr = T.tr;
    const deg = (M.th * 180) / Math.PI;
    // o portão sai da pista logo depois da largada
    const gateOn = !(T.started && T.S > 30);
    if (E.gate && E.gate.classList.contains('off') === gateOn) E.gate.classList.toggle('off', !gateOn);
    E.world.setAttribute('transform', `translate(${M.ax.toFixed(2)} ${M.ay.toFixed(2)}) scale(${M.z.toFixed(4)}) rotate(${(-deg).toFixed(3)}) translate(${(-M.cx).toFixed(3)} ${(-M.cy).toFixed(3)})`);
    // rastros (somem com "reduzir movimento")
    const calm = VN.Settings && VN.Settings.get('reduceMotion');
    if (T.streakOn > 0 && !calm) {
      let d = '';
      for (const sk of T.streaks) d += `M${sk.x.toFixed(0)} ${sk.y.toFixed(0)}h${sk.len.toFixed(0)}`;
      E.streaks.setAttribute('d', d);
      E.streaks.style.opacity = (0.1 + 0.16 * T.streakOn + (T.hot ? 0.08 : 0)).toFixed(2);
    } else E.streaks.setAttribute('d', '');
    // ordem atual
    const order = [...T.R].sort((a, b) => b.s - a.s);
    order.forEach((r, i) => (r.rank = i + 1));
    const t = T.time;
    // no portão, as baias são estreitas: o marcador não passa da largura da baia
    let baseR = clamp(6 + M.z * 1.18, 14, 40);
    if (!T.started) baseR = Math.min(baseR, LANE * M.z * 0.5);
    // marcadores (de trás para frente; as nomeadas e a do foco por cima)
    const draw = [...T.R].sort((a, b) => (a.named - b.named) || ((T.focus === a.n) - (T.focus === b.n)) || a.s - b.s);
    const zkey = draw.map((r) => r.n).join(',');
    if (zkey !== T.zkey) { T.zkey = zkey; for (const r of draw) E.runners.appendChild(r.g); }
    for (const r of draw) {
      const p = tr.at(r.s, RAIL0 + r.lane * LANE);
      let [x, y] = M.apply(p.x, p.y);
      const running = T.started && (!r.cap || r.s < r.cap - 3);
      const ph = r.n * 1.7;
      if (running && !calm) { x += Math.sin(t * 11 + ph) * 1.4; y += Math.cos(t * 13 + ph) * 1.0; }
      if (r.shake > 0) { x += Math.sin(t * 70) * 9 * r.shake; y += Math.cos(t * 53) * 6 * r.shake; }
      // inclinação ao trocar de raia
      const vy = (tr.cw ? -1 : 1) * r.dl * LANE, vx = Math.max(4, Math.abs(r.v || 0));
      const tilt = clamp(Math.atan2(vy, vx), -0.6, 0.6);
      r.hd = p.th - M.th + (running ? tilt : 0);
      let k = baseR / R0;
      if (r.named) k *= 1.12;
      if (T.focus === r.n) k *= 1.08;
      r.x = x; r.y = y; r.k = k;
      r.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k.toFixed(3)})`);
      const hd = (r.hd * 180) / Math.PI;
      r.body.setAttribute('transform', `rotate(${hd.toFixed(1)})`);
      if (r.trail) {
        r.trailEl.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k.toFixed(3)}) rotate(${hd.toFixed(1)})`);
        r.trailEl.style.opacity = T.finished && !r.keep ? clamp(1 - (t - (T.finishT || 0)) / 1.4, 0, 1).toFixed(2) : 1;
      }
      r.num.setAttribute('x', (-4 * Math.cos(r.hd)).toFixed(1));
      r.num.setAttribute('y', (-4 * Math.sin(r.hd)).toFixed(1));
      if (r.aura) r.halo.setAttribute('transform', `rotate(${((t * 26) % 360).toFixed(1)}) scale(${(1 + Math.sin(t * 6) * 0.05).toFixed(3)})`);
      if (r.medal) r.medalEl.setAttribute('transform', 'translate(-26 -30)');
      // símbolo
      if (r.symEl) {
        const s = r.sym, age = t - s.t0;
        if (!s.fixed && age > s.dur) { r.symEl.remove(); r.symEl = null; r.sym = null; }
        else {
          const pop = age < 0.18 ? (age / 0.18) * 1.25 : age < 0.32 ? 1.25 - ((age - 0.18) / 0.14) * 0.25 : 1;
          const fade = !s.fixed && age > s.dur - 0.4 ? (s.dur - age) / 0.4 : 1;
          const bob = Math.sin(age * 5) * 3;
          const sx = x + 30 * k, sy = y - 52 * k + bob;
          r.symEl.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${(pop * Math.max(0.75, k)).toFixed(3)})`);
          r.symEl.style.opacity = fade.toFixed(2);
        }
      }
    }
    // choques
    T.fx = T.fx.filter((f) => {
      const age = t - f.t0;
      if (age > f.dur) { f.g.remove(); return false; }
      const sc = age < 0.12 ? (age / 0.12) * 1.3 : 1.3 - Math.min(0.3, (age - 0.12) * 0.8);
      const x = (f.a.x + f.b.x) / 2, y = (f.a.y + f.b.y) / 2;
      f.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(age * 40).toFixed(1)}) scale(${(sc * f.a.k).toFixed(3)})`);
      f.g.style.opacity = age > f.dur - 0.3 ? ((f.dur - age) / 0.3).toFixed(2) : 1;
      return true;
    });
    labels(M);
    minimap();
    hud(false);
  }
  function labels() {
    const E = T.els;
    const named = T.R.filter((r) => r.named);
    const show = T.names;
    E.labels.style.opacity = show ? 1 : 0;
    E.wedges.style.opacity = show ? 1 : 0;
    if (!show) return;
    // os rótulos ficam numa faixa no alto, entre a placa da corrida e o painel de distância
    const items = named.map((r) => ({ r, want: clamp(r.x, 150, 1500), w: r.lw || (r.lw = r.label.offsetWidth || 260) }));
    items.sort((a, b) => a.want - b.want);
    for (let i = 1; i < items.length; i++) {
      const a = items[i - 1], b = items[i];
      const min = a.want + (a.w + b.w) / 2 + 14;
      if (b.want < min) b.want = min;
    }
    const over = items.length ? items[items.length - 1].want + items[items.length - 1].w / 2 - 1530 : 0;
    if (over > 0) for (const it of items) it.want -= over;
    if (items.length && items[0].want - items[0].w / 2 < 20) { const d = 20 - (items[0].want - items[0].w / 2); for (const it of items) it.want += d; }
    const ly = 186;
    for (const it of items) {
      const r = it.r;
      r.lx = r.lx == null ? it.want : lerp(r.lx, it.want, 0.2);
      r.label.style.transform = `translate(${(r.lx - it.w / 2).toFixed(1)}px, ${ly - 24}px)`;
      const txt = r.rank + 'º';
      if (r.posEl.textContent !== txt) { r.posEl.textContent = txt; r.lw = 0; }
      const tipY = r.y - 36 * r.k;
      const visible = r.x > -60 && r.x < 1980 && tipY > ly + 30;
      r.wedge.setAttribute('d', visible ? `M${(r.lx - 12).toFixed(1)} ${ly + 22}L${(r.lx + 12).toFixed(1)} ${ly + 22}L${r.x.toFixed(1)} ${tipY.toFixed(1)}Z` : '');
    }
  }
  function minimap() {
    const tr = T.tr;
    for (const r of T.R) {
      if (!r.mini) continue;
      const p = tr.at(r.s, 4 + r.lane * 1.5);
      r.mini.setAttribute('cx', p.x.toFixed(1));
      r.mini.setAttribute('cy', p.y.toFixed(1));
    }
  }
  const PHASE = { c1: '1ª CURVA', c2: '2ª CURVA', oposta: 'RETA OPOSTA', c3: '3ª CURVA' };
  function phaseName() {
    const ref = refRunner(), tr = T.tr;
    if (!T.started) return 'NOS PORTÕES';
    const rem = T.D - ref.s;
    if (T.finished && !ref.keep) return 'CHEGADA';
    const sg = tr.seg(ref.s);
    if (T.finished && ref.keep) return sg === 'casa' ? 'DEPOIS DA LINHA' : PHASE[sg] || '4ª CURVA';
    if (sg === 'casa') return rem <= tr.pf + 5 ? 'RETA FINAL' : T.race.pista !== 'mejiro' && T.race.pista !== 'tracen' ? 'DIANTE DA ARQUIBANCADA' : 'RETA PRINCIPAL';
    // a curva que leva à reta final é sempre a "última curva"
    if ((sg === 'c3' || sg === 'c4') && rem <= tr.pf + tr.Q * 2 + 20) return 'ÚLTIMA CURVA';
    if (sg === 'c4') return '4ª CURVA';
    return PHASE[sg] || '';
  }
  function hud(force) {
    const E = T.els, ref = refRunner();
    const ph = phaseName();
    if (force || ph !== T.phaseKey) {
      T.phaseKey = ph;
      E.phaseEl.textContent = ph;
      E.dist.dataset.ph = ph === 'RETA FINAL' ? 'final' : ph === 'ÚLTIMA CURVA' ? 'ultima' : ph === 'CHEGADA' || ph === 'DEPOIS DA LINHA' ? 'chegada' : '';
      E.dist.classList.remove('pulse');
      void E.dist.offsetWidth;
      if (!force) E.dist.classList.add('pulse');
    }
    const rem = Math.max(0, T.D - (T.finished ? T.D : ref.s));
    const remTxt = T.finished ? '0' : fmt(Math.ceil(rem / 10) * 10);
    if (E.remEl.textContent !== remTxt) E.remEl.textContent = remTxt;
    E.barEl.style.width = (clamp(1 - rem / T.D, 0, 1) * 100).toFixed(1) + '%';
    const secs = Math.max(0, Math.min(leader().s, T.D)) / T.vavg;
    const clock = `${Math.floor(secs / 60)}:${(secs % 60).toFixed(1).padStart(4, '0')}`;
    if (E.clockEl.textContent !== clock) E.clockEl.textContent = clock;
  }

  /* ---------------------------------------------- faixas, cut-in, placar */
  function banner(text, fast) {
    if (fast) return;
    const b = T.els.banner;
    b.innerHTML = `<span>${esc(text)}</span>`;
    b.className = 'tk-banner';
    void b.offsetWidth;
    b.className = 'tk-banner on';
    clearTimeout(T.bannerT);
    T.bannerT = setTimeout(() => { b.className = 'tk-banner'; }, 1900);
    if (VN.Audio) VN.Audio.sfx('tk_faixa');
  }
  const FACE = { vega: 0.255, loves: 0.26, still: 0.29, dober: 0.26, ramonu: 0.23, toproad: 0.27, opera: 0.26, groove: 0.25, marche: 0.25, rudolf: 0.23, mrcb: 0.235, curren: 0.29, neo: 0.27 };
  function cutin(who, style, fast) {
    const E = T.els;
    if (!who || who === 'off' || fast || !VN.CAST[who]) {
      E.cut.classList.remove('on');
      T.cut = null;
      return;
    }
    const r = T.R.find((q) => q.who === who);
    const col = colorsOf(who);
    const same = T.cut && T.cut.who === who && T.cut.style === (style || '');
    T.cut = { who, style: style || '' };
    if (same && E.cut.classList.contains('on')) return;
    E.cut.style.setProperty('--c', col.main);
    E.cut.style.setProperty('--c2', col.sub);
    E.cut.dataset.style = style || '';
    // o recorte entra do lado com menos corredoras (e longe do placar)
    let mean = 0;
    for (const q of T.R) mean += clamp(q.x, 0, 1920) / T.R.length;
    const boardOn = T.board && !T.boardStandalone;
    E.cut.dataset.side = boardOn || mean > 1000 || (r && r.x > 1240) ? 'esq' : 'dir';
    const img = E.cut.querySelector('.tk-cut-img');
    const src = VN.API.sprite(who, 'corrida');
    if (img.getAttribute('src') !== src) img.src = src;
    img.style.setProperty('--face', FACE[who] || 0.26);
    E.cut.querySelector('.tk-cut-name').textContent = VN.CAST[who].name;
    E.cut.classList.remove('on');
    void E.cut.offsetWidth;
    E.cut.classList.add('on');
    if (VN.Audio) VN.Audio.sfx('tk_cutin');
  }
  /** "7 3:2 12:cabeça 5 9" → [{n, mg}] */
  function parseOrder(args, race) {
    const out = [], opts = {}, errors = [];
    for (const a of args) {
      const kv = /^([a-z]+)=(.+)$/.exec(a);
      if (kv) { opts[kv[1]] = kv[2]; continue; }
      if (['inquerito', 'foto', 'confirmado', 'recorde', 'off'].includes(a)) { opts[a] = true; continue; }
      const m = /^(\d+)(?::(.+))?$/.exec(a);
      if (!m) { errors.push(`não entendi "${a}"`); continue; }
      const n = +m[1];
      if (race && (n < 1 || n > race.n)) errors.push(`não há a corredora ${n} em ${race.titulo}`);
      out.push({ n, mg: m[2] || '' });
    }
    return { out, opts, errors };
  }
  function marginText(mg) {
    if (!mg) return '';
    const k = mg.toLowerCase();
    if (MARGINS[k]) return MARGINS[k];
    if (/^\d+([.,]\d+)?$/.test(k)) { const v = parseFloat(k.replace(',', '.')); return v === 1 ? '1 corpo' : String(k).replace('.', ',') + ' corpos'; }
    if (k === '1/2') return '½ corpo';
    if (k === '3/4') return '¾ corpo';
    return mg;
  }
  function showBoard(raceId, args, fast) {
    const race = VN.CORRIDAS[raceId];
    if (!race) return;
    const { out, opts } = parseOrder(args, race);
    const B = T.els.board;
    if (opts.off) { hideBoard(fast); return; }
    const demoted = opts.rebaixada ? +opts.rebaixada : 0;
    const lamp = opts.inquerito ? 'inquerito' : opts.foto ? 'foto' : 'confirmado';
    const lampTxt = { inquerito: '<b>審議</b> INQUÉRITO', foto: '<b>写真</b> FOTOGRAFIA', confirmado: '<b>確定</b> CONFIRMADO' }[lamp];
    const rows = out.slice(0, 5).map((o, i) => {
      const who = race.quem && race.quem[o.n];
      const name = who && VN.CAST[who] ? VN.CAST[who].name : `Corredora nº ${o.n}`;
      const col = who && VN.CAST[who] ? colorsOf(who).main : '#5d5868';
      const tag = demoted === o.n ? '<em class="tkb-tag">降着 REBAIXADA</em>' : '';
      const mg = i === 0 ? '' : marginText(o.mg);
      return `<div class="tkb-row${who ? ' named' : ''}${demoted === o.n ? ' demoted' : ''}" style="--c:${col}"><b class="tkb-place">${i + 1}</b><i class="tkb-num">${o.n}</i><span class="tkb-name">${esc(name)}</span>${tag}<em class="tkb-mg">${esc(mg)}</em></div>`;
    }).join('');
    const time = opts.tempo || (lamp === 'confirmado' ? race.tempo : '') || '';
    const rec = opts.recorde || (race.recorde && lamp === 'confirmado');
    B.innerHTML = `<div class="tkb-head"><span class="tkb-race">${esc(race.titulo)}</span><span class="tkb-lamp" data-k="${lamp}">${lampTxt}</span></div>`
      + `<div class="tkb-rows">${rows}</div>`
      + `<div class="tkb-foot"><span>${esc(VN.PISTAS[race.pista].nome)} · ${fmt(race.dist)} m</span>${time ? `<span class="tkb-time">${rec ? '<b class="tkb-rec">RECORDE</b>' : ''}${esc(time)}</span>` : ''}</div>`;
    B.dataset.standalone = T.on && T.id === raceId ? '' : '1';
    B.classList.remove('hidden', 'out');
    T.board = { id: raceId, args: args.slice() };
    T.boardStandalone = !(T.on && T.id === raceId);
    // medalhas sobre os marcadores, se a corrida estiver aberta
    if (T.on && T.id === raceId && lamp === 'confirmado') {
      for (const r of T.R) setMedal(r, 0);
      out.slice(0, 3).forEach((o, i) => { if (T.byN[o.n]) setMedal(T.byN[o.n], i + 1); });
    }
    if (!fast && VN.Audio) VN.Audio.sfx(lamp === 'inquerito' ? 'tk_inquerito' : 'tk_placar');
  }
  function hideBoard(fast) {
    const B = T.els.board;
    T.board = null;
    T.boardStandalone = false;
    if (!B || B.classList.contains('hidden')) return;
    if (fast) { B.classList.add('hidden'); return; }
    B.classList.add('out');
    setTimeout(() => { if (!T.board) B.classList.add('hidden'); B.classList.remove('out'); }, 380);
  }

  /* ---------------------------------------------- som das passadas */
  function startSound() {
    stopSound();
    T.sound = setInterval(() => {
      const A = VN.Audio;
      if (!T.on || !A || !A.ready || !T.started) return;
      const moving = T.sAnim || (T.crawl && T.S - T.crawl.base < T.crawl.max - 1) || T.R.some((r) => r.keep);
      if (T.finished && !T.R.some((r) => r.keep)) return;
      if (!moving && Math.random() < 0.4) return;
      const I = A.inst(A.sfxBus), t = A.ctx.currentTime;
      const loud = (T.race.publico === false ? 1.5 : 1) * (T.hot ? 1.35 : 1) * (T.sAnim ? 1.2 : 0.85);
      const nHits = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < nHits; i++) I.tom(t + Math.random() * 0.12, 38 + Math.floor(Math.random() * 6), 0.028 * loud);
    }, 130);
  }
  function stopSound() { clearInterval(T.sound); T.sound = 0; }

  /* ================================================== interface pública */
  const Tracking = {
    get on() { return T.on; },
    get raceId() { return T.id; },
    parseFormation,
    makeTrack,
    /** executa um @tracking do roteiro; devolve uma Promise quando precisa esperar */
    command(a, rest, fast) {
      const sub = (a[0] || '').toLowerCase();
      const args = a.slice(1);
      const opt = (k) => { const m = args.find((x) => x.startsWith(k + '=')); return m ? m.slice(k.length + 1) : null; };
      if (sub === 'on') {
        open(args[0], { em: opt('em') });
        if (VN.Stage) VN.Stage.textbox(false);
        if (fast) return;
        return new Promise((r) => setTimeout(r, 500));
      }
      if (sub === 'off') return close(fast);
      if (sub === 'resultado') { build(); showBoard(args[0], args.slice(1), fast); return; }
      if (sub === 'placar' && args[0] === 'off') { hideBoard(fast); return; }
      if (!T.on) { console.warn('@tracking ' + sub + ' com o painel fechado'); return; }
      const R = (n) => T.byN[+n];
      switch (sub) {
        case 'ordem': {
          const src = rest.replace(/^\s*ordem\s*/i, '').replace(/\bem=[\d.]+/, '');
          setFormation(src, opt('em') ? parseFloat(opt('em')) : null, fast);
          if (fast) for (const r of T.R) r.s = runnerS(r);
          return;
        }
        case 'ir': {
          const d = go(args[0], opt('em') ? parseFloat(opt('em')) : null, fast);
          if (!fast && args.includes('espera') && d) {
            const E = VN.Engine;
            return new Promise((resolve) => {
              const t = setTimeout(() => { E.waitTimer = null; resolve(); }, d * 1000);
              E.waitTimer = () => { clearTimeout(t); E.waitTimer = null; resolve(); };
            });
          }
          return;
        }
        case 'foco': {
          T.focus = args[0] && args[0] !== 'campo' && R(args[0]) ? +args[0] : null;
          if (args[1] && (ZOOMS[args[1]] || args[1] === 'auto')) T.zoom = args[1];
          else if (!T.focus) T.zoom = 'auto';
          return;
        }
        case 'zoom': T.zoom = ZOOMS[args[0]] ? args[0] : 'auto'; return;
        case 'marca': { const r = R(args[0]); if (r) mark(r, args[1], args.includes('fixo'), fast); return; }
        case 'aura': { const r = R(args[0]); if (r) setAura(r, args[1] || 'branca'); return; }
        case 'rastro': { const r = R(args[0]); if (r) setTrail(r, args[1] || 'cor'); return; }
        case 'choque': { const x = R(args[0]), y = R(args[1]); if (x && y) impact(x, y, fast); return; }
        case 'faixa': banner(rest.replace(/^\s*faixa\s*/i, ''), fast); return;
        case 'cutin': cutin(args[0], args[1], fast); T.cutNext = !!(args[0] && args[0] !== 'off' && !args.includes('fixo')); T.cutFixed = args.includes('fixo'); return;
        case 'placar': showBoard(T.id, args, fast); return;
        case 'nomes': T.names = args[0] !== 'off'; return;
        case 'continua': { const r = R(args[0]); if (r) { r.keep = true; r.cap = null; } return; }
        case 'para': { const r = R(args[0]); if (r) { r.keep = false; r.cap = r.s + 26; } return; }
        default: console.warn('@tracking: subcomando desconhecido', sub);
      }
    },
    /** cada fala: a personagem que corre aparece num recorte (cut-in) */
    line(who, text, style) {
      if (!T.on) return;
      // pulando falas: nada de recortes passando pela tela
      if (VN.Engine && (VN.Engine.skip || VN.Engine.ctrlSkip)) { if (T.cut) cutin(null); T.cutNext = false; return; }
      if (T.cutNext) { T.cutNext = false; return; }
      if (T.cutFixed) return;
      const runner = who && T.R.find((r) => r.who === who);
      if (runner) {
        const thought = /^\s*\*/.test(text);
        cutin(who, thought ? 'pensamento' : style === 'escura' ? 'sombra' : '', false);
      } else if (T.cut) cutin(null);
    },
    reset() {
      if (T.built) { close(true); hideBoard(true); }
    },
    sceneChanged() { if (T.boardStandalone) hideBoard(false); },
    snapshot() {
      if (!T.on) return T.board && T.boardStandalone ? { board: T.board } : null;
      return {
        id: T.id, S: f1(T.sAnim ? T.sAnim.to : T.S), started: T.started,
        r: T.R.map((r) => [r.n, f1(r.f ? r.f.to : r.off), f1(r.f ? r.f.tl : r.lane), r.cap == null ? null : f1(r.cap), r.keep ? 1 : 0, r.aura || 0, r.trail || 0, r.sym && r.sym.fixed ? r.sym.k : 0, r.medal]),
        focus: T.focus, zoom: T.zoom, names: T.names, board: T.board,
      };
    },
    restore(s) {
      this.reset();
      if (!s) return;
      if (!s.id) { if (s.board) { build(); showBoard(s.board.id, s.board.args, true); } return; }
      open(s.id);
      T.S = s.S; T.started = s.started; T.finished = T.S >= T.D;
      for (const [n, off, lane, cap, keep, aura, trail, sym, medal] of s.r) {
        const r = T.byN[n];
        if (!r) continue;
        r.off = off; r.lane = lane; r.lastLane = lane; r.cap = cap; r.keep = !!keep;
        if (aura) setAura(r, aura);
        if (trail) setTrail(r, trail);
        if (sym) mark(r, sym, true, true);
        if (medal) setMedal(r, medal);
        r.s = runnerS(r);
      }
      T.focus = s.focus; T.zoom = s.zoom || 'auto'; T.names = s.names !== false;
      T.crawl = T.started ? { base: T.S, t0: T.time, max: crawlRoom(T.S) } : null;
      fitCamera(1, true);
      if (s.board) showBoard(s.board.id, s.board.args, true);
    },

    /** confere um @tracking do roteiro (modo ?teste=1); ctx guarda a corrida aberta */
    validate(a, rest, ctx) {
      const errs = [];
      const sub = (a[0] || '').toLowerCase();
      const args = a.slice(1);
      const race = ctx.race && VN.CORRIDAS[ctx.race];
      const needRace = () => { if (!race) errs.push(`@tracking ${sub} sem @tracking on antes`); return !!race; };
      const num = (x) => { if (!race) return; const n = +x; if (!(n >= 1 && n <= race.n)) errs.push(`corredora inexistente em ${ctx.race}: ${x}`); };
      switch (sub) {
        case 'on':
          if (!VN.CORRIDAS[args[0]]) errs.push('corrida inexistente: ' + args[0]);
          else {
            ctx.race = args[0];
            const em = args.find((x) => x.startsWith('em='));
            if (em && !this.pointOk(em.slice(3))) errs.push('ponto inválido: ' + em);
            const rc = VN.CORRIDAS[args[0]];
            if (!VN.PISTAS[rc.pista]) errs.push('pista inexistente: ' + rc.pista);
            for (const n in rc.quem || {}) if (!VN.CAST[rc.quem[n]]) errs.push('personagem inexistente na corrida: ' + rc.quem[n]);
          }
          break;
        case 'off': ctx.race = null; break;
        case 'ordem':
          if (needRace()) {
            const nums = Array.from({ length: race.n }, (_, i) => i + 1);
            const src = rest.replace(/^\s*ordem\s*/i, '').replace(/\bem=[\d.]+/, '');
            parseFormation(src, nums, nums).errors.forEach((e) => errs.push('ordem: ' + e));
          }
          break;
        case 'ir':
          if (needRace()) {
            if (!this.pointOk(args[0])) errs.push('ponto inválido: ' + args[0]);
            else if (!/^\+?\d/.test(args[0]) && !['apos', 'chegada'].includes(args[0])) {
              // largadas no bolsão pulam algumas curvas: confere se o ponto existe nesta pista
              const tr = makeTrack(VN.PISTAS[race.pista], race.dist, race.n);
              if (tr.wp[args[0]] == null) errs.push(`a corrida ${ctx.race} não passa por "${args[0]}"`);
            }
          }
          break;
        case 'foco':
          if (needRace() && args[0] !== 'campo') num(args[0]);
          if (args[1] && !ZOOMS[args[1]] && args[1] !== 'auto') errs.push('zoom inválido: ' + args[1]);
          break;
        case 'zoom': if (!ZOOMS[args[0]] && args[0] !== 'auto') errs.push('zoom inválido: ' + args[0]); break;
        case 'marca': if (needRace()) { num(args[0]); if (!SYMS.includes(args[1])) errs.push('símbolo inválido: ' + args[1]); } break;
        case 'aura': if (needRace()) { num(args[0]); if (args[1] && !AURAS.includes(args[1])) errs.push('aura inválida: ' + args[1]); } break;
        case 'rastro': if (needRace()) { num(args[0]); if (args[1] && !TRAILS.includes(args[1]) && !/^#[0-9a-f]{6}$/i.test(args[1])) errs.push('rastro inválido: ' + args[1]); } break;
        case 'choque': if (needRace()) { num(args[0]); num(args[1]); } break;
        case 'faixa': if (!rest.replace(/^\s*faixa\s*/i, '').trim()) errs.push('faixa sem texto'); needRace(); break;
        case 'cutin': if (args[0] !== 'off' && !VN.CAST[args[0]]) errs.push('cut-in de quem? ' + args[0]); break;
        case 'placar':
          if (args[0] !== 'off' && needRace()) parseOrder(args, race).errors.forEach((e) => errs.push('placar: ' + e));
          break;
        case 'resultado': {
          const rc = VN.CORRIDAS[args[0]];
          if (!rc) errs.push('corrida inexistente: ' + args[0]);
          else parseOrder(args.slice(1), rc).errors.forEach((e) => errs.push('resultado: ' + e));
          break;
        }
        case 'nomes': break;
        case 'continua': case 'para': if (needRace()) num(args[0]); break;
        default: errs.push('subcomando desconhecido: ' + sub);
      }
      return errs;
    },
    pointOk(x) { return x != null && (/^\+?\d+(\.\d+)?$/.test(x) || POINTS.includes(String(x).toLowerCase())); },
  };
  VN.Tracking = Tracking;
})();
