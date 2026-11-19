// Prueba los minijuegos (minijuegos/minijuegos.js): que cada uno tenga sus textos,
// su escena y su dibujo, que los datos citen fuente y que la lógica sin pantalla ande.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const MJ = require('../minijuegos/minijuegos.js');
const CZ = require('../arte/corteza/corteza.js');
const ARTE = require('../arte/fuente/arte.js');
const { ELEMENTOS } = require('../juego/nucleo/territorio/elementos.js');

test('cada minijuego tiene título, pedido, escena, mecánica y un dibujo que existe', () => {
  const MEC = Object.assign({}, require('../minijuegos/juegos-tierra.js'), require('../minijuegos/juegos-canoa.js'));
  for (const [id, j] of Object.entries(MJ.JUEGOS)) {
    assert.ok(j.titulo && j.pide && j.premio, id + ': falta el texto');
    assert.equal(typeof MEC[j.mecanica], 'function', id + ': no existe la mecánica ' + j.mecanica);
    assert.ok(MJ.ESCENAS[j.escena], id + ': no existe la escena ' + j.escena);
    assert.ok(CZ.PEGATINAS[j.objeto] || ARTE.SPRITES[j.objeto], id + ': no existe el dibujo ' + j.objeto);
    assert.ok(j.segundos > 0 || j.intentos > 0, id + ': sin tiempo ni intentos no se puede perder');
    if (j.banda) assert.ok(j.cantidad > 0 && j.banda[0] < j.banda[1], id + ': faltan cantidad o franja');
  }
});

test('los minijuegos se juegan distinto: no todos son tocar (19/11)', () => {
  const mecanicas = new Set(Object.values(MJ.JUEGOS).map((j) => j.mecanica));
  assert.equal(mecanicas.size, Object.keys(MJ.JUEGOS).length, 'cada minijuego con su propia mecánica');
});

test('los textos son cortos: se leen de un vistazo', () => {
  for (const [id, j] of Object.entries(MJ.JUEGOS)) {
    assert.ok(j.titulo.length <= 32, id + ': título largo');
    assert.ok(j.pide.length <= 110, id + ': pedido largo (' + j.pide.length + ')');
  }
});

test('las escenas usan solo letras que el motor Corteza conoce', () => {
  for (const [k, m] of Object.entries(MJ.ESCENAS)) {
    assert.ok(m.every((f) => /^[~\-,kr.pGLtM]+$/.test(f) && f.length === m[0].length), 'la escena «' + k + '» tiene letras o filas raras');
  }
});

test('qué minijuego va antes de cada acción', () => {
  assert.equal(MJ.cual('juntar', 'mejillones'), MJ.JUEGOS.mejillones);
  assert.equal(MJ.cual('juntar', 'pescado'), MJ.JUEGOS.pescado);
  assert.equal(MJ.cual('avivar'), MJ.JUEGOS.avivar);
  assert.equal(MJ.cual('amarrar'), MJ.JUEGOS.amarrar);
  assert.equal(MJ.cual('juntar', 'saber'), null, 'un saber abre su carta, sin minijuego');
  assert.equal(MJ.cual('juntar', null), null);
  assert.equal(MJ.cual('remar'), null);
  // Todo lo que se junta en el mapa y no es un saber tiene minijuego, salvo lo que todavía no tiene efecto.
  for (const [id, e] of Object.entries(ELEMENTOS)) {
    if (!e.efecto || e.efecto.tipo !== 'sumar') continue;
    assert.ok(MJ.cual('juntar', id), 'falta un minijuego para juntar «' + id + '»');
  }
});

test('lo que se dibuja tiene su fuente con año y página (no se muestra: va a docs/05)', () => {
  for (const [id, j] of Object.entries(MJ.JUEGOS)) {
    assert.match(j.fuente, /^(Cooper|Vargas Filgueira) \((1946|2019)\), pp?\. \d/, id + ': falta el autor, el año o la página');
  }
});

