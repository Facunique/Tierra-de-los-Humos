#!/usr/bin/env node
/*
 * Tierra de los Humos · Exporta las cartas de saber
 *
 * Uso, desde la raíz del repo:   node arte/cartas/exportar.cjs
 * Necesita Playwright (npm i -D playwright). Solo para regenerar; el juego no lo usa.
 *
 * Genera:
 *   arte/cartas/cartas-para-imprimir.pdf   A4 doble faz (frentes y dorsos en espejo)
 *   arte/cartas/ilustraciones/<id>.jpg     la ilustración de cada carta, 840 × 420
 *
 * Licencia: MIT.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const dir = __dirname;
  const nav = await chromium.launch();
  // 1. PDF para imprimir
  const p = await nav.newPage();
  await p.goto('file://' + path.join(dir, 'imprimir.html'));
  await p.waitForFunction(() => document.body.dataset.listo === '1');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.pdf({ path: path.join(dir, 'cartas-para-imprimir.pdf'), format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  // 2. Ilustraciones sueltas
  const salida = path.join(dir, 'ilustraciones');
  fs.mkdirSync(salida, { recursive: true });
  const imgs = await p.evaluate(() => {
    const CZ = window.TDH_CORTEZA, { SABERES, ORDEN } = window.TDH_SABERES;
    return ORDEN.map((k) => {
      const c = SABERES[k], cv = document.createElement('canvas');
      const m = CZ.crear(cv, { celda: Math.ceil(420 / c.mapa[0].length), dpr: 2 });
      m.escena(Object.assign({ mapa: c.mapa, objetos: [], estacion: 'verano', clima: 'calma', hora: 'dia' }, c.extra || {}));
      m.dibujar(1.6);
      const out = document.createElement('canvas'); out.width = 840; out.height = 420;
      const x = out.getContext('2d'); const esc = Math.max(840 / cv.width, 420 / cv.height);
      x.drawImage(cv, (840 - cv.width * esc) / 2, (420 - cv.height * esc) / 2, cv.width * esc, cv.height * esc);
      return [k, out.toDataURL('image/jpeg', 0.88)];
    });
  });
  for (const [k, url] of imgs) fs.writeFileSync(path.join(salida, k + '.jpg'), Buffer.from(url.split(',')[1], 'base64'));
  await nav.close();
  console.log('Listo: cartas-para-imprimir.pdf y ' + imgs.length + ' ilustraciones en arte/cartas/ilustraciones/');
})();
