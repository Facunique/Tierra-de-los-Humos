/*
 * Tierra de los Humos · Minijuegos: juntar, pescar, avivar y amarrar con las manos
 * -------------------------------------------------------------------------------
 * Antes de juntar algo, avivar el fuego o amarrar la canoa, se juega un momento
 * corto. Para juntar en la costa, la familia baja a tierra; para pescar, avivar
 * y amarrar, se queda en la canoa. Si sale bien, la acción se hace igual que
 * antes (el núcleo no cambia: mismos números, mismas reglas). Si no sale, se
 * puede probar de nuevo o volver al viaje, y no se pierde nada.
 *
 * Hay dos clases de minijuego:
 *  - «juntar»: tocar lo que se junta (ramas, mejillones, hongos, piedras de fuego)
 *    antes de que se haga tarde. Cada cosa es un botón: anda con el dedo, el mouse
 *    o el teclado (Tab y Enter).
 *  - «tiempo»: tocar «¡Ahora!» (o la barra espaciadora) cuando la marca pasa por la zona.
 *
 * Cada minijuego dice qué dato de las fuentes lo acompaña (el mismo que las cartas
 * de datos/saberes.js y los elementos de juego/nucleo/territorio/elementos.js).
 * La mecánica (el tiempo, la marea que sube, la marca que va y viene) es recurso
 * de juego y lo dice en pantalla.
 *
 * Uso (juego/interfaz/juego.js):
 *   if (TDH_MINIJUEGOS.cual('juntar', 'mejillones')) {
 *     const ok = await TDH_MINIJUEGOS.jugar('juntar', 'mejillones', { estacion, altoContraste, reducido });
 *     if (ok) partida.hacer({ tipo: 'juntar' });
 *   }
 *
 * Con movimiento reducido no hay apuro: el tiempo no se acaba y la marca va más lenta.
 * Para las pruebas: TDH_MINIJUEGOS.abierto() y TDH_MINIJUEGOS.ganar().
 * La lógica sin pantalla (cual, marcaEn, dentro, lugares) se prueba con Node:
 * pruebas/minijuegos.test.cjs.
 *
 * Licencia: MIT (el código); CC BY-SA 4.0 (los textos).
 */
