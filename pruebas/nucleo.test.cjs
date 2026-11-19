// Pruebas del núcleo (juego/nucleo/): el mapa, las acciones y el balance.
// Se corren desde la raíz del repo con: node --test
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const MAPA = require('../juego/nucleo/mapa.js');
const TDH_PARTIDA = require('../juego/nucleo/partida.js');
const { ORDEN } = require('../datos/saberes.js');
const BOTS = require('./bots.cjs');

const LETRAS = /^[~\-,kr.pGLtM]+$/;
const tipos = (ev) => ev.map((e) => e.tipo);

// ── Mapa ──────────────────────────────────────────────────────────────────
test('el mapa generado es válido en 300 semillas', () => {
  for (let s = 1; s <= 300; s++) {
    const m = MAPA.generar(s);
    assert.ok(m.mapa.every((f) => LETRAS.test(f) && f.length === m.mapa[0].length), `semilla ${s}: letras o filas desparejas`);
    assert.ok(MAPA.navegable(m.mapa, m.inicio.x, m.inicio.y), `semilla ${s}: la canoa no arranca en el agua`);
    assert.equal(m.mapa[m.destino.y][m.destino.x], '.', `semilla ${s}: la ballena no está en una playa`);
    const agua = MAPA.alcanzables(m.mapa, m.inicio);
    for (const o of m.objetos.filter((x) => x.junta)) {
      const alAlcance = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => agua.has((o.x + dx) + ',' + (o.y + dy)));
      assert.ok(alAlcance, `semilla ${s}: «${o.junta}» en ${o.x},${o.y} no se puede juntar desde el agua`);
    }
    for (const o of m.objetos.filter((x) => x.id === 'pescado')) assert.equal(m.mapa[o.y][o.x], ',', `semilla ${s}: el pescado va en el agua baja`);
  }
});

test('el mapa sale igual con la misma semilla y distinto con otra', () => {
  assert.deepEqual(MAPA.generar(42), MAPA.generar(42));
  assert.notDeepEqual(MAPA.generar(42).mapa, MAPA.generar(43).mapa);
  const distintos = new Set(), N = 500;
  let reintentos = 0;
  for (let s = 1; s <= N; s++) { const m = MAPA.generar(s); distintos.add(m.mapa.join('')); reintentos += m.intento || 0; }
  console.log(`  mapas: ${distintos.size} distintos en ${N} semillas; ${reintentos} reintentos (${(100 * reintentos / N).toFixed(1)} %)`);
  assert.ok(distintos.size >= N * 0.98, 'la semilla tiene que llegar al generador: casi todos los mapas distintos');
  assert.ok(reintentos / N < 0.25, 'demasiados mapas rechazados: hay que arreglar el generador, no reintentar más');
});

// Huella de algunos mapas. Si cambia, cambiaron los mapas de TODAS las semillas: las que
// se compartieron (?semilla=) ya no dan el mismo viaje. Si fue a propósito, actualizá las huellas.
function huella(m) {
  let h = 0x811c9dc5;
  const t = JSON.stringify([m.mapa, m.objetos, m.inicio, m.destino]);
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16);
}
const HUELLAS = { 1: '99b883a', 7: '5dd9e8b8', 42: '66ccbbfd' };
test('los mapas de las semillas conocidas no cambian sin querer', () => {
  for (const [s, h] of Object.entries(HUELLAS)) assert.equal(huella(MAPA.generar(Number(s))), h, `cambió el mapa de la semilla ${s}`);
});

test('sacar un elemento de los datos no mueve las costas', () => {
  const T_PUEBLOS = require('../juego/nucleo/territorio/pueblos.js');
  const yagan = T_PUEBLOS.PUEBLOS.yagan, antes = yagan.elementos;
  const conTodo = MAPA.generar(5);
  yagan.elementos = antes.filter((id) => id !== 'tonina');
  try {
    const sinTonina = MAPA.generar(5);
    assert.deepEqual(sinTonina.mapa, conTodo.mapa, 'el terreno tiene su propia semilla');
    assert.deepEqual(sinTonina.objetos.filter((o) => o.elemento === 'lena'), conTodo.objetos.filter((o) => o.elemento === 'lena'), 'la leña tampoco se mueve');
  } finally { yagan.elementos = antes; }
});

