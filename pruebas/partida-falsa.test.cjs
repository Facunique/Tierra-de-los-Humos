// Prueba el contrato entre núcleo e interfaz.
// Corre las mismas pruebas contra la partida falsa (pruebas/partida-falsa.js) y
// contra el núcleo real de la Persona A (juego/nucleo/partida.js), con el mapa
// generado y con el mapa fijo de la maqueta.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ORDEN } = require('../datos/saberes.js');
const FALSA = require('./partida-falsa.js');
const NUCLEO = require('../juego/nucleo/partida.js');

// Los eventos del contrato. Los marcados (+) los suma el núcleo real (ver juego/nucleo/partida.js).
const TIPOS = new Set(['fuego', 'junto', 'saber', 'fin', 'remo', 'avivo', 'clima', 'hora', 'reencendido', 'acampe']);

const IMPLEMENTACIONES = [
  ['partida falsa', (op) => FALSA.nueva(op)],
  ['núcleo, mapa generado', (op) => NUCLEO.nueva(op)],
  ['núcleo, mapa fijo', (op) => NUCLEO.nueva(Object.assign({ mapa: 'fijo' }, op))],
];

// Rema siempre a la derecha por la fila de la canoa.
function remarHasta(partida, n) {
  const eventos = [];
  for (let i = 0; i < n && !partida.terminada; i++) eventos.push(...partida.hacer({ tipo: 'remar', dx: 1, dy: 0 }));
  return eventos;
}

for (const [nombre, nueva] of IMPLEMENTACIONES) {
  test(`${nombre}: el estado tiene la forma que espera motor.escena`, () => {
    const p = nueva({ semilla: 7, saberes: ORDEN });
    const e = p.estado;
    assert.ok(Array.isArray(e.mapa) && e.mapa.every((f) => typeof f === 'string'));
    assert.ok(Array.isArray(e.objetos));
    assert.equal(typeof e.canoa.x, 'number');
    assert.equal(typeof e.canoa.y, 'number');
    assert.ok(e.canoa.fuego >= 0 && e.canoa.fuego <= 4);
    assert.equal(typeof e.explorado, 'function');
    assert.equal(e.explorado(e.canoa.x, e.canoa.y), true, 'la casilla de la canoa está explorada');
    assert.ok(['calma', 'viento', 'lluvia'].includes(e.clima));
    assert.ok(['verano', 'otono', 'invierno', 'primavera'].includes(e.estacion));
  });

  test(`${nombre}: remar devuelve eventos con la forma acordada`, () => {
    const p = nueva({ semilla: 7, saberes: ORDEN });
    const eventos = remarHasta(p, 14);
    assert.ok(eventos.length > 0);
    for (const ev of eventos) {
      assert.ok(TIPOS.has(ev.tipo), 'tipo desconocido: ' + ev.tipo);
      if (ev.tipo === 'fuego') { assert.equal(typeof ev.antes, 'number'); assert.equal(typeof ev.despues, 'number'); assert.ok(ev.motivo); }
      if (ev.tipo === 'junto') assert.ok(ev.que);
      if (ev.tipo === 'saber') assert.ok(ORDEN.includes(ev.id), 'saber que no está en datos/saberes.js: ' + ev.id);
      if (ev.tipo === 'fin') assert.equal(typeof ev.gano, 'boolean');
    }
  });

  test(`${nombre}: a los pocos pasos aparece un saber`, () => {
    const p = nueva({ semilla: 7, saberes: ORDEN });
    const saber = remarHasta(p, 3).find((ev) => ev.tipo === 'saber');
    assert.ok(saber, 'tiene que aparecer un saber en los primeros 3 pasos');
    assert.equal(saber.id, ORDEN[0]);
  });

  test(`${nombre}: remar contra la tierra no hace nada`, () => {
    const p = nueva({ semilla: 7, saberes: ORDEN });
    // Remar hacia arriba hasta la orilla (el canal corre de oeste a este, con tierra al norte).
    for (let i = 0; i < 20 && p.hacer({ tipo: 'remar', dx: 0, dy: -1 }).length; i++);
    assert.equal(p.terminada, false, 'llegó a la orilla sin terminar el viaje');
    const { x, y } = p.estado.canoa;
    assert.deepEqual(p.hacer({ tipo: 'remar', dx: 0, dy: -1 }), [], 'más arriba hay tierra');
    assert.deepEqual([p.estado.canoa.x, p.estado.canoa.y], [x, y]);
  });

  test(`${nombre}: la misma semilla da la misma partida`, () => {
    const a = nueva({ semilla: 3, saberes: ORDEN }), b = nueva({ semilla: 3, saberes: ORDEN });
    assert.equal(a.estado.estacion, b.estado.estacion);
    assert.deepEqual(remarHasta(a, 10), remarHasta(b, 10));
  });

  test(`${nombre}: si el fuego se apaga, el viaje termina sin ganar`, () => {
    const p = nueva({ semilla: 7, saberes: [] });
    let fin = null;
    for (let i = 0; i < 200 && !fin; i++) {
      const ev = p.hacer({ tipo: 'remar', dx: i % 2 ? 1 : -1, dy: 0 }); // ida y vuelta, sin llegar a ningún lado
      fin = ev.find((e) => e.tipo === 'fin') || null;
    }
    assert.ok(fin, 'el viaje tiene que terminar');
    assert.equal(fin.gano, false);
    assert.equal(p.estado.canoa.fuego, 0);
    assert.deepEqual(p.hacer({ tipo: 'remar', dx: 1, dy: 0 }), [], 'después del fin no pasa nada más');
  });
}
