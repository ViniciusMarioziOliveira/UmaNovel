/* Monta um cenário em camadas HTML a partir das definições em SVG.
   O estilo é chapado: sem textura, gradação de cor ou vinheta por cima. */
(function () {
  const VN = (window.VN = window.VN || {});
  const TIMES = ['manha', 'dia', 'tarde', 'crepusculo', 'noite'];

  /** tom bem leve nas personagens, só fora de casa no fim do dia, à noite e na chuva */
  function lightFor(o, out) {
    if (out.light) return out.light;
    if (out.interior) return 'dia';
    if (o.weather === 'chuva') return o.time === 'noite' || o.time === 'crepusculo' ? 'noite' : 'chuva';
    if (o.time === 'tarde' || o.time === 'crepusculo' || o.time === 'noite') return o.time;
    return 'dia';
  }

  VN.Scenes = {
    TIMES,
    names() { return Object.keys(VN.SceneDefs).filter((n) => !n.startsWith('_')); },
    exists(name) { return !!VN.SceneDefs[name] && !name.startsWith('_'); },
    /**
     * @param {string} name  nome do cenário (ex.: "pista")
     * @param {{time?:string, weather?:string, v?:string}} opts
     * @returns {{html:string, particles:string, amb:string|null, light:string}}
     */
    render(name, opts) {
      const o = Object.assign({ time: 'dia', weather: 'limpo', v: '' }, opts || {});
      const def = VN.SceneDefs[name] || VN.SceneDefs.preto;
      VN.Kit.newPrefix();
      VN.Kit.setTime(o.time, o.weather);
      let out;
      try {
        out = def(o);
      } catch (err) {
        console.error('Erro ao desenhar o cenário', name, err);
        VN.Kit.newPrefix();
        VN.Kit.setTime(o.time, o.weather);
        out = VN.SceneDefs.preto(o);
      }
      const defs = VN.Kit.takeDefs();
      const html =
        `<svg class="bg-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>${defs}</defs></svg>` +
        out.layers.map((l) => `<div class="bg-layer ${l.cls || ''}" data-depth="${l.depth || 0}">${l.svg}</div>`).join('');
      const flat = name === 'preto' || name === 'branco';
      return { html, particles: out.particles || 'none', amb: out.amb || null, light: flat ? 'dia' : lightFor(o, out) };
    },
  };
})();