test('el mapa fijo es el de la maqueta', () => {
  const m = MAPA.fijo();
  assert.equal(m.fijo, true);
  assert.deepEqual(m.inicio, { x: 2, y: 6 });
  assert.ok(m.objetos.some((o) => o.id === 'ballena-varada' && o.meta));
});

// ── Acciones (sobre el mapa fijo, que no cambia) ─────────────────────────
const fija = (op) => TDH_PARTIDA.nueva(Object.assign({ semilla: 1, mapa: 'fijo', saberes: ORDEN }, op || {}));

test('la primera carta es la del fuego, y solo sale una vez', () => {
  const p = fija();
  assert.deepEqual(p.hacer({ tipo: 'remar', dx: 1, dy: 0 }).filter((e) => e.tipo === 'saber'), [{ tipo: 'saber', id: 'fuego' }]);
  assert.equal(p.hacer({ tipo: 'remar', dx: 1, dy: 0 }).filter((e) => e.tipo === 'saber').length, 0);
});

test('juntar leña y avivar el fuego', () => {
  const p = fija();
  assert.equal(p.puede().juntar, null);
  for (const [dx, dy] of [[1, 0], [1, 0], [1, 0], [1, 0], [0, -1]]) p.hacer({ tipo: 'remar', dx, dy }); // hasta (6, 5), al lado de la leña
  assert.equal(p.puede().juntar, 'lena');
  const lena = p.estado.recursos.lena;
  assert.deepEqual(p.hacer({ tipo: 'juntar' }), [{ tipo: 'junto', que: 'lena', nombre: 'leña' }]);
  assert.equal(p.estado.recursos.lena, lena + 2);
  assert.ok(!p.estado.objetos.some((o) => o.id === 'lena' && o.x === 6 && o.y === 4), 'la leña ya no está en el mapa');
  const e = p.estado.energia;
  assert.deepEqual(tipos(p.hacer({ tipo: 'avivar' })).slice(0, 1), ['avivo']);
  const R = require('../juego/nucleo/reglas.js');
  assert.equal(p.estado.energia, Math.min(R.ENERGIA_MAX, e + R.AVIVAR));
});

test('con el atado lleno, la leña queda en el mapa', () => {
  const p = fija();
  p.estado.recursos.lena = 5;
  for (const [dx, dy] of [[1, 0], [1, 0], [1, 0], [1, 0], [0, -1]]) p.hacer({ tipo: 'remar', dx, dy });
  assert.equal(p.puede().juntar, null, 'no se ofrece juntar lo que no entra');
  assert.deepEqual(p.hacer({ tipo: 'juntar' }), []);
  assert.ok(p.estado.objetos.some((o) => o.id === 'lena' && o.x === 6 && o.y === 4), 'la leña sigue ahí');
  p.estado.recursos.lena = 4;
  assert.equal(p.puede().juntar, 'lena');
});

test('cerca de la choza el fuego se gasta menos', () => {
  const p = fija({ reglas: { CLIMA_PROB_CAMBIO: 0 } });
  for (const [dx, dy] of [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0]]) p.hacer({ tipo: 'remar', dx, dy }); // hasta (7, 6), a 2 de la choza
  const antes = p.estado.energia;
  p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.equal(p.estado.energia, antes, 'al lado de la choza remar no gasta');
});

test('no se puede avivar sin leña ni con el fuego lleno', () => {
  const R = require('../juego/nucleo/reglas.js');
  const p = fija();
  p.estado.energia = R.ENERGIA_MAX; // fuego lleno
  assert.deepEqual(p.hacer({ tipo: 'avivar' }), []);
  p.estado.recursos.lena = 0; p.estado.energia = 4;
  assert.deepEqual(p.hacer({ tipo: 'avivar' }), []);
});

