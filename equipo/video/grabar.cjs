#!/usr/bin/env node
/*
 * Tierra de los Humos · Graba los clips del video jugando de verdad
 * -----------------------------------------------------------------
 * Abre el juego (index.html) y graba un clip por cuadro del storyboard
 * (README.md de esta carpeta), jugando solo: el título, el humo que se abre,
 * la elección del pueblo, el viaje, una carta, el final y la herencia, el
 * códice y el juego en un celular. Con --solo-fotos saca los cuadros (.jpg)
 * del storyboard. También escribe los
 * subtítulos (subtitulos.srt) con la voz del storyboard. Después se editan en
 * Shotcut o DaVinci Resolve y se suman las voces del equipo.
 *
 * Uso, desde la raíz del repo:
 *   node equipo/video/grabar.cjs                          # todo, desde el juego (index.html)
 *   node equipo/video/grabar.cjs --semilla 7              # otro mapa
 *   node equipo/video/grabar.cjs --solo-subtitulos        # solo subtitulos.srt, sin grabar
 *   node equipo/video/grabar.cjs --solo-fotos             # solo los cuadros del storyboard (.jpg)
 *   node equipo/video/grabar.cjs --solo 07                # solo un clip (el del códice)
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
const JUEGO = opcion('juego', 'index.html');
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
  if (args.includes('--solo-subtitulos')) return;
  const soloFotos = args.includes('--solo-fotos');
  const nav = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const TAM = { width: 1920, height: 1080 };
  const FOTO = { width: 1280, height: 720 };

  // Graba un clip. Con --solo-fotos no graba: saca el cuadro del storyboard en el momento justo.
  const solo = opcion('solo', '');
  async function grabar(nombre, accion, celular) {
    if (solo && !nombre.startsWith(solo)) return;
    let op;
    if (celular) op = Object.assign({}, celular, { deviceScaleFactor: 1 }, soloFotos ? {} : { recordVideo: { dir: CLIPS, size: celular.viewport } });
    else op = soloFotos ? { viewport: FOTO, deviceScaleFactor: 1 } : { viewport: TAM, deviceScaleFactor: 1, recordVideo: { dir: CLIPS, size: TAM } };
    const ctx = await nav.newContext(op);
    const p = await ctx.newPage();
    const errores = [];
    p.on('pageerror', (e) => errores.push(e.message));
    await p.goto(url(JUEGO, 'semilla=' + SEMILLA));
    // Cada clip empieza en la generación 1, sin herencia guardada.
    await p.evaluate(() => { try { localStorage.clear(); } catch (e) { /* sin almacenamiento */ } });
    await p.reload();
    await p.waitForTimeout(1200);
    p.foto = async (archivo) => { if (soloFotos) { await p.waitForTimeout(900); await p.screenshot({ path: path.join(__dirname, archivo), type: 'jpeg', quality: 85 }); } };
    try { await accion(p); } catch (e) { errores.push(e.message); }
    const video = p.video();
    await ctx.close();
    if (video) fs.renameSync(await video.path(), path.join(CLIPS, nombre + '.webm'));
    console.log((errores.length ? '✗ ' : '✓ ') + nombre + (errores.length ? ' · ' + errores.join(' | ') : ''));
  }

  // Ayudas para jugar
  const boton = (p, re) => p.getByRole('button', { name: re }).first();
  const visible = async (p, re) => { const b = boton(p, re); return (await b.count()) > 0 && (await b.isVisible()); };
  const CARTA = /^(Guardar en la memoria|Seguir)$/, FIN = /^Empezar la generación siguiente$/;
  const espera = (p, ms) => p.waitForTimeout(soloFotos ? Math.min(ms, 300) : ms);

  // Del título al viaje: «Empezar el viaje» y elegir a la familia yagán.
  async function entrar(p, pausaPueblo) {
    await boton(p, /^Empezar el viaje$/).click(); await p.waitForTimeout(1600);
    if (pausaPueblo) { await p.foto('03-pueblo.jpg'); await espera(p, pausaPueblo); }
    await p.locator('#b-yagan').click(); await p.waitForTimeout(1600);
  }

  // Juega el minijuego abierto (minijuegos/minijuegos.js) como una persona: toca lo que se junta o
  // espera a que la marca pase por la zona.
  async function jugarMinijuego(p) {
    const t0 = Date.now();
    while ((await p.locator('.mj').count()) && Date.now() - t0 < 25000) {
      const cosas = p.locator('.mj__cosa:not(:disabled):has(img)');
      if (await cosas.count()) { await p.waitForTimeout(soloFotos ? 50 : 450); await cosas.first().click(); continue; }
      if (await visible(p, /^Probar de nuevo$/)) { await boton(p, /^Probar de nuevo$/).click(); await p.waitForTimeout(300); continue; }
      await p.evaluate(() => {
        const z = document.querySelector('.mj__zona'), m = document.querySelector('.mj__marca'); if (!z || !m) return;
        const a = z.getBoundingClientRect(), b = m.getBoundingClientRect(), c = b.left + b.width / 2;
        if (c > a.left + 8 && c < a.right - 8) document.querySelector('.mj__botones .boton-papel--fuego').click();
      });
      await p.waitForTimeout(25);
    }
    await p.waitForTimeout(700);
  }

  // Rema hacia el este (ahí está el destino) y, si la costa lo impide, la bordea.
  function remero(p) {
    let bloq = false, vert = -1;
    return async (pausa, cuidarFuego) => {
      if (await p.locator('.mj').count()) { if (!p.minijuegoVisto) { p.minijuegoVisto = true; await p.foto('04b-minijuego.jpg'); } await jugarMinijuego(p); return 'minijuego'; }
      if (await visible(p, CARTA)) return 'carta';
      // Mientras el humo cubre y descubre la pantalla, el juego no toma clics: se espera.
      if (await visible(p, FIN)) { await p.waitForTimeout(1200); return 'fin'; }
      const fuego = Number(((await p.textContent('body')).match(/Fuego (\d) de 4/) || [])[1] || 4);
      if (await boton(p, /^Juntar/).isEnabled()) { await boton(p, /^Juntar/).click(); await espera(p, pausa); if (await p.locator('.mj').count()) await jugarMinijuego(p); return 'junto'; }
      if (cuidarFuego && fuego <= 2 && (await boton(p, /^Avivar el fuego$/).isEnabled())) { await boton(p, /^Avivar el fuego$/).click(); await espera(p, pausa); if (await p.locator('.mj').count()) await jugarMinijuego(p); return 'avivo'; }
      const t = bloq ? (vert < 0 ? 'ArrowUp' : 'ArrowDown') : 'ArrowRight';
      await p.keyboard.press(t); await p.waitForTimeout(Math.max(250, soloFotos ? 300 : pausa));
      const choco = /solo va por el agua|no se puede remar/i.test((await p.textContent('[role=status]').catch(() => '')) || '');
      if (t === 'ArrowRight') { if (choco) bloq = true; } else if (choco) vert = -vert; else bloq = false;
      return 'remo';
    };
  }

  // 1. Título: la costa de papel y el humo, cámara quieta.
  await grabar('01-titulo', async (p) => { await p.foto('01-titulo.jpg'); await espera(p, 12000); });

  // 2. El humo se abre con los primeros remos. 3. La elección del pueblo.
  await grabar('02-humo-y-03-pueblo', async (p) => {
    await entrar(p, 6000);
    const remar = remero(p);
    for (let i = 0; i < 8; i++) {
      const r = await remar(1100, true);
      if (r === 'carta') { await espera(p, 1200); await boton(p, CARTA).click(); await p.waitForTimeout(500); }
      if (r === 'fin') break;
      if (i === 2) await p.foto('02-humo.jpg');
    }
    await espera(p, 1200);
  });

  // 4. El viaje: remar, juntar, avivar el fuego. 5. La carta: se queda abierta para leerla.
  await grabar('04-viaje-y-05-carta', async (p) => {
    await entrar(p);
    const remar = remero(p);
    let cartas = 0;
    for (let i = 0; i < 60; i++) {
      const r = await remar(700, true);
      if (r === 'carta') {
        cartas++;
        if (cartas === 1) await p.foto('05-carta.jpg');
        await espera(p, cartas === 1 ? 9000 : 2500); await boton(p, CARTA).click(); await p.waitForTimeout(600);
      }
      if (i === 8) await p.foto('04-viaje.jpg');
      if (r === 'fin' || (cartas >= 2 && i > 25)) break;
    }
  });

  // 6. El fuego se apaga y lo aprendido pasa a la generación siguiente (rema sin avivar).
  await grabar('06-fin-y-herencia', async (p) => {
    await entrar(p);
    const remar = remero(p);
    for (let i = 0; i < 150; i++) {
      const r = await remar(300, false);
      if (r === 'carta') { await boton(p, CARTA).click(); await p.waitForTimeout(400); }
      if (r === 'fin') { await p.waitForTimeout(1500); await p.foto('06-fin.jpg'); await espera(p, 6000); await boton(p, FIN).click(); await espera(p, 4000); return; }
    }
  });

  // 7. El códice: lo aprendido se guarda al terminar el viaje. Se juegan dos viajes
  // (sin avivar, para que sean cortos) y se abre el códice desde el final.
  await grabar('07-codice', async (p) => {
    await entrar(p);
    let viajes = 0, remar = remero(p);
    for (let i = 0; i < 300 && viajes < 2; i++) {
      const r = await remar(250, false);
      if (r === 'carta') { await boton(p, CARTA).click(); await p.waitForTimeout(400); }
      if (r === 'fin') {
        viajes++;
        if (viajes < 2) {
          await boton(p, FIN).click();
          await p.locator('#p-fin').waitFor({ state: 'hidden' }); await p.waitForTimeout(1200);
          if (await p.locator('#b-yagan').isVisible()) { await p.locator('#b-yagan').click(); await p.waitForTimeout(1600); }
          remar = remero(p);
        }
      }
    }
    await boton(p, /^Ver el códice$/).click();
    await p.locator('#p-codice').waitFor({ state: 'visible' }); await p.waitForTimeout(1500);
    await p.foto('07-codice.jpg');
    for (let i = 0; i < 6 && !soloFotos; i++) { await p.mouse.wheel(0, 260); await p.waitForTimeout(1300); }
    await espera(p, 1500);
  });

  // 9. El juego en un celular (para mostrar dentro de una toma del teléfono en la mano).
  await grabar('09-celular', async (p) => {
    await entrar(p);
    const remar = remero(p);
    for (let i = 0; i < 16; i++) {
      const r = await remar(800, true);
      if (r === 'carta') { await espera(p, 3500); await boton(p, CARTA).click(); }
      if (r === 'fin') break;
      if (i === 7) await p.foto('09-celular.jpg');
    }
  }, devices['Pixel 5']);

  await nav.close();
  if (soloFotos) { console.log('Listo. Cuadros en equipo/video/'); return; }

  // GIF para el README: 8 segundos del viaje, 800 px de ancho, sin la franja de arriba.
  const { spawnSync } = require('child_process');
  const viaje = path.join(CLIPS, '04-viaje-y-05-carta.webm'), gif = path.join(CLIPS, 'juego.gif');
  const filtro = 'crop=iw:ih-40:0:40,fps=12,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4';
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-ss', '1', '-t', '8', '-i', viaje, '-vf', filtro, gif]);
  if (r.error) console.log('Sin ffmpeg: no se armó el GIF (los clips están igual).');
  else if (r.status === 0) console.log('✓ juego.gif (' + Math.round(fs.statSync(gif).size / 1024) + ' KB)');
  console.log('Listo. Clips en equipo/video/clips/');
})();
