/**
 * Crónica del viaje (Persona B, 18/11).
 *
 * Al terminar, un párrafo corto cuenta lo que pasó en la partida: la estación, lo que
 * juntaron, el tiempo, las noches amarradas y cómo terminó. Solo cuenta la partida
 * (que es ficción): no agrega datos culturales, así que no lleva fuente.
 *
 *   const texto = TDH_CRONICA.armar(eventosDelViaje, partida.estado, { apagado });
 *
 * `eventosDelViaje` son todos los eventos que devolvió partida.hacer en ese viaje, en orden.
 * Sin DOM: se prueba con node --test (pruebas/cronica.test.cjs). Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const ESTACION = { verano: 'en verano', otono: 'en otoño', invierno: 'en invierno', primavera: 'en primavera' };
  const NUM = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  const veces = (n) => (n === 1 ? 'una vez' : (NUM[n] || n) + ' veces');
  const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  /** «a», «a y b», «a, b y c» */
  function lista(cosas) {
    if (cosas.length <= 1) return cosas.join('');
    return cosas.slice(0, -1).join(', ') + ' y ' + cosas[cosas.length - 1];
  }

  function armar(eventos, estado, opciones) {
    const ev = eventos || [], e = estado || {}, op = opciones || {};
    const contar = (tipo, filtro) => ev.filter((x) => x.tipo === tipo && (!filtro || filtro(x))).length;
    const frases = [];

    frases.push('La familia salió ' + (ESTACION[e.estacion] || '') + ' con el fuego encendido en la canoa.');

    const avivo = contar('avivo');
    const pasos = e.pasos || 0;
    if (pasos) frases.push('Remaron ' + (pasos === 1 ? 'una casilla' : pasos + ' casillas') + (avivo ? ' y avivaron el fuego ' + veces(avivo) : '') + '.');
    else frases.push('No llegaron a alejarse de la orilla' + (avivo ? ', pero avivaron el fuego ' + veces(avivo) : '') + '.');

    // Lo que juntaron, en el orden en que apareció, con cuántas veces si fue más de una.
    const juntado = new Map();
    for (const x of ev) if (x.tipo === 'junto' && x.nombre) juntado.set(x.nombre, (juntado.get(x.nombre) || 0) + 1);
    if (juntado.size) frases.push('Juntaron ' + lista([...juntado].map(([n, k]) => (k > 1 ? n + ' ' + veces(k) : n))) + '.');
    else frases.push('No llegaron a juntar nada.');

    const demoras = contar('demora');
    if (demoras) frases.push(demoras === 1 ? 'Una vez algo no salió y se les fue el tiempo.' : mayus(NUM[demoras] || String(demoras)) + ' veces algo no salió y se les fue el tiempo.');

    const climas = [];
    if (contar('clima', (x) => x.clima === 'viento')) climas.push('el viento');
    if (contar('clima', (x) => x.clima === 'lluvia')) climas.push('la lluvia');
    if (climas.length) frases.push('En el camino los ' + (climas.length > 1 ? 'agarraron ' : 'agarró ') + lista(climas) + '.');

    const noches = ev.filter((x) => x.tipo === 'acampe');
    if (noches.length) {
      const sinComer = noches.filter((x) => !x.comio).length;
      frases.push('Pasaron ' + (noches.length === 1 ? 'una noche' : (NUM[noches.length] || noches.length) + ' noches') + ' amarrados en el cachiyuyo' +
        (sinComer ? (noches.length === 1 ? ', sin comida' : ', ' + (sinComer === 1 ? 'una' : NUM[sinComer] || sinComer) + ' sin comida') : '') + '.');
    } else if (contar('hora', (x) => x.hora === 'noche')) frases.push('Remaron de noche, con frío.');

    const pirita = contar('reencendido');
    if (pirita) frases.push('La pirita volvió a prender el fuego ' + veces(pirita) + '.');

    // Las brasas (19/11): cada vez que el fuego quedó en 0 y lo salvaron a tiempo.
    const enBrasas = ev.filter((x) => x.tipo === 'brasas');
    const entrada = enBrasas.length ? Math.max(...enBrasas.map((x) => x.quedan)) : 0;   // el primer aviso de cada vez
    const salvadas = enBrasas.filter((x) => x.quedan === entrada).length - (e.gano === false && e.brasas != null ? 1 : 0);
    if (salvadas > 0) frases.push((salvadas === 1 ? 'Una vez' : mayus(veces(salvadas))) + ' el fuego quedó en brasas y lo salvaron.');
    const perfectos = ev.filter((x) => x.extra).length;
    if (perfectos) frases.push(mayus(veces(perfectos)) + ' les salió perfecto.');

    if (e.gano) frases.push('Llegaron a ' + (e.destino && e.destino.nombre ? e.destino.nombre : 'destino') + ' con el fuego encendido.');
    else frases.push('El fuego se apagó' + (op.apagado ? ' ' + op.apagado : '') + '. Pero lo aprendido no se pierde.');

    return frases.join(' ');
  }

  const api = { armar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_CRONICA = api;
})(typeof window !== 'undefined' ? window : globalThis);
