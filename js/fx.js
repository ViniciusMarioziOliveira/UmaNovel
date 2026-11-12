/* =========================================================================
   Efeitos: partículas num <canvas> (pétalas, chuva, vaga-lumes...) e
   efeitos de tela (tremor, flash, vinheta, tom avermelhado, glitch).
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const W = 1920, H = 1080;

  /* -------------------------------------------------------- partículas */
  const TYPES = {
    petals: { n: 22, make: (r) => ({ x: r() * W * 1.2, y: -20 - r() * H, vx: -0.4 - r() * 0.8, vy: 0.6 + r() * 0.9, s: 6 + r() * 7, a: r() * 6.28, va: (r() - 0.5) * 0.04, ph: r() * 6.28, c: r() < 0.5 ? '#ffc7d6' : '#ffe1ea' }) },
    rosas: { n: 34, make: (r) => ({ x: r() * W * 1.2, y: -20 - r() * H, vx: -0.3 - r() * 0.5, vy: 0.5 + r() * 0.7, s: 7 + r() * 8, a: r() * 6.28, va: (r() - 0.5) * 0.04, ph: r() * 6.28, c: r() < 0.5 ? '#8f0f24' : '#c4223b' }) },
    leaves: { n: 14, make: (r) => ({ x: r() * W * 1.3, y: -40 - r() * H, vx: -1 - r() * 1.2, vy: 0.7 + r() * 0.8, s: 9 + r() * 8, a: r() * 6.28, va: (r() - 0.5) * 0.06, ph: r() * 6.28, c: ['#7fbf5a', '#a9d46a', '#5f9f45'][Math.floor(r() * 3)] }) },
    rain: { n: 240, make: (r) => ({ x: r() * W * 1.1, y: r() * H, vx: -2.2, vy: 22 + r() * 12, s: 18 + r() * 26, a: 0, c: 'rgba(210,225,240,' + (0.25 + r() * 0.35).toFixed(2) + ')' }) },
    snow: { n: 120, make: (r) => ({ x: r() * W, y: r() * H, vx: -0.3, vy: 0.6 + r() * 1.2, s: 1.5 + r() * 3.5, ph: r() * 6.28 }) },
    fireflies: { n: 34, make: (r) => ({ x: r() * W, y: 500 + r() * 560, vx: (r() - 0.5) * 0.6, vy: (r() - 0.5) * 0.4, s: 2 + r() * 2.5, ph: r() * 6.28, sp: 0.02 + r() * 0.03 }) },
    dust: { n: 70, make: (r) => ({ x: r() * W, y: r() * H, vx: (r() - 0.5) * 0.15, vy: -0.05 - r() * 0.15, s: 0.8 + r() * 2, ph: r() * 6.28, sp: 0.01 + r() * 0.02 }) },
    hearts: { n: 22, make: (r) => ({ x: r() * W, y: H + r() * H, vx: (r() - 0.5) * 0.4, vy: -0.6 - r() * 0.9, s: 10 + r() * 16, ph: r() * 6.28, c: ['#ff7ab8', '#ffb3d6', '#ff5f9e', '#ffd1e6'][Math.floor(r() * 4)] }) },
    confetti: { n: 130, make: (r) => ({ x: r() * W, y: -r() * H, vx: (r() - 0.5) * 1.5, vy: 1.5 + r() * 2.5, s: 8 + r() * 8, a: r() * 6.28, va: (r() - 0.5) * 0.2, ph: r() * 6.28, c: ['#ff6fb5', '#7fd6ff', '#fff27a', '#9dff9a', '#c99bff', '#ffffff', '#ff9a6a'][Math.floor(r() * 7)] }) },
    speed: { n: 46, make: (r) => ({ x: r() * W * 1.5, y: r() * H, vx: -40 - r() * 50, vy: 0, s: 120 + r() * 380, c: 'rgba(255,255,255,' + (0.12 + r() * 0.3).toFixed(2) + ')' }) },
    sparkles: { n: 40, make: (r) => ({ x: r() * W, y: r() * H, vx: 0, vy: -0.15, s: 4 + r() * 8, ph: r() * 6.28, sp: 0.03 + r() * 0.04 }) },
    none: { n: 0, make: () => ({}) },
  };

  const P = {
    canvas: null, ctx: null, type: 'none', list: [], raf: 0, rnd: Math.random, scale: 1, splashes: [],
    init(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      canvas.width = W; canvas.height = H;
    },
    set(type, intensity) {
      const t = TYPES[type] ? type : 'none';
      const k = intensity == null ? 1 : intensity;
      this.type = t;
      const def = TYPES[t];
      const n = Math.round(def.n * k * (VN.Settings && VN.Settings.get('reduceMotion') ? 0.4 : 1));
      this.list = [];
      for (let i = 0; i < n; i++) this.list.push(def.make(this.rnd));
      this.splashes = [];
      if (n > 0 && !this.raf) this.loop();
      if (n === 0) this.clear();
    },
    clear() {
      if (this.ctx) this.ctx.clearRect(0, 0, W, H);
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    },
    loop() {
      let last = performance.now();
      const step = (now) => {
        const dt = Math.min(3, (now - last) / 16.67);
        last = now;
        this.update(dt, now / 1000);
        this.draw(now / 1000);
        if (this.list.length) this.raf = requestAnimationFrame(step);
        else this.clear();
      };
      this.raf = requestAnimationFrame(step);
    },
    update(dt, t) {
      const ty = this.type, def = TYPES[ty];
      for (const p of this.list) {
        if (ty === 'petals' || ty === 'leaves' || ty === 'rosas') {
          p.x += (p.vx + Math.sin(t * 1.3 + p.ph) * 0.6) * dt;
          p.y += p.vy * dt;
          p.a += p.va * dt;
          if (p.y > H + 30 || p.x < -40) Object.assign(p, def.make(this.rnd), { y: -20, x: this.rnd() * W * 1.2 });
        } else if (ty === 'rain') {
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.y > H) {
            if (this.rnd() < 0.25) this.splashes.push({ x: p.x, y: 900 + this.rnd() * 180, r: 1, life: 1 });
            p.y = -p.s; p.x = this.rnd() * W * 1.1;
          }
        } else if (ty === 'snow') {
          p.x += (p.vx + Math.sin(t + p.ph) * 0.4) * dt; p.y += p.vy * dt;
          if (p.y > H) { p.y = -5; p.x = this.rnd() * W; }
        } else if (ty === 'fireflies' || ty === 'dust' || ty === 'sparkles') {
          p.ph += (p.sp || 0.02) * dt;
          p.x += (p.vx + Math.sin(p.ph * 1.7) * 0.25) * dt;
          p.y += (p.vy + Math.cos(p.ph * 1.3) * 0.2) * dt;
          if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
        } else if (ty === 'hearts') {
          p.x += (p.vx + Math.sin(t * 2 + p.ph) * 0.5) * dt; p.y += p.vy * dt;
          if (p.y < -40) Object.assign(p, def.make(this.rnd), { y: H + 30 });
        } else if (ty === 'confetti') {
          p.x += (p.vx + Math.sin(t * 3 + p.ph)) * dt; p.y += p.vy * dt; p.a += p.va * dt;
          if (p.y > H + 20) Object.assign(p, def.make(this.rnd), { y: -20 });
        } else if (ty === 'speed') {
          p.x += p.vx * dt;
          if (p.x + p.s < 0) { p.x = W + this.rnd() * 400; p.y = this.rnd() * H; }
        }
      }
      for (const s of this.splashes) { s.r += 0.8 * dt; s.life -= 0.06 * dt; }
      this.splashes = this.splashes.filter((s) => s.life > 0);
    },
    draw(t) {
      const c = this.ctx, ty = this.type;
      c.clearRect(0, 0, W, H);
      for (const p of this.list) {
        if (ty === 'petals' || ty === 'rosas') {
          c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.scale(Math.cos(t * 2 + p.ph), 1);
          c.fillStyle = p.c; c.globalAlpha = ty === 'rosas' ? 0.85 : 0.9;
          c.beginPath();
          c.moveTo(0, -p.s * 0.5);
          c.bezierCurveTo(p.s * 0.6, -p.s * 0.4, p.s * 0.5, p.s * 0.45, 0, p.s * 0.55);
          c.bezierCurveTo(-p.s * 0.5, p.s * 0.45, -p.s * 0.6, -p.s * 0.4, 0, -p.s * 0.5);
          c.fill(); c.restore();
        } else if (ty === 'leaves') {
          c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.scale(1, Math.cos(t * 2 + p.ph));
          c.fillStyle = p.c; c.globalAlpha = 0.85;
          c.beginPath(); c.ellipse(0, 0, p.s, p.s * 0.45, 0, 0, 6.28); c.fill();
          c.strokeStyle = 'rgba(40,80,30,.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-p.s, 0); c.lineTo(p.s, 0); c.stroke();
          c.restore();
        } else if (ty === 'rain') {
          c.strokeStyle = p.c; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + p.vx * 0.9, p.y + p.s); c.stroke();
        } else if (ty === 'snow') {
          c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(p.x, p.y, p.s, 0, 6.28); c.fill();
        } else if (ty === 'fireflies') {
          const a = 0.35 + Math.sin(p.ph * 3) * 0.35 + 0.3;
          const gr = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 7);
          gr.addColorStop(0, `rgba(230,255,150,${(a * 0.9).toFixed(2)})`);
          gr.addColorStop(1, 'rgba(230,255,150,0)');
          c.fillStyle = gr; c.beginPath(); c.arc(p.x, p.y, p.s * 7, 0, 6.28); c.fill();
          c.fillStyle = `rgba(255,255,220,${a.toFixed(2)})`; c.beginPath(); c.arc(p.x, p.y, p.s * 0.8, 0, 6.28); c.fill();
        } else if (ty === 'dust') {
          const a = 0.25 + Math.sin(p.ph * 2) * 0.2;
          c.fillStyle = `rgba(255,248,225,${a.toFixed(2)})`; c.beginPath(); c.arc(p.x, p.y, p.s, 0, 6.28); c.fill();
        } else if (ty === 'sparkles') {
          const a = Math.max(0, Math.sin(p.ph * 2));
          c.save(); c.translate(p.x, p.y); c.globalAlpha = a; c.fillStyle = '#fffbe6';
          c.beginPath();
          for (let k = 0; k < 4; k++) { const ang = (k * Math.PI) / 2; c.lineTo(Math.cos(ang) * p.s, Math.sin(ang) * p.s); c.lineTo(Math.cos(ang + 0.78) * p.s * 0.25, Math.sin(ang + 0.78) * p.s * 0.25); }
          c.fill(); c.restore();
        } else if (ty === 'hearts') {
          c.save(); c.translate(p.x, p.y); c.globalAlpha = Math.min(1, (p.y / H) * 1.6) * 0.75; c.fillStyle = p.c;
          const s = p.s / 16;
          c.scale(s, s); c.beginPath(); c.moveTo(0, 6);
          c.bezierCurveTo(-14, -4, -8, -16, 0, -8); c.bezierCurveTo(8, -16, 14, -4, 0, 6); c.fill(); c.restore();
        } else if (ty === 'confetti') {
          c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.scale(Math.cos(t * 4 + p.ph), 1);
          c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore();
        } else if (ty === 'speed') {
          c.strokeStyle = p.c; c.lineWidth = 2;
          c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + p.s, p.y); c.stroke();
        }
      }
      if (ty === 'rain') {
        c.strokeStyle = 'rgba(220,232,245,.4)'; c.lineWidth = 1.2;
        for (const s of this.splashes) { c.globalAlpha = s.life; c.beginPath(); c.ellipse(s.x, s.y, s.r * 3, s.r, 0, 0, 6.28); c.stroke(); }
        c.globalAlpha = 1;
      }
    },
  };

  /* ------------------------------------------------- efeitos de tela */
  const FX = {
    particles: P,
    els: {},
    init(root) {
      this.root = root;
      this.els = {
        flash: root.querySelector('#fx-flash'),
        vignette: root.querySelector('#fx-vignette'),
        tint: root.querySelector('#fx-tint'),
        letterbox: root.querySelector('#fx-letterbox'),
        heart: root.querySelector('#fx-heart'),
      };
      P.init(root.querySelector('#fx-canvas'));
      this.state = { tint: 0, tintColor: 'red', vignette: 0, letterbox: false, heartbeat: false, glitch: false };
    },
    reduce() { return VN.Settings && VN.Settings.get('reduceMotion'); },
    shake(power, ms) {
      if (this.reduce()) return;
      const stage = this.root;
      stage.style.setProperty('--shake', (power || 12) + 'px');
      stage.classList.remove('shaking');
      void stage.offsetWidth;
      stage.classList.add('shaking');
      clearTimeout(this._sh);
      this._sh = setTimeout(() => stage.classList.remove('shaking'), ms || 500);
    },
    flash(color, ms) {
      const el = this.els.flash;
      el.style.background = color || '#ffffff';
      el.style.transition = 'none';
      el.style.opacity = this.reduce() ? 0.4 : 1;
      void el.offsetWidth;
      el.style.transition = `opacity ${ms || 600}ms ease-out`;
      el.style.opacity = 0;
    },
    setVignette(v) {
      this.state.vignette = v;
      this.els.vignette.style.opacity = v;
    },
    /** tom de cor por cima da cena; "red" fica mais intenso conforme a rota da Still avança */
    setTint(level, color) {
      this.state.tint = level;
      this.state.tintColor = color || 'red';
      const el = this.els.tint;
      el.dataset.color = this.state.tintColor;
      el.style.opacity = level;
    },
    setLetterbox(on) {
      this.state.letterbox = !!on;
      this.els.letterbox.classList.toggle('on', !!on);
    },
    setHeartbeat(on) {
      this.state.heartbeat = !!on;
      this.els.heart.classList.toggle('on', !!on && !this.reduce());
    },
    glitch(ms) {
      if (this.reduce()) { this.flash('#3a0008', 300); return; }
      const stage = this.root;
      stage.classList.add('glitching');
      clearTimeout(this._gl);
      this._gl = setTimeout(() => stage.classList.remove('glitching'), ms || 700);
    },
    snapshot() { return Object.assign({ particles: P.type }, this.state); },
    restore(s) {
      if (!s) return;
      this.setTint(s.tint || 0, s.tintColor);
      this.setVignette(s.vignette || 0);
      this.setLetterbox(s.letterbox);
      this.setHeartbeat(s.heartbeat);
      P.set(s.particles || 'none');
    },
    reset() {
      this.setTint(0); this.setVignette(0); this.setLetterbox(false); this.setHeartbeat(false); P.set('none');
    },
  };
  VN.FX = FX;
})();
