// Pruebas del núcleo (juego/nucleo/): el mapa, las acciones y el balance.
// Se corren desde la raíz del repo con: node --test
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const MAPA = require('../juego/nucleo/mapa.js');
const TDH_PARTIDA = require('../juego/nucleo/partida.js');
const { ORDEN } = require('../datos/saberes.js');
const BOTS = require('./bots.cjs');

const LETRAS = /^[~\-,kr.pGLtM]+$/;
const tipos = (ev) => ev.map((e) => e.tipo);

// ── Mapa ──────────────────────────────────────────────────────────────────
test('el mapa generado es válido en 300 semillas', () => {
  for (let s = 1; s <= 300; s++) {
    const m = MAPA.generar(s);
    assert.ok(m.mapa.every((f) => LETRAS.test(f) && f.length === m.mapa[0].length), `semilla ${s}: letras o filas desparejas`);
    assert.ok(MAPA.navegable(m.mapa, m.inicio.x, m.inicio.y), `semilla ${s}: la canoa no arranca en el agua`);
    assert.equal(m.mapa[m.destino.y][m.destino.x], '.', `semilla ${s}: la ballena no está en una playa`);
    const agua = MAPA.alcanzables(m.mapa, m.inicio);
    for (const o of m.objetos.filter((x) => x.junta)) {
      const alAlcance = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => agua.has((o.x + dx) + ',' + (o.y + dy)));
      assert.ok(alAlcance, `semilla ${s}: «${o.junta}» en ${o.x},${o.y} no se puede juntar desde el agua`);
    }
    for (const o of m.objetos.filter((x) => x.id === 'pescado')) assert.equal(m.mapa[o.y][o.x], ',', `semilla ${s}: el pescado va en el agua baja`);
  }
});

test('el mapa sale igual con la misma semilla y distinto con otra', () => {
  assert.deepEqual(MAPA.generar(42), MAPA.generar(42));
  assert.notDeepEqual(MAPA.generar(42).mapa, MAPA.generar(43).mapa);
  const distintos = new Set(), N = 500;
  let reintentos = 0;
  for (let s = 1; s <= N; s++) { const m = MAPA.generar(s); distintos.add(m.mapa.join('')); reintentos += m.intento || 0; }
  console.log(`  mapas: ${distintos.size} distintos en ${N} semillas; ${reintentos} reintentos (${(100 * reintentos / N).toFixed(1)} %)`);
  assert.ok(distintos.size >= N * 0.98, 'la semilla tiene que llegar al generador: casi todos los mapas distintos');
  assert.ok(reintentos / N < 0.25, 'demasiados mapas rechazados: hay que arreglar el generador, no reintentar más');
});

// Huella de algunos mapas. Si cambia, cambiaron los mapas de TODAS las semillas: las que
// se compartieron (?semilla=) ya no dan el mismo viaje. Si fue a propósito, actualizá las huellas.
function huella(m) {
  let h = 0x811c9dc5;
  const t = JSON.stringify([m.mapa, m.objetos, m.inicio, m.destino]);
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16);
}
const HUELLAS = { 1: '99b883a', 7: '5dd9e8b8', 42: '66ccbbfd' };
test('los mapas de las semillas conocidas no cambian sin querer', () => {
  for (const [s, h] of Object.entries(HUELLAS)) assert.equal(huella(MAPA.generar(Number(s))), h, `cambió el mapa de la semilla ${s}`);
});

test('sacar un elemento de los datos no mueve las costas', () => {
  const T_PUEBLOS = require('../juego/nucleo/territorio/pueblos.js');
  const yagan = T_PUEBLOS.PUEBLOS.yagan, antes = yagan.elementos;
  const conTodo = MAPA.generar(5);
  yagan.elementos = antes.filter((id) => id !== 'tonina');
  try {
    const sinTonina = MAPA.generar(5);
    assert.deepEqual(sinTonina.mapa, conTodo.mapa, 'el terreno tiene su propia semilla');
    assert.deepEqual(sinTonina.objetos.filter((o) => o.elemento === 'lena'), conTodo.objetos.filter((o) => o.elemento === 'lena'), 'la leña tampoco se mueve');
  } finally { yagan.elementos = antes; }
});

