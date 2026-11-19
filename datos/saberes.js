/*
 * Tierra de los Humos · Cartas de saber
 * -------------------------------------
 * Los datos de las cartas, separados del código. Los usan el juego, la maqueta
 * (arte/pantallas), las cartas para imprimir, la presentación, la guía para
 * docentes y la vidriera del stand. Se cargan con un <script> clásico y quedan
 * en la global TDH_SABERES = { COOPER, SABERES, ORDEN }. En Node, con require().
 *
 * Fuente principal: Vargas Filgueira (2019), con página del visor del PDF.
 * Cooper (1946) documenta los detalles que el pasaje de Vargas no confirma.
 * La entrevista se registra aparte; no se inventan respuestas ni permisos.
 * Las nueve cartas originales fueron revisadas y aprobadas por Dani (18/11/2026).
 * Es revisión de contenido del equipo; la consulta comunitaria sigue abierta.
 * Ver docs/03 y docs/05. Las ocho propuestas nuevas siguen en otro archivo.
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
  const VARGAS = 'Vargas Filgueira, Víctor (2019). Mi sangre yagán (ahua saapa yagan). Primera edición digital. Editora Cultural Tierra del Fuego';
  const SABERES = {
    fuego: {
      id: 'fuego', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Fuego', titulo: 'El fuego viaja en la canoa',
      dato: 'El fuego se lleva encendido en la canoa. Antes de partir, se acomoda junto con las pertenencias del viaje.',
      juego: 'Avivá el fuego con leña para seguir el viaje.',
      fuente: VARGAS + ', p. 33 del visor del PDF.',
      alt: 'Una canoa de corteza frente a una playa con bosque. En el centro arde el fuego y sube humo. Van dos personas sin rasgos: una lleva un arpón en reposo y la otra, un remo.',
      mapa: ['GGLGGLGG', '..,,,,..', ',,,--,,,'], extra: { canoa: { x: 3, y: 2, fuego: 4 }, hora: 'tarde' },
    },
    amarre: {
      id: 'amarre', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Canoa', titulo: 'Amarrar en el cachiyuyo',
      dato: 'El manejo de la canoa incluye el remo y el amarre. Para detenerse, la canoa se amarra en bancos de grandes algas marinas, fuera de la orilla.',
      juego: 'Para acampar, amarrá la canoa en el cachiyuyo, cerca de una playa.',
      fuente: COOPER + ', p. 88 (paginación impresa; amarre). Referencia complementaria para mujeres remando: ' + VARGAS + ', p. 33 del visor del PDF.',
      alt: 'La canoa, con el fuego encendido y dos personas en silueta, está quieta entre las algas del cachiyuyo, en el agua frente a una playa con bosque.',
      mapa: ['GGLLGGGG', '........', ',,k,k,,,'], extra: { canoa: { x: 3, y: 2, fuego: 2 } },
    },
    mejillones: {
      id: 'mejillones', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Alimento', titulo: 'Recolectar en la costa',
      dato: 'La marea baja permite recolectar mariscos en la costa. Después de preparar el campamento, se aprovecha ese momento para reunir alimento.',
      juego: 'Juntá mejillones en la playa para sumar comida.',
      fuente: VARGAS + ', p. 30 y 44 del visor del PDF.',
      alt: 'Una playa al pie del bosque, con dos rocas en el agua. Sobre la playa hay dos pegatinas de mejillones con borde de papel.',
      mapa: ['GGGGLLGG', '........', ',,r,,r,,'], extra: { objetos: [{ id: 'mejillones', x: 3, y: 1 }, { id: 'mejillones', x: 5, y: 1 }] },
    },
    pescado: {
      id: 'pescado', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Alimento', titulo: 'Pescar para el campamento',
      dato: 'La pesca aporta alimento al campamento. Mientras parte del grupo sale a pescar, otras personas trabajan la corteza para fabricar canoas.',
      juego: 'El pescado se junta en el agua baja.',
      fuente: VARGAS + ', p. 30 y 39 del visor del PDF.',
      alt: 'Agua frente a una playa con bosque. En el agua hay una pegatina de pescado con borde de papel.',
      mapa: ['GGLLGGGG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'pescado', x: 4, y: 2 }] },
    },
    hongos: {
      id: 'hongos', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Alimento', titulo: 'Hongos de los árboles',
      dato: 'Los hongos de los árboles y las raíces complementan los alimentos disponibles durante un invierno difícil.',
      juego: 'Los hongos se juntan en la orilla del bosque.',
      fuente: VARGAS + ', p. 54 del visor del PDF.',
      alt: 'Árboles rojos y verdes junto a una playa. Sobre la playa hay una pegatina de hongos amarillos y anaranjados sobre una rama, con borde de papel.',
      mapa: ['LLGLLGLL', 'p......p', ',,,,,,,,'], extra: { objetos: [{ id: 'hongos', x: 3, y: 1 }], estacion: 'otono' },
    },
    pirita: {
      id: 'pirita', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Fuego', titulo: 'Piedras de fuego',
      dato: 'La pirita se usa junto con el pedernal para encender el fuego. Como escasea, se mantiene una fogata encendida en la canoa durante los viajes.',
      juego: 'Si llevás pirita, el juego la usa automáticamente para volver a encender el fuego una vez.',
      fuente: COOPER + ', p. 91 y 95 (materiales). Vargas Filgueira, Víctor (2026). Entrevista del 13/11/2026 (escasez y transporte del fuego), confirmada por C el 14/11.',
      alt: 'Una playa al pie del bosque, con una roca en la orilla. Sobre la playa hay una pegatina de una piedra dorada junto a una piedra gris, con borde de papel.',
      mapa: ['GGGGLLGG', '..r.....', ',,,,,,,,'], extra: { objetos: [{ id: 'pirita', x: 3, y: 1 }] },
    },
    choza: {
      id: 'choza', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Refugio', titulo: 'Preparar el campamento',
      dato: 'Las viviendas del campamento se arman al detenerse y se desarman antes de continuar. El campamento forma parte del recorrido.',
      juego: 'Junto a una choza, el fuego se gasta más despacio.',
      fuente: VARGAS + ', p. 30 y 33 del visor del PDF.',
      alt: 'Una choza de domo en un claro junto a la playa. Sale humo de arriba y se ve fuego por la puerta. Más cerca del agua hay un anillo de conchas claras.',
      mapa: ['LLGGLLGL', 'Gp..p.GG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'choza', x: 3, y: 1 }, { id: 'conchal', x: 5, y: 2 }] },
    },
    corteza: {
      id: 'corteza', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Canoa', titulo: 'Una canoa de corteza',
      dato: 'La corteza se busca en la época en que se afloja. También se conserva en el agua de un turbal para recuperarla cuando hace falta reparar una canoa.',
      juego: 'La primera vez que juntás corteza, descubrís este saber.',
      fuente: VARGAS + ', p. 23 y 31-32 del visor del PDF.',
      alt: 'Un árbol de tronco recto con una franja clara en la corteza, en una playa entre el bosque y el canal.',
      mapa: ['GGGGGGGG', 'GG....GG', ',,,,,,,,'], extra: { objetos: [{ id: 'guindo-grande', x: 3, y: 1 }] },
    },
    ballena: {
      id: 'ballena', pueblo: 'yagan', estado: 'revisado',
      tipo: 'Encuentro', titulo: 'La ballena varada',
      dato: 'Una ballena varada reúne a varias familias para compartir alimento y reencontrarse. Acudir al varamiento puede motivar un viaje.',
      juego: 'Una ballena varada es uno de los motivos del viaje. En esta versión, llegar con el fuego encendido completa la partida.',
      fuente: VARGAS + ', p. 16-17 del visor del PDF.',
      alt: 'Una ballena sobre la playa, al pie del bosque. Por encima de los árboles se ven columnas de humo.',
      mapa: ['GGLGGGLG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'ballena-varada', x: 4, y: 1 }], humos: [{ x: 1.5, y: 0.6 }, { x: 7.2, y: 0.8 }] },
    },
  };
  const ORDEN = Object.keys(SABERES);
  const modulo = { COOPER, SABERES, ORDEN };
  if (typeof module !== 'undefined' && module.exports) module.exports = modulo;
  else raiz.TDH_SABERES = modulo;
})(typeof window !== 'undefined' ? window : globalThis);
