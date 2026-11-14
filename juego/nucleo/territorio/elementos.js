/*
 * Tierra de los Humos · Lo que hay en el territorio
 * -------------------------------------------------
 * Cada cosa que aparece en el mapa del viaje: qué es, dónde va, qué hace en el
 * juego y de qué fuente sale. El núcleo (juego/nucleo/) no sabe nada de esto:
 * lo lee de acá. Si la investigación cambia un dato, se cambia ACÁ y no en el
 * código. `node --test` revisa que todo siga siendo consistente.
 *
 * Se carga con un <script> clásico (global TDH_ELEMENTOS) y en Node con require().
 *
 * ── Cómo cargar o cambiar un elemento (sin programar) ───────────────────────
 *
 *    nombre: {
 *      id: 'nombre',              // igual que la clave. NO se cambia nunca
 *      nombre: 'nombre',          // como lo nombra la interfaz: «Juntaste nombre.»
 *      tipo: 'recurso',           // 'recurso' (se junta), 'refugio' o 'paisaje' (solo se ve)
 *      dibujo: 'mejillones',      // pegatina o figura de Corteza (docs/04, sección 6)
 *      donde: 'playa',            // ver LUGARES abajo
 *      zona: { desde: 0.15, hasta: 0.85 },  // de 0 (la salida) a 1 (el destino)
 *      cantidad: 2,               // o { cada: 5 }: una cada 5 columnas
 *      minimo: 0,                 // si el mapa no llega a este número, se genera otro
 *      efecto: { tipo: 'sumar', recurso: 'comida', cantidad: 1 },  // al juntarlo (ver EFECTOS)
 *      carta: 'mejillones',       // id de datos/saberes.js que sale la primera vez, o null
 *      dato: 'Lo que dice la fuente.',
 *      fuente: 'Cooper (1946), p. 84.',   // si todavía no hay, empezá con 🔍
 *      estado: 'borrador',        // 'borrador' hasta que lo revise la Persona C; después, 'revisado'
 *    },
 *
 * LUGARES (dónde puede ir algo):
 *   playa          playa con agua al lado
 *   playa-bosque   playa con bosque al lado (la orilla del bosque)
 *   bosque-costa   bosque que llega al agua
 *   agua-baja · agua-media · agua-honda · roca
 *   campamento     tres playas seguidas: el elemento y su `grupo` (ver la choza)
 *
 * EFECTOS (lo que el núcleo sabe hacer; uno nuevo necesita código):
 *   { tipo: 'sumar', recurso: 'lena' | 'comida' | 'pirita', cantidad }   al juntarlo
 *   cerca: { distancia, ahorro }   mientras la canoa está cerca, el fuego gasta menos
 *   queda: true                    al juntarlo, el dibujo queda en el mapa (un árbol)
 *
 * Qué es dato y qué es juego: `dato` y `fuente` son de la investigación; donde,
 * zona, cantidad y efecto son recursos de juego, y se ajustan jugando.
 *
 * Licencia: CC BY-SA 4.0 (los textos); MIT (el código).
 */
