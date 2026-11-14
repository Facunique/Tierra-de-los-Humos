// Los datos del territorio (juego/nucleo/territorio/) tienen que ser consistentes
// con las cartas, con el arte y con lo que el núcleo sabe hacer.
// Si una prueba falla, el mensaje dice qué entrada y qué campo arreglar.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const T_ELEMENTOS = require('../juego/nucleo/territorio/elementos.js');
const T_DESTINOS = require('../juego/nucleo/territorio/destinos.js');
const T_PUEBLOS = require('../juego/nucleo/territorio/pueblos.js');
const MAPA = require('../juego/nucleo/mapa.js');
const REGLAS = require('../juego/nucleo/reglas.js');
const { SABERES } = require('../datos/saberes.js');
const CORTEZA = require('../arte/corteza/corteza.js');
const ARTE = require('../arte/fuente/arte.js');

const { ELEMENTOS, LUGARES, EFECTOS, RECURSOS } = T_ELEMENTOS;
const lleno = (v) => typeof v === 'string' && v.trim().length > 0;
const hayDibujo = (d) => !!(CORTEZA.figuras[d] || CORTEZA.PEGATINAS[d] || ARTE.SPRITES[d]);
const PROHIBIDAS = /\b(extinguid|extint|desaparecid)[oa]s?\b/i;

function revisarTextos(donde, entrada) {
  for (const [campo, valor] of Object.entries(entrada)) {
    if (typeof valor !== 'string') continue;
    const hallada = valor.match(PROHIBIDAS);
    assert.equal(hallada, null, `${donde}, campo «${campo}», dice «${hallada && hallada[0]}»: los pueblos se nombran en presente`);
  }
}

test('cada elemento tiene id, nombre, dibujo, lugar, dato, fuente y estado', () => {
  for (const [clave, el] of Object.entries(ELEMENTOS)) {
    assert.equal(el.id, clave, `el id de «${clave}» tiene que ser igual a su clave`);
    assert.match(el.id, /^[a-z0-9-]+$/, `el id «${el.id}» va en minúsculas, sin tildes ni espacios`);
    for (const campo of ['nombre', 'dato', 'fuente']) assert.ok(lleno(el[campo]), `al elemento «${clave}» le falta «${campo}» (si no hay fuente todavía, escribí 🔍)`);
    assert.ok(['recurso', 'refugio', 'paisaje'].includes(el.tipo), `el tipo de «${clave}» tiene que ser recurso, refugio o paisaje`);
    assert.ok(['borrador', 'revisado'].includes(el.estado), `el estado de «${clave}» tiene que ser borrador o revisado`);
    assert.ok(hayDibujo(el.dibujo), `el dibujo «${el.dibujo}» de «${clave}» no existe en Corteza (docs/04, sección 6)`);
    assert.ok(LUGARES.includes(el.donde), `el lugar «${el.donde}» de «${clave}» no existe. Lugares: ${LUGARES.join(', ')}`);
    revisarTextos(`el elemento «${clave}»`, el);
  }
});

test('cada efecto es uno que el núcleo sabe hacer', () => {
  for (const [clave, el] of Object.entries(ELEMENTOS)) {
    if (el.efecto) {
      assert.ok(EFECTOS.includes(el.efecto.tipo), `el efecto «${el.efecto.tipo}» de «${clave}» no está programado. Efectos: ${EFECTOS.join(', ')}`);
      assert.ok(RECURSOS.includes(el.efecto.recurso), `el recurso «${el.efecto.recurso}» de «${clave}» no existe`);
      assert.ok(el.efecto.recurso in REGLAS.RECURSOS_MAX, `falta el máximo de «${el.efecto.recurso}» en reglas.js`);
      assert.ok(Number.isFinite(el.efecto.cantidad) && el.efecto.cantidad > 0, `la cantidad del efecto de «${clave}» tiene que ser un número mayor que 0`);
    }
    if (el.cerca) assert.ok(el.cerca.distancia > 0 && el.cerca.ahorro > 0, `«cerca» de «${clave}» necesita distancia y ahorro`);
    if (el.tipo === 'paisaje') assert.ok(!el.efecto && !el.carta, `«${clave}» es paisaje: no se junta ni da carta`);
  }
});

test('cada carta nombrada existe en datos/saberes.js', () => {
  for (const [clave, el] of Object.entries(ELEMENTOS)) if (el.carta) assert.ok(SABERES[el.carta], `la carta «${el.carta}» de «${clave}» no está en datos/saberes.js`);
  for (const [clave, d] of Object.entries(T_DESTINOS.DESTINOS)) if (d.carta) assert.ok(SABERES[d.carta], `la carta «${d.carta}» del destino «${clave}» no está en datos/saberes.js`);
});

test('cada destino está completo, y el activo existe', () => {
  assert.ok(T_DESTINOS.DESTINOS[T_DESTINOS.ACTIVO], `el destino activo «${T_DESTINOS.ACTIVO}» no existe`);
  for (const [clave, d] of Object.entries(T_DESTINOS.DESTINOS)) {
    assert.equal(d.id, clave);
    for (const campo of ['nombre', 'dato', 'fuente']) assert.ok(lleno(d[campo]), `al destino «${clave}» le falta «${campo}»`);
    assert.ok(hayDibujo(d.dibujo), `el dibujo «${d.dibujo}» del destino «${clave}» no existe en Corteza`);
    assert.ok(LUGARES.includes(d.donde) && d.donde !== 'campamento', `el lugar «${d.donde}» del destino «${clave}» no sirve`);
    assert.ok(['borrador', 'revisado', 'propuesta'].includes(d.estado), `el estado del destino «${clave}» no es válido`);
    revisarTextos(`el destino «${clave}»`, d);
  }
});

test('cada pueblo nombra elementos y destinos que existen', () => {
  assert.ok(T_PUEBLOS.PUEBLOS[T_PUEBLOS.POR_DEFECTO]);
  for (const [clave, p] of Object.entries(T_PUEBLOS.PUEBLOS)) {
    for (const id of p.elementos) assert.ok(ELEMENTOS[id], `el pueblo «${clave}» nombra el elemento «${id}», que no existe`);
    for (const id of p.destinos) assert.ok(T_DESTINOS.DESTINOS[id], `el pueblo «${clave}» nombra el destino «${id}», que no existe`);
    assert.ok(p.canal.ancho >= 20 && p.canal.alto >= 11, `el canal de «${clave}» es muy chico`);
  }
});

test('las cartas de los elementos son del mismo pueblo', () => {
  for (const [clave, p] of Object.entries(T_PUEBLOS.PUEBLOS)) {
    for (const id of p.elementos) {
      const carta = ELEMENTOS[id].carta;
      if (carta) assert.equal(SABERES[carta].pueblo, clave, `la carta «${carta}» es de otro pueblo: los saberes se heredan dentro de cada pueblo`);
    }
  }
});

test('con cada destino del pueblo se genera un mapa válido', () => {
  for (const [clave, p] of Object.entries(T_PUEBLOS.PUEBLOS)) {
    for (const destino of p.destinos) {
      let fijos = 0;
      for (let s = 1; s <= 60; s++) if (MAPA.generar(s, { pueblo: clave, destino }).fijo) fijos++;
      assert.ok(fijos <= 3, `con el destino «${destino}», ${fijos} de 60 semillas no dieron un mapa válido`);
    }
  }
});
