#!/usr/bin/env node
/*
 * Tierra de los Humos · Genera los códigos QR del stand (SVG, sin internet)
 *
 * Uso, desde la raíz del repo:
 *   npm i --no-save qrcode@1.5.4
 *   node stand/generar-qr.cjs                                   (direcciones por defecto)
 *   node stand/generar-qr.cjs https://otra-direccion/ juego      (otra dirección, otro nombre)
 *
 * ⚠️ Antes de imprimir, abrir el enlace en un celular y verificar que funcione.
 * Licencia: MIT.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const QR = require('qrcode');

const DIRECCIONES = process.argv[2]
  ? { [process.argv[3] || 'juego']: process.argv[2] }
  : {
    juego: 'https://facunique.github.io/Tierra-de-los-Humos/', // GitHub Pages: verificar cuando la Persona B publique
    repositorio: 'https://github.com/Facunique/Tierra-de-los-Humos',
  };

(async () => {
  for (const [nombre, url] of Object.entries(DIRECCIONES)) {
    const svg = await QR.toString(url, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#28221e', light: '#eee5d0' } });
    fs.writeFileSync(path.join(__dirname, 'qr-' + nombre + '.svg'), svg);
    console.log('qr-' + nombre + '.svg → ' + url);
  }
})();