test('amarrar en el cachiyuyo: pasan la noche y vuelve la calma', () => {
  const p = fija();
  assert.equal(p.puede().amarrar, false);
  p.hacer({ tipo: 'remar', dx: 0, dy: -1 }); // (2, 5) es cachiyuyo, con playa arriba
  assert.equal(p.puede().amarrar, true);
  p.estado.recursos.comida = 1; p.estado.clima = 'lluvia'; p.estado.hora = 'noche';
  const ev = p.hacer({ tipo: 'amarrar' });
  assert.equal(ev[0].tipo, 'acampe');
  assert.equal(ev[0].comio, true);
  assert.ok(ev.some((e) => e.tipo === 'saber' && e.id === 'amarre'));
  assert.equal(p.estado.hora, 'dia');
  assert.equal(p.estado.clima, 'calma');
  assert.equal(p.estado.recursos.comida, 0);
});

test('acampar no es gratis: sin comida baja el fuego, y con comida sube menos', () => {
  const R = require('../juego/nucleo/reglas.js');
  const sin = fija();
  sin.hacer({ tipo: 'remar', dx: 0, dy: -1 });
  const antes = sin.estado.energia;
  const ev = sin.hacer({ tipo: 'amarrar' });
  assert.equal(sin.estado.energia, antes - R.GASTO_ACAMPAR);
  assert.ok(ev.every((e) => e.tipo !== 'fuego' || e.motivo === 'acampar'));

  const con = fija();
  con.hacer({ tipo: 'remar', dx: 0, dy: -1 });
  con.estado.recursos.comida = 1;
  const antesCon = con.estado.energia;
  con.hacer({ tipo: 'amarrar' });
  assert.equal(con.estado.energia, antesCon + R.COMER_AL_ACAMPAR - R.GASTO_ACAMPAR);
});

test('acampar una noche tras otra sin comida termina el viaje: la partida no puede durar para siempre', () => {
  const p = fija();
  p.hacer({ tipo: 'remar', dx: 0, dy: -1 });
  let fin = null;
  for (let i = 0; i < 50 && !p.terminada; i++) fin = p.hacer({ tipo: 'amarrar' }).find((e) => e.tipo === 'fin') || fin;
  assert.ok(p.terminada, 'después de 50 noches sigue el viaje');
  assert.equal(fin.gano, false);
  assert.equal(fin.causa, 'noche');
});

test('acampar sin comida con el fuego al mínimo usa la pirita', () => {
  const p = fija();
  p.hacer({ tipo: 'remar', dx: 0, dy: -1 });
  p.estado.recursos.pirita = 1; p.estado.energia = 1;
  const ev = p.hacer({ tipo: 'amarrar' });
  assert.ok(ev.some((e) => e.tipo === 'reencendido'));
  assert.equal(p.terminada, false);
  assert.equal(p.estado.hora, 'dia');
});

/** El camino por el agua hasta el lado del destino (el destino está en tierra). */
const alDestino = (p) => { const d = p.estado.destino; return MAPA.camino(p.estado.mapa, p.estado.canoa, (x, y) => Math.max(Math.abs(x - d.x), Math.abs(y - d.y)) <= 1); };

test('cada cambio de clima se anuncia un paso antes', () => {
  const R = require('../juego/nucleo/reglas.js');
  let cambios = 0;
  for (let s = 1; s <= 200; s++) {
    const p = TDH_PARTIDA.nueva({ semilla: s, saberes: ORDEN });
    let anunciado = null;
    for (let i = 0; i < 80 && !p.terminada; i++) {
      const sig = (alDestino(p) || [])[0];
      if (!sig) break;
      p.estado.energia = R.ENERGIA_MAX;                       // que no se apague: acá se mira solo el clima
      const ev = p.hacer({ tipo: 'remar', dx: sig.x - p.estado.canoa.x, dy: sig.y - p.estado.canoa.y });
      const clima = ev.find((e) => e.tipo === 'clima'), aviso = ev.find((e) => e.tipo === 'aviso');
      if (clima) {
        cambios++;
        assert.ok(anunciado, `semilla ${s}: el clima cambió a «${clima.clima}» sin aviso`);
        assert.equal(clima.clima, anunciado.clima, `semilla ${s}: se anunció «${anunciado.clima}» y llegó «${clima.clima}»`);
        anunciado = null;
      }
      if (aviso) {
        assert.equal(aviso.faltan, R.CLIMA_AVISO_PASOS);
        assert.equal(aviso.antes, p.estado.clima);
        assert.deepEqual(p.estado.pronostico, { clima: aviso.clima, faltan: aviso.faltan });
        anunciado = aviso;
      }
    }
  }
  console.log(`  clima: ${cambios} cambios, todos anunciados`);
  assert.ok(cambios > 20, 'casi no cambió el clima: la prueba no está mirando nada');
});

