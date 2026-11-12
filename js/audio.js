/* =========================================================================
   Áudio gerado no navegador (WebAudio): músicas, ambientes e efeitos.
   Nada de arquivos de som — tudo é sintetizado na hora.
   ========================================================================= */
(function () {
  const VN = (window.VN = window.VN || {});
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  const A = {
    ctx: null, ready: false, master: null, musicBus: null, sfxBus: null, ambBus: null, verb: null, noise: null,
    vol: { music: 0.6, sfx: 0.7 },
    current: null, fading: [], timer: 0, ambState: null, ambTimer: 0, pendingMusic: null, pendingAmb: null,

    /** precisa ser chamado após um clique (política de autoplay dos navegadores) */
    unlock() {
      if (this.ready) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = (this.ctx = new AC());
      this.master = ctx.createGain();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
      this.master.connect(comp).connect(ctx.destination);
      this.musicBus = ctx.createGain(); this.musicBus.connect(this.master);
      this.sfxBus = ctx.createGain(); this.sfxBus.connect(this.master);
      this.ambBus = ctx.createGain(); this.ambBus.connect(this.master);
      this.verb = ctx.createConvolver();
      this.verb.buffer = this.impulse(3.2, 2.4);
      this.verbIn = ctx.createGain(); this.verbIn.gain.value = 1;
      this.verbIn.connect(this.verb).connect(this.musicBus);
      // ruído branco reutilizável
      const len = ctx.sampleRate * 2;
      this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.ready = true;
      this.applyVolumes();
      this.timer = setInterval(() => this.tick(), 50);
      if (this.pendingMusic) { const p = this.pendingMusic; this.pendingMusic = null; this.music(p); }
      if (this.pendingAmb) { const p = this.pendingAmb; this.pendingAmb = null; this.amb(p); }
    },
    impulse(sec, decay) {
      const ctx = this.ctx, rate = ctx.sampleRate, len = Math.floor(rate * sec);
      const buf = ctx.createBuffer(2, len, rate);
      for (let c = 0; c < 2; c++) {
        const ch = buf.getChannelData(c);
        for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
      return buf;
    },
    setVolumes(music, sfx) {
      if (music != null) this.vol.music = music;
      if (sfx != null) this.vol.sfx = sfx;
      this.applyVolumes();
    },
    applyVolumes() {
      if (!this.ready) return;
      const t = this.ctx.currentTime;
      this.musicBus.gain.setTargetAtTime(this.vol.music * 0.55, t, 0.1);
      this.sfxBus.gain.setTargetAtTime(this.vol.sfx * 0.9, t, 0.05);
      this.ambBus.gain.setTargetAtTime(this.vol.sfx * 0.55, t, 0.1);
    },

    /* ------------------------------------------------- instrumentos */
    osc(type, f) { const o = this.ctx.createOscillator(); o.type = type; o.frequency.value = f; return o; },
    gain(v) { const g = this.ctx.createGain(); g.gain.value = v == null ? 1 : v; return g; },
    filt(type, f, q) { const b = this.ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b; },
    noiseSrc() { const s = this.ctx.createBufferSource(); s.buffer = this.noise; s.loop = true; return s; },

    inst(dest) {
      const a = this;
      const ctx = this.ctx;
      const stopAt = (nodes, t) => nodes.forEach((n) => n.stop(t));
      return {
        pluck(t, m, dur, vel) {
          const f = mtof(m);
          const o = a.osc('triangle', f), o2 = a.osc('sine', f * 2);
          const fl = a.filt('lowpass', f * 8);
          fl.frequency.setValueAtTime(Math.min(12000, f * 10), t);
          fl.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.4), t + 0.35);
          const g = a.gain(0), g2 = a.gain(0.22);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.5);
          o.connect(fl); o2.connect(g2).connect(fl); fl.connect(g).connect(dest);
          o.start(t); o2.start(t); stopAt([o, o2], t + dur + 0.6);
        },
        bell(t, m, vel, dur, ratio) {
          const f = mtof(m), d = dur || 2.6;
          const car = a.osc('sine', f), mod = a.osc('sine', f * (ratio || 3.5));
          const mg = a.gain(0);
          mg.gain.setValueAtTime(f * 1.8, t);
          mg.gain.exponentialRampToValueAtTime(1, t + d * 0.8);
          mod.connect(mg).connect(car.frequency);
          const g = a.gain(0);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(vel, t + 0.004);
          g.gain.exponentialRampToValueAtTime(0.0001, t + d);
          car.connect(g).connect(dest);
          car.start(t); mod.start(t); stopAt([car, mod], t + d + 0.1);
        },
        box(t, m, vel) { this.bell(t, m, vel, 1.4, 4.0); },
        pad(t, ms, dur, vel, cutoff) {
          const fl = a.filt('lowpass', cutoff || 1100, 0.5);
          const g = a.gain(0);
          const att = Math.min(1.4, dur * 0.4);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(vel, t + att);
          g.gain.setValueAtTime(vel, t + dur);
          g.gain.linearRampToValueAtTime(0, t + dur + 1.4);
          fl.connect(g).connect(dest);
          const nodes = [];
          for (const m of ms) {
            for (const det of [-7, 7]) {
              const o = a.osc('sawtooth', mtof(m));
              o.detune.value = det;
              const og = a.gain(0.5 / ms.length);
              o.connect(og).connect(fl);
              o.start(t); nodes.push(o);
            }
          }
          stopAt(nodes, t + dur + 1.5);
        },
        bass(t, m, dur, vel) {
          const f = mtof(m);
          const o = a.osc('sine', f), o2 = a.osc('triangle', f);
          const fl = a.filt('lowpass', 700);
          const g = a.gain(0), g2 = a.gain(0.35);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(vel, t + 0.015);
          g.gain.exponentialRampToValueAtTime(vel * 0.6, t + dur * 0.6);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.15);
          o.connect(fl); o2.connect(g2).connect(fl); fl.connect(g).connect(dest);
          o.start(t); o2.start(t); stopAt([o, o2], t + dur + 0.2);
        },
        rhodes(t, m, dur, vel) {
          const f = mtof(m);
          const car = a.osc('sine', f), mod = a.osc('sine', f);
          const mg = a.gain(0);
          mg.gain.setValueAtTime(f * 0.9, t);
          mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 0.6);
          mod.connect(mg).connect(car.frequency);
          const trem = a.osc('sine', 4.6), tg = a.gain(vel * 0.18);
          const g = a.gain(0);
          trem.connect(tg).connect(g.gain);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(vel, t + 0.01);
          g.gain.exponentialRampToValueAtTime(vel * 0.4, t + 0.5);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.8);
          car.connect(g).connect(dest);
          car.start(t); mod.start(t); trem.start(t); stopAt([car, mod, trem], t + dur + 0.9);
        },
        piano(t, m, dur, vel) {
          const f = mtof(m);
          const o = a.osc('triangle', f), o2 = a.osc('sine', f * 2), o3 = a.osc('sine', f * 3);
          const fl = a.filt('lowpass', 2600);
          const g = a.gain(0), g2 = a.gain(0.3), g3 = a.gain(0.08);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(vel, t + 0.005);
          g.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.4);
          g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(1.2, dur) + 1.2);
          o.connect(fl); o2.connect(g2).connect(fl); o3.connect(g3).connect(fl); fl.connect(g).connect(dest);
          o.start(t); o2.start(t); o3.start(t); stopAt([o, o2, o3], t + Math.max(1.2, dur) + 1.3);
        },
        brass(t, ms, dur, vel) {
          const fl = a.filt('lowpass', 400, 1);
          fl.frequency.setValueAtTime(400, t);
          fl.frequency.linearRampToValueAtTime(2600, t + 0.06);
          fl.frequency.exponentialRampToValueAtTime(900, t + dur);
          const g = a.gain(0);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(vel, t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.2);
          fl.connect(g).connect(dest);
          const nodes = ms.map((m) => { const o = a.osc('sawtooth', mtof(m)); const og = a.gain(1 / ms.length); o.connect(og).connect(fl); o.start(t); return o; });
          stopAt(nodes, t + dur + 0.3);
        },
        kick(t, vel) {
          const o = a.osc('sine', 130), g = a.gain(0);
          o.frequency.setValueAtTime(130, t);
          o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
          g.gain.setValueAtTime(vel || 0.5, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
          o.connect(g).connect(dest); o.start(t); o.stop(t + 0.35);
        },
        hat(t, vel) {
          const s = a.noiseSrc(), fl = a.filt('highpass', 7500), g = a.gain(0);
          g.gain.setValueAtTime(vel || 0.05, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
          s.connect(fl).connect(g).connect(dest);
          s.start(t, Math.random()); s.stop(t + 0.07);
        },
        brush(t, vel) {
          const s = a.noiseSrc(), fl = a.filt('bandpass', 3500, 0.6), g = a.gain(0);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(vel || 0.03, t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
          s.connect(fl).connect(g).connect(dest);
          s.start(t, Math.random()); s.stop(t + 0.25);
        },
        clap(t, vel) {
          const s = a.noiseSrc(), fl = a.filt('bandpass', 1500, 0.8), g = a.gain(0);
          g.gain.setValueAtTime(vel || 0.2, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
          s.connect(fl).connect(g).connect(dest);
          s.start(t, Math.random()); s.stop(t + 0.18);
        },
        tom(t, m, vel) {
          const o = a.osc('sine', mtof(m) * 1.5), g = a.gain(0);
          o.frequency.exponentialRampToValueAtTime(mtof(m), t + 0.1);
          g.gain.setValueAtTime(vel || 0.3, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
          o.connect(g).connect(dest); o.start(t); o.stop(t + 0.55);
        },
        swell(t, dur, vel) {
          const s = a.noiseSrc(), fl = a.filt('bandpass', 900, 0.7), g = a.gain(0);
          fl.frequency.setValueAtTime(300, t);
          fl.frequency.exponentialRampToValueAtTime(2400, t + dur);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(vel || 0.08, t + dur);
          g.gain.setValueAtTime(0.0001, t + dur + 0.02);
          s.connect(fl).connect(g).connect(dest);
          s.start(t, Math.random()); s.stop(t + dur + 0.05);
        },
      };
    },

    /* ------------------------------------------------------ músicas */
    music(name) {
      if (!name || name === 'stop' || name === 'parar') return this.stopMusic();
      if (!this.ready) { this.pendingMusic = name; return; }
      if (this.current && this.current.name === name) return;
      const def = TRACKS[name];
      if (!def) { console.warn('Trilha desconhecida:', name); return; }
      this.stopMusic(1.6);
      const g = this.gain(0);
      const send = this.gain(def.reverb == null ? 0.35 : def.reverb);
      g.connect(this.musicBus); g.connect(send); send.connect(this.verbIn);
      const t = this.ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(def.gain || 1, t + 1.8);
      this.current = { name, def, g, send, next: t + 0.12, bar: 0, I: this.inst(g) };
    },
    stopMusic(fade) {
      const cur = this.current;
      this.current = null;
      if (!cur || !this.ready) { this.pendingMusic = null; return; }
      const t = this.ctx.currentTime, f = fade || 1.4;
      cur.g.gain.cancelScheduledValues(t);
      cur.g.gain.setValueAtTime(cur.g.gain.value, t);
      cur.g.gain.linearRampToValueAtTime(0, t + f);
      setTimeout(() => { try { cur.g.disconnect(); cur.send.disconnect(); } catch (e) { /* já desconectado */ } }, (f + 4) * 1000);
    },
    tick() {
      const cur = this.current;
      if (!cur) return;
      const ctx = this.ctx;
      const spb = 60 / cur.def.bpm;
      while (cur.next < ctx.currentTime + 0.3) {
        const chords = cur.def.chords;
        const ch = chords[cur.bar % chords.length];
        try { cur.def.bar(cur.I, cur.next, cur.bar, ch, spb); } catch (e) { console.error(e); }
        cur.next += spb * cur.def.beats;
        cur.bar++;
      }
    },

    /* ----------------------------------------------------- ambientes */
    amb(name) {
      if (!this.ready) { this.pendingAmb = name; return; }
      if (this.ambState && this.ambState.name === name) return;
      const old = this.ambState;
      if (old) {
        const t = this.ctx.currentTime;
        old.g.gain.setTargetAtTime(0, t, 0.5);
        setTimeout(() => { old.nodes.forEach((n) => { try { n.stop(); } catch (e) { /* ok */ } }); try { old.g.disconnect(); } catch (e) { /* ok */ } }, 3000);
        clearInterval(old.timer);
      }
      this.ambState = null;
      if (!name || name === 'stop' || !AMB[name]) return;
      const g = this.gain(0);
      g.connect(this.ambBus);
      g.gain.setTargetAtTime(1, this.ctx.currentTime, 0.8);
      const st = { name, g, nodes: [], timer: 0 };
      AMB[name](this, st);
      this.ambState = st;
    },
    loopNoise(st, type, freq, q, vel) {
      const s = this.noiseSrc(), fl = this.filt(type, freq, q), g = this.gain(vel);
      s.connect(fl).connect(g).connect(st.g);
      s.start(0, Math.random() * 2);
      st.nodes.push(s);
      return { s, fl, g };
    },
    lfo(param, rate, depth, nodes) {
      const o = this.osc('sine', rate), g = this.gain(depth);
      o.connect(g).connect(param); o.start(); nodes.push(o);
    },

    /* ------------------------------------------------------- efeitos */
    sfx(name) {
      if (!this.ready) return;
      const fn = SFX[name];
      if (fn) fn(this, this.ctx.currentTime + 0.01, this.inst(this.sfxBus));
    },
  };

  /* ===================================================== TRILHAS */
  const ch = (b, n) => ({ b, n });
  const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const TRACKS = {
    // caixinha de música para o início
    titulo: {
      bpm: 84, beats: 3, reverb: 0.55, gain: 0.9,
      chords: [ch(41, [65, 69, 72]), ch(38, [62, 65, 69]), ch(46, [62, 65, 70]), ch(36, [60, 64, 67]), ch(41, [65, 69, 72]), ch(38, [62, 65, 69]), ch(46, [62, 65, 70]), ch(36, [60, 64, 67])],
      mel: [
        [[0, 72, 2], [2, 69, 1], [3, 72, 1], [4, 77, 2]], [[0, 76, 2], [2, 74, 1], [3, 72, 1], [4, 69, 2]],
        [[0, 74, 2], [2, 72, 1], [3, 70, 1], [4, 77, 2]], [[0, 76, 3], [3, 79, 1], [4, 76, 1], [5, 72, 1]],
        [[0, 81, 2], [2, 79, 1], [3, 77, 1], [4, 72, 2]], [[0, 74, 2], [2, 77, 1], [3, 81, 1], [4, 79, 2]],
        [[0, 77, 2], [2, 74, 1], [3, 70, 1], [4, 72, 2]], [[0, 77, 4]],
      ],
      bar(I, t, i, c, spb) {
        const e = spb / 2;
        I.bass(t, c.b + 12, spb * 2.5, 0.12);
        I.pad(t, c.n.map((m) => m - 12), spb * 3, 0.025, 900);
        for (const [o, m, d] of this.mel[i % 8]) I.box(t + o * e, m + 12, 0.07 * (d > 1 ? 1 : 0.85));
        I.box(t + spb, c.n[1] + 24, 0.02); I.box(t + spb * 2, c.n[2] + 24, 0.02);
      },
    },
    // dia a dia na academia
    cotidiano: {
      bpm: 96, beats: 4, reverb: 0.3,
      chords: [ch(38, [62, 66, 69]), ch(45, [61, 64, 69]), ch(47, [62, 66, 71]), ch(43, [62, 67, 71])],
      bar(I, t, i, c, spb) {
        const e = spb / 2;
        const pat = [0, 1, 2, 1, 0, 1, 2, 3];
        const notes = c.n.concat([c.n[0] + 12]);
        pat.forEach((k, j) => I.pluck(t + j * e, notes[k], e, 0.07 + (j % 2 ? 0 : 0.02)));
        I.bass(t, c.b, spb * 1.6, 0.16); I.bass(t + spb * 2, c.b + (i % 2 ? 7 : 0), spb * 1.6, 0.13);
        for (let j = 0; j < 4; j++) I.hat(t + j * spb + e, 0.018);
        if (i % 2 === 1) { const m = rnd(c.n) + 12; I.bell(t + spb * rnd([0, 1, 2]), m, 0.03, 2.2); }
      },
    },
    // Admire Vega: etéreo, estrelas
    vega: {
      bpm: 64, beats: 4, reverb: 0.7, gain: 0.95,
      chords: [ch(45, [57, 59, 60, 64]), ch(41, [53, 57, 60, 64]), ch(48, [55, 60, 64, 67]), ch(43, [55, 60, 62, 67])],
      bar(I, t, i, c, spb) {
        I.pad(t, c.n, spb * 4, 0.04, 950);
        I.bass(t, c.b - 12, spb * 3.5, 0.1);
        c.n.forEach((m, j) => I.piano(t + j * spb, m + 12, spb, 0.06 - j * 0.006));
        const stars = [81, 84, 86, 88, 91, 93];
        for (let k = 0; k < 2; k++) if (Math.random() < 0.7) I.bell(t + spb * (Math.floor(Math.random() * 8) / 2), rnd(stars), 0.022, 3.6);
      },
    },
    // Vega, momentos de esperança
    vega_luz: {
      bpm: 72, beats: 4, reverb: 0.6,
      chords: [ch(41, [57, 60, 65]), ch(48, [55, 60, 64]), ch(43, [55, 59, 62]), ch(45, [57, 60, 64])],
      mel: [[76, 74, 72], [72, 74, 76], [74, 71, 67], [72, 76, 79]],
      bar(I, t, i, c, spb) {
        const e = spb / 2;
        I.pad(t, c.n, spb * 4, 0.035, 1200);
        I.bass(t, c.b, spb * 3, 0.13);
        [0, 1, 2, 1, 2, 1, 0, 1].forEach((k, j) => I.piano(t + j * e, c.n[k] + 12, e, 0.045));
        if (i >= 4) this.mel[i % 4].forEach((m, j) => I.bell(t + j * spb * 1.33, m + 12, 0.03, 2.6));
      },
    },
    // Loves Only You: pop alegre
    loves: {
      bpm: 116, beats: 4, reverb: 0.22,
      chords: [ch(41, [57, 60, 65]), ch(48, [55, 60, 64]), ch(50, [57, 62, 65]), ch(46, [58, 62, 65])],
      hook: [
        [[0, 72], [2, 69], [3, 72], [4, 77], [6, 76], [7, 77]], [[0, 79], [2, 76], [4, 72], [5, 74], [6, 76]],
        [[0, 77], [2, 74], [3, 77], [4, 81], [6, 79], [7, 77]], [[0, 74], [2, 77], [4, 76]],
      ],
      bar(I, t, i, c, spb) {
        const e = spb / 2, s = spb / 4;
        I.kick(t, 0.32); I.kick(t + spb * 2, 0.32); if (i % 2) I.kick(t + spb * 2.5, 0.2);
        I.clap(t + spb, 0.09); I.clap(t + spb * 3, 0.09);
        for (let j = 0; j < 8; j++) I.hat(t + j * e, j % 2 ? 0.025 : 0.014);
        [0, 0, 12, 0, 0, 12, 0, 7].forEach((o, j) => I.bass(t + j * e, c.b + o, e * 0.8, 0.11));
        const up = c.n.concat([c.n[0] + 12, c.n[1] + 12]);
        for (let j = 0; j < 16; j++) I.pluck(t + j * s, up[[0, 1, 2, 3, 4, 3, 2, 1][j % 8]] + 12, s, 0.022);
        if (i % 8 >= 4) for (const [o, m] of this.hook[i % 4]) I.bell(t + o * e, m + 12, 0.045, 1.2, 2.0);
      },
    },
    loves_calmo: {
      bpm: 84, beats: 4, reverb: 0.4,
      chords: [ch(41, [57, 60, 65]), ch(48, [55, 60, 64]), ch(50, [57, 62, 65]), ch(46, [58, 62, 65])],
      bar(I, t, i, c, spb) {
        const e = spb / 2;
        I.pad(t, c.n, spb * 4, 0.03, 1100);
        I.bass(t, c.b, spb * 2, 0.12); I.bass(t + spb * 2, c.b, spb * 2, 0.1);
        [0, 1, 2, 1, 0, 2, 1, 2].forEach((k, j) => I.pluck(t + j * e, c.n[k] + 12, e, 0.05));
        if (Math.random() < 0.6) I.bell(t + spb * rnd([1, 2, 3]), rnd(c.n) + 24, 0.025, 2.4, 2.0);
      },
    },
    // Still in Love: valsa de jazz de cafeteria
    still: {
      bpm: 92, beats: 3, reverb: 0.4,
      chords: [ch(43, [58, 62, 65, 69]), ch(48, [58, 62, 64, 67]), ch(41, [57, 60, 64, 69]), ch(46, [57, 62, 65, 70]), ch(39, [55, 58, 62, 63]), ch(45, [57, 60, 63, 67]), ch(38, [54, 57, 60, 62]), ch(43, [55, 58, 62, 64])],
      bar(I, t, i, c, spb) {
        I.bass(t, c.b, spb * 0.9, 0.17); I.bass(t + spb * 2, c.b + 7, spb * 0.8, 0.1);
        c.n.forEach((m) => I.rhodes(t + spb, m, spb * 0.5, 0.03));
        c.n.forEach((m) => I.rhodes(t + spb * 2, m, spb * 0.4, 0.022));
        I.brush(t + spb, 0.03); I.brush(t + spb * 2, 0.025); I.hat(t, 0.01);
        if (Math.random() < 0.75) I.rhodes(t + spb * rnd([0, 0.5, 1.5]), rnd(c.n) + 12, spb, 0.045);
      },
    },
    // o lado que a Still teme
    still_sombra: {
      bpm: 60, beats: 4, reverb: 0.6,
      chords: [ch(38, [38, 45, 50, 51, 57]), ch(38, [38, 45, 50, 51, 56])],
      bar(I, t, i, c, spb) {
        I.pad(t, c.n, spb * 4, 0.06, 520);
        I.kick(t, 0.38); I.kick(t + 0.28, 0.26);
        I.kick(t + spb * 2, 0.32); I.kick(t + spb * 2 + 0.28, 0.22);
        if (Math.random() < 0.45) I.bell(t + spb * rnd([1, 2, 3]), rnd([74, 80, 81, 86]), 0.025, 3.5, 1.41);
        if (Math.random() < 0.3) I.swell(t + spb * 2, spb * 2, 0.05);
      },
    },
    // corrida: tensão crescente
    corrida: {
      bpm: 150, beats: 4, reverb: 0.2,
      chords: [ch(40, [64, 67, 71]), ch(36, [64, 67, 72]), ch(38, [62, 66, 69]), ch(35, [63, 66, 71])],
      bar(I, t, i, c, spb) {
        const e = spb / 2, s = spb / 4;
        for (let j = 0; j < 4; j++) I.kick(t + j * spb, 0.34);
        I.clap(t + spb, 0.1); I.clap(t + spb * 3, 0.1);
        for (let j = 0; j < 16; j++) I.hat(t + j * s, j % 4 === 2 ? 0.03 : 0.014);
        for (let j = 0; j < 8; j++) I.bass(t + j * e, c.b + (j % 2 ? 12 : 0), e * 0.8, 0.12);
        const ost = [c.n[2] + 12, c.n[0] + 12, c.n[1], c.n[0] + 12];
        for (let j = 0; j < 16; j++) I.pluck(t + j * s, ost[j % 4], s, 0.022);
        I.pad(t, c.n, spb * 4, 0.025, 2000);
        I.brass(t, c.n.map((m) => m - 12), spb * 0.7, 0.05);
        if (i % 4 === 3) I.brass(t + spb * 3.5, c.n, spb * 0.4, 0.05);
      },
    },
    // vitória
    vitoria: {
      bpm: 112, beats: 4, reverb: 0.4,
      chords: [ch(36, [60, 64, 67]), ch(41, [60, 65, 69]), ch(43, [62, 67, 71]), ch(36, [64, 67, 72])],
      bar(I, t, i, c, spb) {
        const e = spb / 2;
        I.brass(t, c.n, spb * 1.2, 0.07); I.brass(t + spb * 1.5, c.n, spb * 0.4, 0.05); I.brass(t + spb * 2, c.n.map((m) => m + 12), spb * 1.8, 0.05);
        I.bass(t, c.b, spb * 2, 0.16); I.bass(t + spb * 2, c.b + 7, spb * 2, 0.12);
        c.n.concat([c.n[0] + 12]).forEach((m, j) => I.bell(t + j * e * 0.5, m + 12, 0.035, 1.8, 2.0));
        for (let j = 0; j < 8; j++) I.hat(t + j * e, 0.016);
        I.kick(t, 0.3); I.kick(t + spb * 2, 0.24);
        if (i % 4 === 3) for (let j = 0; j < 6; j++) I.tom(t + spb * 3 + j * (spb / 6), 41 + j, 0.14);
      },
    },
    // tristeza
    triste: {
      bpm: 58, beats: 4, reverb: 0.6,
      chords: [ch(40, [52, 55, 59, 64]), ch(36, [52, 55, 59, 60]), ch(43, [50, 55, 59, 62]), ch(42, [50, 54, 57, 62])],
      bar(I, t, i, c, spb) {
        const e = spb / 2;
        I.pad(t, c.n, spb * 4, 0.03, 800);
        I.bass(t, c.b, spb * 3.5, 0.11);
        [0, 1, 2, 3, 2, 1, 2, 3].forEach((k, j) => I.piano(t + j * e, c.n[k] + 12, e, 0.04));
      },
    },
    // noite tranquila
    noite: {
      bpm: 56, beats: 4, reverb: 0.7,
      chords: [ch(38, [57, 61, 64, 66]), ch(43, [57, 59, 62, 66])],
      bar(I, t, i, c, spb) {
        I.pad(t, c.n, spb * 4, 0.035, 900);
        I.bass(t, c.b, spb * 3.6, 0.09);
        const pent = [74, 76, 78, 81, 83, 86];
        for (let k = 0; k < 3; k++) if (Math.random() < 0.55) I.bell(t + spb * (Math.floor(Math.random() * 8) / 2), rnd(pent), 0.02, 3.4);
      },
    },
    // suspense
    tensao: {
      bpm: 76, beats: 4, reverb: 0.5,
      chords: [ch(35, [47, 54, 59, 60]), ch(35, [47, 54, 59, 62])],
      bar(I, t, i, c, spb) {
        const e = spb / 2;
        I.pad(t, c.n, spb * 4, 0.045, 600);
        for (let j = 0; j < 8; j++) I.pluck(t + j * e, c.b + 12, e, 0.03 + (j === 0 ? 0.03 : 0));
        if (Math.random() < 0.5) I.bell(t + spb * rnd([1, 2, 3]), rnd([83, 84, 89]), 0.018, 2.8, 1.41);
      },
    },
  };

  // Mejiro Dober: piano delicado com celesta
  TRACKS.dober = {
    bpm: 76, beats: 4, reverb: 0.5,
    chords: [ch(46, [58, 62, 65, 69]), ch(43, [55, 58, 62, 65]), ch(39, [55, 58, 62, 63]), ch(41, [57, 60, 65, 69])],
    mel: [[77, 74, 72, 74], [70, 72, 74, 77], [79, 77, 75, 74], [72, 69, 70, 72]],
    bar(I, t, i, c, spb) {
      const e = spb / 2;
      I.pad(t, c.n, spb * 4, 0.03, 1000);
      I.bass(t, c.b, spb * 2, 0.12); I.bass(t + spb * 2, c.b + 7, spb * 2, 0.09);
      [0, 2, 1, 3, 2, 1, 3, 2].forEach((k, j) => I.piano(t + j * e, c.n[k] + 12, e, 0.04));
      if (i % 8 >= 4) this.mel[i % 4].forEach((m, j) => I.box(t + j * spb, m + 12, 0.04));
    },
  };
  // Mejiro Ramonu: valsa elegante em ré menor, com arpejos de harpa
  TRACKS.ramonu = {
    bpm: 84, beats: 3, reverb: 0.55,
    chords: [ch(38, [62, 65, 69]), ch(46, [62, 65, 70]), ch(43, [62, 67, 70]), ch(45, [61, 64, 69]), ch(38, [62, 65, 69]), ch(41, [60, 65, 69]), ch(43, [58, 62, 67]), ch(45, [61, 64, 67])],
    bar(I, t, i, c, spb) {
      const s = spb / 4;
      I.bass(t, c.b, spb * 2.6, 0.13);
      I.pad(t, c.n.map((m) => m - 12), spb * 3, 0.03, 900);
      const up = c.n.concat(c.n.map((m) => m + 12));
      for (let j = 0; j < 12; j++) I.pluck(t + j * s, up[j % up.length] + 12, s * 2, 0.028 + (j % 4 === 0 ? 0.015 : 0));
      if (Math.random() < 0.6) I.bell(t + spb * rnd([1, 2]), rnd(c.n) + 24, 0.025, 2.4, 2.0);
    },
  };

  /* ===================================================== AMBIENTES */
  const AMB = {
    chuva(a, st) { a.loopNoise(st, 'lowpass', 5200, 0.3, 0.32); a.loopNoise(st, 'highpass', 2500, 0.2, 0.06); },
    chuva_dentro(a, st) { a.loopNoise(st, 'lowpass', 1300, 0.4, 0.28); },
    cafe_chuva(a, st) { a.loopNoise(st, 'lowpass', 1300, 0.4, 0.22); AMB.cafe(a, st); },
    vento(a, st) { const n = a.loopNoise(st, 'bandpass', 420, 0.8, 0.12); a.lfo(n.fl.frequency, 0.08, 160, st.nodes); a.lfo(n.g.gain, 0.11, 0.06, st.nodes); },
    vazio(a, st) { const n = a.loopNoise(st, 'bandpass', 260, 1.2, 0.12); a.lfo(n.fl.frequency, 0.05, 90, st.nodes); },
    noite(a, st) {
      AMB.vento(a, st);
      st.timer = setInterval(() => {
        if (Math.random() < 0.6) {
          const t = a.ctx.currentTime;
          const f = 4200 + Math.random() * 600;
          for (let k = 0; k < 3; k++) {
            const o = a.osc('sine', f), g = a.gain(0);
            g.gain.setValueAtTime(0.0001, t + k * 0.07);
            g.gain.exponentialRampToValueAtTime(0.012, t + k * 0.07 + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.07 + 0.05);
            o.connect(g).connect(st.g); o.start(t + k * 0.07); o.stop(t + k * 0.07 + 0.06);
          }
        }
      }, 700);
    },
    passaros(a, st) {
      AMB.vento(a, st);
      st.timer = setInterval(() => {
        if (Math.random() < 0.45) {
          const t = a.ctx.currentTime, n = 2 + Math.floor(Math.random() * 3);
          const base = 2200 + Math.random() * 1600;
          for (let k = 0; k < n; k++) {
            const o = a.osc('sine', base), g = a.gain(0), t0 = t + k * 0.13;
            o.frequency.setValueAtTime(base, t0);
            o.frequency.exponentialRampToValueAtTime(base * (1.3 + Math.random() * 0.4), t0 + 0.08);
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.exponentialRampToValueAtTime(0.02, t0 + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
            o.connect(g).connect(st.g); o.start(t0); o.stop(t0 + 0.12);
          }
        }
      }, 1100);
    },
    fonte(a, st) { const n = a.loopNoise(st, 'bandpass', 1400, 0.6, 0.12); a.lfo(n.fl.frequency, 3.1, 300, st.nodes); AMB.passaros(a, st); },
    rio(a, st) { a.loopNoise(st, 'lowpass', 900, 0.5, 0.14); },
    mar(a, st) { const n = a.loopNoise(st, 'lowpass', 700, 0.4, 0.14); a.lfo(n.g.gain, 0.12, 0.12, st.nodes); a.lfo(n.fl.frequency, 0.12, 300, st.nodes); },
    torcida(a, st) {
      const n = a.loopNoise(st, 'bandpass', 700, 0.5, 0.16); a.lfo(n.g.gain, 0.2, 0.05, st.nodes);
      a.loopNoise(st, 'bandpass', 1600, 0.8, 0.05);
    },
    live(a, st) { AMB.torcida(a, st); },
    cafe(a, st) {
      const n = a.loopNoise(st, 'bandpass', 500, 0.9, 0.07); a.lfo(n.g.gain, 0.3, 0.03, st.nodes);
      st.timer = st.timer || setInterval(() => {
        if (Math.random() < 0.3) { const t = a.ctx.currentTime; const o = a.osc('sine', 2600 + Math.random() * 1600), g = a.gain(0); g.gain.setValueAtTime(0.012, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4); o.connect(g).connect(st.g); o.start(t); o.stop(t + 0.45); }
      }, 1300);
    },
    rua(a, st) { const n = a.loopNoise(st, 'bandpass', 600, 0.8, 0.08); a.lfo(n.g.gain, 0.25, 0.03, st.nodes); },
    festival(a, st) {
      AMB.rua(a, st);
      st.timer = setInterval(() => {
        if (Math.random() < 0.4) { const inst = a.inst(st.g); const t = a.ctx.currentTime; inst.bell(t, 96 + Math.floor(Math.random() * 6), 0.012, 1.6, 5.2); }
      }, 900);
    },
    sala(a, st) { a.loopNoise(st, 'lowpass', 300, 0.3, 0.025); },
    corredor(a, st) { a.loopNoise(st, 'lowpass', 400, 0.3, 0.03); },
    biblioteca(a, st) { a.loopNoise(st, 'lowpass', 250, 0.3, 0.02); },
    aeroporto(a, st) {
      a.loopNoise(st, 'lowpass', 220, 0.5, 0.06);
      const o = a.osc('sine', 110), g = a.gain(0.012); o.connect(g).connect(st.g); o.start(); st.nodes.push(o);
    },
  };

  /* ===================================================== EFEITOS */
  const SFX = {
    click(a, t, I) { I.pluck(t, 84, 0.05, 0.05); },
    hover(a, t, I) { I.pluck(t, 91, 0.03, 0.018); },
    confirmar(a, t, I) { I.bell(t, 81, 0.06, 0.8, 2.0); I.bell(t + 0.09, 88, 0.06, 1.0, 2.0); },
    voltar(a, t, I) { I.bell(t, 84, 0.05, 0.6, 2.0); I.bell(t + 0.08, 77, 0.05, 0.8, 2.0); },
    // bolha estourando: o chibi da tela inicial trocando de pose
    pop(a, t) {
      const o = a.osc('sine', 520), g = a.gain(0);
      o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(1350, t + 0.08);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(g).connect(a.sfxBus); o.start(t); o.stop(t + 0.13);
    },
    // "pyon!": o pulinho do chibi ao escolher, o pouso e os sininhos de confirmação
    pulo(a, t, I) {
      const t0 = t + 0.1;
      const o = a.osc('triangle', 330), o2 = a.osc('sine', 660), g = a.gain(0), g2 = a.gain(0.3);
      o.frequency.setValueAtTime(330, t0); o.frequency.exponentialRampToValueAtTime(1050, t0 + 0.16);
      o2.frequency.setValueAtTime(660, t0); o2.frequency.exponentialRampToValueAtTime(2100, t0 + 0.16);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.11, t0 + 0.025); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      o.connect(g); o2.connect(g2).connect(g); g.connect(a.sfxBus);
      o.start(t0); o2.start(t0); o.stop(t0 + 0.24); o2.stop(t0 + 0.24);
      I.pluck(t + 0.54, 72, 0.06, 0.05);
      I.bell(t + 0.58, 81, 0.05, 0.8, 2.0); I.bell(t + 0.67, 88, 0.05, 1.0, 2.0);
    },
    // sinal da escola (quartos de Westminster)
    sino(a, t, I) { [64, 60, 62, 55, 55, 62, 64, 60].forEach((m, k) => I.bell(t + k * 0.62 + (k >= 4 ? 0.5 : 0), m + 12, 0.07, 3.0, 2.4)); },
    coracao(a, t, I) { I.kick(t, 0.5); I.kick(t + 0.26, 0.36); },
    portao(a, t, I) {
      const s = a.noiseSrc(), fl = a.filt('bandpass', 2400, 3), g = a.gain(0);
      g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      s.connect(fl).connect(g).connect(a.sfxBus); s.start(t); s.stop(t + 0.55);
      I.tom(t, 40, 0.4); I.bell(t, 70, 0.05, 0.7, 7.1);
    },
    torcida(a, t) {
      const s = a.noiseSrc(), fl = a.filt('bandpass', 900, 0.4), g = a.gain(0);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
      s.connect(fl).connect(g).connect(a.sfxBus); s.start(t); s.stop(t + 4.6);
    },
    aplausos(a, t) {
      for (let k = 0; k < 140; k++) {
        const t0 = t + Math.random() * 2.6;
        const s = a.noiseSrc(), fl = a.filt('bandpass', 1200 + Math.random() * 1800, 1.2), g = a.gain(0);
        g.gain.setValueAtTime(0.06 * (1 - (t0 - t) / 3), t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
        s.connect(fl).connect(g).connect(a.sfxBus); s.start(t0, Math.random()); s.stop(t0 + 0.06);
      }
    },
    miau(a, t) {
      const o = a.osc('sawtooth', 600), fl = a.filt('bandpass', 1400, 4), g = a.gain(0);
      o.frequency.setValueAtTime(560, t); o.frequency.linearRampToValueAtTime(820, t + 0.18); o.frequency.linearRampToValueAtTime(480, t + 0.55);
      fl.frequency.setValueAtTime(900, t); fl.frequency.linearRampToValueAtTime(2000, t + 0.2); fl.frequency.linearRampToValueAtTime(1000, t + 0.55);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t + 0.06); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(fl).connect(g).connect(a.sfxBus); o.start(t); o.stop(t + 0.62);
    },
    notificacao(a, t, I) { I.bell(t, 88, 0.05, 0.4, 2.0); I.bell(t + 0.07, 93, 0.05, 0.5, 2.0); },
    obturador(a, t) {
      const s = a.noiseSrc(), fl = a.filt('highpass', 2000), g = a.gain(0);
      g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      g.gain.setValueAtTime(0.2, t + 0.09); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      s.connect(fl).connect(g).connect(a.sfxBus); s.start(t); s.stop(t + 0.16);
    },
    pagina(a, t) {
      const s = a.noiseSrc(), fl = a.filt('bandpass', 1800, 0.6), g = a.gain(0);
      fl.frequency.setValueAtTime(800, t); fl.frequency.exponentialRampToValueAtTime(4000, t + 0.25);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      s.connect(fl).connect(g).connect(a.sfxBus); s.start(t); s.stop(t + 0.32);
    },
    porta(a, t) {
      const s = a.noiseSrc(), fl = a.filt('lowpass', 500), g = a.gain(0);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      s.connect(fl).connect(g).connect(a.sfxBus); s.start(t); s.stop(t + 0.62);
    },
    impacto(a, t, I) { I.kick(t, 0.7); I.tom(t, 33, 0.4); SFX.glitch(a, t); },
    glitch(a, t) {
      for (let k = 0; k < 8; k++) {
        const t0 = t + k * 0.045;
        const o = a.osc('square', 80 + Math.random() * 1600), g = a.gain(0);
        g.gain.setValueAtTime(0.05, t0); g.gain.setValueAtTime(0, t0 + 0.035);
        o.connect(g).connect(a.sfxBus); o.start(t0); o.stop(t0 + 0.04);
      }
    },
    brilho(a, t, I) { [84, 88, 91, 96, 100].forEach((m, k) => I.bell(t + k * 0.06, m, 0.035, 1.4, 2.0)); },
    trovao(a, t) {
      const s = a.noiseSrc(), fl = a.filt('lowpass', 180), g = a.gain(0);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.7, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
      s.connect(fl).connect(g).connect(a.sfxBus); s.start(t); s.stop(t + 3.6);
    },
    passos(a, t, I) { for (let k = 0; k < 4; k++) I.tom(t + k * 0.32, 45, 0.08); },
    /* ---- Tracking System (corridas vistas de cima) */
    // recorte da personagem entrando na tela
    tk_cutin(a, t) {
      const s = a.noiseSrc(), fl = a.filt('bandpass', 700, 1.1), g = a.gain(0);
      fl.frequency.setValueAtTime(500, t); fl.frequency.exponentialRampToValueAtTime(3600, t + 0.22);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.13, t + 0.06); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      s.connect(fl).connect(g).connect(a.sfxBus); s.start(t, Math.random()); s.stop(t + 0.32);
    },
    // faixa grande ("RETA FINAL!")
    tk_faixa(a, t, I) { SFX.tk_cutin(a, t); I.kick(t + 0.05, 0.42); I.brass(t + 0.06, [62, 69, 74], 0.32, 0.075); },
    // trombada / passagem fechada
    tk_tranco(a, t, I) {
      I.kick(t, 0.5);
      const s = a.noiseSrc(), fl = a.filt('lowpass', 900), g = a.gain(0);
      g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      s.connect(fl).connect(g).connect(a.sfxBus); s.start(t, Math.random()); s.stop(t + 0.2);
    },
    // arrancada ("!!")
    tk_brilho(a, t, I) { [79, 84, 88, 91, 96].forEach((m, k) => I.bell(t + k * 0.045, m, 0.04, 1.1, 2.0)); I.kick(t, 0.3); },
    // lâmpada de inquérito do placar
    tk_inquerito(a, t) {
      for (let k = 0; k < 4; k++) {
        const t0 = t + k * 0.32, o = a.osc('square', k % 2 ? 440 : 554), fl = a.filt('lowpass', 1800), g = a.gain(0);
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.045, t0 + 0.02); g.gain.setValueAtTime(0.045, t0 + 0.24); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
        o.connect(fl).connect(g).connect(a.sfxBus); o.start(t0); o.stop(t0 + 0.31);
      }
    },
    // resultado confirmado
    tk_placar(a, t, I) { I.bell(t, 84, 0.06, 1.2, 2.0); I.bell(t + 0.13, 91, 0.06, 1.6, 2.0); },
    ding(a, t, I) { I.bell(t, 79, 0.06, 1.8, 2.0); I.bell(t + 0.5, 75, 0.06, 2.2, 2.0); },
  };

  VN.Audio = A;
  VN.Audio.TRACKS = TRACKS;
  VN.Audio.AMB = AMB;
  VN.Audio.SFX = SFX;
})();
