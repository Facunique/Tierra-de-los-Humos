#!/usr/bin/env node
/*
 * Tierra de los Humos · Exporta el cartel del stand a PDF (A3)
 * Uso, desde la raíz del repo:   node stand/exportar.cjs
 * Necesita Playwright (npm i -D playwright). Licencia: MIT.
 */
'use strict';
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const nav = await chromium.launch();
  const p = await nav.newPage();
  await p.goto('file://' + path.join(__dirname, 'cartel.html'));
  await p.waitForFunction(() => document.body.dataset.listo === '1');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.pdf({ path: path.join(__dirname, 'cartel-A3.pdf'), format: 'A3', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await nav.close();
  console.log('Listo: stand/cartel-A3.pdf');
})();