test('sin aviso (CLIMA_AVISO_PASOS: 0) el clima cambia de golpe, como antes', () => {
  const p = TDH_PARTIDA.nueva({ semilla: 3, saberes: ORDEN, reglas: { CLIMA_AVISO_PASOS: 0 } });
  const todos = [];
  for (let i = 0; i < 80 && !p.terminada; i++) {
    const sig = (alDestino(p) || [])[0];
    if (!sig) break;
    p.estado.energia = 16;
    todos.push(...p.hacer({ tipo: 'remar', dx: sig.x - p.estado.canoa.x, dy: sig.y - p.estado.canoa.y }));
  }
  assert.ok(!todos.some((e) => e.tipo === 'aviso'));
});

test('acampar cancela lo anunciado: pasa la noche y amanece en calma', () => {
  const p = fija();
  p.hacer({ tipo: 'remar', dx: 0, dy: -1 });
  p.estado.pronostico = { clima: 'lluvia', faltan: 1 };
  p.hacer({ tipo: 'amarrar' });
  assert.equal(p.estado.pronostico, null);
  assert.equal(p.estado.clima, 'calma');
  const ev = p.hacer({ tipo: 'remar', dx: 0, dy: 1 });
  assert.ok(!ev.some((e) => e.tipo === 'clima'), 'llegó la lluvia anunciada antes de acampar');
});

// ── El motivo del viaje (nomadismo) ───────────────────────────────────────
test('el motivo del viaje: solo entran los destinos que no están en «propuesta»', () => {
  const T_DESTINOS = require('../juego/nucleo/territorio/destinos.js');
  for (let s = 1; s <= 50; s++) {
    const id = TDH_PARTIDA.elegirDestino({ semilla: s });
    assert.notEqual(T_DESTINOS.DESTINOS[id].estado, 'propuesta', `semilla ${s}: salió «${id}», que es una propuesta`);
    assert.equal(TDH_PARTIDA.nueva({ semilla: s, saberes: ORDEN }).estado.destino.id, id);
  }
});

test('el motivo del viaje depende de la estación cuando el destino la tiene', () => {
  const D = {
    ballena: { estado: 'borrador' },
    corteza: { estado: 'borrador', estaciones: ['primavera'] },
    pirita: { estado: 'propuesta' },
  };
  const vistos = { primavera: new Set(), invierno: new Set() };
  for (let s = 1; s <= 60; s++) for (const estacion of ['primavera', 'invierno']) vistos[estacion].add(TDH_PARTIDA.elegirDestino({ semilla: s, estacion, destinos: D }));
  assert.deepEqual([...vistos.invierno], ['ballena'], 'en invierno no hay corteza');
  assert.deepEqual([...vistos.primavera].sort(), ['ballena', 'corteza'], 'en primavera salen los dos');
  assert.equal(TDH_PARTIDA.elegirDestino({ semilla: 9, estacion: 'otono', destinos: D }), TDH_PARTIDA.elegirDestino({ semilla: 9, estacion: 'otono', destinos: D }), 'misma semilla, mismo motivo');
});

test('si ningún destino sirve, el viaje va al ACTIVO; y el destino pedido manda', () => {
  const T_DESTINOS = require('../juego/nucleo/territorio/destinos.js');
  const D = { ballena: { estado: 'propuesta' }, corteza: { estado: 'propuesta' }, pirita: { estado: 'propuesta' } };
  assert.equal(TDH_PARTIDA.elegirDestino({ semilla: 1, destinos: D }), T_DESTINOS.ACTIVO);
  assert.equal(TDH_PARTIDA.nueva({ semilla: 1, saberes: ORDEN, destino: 'pirita' }).estado.destino.id, 'pirita');
});

