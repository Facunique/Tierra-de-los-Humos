/*
 * Tierra de los Humos · Azar con semilla
 * --------------------------------------
 * Misma semilla, misma partida: el mapa, el clima y todo lo que sale al azar
 * se repite igual. Sirve para probar el núcleo y para reproducir un error.
 *
 *   const al = TDH_AZAR.crear(42);
 *   al()                 // número entre 0 y 1
 *   TDH_AZAR.entero(al, 3, 7)   // entero entre 3 y 7, incluidos
 *   TDH_AZAR.elegir(al, ['a', 'b'])
 *   TDH_AZAR.ponderado(al, { calma: 2, viento: 1 })   // elige una clave según su peso
 *
 * Es el mismo generador que usa la partida falsa (mulberry32).
 * Sin DOM: anda en el navegador (global TDH_AZAR) y en Node (require).
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';

  function crear(semilla) {
    let a = (semilla == null ? 1 : semilla) >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const entero = (al, min, max) => min + Math.floor(al() * (max - min + 1));
  const elegir = (al, lista) => lista[Math.floor(al() * lista.length)];

  function ponderado(al, pesos) {
    const claves = Object.keys(pesos);
    let total = 0;
    for (const k of claves) total += pesos[k];
    let r = al() * total;
    for (const k of claves) { r -= pesos[k]; if (r < 0) return k; }
    return claves[claves.length - 1];
  }

  /** Mezcla una copia de la lista (Fisher-Yates). */
  function mezclar(al, lista) {
    const l = lista.slice();
    for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(al() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; }
    return l;
  }

  const api = { crear, entero, elegir, ponderado, mezclar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_AZAR = api;
})(typeof window !== 'undefined' ? window : globalThis);
