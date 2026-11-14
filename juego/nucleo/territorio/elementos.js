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
      dato: 'Cooper describe el fuego encendido en la canoa. Bird documenta la recolección de leña entre los Kawésqar. 🔍 Falta una cita yagán específica sobre la recolección de leña.',
      fuente: COOPER + ', p. 88 y 91. Bird, J. (1946). «The Alacaluf». Handbook of South American Indians, vol. 1. Smithsonian Institution, p. 70. La referencia de Bird corresponde al pueblo Kawésqar.',
      estado: 'borrador',
    },
    mejillones: {
      id: 'mejillones', nombre: 'mejillones', tipo: 'recurso', dibujo: 'mejillones',
      donde: 'playa', zona: { desde: 0.16, hasta: 0.84 }, cantidad: 2,
      efecto: { tipo: 'sumar', recurso: 'comida', cantidad: 1 },
      carta: 'mejillones',
      dato: 'Cooper, citando a Lothrop, presenta al mejillón como el alimento principal y describe su recolección a mano.',
      fuente: COOPER + ', p. 84.',
      estado: 'borrador',
    },
    hongos: {
      id: 'hongos', nombre: 'hongos', tipo: 'recurso', dibujo: 'hongos',
      donde: 'playa-bosque', zona: { desde: 0.25, hasta: 0.88 }, cantidad: 2,
      efecto: { tipo: 'sumar', recurso: 'comida', cantidad: 1 },
      carta: 'hongos',
      dato: 'Cooper menciona el consumo de hongos que crecen en los árboles y su conservación en seco.',
      fuente: COOPER + ', p. 84.',
      estado: 'borrador',
    },
    pirita: {
      id: 'pirita', nombre: 'pirita', tipo: 'recurso', dibujo: 'pirita',
      donde: 'playa', zona: { desde: 0.33, hasta: 0.88 }, cantidad: 1,
      efecto: { tipo: 'sumar', recurso: 'pirita', cantidad: 1 },
      carta: 'pirita',
      dato: 'Cooper describe el encendido del fuego golpeando pedernal contra pirita, con plumón de ave u hongo seco como yesca.',
      fuente: COOPER + ', p. 91.',
      estado: 'borrador',
    },
    pescado: {
      id: 'pescado', nombre: 'pescado', tipo: 'recurso', dibujo: 'pescado',
      donde: 'agua-baja', zona: { desde: 0.16, hasta: 0.88 }, cantidad: 2,
      efecto: { tipo: 'sumar', recurso: 'comida', cantidad: 1 },
      carta: 'pescado',
      dato: 'Cooper describe una forma de pesca practicada por mujeres, con una línea sin anzuelo: la carnada va en un lazo y el pez se toma con la mano.',
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
      dato: 'Cooper describe chozas de domo o cónicas, con una puerta hacia el mar y el fuego en el centro. Bird registra conchales en las costas del canal Beagle.',
      fuente: COOPER + ', p. 85-86. Bird, J. (1946). «The Archeology of Patagonia». Handbook of South American Indians, vol. 1. Smithsonian Institution, p. 20-21.',
      estado: 'borrador',
    },
    corteza: {
      id: 'corteza', nombre: 'corteza de guindo', tipo: 'recurso', dibujo: 'guindo-grande',
      donde: 'bosque-costa', zona: { desde: 0.5, hasta: 0.82 }, cantidad: 1,
      queda: true,
      efecto: null, // 🔍 La carta dice «permite arreglar la canoa», pero la canoa no se daña en el juego. Ver equipo/memory.md.
      carta: 'corteza',
      dato: 'Cooper describe la extracción de corteza de guindo en primavera para construir canoas y señala que la corteza adecuada se encuentra en ciertos lugares. Vargas Filgueira relata la recuperación de corteza conservada para reparar una canoa.',
      fuente: COOPER + ', p. 88 y 94-95. Vargas Filgueira, Víctor (2019). Mi sangre yagán (ahua saapa yagan). Primera edición digital. Editora Cultural Tierra del Fuego, p. 23 y 31-32 del visor del PDF.',
      estado: 'borrador',
    },
    'lobo-marino': {
      id: 'lobo-marino', nombre: 'lobo marino', tipo: 'paisaje', dibujo: 'lobo-marino',
      donde: 'roca', zona: { desde: 0.15, hasta: 0.9 }, cantidad: 1,
      dato: 'Cooper, citando a Lothrop, ubica a los lobos marinos y los peces después de los mejillones en su lista de alimentos. En el juego, el lobo marino aparece descansando.',
      fuente: COOPER + ', p. 84.',
      estado: 'borrador',
    },
    cormoran: {
      id: 'cormoran', nombre: 'cormorán', tipo: 'paisaje', dibujo: 'cormoran',
      donde: 'roca', zona: { desde: 0.15, hasta: 0.9 }, cantidad: 1,
      dato: 'Cooper menciona a los cormoranes entre los alimentos. En el juego aparece un ave posada. 🔍 Falta identificar la especie representada.',
      fuente: COOPER + ', p. 84. 🔍 Esta referencia no identifica la especie representada ni verifica su distribución.',
      estado: 'borrador',
    },
    tonina: {
      id: 'tonina', nombre: 'tonina', tipo: 'paisaje', dibujo: 'tonina',
      donde: 'agua-honda', zona: { desde: 0.12, hasta: 0.94 }, cantidad: 1,
      dato: 'Cooper menciona marsopas sin identificar la especie. En el juego aparece un cetáceo nadando. 🔍 Falta comprobar qué especie representa y su presencia en el Beagle.',
      fuente: COOPER + ', p. 84. 🔍 No permite identificar a la tonina del juego; falta una fuente de especie y distribución en el Beagle.',
      estado: 'borrador',
    },
    'pato-vapor': {
      id: 'pato-vapor', nombre: 'pato vapor', tipo: 'paisaje', dibujo: 'pato-vapor',
      donde: 'agua-media', zona: { desde: 0.12, hasta: 0.94 }, cantidad: 1,
      dato: 'Cooper menciona patos entre los alimentos, sin identificar aquí al pato vapor. 🔍 Falta una fuente para la especie representada y su presencia en el Beagle.',
      fuente: COOPER + ', p. 84. 🔍 La mención general de patos no identifica al pato vapor del juego.',
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