(function (raiz) {
  'use strict';

  // Escenas de fondo, en las letras del motor Corteza (arte/corteza/corteza.js).
  const ESCENAS = {
    playa: ['GGLGGGLGGG', 'GLGGLGGGLG', '..........', '..........', ',,,,,,,,,,', '----------'],
    bosque: ['GGLGGLGGLG', 'GLGGGLGGLG', 'GGLGLGGGLG', '..........', ',,,,,,,,,,', '----------'],
    orilla: ['GGLGGGLGGG', '..........', '..........', '..........', ',,r,,,,r,,', '----------'],
    canal: ['GGLGGGLGGG', '..........', ',,,,,,,,,,', '----------', '----------', '~~~~~~~~~~'],
    cachiyuyo: ['GGLGGGLGGG', '..........', ',,,,,,,,,,', '--kkk-----', '----------', '~~~~~~~~~~'],
  };

  /**
   * Los minijuegos. `banda` es la franja de la escena donde aparecen las cosas (en
   * fracciones del alto: arriba 0, abajo 1). `dato` repite, en corto y con redacción
   * directa, lo que dicen las cartas (sin fórmulas sobre el autor: decisión de C del 14/11);
   * la atribución va en `fuente`. null si no hay una cita yagán específica.
   */
  const JUEGOS = {
    lena: {
      modo: 'juntar', tierra: true, escena: 'playa', objeto: 'lena', cantidad: 3, segundos: 10, banda: [0.36, 0.62],
      titulo: 'Bajan a tierra a juntar leña',
      pide: 'Tocá tres ramas antes de que se haga tarde.',
      dato: null,
    },
    mejillones: {
      modo: 'juntar', tierra: true, escena: 'orilla', objeto: 'mejillones', cantidad: 4, segundos: 13, banda: [0.4, 0.74], marea: true,
      titulo: 'Bajan a tierra con la marea baja',
      pide: 'Juntá cuatro mejillones a mano. Cuando el agua vuelve a subir, esperá a que baje.',
      dato: 'La marea baja permite recolectar mariscos en la costa. El mejillón se junta a mano.',
      fuente: 'Vargas Filgueira (2019), pp. 30 y 44 del visor del PDF; Cooper (1946), p. 84.',
    },
    hongos: {
      modo: 'juntar', tierra: true, escena: 'bosque', objeto: 'hongos', cantidad: 3, segundos: 10, banda: [0.08, 0.46],
      titulo: 'Bajan a tierra, al borde del bosque',
      pide: 'Juntá tres hongos de los árboles.',
      dato: 'Los hongos de los árboles complementan los alimentos durante un invierno difícil.',
      fuente: 'Vargas Filgueira (2019), p. 54 del visor del PDF.',
    },
    pirita: {
      modo: 'juntar', tierra: true, escena: 'playa', objeto: 'pirita', cantidad: 2, segundos: 12, banda: [0.3, 0.7], piedras: 5,
      titulo: 'Bajan a tierra a buscar piedras de fuego',
      pide: 'Encontrá las dos piedras de fuego, las doradas, entre las piedras de la playa.',
      dato: 'La pirita se usa junto con el pedernal para encender el fuego.',
      fuente: 'Cooper (1946), pp. 91 y 95.',
    },
    pescado: {
      modo: 'tiempo', tierra: false, escena: 'canal', objeto: 'pescado', intentos: 3, ancho: 0.2, vueltas: 0.42,
      titulo: 'Pescar desde la canoa',
      pide: 'La carnada va atada en un lazo, sin anzuelo. Cuando el pez llegue a la carnada, levantá la línea.',
      boton: 'Levantar la línea', zonaNombre: 'carnada',
      dato: 'La pesca con línea no usa anzuelo: la carnada va en un lazo y el pez se toma con la mano.',
      fuente: 'Cooper (1946), pp. 84 y 96.',
    },
    avivar: {
      modo: 'tiempo', tierra: false, escena: 'canal', objeto: 'lena', intentos: 3, ancho: 0.26, vueltas: 0.5,
      titulo: 'Avivar el fuego',
      pide: 'Sumá la leña cuando la llama esté baja, sin ahogarla.',
      boton: 'Sumar la leña', zonaNombre: 'llama baja',
      dato: 'El fuego se lleva encendido en la canoa.',
      fuente: 'Vargas Filgueira (2019), p. 33 del visor del PDF.',
    },
    amarrar: {
      modo: 'tiempo', tierra: false, escena: 'cachiyuyo', objeto: 'canoa', intentos: 3, ancho: 0.24, vueltas: 0.38,
      titulo: 'Amarrar en el cachiyuyo',
      pide: 'Cuando la canoa pase sobre el cachiyuyo, amarrala.',
      boton: 'Amarrar', zonaNombre: 'cachiyuyo',
      dato: 'Para detenerse, la canoa se amarra en bancos de grandes algas marinas, fuera de la orilla.',
      fuente: 'Cooper (1946), p. 88 (paginación impresa).',
    },
  };
  const RECURSO = 'El minijuego es recurso de juego: el tiempo, la marea que sube y la marca que va y viene no salen de las fuentes.';

  /** Qué minijuego va antes de una acción, o null si no hay (por ejemplo, un saber). */
  function cual(tipo, que) {
    if (tipo === 'avivar' || tipo === 'amarrar') return JUEGOS[tipo];
    if (tipo === 'juntar' && que && que !== 'avivar' && que !== 'amarrar') return JUEGOS[que] || null;
    return null;
  }

  /** La marca va y viene entre 0 y 1: `vueltas` idas por segundo. */
  function marcaEn(segundos, vueltas) {
    const f = (segundos * vueltas) % 2;
    return f < 1 ? f : 2 - f;
  }
  const dentro = (pos, zona) => pos >= zona.desde && pos <= zona.hasta;

  /** Un azar con semilla (para que las pruebas den siempre lo mismo). */
  function azar(semilla) {
    let s = (semilla >>> 0) || 1;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  /** Dónde va la zona de una marca: en el medio de la pista, nunca pegada a un borde. */
  function zonaDe(j, r) {
    const desde = 0.2 + r() * (0.6 - j.ancho);
    return { desde, hasta: desde + j.ancho };
  }

  /**
   * Dónde aparecen las cosas para juntar (en fracciones del ancho y del alto), sin
   * pisarse entre sí. Las primeras `cantidad` son las que se juntan; el resto, piedras.
   */
  function lugares(j, r) {
    const total = j.cantidad + (j.piedras || 0), lista = [];
    for (let i = 0; i < total; i++) {
      let p, prueba = 0;
      do {
        p = { x: 0.08 + r() * 0.84, y: j.banda[0] + r() * (j.banda[1] - j.banda[0]) };
        prueba++;
      } while (prueba < 200 && lista.some((q) => Math.abs(q.x - p.x) < 0.17 && Math.abs(q.y - p.y) < 0.2));
      lista.push(p);
    }
    return lista;
  }

  /** ¿La marea tapa ahora la parte de abajo? Sube 1,4 s de cada 4,5 s. */
  const mareaAlta = (segundos) => (segundos % 4.5) > 3.1;
  const LINEA_MAREA = 0.62; // lo que está más abajo que esto queda tapado con la marea alta

  // ── Pantalla ──────────────────────────────────────────────────────────────
  const ESTILO = `
.mj { position: fixed; inset: 0; z-index: 40; display: flex; align-items: center; justify-content: center; padding: 12px; background: rgba(11, 16, 21, 0.72); }
.mj__papel { width: min(640px, 100%); max-height: 100%; overflow: auto; padding: 16px 16px 14px; color: var(--tdh-tinta, #28221e); }
.mj__sub { margin: 0; font: 700 13px/1.2 "Atkinson Hyperlegible", system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--tdh-ocre, #973a25); }
.mj h2 { margin: 4px 0 6px; font-size: 22px; line-height: 1.15; }
.mj__pide { margin: 0 0 10px; font-size: 16px; line-height: 1.35; }
.mj__escena { position: relative; width: 100%; aspect-ratio: 10 / 6; border-radius: 10px; overflow: hidden; background: var(--tdh-mar, #1d2e38); touch-action: manipulation; }
.mj__escena canvas.mj__fondo { position: absolute; inset: 0; width: 100%; height: 100%; }
.mj__cosa { position: absolute; transform: translate(-50%, -50%); width: 17%; aspect-ratio: 1; min-width: 44px; min-height: 44px; padding: 0; border: 0; background: none; cursor: pointer; transition: opacity .25s, transform .25s; }
.mj__cosa img { width: 100%; height: 100%; object-fit: contain; image-rendering: pixelated; pointer-events: none; }
.mj__cosa:focus-visible { outline: 3px solid var(--tdh-luz, #ffd47c); outline-offset: 2px; border-radius: 8px; }
.mj__cosa.juntado { opacity: 0; transform: translate(-50%, -90%) scale(1.3); pointer-events: none; }
.mj__cosa:disabled { cursor: default; }
.mj__cosa.tapado { opacity: .15; }
.mj__piedra { display: block; width: 62%; height: 46%; margin: 27% auto 0; border-radius: 48% 52% 44% 56% / 58% 50% 50% 42%; background: #7d7f78; box-shadow: inset -6px -5px 0 rgba(0,0,0,.25), 0 0 0 3px #eee5d0, 3px 4px 0 3px rgba(15,26,33,.45); }
.mj__marea { position: absolute; left: 0; right: 0; bottom: 0; height: 0; background: rgba(43, 79, 96, .86); border-top: 3px solid rgba(238, 229, 208, .7); transition: height .6s ease-in-out; pointer-events: none; }
.mj__marea.alta { height: calc(100% * (1 - ${LINEA_MAREA}) + 6%); }
.mj__pista { position: absolute; left: 6%; right: 6%; bottom: 10%; height: 22%; border-radius: 12px; background: rgba(238, 229, 208, .2); box-shadow: inset 0 0 0 2px rgba(238, 229, 208, .55); }
.mj__zona { position: absolute; top: 0; bottom: 0; border-radius: 10px; background: rgba(255, 212, 124, .38); box-shadow: inset 0 0 0 3px #ffd47c; }
.mj__zona span { position: absolute; left: 50%; top: -1.6em; transform: translateX(-50%); white-space: nowrap; font: 700 13px/1 "Atkinson Hyperlegible", system-ui, sans-serif; color: #eee5d0; text-shadow: 0 1px 2px #0b1015; }
.mj__marca { position: absolute; top: 50%; width: 15%; aspect-ratio: 1; transform: translate(-50%, -50%); pointer-events: none; }
.mj__marca img { width: 100%; height: 100%; object-fit: contain; image-rendering: pixelated; }
.mj__estado { min-height: 1.4em; margin: 8px 0 4px; font-weight: 700; }
.mj__tiempo { height: 8px; border-radius: 4px; background: rgba(40, 34, 30, .15); overflow: hidden; }
.mj__tiempo div { height: 100%; width: 100%; background: var(--tdh-ocre, #973a25); transform-origin: left; }
.mj__dato { margin: 10px 0 0; font-size: 14px; line-height: 1.35; }
.mj__recurso { margin: 4px 0 0; font-size: 12.5px; line-height: 1.3; opacity: .8; }
.mj__botones { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
.mj__botones .boton-papel { flex: 1 1 160px; min-width: 0; }
.alto-contraste .mj__zona { background: rgba(255, 212, 124, .6); box-shadow: inset 0 0 0 4px #ffd47c, 0 0 0 3px #0b1015; }
.alto-contraste .mj__cosa img { filter: drop-shadow(0 0 0 #0b1015) drop-shadow(0 0 3px #0b1015); }
@media (max-height: 520px) { .mj__escena { aspect-ratio: 10 / 4.2; } .mj h2 { font-size: 19px; } .mj__dato, .mj__recurso { display: none; } }
`;

  let actual = null; // el minijuego abierto: { ganar(), cerrar() }

  // Racha: cuántos minijuegos seguidos salieron al primer intento (sin fallar ni tocar una piedra
  // común). Es solo un reto propio: no cambia nada del viaje. La mejor se guarda en el dispositivo.
  let racha = 0, mejor = 0;
  try { mejor = Number(raiz.localStorage && raiz.localStorage.getItem('tdh-mejor-racha')) || 0; } catch (e) { /* sin almacenamiento */ }
  /** Suma a la racha si salió al primer intento, o la corta. Devuelve { racha, mejor, record }. */
  function anotar(limpio) {
    racha = limpio ? racha + 1 : 0;
    const record = racha > mejor && racha >= 2;
    if (racha > mejor) { mejor = racha; try { raiz.localStorage.setItem('tdh-mejor-racha', String(mejor)); } catch (e) { /* nada */ } }
    return { racha, mejor, record };
  }

  function crear(tag, clase, padre, texto) {
    const n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    if (padre) padre.appendChild(n);
    return n;
  }
  function imagen(id, op) {
    const CZ = raiz.TDH_CORTEZA;
    try {
      const lienzo = CZ.pegatina(CZ.PEGATINAS[id] || id, 4, op.estacion || 'verano', !!op.altoContraste);
      return lienzo.toDataURL();
    } catch (e) { return ''; }
  }

  /**
   * Abre un minijuego. Devuelve una promesa: true si salió bien (y hay que hacer la
   * acción), false si la persona volvió al viaje sin probar, y 'fallo' si no salió:
   * se acabaron los intentos o el tiempo, o volvió después de errar. Con 'fallo' la
   * interfaz hace { tipo: 'demora' }: se les fue el tiempo y el fuego baja (18/11, B).
   */
  function jugar(tipo, que, opciones) {
    const j = cual(tipo, que);
    if (!j || typeof document === 'undefined') return Promise.resolve(true);
    if (actual) actual.cerrar(false);
    const op = opciones || {};
    if (!document.getElementById('mj-estilo')) { const st = crear('style', null, document.head, ESTILO); st.id = 'mj-estilo'; }
    const r = azar(op.semilla != null ? op.semilla : Math.floor(Math.random() * 1e9));
    const antes = document.activeElement;

    return new Promise((resolver) => {
      const capa = crear('div', 'mj', document.body);
      capa.setAttribute('role', 'dialog'); capa.setAttribute('aria-modal', 'true'); capa.setAttribute('aria-labelledby', 'mj-titulo');
      const papel = crear('div', 'mj__papel papel', capa);
      crear('p', 'mj__sub', papel, (j.tierra ? 'Bajan a tierra' : 'En la canoa') + (racha >= 2 ? ' · Racha de ' + racha : ''));
      const h = crear('h2', null, papel, j.titulo); h.id = 'mj-titulo';
      crear('p', 'mj__pide', papel, j.pide);
      const escena = crear('div', 'mj__escena', papel);
      const fondo = crear('canvas', 'mj__fondo', escena); fondo.setAttribute('aria-hidden', 'true');
      const estado = crear('p', 'mj__estado', papel); estado.setAttribute('aria-live', 'polite');
      const reloj = crear('div', 'mj__tiempo', papel); const arena = crear('div', null, reloj);
      if (op.reducido || j.modo === 'tiempo') reloj.hidden = true;
      if (j.dato) crear('p', 'mj__dato', papel, 'Dato: ' + j.dato + ' Fuente: ' + j.fuente);
      crear('p', 'mj__recurso', papel, j.dato ? RECURSO : RECURSO + ' Falta una cita yagán sobre la recolección de leña 🔍.');
      const botones = crear('div', 'mj__botones', papel);

      // El fondo: la escena en Corteza, con la canoa esperando en el agua.
      let motor = null;
      const fila = ESCENAS[j.escena].length - 1;
      try {
        motor = raiz.TDH_CORTEZA.crear(fondo, { celda: 48 });
        motor.escena({ mapa: ESCENAS[j.escena], objetos: [], estacion: op.estacion || 'verano', hora: 'dia', clima: 'calma', altoContraste: !!op.altoContraste, suave: false,
          canoa: j.objeto === 'canoa' ? null : { x: j.tierra ? 7 : 4, y: j.tierra ? fila : fila - 1, fuego: op.fuego || 3, mira: -1 } });
      } catch (e) { motor = null; }

      let t0 = performance.now(), fin = false, cuadroId = 0, terminado = null;
      const segundos = () => (performance.now() - t0) / 1000;
      function cerrar(ok) {
        if (fin) return; fin = true;
        if (ok === false && !terminado) anotar(false); // volver al viaje sin terminar corta la racha
        if (ok === false && !limpio) ok = 'fallo';     // volver después de errar también cuesta
        cancelAnimationFrame(cuadroId);
        document.removeEventListener('keydown', teclas, true);
        capa.remove(); actual = null;
        if (antes && antes.focus) try { antes.focus({ preventScroll: true }); } catch (e) { /* nada */ }
        resolver(ok);
      }
      function ganar() {
        if (terminado) return;
        terminado = 'bien';
        const r = anotar(limpio);
        estado.textContent = r.racha >= 2 ? '¡Listo! ' + r.racha + ' seguidos al primer intento.' + (r.record ? ' ¡Tu mejor racha!' : '') : '¡Listo!';
        setTimeout(() => cerrar(true), op.reducido ? 300 : 650);
      }
      function perder(texto) {
        if (terminado) return;
        terminado = 'mal';
        anotar(false);
        estado.textContent = texto + ' Se les fue el tiempo: el fuego baja un poco.';
        botones.textContent = '';
        const seguir = crear('button', 'boton-papel boton-papel--fuego', botones, 'Seguir el viaje'); seguir.type = 'button';
        seguir.addEventListener('click', () => cerrar('fallo'));
        seguir.focus();
      }

      // ── Juntar: cada cosa es un botón ──
      let pulsar = null, marca = null, zona = null, marea = null, fallas = 0, limpio = true, mover = () => {};
      const cosas = [];
      if (j.modo === 'juntar') {
        const img = imagen(j.objeto, op);
        let juntados = 0;
        const contar = () => { estado.textContent = 'Juntaste ' + juntados + ' de ' + j.cantidad + '.'; };
        lugares(j, r).forEach((p, i) => {
          const es = i < j.cantidad;
          const b = crear('button', 'mj__cosa', escena); b.type = 'button';
          b.style.left = (p.x * 100) + '%'; b.style.top = (p.y * 100) + '%';
          b.dataset.y = p.y;
          if (es) { const im = crear('img', null, b); im.src = img; im.alt = ''; b.setAttribute('aria-label', 'Juntar ' + (j.objeto === 'lena' ? 'una rama' : j.objeto === 'pirita' ? 'una piedra de fuego' : j.objeto === 'hongos' ? 'un hongo' : 'un mejillón')); }
          else { crear('span', 'mj__piedra', b); b.setAttribute('aria-label', 'Una piedra gris'); }
          b.addEventListener('click', () => {
            if (terminado || b.disabled) return;
            if (!es) { limpio = false; estado.textContent = 'Esa es una piedra común. Las de fuego son doradas.'; b.disabled = true; b.classList.add('juntado'); return; }
            b.disabled = true; b.classList.add('juntado'); juntados++; contar();
            if (juntados >= j.cantidad) ganar();
          });
          cosas.push(b);
        });
        contar();
        const volver = crear('button', 'boton-papel', botones, 'Volver al viaje'); volver.type = 'button';
        volver.addEventListener('click', () => cerrar(false));
        if (j.marea) marea = crear('div', 'mj__marea', escena);
        setTimeout(() => { const pri = cosas.find((b) => !b.disabled); if (pri) pri.focus({ preventScroll: true }); }, 30);
        mover = (s) => {
          if (!op.reducido && !terminado) {
            const queda = Math.max(0, 1 - s / j.segundos);
            arena.style.transform = 'scaleX(' + queda + ')';
            if (queda === 0) perder('Se hizo tarde.');
          }
          if (j.marea) {
            const alta = !op.reducido && !terminado && mareaAlta(s);
            marea.classList.toggle('alta', alta);
            cosas.forEach((b) => { if (b.classList.contains('juntado')) return; const tapa = alta && Number(b.dataset.y) > LINEA_MAREA; b.disabled = tapa; b.classList.toggle('tapado', tapa); });
          }
        };
      } else {
        // ── Tiempo: tocar cuando la marca pasa por la zona ──
        zona = zonaDe(j, r);
        const pista = crear('div', 'mj__pista', escena);
        const z = crear('div', 'mj__zona', pista); z.style.left = (zona.desde * 100) + '%'; z.style.width = ((zona.hasta - zona.desde) * 100) + '%';
        crear('span', null, z, j.zonaNombre);
        marca = crear('div', 'mj__marca', pista);
        const im = crear('img', null, marca); im.alt = '';
        im.src = j.objeto === 'canoa' ? (raiz.TDH_ARTE ? raiz.TDH_ARTE.aCanvas('canoa', 0, op.estacion || 'verano', 4).toDataURL() : '') : imagen(j.objeto, op);
        const vueltas = j.vueltas * (op.reducido ? 0.5 : 1);
        estado.textContent = 'Te quedan ' + j.intentos + ' intentos.';
        pulsar = () => {
          if (terminado) return;
          const pos = marcaEn(segundos(), vueltas);
          if (dentro(pos, zona)) { ganar(); return; }
          fallas++; limpio = false;
          if (fallas >= j.intentos) perder('No salió esta vez.');
          else estado.textContent = 'Todavía no. Te ' + (j.intentos - fallas === 1 ? 'queda 1 intento.' : 'quedan ' + (j.intentos - fallas) + ' intentos.');
        };
        const ya = crear('button', 'boton-papel boton-papel--fuego', botones, j.boton); ya.type = 'button';
        ya.setAttribute('aria-describedby', 'mj-titulo');
        ya.addEventListener('click', pulsar);
        escena.addEventListener('pointerdown', (e) => { e.preventDefault(); pulsar(); });
        const volver = crear('button', 'boton-papel', botones, 'Volver al viaje'); volver.type = 'button';
        volver.addEventListener('click', () => cerrar(false));
        setTimeout(() => ya.focus({ preventScroll: true }), 30);
        mover = (s) => { if (!terminado) marca.style.left = (marcaEn(s, vueltas) * 100) + '%'; };
      }

      function teclas(e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(false); return; }
        // Que las teclas del viaje (flechas, letras, Enter) no muevan la canoa por detrás.
        e.stopPropagation();
        // Con la barra o Enter: si hay un botón con el foco, lo aprieta el navegador; si no, es «¡Ahora!».
        const enBoton = document.activeElement && document.activeElement.tagName === 'BUTTON' && capa.contains(document.activeElement);
        if ((e.key === ' ' || e.key === 'Enter') && pulsar && !enBoton) { e.preventDefault(); pulsar(); }
      }
      document.addEventListener('keydown', teclas, true);

      function cuadro(ms) {
        if (fin) return;
        const s = segundos();
        if (motor) { try { motor.dibujar(op.reducido ? 2 : ms / 1000); } catch (e) { motor = null; } }
        mover(s);
        cuadroId = requestAnimationFrame(cuadro);
      }
      cuadroId = requestAnimationFrame(cuadro);
      actual = { ganar, cerrar, juego: j };
    }).then((ok) => (ok === null ? jugar(tipo, que, Object.assign({}, op, { semilla: undefined })) : ok));
  }

  const api = {
    JUEGOS, ESCENAS, RECURSO, cual, jugar, anotar,
    /** La racha actual y la mejor (para mostrarlas en otra pantalla). */
    get racha() { return { racha, mejor }; },
    marcaEn, dentro, lugares, azar, zonaDe, mareaAlta, LINEA_MAREA,
    /** ¿Hay un minijuego abierto? */
    abierto: () => !!actual,
    /** Para las pruebas automáticas: da por ganado el minijuego abierto. */
    ganar: () => { if (actual) actual.ganar(); },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_MINIJUEGOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
