/*
 * Tierra de los Humos · La herencia entre partidas
 * ------------------------------------------------
 * Lo que aprendió cada generación pasa a la siguiente, aunque se cierre el
 * navegador. Se guarda en localStorage, separado por pueblo: los saberes se
 * heredan dentro de cada pueblo, no entre pueblos (equipo/memory.md, 9/11).
 *
 * Qué se guarda (decisión del 13/11): solo los `id` de las cartas, con un
 * número de versión. Los textos de las cartas no se guardan: salen siempre de
 * datos/saberes.js, así una corrección de la comunidad llega a todos.
 *
 *   const herencia = TDH_HERENCIA.crear(localStorage, { catalogo: TDH_SABERES.SABERES });
 *   herencia.leer('yagan')          // { generacion: 1, saberes: [], viajes: 0, llegadas: 0 }
 *   herencia.cerrarViaje('yagan', ['fuego', 'amarre'], { gano: false })
 *                                   // suma lo aprendido y pasa a la generación siguiente
 *   herencia.borrar('yagan')        // empezar de cero (pide confirmación la interfaz)
 *
 * Si no hay almacenamiento (modo privado, bloqueado), funciona igual mientras
 * la página está abierta: lo guarda en memoria. Si lo guardado está roto o es
 * de otra versión, empieza de cero en vez de romper el juego. Los id que ya no
 * existen en el catálogo (una carta que se sacó) se descartan al leer.
 *
 * Sin DOM: anda en el navegador (global TDH_HERENCIA) y en Node (require).
 * Se prueba en pruebas/herencia.test.cjs. Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const CLAVE = 'tdh-herencia';
  const VERSION = 1;

  function vacio() { return { generacion: 1, saberes: [], viajes: 0, llegadas: 0 }; }

  /** Un almacén en memoria con la misma forma que localStorage. */
  function enMemoria() {
    const datos = new Map();
    return {
      getItem: (k) => (datos.has(k) ? datos.get(k) : null),
      setItem: (k, v) => { datos.set(k, String(v)); },
      removeItem: (k) => { datos.delete(k); },
    };
  }

  function crear(almacen, opciones) {
    const op = opciones || {};
    const catalogo = op.catalogo || null;
    let guardado = almacen || null;
    const memoria = enMemoria();
    // Si el almacén tira error (bloqueado o lleno), se sigue en memoria.
    function getItem(k) { try { return guardado ? guardado.getItem(k) : memoria.getItem(k); } catch (e) { guardado = null; return memoria.getItem(k); } }
    function setItem(k, v) { memoria.setItem(k, v); try { if (guardado) guardado.setItem(k, v); } catch (e) { guardado = null; } }

    function todo() {
      let d = null;
      try { d = JSON.parse(getItem(CLAVE) || 'null'); } catch (e) { d = null; }
      if (!d || d.version !== VERSION || typeof d.pueblos !== 'object' || !d.pueblos) return { version: VERSION, pueblos: {} };
      return d;
    }
    function limpiar(p) {
      const r = vacio();
      if (!p || typeof p !== 'object') return r;
      if (Number.isInteger(p.generacion) && p.generacion >= 1) r.generacion = p.generacion;
      if (Number.isInteger(p.viajes) && p.viajes >= 0) r.viajes = p.viajes;
      if (Number.isInteger(p.llegadas) && p.llegadas >= 0) r.llegadas = p.llegadas;
      const ids = Array.isArray(p.saberes) ? p.saberes.filter((id) => typeof id === 'string') : [];
      r.saberes = [...new Set(ids)].filter((id) => !catalogo || Object.prototype.hasOwnProperty.call(catalogo, id));
      return r;
    }

    const api = {
      VERSION,
      CLAVE,
      /** Lo que sabe el linaje de ese pueblo y en qué generación va. */
      leer(pueblo) { return limpiar(todo().pueblos[pueblo]); },
      /** Termina el viaje: suma lo aprendido y pasa a la generación siguiente. Devuelve el nuevo estado. */
      cerrarViaje(pueblo, aprendidos, info) {
        const d = todo();
        const p = limpiar(d.pueblos[pueblo]);
        const nuevos = (aprendidos || []).filter((id) => typeof id === 'string' && (!catalogo || Object.prototype.hasOwnProperty.call(catalogo, id)));
        p.saberes = [...new Set(p.saberes.concat(nuevos))];
        p.generacion += 1;
        p.viajes += 1;
        if (info && info.gano) p.llegadas += 1;
        d.pueblos[pueblo] = p;
        setItem(CLAVE, JSON.stringify(d));
        return p;
      },
      /** Empezar de cero con ese pueblo. */
      borrar(pueblo) {
        const d = todo();
        delete d.pueblos[pueblo];
        setItem(CLAVE, JSON.stringify(d));
        return vacio();
      },
      /** true si se guarda de verdad (y no solo mientras la página está abierta). */
      get persistente() { return !!guardado; },
    };
    return api;
  }

  const api = { crear, enMemoria, VERSION, CLAVE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_HERENCIA = api;
})(typeof window !== 'undefined' ? window : globalThis);
