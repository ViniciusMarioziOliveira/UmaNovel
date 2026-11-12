/* =========================================================================
   Cliente da API pública umapyoi.net
   - busca perfil (cores, nome em japonês, aniversário, voz) e as artes
     (uniforme da Tracen e traje de corrida) de cada personagem;
   - guarda o resultado no navegador por alguns dias, para não sobrecarregar
     a API (que também é um projeto de fã);
   - se a API estiver fora do ar, usa a cópia em js/data/fallback.js.
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const BASE = 'https://umapyoi.net/api/v1';
  const TTL = 3 * 24 * 3600 * 1000;
  const CACHE_KEY = 'umanovel.api.v2.';

  // O CDN das artes (microCMS) aceita parâmetros de redimensionamento.
  const PARAMS = {
    sprite: 'w=1100&fm=webp&q=86',
    thumb: 'w=560&fm=webp&q=86',
    icon: 'w=192&fm=webp&q=85',
  };

  function withParams(url, kind) {
    if (!url) return '';
    if (!/microcms-assets\.io/.test(url)) return url;
    return url + (url.includes('?') ? '&' : '?') + (PARAMS[kind] || '');
  }

  async function getJSON(path, timeout) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => ctl && ctl.abort(), timeout || 9000);
    try {
      const res = await fetch(BASE + path, { signal: ctl ? ctl.signal : undefined });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function readCache(key) {
    try {
      const raw = localStorage.getItem(CACHE_KEY + key);
      if (!raw) return null;
      const v = JSON.parse(raw);
      if (!v || Date.now() - v.t > TTL) return null;
      return v.d;
    } catch (e) {
      return null;
    }
  }
  function writeCache(key, d) {
    try { localStorage.setItem(CACHE_KEY + key, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* armazenamento cheio ou bloqueado */ }
  }

  function saturation(hex) {
    const h = String(hex || '').replace('#', '');
    if (h.length !== 6) return 0;
    const n = parseInt(h, 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    return max === 0 ? 0 : (max - min) / max;
  }

  /** transforma a resposta da API no formato usado pela novel */
  function normalize(key, info, groups) {
    const pick = (label) => {
      const g = (groups || []).find((x) => x.label_en === label);
      if (!g) return null;
      const cdn = g.images.find((i) => /microcms-assets\.io/.test(i.image));
      return (cdn || g.images[0] || {}).image || null;
    };
    const uni = (info.images && info.images.Uniform) || pick('Uniform');
    const race = (info.images && info.images.Racewear) || pick('Racewear');
    // Algumas cores oficiais principais são quase cinza (ex.: Loves Only You);
    // nesse caso a cor secundária, mais viva, vira o destaque da interface.
    let c1 = info.color_main || '#8a7a9a', c2 = info.color_sub || '#c9b9d9';
    if (saturation(c1) < 0.18 && saturation(c2) > saturation(c1)) [c1, c2] = [c2, c1];
    return {
      key,
      id: info.id,
      name: (info.name_en || VN.CAST[key].name).replace('​', ''),
      nameJp: info.name_jp || '',
      color: c1,
      colorSub: c2,
      officialColors: [info.color_main, info.color_sub],
      birthday: info.birth_day ? { d: info.birth_day, m: info.birth_month } : null,
      height: info.height || null,
      residence: info.residence || null,
      slogan: info.slogan || null,
      thumb: info.thumb_img || null,
      icon: info.sns_icon || null,
      voice: info.voice || null,
      outfits: { uniforme: uni, corrida: race || uni },
    };
  }

  const API = {
    BASE,
    status: 'desconhecido', // 'online' | 'cache' | 'offline'
    data: {},
    img: withParams,

    async character(key) {
      if (this.data[key]) return this.data[key];
      const meta = VN.CAST[key];
      if (!meta) throw new Error('Personagem desconhecida: ' + key);
      const cached = readCache(key);
      if (cached) {
        this.data[key] = cached;
        if (this.status === 'desconhecido') this.status = 'cache';
        return cached;
      }
      try {
        const [info, groups] = await Promise.all([getJSON('/character/' + meta.api), getJSON('/character/images/' + meta.api)]);
        const d = normalize(key, info, groups);
        writeCache(key, d);
        this.data[key] = d;
        this.status = 'online';
        return d;
      } catch (err) {
        console.warn('API do umapyoi.net indisponível para', key, '— usando cópia local.', err);
        const fb = VN.FALLBACK && VN.FALLBACK[key];
        const d = fb ? normalize(key, fb, null) : normalize(key, { name_en: meta.name }, null);
        this.data[key] = d;
        if (this.status !== 'online') this.status = 'offline';
        return d;
      }
    },

    /** carrega várias personagens; chama onProgress(feitas, total) */
    async loadMany(keys, onProgress) {
      let done = 0;
      const total = keys.length;
      const out = {};
      await Promise.all(
        keys.map(async (k) => {
          out[k] = await this.character(k);
          done += 1;
          if (onProgress) onProgress(done, total);
        })
      );
      return out;
    },

    get(key) { return this.data[key] || null; },
    sprite(key, outfit) {
      const d = this.data[key];
      if (!d) return '';
      return withParams(d.outfits[outfit] || d.outfits.uniforme, 'sprite');
    },
    thumb(key) { const d = this.data[key]; return d ? withParams(d.thumb, 'thumb') : ''; },
    icon(key) { const d = this.data[key]; return d ? withParams(d.icon || d.thumb, 'icon') : ''; },

    /** pré-carrega imagens (resolve mesmo se alguma falhar) */
    preload(urls, onProgress) {
      let done = 0;
      const list = urls.filter(Boolean);
      if (!list.length) return Promise.resolve();
      return Promise.all(
        list.map(
          (u) =>
            new Promise((resolve) => {
              const im = new Image();
              const fin = () => { done += 1; if (onProgress) onProgress(done, list.length); resolve(); };
              im.onload = fin; im.onerror = fin;
              im.decoding = 'async';
              im.src = u;
            })
        )
      );
    },
  };
  VN.API = API;
})();
