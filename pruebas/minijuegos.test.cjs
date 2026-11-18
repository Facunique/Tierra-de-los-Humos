// Prueba los minijuegos (minijuegos/minijuegos.js): que cada uno tenga sus textos,
// su escena y su dibujo, que los datos citen fuente y que la lógica sin pantalla ande.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const MJ = require('../minijuegos/minijuegos.js');
const CZ = require('../arte/corteza/corteza.js');
const ARTE = require('../arte/fuente/arte.js');
const { ELEMENTOS } = require('../juego/nucleo/territorio/elementos.js');

test('cada minijuego tiene título, pedido, escena y un dibujo que existe', () => {
  for (const [id, j] of Object.entries(MJ.JUEGOS)) {
    assert.ok(j.titulo && j.pide, id + ': falta el texto');
    assert.ok(['juntar', 'tiempo'].includes(j.modo), id + ': modo desconocido');
    assert.ok(MJ.ESCENAS[j.escena], id + ': no existe la escena ' + j.escena);
    assert.ok(CZ.PEGATINAS[j.objeto] || ARTE.SPRITES[j.objeto], id + ': no existe el dibujo ' + j.objeto);
    if (j.modo === 'juntar') assert.ok(j.cantidad > 0 && j.segundos > 0 && j.banda[0] < j.banda[1], id + ': faltan cantidad, tiempo o franja');
    else assert.ok(j.intentos > 0 && j.ancho > 0 && j.ancho < 0.5 && j.boton, id + ': faltan intentos, zona o botón');
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

test('los datos citan su fuente con año y página, y la mecánica se presenta como recurso de juego', () => {
  for (const [id, j] of Object.entries(MJ.JUEGOS)) {
    if (j.dato == null) { assert.equal(id, 'lena', 'solo la leña va sin dato: falta una cita yagán'); continue; }
    // Redacción directa (decisión de C, 14/11): el autor va en la fuente, no en el dato.
    assert.doesNotMatch(j.dato, /Cooper|Vargas|relata|describe|menciona|documenta/, id + ': el dato habla del autor');
    assert.match(j.fuente, /^(Cooper|Vargas Filgueira) \((1946|2019)\), pp?\. \d/, id + ': falta el autor, el año o la página');
  }
  assert.match(MJ.RECURSO, /recurso de juego/);
});

test('los textos respetan las líneas rojas del repositorio', () => {
  const todo = Object.values(MJ.JUEGOS).map((j) => [j.titulo, j.pide, j.dato, j.boton, j.zonaNombre].join(' ')).join(' ') + ' ' + MJ.RECURSO;
  assert.doesNotMatch(todo.replace(/(sin|no usa) anzuelo/g, ''), /anzuelo/i, 'nada de anzuelos (docs/05)');
  assert.doesNotMatch(todo, /\b(red|redes|perro|perros|cazar|caza|arpón|matar)\b/i, 'sin redes, perros ni escenas de caza');
  assert.doesNotMatch(todo, /extingui|desaparecid/i, 'los pueblos van en presente');
});

test('la marca va y viene entre 0 y 1', () => {
  assert.equal(MJ.marcaEn(0, 0.5), 0);
  assert.equal(MJ.marcaEn(2, 0.5), 1);
  assert.equal(MJ.marcaEn(4, 0.5), 0);
  for (let s = 0; s < 20; s += 0.37) { const m = MJ.marcaEn(s, 0.42); assert.ok(m >= 0 && m <= 1); }
  assert.ok(MJ.dentro(0.5, { desde: 0.4, hasta: 0.6 }));
  assert.ok(!MJ.dentro(0.7, { desde: 0.4, hasta: 0.6 }));
});

test('la zona nunca queda pegada a un borde, y siempre se puede acertar', () => {
  const r = MJ.azar(3);
  for (const j of [MJ.JUEGOS.pescado, MJ.JUEGOS.avivar, MJ.JUEGOS.amarrar]) {
    for (let i = 0; i < 50; i++) {
      const z = MJ.zonaDe(j, r);
      assert.ok(z.desde >= 0.2 && z.hasta <= 0.8 + 1e-9, 'zona fuera de lugar');
      // En una vuelta entera, la marca pasa por la zona.
      let paso = false;
      for (let s = 0; s < 2 / j.vueltas; s += 0.01) if (MJ.dentro(MJ.marcaEn(s, j.vueltas), z)) paso = true;
      assert.ok(paso);
    }
  }
});

test('las cosas para juntar aparecen en su franja, sin pisarse, y siempre en el mismo lugar con la misma semilla', () => {
  for (const id of ['lena', 'mejillones', 'hongos', 'pirita']) {
    const j = MJ.JUEGOS[id], l = MJ.lugares(j, MJ.azar(42));
    assert.equal(l.length, j.cantidad + (j.piedras || 0));
    for (const p of l) assert.ok(p.x >= 0.08 && p.x <= 0.92 && p.y >= j.banda[0] && p.y <= j.banda[1], id + ': algo quedó fuera de la franja');
    assert.deepEqual(MJ.lugares(j, MJ.azar(42)), l);
  }
  const l = MJ.lugares(MJ.JUEGOS.mejillones, MJ.azar(5));
  assert.ok(l.some((p) => p.y <= MJ.LINEA_MAREA), 'con la marea alta tiene que quedar algún mejillón a la vista');
});

test('la marea sube un rato y baja', () => {
  let alta = 0;
  for (let s = 0; s < 45; s += 0.05) if (MJ.mareaAlta(s)) alta++;
  assert.ok(alta > 0 && alta < 900 * 0.4, 'la marea alta dura menos de la mitad del tiempo');
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
