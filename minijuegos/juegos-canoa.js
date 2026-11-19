/*
 * Tierra de los Humos · Minijuegos en la canoa (19/11)
 * ----------------------------------------------------
 * Tres maneras de jugar que se hacen con un solo gesto: mantener apretado y soltar
 * (en la escena, en el botón grande o con la barra espaciadora).
 *
 *   seguir (pescado)   mantener el lazo sobre el pez hasta llenar la barra. Apretado, el
 *                      lazo sube; suelto, baja (como en los juegos de pesca de un botón).
 *   cargar (avivar)    mantener apretado para sumar leña y soltar dentro de la franja:
 *                      de menos no prende, de más lo ahoga. Tres intentos.
 *   guiar  (amarrar)   la corriente empuja la canoa; tocar a un lado o al otro (o las
 *                      flechas) para dejarla sobre el cachiyuyo hasta llenar la barra.
 *
 * `auto` juega solo, por los mismos caminos que una persona (para las pruebas y el video).
 * La mecánica es recurso de juego. Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const M = {};
  const ESPACIO = (e) => e.key === ' ' || e.key === 'Enter';

  /** Mantener apretado en la escena, en un botón y con la barra: llama a bajar() y subir(). */
  function apretable(c, texto, bajar, subir) {
    const b = c.botonMantener(texto, bajar, subir);
    c.escena.addEventListener('pointerdown', (e) => { e.preventDefault(); bajar(); });
    const fuera = () => subir();
    raiz.addEventListener('pointerup', fuera); raiz.addEventListener('pointercancel', fuera);
    c.alCerrar(() => { raiz.removeEventListener('pointerup', fuera); raiz.removeEventListener('pointercancel', fuera); });
    setTimeout(() => b.focus({ preventScroll: true }), 30);
    return {
      tecla(e, baja) { if (!ESPACIO(e)) return false; if (baja) { if (!e.repeat) bajar(); } else subir(); return true; },
    };
  }

  // ── Seguir: el lazo sobre el pez ───────────────────────────────────────────
  M.seguir = function (c) {
    const j = c.j, ancho = j.ancho / Math.sqrt(c.velocidad);
    const pista = c.crear('div', 'mj__pista mj__pista--alta', c.escena);
    if (c.r() < 0.5) { pista.style.right = 'auto'; pista.style.left = '6%'; }   // a un lado o al otro (19/11)
    const lazo = c.crear('div', 'mj__zona', pista); c.crear('span', null, lazo, 'lazo');
    lazo.style.height = ancho * 100 + '%';
    const pez = c.crear('div', 'mj__marca', pista); const im = c.crear('img', null, pez); im.src = c.imagen(j.objeto); im.alt = '';
    // Posiciones de 0 (abajo) a 1 (arriba).
    // El pez arranca sobre el lazo y quieto un momento: da tiempo de entender qué pasa.
    const y0 = c.r() * (1 - ancho);   // el lazo arranca a una altura distinta cada vez, con el pez adentro
    let y = y0, v = 0, py = y0 + ancho / 2, objetivo = py, cambio = 1.2, apretado = false, lleno = 0.3, fuera = 0, empezo = false;
    const control = apretable(c, j.boton, () => { apretado = true; empezo = true; c.empezo(); }, () => { apretado = false; });
    c.progreso(lleno);
    const dentro = () => py >= y && py <= y + ancho;
    return {
      tecla: control.tecla,
      mover(s, dt) {
        // El pez cambia de rumbo cada tanto; con racha, más seguido y más rápido.
        if (s >= cambio) { objetivo = 0.08 + c.r() * 0.84; cambio = s + (0.7 + c.r() * 1.1) / c.velocidad; }
        py += Math.sign(objetivo - py) * Math.min(Math.abs(objetivo - py), dt * 0.38 * c.velocidad);
        // El lazo: sube apretado, baja suelto, con un poco de inercia.
        v += (apretado ? 1.9 : -1.5) * dt; v *= 0.9;
        y += v * dt * 3;
        if (y < 0) { y = 0; v = 0; } if (y > 1 - ancho) { y = 1 - ancho; v = 0; }
        lazo.style.bottom = y * 100 + '%';
        pez.style.top = (1 - py) * 100 + '%';
        const si = dentro();
        lazo.classList.toggle('dentro', si);
        // La barra sube con el pez en el lazo y baja despacio si se va (nunca antes de empezar).
        if (si) lleno += dt * 0.4; else if (empezo || s > 1.2) lleno = Math.max(0, lleno - dt * 0.16);
        fuera = si ? 0 : fuera + dt;
        if (fuera > 0.8 && lleno < 0.95) c.manchar();
        c.progreso(lleno);
        if (lleno >= 1) c.ganar();   // si no llega a tiempo, el marco dice «Se hizo tarde»
      },
      auto() { apretado = y + ancho / 2 < py; },
    };
  };

  // ── Cargar: la leña justa ──────────────────────────────────────────────────
  M.cargar = function (c) {
    const j = c.j, angosta = (j.franja[1] - j.franja[0]) / c.velocidad;
    const llama = c.crear('canvas', 'mj__llama', c.escena); llama.width = 160; llama.height = 220; llama.setAttribute('aria-hidden', 'true');
    const medidor = c.crear('div', 'mj__medidor', c.escena);
    if (c.r() < 0.5) { medidor.style.left = '22%'; llama.style.left = '44%'; }   // el fuego y el medidor, a un lado o al otro
    const z = c.crear('div', 'mj__zona', medidor);
    // La franja cambia de altura en cada intento (19/11): entre la mitad y casi arriba.
    let medio = 0, franja = [0, 0];
    function nuevaFranja() {
      medio = 0.42 + angosta / 2 + c.r() * (0.92 - 0.42 - angosta);
      franja = [medio - angosta / 2, medio + angosta / 2];
      z.style.bottom = franja[0] * 100 + '%'; z.style.height = (franja[1] - franja[0]) * 100 + '%';
    }
    nuevaFranja();
    const nivelDiv = c.crear('div', 'mj__nivel', medidor);
    let nivel = 0, apretado = false, intentos = j.intentos, t = 0;
    const CZ = raiz.TDH_CORTEZA;
    function soltar() {
      if (!apretado) return;
      apretado = false;
      if (nivel >= franja[0] && nivel <= franja[1]) { c.ganar(Math.abs(nivel - medio) <= angosta * 0.22); return; }
      intentos--;
      c.error((nivel < franja[0] ? 'Le faltó leña.' : '¡Lo ahogaste!') + (intentos ? ' ' + (intentos === 1 ? 'Queda 1 intento.' : 'Quedan ' + intentos + ' intentos.') : ''));
      nivel = 0;
      if (!intentos) c.perder('No prendió esta vez.'); else nuevaFranja();
    }
    const control = apretable(c, j.boton, () => { if (!c.terminado) { apretado = true; nivel = 0; c.empezo(); } }, soltar);
    c.decir(intentos + ' intentos.');
    return {
      tecla: control.tecla,
      mover(s, dt) {
        t += dt;
        if (apretado) {
          nivel += dt * (0.42 + nivel * 0.6) * c.velocidad;
          if (nivel >= 1) { nivel = 1.01; soltar(); }
        }
        nivelDiv.style.height = Math.min(1, nivel) * 100 + '%';
        const x = llama.getContext('2d');
        x.clearRect(0, 0, 160, 220);
        x.fillStyle = '#463f3b'; x.beginPath(); x.ellipse(80, 200, 52, 12, 0, 0, Math.PI * 2); x.fill();
        if (CZ) { try { CZ.fuego(x, 80, 196, 3.2, nivel <= 0.02 ? 0 : Math.max(1, Math.min(4, Math.ceil(nivel * 4))), c.reducido ? 2 : t); } catch (e) { /* sin dibujo */ } }
      },
      auto() { if (!apretado && nivel === 0) { apretado = true; c.empezo(); } else if (apretado && nivel >= medio) soltar(); },
    };
  };

  // ── Guiar: la canoa sobre el cachiyuyo ─────────────────────────────────────
  M.guiar = function (c) {
    const j = c.j;
    const pista = c.crear('div', 'mj__pista mj__pista--ancha', c.escena);
    // El cachiyuyo ocupa 3 de las 10 columnas del fondo, en la fila de la pista; la zona va justo encima.
    const col = 1 + Math.floor(c.r() * 6), PISTA = [0.06, 0.94];
    const fila = '-'.repeat(col) + 'kkk' + '-'.repeat(10 - col - 3);
    c.fondo(['GGLGGGLGGG', '..........', ',,,,,,,,,,', '----------', fila, '~~~~~~~~~~']);
    const desde = (col / 10 - PISTA[0]) / (PISTA[1] - PISTA[0]), ancho = 0.3 / (PISTA[1] - PISTA[0]);
    const z = c.crear('div', 'mj__zona', pista); z.style.left = desde * 100 + '%'; z.style.width = ancho * 100 + '%';
    c.crear('span', null, z, 'cachiyuyo');
    const canoa = c.crear('div', 'mj__marca', pista); const im = c.crear('img', null, canoa); im.src = c.imagen('canoa'); im.alt = '';
    c.crear('span', 'mj__lado', c.escena, '◀').style.left = '3%';
    c.crear('span', 'mj__lado', c.escena, '▶').style.right = '3%';
    // La canoa arranca lejos del cachiyuyo, del lado con más lugar.
    let x = desde > 0.5 ? 0.08 : 0.92, v = 0, empuje = 0, lleno = 0, entro = false, fuera = 0, teclas = new Set();
    const empujar = (d) => { empuje = d; c.empezo(); };
    c.escena.addEventListener('pointerdown', (e) => { e.preventDefault(); empujar(c.pos(e).x < x ? -1 : 1); });
    const soltar = () => { empuje = 0; };
    raiz.addEventListener('pointerup', soltar); raiz.addEventListener('pointercancel', soltar);
    c.alCerrar(() => { raiz.removeEventListener('pointerup', soltar); raiz.removeEventListener('pointercancel', soltar); });
    const izq = c.botonMantener('◀ Remar', () => empujar(-1), soltar);
    const der = c.botonMantener('Remar ▶', () => empujar(1), soltar);
    izq.setAttribute('aria-label', 'Remar hacia la izquierda'); der.setAttribute('aria-label', 'Remar hacia la derecha');
    setTimeout(() => (x > 0.5 ? izq : der).focus({ preventScroll: true }), 30);
    c.progreso(0);
    return {
      tecla(e, baja) {
        const d = { ArrowLeft: -1, a: -1, A: -1, ArrowRight: 1, d: 1, D: 1 }[e.key];
        if (!d) {
          if (!ESPACIO(e)) return false;
          const f = document.activeElement;
          if (f === izq || f === der) { if (baja) { if (!e.repeat) empujar(f === izq ? -1 : 1); } else soltar(); return true; }
          return false;
        }
        if (baja) teclas.add(d); else teclas.delete(d);
        empuje = teclas.size ? [...teclas].pop() : 0; c.empezo();
        return true;
      },
      mover(s, dt) {
        // La corriente: va y viene, con ráfagas. Con racha, empuja más.
        const corriente = (Math.sin(s * 0.9) * 0.22 + Math.sin(s * 2.3 + 1) * 0.12) * c.velocidad;
        v += (corriente + empuje * 0.85) * dt; v *= 0.93;
        x += v * dt * 1.6;
        if (x < 0.04) { x = 0.04; v = 0; } if (x > 0.96) { x = 0.96; v = 0; }
        canoa.style.left = x * 100 + '%';
        const si = x >= desde && x <= desde + ancho;
        z.classList.toggle('dentro', si);
        if (si) entro = true;
        lleno = Math.max(0, lleno + (si ? dt / 2.2 : -dt * 0.15));
        fuera = si || !entro ? 0 : fuera + dt;
        if (fuera > 1) c.manchar();
        c.progreso(lleno);
        if (lleno >= 1) c.ganar();
      },
      auto() { const m = desde + ancho / 2; empuje = Math.abs(m - x) < 0.02 ? 0 : (m > x ? 1 : -1) * Math.min(1, Math.abs(m - x) * 8) - v * 2; },
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = M;
  else raiz.TDH_MJ_MECANICAS = Object.assign(raiz.TDH_MJ_MECANICAS || {}, M);
})(typeof window !== 'undefined' ? window : globalThis);
