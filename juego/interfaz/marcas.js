/*
 * Tierra de los Humos · Las tres marcas del viaje (19/11)
 * -------------------------------------------------------
 * Cada viaje tiene tres marcas, que decide el núcleo (partida.marcas()):
 *   llegaron · comida (llegar con comida para compartir) · tiempo (llegar a tiempo).
 * Acá se guarda la mejor de la familia para cada destino, en el dispositivo, y se
 * dice cuáles se lograron por primera vez. Es un reto propio: no cambia el viaje.
 *
 *   const marcas = TDH_MARCAS.crear(localStorage);
 *   const r = marcas.anotar('yagan', 'ballena', partida.marcas());
 *   // → { marcas: [{ id, logrado, nueva }], mejor: 0 a 3 }
 *   TDH_MARCAS.nombre('tiempo', partida.estado)   // «A tiempo (46 remadas)»
 *
 * Si no hay almacenamiento, anda igual mientras la página está abierta.
 * Sin DOM: se prueba con Node (pruebas/marcas.test.cjs). Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const CLAVE = 'tdh-marcas';
  const pedir = (ruta) => (typeof require === 'function' ? require(ruta) : null);
  const REGLAS = raiz.TDH_REGLAS || pedir('../nucleo/reglas.js') || {};

  function nombre(id, estado) {
    if (id === 'llegaron') return 'Llegaron';
    if (id === 'comida') return 'Con ' + (REGLAS.MARCA_COMIDA || 3) + ' de comida';
    if (id === 'tiempo') return 'A tiempo' + (estado && estado.limite ? ' (' + estado.limite + ' remadas)' : '');
    return id;
  }

  function crear(almacen) {
    let memoria = {};
    function leerTodo() {
      try { const t = almacen && almacen.getItem(CLAVE); if (t) return JSON.parse(t) || {}; } catch (e) { /* roto: de cero */ }
      return memoria;
    }
    function guardar(todo) {
      memoria = todo;
      try { if (almacen) almacen.setItem(CLAVE, JSON.stringify(todo)); } catch (e) { /* queda en memoria */ }
    }
    return {
      /** Lo mejor de la familia por destino: { destino: ['llegaron', 'comida', …] }. */
      leer(pueblo) { const t = leerTodo()[pueblo]; return t && typeof t === 'object' ? t : {}; },
      anotar(pueblo, destino, marcas) {
        const todo = leerTodo();
        const delPueblo = todo[pueblo] && typeof todo[pueblo] === 'object' ? todo[pueblo] : {};
        const antes = new Set(Array.isArray(delPueblo[destino]) ? delPueblo[destino] : []);
        const lista = (marcas || []).map((m) => ({ id: m.id, logrado: !!m.logrado, nueva: !!m.logrado && !antes.has(m.id) }));
        for (const m of lista) if (m.logrado) antes.add(m.id);
        delPueblo[destino] = [...antes];
        todo[pueblo] = delPueblo;
        guardar(todo);
        return { marcas: lista, mejor: antes.size };
      },
    };
  }

  const api = { crear, nombre };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_MARCAS = api;
})(typeof window !== 'undefined' ? window : globalThis);
