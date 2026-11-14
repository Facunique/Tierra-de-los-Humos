// Prueba el editor de saberes (herramientas/editor-saberes.js): que la carta que
// arma tenga el formato de datos/saberes.js y cumpla las mismas reglas.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const ED = require('../herramientas/editor-saberes.js');
const { SABERES, ORDEN, COOPER } = require('../datos/saberes.js');
const ARTE = require('../arte/fuente/arte.js');

const base = {
  pueblo: 'yagan', tipo: 'Alimento', titulo: 'Pescar sin anzuelo (prueba)', dato: 'Un dato con «comillas» y un apóstrofo: Selk\'nam.',
  juego: 'Hace algo en el juego.', tipoFuente: 'cooper', pagina: '84', escena: 'playa', objeto: 'pescado', estacion: 'otono', hora: 'tarde',
};
// Lee el texto generado como si estuviera pegado adentro de SABERES.
const leerCodigo = (texto) => vm.runInNewContext('({\n' + texto + '\n})', { COOPER });

test('el identificador sale del título: minúsculas, sin tildes ni espacios', () => {
  assert.equal(ED.idDe('Pescar sin anzuelo'), 'pescar-sin-anzuelo');
  assert.equal(ED.idDe('  Ñandú, árbol y ÉPOCA  '), 'nandu-arbol-y-epoca');
  assert.match(ED.idDe('Una frase muy larga con muchas palabras'), /^[a-z0-9-]+$/);
});

test('arma una carta con todos los campos de datos/saberes.js', () => {
  const c = ED.armar(base);
  for (const campo of ['id', 'pueblo', 'estado', 'tipo', 'titulo', 'dato', 'juego', 'fuente', 'alt']) assert.ok(typeof c[campo] === 'string' && c[campo].length, 'falta ' + campo);
  assert.equal(c.estado, 'borrador', 'toda carta nueva es borrador');
  assert.ok(Array.isArray(c.mapa) && c.mapa.every((f) => f.length === c.mapa[0].length));
  assert.equal(c.extra.estacion, 'otono');
  assert.equal(c.extra.hora, 'tarde');
  assert.ok(c.extra.objetos.some((o) => o.id === 'pescado'));
  assert.ok(c.fuente.startsWith(COOPER) && c.fuente.endsWith(', p. 84.'));
});

test('el texto generado se lee igual que la carta, con la constante COOPER', () => {
  const c = ED.armar(base), texto = ED.codigo(c, base);
  assert.match(texto, /fuente: COOPER \+ ', p\. 84\.'/);
  const leida = leerCodigo(texto)[c.id];
  assert.deepEqual(JSON.parse(JSON.stringify(leida)), JSON.parse(JSON.stringify(c)));
});

test('corregir una carta del juego la reproduce tal cual (todas las cartas)', () => {
  for (const k of ORDEN) {
    const f = ED.desdeCarta(SABERES[k]);
    const c = ED.armar(f);
    const leida = leerCodigo(ED.codigo(c, f))[k];
    for (const campo of ['id', 'pueblo', 'tipo', 'titulo', 'dato', 'juego', 'fuente', 'alt']) assert.equal(leida[campo], SABERES[k][campo], k + ': cambió «' + campo + '»');
    assert.deepEqual(JSON.parse(JSON.stringify(leida.mapa)), SABERES[k].mapa, k + ': cambió la ilustración');
    assert.deepEqual(JSON.parse(JSON.stringify(leida.extra)), JSON.parse(JSON.stringify(SABERES[k].extra || {})), k + ': cambió la ilustración');
  }
});

test('la revisión aplica las reglas del repositorio', () => {
  const ok = ED.armar(base);
  assert.deepEqual(ED.revisar(ok, base, SABERES).filter((a) => a.nivel === 'error'), []);
  const errores = (f) => ED.revisar(ED.armar(f), f, SABERES).filter((a) => a.nivel === 'error').map((a) => a.texto).join(' | ');
  assert.match(errores(Object.assign({}, base, { dato: '' })), /dato/);
  assert.match(errores(Object.assign({}, base, { pagina: '' })), /página/);
  assert.match(errores(Object.assign({}, base, { dato: 'Un pueblo extinguido.' })), /presente/);
  assert.match(errores(Object.assign({}, base, { id: 'fuego' })), /Ya hay una carta/);
  assert.match(errores(Object.assign({}, base, { tipoFuente: 'oral', permisoPublicar: false })), /permiso/);
  assert.match(errores(Object.assign({}, base, { tipoFuente: 'libro', autor: '', obra: '' })), /autor/);
});

test('un relato oral sin permiso para el nombre no publica el nombre', () => {
  const f = Object.assign({}, base, { tipoFuente: 'oral', rolPersona: 'una abuela de la comunidad', comunidad: 'Comunidad de prueba', fecha: 'noviembre de 2026', permisoPublicar: true, permisoNombre: false, nombrePersona: 'Nombre Privado' });
  const c = ED.armar(f);
  assert.ok(!c.fuente.includes('Nombre Privado'), 'el nombre no aparece');
  assert.match(c.fuente, /^Relato de una abuela de la comunidad, Comunidad de prueba, noviembre de 2026\. Publicado con su permiso\.$/);
  assert.ok(ED.armar(Object.assign({}, f, { permisoNombre: true })).fuente.includes('Nombre Privado'), 'con permiso, sí');
});

test('lo escrito no se interpreta como HTML ni rompe el texto generado', () => {
  const f = Object.assign({}, base, { titulo: '<script>alert(1)</script>', dato: "Con 'comillas' y \\ barras" });
  const c = ED.armar(f);
  assert.ok(!c.titulo.includes('<script>'));
  const leida = leerCodigo(ED.codigo(c, f))[c.id];
  assert.equal(leida.dato, c.dato);
});

test('lo que se escribe en la fuente no puede colar HTML en la carta', () => {
  const malo = '<img src=x onerror=alert(1)>';
  const oral = ED.armar(Object.assign({}, base, { tipoFuente: 'oral', permisoPublicar: true, permisoNombre: true, nombrePersona: malo, rolPersona: malo, comunidad: malo, fecha: malo }));
  const cooper = ED.armar(Object.assign({}, base, { pagina: malo }));
  const libro = ED.armar(Object.assign({}, base, { tipoFuente: 'libro', autor: malo, obra: malo, editorial: malo, pagina: malo, tipo: malo }));
  for (const c of [oral, cooper, libro]) {
    assert.ok(!/<img/i.test(c.fuente), 'la fuente quedó con una etiqueta: ' + c.fuente);
    assert.ok(!/<img/i.test(c.tipo));
  }
  assert.match(libro.fuente, /<i>&lt;img/, 'la obra conserva su <i> pero el texto va escapado');
});

test('las ilustraciones solo usan dibujos que existen en el estilo Corteza', () => {
  const corteza = require('fs').readFileSync(require('path').join(__dirname, '../arte/corteza/corteza.js'), 'utf8');
  for (const id of Object.keys(ED.OBJETOS).filter(Boolean)) {
    const existe = ARTE.SPRITES[id] || new RegExp("['\"]?" + id.replace('-', '\\-') + "['\"]?\\s*[:(]").test(corteza);
    assert.ok(existe, 'no existe el dibujo «' + id + '»');
  }
  for (const [k, e] of Object.entries(ED.ESCENAS)) assert.ok(e.mapa.every((f) => /^[~\-,kr.pGLtM]+$/.test(f)), 'la escena «' + k + '» usa letras que el motor no conoce');
});
