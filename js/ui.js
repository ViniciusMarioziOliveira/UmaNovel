/* =========================================================================
   Interface: tela inicial (seleção da uma), menus, nome do(a) jogador(a),
   tela de carregamento, avisos e controles.
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const MAIN = ['vega', 'loves', 'still', 'dober', 'ramonu'];

  const MOTIF = {
    estrela: '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>',
    coracao: '<svg viewBox="0 0 24 24"><path d="M12 21C5 16 2 12.5 2 8.6 2 5.5 4.4 3.5 7.1 3.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 2.7 0 5.1 2 5.1 5.1 0 3.9-3 7.4-10 12.4z"/></svg>',
    lua: '<svg viewBox="0 0 24 24"><path d="M15.5 2.5A9.5 9.5 0 1 0 21.5 17 7.6 7.6 0 1 1 15.5 2.5z"/></svg>',
    lapis: '<svg viewBox="0 0 24 24"><path d="M3 21l1.2-4.6L15.6 5l3.4 3.4L7.6 19.8zM16.8 3.8l1.4-1.4a1.4 1.4 0 0 1 2 0l1.4 1.4a1.4 1.4 0 0 1 0 2l-1.4 1.4z"/></svg>',
    flor: '<svg viewBox="0 0 24 24"><path d="M12 2.5c1.6 0 2.8 1.6 2.6 3.4 1.6-.9 3.6-.4 4.3 1.1.8 1.5-.1 3.3-1.7 4 1.6.7 2.5 2.5 1.7 4-.7 1.5-2.7 2-4.3 1.1.2 1.8-1 3.4-2.6 3.4s-2.8-1.6-2.6-3.4c-1.6.9-3.6.4-4.3-1.1-.8-1.5.1-3.3 1.7-4-1.6-.7-2.5-2.5-1.7-4 .7-1.5 2.7-2 4.3-1.1C9.2 4.1 10.4 2.5 12 2.5zm0 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>',
  };
  VN.MOTIF = MOTIF;
  const motifPath = (k) => /d="([^"]+)"/.exec(MOTIF[k])[1];

  /** tom pastel para o fundo do card a partir de uma cor oficial: cores escuras
   *  (o vinho da Dober, o grafite da Ramonu) viram um pastel claro do mesmo matiz;
   *  as quase cinza (o grafite da Loves) emprestam o matiz da outra cor */
  function pastel(hex, alt) {
    const hsl = (x) => {
      const n = parseInt(String(x || '').replace('#', ''), 16) || 0;
      const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
      if (!d) return [0, 0];
      const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return [h * 60, d / (1 - Math.abs(2 * l - 1))];
    };
    let [h, s] = hsl(hex);
    if (s < 0.12) [h, s] = hsl(alt);
    return `hsl(${Math.round(h)} ${Math.round(Math.min(78, Math.max(38, s * 100 + 15)))}% 91%)`;
  }

  /* ---- enfeites dos chibis da tela inicial ---- */
  const CHIBI_SCALE = 1.16;
  // selo de bordas onduladas atrás do chibi
  const BADGE = (() => {
    const n = 18, R = 112, r = (R * Math.sin(Math.PI / n) * 1.12).toFixed(2);
    let d = '';
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = (R * Math.cos(a)).toFixed(2), y = (R * Math.sin(a)).toFixed(2);
      d += i ? `A${r} ${r} 0 0 1 ${x} ${y}` : `M${x} ${y}`;
    }
    return d + 'Z';
  })();
  const SPARK = '<svg viewBox="0 0 24 24"><path d="M12 1c.9 6.2 3.8 9.4 11 11-7.2 1.6-10.1 4.8-11 11-.9-6.2-3.8-9.4-11-11 7.2-1.6 10.1-4.8 11-11z"/></svg>';
  // brilhos (s) e motivos da rota (m) que surgem em volta do chibi:
  // x, y (px dentro da arte do card), tamanho, atraso, giro, tipo
  const SPARKS = [
    [56, 108, 28, 0, -16, 'm'], [286, 132, 22, 0.07, 14, 'm'], [96, 50, 15, 0.14, 0, 's'],
    [252, 62, 19, 0.04, 0, 's'], [40, 222, 17, 0.1, 0, 's'], [298, 240, 24, 0.16, 10, 'm'],
  ];

  const UI = {
    screen: 'home',
    panel: null,
    voice: null,

    init() {
      this.bindInput();
      this.buildHomeDecor();
      $('#home-nav').addEventListener('click', (e) => {
        const b = e.target.closest('button[data-act]');
        if (!b) return;
        VN.Audio.sfx('click');
        const act = b.dataset.act;
        if (act === 'continuar') this.continueLatest();
        else this.open(act);
      });
      $('#btn-sound').addEventListener('click', (e) => {
        e.stopPropagation();
        VN.Audio.unlock();
        const muted = VN.Settings.get('music') === 0 && VN.Settings.get('sfx') === 0;
        if (muted) { VN.Settings.set('music', this._lastMusic || 0.6); VN.Settings.set('sfx', this._lastSfx || 0.7); }
        else { this._lastMusic = VN.Settings.get('music'); this._lastSfx = VN.Settings.get('sfx'); VN.Settings.set('music', 0); VN.Settings.set('sfx', 0); }
        this.syncSoundBtn();
        if (this.screen === 'home') VN.Audio.music('titulo');
      });
      $('#btn-settings').addEventListener('click', (e) => { e.stopPropagation(); this.open('ajustes'); });
      // primeiro toque em qualquer lugar libera o áudio
      const unlock = () => {
        VN.Audio.unlock();
        if (this.screen === 'home') VN.Audio.music('titulo');
        window.removeEventListener('pointerdown', unlock, true);
        window.removeEventListener('keydown', unlock, true);
      };
      window.addEventListener('pointerdown', unlock, true);
      window.addEventListener('keydown', unlock, true);
      this.syncSoundBtn();
      // menu rápido do jogo
      $('#quickmenu').addEventListener('click', (e) => {
        e.stopPropagation();
        const b = e.target.closest('button[data-q]');
        if (!b) return;
        VN.Audio.sfx('click');
        const q = b.dataset.q;
        const E = VN.Engine;
        if (q === 'auto') E.setAuto(!E.auto);
        else if (q === 'pular') E.setSkip(!E.skip);
        else if (q === 'ocultar') this.toggleHide();
        else this.open(q);
      });
      $('#ending').addEventListener('click', (e) => {
        const b = e.target.closest('button[data-end]');
        if (!b) return;
        e.stopPropagation();
        VN.Audio.sfx('click');
        if (b.dataset.end === 'inicio') this.home();
        else { this.home(); this.open('finais'); }
      });
    },

    syncSoundBtn() {
      const muted = VN.Settings.get('music') === 0 && VN.Settings.get('sfx') === 0;
      $('#btn-sound').classList.toggle('muted', muted);
      $('#btn-sound').title = muted ? 'Ativar som' : 'Silenciar';
    },

    /* ------------------------------------------------------ tela inicial */
    buildHomeDecor() {
      const box = $('#home-floaters');
      const shapes = [MOTIF.estrela, MOTIF.coracao, MOTIF.lua, MOTIF.lapis, MOTIF.flor];
      let html = '';
      for (let i = 0; i < 30; i++) {
        const s = shapes[i % 5];
        const left = (i * 37) % 100, dur = 18 + ((i * 7) % 14), delay = -((i * 13) % 30), size = 10 + ((i * 5) % 14);
        html += `<i style="left:${left}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:${delay}s" data-k="${i % 5}">${s}</i>`;
      }
      box.innerHTML = html;
    },

    async renderHome() {
      const wrap = $('#cards');
      if (!MAIN.every((k) => VN.API.get(k))) {
        wrap.innerHTML = MAIN.map((k) => this.cardHTML(k, null)).join('');
        this.bindCards();
      }
      await VN.API.loadMany(MAIN);
      wrap.innerHTML = MAIN.map((k) => this.cardHTML(k, VN.API.get(k))).join('');
      this.bindCards();
      const st = $('#api-status');
      st.textContent = VN.API.status === 'online' ? 'conectado ao umapyoi.net' : VN.API.status === 'cache' ? 'dados do umapyoi.net (em cache)' : 'umapyoi.net fora do ar — usando cópia local';
      st.dataset.s = VN.API.status;
      this.syncHomeNav();
    },
    cardHTML(k, d) {
      const R = VN.ROUTES[k];
      const name = d ? d.name : VN.CAST[k].name;
      const c1 = d ? d.color : '#b9a9c9', c2 = d ? d.colorSub : '#e9e0f0';
      const bday = d && d.birthday ? `${d.birthday.d} de ${MONTHS[d.birthday.m - 1]}` : '';
      const ends = R.endings.map((e) => `<i class="${VN.Store.hasEnding(e.id) ? 'on' : ''}" title="${VN.Store.hasEnding(e.id) ? esc(e.title) : '???'}">${MOTIF[R.motif]}</i>`).join('');
      const md = motifPath(R.motif);
      const pattern = `<svg class="card-pattern" aria-hidden="true"><defs><pattern id="pat-${k}" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)"><path d="${md}" transform="translate(6 6) scale(.62)"/><path d="${md}" transform="translate(34 33) scale(.46)"/></pattern></defs><rect width="100%" height="100%" fill="url(#pat-${k})"/></svg>`;
      const badge = `<svg class="card-badge" viewBox="-128 -128 256 256" aria-hidden="true"><g class="bd-spin"><path class="bd-fill" d="${BADGE}"/><circle class="bd-ring" r="97"/></g></svg>`;
      const sparks = SPARKS.map(([x, y, z, dl, r, t]) => {
        // direção em que cada enfeite voa no pulinho (para longe do chibi)
        const bx = Math.round((x - 168) * 0.5), by = Math.round((y - 190) * 0.5 - 26);
        return `<i class="${t}" style="--x:${x}px;--y:${y}px;--z:${z}px;--d:${dl}s;--r:${r}deg;--bx:${bx}px;--by:${by}px">${t === 'm' ? MOTIF[R.motif] : SPARK}</i>`;
      }).join('');
      return `<article class="card" data-route="${k}" style="--c1:${c1};--c2:${c2};--c3:${pastel(c2, c1)};--i:${MAIN.indexOf(k)}" tabindex="0" role="button" aria-label="Passar o tempo com ${esc(name)}">
        <div class="card-art">
          <div class="card-bg">${pattern}<div class="card-halo"></div>${badge}</div>
          ${this.chibiHTML(k)}
          <div class="chibi-fx" aria-hidden="true">${sparks}</div>
          <span class="card-motif">${MOTIF[R.motif]}</span>
        </div>
        <div class="card-info">
          <div class="card-jp">${esc(d ? d.nameJp : '')}</div>
          <h2 class="card-name">${esc(name)}</h2>
          <p class="card-route">${esc(R.title)}</p>
          <p class="card-essence">${esc(R.essence)}</p>
          <div class="card-meta">
            ${bday ? `<span class="chip"><svg viewBox="0 0 24 24"><path d="M12 3c1 1.6 1.5 2.7 1.5 3.4A1.5 1.5 0 0 1 12 8a1.5 1.5 0 0 1-1.5-1.6c0-.7.5-1.8 1.5-3.4zM5 11h14a2 2 0 0 1 2 2v2.5c-1.2 0-1.8-.8-3-.8s-1.8.8-3 .8-1.8-.8-3-.8-1.8.8-3 .8-1.8-.8-3-.8V13a2 2 0 0 1 2-2zm-2 6c1.2 0 1.8.8 3 .8s1.8-.8 3-.8 1.8.8 3 .8 1.8-.8 3-.8 1.8.8 3 .8V21H3z"/></svg>${esc(bday)}</span>` : ''}
            ${d && d.height ? `<span class="chip">${d.height} cm</span>` : ''}
            ${d && d.voice ? `<button class="chip voice" data-voice="${k}" title="Ouvir a apresentação oficial (em japonês)"><svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>voz</button>` : ''}
          </div>
          <div class="card-foot"><span class="card-ends">${ends}</span><span class="card-cta">Passar o tempo <b>›</b></span></div>
        </div>
      </article>`;
    },
    /** o chibi em pé no chão do card: as duas poses ficam empilhadas, e a
     *  animada ("b") se encaixa sobre a calma ("a") pelas medidas de VN.CHIBIS */
    chibiHTML(k) {
      const c = VN.CHIBIS && VN.CHIBIS[k];
      if (!c) return '';
      const px = (v) => (v * CHIBI_SCALE).toFixed(1) + 'px';
      const pos = (w, h, ox, oy) => `left:${px(ox - c.x)};top:${px(oy - c.y)};width:${px(w)};height:${px(h)}`;
      return `<div class="chibi"><span class="chibi-shadow"></span><div class="chibi-body">` +
        `<img class="chibi-a" src="${c.a}" style="${pos(c.wa, c.ha, 0, 0)}" alt="" draggable="false">` +
        `<img class="chibi-b" src="${c.b}" style="${pos(c.wb, c.hb, c.dx, c.dy)}" alt="" draggable="false">` +
        '</div></div>';
    },
    /** ao sair do card, o chibi volta à pose calma com uma balançadinha */
    settleChibi(card) {
      if (card.classList.contains('picked') || card.classList.contains('on') || card.matches(':hover')) return;
      if (document.documentElement.classList.contains('reduce-motion')) return;
      card.classList.remove('settle');
      void card.offsetWidth;
      card.classList.add('settle');
    },
    bindCards() {
      $$('#cards .card').forEach((card) => {
        const k = card.dataset.route;
        card.addEventListener('mouseenter', () => { if (!this.busy) VN.Audio.sfx('pop'); });
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
          card.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
          this.settleChibi(card);
        });
        // pelo teclado, o foco faz o mesmo que passar o mouse
        card.addEventListener('focus', () => {
          if (!card.matches(':focus-visible')) return;
          card.classList.add('on');
          VN.Audio.sfx('pop');
        });
        card.addEventListener('blur', () => {
          if (!card.classList.contains('on')) return;
          card.classList.remove('on');
          this.settleChibi(card);
        });
        card.addEventListener('animationend', (e) => { if (e.animationName === 'chibiSettle') card.classList.remove('settle'); });
        const go = (e) => {
          if (e.target.closest('.voice')) return;
          this.pick(k, card);
        };
        card.addEventListener('click', go);
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
        const v = card.querySelector('.voice');
        if (v) v.addEventListener('click', (e) => { e.stopPropagation(); this.playVoice(k, v); });
      });
    },
    playVoice(k, btn) {
      const d = VN.API.get(k);
      if (!d || !d.voice) return;
      if (this.voice) { this.voice.pause(); $$('.voice.playing').forEach((b) => b.classList.remove('playing')); }
      const a = (this.voice = new Audio(d.voice));
      a.volume = Math.max(0.15, VN.Settings.get('sfx'));
      btn.classList.add('playing');
      a.onended = a.onerror = () => btn.classList.remove('playing');
      a.play().catch(() => btn.classList.remove('playing'));
    },
    syncHomeNav() {
      const latest = VN.Store.latest();
      $('#home-nav [data-act="continuar"]').hidden = !latest;
      const sep = $('#home-nav .sep-cont');
      if (sep) sep.hidden = !latest;
    },

    async pick(route, card) {
      if (this.busy) return;
      this.busy = true;
      VN.Audio.unlock();
      VN.Audio.sfx('pulo');
      if (this.voice) this.voice.pause();
      card.classList.remove('settle');
      $('#home').classList.add('picking');
      card.classList.add('picked');
      // deixa o pulinho do chibi terminar antes de trocar de tela
      await new Promise((r) => setTimeout(r, 820));
      if (!VN.Player.has()) {
        const ok = await this.askName(route);
        if (!ok) { $('#home').classList.remove('picking'); card.classList.remove('picked'); this.busy = false; return; }
      }
      await this.startRoute(route);
      this.busy = false;
    },
    async startRoute(route) {
      this.showGame();
      await this.loadRoute(route);
      VN.Engine.start(route);
    },
    async loadRoute(route) {
      const R = VN.ROUTES[route];
      const L = $('#loading');
      L.dataset.route = route;
      L.style.setProperty('--c1', (VN.API.get(route) || {}).color || '#b9a9c9');
      L.classList.remove('hidden');
      const bar = $('.load-bar i', L);
      bar.style.width = '0%';
      const tips = [
        'Dica: segure Ctrl para pular falas já lidas.',
        'Dica: clique com o botão direito para esconder a caixa de texto e ver o cenário.',
        'Dica: role o mouse para cima para rever o histórico.',
        'Dica: F5 salva rápido, F9 carrega rápido.',
        'Dica: as escolhas mudam o final. Há três para cada uma.',
      ];
      $('.load-tip', L).textContent = tips[Math.floor(Math.random() * tips.length)];
      const cast = R.cast;
      await VN.API.loadMany(cast, (d, t) => { bar.style.width = (d / t) * 40 + '%'; });
      // pré-carrega uniformes (e trajes de corrida das protagonistas e rivais)
      const urls = [];
      for (const k of cast) {
        urls.push(VN.API.sprite(k, 'uniforme'));
        if ((R.racers || [route]).includes(k)) urls.push(VN.API.sprite(k, 'corrida'));
      }
      urls.push(VN.API.thumb(route));
      await Promise.race([
        VN.API.preload(urls, (d, t) => { bar.style.width = 40 + (d / t) * 60 + '%'; }),
        new Promise((r) => setTimeout(r, 12000)),
      ]);
      bar.style.width = '100%';
      await new Promise((r) => setTimeout(r, 250));
      L.classList.add('hidden');
    },

    showGame() {
      this.screen = 'game';
      this.close();
      $('#home').classList.add('hidden');
      $('#game').classList.remove('hidden');
      document.body.dataset.screen = 'game';
    },
    home() {
      VN.Engine.stop();
      VN.Engine.state = null;
      VN.Stage.reset();
      VN.Audio.amb(null);
      this.close();
      this.screen = 'home';
      $('#game').classList.add('hidden');
      $('#home').classList.remove('hidden', 'picking');
      $$('#cards .card.picked').forEach((c) => c.classList.remove('picked'));
      document.body.dataset.screen = 'home';
      VN.Audio.music('titulo');
      this.renderHome();
    },
    async continueLatest() {
      const latest = VN.Store.latest();
      if (latest) await VN.Engine.load(latest);
    },

    /* ------------------------------------------------------ nome */
    askName(route) {
      return new Promise((resolve) => {
        const m = $('#name-modal');
        const d = VN.API.get(route);
        m.style.setProperty('--c1', d ? d.color : '#b9a9c9');
        m.style.setProperty('--c2', d ? d.colorSub : '#e9e0f0');
        const input = $('#name-input', m);
        input.value = VN.Player.data.name || '';
        let gender = VN.Player.data.gender || 'm';
        const sync = () => $$('[data-g]', m).forEach((b) => b.classList.toggle('on', b.dataset.g === gender));
        sync();
        $$('[data-g]', m).forEach((b) => (b.onclick = () => { gender = b.dataset.g; VN.Audio.sfx('click'); sync(); }));
        m.classList.remove('hidden');
        setTimeout(() => input.focus(), 80);
        const done = (ok) => {
          m.classList.add('hidden');
          if (ok) {
            VN.Player.data.name = input.value.trim().slice(0, 18);
            VN.Player.data.gender = gender;
            VN.Player.save();
          }
          resolve(ok);
        };
        $('#name-ok', m).onclick = () => { VN.Audio.sfx('confirmar'); done(true); };
        $('#name-cancel', m).onclick = () => { VN.Audio.sfx('voltar'); done(false); };
        input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); VN.Audio.sfx('confirmar'); done(true); } e.stopPropagation(); };
      });
    },

    /* ------------------------------------------------------ painéis */
    open(kind, opts) {
      const m = $('#menu');
      const body = $('#menu-body', m);
      const title = $('#menu-title', m);
      this.panel = kind;
      m.dataset.kind = kind;
      m.classList.remove('hidden');
      if (VN.Engine.state) VN.Engine.waitingPaused = true;
      const titles = { salvar: 'Salvar', carregar: 'Carregar', ajustes: 'Ajustes', historico: 'Histórico', finais: 'Finais', creditos: 'Créditos', menu: 'Pausa' };
      title.textContent = titles[kind] || '';
      if (kind === 'salvar' || kind === 'carregar') body.innerHTML = this.slotsHTML(kind);
      else if (kind === 'ajustes') body.innerHTML = this.settingsHTML();
      else if (kind === 'historico') body.innerHTML = this.historyHTML();
      else if (kind === 'finais') body.innerHTML = this.endingsHTML();
      else if (kind === 'creditos') body.innerHTML = this.creditsHTML();
      else if (kind === 'menu') body.innerHTML = this.pauseHTML();
      this.bindPanel(kind, body, opts);
      if (kind === 'historico') body.scrollTop = body.scrollHeight;
    },
    close() {
      const m = $('#menu');
      if (!m.classList.contains('hidden')) m.classList.add('hidden');
      this.panel = null;
    },
    slotsHTML(kind) {
      const all = VN.Store.slots();
      const slot = (id, label) => {
        const s = all[id];
        if (!s) return `<button class="slot empty" data-slot="${id}"><span class="slot-label">${label}</span><span class="slot-empty">— vazio —</span></button>`;
        const d = VN.API.get(s.route);
        const date = new Date(s.t);
        const when = date.toLocaleDateString('pt-BR') + ' · ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `<button class="slot" data-slot="${id}" style="--c1:${d ? d.color : '#b9a9c9'}">
          <span class="slot-label">${label}</span>
          <img class="slot-icon" src="${esc(VN.API.icon(s.route))}" alt="" onerror="this.style.visibility='hidden'">
          <span class="slot-text"><b>${esc(s.chapter || VN.ROUTES[s.route].title)}</b><em>${s.speaker ? esc(s.speaker) + ': ' : ''}“${esc((s.line || '').slice(0, 90))}${(s.line || '').length > 90 ? '…' : ''}”</em><small>${when}</small></span>
          ${id !== 'auto' ? `<span class="slot-del" data-del="${id}" title="Apagar">×</span>` : ''}
        </button>`;
      };
      let html = `<div class="slots-top">${slot('auto', 'Automático')}${slot('rapido', 'Rápido')}</div><div class="slots">`;
      for (let i = 1; i <= 9; i++) html += slot('s' + i, 'Espaço ' + i);
      html += '</div>';
      if (kind === 'salvar' && !VN.Engine.state) html = '<p class="muted">Comece uma história para poder salvar.</p>' + html;
      return html;
    },
    settingsHTML() {
      const S = VN.Settings;
      const range = (k, label, min, max, step, fmt) => `<label class="set-row"><span>${label}</span><input type="range" data-set="${k}" min="${min}" max="${max}" step="${step}" value="${S.get(k)}"><output>${fmt(S.get(k))}</output></label>`;
      const tog = (k, label, inv) => `<label class="set-row tog"><span>${label}</span><button class="switch ${(inv ? !S.get(k) : S.get(k)) ? 'on' : ''}" data-tog="${k}" data-inv="${inv ? 1 : 0}"><i></i></button></label>`;
      return `<div class="settings">
        <div class="set-col">
          <h3>Texto</h3>
          ${range('textSpeed', 'Velocidade do texto', 10, 120, 2, (v) => (v >= 120 ? 'instantâneo' : v + ' letras/s'))}
          ${range('autoDelay', 'Pausa no modo automático', 0.4, 4, 0.1, (v) => Number(v).toFixed(1) + ' s')}
          ${tog('skipUnread', 'Pular só o que já foi lido', true)}
          ${tog('focus', 'Destacar quem está falando')}
          <h3>Som</h3>
          ${range('music', 'Música', 0, 1, 0.05, (v) => Math.round(v * 100) + '%')}
          ${range('sfx', 'Efeitos e ambiente', 0, 1, 0.05, (v) => Math.round(v * 100) + '%')}
        </div>
        <div class="set-col">
          <h3>Tela</h3>
          ${tog('parallax', 'Profundidade no cenário (parallax)')}
          ${tog('reduceMotion', 'Reduzir movimento e tremores')}
          <button class="btn-soft" data-act="fullscreen">Alternar tela cheia</button>
          <h3>Você</h3>
          <p class="muted">Agora: <b>${esc(VN.Player.data.name || 'sem nome')}</b> · chamad${VN.Player.data.gender === 'f' ? 'a' : 'o'} de ${VN.Player.title()}</p>
          <button class="btn-soft" data-act="rename">Mudar nome e tratamento</button>
          <button class="btn-soft danger" data-act="wipe">Apagar todo o progresso</button>
        </div>
      </div>`;
    },
    historyHTML() {
      const h = VN.Engine.history || [];
      if (!h.length) return '<p class="muted">Nada por aqui ainda.</p>';
      return '<div class="history">' + h.map((e) => `<div class="hl ${e.choice ? 'choice' : ''}">${e.name ? `<b style="color:${esc(e.color)}">${esc(e.name)}</b>` : ''}<p>${esc(e.text)}</p></div>`).join('') + '</div>';
    },
    endingsHTML() {
      return '<div class="ends">' + MAIN.map((k) => {
        const R = VN.ROUTES[k];
        const d = VN.API.get(k);
        const got = R.endings.filter((e) => VN.Store.hasEnding(e.id)).length;
        return `<div class="end-col" style="--c1:${d ? d.color : '#b9a9c9'};--c2:${d ? d.colorSub : '#e9e0f0'}">
          <div class="end-head">${d ? `<img src="${esc(VN.API.icon(k))}" alt="">` : ''}<div><b>${esc(d ? d.name : VN.CAST[k].name)}</b><small>${got}/${R.endings.length} finais</small></div></div>
          ${R.endings.map((e) => VN.Store.hasEnding(e.id) ? `<div class="end-item on"><i>${MOTIF[R.motif]}</i><span><b>${esc(e.title)}</b><small>${esc(e.kind)}</small></span></div>` : `<div class="end-item"><i>${MOTIF[R.motif]}</i><span><b>???</b><small>ainda não encontrado</small></span></div>`).join('')}
        </div>`;
      }).join('') + '</div>';
    },
    creditsHTML() {
      return `<div class="credits">
        <p><b>Uma Novel — dias na Academia Tracen</b><br>uma visual novel de fã, feita com carinho e sem fins lucrativos.</p>
        <p><b>Personagens e artes oficiais</b><br>Umamusume: Pretty Derby © Cygames, Inc.</p>
        <p><b>Dados e imagens</b><br>API pública do <a href="https://umapyoi.net" target="_blank" rel="noopener noreferrer">umapyoi.net</a>, um projeto da comunidade. As artes de uniforme, traje de corrida, nomes, cores, aniversários e vozes vêm de lá.</p>
        <p><b>Cenários, música e efeitos</b><br>Desenhados e sintetizados por código, direto no navegador.</p>
        <p class="muted">As situações das rotas se inspiram em acontecimentos do jogo e da carreira real das éguas, mas as cenas e diálogos são criação desta novel — não são canônicos.</p>
      </div>`;
    },
    pauseHTML() {
      return `<div class="pause">
        <button data-p="voltar">Voltar ao jogo</button>
        <button data-p="salvar">Salvar</button>
        <button data-p="carregar">Carregar</button>
        <button data-p="historico">Histórico</button>
        <button data-p="ajustes">Ajustes</button>
        <button data-p="inicio" class="danger">Tela inicial</button>
      </div>`;
    },
    bindPanel(kind, body) {
      if (kind === 'salvar' || kind === 'carregar') {
        body.onclick = async (e) => {
          const del = e.target.closest('[data-del]');
          if (del) {
            e.stopPropagation();
            if (await this.confirm('Apagar este salvamento?')) { VN.Store.deleteSlot(del.dataset.del); this.open(kind); }
            return;
          }
          const b = e.target.closest('[data-slot]');
          if (!b) return;
          const id = b.dataset.slot;
          const all = VN.Store.slots();
          if (kind === 'salvar') {
            if (!VN.Engine.state || id === 'auto') return;
            if (all[id] && !(await this.confirm('Substituir este salvamento?'))) return;
            VN.Engine.save(id);
            VN.Audio.sfx('confirmar');
            this.open(kind);
          } else {
            if (!all[id]) return;
            if (VN.Engine.state && !(await this.confirm('Carregar? O progresso não salvo será perdido.'))) return;
            VN.Audio.sfx('confirmar');
            this.close();
            await VN.Engine.load(all[id]);
          }
        };
      } else if (kind === 'ajustes') {
        $$('input[type=range]', body).forEach((r) => {
          r.oninput = () => {
            const k = r.dataset.set;
            const v = parseFloat(r.value);
            VN.Settings.set(k, v);
            const fmt = { textSpeed: (x) => (x >= 120 ? 'instantâneo' : x + ' letras/s'), autoDelay: (x) => x.toFixed(1) + ' s', music: (x) => Math.round(x * 100) + '%', sfx: (x) => Math.round(x * 100) + '%' }[k];
            r.nextElementSibling.textContent = fmt(v);
            this.syncSoundBtn();
          };
          r.onchange = () => { if (r.dataset.set === 'sfx') VN.Audio.sfx('notificacao'); };
        });
        $$('[data-tog]', body).forEach((b) => {
          b.onclick = () => {
            const k = b.dataset.tog, inv = b.dataset.inv === '1';
            const cur = VN.Settings.get(k);
            VN.Settings.set(k, !cur);
            b.classList.toggle('on', inv ? cur : !cur);
            VN.Audio.sfx('click');
          };
        });
        body.onclick = async (e) => {
          const b = e.target.closest('[data-act]');
          if (!b) return;
          const act = b.dataset.act;
          if (act === 'fullscreen') {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
            else document.exitFullscreen && document.exitFullscreen();
          } else if (act === 'rename') {
            this.close();
            await this.askName(VN.Engine.state ? VN.Engine.state.route : 'vega');
            this.open('ajustes');
          } else if (act === 'wipe') {
            if (await this.confirm('Apagar salvamentos, finais encontrados e falas lidas? Isso não pode ser desfeito.')) {
              VN.Store.wipe();
              this.toast('Progresso apagado.');
              if (this.screen === 'home') { this.close(); this.renderHome(); } else this.open('ajustes');
            }
          }
        };
      } else if (kind === 'menu') {
        body.onclick = async (e) => {
          const b = e.target.closest('[data-p]');
          if (!b) return;
          VN.Audio.sfx('click');
          const p = b.dataset.p;
          if (p === 'voltar') this.close();
          else if (p === 'inicio') { if (await this.confirm('Voltar à tela inicial? O progresso não salvo será perdido.')) this.home(); }
          else this.open(p);
        };
      }
    },
    confirm(msg) {
      return new Promise((resolve) => {
        const c = $('#confirm');
        $('.confirm-msg', c).textContent = msg;
        c.classList.remove('hidden');
        const done = (v) => { c.classList.add('hidden'); resolve(v); };
        $('[data-c="sim"]', c).onclick = (e) => { e.stopPropagation(); VN.Audio.sfx('confirmar'); done(true); };
        $('[data-c="nao"]', c).onclick = (e) => { e.stopPropagation(); VN.Audio.sfx('voltar'); done(false); };
      });
    },
    toast(msg) {
      const t = $('#toast');
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(this._toast);
      this._toast = setTimeout(() => t.classList.remove('show'), 2400);
    },
    syncQuick() {
      const E = VN.Engine;
      const q = $('#quickmenu');
      q.querySelector('[data-q="auto"]').classList.toggle('on', !!E.auto);
      q.querySelector('[data-q="pular"]').classList.toggle('on', !!E.skip);
      $('#game').classList.toggle('skipping', !!E.skip);
    },
    toggleHide() {
      const g = $('#game');
      g.classList.toggle('ui-hidden');
    },

    /* ------------------------------------------------------ controles */
    bindInput() {
      const game = $('#game');
      game.addEventListener('click', (e) => {
        if (this.panel) return;
        if (e.target.closest('#quickmenu, #choices, #ending, #live')) return;
        if (game.classList.contains('ui-hidden')) { game.classList.remove('ui-hidden'); return; }
        VN.Engine.advance();
      });
      game.addEventListener('contextmenu', (e) => { e.preventDefault(); if (!this.panel) this.toggleHide(); });
      game.addEventListener('wheel', (e) => { if (!this.panel && e.deltaY < 0 && VN.Engine.state) this.open('historico'); }, { passive: true });
      $('#menu').addEventListener('click', (e) => {
        if (e.target.id === 'menu' || e.target.closest('#menu-close')) { VN.Audio.sfx('voltar'); this.close(); }
      });
      window.addEventListener('keydown', (e) => {
        if (e.target && e.target.tagName === 'INPUT') return;
        const E = VN.Engine;
        if (e.key === 'Escape') {
          if (!$('#confirm').classList.contains('hidden')) return;
          if (this.panel) { this.close(); return; }
          if (this.screen === 'game' && E.state) this.open('menu');
          return;
        }
        if (this.screen !== 'game' || this.panel || !E.state) return;
        if (e.key === 'Control') { E.ctrlSkip = true; if (E.waiting && E.waiting.type === 'say' && (E.waiting.seen || VN.Settings.get('skipUnread'))) E.advance(true); return; }
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if ($('#game').classList.contains('ui-hidden')) { this.toggleHide(); return; } E.advance(); return; }
        if (/^[1-4]$/.test(e.key) && VN.Stage.choiceKeys) { VN.Stage.choiceKeys(parseInt(e.key, 10) - 1); return; }
        const k = e.key.toLowerCase();
        if (k === 'a') E.setAuto(!E.auto);
        else if (k === 's') E.setSkip(!E.skip);
        else if (k === 'h') this.toggleHide();
        else if (e.key === 'F5') { e.preventDefault(); E.save('rapido'); }
        else if (e.key === 'F9') { e.preventDefault(); const s = VN.Store.slots().rapido; if (s) E.load(s); else this.toast('Nenhum salvamento rápido ainda.'); }
        else if (e.key === 'PageUp') this.open('historico');
      });
      window.addEventListener('keyup', (e) => { if (e.key === 'Control') VN.Engine.ctrlSkip = false; });
      window.addEventListener('blur', () => { VN.Engine.ctrlSkip = false; });
      // pulo contínuo com Ctrl: avança sozinho enquanto segurado
      setInterval(() => {
        const E = VN.Engine;
        if (E.ctrlSkip && E.waiting && E.waiting.type === 'say' && !this.panel && (E.waiting.seen || VN.Settings.get('skipUnread'))) E.advance(true);
      }, 60);
    },
  };
  VN.UI = UI;
})();
