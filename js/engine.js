/* =========================================================================
   Motor da novel: armazenamento, configurações, leitura do roteiro,
   palco (cenário, personagens, caixa de texto) e execução.

   O roteiro fica em js/story/*.js, escrito numa linguagem simples:

     == rotulo                       início de um trecho
     # Capítulo 1 | Título            cartão de capítulo
     @fundo pista tarde chuva v=vazio preto
     @mostrar vega centro corrida perto
     @esconder vega | todos
     vega [pulo coracao]: Fala com animação e emote.
     eu: Fala do(a) jogador(a).
     "Narrador": Fala com nome livre.
     Linha sem nome é narração.
     ? Opção => rotulo | vega+1, flag:nome
     @se vega>=5 && flag:x => rotulo
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const $ = (s, r) => (r || document).querySelector(s);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ================================================== armazenamento */
  const LS = {
    get(k, def) {
      try { const v = localStorage.getItem('umanovel.' + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
    },
    set(k, v) {
      try { localStorage.setItem('umanovel.' + k, JSON.stringify(v)); return true; } catch (e) { return false; }
    },
    del(k) { try { localStorage.removeItem('umanovel.' + k); } catch (e) { /* bloqueado */ } },
  };
  VN.LS = LS;

  /* ================================================== configurações */
  const DEFAULTS = { textSpeed: 42, autoDelay: 1.6, music: 0.6, sfx: 0.7, skipUnread: false, focus: true, reduceMotion: false, parallax: true };
  VN.Settings = {
    data: Object.assign({}, DEFAULTS, LS.get('settings', {})),
    get(k) { return this.data[k]; },
    set(k, v) {
      this.data[k] = v;
      LS.set('settings', this.data);
      this.apply();
    },
    apply() {
      if (VN.Audio) VN.Audio.setVolumes(this.data.music, this.data.sfx);
      document.documentElement.classList.toggle('reduce-motion', !!this.data.reduceMotion);
    },
    reset() { this.data = Object.assign({}, DEFAULTS); LS.set('settings', this.data); this.apply(); },
  };

  /* ================================================== jogador(a) */
  VN.Player = {
    data: Object.assign({ name: '', gender: 'm' }, LS.get('player', {})),
    has() { return !!LS.get('player', null); },
    save() { LS.set('player', this.data); },
    title() { return this.data.gender === 'f' ? 'Treinadora' : 'Treinador'; },
    displayName() { return this.data.name || this.title(); },
  };
  /** troca marcadores de gênero e nome no texto */
  function subst(s) {
    const f = VN.Player.data.gender === 'f';
    const T = f ? 'Treinadora' : 'Treinador';
    const map = {
      t: T, tt: T.toLowerCase(), o: f ? 'a' : 'o', O: f ? 'A' : 'O', ele: f ? 'ela' : 'ele', Ele: f ? 'Ela' : 'Ele',
      dele: f ? 'dela' : 'dele', um: f ? 'uma' : 'um', meu: f ? 'minha' : 'meu', Meu: f ? 'Minha' : 'Meu',
      seu: f ? 'sua' : 'seu', Seu: f ? 'Sua' : 'Seu', nome: VN.Player.data.name || T,
    };
    return String(s).replace(/\{(t|tt|o|O|ele|Ele|dele|um|meu|Meu|seu|Seu|nome)\}/g, (_, k) => map[k]);
  }
  VN.subst = subst;

  /* ================================================== progresso salvo */
  const Store = {
    seen: new Set(LS.get('seen', [])),
    endings: LS.get('endings', {}),
    _t: 0,
    isSeen(k) { return this.seen.has(k); },
    markSeen(k) {
      if (this.seen.has(k)) return;
      this.seen.add(k);
      clearTimeout(this._t);
      this._t = setTimeout(() => LS.set('seen', Array.from(this.seen)), 800);
    },
    slots() { return LS.get('saves', {}); },
    saveSlot(slot, data) {
      const all = this.slots();
      all[slot] = data;
      return LS.set('saves', all);
    },
    deleteSlot(slot) { const all = this.slots(); delete all[slot]; LS.set('saves', all); },
    latest() {
      const all = this.slots();
      let best = null;
      for (const k in all) if (!best || all[k].t > best.t) best = all[k];
      return best;
    },
    unlock(id) { if (!this.endings[id]) { this.endings[id] = Date.now(); LS.set('endings', this.endings); } },
    hasEnding(id) { return !!this.endings[id]; },
    wipe() { ['seen', 'endings', 'saves', 'player'].forEach((k) => LS.del(k)); this.seen = new Set(); this.endings = {}; },
  };
  VN.Store = Store;

  /* ================================================== roteiro */
  const TIMES = new Set(['manha', 'dia', 'tarde', 'crepusculo', 'noite']);
  const TRANS = new Set(['corte', 'preto', 'branco', 'lento', 'rapido', 'suave']);
  const POS = { esq2: 300, esquerda: 540, meioesq: 760, centro: 960, meiodir: 1160, direita: 1380, dir2: 1620 };
  const SIZES = { normal: { h: 1880, top: -215 }, longe: { h: 1130, top: -14 }, perto: { h: 2480, top: -330 } };
  const OUTFITS = new Set(['uniforme', 'corrida']);
  const ENTERS = new Set(['deslizar', 'surgir', 'pulando', 'esqentra', 'direntra']);
  const ONESHOT = new Set(['pulo', 'salto', 'tremor', 'aceno', 'inclina', 'susto']);
  const PERSIST = { abatida: 'sink', vira: 'flip', aura: 'aura', correr: 'run', arrepio: 'trem' };
  const CLEAR = { levanta: 'sink', desvira: 'flip', semaura: 'aura', parar: ['run', 'trem'], calma: 'trem' };
  const EMOTES = {
    coracao: '<svg viewBox="0 0 40 36"><path d="M20 34 C6 24 0 16 3 9 C6 2 15 1 20 8 C25 1 34 2 37 9 C40 16 34 24 20 34Z" fill="#ff5f9e" stroke="#fff" stroke-width="3"/></svg>',
    coracoes: '<svg viewBox="0 0 60 44"><path d="M18 40 C6 31 1 24 3 18 C6 11 14 11 18 17 C22 11 30 11 33 18 C35 24 30 31 18 40Z" fill="#ff7ab8" stroke="#fff" stroke-width="3"/><path d="M44 24 C36 18 33 13 35 9 C37 5 42 5 44 9 C46 5 51 5 53 9 C55 13 52 18 44 24Z" fill="#ffb3d6" stroke="#fff" stroke-width="2.5"/></svg>',
    nota: '<svg viewBox="0 0 40 44"><path d="M14 6 L36 2 L36 30" fill="none" stroke="#3a7bd5" stroke-width="5" stroke-linejoin="round"/><path d="M14 6 L14 36" stroke="#3a7bd5" stroke-width="5"/><ellipse cx="9" cy="36" rx="8" ry="6" fill="#3a7bd5"/><ellipse cx="31" cy="30" rx="8" ry="6" fill="#3a7bd5"/></svg>',
    gota: '<svg viewBox="0 0 30 44"><path d="M15 2 C21 14 28 22 28 30 A13 13 0 0 1 2 30 C2 22 9 14 15 2Z" fill="#8fd3ff" stroke="#fff" stroke-width="3"/><ellipse cx="10" cy="29" rx="3" ry="5" fill="#fff" opacity=".8"/></svg>',
    raiva: '<svg viewBox="0 0 44 44"><g fill="none" stroke="#ff3b4a" stroke-width="5" stroke-linecap="round"><path d="M18 4 Q19 16 6 17"/><path d="M26 4 Q25 16 38 17"/><path d="M18 40 Q19 28 6 27"/><path d="M26 40 Q25 28 38 27"/></g></svg>',
    exclamacao: '<svg viewBox="0 0 24 48"><path d="M6 4 L18 4 L15 32 L9 32Z" fill="#ffcf3a" stroke="#c44" stroke-width="2.5" stroke-linejoin="round"/><circle cx="12" cy="41" r="5" fill="#ffcf3a" stroke="#c44" stroke-width="2.5"/></svg>',
    interrogacao: '<svg viewBox="0 0 30 48"><path d="M5 14 C5 4 25 2 25 14 C25 22 15 22 15 31" fill="none" stroke="#7a8cff" stroke-width="6" stroke-linecap="round"/><circle cx="15" cy="42" r="4.5" fill="#7a8cff"/></svg>',
    reticencias: '<svg viewBox="0 0 64 40"><rect x="2" y="2" width="60" height="30" rx="15" fill="#fff" stroke="#9a8fa8" stroke-width="2.5"/><path d="M18 31 L12 39 L26 32Z" fill="#fff" stroke="#9a8fa8" stroke-width="2"/><circle cx="20" cy="17" r="3.5" fill="#6b5f78"/><circle cx="32" cy="17" r="3.5" fill="#6b5f78"/><circle cx="44" cy="17" r="3.5" fill="#6b5f78"/></svg>',
    estrela: '<svg viewBox="0 0 44 44"><path d="M22 3 L27.5 16 L41 17 L30.5 26 L34 40 L22 32.5 L10 40 L13.5 26 L3 17 L16.5 16Z" fill="#ffe066" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>',
    brilho: '<svg viewBox="0 0 48 48"><path d="M24 2 C26 18 30 22 46 24 C30 26 26 30 24 46 C22 30 18 26 2 24 C18 22 22 18 24 2Z" fill="#fff6c2" stroke="#ffd25a" stroke-width="2"/><path d="M40 4 C41 9 42 10 46 11 C42 12 41 13 40 18 C39 13 38 12 34 11 C38 10 39 9 40 4Z" fill="#fff"/></svg>',
    zzz: '<svg viewBox="0 0 48 44"><text x="4" y="40" font-family="Fredoka,sans-serif" font-weight="700" font-size="22" fill="#8a9cff">z</text><text x="18" y="28" font-family="Fredoka,sans-serif" font-weight="700" font-size="17" fill="#a6b4ff">z</text><text x="30" y="16" font-family="Fredoka,sans-serif" font-weight="700" font-size="13" fill="#c2cbff">z</text></svg>',
    lua: '<svg viewBox="0 0 44 44"><path d="M28 4 A18 18 0 1 0 40 32 A14 14 0 1 1 28 4Z" fill="#ff5a6a" stroke="#fff" stroke-width="2.5"/></svg>',
    nuvem: '<svg viewBox="0 0 56 40"><path d="M14 34 C4 34 3 22 12 21 C11 12 24 9 27 16 C30 7 45 9 44 20 C53 20 53 34 44 34Z" fill="#9aa3b5" stroke="#fff" stroke-width="3"/><path d="M16 26 q4 -4 8 0 q4 4 8 0 q4 -4 8 0" fill="none" stroke="#5d6577" stroke-width="2.5"/></svg>',
    rubor: '<svg viewBox="0 0 48 30"><g stroke="#ff6f8f" stroke-width="4" stroke-linecap="round"><path d="M8 24 L16 6"/><path d="M20 24 L28 6"/><path d="M32 24 L40 6"/></g></svg>',
  };
  // altura aproximada da cabeça em cada arte (fração da altura da imagem)
  const HEAD = { vega: 0.2, loves: 0.21, still: 0.235, curren: 0.24, toproad: 0.22, opera: 0.21, chrono: 0.2, marche: 0.2, neo: 0.22, groove: 0.2, ramonu: 0.17, tazuna: 0.2, dober: 0.21, ryan: 0.19, taiki: 0.16, airgroove: 0.18, ardan: 0.19, kris: 0.16, rudolf: 0.18, mrcb: 0.18 };

  function parseArgs(str) {
    const out = [];
    const re = /"([^"]*)"|(\S+)/g;
    let m;
    while ((m = re.exec(str))) out.push(m[1] != null ? m[1] : m[2]);
    return out;
  }

  const Script = {
    labels: {}, order: [], errors: [],
    add(route, text) {
      const lines = text.split(/\r?\n/);
      let cur = null, paper = null, menu = null;
      for (let ln = 0; ln < lines.length; ln++) {
        let line = lines[ln].trim();
        // linhas com [m] ou [f] só aparecem para Treinador / Treinadora
        let gnd = null;
        const gm = paper ? null : /^\[(m|f)\]\s+(.*)$/.exec(line);
        if (gm) { gnd = gm[1]; line = gm[2]; }
        const push = (c) => { if (gnd) c.gender = gnd; cur.push(c); };
        if (paper) {
          if (/^@fimpapel\b/.test(line)) { cur.push(paper); paper = null; } else paper.lines.push(line);
          continue;
        }
        if (!line || line.startsWith('//')) { if (!line) menu = null; continue; }
        if (line.startsWith('==')) {
          const name = line.slice(2).trim();
          if (this.labels[name]) this.errors.push(`Rótulo repetido: ${name}`);
          cur = [];
          this.labels[name] = { route, cmds: cur, line: ln + 1 };
          this.order.push(name);
          menu = null;
          continue;
        }
        if (!cur) { this.errors.push(`[${route}] linha ${ln + 1}: texto antes do primeiro rótulo`); continue; }
        if (line.startsWith('?')) {
          const om = /^\?\s*(?:\[([^\]]+)\]\s*)?(.*?)\s*=>\s*([\w$]+)\s*(?:\|\s*(.*))?$/.exec(line);
          if (!om) { this.errors.push(`[${route}] linha ${ln + 1}: opção mal formada`); continue; }
          if (!menu) { menu = { t: 'choice', options: [], line: ln + 1 }; cur.push(menu); }
          menu.options.push({ cond: om[1] || null, gender: gnd, text: om[2], target: om[3], effects: om[4] ? om[4].split(',').map((s) => s.trim()).filter(Boolean) : [] });
          continue;
        }
        menu = null;
        if (line.startsWith('#')) {
          const [title, sub] = line.slice(1).split('|').map((s) => s.trim());
          push({ t: 'card', title, sub: sub || '', line: ln + 1 });
          continue;
        }
        if (line.startsWith('@')) {
          const sp = line.indexOf(' ');
          const name = (sp < 0 ? line.slice(1) : line.slice(1, sp)).toLowerCase();
          const rest = sp < 0 ? '' : line.slice(sp + 1).trim();
          if (name === 'papel') {
            const parts = rest.split('|');
            paper = { t: 'paper', style: parts[0].trim().split(/\s+/)[0] || 'nota', title: (parts.slice(1).join('|') || '').trim(), lines: [], line: ln + 1 };
            continue;
          }
          if (name === 'chat') {
            const m = /^([^:]+):\s*(.*)$/.exec(rest);
            push({ t: 'chat', user: m ? m[1].trim() : 'anônimo', msg: m ? m[2] : rest, line: ln + 1 });
            continue;
          }
          if (name === 'final') {
            const p = rest.split('|').map((s) => s.trim());
            push({ t: 'ending', id: p[0], title: p[1] || '', kind: p[2] || '', text: p[3] || '', line: ln + 1 });
            continue;
          }
          push({ t: 'cmd', name, args: parseArgs(rest), rest, line: ln + 1 });
          continue;
        }
        const m = /^([a-z_]+|"[^"]+")\s*(?:\[([^\]]*)\])?\s*:\s*(.*)$/.exec(line);
        if (m && (m[1].startsWith('"') || VN.CAST[m[1]] || m[1] === 'eu')) {
          push({ t: 'say', who: m[1].replace(/"/g, ''), acts: m[2] ? m[2].trim().split(/\s+/) : [], text: m[3], line: ln + 1 });
          continue;
        }
        push({ t: 'narr', text: line, line: ln + 1 });
      }
      if (paper) this.errors.push(`[${route}] @papel sem @fimpapel`);
    },
  };
  VN.Script = Script;

  /* ================================================== condições */
  function evalCond(src, st) {
    const toks = src.match(/\s*(&&|\|\||!|\(|\)|>=|<=|==|!=|>|<|-?\d+(?:\.\d+)?|[\w:]+)\s*/g) || [];
    let i = 0;
    const peek = () => (toks[i] || '').trim();
    const next = () => (toks[i++] || '').trim();
    const val = (name) => {
      if (name.startsWith('flag:')) return st.flags[name.slice(5)] ? 1 : 0;
      if (name === 'fem') return VN.Player.data.gender === 'f' ? 1 : 0;
      if (name === 'masc') return VN.Player.data.gender === 'f' ? 0 : 1;
      if (VN.CAST[name]) return st.aff[name] || 0;
      if (/^-?\d/.test(name)) return parseFloat(name);
      return st.flags[name] ? 1 : 0;
    };
    function atom() {
      const t = next();
      if (t === '(') { const v = or(); next(); return v; }
      if (t === '!') return !atom();
      const left = val(t);
      const op = peek();
      if (['>=', '<=', '==', '!=', '>', '<'].includes(op)) {
        next();
        const right = val(next());
        return { '>=': left >= right, '<=': left <= right, '==': left === right, '!=': left !== right, '>': left > right, '<': left < right }[op];
      }
      return !!left;
    }
    function and() { let v = atom(); while (peek() === '&&') { next(); const r = atom(); v = v && r; } return v; }
    function or() { let v = and(); while (peek() === '||') { next(); const r = and(); v = v || r; } return v; }
    try { return !!or(); } catch (e) { console.warn('Condição inválida:', src); return false; }
  }

  function applyEffects(list, st) {
    for (const ef of list) {
      let m;
      if ((m = /^([a-z_]+)\s*([+-]\d+)$/.exec(ef)) && VN.CAST[m[1]]) st.aff[m[1]] = (st.aff[m[1]] || 0) + parseInt(m[2], 10);
      else if ((m = /^!flag:(\w+)$/.exec(ef))) delete st.flags[m[1]];
      else if ((m = /^flag:(\w+)$/.exec(ef))) st.flags[m[1]] = true;
    }
  }

  /* ================================================== marcação de texto */
  /** cria um <span> por letra (para o efeito de máquina de escrever) */
  function renderMarkup(text, container) {
    const chars = [];
    const pauses = {};
    const stack = [container];
    const open = [];
    let i = 0;
    const top = () => stack[stack.length - 1];
    const push = (tag, cls, kind) => { const el = document.createElement(tag); if (cls) el.className = cls; top().appendChild(el); stack.push(el); open.push(kind); };
    const pop = (kind) => { const k = open.lastIndexOf(kind); if (k < 0) return; while (open.length > k) { open.pop(); stack.pop(); } };
    while (i < text.length) {
      const c = text[i];
      if (c === '*') { if (open.includes('em')) pop('em'); else push('em', '', 'em'); i++; continue; }
      if (c === '{') {
        const m = /^\{(\/?)(red|shake|big|small|glow|pink|w=([\d.]+))\}/.exec(text.slice(i));
        if (m) {
          if (m[3]) pauses[chars.length] = (pauses[chars.length] || 0) + parseFloat(m[3]) * 1000;
          else if (m[1]) pop(m[2]);
          else push('span', 'mk-' + m[2], m[2]);
          i += m[0].length;
          continue;
        }
      }
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      if (open.includes('shake')) s.style.animationDelay = (-Math.random()).toFixed(2) + 's';
      top().appendChild(s);
      chars.push(s);
      i++;
    }
    return { chars, pauses };
  }
  function plain(text) { return String(text).replace(/\{\/?(red|shake|big|small|glow|pink)\}|\{w=[\d.]+\}/g, '').replace(/\*/g, ''); }
  VN.plain = plain;

  /* ================================================== palco */
  const Stage = {
    els: {}, chars: {}, typing: null, choiceKeys: null, liveTimer: 0, liveState: { on: false, viewers: 0, flow: false, title: '' },
    init() {
      const g = $('#game');
      this.els = {
        game: g, bg: $('#bg', g), chars: $('#chars', g), textbox: $('#textbox', g), name: $('#tb-name', g), text: $('#tb-text', g),
        choices: $('#choices', g), card: $('#card', g), paper: $('#paper', g), live: $('#live', g), ending: $('#ending', g), trans: $('#trans', g),
      };
      // parallax suave do cenário
      this.par = { x: 0, y: 0, tx: 0, ty: 0 };
      g.addEventListener('mousemove', (e) => {
        const r = g.getBoundingClientRect();
        this.par.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        this.par.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      const loop = () => {
        const p = this.par;
        p.x += (p.tx - p.x) * 0.06; p.y += (p.ty - p.y) * 0.06;
        if (VN.Settings.get('parallax') && !VN.Settings.get('reduceMotion')) {
          const scene = this.els.bg.lastElementChild;
          if (scene) for (const l of scene.children) {
            const d = parseFloat(l.dataset.depth || 0);
            if (d) l.style.transform = `translate3d(${(-p.x * d * 16).toFixed(2)}px, ${(-p.y * d * 9).toFixed(2)}px, 0)`;
          }
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
    reset() {
      this.els.bg.innerHTML = '';
      this.els.chars.innerHTML = '';
      this.chars = {};
      this.els.text.innerHTML = '';
      this.els.textbox.classList.remove('has-name', 'waiting');
      this.els.textbox.dataset.style = 'normal';
      this.els.game.classList.remove('tb-hidden', 'ui-hidden');
      this.els.choices.classList.add('hidden');
      this.els.card.classList.add('hidden');
      this.els.paper.classList.add('hidden');
      this.els.ending.classList.add('hidden');
      this.setLive({ on: false });
      this.setLight('dia');
      VN.FX.reset();
      if (VN.Tracking) VN.Tracking.reset();
    },

    /* ---------------- cenário */
    setBg(spec, trans, fast) {
      if (VN.Tracking) VN.Tracking.sceneChanged();
      const out = VN.Scenes.render(spec.scene, spec);
      const el = document.createElement('div');
      el.className = 'bg-scene';
      el.innerHTML = out.html;
      const bg = this.els.bg;
      const olds = Array.from(bg.children);
      const t = fast ? 'corte' : trans || 'suave';
      const dur = { corte: 0, rapido: 350, suave: 750, lento: 1600, preto: 1100, branco: 1100 }[t] || 750;
      const done = () => olds.forEach((o) => o.remove());
      if (t === 'preto' || t === 'branco') {
        const tr = this.els.trans;
        tr.style.background = t === 'preto' ? '#07060a' : '#fffdfa';
        tr.style.transition = `opacity ${dur / 2}ms ease`;
        tr.style.opacity = 1;
        this.textbox(false);
        return sleep(dur / 2).then(() => {
          bg.appendChild(el);
          done();
          // com a tela coberta, quem estava em cena sai junto com o cenário
          this.hideChar('todos', true);
          tr.style.opacity = 0;
          return Object.assign(out, { wait: sleep(dur / 2) });
        });
      }
      if (t === 'corte' || !olds.length) {
        bg.appendChild(el);
        done();
        return Promise.resolve(out);
      }
      el.style.opacity = 0;
      bg.appendChild(el);
      void el.offsetWidth;
      el.style.transition = `opacity ${dur}ms ease`;
      el.style.opacity = 1;
      return sleep(dur).then(() => { done(); return out; });
    },

    /* ---------------- personagens */
    showChar(id, o, fast) {
      let c = this.chars[id];
      const st = Object.assign({ pos: 'centro', outfit: 'uniforme', size: 'normal', flags: [] }, c ? c.st : {}, o || {});
      if (!c) {
        const el = document.createElement('div');
        el.className = 'spr';
        el.dataset.id = id;
        el.innerHTML = '<div class="spr-anim"><div class="spr-state"><div class="spr-flip"><div class="spr-breathe"><img alt="" draggable="false"></div></div></div></div><div class="emote"></div>';
        el.style.setProperty('--head', HEAD[id] || 0.21);
        this.els.chars.appendChild(el);
        c = this.chars[id] = { el, img: el.querySelector('img'), st };
        const enter = fast ? '' : st.enter || 'surgir';
        if (enter) { el.classList.add('enter-' + enter); setTimeout(() => el.classList.remove('enter-' + enter), 700); }
        c.img.onerror = () => el.classList.add('noimg');
      }
      c.st = st;
      delete st.enter;
      const src = VN.API.sprite(id, st.outfit);
      if (c.img.getAttribute('src') !== src) {
        if (c.img.getAttribute('src') && !fast) {
          c.el.classList.add('swap');
          setTimeout(() => { c.img.src = src; c.el.classList.remove('swap'); }, 220);
        } else c.img.src = src;
      }
      const size = SIZES[st.size] || SIZES.normal;
      c.el.style.setProperty('--x', (POS[st.pos] != null ? POS[st.pos] : 960) + 'px');
      c.el.style.setProperty('--h', size.h + 'px');
      c.el.style.setProperty('--top', size.top + 'px');
      ['sink', 'flip', 'aura', 'run', 'trem'].forEach((f) => c.el.classList.toggle(f, st.flags.includes(f)));
      this.els.chars.appendChild(c.el); // traz para frente
      return c;
    },
    hideChar(id, fast) {
      const ids = id === 'todos' ? Object.keys(this.chars) : [id];
      for (const k of ids) {
        const c = this.chars[k];
        if (!c) continue;
        delete this.chars[k];
        if (fast) { c.el.remove(); continue; }
        c.el.classList.add('leaving');
        setTimeout(() => c.el.remove(), 450);
      }
    },
    action(id, act) {
      const c = id && this.chars[id];
      if (EMOTES[act]) { if (c) this.emote(c, act); return; }
      if (!c) return;
      if (ONESHOT.has(act)) {
        const a = c.el.querySelector('.spr-anim');
        a.classList.remove(...Array.from(ONESHOT).map((x) => 'a-' + x));
        void a.offsetWidth;
        a.classList.add('a-' + act);
        clearTimeout(c.animT);
        c.animT = setTimeout(() => a.classList.remove('a-' + act), 900);
        return;
      }
      if (PERSIST[act]) {
        const f = PERSIST[act];
        if (!c.st.flags.includes(f)) c.st.flags.push(f);
        c.el.classList.add(f);
        return;
      }
      if (CLEAR[act]) {
        const fl = [].concat(CLEAR[act]);
        c.st.flags = c.st.flags.filter((x) => !fl.includes(x));
        fl.forEach((f) => c.el.classList.remove(f));
      }
    },
    emote(c, name) {
      const e = c.el.querySelector('.emote');
      e.className = 'emote';
      e.innerHTML = EMOTES[name];
      void e.offsetWidth;
      e.classList.add('show', 'em-' + name);
      clearTimeout(c.emT);
      c.emT = setTimeout(() => e.classList.remove('show'), 1900);
    },
    focus(id) {
      const on = VN.Settings.get('focus');
      for (const k in this.chars) {
        const c = this.chars[k];
        c.el.classList.toggle('dim', on && !!id && k !== id && !!this.chars[id]);
        if (k === id) c.el.style.zIndex = 5; else c.el.style.zIndex = '';
      }
    },
    /** tinge as personagens com a luz do cenário (manhã, pôr do sol, noite, palco...) */
    setLight(light) { this.els.chars.dataset.light = light || 'dia'; },
    snapshotChars() {
      const out = {};
      for (const k of Array.from(this.els.chars.children).map((e) => e.dataset.id)) if (this.chars[k]) out[k] = Object.assign({}, this.chars[k].st, { flags: this.chars[k].st.flags.slice() });
      return out;
    },

    /* ---------------- caixa de texto */
    textbox(show) { this.els.game.classList.toggle('tb-hidden', !show); },
    textboxStyle(s) { this.els.textbox.dataset.style = s; },
    isTyping() { return !!this.typing; },
    finishTyping() { if (this.typing) this.typing.finish(); },
    showText(o) {
      const tb = this.els.textbox;
      this.textbox(true);
      tb.classList.remove('waiting');
      if (o.name) {
        this.els.name.textContent = o.name;
        tb.classList.add('has-name');
        tb.style.setProperty('--c1', o.color || '#8a7a9a');
        tb.style.setProperty('--c2', o.color2 || o.color || '#c9b9d9');
      } else tb.classList.remove('has-name');
      tb.classList.toggle('narration', !o.name);
      const box = this.els.text;
      box.innerHTML = '';
      const { chars, pauses } = renderMarkup(o.text, box);
      const cps = VN.Settings.get('textSpeed');
      if (o.instant || cps >= 120) {
        chars.forEach((s) => s.classList.add('on'));
        tb.classList.add('waiting');
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        let i = 0, acc = 0, last = performance.now(), raf = 0;
        const base = 1000 / cps;
        const finish = () => {
          cancelAnimationFrame(raf);
          chars.forEach((s) => s.classList.add('on'));
          this.typing = null;
          tb.classList.add('waiting');
          resolve();
        };
        this.typing = { finish };
        const step = (now) => {
          acc += now - last; last = now;
          while (i < chars.length) {
            const prev = i > 0 ? chars[i - 1].textContent : '';
            let need = base + (pauses[i] || 0);
            if ('.!?…'.includes(prev) && chars[i].textContent === ' ') need += 200;
            else if (prev === ',' && chars[i].textContent === ' ') need += 80;
            if (acc < need) break;
            acc -= need;
            chars[i].classList.add('on');
            i++;
          }
          if (i >= chars.length) return finish();
          raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      });
    },

    /* ---------------- escolhas */
    choose(options) {
      return new Promise((resolve) => {
        const box = this.els.choices;
        box.innerHTML = '';
        const btns = options.map((o, i) => {
          const b = document.createElement('button');
          b.className = 'choice';
          b.style.animationDelay = i * 70 + 'ms';
          b.innerHTML = `<span class="ck">${i + 1}</span><span class="ct">${esc(plain(subst(o.text)))}</span>`;
          b.addEventListener('mouseenter', () => VN.Audio.sfx('hover'));
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            VN.Audio.sfx('confirmar');
            box.classList.add('hidden');
            this.choiceKeys = null;
            resolve(o);
          });
          box.appendChild(b);
          return b;
        });
        this.choiceKeys = (n) => { if (btns[n]) btns[n].click(); };
        box.classList.remove('hidden');
      });
    },

    /* ---------------- cartão de capítulo */
    card(title, sub, route, fast) {
      const el = this.els.card;
      el.dataset.route = route || '';
      this.paint(el, route);
      const R = VN.ROUTES[route];
      el.querySelector('.chap-motif').innerHTML = R && VN.MOTIF ? VN.MOTIF[R.motif] : '';
      el.querySelector('.card-title').textContent = subst(title);
      el.querySelector('.card-sub').textContent = subst(sub || '');
      el.classList.remove('hidden', 'out');
      this.textbox(false);
      return new Promise((resolve) => {
        let done = false;
        const end = () => {
          if (done) return;
          done = true;
          el.classList.add('out');
          setTimeout(() => { el.classList.add('hidden'); resolve(); }, 600);
        };
        this.cardEnd = end;
        setTimeout(end, fast ? 500 : 2800);
      });
    },

    /* ---------------- papel (diário, carta, livro, tanzaku) */
    paper(style, title, lines, fast) {
      const el = this.els.paper;
      el.dataset.style = style;
      const inner = el.querySelector('.paper-inner');
      inner.innerHTML = '';
      if (title) { const h = document.createElement('div'); h.className = 'paper-title'; h.textContent = subst(title); inner.appendChild(h); }
      const body = document.createElement('div');
      body.className = 'paper-body';
      for (const ln of lines) {
        const p = document.createElement('p');
        if (!ln) p.className = 'gap';
        else {
          const { chars } = renderMarkup(subst(ln), p);
          chars.forEach((s) => s.classList.add('on'));
        }
        body.appendChild(p);
      }
      inner.appendChild(body);
      el.classList.remove('hidden', 'out');
      this.textbox(false);
      VN.Audio.sfx('pagina');
      return new Promise((resolve) => {
        const end = () => {
          el.classList.add('out');
          this.paperEnd = null;
          setTimeout(() => { el.classList.add('hidden'); resolve(); }, 450);
        };
        if (fast) setTimeout(end, 400);
        else setTimeout(() => { this.paperEnd = end; }, 500);
      });
    },

    /* ---------------- live da Loves */
    setLive(o) {
      const L = this.liveState;
      Object.assign(L, o || {});
      const el = this.els.live;
      el.classList.toggle('hidden', !L.on);
      clearInterval(this.liveTimer);
      if (!L.on) { el.querySelector('.live-chat').innerHTML = ''; return; }
      if (o && o.title) el.querySelector('.live-title').textContent = o.title;
      const views = el.querySelector('.live-views b');
      const upd = () => { views.textContent = Math.max(0, Math.round(L.viewers)).toLocaleString('pt-BR'); };
      upd();
      this.liveTimer = setInterval(() => {
        L.viewers += (Math.random() - 0.4) * Math.max(3, L.viewers * 0.01);
        upd();
        if (L.flow && Math.random() < 0.55) {
          const [u, m] = CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)];
          this.chat(u, m, true);
        }
      }, 1300);
    },
    chat(user, msg, quiet) {
      const list = this.els.live.querySelector('.live-chat');
      const row = document.createElement('div');
      row.className = 'msg';
      let h = 0;
      for (const ch of user) h = (h * 31 + ch.charCodeAt(0)) % 360;
      row.innerHTML = `<b style="color:hsl(${h} 70% 62%)">${esc(subst(user))}</b> <span>${esc(subst(msg))}</span>`;
      list.appendChild(row);
      while (list.children.length > 9) list.firstElementChild.remove();
      if (!quiet) VN.Audio.sfx('notificacao');
      if (/♡|❤|love/i.test(msg)) this.heart();
    },
    heart() {
      const h = document.createElement('i');
      h.className = 'live-heart';
      h.style.left = 20 + Math.random() * 60 + '%';
      h.textContent = '♥';
      this.els.live.appendChild(h);
      setTimeout(() => h.remove(), 2600);
    },

    /* ---------------- final */
    ending(e, route) {
      const el = this.els.ending;
      el.dataset.route = route;
      this.paint(el, route);
      el.querySelector('.end-kind').textContent = e.kind || 'Final';
      el.querySelector('.end-title').textContent = subst(e.title || 'Fim');
      el.querySelector('.end-text').textContent = subst(e.text || '');
      const img = el.querySelector('.end-img');
      img.src = VN.API.thumb(route);
      el.classList.remove('hidden');
      this.textbox(false);
      VN.Store.unlock(e.id);
    },
    /** aplica as cores oficiais (da API) da protagonista da rota */
    paint(el, route) {
      const d = route && VN.API.get(route);
      el.style.setProperty('--c1', d ? d.color : '#8a7a9a');
      el.style.setProperty('--c2', d ? d.colorSub : '#d9cfe3');
    },
  };
  VN.Stage = Stage;

  const CHAT_POOL = [
    ['moranguinho_22', 'LOVES ♡♡♡'], ['umafan.br', 'boa noite do Brasil!!'], ['kei_0326', 'がんばれ〜!'], ['turfista', 'que treino bonito'],
    ['pipoca.doce', 'kkkkkk'], ['NightOwl', 'first time here, she is so cute'], ['marmelada', 'manda um coração pra mim?? ♡'],
    ['ch1ro', '♡♡♡'], ['tia.sandra', 'se cuida, filha!'], ['patas_rapidas', 'cadê o gato hoje?'], ['loveletter', 'love!!'],
    ['salve.salve', 'salve salve'], ['ayumi_r', 'かわいい!'], ['fã_n°1', 'eu estava aqui desde a primeira live'], ['chuchu', 'que fofaaa'],
  ];

  /* ================================================== execução */
  const Engine = {
    state: null, runId: 0, waiting: null, auto: false, skip: false, ctrlSkip: false, history: [], autoT: 0,

    newState(route) {
      return { route, label: VN.ROUTES[route].start, idx: 0, aff: {}, flags: {}, bg: null, chars: {}, music: null, amb: 'auto', particles: null, fx: null, textbox: 'normal', chapter: '', line: '' };
    },
    start(route) {
      this.state = this.newState(route);
      this.history = [];
      this.auto = false; this.skip = false;
      Stage.reset();
      VN.UI.syncQuick();
      this.go();
    },
    go() { const id = ++this.runId; this.loop(id); },
    stop() { this.runId++; this.waiting = null; clearTimeout(this.autoT); },

    async loop(id) {
      while (id === this.runId) {
        const cmd = this.current();
        if (!cmd) { VN.UI.toast('Fim do roteiro.'); VN.UI.home(); return; }
        if (cmd.gender && cmd.gender !== (VN.Player.data.gender === 'f' ? 'f' : 'm')) { this.state.idx++; continue; }
        let r;
        try { r = await this.exec(cmd, id); } catch (err) { console.error('Erro no roteiro', cmd, err); }
        if (id !== this.runId) return;
        if (r === 'halt') return;
        if (r !== 'jump') this.state.idx++;
      }
    },
    current() {
      const st = this.state;
      let lab = Script.labels[st.label];
      while (lab && st.idx >= lab.cmds.length) {
        const i = Script.order.indexOf(st.label);
        const nx = Script.order[i + 1];
        if (!nx || Script.labels[nx].route !== lab.route) return null;
        st.label = nx; st.idx = 0; lab = Script.labels[nx];
      }
      return lab ? lab.cmds[st.idx] : null;
    },
    jump(label) {
      const name = label.replace('$route', this.state.route);
      if (!Script.labels[name]) { console.error('Rótulo inexistente:', name); VN.UI.toast('Rótulo inexistente: ' + name); return false; }
      this.state.label = name;
      this.state.idx = 0;
      return true;
    },
    skipping(seen) {
      const want = this.skip || this.ctrlSkip;
      if (!want) return false;
      if (seen || VN.Settings.get('skipUnread')) return true;
      if (this.skip) { this.skip = false; VN.UI.syncQuick(); VN.UI.toast('Pulo pausado: trecho ainda não lido.'); }
      return false;
    },
    fastNow() { return (this.skip || this.ctrlSkip) && (VN.Settings.get('skipUnread') || Store.isSeen(this.state.label + ':' + this.state.idx)); },

    async exec(cmd, id) {
      const st = this.state;
      switch (cmd.t) {
        case 'say':
        case 'narr':
          return this.say(cmd, id);
        case 'choice': {
          if (this.skip) { this.skip = false; VN.UI.syncQuick(); }
          clearTimeout(this.autoT);
          const gndr = VN.Player.data.gender === 'f' ? 'f' : 'm';
          const opts = cmd.options.filter((o) => (!o.gender || o.gender === gndr) && (!o.cond || evalCond(o.cond, st)));
          const o = await Stage.choose(opts);
          if (id !== this.runId) return 'halt';
          this.history.push({ name: '', color: '', text: '➜ ' + plain(subst(o.text)), choice: true });
          applyEffects(o.effects, st);
          return this.jump(o.target) ? 'jump' : 'halt';
        }
        case 'card': {
          st.chapter = plain(subst(cmd.title + (cmd.sub ? ' — ' + cmd.sub : '')));
          this.autosave(1);
          await Stage.card(cmd.title, cmd.sub, st.route, this.skip || this.ctrlSkip);
          return;
        }
        case 'paper':
          this.waiting = { type: 'paper' };
          await Stage.paper(cmd.style, cmd.title, cmd.lines, this.fastNow());
          this.waiting = null;
          return;
        case 'chat':
          Stage.chat(cmd.user, cmd.msg);
          return;
        case 'ending':
          Stage.ending(cmd, st.route);
          VN.Audio.music(cmd.id.endsWith('dark') ? 'still_sombra' : cmd.id.endsWith('true') ? (st.route === 'vega' ? 'vega_luz' : st.route === 'loves' ? 'loves' : 'still') : 'titulo');
          return 'halt';
        case 'cmd':
          return this.command(cmd, id);
      }
    },

    async say(cmd, id) {
      const st = this.state;
      const text = subst(cmd.text);
      const who = cmd.t === 'say' ? cmd.who : null;
      for (const a of cmd.acts || []) Stage.action(who, a);
      let name = '', color = null, color2 = null;
      if (who === 'eu') { name = VN.Player.displayName(); color = '#8a7d96'; color2 = '#d9cfe3'; }
      else if (who && VN.CAST[who]) {
        const d = VN.API.get(who);
        name = VN.CAST[who].name;
        color = d ? d.color : '#8a7a9a';
        color2 = d ? d.colorSub : '#c9b9d9';
      } else if (who) { name = who; color = '#77707f'; color2 = '#cfc8d6'; }
      Stage.focus(who && VN.CAST[who] ? who : null);
      if (VN.Tracking && VN.Tracking.on) VN.Tracking.line(who, cmd.text, st.textbox);
      st.line = plain(text);
      st.speaker = name;
      const key = st.label + ':' + st.idx;
      const seen = Store.isSeen(key);
      Store.markSeen(key);
      this.history.push({ name, color, text: plain(text) });
      if (this.history.length > 160) this.history.shift();
      const fast = this.skipping(seen);
      await Stage.showText({ name, color, color2, text, instant: fast });
      if (id !== this.runId) return 'halt';
      if (fast) { await sleep(40); return; }
      await new Promise((resolve) => {
        this.waiting = { type: 'say', resolve, text, seen };
        if (this.auto) this.scheduleAuto();
      });
    },
    scheduleAuto() {
      clearTimeout(this.autoT);
      const w = this.waiting;
      if (!w || w.type !== 'say') return;
      const ms = VN.Settings.get('autoDelay') * 1000 + plain(w.text).length * 28;
      this.autoT = setTimeout(() => { if (this.waiting === w) this.advance(true); }, ms);
    },
    /** clique / espaço / enter */
    advance(fromAuto) {
      if (!this.state) return;
      if (Stage.cardEnd && !Stage.els.card.classList.contains('hidden')) { Stage.cardEnd(); return; }
      if (Stage.paperEnd) { Stage.paperEnd(); return; }
      if (Stage.isTyping()) { Stage.finishTyping(); if (this.auto) this.scheduleAuto(); return; }
      if (this.waitTimer) { this.waitTimer(); return; }
      const w = this.waiting;
      if (w && w.type === 'say') {
        if (!fromAuto) VN.Audio.sfx('click');
        this.waiting = null;
        clearTimeout(this.autoT);
        w.resolve();
      }
    },
    setAuto(on) {
      this.auto = on;
      if (on) { this.skip = false; this.scheduleAuto(); } else clearTimeout(this.autoT);
      VN.UI.syncQuick();
    },
    setSkip(on) {
      this.skip = on;
      if (on) { this.auto = false; clearTimeout(this.autoT); const w = this.waiting; if (w && w.type === 'say' && (w.seen || VN.Settings.get('skipUnread'))) this.advance(true); }
      VN.UI.syncQuick();
    },

    async command(cmd, id) {
      const st = this.state;
      const a = cmd.args;
      const fast = this.skip || this.ctrlSkip;
      switch (cmd.name) {
        case 'fundo': {
          const spec = { scene: a[0], time: 'dia', weather: 'limpo', v: '' };
          let trans = 'suave';
          for (const x of a.slice(1)) {
            if (TIMES.has(x)) spec.time = x;
            else if (x === 'chuva' || x === 'limpo' || x === 'neve') spec.weather = x;
            else if (TRANS.has(x)) trans = x;
            else if (x.startsWith('v=')) spec.v = x.slice(2);
          }
          if (!VN.Scenes.exists(spec.scene)) console.warn('Cenário desconhecido:', spec.scene);
          st.bg = spec;
          st.particles = null;
          const out = await Stage.setBg(spec, trans, fast);
          Stage.setLight(out.light);
          VN.FX.particles.set(out.particles);
          if (st.amb === 'auto') VN.Audio.amb(out.amb);
          if (out.wait) await out.wait;
          return;
        }
        case 'mostrar': {
          const charId = a[0];
          if (!VN.CAST[charId]) { console.warn('Personagem desconhecida:', charId); return; }
          const o = {};
          for (const x of a.slice(1)) {
            if (POS[x] != null) o.pos = x;
            else if (OUTFITS.has(x)) o.outfit = x;
            else if (SIZES[x]) o.size = x;
            else if (ENTERS.has(x)) o.enter = x;
            else if (EMOTES[x] || ONESHOT.has(x) || PERSIST[x] || CLEAR[x]) o._act = (o._act || []).concat(x);
          }
          const acts = o._act || [];
          delete o._act;
          Stage.showChar(charId, o, fast);
          acts.forEach((x) => Stage.action(charId, x));
          return;
        }
        case 'esconder': Stage.hideChar(a[0] || 'todos', fast); if (!fast) await sleep(120); return;
        case 'mover': {
          const c = Stage.chars[a[0]];
          if (c && POS[a[1]] != null) Stage.showChar(a[0], { pos: a[1] }, fast);
          return;
        }
        case 'roupa': if (Stage.chars[a[0]]) Stage.showChar(a[0], { outfit: a[1] }, fast); return;
        case 'tamanho': if (Stage.chars[a[0]]) Stage.showChar(a[0], { size: a[1] }, fast); return;
        case 'anim':
        case 'emote':
          Stage.action(a[0], a[1]);
          return;
        case 'musica': st.music = a[0] === 'parar' ? null : a[0]; VN.Audio.music(a[0]); return;
        case 'som': if (!fast) VN.Audio.sfx(a[0]); return;
        case 'ambiente': {
          st.amb = a[0] || 'auto';
          if (st.amb === 'auto') VN.Audio.amb(st.bg ? VN.Scenes.render(st.bg.scene, st.bg).amb : null);
          else VN.Audio.amb(st.amb === 'parar' ? null : st.amb);
          return;
        }
        case 'particulas': VN.FX.particles.set(a[0], a[1] ? parseFloat(a[1]) : 1); st.particles = a[0]; return;
        case 'efeito': return this.effect(a, fast);
        case 'tracking': return VN.Tracking.command(a, cmd.rest, fast);
        case 'esperar': {
          if (fast) return;
          const ms = parseFloat(a[0] || '1') * 1000;
          this.textboxBefore = !Stage.els.game.classList.contains('tb-hidden');
          await new Promise((resolve) => {
            const t = setTimeout(() => { this.waitTimer = null; resolve(); }, ms);
            this.waitTimer = () => { clearTimeout(t); this.waitTimer = null; resolve(); };
          });
          return;
        }
        case 'afeto': {
          const n = parseInt(a[1], 10) || 0;
          st.aff[a[0]] = (st.aff[a[0]] || 0) + n;
          return;
        }
        case 'marcar': st.flags[a[0]] = true; return;
        case 'desmarcar': delete st.flags[a[0]]; return;
        case 'se': {
          const m = /^(.*?)=>\s*([\w$]+)\s*$/.exec(cmd.rest);
          if (m && evalCond(m[1], st)) return this.jump(m[2].trim()) ? 'jump' : 'halt';
          return;
        }
        case 'ir': return this.jump(a[0]) ? 'jump' : 'halt';
        case 'caixa': {
          const v = a[0];
          if (v === 'oculta') Stage.textbox(false);
          else if (v === 'visivel') Stage.textbox(true);
          else { st.textbox = v; Stage.textboxStyle(v); }
          return;
        }
        case 'live': {
          if (a[0] === 'on') Stage.setLive({ on: true, viewers: parseInt(a[1], 10) || 800, title: a.slice(2).join(' ') || 'Loves♡Channel — ao vivo!' });
          else if (a[0] === 'off') Stage.setLive({ on: false, flow: false });
          else if (a[0] === 'fluxo') Stage.setLive({ flow: a[1] !== 'off' });
          else if (a[0] === 'publico') Stage.setLive({ viewers: parseInt(a[1], 10) || Stage.liveState.viewers });
          return;
        }
        default:
          console.warn('Comando desconhecido:', cmd.name, 'linha', cmd.line);
      }
    },
    effect(a, fast) {
      const k = a[0], v = a[1];
      const FX = VN.FX;
      switch (k) {
        case 'tremor': if (!fast) FX.shake(parseFloat(v) || 12, 520); break;
        case 'flash': if (!fast) FX.flash(v || '#ffffff', 650); break;
        case 'flashvermelho': if (!fast) FX.flash('#b3001e', 700); break;
        case 'vermelho': FX.setTint(parseFloat(v) || 0, 'red'); break;
        case 'rosa': FX.setTint(parseFloat(v) || 0, 'rose'); break;
        case 'azul': FX.setTint(parseFloat(v) || 0, 'blue'); break;
        case 'sepia': FX.setTint(parseFloat(v) || 0, 'sepia'); break;
        case 'vinheta': FX.setVignette(parseFloat(v) || 0); break;
        case 'glitch': if (!fast) { FX.glitch(parseFloat(v) * 1000 || 700); VN.Audio.sfx('glitch'); } break;
        case 'coracao': FX.setHeartbeat(v !== 'off'); break;
        case 'faixas': FX.setLetterbox(v !== 'off'); break;
        default: console.warn('Efeito desconhecido:', k);
      }
    },

    /* ---------------- salvar / carregar */
    snapshot() {
      const st = this.state;
      const snap = JSON.parse(JSON.stringify(st));
      snap.chars = Stage.snapshotChars();
      snap.fx = VN.FX.snapshot();
      snap.live = Object.assign({}, Stage.liveState);
      snap.tracking = VN.Tracking ? VN.Tracking.snapshot() : null;
      snap.history = this.history.slice(-60);
      return snap;
    },
    makeSave(snapOverride) {
      const st = this.state;
      const snap = snapOverride || this.snapshot();
      return { v: 1, t: Date.now(), route: st.route, chapter: st.chapter, line: st.line, speaker: st.speaker || '', state: snap };
    },
    save(slot) {
      if (!this.state) return false;
      const ok = Store.saveSlot(slot, this.makeSave());
      VN.UI.toast(ok ? 'Jogo salvo ♡' : 'Não foi possível salvar (armazenamento do navegador bloqueado ou cheio).');
      return ok;
    },
    autosave(offset) {
      if (!this.state) return;
      const snap = this.snapshot();
      snap.idx += offset || 0;
      Store.saveSlot('auto', this.makeSave(snap));
    },
    async load(data) {
      if (!data || !data.state) return;
      this.stop();
      this.auto = false; this.skip = false;
      const st = (this.state = JSON.parse(JSON.stringify(data.state)));
      this.history = st.history || [];
      delete st.history;
      Stage.reset();
      VN.UI.showGame();
      await VN.UI.loadRoute(st.route);
      if (st.bg) {
        const out = await Stage.setBg(st.bg, 'corte', true);
        Stage.setLight(out.light);
        VN.Audio.amb(st.amb === 'auto' ? out.amb : st.amb === 'parar' ? null : st.amb);
      }
      for (const k in st.chars || {}) Stage.showChar(k, st.chars[k], true);
      VN.FX.restore(st.fx);
      if (st.live && st.live.on) Stage.setLive(Object.assign({}, st.live));
      if (VN.Tracking) VN.Tracking.restore(st.tracking || null);
      Stage.textboxStyle(st.textbox || 'normal');
      VN.Audio.music(st.music || null);
      VN.UI.syncQuick();
      this.go();
    },
  };
  VN.Engine = Engine;
  VN.evalCond = evalCond;
  VN.STAGE_CONST = { POS, SIZES, EMOTES, ONESHOT, PERSIST, CLEAR, TIMES, TRANS, OUTFITS, ENTERS };
})();
