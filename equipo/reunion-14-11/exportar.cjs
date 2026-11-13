#!/usr/bin/env node
/*
 * Tierra de los Humos · Exporta la hoja de la reunión del 14/11 a PDF
 * Uso, desde la raíz del repo:   node equipo/reunion-14-11/exportar.cjs
 * Necesita Playwright (npm i -D playwright). Licencia: MIT.
 */
'use strict';
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const nav = await chromium.launch();
  const p = await nav.newPage();
  await p.goto('file://' + path.join(__dirname, 'hoja.html'));
  await p.waitForFunction(() => document.body.dataset.listo === '1');
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  const largas = await p.evaluate(() => [...document.querySelectorAll('.hoja')].map((h, i) => {
    const pie = h.querySelector('.pie'); const tope = pie ? pie.offsetTop : h.clientHeight;
    const ultimo = [...h.children].filter((c) => c !== pie).reduce((m, c) => Math.max(m, c.offsetTop + c.offsetHeight), 0);
    return ultimo > tope ? (i + 1) + ' (' + Math.round(ultimo - tope) + ' px de más)' : null;
  }).filter(Boolean));
  if (largas.length) console.warn('Atención: estas hojas se pasan del pie: ' + largas.join(', '));
  await p.pdf({ path: path.join(__dirname, 'hoja-A4.pdf'), format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log('Listo: equipo/reunion-14-11/hoja-A4.pdf');
  await nav.close();
})();
