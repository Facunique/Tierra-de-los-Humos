/*
 * Tierra de los Humos · Minijuegos: el marco
 * ------------------------------------------
 * Antes de juntar algo, avivar el fuego o amarrar la canoa, se juega un momento
 * corto. Desde el 19/11 cada uno se juega distinto (antes todos eran «tocar»):
 *
 *   leña        arrastrar   llevar las ramas hasta la canoa        (juegos-tierra.js)
 *   mejillones  mantener    mantener apretado para despegarlos, con la marea
 *   hongos      memoria     mirar dónde están y encontrarlos tapados
 *   pirita      frotar      frotar la arena para destapar las piedras de fuego
 *   pescado     seguir      mantener el lazo sobre el pez           (juegos-canoa.js)
 *   avivar      cargar      mantener apretado y soltar en la franja
 *   amarrar     guiar       llevar la canoa contra la corriente hasta el cachiyuyo
 *
 * Este archivo arma la pantalla, el tiempo, la racha y el resultado; cada mecánica
 * está en juegos-tierra.js o juegos-canoa.js (global TDH_MJ_MECANICAS). Los estilos,
 * en minijuegos.css. index.html carga los cuatro.
 *
 * Resultado de jugar(): 'perfecto' (sin errar y rápido: el núcleo suma un poco más,
 * con `bien: true`), true (salió), false (volvió al viaje sin probar) o 'fallo' (no
 * salió, o volvió después de errar: la interfaz hace { tipo: 'demora' }).
 *
 *   const r = await TDH_MINIJUEGOS.jugar('juntar', 'mejillones', { estacion, altoContraste, reducido, sonido });
 *
 * La racha (minijuegos seguidos al primer intento) sube un poco la dificultad, hasta
 * 5. Con movimiento reducido no hay apuro: no se acaba el tiempo y todo va más lento.
 * Los datos de las fuentes no se muestran acá (están en las cartas); `fuente` queda
 * para docs/05-rigor-historico.md. La mecánica es recurso de juego.
 *
 * Para las pruebas: abierto(), ganar() y auto() (juega solo, por los mismos caminos
 * que una persona). Licencia: MIT (el código); CC BY-SA 4.0 (los textos).
 */
