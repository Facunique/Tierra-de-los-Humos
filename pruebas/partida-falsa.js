/*
 * Tierra de los Humos · Partida FALSA para probar la interfaz
 * -----------------------------------------------------------
 * No es el núcleo del juego (ese lo hace la Persona A en juego/nucleo/). Sirve
 * para que la interfaz (juego/interfaz/) se pueda programar y probar mientras
 * tanto, contra el mismo contrato. Los números son de prueba.
 *
 * Contrato (propuesta de B, falta acordarlo con A; ver equipo/memory.md):
 *
 *   const partida = TDH_PARTIDA.nueva({ semilla, saberes });
 *     semilla: número (misma semilla, misma partida).
 *     saberes: ids de las cartas que se pueden encontrar en este viaje, en orden.
 *              🔍 por acordar: ¿el catálogo entero o solo los que faltan heredar?
 *
 *   partida.estado   la forma que espera motor.escena de Corteza:
 *                    { mapa, objetos, canoa: { x, y, fuego }, explorado, clima, estacion }
 *                    (explorado es una función (x, y) => true/false)
 *
 *   partida.hacer({ tipo: 'remar', dx, dy })  →  lista de eventos, en orden:
 *     { tipo: 'fuego', antes, despues, motivo }   el fuego cambió (0 a 4)
 *     { tipo: 'junto', que }                     se juntó algo (id de la pegatina)
 *     { tipo: 'saber', id }                      se encontró un saber (id de datos/saberes.js)
 *     { tipo: 'fin', gano }                      terminó el viaje
 *   Si no se puede remar hacia ahí (tierra o borde), devuelve [].
 *
 * Esta partida falsa tira un saber a los 3 pasos y otro cada 6 pasos, para poder
 * ver la carta enseguida.
 *
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';

  const MAPA = [
    'MMLMMMLLMMMMLLMM',
    'GLLGGLLpLGGLLGGL',
    'GG...GGG..GGG..G',
    ',,k,,,,,r,,,,k,,',
    '-,,--------,,---',
    '~~~~~~~~~~~~~~~~',
    '---~~~~~~~~~----',
    ',,k,,----,,,,r,,',
    '..,,,,..,,,,....',
  ];
  const AGUA = '~-,k';

  // Generador de números al azar con semilla (mulberry32): misma semilla, misma partida.
  function azar(semilla) {
    let a = semilla >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function nueva(opciones) {
    const op = opciones || {};
    const al = azar(op.semilla == null ? 1 : op.semilla);
    const pendientes = (op.saberes || []).slice();
    const visto = new Set();
    let pasos = 0, energia = 16, terminada = false;

    const estado = {
      mapa: MAPA.slice(),
      objetos: [
        { id: 'lena', x: 4, y: 2 }, { id: 'mejillones', x: 9, y: 2 },
        { id: 'choza', x: 6, y: 8 }, { id: 'pescado', x: 12, y: 7 },
        { id: 'ballena-varada', x: 14, y: 8 },
      ],
      canoa: { x: 1, y: 4, fuego: 4, mira: 1, remando: false },
      explorado: (x, y) => visto.has(x + ',' + y),
      clima: 'calma',
      estacion: ['verano', 'otono', 'invierno', 'primavera'][Math.floor(al() * 4)],
      hora: 'dia',
    };

    function revelar(cx, cy) {
      for (let y = 0; y < MAPA.length; y++) for (let x = 0; x < MAPA[0].length; x++) {
        const dx = (x - cx) / 1.7, dy = (y - cy) / 1.4;
        if (dx * dx + dy * dy < 3.4 * 3.4) visto.add(x + ',' + y);
      }
    }
    const esAgua = (x, y) => y >= 0 && x >= 0 && y < MAPA.length && x < MAPA[0].length && AGUA.includes(MAPA[y][x]);
    const fuegoDe = (e) => Math.ceil(e / 4);
    revelar(estado.canoa.x, estado.canoa.y);

    function remar(dx, dy) {
      const c = estado.canoa, nx = c.x + dx, ny = c.y + dy;
      if (!esAgua(nx, ny)) return [];
      const eventos = [];
      if (dx) c.mira = Math.sign(dx);
      c.x = nx; c.y = ny;
      pasos++;
      revelar(nx, ny);

      // Gastar el fuego (de prueba): 1 por paso, 2 con viento en el canal hondo.
      const antes = c.fuego;
      energia = Math.max(0, energia - (estado.clima === 'viento' && MAPA[ny][nx] === '~' ? 2 : 1));
      c.fuego = fuegoDe(energia);
      if (c.fuego !== antes) eventos.push({ tipo: 'fuego', antes, despues: c.fuego, motivo: 'remar' });
      if (pasos % 8 === 0) estado.clima = estado.clima === 'calma' ? 'viento' : 'calma';

      // Juntar lo que esté pegado a la canoa (no la ballena ni la choza).
      const cerca = estado.objetos.find((o) => !['ballena-varada', 'choza'].includes(o.id) && Math.abs(o.x - nx) + Math.abs(o.y - ny) <= 1);
      if (cerca) {
        estado.objetos = estado.objetos.filter((o) => o !== cerca);
        eventos.push({ tipo: 'junto', que: cerca.id });
        if (cerca.id === 'lena') {
          const a = c.fuego; energia = Math.min(16, energia + 6); c.fuego = fuegoDe(energia);
          if (c.fuego !== a) eventos.push({ tipo: 'fuego', antes: a, despues: c.fuego, motivo: 'lena' });
        }
      }

      // Un saber a los 3 pasos y después cada 6.
      if (pendientes.length && (pasos === 3 || (pasos > 3 && (pasos - 3) % 6 === 0))) eventos.push({ tipo: 'saber', id: pendientes.shift() });

      const ballena = estado.objetos.find((o) => o.id === 'ballena-varada');
      if (ballena && Math.abs(ballena.x - nx) <= 1 && Math.abs(ballena.y - ny) <= 1) { terminada = true; eventos.push({ tipo: 'fin', gano: true }); }
      else if (c.fuego === 0) { terminada = true; eventos.push({ tipo: 'fin', gano: false }); }
      return eventos;
    }

    return {
      estado,
      get terminada() { return terminada; },
      hacer(accion) {
        if (terminada || !accion) return [];
        if (accion.tipo === 'remar') return remar(Math.sign(accion.dx || 0), Math.sign(accion.dy || 0));
        return [];
      },
    };
  }

  const api = { nueva };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_PARTIDA = api;
})(typeof window !== 'undefined' ? window : globalThis);