test('la pirita vuelve a prender el fuego una sola vez', () => {
  const p = fija();
  p.estado.recursos.pirita = 1; p.estado.energia = 1;
  const ev = p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.ok(tipos(ev).includes('reencendido'));
  assert.equal(p.terminada, false);
  assert.equal(p.estado.recursos.pirita, 0);
  assert.equal(p.estado.canoa.fuego, 1);
});

test('llegar a la ballena con el fuego encendido gana y da la carta de la ballena', () => {
  const p = fija({ reglas: { GASTO_REMAR: 0, GASTO_NOCHE: 0, GASTO_LLUVIA: 0, GASTO_VIENTO_HONDO: 0 } });
  const d = p.estado.destino;
  const ruta = MAPA.camino(p.estado.mapa, p.estado.canoa, (x, y) => Math.max(Math.abs(x - d.x), Math.abs(y - d.y)) <= 1);
  let ev = [];
  for (const paso of ruta) ev = p.hacer({ tipo: 'remar', dx: paso.x - p.estado.canoa.x, dy: paso.y - p.estado.canoa.y });
  assert.deepEqual(ev.slice(-2).map((e) => [e.tipo, e.id || e.causa]), [['saber', 'ballena'], ['fin', 'llegada']]);
  assert.equal(ev[ev.length - 1].gano, true);
  assert.equal(p.estado.gano, true);
  assert.equal(p.terminada, true);
  assert.deepEqual(p.puede(), { juntar: null, avivar: false, amarrar: false });
});

test('lo heredado no vuelve a salir como carta, y cada saber deja algo propio', () => {
  const R = require('../juego/nucleo/reglas.js');
  const p = fija({ heredados: ['fuego', 'amarre'] });
  assert.equal(p.estado.energia, Math.min(R.ENERGIA_MAX, R.ENERGIA_INICIAL + R.HERENCIA.fuego.energia), 'el saber del fuego abriga al salir');
  assert.deepEqual(p.estado.herencia, ['fuego', 'amarre']);
  const ev = p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.ok(!ev.some((e) => e.tipo === 'saber'), 'la carta del fuego ya la sabían');
  // Un saber que no está en HERENCIA no hace nada (y no rompe).
  assert.equal(fija({ heredados: ['otro'] }).estado.energia, R.ENERGIA_INICIAL);
});

test('lo heredado se ve a través del humo: amarres, mejillones y el destino', () => {
  const sin = fija(), con = fija({ heredados: ['amarre', 'mejillones', 'ballena'] });
  const e = con.estado;
  const amarres = [];
  for (let y = 0; y < e.mapa.length; y++) for (let x = 0; x < e.mapa[0].length; x++) if (e.mapa[y][x] === 'k' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (e.mapa[y + dy] || '')[x + dx] === '.')) amarres.push([x, y]);
  assert.ok(amarres.length && amarres.every(([x, y]) => e.explorado(x, y)), 'todos los amarres a la vista');
  assert.ok(amarres.some(([x, y]) => !sin.estado.explorado(x, y)), 'sin el saber, alguno está en el humo');
  for (const o of e.objetos.filter((o) => o.junta === 'mejillones')) assert.ok(e.explorado(o.x, o.y));
  assert.ok(e.explorado(e.destino.x, e.destino.y) && !sin.estado.explorado(sin.estado.destino.x, sin.estado.destino.y));
});

test('los hongos heredados dan comida al salir; la pirita heredada reenciende más alto', () => {
  const R = require('../juego/nucleo/reglas.js');
  assert.equal(fija({ heredados: ['hongos'] }).estado.recursos.comida, (R.RECURSOS_INICIALES.comida || 0) + R.HERENCIA.hongos.comida);
  const p = fija({ heredados: ['pirita'] });
  p.estado.recursos.pirita = 1; p.estado.energia = 1;
  p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.equal(p.estado.energia, R.HERENCIA.pirita.pirita);
});

