/*
 * Tierra de los Humos · Sonido ambiente generado por código (Web Audio)
 * ---------------------------------------------------------------------
 * No usa archivos de audio: todo se sintetiza en el momento a partir de ruido
 * y osciladores. Ventajas: pesa ~10 KB, anda sin internet, no hay licencias de
 * terceros que registrar, y el sonido responde al estado del juego.
 *
 * Qué suena:
 *   Ambiente (continuo):  viento · mar · lluvia · fuego (crepitar según el nivel 0 a 4)
 *   Efectos (una vez):    remo · ola · lena · comida · saber · apagado · generacion
 *
 * Qué NO suena, a propósito: música o cantos "indígenas" inventados. Los cantos
 * yaganes son patrimonio de la comunidad; no se imitan. Tampoco hay voces.
 *
 * Uso:
 *   <script src="sonido/ambiente.js"></script>
 *   const sonido = TDH_SONIDO.crear();
 *   boton.onclick = () => sonido.iniciar();          // el navegador exige un toque/click primero
 *   sonido.ambiente({ viento: 0.3, mar: 0.6, lluvia: 0, fuego: 3 });   // valores de 0 a 1 (fuego de 0 a 4)
 *   sonido.efecto('remo');
 *   sonido.volumen(0.8); sonido.silenciar(true);
 *
 * Licencia: código MIT; los sonidos que produce, CC BY-SA 4.0.
 */
