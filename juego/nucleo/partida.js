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
 *     heredados  (+) ids que el linaje ya sabe. No vuelven a salir como carta y cada uno
 *                deja algo propio (REGLAS.HERENCIA, 19/11): más fuego, comida, ver a través del humo…
 *     estacion   (+) 'verano' | 'otono' | 'invierno' | 'primavera'. Sin ella, sale de la semilla.
 *     hora       (+) 'dia' | 'tarde' | 'noche' (para la luz real de Ushuaia). Sin ella, 'dia'.
 *     pueblo     (+) id de territorio/pueblos.js. Sin él, 'yagan'.
 *     destino    (+) id de territorio/destinos.js. Sin él, el motivo del viaje sale de la semilla
 *                y la estación entre los destinos del pueblo que no están en 'propuesta' (ver
 *                TDH_PARTIDA.elegirDestino). Si ninguno sirve, el ACTIVO.
 *     mapa       (+) 'fijo' para usar el mapa de la maqueta. Sin él, se genera con la semilla.
 *
 *   partida.estado   la forma que espera motor.escena de Corteza:
 *     { mapa, objetos, canoa: { x, y, fuego, mira, remando }, explorado, clima, estacion, hora, humos }
 *     (+) recursos: { lena, comida, pirita } (números), energia (0 a ENERGIA_MAX), pasos,
 *         brasas: null | pasos que les quedan con el fuego en 0 (19/11), herencia: [ids heredados con efecto],
 *         limite: remadas para la marca «a tiempo»,
 *         ruta: [[x, y], ...] (para la postal), aprendidos: [ids de este viaje],
 *         inicio, destino: { x, y, id, nombre }, gano, causa, pueblo,
 *         pronostico: null | { clima, faltan } (el cambio de tiempo que ya se anunció)
 *
 *   partida.hacer(accion)  →  lista de eventos, en orden. Acciones:
 *     { tipo: 'remar', dx, dy }   una casilla, sin diagonal. Contra la tierra o el borde: [].
 *     { tipo: 'juntar' }     (+)  lo que esté al lado de la canoa. Si no hay nada, o ya no entra: [].
 *     { tipo: 'avivar' }     (+)  gasta 1 leña. Sin leña o con el fuego lleno: [].
 *     { tipo: 'amarrar' }    (+)  en el cachiyuyo, al lado de una playa: pasan la noche.
 *     { tipo: 'demora' }     (+)  un minijuego no salió: pasa el tiempo y el fuego gasta como al remar,
 *                                 pero la canoa no se mueve. Evento: { tipo: 'demora' }. (18/11, B)
 *     (+) juntar, avivar y amarrar aceptan `bien: true` si el minijuego salió perfecto: suman un poco
 *         más (REGLAS.BIEN_*), y el evento lleva `extra`. (19/11)
 *
 *   Eventos:
 *     (+) { tipo: 'remo', x, y }      la canoa avanzó. Siempre es el primero al remar: así una
 *                          lista vacía quiere decir solo «no se puede remar hacia ahí».
 *     { tipo: 'fuego', antes, despues, motivo, causas }   el fuego cambió (0 a 4).
 *                          motivo: 'remar' | 'lena' | 'comida' | 'pirita' | (+) 'acampar'.
 *                          Al acampar sale uno solo, con lo que quedó entre comer y cuidar el
 *                          fuego toda la noche: 'comida' si subió, 'acampar' si bajó.
 *                          (+) causas, solo al remar: ['viento', 'lluvia', 'noche', 'cerca']
 *     { tipo: 'junto', que, nombre }  se juntó algo: que = id del elemento; (+) nombre, para el texto
 *     { tipo: 'saber', id }           se encontró un saber (id de datos/saberes.js)
 *     { tipo: 'fin', gano, causa, pasos, aprendidos }   terminó el viaje.
 *                          (+) causa: 'llegada' | 'remar' | 'viento' | 'lluvia' | 'noche'
 *                          ('noche' también si se apagó acampando, sin comida)
 *     (+) { tipo: 'avivo' }                      se gastó una leña en el fuego
 *     (+) { tipo: 'aviso', antes, clima, faltan } el tiempo va a cambiar en `faltan` pasos
 *                          («se ven nubes», «se levanta el viento»). Llega CLIMA_AVISO_PASOS antes
 *                          del evento 'clima'. Acampar lo cancela: pasa la noche y vuelve la calma.
 *     (+) { tipo: 'clima', antes, clima }        cambió el tiempo: 'calma' | 'viento' | 'lluvia'
 *     (+) { tipo: 'hora', antes, hora }          cayó la tarde, la noche o amaneció
 *     (+) { tipo: 'reencendido', con: 'pirita' } el fuego se apagó y volvió a prender
 *     (+) { tipo: 'brasas', quedan }             el fuego está en 0: quedan brasas por `quedan` pasos;
 *                          avivar (o comer al acampar) lo vuelve a prender. (19/11)
 *     (+) { tipo: 'acampe', comio }              pasaron la noche amarrados. Cuidar el fuego toda la
 *                          noche gasta GASTO_ACAMPAR; comer suma COMER_AL_ACAMPAR.
 *
 *   partida.puede()   (+) { juntar: id del elemento | null, avivar: bool, amarrar: bool }, para los botones.
 *   partida.camino(x, y)  (+) casillas por el agua hasta (x, y), o null. Para remar tocando lejos.
 *   partida.marcas()      (+) las tres marcas del viaje: [{ id: 'llegaron' | 'fuego' | 'tiempo', logrado }].
 *   partida.terminada     true cuando terminó el viaje.
 *
 *   TDH_PARTIDA.elegirDestino({ semilla, estacion, pueblo })  (+) el id del motivo del viaje que
 *     elegiría nueva() sin `destino`. Sirve para que la interfaz lo cuente antes de empezar.
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
  const estacionDe = (semilla, pedida) => (ESTACIONES.includes(pedida) ? pedida : AZAR.elegir(AZAR.crear(AZAR.derivar(semilla, 'estacion')), ESTACIONES));

  /**
   * El motivo del viaje (el nomadismo, docs/02-alcance-mvp.md). Entran los destinos del pueblo
   * que no están en 'propuesta' y que, si tienen `estaciones`, son de esta estación. Entre los
   * que quedan elige la semilla. Si no queda ninguno, el ACTIVO de destinos.js.
   * Qué destino pasa de 'propuesta' a 'borrador' lo decide la Persona C (territorio/destinos.js).
   */
  function elegirDestino(opciones) {
    const op = opciones || {};
    const semilla = op.semilla == null ? 1 : op.semilla;
    const estacion = estacionDe(semilla, op.estacion);
    const destinos = op.destinos || T_DESTINOS.DESTINOS;
    const p = T_PUEBLOS.PUEBLOS[op.pueblo || T_PUEBLOS.POR_DEFECTO];
    const candidatos = ((p && p.destinos) || Object.keys(destinos)).filter((id) => {
      const d = destinos[id];
      return d && d.estado !== 'propuesta' && (!d.estaciones || d.estaciones.includes(estacion));
    });
    if (!candidatos.length) return op.activo || T_DESTINOS.ACTIVO;
    if (candidatos.length === 1) return candidatos[0];
    return AZAR.elegir(AZAR.crear(AZAR.derivar(semilla, 'motivo')), candidatos);
  }

  function nueva(opciones) {
    const op = opciones || {};
    const R = Object.assign({}, REGLAS, op.reglas || {});
    const semilla = op.semilla == null ? 1 : op.semilla;
    const pueblo = op.pueblo || T_PUEBLOS.POR_DEFECTO;
    const estacion = estacionDe(semilla, op.estacion);
    const idDestino = op.destino || elegirDestino({ semilla, estacion, pueblo });
    const m = op.mapa === 'fijo' ? MAPA.fijo() : MAPA.generar(semilla, { pueblo, destino: idDestino });
    const destino = T_DESTINOS.DESTINOS[m.destino.id] || T_DESTINOS.DESTINOS[idDestino];
    const alClima = AZAR.crear(AZAR.derivar(semilla, 'clima'));      // el clima se consume jugando: su propia secuencia

    const catalogo = new Set(op.saberes || []);
    const heredados = new Set(op.heredados || []);
    const mostrados = new Set();
    const visto = new Set();
    let terminada = false;

    const DIA = estacion === 'invierno' ? R.HORA.invierno : R.HORA.normal;
    const horaDe = (p) => (p >= DIA.noche ? 'noche' : p >= DIA.tarde ? 'tarde' : 'dia');
    let pasosDelDia = op.hora === 'noche' ? DIA.noche : op.hora === 'tarde' ? DIA.tarde : 0;
    let pasosDelClima = 0;
    const fuegoDe = (e) => Math.ceil(e / R.ENERGIA_POR_FUEGO);
    // Lo que deja cada saber heredado (R.HERENCIA): solo los que el linaje sabe y tienen efecto.
    const herencia = [...heredados].filter((id) => R.HERENCIA && R.HERENCIA[id]);
    const deja = (campo) => herencia.map((id) => R.HERENCIA[id][campo]).filter((v) => v != null);
    const suma = (campo) => deja(campo).reduce((a, b) => a + b, 0);
    const energia = Math.min(R.ENERGIA_MAX, R.ENERGIA_INICIAL + heredados.size * R.ENERGIA_POR_HEREDADO + suma('energia'));
    const reenciende = Math.max(R.PIRITA_REENCIENDE, ...deja('pirita'));
    const ahorroChoza = deja('cerca').length ? Math.max(...deja('cerca')) : null;
    const sinVientoHondo = deja('viento').length > 0;

    const estado = {
      mapa: m.mapa,
      objetos: m.objetos,
      canoa: { x: m.inicio.x, y: m.inicio.y, fuego: fuegoDe(energia), mira: 1, remando: false },
      explorado: (x, y) => visto.has(x + ',' + y),
      clima: 'calma',
      estacion,
      hora: horaDe(pasosDelDia),
      humos: m.humos,
      recursos: Object.assign({}, R.RECURSOS_INICIALES, { comida: (R.RECURSOS_INICIALES.comida || 0) + suma('comida') }),
      energia,
      brasas: null,
      herencia,
      limite: null,
      pasos: 0,
      ruta: [[m.inicio.x, m.inicio.y]],
      aprendidos: [],
      inicio: m.inicio,
      destino: m.destino,
      gano: null,
      causa: null,
      pueblo,
      pronostico: null,
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

    // Lo heredado que se ve a través del humo: la casilla y las de al lado.
    const verCasilla = (x, y) => { for (const [dx, dy] of [[0, 0], ...V4]) visto.add((x + dx) + ',' + (y + dy)); };
    const ver = new Set(deja('ver'));
    if (ver.has('amarre')) {
      for (let y = 0; y < estado.mapa.length; y++) for (let x = 0; x < estado.mapa[0].length; x++) {
        if (estado.mapa[y][x] === 'k' && V4.some(([dx, dy]) => MAPA.letra(estado.mapa, x + dx, y + dy) === '.')) verCasilla(x, y);
      }
    }
    for (const o of estado.objetos) if (o.junta && ver.has(o.junta)) verCasilla(o.x, o.y);
    if (deja('destino').length) { const d = estado.destino; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) verCasilla(d.x + dx, d.y + dy); }

    // Marca «a tiempo»: llegar en no más de 1,6 veces el camino más corto (TDH_PARTIDA.marcas).
    {
      const d = estado.destino;
      const corto = MAPA.camino(estado.mapa, estado.canoa, (x, y) => Math.max(Math.abs(d.x - x), Math.abs(d.y - y)) <= 1);
      estado.limite = corto ? Math.ceil(corto.length * R.MARCA_TIEMPO) : null;
    }

    function cambiarEnergia(delta, motivo, eventos, causas) {
      const c = estado.canoa, antes = c.fuego;
      estado.energia = Math.max(0, Math.min(R.ENERGIA_MAX, estado.energia + delta));
      c.fuego = fuegoDe(estado.energia);
      if (estado.energia > 0) estado.brasas = null;   // de las brasas vuelve a prender
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
        const cuanto = el.id === 'choza' && ahorroChoza != null ? Math.max(el.cerca.ahorro, ahorroChoza) : el.cerca.ahorro;
        if (Math.max(Math.abs(o.x - c.x), Math.abs(o.y - c.y)) <= el.cerca.distancia) ahorro = Math.max(ahorro, cuanto);
      }
      return ahorro;
    }
    /** Lo que gasta un paso (remar o demora): base, más lo que pese, con tope, menos lo que ahorre la choza. */
    function gastoDe(causas, hondo) {
      let gasto = R.GASTO_REMAR;
      if (hondo && estado.clima === 'viento' && !sinVientoHondo) { gasto += R.GASTO_VIENTO_HONDO; causas.push('viento'); }
      if (estado.clima === 'lluvia') { gasto += R.GASTO_LLUVIA; causas.push('lluvia'); }
      if (estado.hora === 'noche') { gasto += R.GASTO_NOCHE; causas.push('noche'); }
      if (R.GASTO_TOPE != null) gasto = Math.min(gasto, R.GASTO_TOPE);
      const ahorro = ahorroCerca();
      if (ahorro) { gasto = Math.max(0, gasto - ahorro); causas.push('cerca'); }
      return gasto;
    }
    function pasarElTiempo(eventos) {
      const antes = estado.hora;
      pasosDelDia++;
      if (DIA.amanece && pasosDelDia >= DIA.amanece) pasosDelDia = 0;   // la noche también termina sin acampar (18/11)
      estado.hora = horaDe(pasosDelDia);
      if (estado.hora !== antes) eventos.push({ tipo: 'hora', antes, hora: estado.hora });
      pasosDelClima++;
      const pr = estado.pronostico;
      if (pr) {
        // Ya se anunció: cuando se cumple el plazo, cambia.
        if (--pr.faltan <= 0) cambiarClima(pr.clima, eventos);
        return;
      }
      if (pasosDelClima >= R.CLIMA_MIN_PASOS && alClima() < R.CLIMA_PROB_CAMBIO) {
        const siguiente = AZAR.ponderado(alClima, R.CLIMA_SIGUIENTE[estado.clima]);
        if (R.CLIMA_AVISO_PASOS > 0) {
          estado.pronostico = { clima: siguiente, faltan: R.CLIMA_AVISO_PASOS };
          eventos.push({ tipo: 'aviso', antes: estado.clima, clima: siguiente, faltan: R.CLIMA_AVISO_PASOS });
        } else cambiarClima(siguiente, eventos);
      }
    }
    function cambiarClima(clima, eventos) {
      const previo = estado.clima;
      estado.clima = clima;
      estado.pronostico = null;
      pasosDelClima = 0;
      eventos.push({ tipo: 'clima', antes: previo, clima });
    }
    /**
     * El fuego está en 0: la pirita lo vuelve a prender; si no hay, quedan brasas por
     * BRASAS_PASOS pasos (cada paso en brasas consume una). Sin brasas, termina el viaje.
     * Devuelve true si terminó.
     */
    function sinFuego(causa, eventos) {
      if (estado.energia > 0) return false;
      if (estado.recursos.pirita > 0) {
        estado.recursos.pirita--;
        eventos.push({ tipo: 'reencendido', con: 'pirita' });
        cambiarEnergia(reenciende, 'pirita', eventos);
        return false;
      }
      if (estado.brasas == null && R.BRASAS_PASOS > 0) {
        estado.brasas = R.BRASAS_PASOS;
        eventos.push({ tipo: 'brasas', quedan: estado.brasas });
        return false;
      }
      if (estado.brasas != null && --estado.brasas > 0) {
        eventos.push({ tipo: 'brasas', quedan: estado.brasas });
        return false;
      }
      terminar(false, causa, eventos);
      return true;
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
      const gasto = gastoDe(causas, letra(nx, ny) === '~');
      cambiarEnergia(-gasto, 'remar', eventos, causas);
      pasarElTiempo(eventos);

      // Si se apaga, la causa es lo que más pesó en el último paso.
      if (sinFuego(['noche', 'lluvia', 'viento'].find((k) => causas.includes(k)) || 'remar', eventos)) return eventos;
      const d = estado.destino;
      if (Math.max(Math.abs(d.x - nx), Math.abs(d.y - ny)) <= 1) {
        saber(destino && destino.carta, eventos);
        terminar(true, 'llegada', eventos);
      }
      return eventos;
    }

    /** `bien`: el minijuego salió perfecto; suma BIEN_JUNTAR de lo mismo (hasta el máximo). */
    function juntar(bien) {
      const o = juntable();
      if (!o) return [];
      const el = ELEMENTO(o), eventos = [];
      if (el.queda) delete o.junta;                    // el dibujo queda en el mapa (un árbol): solo se junta una vez
      else estado.objetos.splice(estado.objetos.indexOf(o), 1);
      const ev = { tipo: 'junto', que: el.id, nombre: el.nombre };
      eventos.push(ev);
      const ef = el.efecto;
      if (ef && ef.tipo === 'sumar') {
        const max = R.RECURSOS_MAX[ef.recurso];
        const extra = bien && ef.recurso !== 'pirita' ? R.BIEN_JUNTAR : 0;
        if (extra) ev.extra = extra;
        estado.recursos[ef.recurso] = Math.min(max == null ? Infinity : max, (estado.recursos[ef.recurso] || 0) + ef.cantidad + extra);
      }
      saber(el.carta, eventos);
      return eventos;
    }

    function avivar(bien) {
      const r = estado.recursos;
      if (r.lena <= 0 || estado.energia >= R.ENERGIA_MAX) return [];
      const eventos = [bien ? { tipo: 'avivo', extra: R.BIEN_AVIVAR } : { tipo: 'avivo' }];
      r.lena--;
      cambiarEnergia(R.AVIVAR + (bien ? R.BIEN_AVIVAR : 0), 'lena', eventos);
      return eventos;
    }

    /** Un minijuego no salió (interfaz): se les fue el tiempo. Gasta como remar, sin moverse. */
    function demora() {
      const eventos = [{ tipo: 'demora' }];
      const causas = [];
      cambiarEnergia(-gastoDe(causas, false), 'demora', eventos, causas);
      pasarElTiempo(eventos);
      sinFuego(['noche', 'lluvia'].find((k) => causas.includes(k)) || 'remar', eventos);
      return eventos;
    }

    function amarrar(bien) {
      if (!puedeAmarrar()) return [];
      const r = estado.recursos, comio = r.comida > 0;
      const eventos = [bien ? { tipo: 'acampe', comio, extra: R.BIEN_AMARRAR } : { tipo: 'acampe', comio }];
      saber('amarre', eventos);
      // Acampar no es gratis: cuidar el fuego toda la noche gasta. Comer lo compensa.
      if (comio) r.comida--;
      const delta = (comio ? R.COMER_AL_ACAMPAR : 0) - Math.max(0, R.GASTO_ACAMPAR - (bien ? R.BIEN_AMARRAR : 0));
      if (delta) cambiarEnergia(delta, delta > 0 ? 'comida' : 'acampar', eventos);
      // En brasas y sin comida, la noche entera las apaga (sin pirita).
      if (estado.energia <= 0 && estado.brasas != null && estado.recursos.pirita <= 0) { terminar(false, 'noche', eventos); return eventos; }
      if (sinFuego('noche', eventos)) return eventos;
      if (estado.hora !== 'dia') { eventos.push({ tipo: 'hora', antes: estado.hora, hora: 'dia' }); estado.hora = 'dia'; }
      pasosDelDia = 0;
      estado.pronostico = null;           // lo anunciado pasó durante la noche
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
          case 'juntar': return juntar(!!accion.bien);
          case 'avivar': return avivar(!!accion.bien);
          case 'amarrar': return amarrar(!!accion.bien);
          case 'demora': return demora();
          default: return [];
        }
      },
      puede() {
        if (terminada) return { juntar: null, avivar: false, amarrar: false };
        const o = juntable();
        return { juntar: o ? o.junta : null, avivar: estado.recursos.lena > 0 && estado.energia < R.ENERGIA_MAX, amarrar: puedeAmarrar() };
      },
      /**
       * Las tres marcas del viaje (19/11), para el final: [{ id, logrado }].
       *   llegaron: llegar al destino · fuego: llegar con el fuego en 3 o más ·
       *   tiempo: llegar en `estado.limite` remadas o menos (1,6 veces el camino más corto).
       */
      marcas() {
        const g = estado.gano === true;
        return [
          { id: 'llegaron', logrado: g },
          { id: 'comida', logrado: g && estado.recursos.comida >= R.MARCA_COMIDA },
          { id: 'tiempo', logrado: g && estado.limite != null && estado.pasos <= estado.limite },
        ];
      },
      /** @returns {Casilla[] | null} */
      camino(x, y) {
        return MAPA.camino(estado.mapa, estado.canoa, (a, b) => a === x && b === y);
      },
    };
  }

  const api = { nueva, elegirDestino, ESTACIONES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_PARTIDA = api;
})(typeof window !== 'undefined' ? window : globalThis);
