/* =========================================================================
   Inicialização. Também oferece alguns modos de teste pela URL:
     ?cena=pista&hora=noite&clima=chuva&v=vazio   só o cenário
        &chars=vega:centro,loves:esquerda:corrida  com personagens
        &texto=Olá!&fala=vega                        com caixa de texto
     ?rota=vega&rotulo=v_cap3&afeto=6&flags=a,b     começa num ponto da história
     ?teste=1                                        confere o roteiro todo
   ========================================================================= */
(function () {
  const VN = window.VN;

  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty('--scale', String(s));
  }
  window.addEventListener('resize', fit);
  fit();

  VN.Settings.apply();
  VN.Stage.init();
  VN.FX.init(document.getElementById('game'));
  VN.UI.init();

  const q = new URLSearchParams(location.search);
  if (q.has('cena')) debugScene(q);
  else if (q.has('teste')) selfTest();
  else if (q.has('simular')) simulate(q);
  else if (q.has('cenas')) sceneTest();
  else if (q.has('rota')) debugRoute(q);
  else VN.UI.home();
  if (q.has('inspecionar')) setTimeout(() => {
    const pre = document.createElement('pre');
    pre.id = 'inspect';
    pre.textContent = JSON.stringify(Array.from(document.querySelectorAll(q.get('inspecionar') || '.card')).map((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { cls: el.className, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), op: cs.opacity, tr: cs.transform, vis: cs.visibility, anim: cs.animationName + ' ' + cs.animationPlayState }; }));
    document.body.appendChild(pre);
  }, 3000);

  /** desenha todos os cenários em todas as horas/climas/variantes e mede o tamanho */
  function sceneTest() {
    const variants = { colina: ['constelacao'], rio: ['lua', 'lua_vermelha'], praia: ['lua', 'lua_vermelha'], hipodromo: ['vazio', 'delmar'], corrida: ['vazio', 'delmar'], palco: ['vazio'], rua: ['tanabata'], aeroporto: ['dubai'], cinema: ['luzes'], parque: ['outono'], jardim: ['sem-neve'], galeria: ['noite'] };
    const errs = [];
    const orig = console.error;
    console.error = (...a) => errs.push(a.map(String).join(' '));
    const sizes = [];
    let n = 0;
    for (const name of VN.Scenes.names()) {
      let max = 0, slow = 0;
      for (const time of VN.Scenes.TIMES) for (const weather of ['limpo', 'chuva', 'neve']) for (const v of [''].concat(variants[name] || [])) {
        const t0 = performance.now();
        const out = VN.Scenes.render(name, { time, weather, v });
        slow = Math.max(slow, performance.now() - t0);
        n++;
        max = Math.max(max, out.html.length);
      }
      sizes.push(`${name}: ${Math.round(max / 1024)} KB, ${Math.round(slow)} ms`);
    }
    console.error = orig;
    const pre = document.createElement('pre');
    pre.id = 'scenetest';
    pre.textContent = `${n} combinações desenhadas\n` + sizes.join('\n') + '\n' + (errs.length ? 'PROBLEMAS:\n' + errs.join('\n') : 'Nenhum erro');
    document.body.appendChild(pre);
  }

  /** joga uma rota sozinho, escolhendo por estratégia, e informa o final alcançado */
  async function simulate(q) {
    const route = q.get('simular');
    const strat = q.get('estrategia') || 'melhor';
    let seed = parseInt(q.get('seed') || '1', 10);
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    const errors = [];
    const origErr = console.error;
    console.error = (...a) => { errors.push(a.map(String).join(' ')); origErr.apply(console, a); };
    window.addEventListener('error', (e) => errors.push('window: ' + e.message));
    const picks = [];
    VN.Player.data.gender = q.get('genero') === 'f' ? 'f' : 'm';
    VN.Settings.data.skipUnread = true;
    VN.Settings.data.textSpeed = 120;
    VN.Stage.choose = (opts) => {
      const score = (o) => o.effects.reduce((s, e) => { const m = new RegExp('^' + route + '([+-]\\d+)$').exec(e); return s + (m ? parseInt(m[1], 10) : 0); }, 0);
      let i = 0;
      if (strat === 'melhor') i = opts.reduce((b, o, k) => (score(o) > score(opts[b]) ? k : b), 0);
      else if (strat === 'pior') i = opts.reduce((b, o, k) => (score(o) < score(opts[b]) ? k : b), 0);
      else if (strat === 'segunda') i = Math.min(1, opts.length - 1);
      else if (strat === 'terceira') i = Math.min(2, opts.length - 1);
      else if (strat === 'aleatoria') i = Math.floor(rnd() * opts.length);
      else if (strat === 'lista') i = Math.min(opts.length - 1, Math.max(0, parseInt((q.get('picks') || '').split(',')[picks.length] || '1', 10) - 1));
      // teste de salvar/carregar: na N-ésima escolha, salva, recarrega e continua dali
      const reloadAt = parseInt(q.get('recarregar') || '0', 10);
      if (reloadAt && picks.length + 1 === reloadAt && !simulate.reloaded) {
        simulate.reloaded = true;
        VN.Engine.save('s9');
        const data = VN.Store.slots().s9;
        setTimeout(async () => { await VN.Engine.load(data); VN.Engine.setSkip(true); }, 50);
        return new Promise(() => {}); // esta execução é abandonada; a carregada continua
      }
      picks.push(i + 1);
      // o motor desliga o "pular" nas escolhas; o simulador religa em seguida
      setTimeout(() => VN.Engine.setSkip(true), 0);
      return Promise.resolve(opts[i]);
    };
    const finish = (endingId) => {
      const st = VN.Engine.state;
      const pre = document.createElement('pre');
      pre.id = 'simresult';
      pre.textContent = JSON.stringify({ route, strat, ending: endingId, aff: st && st.aff[route], flags: st && Object.keys(st.flags), picks: picks.join(''), errors });
      document.body.appendChild(pre);
      document.body.dataset.ready = '1';
    };
    const origEnding = VN.Stage.ending.bind(VN.Stage);
    VN.Stage.ending = (e, r) => { origEnding(e, r); finish(e.id); };
    await VN.UI.startRoute(route);
    VN.Engine.setSkip(true);
  }

  async function debugScene(q) {
    if (q.get('estatico')) {
      // para capturas de tela: sem animações nem transições
      const st = document.createElement('style');
      st.textContent = '*,*::before,*::after{animation-delay:-60s!important;animation-play-state:paused!important;transition:none!important} #card,#paper,#paper .paper-inner,.choice,#ending,.end-box,.overlay,.menu-panel,.name-card,.card-box{animation:none!important}';
      document.head.appendChild(st);
    }
    VN.UI.showGame();
    document.getElementById('quickmenu').style.display = 'none';
    const spec = { scene: q.get('cena'), time: q.get('hora') || 'dia', weather: q.get('clima') || 'limpo', v: q.get('v') || '' };
    const out = await VN.Stage.setBg(spec, 'corte', true);
    VN.Stage.setLight(out.light);
    VN.FX.particles.set(q.get('part') || out.particles);
    if (q.get('tint')) VN.FX.setTint(parseFloat(q.get('tint')), q.get('tintcor') || 'red');
    const chars = (q.get('chars') || '').split(',').filter(Boolean).map((s) => s.split(':'));
    if (chars.length) {
      await VN.API.loadMany(chars.map((c) => c[0]));
      for (const [id, pos, outfit, size] of chars) VN.Stage.showChar(id, { pos: pos || 'centro', outfit: outfit || 'uniforme', size: size || 'normal' }, true);
      await VN.API.preload(chars.map(([id, , outfit]) => VN.API.sprite(id, outfit || 'uniforme')));
    }
    if (q.get('acao')) for (const [id] of chars) VN.Stage.action(id, q.get('acao'));
    if (q.get('emote')) {
      for (const [id] of chars) VN.Stage.action(id, q.get('emote'));
      const st = document.createElement('style');
      st.textContent = '.emote{animation:none!important;opacity:1!important;transform:none!important}';
      document.head.appendChild(st);
    }
    if (q.get('texto')) {
      const who = q.get('fala');
      const d = who && VN.API.get(who);
      VN.Stage.showText({ name: who ? (who === 'eu' ? VN.Player.displayName() : VN.CAST[who].name) : '', color: d ? d.color : null, color2: d ? d.colorSub : null, text: q.get('texto'), instant: true });
      if (q.get('caixa')) VN.Stage.textboxStyle(q.get('caixa'));
    } else VN.Stage.textbox(false);
    if (q.get('live')) { VN.Stage.setLive({ on: true, viewers: 1234, title: 'Loves♡Channel — treino do dia!' }); ['moranguinho_22: LOVES ♡♡♡', 'kei_0326: がんばれ〜!', 'umafan.br: boa noite do Brasil!!', 'pipoca.doce: kkkkkk'].forEach((m) => { const [u, t] = m.split(': '); VN.Stage.chat(u, t, true); }); }
    if (q.get('papel')) VN.Stage.paper(q.get('papel'), 'Diário — 13 de abril', ['Hoje {t} me chamou pelo nome.', 'Minhas orelhas viraram sozinhas.', '', '{red}A lua está crescendo.{/red}'], false);
    if (q.get('cartao')) {
      const r = q.get('cartao');
      await VN.API.loadMany([r]);
      const el = document.getElementById('card');
      VN.Stage.paint(el, r);
      el.querySelector('.chap-motif').innerHTML = VN.MOTIF[VN.ROUTES[r].motif];
      el.querySelector('.card-title').textContent = 'Capítulo 4';
      el.querySelector('.card-sub').textContent = { vega: 'Tanabata', loves: 'Arquibancadas vazias', still: 'Lua cheia' }[r];
      el.classList.remove('hidden');
    }
    if (q.get('escolhas')) VN.Stage.choose([{ text: 'Sua passada esquerda encurta nas curvas.' }, { text: 'Por que "primeira grandeza"?' }, { text: 'Tudo bem. Eu volto amanhã.' }]);
    if (q.get('final')) {
      const r = q.get('final');
      await VN.API.loadMany([r]);
      VN.Stage.ending({ id: 'teste', title: 'Duas Estrelas', kind: 'Final Verdadeiro', text: 'Vega aprendeu que lembrar de quem se ama não exige carregar sozinha o peso de duas vidas.' }, r);
    }
    if (q.get('menu')) { await VN.API.loadMany(['vega', 'loves', 'still']); VN.UI.open(q.get('menu')); }
    if (q.get('nomemodal')) { await VN.API.loadMany(['vega']); VN.UI.askName('vega'); }
    document.body.dataset.ready = '1';
  }

  async function debugRoute(q) {
    const route = q.get('rota');
    if (!VN.ROUTES[route]) return VN.UI.home();
    if (!VN.Player.has()) { VN.Player.data.name = q.get('nome') || ''; }
    await VN.UI.startRoute(route);
    const st = VN.Engine.state;
    if (q.get('rotulo')) {
      VN.Engine.stop();
      VN.Stage.reset();
      st.label = q.get('rotulo');
      st.idx = 0;
      if (q.get('afeto')) st.aff[route] = parseInt(q.get('afeto'), 10);
      (q.get('flags') || '').split(',').filter(Boolean).forEach((f) => (st.flags[f] = true));
      VN.Engine.go();
    }
  }

  /** confere o roteiro: rótulos, saltos, cenários, músicas, personagens */
  function selfTest() {
    const C = VN.STAGE_CONST;
    const out = [];
    const err = (route, line, msg) => out.push(`[${route}:${line}] ${msg}`);
    VN.Script.errors.forEach((e) => out.push(e));
    const L = VN.Script.labels;
    const has = (t, route) => !!L[t.replace('$route', route)];
    const tracks = VN.Audio.TRACKS, amb = VN.Audio.AMB, sfx = VN.Audio.SFX;
    const parts = new Set(['petals', 'rosas', 'leaves', 'rain', 'snow', 'fireflies', 'dust', 'hearts', 'confetti', 'speed', 'sparkles', 'none']);
    const effects = new Set(['tremor', 'flash', 'flashvermelho', 'vermelho', 'rosa', 'azul', 'sepia', 'vinheta', 'glitch', 'coracao', 'faixas']);
    const acts = (a) => C.EMOTES[a] || C.ONESHOT.has(a) || C.PERSIST[a] || C.CLEAR[a];
    let lines = 0, words = 0, choices = 0, races = 0;
    const endingIds = new Set();
    // corrida aberta por @tracking on (os rótulos de uma corrida ficam em sequência no arquivo)
    const tctx = { race: null, route: null };
    for (const name in L) {
      const { route, cmds } = L[name];
      if (tctx.route !== route) { tctx.route = route; tctx.race = null; }
      for (const c of cmds) {
        if (c.t === 'say' || c.t === 'narr') { lines++; words += c.text.split(/\s+/).length; }
        if (c.t === 'say') {
          if (c.who !== 'eu' && !VN.CAST[c.who] && !/^[A-ZÀ-Ú?"]/.test(c.who)) err(route, c.line, 'fala de quem? ' + c.who);
          for (const a of c.acts) if (!acts(a)) err(route, c.line, 'ação desconhecida: ' + a);
          if (/\{(?!\/?(red|shake|big|small|glow|pink)\}|w=[\d.]+\}|t\}|tt\}|o\}|O\}|ele\}|Ele\}|dele\}|um\}|meu\}|Meu\}|seu\}|Seu\}|nome\})/.test(c.text)) err(route, c.line, 'marcador estranho: ' + c.text);
        }
        if (c.t === 'narr' && /\{(?!\/?(red|shake|big|small|glow|pink)\}|w=[\d.]+\}|t\}|tt\}|o\}|O\}|ele\}|Ele\}|dele\}|um\}|meu\}|Meu\}|seu\}|Seu\}|nome\})/.test(c.text)) err(route, c.line, 'marcador estranho: ' + c.text);
        if (c.t === 'choice') {
          choices++;
          for (const o of c.options) {
            if (!has(o.target, route)) err(route, c.line, 'opção leva a rótulo inexistente: ' + o.target);
            for (const e of o.effects) if (!/^([a-z_]+[+-]\d+|!?flag:\w+)$/.test(e)) err(route, c.line, 'efeito estranho: ' + e);
          }
        }
        if (c.t === 'ending') { endingIds.add(c.id); if (!VN.ROUTES[route].endings.some((e) => e.id === c.id)) err(route, c.line, 'final não cadastrado: ' + c.id); }
        if (c.t !== 'cmd') continue;
        const a = c.args;
        switch (c.name) {
          case 'fundo':
            if (!VN.Scenes.exists(a[0])) err(route, c.line, 'cenário inexistente: ' + a[0]);
            for (const x of a.slice(1)) if (!(C.TIMES.has(x) || C.TRANS.has(x) || x === 'chuva' || x === 'limpo' || x === 'neve' || x.startsWith('v='))) err(route, c.line, 'argumento de fundo estranho: ' + x);
            break;
          case 'mostrar':
            if (!VN.CAST[a[0]]) err(route, c.line, 'personagem inexistente: ' + a[0]);
            for (const x of a.slice(1)) if (!(C.POS[x] != null || C.OUTFITS.has(x) || C.SIZES[x] || C.ENTERS.has(x) || acts(x))) err(route, c.line, 'argumento de mostrar estranho: ' + x);
            break;
          case 'esconder': if (a[0] && a[0] !== 'todos' && !VN.CAST[a[0]]) err(route, c.line, 'esconder quem? ' + a[0]); break;
          case 'mover': if (C.POS[a[1]] == null) err(route, c.line, 'posição inválida: ' + a[1]); break;
          case 'roupa': if (!C.OUTFITS.has(a[1])) err(route, c.line, 'roupa inválida: ' + a[1]); break;
          case 'tamanho': if (!C.SIZES[a[1]]) err(route, c.line, 'tamanho inválido: ' + a[1]); break;
          case 'anim': case 'emote': if (!VN.CAST[a[0]] || !acts(a[1])) err(route, c.line, `${c.name} inválido: ${a.join(' ')}`); break;
          case 'musica': if (a[0] !== 'parar' && !tracks[a[0]]) err(route, c.line, 'música inexistente: ' + a[0]); break;
          case 'som': if (!sfx[a[0]]) err(route, c.line, 'som inexistente: ' + a[0]); break;
          case 'ambiente': if (!['auto', 'parar'].includes(a[0]) && !amb[a[0]]) err(route, c.line, 'ambiente inexistente: ' + a[0]); break;
          case 'particulas': if (!parts.has(a[0])) err(route, c.line, 'partícula inexistente: ' + a[0]); break;
          case 'efeito': if (!effects.has(a[0])) err(route, c.line, 'efeito inexistente: ' + a[0]); break;
          case 'ir': if (!has(a[0], route)) err(route, c.line, 'salto para rótulo inexistente: ' + a[0]); break;
          case 'se': { const m = /=>\s*([\w$]+)\s*$/.exec(c.rest); if (!m || !has(m[1], route)) err(route, c.line, 'condição leva a rótulo inexistente: ' + c.rest); break; }
          case 'afeto': if (!VN.CAST[a[0]] || isNaN(parseInt(a[1], 10))) err(route, c.line, 'afeto inválido: ' + c.rest); break;
          case 'marcar': case 'desmarcar': case 'caixa': case 'live': case 'esperar': break;
          case 'tracking': {
            if ((a[0] || '').toLowerCase() === 'on') races++;
            const keep = tctx.race;
            VN.Tracking.validate(a, c.rest, tctx).forEach((e) => err(route, c.line, e));
            // um "off" num ramo não fecha a corrida para os ramos que vêm depois no arquivo
            if ((a[0] || '').toLowerCase() === 'off') tctx.race = keep;
            break;
          }
          default: err(route, c.line, 'comando desconhecido: @' + c.name);
        }
      }
    }
    for (const r in VN.ROUTES) {
      if (!L[VN.ROUTES[r].start]) out.push(`rota ${r}: rótulo inicial ${VN.ROUTES[r].start} não existe`);
      for (const e of VN.ROUTES[r].endings) if (!endingIds.has(e.id)) out.push(`rota ${r}: final ${e.id} nunca é alcançado`);
    }
    const report = `Roteiro: ${Object.keys(L).length} rótulos · ${lines} falas · ${words} palavras · ${choices} escolhas · ${races} corridas no Tracking System\n` + (out.length ? 'PROBLEMAS:\n' + out.join('\n') : 'Nenhum problema encontrado ♡');
    const pre = document.createElement('pre');
    pre.id = 'selftest';
    pre.style.cssText = 'position:fixed;inset:0;margin:0;padding:24px;background:#fff;color:#222;font:14px/1.5 monospace;overflow:auto;z-index:999;white-space:pre-wrap;user-select:text';
    pre.textContent = report;
    document.body.appendChild(pre);
    document.body.dataset.ready = '1';
    console.log(report);
  }
})();
