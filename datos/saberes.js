/*
 * Tierra de los Humos · Cartas de saber
 * -------------------------------------
 * Los datos de las cartas, separados del código. Los usan el juego, la maqueta
 * (arte/pantallas), las cartas para imprimir, la presentación, la guía para
 * docentes y la vidriera del stand. Se cargan con un <script> clásico y quedan
 * en la global TDH_SABERES = { COOPER, SABERES, ORDEN }. En Node, con require().
 *
 * Los textos culturales salen de Cooper (1946), con página. Son BORRADORES:
 * los revisa la Persona C (Dani). Ver docs/05-rigor-historico.md.
 *
 * ── Cómo cargar una carta nueva (sin programar) ─────────────────────────────
 *
 * 1. Copiá la plantilla de abajo y pegala adentro de SABERES, antes de la llave
 *    que cierra (`};`). Cada carta termina con `},` (llave y coma).
 * 2. Completá cada campo entre comillas simples ('así'). Si el texto lleva un
 *    apóstrofo, escribilo con barra: 'Selk\'nam'.
 * 3. Guardá y abrí arte/pantallas/index.html o arte/cartas/imprimir.html para
 *    verla. Para revisar que no falte nada: `node --test` en la raíz del repo.
 *
 *    nombre: {
 *      id: 'nombre',            // igual que el nombre de arriba: minúsculas, sin tildes ni espacios. NO se cambia nunca (la herencia guarda este id)
 *      pueblo: 'yagan',         // 'yagan' (más adelante, 'kawesqar')
 *      estado: 'borrador',      // 'borrador' hasta que lo revise la Persona C; después, 'revisado'
 *      tipo: 'Fuego',           // tema corto: Fuego, Canoa, Alimento, Refugio, Encuentro…
 *      titulo: 'Título corto',
 *      dato: 'Lo que dice la fuente, en presente o en pasado según la fuente, sin inventar nada.',
 *      juego: 'Qué hace este saber en el juego (esto SÍ es ficción, recurso de juego).',
 *      fuente: COOPER + ', p. 00.',   // u otra obra: 'Autor, A. (año). Título. Editorial, p. 00.' Si es de memoria, marcalo con 🔍
 *      alt: 'Qué se ve en la ilustración, para quien no la puede ver. Solo lo que está dibujado.',
 *      mapa: ['GGLLGGGG', '........', ',,,,,,,,'],   // la ilustración: filas de letras (ver abajo). Si no sabés, copiá este
 *      extra: { objetos: [{ id: 'mejillones', x: 3, y: 1 }] },  // opcional: objetos, canoa, estación, hora
 *    },
 *
 *    Letras del mapa:  ~ canal hondo · - canal · , agua baja · k cachiyuyo · r roca
 *                      . playa · p pradera · G guindo · L lenga · t turbal · M cumbre
 *    Objetos y pegatinas: ver docs/04-direccion-de-arte.md, sección 6.
 *
 * Reglas (AGENTS.md): toda carta lleva fuente; los pueblos se nombran en
 * presente; nada de «extinguido», «extinto» ni «desaparecido»; sin nombres
 * propios en lengua originaria sin permiso de la comunidad.
 *
 * Licencia: CC BY-SA 4.0.
 */
