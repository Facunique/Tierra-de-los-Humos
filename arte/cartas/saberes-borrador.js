/*
 * Tierra de los Humos · Cartas de saber (BORRADOR para la Persona C)
 * ------------------------------------------------------------------
 * Textos armados con el capítulo «The Yahgan» de Cooper (1946), con página.
 * La Persona C los revisa, corrige o reemplaza; la Persona B define la estructura
 * final de datos del juego. Mientras tanto, este archivo alimenta la maqueta de
 * pantallas, las cartas para imprimir y la presentación.
 *
 * Cada carta: tipo · titulo · dato (lo que dice la fuente) · juego (recurso de juego)
 *             · fuente (con página) · mapa + extra (ilustración con el motor Corteza).
 *
 * Licencia: CC BY-SA 4.0.
 */
(function (raiz) {
  'use strict';
  const COOPER = 'Cooper, J. M. (1946). «The Yahgan». <i>Handbook of South American Indians</i>, vol. 1. Smithsonian Institution';
  const SABERES = {
    fuego: { tipo: 'Fuego', titulo: 'El fuego viaja en la canoa', dato: 'El fuego viajaba en el medio de la canoa, sobre un lecho de tierra, conchas o piedras, y se mantenía siempre encendido.', juego: 'El fuego de la canoa es tu vida. Avivalo con leña.', fuente: COOPER + ', p. 88 y 91.', mapa: ['GGLGGLGG', '..,,,,..', ',,,--,,,'], extra: { canoa: { x: 3, y: 2, fuego: 4 }, hora: 'tarde' } },
    amarre: { tipo: 'Canoa', titulo: 'Amarrar en el cachiyuyo', dato: 'La mujer manejaba la canoa: remaba y, al llegar, la amarraba lejos de la orilla, en un bosque de cachiyuyo.', juego: 'Para acampar, amarrá la canoa en el cachiyuyo, cerca de una playa.', fuente: COOPER + ', p. 88 y 96.', mapa: ['GGLLGGGG', '........', ',,k,k,,,'], extra: { canoa: { x: 3, y: 2, fuego: 2 } } },
    mejillones: { tipo: 'Alimento', titulo: 'Mejillones, el alimento principal', dato: 'El mejillón era, lejos, el alimento más importante. Se juntaba a mano. Después venían los lobos marinos y los peces.', juego: 'Los mejillones son la comida más fácil de encontrar.', fuente: COOPER + ', p. 84 (según Lothrop, 1928, p. 32).', mapa: ['GGGGLLGG', '........', ',,r,,r,,'], extra: { objetos: [{ id: 'mejillones', x: 3, y: 1 }, { id: 'mejillones', x: 5, y: 1 }] } },
    pescado: { tipo: 'Alimento', titulo: 'Pescar sin anzuelo', dato: 'Pescaban las mujeres, con una línea de cachiyuyo o de tendón de ballena. En lugar de anzuelo, la carnada iba en un nudo corredizo de barba de ballena, y el pez se agarraba con la mano.', juego: 'El pescado se junta en el agua baja.', fuente: COOPER + ', p. 84.', mapa: ['GGLLGGGG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'pescado', x: 4, y: 2 }] } },
    hongos: { tipo: 'Alimento', titulo: 'Hongos de los árboles', dato: 'Comían los hongos que crecen en los árboles, no los del suelo, y los guardaban secos.', juego: 'Los hongos se juntan en la orilla del bosque.', fuente: COOPER + ', p. 84.', mapa: ['LLGLLGLL', 'p......p', ',,,,,,,,'], extra: { objetos: [{ id: 'hongos', x: 3, y: 1 }], estacion: 'otono' } },
    pirita: { tipo: 'Fuego', titulo: 'Piedras de fuego', dato: 'El fuego se hacía golpeando pirita contra pedernal, con plumón de ave u hongo seco como yesca. La pirita solo se hallaba en algunos lugares.', juego: 'Con pirita, el fuego apagado se puede volver a encender una vez.', fuente: COOPER + ', p. 91 y 95.', mapa: ['GGGGLLGG', '..r.....', ',,,,,,,,'], extra: { objetos: [{ id: 'pirita', x: 3, y: 1 }] } },
    choza: { tipo: 'Refugio', titulo: 'Una casa de varas', dato: 'La choza más común era de domo: varas flexibles dobladas, cubiertas con pasto, helechos, ramas, corteza o cueros. El fuego iba en el centro y la puerta miraba al mar.', juego: 'Junto a una choza, el fuego se gasta más despacio.', fuente: COOPER + ', p. 85-86.', mapa: ['LLGGLLGL', 'Gp..p.GG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'choza', x: 3, y: 1 }, { id: 'conchal', x: 5, y: 2 }] } },
    corteza: { tipo: 'Canoa', titulo: 'Una canoa de corteza', dato: 'Se hacía con tres tiras de corteza de guindo, sacadas en primavera, cuando sube la savia. Se cosían con barba de ballena y las costillas eran de canelo.', juego: 'Encontrar un guindo grande permite arreglar la canoa.', fuente: COOPER + ', p. 88.', mapa: ['GGGGGGGG', 'GG....GG', ',,,,,,,,'], extra: { objetos: [{ id: 'guindo-grande', x: 3, y: 1 }] } },
    ballena: { tipo: 'Encuentro', titulo: 'La ballena varada', dato: 'Las ballenas varadas se aprovechaban con entusiasmo. Por una ballena, una familia podía entrar al territorio de otra, y el varamiento reunía a muchas familias.', juego: 'Una ballena varada puede ser el destino del viaje: llegar con el fuego encendido.', fuente: COOPER + ', p. 84, 94-95 y 99.', mapa: ['GGLGGGLG', '........', ',,,,,,,,'], extra: { objetos: [{ id: 'ballena-varada', x: 4, y: 1 }], humos: [{ x: 1.5, y: 0.6 }, { x: 7.2, y: 0.8 }] } },
  };
  const ORDEN = Object.keys(SABERES);
  const modulo = { COOPER, SABERES, ORDEN };
  if (typeof module !== 'undefined' && module.exports) module.exports = modulo;
  else raiz.TDH_SABERES = modulo;
})(typeof window !== 'undefined' ? window : globalThis);
