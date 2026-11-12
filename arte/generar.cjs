#!/usr/bin/env node
/*
 * Tierra de los Humos · Genera los PNG del arte a partir de arte/fuente/arte.js
 *
 * Uso (desde la raíz del repo):   node arte/generar.cjs
 * No necesita instalar nada: usa solo Node (v18 o más nuevo).
 *
 * Genera:
 *   arte/sprites/<id>.png              cada sprite, con sus cuadros uno al lado del otro
 *   arte/hoja-sprites[-estacion].png   todos los sprites juntos (verano, otoño, invierno)
 *   arte/hoja-sprites.json             dónde está cada cuadro dentro de la hoja
 *   arte/paleta/paleta.{png,gpl,hex,json}  la paleta para Aseprite, GIMP, Krita, Lospec
 *
 * Licencia del código: MIT.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const arte = require('./fuente/arte.js');

const RAIZ = __dirname;

// ── PNG mínimo (RGBA, sin dependencias) ──────────────────────────────────
const TABLA_CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function bloque(tipo, datos) {
  const largo = Buffer.alloc(4); largo.writeUInt32BE(datos.length);
  const td = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([largo, td, crc]);
}
function png(ancho, alto, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0); ihdr.writeUInt32BE(alto, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const crudo = Buffer.alloc((ancho * 4 + 1) * alto);
  for (let y = 0; y < alto; y++) {
    crudo[y * (ancho * 4 + 1)] = 0;
    rgba.copy(crudo, y * (ancho * 4 + 1) + 1, y * ancho * 4, (y + 1) * ancho * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloque('IHDR', ihdr),
    bloque('IDAT', zlib.deflateSync(crudo, { level: 9 })),
    bloque('IEND', Buffer.alloc(0)),
  ]);
}

class Imagen {
  constructor(w, h) { this.w = w; this.h = h; this.datos = Buffer.alloc(w * h * 4); }
  pintar(x, y, hex, escala) {
    const [r, g, b] = arte.hexARgb(hex);
    const e = escala || 1;
    for (let j = 0; j < e; j++) for (let i = 0; i < e; i++) {
      const px = x * e + i, py = y * e + j;
      if (px < 0 || py < 0 || px >= this.w || py >= this.h) continue;
      const k = (py * this.w + px) * 4;
      this.datos[k] = r; this.datos[k + 1] = g; this.datos[k + 2] = b; this.datos[k + 3] = 255;
    }
  }
  cuadro(id, n, estacion, ox, oy) {
    arte.pixeles(id, n, estacion).forEach((fila, y) => fila.forEach((c, x) => { if (c) this.pintar(ox + x, oy + y, c); }));
  }
  guardar(ruta) { fs.mkdirSync(path.dirname(ruta), { recursive: true }); fs.writeFileSync(ruta, png(this.w, this.h, this.datos)); }
}

// ── 1. Sprites sueltos ───────────────────────────────────────────────────
const ids = Object.keys(arte.SPRITES);
for (const id of ids) {
  const s = arte.SPRITES[id];
  const img = new Imagen(s.w * s.cuadros.length, s.h);
  s.cuadros.forEach((_, n) => img.cuadro(id, n, 'verano', n * s.w, 0));
  img.guardar(path.join(RAIZ, 'sprites', id + '.png'));
}

// ── 2. Hoja de sprites + atlas JSON ──────────────────────────────────────
// Empaquetado simple por filas: ancho fijo de 256 px, cada sprite ocupa sus cuadros en fila.
const ANCHO_HOJA = 256;
let x = 0, y = 0, altoFila = 0;
const atlas = { meta: { imagen: 'hoja-sprites.png', celda: arte.TAMANO_CELDA, estaciones: Object.keys(arte.ESTACIONES), licencia: 'CC BY-SA 4.0', fuente: 'arte/fuente/arte.js' }, sprites: {} };
for (const id of ids) {
  const s = arte.SPRITES[id];
  const anchoTotal = s.w * s.cuadros.length;
  if (x + anchoTotal > ANCHO_HOJA) { x = 0; y += altoFila; altoFila = 0; }
  atlas.sprites[id] = {
    categoria: s.categoria,
    descripcion: s.descripcion,
    cuadros: s.cuadros.map((_, n) => ({ x: x + n * s.w, y, w: s.w, h: s.h })),
  };
  x += anchoTotal; altoFila = Math.max(altoFila, s.h);
}
const ALTO_HOJA = y + altoFila;
for (const estacion of Object.keys(arte.ESTACIONES)) {
  const hoja = new Imagen(ANCHO_HOJA, ALTO_HOJA);
  for (const id of ids) atlas.sprites[id].cuadros.forEach((r, n) => hoja.cuadro(id, n, estacion, r.x, r.y));
  hoja.guardar(path.join(RAIZ, estacion === 'verano' ? 'hoja-sprites.png' : 'hoja-sprites-' + estacion + '.png'));
}
fs.writeFileSync(path.join(RAIZ, 'hoja-sprites.json'), JSON.stringify(atlas, null, 2) + '\n');

// ── 3. Paleta en formatos para programas de dibujo ───────────────────────
const dirPaleta = path.join(RAIZ, 'paleta');
fs.mkdirSync(dirPaleta, { recursive: true });
fs.writeFileSync(path.join(dirPaleta, 'paleta.hex'), arte.PALETA.map((c) => c.hex.slice(1)).join('\n') + '\n');
fs.writeFileSync(path.join(dirPaleta, 'paleta.gpl'),
  'GIMP Palette\nName: Tierra de los Humos - Canales\nColumns: 6\n#\n' +
  arte.PALETA.map((c) => { const [r, g, b] = arte.hexARgb(c.hex); return `${String(r).padStart(3)} ${String(g).padStart(3)} ${String(b).padStart(3)}\t${c.id}`; }).join('\n') + '\n');
fs.writeFileSync(path.join(dirPaleta, 'paleta.json'), JSON.stringify(arte.PALETA, null, 2) + '\n');
const T = 8; // tamaño de cada muestra
const muestra = new Imagen(arte.PALETA.length * T, T);
arte.PALETA.forEach((c, i) => { for (let yy = 0; yy < T; yy++) for (let xx = 0; xx < T; xx++) muestra.pintar(i * T + xx, yy, c.hex); });
muestra.guardar(path.join(dirPaleta, 'paleta.png'));

// ── 4. Logo, favicon e imagen para compartir ────────────────────────────
// Letras pixel propias (5 × 7), solo las que usa el nombre. Así el logo no depende de ninguna tipografía.
const LETRAS = {
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  ' ': ['...', '...', '...', '...', '...', '...', '...'],
};
function textoPixel(texto) { // devuelve una lista de [x, y] y el ancho total
  const pts = []; let x = 0;
  for (const ch of texto) { const g = LETRAS[ch]; g.forEach((f, y) => f.split('').forEach((c, i) => { if (c === '#') pts.push([x + i, y]); })); x += g[0].length + 1; }
  return { pts, ancho: x - 1 };
}

// Lienzo lógico de baja resolución que después se agranda (todo queda en grilla).
class Pixeles {
  constructor(w, h) { this.w = w; this.h = h; this.m = Array.from({ length: h }, () => Array(w).fill(null)); }
  p(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < this.w && y < this.h && c) this.m[y][x] = arte.COLOR[c] || c; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.p(x + i, y + j, c); }
  sprite(id, n, x0, y0, e) { arte.pixeles(id, n).forEach((f, y) => f.forEach((c, x) => { if (c) this.rect(x0 + x * e, y0 + y * e, e, e, c); })); }
  texto(t, x0, y0, e, c, sombra) {
    const { pts } = textoPixel(t);
    if (sombra) pts.forEach(([x, y]) => this.rect(x0 + x * e + Math.max(1, e / 2), y0 + y * e + Math.max(1, e / 2), e, e, sombra));
    pts.forEach(([x, y]) => this.rect(x0 + x * e, y0 + y * e, e, e, c));
  }
  humo(x0, y0, alto, deriva) { // columna de humo: bocanadas que crecen y se deshacen
    for (let i = 0; i < alto; i += 2) {
      const t = i / alto, r = 1 + Math.round(t * Math.min(6, alto / 8));
      const cx = x0 + Math.round(Math.sin(i * 0.35) * 1.5 + t * t * deriva);
      for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
        if (xx * xx + yy * yy > r * r) continue;
        if (t > 0.55 && (xx + yy + i) % 2) continue;
        this.p(cx + xx, y0 - i + yy, t > 0.7 ? 'h' : (t > 0.3 ? 'H' : 'N'));
      }
    }
  }
  png(escala) {
    const img = new Imagen(this.w * escala, this.h * escala);
    this.m.forEach((f, y) => f.forEach((c, x) => { if (c) img.pintar(x, y, c, escala); }));
    return img;
  }
  svg(escala, titulo) { // rectángulos unidos por filas para que pese poco
    let r = '';
    this.m.forEach((f, y) => { let x = 0; while (x < this.w) { const c = f[x]; if (!c) { x++; continue; } let k = x; while (k < this.w && f[k] === c) k++; r += `<rect x="${x}" y="${y}" width="${k - x}" height="1" fill="${c}"/>`; x = k; } });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" width="${this.w * escala}" height="${this.h * escala}" shape-rendering="crispEdges" role="img" aria-label="${titulo}"><title>${titulo}</title>${r}</svg>\n`;
  }
}

function paisaje(L, horizonte) { // cielo cubierto, cordillera nevada, bosque de guindo y canal
  const W = L.w, H = L.h;
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const tramado = (x, y) => (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
  for (let y = 0; y < horizonte; y++) for (let x = 0; x < W; x++) { // cielo: tres bandas con tramado en los bordes
    const t = y / horizonte * 3 + tramado(x, y) * 0.9 - 0.45;
    L.p(x, y, t < 1 ? 'h' : (t < 2 ? 'H' : 'N'));
  }
  const alturas = [];
  for (let x = 0; x < W + 1; x++) alturas.push(16 + Math.round(Math.max(0, Math.sin(x * 0.05 + 0.6)) * 18 + Math.sin(x * 0.17) * 4 + Math.sin(x * 0.41) * 1.5));
  const lineaNieve = horizonte - 27;
  for (let x = 0; x < W; x++) { // cordillera: cara al oeste iluminada, al este en sombra
    const sombra = alturas[x + 1] < alturas[x] || (x > 0 && alturas[x - 1] > alturas[x] && alturas[x + 1] <= alturas[x]);
    for (let y = horizonte - alturas[x]; y < horizonte; y++) {
      const nieve = y < lineaNieve + ((x * 7) % 3);
      L.p(x, y, nieve ? (sombra ? 'N' : 'W') : (sombra ? 'k' : 'p'));
    }
  }
  for (let x = 0; x < W; x++) { // bosque de la costa
    const alto = 4 + ((x * 37) % 7 < 3 ? 2 : 0) + Math.round(Math.sin(x * 0.7) * 1.5);
    for (let y = horizonte - alto; y < horizonte + 2; y++) L.p(x, y, y < horizonte - alto + 2 ? 'V' : 'v');
  }
  for (let y = horizonte + 2; y < H; y++) for (let x = 0; x < W; x++) { // canal
    const t = (y - horizonte) / (H - horizonte);
    L.p(x, y, t + tramado(x, y) * 0.15 > 0.62 ? 'B' : 'C');
    if ((x * 13 + y * 7) % 29 === 0) { L.p(x, y, 'D'); L.p(x + 1, y, 'D'); if (t < 0.4) L.p(x + 2, y, 'E'); }
  }
}

const dirLogo = path.join(RAIZ, 'logo');
fs.mkdirSync(dirLogo, { recursive: true });
const NOMBRE = 'Tierra de los Humos';

// Imagen para compartir (1200 × 630): 200 × 105 píxeles lógicos, escala 6.
{
  const L = new Pixeles(200, 105);
  paisaje(L, 58);
  L.humo(178, 54, 30, 12); // otro fogón a lo lejos: por eso la "Tierra de los Humos"
  L.humo(132, 55, 22, 8);
  L.sprite('canoa', 0, 14, 42, 3);
  L.humo(39, 55, 56, 40);
  L.texto('TIERRA DE', 92, 66, 2, 'i', 'n');
  L.texto('LOS HUMOS', 92, 84, 2, 'Y', 'n');
  L.png(6).guardar(path.join(dirLogo, 'compartir.png'));
}
// Logo (emblema + nombre), para el README y la presentación.
{
  const L = new Pixeles(104, 36);
  L.rect(0, 0, 104, 36, 'n');
  for (let y = 27; y < 36; y++) for (let x = 0; x < 36; x++) L.p(x, y, (x * 13 + y * 7) % 11 === 0 ? 'D' : 'B');
  L.sprite('canoa', 0, 2, 4, 2);
  L.texto('TIERRA DE', 40, 7, 1, 'i');
  L.texto('LOS HUMOS', 40, 18, 1, 'Y');
  for (let x = 40; x < 92; x += 2) L.p(x, 28, 'q');
  fs.writeFileSync(path.join(dirLogo, 'logo.svg'), L.svg(4, NOMBRE));
  L.png(4).guardar(path.join(dirLogo, 'logo.png'));
}
// Favicon: la canoa con su fuego sobre el agua.
{
  const L = new Pixeles(16, 16);
  L.rect(0, 0, 16, 16, 'n'); L.rect(0, 11, 16, 5, 'B');
  L.sprite('canoa', 0, 0, 0, 1);
  fs.writeFileSync(path.join(dirLogo, 'favicon.svg'), L.svg(2, NOMBRE));
  L.png(2).guardar(path.join(dirLogo, 'favicon-32.png'));
  L.png(12).guardar(path.join(dirLogo, 'icono-192.png'));
}

console.log(`Listo: ${ids.length} sprites, hoja de ${ANCHO_HOJA}×${ALTO_HOJA} px en 3 estaciones, paleta de ${arte.PALETA.length} colores.`);