(function (raiz) {
  'use strict';

  function crear(opciones) {
    const op = Object.assign({ volumen: 0.8 }, opciones || {});
    let ctx = null, maestro = null, iniciado = false, reloj = null;
    const capas = {};
    const objetivo = { viento: 0, mar: 0.5, lluvia: 0, fuego: 3 };
    let silenciado = false, volumenActual = op.volumen;
    const oyentes = []; // para "subtítulos" de sonido (accesibilidad)

    // ── Ruidos base ─────────────────────────────────────────────────────
    function bufferRuido(tipo, segundos) {
      const n = Math.floor(ctx.sampleRate * (segundos || 3));
      const buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, ultimo = 0;
      for (let i = 0; i < n; i++) {
        const w = Math.random() * 2 - 1;
        if (tipo === 'blanco') d[i] = w;
        else if (tipo === 'rosa') { // Paul Kellet
          b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
          b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
        } else { ultimo = (ultimo + 0.02 * w) / 1.02; d[i] = ultimo * 3.5; } // marrón
      }
      return buf;
    }
    let ruidos = null;
    function fuenteRuido(tipo) {
      const s = ctx.createBufferSource();
      s.buffer = ruidos[tipo]; s.loop = true;
      s.loopStart = Math.random() * 1; // que las capas no suenen en fase
      s.start(0, Math.random() * 2);
      return s;
    }
    function filtro(tipo, frecuencia, q) { const f = ctx.createBiquadFilter(); f.type = tipo; f.frequency.value = frecuencia; f.Q.value = q || 0.7; return f; }
    function ganancia(v) { const g = ctx.createGain(); g.gain.value = v || 0; return g; }
    function cadena(...nodos) { for (let i = 0; i < nodos.length - 1; i++) nodos[i].connect(nodos[i + 1]); return nodos[nodos.length - 1]; }
    const ahora = () => ctx.currentTime;
    const suave = (param, valor, tiempo) => param.setTargetAtTime(valor, ahora(), tiempo || 0.8);

    // ── Capas de ambiente ───────────────────────────────────────────────
    function armarCapas() {
      // Viento: ruido rosa por un pasabanda que se mueve con las ráfagas.
      capas.vientoFiltro = filtro('bandpass', 500, 0.9);
      capas.vientoSilbido = filtro('bandpass', 900, 9);
      capas.viento = ganancia(0);
      capas.vientoSilbidoGan = ganancia(0);
      cadena(fuenteRuido('rosa'), capas.vientoFiltro, capas.viento, maestro);
      cadena(fuenteRuido('blanco'), capas.vientoSilbido, capas.vientoSilbidoGan, maestro);

      // Mar: ruido marrón con un vaivén lento (cada 7 a 9 segundos sube y baja).
      capas.marFiltro = filtro('lowpass', 520, 0.5);
      capas.mar = ganancia(0);
      const vaiven = ctx.createOscillator(); vaiven.frequency.value = 0.12;
      const vaivenGan = ganancia(0.35);
      capas.marModulo = ganancia(0.6);
      cadena(fuenteRuido('marron'), capas.marFiltro, capas.marModulo, capas.mar, maestro);
      vaiven.connect(vaivenGan); vaivenGan.connect(capas.marModulo.gain); vaiven.start();

      // Lluvia: ruido blanco agudo y suave.
      capas.lluvia = ganancia(0);
      cadena(fuenteRuido('blanco'), filtro('highpass', 1800, 0.5), filtro('lowpass', 9000, 0.5), capas.lluvia, maestro);

      // Fuego: un rumor grave constante (el crepitar se agrega como eventos).
      capas.fuego = ganancia(0);
      cadena(fuenteRuido('marron'), filtro('lowpass', 180, 0.7), capas.fuego, maestro);
      capas.fuegoSoplo = ganancia(0);
      cadena(fuenteRuido('rosa'), filtro('bandpass', 1200, 0.6), capas.fuegoSoplo, maestro);
    }

    // ── Eventos breves (crepitar, gotas, olas) ──────────────────────────
    function rafagaRuido(t, dur, { tipo = 'blanco', filtroTipo = 'bandpass', desde = 2000, hasta = null, q = 1, vol = 0.3, ataque = 0.002 } = {}) {
      const s = ctx.createBufferSource(); s.buffer = ruidos[tipo];
      const f = filtro(filtroTipo, desde, q);
      if (hasta) f.frequency.exponentialRampToValueAtTime(Math.max(40, hasta), t + dur);
      const g = ganancia(0);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + ataque);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      cadena(s, f, g, maestro);
      s.start(t, Math.random() * 2); s.stop(t + dur + 0.05);
    }
    function tono(t, frec, dur, vol, tipo) {
      const o = ctx.createOscillator(); o.type = tipo || 'sine'; o.frequency.value = frec;
      const g = ganancia(0);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      cadena(o, g, maestro); o.start(t); o.stop(t + dur + 0.05);
    }
    function crepitar(t, fuerza) {
      rafagaRuido(t, 0.015 + Math.random() * 0.04, { desde: 1500 + Math.random() * 3500, q: 2 + Math.random() * 4, vol: (0.05 + Math.random() * 0.25) * fuerza });
    }
    function gota(t) { rafagaRuido(t, 0.02, { desde: 2500 + Math.random() * 3000, q: 6, vol: 0.06 + Math.random() * 0.08 }); }
    function olaRompe(t, fuerza) {
      rafagaRuido(t, 1.8 + Math.random(), { tipo: 'rosa', filtroTipo: 'lowpass', desde: 2600, hasta: 300, q: 0.4, vol: 0.18 * fuerza, ataque: 0.35 });
    }

    // Reloj: cada 100 ms decide qué eventos suenan en los próximos 100 ms.
    let proximaOla = 0;
    function programar() {
      const t0 = ahora(), paso = 0.1;
      const f = objetivo.fuego;
      if (f > 0) {
        const porSegundo = [0, 1.2, 3, 5, 8][f];
        for (let i = 0; i < 3; i++) if (Math.random() < (porSegundo * paso) / 3) crepitar(t0 + Math.random() * paso, 0.6 + f * 0.1);
      }
      if (objetivo.lluvia > 0) {
        const gotas = Math.floor(objetivo.lluvia * 6 * Math.random());
        for (let i = 0; i < gotas; i++) gota(t0 + Math.random() * paso);
      }
      if (objetivo.mar > 0.15 && t0 > proximaOla) { olaRompe(t0, objetivo.mar); proximaOla = t0 + 5 + Math.random() * 6; }
      // Ráfagas de viento: el filtro y el volumen se mueven al azar, despacio.
      if (Math.random() < 0.08) {
        const v = objetivo.viento;
        const rafaga = v * (0.55 + Math.random() * 0.45);
        suave(capas.viento.gain, rafaga * 1.1, 0.6 + Math.random());
        suave(capas.vientoFiltro.frequency, 300 + v * 500 + Math.random() * 500 * v, 0.8);
        suave(capas.vientoSilbido.frequency, 700 + Math.random() * 700, 1.2);
        suave(capas.vientoSilbidoGan.gain, v > 0.6 ? (v - 0.6) * 0.12 * Math.random() : 0, 1);
      }
    }

    function aplicarAmbiente() {
      if (!iniciado) return;
      const o = objetivo;
      suave(capas.viento.gain, o.viento * 1.0, 1.2);
      suave(capas.vientoFiltro.frequency, 300 + o.viento * 600, 1.2);
      suave(capas.mar.gain, o.mar * 0.55, 1.5);
      suave(capas.marFiltro.frequency, 380 + o.mar * 400 + o.viento * 300, 1.5);
      suave(capas.lluvia.gain, o.lluvia * 0.12, 1.2);
      suave(capas.fuego.gain, [0, 0.12, 0.2, 0.28, 0.36][o.fuego] || 0, 0.8);
      suave(capas.fuegoSoplo.gain, [0, 0, 0.008, 0.016, 0.026][o.fuego] || 0, 0.8);
    }

    // ── Efectos ─────────────────────────────────────────────────────────
    const EFECTOS = {
      remo(t) { // la pala entra al agua y empuja
        rafagaRuido(t, 0.45, { tipo: 'rosa', desde: 900, hasta: 250, q: 0.8, vol: 0.35, ataque: 0.04 });
        rafagaRuido(t + 0.02, 0.18, { desde: 3500, hasta: 1800, q: 1.5, vol: 0.08 });
        return 'Remada';
      },
      ola(t) { olaRompe(t, 1); return 'Rompe una ola'; },
      lena(t) { // dos golpes de madera
        [0, 0.16].forEach((d, i) => { tono(t + d, 170 - i * 25, 0.18, 0.35, 'triangle'); rafagaRuido(t + d, 0.03, { desde: 2500, q: 2, vol: 0.2 }); });
        return 'Se agrega leña al fuego';
      },
      comida(t) { // valvas que chocan
        [0, 0.07, 0.15].forEach((d) => rafagaRuido(t + d, 0.04, { desde: 3200 + Math.random() * 1500, q: 8, vol: 0.18 }));
        return 'Se juntan mariscos';
      },
      saber(t) { // un golpe de madera resonante y su quinta: cálido, no "místico"
        const nota = (frec, d, vol) => { [1, 2.76, 5.4].forEach((p, i) => tono(t + d, frec * p, 1.6 / (i + 1), vol / (i * 1.8 + 1))); };
        nota(392, 0, 0.22); nota(587.3, 0.14, 0.16);
        return 'Aprendiste un saber';
      },
      apagado(t) { // el fuego se apaga: siseo que baja y un golpe sordo
        rafagaRuido(t, 1.8, { tipo: 'blanco', filtroTipo: 'highpass', desde: 5000, hasta: 600, q: 0.5, vol: 0.18, ataque: 0.05 });
        tono(t + 0.05, 70, 0.9, 0.3, 'sine');
        return 'El fuego se apagó';
      },
      generacion(t) { // comienzo de una nueva generación: un acorde grave que crece
        [98, 147, 196].forEach((f, i) => {
          const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
          const g = ganancia(0);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09 / (i + 1), t + 1.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
          cadena(o, g, maestro); o.start(t); o.stop(t + 4.6);
        });
        EFECTOS.saber(t + 1.2);
        return 'Comienza una nueva generación';
      },
    };

    // ── API pública ─────────────────────────────────────────────────────
    const api = {
      /** Llamar desde un click o toque. Devuelve una promesa. */
      async iniciar() {
        const AC = raiz.AudioContext || raiz.webkitAudioContext;
        if (!AC) return false;
        if (!ctx) {
          ctx = new AC();
          maestro = ganancia(silenciado ? 0 : volumenActual);
          // Un compresor suave evita picos cuando suenan muchas cosas juntas.
          const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
          maestro.connect(comp); comp.connect(ctx.destination);
          ruidos = { blanco: bufferRuido('blanco', 2), rosa: bufferRuido('rosa', 4), marron: bufferRuido('marron', 4) };
          armarCapas();
        }
        if (ctx.state === 'suspended') await ctx.resume();
        iniciado = true;
        aplicarAmbiente();
        if (!reloj) reloj = setInterval(programar, 100);
        return true;
      },
      /** Cambia el ambiente con transición suave. viento, mar, lluvia: 0 a 1 · fuego: 0 a 4. */
      ambiente(valores) { Object.assign(objetivo, valores || {}); objetivo.fuego = Math.max(0, Math.min(4, Math.round(objetivo.fuego))); aplicarAmbiente(); },
      /** Suena un efecto. Devuelve el texto de su subtítulo. */
      efecto(nombre) {
        if (!iniciado || !EFECTOS[nombre]) return null;
        const texto = EFECTOS[nombre](ahora() + 0.01);
        oyentes.forEach((fn) => fn(texto, nombre));
        return texto;
      },
      volumen(v) { volumenActual = Math.max(0, Math.min(1, v)); if (maestro && !silenciado) suave(maestro.gain, volumenActual, 0.1); },
      silenciar(si) { silenciado = !!si; if (maestro) suave(maestro.gain, silenciado ? 0 : volumenActual, 0.1); },
      /** Avisa cada vez que suena un efecto, para mostrar subtítulos en pantalla. */
      alSonar(fn) { oyentes.push(fn); },
      async pausar() { if (ctx) await ctx.suspend(); },
      get activo() { return iniciado && ctx && ctx.state === 'running'; },
      efectos: Object.keys(EFECTOS),
    };
    return api;
  }

  const modulo = { crear };
  if (typeof module !== 'undefined' && module.exports) module.exports = modulo;
  else raiz.TDH_SONIDO = modulo;
})(typeof window !== 'undefined' ? window : globalThis);
