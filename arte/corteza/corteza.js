/*
 * Tierra de los Humos · Motor de dibujo «Corteza» (estilo visual elegido)
 * -----------------------------------------------------------------------
 * El paisaje parece recortado en papel y corteza: capas planas con borde
 * ondulado, sombra hacia el sureste (la luz viene del norte, como el sol en
 * Tierra del Fuego) y grano de papel. Lo que se puede JUNTAR (leña, mariscos,
 * calafate, saberes) aparece como una PEGATINA en pixel art: un dibujo pixel
 * recortado con borde de papel, que se distingue a simple vista del paisaje.
 *
 * Depende de arte/fuente/arte.js (paleta y sprites pixel). Sin otras librerías.
 *
 * Uso mínimo:
 *   <script src="arte/fuente/arte.js"></script>
 *   <script src="arte/corteza/corteza.js"></script>
 *   const motor = TDH_CORTEZA.crear(miCanvas, { celda: 48 });
 *   motor.escena({ mapa: [...], objetos: [...], canoa: { x: 9, y: 6, fuego: 3 } });
 *   requestAnimationFrame(function cuadro(ms) { motor.dibujar(ms / 1000); requestAnimationFrame(cuadro); });
 *
 * Opciones de la escena: estacion, clima, hora, explorado, vista, altoContraste (true: costa con franja
 * blanca y contorno, noche que nunca tapa del todo, humo con contorno, pegatinas con borde oscuro,
 * anillo en la canoa y sin grano de papel).
 *
 * Letras del mapa:  ~ canal hondo · - canal · , agua baja · k cachiyuyo · r roca
 *                   . playa · p pradera · G guindo · L lenga · t turbal · M cumbre
 *
 * Licencia: código MIT; el arte que produce, CC BY-SA 4.0.
 */
