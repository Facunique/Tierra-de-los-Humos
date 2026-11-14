// Prueba el puente entre la partida y el sonido (sonido/juego.js).
// Usa la partida falsa; con el núcleo de la Persona A alcanza con cambiar el require.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const OIDO = require('../sonido/juego.js');
const SONIDO = require('../sonido/ambiente.js');
const TDH_PARTIDA = require('./partida-falsa.js');
const { ORDEN, SABERES } = require('../datos/saberes.js');

// Un sonido de mentira: anota lo que se le pide, sin Web Audio.
function sonidoFalso() {
  const pedido = { efectos: [], ambiente: null };
  return {
    pedido,
    activo: true,
    efecto(nombre, texto) { pedido.efectos.push({ nombre, texto }); return texto; },
    ambiente(a) { pedido.ambiente = a; },
  };
}

test('el ambiente sale de partida.estado, con valores válidos', () => {
  const p = TDH_PARTIDA.nueva({ semilla: 3, saberes: ORDEN });
  const a = OIDO.ambienteDe(p.estado);
  for (const k of ['viento', 'lluvia', 'mar', 'bosque', 'playa']) assert.ok(a[k] >= 0 && a[k] <= 1, k + ' entre 0 y 1');
  assert.ok(Number.isInteger(a.fuego) && a.fuego >= 0 && a.fuego <= 4);
});

test('el bosque y la playa se oyen cerca de la costa, y el mar en el canal hondo', () => {
  const mapa = ['GGLGGLGG', 'GG....GG', ',,,,,,,,', '--------', '~~~~~~~~', '~~~~~~~~'];
  const costa = OIDO.ambienteDe({ mapa, canoa: { x: 3, y: 2, fuego: 3 }, clima: 'calma' });
  const canal = OIDO.ambienteDe({ mapa, canoa: { x: 3, y: 5, fuego: 3 }, clima: 'calma' });
  assert.ok(costa.bosque > canal.bosque && costa.playa > canal.playa);
  assert.ok(canal.mar > costa.mar);
  assert.equal(canal.bosque, 0);
});

test('el clima cambia el viento y la lluvia', () => {
  const base = { mapa: ['~~~'], canoa: { x: 1, y: 0, fuego: 2 } };
  assert.ok(OIDO.ambienteDe(Object.assign({ clima: 'viento' }, base)).viento > OIDO.ambienteDe(Object.assign({ clima: 'calma' }, base)).viento);
  assert.equal(OIDO.ambienteDe(Object.assign({ clima: 'lluvia' }, base)).lluvia, 0.8);
  assert.equal(OIDO.ambienteDe(Object.assign({ clima: 'calma' }, base)).lluvia, 0);
});

test('cada evento del contrato suena con un efecto que existe y un subtítulo', () => {
  const efectosValidos = new Set(SONIDO.crear().efectos);
  const eventos = [
    { tipo: 'remo', x: 1, y: 1 },
    { tipo: 'fuego', antes: 3, despues: 2, motivo: 'remar', causas: ['viento'] },
    { tipo: 'junto', que: 'lena', nombre: 'leña' },
    { tipo: 'junto', que: 'mejillones', nombre: 'mejillones' },
    { tipo: 'junto', que: 'pirita', nombre: 'pirita' },
    { tipo: 'avivo' },
    { tipo: 'saber', id: 'fuego' },
    { tipo: 'reencendido', con: 'pirita' },
    { tipo: 'acampe', comio: true },
    { tipo: 'clima', antes: 'calma', clima: 'lluvia' },
    { tipo: 'hora', antes: 'tarde', hora: 'noche' },
    { tipo: 'fin', gano: false, causa: 'viento' },
    { tipo: 'fin', gano: true, causa: 'llegada' },
  ];
  const lista = OIDO.efectosDe(eventos, { saberes: SABERES });
  assert.equal(lista.length, eventos.length, 'cada evento de la lista suena una vez');
  for (const e of lista) {
    assert.ok(efectosValidos.has(e.efecto), 'existe el efecto ' + e.efecto);
    assert.ok(typeof e.texto === 'string' && e.texto.length > 3, 'tiene subtítulo');
  }
  assert.equal(lista[2].texto, 'Juntaste leña');
  assert.equal(lista[3].efecto, 'comida');
  assert.equal(lista[4].efecto, 'piedra');
  assert.match(lista[6].texto, /El fuego viaja en la canoa/);
  assert.equal(lista[11].texto, 'El viento apagó el fuego');
  assert.equal(lista[12].efecto, 'llegada');
});

test('lo que no tiene sonido no suena, y un remo sin viento no hace ola', () => {
  const lista = OIDO.efectosDe([{ tipo: 'fuego', antes: 3, despues: 2, motivo: 'remar', causas: [] }, { tipo: 'desconocido' }]);
  assert.deepEqual(lista, []);
});

test('una partida falsa entera suena sin errores y termina con un sonido de fin', () => {
  const p = TDH_PARTIDA.nueva({ semilla: 5, saberes: ORDEN });
  const falso = sonidoFalso();
  const oido = OIDO.conectar(falso, { saberes: SABERES, separacion: 0 });
  const todos = [];
  for (let i = 0; i < 60 && !p.terminada; i++) {
    const antes = p.estado.canoa.x;
    const evs = p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
    if (p.estado.canoa.x === antes) break; // contra la costa o el borde
    todos.push(...OIDO.efectosDe(evs, { saberes: SABERES }));
    oido.estado(p.estado);
  }
  oido.callar();
  assert.ok(falso.pedido.ambiente, 'el ambiente se acomodó');
  if (p.terminada) assert.ok(['llegada', 'apagado'].includes(todos[todos.length - 1].efecto));
  assert.ok(todos.some((e) => e.efecto === 'saber'), 'la partida falsa da al menos un saber');
});

test('conectar pasa el subtítulo propio al sonido', () => {
  const falso = sonidoFalso();
  const oido = OIDO.conectar(falso, { separacion: 0 });
  oido.eventos([{ tipo: 'junto', que: 'hongos', nombre: 'hongos' }]);
  oido.callar();
  assert.deepEqual(falso.pedido.efectos[0], { nombre: 'comida', texto: 'Juntaste hongos' });
});

// La postal también se arma con partida.estado (arte/postal/postal.js).
test('la postal toma los datos de la partida', () => {
  const POSTAL = require('../arte/postal/postal.js');
  const estado = {
    mapa: ['~~~', '~~~'], objetos: [], explorado: () => true, canoa: { x: 2, y: 1, fuego: 3 },
    ruta: [[0, 0], [1, 0], [2, 1]], pasos: 2, gano: true, pueblo: 'yagan',
    destino: { x: 2, y: 1, id: 'ballena', nombre: 'la ballena varada' }, aprendidos: ['fuego', 'inventado'],
  };
  const d = POSTAL.datosDe(estado, { generacion: 3, saberes: SABERES });
  assert.equal(d.generacion, 3);
  assert.equal(d.llego, true);
  assert.equal(d.destino, 'la ballena varada');
  assert.equal(d.pueblo, 'yagán');
  assert.equal(d.pasos, 2);
  assert.deepEqual(d.saberes, [SABERES.fuego.titulo, 'inventado']);
  assert.ok(d.fecha instanceof Date);
});
