#!/usr/bin/env node
/*
 * Tierra de los Humos · Exporta el logo, el ícono y la imagen para compartir (estilo Corteza)
 *
 * Fuente: arte/corteza/portada.html (dibujada con el mismo motor del juego).
 * Uso, desde la raíz del repo:   node arte/corteza/exportar.cjs
 * Necesita Playwright (npm i -D playwright) con su navegador. Es solo para regenerar las imágenes;
 * el juego no lo necesita.
 *
 * Genera en arte/logo/:
 *   compartir.png  1200 × 630, para redes y la vista previa de GitHub
 *   logo.png       960 × 300 (×2), fondo transparente
 *   icono-512.png, icono-192.png, favicon-32.png
 *
 * Licencia: MIT.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const raiz = path.resolve(__dirname, '..');
  const salida = path.join(raiz, 'logo');
  fs.mkdirSync(salida, { recursive: true });
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ viewport: { width: 1300, height: 1600 }, deviceScaleFactor: 1 });
  await pagina.goto('file://' + path.join(__dirname, 'portada.html') + '?exportar');
  await pagina.waitForFunction(() => document.body.dataset.listo === '1');
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.locator('#compartir').screenshot({ path: path.join(salida, 'compartir.png') });
  await pagina.close();

  const doble = await navegador.newPage({ viewport: { width: 1300, height: 1600 }, deviceScaleFactor: 2 });
  await doble.goto('file://' + path.join(__dirname, 'portada.html') + '?exportar');
  await doble.waitForFunction(() => document.body.dataset.listo === '1');
  await doble.evaluate(() => document.fonts.ready);
  await doble.locator('#logo').screenshot({ path: path.join(salida, 'logo.png'), omitBackground: true });
  // Íconos: el lienzo de 512 reducido, con esquinas redondeadas
  const iconos = await doble.evaluate(() => {
    const fuente = document.getElementById('c-icono');
    return [512, 192, 32].map((n) => {
      const c = document.createElement('canvas'); c.width = n; c.height = n;
      const x = c.getContext('2d'); const r = n * 0.19;
      x.beginPath(); x.roundRect(0, 0, n, n, r); x.clip();
      x.imageSmoothingQuality = 'high'; x.drawImage(fuente, 0, 0, n, n);
      return [n, c.toDataURL('image/png')];
    });
  });
  for (const [n, url] of iconos) {
    const nombre = n === 32 ? 'favicon-32.png' : 'icono-' + n + '.png';
    fs.writeFileSync(path.join(salida, nombre), Buffer.from(url.split(',')[1], 'base64'));
  }
  await navegador.close();
  console.log('Listo: compartir.png, logo.png, icono-512.png, icono-192.png y favicon-32.png en arte/logo/');
})();
