/*
 * Tierra de los Humos · Destinos del viaje
 * ----------------------------------------
 * A dónde va la familia y por qué. Tiene que ser un motivo real y documentado
 * (equipo/memory.md, *Por decidir*). Lo elige la Persona C con la comunidad.
 *
 * Para cambiar el destino del juego: cambiá ACTIVO por el id de otro destino.
 * Para sumar uno: copiá una entrada y completala. `node --test` revisa que su
 * dibujo y su carta existan y que el viaje se pueda ganar con él.
 *
 *    id: {
 *      id: 'id',                  // igual que la clave
 *      nombre: 'la ballena varada',   // como lo nombra la interfaz: «Llegaron a la ballena varada.»
 *      dibujo: 'ballena-varada',  // figura o pegatina de Corteza
 *      donde: 'playa',            // un lugar de elementos.js
 *      costa: 'sur',              // opcional: 'norte' o 'sur' (si no hay lugar, cualquiera)
 *      zona: { desde: 0.84, hasta: 0.94 },   // al final del canal
 *      carta: 'ballena',          // id de datos/saberes.js que sale al llegar, o null
 *      humos: true,               // fogones de otras familias cerca del destino
 *      dato: '…', fuente: '…',
 *      estado: 'borrador',        // 'propuesta' si todavía no se eligió
 *    },
 *
 * Se carga con un <script> clásico (global TDH_DESTINOS) y en Node con require().
 * Licencia: CC BY-SA 4.0 (los textos); MIT (el código).
 */
(function (raiz) {
  'use strict';
  const COOPER = 'Cooper, J. M. (1946). «The Yahgan». Handbook of South American Indians, vol. 1';

  const DESTINOS = {
    ballena: {
      id: 'ballena', nombre: 'la ballena varada', dibujo: 'ballena-varada',
      donde: 'playa', costa: 'sur', zona: { desde: 0.84, hasta: 0.94 },
      carta: 'ballena', humos: true,
      dato: 'Las ballenas varadas se aprovechaban con entusiasmo y reunían a muchas familias. Un grupo podía entrar al territorio de otro para comer una ballena varada.',
      fuente: COOPER + ', p. 84, 94-95 y 99.',
      estado: 'borrador',
    },
    corteza: {
      id: 'corteza', nombre: 'el guindo de buena corteza', dibujo: 'guindo-grande',
      donde: 'bosque-costa', zona: { desde: 0.84, hasta: 0.97 },
      carta: 'corteza', humos: false,
      dato: 'Un grupo podía entrar al territorio de otro para buscar corteza buena para canoas, que solo se hallaba en ciertos lugares.',
      fuente: COOPER + ', p. 94-95.',
      estado: 'propuesta',
    },
    pirita: {
      id: 'pirita', nombre: 'las piedras de fuego', dibujo: 'pirita',
      donde: 'playa', zona: { desde: 0.84, hasta: 0.94 },
      carta: 'pirita', humos: false,
      dato: 'Un grupo podía entrar al territorio de otro para buscar piedras de fuego (pirita), que solo se hallaban en ciertos lugares.',
      fuente: COOPER + ', p. 94-95.',
      estado: 'propuesta',
    },
  };

  const ACTIVO = 'ballena';

  const api = { DESTINOS, ACTIVO, ORDEN: Object.keys(DESTINOS) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_DESTINOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
