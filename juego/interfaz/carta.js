/*
 * Tierra de los Humos · Pantalla de carta de saber
 * ------------------------------------------------
 * Muestra una carta de datos/saberes.js encima del viaje, como un papel que se
 * despliega (TDH_TRANSICIONES.cartaEntra). Diseño de la maqueta (arte/pantallas)
 * y de docs/04-direccion-de-arte.md, sección 8.
 *
 *   await TDH_CARTA.mostrar(carta, { nueva: true, altoContraste: false });
 *   TDH_CARTA.abierta()   // true mientras se ve una carta
 *
 * - La fuente queda siempre a la vista: si el texto no entra, se desplaza el
 *   cuerpo de la carta (dato y en el juego), no la fuente ni los botones.
 * - La ilustración se dibuja con Corteza y lleva el texto alternativo (carta.alt).
 * - «Escuchar la carta» la lee con TDH_VOZ.leerCarta, si el dispositivo tiene voz.
 * - Teclado: el foco queda adentro de la carta; Escape la cierra. Al cerrar, el
 *   foco vuelve a donde estaba.
 * - Si llega otra carta mientras hay una abierta, espera su turno.
 *
 * Los textos de las cartas vienen del repo (datos/saberes.js), no del jugador:
 * por eso se insertan como HTML (la fuente usa <i> para el título de la obra).
 *
 * Requiere: arte/fuente/arte.js, arte/corteza/corteza.js, arte/corteza/carta.css
 * y juego/interfaz/juego.css. Opcionales: arte/corteza/transiciones.js, sonido/voz.js.
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const PUEBLOS = { yagan: 'Yagán', kawesqar: 'Kawésqar' };
  let cola = Promise.resolve();
  let abierta = false;
  let cuenta = 0;

  function el(etiqueta, clase, html) {
    const e = document.createElement(etiqueta);
    if (clase) e.className = clase;
    if (html != null) e.innerHTML = html;
    return e;
  }

  // Dibuja la ilustración con el motor del mapa, al tamaño real del canvas.
  function ilustrar(canvas, carta, altoContraste) {
    const CZ = raiz.TDH_CORTEZA;
    if (!CZ || !carta.mapa) return;
    const r = canvas.getBoundingClientRect();
    const celda = Math.max(8, Math.ceil(Math.max((r.width || 300) / carta.mapa[0].length, (r.height || 150) / carta.mapa.length)));
    const m = CZ.crear(canvas, { celda });
    m.escena(Object.assign({ mapa: carta.mapa, objetos: [], estacion: 'verano', clima: 'calma', hora: 'dia' }, carta.extra || {}, { altoContraste: !!altoContraste }));
    m.dibujar(1.6);
  }

  // Lo de afuera de la carta no se puede tocar ni leer mientras está abierta.
  function aislar(velo, si) {
    Array.from(document.body.children).forEach((hijo) => {
      if (hijo === velo || hijo.tagName === 'SCRIPT') return;
      if (si) { hijo.dataset.tdhInert = hijo.inert ? '1' : '0'; hijo.inert = true; }
      else if (hijo.dataset.tdhInert != null) { hijo.inert = hijo.dataset.tdhInert === '1'; delete hijo.dataset.tdhInert; }
    });
  }

  function abrir(carta, op) {
    return new Promise((cerrada) => {
      const n = ++cuenta;
      const previo = document.activeElement;
      const voz = raiz.TDH_VOZ && raiz.TDH_VOZ.disponible() ? raiz.TDH_VOZ : null;
      const pueblo = PUEBLOS[carta.pueblo] || carta.pueblo || '';

      const velo = el('div', 'tdh-velo');
      velo.setAttribute('role', 'dialog');
      velo.setAttribute('aria-modal', 'true');
      velo.setAttribute('aria-labelledby', 'tdh-carta-titulo-' + n);
      velo.setAttribute('aria-describedby', 'tdh-carta-cuerpo-' + n);

      const art = el('article', 'carta-saber papel tdh-carta');
      art.appendChild(el('p', 'carta-saber__tipo', (op.nueva ? 'Saber nuevo · ' : 'Saber · ') + pueblo + ' · ' + carta.tipo));
      const ilus = el('canvas', 'carta-saber__ilus');
      ilus.setAttribute('role', 'img');
      ilus.setAttribute('aria-label', carta.alt || 'Ilustración de la carta');
      art.appendChild(ilus);
      const titulo = el('h2', 'carta-saber__titulo', carta.titulo);
      titulo.id = 'tdh-carta-titulo-' + n;
      art.appendChild(titulo);

      const cuerpo = el('div', 'tdh-carta__cuerpo');
      cuerpo.id = 'tdh-carta-cuerpo-' + n;
      cuerpo.appendChild(el('p', null, '<span class="etiqueta etiqueta--dato">Dato</span> ' + carta.dato));
      cuerpo.appendChild(el('p', null, '<span class="etiqueta etiqueta--juego">En el juego</span> ' + carta.juego));
      art.appendChild(cuerpo);

      art.appendChild(el('p', 'carta-saber__fuente', 'Fuente: ' + carta.fuente));
      if (carta.estado === 'borrador') art.appendChild(el('p', 'tdh-carta__estado', 'Texto en revisión con las fuentes.'));

      const botones = el('div', 'tdh-carta__botones');
      let escuchar = null;
      if (voz) {
        escuchar = el('button', 'boton-papel', '🔊 Escuchar la carta');
        escuchar.type = 'button';
        escuchar.setAttribute('aria-pressed', 'false');
        botones.appendChild(escuchar);
      }
      const seguir = el('button', 'boton-papel boton-papel--fuego', op.nueva ? 'Guardar en la memoria' : 'Seguir');
      seguir.type = 'button';
      botones.appendChild(seguir);
      art.appendChild(botones);
      velo.appendChild(art);

      // ── Voz ──
      function vozLista() { if (!escuchar) return; escuchar.setAttribute('aria-pressed', 'false'); escuchar.textContent = '🔊 Escuchar la carta'; }
      if (escuchar) escuchar.addEventListener('click', async () => {
        if (escuchar.getAttribute('aria-pressed') === 'true') { voz.detener(); vozLista(); return; }
        escuchar.setAttribute('aria-pressed', 'true'); escuchar.textContent = '⏹ Detener la lectura';
        await voz.leerCarta(carta);
        if (velo.isConnected) vozLista();
      });

      // ── Cerrar ──
      function cerrar() {
        if (!velo.isConnected) return;
        if (voz) voz.detener();
        document.removeEventListener('keydown', teclas, true);
        aislar(velo, false);
        velo.remove();
        abierta = false;
        if (previo && previo.isConnected && previo.focus) previo.focus({ preventScroll: true });
        if (op.alCerrar) op.alCerrar(carta);
        cerrada(carta);
      }
      seguir.addEventListener('click', cerrar);

      // ── Teclado: Escape cierra; Tab no se escapa de la carta ──
      function teclas(e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(); return; }
        if (e.key === 'Tab') {
          const enfocables = [cuerpo, escuchar, seguir].filter((x) => x && x.tabIndex >= 0);
          const i = enfocables.indexOf(document.activeElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); enfocables[enfocables.length - 1].focus(); }
          else if (!e.shiftKey && i === enfocables.length - 1) { e.preventDefault(); enfocables[0].focus(); }
          else if (i < 0) { e.preventDefault(); seguir.focus(); }
          return;
        }
        // Las teclas del viaje (flechas, WASD) no pasan al mapa mientras se lee.
        if (e.target === cuerpo && /^Arrow|^Page|^Home$|^End$/.test(e.key)) { e.stopPropagation(); return; }
        if (e.key !== 'Enter' && e.key !== ' ') e.stopPropagation();
      }
      document.addEventListener('keydown', teclas, true);

      document.body.appendChild(velo);
      aislar(velo, true);
      abierta = true;
      if (op.altoContraste) velo.classList.add('tdh-velo--contraste');
      requestAnimationFrame(() => {
        ilustrar(ilus, carta, op.altoContraste);
        // Si el texto no entra en la pantalla, el cuerpo se desplaza: que se pueda hacer con el teclado.
        if (cuerpo.scrollHeight > cuerpo.clientHeight + 2) { cuerpo.tabIndex = 0; cuerpo.setAttribute('aria-label', 'Texto de la carta (se puede desplazar)'); }
      });
      if (raiz.TDH_TRANSICIONES) raiz.TDH_TRANSICIONES.cartaEntra(art);
      seguir.focus({ preventScroll: true });
    });
  }

  const api = {
    /** Muestra la carta; la promesa se cumple al cerrarla. Si ya hay una abierta, espera. */
    mostrar(carta, opciones) {
      if (!carta) return Promise.resolve(null);
      const op = Object.assign({ nueva: true, altoContraste: false }, opciones || {});
      cola = cola.then(() => abrir(carta, op));
      return cola;
    },
    abierta() { return abierta; },
  };
  raiz.TDH_CARTA = api;
})(window);
