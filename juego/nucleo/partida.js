/*
 * Tierra de los Humos · Núcleo del juego: la partida (un viaje)
 * -------------------------------------------------------------
 * Sin DOM ni localStorage: solo reglas. La interfaz (juego/interfaz/) dibuja
 * partida.estado con Corteza y muestra los eventos. Se prueba con Node
 * (pruebas/nucleo-*.test.cjs).
 *
 * El núcleo no sabe nada de cultura ni de historia: qué hay en el territorio,
 * dónde va, qué hace y de qué fuente sale está en juego/nucleo/territorio/.
 * Los números están en juego/nucleo/reglas.js. Son recursos de juego, no datos.
 *
 * Contrato: el de la partida falsa (pruebas/partida-falsa.js), ampliado sin
 * romperlo. Lo nuevo está marcado con (+).
 *
 *   const partida = TDH_PARTIDA.nueva({ semilla, saberes, heredados, estacion, hora, pueblo, destino, mapa });
 *     semilla:   número. Misma semilla, misma partida (mapa, clima, todo).
 *     saberes:   ids de las cartas que se pueden encontrar (el catálogo del pueblo, p. ej. ORDEN).
 *     heredados  (+) ids que el linaje ya sabe. No vuelven a salir como carta y dan
 *                +1 de energía inicial cada uno (como en la versión de mesa).
 *     estacion   (+) 'verano' | 'otono' | 'invierno' | 'primavera'. Sin ella, sale de la semilla.
 *     hora       (+) 'dia' | 'tarde' | 'noche' (para la luz real de Ushuaia). Sin ella, 'dia'.
 *     pueblo     (+) id de territorio/pueblos.js. Sin él, 'yagan'.
 *     destino    (+) id de territorio/destinos.js. Sin él, el ACTIVO.
 *     mapa       (+) 'fijo' para usar el mapa de la maqueta. Sin él, se genera con la semilla.
 *
 *   partida.estado   la forma que espera motor.escena de Corteza:
 *     { mapa, objetos, canoa: { x, y, fuego, mira, remando }, explorado, clima, estacion, hora, humos }
 *     (+) recursos: { lena, comida, pirita } (números), energia (0 a 16), pasos,
 *         ruta: [[x, y], ...] (para la postal), aprendidos: [ids de este viaje],
 *         inicio, destino: { x, y, id, nombre }, gano, causa, pueblo
 *
 *   partida.hacer(accion)  →  lista de eventos, en orden. Acciones:
 *     { tipo: 'remar', dx, dy }   una casilla, sin diagonal. Contra la tierra o el borde: [].
 *     { tipo: 'juntar' }     (+)  lo que esté al lado de la canoa. Si no hay nada, o ya no entra: [].
 *     { tipo: 'avivar' }     (+)  gasta 1 leña. Sin leña o con el fuego lleno: [].
 *     { tipo: 'amarrar' }    (+)  en el cachiyuyo, al lado de una playa: pasan la noche.
 *
 *   Eventos:
 *     (+) { tipo: 'remo', x, y }      la canoa avanzó. Siempre es el primero al remar: así una
 *                          lista vacía quiere decir solo «no se puede remar hacia ahí».
 *     { tipo: 'fuego', antes, despues, motivo, causas }   el fuego cambió (0 a 4).
 *                          motivo: 'remar' | 'lena' | 'comida' | 'pirita'.
 *                          (+) causas, solo al remar: ['viento', 'lluvia', 'noche', 'cerca']
 *     { tipo: 'junto', que, nombre }  se juntó algo: que = id del elemento; (+) nombre, para el texto
 *     { tipo: 'saber', id }           se encontró un saber (id de datos/saberes.js)
 *     { tipo: 'fin', gano, causa, pasos, aprendidos }   terminó el viaje.
 *                          (+) causa: 'llegada' | 'remar' | 'viento' | 'lluvia' | 'noche'
 *     (+) { tipo: 'avivo' }                      se gastó una leña en el fuego
 *     (+) { tipo: 'clima', antes, clima }        cambió el tiempo: 'calma' | 'viento' | 'lluvia'
 *     (+) { tipo: 'hora', antes, hora }          cayó la tarde, la noche o amaneció
 *     (+) { tipo: 'reencendido', con: 'pirita' } el fuego se apagó y volvió a prender
 *     (+) { tipo: 'acampe', comio }              pasaron la noche amarrados
 *
 *   partida.puede()   (+) { juntar: id del elemento | null, avivar: bool, amarrar: bool }, para los botones.
 *   partida.camino(x, y)  (+) casillas por el agua hasta (x, y), o null. Para remar tocando lejos.
 *   partida.terminada     true cuando terminó el viaje.
 *
 * Los textos que ve la persona los pone la interfaz: el núcleo solo dice qué pasó.
 *
 * Sin DOM: anda en el navegador (global TDH_PARTIDA) y en Node (require).
 * Licencia: MIT.
 */

