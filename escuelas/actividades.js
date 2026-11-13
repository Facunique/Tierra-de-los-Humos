/*
 * Tierra de los Humos · Actividades para el aula (una por carta de saber)
 * ----------------------------------------------------------------------
 * Cada actividad parte SOLO del dato de su carta (arte/cartas/saberes-borrador.js),
 * que cita a Cooper (1946) con página. Lo que no está en la fuente va como
 * pregunta abierta o como "para pensar", nunca como dato.
 *
 * Campos: pregunta · actividad (pasos) · minutos · areas · cuidado (o para pensar).
 * La clave es la misma que la de la carta. Si una carta no tiene actividad,
 * la guía lo muestra como pendiente.
 *
 * Borrador de la Persona D para revisar con la Persona C y, si es posible,
 * con docentes y con la comunidad. Licencia: CC BY-SA 4.0.
 */
(function (raiz) {
  'use strict';
  const ACTIVIDADES = {
    fuego: {
      pregunta: '¿Cómo se lleva un fuego encendido dentro de una canoa de corteza sin que la canoa se queme?',
      actividad: [
        'En grupos, dibujen la canoa vista desde arriba y marquen dónde iría el fuego.',
        'Lean el dato. ¿Para qué sirve el lecho de tierra, conchas o piedras debajo del fuego?',
        'Repasen qué necesita un fuego para seguir encendido: algo que se queme, aire y calor. ¿Qué pasa en la canoa si falta cada uno?',
      ],
      minutos: 20,
      areas: ['Ciencias Naturales', 'Ciencias Sociales'],
      cuidado: { tipo: 'Para pensar', texto: 'La carta no dice por qué convenía no dejarlo apagar. Una pista está en la carta «Piedras de fuego»: hacer fuego de nuevo no era fácil.' },
    },
    amarre: {
      pregunta: '¿Quién manejaba la canoa?',
      actividad: [
        'Antes de leer la carta, pregunten a la clase quién creen que remaba. Anoten las respuestas.',
        'Lean el dato. Después, con la misma fuente, armen una tabla de tareas: la mujer remaba, amarraba, cuidaba el fuego, juntaba mejillones, pescaba y hacía cestos; el hombre cazaba, hacía sus armas y la canoa (Cooper, 1946, p. 96).',
        'Comparen la tabla con lo que habían anotado. ¿Qué los sorprendió?',
      ],
      minutos: 20,
      areas: ['Ciencias Sociales', 'ESI'],
      cuidado: { tipo: 'Cuidado', texto: 'Es lo que registraron observadores de afuera en una época. No lo generalicen a cómo viven hoy las familias yaganes.' },
    },
    mejillones: {
      pregunta: '¿Qué nos puede contar una montaña de valvas?',
      actividad: [
        'Lean el dato: el mejillón era el alimento más importante, y se juntaba a mano.',
        'Las valvas que se tiraban junto a la casa formaban montículos: los conchales. Si encontraran uno, ¿qué podrían averiguar? (qué se comía, en qué lugares, si se volvía muchas veces).',
        'Un «conchal» de la clase: durante una semana, guarden en una caja los envoltorios limpios de la merienda. Al final, ¿qué cuenta la caja sobre ustedes?',
      ],
      minutos: 25,
      areas: ['Ciencias Sociales', 'Ciencias Naturales'],
      cuidado: { tipo: 'Cuidado', texto: 'Los conchales son sitios arqueológicos protegidos por ley (en la Argentina, la Ley 25.743). Si ven uno en la costa, no se saca nada: se mira y se avisa.' },
    },
    pescado: {
      pregunta: '¿Se puede pescar sin anzuelo?',
      actividad: [
        'Lean el dato y dibujen la pesca: la línea, la carnada en el nudo y la mano.',
        'Hagan una tabla con todos los materiales que nombran las cartas: cachiyuyo, tendón y barba de ballena, corteza de guindo, canelo, pirita, pedernal, plumón, hongo seco, pasto, helechos, cueros.',
        'Para cada material, escriban de dónde sale (mar, costa, bosque o animales) y para qué se usa. ¿Hay algo que venga de lejos?',
      ],
      minutos: 25,
      areas: ['Educación Tecnológica', 'Ciencias Naturales'],
      cuidado: { tipo: 'Cuidado', texto: 'No dibujen anzuelos ni redes: la fuente dice justamente que la pesca era sin anzuelo.' },
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
        'Busquen qué es la pirita (un mineral de hierro y azufre, brillante como el oro). ¿Por qué sale una chispa al golpearla?',
        'La pirita solo se hallaba en algunos lugares. En el mapa, imaginen una familia que vive lejos de ella. ¿Qué podría hacer? Anoten las ideas como preguntas para investigar, no como respuestas.',
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
        'Lean el dato: tres tiras de corteza de guindo, sacadas en primavera, cuando sube la savia.',
        'Busquen qué es la savia y qué le pasa al árbol en primavera. ¿Por qué ahí la corteza se despega mejor?',
        'Usen la tabla «El año en los canales» de esta guía: ubiquen la primavera y comparen las horas de luz de Ushuaia con las de su ciudad.',
      ],
      minutos: 25,
      areas: ['Ciencias Naturales', 'Matemática', 'Geografía'],
      cuidado: { tipo: 'Cuidado', texto: 'No saquen corteza de ningún árbol: lo lastima. Se puede observar la de una rama caída.' },
    },
    ballena: {
      pregunta: '¿Qué hace falta para compartir algo muy grande que aparece de golpe?',
      actividad: [
        'Lean el dato: por una ballena varada, una familia podía entrar al territorio de otra, y el varamiento reunía a muchas familias.',
        'En grupos, piensen qué acuerdos hacen falta para compartir algo así: quién avisa, quién llega, cómo se reparte.',
        'Busquen un ejemplo de hoy en su barrio o su ciudad: algo que se comparte entre muchas familias. ¿Qué acuerdos tiene?',
      ],
      minutos: 25,
      areas: ['Formación Ética y Ciudadana', 'Ciencias Sociales'],
      cuidado: { tipo: 'Cuidado', texto: 'No es una escena de caza: la ballena llegaba sola a la costa. El juego no tiene caza ni peleas.' },
    },
  };
  const modulo = { ACTIVIDADES };
  if (typeof module !== 'undefined' && module.exports) module.exports = modulo;
  else raiz.TDH_ACTIVIDADES = modulo;
})(typeof window !== 'undefined' ? window : globalThis);
