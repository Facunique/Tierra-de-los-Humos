/*
 * Tierra de los Humos · Fuentes en corto (19/11)
 * ----------------------------------------------
 * En las cartas del juego, la fuente va en corto: autor, año y página.
 *   «Cooper, J. M. (1946). «The Yahgan». Handbook…, vol. 1, p. 84 y 99. Vargas Filgueira, Víctor (2019). Mi sangre yagán…, p. 16-17 del visor del PDF.»
 *   → «Cooper (1946), p. 84 y 99; Vargas Filgueira (2019), p. 16-17»
 * La referencia completa de cada obra va una sola vez, al final del códice (obras()).
 * Los datos no cambian: siguen enteros en datos/saberes.js y en territorio/destinos.js,
 * y así salen en las cartas para imprimir y en la guía para docentes.
 *
 *   TDH_FUENTE.corta(fuente)          // texto corto
 *   TDH_FUENTE.obras([fuente, …])     // ['Cooper, J. M. (1946). «The Yahgan». …', …] sin repetir
 *
 * Si no entiende una fuente, la deja como está (nunca la borra).
 * Sin DOM: se prueba con Node (pruebas/fuente.test.cjs). Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  // Donde empieza cada obra: «Apellido[ Apellido], Nombre (año)», al principio, después de un punto o de dos puntos.
  const OBRA = /(?:^|[.:]\s)([A-ZÁÉÍÓÚ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚ][a-záéíóúñ]+)?), [^()]{0,20}\((\d{4})\)/g;
  const PAGINA = /\bpp?\. ?(\d+(?:\s*(?:[-–,]|y)\s*\d+)*)/;
  const limpio = (f) => String(f || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  /** Las obras de una fuente: [{ autor, anio, pagina, entrevista, completa }]. */
  function partes(fuente) {
    const t = limpio(fuente), marcas = [];
    let m;
    OBRA.lastIndex = 0;
    while ((m = OBRA.exec(t))) marcas.push({ m, desde: m.index + m[0].indexOf(m[1]) });
    return marcas.map(({ m, desde }, i) => {
      const tramo = t.slice(desde, i + 1 < marcas.length ? marcas[i + 1].desde : t.length);
      const p = tramo.match(PAGINA), entrevista = /entrevista/i.test(tramo);
      const anio = tramo.indexOf(')') + 1;   // después del «(año)»
      const resto = tramo.slice(anio).search(entrevista ? /\s\(|,\s*confirmada/ : /,?\s*pp?\. ?\d/);
      const visor = /visor del PDF/.test(tramo) ? ' Páginas del visor del PDF.' : '';
      const completa = (resto >= 0 ? tramo.slice(0, anio + resto) : tramo).replace(/[\s.,;:]+$/, '') + '.' + visor;
      return { autor: m[1], anio: m[2], pagina: p ? p[1].replace(/\s+/g, ' ') : null, entrevista, completa };
    });
  }

  function corta(fuente) {
    const l = partes(fuente);
    if (!l.length) return limpio(fuente);
    const vistos = new Set();
    return l.map((o) => o.autor + ' (' + o.anio + ')' + (o.entrevista ? ', entrevista' : o.pagina ? ', p. ' + o.pagina : ''))
      .filter((x) => (vistos.has(x) ? false : vistos.add(x))).join('; ');
  }

  function obras(fuentes) {
    const vistas = new Map();
    for (const f of fuentes || []) for (const o of partes(f)) {
      const clave = o.autor + o.anio + (o.entrevista ? 'e' : '');
      // Si la misma obra aparece citada más larga en otra carta, queda la más completa.
      if (!vistas.has(clave) || vistas.get(clave).length < o.completa.length) vistas.set(clave, o.completa);
    }
    return [...vistas.values()].sort((a, b) => a.localeCompare(b, 'es'));
  }

  const api = { corta, obras, partes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_FUENTE = api;
})(typeof window !== 'undefined' ? window : globalThis);