/**
 * @typedef {{ x: number, y: number }} Casilla
 * @typedef {{ id: string, x: number, y: number, elemento?: string, junta?: string, meta?: boolean }} Objeto
 * @typedef {{ tipo: 'remar', dx: number, dy: number } | { tipo: 'juntar' } | { tipo: 'avivar' } | { tipo: 'amarrar' }} Accion
 * @typedef {{ tipo: string, [campo: string]: any }} Evento
 */
(function (raiz) {
  'use strict';
  const pedir = (ruta) => (typeof require === 'function' ? require(ruta) : null);
  const AZAR = raiz.TDH_AZAR || pedir('./azar.js');
  const REGLAS = raiz.TDH_REGLAS || pedir('./reglas.js');
  const MAPA = raiz.TDH_MAPA || pedir('./mapa.js');
  const T_ELEMENTOS = raiz.TDH_ELEMENTOS || pedir('./territorio/elementos.js');
  const T_DESTINOS = raiz.TDH_DESTINOS || pedir('./territorio/destinos.js');
  const T_PUEBLOS = raiz.TDH_PUEBLOS || pedir('./territorio/pueblos.js');

  const ESTACIONES = ['verano', 'otono', 'invierno', 'primavera'];
  const V4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const ELEMENTO = (o) => (o && (o.junta || o.elemento) ? T_ELEMENTOS.ELEMENTOS[o.junta || o.elemento] : null);

  function nueva(opciones) {
    const op = opciones || {};
    const R = Object.assign({}, REGLAS, op.reglas || {});
    const semilla = op.semilla == null ? 1 : op.semilla;
    const pueblo = op.pueblo || T_PUEBLOS.POR_DEFECTO;
    const idDestino = op.destino || T_DESTINOS.ACTIVO;
    const m = op.mapa === 'fijo' ? MAPA.fijo() : MAPA.generar(semilla, { pueblo, destino: idDestino });
    const destino = T_DESTINOS.DESTINOS[m.destino.id] || T_DESTINOS.DESTINOS[idDestino];
    const alClima = AZAR.crear(AZAR.derivar(semilla, 'clima'));      // el clima se consume jugando: su propia secuencia

    const catalogo = new Set(op.saberes || []);
    const heredados = new Set(op.heredados || []);
    const mostrados = new Set();
    const visto = new Set();
    let terminada = false;

    const estacion = ESTACIONES.includes(op.estacion) ? op.estacion : AZAR.elegir(AZAR.crear(AZAR.derivar(semilla, 'estacion')), ESTACIONES);
    const DIA = estacion === 'invierno' ? R.HORA.invierno : R.HORA.normal;
    const horaDe = (p) => (p >= DIA.noche ? 'noche' : p >= DIA.tarde ? 'tarde' : 'dia');
    let pasosDelDia = op.hora === 'noche' ? DIA.noche : op.hora === 'tarde' ? DIA.tarde : 0;
    let pasosDelClima = 0;
    const fuegoDe = (e) => Math.ceil(e / R.ENERGIA_POR_FUEGO);
    const energia = Math.min(R.ENERGIA_MAX, R.ENERGIA_INICIAL + heredados.size * R.ENERGIA_POR_HEREDADO);

    const estado = {
      mapa: m.mapa,
      objetos: m.objetos,
      canoa: { x: m.inicio.x, y: m.inicio.y, fuego: fuegoDe(energia), mira: 1, remando: false },
      explorado: (x, y) => visto.has(x + ',' + y),
      clima: 'calma',
      estacion,
      hora: horaDe(pasosDelDia),
      humos: m.humos,
      recursos: Object.assign({}, R.RECURSOS_INICIALES),
      energia,
      pasos: 0,
      ruta: [[m.inicio.x, m.inicio.y]],
      aprendidos: [],
      inicio: m.inicio,
      destino: m.destino,
      gano: null,
      causa: null,
      pueblo,
      semilla,
      mapaFijo: !!m.fijo,
    };

    // ── Ayudas ─────────────────────────────────────────────────────────────
    function revelar(cx, cy) {
      for (let y = 0; y < estado.mapa.length; y++) for (let x = 0; x < estado.mapa[0].length; x++) {
        const dx = (x - cx) / R.REVELAR_RX, dy = (y - cy) / R.REVELAR_RY;
        if (dx * dx + dy * dy < 1) visto.add(x + ',' + y);
      }
    }
    revelar(estado.canoa.x, estado.canoa.y);

    function cambiarEnergia(delta, motivo, eventos, causas) {
      const c = estado.canoa, antes = c.fuego;
      estado.energia = Math.max(0, Math.min(R.ENERGIA_MAX, estado.energia + delta));
      c.fuego = fuegoDe(estado.energia);
      if (c.fuego !== antes) {
        const ev = { tipo: 'fuego', antes, despues: c.fuego, motivo };
        if (causas) ev.causas = causas;
        eventos.push(ev);
      }
    }
    function saber(id, eventos) {
      if (!id || !catalogo.has(id) || heredados.has(id) || mostrados.has(id)) return;
      mostrados.add(id);
      estado.aprendidos.push(id);
      eventos.push({ tipo: 'saber', id });
    }
    function terminar(gano, causa, eventos) {
      terminada = true;
      estado.gano = gano;
      estado.causa = causa;
      eventos.push({ tipo: 'fin', gano, causa, pasos: estado.pasos, aprendidos: estado.aprendidos.slice() });
    }
    const letra = (x, y) => MAPA.letra(estado.mapa, x, y);
    const alLado = (o) => { const c = estado.canoa; return Math.abs(o.x - c.x) + Math.abs(o.y - c.y) <= 1; };
    /** ¿Entra lo que da este elemento? Con el máximo, se deja en el mapa. */
    function entra(el) {
      const ef = el && el.efecto;
      if (!ef || ef.tipo !== 'sumar') return true;
      const max = R.RECURSOS_MAX[ef.recurso];
      return max == null || estado.recursos[ef.recurso] < max;
    }
    const juntable = () => estado.objetos.find((o) => o.junta && alLado(o) && entra(ELEMENTO(o))) || null;
    const puedeAmarrar = () => { const c = estado.canoa; return letra(c.x, c.y) === 'k' && V4.some(([dx, dy]) => letra(c.x + dx, c.y + dy) === '.'); };
    /** Lo que se ahorra por estar cerca de algo (la choza). Si hay varias cosas cerca, vale la mayor. */
    function ahorroCerca() {
      const c = estado.canoa;
      let ahorro = 0;
      for (const o of estado.objetos) {
        const el = ELEMENTO(o);
        if (!el || !el.cerca || o.id !== el.dibujo) continue;
        if (Math.max(Math.abs(o.x - c.x), Math.abs(o.y - c.y)) <= el.cerca.distancia) ahorro = Math.max(ahorro, el.cerca.ahorro);
      }
      return ahorro;
    }
    function pasarElTiempo(eventos) {
      const antes = estado.hora;
      pasosDelDia++;
      estado.hora = horaDe(pasosDelDia);
      if (estado.hora !== antes) eventos.push({ tipo: 'hora', antes, hora: estado.hora });
      pasosDelClima++;
      if (pasosDelClima >= R.CLIMA_MIN_PASOS && alClima() < R.CLIMA_PROB_CAMBIO) {
        const previo = estado.clima;
        estado.clima = AZAR.ponderado(alClima, R.CLIMA_SIGUIENTE[previo]);
        pasosDelClima = 0;
        eventos.push({ tipo: 'clima', antes: previo, clima: estado.clima });
      }
    }

    // ── Acciones ───────────────────────────────────────────────────────────
    function remar(dx, dy) {
      if (dx && dy) dy = 0;               // sin diagonal
      if (!dx && !dy) return [];
      const c = estado.canoa, nx = c.x + dx, ny = c.y + dy;
      if (!MAPA.navegable(estado.mapa, nx, ny)) return [];
      const eventos = [{ tipo: 'remo', x: nx, y: ny }];   // siempre: [] queda solo para «no se puede»
      if (dx) c.mira = dx;
      c.x = nx; c.y = ny;
      estado.pasos++;
      estado.ruta.push([nx, ny]);
      revelar(nx, ny);
      saber('fuego', eventos);            // la primera carta: el fuego viaja en la canoa

      // El fuego se gasta: más con viento en el canal hondo, con lluvia y de noche; menos cerca de una choza.
      const causas = [];
      let gasto = R.GASTO_REMAR;
      if (estado.clima === 'viento' && letra(nx, ny) === '~') { gasto += R.GASTO_VIENTO_HONDO; causas.push('viento'); }
      if (estado.clima === 'lluvia') { gasto += R.GASTO_LLUVIA; causas.push('lluvia'); }
      if (estado.hora === 'noche') { gasto += R.GASTO_NOCHE; causas.push('noche'); }
      const ahorro = ahorroCerca();
      if (ahorro) { gasto = Math.max(0, gasto - ahorro); causas.push('cerca'); }
      cambiarEnergia(-gasto, 'remar', eventos, causas);
      pasarElTiempo(eventos);

      if (estado.energia === 0) {
        if (estado.recursos.pirita > 0) {
          estado.recursos.pirita--;
          eventos.push({ tipo: 'reencendido', con: 'pirita' });
          cambiarEnergia(R.PIRITA_REENCIENDE, 'pirita', eventos);
        } else {
          // La causa es lo que más pesó en el último paso.
          const causa = ['noche', 'lluvia', 'viento'].find((k) => causas.includes(k)) || 'remar';
          terminar(false, causa, eventos);
          return eventos;
        }
      }
      const d = estado.destino;
      if (Math.max(Math.abs(d.x - nx), Math.abs(d.y - ny)) <= 1) {
        saber(destino && destino.carta, eventos);
        terminar(true, 'llegada', eventos);
      }
      return eventos;
    }

    function juntar() {
      const o = juntable();
      if (!o) return [];
      const el = ELEMENTO(o), eventos = [];
      if (el.queda) delete o.junta;                    // el dibujo queda en el mapa (un árbol): solo se junta una vez
      else estado.objetos.splice(estado.objetos.indexOf(o), 1);
      eventos.push({ tipo: 'junto', que: el.id, nombre: el.nombre });
      const ef = el.efecto;
      if (ef && ef.tipo === 'sumar') {
        const max = R.RECURSOS_MAX[ef.recurso];
        estado.recursos[ef.recurso] = Math.min(max == null ? Infinity : max, (estado.recursos[ef.recurso] || 0) + ef.cantidad);
      }
      saber(el.carta, eventos);
      return eventos;
    }

    function avivar() {
      const r = estado.recursos;
      if (r.lena <= 0 || estado.energia >= R.ENERGIA_MAX) return [];
      const eventos = [{ tipo: 'avivo' }];
      r.lena--;
      cambiarEnergia(R.AVIVAR, 'lena', eventos);
      return eventos;
    }

    function amarrar() {
      if (!puedeAmarrar()) return [];
      const r = estado.recursos, comio = r.comida > 0;
      const eventos = [{ tipo: 'acampe', comio }];
      saber('amarre', eventos);
      if (comio) { r.comida--; cambiarEnergia(R.COMER_AL_ACAMPAR, 'comida', eventos); }
      if (estado.hora !== 'dia') { eventos.push({ tipo: 'hora', antes: estado.hora, hora: 'dia' }); estado.hora = 'dia'; }
      pasosDelDia = 0;
      if (estado.clima !== 'calma') { eventos.push({ tipo: 'clima', antes: estado.clima, clima: 'calma' }); estado.clima = 'calma'; }
      pasosDelClima = 0;
      return eventos;
    }

    return {
      estado,
      get terminada() { return terminada; },
      /** @param {Accion} accion @returns {Evento[]} */
      hacer(accion) {
        if (terminada || !accion) return [];
        switch (accion.tipo) {
          case 'remar': return remar(Math.sign(accion.dx || 0), Math.sign(accion.dy || 0));
          case 'juntar': return juntar();
          case 'avivar': return avivar();
          case 'amarrar': return amarrar();
          default: return [];
        }
      },
      puede() {
        if (terminada) return { juntar: null, avivar: false, amarrar: false };
        const o = juntable();
        return { juntar: o ? o.junta : null, avivar: estado.recursos.lena > 0 && estado.energia < R.ENERGIA_MAX, amarrar: puedeAmarrar() };
      },
      /** @returns {Casilla[] | null} */
      camino(x, y) {
        return MAPA.camino(estado.mapa, estado.canoa, (a, b) => a === x && b === y);
      },
    };
  }

  const api = { nueva, ESTACIONES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_PARTIDA = api;
})(typeof window !== 'undefined' ? window : globalThis);