test('el mapa fijo es el de la maqueta', () => {
  const m = MAPA.fijo();
  assert.equal(m.fijo, true);
  assert.deepEqual(m.inicio, { x: 2, y: 6 });
  assert.ok(m.objetos.some((o) => o.id === 'ballena-varada' && o.meta));
});

// ── Acciones (sobre el mapa fijo, que no cambia) ─────────────────────────
const fija = (op) => TDH_PARTIDA.nueva(Object.assign({ semilla: 1, mapa: 'fijo', saberes: ORDEN }, op || {}));

test('la primera carta es la del fuego, y solo sale una vez', () => {
  const p = fija();
  assert.deepEqual(p.hacer({ tipo: 'remar', dx: 1, dy: 0 }).filter((e) => e.tipo === 'saber'), [{ tipo: 'saber', id: 'fuego' }]);
  assert.equal(p.hacer({ tipo: 'remar', dx: 1, dy: 0 }).filter((e) => e.tipo === 'saber').length, 0);
});

test('juntar leña y avivar el fuego', () => {
  const p = fija();
  assert.equal(p.puede().juntar, null);
  for (const [dx, dy] of [[1, 0], [1, 0], [1, 0], [1, 0], [0, -1]]) p.hacer({ tipo: 'remar', dx, dy }); // hasta (6, 5), al lado de la leña
  assert.equal(p.puede().juntar, 'lena');
  const lena = p.estado.recursos.lena;
  assert.deepEqual(p.hacer({ tipo: 'juntar' }), [{ tipo: 'junto', que: 'lena', nombre: 'leña' }]);
  assert.equal(p.estado.recursos.lena, lena + 2);
  assert.ok(!p.estado.objetos.some((o) => o.id === 'lena' && o.x === 6 && o.y === 4), 'la leña ya no está en el mapa');
  const e = p.estado.energia;
  assert.deepEqual(tipos(p.hacer({ tipo: 'avivar' })).slice(0, 1), ['avivo']);
  assert.equal(p.estado.energia, Math.min(16, e + 6));
});

test('con el atado lleno, la leña queda en el mapa', () => {
  const p = fija();
  p.estado.recursos.lena = 5;
  for (const [dx, dy] of [[1, 0], [1, 0], [1, 0], [1, 0], [0, -1]]) p.hacer({ tipo: 'remar', dx, dy });
  assert.equal(p.puede().juntar, null, 'no se ofrece juntar lo que no entra');
  assert.deepEqual(p.hacer({ tipo: 'juntar' }), []);
  assert.ok(p.estado.objetos.some((o) => o.id === 'lena' && o.x === 6 && o.y === 4), 'la leña sigue ahí');
  p.estado.recursos.lena = 4;
  assert.equal(p.puede().juntar, 'lena');
});

test('cerca de la choza el fuego se gasta menos', () => {
  const p = fija({ reglas: { CLIMA_PROB_CAMBIO: 0 } });
  for (const [dx, dy] of [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0]]) p.hacer({ tipo: 'remar', dx, dy }); // hasta (7, 6), a 2 de la choza
  const antes = p.estado.energia;
  p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.equal(p.estado.energia, antes, 'al lado de la choza remar no gasta');
});

test('no se puede avivar sin leña ni con el fuego lleno', () => {
  const p = fija({ heredados: ['a', 'b', 'c', 'd'] }); // 12 + 4 = 16, fuego lleno
  assert.equal(p.estado.energia, 16);
  assert.deepEqual(p.hacer({ tipo: 'avivar' }), []);
  p.estado.recursos.lena = 0; p.estado.energia = 4;
  assert.deepEqual(p.hacer({ tipo: 'avivar' }), []);
});

