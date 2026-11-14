/*
 * Tierra de los Humos · Mapa de los territorios ancestrales (estilo Corteza)
 * -------------------------------------------------------------------------
 * Dibuja Tierra del Fuego y los canales con las costas reales (Natural Earth),
 * el paisaje según Cooper (1946, p. 107): estepa al norte, bosque al sur, y los
 * territorios de cada pueblo como manchas suaves, sin líneas de frontera, porque
 * los pueblos se movían, se visitaban y comerciaban (Cooper, p. 82 y 107).
 *
 * Uso:
 *   <script src="arte/fuente/arte.js"></script>
 *   <script src="arte/mapa/costas.js"></script>
 *   <script src="arte/mapa/mapa.js"></script>
 *   TDH_TERRITORIOS.dibujar(canvas, { ancho: 900, territorios: true, hoy: true, nombres: true, destacar: 'yagan' });
 *
 * Se llama TDH_TERRITORIOS (y no TDH_MAPA) para no chocar con el mapa del núcleo
 * del juego (juego/nucleo/mapa.js), que usa TDH_MAPA: la postal y el juego cargan los dos.
 *
 * No se dibujan límites entre países. Nombres según la toponimia oficial.
 * Licencia: código MIT; el mapa, CC BY-SA 4.0. Costas: Natural Earth (dominio público).
 */
