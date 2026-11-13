#!/usr/bin/env node
/*
 * Tierra de los Humos · Graba los clips del video jugando de verdad
 * -----------------------------------------------------------------
 * Abre el juego y graba un clip por cada cuadro del storyboard (README.md de
 * esta carpeta), jugando solo: el humo que se abre, el viaje, una carta, el
 * final y la herencia, el códice y el juego en un celular. También escribe los
 * subtítulos (subtitulos.srt) con la voz del storyboard. Después se editan en
 * Shotcut o DaVinci Resolve y se suman las voces del equipo.
 *
 * Uso, desde la raíz del repo:
 *   node equipo/video/grabar.cjs                          # el juego (index.html) y el núcleo
 *   node equipo/video/grabar.cjs --viaje pruebas/nucleo.html
 * Necesita Playwright (npm i -D playwright). Licencia: MIT.
 *
 * Los clips quedan en equipo/video/clips/ (en .webm, 1920 × 1080). No se suben
 * al repositorio: pesan mucho (ver .gitignore). Los subtítulos sí.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium, devices } = require('playwright');

const args = process.argv.slice(2);
const opcion = (n, porDefecto) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : porDefecto; };
const RAIZ = path.resolve(__dirname, '..', '..');
const TITULO = opcion('titulo', 'index.html');
const VIAJE = opcion('viaje', fs.existsSync(path.join(RAIZ, 'juego/nucleo/partida.js')) ? 'pruebas/nucleo.html' : 'arte/pantallas/index.html');
const CODICE = opcion('codice', 'arte/pantallas/index.html');
const SEMILLA = opcion('semilla', '5');
const CLIPS = path.join(__dirname, 'clips');
fs.mkdirSync(CLIPS, { recursive: true });
const url = (p, q) => 'file://' + path.join(RAIZ, p) + (q ? (p.includes('?') ? '&' : '?') + q : '');

// ── Subtítulos: la columna «Voz» del storyboard ──
function subtitulos() {
  const filas = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8').split('\n').filter((l) => /^\| \d+ \| \d+:\d\d a \d+:\d\d \|/.test(l));
  const seg = (t) => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
  const hora = (s) => '00:' + String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0') + ',000';
  const srt = filas.map((l, i) => {
    const c = l.split('|').map((x) => x.trim());
    const [desde, hasta] = c[2].split(' a ').map(seg);
    const voz = c[5].replace(/[«»]/g, '').replace(/\[[^\]]*\]/g, '…');
    return (i + 1) + '\n' + hora(desde) + ' --> ' + hora(hasta) + '\n' + voz + '\n';
  }).join('\n');
  fs.writeFileSync(path.join(__dirname, 'subtitulos.srt'), srt);
  return filas.length;
}

(async () => {
  console.log('Subtítulos: ' + subtitulos() + ' tramos en equipo/video/subtitulos.srt');
  const nav = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const TAM = { width: 1920, height: 1080 };

  async function grabar(nombre, pagina, accion, contexto) {
    const ctx = await nav.newContext(Object.assign({ viewport: TAM, deviceScaleFactor: 1, recordVideo: { dir: CLIPS, size: TAM } }, contexto || {}));
    const p = await ctx.newPage();
    const errores = [];
    p.on('pageerror', (e) => errores.push(e.message));
    await p.goto(pagina);
    await p.waitForTimeout(1200);
    try { await accion(p); } catch (e) { errores.push(e.message); }
    const video = p.video();
    await ctx.close();
    const destino = path.join(CLIPS, nombre + '.webm');
    if (video) { fs.renameSync(await video.path(), destino); }
    console.log((errores.length ? '✗ ' : '✓ ') + nombre + '.webm' + (errores.length ? ' · ' + errores.join(' | ') : ''));
  }

  // Ayudas para jugar
  const boton = (p, re) => p.getByRole('button', { name: re }).first();
  const visible = async (p, re) => { const b = boton(p, re); return (await b.count()) > 0 && (await b.isVisible()); };
  async function remar(p, teclas, pausa) {
    for (const t of teclas) {
      if (await visible(p, /^(Guardar en la memoria|Seguir)$/)) return 'carta';
      if (await visible(p, /Empezar la generación siguiente/)) return 'fin';
      if (await visible(p, /^Juntar$/) && (await boton(p, /^Juntar$/).isEnabled())) { await boton(p, /^Juntar$/).click(); await p.waitForTimeout(pausa); }
      await p.keyboard.press(t);
      await p.waitForTimeout(pausa);
    }
    return 'sigue';
  }
  const ESTE = 'ArrowRight';

  // 1. Título: la costa de papel y el humo, cámara quieta.
  await grabar('01-titulo', url(TITULO), (p) => p.waitForTimeout(12000));

  // 2. El humo se abre: la canoa rema y descubre el canal.
  await grabar('02-humo', url(VIAJE, 'semilla=' + SEMILLA), async (p) => {
    await p.waitForTimeout(800);
    if (await visible(p, /^(Guardar en la memoria|Seguir)$/)) await boton(p, /^(Guardar en la memoria|Seguir)$/).click();
    await remar(p, Array(9).fill(ESTE), 1100);
    await p.waitForTimeout(1200);
  });

  // 4. El viaje: remar, juntar, avivar el fuego. 5. La carta: se queda abierta para leerla.
  await grabar('04-viaje-y-05-carta', url(VIAJE, 'semilla=' + SEMILLA), async (p) => {
    let cartas = 0;
    for (let i = 0; i < 40; i++) {
      const r = await remar(p, [ESTE, i % 4 === 3 ? 'ArrowDown' : ESTE], 700);
      if (r === 'carta') { cartas++; await p.waitForTimeout(cartas === 1 ? 9000 : 2500); await boton(p, /^(Guardar en la memoria|Seguir)$/).click(); await p.waitForTimeout(600); }
      if (r === 'fin') break;
      if (await visible(p, /^Avivar el fuego$/) && /Fuego [12] de 4/.test(await p.textContent('body'))) { await boton(p, /^Avivar el fuego$/).click(); await p.waitForTimeout(900); }
      if (cartas >= 2 && i > 20) break;
    }
  });

  // 6. El fuego se apaga y lo aprendido pasa a la generación siguiente (rema sin cuidar el fuego).
  await grabar('06-fin-y-herencia', url(VIAJE, 'semilla=' + (Number(SEMILLA) + 1)), async (p) => {
    for (let i = 0; i < 120; i++) {
      if (await visible(p, /^(Guardar en la memoria|Seguir)$/)) { await boton(p, /^(Guardar en la memoria|Seguir)$/).click(); await p.waitForTimeout(400); continue; }
      if (await visible(p, /Empezar la generación siguiente/)) { await p.waitForTimeout(7000); await boton(p, /Empezar la generación siguiente/).click(); await p.waitForTimeout(4000); return; }
      await p.keyboard.press(i % 5 === 4 ? 'ArrowUp' : ESTE); await p.waitForTimeout(260);
    }
  });

  // 7. El códice, recorrido despacio.
  await grabar('07-codice', url(CODICE), async (p) => {
    const b = p.locator('[data-ir="codice"]').first();
    if (await b.count()) { await b.click({ force: true }); await p.waitForTimeout(1500); }
    for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 260); await p.waitForTimeout(1300); }
    await p.waitForTimeout(1500);
  });

  // 9. El juego en un celular (para mostrar dentro de una toma del teléfono en la mano).
  await grabar('09-celular', url(VIAJE, 'semilla=' + (Number(SEMILLA) + 2)), async (p) => {
    for (let i = 0; i < 14; i++) {
      const r = await remar(p, [ESTE], 800);
      if (r === 'carta') { await p.waitForTimeout(3500); await boton(p, /^(Guardar en la memoria|Seguir)$/).click(); }
      if (r === 'fin') break;
    }
  }, Object.assign({}, devices['Pixel 5'], { deviceScaleFactor: 1, recordVideo: { dir: CLIPS, size: { width: 393, height: 851 } } }));

  await nav.close();
  console.log('Listo. Clips en equipo/video/clips/');
})();
