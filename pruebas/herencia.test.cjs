// Pruebas de la herencia entre partidas (juego/interfaz/herencia.js).
// Se corren desde la raíz del repo con: node --test
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const H = require('../juego/interfaz/herencia.js');
const { SABERES } = require('../datos/saberes.js');

const nueva = (almacen) => H.crear(almacen || H.enMemoria(), { catalogo: SABERES });

test('un linaje nuevo empieza en la generación 1, sin saberes', () => {
  assert.deepEqual(nueva().leer('yagan'), { generacion: 1, saberes: [], viajes: 0, llegadas: 0 });
});

test('al cerrar un viaje se suman los saberes y se pasa a la generación siguiente', () => {
  const almacen = H.enMemoria();
  const h = nueva(almacen);
  h.cerrarViaje('yagan', ['fuego', 'amarre'], { gano: false });
  const p = h.cerrarViaje('yagan', ['amarre', 'mejillones'], { gano: true });
  assert.equal(p.generacion, 3);
  assert.deepEqual(p.saberes, ['fuego', 'amarre', 'mejillones'], 'sin repetidos y en el orden en que se aprendieron');
  assert.equal(p.viajes, 2);
  assert.equal(p.llegadas, 1);
  // Otra página (o el navegador reabierto) lee lo mismo.
  assert.deepEqual(nueva(almacen).leer('yagan'), p);
});

test('solo se guardan los id de las cartas, con número de versión', () => {
  const almacen = H.enMemoria();
  nueva(almacen).cerrarViaje('yagan', ['fuego'], {});
  const d = JSON.parse(almacen.getItem(H.CLAVE));
  assert.equal(d.version, H.VERSION);
  assert.deepEqual(d.pueblos.yagan.saberes, ['fuego']);
  assert.ok(!JSON.stringify(d).includes('Cooper'), 'no se guardan los textos de las cartas');
});

test('cada pueblo tiene su propia herencia', () => {
  const h = nueva();
  h.cerrarViaje('yagan', ['fuego'], {});
  assert.deepEqual(h.leer('kawesqar').saberes, []);
  assert.equal(h.leer('kawesqar').generacion, 1);
});

test('los id que ya no están en el catálogo se descartan', () => {
  const almacen = H.enMemoria();
  almacen.setItem(H.CLAVE, JSON.stringify({ version: H.VERSION, pueblos: { yagan: { generacion: 4, saberes: ['fuego', 'una-carta-que-se-saco'], viajes: 3, llegadas: 0 } } }));
  assert.deepEqual(nueva(almacen).leer('yagan').saberes, ['fuego']);
  assert.deepEqual(nueva(almacen).cerrarViaje('yagan', ['otra-que-no-existe'], {}).saberes, ['fuego']);
});

test('si lo guardado está roto o es de otra versión, empieza de cero sin romper', () => {
  for (const malo of ['{roto', JSON.stringify({ version: 999, pueblos: { yagan: { generacion: 9 } } }), JSON.stringify({ version: H.VERSION, pueblos: null }), JSON.stringify({ version: H.VERSION, pueblos: { yagan: { generacion: -2, saberes: 'fuego' } } })]) {
    const almacen = H.enMemoria();
    almacen.setItem(H.CLAVE, malo);
    assert.deepEqual(nueva(almacen).leer('yagan'), { generacion: 1, saberes: [], viajes: 0, llegadas: 0 }, 'con ' + malo);
  }
});

test('sin almacenamiento (modo privado o bloqueado) funciona en memoria', () => {
  const bloqueado = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('bloqueado'); }, removeItem() {} };
  const h = nueva(bloqueado);
  h.cerrarViaje('yagan', ['fuego'], {});
  assert.deepEqual(h.leer('yagan').saberes, ['fuego']);
  assert.equal(h.persistente, false);
  const sinNada = H.crear(null, { catalogo: SABERES });
  sinNada.cerrarViaje('yagan', ['pirita'], {});
  assert.deepEqual(sinNada.leer('yagan').saberes, ['pirita']);
});

test('borrar deja el linaje como nuevo', () => {
  const h = nueva();
  h.cerrarViaje('yagan', ['fuego'], {});
  h.borrar('yagan');
  assert.deepEqual(h.leer('yagan'), { generacion: 1, saberes: [], viajes: 0, llegadas: 0 });
});
