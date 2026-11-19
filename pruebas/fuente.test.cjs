// Las fuentes en corto (juego/interfaz/fuente.js): autor, año y página, sin perder ninguna obra.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const F = require('../juego/interfaz/fuente.js');
const { SABERES } = require('../datos/saberes.js');
const { DESTINOS } = require('../juego/nucleo/territorio/destinos.js');

const todas = [...Object.values(SABERES), ...Object.values(DESTINOS)];

test('cada fuente de las cartas y los destinos sale en corto, con autor, año y página', () => {
  for (const c of todas) {
    const corta = F.corta(c.fuente);
    assert.ok(corta.length < c.fuente.replace(/<[^>]+>/g, '').length, 'no se acortó: ' + corta);
    assert.match(corta, /^(Cooper|Vargas Filgueira) \((1946|2019|2026)\)/, corta);
    // Ninguna obra se pierde: cada año que cita la completa está en la corta.
    for (const anio of c.fuente.match(/\((\d{4})\)/g) || []) assert.ok(corta.includes(anio), 'se perdió ' + anio + ' en ' + corta);
    // Si la completa tiene página, la corta también.
    if (/\bpp?\. ?\d/.test(c.fuente)) assert.match(corta, /p\. \d/, corta);
    assert.doesNotMatch(corta, /visor|Editora|Handbook|Smithsonian/, 'quedó texto de la referencia larga: ' + corta);
  }
  assert.equal(F.corta(DESTINOS.ballena.fuente), 'Cooper (1946), p. 84, 94-95 y 99; Vargas Filgueira (2019), p. 16-17');
});

test('las obras citadas salen completas y una sola vez', () => {
  const obras = F.obras(todas.map((c) => c.fuente));
  assert.equal(obras.filter((o) => o.startsWith('Cooper')).length, 1);
  assert.ok(obras.some((o) => /Mi sangre yagán.*Editora Cultural Tierra del Fuego/.test(o)));
  assert.ok(obras.some((o) => /\(2026\)\. Entrevista/.test(o)), 'la entrevista también');
  assert.doesNotMatch(obras.join(' '), /<|undefined/);
});

test('lo que no entiende lo deja como está', () => {
  assert.equal(F.corta('🔍 Fuente pendiente.'), '🔍 Fuente pendiente.');
  assert.deepEqual(F.obras(['🔍 Fuente pendiente.']), []);
});
