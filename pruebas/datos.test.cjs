// Pruebas de los datos de las cartas de saber (datos/saberes.js).
// Se corren desde la raíz del repo con: node --test
// Si una falla, el mensaje dice qué carta y qué campo arreglar.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SABERES, ORDEN, COOPER } = require('../datos/saberes.js');

const cartas = ORDEN.map((clave) => [clave, SABERES[clave]]);
const lleno = (v) => typeof v === 'string' && v.trim().length > 0;

test('expone { COOPER, SABERES, ORDEN }', () => {
  assert.ok(lleno(COOPER), 'falta COOPER');
  assert.ok(cartas.length > 0, 'no hay cartas');
  assert.deepEqual(ORDEN, Object.keys(SABERES), 'ORDEN tiene que listar todas las cartas');
});

test('cada carta tiene un id único, igual a su clave', () => {
  const vistos = new Set();
  for (const [clave, c] of cartas) {
    assert.ok(lleno(c.id), `la carta «${clave}» no tiene id`);
    assert.equal(c.id, clave, `el id de «${clave}» tiene que ser igual a su clave`);
    assert.match(c.id, /^[a-z0-9-]+$/, `el id «${c.id}» va en minúsculas, sin tildes ni espacios`);
    assert.ok(!vistos.has(c.id), `el id «${c.id}» está repetido`);
    vistos.add(c.id);
  }
});

test('cada carta tiene pueblo, título, dato, juego, fuente y texto alternativo', () => {
  for (const [clave, c] of cartas) {
    for (const campo of ['pueblo', 'titulo', 'dato', 'juego', 'fuente', 'alt']) {
      assert.ok(lleno(c[campo]), `a la carta «${clave}» le falta «${campo}»`);
    }
  }
});

test('ningún texto dice «extinguido», «extinto» ni «desaparecido»', () => {
  const prohibidas = /\b(extinguid|extint|desaparecid)[oa]s?\b/i;
  for (const [clave, c] of cartas) {
    for (const [campo, valor] of Object.entries(c)) {
      if (typeof valor !== 'string') continue;
      const hallada = valor.match(prohibidas);
      assert.equal(hallada, null, `la carta «${clave}», campo «${campo}», dice «${hallada && hallada[0]}»: los pueblos se nombran en presente`);
    }
  }
});
