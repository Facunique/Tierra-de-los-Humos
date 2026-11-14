/*
 * Tierra de los Humos · Destinos del viaje
 * ----------------------------------------
 * A dónde va la familia y por qué. Tiene que ser un motivo real y documentado
 * (equipo/memory.md, *Por decidir*). Lo elige la Persona C con la comunidad.
 *
 * El motivo del viaje (nomadismo, docs/02-alcance-mvp.md): cada viaje elige, con la semilla,
 * entre los destinos del pueblo que NO están en 'propuesta' y que son de la estación del viaje
 * (si tienen `estaciones`). Para que un destino entre al juego, pasalo de 'propuesta' a
 * 'borrador'. Si ninguno sirve, el viaje va al ACTIVO.
 *
 * Para cambiar el destino por defecto: cambiá ACTIVO por el id de otro destino.
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
 *      estaciones: ['primavera'], // opcional: solo sale en esas estaciones, y solo si hay fuente.
 *                                 // Sin el campo, sale en cualquiera.
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
      dato: 'Cooper describe encuentros de familias para aprovechar una ballena varada como alimento. Vargas Filgueira relata un desplazamiento para acudir a un varamiento.',
      fuente: COOPER + ', p. 84, 94-95 y 99. Vargas Filgueira, Víctor (2019). Mi sangre yagán (ahua saapa yagan). Primera edición digital. Editora Cultural Tierra del Fuego, p. 16-17 del visor del PDF.',
      estado: 'borrador',
    },
    corteza: {
      id: 'corteza', nombre: 'el guindo de buena corteza', dibujo: 'guindo-grande',
      donde: 'bosque-costa', zona: { desde: 0.84, hasta: 0.97 },
      carta: 'corteza', humos: false,
      // La corteza de guindo se sacaba en primavera, cuando sube la savia (Cooper, 1946, p. 88;
      // cotejo de C en equipo/revision-cultural-paso-3.md). ✏️ C confirma antes de sacarlo de 'propuesta'.
      estaciones: ['primavera'],
      dato: 'Cooper menciona desplazamientos para buscar corteza adecuada para canoas. Vargas Filgueira relata la recuperación de corteza conservada para reparar una embarcación; ese episodio es distinto de la extracción de corteza de un árbol.',
      fuente: COOPER + ', p. 94-95. Vargas Filgueira, Víctor (2019). Mi sangre yagán (ahua saapa yagan). Primera edición digital. Editora Cultural Tierra del Fuego, p. 23 y 31-32 del visor del PDF.',
      estado: 'propuesta',
    },
    pirita: {
      id: 'pirita', nombre: 'las piedras de fuego', dibujo: 'pirita',
      donde: 'playa', zona: { desde: 0.84, hasta: 0.94 },
      carta: 'pirita', humos: false,
      dato: 'Cooper menciona desplazamientos para buscar piedras de fuego (pirita), disponibles en ciertos lugares.',
      fuente: COOPER + ', p. 94-95.',
      estado: 'propuesta',
    },
  };

  const ACTIVO = 'ballena';

  const api = { DESTINOS, ACTIVO, ORDEN: Object.keys(DESTINOS) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_DESTINOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
