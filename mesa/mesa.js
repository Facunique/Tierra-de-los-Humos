/*
 * Tierra de los Humos · Versión de mesa: datos compartidos
 * El mapa del tablero, dónde va cada ficha y cuántas fichas hay.
 * Lo usan tablero.html y fichas.html. Licencia: MIT (código), CC BY-SA 4.0 (juego).
 */
(function (raiz) {
  'use strict';
  // 16 × 10 casillas. ~ canal hondo · - canal · , agua baja · k cachiyuyo · r roca · . playa · G guindo · L lenga · t turbal · M cumbre
  const MAPA = [
    'MMMLLMMMLLMMMLLM',
    'LGGLLtLGGLLLGGtL',
    'G...GG....GG...G',
    ',,k,,,r,,,k,,,,,',
    '--,-----------,-',
    '~~~~~~~--~~~~~~~',
    '---~~~~~~~~~~---',
    ',k,,,,r,,,,,k,,,',
    'G.....GG.....G..',
    'LLGGLLLGGtLLGGLL',
  ];
  // Paisaje impreso en el tablero
  const FIJOS = [
    { id: 'choza', x: 1, y: 2 }, { id: 'conchal', x: 3, y: 2 },
    { id: 'ballena-varada', x: 14, y: 8 },
    { id: 'guindo-grande', x: 10, y: 1 },
    { id: 'lobo-marino', x: 6, y: 3 }, { id: 'cormoran', x: 6, y: 7 }, { id: 'tonina', x: 11, y: 5 },
  ];
  // Lugares de las fichas: se ponen boca abajo (humo arriba) al empezar
  const LUGARES = [
    { x: 2, y: 2, ficha: 'lena' }, { x: 8, y: 2, ficha: 'lena' }, { x: 12, y: 2, ficha: 'lena' }, { x: 3, y: 8, ficha: 'lena' }, { x: 10, y: 8, ficha: 'lena' },
    { x: 7, y: 2, ficha: 'mejillones' }, { x: 5, y: 8, ficha: 'mejillones' }, { x: 12, y: 8, ficha: 'mejillones' },
    { x: 4, y: 3, ficha: 'pescado' }, { x: 9, y: 7, ficha: 'pescado' },
    { x: 13, y: 2, ficha: 'hongos' }, { x: 8, y: 8, ficha: 'pirita' },
    { x: 5, y: 2, ficha: 'saber' }, { x: 11, y: 3, ficha: 'saber' }, { x: 2, y: 8, ficha: 'saber' }, { x: 11, y: 8, ficha: 'saber' },
  ];
  const PEGATINA = { lena: 'icono-lena', mejillones: 'icono-comida', pescado: 'icono-pez', hongos: 'icono-hongo', pirita: 'icono-pirita', saber: 'icono-saber' };
  const NOMBRE = { lena: 'Leña', mejillones: 'Mejillones', pescado: 'Pescado', hongos: 'Hongos', pirita: 'Pirita', saber: 'Saber' };
  const INICIO = { x: 1, y: 3 }; // la canoa arranca en el agua, frente a la choza
  const api = { MAPA, FIJOS, LUGARES, PEGATINA, NOMBRE, INICIO, COLUMNAS: 'ABCDEFGHIJKLMNOP' };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_MESA = api;
})(typeof window !== 'undefined' ? window : globalThis);