(function (raiz) {
  'use strict';
  const COOPER = 'Cooper, J. M. (1946). «The Yahgan». Handbook of South American Indians, vol. 1';

  const ELEMENTOS = {
    lena: {
      id: 'lena', nombre: 'leña', tipo: 'recurso', dibujo: 'lena',
      donde: 'playa', zona: { desde: 0.09, hasta: 0.88 }, cantidad: { cada: 5 }, minimo: 4,
      efecto: { tipo: 'sumar', recurso: 'lena', cantidad: 2 },
      carta: null,
      dato: 'El fuego se mantenía siempre encendido, también en la canoa.',
      fuente: '🔍 Sin cita propia para la leña. El fuego siempre encendido: ' + COOPER + ', p. 88 y 91.',
      estado: 'borrador',
    },
    mejillones: {
      id: 'mejillones', nombre: 'mejillones', tipo: 'recurso', dibujo: 'mejillones',
      donde: 'playa', zona: { desde: 0.16, hasta: 0.84 }, cantidad: 2,
      efecto: { tipo: 'sumar', recurso: 'comida', cantidad: 1 },
      carta: 'mejillones',
      dato: 'El mejillón era, lejos, el alimento más importante. Se juntaba a mano.',
      fuente: COOPER + ', p. 84.',
      estado: 'borrador',
    },
    hongos: {
      id: 'hongos', nombre: 'hongos', tipo: 'recurso', dibujo: 'hongos',
      donde: 'playa-bosque', zona: { desde: 0.25, hasta: 0.88 }, cantidad: 2,
      efecto: { tipo: 'sumar', recurso: 'comida', cantidad: 1 },
      carta: 'hongos',
      dato: 'Comían los hongos que crecen en los árboles, no los del suelo, y los guardaban secos.',
      fuente: COOPER + ', p. 84.',
      estado: 'borrador',
    },
    pirita: {
      id: 'pirita', nombre: 'pirita', tipo: 'recurso', dibujo: 'pirita',
      donde: 'playa', zona: { desde: 0.33, hasta: 0.88 }, cantidad: 1,
      efecto: { tipo: 'sumar', recurso: 'pirita', cantidad: 1 },
      carta: 'pirita',
      dato: 'El fuego se hacía golpeando pedernal contra pirita. La yesca era plumón de ave u hongo seco.',
      fuente: COOPER + ', p. 91.',
      estado: 'borrador',
    },
    pescado: {
      id: 'pescado', nombre: 'pescado', tipo: 'recurso', dibujo: 'pescado',
      donde: 'agua-baja', zona: { desde: 0.16, hasta: 0.88 }, cantidad: 2,
      efecto: { tipo: 'sumar', recurso: 'comida', cantidad: 1 },
      carta: 'pescado',
      dato: 'Pescaban las mujeres, con una línea y sin anzuelo: la carnada iba en un nudo corredizo y el pez se agarraba con la mano.',
      fuente: COOPER + ', p. 84 y 96.',
      estado: 'borrador',
    },
    choza: {
      id: 'choza', nombre: 'el saber de la choza', tipo: 'refugio', dibujo: 'choza',
      donde: 'campamento', zona: { desde: 0.15, hasta: 0.5 }, cantidad: 1, minimo: 1,
      // La choza no se junta: se junta el saber que está al lado. El conchal acompaña.
      grupo: [{ dibujo: 'saber', dx: 1, junta: true }, { dibujo: 'conchal', dx: 2 }],
      cerca: { distancia: 2, ahorro: 1 },
      carta: 'choza',
      dato: 'Chozas de domo o cónicas, con la puerta hacia el mar y el fuego en el centro. Junto a las viviendas, montículos de valvas (conchales).',
      fuente: COOPER + ', p. 85-86. Conchales: Proyecto Arqueológico Canal Beagle (Orquera y Piana). 🔍 cita exacta de los conchales.',
      estado: 'borrador',
    },
    corteza: {
      id: 'corteza', nombre: 'corteza de guindo', tipo: 'recurso', dibujo: 'guindo-grande',
      donde: 'bosque-costa', zona: { desde: 0.5, hasta: 0.82 }, cantidad: 1,
      queda: true,
      efecto: null, // 🔍 La carta dice «permite arreglar la canoa», pero la canoa no se daña en el juego. Ver equipo/memory.md.
      carta: 'corteza',
      dato: 'La corteza de la canoa salía solo del guindo y se sacaba en primavera. Solo había corteza buena en ciertos lugares.',
      fuente: COOPER + ', p. 88 y 94-95; Museo Marítimo de Ushuaia, La canoa yagán.',
      estado: 'borrador',
    },
    'lobo-marino': {
      id: 'lobo-marino', nombre: 'lobo marino', tipo: 'paisaje', dibujo: 'lobo-marino',
      donde: 'roca', zona: { desde: 0.15, hasta: 0.9 }, cantidad: 1,
      dato: 'Lobos marinos, el segundo grupo de alimentos. En el juego aparece descansando: nunca escenas de caza.',
      fuente: COOPER + ', p. 84.',
      estado: 'borrador',
    },
    cormoran: {
      id: 'cormoran', nombre: 'cormorán', tipo: 'paisaje', dibujo: 'cormoran',
      donde: 'roca', zona: { desde: 0.15, hasta: 0.9 }, cantidad: 1,
      dato: 'Los cormoranes estaban entre las aves de la costa. En el juego aparece posado: nunca escenas de caza.',
      fuente: COOPER + ', p. 84.',
      estado: 'borrador',
    },
    tonina: {
      id: 'tonina', nombre: 'tonina', tipo: 'paisaje', dibujo: 'tonina',
      donde: 'agua-honda', zona: { desde: 0.12, hasta: 0.94 }, cantidad: 1,
      dato: 'Las marsopas estaban en el tercer grupo de alimentos. En el juego aparece nadando.',
      fuente: COOPER + ', p. 84. 🔍 especie del Beagle.',
      estado: 'borrador',
    },
    'pato-vapor': {
      id: 'pato-vapor', nombre: 'pato vapor', tipo: 'paisaje', dibujo: 'pato-vapor',
      donde: 'agua-media', zona: { desde: 0.12, hasta: 0.94 }, cantidad: 1,
      dato: 'Los patos estaban en el último grupo de alimentos.',
      fuente: COOPER + ', p. 84.',
      estado: 'borrador',
    },
  };

  const LUGARES = ['playa', 'playa-bosque', 'bosque-costa', 'agua-baja', 'agua-media', 'agua-honda', 'roca', 'campamento'];
  const EFECTOS = ['sumar'];
  const RECURSOS = ['lena', 'comida', 'pirita'];

  const api = { ELEMENTOS, ORDEN: Object.keys(ELEMENTOS), LUGARES, EFECTOS, RECURSOS, COOPER };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_ELEMENTOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
