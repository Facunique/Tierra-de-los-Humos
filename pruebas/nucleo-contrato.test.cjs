// El contrato entre núcleo e interfaz, probado contra el núcleo real (juego/nucleo/).
// Son las mismas pruebas que pruebas/partida-falsa.test.cjs (de la Persona B),
// con el mapa generado y con el mapa fijo de la maqueta, más los eventos que suma el núcleo.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ORDEN } = require('../datos/saberes.js');
const NUCLEO = require('../juego/nucleo/partida.js');

// Los de la partida falsa, más los que suma el núcleo (ver el encabezado de juego/nucleo/partida.js).
const TIPOS = new Set(['fuego', 'junto', 'saber', 'fin', 'remo', 'avivo', 'clima', 'hora', 'reencendido', 'acampe']);

const VARIANTES = [
  ['mapa generado', (op) => NUCLEO.nueva(op)],
  ['mapa fijo', (op) => NUCLEO.nueva(Object.assign({ mapa: 'fijo' }, op))],
];

function remarHasta(partida, n) {
  const eventos = [];
  for (let i = 0; i < n && !partida.terminada; i++) eventos.push(...partida.hacer({ tipo: 'remar', dx: 1, dy: 0 }));
  return eventos;
}

for (const [nombre, nueva] of VARIANTES) {
  test(`núcleo, ${nombre}: el estado tiene la forma que espera motor.escena`, () => {
    const e = nueva({ semilla: 7, saberes: ORDEN }).estado;
    assert.ok(Array.isArray(e.mapa) && e.mapa.every((f) => typeof f === 'string'));
    assert.ok(Array.isArray(e.objetos));
    assert.equal(typeof e.canoa.x, 'number');
    assert.equal(typeof e.canoa.y, 'number');
    assert.ok(e.canoa.fuego >= 0 && e.canoa.fuego <= 4);
    assert.equal(typeof e.explorado, 'function');
    assert.equal(e.explorado(e.canoa.x, e.canoa.y), true, 'la casilla de la canoa está explorada');
    assert.ok(['calma', 'viento', 'lluvia'].includes(e.clima));
    assert.ok(['verano', 'otono', 'invierno', 'primavera'].includes(e.estacion));
    assert.ok(e.destino && typeof e.destino.nombre === 'string', 'el destino tiene nombre para la interfaz');
  });

  test(`núcleo, ${nombre}: remar devuelve eventos con la forma acordada`, () => {
    const eventos = remarHasta(nueva({ semilla: 7, saberes: ORDEN }), 14);
    assert.ok(eventos.length > 0);
    for (const ev of eventos) {
      assert.ok(TIPOS.has(ev.tipo), 'tipo desconocido: ' + ev.tipo);
      if (ev.tipo === 'fuego') { assert.equal(typeof ev.antes, 'number'); assert.equal(typeof ev.despues, 'number'); assert.ok(ev.motivo); }
      if (ev.tipo === 'junto') assert.ok(ev.que);
      if (ev.tipo === 'saber') assert.ok(ORDEN.includes(ev.id), 'saber que no está en datos/saberes.js: ' + ev.id);
      if (ev.tipo === 'fin') assert.equal(typeof ev.gano, 'boolean');
    }
  });

  test(`núcleo, ${nombre}: a los pocos pasos aparece un saber`, () => {
    const saber = remarHasta(nueva({ semilla: 7, saberes: ORDEN }), 3).find((ev) => ev.tipo === 'saber');
    assert.ok(saber, 'tiene que aparecer un saber en los primeros 3 pasos');
    assert.equal(saber.id, ORDEN[0]);
  });

  test(`núcleo, ${nombre}: remar contra la tierra no hace nada`, () => {
    const p = nueva({ semilla: 7, saberes: ORDEN });
    for (let i = 0; i < 20 && p.hacer({ tipo: 'remar', dx: 0, dy: -1 }).length; i++); // hasta la orilla norte
    assert.equal(p.terminada, false, 'llegó a la orilla sin terminar el viaje');
    const { x, y } = p.estado.canoa;
    assert.deepEqual(p.hacer({ tipo: 'remar', dx: 0, dy: -1 }), [], 'más arriba hay tierra');
    assert.deepEqual([p.estado.canoa.x, p.estado.canoa.y], [x, y]);
  });

  test(`núcleo, ${nombre}: remar siempre avisa con «remo», y [] es solo «no se puede»`, () => {
    const p = nueva({ semilla: 7, saberes: [] });
    for (let i = 0; i < 6; i++) {
      const ev = p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
      if (ev.length) assert.equal(ev[0].tipo, 'remo');
    }
  });

  test(`núcleo, ${nombre}: la misma semilla da la misma partida`, () => {
    const a = nueva({ semilla: 3, saberes: ORDEN }), b = nueva({ semilla: 3, saberes: ORDEN });
    assert.equal(a.estado.estacion, b.estado.estacion);
    assert.deepEqual(remarHasta(a, 10), remarHasta(b, 10));
  });

  test(`núcleo, ${nombre}: si el fuego se apaga, el viaje termina sin ganar`, () => {
    const p = nueva({ semilla: 7, saberes: [] });
    let fin = null;
    for (let i = 0; i < 200 && !fin; i++) {
      const ev = p.hacer({ tipo: 'remar', dx: i % 2 ? 1 : -1, dy: 0 }); // ida y vuelta, sin llegar a ningún lado
      fin = ev.find((e) => e.tipo === 'fin') || null;
    }
    assert.ok(fin, 'el viaje tiene que terminar');
    assert.equal(fin.gano, false);
    assert.ok(['remar', 'viento', 'lluvia', 'noche'].includes(fin.causa), 'el fin dice por qué se apagó: ' + fin.causa);
    assert.equal(p.estado.canoa.fuego, 0);
    assert.deepEqual(p.hacer({ tipo: 'remar', dx: 1, dy: 0 }), [], 'después del fin no pasa nada más');
  });
}
