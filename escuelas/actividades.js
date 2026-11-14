/*
 * Tierra de los Humos · Actividades para el aula (una por carta de saber)
 * ----------------------------------------------------------------------
 * Cada actividad parte del dato de su carta (datos/saberes.js),
 * con autor, obra, año y página. Las referencias complementarias se indican
 * en cada actividad y en la guía. Lo que no está en la fuente va como pregunta
 * abierta o como "para pensar", nunca como dato.
 *
 * Campos: pregunta · actividad (pasos) · minutos · areas · cuidado (o para pensar).
 * La clave es la misma que la de la carta. Si una carta no tiene actividad,
 * la guía lo muestra como pendiente.
 *
 * Borrador de la Persona D, revisado documentalmente por la Persona C (14/11).
 * Pendiente de revisión docente y consulta comunitaria. Licencia: CC BY-SA 4.0.
 */
(function (raiz) {
  'use strict';
  const ACTIVIDADES = {
    fuego: {
      pregunta: '¿Cómo se lleva un fuego encendido dentro de una canoa de corteza sin que la canoa se queme?',
      actividad: [
        'En grupos, dibujen la canoa vista desde arriba y marquen dónde iría el fuego.',
        'Lean el dato. ¿Para qué sirve el lecho de tierra, conchas o piedras debajo del fuego?',
        'Comparen los materiales con Vargas Filgueira (2019), Mi sangre yagán, p. 66 del visor: pedernal y plumas conservadas secas. ¿Qué dice cada fuente y qué no explica?',
      ],
      minutos: 20,
      areas: ['Ciencias Naturales', 'Ciencias Sociales'],
      cuidado: { tipo: 'Para pensar', texto: 'Las fuentes describen materiales para mantener y encender fuego. No deduzcan su dificultad ni su duración a partir del gasto de fuego del juego: ese número es ficción.' },
    },
    amarre: {
      pregunta: '¿Qué cuenta cada fuente sobre quienes reman?',
      actividad: [
        'Antes de leer la carta, pregunten a la clase quién creen que remaba. Anoten las respuestas.',
        'Lean el dato y su fuente. Comparen la descripción de Cooper (1946), «The Yahgan», pp. 88 y 96, con las mujeres remando del relato de Vargas Filgueira (2019), Mi sangre yagán, p. 33 del visor.',
        'Armen una tabla: qué describe cada autor, en qué contexto y qué no podemos saber con ese pasaje. ¿Cómo cambiaron sus respuestas iniciales?',
      ],
      minutos: 20,
      areas: ['Ciencias Sociales', 'ESI'],
      cuidado: { tipo: 'Cuidado', texto: 'Cooper y Vargas Filgueira escriben desde lugares distintos. Estos pasajes no fijan tareas de todas las familias actuales. La página 33 respalda el remo; el amarre en cachiyuyo se toma de Cooper.' },
    },
    mejillones: {
      pregunta: '¿Qué nos puede contar una montaña de valvas?',
      actividad: [
        'Lean cómo presenta Cooper al mejillón, citando a Lothrop. ¿Qué afirma la carta y de dónde sale esa información?',
        'Bird (1946), «The Archeology of Patagonia», pp. 20–21, registra conchales en las costas del Beagle. ¿Qué preguntas investigarían sobre alimentación y ocupación de esos lugares?',
        'Simulación de aula: durante una semana, registren en una tabla las meriendas del grupo. ¿Qué permite preguntar ese registro y qué no? No es un conchal ni explica por sí solo cómo se forma uno.',
      ],
      minutos: 25,
      areas: ['Ciencias Sociales', 'Ciencias Naturales'],
      cuidado: { tipo: 'Cuidado', texto: 'Trabajen con registros e imágenes y dejen los materiales de los sitios en su lugar. Las preguntas de la actividad no autorizan excavar ni recolectar piezas.' },
    },
    pescado: {
      pregunta: '¿Se puede pescar sin anzuelo?',
      actividad: [
        'Lean el dato y dibujen la pesca: la línea, la carnada en el nudo y la mano.',
        'Hagan una tabla de los materiales que nombran las cartas, con su uso y la fuente y página que lo documentan.',
        'Indiquen qué permite saber cada pasaje sobre el origen de los materiales. Marquen con 🔍 lo que no diga; no inventen especies, lugares ni recorridos.',
      ],
      minutos: 25,
      areas: ['Educación Tecnológica', 'Ciencias Naturales'],
      cuidado: { tipo: 'Cuidado', texto: 'Dibujen el método de esta carta: línea, lazo y mano. No agreguen herramientas que ese pasaje no menciona ni lo conviertan en una regla sobre toda la pesca.' },
    },
    hongos: {
      pregunta: '¿Cómo se guarda comida sin heladera?',
      actividad: [
        'Lean el dato: los hongos de los árboles se guardaban secos.',
        'Experimento: dejen secar al aire una rodaja de manzana y guarden otra igual en un frasco cerrado con una gota de agua. Obsérvenlas una semana y anoten qué cambia.',
        '¿Por qué lo seco dura más? Conversen sobre qué necesitan los hongos y las bacterias para crecer.',
      ],
      minutos: 20,
      areas: ['Ciencias Naturales'],
      cuidado: { tipo: 'Cuidado', texto: 'No junten ni prueben hongos silvestres: algunos son tóxicos. El experimento se hace con fruta del almacén.' },
    },
    pirita: {
      pregunta: '¿Qué pasaba si el fuego se apagaba?',
      actividad: [
        'Lean el dato: el fuego se hacía golpeando pirita contra pedernal, con plumón de ave u hongo seco como yesca.',
        'Busquen una fuente de geología sobre la pirita y el encendido por percusión. Anoten autor, obra, año y página. ¿Qué explica y qué falta investigar?',
        'Cooper (1946), «The Yahgan», p. 95, sitúa la pirita en ciertos lugares. Imaginen un recorrido ficticio para obtenerla: indiquen qué toman de la fuente y qué inventan para el ejercicio.',
      ],
      minutos: 20,
      areas: ['Ciencias Naturales', 'Ciencias Sociales'],
      cuidado: { tipo: 'Cuidado', texto: 'No hagan la prueba de las chispas en el aula. Alcanza con mirar la piedra o una foto.' },
    },
    choza: {
      pregunta: '¿Por qué la puerta de la choza miraba al mar?',
      actividad: [
        'Lean el dato: varas flexibles dobladas en domo, cubiertas con pasto, helechos, ramas, corteza o cueros; el fuego en el centro.',
        'Armen una maqueta con ramitas o palitos flexibles y papel. Pongan el fuego en el medio y la puerta hacia un «mar» de papel.',
        'La carta no dice por qué la puerta miraba al mar. Escriban hipótesis (ver la canoa, salir rápido al agua, el viento) y márquenlas como hipótesis, no como datos.',
      ],
      minutos: 30,
      areas: ['Educación Tecnológica', 'Ciencias Sociales'],
      cuidado: { tipo: 'Para pensar', texto: 'Separar lo que dice la fuente de lo que suponemos nosotros es la base del trabajo con fuentes, y también la regla de este juego.' },
    },
    corteza: {
      pregunta: '¿Por qué la corteza de la canoa se sacaba en primavera?',
      actividad: [
        'Lean la descripción de Cooper (1946), «The Yahgan», p. 88. Comparen con la extracción estacional y la corteza conservada de Vargas Filgueira (2019), Mi sangre yagán, pp. 23 y 31–32 del visor.',
        'Distingan extraer corteza y recuperar material guardado. ¿Por qué el segundo episodio permite pensar un viaje distinto? No lo presenten como una reparación que ya exista en el juego.',
        'Usen la tabla «El año en los canales» de esta guía: ubiquen la primavera y comparen las horas de luz de Ushuaia con las de su ciudad.',
      ],
      minutos: 25,
      areas: ['Ciencias Naturales', 'Matemática', 'Geografía'],
      cuidado: { tipo: 'Cuidado', texto: 'No saquen corteza de ningún árbol: lo lastima. Se puede observar la de una rama caída.' },
    },
    ballena: {
      pregunta: '¿Qué hace falta para compartir algo muy grande que aparece de golpe?',
      actividad: [
        'Lean cómo describen los encuentros por una ballena varada Cooper (1946), «The Yahgan», p. 99, y Vargas Filgueira (2019), Mi sangre yagán, pp. 16–17 del visor.',
        'En grupos, propongan acuerdos para una situación ficticia: quién avisa, quién llega, cómo se comparte. Márquenlos como propuestas de la clase, no como reglas del pueblo yagán.',
        'Comparen este motivo de viaje con buscar reservas de invierno, en Vargas Filgueira (2019), Mi sangre yagán, pp. 53–54 del visor. ¿Qué preguntas surgen sobre comida, clima y regreso?',
      ],
      minutos: 25,
      areas: ['Formación Ética y Ciudadana', 'Ciencias Sociales'],
      cuidado: { tipo: 'Cuidado', texto: 'La carta trata de un varamiento y un encuentro. No recreen caza ni peleas. La ballena es uno de los motivos posibles del viaje, no una explicación completa del nomadismo.' },
    },
  };
  const modulo = { ACTIVIDADES };
  if (typeof module !== 'undefined' && module.exports) module.exports = modulo;
  else raiz.TDH_ACTIVIDADES = modulo;
})(typeof window !== 'undefined' ? window : globalThis);
