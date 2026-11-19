/*
 * Tierra de los Humos · Minijuegos en tierra (19/11)
 * --------------------------------------------------
 * Cuatro maneras de jugar, una por cosa que se junta en la costa. Las usa
 * minijuegos.js: cada una recibe `c` (la escena, el tiempo, ganar, perder…) y
 * devuelve { mover(s, dt), tecla(e, baja), auto(s, dt) }.
 *
 *   arrastrar (leña)        llevar cada rama hasta la canoa. Teclado: Tab y Enter.
 *   mantener  (mejillones)  mantener apretado hasta despegarlo; si sube el agua, esperar.
 *                           Teclado: Tab y mantener la barra espaciadora.
 *   memoria   (hongos)      mirar dónde están; después las hojas los tapan. Teclado: Tab y Enter.
 *   frotar    (pirita)      frotar la arena hasta destapar las dos doradas.
 *                           Teclado: flechas para mover la mano, que va frotando.
 *
 * `auto` juega solo, por los mismos caminos que una persona (para las pruebas y el video).
 * La mecánica es recurso de juego. Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const M = {};
  const ESPACIO = (e) => e.key === ' ' || e.key === 'Enter';

  // ── Arrastrar: la leña hasta la canoa ──────────────────────────────────────
  M.arrastrar = function (c) {
    const j = c.j, zona = { x0: 0.6, x1: 0.95, y0: 0.72, y1: 1 };
    const centro = { x: (zona.x0 + zona.x1) / 2, y: (zona.y0 + zona.y1) / 2 };
    const destino = c.crear('div', 'mj__destino', c.escena);
    Object.assign(destino.style, { left: zona.x0 * 100 + '%', top: zona.y0 * 100 + '%', width: (zona.x1 - zona.x0) * 100 + '%', height: (zona.y1 - zona.y0) * 100 + '%' });
    c.crear('span', null, destino, 'canoa');
    let llevadas = 0, agarrada = null, auto = null;
    const poner = (b, x, y) => { b.style.left = x * 100 + '%'; b.style.top = y * 100 + '%'; };
    const enLaCanoa = (q) => q.x >= zona.x0 - 0.04 && q.y >= zona.y0 - 0.1;
    function llevar(b) {
      if (b.disabled || c.terminado) return;
      b.disabled = true; b.classList.remove('arrastrando'); poner(b, centro.x, centro.y); b.classList.add('juntado');
      llevadas++; c.empezo(); c.contar(llevadas, j.cantidad);
      if (llevadas >= j.cantidad) c.ganar(); else c.sonar('lena');
    }
    const cosas = c.lugares().map((p) => {
      const b = c.cosa(j.objeto, p, 'Llevar una rama a la canoa');
      b.dataset.x = p.x; b.dataset.y = p.y;
      b.addEventListener('pointerdown', (e) => {
        if (c.terminado || b.disabled) return;
        e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (x) { /* nada */ }
        agarrada = b; b.classList.add('arrastrando');
      });
      b.addEventListener('pointermove', (e) => { if (agarrada === b) { const q = c.pos(e); poner(b, q.x, q.y); } });
      const soltar = (e) => {
        if (agarrada !== b) return;
        agarrada = null; b.classList.remove('arrastrando');
        if (enLaCanoa(c.pos(e))) llevar(b);
        else { poner(b, +b.dataset.x, +b.dataset.y); c.decir('Soltala sobre la canoa.'); }
      };
      b.addEventListener('pointerup', soltar);
      b.addEventListener('pointercancel', soltar);
      // Con el teclado (Enter), el clic llega sin puntero (detail 0): la rama va sola a la canoa.
      b.addEventListener('click', (e) => { if (e.detail === 0) llevar(b); });
      return b;
    });
    c.contar(0, j.cantidad);
    c.enfocar(cosas);
    return {
      auto(s, dt) {
        if (!auto) { const b = cosas.find((x) => !x.disabled); if (!b) return; auto = { b, k: 0, x: +b.dataset.x, y: +b.dataset.y }; b.classList.add('arrastrando'); }
        auto.k = Math.min(1, auto.k + dt * 2.5);
        poner(auto.b, auto.x + (centro.x - auto.x) * auto.k, auto.y + (centro.y - auto.y) * auto.k);
        if (auto.k >= 1) { llevar(auto.b); auto = null; }
      },
    };
  };

  // ── Mantener: despegar los mejillones con la marea baja ────────────────────
  M.mantener = function (c) {
    const j = c.j, TIEMPO = 0.75 * c.velocidad;   // con racha, hay que mantener un poco más
    const marea = c.crear('div', 'mj__marea', c.escena);
    let juntados = 0, apretado = null, auto = null;   // apretado: { b, t }
    function soltar(b) {
      if (!apretado || (b && apretado.b !== b)) return;
      if (apretado.t < TIEMPO && !c.terminado) c.decir('Mantené un poco más.');
      apretado.b.style.setProperty('--p', 0); apretado = null;
    }
    function apretar(b) { if (!c.terminado && !b.disabled && !b.classList.contains('juntado')) { apretado = { b, t: 0 }; c.empezo(); } }
    const cosas = c.lugares().map((p) => {
      const b = c.cosa(j.objeto, p, 'Un mejillón: mantené apretado para despegarlo');
      b.dataset.y = p.y;
      c.crear('span', 'mj__anillo', b);
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); apretar(b); });
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => soltar(b));
      b.addEventListener('click', (e) => e.preventDefault());
      return b;
    });
    c.contar(0, j.cantidad);
    c.enfocar(cosas);
    const tapado = (b, alta) => alta && Number(b.dataset.y) > c.LINEA_MAREA;
    return {
      tecla(e, baja) {
        if (!ESPACIO(e)) return false;
        const b = document.activeElement;
        if (!cosas.includes(b)) return false;
        if (baja) { if (!e.repeat) apretar(b); } else soltar(b);
        return true;
      },
      mover(s, dt) {
        const alta = !c.reducido && c.mareaAlta(s * c.velocidad);
        marea.classList.toggle('alta', alta);
        for (const b of cosas) {
          if (b.classList.contains('juntado')) continue;
          const t = tapado(b, alta); b.disabled = t; b.classList.toggle('tapado', t);
        }
        if (!apretado) return;
        if (apretado.b.disabled) { apretado.b.style.setProperty('--p', 0); apretado = null; c.error('¡Subió el agua! Esperá a que baje.'); return; }
        apretado.t += dt;
        apretado.b.style.setProperty('--p', Math.min(1, apretado.t / TIEMPO));
        if (apretado.t >= TIEMPO) {
          const b = apretado.b; apretado = null;
          b.disabled = true; b.classList.add('juntado'); juntados++; c.contar(juntados, j.cantidad);
          if (juntados >= j.cantidad) c.ganar(); else c.sonar('comida');
        }
      },
      auto(s) {
        if (apretado) return;
        // Una persona atenta: los de arriba siempre; los de abajo, solo si la marea no va a subir enseguida.
        const ciclo = (s * c.velocidad) % 4.5;
        const b = cosas.find((x) => !x.disabled && !x.classList.contains('juntado') && (Number(x.dataset.y) <= c.LINEA_MAREA || ciclo < 2));
        if (b) apretar(b);
      },
    };
  };

  // ── Memoria: dónde estaban los hongos ──────────────────────────────────────
  M.memoria = function (c) {
    const j = c.j, MIRAR = (c.reducido ? 2.8 : 1.9) / c.velocidad;
    const lista = c.lugares(j.cantidad + (j.vacios || 0));
    let fase = 'mirar', encontrados = 0, errores = 0, desde = 0;
    const cosas = lista.map((p, i) => {
      const es = i < j.cantidad;
      const b = c.cosa(es ? j.objeto : null, p, 'Una rama del árbol');
      b.dataset.es = es ? '1' : '';
      if (!es) b.classList.add('vacio');
      c.crear('span', 'mj__hoja', b);
      b.disabled = true;
      b.addEventListener('click', () => {
        if (fase !== 'buscar' || c.terminado || b.disabled) return;
        b.disabled = true; b.classList.remove('cubierto');
        if (es) {
          encontrados++; b.classList.add('juntado'); c.contar(encontrados, j.cantidad);
          if (encontrados >= j.cantidad) c.ganar(); else c.sonar('comida');
        } else {
          errores++; b.classList.add('sacude'); c.error(errores >= 3 ? '' : 'Ahí no había. ' + (3 - errores === 1 ? 'Queda 1 error.' : 'Quedan ' + (3 - errores) + ' errores.'));
          if (errores >= 3) c.perder('Se confundieron de árbol.');
        }
      });
      return b;
    });
    c.decir('Mirá bien…');
    return {
      mover(s) {
        if (fase !== 'mirar' || s < MIRAR) return;
        fase = 'buscar'; desde = s; c.relojDesde(s);
        for (const b of cosas) { b.classList.add('cubierto'); b.classList.remove('vacio'); b.disabled = false; b.setAttribute('aria-label', 'Una hoja: ¿hay un hongo abajo?'); }
        c.decir('¿Dónde estaban?');
        c.enfocar(cosas);
      },
      auto(s) {
        if (fase !== 'buscar' || s - desde < 0.4) return;
        const b = cosas.find((x) => x.dataset.es && !x.disabled);
        if (b) { desde = s; b.click(); }
      },
    };
  };

  // ── Frotar: las piedras de fuego bajo la arena ─────────────────────────────
  M.frotar = function (c) {
    const j = c.j, banda = j.arena || [Math.max(0, j.banda[0] - 0.12), Math.min(1, j.banda[1] + 0.12)];   // la arena tapa solo la playa
    const lista = c.lugares(j.cantidad + (j.piedras || 0));
    const oros = [];
    lista.forEach((p, i) => {
      if (i < j.cantidad) {
        const o = c.crear('span', 'mj__oro', c.escena); o.style.left = p.x * 100 + '%'; o.style.top = p.y * 100 + '%';
        const im = c.crear('img', null, o); im.src = c.imagen(j.objeto); im.alt = '';
        oros.push({ o, p, toques: 0, listo: false });
      } else {
        const g = c.crear('span', 'mj__piedra', c.escena); g.style.left = p.x * 100 + '%'; g.style.top = p.y * 100 + '%';
      }
    });
    const lienzo = c.crear('canvas', 'mj__arena', c.escena);
    lienzo.style.top = banda[0] * 100 + '%'; lienzo.style.height = (banda[1] - banda[0]) * 100 + '%';
    lienzo.setAttribute('role', 'img'); lienzo.setAttribute('aria-label', 'Arena de la playa: frotala para destapar lo que hay abajo');
    const mano = c.crear('span', 'mj__mano', c.escena);
    const caja = c.escena.getBoundingClientRect();
    const dpr = Math.min(2, raiz.devicePixelRatio || 1);
    lienzo.width = Math.max(100, Math.round(caja.width * dpr)); lienzo.height = Math.max(60, Math.round(caja.height * (banda[1] - banda[0]) * dpr));
    const x = lienzo.getContext('2d');
    // La arena: color de playa de la paleta, con granitos.
    x.fillStyle = '#b3a78f'; x.fillRect(0, 0, lienzo.width, lienzo.height);
    for (let i = 0; i < 260; i++) { x.fillStyle = i % 3 ? '#8f897f' : '#e7ddcb'; x.fillRect(c.r() * lienzo.width, c.r() * lienzo.height, 2 * dpr, 2 * dpr); }
    x.globalCompositeOperation = 'destination-out';
    let encontradas = 0, frotando = false, ultimo = null, cursor = { x: 0.5, y: (banda[0] + banda[1]) / 2 }, auto = null;
    const R = 0.065;   // el radio del dedo, en fracción del ancho
    function frotar(q) {
      const a = ultimo || q, pasos = Math.max(1, Math.ceil(Math.hypot(q.x - a.x, (q.y - a.y) * 0.6) / (R / 3)));
      for (let i = 1; i <= pasos; i++) {
        const px = a.x + (q.x - a.x) * i / pasos, py = a.y + (q.y - a.y) * i / pasos;
        x.beginPath(); x.arc(px * lienzo.width, (py - banda[0]) / (banda[1] - banda[0]) * lienzo.height, R * lienzo.width, 0, Math.PI * 2); x.fill();
        for (const g of oros) {
          if (g.listo || Math.hypot(g.p.x - px, (g.p.y - py) * 0.6) > R * 0.9) continue;
          if (++g.toques >= 5) {
            g.listo = true; g.o.classList.add('encontrada'); encontradas++; c.contar(encontradas, j.cantidad);
            if (encontradas >= j.cantidad) c.ganar(); else c.sonar('chispa');
          }
        }
      }
      ultimo = q; c.empezo();
    }
    lienzo.addEventListener('pointerdown', (e) => { e.preventDefault(); frotando = true; ultimo = null; try { lienzo.setPointerCapture(e.pointerId); } catch (z) { /* nada */ } frotar(c.pos(e)); });
    lienzo.addEventListener('pointermove', (e) => { if (frotando && !c.terminado) frotar(c.pos(e)); });
    for (const ev of ['pointerup', 'pointercancel']) lienzo.addEventListener(ev, () => { frotando = false; ultimo = null; });
    lienzo.tabIndex = 0;
    lienzo.addEventListener('focus', () => mano.classList.add('visible'));
    lienzo.addEventListener('blur', () => mano.classList.remove('visible'));
    const ponerMano = () => { mano.style.left = cursor.x * 100 + '%'; mano.style.top = cursor.y * 100 + '%'; };
    ponerMano();
    c.contar(0, j.cantidad);
    setTimeout(() => lienzo.focus({ preventScroll: true }), 30);
    return {
      tecla(e, baja) {
        const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (!d && !ESPACIO(e)) return false;
        if (!baja) return true;
        ultimo = { x: cursor.x, y: cursor.y };
        if (d) { cursor.x = Math.max(0, Math.min(1, cursor.x + d[0] * 0.05)); cursor.y = Math.max(banda[0], Math.min(banda[1], cursor.y + d[1] * 0.06)); }
        ponerMano(); frotar({ x: cursor.x, y: cursor.y }); ultimo = null;
        return true;
      },
      auto(s, dt) {
        const g = oros.find((o) => !o.listo); if (!g) return;
        if (!auto || auto.g !== g) auto = { g, k: 0 };
        auto.k += dt * 8;
        frotar({ x: g.p.x + Math.cos(auto.k) * R * 0.5, y: g.p.y + Math.sin(auto.k) * R * 0.5 });
      },
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = M;
  else raiz.TDH_MJ_MECANICAS = Object.assign(raiz.TDH_MJ_MECANICAS || {}, M);
})(typeof window !== 'undefined' ? window : globalThis);