(function (raiz) {
  'use strict';
  const pedir = (ruta) => (typeof require === 'function' ? require(ruta) : null);
  const mecanicas = () => raiz.TDH_MJ_MECANICAS || Object.assign({}, pedir('./juegos-tierra.js'), pedir('./juegos-canoa.js'));

  // Escenas de fondo, en las letras del motor Corteza (arte/corteza/corteza.js).
  const ESCENAS = {
    playa: ['GGLGGGLGGG', 'GLGGLGGGLG', '..........', '..........', ',,,,,,,,,,', '----------'],
    bosque: ['GGLGGLGGLG', 'GLGGGLGGLG', 'GGLGLGGGLG', '..........', ',,,,,,,,,,', '----------'],
    orilla: ['GGLGGGLGGG', '..........', '..........', '..........', ',,r,,,,r,,', '----------'],
    canal: ['GGLGGGLGGG', '..........', ',,,,,,,,,,', '----------', '----------', '~~~~~~~~~~'],
    cachiyuyo: ['GGLGGGLGGG', '..........', ',,,,,,,,,,', '--kkk-----', '----------', '~~~~~~~~~~'],
  };

  /**
   * Los minijuegos. `banda`: la franja donde aparecen las cosas (0 arriba, 1 abajo).
   * `segundos`: el tiempo (sin él, se juega por intentos). `premio`: lo que dice si sale perfecto.
   * `fuente`: de dónde sale lo que se dibuja (no se muestra; ver docs/05).
   */
  // Dificultad (19/11, a pedido de Mati): un 15 % más difíciles que la primera versión.
  const JUEGOS = {
    lena: {
      mecanica: 'arrastrar', tierra: true, escena: 'playa', objeto: 'lena', cantidad: 3, segundos: 10, banda: [0.3, 0.62],
      titulo: 'Juntar leña', pide: 'Arrastrá tres ramas hasta la canoa.', premio: '¡Perfecto! +1 leña',
      fuente: 'Cooper (1946), pp. 88 y 91 (el fuego en la canoa). 🔍 Falta una cita yagán sobre la recolección de leña.',
    },
    mejillones: {
      mecanica: 'mantener', tierra: true, escena: 'orilla', objeto: 'mejillones', cantidad: 3, segundos: 12, banda: [0.4, 0.74],
      titulo: 'Mejillones con la marea baja', pide: 'Mantené apretado cada uno para despegarlo. Si sube el agua, esperá.', premio: '¡Perfecto! +1 comida',
      fuente: 'Vargas Filgueira (2019), pp. 30 y 44 del visor del PDF; Cooper (1946), p. 84.',
    },
    hongos: {
      mecanica: 'memoria', tierra: true, escena: 'bosque', objeto: 'hongos', cantidad: 3, vacios: 4, segundos: 10, banda: [0.15, 0.46],
      titulo: 'Hongos de los árboles', pide: 'Mirá dónde están: después las hojas los tapan.', premio: '¡Perfecto! +1 comida',
      fuente: 'Vargas Filgueira (2019), p. 54 del visor del PDF.',
    },
    pirita: {
      mecanica: 'frotar', tierra: true, escena: 'playa', objeto: 'pirita', cantidad: 2, piedras: 3, segundos: 12, banda: [0.41, 0.59], arena: [2 / 6, 4 / 6],
      titulo: 'Piedras de fuego', pide: 'Frotá la arena con el dedo y encontrá las dos doradas.', premio: '¡Perfecto!',
      fuente: 'Cooper (1946), pp. 91 y 95.',
    },
    pescado: {
      mecanica: 'seguir', tierra: false, escena: 'canal', objeto: 'pescado', segundos: 12, ancho: 0.27,
      titulo: 'Pescar desde la canoa', pide: 'La carnada va en un lazo, sin anzuelo. Mantené apretado para subir el lazo y seguí al pez.', premio: '¡Perfecto! +1 comida',
      boton: 'Subir el lazo',
      fuente: 'Cooper (1946), pp. 84 y 96.',
    },
    avivar: {
      mecanica: 'cargar', tierra: false, escena: 'canal', objeto: 'lena', intentos: 3, franja: [0.6, 0.8],
      titulo: 'Avivar el fuego', pide: 'Mantené apretado para sumar leña y soltá en la franja, sin ahogarlo.', premio: '¡Perfecto! El fuego rinde más',
      boton: 'Sumar leña',
      fuente: 'Vargas Filgueira (2019), p. 33 del visor del PDF.',
    },
    amarrar: {
      mecanica: 'guiar', tierra: false, escena: 'cachiyuyo', objeto: 'canoa', segundos: 12,
      titulo: 'Amarrar en el cachiyuyo', pide: 'La corriente empuja. Tocá de un lado o del otro para dejar la canoa sobre el cachiyuyo.', premio: '¡Perfecto! La noche gasta menos',
      fuente: 'Cooper (1946), p. 88 (paginación impresa).',
    },
  };

  /** Qué minijuego va antes de una acción, o null si no hay (por ejemplo, un saber). */
  function cual(tipo, que) {
    if (tipo === 'avivar' || tipo === 'amarrar') return JUEGOS[tipo];
    if (tipo === 'juntar' && que && que !== 'avivar' && que !== 'amarrar') return JUEGOS[que] || null;
    return null;
  }

  /** Un azar con semilla (para que las pruebas den siempre lo mismo). */
  function azar(semilla) {
    // La semilla se mezcla primero: con semillas seguidas (1, 2, 3…) el primer número salía casi igual.
    let s = (semilla >>> 0) ^ 0x9e3779b9;
    s = Math.imul(s ^ (s >>> 16), 0x85ebca6b); s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35); s = ((s ^ (s >>> 16)) >>> 0) || 1;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  /** Dónde van `total` cosas (fracciones del ancho y del alto), en su franja y sin pisarse. */
  function lugares(j, r, total) {
    const n = total || j.cantidad, lista = [], x = j.x || [0.08, 0.92];
    for (let i = 0; i < n; i++) {
      let p, prueba = 0;
      do {
        p = { x: x[0] + r() * (x[1] - x[0]), y: j.banda[0] + r() * (j.banda[1] - j.banda[0]) };
        prueba++;
      } while (prueba < 200 && lista.some((q) => Math.abs(q.x - p.x) < 0.15 && Math.abs(q.y - p.y) < 0.18));
      lista.push(p);
    }
    return lista;
  }

  /** ¿La marea tapa ahora la parte de abajo? Sube 1,4 s de cada 4,5 s. */
  const mareaAlta = (segundos) => (segundos % 4.5) > 3.1;
  const LINEA_MAREA = 0.62; // lo que está más abajo que esto queda tapado con la marea alta

  /** Cuánto más rápido va todo según la racha: 1 sin racha, hasta 1,3 con racha de 5. */
  const dificultad = (r) => 1 + 0.06 * Math.max(0, Math.min(5, r || 0));

  // Racha: minijuegos seguidos al primer intento. Es un reto propio; la mejor se guarda en el dispositivo.
  let racha = 0, mejor = 0;
  try { mejor = Number(raiz.localStorage && raiz.localStorage.getItem('tdh-mejor-racha')) || 0; } catch (e) { /* sin almacenamiento */ }
  function anotar(limpio) {
    racha = limpio ? racha + 1 : 0;
    const record = racha > mejor && racha >= 2;
    if (racha > mejor) { mejor = racha; try { raiz.localStorage.setItem('tdh-mejor-racha', String(mejor)); } catch (e) { /* nada */ } }
    return { racha, mejor, record };
  }

  // ── Pantalla ──────────────────────────────────────────────────────────────
  let actual = null; // el minijuego abierto: { ganar(), cerrar(), auto() }

  function crear(tag, clase, padre, texto) {
    const n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    if (padre) padre.appendChild(n);
    return n;
  }
  function imagen(id, op) {
    try {
      if (id === 'canoa') return raiz.TDH_ARTE.aCanvas('canoa', 0, op.estacion || 'verano', 4).toDataURL();
      const CZ = raiz.TDH_CORTEZA;
      return CZ.pegatina(CZ.PEGATINAS[id] || id, 4, op.estacion || 'verano', !!op.altoContraste).toDataURL();
    } catch (e) { return ''; }
  }

  function jugar(tipo, que, opciones) {
    const j = cual(tipo, que);
    const M = mecanicas();
    if (!j || typeof document === 'undefined' || !M[j.mecanica]) return Promise.resolve(true);
    if (actual) actual.cerrar(false);
    const op = opciones || {};
    const r = azar(op.semilla != null ? op.semilla : Math.floor(Math.random() * 1e9));
    const antes = document.activeElement;
    const vel = dificultad(racha) * (op.reducido ? 0.6 : 1);

    return new Promise((resolver) => {
      const capa = crear('div', 'mj', document.body);
      capa.setAttribute('role', 'dialog'); capa.setAttribute('aria-modal', 'true'); capa.setAttribute('aria-labelledby', 'mj-titulo');
      const papel = crear('div', 'mj__papel papel', capa);
      crear('p', 'mj__sub', papel, (j.tierra ? 'En tierra' : 'En la canoa') + (racha >= 2 ? ' · Racha ' + racha : ''));
      const h = crear('h2', null, papel, j.titulo); h.id = 'mj-titulo';
      crear('p', 'mj__pide', papel, j.pide);
      const escena = crear('div', 'mj__escena', papel);
      const fondo = crear('canvas', 'mj__fondo', escena); fondo.setAttribute('aria-hidden', 'true');
      const barra = crear('div', 'mj__barra', papel); const lleno = crear('div', null, barra); barra.hidden = true;
      const estado = crear('p', 'mj__estado', papel); estado.setAttribute('aria-live', 'polite');
      const reloj = crear('div', 'mj__tiempo', papel); const arena = crear('div', null, reloj);
      const limite = j.segundos ? j.segundos / dificultad(racha) : 0;
      if (op.reducido || !limite) reloj.hidden = true;
      const botones = crear('div', 'mj__botones', papel);
      const volver = crear('button', 'boton-papel mj__volver', botones, 'Volver al viaje'); volver.type = 'button';
      volver.addEventListener('click', () => cerrar(false));

      // El fondo: la escena en Corteza, con la canoa esperando en el agua.
      let motor = null;
      const fila = ESCENAS[j.escena].length - 1;
      // En tierra, la canoa espera a la izquierda o a la derecha (19/11): que no sea siempre igual.
      const colCanoa = j.tierra ? (r() < 0.5 ? 1 : 7) : 4;
      try {
        motor = raiz.TDH_CORTEZA.crear(fondo, { celda: 48 });
        motor.escena({ mapa: ESCENAS[j.escena], objetos: [], estacion: op.estacion || 'verano', hora: 'dia', clima: 'calma', altoContraste: !!op.altoContraste, suave: false,
          canoa: j.objeto === 'canoa' || j.mecanica === 'cargar' ? null : { x: colCanoa, y: j.tierra ? fila : fila - 1, fuego: op.fuego || 3, mira: colCanoa > 4 ? -1 : 1 } });
      } catch (e) { motor = null; }

      let t0 = performance.now(), desdeReloj = 0, fin = false, cuadroId = 0, terminado = null, limpio = true, jugando = false, autoJuega = false, ultimo = 0;
      const alCerrar = [];
      const segundos = () => (performance.now() - t0) / 1000;
      const sonar = (n, t) => { try { if (op.sonido) op.sonido.efecto(n, t); } catch (e) { /* sin sonido */ } };

      function cerrar(ok) {
        if (fin) return;
        if (ok === false && terminado === 'bien') return;   // ya salió: se cierra solo en un momento, con lo ganado
        fin = true;
        if (ok === false && !terminado) anotar(false);   // volver sin terminar corta la racha
        if (ok === false && jugando && !limpio) ok = 'fallo';   // volver después de errar también cuesta
        cancelAnimationFrame(cuadroId);
        document.removeEventListener('keydown', teclaBaja, true);
        document.removeEventListener('keyup', teclaSube, true);
        alCerrar.forEach((f) => { try { f(); } catch (e) { /* nada */ } });
        capa.remove(); actual = null;
        if (antes && antes.focus) try { antes.focus({ preventScroll: true }); } catch (e) { /* nada */ }
        resolver(ok);
      }
      function ganar(perfecto) {
        if (terminado) return;
        terminado = 'bien';
        const p = perfecto != null ? perfecto && limpio : limpio && (!limite || op.reducido || segundos() - desdeReloj <= limite * 0.6);
        const a = anotar(limpio);
        estado.textContent = (p ? j.premio : '¡Listo!') + (a.racha >= 2 ? ' · Racha ' + a.racha + (a.record ? ', ¡tu mejor!' : '') : '');
        if (p) { papel.classList.add('mj--perfecto'); sonar('chispa', j.premio); } else sonar('junto');
        setTimeout(() => cerrar(p ? 'perfecto' : true), op.reducido ? 400 : p ? 900 : 650);
      }
      function perder(texto) {
        if (terminado) return;
        terminado = 'mal';
        anotar(false);
        sonar('piedra');
        estado.textContent = texto + ' Se les fue el tiempo: el fuego baja un poco.';
        volver.remove();
        botones.querySelectorAll('.mj__mantener').forEach((b) => b.remove());
        const seguir = crear('button', 'boton-papel boton-papel--fuego', botones, 'Seguir el viaje'); seguir.type = 'button';
        seguir.addEventListener('click', () => cerrar('fallo'));
        seguir.focus();
      }

      // Lo que cada mecánica usa del marco.
      const c = {
        j, op, r, escena, botones, crear, sonar, mareaAlta, LINEA_MAREA, velocidad: vel, reducido: !!op.reducido,
        /** Dónde está la canoa del fondo, en fracción del ancho (su centro). */
        canoaX: (colCanoa + 0.5) / 10,
        get terminado() { return !!terminado; },
        imagen: (id) => imagen(id, op),
        lugares: (total) => lugares(j, r, total),
        /** Posición de un toque en fracciones de la escena (0 a 1). */
        pos(e) { const b = escena.getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)), y: Math.max(0, Math.min(1, (e.clientY - b.top) / b.height)) }; },
        /** Un botón con dibujo en la escena, en (p.x, p.y). */
        cosa(id, p, etiqueta) {
          const b = crear('button', 'mj__cosa', escena); b.type = 'button';
          b.style.left = (p.x * 100) + '%'; b.style.top = (p.y * 100) + '%';
          if (id) { const im = crear('img', null, b); im.src = imagen(id, op); im.alt = ''; }
          b.setAttribute('aria-label', etiqueta);
          return b;
        },
        decir(t) { if (!terminado) estado.textContent = t; },
        contar(n, de) { if (!terminado) estado.textContent = n + ' de ' + de + '.'; },
        progreso(f) { barra.hidden = false; lleno.style.transform = 'scaleX(' + Math.max(0, Math.min(1, f)) + ')'; },
        /** Un error: corta el «perfecto» y la racha, pero se sigue jugando. */
        error(t) { jugando = true; limpio = false; sonar('piedra'); if (t) c.decir(t); },
        manchar() { jugando = true; limpio = false; },
        empezo() { jugando = true; },
        /** El tiempo empieza a correr desde ahora (la memoria, después de mirar). */
        relojDesde(s) { desdeReloj = s; },
        enfocar(lista) { setTimeout(() => { const b = lista.find((x) => !x.disabled) || lista[0]; if (b && b.focus) b.focus({ preventScroll: true }); }, 30); },
        /** Un botón que se mantiene apretado (también con la barra espaciadora: ver tecla). */
        botonMantener(texto, bajar, subir) {
          const b = crear('button', 'boton-papel boton-papel--fuego mj__mantener', botones, texto); b.type = 'button';
          botones.insertBefore(b, volver);
          b.addEventListener('pointerdown', (e) => { e.preventDefault(); bajar(); });
          for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, subir);
          b.addEventListener('click', (e) => e.preventDefault());
          return b;
        },
        alCerrar: (f) => alCerrar.push(f),
        /** Cambia el fondo (por ejemplo, para que el cachiyuyo quede donde está la zona). */
        fondo(cambios) { if (motor) try { motor.escena(Array.isArray(cambios) ? { mapa: cambios } : cambios); } catch (e) { /* queda el de antes */ } },
        ganar, perder,
      };
      let mec;
      try { mec = M[j.mecanica](c); } catch (e) {
        // Si una mecánica no se puede armar, el viaje no se traba: la acción se hace sin minijuego.
        capa.remove(); actual = null; fin = true; resolver(true); return;
      }

      // En «Volver al viaje» o «Seguir el viaje», Enter y la barra hacen lo de siempre: apretar ese botón.
      const enBotonComun = () => { const f = document.activeElement; return !!(f && f.closest && f.closest('.mj__botones') && !f.classList.contains('mj__mantener')); };
      function teclaBaja(e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(false); return; }
        e.stopPropagation();   // que las teclas del viaje no muevan la canoa por detrás
        if (enBotonComun()) return;
        if (!terminado && mec.tecla && mec.tecla(e, true)) e.preventDefault();
      }
      function teclaSube(e) {
        e.stopPropagation();
        if (enBotonComun()) return;
        if (!terminado && mec.tecla && mec.tecla(e, false)) e.preventDefault();
      }
      document.addEventListener('keydown', teclaBaja, true);
      document.addEventListener('keyup', teclaSube, true);

      function cuadro(ms) {
        if (fin) return;
        const s = segundos(), dt = Math.min(0.1, Math.max(0, s - ultimo)); ultimo = s;
        if (motor) { try { motor.dibujar(op.reducido ? 2 : ms / 1000); } catch (e) { motor = null; } }
        if (!terminado) {
          if (autoJuega && mec.auto) mec.auto(s, dt);
          if (mec.mover) mec.mover(s, dt);
          if (limite && !op.reducido && !terminado) {
            const queda = Math.max(0, 1 - (s - desdeReloj) / limite);
            arena.style.transform = 'scaleX(' + queda + ')';
            if (queda === 0) perder('Se hizo tarde.');
          }
        }
        cuadroId = requestAnimationFrame(cuadro);
      }
      cuadroId = requestAnimationFrame(cuadro);
      actual = { ganar: () => ganar(false), cerrar, auto: () => { autoJuega = true; }, juego: j };
    });
  }

  const api = {
    JUEGOS, ESCENAS, cual, jugar, anotar, azar, lugares, mareaAlta, LINEA_MAREA, dificultad,
    /** La racha actual y la mejor. */
    get racha() { return { racha, mejor }; },
    /** ¿Hay un minijuego abierto? */
    abierto: () => !!actual,
    /** Para las pruebas: da por ganado el minijuego abierto (sin «perfecto»). */
    ganar: () => { if (actual) actual.ganar(); },
    /** Para las pruebas y el video: el minijuego abierto se juega solo, por los mismos caminos que una persona. */
    auto: () => { if (actual) actual.auto(); },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_MINIJUEGOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