test('con la corteza heredada, el viento del canal hondo no gasta de más; nada gasta más que el tope', () => {
  const R = require('../juego/nucleo/reglas.js');
  for (const [her, esperado] of [[[], 'viento'], [['corteza'], null]]) {
    const p = TDH_PARTIDA.nueva({ semilla: 7, saberes: ORDEN, heredados: her, reglas: { CLIMA_PROB_CAMBIO: 0 } });
    p.estado.clima = 'viento'; p.estado.hora = 'noche';
    const e = p.estado, c = e.canoa;
    const ruta = MAPA.camino(e.mapa, c, (x, y) => e.mapa[y][x] === '~');
    if (!ruta) continue;
    for (const paso of ruta.slice(0, -1)) p.hacer({ tipo: 'remar', dx: paso.x - e.canoa.x, dy: paso.y - e.canoa.y });
    e.energia = 20; e.hora = 'noche'; e.clima = 'viento'; e.pronostico = null;
    const ult = ruta[ruta.length - 1];
    const ev = p.hacer({ tipo: 'remar', dx: ult.x - e.canoa.x, dy: ult.y - e.canoa.y });
    const f = ev.find((x) => x.tipo === 'fuego');
    assert.ok(20 - e.energia <= R.GASTO_TOPE, 'una remada no gasta más que el tope');
    if (esperado) assert.ok(!f || f.causas.includes('viento') || 20 - e.energia === R.GASTO_TOPE);
    else assert.ok(!f || !f.causas.includes('viento'), 'con la corteza, el viento no pesa');
  }
});

test('brasas: con el fuego en 0 quedan unas remadas; avivar lo vuelve a prender', () => {
  const R = require('../juego/nucleo/reglas.js');
  const p = fija({ reglas: { CLIMA_PROB_CAMBIO: 0 } });
  p.estado.energia = 1;
  let ev = p.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.equal(p.terminada, false, 'no termina de golpe');
  assert.deepEqual(ev.find((e) => e.tipo === 'brasas'), { tipo: 'brasas', quedan: R.BRASAS_PASOS });
  assert.equal(p.estado.brasas, R.BRASAS_PASOS);
  ev = p.hacer({ tipo: 'avivar' });
  assert.equal(p.estado.brasas, null, 'de las brasas vuelve a prender');
  assert.ok(p.estado.canoa.fuego > 0);
  // Sin leña, las brasas se acaban y termina el viaje.
  const q = fija({ reglas: { CLIMA_PROB_CAMBIO: 0 } });
  q.estado.energia = 1; q.estado.recursos.lena = 0;
  const dirs = [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0]];
  let pasos = 0;
  for (const [dx, dy] of dirs) { if (q.terminada) break; q.hacer({ tipo: 'remar', dx, dy }); pasos++; }
  assert.equal(q.terminada, true);
  assert.equal(pasos, R.BRASAS_PASOS + 1, 'la remada que apaga, y después las de las brasas');
  // Con BRASAS_PASOS: 0, se apaga de golpe, como antes.
  const r = fija({ reglas: { BRASAS_PASOS: 0 } });
  r.estado.energia = 1;
  r.hacer({ tipo: 'remar', dx: 1, dy: 0 });
  assert.equal(r.terminada, true);
});

test('minijuego perfecto (bien: true): un poco más de lo mismo', () => {
  const R = require('../juego/nucleo/reglas.js');
  const p = fija();
  for (const [dx, dy] of [[1, 0], [1, 0], [1, 0], [1, 0], [0, -1]]) p.hacer({ tipo: 'remar', dx, dy });
  const lena = p.estado.recursos.lena;
  const ev = p.hacer({ tipo: 'juntar', bien: true });
  assert.equal(ev[0].extra, R.BIEN_JUNTAR);
  assert.equal(p.estado.recursos.lena, Math.min(R.RECURSOS_MAX.lena, lena + 2 + R.BIEN_JUNTAR));
  p.estado.energia = 2;
  p.hacer({ tipo: 'avivar', bien: true });
  assert.equal(p.estado.energia, 2 + R.AVIVAR + R.BIEN_AVIVAR);
});