(function (raiz) {
  'use strict';
  const ARTE = raiz.TDH_ARTE, COSTAS = raiz.TDH_COSTAS;
  const C = ARTE.COLOR;
  const rgba = (hex, a) => { const [r, g, b] = ARTE.hexARgb(hex); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
  const hash = (x, y, k) => { const s = Math.sin(x * 127.1 + y * 311.7 + (k || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const COS = Math.cos(54.5 * Math.PI / 180);

  // Territorios ancestrales: centro aproximado, radios en grados y fuente. Son zonas, no fronteras.
  const TERRITORIOS = [
    { id: 'yagan', nombre: 'Yagán', detalle: 'Costa sur de la Isla Grande y las islas hasta el cabo de Hornos', fuente: 'Cooper (1946), p. 81 y 107',
      manchas: [[-68.6, -54.85, 1.7, 0.22], [-70.6, -54.75, 1.1, 0.3], [-68.6, -55.35, 1.6, 0.45], [-67.6, -55.75, 0.9, 0.35]], color: C.y, rotulo: [-68.9, -55.62] },
    { id: 'selknam', nombre: "Selk'nam", detalle: 'La Isla Grande: al norte del río Grande en la estepa, al sur en el bosque', fuente: 'Cooper (1946), p. 107-108',
      manchas: [[-68.6, -53.2, 1.4, 0.55], [-67.9, -54.1, 1.2, 0.3], [-69.3, -53.9, 0.9, 0.35]], color: C.O, rotulo: [-68.4, -53.45] },
    { id: 'haush', nombre: 'Haush', detalle: 'La península Mitre, en el extremo sudeste de la Isla Grande', fuente: 'Cooper (1946), p. 108',
      manchas: [[-65.6, -54.75, 0.7, 0.22]], color: C.q, rotulo: [-65.45, -54.42] },
    { id: 'kawesqar', nombre: 'Kawésqar', detalle: 'Los canales del oeste, desde las islas al oeste de Tierra del Fuego hasta el golfo de Penas', fuente: 'Bird (1946), p. 55',
      manchas: [[-72.4, -53.8, 0.8, 0.5], [-72.6, -54.4, 0.5, 0.25], [-71.9, -53.2, 0.5, 0.35]], color: C.Q, rotulo: [-72.35, -54.05] },
  ];
  // Nombres de lugares (toponimia oficial). tipo: agua · tierra · hoy (ciudades de hoy)
  const LUGARES = [
    { n: 'Canal Beagle', p: [-69.35, -54.9], tipo: 'agua', rot: -0.03 },
    { n: 'Estrecho de Magallanes', p: [-70.3, -52.62], tipo: 'agua', rot: -0.25 },
    { n: 'Océano Atlántico', p: [-65.2, -53.2], tipo: 'agua' },
    { n: 'Océano Pacífico', p: [-71.9, -55.75], tipo: 'agua' },
    { n: 'Isla Grande de Tierra del Fuego', p: [-68.75, -54.12], tipo: 'tierra' },
    { n: 'Isla Navarino', p: [-67.6, -55.12], tipo: 'tierra' },
    { n: 'Isla Hoste', p: [-69.4, -55.3], tipo: 'tierra' },
    { n: 'Cabo de Hornos', p: [-67.27, -55.98], tipo: 'tierra', punto: true },
    { n: 'Península Mitre', p: [-65.55, -54.72], tipo: 'tierra' },
    { n: 'Isla de los Estados', p: [-64.4, -54.95], tipo: 'tierra' },
    { n: 'Península Brecknock', p: [-71.55, -54.6], tipo: 'tierra' },
    { n: 'Bahía Inútil', p: [-69.75, -53.45], tipo: 'agua' },
    { n: 'Ushuaia', p: [-68.3, -54.8], tipo: 'hoy' },
    { n: 'Puerto Williams', p: [-67.61, -54.93], tipo: 'hoy' },
    { n: 'Tolhuin', p: [-67.19, -54.51], tipo: 'hoy' },
    { n: 'Río Grande', p: [-67.7, -53.79], tipo: 'hoy' },
  ];

  function dibujar(canvas, op) {
    op = Object.assign({ ancho: 900, territorios: true, hoy: false, nombres: true, destacar: 'yagan', dpr: Math.min(2, raiz.devicePixelRatio || 1) }, op || {});
    const K = COSTAS.caja, W = op.ancho;
    const esc = W / ((K.este - K.oeste) * COS), H = Math.round((K.norte - K.sur) * esc);
    canvas.width = Math.round(W * op.dpr); canvas.height = Math.round(H * op.dpr);
    canvas.style.aspectRatio = W + ' / ' + H;
    const x = canvas.getContext('2d'); x.setTransform(op.dpr, 0, 0, op.dpr, 0, 0);
    const P = (lon, lat) => [(lon - K.oeste) * COS * esc, (K.norte - lat) * esc];
    const s = W / 900;
    const trazar = (r) => { r.forEach((p, i) => { const [a, b] = P(p[0], p[1]); if (i) x.lineTo(a, b); else x.moveTo(a, b); }); x.closePath(); };
    const tierra = () => { x.beginPath(); COSTAS.anillos.forEach(trazar); };

    // Mar
    x.fillStyle = C.C; x.fillRect(0, 0, W, H);
    x.strokeStyle = rgba(C.E, 0.25); x.lineWidth = 1.5 * s; x.lineCap = 'round';
    for (let i = 0; i < 160; i++) { const a = hash(i, 1) * W, b = hash(i, 2) * H, l = (8 + hash(i, 3) * 10) * s; x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + l / 2, b - 3 * s, a + l, b); x.stroke(); }
    // Agua baja, espuma y sombra: las mismas capas que el motor Corteza
    x.lineJoin = 'round';
    tierra(); x.strokeStyle = rgba(C.F, 0.9); x.lineWidth = 12 * s; x.stroke();
    tierra(); x.strokeStyle = C.E; x.lineWidth = 3.5 * s; x.stroke();
    x.save(); x.translate(3 * s, 5 * s); tierra(); x.fillStyle = rgba(C.A, 0.55); x.fill(); x.restore();
    // Tierra: estepa al norte, bosque al sur (Cooper 1946, p. 107)
    const [, yN] = P(0, -53.6), [, yS] = P(0, -54.3);
    const gr = x.createLinearGradient(0, yN, 0, yS); gr.addColorStop(0, C.g); gr.addColorStop(1, C.m);
    tierra(); x.fillStyle = gr; x.fill();
    x.save(); tierra(); x.clip();
    // copas de árboles al sur y pasto al norte
    for (let i = 0; i < 1400; i++) {
      const lon = K.oeste + hash(i, 5) * (K.este - K.oeste), lat = K.sur + hash(i, 6) * (K.norte - K.sur), [a, b] = P(lon, lat);
      if (lat < -54.1) { x.fillStyle = hash(i, 7) < 0.6 ? C.V : C.l; x.beginPath(); x.arc(a, b, (2.2 + hash(i, 8) * 1.6) * s, 0, Math.PI * 2); x.fill(); }
      else if (lat < -53.6 && hash(i, 9) < 0.5) { x.fillStyle = C.l; x.beginPath(); x.arc(a, b, 1.8 * s, 0, Math.PI * 2); x.fill(); }
      else { x.strokeStyle = rgba(C.O, 0.6); x.lineWidth = 1 * s; x.beginPath(); x.moveTo(a, b); x.lineTo(a - 1.5 * s, b - 3 * s); x.moveTo(a, b); x.lineTo(a + 1.5 * s, b - 3 * s); x.stroke(); }
    }
    // Cordillera con nieve (Cordillera Darwin, al oeste del Beagle)
    for (let i = 0; i < 22; i++) {
      const lon = -71.2 + hash(i, 11) * 2.7, lat = -54.45 - hash(i, 12) * 0.35, [a, b] = P(lon, lat), h = (7 + hash(i, 13) * 6) * s;
      x.fillStyle = C.p; x.beginPath(); x.moveTo(a, b - h); x.lineTo(a + h * 0.8, b); x.lineTo(a - h * 0.8, b); x.fill();
      x.fillStyle = C.W; x.beginPath(); x.moveTo(a, b - h); x.lineTo(a + h * 0.3, b - h * 0.6); x.lineTo(a - h * 0.3, b - h * 0.6); x.fill();
    }
    x.restore();

    // Territorios ancestrales: manchas suaves, sin líneas de frontera
    if (op.territorios) {
      TERRITORIOS.forEach((t) => {
        const fuerte = op.destacar === t.id;
        t.manchas.forEach(([lon, lat, rx, ry]) => {
          const [a, b] = P(lon, lat), RX = rx * COS * esc, RY = ry * esc;
          x.save(); x.translate(a, b); x.scale(1, RY / RX);
          const g = x.createRadialGradient(0, 0, 0, 0, 0, RX);
          g.addColorStop(0, rgba(t.color, fuerte ? 0.5 : 0.32)); g.addColorStop(1, rgba(t.color, 0));
          x.fillStyle = g; x.beginPath(); x.arc(0, 0, RX, 0, Math.PI * 2); x.fill(); x.restore();
        });
      });
    }
    // Nombres de lugares
    const fuente = (px, peso, it) => (it ? 'italic ' : '') + (peso || 400) + ' ' + Math.round(px * s) + 'px "Atkinson Hyperlegible", system-ui, sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    if (op.nombres) LUGARES.filter((l) => l.tipo !== 'hoy').forEach((l) => {
      const [a, b] = P(l.p[0], l.p[1]);
      x.save(); x.translate(a, b); if (l.rot) x.rotate(l.rot);
      if (l.punto) { x.fillStyle = C.I; x.beginPath(); x.arc(0, -8 * s, 2.5 * s, 0, Math.PI * 2); x.fill(); }
      x.font = fuente(l.tipo === 'agua' ? 14 : 13, l.tipo === 'agua' ? 400 : 700, l.tipo === 'agua');
      x.lineWidth = 3.5 * s; x.strokeStyle = l.tipo === 'agua' ? rgba(C.B, 0.8) : rgba(C.i, 0.85); x.strokeText(l.n, 0, 0);
      x.fillStyle = l.tipo === 'agua' ? C.N : C.I; x.fillText(l.n, 0, 0);
      x.restore();
    });
    if (op.hoy) LUGARES.filter((l) => l.tipo === 'hoy').forEach((l) => {
      const [a, b] = P(l.p[0], l.p[1]);
      x.fillStyle = C.I; x.strokeStyle = C.i; x.lineWidth = 2 * s; x.beginPath(); x.rect(a - 3.5 * s, b - 3.5 * s, 7 * s, 7 * s); x.fill(); x.stroke();
      x.font = fuente(13, 700); x.textAlign = 'left';
      x.lineWidth = 3.5 * s; x.strokeStyle = rgba(C.i, 0.9); x.strokeText(l.n, a + 7 * s, b); x.fillStyle = C.I; x.fillText(l.n, a + 7 * s, b);
      x.textAlign = 'center';
    });
    // Rótulos de los pueblos, en papel
    if (op.territorios) TERRITORIOS.forEach((t) => {
      const [a, b] = P(t.rotulo[0], t.rotulo[1]), fuerte = op.destacar === t.id;
      x.font = fuente(fuerte ? 22 : 18, 700); const w = x.measureText(t.nombre).width + 28 * s, h = (fuerte ? 36 : 30) * s;
      x.fillStyle = rgba(C.A, 0.55); x.beginPath(); x.roundRect(a - w / 2 + 3 * s, b - h / 2 + 4 * s, w, h, 9 * s); x.fill();
      x.fillStyle = C.i; x.beginPath(); x.roundRect(a - w / 2, b - h / 2, w, h, 9 * s); x.fill();
      x.fillStyle = t.color; x.beginPath(); x.arc(a - w / 2 + 12 * s, b, 5 * s, 0, Math.PI * 2); x.fill();
      x.fillStyle = C.I; x.fillText(t.nombre, a + 6 * s, b + 1 * s);
    });
    // Norte y escala (1° de latitud = 111 km)
    const [ex, ey] = [W - 60 * s, 52 * s];
    x.fillStyle = C.i; x.beginPath(); x.moveTo(ex, ey - 26 * s); x.lineTo(ex + 10 * s, ey + 6 * s); x.lineTo(ex, ey); x.lineTo(ex - 10 * s, ey + 6 * s); x.fill();
    x.font = fuente(15, 700); x.fillText('N', ex, ey + 20 * s);
    const km50 = 50 / 111 * esc, bx = 24 * s, by = H - 24 * s;
    x.fillStyle = C.i; x.fillRect(bx, by, km50, 5 * s); x.fillStyle = C.I; x.fillRect(bx, by, km50 / 2, 5 * s);
    x.font = fuente(12, 700); x.textAlign = 'left'; x.lineWidth = 3 * s; x.strokeStyle = rgba(C.B, 0.8); x.strokeText('50 km', bx + km50 + 8 * s, by + 3 * s); x.fillStyle = C.i; x.fillText('50 km', bx + km50 + 8 * s, by + 3 * s);
    // Grano de papel
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = 0.08;
    for (let i = 0; i < 2600; i++) { x.fillStyle = hash(i, 21) > 0.5 ? '#fff' : '#000'; x.fillRect(hash(i, 22) * W, hash(i, 23) * H, 1.5, 1.5); }
    x.restore();
    return { ancho: W, alto: H };
  }

  const api = { dibujar, TERRITORIOS, LUGARES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_TERRITORIOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
