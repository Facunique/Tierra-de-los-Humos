/*
 * Tierra de los Humos · Transiciones en estilo Corteza
 * ----------------------------------------------------
 * Recursos listos para la interfaz (Persona B). Cada función devuelve una promesa
 * que se cumple cuando termina la animación. Si el sistema pide "reducir movimiento",
 * todas se resuelven con un fundido corto o al instante.
 *
 *   await TDH_TRANSICIONES.humoCubre(contenedor);      // nubes de humo tapan la pantalla
 *   cambiarDePantalla();
 *   await TDH_TRANSICIONES.humoDescubre(contenedor);   // y se abren
 *
 *   await TDH_TRANSICIONES.pasoDelFuego(contenedor, { desde: 1, hasta: 2, saberes: ['El fuego viaja en la canoa'] });
 *   TDH_TRANSICIONES.cartaEntra(elementoCarta);         // la carta se despliega como un papel
 *
 * El paso del fuego es un recurso de juego: representa la herencia entre generaciones.
 * Requiere arte/fuente/arte.js y arte/corteza/corteza.js. Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const CZ = raiz.TDH_CORTEZA, ARTE = raiz.TDH_ARTE, C = ARTE.COLOR;
  const reducido = () => raiz.matchMedia && raiz.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rgba = CZ.rgba;
  const suave = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  function capa(contenedor) {
    const cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:40;pointer-events:none';
    if (getComputedStyle(contenedor).position === 'static') contenedor.style.position = 'relative';
    contenedor.appendChild(cv);
    const r = contenedor.getBoundingClientRect(), dpr = Math.min(2, raiz.devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr));
    const x = cv.getContext('2d'); x.scale(dpr, dpr);
    return { cv, x, W: r.width, H: r.height };
  }
  function animar(ms, paso) {
    return new Promise((ok) => {
      const t0 = performance.now();
      function cuadro(ahora) { const t = Math.min(1, (ahora - t0) / ms); paso(t); if (t < 1) requestAnimationFrame(cuadro); else ok(); }
      requestAnimationFrame(cuadro);
    });
  }
  // Nubes de humo fijas para una pantalla (posiciones al azar, pero repetibles)
  function nubesPara(W, H) {
    const n = [], paso = Math.max(60, Math.min(W, H) / 6);
    let s = 7;
    const azar = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let y = -paso / 2; y < H + paso; y += paso * 0.7) for (let x = -paso / 2; x < W + paso; x += paso * 0.7) n.push([x + (azar() - 0.5) * paso * 0.5, y + (azar() - 0.5) * paso * 0.5, paso * (0.6 + azar() * 0.4), azar()]);
    return n;
  }
  function pintarNubes(x, nubes, avance) { // avance 0..1: cuánto cubren
    x.fillStyle = rgba(C.A, 0.5); x.beginPath();
    nubes.forEach(([a, b, r, d]) => { const k = Math.max(0, Math.min(1, avance * 1.6 - d * 0.6)); if (k > 0) { x.moveTo(a + 6 + r * k, b + 10); x.arc(a + 6, b + 10, r * k, 0, Math.PI * 2); } }); x.fill();
    x.fillStyle = C.h; x.beginPath();
    nubes.forEach(([a, b, r, d]) => { const k = Math.max(0, Math.min(1, avance * 1.6 - d * 0.6)); if (k > 0) { x.moveTo(a + r * k, b); x.arc(a, b, r * k, 0, Math.PI * 2); } }); x.fill();
    x.fillStyle = C.H; x.beginPath();
    nubes.forEach(([a, b, r, d]) => { const k = Math.max(0, Math.min(1, avance * 1.6 - d * 0.6)); if (k > 0) { x.moveTo(a - r * 0.1 + r * 0.82 * k, b - r * 0.14); x.arc(a - r * 0.1, b - r * 0.14, r * 0.82 * k, 0, Math.PI * 2); } }); x.fill();
  }
  let capaHumo = null;
  /** Nubes de humo que tapan el contenedor. Deja la capa puesta hasta humoDescubre. */
  function humoCubre(contenedor, ms) {
    if (capaHumo) capaHumo.cv.remove();
    capaHumo = capa(contenedor); const { x, W, H } = capaHumo; capaHumo.nubes = nubesPara(W, H);
    if (reducido()) { x.fillStyle = C.h; x.fillRect(0, 0, W, H); return Promise.resolve(); }
    return animar(ms || 650, (t) => { x.clearRect(0, 0, W, H); pintarNubes(x, capaHumo.nubes, suave(t)); });
  }
  /** Las nubes se abren y desaparecen. */
  function humoDescubre(contenedor, ms) {
    if (!capaHumo) return Promise.resolve();
    const c = capaHumo; capaHumo = null;
    if (reducido()) { c.cv.remove(); return Promise.resolve(); }
    return animar(ms || 750, (t) => { c.x.clearRect(0, 0, c.W, c.H); pintarNubes(c.x, c.nubes, 1 - suave(t)); }).then(() => c.cv.remove());
  }

  /**
   * El paso del fuego: la brasa de la canoa que se apagó viaja hasta la canoa de la
   * generación siguiente, que se enciende. Los saberes heredados la acompañan.
   */
  function pasoDelFuego(contenedor, op) {
    op = Object.assign({ desde: 1, hasta: 2, saberes: [], ms: 5200 }, op || {});
    const c = capa(contenedor); const { x, W, H } = c;
    c.cv.style.pointerEvents = 'auto';
    const texto = document.createElement('div');
    texto.setAttribute('role', 'status');
    texto.style.cssText = 'position:absolute;left:0;right:0;bottom:12%;z-index:41;text-align:center;font:700 clamp(20px,4vw,34px)/1.2 "Atkinson Hyperlegible",system-ui,sans-serif;color:#eee5d0;text-shadow:0 2px 0 #0f1a21;opacity:0;transition:opacity .6s';
    texto.textContent = 'Lo aprendido pasa a la generación ' + op.hasta;
    contenedor.appendChild(texto);
    const s = Math.min(W, H) / 380;
    const A = [W * 0.22, H * 0.58], B = [W * 0.78, H * 0.58];
    const fin = () => { c.cv.remove(); texto.remove(); };
    if (reducido()) {
      x.fillStyle = C.n; x.fillRect(0, 0, W, H);
      CZ.canoa(x, B[0], B[1], s, 4, 1, -1, false); texto.style.opacity = 1;
      return new Promise((ok) => setTimeout(() => { fin(); ok(); }, 1600));
    }
    return animar(op.ms, (t) => {
      const tt = t * op.ms / 1000;
      x.clearRect(0, 0, W, H);
      // fondo: noche sobre el canal
      x.fillStyle = C.n; x.fillRect(0, 0, W, H);
      x.strokeStyle = rgba(C.E, 0.18); x.lineWidth = 2 * s; x.lineCap = 'round';
      for (let i = 0; i < 26; i++) { const a = ((i * 97) % W + tt * 12) % W, b = H * 0.45 + ((i * 53) % (H * 0.5)); x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + 8 * s, b - 3 * s, a + 16 * s, b); x.stroke(); }
      // 0 a 0,25: la canoa vieja con brasas que se apagan
      const fuegoViejo = t < 0.12 ? 1 : 0;
      CZ.canoa(x, A[0], A[1], s, fuegoViejo, tt, 1, false);
      // 0,15 a 0,7: la brasa viaja en arco, con los saberes detrás
      const k = Math.max(0, Math.min(1, (t - 0.15) / 0.55)), e = suave(k);
      if (t > 0.12 && t < 0.78) {
        const px = A[0] + (B[0] - A[0]) * e, py = A[1] - 24 * s - Math.sin(e * Math.PI) * H * 0.28;
        const g = x.createRadialGradient(px, py, 0, px, py, 26 * s); g.addColorStop(0, rgba(C.Y, 0.95)); g.addColorStop(0.3, rgba(C.y, 0.55)); g.addColorStop(1, rgba(C.f, 0));
        x.fillStyle = g; x.beginPath(); x.arc(px, py, 26 * s, 0, Math.PI * 2); x.fill();
        x.fillStyle = C.Y; x.beginPath(); x.arc(px, py, 3.5 * s, 0, Math.PI * 2); x.fill();
        for (let i = 0; i < 8; i++) { const f = Math.max(0, e - i * 0.03), qx = A[0] + (B[0] - A[0]) * f, qy = A[1] - 24 * s - Math.sin(f * Math.PI) * H * 0.28; x.fillStyle = rgba(C.y, 0.5 - i * 0.06); x.fillRect(qx - 1.5 * s, qy - 1.5 * s, 3 * s, 3 * s); }
        op.saberes.slice(0, 4).forEach((titulo, i) => { // cartitas de papel que siguen a la brasa
          const f = Math.max(0, e - 0.08 - i * 0.06), qx = A[0] + (B[0] - A[0]) * f, qy = A[1] - 24 * s - Math.sin(f * Math.PI) * H * 0.28 + 28 * s;
          x.save(); x.translate(qx, qy); x.rotate(Math.sin(tt * 2 + i) * 0.12);
          x.fillStyle = rgba(C.A, 0.5); x.fillRect(-11 * s + 2 * s, -14 * s + 3 * s, 22 * s, 28 * s);
          x.fillStyle = C.i; x.fillRect(-11 * s, -14 * s, 22 * s, 28 * s);
          x.fillStyle = C.q; x.fillRect(-7 * s, -10 * s, 14 * s, 2 * s);
          x.fillStyle = C.y; x.beginPath(); x.arc(0, 1 * s, 4 * s, 0, Math.PI * 2); x.fill();
          x.restore();
        });
      }
      // 0,7 a 1: la canoa nueva se enciende
      const nivel = t < 0.7 ? 0 : Math.min(4, 1 + Math.floor((t - 0.7) / 0.06));
      CZ.canoa(x, B[0], B[1], s, nivel, tt, -1, false);
      if (nivel > 0) CZ.humo(x, B[0], B[1] - 30 * s, s, tt, 0.6, 6, 80);
      texto.style.opacity = t > 0.72 ? 1 : 0;
    }).then(() => new Promise((ok) => setTimeout(() => { fin(); ok(); }, 900)));
  }

  /** La carta se despliega como un papel, con un brillo tibio. */
  function cartaEntra(el) {
    if (!el || reducido() || !el.animate) return Promise.resolve();
    const a = el.animate([
      { transform: 'translateY(24px) scale(.82) rotate(-6deg)', opacity: 0, boxShadow: '0 0 0 rgba(255,212,124,0)' },
      { transform: 'translateY(-4px) scale(1.02) rotate(1deg)', opacity: 1, boxShadow: '0 0 60px rgba(255,212,124,.55)', offset: 0.7 },
      { transform: 'none', opacity: 1, boxShadow: '5px 7px 0 rgba(15,26,33,.55)' },
    ], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
    return a.finished.catch(() => {});
  }

  const api = { humoCubre, humoDescubre, pasoDelFuego, cartaEntra };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_TRANSICIONES = api;
})(typeof window !== 'undefined' ? window : globalThis);
