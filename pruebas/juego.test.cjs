// Pruebas de la página del juego (index.html).
// Revisan lo que puede romper el juego sin que nadie lo note: un archivo que no
// está, un <script> fuera de orden o algo que no anda con doble clic (file://).
// Se corren desde la raíz del repo con: node --test
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
const estilos = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);

test('todo lo que carga index.html existe en el repo', () => {
  for (const ruta of scripts.concat(estilos)) {
    assert.ok(!/^https?:/.test(ruta), ruta + ': el juego tiene que andar sin internet');
    assert.ok(fs.existsSync(path.join(RAIZ, ruta)), 'falta ' + ruta);
  }
});

test('los <script> van en orden: cada uno después de lo que necesita', () => {
  const antes = (a, b) => {
    assert.ok(scripts.includes(a), 'falta ' + a);
    assert.ok(scripts.includes(b), 'falta ' + b);
    assert.ok(scripts.indexOf(a) < scripts.indexOf(b), a + ' tiene que ir antes que ' + b);
  };
  antes('arte/fuente/arte.js', 'arte/corteza/corteza.js');
  antes('arte/mapa/costas.js', 'arte/mapa/mapa.js');
  antes('sonido/ambiente.js', 'sonido/juego.js');
  antes('sonido/voz.js', 'sonido/narrador.js');
  // El orden del núcleo, como dice juego/nucleo/README.md.
  const nucleo = ['juego/nucleo/azar.js', 'juego/nucleo/reglas.js', 'juego/nucleo/territorio/elementos.js', 'juego/nucleo/territorio/destinos.js', 'juego/nucleo/territorio/pueblos.js', 'juego/nucleo/mapa.js', 'juego/nucleo/partida.js'];
  for (let i = 1; i < nucleo.length; i++) antes(nucleo[i - 1], nucleo[i]);
  for (const s of scripts.filter((x) => x !== 'juego/interfaz/juego.js')) antes(s, 'juego/interfaz/juego.js');
});

test('el mapa de territorios y el del núcleo no chocan (TDH_TERRITORIOS y TDH_MAPA)', () => {
  const territorios = fs.readFileSync(path.join(RAIZ, 'arte/mapa/mapa.js'), 'utf8');
  assert.match(territorios, /raiz\.TDH_TERRITORIOS = api/);
  assert.doesNotMatch(territorios, /raiz\.TDH_MAPA = /);
});

test('la interfaz anda con doble clic: sin import, export ni fetch', () => {
  for (const archivo of ['juego/interfaz/juego.js', 'juego/interfaz/herencia.js', 'juego/interfaz/carta.js']) {
    const codigo = fs.readFileSync(path.join(RAIZ, archivo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    assert.doesNotMatch(codigo, /^\s*(import|export)\s/m, archivo + ' usa import/export');
    assert.doesNotMatch(codigo, /\bfetch\(/, archivo + ' usa fetch');
  }
});

test('la página tiene los textos que buscan las pruebas de punta a punta y el grabador', () => {
  for (const t of ['Empezar el viaje', 'Empezar la generación siguiente', 'Avivar el fuego', 'Amarrar y acampar', 'Juntar']) assert.ok(html.includes(t), 'falta el botón «' + t + '»');
  assert.match(html, /familia yagán/, 'falta el botón para elegir a la familia yagán');
});
