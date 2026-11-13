/*
 * Tierra de los Humos · Narrador: el viaje contado en voz alta
 * ------------------------------------------------------------
 * Para jugar sin ver la pantalla (o viéndola poco). Describe lo que rodea a la
 * canoa en las cuatro direcciones, cuánto fuego queda, qué se puede hacer y
 * hacia dónde queda el destino. Después de cada acción cuenta lo que pasó.
 * Junto con el sonido según el lugar (sonido/juego.js), el viaje se puede
 * seguir con el oído.
 *
 * Lee el contrato del núcleo (juego/nucleo/partida.js): partida.estado y los
 * eventos de partida.hacer(). La voz es la del dispositivo (sonido/voz.js).
 *
 *   const narrador = TDH_NARRADOR.conectar(TDH_VOZ, { saberes: TDH_SABERES.SABERES });
 *   narrador.describir(partida.estado, partida.puede());     // por ejemplo, con la tecla D
 *   const eventos = partida.hacer(accion);
 *   narrador.tras(eventos, partida.estado, partida.puede()); // cuenta lo que pasó, en corto
 *
 * Las funciones describir, contar y alrededor no hablan: devuelven texto, y se
 * prueban con Node (pruebas/narrador.test.cjs). Sirven también para el texto
 * alternativo del mapa o para un lector de pantalla (aria-live).
 *
 * Norte es arriba en el mapa (en el motor Corteza la luz viene del norte).
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const DIRS = [['norte', 0, -1], ['este', 1, 0], ['sur', 0, 1], ['oeste', -1, 0]];
  const LUGAR = {
    '~': 'canal hondo', '-': 'canal', ',': 'agua baja', k: 'cachiyuyo', r: 'rocas',
    '.': 'playa', p: 'pradera', G: 'bosque de guindos', L: 'bosque de lengas', t: 'turbal', M: 'montaña',
  };
  const AGUA = '~-,kr';
  // Cómo se nombra cada cosa del mapa, con su artículo.
  const COSAS = {
    lena: 'leña', comida: 'comida', mejillones: 'mejillones', pescado: 'pescado', hongos: 'hongos de árbol', erizos: 'erizos', huevos: 'huevos',
    pirita: 'pirita', saber: 'un saber', choza: 'una choza', 'choza-conica': 'una choza', conchal: 'un conchal', 'guindo-grande': 'un guindo grande',
    'ballena-varada': 'la ballena varada', 'lobo-marino': 'un lobo marino', cormoran: 'un cormorán', 'pato-vapor': 'un pato vapor',
    pinguino: 'un pingüino', cauquen: 'un cauquén', gaviota: 'una gaviota', tonina: 'una tonina', ballena: 'una ballena',
  };
  const HORA = { dia: 'Es de día', tarde: 'Cae la tarde', noche: 'Es de noche' };
  const CLIMA = { calma: 'hay calma', viento: 'hay viento', lluvia: 'llueve', nieve: 'nieva' };

  const letra = (e, x, y) => (y >= 0 && y < e.mapa.length && x >= 0 && x < e.mapa[0].length ? e.mapa[y][x] : null);
  const visto = (e, x, y) => !e.explorado || e.explorado(x, y);
  const nombreDe = (o) => COSAS[o.junta || o.elemento || o.id] || COSAS[o.id] || null;
  const juntar = (lista) => lista.length <= 1 ? (lista[0] || '') : lista.slice(0, -1).join(', ') + ' y ' + lista[lista.length - 1];

  function cosasEn(e, x, y) {
    return (e.objetos || []).filter((o) => o.x === x && o.y === y).map(nombreDe).filter(Boolean);
  }

  /** Qué hay al lado de la canoa en cada dirección: [{ dir, lugar, cosas, agua, humo, borde }]. */
  function alrededor(e) {
    const c = e.canoa;
    return DIRS.map(([dir, dx, dy]) => {
      const x = c.x + dx, y = c.y + dy, l = letra(e, x, y);
      if (l == null) return { dir, borde: true, lugar: 'el borde del mapa', cosas: [], agua: false };
      if (!visto(e, x, y)) return { dir, humo: true, lugar: 'humo, sin explorar', cosas: [], agua: false };
      return { dir, lugar: LUGAR[l] || 'algo', cosas: cosasEn(e, x, y), agua: AGUA.indexOf(l) >= 0 && l !== 'r' };
    });
  }

  function frasesAlrededor(e, soloNotable) {
    return alrededor(e).filter((a) => !soloNotable || a.cosas.length || !a.agua).map((a) => {
      const con = a.cosas.length ? ' con ' + juntar(a.cosas) : '';
      return 'al ' + a.dir + ', ' + a.lugar + con;
    });
  }

  /** Hacia dónde queda el destino: «a 12 casillas hacia el este». */
  function rumbo(e) {
    if (!e.destino) return '';
    const dx = e.destino.x - e.canoa.x, dy = e.destino.y - e.canoa.y, d = Math.abs(dx) + Math.abs(dy);
    if (d === 0) return 'Llegaron a ' + (e.destino.nombre || 'destino') + '.';
    const ejes = [];
    if (dy < 0) ejes.push('norte'); if (dy > 0) ejes.push('sur');
    if (dx > 0) ejes.push('este'); if (dx < 0) ejes.push('oeste');
    const hacia = Math.abs(dx) >= Math.abs(dy) * 3 ? ejes[ejes.length - 1] : Math.abs(dy) >= Math.abs(dx) * 3 ? ejes[0] : ejes.join(' y ');
    return (e.destino.nombre ? 'Hasta ' + e.destino.nombre : 'Hasta el destino') + ' faltan ' + d + (d === 1 ? ' casilla' : ' casillas') + ', hacia el ' + hacia + '.';
  }

  const mayus = (t) => t.charAt(0).toUpperCase() + t.slice(1);

  /** La descripción completa: fuego, lo que se lleva, la hora, alrededor, lo que se puede hacer y el rumbo. */
  function describir(e, puede) {
    const r = e.recursos || {};
    const partes = ['Fuego ' + e.canoa.fuego + ' de 4.'];
    if (e.recursos) partes.push('Llevan ' + (r.lena || 0) + ' de leña y ' + (r.comida || 0) + ' de comida' + (r.pirita ? ', y pirita' : '') + '.');
    if (e.hora || e.clima) partes.push((HORA[e.hora] || 'Es de día') + ' y ' + (CLIMA[e.clima] || 'hay calma') + '.');
    partes.push(mayus(frasesAlrededor(e, false).join('; ')) + '.');
    const se = [];
    if (puede && puede.juntar) se.push('juntar ' + (COSAS[puede.juntar] || 'algo'));
    if (puede && puede.avivar) se.push('avivar el fuego');
    if (puede && puede.amarrar) se.push('amarrar y acampar');
    if (se.length) partes.push('Se puede ' + juntar(se) + '.');
    const ru = rumbo(e); if (ru) partes.push(ru);
    return partes.join(' ');
  }

  /** Lo que pasó después de una acción, en pocas palabras. */
  function contar(eventos, opciones) {
    const saberes = (opciones && opciones.saberes) || {};
    const frases = [];
    const lista = eventos || [];
    const conLena = lista.find((ev) => ev.tipo === 'fuego' && ev.motivo === 'lena');
    lista.forEach((ev) => {
      switch (ev.tipo) {
        case 'fuego':
          if (ev.motivo === 'lena') break; // lo dice «avivo»
          if (ev.despues !== ev.antes && ev.motivo === 'remar') frases.push(ev.despues === 0 ? 'El fuego se apagó.' : 'Fuego ' + ev.despues + ' de 4.');
          else if (ev.despues > ev.antes) frases.push('El fuego sube a ' + ev.despues + '.');
          break;
        case 'junto': frases.push('Juntaste ' + (ev.nombre || COSAS[ev.que] || ev.que) + '.'); break;
        case 'avivo': frases.push(conLena ? 'Avivaste el fuego: sube a ' + conLena.despues + '.' : 'Avivaste el fuego.'); break;
        case 'saber': { const c = saberes[ev.id]; frases.push('Un saber nuevo' + (c && c.titulo ? ': ' + c.titulo.replace(/<[^>]+>/g, '') : '') + '.'); break; }
        case 'reencendido': frases.push('Con la pirita, el fuego vuelve a prender.'); break;
        case 'acampe': frases.push('Amarraron en el cachiyuyo y pasaron la noche.'); break;
        case 'clima': frases.push(mayus(CLIMA[ev.clima] || 'cambia el tiempo') + '.'); break;
        case 'hora': frases.push((HORA[ev.hora] || 'Cambia la luz') + '.'); break;
        case 'fin': frases.push(ev.gano ? 'Llegaron con el fuego encendido.' : 'El viaje termina. Lo aprendido pasa a la generación siguiente.'); break;
        default: break;
      }
    });
    return frases.join(' ');
  }

  /** Después de remar: lo que pasó y, en corto, solo lo que hay de interesante alrededor. */
  function tras(eventos, e, puede, opciones) {
    const partes = [contar(eventos, opciones)];
    const fin = (eventos || []).some((ev) => ev.tipo === 'fin');
    if (!fin && e) {
      const notable = frasesAlrededor(e, true);
      if (notable.length) partes.push(mayus(notable.join('; ')) + '.');
      if (puede && puede.juntar) partes.push('Se puede juntar ' + (COSAS[puede.juntar] || 'algo') + '.');
      else if (puede && puede.amarrar) partes.push('Se puede amarrar.');
    }
    return partes.filter(Boolean).join(' ');
  }

  /** Conecta el narrador a una voz (TDH_VOZ). */
  function conectar(voz, opciones) {
    const op = opciones || {};
    let ultimo = '';
    const hablar = (t) => { if (t) { ultimo = t; if (voz && voz.disponible()) voz.leer(t, { velocidad: op.velocidad || 1.05 }); } return t; };
    return {
      describir(e, puede) { return hablar(describir(e, puede)); },
      tras(eventos, e, puede) { return hablar(tras(eventos, e, puede, op)); },
      repetir() { return hablar(ultimo); },
      callar() { if (voz) voz.detener(); },
    };
  }

  const api = { alrededor, describir, contar, tras, rumbo, conectar, COSAS, LUGAR };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_NARRADOR = api;
})(typeof window !== 'undefined' ? window : globalThis);
