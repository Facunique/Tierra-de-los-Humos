// Crónica del viaje (juego/interfaz/cronica.js): cuenta la partida sin inventar datos.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const C = require('../juego/interfaz/cronica.js');
const TDH_PARTIDA = require('../juego/nucleo/partida.js');
const { ORDEN } = require('../datos/saberes.js');

test('la crónica cuenta lo que pasó, en orden y con plurales bien', () => {
  const ev = [
    { tipo: 'remo' }, { tipo: 'junto', nombre: 'leña' }, { tipo: 'junto', nombre: 'mejillones' }, { tipo: 'junto', nombre: 'leña' },
    { tipo: 'avivo' }, { tipo: 'clima', clima: 'viento' }, { tipo: 'clima', clima: 'lluvia' }, { tipo: 'demora' },
    { tipo: 'acampe', comio: false }, { tipo: 'reencendido', con: 'pirita' }, { tipo: 'saber', id: 'fuego' },
  ];
  const t = C.armar(ev, { estacion: 'otono', pasos: 9, gano: true, destino: { nombre: 'la ballena varada' } });
  assert.match(t, /salió en otoño/);
  assert.match(t, /Remaron 9 casillas y avivaron el fuego una vez\./);
  assert.match(t, /Juntaron leña dos veces y mejillones\./);
  assert.match(t, /Una vez algo no salió/);
  assert.match(t, /agarraron el viento y la lluvia/);
  assert.match(t, /Pasaron una noche amarrados en el cachiyuyo, sin comida\./);
  assert.match(t, /La pirita volvió a prender el fuego una vez\./);
  assert.match(t, /Llegaron a la ballena varada con el fuego encendido\.$/);
});

test('si se apagó, lo dice y no habla de muerte', () => {
  const t = C.armar([], { estacion: 'invierno', pasos: 1, gano: false }, { apagado: 'con la lluvia' });
  assert.match(t, /Remaron una casilla\./);
  assert.match(t, /No llegaron a juntar nada\./);
  assert.match(t, /El fuego se apagó con la lluvia\. Pero lo aprendido no se pierde\.$/);
  assert.doesNotMatch(t, /muri|muert|extingu|desaparec/i);
});

test('con una partida real, la crónica sale sin huecos', () => {
  const p = TDH_PARTIDA.nueva({ semilla: 7, mapa: 'fijo', saberes: ORDEN });
  const diario = [];
  for (let i = 0; i < 200 && !p.terminada; i++) diario.push(...p.hacer({ tipo: i % 3 ? 'demora' : 'avivar' }));
  const t = C.armar(diario, p.estado, { apagado: 'de tanto remar' });
  assert.ok(t.length > 40);
  assert.doesNotMatch(t, /undefined|NaN|null|  /);
});
