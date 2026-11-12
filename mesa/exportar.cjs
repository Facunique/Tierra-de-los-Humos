#!/usr/bin/env node
/*
 * Tierra de los Humos · Exporta la versión de mesa a PDF
 * Uso, desde la raíz del repo:   node mesa/exportar.cjs
 * Necesita Playwright (npm i -D playwright). Licencia: MIT.
 *
 * Genera mesa/tablero-A3.pdf, mesa/fichas-A4.pdf y mesa/reglas-A4.pdf.
 */
'use strict';
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const nav = await chromium.launch();
  const p = await nav.newPage();
  for (const [archivo, formato, apaisado] of [['tablero', 'A3', true], ['fichas', 'A4', false], ['reglas', 'A4', false]]) {
    await p.goto('file://' + path.join(__dirname, archivo + '.html'));
    await p.waitForFunction(() => document.body.dataset.listo === '1');
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.pdf({ path: path.join(__dirname, archivo + '-' + formato + '.pdf'), format: formato, landscape: apaisado, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log('Listo: mesa/' + archivo + '-' + formato + '.pdf');
  }
  await nav.close();
})();