test('las tres marcas del viaje', () => {
  const R = require('../juego/nucleo/reglas.js');
  const p = fija({ reglas: { GASTO_REMAR: 0, GASTO_NOCHE: 0, GASTO_LLUVIA: 0, GASTO_VIENTO_HONDO: 0 } });
  assert.ok(p.estado.limite > 0);
  assert.deepEqual(p.marcas().map((m) => m.logrado), [false, false, false]);
  p.estado.recursos.comida = R.MARCA_COMIDA;
  const d = p.estado.destino;
  for (const paso of MAPA.camino(p.estado.mapa, p.estado.canoa, (x, y) => Math.max(Math.abs(x - d.x), Math.abs(y - d.y)) <= 1)) p.hacer({ tipo: 'remar', dx: paso.x - p.estado.canoa.x, dy: paso.y - p.estado.canoa.y });
  assert.deepEqual(p.marcas(), [{ id: 'llegaron', logrado: true }, { id: 'comida', logrado: true }, { id: 'tiempo', logrado: true }]);
});

test('la ruta guarda el recorrido para la postal', () => {
  const p = fija();
  p.hacer({ tipo: 'remar', dx: 1, dy: 0 }); p.hacer({ tipo: 'remar', dx: 0, dy: -1 }); p.hacer({ tipo: 'remar', dx: 0, dy: -1 });
  assert.deepEqual(p.estado.ruta, [[2, 6], [3, 6], [3, 5]]); // (3, 4) es playa: no se movió
});

// ── Balance ───────────────────────────────────────────────────────────────
// Recursos de juego: si cambian los números de reglas.js, estas pruebas dicen
// si el viaje sigue siendo posible y si sigue haciendo falta juntar.
const T_PUEBLOS = require('../juego/nucleo/territorio/pueblos.js');
for (const destino of T_PUEBLOS.PUEBLOS.yagan.destinos) {
  test(`balance, destino «${destino}»: quien junta y acampa llega casi siempre; quien va derecho, no`, () => {
    const cuidadoso = BOTS.medir(BOTS.cuidadoso, 100, { destino });
    const directo = BOTS.medir(BOTS.directo, 100, { destino });
    console.log(`  ${destino}: cuidadoso ${Math.round(cuidadoso.tasa * 100)} %, directo ${Math.round(directo.tasa * 100)} %, ${Math.round(cuidadoso.pasos)} casillas`);
    assert.ok(cuidadoso.tasa >= 0.7, `el jugador cuidadoso llega solo el ${Math.round(cuidadoso.tasa * 100)} %`);
    assert.ok(directo.tasa <= 0.1, `yendo derecho sin juntar se llega el ${Math.round(directo.tasa * 100)} %: no hace falta el territorio`);
  });
}

test('demora: un minijuego que no salió gasta como remar, pasa el tiempo y no mueve la canoa', () => {
  const p = fija();
  const { x, y } = p.estado.canoa;
  const antes = p.estado.energia;
  const ev = p.hacer({ tipo: 'demora' });
  assert.equal(ev[0].tipo, 'demora');
  assert.deepEqual([p.estado.canoa.x, p.estado.canoa.y], [x, y], 'la canoa no se mueve');
  assert.ok(p.estado.energia < antes, 'el fuego gasta');
  assert.equal(p.estado.pasos, 0, 'no cuenta como casilla remada');
  // Si se repite, el fuego se apaga y el viaje termina.
  let fin = null;
  for (let i = 0; i < 40 && !fin; i++) fin = p.hacer({ tipo: 'demora' }).find((e) => e.tipo === 'fin') || null;
  assert.ok(fin && fin.gano === false, 'demorarse mucho apaga el fuego');
});

test('la noche termina sola: sin acampar, amanece', () => {
  const R = require('../juego/nucleo/reglas.js');
  const p = fija({ hora: 'noche', estacion: 'verano' });
  assert.equal(p.estado.hora, 'noche');
  const horas = [];
  for (let i = 0; i < R.HORA.normal.amanece - R.HORA.normal.noche && !p.terminada; i++) horas.push(...p.hacer({ tipo: 'demora' }).filter((e) => e.tipo === 'hora').map((e) => e.hora));
  assert.ok(p.terminada || horas.includes('dia'), 'después de la noche, amanece');
});
