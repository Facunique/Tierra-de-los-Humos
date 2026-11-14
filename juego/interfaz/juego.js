/*
 * Tierra de los Humos · El juego (interfaz)
 * -----------------------------------------
 * Une las piezas en una sola página (index.html):
 *   - el núcleo de la Persona A (juego/nucleo/partida.js): las reglas del viaje;
 *   - el motor Corteza (arte/corteza/): el dibujo;
 *   - las cartas (datos/saberes.js y juego/interfaz/carta.js);
 *   - la herencia en localStorage (juego/interfaz/herencia.js);
 *   - el sonido, los subtítulos, la voz y el narrador de la Persona D (sonido/);
 *   - la postal (arte/postal/) y la luz real de Ushuaia (arte/corteza/luz-real.js).
 *
 * El núcleo solo dice qué pasó (eventos). Los textos que ve la persona están acá.
 *
 * Pantallas: título → pueblo → viaje → fin (o llegada) → generación siguiente.
 * Desde el título y el fin: códice, cómo se juega y el cierre en presente («Hoy»).
 *
 * Agregados a la dirección, para probar o reportar un error:
 *   ?semilla=5        repite siempre el mismo mapa
 *   ?destino=pirita   juega con otro destino de juego/nucleo/territorio/destinos.js
 *
 * Licencia: MIT.
 */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const ARTE = window.TDH_ARTE, CZ = window.TDH_CORTEZA, C = ARTE.COLOR;
  const { SABERES } = window.TDH_SABERES;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(location.search);
  const PUEBLO = 'yagan';
  const catalogoDe = (pueblo) => Object.keys(SABERES).filter((id) => SABERES[id].pueblo === pueblo);

  // ── Preferencias y herencia ───────────────────────────────────────────────
  // Si no hay almacenamiento (modo privado o bloqueado), todo anda igual mientras la página está abierta.
  let almacen = null;
  try { almacen = window.localStorage; } catch (e) { almacen = null; }
  function leerPref(clave, porDefecto) { try { const v = almacen && almacen.getItem(clave); return v == null ? porDefecto : v === '1'; } catch (e) { return porDefecto; } }
  function guardarPref(clave, valor) { try { if (almacen) almacen.setItem(clave, valor ? '1' : '0'); } catch (e) { /* no pasa nada */ } }
  const herencia = TDH_HERENCIA.crear(almacen, { catalogo: SABERES });

  let altoContraste = leerPref('tdh-alto-contraste', false);
  let luzReal = leerPref('tdh-luz-real', true);
  let conNarrador = leerPref('tdh-narrador', false);
  const luz = () => (luzReal && window.TDH_LUZ_REAL ? TDH_LUZ_REAL.ahora() : { hora: 'dia', estacion: 'verano' });

  // ── Pantallas ─────────────────────────────────────────────────────────────
  let actual = 'titulo';
  let volverA = 'titulo';                 // a dónde vuelven el códice y la ayuda
  function ir(nombre) {
    if (nombre === 'codice' || nombre === 'ayuda') { if (actual !== 'codice' && actual !== 'ayuda' && actual !== 'cierre') volverA = actual; }
    document.querySelectorAll('.pantalla').forEach((p) => { p.hidden = p.id !== 'p-' + nombre; });
    actual = nombre;
    if (nombre === 'titulo') pintarTitulo();
    if (nombre === 'pueblo') pintarPueblo();
    if (nombre === 'viaje') entrarAlViaje();
    if (nombre === 'codice') pintarCodice();
    if (nombre === 'ayuda') pintarAyuda();
    prepararFondo(nombre);
    const foco = document.querySelector('#p-' + nombre + ' h1, #p-' + nombre + ' h2');
    if (foco) { foco.setAttribute('tabindex', '-1'); foco.focus({ preventScroll: true }); }
    sonarAmbiente();
  }
  // Entre pantallas, el humo tapa y destapa (si la persona no pidió menos movimiento).
  let enTransicion = false;
  async function irConHumo(nombre) {
    // Un toque mientras el humo todavía tapa o destapa no se pierde: espera a que termine.
    while (enTransicion) await new Promise((r) => setTimeout(r, 50));
    if (actual === nombre && nombre !== 'viaje') return;
    if (reducido || !window.TDH_TRANSICIONES) { ir(nombre); return; }
    enTransicion = true;
    try { await conTope(TDH_TRANSICIONES.humoCubre(document.body, 380), 900); ir(nombre); await conTope(TDH_TRANSICIONES.humoDescubre(document.body, 460), 1000); }
    finally { enTransicion = false; }
  }
  // Si el navegador frena las animaciones (pestaña en segundo plano, celular que ahorra batería),
  // la transición no traba el juego: pasado el tope, se sigue igual.
  const conTope = (promesa, ms) => Promise.race([promesa, new Promise((r) => setTimeout(r, ms))]);
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ir], [data-volver]');
    if (!b) return;
    irConHumo(b.hasAttribute('data-volver') ? volverA : b.dataset.ir);
  });

  // ── Fondos animados (costa con bosque, playa y canal) ─────────────────────
  const fondos = {};
  function costa(cols, filas) {
    const mapa = [];
    for (let y = 0; y < filas; y++) {
      let f = '';
      for (let x = 0; x < cols; x++) {
        const borde = 3 + Math.round(Math.sin(x * 0.7) * 0.6);
        f += y === 0 ? (x % 4 === 1 ? 'L' : 'M') : y < borde - 1 ? (x % 3 ? 'G' : 'L') : y === borde - 1 ? '.' : y === borde ? (x % 5 === 2 ? 'k' : ',') : (y > filas - 3 ? '~' : '-');
      }
      mapa.push(f);
    }
    return mapa;
  }
  function prepararFondo(nombre) {
    const canvas = document.querySelector('#p-' + nombre + ' [data-fondo]');
    if (!canvas) return;
    const W = Math.max(innerWidth, 320), H = Math.max(innerHeight, 320);
    const cols = Math.ceil(W / 48) + 1, filas = Math.ceil(H / 48) + 1;
    const l = luz();
    const base = { mapa: costa(cols, filas), objetos: [], estacion: 'verano', clima: 'calma', hora: 'tarde', altoContraste, humos: [{ x: cols * 0.75, y: 1.6 }, { x: cols * 0.2, y: 1.4 }] };
    const extra = {
      titulo: { estacion: l.estacion, hora: luzReal ? l.hora : 'tarde', objetos: [{ id: 'choza', x: Math.floor(cols * 0.62), y: 2 }], canoa: { x: Math.floor(cols * 0.3), y: 5, fuego: 4 } },
      pueblo: { hora: 'dia' },
      fin: finFondo(cols),
      cierre: { hora: 'dia', estacion: 'invierno' },
      ayuda: { hora: 'dia' },
    }[nombre] || {};
    const m = CZ.crear(canvas, { celda: 48 });
    m.escena(Object.assign(base, extra));
    canvas.style.objectFit = 'cover';
    fondos[nombre] = m;
  }
  function finFondo(cols) {
    if (!ultimo) return {};
    if (!ultimo.gano) return { hora: 'tarde', clima: 'lluvia', canoa: { x: Math.floor(cols * 0.5), y: 5, fuego: 0 } };
    const d = TDH_DESTINOS.DESTINOS[ultimo.estado.destino.id] || {};
    const x = Math.floor(cols * 0.5);
    return { objetos: d.dibujo ? [{ id: d.dibujo, x, y: 2 }] : [], canoa: { x: Math.floor(cols * 0.35), y: 5, fuego: 3 }, humos: d.humos ? [{ x: cols * 0.15, y: 1.5 }, { x: cols * 0.8, y: 1.2 }, { x: cols * 0.9, y: 1.8 }] : [] };
  }
  /** Una ilustración chica con el motor (las del pueblo y las del códice). */
  function escenaEn(canvas, mapa, extra) {
    const r = canvas.getBoundingClientRect();
    const celda = Math.max(8, Math.ceil(Math.max((r.width || 300) / mapa[0].length, (r.height || 150) / mapa.length)));
    const m = CZ.crear(canvas, { celda });
    m.escena(Object.assign({ mapa, objetos: [], estacion: 'verano', clima: 'calma', hora: 'dia', altoContraste }, extra || {}));
    m.dibujar(1.6);
  }

  // ── Título y pueblo ───────────────────────────────────────────────────────
  function viajeEnCurso() { return !!(partida && !partida.terminada); }
  function pintarTitulo() {
    $('b-seguir').hidden = !viajeEnCurso();
    $('b-empezar').textContent = viajeEnCurso() ? 'Empezar otro viaje' : 'Empezar el viaje';
  }
  function pintarPueblo() {
    const l = herencia.leer(PUEBLO);
    $('gen-yagan').textContent = 'Generación ' + l.generacion + (l.saberes.length ? ' · ' + l.saberes.length + (l.saberes.length === 1 ? ' saber' : ' saberes') + ' en la memoria' : '');
    requestAnimationFrame(() => {
      escenaEn($('ilus-yagan'), ['GGLGGLGG', '..,,,,..', ',,,--,,,'], { canoa: { x: 3, y: 2, fuego: 4 }, hora: 'tarde' });
      escenaEn($('ilus-kawesqar'), ['~~~~~~~~', '~~~~~~~~', '~~~~~~~~'], { explorado: () => false, bordeNiebla: false });
      if (window.TDH_TERRITORIOS) TDH_TERRITORIOS.dibujar($('mapa-pueblos'), { ancho: 900, territorios: true, nombres: true, hoy: false, destacar: 'yagan' });
    });
  }
  // Empezar otro viaje con uno a medias: termina este, y lo aprendido igual pasa a la generación siguiente.
  $('b-empezar').addEventListener('click', (e) => {
    if (!viajeEnCurso()) return;
    if (!confirm('Si empezás otro viaje, este termina acá. Lo que aprendieron pasa a la generación siguiente.')) { e.stopImmediatePropagation(); return; }
    herencia.cerrarViaje(PUEBLO, partida.estado.aprendidos, { gano: false });
    partida = null;
  }, true);
  $('b-seguir').addEventListener('click', () => irConHumo('viaje'));
  $('b-yagan').addEventListener('click', () => { if (!viajeEnCurso()) partida = null; irConHumo('viaje'); });

  // ── El viaje ──────────────────────────────────────────────────────────────
  let partida = null, motor = null, vista = null, medida = null;
  let generacion = 1, cola = [], ocupado = false, ultimo = null;

  function nuevoViaje() {
    const linaje = herencia.leer(PUEBLO);
    generacion = linaje.generacion;
    const l = luz();
    const semilla = params.has('semilla') ? Number(params.get('semilla')) + generacion - 1 : Math.floor(Math.random() * 1e9);
    partida = TDH_PARTIDA.nueva({
      semilla, pueblo: PUEBLO,
      saberes: catalogoDe(PUEBLO),        // el catálogo entero del pueblo…
      heredados: linaje.saberes,          // …y lo que el linaje ya sabe: esas cartas no vuelven a salir
      destino: params.get('destino') || undefined,
      estacion: l.estacion, hora: l.hora,
    });
    motor = CZ.crear($('mapa'), { celda: 48 });
    medida = null; cola = []; ocupado = false;
    if (oido) oido.callar();
  }
  function entrarAlViaje() {
    if (!partida || partida.terminada) {
      nuevoViaje();
      medir(); pintar();
      // Con la luz real, el viaje puede empezar de noche: que se sepa por qué el fuego baja rápido.
      const deNoche = partida.estado.hora === 'noche' ? ' Es de noche: el frío gasta más el fuego. Amarrá en el cachiyuyo, junto a una playa, para pasar la noche.' : '';
      anunciar('Generación ' + generacion + '. Llevá el fuego hasta ' + partida.estado.destino.nombre + ', hacia el este.' + deNoche);
    } else { medir(); pintar(); }
  }
  /**
   * El tamaño de la celda se calcula solo al entrar al viaje y al cambiar el
   * tamaño de la pantalla. Al remar solo se mueve la vista: así el motor no
   * rearma el mapa entero en cada paso (en un celular lento se nota).
   */
  function medir() {
    const caja = $('caja-mapa').getBoundingClientRect(), M = partida.estado.mapa;
    if (!caja.width || !caja.height) return;
    const a = Math.min(M[0].length, caja.width < 760 ? 9 : 15);
    const h = Math.min(M.length, Math.max(5, Math.round(a * caja.height / caja.width)));
    const celda = Math.max(24, Math.floor(Math.min(caja.width / a, caja.height / h)));
    medida = { a, h, celda };
    seguirCanoa();
    motor.ajustar(celda);
    $('mapa').style.width = (a * motor.celda) + 'px';
    $('mapa').style.height = (h * motor.celda) + 'px';
  }
  function seguirCanoa() {
    if (!medida) return;
    const M = partida.estado.mapa, c = partida.estado.canoa, { a, h } = medida;
    vista = { x: Math.max(0, Math.min(M[0].length - a, c.x + 0.5 - a / 2)), y: Math.max(0, Math.min(M.length - h, c.y + 0.5 - h / 2)), ancho: a, alto: h };
    escena();
  }
  function escena() { motor.escena(Object.assign({}, partida.estado, { vista, altoContraste })); }

  // HUD: el fuego se dibuja animado; el resto son fichas con su ícono.
  const fuegoHud = document.createElement('canvas'); fuegoHud.width = 80; fuegoHud.height = 88; fuegoHud.setAttribute('aria-hidden', 'true');
  const CLIMA = { calma: ['icono-calma', 'Calma'], viento: ['icono-viento', 'Viento'], lluvia: ['icono-lluvia', 'Lluvia'] };
  const HORA = { dia: 'Día', tarde: 'Tarde', noche: 'Noche' };
  function ficha(icono, texto, clase) {
    const f = document.createElement('span'); f.className = 'ficha' + (clase ? ' ' + clase : '');
    if (icono) f.appendChild(typeof icono === 'string' ? ARTE.aCanvas(icono, 0, 'verano', 1) : icono);
    f.appendChild(document.createTextNode(texto)); return f;
  }
  const nombreDe = (id) => ((window.TDH_ELEMENTOS && TDH_ELEMENTOS.ELEMENTOS[id]) || { nombre: id }).nombre;
  function pintar() {
    const e = partida.estado, hud = $('hud');
    hud.textContent = '';
    hud.appendChild(ficha(fuegoHud, 'Fuego ' + e.canoa.fuego + ' de 4', 'ficha--fuego' + (e.canoa.fuego <= 1 ? ' ficha--alerta' : '')));
    hud.appendChild(ficha('icono-lena', 'Leña ' + e.recursos.lena));
    hud.appendChild(ficha('icono-comida', 'Comida ' + e.recursos.comida));
    if (e.recursos.pirita) hud.appendChild(ficha('icono-pirita', 'Pirita'));
    hud.appendChild(ficha(CLIMA[e.clima][0], CLIMA[e.clima][1]));
    hud.appendChild(ficha(null, HORA[e.hora]));
    hud.appendChild(ficha('icono-generacion', 'Gen. ' + generacion));
    const p = partida.puede();
    $('a-juntar').disabled = !p.juntar;
    $('a-juntar').textContent = p.juntar ? 'Juntar ' + nombreDe(p.juntar) : 'Juntar';
    $('a-avivar').disabled = !p.avivar;
    $('a-amarrar').disabled = !p.amarrar;
    $('a-describir').hidden = !conNarrador;
    // El mapa, contado en palabras: sirve de texto alternativo para un lector de pantalla.
    if (window.TDH_NARRADOR) $('mapa').setAttribute('aria-label', 'Mapa del viaje. ' + TDH_NARRADOR.describir(e, p));
  }
  function anunciar(t) {
    if (!t) return;
    const a = $('anuncio');
    a.textContent = t; a.classList.add('visible');
    // Queda a la vista lo que se tarda en leerlo, sin apuro.
    clearTimeout(anunciar.id); anunciar.id = setTimeout(() => a.classList.remove('visible'), Math.max(3400, 1500 + t.length * 55));
  }

  // Los textos de lo que pasó. El núcleo solo manda eventos.
  const CAUSA = { viento: 'el viento del canal', lluvia: 'la lluvia', noche: 'el frío de la noche' };
  const APAGADO = { viento: 'con el viento del canal', lluvia: 'con la lluvia', noche: 'con el frío de la noche', remar: 'de tanto remar' };
  function texto(ev) {
    switch (ev.tipo) {
      case 'fuego': {
        if (ev.motivo !== 'remar') return '';
        if (ev.despues === 0) return 'El fuego se apagó.';
        const pesa = (ev.causas || []).filter((c) => CAUSA[c]).map((c) => CAUSA[c]);
        return 'El fuego baja a ' + ev.despues + (pesa.length ? ': ' + pesa.join(' y ') + ' lo gasta' + (pesa.length > 1 ? 'n' : '') + ' más.' : '.');
      }
      case 'avivo': return 'El fuego se aviva.';
      case 'junto': return 'Juntaste ' + ev.nombre + '.';
      case 'clima': return { calma: 'El tiempo se calma.', viento: 'Se levanta viento.', lluvia: 'Empieza a llover.' }[ev.clima] || '';
      case 'hora': return { dia: 'Amanece.', tarde: 'Cae la tarde.', noche: 'Se hace de noche: el frío gasta más el fuego.' }[ev.hora] || '';
      case 'reencendido': return 'Con la pirita, el fuego vuelve a prender.';
      case 'acampe': return 'Amarraron la canoa en el cachiyuyo y pasaron la noche' + (ev.comio ? ', comiendo lo que juntaron.' : '. No había comida.');
      default: return '';
    }
  }
  async function atender(eventos) {
    const dichos = eventos.map(texto).filter(Boolean);
    if (dichos.length) anunciar(dichos.join(' '));
    for (const ev of eventos) {
      if (ev.tipo === 'saber' && SABERES[ev.id]) {
        cola = [];
        await TDH_CARTA.mostrar(SABERES[ev.id], { nueva: true, altoContraste });
      }
      if (ev.tipo === 'fin') { cola = []; terminar(ev); }
    }
  }
  async function hacer(accion) {
    if (ocupado || enTransicion || actual !== 'viaje' || !partida || partida.terminada || TDH_CARTA.abierta()) return false;
    const eventos = partida.hacer(accion);
    if (!eventos.length) { if (accion.tipo === 'remar') anunciar('La canoa solo va por el agua.'); return false; }
    const c = partida.estado.canoa;
    if (accion.tipo === 'remar') { c.remando = true; setTimeout(() => { c.remando = false; }, 400); }
    ocupado = true;
    try {
      seguirCanoa(); pintar();
      if (oido) { oido.eventos(eventos); oido.estado(partida.estado); }
      if (conNarrador && narrador) narrador.tras(eventos, partida.estado, partida.puede());
      await atender(eventos);
    } finally { ocupado = false; }
    if (partida && !partida.terminada) pintar();
    return eventos;
  }
  // Tocar lejos: rema casilla por casilla por el agua. Se corta si aparece una carta, si termina el
  // viaje, si el fuego queda en 1 o si cae la noche: así siempre hay tiempo de avivarlo o de acampar.
  async function seguirCola(alFinal) {
    while (cola.length && partida && !partida.terminada) {
      const p = cola.shift(), c = partida.estado.canoa;
      const eventos = await hacer({ tipo: 'remar', dx: p.x - c.x, dy: p.y - c.y });
      if (!eventos) { cola = []; return; }
      const aviso = eventos.some((ev) => (ev.tipo === 'fuego' && ev.despues <= 1 && ev.despues < ev.antes) || (ev.tipo === 'hora' && ev.hora === 'noche'));
      if (aviso && cola.length) { cola = []; return; }
      await new Promise((r) => setTimeout(r, reducido ? 0 : 150));
    }
    if (alFinal && partida && !partida.terminada) alFinal();
  }
  function remarHacia(x, y) {
    const e = partida.estado, c = e.canoa;
    if (x === c.x && y === c.y) return;
    const alLado = Math.abs(x - c.x) + Math.abs(y - c.y) <= 1;
    // Si tocó algo que se junta (en la playa o en el agua), va hasta al lado y lo junta.
    const algo = e.objetos.find((o) => o.junta && o.x === x && o.y === y);
    const juntarSiSePuede = () => { if (partida.puede().juntar) hacer({ tipo: 'juntar' }); };
    if (TDH_MAPA.navegable(e.mapa, x, y)) {
      cola = partida.camino(x, y) || [];
      if (!cola.length) { anunciar('No hay camino por agua hasta ahí.'); return; }
      seguirCola(algo ? juntarSiSePuede : null);
      return;
    }
    if (alLado) { if (algo) juntarSiSePuede(); return; }
    cola = TDH_MAPA.camino(e.mapa, c, (a, b) => Math.abs(a - x) + Math.abs(b - y) <= 1) || [];
    if (!cola.length) { anunciar('No hay camino por agua hasta ahí.'); return; }
    seguirCola(algo ? juntarSiSePuede : null);
  }
  $('mapa').addEventListener('click', (e) => {
    if (ocupado || !partida || partida.terminada) return;
    const c = motor.casillaEn(e.clientX, e.clientY);
    if (c) remarHacia(c.x, c.y);
  });
  document.querySelectorAll('[data-remar]').forEach((b) => b.addEventListener('click', () => {
    const [dx, dy] = b.dataset.remar.split(',').map(Number);
    cola = []; hacer({ tipo: 'remar', dx, dy });
  }));
  $('a-juntar').addEventListener('click', () => hacer({ tipo: 'juntar' }));
  $('a-avivar').addEventListener('click', () => hacer({ tipo: 'avivar' }));
  $('a-amarrar').addEventListener('click', () => hacer({ tipo: 'amarrar' }));
  $('a-describir').addEventListener('click', () => { if (narrador && partida) narrador.describir(partida.estado, partida.puede()); });
  $('a-pausa').addEventListener('click', () => { cola = []; irConHumo('titulo'); });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!$('postal').hidden) { if (e.key === 'Escape') cerrarPostal(); return; }
    if (actual !== 'viaje' || TDH_CARTA.abierta()) return;
    const sobreBoton = e.target && e.target.closest && e.target.closest('button, a, input');
    const t = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    if (t) { e.preventDefault(); cola = []; hacer({ tipo: 'remar', dx: t[0], dy: t[1] }); return; }
    const k = e.key.toLowerCase();
    if ((e.key === 'Enter' && !sobreBoton) || k === 'j') { e.preventDefault(); hacer({ tipo: 'juntar' }); }
    else if (k === 'f') hacer({ tipo: 'avivar' });
    else if (k === 'm') hacer({ tipo: 'amarrar' });
    else if (k === 'n' && narrador) narrador.describir(partida.estado, partida.puede());
    else if (e.key === 'Escape') { cola = []; irConHumo('titulo'); }
  });

  // ── Fin del viaje ─────────────────────────────────────────────────────────
  function terminar(ev) {
    const e = partida.estado;
    const desde = generacion;
    const linaje = herencia.cerrarViaje(PUEBLO, e.aprendidos, { gano: ev.gano });
    ultimo = { estado: e, gano: ev.gano, generacion: desde, hasta: linaje.generacion };
    const d = (window.TDH_DESTINOS && TDH_DESTINOS.DESTINOS[e.destino.id]) || null;
    const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    $('fin-sub').textContent = ev.gano ? 'Llegaron con el fuego encendido' : 'El fuego se apagó';
    $('t-fin').textContent = ev.gano ? mayus(e.destino.nombre) : 'El viaje termina acá';
    $('fin-texto').textContent = ev.gano
      ? 'Llegaron a ' + e.destino.nombre + ' después de ' + e.pasos + ' casillas.'
      : 'El fuego se apagó ' + (APAGADO[e.causa] || '') + ', después de ' + e.pasos + ' casillas. Pero lo aprendido no se pierde.';
    // Al llegar, el dato del destino con su fuente (juego/nucleo/territorio/destinos.js).
    $('fin-dato').hidden = !(ev.gano && d);
    if (ev.gano && d) $('fin-dato').textContent = d.dato + ' (' + d.fuente + ')';
    $('fin-lista-titulo').textContent = e.aprendidos.length ? 'Estos saberes pasan a la generación ' + linaje.generacion + ':' : 'Esta vez no aprendieron nada nuevo. Lo que ya sabía la familia sigue en la memoria.';
    const lista = $('fin-lista'); lista.textContent = '';
    for (const id of e.aprendidos) { const li = document.createElement('li'); li.innerHTML = SABERES[id].titulo; lista.appendChild(li); }
    setTimeout(() => irConHumo('fin'), reducido ? 0 : 700);
  }
  let pasando = false;
  $('b-generacion').addEventListener('click', async () => {
    if (pasando) return;
    pasando = true;
    try {
      // Si el humo de la pantalla anterior todavía se está abriendo, se espera a que termine.
      while (enTransicion) await new Promise((r) => setTimeout(r, 50));
      const l = herencia.leer(PUEBLO);
      if (oido) oido.generacion();
      if (window.TDH_TRANSICIONES && !reducido && ultimo) {
        enTransicion = true;
        try { await conTope(TDH_TRANSICIONES.pasoDelFuego(document.body, { desde: ultimo.generacion, hasta: l.generacion, saberes: l.saberes.map((id) => SABERES[id].titulo) }), 6500); }
        finally { enTransicion = false; }
      }
      partida = null;
      ir('viaje');
    } finally { pasando = false; }
  });

  // ── Postal ────────────────────────────────────────────────────────────────
  let lienzoPostal = null, focoAntesPostal = null;
  $('b-postal').addEventListener('click', () => {
    if (!ultimo || !window.TDH_POSTAL) return;
    focoAntesPostal = document.activeElement;
    const datos = TDH_POSTAL.datosDe(ultimo.estado, { generacion: ultimo.generacion, saberes: SABERES });
    lienzoPostal = TDH_POSTAL.dibujar(document.createElement('canvas'), datos);
    lienzoPostal.className = 'postal__imagen';
    lienzoPostal.setAttribute('role', 'img');
    lienzoPostal.setAttribute('aria-label', 'Postal del viaje de la generación ' + ultimo.generacion + ': el mapa con el recorrido, cómo terminó y ' + (datos.saberes.length ? 'los saberes aprendidos: ' + datos.saberes.join(', ').replace(/<[^>]+>/g, '') + '.' : 'que esta vez no aprendieron nada nuevo.'));
    const caja = $('postal-lienzo'); caja.textContent = ''; caja.appendChild(lienzoPostal);
    $('postal').hidden = false;
    $('b-bajar-postal').focus();
  });
  function cerrarPostal() { $('postal').hidden = true; if (focoAntesPostal && focoAntesPostal.focus) focoAntesPostal.focus(); }
  $('b-cerrar-postal').addEventListener('click', cerrarPostal);
  $('b-bajar-postal').addEventListener('click', () => { if (lienzoPostal) TDH_POSTAL.descargar(lienzoPostal, 'tierra-de-los-humos-generacion-' + ultimo.generacion + '.png'); });

  // ── Códice ────────────────────────────────────────────────────────────────
  function pintarCodice() {
    const l = herencia.leer(PUEBLO), sabe = new Set(l.saberes), ids = catalogoDe(PUEBLO);
    $('cuenta-codice').textContent = sabe.size + ' de ' + ids.length + ' saberes · generación ' + l.generacion;
    const cont = $('codice'); cont.textContent = '';
    const dibujar = [];
    for (const id of ids) {
      const c = SABERES[id];
      if (sabe.has(id)) {
        // Los textos de las cartas vienen del repo (datos/saberes.js): la fuente usa <i> para la obra.
        const a = document.createElement('article'); a.className = 'carta-saber papel';
        a.innerHTML = '<p class="carta-saber__tipo">Saber · Yagán · ' + c.tipo + '</p><canvas class="carta-saber__ilus" role="img"></canvas><h3 class="carta-saber__titulo">' + c.titulo + '</h3>' +
          '<p><span class="etiqueta etiqueta--dato">Dato</span> ' + c.dato + '</p><p><span class="etiqueta etiqueta--juego">En el juego</span> ' + c.juego + '</p>' +
          '<p class="carta-saber__fuente">Fuente: ' + c.fuente + '</p>' + (c.estado === 'borrador' ? '<p class="borrador">Texto en revisión con las fuentes.</p>' : '');
        const cv = a.querySelector('canvas'); cv.setAttribute('aria-label', c.alt || 'Ilustración de la carta');
        cont.appendChild(a); dibujar.push([cv, c.mapa, c.extra]);
      } else {
        const h = document.createElement('div'); h.className = 'carta-saber--humo'; h.setAttribute('role', 'img'); h.setAttribute('aria-label', 'Saber todavía no encontrado');
        const cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); h.appendChild(cv);
        const s = document.createElement('span'); s.textContent = 'Todavía en el humo'; h.appendChild(s);
        cont.appendChild(h); dibujar.push([cv, ['~~~~~~~~', '~~~~~~~~', '~~~~~~~~', '~~~~~~~~', '~~~~~~~~', '~~~~~~~~'], { explorado: () => false, bordeNiebla: false }]);
      }
    }
    requestAnimationFrame(() => dibujar.forEach(([cv, mapa, extra]) => { if (mapa) escenaEn(cv, mapa, extra); }));
    $('b-borrar').hidden = !l.saberes.length && l.generacion === 1;
  }
  $('b-borrar').addEventListener('click', () => {
    if (!confirm('¿Borrar la memoria de la familia yagán en este dispositivo? Se pierden los saberes guardados y se vuelve a la generación 1.')) return;
    herencia.borrar(PUEBLO);
    if (viajeEnCurso()) partida = null;
    pintarCodice();
    $('t-codice').focus();
  });

  // ── Cómo se juega ─────────────────────────────────────────────────────────
  function pintarAyuda() {
    const L = $('ayuda-lista'); if (L.children.length) return;
    const fila = (canvas, titulo, texto) => { const d = document.createElement('div'); d.className = 'papel'; canvas.setAttribute('aria-hidden', 'true'); d.appendChild(canvas); d.insertAdjacentHTML('beforeend', '<div><h3>' + titulo + '</h3><p>' + texto + '</p></div>'); L.appendChild(d); };
    const fz = document.createElement('canvas'); fz.width = 96; fz.height = 96; const x = fz.getContext('2d'); x.scale(2, 2); CZ.fuego(x, 24, 44, 1.2, 3, 1.2);
    fila(fz, 'El fuego es tu vida', 'Remar lo gasta, y más con viento en el canal hondo, con lluvia o de noche. Cerca de una choza se gasta menos. Si llega a 0, el viaje termina.');
    fila(ARTE.aCanvas('icono-lena', 0, 'verano', 3), 'Avivar el fuego', 'Usá leña para que el fuego crezca. La leña está en las playas.');
    fila(ARTE.aCanvas('icono-comida', 0, 'verano', 3), 'Lo que tiene borde de papel, se junta', 'Acercá la canoa y tocá «Juntar»: leña, comida, pirita y saberes. Con pirita, el fuego apagado vuelve a prender una vez.');
    fila(ARTE.aCanvas('icono-remo', 0, 'verano', 3), 'Remar', 'Tocá el agua y la canoa rema hasta ahí; si tocás algo que se junta, va y lo junta. También con las flechas, o con <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>. <kbd>Enter</kbd> junta, <kbd>F</kbd> aviva, <kbd>M</kbd> amarra y <kbd>Esc</kbd> pone pausa.');
    fila(ARTE.aCanvas('icono-refugio', 0, 'verano', 3), 'Amarrar y acampar', 'En el cachiyuyo, junto a una playa, pasan la noche: comen lo que juntaron, amanece y vuelve la calma.');
    fila(ARTE.aCanvas('icono-viento', 0, 'verano', 3), 'Escuchá y mirá el lugar', 'Con «Luz real de Ushuaia», el viaje empieza con la luz y la estación de ahora en el canal Beagle. Con sonido, el bosque, la playa y el canal suenan distinto, con subtítulos. Con el narrador, el viaje se cuenta en voz alta; <kbd>N</kbd> describe lo que rodea a la canoa.');
    fila(ARTE.aCanvas('icono-generacion', 0, 'verano', 3), 'Lo aprendido se hereda', 'Cada saber que encontrás queda en la memoria de la familia y pasa a la siguiente generación. Se guarda en este dispositivo y se ve en el códice.');
  }

  // ── Sonido, subtítulos y narrador ─────────────────────────────────────────
  const sonido = window.TDH_SONIDO ? TDH_SONIDO.crear() : null;
  const oido = sonido && window.TDH_SONIDO_JUEGO ? TDH_SONIDO_JUEGO.conectar(sonido, { saberes: SABERES }) : null;
  const narrador = window.TDH_NARRADOR && window.TDH_VOZ && TDH_VOZ.disponible() ? TDH_NARRADOR.conectar(TDH_VOZ, { saberes: SABERES }) : null;
  let conSonido = false;
  if (sonido) sonido.alSonar((t) => {
    const s = $('subtitulo'); if (!t) return;
    s.textContent = t; s.classList.add('visible');
    clearTimeout(s.reloj); s.reloj = setTimeout(() => s.classList.remove('visible'), 2400);
  });
  function sonarAmbiente() {
    if (!sonido || !conSonido) return;
    if (actual === 'viaje' && partida && oido) { oido.estado(partida.estado); return; }
    const triste = actual === 'fin' && ultimo && !ultimo.gano;
    sonido.ambiente({ viento: 0.2, mar: 0.5, bosque: 0.5, playa: 0.4, lluvia: triste ? 0.7 : 0, fuego: triste ? 0 : 3 });
  }
  function pintarOpciones() {
    const poner = (id, si, nombre) => { const b = $(id); b.setAttribute('aria-pressed', String(si)); b.textContent = nombre + ': ' + (si ? 'sí' : 'no'); };
    poner('b-sonido', conSonido, 'Sonido');
    poner('b-narrador', conNarrador, 'Narrador');
    poner('b-contraste', altoContraste, 'Alto contraste');
    poner('b-luz', luzReal, 'Luz real de Ushuaia');
    $('b-sonido').hidden = !sonido;
    $('b-narrador').hidden = !narrador;
    const aviso = $('aviso-luz');
    aviso.textContent = luzReal && window.TDH_LUZ_REAL ? TDH_LUZ_REAL.ahora().texto + ' El viaje empieza con esa luz.' : '';
    aviso.hidden = !luzReal;
    document.body.classList.toggle('alto-contraste', altoContraste);
  }
  $('b-sonido').addEventListener('click', async () => {
    if (!sonido) return;
    conSonido = !conSonido; pintarOpciones();
    if (conSonido) { await sonido.iniciar(); sonarAmbiente(); } else { if (oido) oido.callar(); sonido.pausar(); }
  });
  $('b-narrador').addEventListener('click', () => {
    conNarrador = !conNarrador; guardarPref('tdh-narrador', conNarrador); pintarOpciones();
    if (narrador) { if (conNarrador) TDH_VOZ.leer('Narrador encendido. En el viaje, la tecla N describe lo que rodea a la canoa.'); else narrador.callar(); }
  });
  $('b-contraste').addEventListener('click', () => {
    altoContraste = !altoContraste; guardarPref('tdh-alto-contraste', altoContraste); pintarOpciones();
    Object.values(fondos).forEach((m) => m.escena({ altoContraste }));
    if (partida && motor) escena();
  });
  $('b-luz').addEventListener('click', () => {
    luzReal = !luzReal; guardarPref('tdh-luz-real', luzReal); pintarOpciones();
    if (actual === 'titulo') prepararFondo('titulo');
  });

  // ── Bucle de dibujo ───────────────────────────────────────────────────────
  // 25 cuadros por segundo alcanzan para el agua y el fuego, y cuidan la batería.
  let antes = 0;
  function cuadro(ms) {
    if (ms - antes > 40) {
      antes = ms;
      const t = reducido ? 2 : ms / 1000;
      if (actual === 'viaje' && partida && motor) {
        motor.dibujar(t);
        const x = fuegoHud.getContext('2d');
        x.clearRect(0, 0, 80, 88); x.fillStyle = C.g; x.beginPath(); x.ellipse(40, 78, 26, 7, 0, 0, Math.PI * 2); x.fill();
        CZ.fuego(x, 40, 74, 1.7, partida.estado.canoa.fuego, t);
      } else if (fondos[actual]) fondos[actual].dibujar(t);
    }
    requestAnimationFrame(cuadro);
  }
  let espera = 0;
  addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(() => { prepararFondo(actual); if (actual === 'viaje' && partida) medir(); }, 150);
  });

  // ── Sin internet ──────────────────────────────────────────────────────────
  // Publicado (http o https), el navegador guarda el juego para abrirlo sin conexión (sw.js) y se
  // puede sumar a la pantalla de inicio (manifest.webmanifest). Con doble clic (file://) no hace falta.
  if (/^https?:$/.test(location.protocol)) {
    const m = document.createElement('link'); m.rel = 'manifest'; m.href = 'manifest.webmanifest';
    document.head.appendChild(m);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(() => {
        $('aviso-offline').hidden = false;
      }).catch(() => { /* sin service worker, el juego anda igual con internet */ });
    }
  }

  // Para las pruebas automáticas y el grabador del video: mirar la partida, sin tocarla.
  window.TDH_JUEGO = { get partida() { return partida; }, get pantalla() { return actual; }, herencia };

  pintarOpciones();
  ir('titulo');
  requestAnimationFrame(cuadro);
})();
