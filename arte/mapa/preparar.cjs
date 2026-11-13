#!/usr/bin/env node
/*
 * Tierra de los Humos · Prepara las costas del mapa de territorios
 *
 * Toma las costas de Natural Earth (dominio público, escala 1:10 millones, vía el
 * paquete world-atlas), recorta la zona de Tierra del Fuego y los canales, simplifica
 * las líneas y guarda el resultado en arte/mapa/costas.js (unos pocos KB).
 *
 * Solo hace falta correrlo para regenerar las costas:
 *   npm i --no-save world-atlas@2.0.2 topojson-client@3.1.0
 *   node arte/mapa/preparar.cjs
 *
 * Licencia: MIT.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const tierras = require('world-atlas/land-10m.json');

// Recorte: de la península Brecknock y los canales del oeste hasta la Isla de los Estados.
const CAJA = { oeste: -73.2, este: -63.6, sur: -56.2, norte: -52.0 };
const TOLERANCIA = 0.005; // grados (~500 m)

function recortar(anillo) { // Sutherland–Hodgman contra un rectángulo
  const bordes = [
    (p) => p[0] >= CAJA.oeste, (p) => p[0] <= CAJA.este, (p) => p[1] >= CAJA.sur, (p) => p[1] <= CAJA.norte,
  ];
  const corte = [
    (a, b) => { const t = (CAJA.oeste - a[0]) / (b[0] - a[0]); return [CAJA.oeste, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (CAJA.este - a[0]) / (b[0] - a[0]); return [CAJA.este, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (CAJA.sur - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), CAJA.sur]; },
    (a, b) => { const t = (CAJA.norte - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), CAJA.norte]; },
  ];
  let salida = anillo;
  for (let k = 0; k < 4 && salida.length; k++) {
    const entrada = salida; salida = [];
    for (let i = 0; i < entrada.length; i++) {
      const a = entrada[(i + entrada.length - 1) % entrada.length], b = entrada[i];
      const ad = bordes[k](a), bd = bordes[k](b);
      if (bd) { if (!ad) salida.push(corte[k](a, b)); salida.push(b); }
      else if (ad) salida.push(corte[k](a, b));
    }
  }
  return salida;
}
function simplificar(puntos, tol) { // Douglas–Peucker
  if (puntos.length < 4) return puntos;
  const dist = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy; if (!l) return Math.hypot(p[0] - a[0], p[1] - a[1]); const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
  let max = 0, idx = 0;
  for (let i = 1; i < puntos.length - 1; i++) { const d = dist(puntos[i], puntos[0], puntos[puntos.length - 1]); if (d > max) { max = d; idx = i; } }
  if (max <= tol) return [puntos[0], puntos[puntos.length - 1]];
  return simplificar(puntos.slice(0, idx + 1), tol).slice(0, -1).concat(simplificar(puntos.slice(idx), tol));
}
const area = (r) => Math.abs(r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);

const geo = topojson.feature(tierras, tierras.objects.land);
const anillos = [];
for (const f of geo.features) {
  const polis = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poli of polis) {
    const exterior = poli[0];
    if (!exterior.some((p) => p[0] > CAJA.oeste - 2 && p[0] < CAJA.este + 2 && p[1] > CAJA.sur - 2 && p[1] < CAJA.norte + 2)) continue;
    let r = recortar(exterior.slice(0, -1));
    if (r.length < 3) continue;
    r = simplificar(r.concat([r[0]]), TOLERANCIA).slice(0, -1);
    if (r.length < 3 || area(r) < 0.0004) continue; // islotes de menos de ~3 km²
    anillos.push(r.map((p) => [+p[0].toFixed(3), +p[1].toFixed(3)]));
  }
}
const salida = `/*
 * Costas de Tierra del Fuego y los canales, para el mapa de territorios.
 * Datos: Natural Earth (dominio público), escala 1:10 millones, vía world-atlas 2.0.2.
 * Generado por arte/mapa/preparar.cjs. No editar a mano.
 */
(function (raiz) {
  const COSTAS = { caja: ${JSON.stringify(CAJA)}, anillos: ${JSON.stringify(anillos)} };
  if (typeof module !== 'undefined' && module.exports) module.exports = COSTAS; else raiz.TDH_COSTAS = COSTAS;
})(typeof window !== 'undefined' ? window : globalThis);
`;
fs.writeFileSync(path.join(__dirname, 'costas.js'), salida);
console.log('Listo: ' + anillos.length + ' islas y costas, ' + anillos.reduce((s, r) => s + r.length, 0) + ' puntos, ' + Math.round(salida.length / 1024) + ' KB');