test('los textos respetan las líneas rojas del repositorio', () => {
  const todo = Object.values(MJ.JUEGOS).map((j) => [j.titulo, j.pide, j.premio, j.boton].join(' ')).join(' ');
  assert.doesNotMatch(todo.replace(/sin anzuelo/g, ''), /anzuelo/i, 'nada de anzuelos (docs/05)');
  assert.doesNotMatch(todo, /(red|redes|perro|perros|cazar|caza|arpón|matar)/i, 'sin redes, perros ni escenas de caza');
  assert.doesNotMatch(todo, /extingui|desaparecid/i, 'los pueblos van en presente');
});

test('las cosas aparecen en su franja, sin pisarse, y siempre en el mismo lugar con la misma semilla', () => {
  for (const id of ['lena', 'mejillones', 'hongos', 'pirita']) {
    const j = MJ.JUEGOS[id], total = j.cantidad + (j.piedras || j.vacios || 0), l = MJ.lugares(j, MJ.azar(42), total);
    assert.equal(l.length, total);
    const x = j.x || [0.08, 0.92];
    for (const p of l) assert.ok(p.x >= x[0] && p.x <= x[1] && p.y >= j.banda[0] && p.y <= j.banda[1], id + ': algo quedó fuera de la franja');
    assert.deepEqual(MJ.lugares(j, MJ.azar(42), total), l);
  }
  // Las ramas no aparecen ya sobre la canoa (a la derecha, abajo).
  for (let s = 1; s < 30; s++) for (const p of MJ.lugares(MJ.JUEGOS.lena, MJ.azar(s))) assert.ok(p.x < 0.6);
  const l = MJ.lugares(MJ.JUEGOS.mejillones, MJ.azar(5));
  assert.ok(l.some((p) => p.y <= MJ.LINEA_MAREA), 'con la marea alta tiene que quedar algún mejillón a la vista');
});

test('la marea sube un rato y baja', () => {
  let alta = 0;
  for (let s = 0; s < 45; s += 0.05) if (MJ.mareaAlta(s)) alta++;
  assert.ok(alta > 0 && alta < 900 * 0.4, 'la marea alta dura menos de la mitad del tiempo');
});

test('la racha sube la dificultad de a poco, con tope', () => {
  assert.equal(MJ.dificultad(0), 1);
  assert.ok(MJ.dificultad(3) > MJ.dificultad(1));
  assert.equal(MJ.dificultad(5), MJ.dificultad(50), 'hasta racha 5');
  assert.ok(MJ.dificultad(5) <= 1.35, 'nunca se vuelve imposible');
});

test('sin pantalla (Node), jugar no bloquea: devuelve que sí', async () => {
  assert.equal(await MJ.jugar('juntar', 'lena'), true);
  assert.equal(await MJ.jugar('juntar', 'saber'), true);
  assert.equal(MJ.abierto(), false);
});

test('la racha suma al primer intento y se corta al fallar', () => {
  MJ.anotar(false);
  assert.equal(MJ.anotar(true).racha, 1);
  const r = MJ.anotar(true);
  assert.equal(r.racha, 2);
  assert.ok(r.mejor >= 2);
  assert.equal(MJ.anotar(false).racha, 0);
  assert.ok(MJ.racha.mejor >= 2, 'la mejor racha se conserva');
});

test('lo que cambió en una acción se cuenta en corto, con su signo', () => {
  assert.deepEqual(CZ.cambios({ fuego: 3, lena: 1, comida: 0, pirita: 0 }, { fuego: 3, lena: 3, comida: 0, pirita: 0 }), [{ texto: '+2 leña', bueno: true }]);
  assert.deepEqual(CZ.cambios({ fuego: 3, lena: 1 }, { fuego: 2, lena: 0 }), [{ texto: '−1 fuego', bueno: false }, { texto: '−1 leña', bueno: false }]);
  assert.deepEqual(CZ.cambios({ pirita: 0 }, { pirita: 1 }), [{ texto: '+ pirita', bueno: true }]);
  assert.deepEqual(CZ.cambios({ fuego: 2 }, { fuego: 2 }), []);
});
