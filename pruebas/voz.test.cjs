// La voz de las cartas (sonido/voz.js): elige la mejor voz en castellano y lee corto.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const VOZ = require('../sonido/voz.js');

test('prefiere una voz natural y rioplatense; descarta las que no son en castellano', () => {
  const voces = [
    { name: 'eSpeak Spanish', lang: 'es-ES', localService: true },
    { name: 'Microsoft Helena', lang: 'es-ES', localService: true },
    { name: 'Microsoft Elena Online (Natural) - Spanish (Argentina)', lang: 'es-AR', localService: false },
    { name: 'Google US English', lang: 'en-US', localService: false },
  ];
  const orden = voces.filter((v) => VOZ.puntaje(v) >= 0).sort((a, b) => VOZ.puntaje(b) - VOZ.puntaje(a));
  assert.equal(orden[0].lang, 'es-AR');
  assert.ok(!orden.some((v) => v.lang === 'en-US'));
  assert.equal(orden[orden.length - 1].name, 'eSpeak Spanish', 'la de baja calidad va última, pero queda');
});

test('sin voz en el dispositivo (Node), leer no rompe', async () => {
  assert.equal(VOZ.disponible(), false);
  assert.equal(await VOZ.leerCarta({ titulo: 'El fuego viaja en la canoa', dato: 'El fuego se lleva encendido en la canoa.' }), false);
});
