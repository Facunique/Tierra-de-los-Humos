/*
 * Tierra de los Humos · Pueblos
 * -----------------------------
 * Qué hay en el viaje de cada pueblo: sus elementos (elementos.js), sus destinos
 * posibles (destinos.js) y la forma de su canal. Cada pueblo tiene su propio
 * linaje: los saberes se heredan dentro del pueblo (equipo/memory.md, 9/11).
 *
 * El MVP es solo Yagán. Para sumar a los Kawésqar hace falta antes la
 * investigación y la consulta con sus comunidades (docs/01-concepto.md): no se
 * carga nada sin fuente.
 *
 *    id: {
 *      id: 'yagan', nombre: 'Yagán',
 *      elementos: ['lena', ...],      // en este orden se ubican en el mapa
 *      destinos: ['ballena', ...],    // los que puede tener; el activo sale de destinos.js
 *      canal: { ancho: 32, alto: 13 },// tamaño del mapa de cada tramo, en casillas
 *      fuente: '…', estado: 'borrador',
 *    },
 *
 * Se carga con un <script> clásico (global TDH_PUEBLOS) y en Node con require().
 * Licencia: CC BY-SA 4.0 (los textos); MIT (el código).
 */
(function (raiz) {
  'use strict';

  const PUEBLOS = {
    yagan: {
      id: 'yagan', nombre: 'Yagán',
      elementos: ['choza', 'corteza', 'lena', 'mejillones', 'hongos', 'pirita', 'pescado', 'lobo-marino', 'cormoran', 'tonina', 'pato-vapor'],
      destinos: ['ballena', 'corteza', 'pirita'],
      canal: { ancho: 32, alto: 13 },
      fuente: 'Vivían sobre todo en el agua y en la orilla de los canales del sur (Cooper, 1946, p. 81). El canal del juego es ficción.',
      estado: 'borrador',
    },
  };

  const POR_DEFECTO = 'yagan';

  const api = { PUEBLOS, POR_DEFECTO, ORDEN: Object.keys(PUEBLOS) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_PUEBLOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
