/*
 * Tierra de los Humos · Cartas nuevas basadas en Vargas Filgueira (2019)
 * Borradores de contenido de C, 14/11. Misma plantilla que datos/saberes.js.
 * No se carga este archivo en el juego: sus eventos se acuerdan con A y B.
 * «juego» es una propuesta, sin efectos ni cantidades implementados.
 * Se reutilizan escenas existentes; el alt describe esas escenas, no el libro.
 * Nombres de personajes pendientes. Sin citas textuales de la entrevista.
 * Licencia: CC BY-SA 4.0.
 */
(function (raiz) {
  'use strict';
  const VARGAS = 'Vargas Filgueira, Víctor (2019). Mi sangre yagán (ahua saapa yagan). Primera edición digital. Editora Cultural Tierra del Fuego';
  const SABERES = {
    'reservas-invierno': {
      id: 'reservas-invierno', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Alimento', titulo: 'Volver por las reservas',
      dato: 'Vargas Filgueira relata una expedición para recuperar grasa de ballena guardada en un turbal. El grupo prepara el viaje de ida y vuelta para abastecerse durante el invierno.',
      juego: 'Propuesta: viajar a buscar provisiones guardadas y regresar al campamento. No está implementado como objetivo.',
      fuente: VARGAS + ', p. 53-54 del visor del PDF.',
      alt: 'Un canal frente a una playa con bosque. La escena no muestra alimentos almacenados.',
      mapa: ['GGLGGGLG', '........', ',,,,,,,,'], extra: { estacion: 'otono' },
    },
    'bahia-protegida': {
      id: 'bahia-protegida', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Refugio', titulo: 'Buscar reparo del viento',
      dato: 'En el relato de Vargas Filgueira, el grupo cambia su campamento a una bahía que ofrece mayor protección contra el viento del oeste.',
      juego: 'Propuesta: elegir un lugar de descanso según el viento. La relación entre orientación y reparo necesita integración con A y B.',
      fuente: VARGAS + ', p. 56 del visor del PDF.',
      alt: 'Una choza de domo en un claro junto a la playa, con fuego visible por la puerta y bosque detrás.',
      mapa: ['LLGGLLGL', 'Gp..p.GG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'choza', x: 3, y: 1 }] },
    },
    'luz-para-llegar': {
      id: 'luz-para-llegar', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Territorio', titulo: 'Llegar con luz',
      dato: 'Vargas Filgueira relata viajes atentos a la luz disponible. En otro episodio, el grupo elige tramos cortos para llegar con tiempo de preparar el campamento.',
      juego: 'Propuesta: reconocer la planificación del descanso antes de la noche. El juego ya distingue día y noche; esta carta aún no se descubre.',
      fuente: VARGAS + ', p. 33 y 44 del visor del PDF.',
      alt: 'Una canoa de corteza con fuego y dos figuras sin rasgos, frente a una playa con bosque al atardecer.',
      mapa: ['GGLGGLGG', '..,,,,..', ',,,--,,,'], extra: { canoa: { x: 3, y: 2, fuego: 4 }, hora: 'tarde' },
    },
    'aprender-canoas': {
      id: 'aprender-canoas', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Canoa', titulo: 'Aprender con las personas mayores',
      dato: 'Vargas Filgueira relata a personas mayores enseñando a trabajar la corteza para construir pequeñas canoas. Más adelante, los niños adquieren experiencia navegando junto al grupo.',
      juego: 'Propuesta: vincular esta carta con la transmisión de saberes al terminar un viaje. No agrega una reparación ni un beneficio nuevo.',
      fuente: VARGAS + ', p. 39 y 44 del visor del PDF.',
      alt: 'Un árbol de tronco recto con una franja clara en la corteza, junto al bosque y el canal. No se representa una clase de construcción.',
      mapa: ['GGGGGGGG', 'GG....GG', ',,,,,,,,'], extra: { objetos: [{ id: 'guindo-grande', x: 3, y: 1 }] },
    },
    'decidir-rumbo': {
      id: 'decidir-rumbo', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Encuentro', titulo: 'Conversar el próximo rumbo',
      dato: 'Vargas Filgueira relata decisiones compartidas sobre la vida del campamento. En un viaje, las personas mayores aconsejan el rumbo y el grupo acuerda dónde continuar.',
      juego: 'Propuesta: presentar varios motivos de viaje para decidir el siguiente recorrido. No cambia los objetivos del prototipo.',
      fuente: VARGAS + ', p. 46 y 50 del visor del PDF.',
      alt: 'Una canoa con fuego y dos personas en silueta navega frente a una playa con bosque. No se dibuja una asamblea.',
      mapa: ['GGLGGLGG', '..,,,,..', ',,,--,,,'], extra: { canoa: { x: 3, y: 2, fuego: 4 } },
    },
    'marea-y-paso': {
      id: 'marea-y-paso', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Territorio', titulo: 'La marea también abre paso',
      dato: 'Vargas Filgueira relata un tramo del viaje en el que la marea alta permite atravesar una zona de algas.',
      juego: 'Propuesta: considerar los momentos de paso durante un recorrido. El prototipo todavía no simula mareas.',
      fuente: VARGAS + ', p. 61 del visor del PDF.',
      alt: 'Agua con cachiyuyo frente a una playa con bosque. La ilustración no muestra un cambio de nivel de la marea.',
      mapa: ['GGLLGGGG', '........', ',,k,k,,,'], extra: {},
    },
    'agua-fresca': {
      id: 'agua-fresca', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Territorio', titulo: 'Buscar agua fresca',
      dato: 'Vargas Filgueira incluye la búsqueda de agua entre las tareas del campamento. En días de calor, algunos cursos pequeños se secan y el relato describe la búsqueda de agua más arriba.',
      juego: 'Propuesta: considerar el agua al elegir dónde detenerse. No se agrega una reserva de agua ni una necesidad nueva a la partida.',
      fuente: VARGAS + ', p. 46 y 61 del visor del PDF.',
      alt: 'Una costa con bosque frente a un canal. La ilustración no dibuja un río ni identifica agua potable.',
      mapa: ['GGLGGGLG', '........', ',,,,,,,,'], extra: {},
    },
    'corteza-guardada': {
      id: 'corteza-guardada', pueblo: 'yagan', estado: 'borrador',
      tipo: 'Canoa', titulo: 'Guardar material para otro viaje',
      dato: 'Vargas Filgueira relata la recuperación de corteza conservada en el agua de un turbal. Se retira lo necesario y se vuelve a sumergir el resto para quien pueda necesitarlo.',
      juego: 'Propuesta: recuperar materiales guardados sin agotar la reserva. La reparación de la canoa y esa reserva todavía no son mecánicas del juego.',
      fuente: VARGAS + ', p. 31-32 del visor del PDF.',
      alt: 'Un árbol junto al bosque y el canal, con una franja clara en la corteza. No se muestran cortezas almacenadas ni una reparación.',
      mapa: ['GGGGGGGG', 'GG....GG', ',,,,,,,,'], extra: { objetos: [{ id: 'guindo-grande', x: 3, y: 1 }] },
    },
  };
  const ORDEN = Object.keys(SABERES);
  const modulo = { SABERES, ORDEN };
  if (typeof module !== 'undefined' && module.exports) module.exports = modulo;
  else raiz.TDH_SABERES_PROPUESTOS = modulo;
})(typeof window !== 'undefined' ? window : globalThis);
