/*
 * Tierra de los Humos · Fuente única del arte pixel (propuesta A, "Brasa")
 * ------------------------------------------------------------------------
 * Acá está TODO el arte del juego definido como texto: la paleta y cada
 * sprite dibujado letra por letra (cada letra es un color de la paleta).
 *
 * ¿Por qué así y no en un programa de dibujo?
 *   - Pesa casi nada y anda con conexión lenta.
 *   - Cualquiera del equipo puede corregir un píxel desde el editor.
 *   - Se puede cambiar la estación (verano, otoño, invierno) cambiando colores.
 *
 * Funciona en dos lugares:
 *   - En el navegador: <script src="arte/fuente/arte.js"></script> → window.TDH_ARTE
 *   - En Node: const arte = require('./arte.js')  (lo usa arte/generar.cjs)
 *
 * Licencia: CC BY-SA 4.0 (arte) · el código de este archivo, MIT.
 */
(function (raiz) {
  'use strict';

  // ───────────────────────────────────────────────────────────────────────
  // PALETA "Canales" · 42 colores
  // Cada color tiene una letra (clave), un nombre en castellano y de dónde sale.
  // El punto "." es transparente.
  // ───────────────────────────────────────────────────────────────────────
  const PALETA = [
    // Mar: de noche a espuma. El mar de los canales es gris verdoso, casi nunca azul de postal.
    { clave: 'A', id: 'mar-noche',      hex: '#0f1a21', grupo: 'mar',     nota: 'Agua de noche o muy honda.' },
    { clave: 'B', id: 'mar-hondo',      hex: '#1d2e38', grupo: 'mar',     nota: 'Canal abierto, profundo.' },
    { clave: 'C', id: 'mar',            hex: '#2d4553', grupo: 'mar',     nota: 'Agua del canal con cielo cubierto.' },
    { clave: 'D', id: 'mar-gris',       hex: '#4b6672', grupo: 'mar',     nota: 'Reflejo del cielo nublado.' },
    { clave: 'F', id: 'agua-somera',    hex: '#3d6866', grupo: 'mar',     nota: 'Agua baja sobre piedra y algas, más verde.' },
    { clave: 'E', id: 'espuma',         hex: '#9db3b6', grupo: 'mar',     nota: 'Cresta de ola, espuma contra la roca.' },

    // Cielo, niebla y humo: lo que no se ve está en el humo.
    { clave: 'n', id: 'noche',          hex: '#0b1015', grupo: 'cielo',   nota: 'Fondo de interfaz y noche cerrada.' },
    { clave: 'h', id: 'humo-oscuro',    hex: '#59656c', grupo: 'cielo',   nota: 'Humo denso, nubes de tormenta.' },
    { clave: 'H', id: 'humo',           hex: '#8e999c', grupo: 'cielo',   nota: 'Columna de humo de un fogón.' },
    { clave: 'N', id: 'niebla',         hex: '#c3cbca', grupo: 'cielo',   nota: 'Neblina sobre el canal.' },
    { clave: 'W', id: 'nieve',          hex: '#eef2ef', grupo: 'cielo',   nota: 'Nieve de las cumbres, todo el año en lo alto.' },

    // Piedra y costa: playas de canto rodado, no de arena.
    { clave: 'k', id: 'piedra-oscura',  hex: '#33312f', grupo: 'piedra',  nota: 'Roca mojada, sombra.' },
    { clave: 'p', id: 'piedra',         hex: '#625f5a', grupo: 'piedra',  nota: 'Roca de la costa.' },
    { clave: 'P', id: 'canto-rodado',   hex: '#8f897f', grupo: 'piedra',  nota: 'Piedras redondeadas de la playa.' },
    { clave: 'g', id: 'grava',          hex: '#b3a78f', grupo: 'piedra',  nota: 'Playa de grava seca, lecho del fogón.' },

    // Bosque: guindo siempreverde junto al mar, lenga que cambia con la estación.
    { clave: 'v', id: 'guindo-sombra',  hex: '#1a3227', grupo: 'bosque',  nota: 'Guindo (Nothofagus betuloides): hoja perenne, domina la costa.' },
    { clave: 'V', id: 'guindo',         hex: '#2c5140', grupo: 'bosque',  nota: 'Verde oscuro y brillante del guindo.' },
    { clave: 'Q', id: 'guindo-luz',     hex: '#457052', grupo: 'bosque',  nota: 'Luz sobre la copa del guindo.' },
    { clave: 'G', id: 'lenga-sombra',   hex: '#3d5f37', grupo: 'bosque',  nota: 'Lenga (Nothofagus pumilio): pierde la hoja en otoño.' },
    { clave: 'l', id: 'lenga',          hex: '#5d8a47', grupo: 'bosque',  nota: 'Verde de la lenga en verano.' },
    { clave: 'L', id: 'lenga-brote',    hex: '#92ad5c', grupo: 'bosque',  nota: 'Brote claro de primavera.' },
    { clave: 'o', id: 'lenga-otono',    hex: '#b0462e', grupo: 'bosque',  nota: 'Rojo de la lenga en otoño.' },
    { clave: 'O', id: 'nire-otono',     hex: '#cf8a3a', grupo: 'bosque',  nota: 'Amarillo anaranjado del ñire en otoño.' },
    { clave: 'm', id: 'musgo',          hex: '#6f7d36', grupo: 'bosque',  nota: 'Musgo y pasto de la orilla.' },
    { clave: 't', id: 'turba-roja',     hex: '#7e3529', grupo: 'bosque',  nota: 'Turbal de Sphagnum magellanicum, rojizo.' },
    { clave: 'K', id: 'cachiyuyo',      hex: '#6a5527', grupo: 'bosque',  nota: 'Bosque de algas (cachiyuyo) en el agua baja.' },

    // Madera, corteza y cuero.
    { clave: 'r', id: 'corteza',        hex: '#5e412c', grupo: 'madera',  nota: 'Corteza de la canoa y troncos.' },
    { clave: 'R', id: 'corteza-clara',  hex: '#977250', grupo: 'madera',  nota: 'Madera pelada, remo, borde de la canoa.' },
    { clave: 'u', id: 'cuero',          hex: '#74543f', grupo: 'madera',  nota: 'Capa de cuero de lobo marino.' },

    // Fuego: el único color cálido fuerte del mundo. Lo cálido es lo que hay que cuidar.
    { clave: 'e', id: 'brasa',          hex: '#6e2116', grupo: 'fuego',   nota: 'Brasa que queda cuando el fuego baja.' },
    { clave: 'f', id: 'fuego',          hex: '#d24e1c', grupo: 'fuego',   nota: 'Cuerpo de la llama.' },
    { clave: 'y', id: 'llama',          hex: '#f39a2c', grupo: 'fuego',   nota: 'Llama viva.' },
    { clave: 'Y', id: 'luz',            hex: '#ffd47c', grupo: 'fuego',   nota: 'Corazón del fuego. También el color del saber.' },
    { clave: 'x', id: 'ceniza',         hex: '#463f3b', grupo: 'fuego',   nota: 'Ceniza, fuego apagado.' },

    // Tierras y alimentos.
    { clave: 'q', id: 'ocre-rojo',      hex: '#973a25', grupo: 'tierra',  nota: 'Ocre de la tierra. Solo en interfaz y cartas, nunca como pintura corporal.' },
    { clave: 'w', id: 'arcilla-blanca', hex: '#e7ddcb', grupo: 'tierra',  nota: 'Arcilla clara, conchas, plumaje blanco.' },
    { clave: 'z', id: 'carbon',         hex: '#1d1a18', grupo: 'tierra',  nota: 'Carbón, contornos, siluetas.' },
    { clave: 'j', id: 'mejillon',       hex: '#262842', grupo: 'tierra',  nota: 'Valva de mejillón, negro azulado.' },
    { clave: 'J', id: 'nacar',          hex: '#7f8fb0', grupo: 'tierra',  nota: 'Brillo de nácar en las valvas.' },
    { clave: 'b', id: 'calafate',       hex: '#3b2d5a', grupo: 'tierra',  nota: 'Fruto del calafate, violeta oscuro.' },

    // Interfaz: papel y tinta de las cartas de saber.
    { clave: 'i', id: 'papel',          hex: '#eee5d0', grupo: 'interfaz', nota: 'Fondo de las cartas de saber.' },
    { clave: 'I', id: 'tinta',          hex: '#28221e', grupo: 'interfaz', nota: 'Texto sobre papel.' },
  ];

  const COLOR = {};
  for (const c of PALETA) {
    if (COLOR[c.clave]) throw new Error('Clave de color repetida: ' + c.clave);
    COLOR[c.clave] = c.hex;
  }

  // Cambios de color por estación. Solo cambia la lenga, el ñire y el musgo:
  // el guindo es de hoja perenne y se queda verde todo el año.
  const ESTACIONES = {
    verano:   { nombre: 'Verano',   cambios: {} },
    otono:    { nombre: 'Otoño',    cambios: { G: 't', l: 'o', L: 'O', m: 'O' } },
    invierno: { nombre: 'Invierno', cambios: { G: 'x', l: 'h', L: 'W', m: 'N', t: 'h' } },
  };

  // ───────────────────────────────────────────────────────────────────────
  // Herramientas de dibujo (para texturas que conviene generar)
  // ───────────────────────────────────────────────────────────────────────
  function azar(semilla) { // mulberry32: mismo resultado siempre
    let a = semilla >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function lienzo(w, h, c) { return Array.from({ length: h }, () => Array(w).fill(c || '.')); }
  function px(g, x, y, c) { if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = c; }
  function texto(g) { return g.map((fila) => fila.join('')); }
  function deTexto(filas) { return filas.map((f) => f.split('')); }
  function encima(g, filas, dx, dy) { // pega un dibujo encima, ignorando los "."
    filas.forEach((f, y) => f.split('').forEach((c, x) => { if (c !== '.') px(g, x + (dx || 0), y + (dy || 0), c); }));
    return g;
  }
  function copa(g, cx, cy, r, sombra, medio, luz, contorno) {
    // Copa redonda con luz arriba a la izquierda (el sol del norte, bajo) y sombra abajo.
    for (let y = -r - 1; y <= r + 1; y++) {
      for (let x = -r - 1; x <= r + 1; x++) {
        const d = Math.sqrt(x * x + y * y);
        if (d > r + 0.35) continue;
        let c = medio;
        if (d > r - 1.1 && (x + 2 * y) > 0) c = sombra;
        else if (d < r - 0.8 && x + y < -r * 0.45) c = luz;
        if (contorno && d > r - 0.6 && y > 0) c = contorno;
        px(g, cx + x, cy + y, c);
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────
  // Generadores de texturas de terreno (16 × 16)
  // ───────────────────────────────────────────────────────────────────────
  function agua(base, ola, brillo, semilla, desplazamiento) {
    const g = lienzo(16, 16, base);
    const r = azar(semilla);
    for (let i = 0; i < 6; i++) {
      const x = Math.floor(r() * 16), y = Math.floor(r() * 16), largo = 2 + Math.floor(r() * 3);
      for (let k = 0; k < largo; k++) px(g, (x + k + desplazamiento) % 16, y, ola);
      if (brillo && r() < 0.4) px(g, (x + 1 + desplazamiento) % 16, (y + 15) % 16, brillo);
    }
    return texto(g);
  }

  function aguaSomera(desplazamiento) {
    const g = deTexto(agua('F', 'C', 'D', 7, desplazamiento));
    const r = azar(91);
    for (let i = 0; i < 7; i++) px(g, Math.floor(r() * 16), Math.floor(r() * 16), 'P');
    return texto(g);
  }

  function cachiyuyo(desplazamiento) {
    // Algas largas que se mecen: tallos en "S" con flotadores.
    const g = deTexto(agua('C', 'D', null, 23, desplazamiento));
    const tallos = [[2, 0], [7, 3], [12, 1], [4, 9], [10, 8], [14, 11]];
    tallos.forEach(([x0, y0], i) => {
      for (let k = 0; k < 7; k++) {
        const x = x0 + Math.round(Math.sin((k + desplazamiento + i) * 0.9));
        px(g, x, (y0 + k) % 16, k === 3 ? 'O' : (k % 2 ? 'K' : 'm'));
      }
    });
    return texto(g);
  }

  function grava() {
    const g = lienzo(16, 16, 'g');
    const r = azar(5);
    for (let i = 0; i < 26; i++) {
      const x = Math.floor(r() * 16), y = Math.floor(r() * 16);
      px(g, x, y, 'P');
      if (r() < 0.5) px(g, x + 1, y, 'P');
      if (r() < 0.6) px(g, x, y + 1, 'p');
    }
    return texto(g);
  }

  function orilla() {
    // Costa: canto rodado arriba, espuma y agua somera abajo.
    const g = deTexto(grava());
    for (let x = 0; x < 16; x++) {
      const borde = 10 + Math.round(Math.sin(x * 0.8) * 1.2);
      for (let y = borde; y < 16; y++) px(g, x, y, y === borde ? 'E' : (y === borde + 1 ? 'D' : 'F'));
      px(g, x, borde - 1, x % 3 === 0 ? 'p' : 'P');
    }
    return texto(g);
  }

  function roca() {
    const g = deTexto(agua('C', 'D', null, 41, 0));
    copa(g, 8, 8, 5, 'k', 'p', 'P');
    copa(g, 4, 11, 3, 'k', 'p', 'P');
    copa(g, 12, 11, 3, 'k', 'p', 'P');
    [[3, 14], [4, 14], [5, 14], [10, 14], [11, 14], [12, 14], [13, 14], [6, 14], [7, 14]].forEach(([x, y]) => px(g, x, y, 'E'));
    return texto(g);
  }

  function bosque(sombra, medio, luz, semilla, conTroncos) {
    // Copas vistas desde arriba y un poco de frente, ordenadas de atrás hacia adelante.
    const g = lienzo(16, 16, sombra === 'v' ? 'z' : 'v');
    const r = azar(semilla);
    const centros = [[4, 2], [12, 3], [8, 6], [1, 8], [15, 9], [5, 11], [11, 12], [2, 16], [8, 17], [14, 16]];
    centros.forEach(([x, y]) => {
      const dx = Math.round(r() * 2 - 1);
      const radio = 3 + (r() < 0.25 ? 1 : 0);
      if (conTroncos) { px(g, x + dx, y + radio + 1, 'r'); px(g, x + dx, y + radio, 'r'); }
      copa(g, x + dx, y, radio, sombra, medio, luz);
      // repetir del otro lado para que el tile empalme (se puede poner uno al lado del otro)
      if (x + dx - radio < 0) copa(g, x + dx + 16, y, radio, sombra, medio, luz);
      if (x + dx + radio > 15) copa(g, x + dx - 16, y, radio, sombra, medio, luz);
    });
    return texto(g);
  }

  function turbal() {
    const g = lienzo(16, 16, 't');
    const r = azar(77);
    for (let i = 0; i < 40; i++) px(g, Math.floor(r() * 16), Math.floor(r() * 16), r() < 0.5 ? 'm' : 'q');
    // charcos de agua oscura
    [[3, 4], [4, 4], [5, 4], [4, 5], [11, 10], [12, 10], [12, 11], [13, 10], [8, 13], [9, 13]].forEach(([x, y]) => px(g, x, y, 'C'));
    [[3, 4], [12, 10], [8, 13]].forEach(([x, y]) => px(g, x, y, 'D'));
    return texto(g);
  }

  function montana() {
    const g = lienzo(16, 16, 'p');
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const alto = Math.abs(x - 7.5);
        if (y < alto * 1.6 - 2) px(g, x, y, '.');
        else if (y < 6 - alto * 0.3) px(g, x, y, x < 8 ? 'W' : 'N');
        else if (x > 8 && (x + y) % 3 === 0) px(g, x, y, 'k');
        else if (x < 6 && (x * 7 + y) % 5 === 0) px(g, x, y, 'P');
      }
    }
    return texto(g);
  }

  function niebla(densa, semilla) {
    // Humo de "lo que todavía no se vio". Nubes redondas que empalman entre sí.
    const g = lienzo(16, 16, densa ? 'h' : '.');
    if (densa) {
      const nubes = semilla % 2 ? [[5, 6, 5], [13, 13, 4]] : [[11, 5, 5], [3, 13, 4]];
      nubes.forEach(([x, y, r]) => { for (const dx of [-16, 0, 16]) for (const dy of [-16, 0, 16]) copa(g, x + dx, y + dy, r, 'h', 'H', 'H'); });
      return texto(g);
    }
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const tramado = (x + y) % 2 === 0;
        const nube = Math.sin(x * 0.7 + semilla) + Math.cos(y * 0.6 + semilla * 0.5);
        if (tramado && nube > -0.4) px(g, x, y, nube > 0.9 ? 'H' : 'h');
      }
    }
    return texto(g);
  }

  // ───────────────────────────────────────────────────────────────────────
  // Fuego grande (HUD): el fuego ES la barra de vida. 32 × 32, 5 niveles × 3 cuadros.
  // ───────────────────────────────────────────────────────────────────────
  function fuegoGrande(nivel, cuadro) {
    const g = lienzo(32, 32, '.');
    // Lecho de arcilla y grava, como el fogón de la canoa.
    for (let x = 6; x < 26; x++) {
      const y0 = 27 + (x < 8 || x > 23 ? 1 : 0);
      for (let y = y0; y < 31; y++) px(g, x, y, y === y0 ? 'P' : (y === 30 ? 'p' : 'g'));
    }
    // Leños cruzados.
    for (let k = 0; k < 13; k++) { px(g, 9 + k, 25 + Math.floor(k / 5), 'r'); px(g, 9 + k, 24 + Math.floor(k / 5), k % 4 ? 'r' : 'R'); }
    for (let k = 0; k < 13; k++) { px(g, 22 - k, 25 + Math.floor(k / 5), 'r'); px(g, 22 - k, 24 + Math.floor(k / 5), k % 4 ? 'r' : 'R'); }
    if (nivel === 0) { // apagado: ceniza y un hilo de humo
      for (let x = 10; x < 22; x++) px(g, x, 23, (x + cuadro) % 3 ? 'x' : 'h');
      for (let y = 6; y < 23; y++) px(g, 15 + Math.round(Math.sin(y * 0.5 + cuadro) * 1.5), y, y % 3 === cuadro % 3 ? '.' : 'h');
      return texto(g);
    }
    const alto = [0, 6, 11, 16, 22][nivel];
    const ancho = [0, 3, 4, 5.5, 7][nivel];
    const r = azar(100 + nivel * 10 + cuadro);
    for (let y = 0; y < alto; y++) {
      const t = y / alto; // 0 abajo, 1 arriba
      // Forma de gota: ancha abajo, en punta arriba.
      const semiancho = ancho * Math.pow(t < 0.25 ? 0.7 + 1.2 * t : (1 - t) / 0.75, 0.8);
      const centro = 16 + Math.sin(t * 5 + cuadro * 2.1) * t * 2.2;
      for (let x = Math.floor(centro - semiancho - 1); x <= Math.ceil(centro + semiancho + 1); x++) {
        const d = Math.abs(x + 0.5 - centro) / Math.max(semiancho, 0.5);
        const ruido = (r() - 0.5) * 0.35;
        if (d + ruido > 1) continue;
        let c = 'e';
        if (d + ruido < 0.85) c = 'f';
        if (d + ruido < 0.55 && t < 0.8) c = 'y';
        if (d + ruido < 0.28 && t < 0.55) c = 'Y';
        px(g, x, 24 - y, c);
      }
    }
    // Chispas que suben.
    for (let i = 0; i < nivel + 1; i++) px(g, 10 + Math.floor(r() * 12), 24 - alto - 1 - Math.floor(r() * 5), r() < 0.5 ? 'y' : 'Y');
    // Brasas en la base.
    for (let x = 11; x < 21; x++) if ((x + cuadro) % 2) px(g, x, 25, 'e');
    return texto(g);
  }

  // ───────────────────────────────────────────────────────────────────────
  // Sprites dibujados a mano
  // ───────────────────────────────────────────────────────────────────────

  // Canoa de corteza vista de costado: casco como "luna nueva con los extremos levantados",
  // fogón en el centro sobre un lecho de grava y arcilla, quien rema atrás y alguien adelante.
  // Las personas son siluetas sin rasgos hasta consultar a la comunidad (ver docs/04).
  const CANOA_BASE = [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '..zz........zz..',
    '..zz........zz..',
    '.uuu........uuu.',
    'r.uuu......uuu.r',
    'rr.uu.gggg.uu.rr',
    '.rRRRRRRRRRRRRr.',
    '..rrrRrrrrrrrr..',
    '....rRrrrrrrr...',
    '....R...........',
    '...RR...........',
  ];
  const CANOA_FUEGO = [
    ['.......h........', '........H.......', '.......h........', '........H.......', '................', '........y.......', '.......yy.......', '.......yfy......', '......yfYf......', '.......fYfe.....'],
    ['........h.......', '.......H........', '........h.......', '.......H........', '................', '.......y........', '.......yy.......', '......yfyy......', '......fYYf......', '......efYf......'],
    ['.......H........', '.......h........', '........H.......', '........h.......', '.........y......', '........y.......', '.......yfy......', '.......fYy......', '......yfYf......', '......efYfe.....'],
  ];
  function canoa(cuadro) {
    const g = deTexto(CANOA_BASE);
    encima(g, CANOA_FUEGO[cuadro], 0, 0);
    // ondas del agua alrededor del casco
    const ondas = [[1, 14], [2, 14], [10, 14], [11, 14], [14, 13]];
    ondas.forEach(([x, y]) => px(g, (x + cuadro) % 16, y, 'E'));
    return texto(g);
  }

  function canoaApagada() {
    const g = deTexto(CANOA_BASE);
    encima(g, ['................', '........h.......', '.......h........', '........h.......', '................', '................', '................', '................', '................', '......xxxx......'], 0, 0);
    return texto(g);
  }

  const SPRITES_MANO = {
    choza: [
      '.......H........',
      '........h.......',
      '.......H........',
      '........h.......',
      '.......rr.......',
      '......ruur......',
      '.....ruuuur.....',
      '....ruuRuuur....',
      '...ruuuuuRuur...',
      '..ruuRuuuuuuur..',
      '..ruuuuzzzuuur..',
      '.ruuuuzzzzzuuur.',
      '.ruuuuzzyzzuuur.',
      '.mrrrrzzzzzrrrm.',
      'mgmgmggggggmgmgm',
      '................',
    ],
    conchal: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '.....m....m.....',
      '...mwgwJwgwm....',
      '..mgwJwgwwJgm...',
      '.mwgm......mgwm.',
      '.gwJ........wJg.',
      '.mwg........gwm.',
      '..mgwJwgwwJgwm..',
      '...mgwgwJwgmm...',
      '.....m.mm.m.....',
      '................',
    ],
    lena: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '...........R....',
      '.....RRRRRRgR...',
      '....RgrrrrrrR...',
      '....RRRRRRRRR...',
      '..RRRRRRRRRRR...',
      '.RgrrrrrrrrrrR..',
      '.RRRRRRRRRRRRR..',
      '..rrrrrrrrrrr...',
      '................',
      '................',
    ],
    mejillones: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '....j...........',
      '...jJj..j.......',
      '..jjJj.jJj......',
      '..jjjj.jJjj.....',
      '.pjjj.jjjjj.j...',
      'ppPjjpjjjjpjJj..',
      'pPPPpppjjpPjjjp.',
      'kpPPPpppPPPPpppk',
      'EkkkkkkkkkkkkkkE',
      '.EE...EEE...EE..',
    ],
    calafate: [
      '................',
      '................',
      '................',
      '.......m........',
      '......mGm.......',
      '....GmGlGm......',
      '...GlbGlGbm.....',
      '...mbbJGbbGm....',
      '..GmbbGlbbJGm...',
      '..GlGmbbGmGlG...',
      '...GbbJGlbbGm...',
      '...mbbGmmbbG....',
      '....GmG.rGm.....',
      '........r.......',
      '......mgrgm.....',
      '................',
    ],
    'lobo-marino': [
      '................',
      '................',
      '................',
      '................',
      '..........uu....',
      '.........uRuu...',
      '.........uzuuk..',
      '.........uuuu...',
      '........uuuu....',
      '...uuuuuuuuR....',
      '..uuuRRuuuuR....',
      '.uuRRRuuuuu.....',
      'ku.kpppppppk....',
      'kpPPPpppPPPPpk..',
      'EkkkkkkkkkkkkkkE',
      '..EE....EEE..EE.',
    ],
    cormoran: [
      '................',
      '................',
      '................',
      '.......zz.......',
      '......zOzz......',
      '......zzzJ......',
      '.......zz.......',
      '.......wzz......',
      '......wwzzz.....',
      '......wwzzz.....',
      '......wwwzzz....',
      '.......wwzzz....',
      '........zzzz....',
      '.......O..O.....',
      '.....kpppppk....',
      '....kpPPpPPpk...',
    ],
    'pato-vapor': [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '..hh............',
      '.hHzh...........',
      'OOhhh...........',
      '...hhhhhhhh.....',
      '...hHHHHhhhh....',
      '...hhHHHHhhhhh..',
      '..DhhhhhhhhhhD..',
      '.DDEEDDDDDDEEDD.',
      '................',
    ],
    ballena: [
      '................',
      '................',
      '.....N...N......',
      '......N.N.......',
      '.......N........',
      '.......N........',
      '................',
      '................',
      '.....zzzzzz.....',
      '...zzzzhzzzzz...',
      '..zzzhzzzzzzzz..',
      '.zzzzzzzzzzzzzz.',
      'EEzzzzzzzzzzzzEE',
      'DEEEDDDDDDDDEEED',
      '.D..DD....DD..D.',
      '................',
    ],
    'arbol-bandera': [
      '................',
      '................',
      '.......GGlll....',
      '.....GGllLLlll..',
      '....GllLlll.....',
      '...Gll..........',
      '.....rGGll......',
      '......rGllLll...',
      '.......r........',
      '.......r........',
      '......r.........',
      '......r.........',
      '.....rr.........',
      '....mrrm........',
      '...mmmgmm.......',
      '................',
    ],
  };

  // Íconos de interfaz (16 × 16). Contorno de carbón para que se lean sobre cualquier fondo.
  const ICONOS = {
    'icono-fuego': [
      '................',
      '.......z........',
      '......zyz.......',
      '.....zyyz.......',
      '.....zyfyz......',
      '....zyffyz.z....',
      '....zfYffyzyz...',
      '...zffYYfffyz...',
      '...zfYYYYffyz...',
      '...zfYYYYYffz...',
      '...zffYYYYffz...',
      '....zffYYffz....',
      '.....zzzzzz.....',
      '...zRRRRRRRRz...',
      '..zRrrrrrrrrRz..',
      '...zzzzzzzzzz...',
    ],
    'icono-lena': [
      '................',
      '................',
      '................',
      '....zzzzzzzzz...',
      '...zgRRRRRRRRz..',
      '...zrrrrrrrrrz..',
      '....zzzzzzzzz...',
      '..zzzzzzzzzz....',
      '.zgRRRRRRRRRz...',
      '.zrrrrrrrrrrz...',
      '..zzzzzzzzzzz...',
      '...zzzzzzzzzzz..',
      '..zgRRRRRRRRRRz.',
      '..zrrrrrrrrrrrz.',
      '...zzzzzzzzzzz..',
      '................',
    ],
    'icono-comida': [
      '................',
      '.......zz.......',
      '......zjjz......',
      '.....zjJjjz.....',
      '.....zjJjjz.....',
      '....zjJjjjjz....',
      '....zjJjJjjz....',
      '...zjJjjJjjjz...',
      '...zjJjjJjjjz...',
      '...zjjjJjjJjz...',
      '..zjjjjJjjJjjz..',
      '..zjjjjjjjJjjz..',
      '..zjjjjjjjjjjz..',
      '...zjjjjjjjjz...',
      '....zzzzzzzz....',
      '................',
    ],
    'icono-refugio': [
      '.......zz.......',
      '......zHz.......',
      '.......zz.......',
      '......zrrz......',
      '.....zruurz.....',
      '....zruuuurz....',
      '...zruuRuuurz...',
      '..zruuuuuRuurz..',
      '..zruuuuuuuurz..',
      '.zruuuzzzzuuurz.',
      '.zruuzzyyzzuurz.',
      '.zruuzyYYyzuurz.',
      '.zrrrzyyyyzrrrz.',
      '.zzzzzzzzzzzzzz.',
      '................',
      '................',
    ],
    'icono-viento': [
      '................',
      '................',
      '.........zzz....',
      '........zNNNz...',
      '.zzzzzzzzzzNNz..',
      'zNNNNNNNNNNNNz..',
      '.zzzzzzzzzzzz...',
      '................',
      '..zzzzzzzzzzzz..',
      '.zNNNNNNNNNNNNz.',
      '..zzzzzzzzzNNz..',
      '..........zNz...',
      '...........z....',
      '................',
      '................',
      '................',
    ],
    'icono-lluvia': [
      '................',
      '.....zzzz.......',
      '....zNNNNzzz....',
      '..zzNNNNNNNNz...',
      '.zNNNNNNNNNNNz..',
      '.zNHNNNNNNNHHz..',
      '..zHHHHHHHHHz...',
      '...zzzzzzzzz....',
      '................',
      '...z...z...z....',
      '..zD..zD..zD....',
      '..zD..zD..zD....',
      '..zz..zz..zz....',
      '................',
      '................',
      '................',
    ],
    'icono-frio': [
      '................',
      '.......z........',
      '.....z.z.z......',
      '......zWz.......',
      '..z...zWz...z...',
      '...z..zWz..z....',
      '....zzzWzzz.....',
      '.zzzWWWWWWWzzz..',
      '....zzzWzzz.....',
      '...z..zWz..z....',
      '..z...zWz...z...',
      '......zWz.......',
      '.....z.z.z......',
      '.......z........',
      '................',
      '................',
    ],
    'icono-saber': [
      '................',
      '..zzzzzzzzzzz...',
      '..ziiiiiiiiiz...',
      '..ziqqqqqqqiz...',
      '..ziiiiiiiiiz...',
      '..ziiiiyiiiiz...',
      '..ziiiyYyiiiz...',
      '..ziiyYYfyiiz...',
      '..ziiyYYYyiiz...',
      '..ziiifYfiiiz...',
      '..ziiiiiiiiiz...',
      '..ziIIIIIIiiz...',
      '..ziIIIIiiiiz...',
      '..ziiiiiiiiiz...',
      '..zzzzzzzzzzz...',
      '................',
    ],
    'icono-codice': [
      '................',
      '.....zzzzzzzzzz.',
      '.....ziiiiiiiiz.',
      '...zzzzzzzzzziz.',
      '...ziiiiiiiiziz.',
      '.zzzzzzzzzzzziz.',
      '.ziiiiiiiiiziiz.',
      '.ziqqqqqqqiziz..',
      '.ziiiiyiiiizz...',
      '.ziiiyYyiiiz....',
      '.ziiiyYyiiiz....',
      '.ziiiiiiiiiz....',
      '.ziIIIIIIiiz....',
      '.ziiiiiiiiiz....',
      '.zzzzzzzzzzz....',
      '................',
    ],
    'icono-generacion': [
      '................',
      '......zzzzz.....',
      '....zz.....zz...',
      '...z.........z..',
      '..z...........z.',
      '..z...........z.',
      '..zz..........z.',
      '.zyz.........zz.',
      '.zyyz.......zYz.',
      'zyfyz.......zyz.',
      'zfYyfz.....zyYz.',
      'zfYYfz.....zfyz.',
      'zfYYfz......zz..',
      '.zffz...........',
      '.zzzz...........',
      '................',
    ],
    'icono-remo': [
      '................',
      '.............zz.',
      '............zRz.',
      '...........zRz..',
      '..........zRz...',
      '.........zRz....',
      '........zRz.....',
      '.......zRz......',
      '......zRz.......',
      '....zzRz........',
      '...zRRRz........',
      '..zRRRRz........',
      '.zRRRRz.........',
      '.zRRRz..........',
      '..zzz...........',
      '................',
    ],
    'icono-calma': [
      '................',
      '.......z........',
      '...z...z...z....',
      '....z.zzz.z.....',
      '......zYz.......',
      '.....zYYYz......',
      '.zzzzYYYYYzzzz..',
      '.....zYYYz......',
      '......zYz.......',
      '....z.zzz.z.....',
      '...z...z...z....',
      '.......z........',
      '................',
      '..zzzzzzzzzzzz..',
      '.zDDDDDDDDDDDDz.',
      '..zzzzzzzzzzzz..',
    ],
    // Hongos de árbol (Cyttaria, en ramas de Nothofagus): se comían y se guardaban secos (Cooper 1946, p. 84).
    'icono-hongo': [
      '................',
      '..........zzz...',
      '.........zOOYz..',
      '....zzz.zOqOOz..',
      '...zOYOzzOOqOz..',
      '..zOqOOOzzOOz...',
      '..zOOOqOz.zz....',
      '..zqOOOOzrr.....',
      '...zOqOzrrz.....',
      'zz..zzzrrz.zzz..',
      'zrrrrrrrz.zOYOz.',
      '.zzzzzrrrrzOqOOz',
      '......zzzzzOOqOz',
      '..........zqOOz.',
      '...........zzz..',
      '................',
    ],
    // Pirita: con un pedernal saca chispas para encender el fuego. Solo se hallaba en ciertos lugares (Cooper 1946, p. 91 y 95).
    'icono-pirita': [
      '..........y.....',
      '.....y...yYy....',
      '......y...y..y..',
      '....zzzzzzz.....',
      '...zYYYYYYOz....',
      '..zYYYYYYOKz....',
      '.zzzzzzzzOKKz...',
      '.zYYYOOOzKKKz...',
      '.zYYOOOKzKKz....',
      '.zYOOOKKzKz.....',
      '.zOOOKKKzz......',
      '.zzzzzzzz.zzzz..',
      '.........zpPPPz.',
      '........zpPPPpz.',
      '........zppppz..',
      '.........zzzz...',
    ],
    'icono-calafate': [
      '................',
      '.........zzz....',
      '........zLlGz...',
      '.......zrlGGz...',
      '..zzz.zr.zzz....',
      '.zbbbzzr........',
      'zbJbbbzrzzz.....',
      'zbbbbbzzbbbz....',
      '.zbbbzzbJbbbz...',
      '..zzzzbbbbbbz...',
      '...zbbzbbbbz....',
      '..zbJbbzzzz.....',
      '..zbbbbbz.......',
      '...zbbbz........',
      '....zzz.........',
      '................',
    ],
  };

  // ───────────────────────────────────────────────────────────────────────
  // Catálogo final: id → { w, h, cuadros: [filas...], categoria, descripcion }
  // ───────────────────────────────────────────────────────────────────────
  const SPRITES = {};
  function sumar(id, categoria, descripcion, cuadros) {
    const h = cuadros[0].length, w = cuadros[0][0].length;
    cuadros.forEach((filas, i) => {
      if (filas.length !== h) throw new Error(id + ': el cuadro ' + i + ' tiene ' + filas.length + ' filas, se esperaban ' + h);
      filas.forEach((f, y) => {
        if (f.length !== w) throw new Error(id + ': fila ' + y + ' del cuadro ' + i + ' mide ' + f.length + ', se esperaban ' + w);
        for (const c of f) if (c !== '.' && !COLOR[c]) throw new Error(id + ': color desconocido "' + c + '"');
      });
    });
    SPRITES[id] = { w, h, cuadros, categoria, descripcion };
  }

  // Terreno
  sumar('mar-hondo', 'terreno', 'Canal abierto y profundo. Cruzarlo con viento es arriesgado.', [agua('B', 'C', null, 11, 0), agua('B', 'C', null, 11, 1)]);
  sumar('mar', 'terreno', 'Agua del canal.', [agua('C', 'D', 'E', 13, 0), agua('C', 'D', 'E', 13, 1)]);
  sumar('agua-somera', 'terreno', 'Agua baja cerca de la costa.', [aguaSomera(0), aguaSomera(1)]);
  sumar('cachiyuyo', 'terreno', 'Bosque de algas en el agua baja.', [cachiyuyo(0), cachiyuyo(1)]);
  sumar('orilla', 'terreno', 'Playa de canto rodado con la ola.', [orilla()]);
  sumar('grava', 'terreno', 'Playa de grava, buen lugar para varar la canoa.', [grava()]);
  sumar('roca', 'terreno', 'Roca en el agua.', [roca()]);
  sumar('bosque-guindo', 'terreno', 'Bosque de guindo, siempreverde, junto al mar.', [bosque('v', 'V', 'Q', 3, false)]);
  sumar('bosque-lenga', 'terreno', 'Bosque de lenga: cambia de color con la estación.', [bosque('G', 'l', 'L', 9, true)]);
  sumar('turbal', 'terreno', 'Turbal de musgo rojizo con charcos.', [turbal()]);
  sumar('montana', 'terreno', 'Cumbre nevada. No se puede cruzar.', [montana()]);
  sumar('niebla', 'terreno', 'Humo de lo que todavía no se vio (niebla de guerra).', [niebla(true, 2), niebla(true, 5)]);
  sumar('niebla-borde', 'terreno', 'Borde de la niebla, tramado.', [niebla(false, 3), niebla(false, 6)]);

  // Lugares y objetos
  sumar('choza', 'lugar', 'Choza de ramas cubierta con cueros, con salida para el humo.', [SPRITES_MANO.choza]);
  sumar('conchal', 'lugar', 'Conchal: anillo de valvas donde hubo un campamento.', [SPRITES_MANO.conchal]);
  sumar('arbol-bandera', 'lugar', 'Árbol torcido por el viento del oeste.', [SPRITES_MANO['arbol-bandera']]);
  sumar('lena', 'recurso', 'Leña para el fuego.', [SPRITES_MANO.lena]);
  sumar('mejillones', 'recurso', 'Banco de mejillones en la roca.', [SPRITES_MANO.mejillones]);
  sumar('calafate', 'recurso', 'Arbusto de calafate con frutos.', [SPRITES_MANO.calafate]);

  // Fauna (nunca enemiga: es parte del paisaje y del sustento)
  sumar('lobo-marino', 'fauna', 'Lobo marino sobre la roca.', [SPRITES_MANO['lobo-marino']]);
  sumar('cormoran', 'fauna', 'Cormorán posado.', [SPRITES_MANO.cormoran]);
  sumar('pato-vapor', 'fauna', 'Pato vapor, no vuela.', [SPRITES_MANO['pato-vapor']]);
  sumar('ballena', 'fauna', 'Lomo de ballena y su soplido.', [SPRITES_MANO.ballena]);

  // La canoa con el fuego (protagonista)
  sumar('canoa', 'canoa', 'Canoa de corteza con el fuego encendido a bordo.', [canoa(0), canoa(1), canoa(2)]);
  sumar('canoa-apagada', 'canoa', 'La canoa cuando el fuego se apagó.', [canoaApagada()]);

  // El fuego del HUD: 5 niveles
  const NIVELES = ['apagado', 'brasas', 'debil', 'parejo', 'vivo'];
  NIVELES.forEach((n, i) => sumar('fuego-' + n, 'hud', 'Fuego del HUD, nivel ' + i + ' de 4 (' + n + ').', [fuegoGrande(i, 0), fuegoGrande(i, 1), fuegoGrande(i, 2)]));

  // Íconos
  const NOMBRES_ICONOS = {
    'icono-fuego': 'Fuego', 'icono-lena': 'Leña', 'icono-comida': 'Comida', 'icono-refugio': 'Refugio',
    'icono-viento': 'Viento', 'icono-lluvia': 'Lluvia', 'icono-frio': 'Frío', 'icono-saber': 'Carta de saber',
    'icono-codice': 'Códice', 'icono-generacion': 'Generación (lo que se hereda)', 'icono-remo': 'Remar (mover)', 'icono-calma': 'Calma', 'icono-calafate': 'Calafate', 'icono-hongo': 'Hongos de árbol', 'icono-pirita': 'Pirita (piedra de fuego)',
  };
  Object.keys(ICONOS).forEach((id) => sumar(id, 'icono', NOMBRES_ICONOS[id], [ICONOS[id]]));

  // ───────────────────────────────────────────────────────────────────────
  // Utilidades para quien programa
  // ───────────────────────────────────────────────────────────────────────
  function hexARgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

  /** Devuelve un cuadro como matriz de colores hex (o null si es transparente), aplicando la estación. */
  function pixeles(id, cuadro, estacion) {
    const s = SPRITES[id];
    if (!s) throw new Error('No existe el sprite ' + id);
    const cambios = (ESTACIONES[estacion || 'verano'] || ESTACIONES.verano).cambios;
    return s.cuadros[(cuadro || 0) % s.cuadros.length].map((f) => f.split('').map((c) => (c === '.' ? null : COLOR[cambios[c] || c])));
  }

  /** Solo navegador: dibuja un sprite en un <canvas> nuevo (escala entera, sin suavizado). */
  function aCanvas(id, cuadro, estacion, escala) {
    const e = escala || 1;
    const m = pixeles(id, cuadro, estacion);
    const cv = document.createElement('canvas');
    cv.width = m[0].length * e; cv.height = m.length * e;
    const cx = cv.getContext('2d');
    m.forEach((f, y) => f.forEach((c, x) => { if (c) { cx.fillStyle = c; cx.fillRect(x * e, y * e, e, e); } }));
    return cv;
  }

  /** Contraste WCAG entre dos hex (para revisar accesibilidad). */
  function contraste(a, b) {
    const lum = (hex) => {
      const [r, g, bb] = hexARgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * r + 0.7152 * g + 0.0722 * bb;
    };
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  }

  const api = { PALETA, COLOR, ESTACIONES, SPRITES, pixeles, aCanvas, contraste, hexARgb, TAMANO_CELDA: 16 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_ARTE = api;
})(typeof window !== 'undefined' ? window : globalThis);
