#!/usr/bin/env node
/*
 * Tierra de los Humos · Prueba de punta a punta, como una persona
 * ---------------------------------------------------------------
 * Abre el juego en varios celulares y en una computadora, y juega partidas
 * enteras tocando los botones y el mapa, como lo haría alguien. No mira el
 * código del juego: solo lo que se ve en la pantalla. Por eso sirve igual
 * para la página de prueba del núcleo y para el juego publicado.
 *
 * Uso, desde la raíz del repo:
 *   node pruebas/de-punta-a-punta.cjs                         # prueba index.html
 *   node pruebas/de-punta-a-punta.cjs pruebas/nucleo.html     # otra página
 *   node pruebas/de-punta-a-punta.cjs index.html --rapido     # un solo celular y una partida
 *   node pruebas/de-punta-a-punta.cjs index.html --pantalla=galaxy   # una sola pantalla
 * Necesita Playwright (npm i -D playwright). Licencia: MIT.
 *
 * Qué revisa en cada pantalla:
 *   - que no haya errores de JavaScript ni archivos que no cargan;
 *   - que la página no se corra de costado (sin scroll horizontal);
 *   - que los botones se puedan tocar con el dedo (44 px; menos de 24 px es error);
 *   - que se vea cuánto fuego queda («Fuego N de 4»);
 *   - que cuando aparece una carta, su fuente y sus botones entren en la pantalla;
 *   - que el viaje llegue a un final (se gane o se pierda) y que se pueda
 *     empezar la generación siguiente;
 *   - cuánto tarda en responder cada toque.
 * Si algo falla, guarda una captura y termina con código 1.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const { chromium, devices } = require('playwright');

const args = process.argv.slice(2);
const rapido = args.includes('--rapido');
const pagina = args.find((a) => !a.startsWith('--')) || 'index.html';
const url = 'file://' + path.resolve(__dirname, '..', pagina) + (pagina.includes('?') ? '' : '');
const SALIDA = fs.mkdtempSync(path.join(os.tmpdir(), 'tdh-punta-a-punta-'));

// Los textos de la interfaz (los mismos en la maqueta, la prueba del núcleo y el juego).
const UI = {
  empezar: /^(Empezar el viaje|Jugar)$/,
  guardarCarta: /^(Guardar en la memoria|Seguir)$/,
  siguiente: /^Empezar la generación siguiente$/,
  juntar: /^Juntar/,   // «Juntar» o «Juntar leña»
  avivar: /^Avivar el fuego$/,
  amarrar: /^Amarrar y acampar$/,
  fuego: /Fuego (\d) de 4/,
};
const soloPantalla = (args.find((a) => a.startsWith('--pantalla=')) || '').slice(11);
const TODAS = rapido
  ? [['Pixel 5', devices['Pixel 5']]]
  : [['iPhone SE (chico)', devices['iPhone SE']], ['Pixel 5', devices['Pixel 5']], ['Galaxy S9+', devices['Galaxy S9+']], ['Pixel 5 acostado', devices['Pixel 5 landscape']], ['Computadora', { viewport: { width: 1280, height: 800 } }]];
const PANTALLAS = soloPantalla ? TODAS.filter(([n]) => n.toLowerCase().includes(soloPantalla.toLowerCase())) : TODAS;
const PARTIDAS = rapido ? 1 : 2;
const MAX_ACCIONES = 400;

(async () => {
  const nav = await chromium.launch();
  const informe = [];
  let fallo = false;
  for (const [nombre, disp] of PANTALLAS) {
    const r = { pantalla: nombre, errores: [], avisos: [], partidas: [], tiempos: [] };
    const ctx = await nav.newContext(Object.assign({}, disp, { reducedMotion: 'reduce' }));
    const p = await ctx.newPage();
    p.on('pageerror', (e) => r.errores.push('Error de JavaScript: ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error') r.errores.push('Error en la consola: ' + m.text()); });
    p.on('requestfailed', (q) => r.errores.push('No carga: ' + q.url().replace(/^file:\/\/.*?\/Tierra-de-los-Humos\//, '')));
    await p.goto(url);
    await p.waitForTimeout(1200);
    const boton = (re) => p.getByRole('button', { name: re }).first();
    const visible = async (re) => { const b = boton(re); return (await b.count()) > 0 && (await b.isVisible()); };
    const habilitado = async (re) => (await visible(re)) && (await boton(re).isEnabled());

    // Si hay pantalla de título, empezar.
    if (await visible(UI.empezar)) { await boton(UI.empezar).click(); await p.waitForTimeout(1500); }
    // Algunas pantallas piden elegir pueblo
    const yagan = p.getByRole('button', { name: /yag[aá]n/i }).first();
    if ((await yagan.count()) && (await yagan.isVisible())) { await yagan.click(); await p.waitForTimeout(1500); }

    // ── Revisiones de la pantalla ──
    const revisarPantalla = async (momento) => {
      const corrido = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (corrido > 1) r.errores.push(momento + ': la página se corre de costado (' + corrido + ' px de más).');
      const chicos = await p.evaluate(() => [...document.querySelectorAll('button, [role=button], a')].filter((b) => {
        const s = getComputedStyle(b), q = b.getBoundingClientRect();
        return s.visibility !== 'hidden' && s.display !== 'none' && q.width > 0 && q.height > 0 && !b.closest('[inert]');
      }).map((b) => { const q = b.getBoundingClientRect(); return { t: (b.getAttribute('aria-label') || b.textContent).trim().slice(0, 30), w: Math.round(q.width), h: Math.round(q.height) }; }).filter((b) => b.w < 44 || b.h < 44));
      for (const b of chicos) (b.w < 24 || b.h < 24 ? r.errores : r.avisos).push(momento + ': el botón «' + b.t + '» mide ' + b.w + ' × ' + b.h + ' px (conviene 44 × 44).');
    };
    await revisarPantalla('Al empezar');
    const textoFuego = async () => { const m = (await p.textContent('body')).match(UI.fuego); return m ? Number(m[1]) : null; };
    if ((await textoFuego()) == null) r.errores.push('No se ve cuánto fuego queda («Fuego N de 4»).');

    // ── Jugar ──
    let cartasVistas = 0, acampoRecien = false, acampesSeguidos = 0, bloqueadoEste = false, vertical = -1, vueltas = 0, pasosBordeando = 0;
    for (let n = 0; n < PARTIDAS; n++) {
      let termino = false, acciones = 0;
      while (!termino && acciones < MAX_ACCIONES) {
        acciones++;
        if (await visible(UI.guardarCarta)) {
          cartasVistas++;
          const dentro = await p.evaluate(() => {
            const f = document.querySelector('.carta-saber__fuente'); if (!f) return 'sin fuente';
            const q = f.getBoundingClientRect(); return q.top >= 0 && q.bottom <= innerHeight + 1 ? 'ok' : 'fuera';
          });
          if (dentro === 'sin fuente') r.errores.push('Apareció una carta sin fuente a la vista.');
          else if (dentro === 'fuera') r.errores.push('Apareció una carta con la fuente fuera de la pantalla.');
          if (cartasVistas === 1) { await revisarPantalla('Con una carta abierta'); await p.screenshot({ path: path.join(SALIDA, nombre + '-carta.png') }); }
          await boton(UI.guardarCarta).click(); await p.waitForTimeout(450);
          continue;
        }
        if (await visible(UI.siguiente)) {
          const titulo = (await p.locator('[role=dialog] h2, .fin h2').first().textContent().catch(() => '')) || '';
          r.partidas.push({ acciones, final: titulo.trim() });
          await p.screenshot({ path: path.join(SALIDA, nombre + '-fin-' + (n + 1) + '.png') });
          await revisarPantalla('En el final del viaje');
          await boton(UI.siguiente).click(); await p.waitForTimeout(1200);
          termino = true; break;
        }
        const t0 = Date.now();
        const fuego = await textoFuego();
        if (await habilitado(UI.juntar)) await boton(UI.juntar).click();
        else if (fuego != null && fuego <= 2 && (await habilitado(UI.avivar))) await boton(UI.avivar).click();
        else if (fuego != null && fuego <= 1 && !acampoRecien && (await habilitado(UI.amarrar))) {
          await boton(UI.amarrar).click(); acampoRecien = true; acampesSeguidos++;
          if (acampesSeguidos === 3) r.avisos.push('Se puede acampar noche tras noche sin gastar fuego: una partida podría no terminar nunca.');
          r.tiempos.push(Date.now() - t0); await p.waitForTimeout(120); continue;
        }
        else {
          // Remar como una persona: hacia el este (ahí está el destino) y, si la costa lo impide,
          // bordearla hacia arriba o hacia abajo hasta poder seguir.
          acampoRecien = false;
          const tecla = bloqueadoEste ? (vertical < 0 ? 'ArrowUp' : 'ArrowDown') : 'ArrowRight';
          await p.keyboard.press(tecla);
          await p.waitForTimeout(220);
          const aviso = (await p.textContent('[role=status]').catch(() => '')) || '';
          // El aviso se borra después de leerlo: si vuelve a aparecer, es un choque nuevo.
          const choco = /solo va por el agua|no se puede remar/i.test(aviso);
          if (tecla === 'ArrowRight') { if (choco) { bloqueadoEste = true; pasosBordeando = 0; } }
          else if (choco) { vertical = -vertical; vueltas++; if (vueltas > 3) { bloqueadoEste = false; vueltas = 0; } }
          else if (++pasosBordeando >= 1) { bloqueadoEste = false; }
          if (choco) await p.evaluate(() => { const s = document.querySelector('[role=status]'); if (s) s.textContent = ''; });
        }
        r.tiempos.push(Date.now() - t0);
        await p.waitForTimeout(120);
      }
      if (!termino) r.errores.push('La partida ' + (n + 1) + ' no terminó después de ' + MAX_ACCIONES + ' acciones.');
    }
    if (!cartasVistas) r.avisos.push('No apareció ninguna carta de saber.');
    if (r.errores.length) { fallo = true; await p.screenshot({ path: path.join(SALIDA, nombre + '-error.png') }); }
    informe.push(r);
    await ctx.close();
  }
  await nav.close();

  // ── Informe ──
  console.log('\nPrueba de punta a punta · ' + pagina + '\n');
  for (const r of informe) {
    const prom = r.tiempos.length ? Math.round(r.tiempos.reduce((a, b) => a + b, 0) / r.tiempos.length) : 0;
    console.log((r.errores.length ? '✗ ' : '✓ ') + r.pantalla + ': ' + r.partidas.length + ' partida(s) ' + r.partidas.map((x) => '«' + x.final + '» en ' + x.acciones + ' acciones').join(', ') + ' · cada toque tarda ' + prom + ' ms en promedio');
    r.errores.forEach((e) => console.log('    error: ' + e));
    [...new Set(r.avisos)].slice(0, 6).forEach((e) => console.log('    aviso: ' + e));
  }
  console.log('\nCapturas en ' + SALIDA);
  process.exit(fallo ? 1 : 0);
})();
