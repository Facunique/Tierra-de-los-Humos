#!/usr/bin/env node
/*
 * Tierra de los Humos · Exporta la presentación (respaldo para la demo)
 * Uso, desde la raíz del repo:   node presentacion/exportar.cjs
 * Necesita Playwright (npm i -D playwright). Licencia: MIT.
 *
 * Genera:
 *   presentacion/diapositivas/01.jpg … 09.jpg   cada diapositiva, 1600 × 900
 *   presentacion/pitch.pdf                        las mismas imágenes en un PDF liviano
 */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const dir = path.join(__dirname, 'diapositivas');
  fs.mkdirSync(dir, { recursive: true });
  const nav = await chromium.launch();
  const p = await nav.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('file://' + path.join(__dirname, 'index.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '#barra{display:none!important}' });
  const total = await p.evaluate(() => document.querySelectorAll('.diapo').length);
  const archivos = [];
  for (let i = 0; i < total; i++) {
    await p.waitForTimeout(700);
    const nombre = String(i + 1).padStart(2, '0') + '.jpg';
    await p.screenshot({ path: path.join(dir, nombre), type: 'jpeg', quality: 86 });
    archivos.push(nombre);
    await p.keyboard.press('ArrowRight');
  }
  // PDF a partir de las imágenes
  const html = '<!doctype html><style>@page{size:1600px 900px;margin:0}body{margin:0}img{display:block;width:1600px;height:900px;break-after:page}</style>' +
    archivos.map((a) => '<img src="file://' + path.join(dir, a) + '">').join('');
  const temporal = path.join(dir, '_pdf.html');
  fs.writeFileSync(temporal, html);
  const q = await nav.newPage();
  await q.goto('file://' + temporal);
  await q.waitForTimeout(300);
  await q.pdf({ path: path.join(__dirname, 'pitch.pdf'), width: '1600px', height: '900px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  fs.unlinkSync(temporal);
  await nav.close();
  console.log('Listo: ' + archivos.length + ' diapositivas y presentacion/pitch.pdf');
})();
