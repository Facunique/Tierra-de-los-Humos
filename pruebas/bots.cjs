// Dos jugadores automáticos para medir el balance del núcleo (lo usa balance.test.cjs).
// - directo: rema derecho al destino y no junta nada.
// - cuidadoso: junta lo que tiene cerca, aviva el fuego y acampa de noche.
// No son parte del juego. Licencia: MIT.
'use strict';
const TDH_PARTIDA = require('../juego/nucleo/partida.js');
const MAPA = require('../juego/nucleo/mapa.js');

const V4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const cerca = (o, x, y) => Math.abs(o.x - x) + Math.abs(o.y - y) <= 1;

function remarPor(p, ruta) {
  const c = p.estado.canoa, sig = ruta[0];
  return p.hacer({ tipo: 'remar', dx: sig.x - c.x, dy: sig.y - c.y });
}

function alDestino(p) {
  const { mapa, destino } = p.estado;
  return MAPA.camino(mapa, p.estado.canoa, (x, y) => Math.max(Math.abs(x - destino.x), Math.abs(y - destino.y)) <= 1);
}

function directo(p, maximo) {
  for (let i = 0; i < (maximo || 400) && !p.terminada; i++) {
    const ruta = alDestino(p);
    if (!ruta) break;
    remarPor(p, ruta);
  }
  return p;
}

function cuidadoso(p, maximo) {
  const R = require('../juego/nucleo/reglas.js');
  for (let i = 0; i < (maximo || 400) && !p.terminada; i++) {
    const e = p.estado, c = e.canoa, puede = p.puede();
    if (puede.juntar) { p.hacer({ tipo: 'juntar' }); continue; }
    if (puede.avivar && e.energia <= R.ENERGIA_MAX - R.AVIVAR) { p.hacer({ tipo: 'avivar' }); continue; }
    if (puede.amarrar && (e.hora === 'noche' || e.clima === 'lluvia' || (e.hora === 'tarde' && e.recursos.comida > 0))) { p.hacer({ tipo: 'amarrar' }); continue; }
    // A dónde ir: si cae la noche, a un amarre cercano; si no, a lo que se junta cerca; si no, al destino.
    let ruta = null;
    if (e.hora !== 'dia') {
      ruta = MAPA.camino(e.mapa, c, (x, y) => e.mapa[y][x] === 'k' && V4.some(([dx, dy]) => (e.mapa[y + dy] || '')[x + dx] === '.'));
      if (ruta && ruta.length > 6) ruta = null;
    }
    if (!ruta) {
      const utiles = e.objetos.filter((o) => o.junta && e.explorado(o.x, o.y) && (o.junta !== 'lena' || e.recursos.lena < R.LENA_MAX));
      if (utiles.length) {
        ruta = MAPA.camino(e.mapa, c, (x, y) => utiles.some((o) => cerca(o, x, y)));
        if (ruta && ruta.length > 6) ruta = null;
      }
    }
    if (!ruta) ruta = alDestino(p);
    if (!ruta || !ruta.length) break;
    remarPor(p, ruta);
  }
  return p;
}

/** Juega n viajes con un bot y devuelve cuántos ganó y cuántos pasos dio en promedio. */
function medir(bot, n, opciones) {
  let ganados = 0, pasos = 0, saberes = 0;
  for (let s = 1; s <= n; s++) {
    const p = bot(TDH_PARTIDA.nueva(Object.assign({ semilla: s, saberes: require('../datos/saberes.js').ORDEN }, opciones || {})));
    if (p.estado.gano) ganados++;
    pasos += p.estado.pasos; saberes += p.estado.aprendidos.length;
  }
  return { ganados, n, tasa: ganados / n, pasos: pasos / n, saberes: saberes / n };
}

module.exports = { directo, cuidadoso, medir };