test('amarrar en el cachiyuyo: pasan la noche y vuelve la calma', () => {
  const p = fija();
  assert.equal(p.puede().amarrar, false);
  p.hacer({ tipo: 'remar', dx: 0, dy: -1 }); // (2, 5) es cachiyuyo, con playa arriba
  assert.equal(p.puede().amarrar, true);
  p.estado.recursos.comida = 1; p.estado.clima = 'lluvia'; p.estado.hora = 'noche';
  const ev = p.hacer({ tipo: 'amarrar' });
  assert.equal(ev[0].tipo, 'acampe');
  assert.equal(ev[0].comio, true);
  assert.ok(ev.some((e) => e.tipo === 'saber' && e.id === 'amarre'));
  assert.equal(p.estado.hora, 'dia');
  assert.equal(p.estado.clima, 'calma');
  assert.equal(p.estado.recursos.comida, 0);
});

test('la pirita vuelve a prender el fuego una sola vez', () => {
  const p = fija();
  p.estado.recursos.pirita = 1; p.estado.energia = 1;
  const ev = p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.ok(tipos(ev).includes('reencendido'));
  assert.equal(p.terminada, false);
  assert.equal(p.estado.recursos.pirita, 0);
  assert.equal(p.estado.canoa.fuego, 1);
});

test('llegar a la ballena con el fuego encendido gana y da la carta de la ballena', () => {
  const p = fija({ reglas: { GASTO_REMAR: 0, GASTO_NOCHE: 0, GASTO_LLUVIA: 0, GASTO_VIENTO_HONDO: 0 } });
  const d = p.estado.destino;
  const ruta = MAPA.camino(p.estado.mapa, p.estado.canoa, (x, y) => Math.max(Math.abs(x - d.x), Math.abs(y - d.y)) <= 1);
  let ev = [];
  for (const paso of ruta) ev = p.hacer({ tipo: 'remar', dx: paso.x - p.estado.canoa.x, dy: paso.y - p.estado.canoa.y });
  assert.deepEqual(ev.slice(-2).map((e) => [e.tipo, e.id || e.causa]), [['saber', 'ballena'], ['fin', 'llegada']]);
  assert.equal(ev[ev.length - 1].gano, true);
  assert.equal(p.estado.gano, true);
  assert.equal(p.terminada, true);
  assert.deepEqual(p.puede(), { juntar: null, avivar: false, amarrar: false });
});

test('lo heredado no vuelve a salir como carta y abriga el fuego inicial', () => {
  const p = fija({ heredados: ['fuego', 'amarre'] });
  assert.equal(p.estado.energia, 14);
  const ev = p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.ok(!ev.some((e) => e.tipo === 'saber'), 'la carta del fuego ya la sabían');
});

test('la ruta guarda el recorrido para la postal', () => {
  const p = fija();
  p.hacer({ tipo: 'remar', dx: 1, dy: 0 }); p.hacer({ tipo: 'remar', dx: 0, dy: -1 }); p.hacer({ tipo: 'remar', dx: 0, dy: -1 });
  assert.deepEqual(p.estado.ruta, [[2, 6], [3, 6], [3, 5]]); // (3, 4) es playa: no se movió
});

// ── Balance ───────────────────────────────────────────────────────────────
// Recursos de juego: si cambian los números de reglas.js, estas pruebas dicen
// si el viaje sigue siendo posible y si sigue haciendo falta juntar.
const T_PUEBLOS = require('../juego/nucleo/territorio/pueblos.js');
for (const destino of T_PUEBLOS.PUEBLOS.yagan.destinos) {
  test(`balance, destino «${destino}»: quien junta y acampa llega casi siempre; quien va derecho, no`, () => {
    const cuidadoso = BOTS.medir(BOTS.cuidadoso, 100, { destino });
    const directo = BOTS.medir(BOTS.directo, 100, { destino });
    console.log(`  ${destino}: cuidadoso ${Math.round(cuidadoso.tasa * 100)} %, directo ${Math.round(directo.tasa * 100)} %, ${Math.round(cuidadoso.pasos)} casillas`);
    assert.ok(cuidadoso.tasa >= 0.7, `el jugador cuidadoso llega solo el ${Math.round(cuidadoso.tasa * 100)} %`);
    assert.ok(directo.tasa <= 0.1, `yendo derecho sin juntar se llega el ${Math.round(directo.tasa * 100)} %: no hace falta el territorio`);
  });
}
