// Prueba el narrador (sonido/narrador.js): que describa bien lo que rodea a la canoa
// y cuente lo que pasa, a partir del contrato de la partida.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const N = require('../sonido/narrador.js');
const TDH_PARTIDA = require('./partida-falsa.js');
const { ORDEN, SABERES } = require('../datos/saberes.js');

//            x: 01234
const MAPA = ['GG.GG',  // y 0
              ',,,,,',  // y 1
              '-----',  // y 2
              '~~~~~'];  // y 3
const base = {
  mapa: MAPA, canoa: { x: 2, y: 1, fuego: 3 }, clima: 'viento', hora: 'tarde',
  objetos: [{ id: 'lena', x: 2, y: 0 }], recursos: { lena: 1, comida: 0, pirita: 0 },
  destino: { x: 4, y: 3, nombre: 'la ballena varada' }, explorado: () => true,
};

test('describe las cuatro direcciones, con lo que hay en cada una', () => {
  const a = N.alrededor(base);
  assert.deepEqual(a.map((x) => x.dir), ['norte', 'este', 'sur', 'oeste']);
  assert.equal(a[0].lugar, 'playa');
  assert.deepEqual(a[0].cosas, ['leña']);
  assert.equal(a[1].lugar, 'agua baja');
  assert.equal(a[2].lugar, 'canal');
});

test('lo que no se exploró es humo, y afuera del mapa es el borde', () => {
  const e = Object.assign({}, base, { canoa: { x: 0, y: 1, fuego: 3 }, explorado: (x, y) => y !== 2 });
  const a = N.alrededor(e);
  assert.ok(a[2].humo, 'al sur hay humo');
  assert.ok(!a[2].cosas.length, 'en el humo no se cuenta lo que hay');
  assert.ok(a[3].borde, 'al oeste está el borde');
});

test('la descripción completa dice el fuego, lo que se lleva, la hora, el clima, el alrededor y el rumbo', () => {
  const t = N.describir(base, { juntar: 'lena', avivar: true, amarrar: false });
  assert.match(t, /^Fuego 3 de 4\./);
  assert.match(t, /Llevan 1 de leña y 0 de comida\./);
  assert.match(t, /Cae la tarde y hay viento\./);
  assert.match(t, /Al norte, playa con leña/);
  assert.match(t, /Se puede juntar leña y avivar el fuego\./);
  assert.match(t, /Hasta la ballena varada faltan 4 casillas, hacia el sur y este\./);
});

test('el rumbo nombra el eje principal cuando el otro es chico', () => {
  assert.match(N.rumbo(Object.assign({}, base, { canoa: { x: 0, y: 1 }, destino: { x: 20, y: 2, nombre: 'la ballena varada' } })), /hacia el este\.$/);
  assert.match(N.rumbo(Object.assign({}, base, { canoa: { x: 4, y: 3 }, destino: { x: 4, y: 3 } })), /^Llegaron/);
});

test('cuenta lo que pasó, en frases cortas', () => {
  const t = N.contar([
    { tipo: 'remo', x: 3, y: 1 }, { tipo: 'fuego', antes: 3, despues: 2, motivo: 'remar', causas: ['viento'] },
    { tipo: 'junto', que: 'lena', nombre: 'leña' }, { tipo: 'saber', id: 'fuego' }, { tipo: 'hora', antes: 'tarde', hora: 'noche' },
  ], { saberes: SABERES });
  assert.equal(t, 'Fuego 2 de 4. Juntaste leña. Un saber nuevo: El fuego viaja en la canoa. Es de noche.');
  assert.match(N.contar([{ tipo: 'fin', gano: false }]), /generación siguiente/);
});

test('después de remar, dice solo lo interesante: tierra, cosas o humo, no el agua abierta', () => {
  const t = N.tras([{ tipo: 'remo', x: 2, y: 1 }], base, { juntar: 'lena' });
  assert.match(t, /Al norte, playa con leña\./);
  assert.ok(!/al este/i.test(t), 'el agua abierta no se nombra');
  assert.match(t, /Se puede juntar leña\./);
});

test('una partida falsa entera se puede narrar sin errores', () => {
  const p = TDH_PARTIDA.nueva({ semilla: 9, saberes: ORDEN });
  let textos = 0;
  for (let i = 0; i < 40 && !p.terminada; i++) {
    const x0 = p.estado.canoa.x;
    const evs = p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
    if (p.estado.canoa.x === x0) break;
    const t = N.tras(evs, p.estado, null, { saberes: SABERES });
    assert.equal(typeof t, 'string');
    if (t) textos++;
    assert.ok(N.describir(p.estado).startsWith('Fuego '));
  }
  assert.ok(textos > 0);
});

test('conectar habla con la voz y puede repetir', () => {
  const dicho = [];
  const voz = { disponible: () => true, leer: (t) => { dicho.push(t); return Promise.resolve(true); }, detener() {} };
  const n = N.conectar(voz);
  n.describir(base);
  n.repetir();
  assert.equal(dicho.length, 2);
  assert.equal(dicho[0], dicho[1]);
});