(function (raiz) {
  'use strict';
  const COOPER = 'Cooper, J. M. (1946). «The Yahgan». <i>Handbook of South American Indians</i>, vol. 1. Smithsonian Institution';
  const SABERES = {
    fuego: {
      id: 'fuego', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Fuego', titulo: 'El fuego viaja en la canoa',
      dato: 'El fuego viajaba en el medio de la canoa, sobre un lecho de tierra, conchas o piedras, y se mantenía siempre encendido.',
      juego: 'El fuego de la canoa es tu vida. Avivalo con leña.',
      fuente: COOPER + ', p. 88 y 91.',
      alt: 'Una canoa de corteza navega por una bahía, frente a una playa con bosque, a la tarde. En el medio de la canoa arde el fuego y sube el humo. Van dos personas en silueta: una lleva un arpón y la otra, el remo.',
      mapa: ['GGLGGLGG', '..,,,,..', ',,,--,,,'], extra: { canoa: { x: 3, y: 2, fuego: 4 }, hora: 'tarde' },
    },
    amarre: {
      id: 'amarre', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Canoa', titulo: 'Amarrar en el cachiyuyo',
      dato: 'La mujer manejaba la canoa: remaba y, al llegar, la amarraba lejos de la orilla, en un bosque de cachiyuyo.',
      juego: 'Para acampar, amarrá la canoa en el cachiyuyo, cerca de una playa.',
      fuente: COOPER + ', p. 88 y 96.',
      alt: 'La canoa, con el fuego encendido y dos personas en silueta, está quieta entre las algas del cachiyuyo, en el agua frente a una playa con bosque.',
      mapa: ['GGLLGGGG', '........', ',,k,k,,,'], extra: { canoa: { x: 3, y: 2, fuego: 2 } },
    },
    mejillones: {
      id: 'mejillones', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Alimento', titulo: 'Mejillones, el alimento principal',
      dato: 'El mejillón era, lejos, el alimento más importante. Se juntaba a mano. Después venían los lobos marinos y los peces.',
      juego: 'Los mejillones son la comida más fácil de encontrar.',
      fuente: COOPER + ', p. 84 (según Lothrop, 1928, p. 32).',
      alt: 'Una playa al pie del bosque, con dos rocas en el agua. Sobre la arena hay dos pegatinas de mejillones, con borde de papel: se pueden juntar.',
      mapa: ['GGGGLLGG', '........', ',,r,,r,,'], extra: { objetos: [{ id: 'mejillones', x: 3, y: 1 }, { id: 'mejillones', x: 5, y: 1 }] },
    },
    pescado: {
      id: 'pescado', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Alimento', titulo: 'Pescar sin anzuelo',
      dato: 'Pescaban las mujeres, con una línea de cachiyuyo o de tendón de ballena. En lugar de anzuelo, la carnada iba en un nudo corredizo de barba de ballena, y el pez se agarraba con la mano.',
      juego: 'El pescado se junta en el agua baja.',
      fuente: COOPER + ', p. 84.',
      alt: 'El agua baja frente a una playa con bosque. En el agua hay una pegatina de pescado, con borde de papel: se puede juntar.',
      mapa: ['GGLLGGGG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'pescado', x: 4, y: 2 }] },
    },
    hongos: {
      id: 'hongos', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Alimento', titulo: 'Hongos de los árboles',
      dato: 'Comían los hongos que crecen en los árboles, no los del suelo, y los guardaban secos.',
      juego: 'Los hongos se juntan en la orilla del bosque.',
      fuente: COOPER + ', p. 84.',
      alt: 'Un bosque en otoño, con árboles rojos y verdes, al lado de una playa. Al pie del bosque hay una pegatina de hongos, con borde de papel: se puede juntar.',
      mapa: ['LLGLLGLL', 'p......p', ',,,,,,,,'], extra: { objetos: [{ id: 'hongos', x: 3, y: 1 }], estacion: 'otono' },
    },
    pirita: {
      id: 'pirita', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Fuego', titulo: 'Piedras de fuego',
      dato: 'El fuego se hacía golpeando pirita contra pedernal, con plumón de ave u hongo seco como yesca. La pirita solo se hallaba en algunos lugares.',
      juego: 'Con pirita, el fuego apagado se puede volver a encender una vez.',
      fuente: COOPER + ', p. 91 y 95.',
      alt: 'Una playa al pie del bosque, con una roca en la orilla. Sobre la arena hay una pegatina de pirita, una piedra dorada junto a una piedra gris, con borde de papel: se puede juntar.',
      mapa: ['GGGGLLGG', '..r.....', ',,,,,,,,'], extra: { objetos: [{ id: 'pirita', x: 3, y: 1 }] },
    },
    choza: {
      id: 'choza', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Refugio', titulo: 'Una casa de varas',
      dato: 'La choza más común era de domo: varas flexibles dobladas, cubiertas con pasto, helechos, ramas, corteza o cueros. El fuego iba en el centro y la puerta miraba al mar.',
      juego: 'Junto a una choza, el fuego se gasta más despacio.',
      fuente: COOPER + ', p. 85-86.',
      alt: 'Una choza de domo en un claro entre el bosque y la playa, con humo que sale de arriba y la puerta hacia el mar, donde se ve el fuego. Más cerca del agua, un montón de conchas en forma de anillo.',
      mapa: ['LLGGLLGL', 'Gp..p.GG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'choza', x: 3, y: 1 }, { id: 'conchal', x: 5, y: 2 }] },
    },
    corteza: {
      id: 'corteza', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Canoa', titulo: 'Una canoa de corteza',
      dato: 'Se hacía con tres tiras de corteza de guindo, sacadas en primavera, cuando sube la savia. Se cosían con barba de ballena y las costillas eran de canelo.',
      juego: 'Encontrar un guindo grande permite arreglar la canoa.',
      fuente: COOPER + ', p. 88.',
      alt: 'Un árbol grande y solo, de tronco recto, en una playa entre el bosque y el canal.',
      mapa: ['GGGGGGGG', 'GG....GG', ',,,,,,,,'], extra: { objetos: [{ id: 'guindo-grande', x: 3, y: 1 }] },
    },
    ballena: {
      id: 'ballena', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Encuentro', titulo: 'La ballena varada',
      dato: 'Las ballenas varadas se aprovechaban con entusiasmo. Por una ballena, una familia podía entrar al territorio de otra, y el varamiento reunía a muchas familias.',
      juego: 'Una ballena varada puede ser el destino del viaje: llegar con el fuego encendido.',
      fuente: COOPER + ', p. 84, 94-95 y 99.',
      alt: 'Una ballena varada sobre la arena de una playa, al pie del bosque. Detrás de los árboles sube humo de fogones lejanos.',
      mapa: ['GGLGGGLG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'ballena-varada', x: 4, y: 1 }], humos: [{ x: 1.5, y: 0.6 }, { x: 7.2, y: 0.8 }] },
    },
  };
  const ORDEN = Object.keys(SABERES);
  const modulo = { COOPER, SABERES, ORDEN };
  if (typeof module !== 'undefined' && module.exports) module.exports = modulo;
  else raiz.TDH_SABERES = modulo;
})(typeof window !== 'undefined' ? window : globalThis);
