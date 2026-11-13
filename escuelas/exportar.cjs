#!/usr/bin/env node
/*
 * Tierra de los Humos · Exporta la guía para docentes a PDF
 * Uso, desde la raíz del repo:   node escuelas/exportar.cjs
 * Necesita Playwright (npm i -D playwright). Licencia: MIT.
 *
 * Genera escuelas/guia-docente-A4.pdf. Avisa si alguna hoja se pasa de largo.
 */
'use strict';
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const nav = await chromium.launch();
  const p = await nav.newPage();
  await p.goto('file://' + path.join(__dirname, 'guia.html'));
  await p.waitForFunction(() => document.body.dataset.listo === '1');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const largas = await p.evaluate(() => [...document.querySelectorAll('.hoja')].map((h, i) => {
    const pie = h.querySelector('.pie'); const tope = pie ? pie.offsetTop : h.clientHeight;
    const ultimo = [...h.children].filter((c) => c !== pie).reduce((m, c) => Math.max(m, c.offsetTop + c.offsetHeight), 0);
    return ultimo > tope ? (i + 1) + ' (' + Math.round(ultimo - tope) + ' px de más)' : null;
  }).filter(Boolean));
  if (largas.length) console.warn('Atención: estas hojas se pasan del pie: ' + largas.join(', '));
  await p.pdf({ path: path.join(__dirname, 'guia-docente-A4.pdf'), format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log('Listo: escuelas/guia-docente-A4.pdf (' + (await p.evaluate(() => document.querySelectorAll('.hoja').length)) + ' hojas)');
  await nav.close();
})();
