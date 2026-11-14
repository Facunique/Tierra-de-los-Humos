// Pruebas del juego sin internet (sw.js y manifest.webmanifest).
// Si alguien suma un archivo a index.html y se olvida de sumarlo a sw.js, el
// juego publicado no abre sin conexión: esta prueba lo avisa.
// Se corren desde la raíz del repo con: node --test
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const leer = (r) => fs.readFileSync(path.join(RAIZ, r), 'utf8');
const sw = leer('sw.js');
const ARCHIVOS = JSON.parse('[' + sw.match(/const ARCHIVOS = \[([\s\S]*?)\];/)[1].replace(/\/\/.*$/gm, '').replace(/'/g, '"').replace(/,\s*$/, '') + ']');
const html = leer('index.html');

test('sw.js guarda todo lo que carga index.html', () => {
  const carga = [...html.matchAll(/<(?:script src|link rel="(?:stylesheet|icon|apple-touch-icon)" href)="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(carga.length > 20, 'no encontré lo que carga index.html');
  for (const ruta of carga) assert.ok(ARCHIVOS.includes(ruta), 'sumá «' + ruta + '» a ARCHIVOS en sw.js');
});

test('sw.js guarda la tipografía y los íconos del manifiesto', () => {
  const fuentes = [...leer('arte/tipografia/atkinson.css').matchAll(/url\("?([^")]+)"?\)/g)].map((m) => 'arte/tipografia/' + m[1]);
  for (const f of fuentes) assert.ok(ARCHIVOS.includes(f), 'sumá «' + f + '» a ARCHIVOS en sw.js');
  const manifiesto = JSON.parse(leer('manifest.webmanifest'));
  for (const i of manifiesto.icons) assert.ok(ARCHIVOS.includes(i.src), 'sumá «' + i.src + '» a ARCHIVOS en sw.js');
});

test('todo lo que guarda sw.js existe', () => {
  for (const a of ARCHIVOS) {
    if (a === './') continue;
    assert.ok(fs.existsSync(path.join(RAIZ, a)), 'sw.js nombra «' + a + '», que no está en el repo');
  }
});

test('el manifiesto tiene lo necesario para sumar el juego a la pantalla de inicio', () => {
  const m = JSON.parse(leer('manifest.webmanifest'));
  assert.equal(m.name, 'Tierra de los Humos');
  assert.equal(m.lang, 'es');
  assert.equal(m.start_url, './');
  assert.ok(m.icons.some((i) => i.sizes === '192x192') && m.icons.some((i) => i.sizes === '512x512'), 'faltan los íconos de 192 y 512');
});

test('con doble clic (file://) no se registra el service worker ni el manifiesto', () => {
  const j = leer('juego/interfaz/juego.js');
  assert.match(j, /if \(\/\^https\?:\$\/\.test\(location\.protocol\)\)/, 'el registro tiene que quedar dentro del if de http o https');
  assert.doesNotMatch(html, /rel="manifest"/, 'el manifiesto se suma desde juego.js: con file:// da error en la consola');
});
