// Las tres marcas del viaje (juego/interfaz/marcas.js): se guarda la mejor por destino.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../juego/interfaz/marcas.js');

function almacen() {
  const d = {};
  return { getItem: (k) => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); } };
}

test('la primera vez que se logra una marca es nueva; después ya no', () => {
  const m = M.crear(almacen());
  let r = m.anotar('yagan', 'ballena', [{ id: 'llegaron', logrado: true }, { id: 'comida', logrado: false }, { id: 'tiempo', logrado: false }]);
  assert.deepEqual(r.marcas.map((x) => x.nueva), [true, false, false]);
  assert.equal(r.mejor, 1);
  r = m.anotar('yagan', 'ballena', [{ id: 'llegaron', logrado: true }, { id: 'comida', logrado: true }, { id: 'tiempo', logrado: false }]);
  assert.deepEqual(r.marcas.map((x) => x.nueva), [false, true, false]);
  assert.equal(r.mejor, 2);
  // Un viaje peor no borra lo mejor.
  r = m.anotar('yagan', 'ballena', [{ id: 'llegaron', logrado: false }]);
  assert.equal(r.mejor, 2);
  // Otro destino lleva su propia cuenta.
  assert.equal(m.anotar('yagan', 'pirita', [{ id: 'llegaron', logrado: true }]).mejor, 1);
});

test('sin almacenamiento, o con lo guardado roto, anda igual', () => {
  assert.equal(M.crear(null).anotar('yagan', 'ballena', [{ id: 'llegaron', logrado: true }]).mejor, 1);
  const a = almacen(); a.setItem('tdh-marcas', '{roto');
  assert.equal(M.crear(a).anotar('yagan', 'ballena', [{ id: 'tiempo', logrado: true }]).mejor, 1);
  // JSON válido pero con otra forma: un número, una lista, ids que no existen.
  for (const raro of ['5', '[1,2]', 'null', '{"yagan":5}', '{"yagan":{"ballena":["x","y","z","w"]}}']) {
    const b = almacen(); b.setItem('tdh-marcas', raro);
    assert.equal(M.crear(b).anotar('yagan', 'ballena', [{ id: 'llegaron', logrado: true }]).mejor, 1, raro);
  }
});

test('los nombres son cortos y dicen el límite', () => {
  assert.equal(M.nombre('llegaron'), 'Llegaron');
  assert.match(M.nombre('comida'), /^Con \d de comida$/);
  assert.equal(M.nombre('tiempo', { limite: 46 }), 'A tiempo (46 remadas)');
});