(function (raiz) {
  'use strict';
  const ARTE = raiz.TDH_ARTE || (typeof require === 'function' ? require('../fuente/arte.js') : null);
  if (!ARTE) throw new Error('Corteza necesita arte/fuente/arte.js cargado antes.');
  const C = ARTE.COLOR;
  const TAU = Math.PI * 2;

  // ── Utilidades ──────────────────────────────────────────────────────────
  function rgba(hex, a) { const [r, g, b] = ARTE.hexARgb(hex); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; }
  function hash(x, y, k) { const s = Math.sin(x * 127.1 + y * 311.7 + (k || 0) * 74.7) * 43758.5453; return s - Math.floor(s); }
  function lienzo(w, h) {
    if (typeof OffscreenCanvas !== 'undefined' && !raiz.document) return new OffscreenCanvas(w, h);
    const c = raiz.document.createElement('canvas'); c.width = w; c.height = h; return c;
  }
  function circulo(ctx, x, y, r) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }
  function elipse(ctx, x, y, rx, ry, rot) { ctx.moveTo(x + rx, y); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); }

  const TIPOS = {
    '~': { agua: true, hondo: true }, '-': { agua: true }, ',': { agua: true, somera: true },
    k: { agua: true, somera: true, algas: true }, r: { agua: true, roca: true },
    '.': { tierra: true, playa: true }, p: { tierra: true, pradera: true },
    G: { tierra: true, bosque: 'guindo' }, L: { tierra: true, bosque: 'lenga' },
    t: { tierra: true, turbal: true }, M: { tierra: true, cumbre: true },
  };

  // Colores por estación. El guindo es de hoja perenne: no cambia.
  const ESTACIONES = {
    verano: { lenga: [C.G, C.l, C.L], suelo: C.m, playa: C.g, turba: C.t, pasto: C.L },
    otono: { lenga: [C.t, C.o, C.O], suelo: C.K, playa: C.g, turba: C.q, pasto: C.O },
    invierno: { lenga: [C.x, C.h, C.W], suelo: C.N, playa: C.N, turba: C.h, pasto: C.W, nieve: true },
  };
  const GUINDO = [C.v, C.V, C.Q];
  const SOMBRA = rgba(C.A, 0.55);

  // Lo que se junta se dibuja como pegatina pixel. id del objeto → sprite de arte.js
  const PEGATINAS = { lena: 'icono-lena', mejillones: 'icono-comida', hongos: 'icono-hongo', pirita: 'icono-pirita', pescado: 'icono-pez', erizos: 'icono-erizo', huevos: 'icono-huevos', calafate: 'icono-calafate', saber: 'icono-saber' };

  // ── Pegatinas pixel con borde de papel ──────────────────────────────────
  const cachePegatinas = {};
  function pegatina(idSprite, escala, estacion, fuerte) {
    const k = idSprite + '|' + escala + '|' + (estacion || 'verano') + (fuerte ? '|f' : '');
    if (cachePegatinas[k]) return cachePegatinas[k];
    const px = ARTE.pixeles(idSprite, 0, estacion);
    // En alto contraste, el borde de papel es más ancho y lleva un contorno oscuro por fuera.
    const w = px[0].length, h = px.length, borde = Math.max(2, Math.round(escala * (fuerte ? 2.4 : 1.5))), sombra = Math.max(2, Math.round(escala * 1.2));
    const W = w * escala + borde * 2 + sombra, H = h * escala + borde * 2 + sombra;
    const silueta = lienzo(w * escala, h * escala), cs = silueta.getContext('2d');
    px.forEach((f, y) => f.forEach((c, x) => { if (c) { cs.fillStyle = '#000'; cs.fillRect(x * escala, y * escala, escala, escala); } }));
    const out = lienzo(W, H), co = out.getContext('2d');
    // Papel: la silueta "engordada" en todas direcciones.
    const papel = lienzo(W, H), cp = papel.getContext('2d');
    for (let a = 0; a < 16; a++) {
      const dx = Math.round(Math.cos(a / 16 * TAU) * borde), dy = Math.round(Math.sin(a / 16 * TAU) * borde);
      cp.drawImage(silueta, borde + dx, borde + dy);
    }
    cp.drawImage(silueta, borde, borde);
    // Sombra del papel hacia el sureste, después el papel, después el pixel art.
    const tinte = (src, color) => { const t = lienzo(W, H), ct = t.getContext('2d'); ct.drawImage(src, 0, 0); ct.globalCompositeOperation = 'source-in'; ct.fillStyle = color; ct.fillRect(0, 0, W, H); return t; };
    co.drawImage(tinte(papel, SOMBRA), sombra * 0.6, sombra);
    if (fuerte) { const g = Math.max(2, Math.round(escala * 0.7)); for (let a = 0; a < 12; a++) co.drawImage(tinte(papel, C.z), Math.round(Math.cos(a / 12 * TAU) * g), Math.round(Math.sin(a / 12 * TAU) * g)); }
    co.drawImage(tinte(papel, C.i), 0, 0);
    co.drawImage(tinte(papel, rgba(C.R, 0.35)), 0, 0); // fibra cálida del papel
    co.drawImage(tinte(papel, C.i), -1, -1);
    px.forEach((f, y) => f.forEach((c, x) => { if (c) { co.fillStyle = c; co.fillRect(borde + x * escala, borde + y * escala, escala, escala); } }));
    cachePegatinas[k] = out;
    return out;
  }

  // ── Grano de papel (se calcula una vez) ─────────────────────────────────
  let granoCache = null;
  function grano() {
    if (granoCache) return granoCache;
    const n = 256, c = lienzo(n, n), x = c.getContext('2d'), img = x.createImageData(n, n);
    for (let i = 0; i < img.data.length; i += 4) { const v = 110 + Math.random() * 145; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 26; }
    x.putImageData(img, 0, 0);
    // fibras largas, como en el papel hecho a mano
    x.strokeStyle = 'rgba(255,255,255,0.10)'; x.lineWidth = 1;
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * TAU, l = 6 + Math.random() * 18, px = Math.random() * n, py = Math.random() * n;
      x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a) * l * 0.5 + 3, py + Math.sin(a) * l * 0.5, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
    }
    granoCache = c;
    return c;
  }

  // ── Dibujos sueltos (sirven también para el HUD y las cartas) ───────────
  function gota(ctx, x, y, r, h, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y - h);
    ctx.bezierCurveTo(x + r * 1.15, y - h * 0.45, x + r, y, x, y);
    ctx.bezierCurveTo(x - r, y, x - r * 1.15, y - h * 0.45, x, y - h); ctx.fill();
  }
  /** Fuego en capas de papel. nivel 0 a 4. (x, y) es la base. s es la escala (1 = una celda de 48 px). */
  function fuego(ctx, x, y, s, nivel, t) {
    if (nivel <= 0) {
      ctx.fillStyle = C.x; ctx.beginPath(); elipse(ctx, x, y - 1 * s, 9 * s, 3 * s); ctx.fill();
      ctx.fillStyle = C.e; ctx.beginPath(); circulo(ctx, x - 3 * s, y - 2 * s, 1.4 * s); circulo(ctx, x + 2 * s, y - 1.5 * s, 1.1 * s); ctx.fill();
      return;
    }
    const f = [0, 0.55, 0.75, 0.95, 1.18][nivel];
    const v1 = Math.sin(t * 11) * 0.08, v2 = Math.sin(t * 7.3 + 1) * 0.1, lado = Math.sin(t * 5.1) * 1.6 * s;
    gota(ctx, x + lado * 0.3, y, 9 * s * f, 26 * s * f * (1 + v1), C.e);
    gota(ctx, x + lado * 0.5, y - 0.5 * s, 7 * s * f, 21 * s * f * (1 + v2), C.f);
    gota(ctx, x + lado * 0.7, y - 1 * s, 4.8 * s * f, 14.5 * s * f * (1 - v1), C.y);
    gota(ctx, x + lado * 0.8, y - 1.5 * s, 2.6 * s * f, 7.5 * s * f, C.Y);
    if (nivel >= 3) { // chispas de papel
      ctx.fillStyle = C.Y;
      for (let i = 0; i < nivel; i++) {
        const fase = (t * 0.9 + i * 0.37) % 1;
        ctx.globalAlpha = 1 - fase; ctx.fillRect(x + Math.sin(i * 2.1 + t * 2) * 7 * s, y - (22 + fase * 18) * s * f, 2 * s, 2 * s);
      }
      ctx.globalAlpha = 1;
    }
  }
  /** Humo: bocanadas de papel que suben, crecen y se desvanecen. */
  function humo(ctx, x, y, s, t, viento, cantidad, alto) {
    const n = cantidad || 7, H = (alto || 70) * s;
    for (let i = 0; i < n; i++) {
      const fase = (t * 0.22 + i / n) % 1;
      const yy = y - fase * H, xx = x + Math.sin(fase * 6 + i) * 3 * s + fase * fase * 34 * (viento || 0.6) * s, r = (3 + fase * 9) * s;
      ctx.fillStyle = rgba(C.h, (1 - fase) * 0.55); ctx.beginPath(); circulo(ctx, xx + r * 0.2, yy + r * 0.25, r); ctx.fill();
      ctx.fillStyle = rgba(C.N, (1 - fase) * 0.8); ctx.beginPath(); circulo(ctx, xx, yy, r); ctx.fill();
    }
  }
  /**
   * Canoa de corteza con su fuego. (x, y) centro de la línea de flotación. mira: 1 derecha, -1 izquierda.
   * Según Cooper (1946, p. 88, 91, 96) y Spears (1895, p. 56-57):
   *  - tres tiras de corteza de guindo (fondo y dos costados) cosidas a lo largo con barba de ballena;
   *    borda atada; las dos puntas iguales, levantadas ("luna nueva");
   *  - el fogón en el medio, sobre un lecho de tierra, conchas o piedras (o un champón de pasto dado vuelta);
   *  - adelante del fuego, el hombre con sus armas; atrás, la mujer, que rema y maneja la canoa;
   *  - remo de una pieza, pala larga lanceolada, sin travesaño.
   */
  function canoa(ctx, x, y, s, nivelFuego, t, mira, remando) {
    const L = 50 * s;
    ctx.save(); ctx.translate(x, y); ctx.scale(mira || 1, 1);
    // estela y sombra en el agua
    ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, 3 * s, 7 * s, L * 0.52, 4.5 * s); ctx.fill();
    ctx.strokeStyle = rgba(C.E, 0.7); ctx.lineWidth = 1.6 * s; ctx.lineCap = 'round';
    for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(-L * (0.56 + i * 0.18), (3 + i * 3) * s); ctx.quadraticCurveTo(-L * (0.63 + i * 0.2), (5 + i * 3) * s, -L * (0.76 + i * 0.22), (4 + i * 4) * s); ctx.stroke(); }
    const remo = remando ? Math.sin(t * 4) : 0.4;
    const persona = (dx, e) => { // silueta sin rasgos con capa chica de cuero, sentada o en cuclillas
      ctx.fillStyle = C.u; ctx.beginPath(); ctx.moveTo(dx - 6 * s * e, -2 * s); ctx.quadraticCurveTo(dx - 6 * s * e, -13 * s * e, dx, -14 * s * e); ctx.quadraticCurveTo(dx + 6 * s * e, -13 * s * e, dx + 6 * s * e, -2 * s); ctx.fill();
      ctx.fillStyle = rgba(C.z, 0.25); ctx.beginPath(); ctx.moveTo(dx + 1 * s, -13 * s * e); ctx.quadraticCurveTo(dx + 6 * s * e, -12 * s * e, dx + 6 * s * e, -2 * s); ctx.lineTo(dx + 1 * s, -2 * s); ctx.fill();
      ctx.fillStyle = C.z; ctx.beginPath(); circulo(ctx, dx, -17.5 * s * e, 3.8 * s * e); ctx.fill();
    };
    // Adelante del fuego: el hombre, con el arpón en reposo (asta larga, punta de hueso).
    const proa = L * 0.22;
    ctx.strokeStyle = C.R; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(proa - 3 * s, -1 * s); ctx.lineTo(proa + 15 * s, -40 * s); ctx.stroke();
    ctx.fillStyle = C.w; ctx.beginPath(); ctx.moveTo(proa + 15 * s, -40 * s); ctx.lineTo(proa + 18.5 * s, -48 * s); ctx.lineTo(proa + 13.2 * s, -42.5 * s); ctx.fill();
    ctx.strokeStyle = C.w; ctx.lineWidth = 1 * s; ctx.beginPath(); ctx.moveTo(proa + 17 * s, -45 * s); ctx.lineTo(proa + 19 * s, -43.5 * s); ctx.stroke(); // diente de la punta
    persona(proa, 0.95);
    // Atrás del fuego: la mujer, que rema.
    const popa = -L * 0.22;
    persona(popa, 1);
    ctx.strokeStyle = C.R; ctx.lineWidth = 2.4 * s; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(popa + 4 * s, -12 * s - remo * 2 * s); ctx.lineTo(popa - 9 * s - remo * 3 * s, 9 * s); ctx.stroke();
    ctx.fillStyle = C.R; ctx.beginPath(); elipse(ctx, popa - 10.5 * s - remo * 3 * s, 12.5 * s, 2 * s, 6 * s, 0.5); ctx.fill(); // pala larga y angosta
    // Casco simétrico: las dos puntas iguales y levantadas.
    ctx.fillStyle = C.r; ctx.beginPath();
    ctx.moveTo(-L * 0.57, -10 * s); ctx.quadraticCurveTo(-L * 0.42, 9 * s, 0, 9 * s); ctx.quadraticCurveTo(L * 0.42, 9 * s, L * 0.57, -10 * s);
    ctx.quadraticCurveTo(L * 0.4, 0, 0, 0.5 * s); ctx.quadraticCurveTo(-L * 0.4, 0, -L * 0.57, -10 * s); ctx.fill();
    ctx.fillStyle = rgba(C.z, 0.3); ctx.beginPath(); ctx.moveTo(-L * 0.4, 4 * s); ctx.quadraticCurveTo(0, 12 * s, L * 0.4, 4 * s); ctx.quadraticCurveTo(0, 9 * s, -L * 0.4, 4 * s); ctx.fill();
    // Costura a lo largo: la tira del fondo unida a la del costado (barba de ballena)
    ctx.strokeStyle = rgba(C.g, 0.95); ctx.lineWidth = 1.1 * s; ctx.setLineDash([1.4 * s, 2.2 * s]);
    ctx.beginPath(); ctx.moveTo(-L * 0.47, -2 * s); ctx.quadraticCurveTo(0, 13.5 * s, L * 0.47, -2 * s); ctx.stroke();
    // costuras cortas de las piezas de las puntas
    [-1, 1].forEach((lado) => { ctx.beginPath(); ctx.moveTo(lado * L * 0.43, -4 * s); ctx.lineTo(lado * L * 0.38, 3 * s); ctx.stroke(); });
    ctx.setLineDash([]);
    // Borda atada
    ctx.strokeStyle = C.R; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(-L * 0.55, -9 * s); ctx.quadraticCurveTo(-L * 0.38, 0.5 * s, 0, 1.2 * s); ctx.quadraticCurveTo(L * 0.38, 0.5 * s, L * 0.55, -9 * s); ctx.stroke();
    ctx.strokeStyle = C.r; ctx.lineWidth = 1 * s;
    for (let i = -3; i <= 3; i++) { if (i === 0) continue; const bx = i * L * 0.13, by = 1.2 * s - Math.pow(Math.abs(bx) / (L * 0.55), 2) * 10 * s; ctx.beginPath(); ctx.moveTo(bx - 1 * s, by - 1.2 * s); ctx.lineTo(bx + 1 * s, by + 1.2 * s); ctx.stroke(); }
    // Fogón en el medio: un champón de tierra y pasto con piedras
    ctx.fillStyle = C.r; ctx.beginPath(); elipse(ctx, 0, 0.6 * s, 8.5 * s, 2.8 * s); ctx.fill();
    ctx.fillStyle = C.m; ctx.beginPath(); elipse(ctx, -6 * s, 0.2 * s, 2.6 * s, 1.1 * s); elipse(ctx, 6.5 * s, 0.4 * s, 2.2 * s, 1 * s); ctx.fill();
    ctx.fillStyle = C.P; ctx.beginPath(); circulo(ctx, -4 * s, -0.3 * s, 1.4 * s); circulo(ctx, 4.2 * s, -0.2 * s, 1.3 * s); ctx.fill();
    ctx.fillStyle = C.x; ctx.beginPath(); elipse(ctx, 0, -0.3 * s, 3.5 * s, 1.1 * s); ctx.fill();
    ctx.restore();
    fuego(ctx, x, y - 0.5 * s, s * 0.8, nivelFuego, t);
  }

  // Elementos del paisaje y fauna (vector, papel)
  const FIGURAS = {
    // Choza de domo ("colmena"): la más común, sobre todo hacia el oeste. Varas flexibles dobladas,
    // cubiertas con pasto, helechos, ramas, corteza y cueros. Fuego en el centro, puerta hacia el mar.
    // (Cooper 1946, p. 85-86). Si el mar queda del otro lado, se la ve de espaldas: sin puerta.
    choza(ctx, x, y, s, t, viento, est, o) {
      const r = 17 * s, deEspaldas = o && o.deEspaldas;
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 4 * s, y + 2 * s, r * 1.15, r * 0.32); ctx.fill();
      ctx.fillStyle = C.r; ctx.beginPath(); ctx.moveTo(x - r, y); ctx.bezierCurveTo(x - r, y - r * 1.2, x - r * 0.35, y - r * 1.5, x, y - r * 1.5); ctx.bezierCurveTo(x + r * 0.35, y - r * 1.5, x + r, y - r * 1.2, x + r, y); ctx.fill();
      // cobertura: cueros, corteza y matas de pasto y helecho
      ctx.fillStyle = C.u; [[-0.5, -0.45, 0.42, 0.3], [0.45, -0.5, 0.4, 0.3], [0, -1.05, 0.42, 0.26]].forEach(([dx, dy, w, h]) => { ctx.beginPath(); elipse(ctx, x + dx * r, y + dy * r, w * r, h * r, dx * 0.4); ctx.fill(); });
      ctx.fillStyle = C.R; [[-0.15, -0.7, 0.3, 0.16], [0.62, -0.18, 0.22, 0.14]].forEach(([dx, dy, w, h]) => { ctx.beginPath(); elipse(ctx, x + dx * r, y + dy * r, w * r, h * r, 0.25); ctx.fill(); });
      ctx.strokeStyle = est && est.nieve ? C.N : C.m; ctx.lineWidth = 1.4 * s; ctx.lineCap = 'round';
      for (let i = 0; i < 9; i++) { const ax = x + (i / 8 - 0.5) * r * 1.5, ay = y - Math.sin((i / 8) * Math.PI) * r * 1.2 - 2 * s; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - 2 * s, ay - 4 * s); ctx.moveTo(ax, ay); ctx.lineTo(ax + 2 * s, ay - 4 * s); ctx.stroke(); }
      ctx.fillStyle = rgba(C.z, 0.25); ctx.beginPath(); ctx.moveTo(x + 2 * s, y - r * 1.5); ctx.bezierCurveTo(x + r * 0.4, y - r * 1.5, x + r, y - r * 1.2, x + r, y); ctx.lineTo(x + 2 * s, y); ctx.fill();
      ctx.strokeStyle = C.r; ctx.lineWidth = 1.3 * s; // varas dobladas del armazón
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * r * 0.42, y); ctx.quadraticCurveTo(x + i * r * 0.32, y - r * 0.95, x, y - r * 1.5); ctx.stroke(); }
      if (!deEspaldas) {
        ctx.fillStyle = C.z; ctx.beginPath(); ctx.moveTo(x - r * 0.3, y); ctx.quadraticCurveTo(x - r * 0.3, y - r * 0.65, x, y - r * 0.68); ctx.quadraticCurveTo(x + r * 0.3, y - r * 0.65, x + r * 0.3, y); ctx.fill();
        ctx.fillStyle = C.y; ctx.beginPath(); elipse(ctx, x, y - 3 * s, 5 * s, 2.5 * s); ctx.fill();
      }
      humo(ctx, x, y - r * 1.5, s * 0.7, t, viento, 6, 60);
    },
    // Choza cónica (tipo tipi): más frecuente hacia el este. Armazón de troncos o varas gruesas (Cooper 1946, p. 85-86).
    'choza-conica'(ctx, x, y, s, t, viento, est, o) {
      const r = 15 * s, h = 34 * s, deEspaldas = o && o.deEspaldas;
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 5 * s, y + 2 * s, r * 1.2, r * 0.32); ctx.fill();
      ctx.fillStyle = C.r; ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x, y - h); ctx.lineTo(x + r, y); ctx.fill();
      ctx.fillStyle = C.u; ctx.beginPath(); ctx.moveTo(x - r * 0.95, y - 1 * s); ctx.lineTo(x - r * 0.25, y - h * 0.72); ctx.lineTo(x + r * 0.1, y - h * 0.5); ctx.lineTo(x - r * 0.1, y - 1 * s); ctx.fill();
      ctx.fillStyle = C.R; ctx.beginPath(); ctx.moveTo(x + r * 0.15, y - h * 0.62); ctx.lineTo(x + r * 0.5, y - h * 0.4); ctx.lineTo(x + r * 0.62, y - h * 0.12); ctx.lineTo(x + r * 0.2, y - h * 0.2); ctx.fill();
      ctx.fillStyle = rgba(C.z, 0.25); ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + r, y); ctx.lineTo(x + 2 * s, y); ctx.fill();
      ctx.strokeStyle = C.r; ctx.lineWidth = 2 * s; ctx.lineCap = 'round'; // troncos que sobresalen arriba
      [[-0.5, -1.2], [0, -1.25], [0.45, -1.18]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(x, y - h * 0.92); ctx.lineTo(x + dx * r * 0.6, y + dy * h * 0.86); ctx.stroke(); });
      if (!deEspaldas) {
        ctx.fillStyle = C.z; ctx.beginPath(); ctx.moveTo(x - r * 0.28, y); ctx.lineTo(x, y - h * 0.38); ctx.lineTo(x + r * 0.28, y); ctx.fill();
        ctx.fillStyle = C.y; ctx.beginPath(); elipse(ctx, x, y - 3 * s, 4 * s, 2 * s); ctx.fill();
      }
      humo(ctx, x, y - h, s * 0.7, t, viento, 6, 60);
    },
    conchal(ctx, x, y, s) {
      ctx.fillStyle = rgba(C.m, 0.6); ctx.beginPath(); elipse(ctx, x, y, 17 * s, 9 * s); ctx.fill();
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * TAU;
        ctx.fillStyle = i % 4 === 0 ? C.J : (i % 4 === 2 ? C.j : C.w);
        ctx.beginPath(); elipse(ctx, x + Math.cos(a) * 13 * s, y + Math.sin(a) * 6.5 * s, 3.2 * s, 2 * s, a + 0.6); ctx.fill();
      }
    },
    'arbol-bandera'(ctx, x, y, s, t, viento, est) {
      const [so, me] = est.lenga, mov = Math.sin(t * 1.3) * (viento || 0.5) * 1.5 * s;
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 12 * s, y + 2 * s, 16 * s, 3 * s); ctx.fill();
      ctx.strokeStyle = C.r; ctx.lineWidth = 3.2 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 3 * s, y); ctx.quadraticCurveTo(x - 2 * s, y - 15 * s, x + 6 * s, y - 24 * s); ctx.stroke();
      ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x + 1 * s, y - 15 * s); ctx.lineTo(x + 10 * s, y - 17 * s); ctx.stroke();
      ctx.fillStyle = me; ctx.beginPath(); elipse(ctx, x + 15 * s + mov, y - 25 * s, 15 * s, 5.5 * s, -0.08); elipse(ctx, x + 14 * s + mov, y - 18 * s, 9 * s, 3.5 * s, -0.05); ctx.fill();
      ctx.fillStyle = so; ctx.beginPath(); elipse(ctx, x + 17 * s + mov, y - 23 * s, 12 * s, 2.5 * s, -0.08); ctx.fill();
    },
    'lobo-marino'(ctx, x, y, s, t) {
      const resp = Math.sin(t * 1.4) * 0.6 * s;
      ctx.fillStyle = C.u; ctx.beginPath(); elipse(ctx, x - 4 * s, y - 4 * s, 14 * s, 5.5 * s + resp, -0.08); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 4 * s, y - 6 * s); ctx.quadraticCurveTo(x + 9 * s, y - 10 * s, x + 9 * s, y - 17 * s); ctx.quadraticCurveTo(x + 13 * s, y - 18 * s, x + 14 * s, y - 15 * s); ctx.quadraticCurveTo(x + 12 * s, y - 7 * s, x + 7 * s, y - 2 * s); ctx.fill();
      ctx.fillStyle = C.R; ctx.beginPath(); elipse(ctx, x - 6 * s, y - 6.5 * s, 8 * s, 2 * s, -0.08); ctx.fill();
      ctx.fillStyle = C.z; ctx.beginPath(); circulo(ctx, x + 11.5 * s, y - 15.5 * s, 1.2 * s); ctx.fill();
      ctx.fillStyle = C.u; ctx.beginPath(); elipse(ctx, x + 4 * s, y - 1 * s, 4 * s, 1.5 * s, 0.6); ctx.fill();
    },
    cormoran(ctx, x, y, s) {
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 3 * s, y + 1 * s, 6 * s, 1.8 * s); ctx.fill();
      ctx.fillStyle = C.z; ctx.beginPath(); elipse(ctx, x + 1.5 * s, y - 9 * s, 5 * s, 9 * s, 0.12); circulo(ctx, x - 0.5 * s, y - 20 * s, 3.6 * s); ctx.fill();
      ctx.fillStyle = C.w; ctx.beginPath(); elipse(ctx, x - 1.5 * s, y - 8 * s, 3 * s, 6.5 * s, 0.12); ctx.fill();
      ctx.fillStyle = C.O; ctx.beginPath(); circulo(ctx, x - 2.5 * s, y - 21 * s, 1.2 * s); ctx.fill();
      ctx.fillStyle = C.p; ctx.beginPath(); ctx.moveTo(x - 4 * s, y - 20 * s); ctx.lineTo(x - 8 * s, y - 19 * s); ctx.lineTo(x - 4 * s, y - 18.5 * s); ctx.fill();
    },
    'pato-vapor'(ctx, x, y, s, t) {
      const b = Math.sin(t * 2) * 0.8 * s;
      ctx.strokeStyle = rgba(C.E, 0.7); ctx.lineWidth = 1.4 * s; ctx.beginPath(); ctx.moveTo(x - 14 * s, y + 2 * s); ctx.quadraticCurveTo(x, y + 5 * s, x + 16 * s, y + 2 * s); ctx.stroke();
      ctx.fillStyle = C.h; ctx.beginPath(); elipse(ctx, x + 2 * s, y - 2 * s + b, 12 * s, 4.5 * s); circulo(ctx, x - 9 * s, y - 7 * s + b, 4.2 * s); ctx.fill();
      ctx.fillStyle = C.H; ctx.beginPath(); elipse(ctx, x + 3 * s, y - 4 * s + b, 7 * s, 2 * s); ctx.fill();
      ctx.fillStyle = C.O; ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 8 * s + b); ctx.lineTo(x - 17 * s, y - 6.5 * s + b); ctx.lineTo(x - 12 * s, y - 5.5 * s + b); ctx.fill();
    },
    ballena(ctx, x, y, s, t) {
      const sube = (Math.sin(t * 0.8) + 1) / 2;
      ctx.fillStyle = C.z; ctx.beginPath(); ctx.moveTo(x - 20 * s, y); ctx.quadraticCurveTo(x - 4 * s, y - (9 + sube * 3) * s, x + 18 * s, y); ctx.fill();
      ctx.fillStyle = C.h; ctx.beginPath(); ctx.moveTo(x + 6 * s, y - 5 * s); ctx.lineTo(x + 10 * s, y - 9 * s - sube * 2 * s); ctx.lineTo(x + 11 * s, y - 3 * s); ctx.fill();
      ctx.strokeStyle = rgba(C.E, 0.8); ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.moveTo(x - 23 * s, y + 1 * s); ctx.quadraticCurveTo(x, y + 3 * s, x + 21 * s, y + 1 * s); ctx.stroke();
      const sop = (t * 0.5) % 1; // el soplido
      if (sop < 0.45) { ctx.fillStyle = rgba(C.W, 0.85 * (1 - sop / 0.45)); ctx.beginPath(); circulo(ctx, x - 8 * s, y - 12 * s - sop * 20 * s, 3 * s + sop * 6 * s); circulo(ctx, x - 12 * s, y - 9 * s - sop * 14 * s, 2.5 * s + sop * 4 * s); ctx.fill(); }
    },
    // Ballena varada en la playa: se aprovechaba con entusiasmo y reunía a muchas familias (Cooper 1946, p. 84 y 99).
    'ballena-varada'(ctx, x, y, s, t) {
      const L = 46 * s;
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 5 * s, y + 3 * s, L * 0.95, 6 * s); ctx.fill();
      ctx.strokeStyle = rgba(C.E, 0.85); ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.moveTo(x - L, y + 4 * s); ctx.quadraticCurveTo(x, y + 8 * s + Math.sin(t * 1.5) * 1.5 * s, x + L, y + 4 * s); ctx.stroke();
      // cuerpo de costado, cabeza a la izquierda, cola a la derecha
      ctx.fillStyle = C.z; ctx.beginPath(); ctx.moveTo(x - L * 0.92, y); ctx.bezierCurveTo(x - L * 0.9, y - 17 * s, x + L * 0.35, y - 19 * s, x + L * 0.72, y - 5 * s);
      ctx.lineTo(x + L * 0.98, y - 12 * s); ctx.lineTo(x + L * 0.9, y + 1 * s); ctx.lineTo(x + L * 1.0, y + 6 * s); ctx.lineTo(x + L * 0.7, y + 2 * s); ctx.quadraticCurveTo(x, y + 6 * s, x - L * 0.92, y); ctx.fill();
      ctx.fillStyle = C.h; ctx.beginPath(); ctx.moveTo(x - L * 0.85, y + 1 * s); ctx.quadraticCurveTo(x - L * 0.2, y + 5 * s, x + L * 0.5, y + 1 * s); ctx.quadraticCurveTo(x - L * 0.2, y - 3 * s, x - L * 0.85, y + 1 * s); ctx.fill();
      ctx.strokeStyle = rgba(C.z, 0.6); ctx.lineWidth = 1 * s; // pliegues de la garganta
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - L * 0.8, y + (0.5 + i * 0.6) * s); ctx.quadraticCurveTo(x - L * 0.3, y + (2.5 + i * 0.6) * s, x + L * 0.1, y + (1 + i * 0.5) * s); ctx.stroke(); }
      ctx.fillStyle = C.h; ctx.beginPath(); elipse(ctx, x - L * 0.3, y - 13 * s, L * 0.35, 2.4 * s, -0.05); ctx.fill();
      ctx.fillStyle = C.w; ctx.beginPath(); circulo(ctx, x - L * 0.7, y - 7 * s, 1.3 * s); ctx.fill();
    },
    // Guindo grande: de ahí salía la corteza de la canoa, en primavera, del árbol en pie (Cooper 1946, p. 88; Museo Marítimo de Ushuaia).
    'guindo-grande'(ctx, x, y, s, t, viento, est) {
      const [so, me, lu] = GUINDO, h = 1.25 * s;
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 9 * h, y + 2 * h, 16 * h, 4 * h); ctx.fill();
      ctx.fillStyle = C.r; ctx.fillRect(x - 3 * h, y - 30 * h, 6 * h, 31 * h);
      ctx.fillStyle = C.R; ctx.fillRect(x - 1.6 * h, y - 24 * h, 3.4 * h, 18 * h); // franja donde se sacó la corteza
      ctx.strokeStyle = C.r; ctx.lineWidth = 0.8 * h; ctx.beginPath(); ctx.moveTo(x - 1.6 * h, y - 24 * h); ctx.lineTo(x + 1.8 * h, y - 24 * h); ctx.moveTo(x - 1.6 * h, y - 6 * h); ctx.lineTo(x + 1.8 * h, y - 6 * h); ctx.stroke();
      const matas = [[-8, -30, 9, 5.5], [8, -31, 9, 5.5], [0, -34, 10, 6], [-5, -40, 8, 5], [6, -41, 7, 4.5], [0, -46, 6, 4]];
      ctx.fillStyle = so; ctx.beginPath(); matas.forEach(([dx, dy, rx, ry]) => elipse(ctx, x + dx * h + 2 * h, y + dy * h + 2 * h, rx * h, ry * h)); ctx.fill();
      ctx.fillStyle = me; ctx.beginPath(); matas.forEach(([dx, dy, rx, ry]) => elipse(ctx, x + dx * h, y + dy * h, rx * h, ry * h)); ctx.fill();
      ctx.fillStyle = lu; ctx.beginPath(); matas.forEach(([dx, dy, rx, ry], i) => { if (i % 2 === 0) elipse(ctx, x + (dx - rx * 0.3) * h, y + (dy - ry * 0.45) * h, rx * 0.45 * h, ry * 0.3 * h); }); ctx.fill();
      if (est && est.nieve) { ctx.fillStyle = rgba(C.W, 0.85); ctx.beginPath(); elipse(ctx, x - 2 * h, y - 49 * h, 5 * h, 1.6 * h); ctx.fill(); }
    },
    // Pingüino: entre los alimentos del cuarto grupo (Cooper 1946, p. 84).
    pinguino(ctx, x, y, s) {
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 3 * s, y + 1 * s, 6 * s, 1.8 * s); ctx.fill();
      ctx.fillStyle = C.z; ctx.beginPath(); elipse(ctx, x, y - 8 * s, 5 * s, 8.5 * s); circulo(ctx, x - 0.5 * s, y - 17 * s, 3.6 * s); ctx.fill();
      ctx.fillStyle = C.w; ctx.beginPath(); elipse(ctx, x - 1.2 * s, y - 7 * s, 3.2 * s, 6 * s); ctx.fill();
      ctx.strokeStyle = C.z; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.moveTo(x - 4 * s, y - 10 * s); ctx.quadraticCurveTo(x - 1 * s, y - 8 * s, x + 2 * s, y - 10.5 * s); ctx.stroke();
      ctx.strokeStyle = C.w; ctx.lineWidth = 1 * s; ctx.beginPath(); ctx.arc(x - 0.5 * s, y - 17 * s, 2.6 * s, Math.PI * 0.6, Math.PI * 1.3); ctx.stroke();
      ctx.fillStyle = C.p; ctx.beginPath(); ctx.moveTo(x - 3.5 * s, y - 17.5 * s); ctx.lineTo(x - 6.5 * s, y - 16.8 * s); ctx.lineTo(x - 3.5 * s, y - 16 * s); ctx.fill();
    },
    // Cauquén (ganso): entre los alimentos del cuarto grupo (Cooper 1946, p. 84).
    cauquen(ctx, x, y, s) {
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 3 * s, y + 1 * s, 9 * s, 2 * s); ctx.fill();
      ctx.strokeStyle = C.k; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.moveTo(x - 1 * s, y - 3 * s); ctx.lineTo(x - 2 * s, y); ctx.moveTo(x + 2 * s, y - 3 * s); ctx.lineTo(x + 2.5 * s, y); ctx.stroke();
      ctx.fillStyle = C.h; ctx.beginPath(); elipse(ctx, x + 2 * s, y - 7 * s, 9 * s, 4.5 * s, -0.1); ctx.fill();
      ctx.strokeStyle = C.z; ctx.lineWidth = 0.8 * s; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + (-1 + i * 3) * s, y - 9 * s); ctx.lineTo(x + (1 + i * 3) * s, y - 4.5 * s); ctx.stroke(); }
      ctx.fillStyle = C.w; ctx.beginPath(); elipse(ctx, x - 5 * s, y - 8 * s, 3.5 * s, 3.5 * s); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - 7 * s, y - 9 * s); ctx.quadraticCurveTo(x - 8.5 * s, y - 15 * s, x - 7 * s, y - 18 * s); ctx.lineTo(x - 4.5 * s, y - 17 * s); ctx.quadraticCurveTo(x - 5.5 * s, y - 13 * s, x - 3.5 * s, y - 9 * s); ctx.fill();
      ctx.beginPath(); circulo(ctx, x - 6 * s, y - 18 * s, 2.6 * s); ctx.fill();
      ctx.fillStyle = C.z; ctx.beginPath(); ctx.moveTo(x - 8 * s, y - 18.5 * s); ctx.lineTo(x - 10.5 * s, y - 17.8 * s); ctx.lineTo(x - 8 * s, y - 17 * s); ctx.fill(); circulo(ctx, x - 6.4 * s, y - 18.6 * s, 0.6 * s); ctx.fill();
    },
    // Gaviota: tercer grupo de alimentos, con los huevos (Cooper 1946, p. 84).
    gaviota(ctx, x, y, s) {
      ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 3 * s, y + 1 * s, 7 * s, 1.8 * s); ctx.fill();
      ctx.fillStyle = C.w; ctx.beginPath(); elipse(ctx, x + 1 * s, y - 6 * s, 7 * s, 4 * s, -0.1); circulo(ctx, x - 5 * s, y - 10 * s, 3 * s); ctx.fill();
      ctx.fillStyle = C.z; ctx.beginPath(); ctx.moveTo(x - 2 * s, y - 9 * s); ctx.quadraticCurveTo(x + 5 * s, y - 11 * s, x + 10 * s, y - 6 * s); ctx.quadraticCurveTo(x + 4 * s, y - 6 * s, x - 2 * s, y - 7 * s); ctx.fill();
      ctx.fillStyle = C.O; ctx.beginPath(); ctx.moveTo(x - 7.5 * s, y - 10.5 * s); ctx.lineTo(x - 11 * s, y - 10 * s); ctx.lineTo(x - 7.5 * s, y - 9.2 * s); ctx.fill();
      ctx.strokeStyle = C.O; ctx.lineWidth = 1 * s; ctx.beginPath(); ctx.moveTo(x, y - 3 * s); ctx.lineTo(x - 0.5 * s, y); ctx.moveTo(x + 2.5 * s, y - 3 * s); ctx.lineTo(x + 3 * s, y); ctx.stroke();
    },
    // Toninas: pequeños cetáceos del canal; las marsopas, en el tercer grupo de alimentos (Cooper 1946, p. 84). 🔍 especie.
    tonina(ctx, x, y, s, t) {
      [[-9, 0], [8, 3]].forEach(([dx, dy], i) => {
        const fase = (Math.sin(t * 1.6 + i * 2) + 1) / 2, h = 4 + fase * 5;
        ctx.fillStyle = C.z; ctx.beginPath(); ctx.moveTo(x + dx * s - 7 * s, y + dy * s); ctx.quadraticCurveTo(x + dx * s - 2 * s, y + dy * s - h * s, x + dx * s + 3 * s, y + dy * s - h * 1.1 * s); ctx.quadraticCurveTo(x + dx * s + 2 * s, y + dy * s - h * 0.4 * s, x + dx * s + 7 * s, y + dy * s); ctx.fill();
        ctx.fillStyle = C.w; ctx.beginPath(); elipse(ctx, x + dx * s - 3 * s, y + dy * s - 1 * s, 2.5 * s, 1 * s); ctx.fill();
        ctx.strokeStyle = rgba(C.E, 0.8); ctx.lineWidth = 1.4 * s; ctx.beginPath(); ctx.moveTo(x + dx * s - 9 * s, y + dy * s + 1 * s); ctx.quadraticCurveTo(x + dx * s, y + dy * s + 3 * s, x + dx * s + 9 * s, y + dy * s + 1 * s); ctx.stroke();
      });
    },
  };

  function arbolGuindo(ctx, x, y, s, rnd) {
    // Guindo: copa ancha, densa y oscura, hecha de matas aplanadas (no es un pino: es un Nothofagus de hoja perenne).
    const [so, me, lu] = GUINDO, h = (0.9 + rnd * 0.25) * s, flip = rnd > 0.5 ? 1 : -1;
    ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 6 * h, y + 2 * h, 12 * h, 3.6 * h); ctx.fill();
    ctx.fillStyle = C.r; ctx.fillRect(x - 1.5 * h, y - 7 * h, 3 * h, 8 * h);
    const matas = [[-7, -9, 8, 5], [6, -10, 8.5, 5], [0, -12, 9, 5.5], [-4, -17, 7.5, 4.5], [5, -18, 6.5, 4], [0, -22, 5.5, 3.5]];
    ctx.fillStyle = so; ctx.beginPath(); matas.forEach(([dx, dy, rx, ry]) => elipse(ctx, x + dx * h * flip + 1.8 * h, y + dy * h + 1.8 * h, rx * h, ry * h)); ctx.fill();
    ctx.fillStyle = me; ctx.beginPath(); matas.forEach(([dx, dy, rx, ry]) => elipse(ctx, x + dx * h * flip, y + dy * h, rx * h, ry * h)); ctx.fill();
    ctx.fillStyle = lu; ctx.beginPath(); matas.forEach(([dx, dy, rx, ry], i) => { if (i % 2 === 0 || i === 5) elipse(ctx, x + (dx * flip - rx * 0.3) * h, y + (dy - ry * 0.45) * h, rx * 0.45 * h, ry * 0.3 * h); }); ctx.fill();
  }
  function arbolLenga(ctx, x, y, s, rnd, colores) {
    // Lenga: copa redonda y abullonada; cambia de color con la estación.
    const [so, me, lu] = colores, h = (0.85 + rnd * 0.3) * s;
    ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, x + 6 * h, y + 2 * h, 11 * h, 3.5 * h); ctx.fill();
    ctx.fillStyle = C.r; ctx.fillRect(x - 1.5 * h, y - 9 * h, 3 * h, 10 * h);
    const bultos = [[-5, -13, 7], [5, -14, 7.5], [0, -20, 7.5], [-1, -11, 6.5]];
    ctx.fillStyle = so; ctx.beginPath(); bultos.forEach(([dx, dy, r]) => circulo(ctx, x + dx * h + 2 * h, y + dy * h + 2 * h, r * h)); ctx.fill();
    ctx.fillStyle = me; ctx.beginPath(); bultos.forEach(([dx, dy, r]) => circulo(ctx, x + dx * h, y + dy * h, r * h)); ctx.fill();
    ctx.fillStyle = lu; ctx.beginPath(); elipse(ctx, x - 4 * h, y - 22 * h, 4 * h, 2.6 * h, -0.4); elipse(ctx, x - 8 * h, y - 15 * h, 2.6 * h, 2 * h, -0.4); ctx.fill();
  }

  // ── El motor ────────────────────────────────────────────────────────────
  function crear(canvas, opciones) {
    const op = Object.assign({ celda: 48, dpr: Math.min(2, raiz.devicePixelRatio || 1) }, opciones || {});
    const ctx = canvas.getContext('2d');
    let E = null; // escena
    let base = null, claveBase = '', niebla = null, claveNiebla = '', costa = null, costaVisible = null;
    let T = op.celda, dpr = op.dpr;

    function tipo(x, y) { if (x < 0 || y < 0 || y >= E.alto || x >= E.ancho) return TIPOS['~']; return TIPOS[E.mapa[y][x]] || TIPOS['~']; }
    function letra(x, y) { if (x < 0 || y < 0 || y >= E.alto || x >= E.ancho) return '~'; return E.mapa[y][x]; }
    const explorado = (x, y) => (E.explorado ? E.explorado(x, y) : true);

    function puntos(filtro) { // centros + puntos medios entre vecinos: formas suaves al unir círculos
      const p = [];
      for (let y = 0; y < E.alto; y++) for (let x = 0; x < E.ancho; x++) {
        if (!filtro(x, y)) continue;
        p.push([x + 0.5, y + 0.5, x, y]);
        if (filtro(x + 1, y)) p.push([x + 1, y + 0.5, x + 0.5, y]);
        if (filtro(x, y + 1)) p.push([x + 0.5, y + 1, x, y + 0.5]);
        if (filtro(x + 1, y + 1) && filtro(x + 1, y) && filtro(x, y + 1)) p.push([x + 1, y + 1, x + 0.5, y + 0.5]);
      }
      return p;
    }
    function mancha(c, pts, radio, color, dx, dy, jit) {
      c.fillStyle = color; c.beginPath();
      for (const [px, py, hx, hy] of pts) {
        const j = jit === undefined ? 0.1 : jit;
        circulo(c, px * T + (dx || 0) + (hash(hx, hy, 1) - 0.5) * j * T, py * T + (dy || 0) + (hash(hx, hy, 2) - 0.5) * j * T, radio * T * (0.92 + hash(hx, hy, 3) * 0.16));
      }
      c.fill();
    }

    function armarBase() {
      const est = ESTACIONES[E.estacion] || ESTACIONES.verano;
      const W = E.ancho * T, H = E.alto * T;
      base = lienzo(Math.round(W * dpr), Math.round(H * dpr));
      const c = base.getContext('2d'); c.scale(dpr, dpr);
      const esTierra = (x, y) => !!tipo(x, y).tierra && x >= 0 && y >= 0 && x < E.ancho && y < E.alto;
      const tierra = puntos(esTierra);
      // 1. Agua
      c.fillStyle = C.C; c.fillRect(0, 0, W, H);
      const hondo = puntos((x, y) => letra(x, y) === '~' && x >= 0 && y >= 0 && x < E.ancho && y < E.alto);
      mancha(c, hondo, 0.74, rgba(C.B, 0.45), 0, 0, 0.2);
      mancha(c, hondo, 0.6, rgba(C.B, 0.55), 0, 0, 0.25);
      mancha(c, tierra, 1.12, rgba(C.F, 0.55), 0, 0, 0.2);
      mancha(c, tierra, 0.98, C.F, 0, 0, 0.18);
      // 2. Espuma: toda costa tiene su línea clara (accesibilidad: agua y guindo casi no se distinguen sin color)
      if (E.altoContraste) {
        mancha(c, tierra, 0.9, C.z); mancha(c, tierra, 0.85, C.W);
        // La misma franja, aparte, para dibujarla encima de la noche
        costa = lienzo(base.width, base.height); const cc = costa.getContext('2d'); cc.scale(dpr, dpr);
        mancha(cc, tierra, 0.9, C.z); mancha(cc, tierra, 0.85, C.W);
        cc.globalCompositeOperation = 'destination-out'; mancha(cc, tierra, 0.72, '#000');
      } else { mancha(c, tierra, 0.8, C.E); costa = null; }
      // 3. Sombra al sureste, playa y tierra adentro con su bisel de papel
      mancha(c, tierra, 0.72, SOMBRA, 0.07 * T, 0.12 * T);
      mancha(c, tierra, 0.72, est.playa);
      for (let y = 0; y < E.alto; y++) for (let x = 0; x < E.ancho; x++) if (esTierra(x, y)) for (let i = 0; i < 5; i++) { // canto rodado
        const px = (x + 0.15 + hash(x, y, i + 10) * 0.7) * T, py = (y + 0.15 + hash(x, y, i + 20) * 0.7) * T;
        c.fillStyle = est.nieve ? C.H : C.P; c.beginPath(); elipse(c, px, py, (1.5 + hash(x, y, i) * 2) * T / 48, (1 + hash(x, y, i + 1)) * T / 48); c.fill();
      }
      const adentro = puntos((x, y) => esTierra(x, y) && !tipo(x, y).playa && !tipo(x, y + 1).agua && !tipo(x, y - 1).agua);
      mancha(c, adentro, 0.62, rgba(C.W, 0.25), -0.035 * T, -0.05 * T);
      mancha(c, adentro, 0.62, est.suelo);
      // 4. Turbales y praderas
      for (let y = 0; y < E.alto; y++) for (let x = 0; x < E.ancho; x++) {
        const tp = tipo(x, y), cx = (x + 0.5) * T, cy = (y + 0.5) * T;
        if (tp.turbal) { // turbal: cojines de musgo rojizo (Sphagnum) con charcos
          c.fillStyle = C.C; c.beginPath(); elipse(c, cx - 0.14 * T, cy + 0.08 * T, 0.13 * T, 0.06 * T); elipse(c, cx + 0.22 * T, cy + 0.2 * T, 0.08 * T, 0.04 * T); c.fill();
          c.fillStyle = rgba(C.E, 0.7); c.beginPath(); elipse(c, cx - 0.17 * T, cy + 0.065 * T, 0.05 * T, 0.016 * T); c.fill();
          for (let i = 0; i < 9; i++) {
            const hx = cx + (hash(x, y, i + 30) - 0.5) * 0.8 * T, hy = cy + (hash(x, y, i + 35) - 0.5) * 0.7 * T, r = (0.05 + hash(x, y, i + 38) * 0.04) * T;
            if (Math.abs(hx - cx + 0.14 * T) < 0.14 * T && Math.abs(hy - cy - 0.08 * T) < 0.07 * T) continue; // no tapar el charco
            c.fillStyle = est.turba; c.beginPath(); elipse(c, hx + r * 0.2, hy + r * 0.25, r, r * 0.75); c.fill();
            c.fillStyle = est.nieve ? C.N : C.o; c.beginPath(); elipse(c, hx - r * 0.15, hy - r * 0.2, r * 0.6, r * 0.42); c.fill();
          }
        }
        if (tp.pradera || tp.turbal) {
          c.strokeStyle = est.pasto; c.lineWidth = T / 32; c.lineCap = 'round';
          for (let i = 0; i < 6; i++) { const px = (x + 0.1 + hash(x, y, i + 40) * 0.8) * T, py = (y + 0.2 + hash(x, y, i + 50) * 0.7) * T; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 0.03 * T, py - 0.09 * T); c.moveTo(px, py); c.lineTo(px + 0.035 * T, py - 0.08 * T); c.stroke(); }
        }
      }
      // 5. Cumbres (detrás de los árboles)
      for (let y = 0; y < E.alto; y++) for (let x = 0; x < E.ancho; x++) if (tipo(x, y).cumbre) {
        const cx = (x + 0.5 + (hash(x, y, 7) - 0.5) * 0.3) * T, b = (y + 0.95) * T, h = (0.95 + hash(x, y, 8) * 0.35) * T, a = 0.85 * T;
        c.fillStyle = SOMBRA; c.beginPath(); c.moveTo(cx + 0.1 * T, b - h + 0.1 * T); c.lineTo(cx + a + 0.12 * T, b + 0.08 * T); c.lineTo(cx - a + 0.15 * T, b + 0.08 * T); c.fill();
        c.fillStyle = C.p; c.beginPath(); c.moveTo(cx, b - h); c.lineTo(cx + a, b); c.lineTo(cx - a, b); c.fill();
        c.fillStyle = C.k; c.beginPath(); c.moveTo(cx, b - h); c.lineTo(cx + a, b); c.lineTo(cx + 0.12 * T, b); c.lineTo(cx + 0.05 * T, b - h * 0.5); c.fill();
        c.fillStyle = C.W; c.beginPath(); c.moveTo(cx, b - h); c.lineTo(cx + a * 0.34, b - h * 0.62); c.lineTo(cx + a * 0.18, b - h * 0.66); c.lineTo(cx + a * 0.05, b - h * 0.56); c.lineTo(cx - a * 0.1, b - h * 0.66); c.lineTo(cx - a * 0.34, b - h * 0.6); c.fill();
        c.fillStyle = C.N; c.beginPath(); c.moveTo(cx, b - h); c.lineTo(cx + a * 0.34, b - h * 0.62); c.lineTo(cx + a * 0.18, b - h * 0.66); c.lineTo(cx + a * 0.05, b - h * 0.56); c.fill();
      }
      // 6. Bosques: primero el piso sombrío, después los árboles de atrás hacia adelante
      mancha(c, puntos((x, y) => !!tipo(x, y).bosque && x >= 0 && y >= 0 && x < E.ancho && y < E.alto), 0.5, rgba(C.v, 0.75), 0.03 * T, 0.08 * T, 0.2);
      const arboles = [];
      for (let y = 0; y < E.alto; y++) for (let x = 0; x < E.ancho; x++) {
        const b = tipo(x, y).bosque; if (!b) continue;
        const costa = tipo(x, y + 1).agua || tipo(x, y - 1).agua || tipo(x + 1, y).agua || tipo(x - 1, y).agua;
        const n = costa ? 3 : 4;
        for (let i = 0; i < n; i++) arboles.push({ b, x: (x + 0.12 + ((i % 2) * 0.45) + hash(x, y, i + 60) * 0.3) * T, y: (y + 0.35 + Math.floor(i / 2) * 0.42 + hash(x, y, i + 70) * 0.12) * T, r: hash(x, y, i + 80), costa });
      }
      arboles.sort((a, b) => a.y - b.y).forEach((a) => {
        const s = (T / 48) * (a.costa ? 0.95 : 1.1);
        if (a.b === 'guindo') arbolGuindo(c, a.x, a.y, s, a.r); else arbolLenga(c, a.x, a.y, s, a.r, est.lenga);
      });
      if (est.nieve) { // nieve sobre las copas
        c.fillStyle = rgba(C.W, 0.85);
        arboles.forEach((a) => { const s = T / 48; c.beginPath(); elipse(c, a.x - 2 * s, a.y - (a.b === 'guindo' ? 21 : 26) * s, 5 * s, 1.6 * s); c.fill(); });
      }
    }

    function armarNiebla() {
      const W = E.ancho * T, H = E.alto * T;
      niebla = lienzo(Math.round((W + T) * dpr), Math.round((H + T) * dpr));
      const c = niebla.getContext('2d'); c.scale(dpr, dpr); c.translate(T / 2, T / 2);
      const nubes = [];
      if (!E.explorado) return; // sin función de explorado no hay niebla (ilustraciones de cartas, etc.)
      const borde = E.bordeNiebla === false ? 0 : 1; // el borde del mundo también es humo
      for (let y = -borde; y < E.alto + borde; y++) for (let x = -borde; x < E.ancho + borde; x++) {
        if (x >= 0 && y >= 0 && x < E.ancho && y < E.alto && explorado(x, y)) continue;
        for (let k = 0; k < 2; k++) nubes.push([(x + 0.2 + hash(x, y, k + 5) * 0.6) * T, (y + 0.2 + hash(x, y, k + 9) * 0.6) * T, T * (0.55 + hash(x, y, k + 2) * 0.4)]);
      }
      c.fillStyle = rgba(C.A, 0.5); c.beginPath(); nubes.forEach(([x, y, r]) => circulo(c, x + 0.08 * T, y + 0.16 * T, r)); c.fill();
      if (E.altoContraste) { c.fillStyle = C.z; c.beginPath(); nubes.forEach(([x, y, r]) => circulo(c, x, y, r + 0.06 * T)); c.fill(); }
      c.fillStyle = C.h; c.beginPath(); nubes.forEach(([x, y, r]) => circulo(c, x, y, r)); c.fill();
      c.fillStyle = C.H; c.beginPath(); nubes.forEach(([x, y, r]) => circulo(c, x - r * 0.1, y - r * 0.14, r * 0.84)); c.fill();
      c.fillStyle = rgba(C.N, 0.55); c.beginPath(); nubes.forEach(([x, y, r]) => circulo(c, x - r * 0.2, y - r * 0.28, r * 0.6)); c.fill();
    }

    function asegurarCaches() {
      const kb = E.mapa.join('|') + E.estacion + T + dpr + !!E.altoContraste;
      let cambio = false;
      if (kb !== claveBase) { armarBase(); claveBase = kb; cambio = true; }
      let kn = '';
      for (let y = 0; y < E.alto; y++) for (let x = 0; x < E.ancho; x++) kn += explorado(x, y) ? '1' : '0';
      kn += T + '|' + dpr + '|' + !!E.explorado + E.bordeNiebla + !!E.altoContraste;
      if (kn !== claveNiebla) { armarNiebla(); claveNiebla = kn; cambio = true; }
      if (cambio) { // la franja de costa de alto contraste, sin lo que tapa el humo
        costaVisible = null;
        if (costa) {
          costaVisible = lienzo(costa.width, costa.height); const cv = costaVisible.getContext('2d');
          cv.drawImage(costa, 0, 0);
          if (niebla && E.explorado) { cv.globalCompositeOperation = 'destination-out'; cv.drawImage(niebla, Math.round(-T / 2 * dpr), Math.round(-T / 2 * dpr)); }
        }
      }
    }

    // Luz en escalones, como capas de papel de calco alrededor del fuego.
    function luz(t) {
      const amb = { dia: 0.95, tarde: 0.72, noche: 0.2 }[E.hora] - (E.clima === 'lluvia' ? 0.14 : 0) - (E.clima === 'nieve' ? 0.05 : 0);
      const osc = Math.max(0, (1 - amb) * (E.altoContraste ? 0.55 : 0.92)); // en alto contraste la noche nunca tapa del todo
      const W = E.ancho * T, H = E.alto * T;
      if (E.hora === 'tarde') { ctx.fillStyle = rgba(C.o, 0.13); ctx.fillRect(0, 0, W, H); }
      if (E.hora === 'noche') { ctx.fillStyle = rgba(C.B, 0.25); ctx.fillRect(0, 0, W, H); }
      if (osc < 0.02) return;
      const can = E.canoa, nivel = can ? can.fuego : 0;
      const radio = [0.9, 2.2, 3.3, 4.4, 5.6][nivel] * T * (1 + Math.sin(t * 6) * 0.01);
      const cx = can ? (can.x + 0.5) * T : -999, cy = can ? (can.y + 0.4) * T : -999;
      const pasos = 5;
      if (nivel === 0) { ctx.fillStyle = rgba(C.n, osc); ctx.fillRect(0, 0, W, H); return; }
      // Cada capa oscurece todo MENOS un círculo de borde ondulado: afuera se apilan todas, en el centro ninguna.
      for (let i = 1; i <= pasos; i++) {
        const r = radio * (i / pasos);
        ctx.beginPath(); ctx.rect(0, 0, W, H);
        ctx.moveTo(cx + r, cy);
        for (let a = 48; a >= 0; a--) { const ang = a / 48 * TAU, w = 1 + Math.sin(ang * 5 + i * 1.7 + t * 0.6) * 0.04; ctx.lineTo(cx + Math.cos(ang) * r * w, cy + Math.sin(ang) * r * w); }
        ctx.fillStyle = rgba(C.n, osc / pasos);
        ctx.fill('evenodd');
      }
      // tibieza del fuego: anillos anaranjados muy suaves (solo cuando oscurece)
      const a = osc * 0.09;
      for (let i = 1; i <= 3; i++) { ctx.fillStyle = rgba(C.y, a); ctx.beginPath(); circulo(ctx, cx, cy, radio * (0.15 + i * 0.15) * (1 + Math.sin(t * 8 + i) * 0.02)); ctx.fill(); }
    }

    function clima(t) {
      const v = E.vista || { x: 0, y: 0, ancho: E.ancho, alto: E.alto };
      const W = v.ancho * T, H = v.alto * T, s = T / 48;
      ctx.save(); ctx.translate(v.x * T, v.y * T);
      if (!E._part) { E._part = Array.from({ length: 160 }, (_, i) => ({ x: hash(i, 1), y: hash(i, 2), v: 0.6 + hash(i, 3) * 0.8, f: hash(i, 4) })); }
      if (E.clima === 'lluvia') {
        ctx.strokeStyle = rgba(C.N, 0.6); ctx.lineWidth = 1.6 * s; ctx.lineCap = 'round'; ctx.beginPath();
        E._part.forEach((p) => { const x = ((p.x + t * 0.12 * p.v) % 1) * W, y = ((p.y + t * 0.9 * p.v) % 1) * H; ctx.moveTo(x, y); ctx.lineTo(x - 4 * s, y + 14 * s); });
        ctx.stroke();
        ctx.strokeStyle = rgba(C.E, 0.5); ctx.lineWidth = 1 * s; ctx.beginPath(); // anillos donde cae la gota
        E._part.slice(0, 30).forEach((p, i) => { const fase = (t * 1.5 + p.f) % 1, x = p.y * W, y = p.x * H; if (tipo(Math.floor(x / T + v.x), Math.floor(y / T + v.y)).agua) elipse(ctx, x, y, fase * 6 * s, fase * 2.4 * s); });
        ctx.stroke();
      } else if (E.clima === 'nieve') {
        ctx.fillStyle = rgba(C.W, 0.95); ctx.beginPath();
        E._part.forEach((p) => { const x = ((p.x + Math.sin(t * 0.8 + p.f * 6) * 0.01 + t * 0.02) % 1) * W, y = ((p.y + t * 0.12 * p.v) % 1) * H; circulo(ctx, x, y, (1 + p.f * 2.4) * s); });
        ctx.fill();
      } else if (E.clima === 'viento') {
        ctx.strokeStyle = rgba(C.W, 0.65); ctx.lineWidth = 2 * s; ctx.lineCap = 'round';
        E._part.slice(0, 12).forEach((p) => {
          const x = ((p.x + t * 0.18 * p.v) % 1.5 - 0.25) * W, y = p.y * H;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 40 * s, y - 10 * s, x + 80 * s, y + 10 * s, x + 115 * s, y - 4 * s);
          if (p.f > 0.55) ctx.arc(x + 115 * s, y - 12 * s, 8 * s, Math.PI / 2, Math.PI * 1.85, true);
          ctx.stroke();
        });
      }
      ctx.restore();
    }

    const api = {
      /** Define o actualiza la escena. Solo hace falta pasar lo que cambia. */
      escena(e) {
        E = Object.assign(E || { estacion: 'verano', clima: 'calma', hora: 'dia', objetos: [], humos: [], canoa: null }, e);
        E.alto = E.mapa.length; E.ancho = E.mapa[0].length;
        api.ajustar();
        return api;
      },
      /** Ajusta el tamaño del canvas a la escena (llamar si cambia la celda o la pantalla). */
      ajustar(celda, nuevoDpr) {
        if (celda) T = celda; if (nuevoDpr) dpr = nuevoDpr;
        const W = (E.vista ? E.vista.ancho : E.ancho) * T, H = (E.vista ? E.vista.alto : E.alto) * T;
        if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
        return api;
      },
      /** Dibuja un cuadro. t en segundos (para las animaciones). */
      dibujar(t) {
        t = t || 0;
        asegurarCaches();
        const est = ESTACIONES[E.estacion] || ESTACIONES.verano, s = T / 48, viento = E.clima === 'viento' ? 2.4 : 0.6;
        // Cámara: con E.vista = { x, y, ancho, alto } (en casillas, admite decimales) se ve solo esa parte del mapa.
        const ox = E.vista ? Math.round(E.vista.x * T * dpr) / dpr : 0, oy = E.vista ? Math.round(E.vista.y * T * dpr) / dpr : 0;
        const mundo = () => ctx.setTransform(dpr, 0, 0, dpr, -ox * dpr, -oy * dpr);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = C.C; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(base, Math.round(-ox * dpr), Math.round(-oy * dpr));
        mundo();
        // Olas: cortes de papel claro que se mueven despacio
        const vel = E.clima === 'viento' ? 2.2 : 1;
        ctx.strokeStyle = rgba(C.E, 0.45); ctx.lineWidth = 2 * s; ctx.lineCap = 'round'; ctx.beginPath();
        for (let y = 0; y < E.alto; y++) for (let x = 0; x < E.ancho; x++) {
          const tp = tipo(x, y); if (!tp.agua || tp.roca) continue;
          for (let k = 0; k < (tp.hondo ? 2 : 1); k++) {
            const px = (x + 0.1 + hash(x, y, k + 90) * 0.6) * T + Math.sin(t * 0.5 * vel + x + k) * 4 * s, py = (y + 0.2 + hash(x, y, k + 95) * 0.6) * T;
            const largo = (9 + hash(x, y, k + 99) * 8) * s;
            ctx.moveTo(px, py); ctx.quadraticCurveTo(px + largo / 2, py - 3.5 * s, px + largo, py);
          }
        }
        ctx.stroke();
        // Cachiyuyo y rocas
        for (let y = 0; y < E.alto; y++) for (let x = 0; x < E.ancho; x++) {
          const tp = tipo(x, y), cx = (x + 0.5) * T, cy = (y + 0.5) * T;
          if (tp.algas) { // cachiyuyo: cintas que flotan en la superficie, con sus flotadores dorados
            for (let i = 0; i < 4; i++) {
              const bx = (x + 0.15 + hash(x, y, i + 110) * 0.3) * T, by = (y + 0.2 + i * 0.2) * T, mov = Math.sin(t * 1.1 + i + x) * 3 * s, largo = (0.45 + hash(x, y, i + 115) * 0.3) * T;
              ctx.strokeStyle = C.K; ctx.lineWidth = 3.2 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by);
              ctx.bezierCurveTo(bx + largo * 0.33, by - 5 * s + mov, bx + largo * 0.66, by + 5 * s - mov, bx + largo, by + mov * 0.5); ctx.stroke();
              ctx.fillStyle = rgba(C.O, 0.85); ctx.beginPath(); circulo(ctx, bx + largo * 0.3, by - 2 * s + mov * 0.6, 1.6 * s); circulo(ctx, bx + largo * 0.7, by + 2 * s - mov * 0.6, 1.6 * s); ctx.fill();
            }
          }
          if (tp.roca) {
            ctx.strokeStyle = rgba(C.E, 0.9); ctx.lineWidth = 2 * s; ctx.beginPath(); elipse(ctx, cx, cy + 6 * s, 0.48 * T + Math.sin(t * 2 + x) * 1.5 * s, 0.17 * T); ctx.stroke();
            ctx.fillStyle = SOMBRA; ctx.beginPath(); elipse(ctx, cx + 3 * s, cy + 5 * s, 0.42 * T, 0.2 * T); ctx.fill();
            ctx.fillStyle = C.p; ctx.beginPath(); ctx.moveTo(cx - 0.42 * T, cy + 4 * s); ctx.quadraticCurveTo(cx - 0.36 * T, cy - 0.2 * T, cx - 0.05 * T, cy - 0.22 * T); ctx.quadraticCurveTo(cx + 0.3 * T, cy - 0.2 * T, cx + 0.42 * T, cy + 4 * s); ctx.fill();
            ctx.fillStyle = C.k; ctx.beginPath(); ctx.moveTo(cx + 0.05 * T, cy - 0.22 * T); ctx.quadraticCurveTo(cx + 0.3 * T, cy - 0.2 * T, cx + 0.42 * T, cy + 4 * s); ctx.lineTo(cx + 0.1 * T, cy + 4 * s); ctx.fill();
            ctx.fillStyle = C.P; ctx.beginPath(); elipse(ctx, cx - 0.15 * T, cy - 0.1 * T, 0.12 * T, 0.05 * T); ctx.fill();
          }
        }
        // Objetos: primero el paisaje (vector), después lo que se junta (pegatinas pixel), por fila
        const objs = (E.objetos || []).slice().sort((a, b) => a.y - b.y);
        for (const o of objs) {
          const x = (o.x + 0.5) * T, y = (o.y + (tipo(o.x, o.y).roca ? 0.52 : 0.78)) * T;
          if (FIGURAS[o.id]) {
            // La puerta de la choza da al mar: si el agua está arriba y no abajo, se la ve de espaldas.
            const aguaAbajo = tipo(o.x, o.y + 1).agua || tipo(o.x, o.y + 2).agua, aguaArriba = tipo(o.x, o.y - 1).agua || tipo(o.x, o.y - 2).agua;
            FIGURAS[o.id](ctx, x, y, s, t, viento, est, Object.assign({ deEspaldas: aguaArriba && !aguaAbajo }, o));
          }
          else if (PEGATINAS[o.id] || ARTE.SPRITES[o.id]) {
            dibujarPegatina(o, x, t, s);
          }
        }
        function dibujarPegatina(o, x, t, s) {
          {
            const esc = Math.max(1, Math.round(T * dpr * 0.55 / 16));
            const img = pegatina(PEGATINAS[o.id] || o.id, esc, E.estacion, E.altoContraste);
            const w = img.width / dpr, h = img.height / dpr, salto = Math.sin(t * 2.2 + o.x * 1.7) * 1.5 * s;
            if (o.id === 'saber') { // el saber brilla, tibio
              ctx.save(); ctx.globalCompositeOperation = 'lighter';
              ctx.fillStyle = rgba(C.y, 0.16 + Math.sin(t * 3) * 0.06); ctx.beginPath(); circulo(ctx, x, (o.y + 0.5) * T, 0.62 * T); ctx.fill(); ctx.restore();
            }
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, Math.round((x - w / 2) * dpr) / dpr, Math.round(((o.y + 0.5) * T - h / 2 + salto) * dpr) / dpr, w, h);
          }
        }
        if (E.canoa && E.altoContraste) { // anillo para ubicar la canoa de un vistazo
          const ax = (E.canoa.x + 0.5) * T, ay = (E.canoa.y + 0.6) * T;
          ctx.lineWidth = 5 * s; ctx.strokeStyle = C.z; ctx.beginPath(); elipse(ctx, ax, ay, 0.62 * T, 0.36 * T); ctx.stroke();
          ctx.lineWidth = 2.5 * s; ctx.strokeStyle = C.Y; ctx.beginPath(); elipse(ctx, ax, ay, 0.62 * T, 0.36 * T); ctx.stroke();
        }
        if (E.canoa) canoa(ctx, (E.canoa.x + 0.5) * T, (E.canoa.y + 0.66) * T, s * 1.2, E.canoa.fuego, t, E.canoa.mira || 1, E.canoa.remando);
        if (E.canoa && E.canoa.fuego > 0) humo(ctx, (E.canoa.x + 0.5) * T, (E.canoa.y + 0.66) * T - 30 * s, s * 0.8, t, viento, 6, 70);
        // Niebla (humo de lo no explorado), con una deriva mínima. Va antes de la luz: de noche también se oscurece.
        const dx = Math.sin(t * 0.25) * 3 * s;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(niebla, Math.round((-T / 2 + dx - ox) * dpr), Math.round((-T / 2 - oy) * dpr));
        mundo();
        for (const h of E.humos || []) humo(ctx, h.x * T, h.y * T, s * 1.2, t + h.x, viento, 8, 110);
        luz(t);
        if (E.altoContraste) { // la costa y lo que se junta se ven siempre, aunque sea de noche
          if (costaVisible) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.9; ctx.drawImage(costaVisible, Math.round(-ox * dpr), Math.round(-oy * dpr)); ctx.globalAlpha = 1; mundo(); }
          for (const o of objs) if (!FIGURAS[o.id] && (PEGATINAS[o.id] || ARTE.SPRITES[o.id]) && explorado(o.x, o.y)) dibujarPegatina(o, (o.x + 0.5) * T, t, s);
        }
        clima(t);
        // Grano de papel encima de todo (no en alto contraste: ensucia la lectura)
        if (!E.altoContraste) {
          ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = ctx.createPattern(grano(), 'repeat'); ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      },
      /** Convierte coordenadas de un toque o clic (en el canvas) a casilla del mapa. */
      casillaEn(clientX, clientY) {
        const r = canvas.getBoundingClientRect(), v = E.vista || { x: 0, y: 0, ancho: E.ancho, alto: E.alto };
        return { x: Math.floor(v.x + (clientX - r.left) / r.width * v.ancho), y: Math.floor(v.y + (clientY - r.top) / r.height * v.alto) };
      },
      /** Centra la cámara en una casilla sin salirse del mapa. Devuelve la vista. */
      centrar(cx, cy, ancho, alto) {
        const a = Math.min(ancho, E.ancho), h = Math.min(alto, E.alto);
        E.vista = { x: Math.max(0, Math.min(E.ancho - a, cx + 0.5 - a / 2)), y: Math.max(0, Math.min(E.alto - h, cy + 0.5 - h / 2)), ancho: a, alto: h };
        api.ajustar();
        return E.vista;
      },
      get celda() { return T; },
    };
    return api;
  }

  const modulo = { crear, pegatina, fuego, humo, canoa, figuras: FIGURAS, PEGATINAS, ESTACIONES, rgba };
  if (typeof module !== 'undefined' && module.exports) module.exports = modulo;
  else raiz.TDH_CORTEZA = modulo;
})(typeof window !== 'undefined' ? window : globalThis);
