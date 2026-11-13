/*
 * Tierra de los Humos · Postal del viaje
 * --------------------------------------
 * Al terminar un viaje, la familia se lleva una postal: el mapa con el recorrido,
 * la generación, cómo terminó y los saberes que aprendió. Se puede guardar como
 * imagen y compartir. Es un recuerdo y también un pedacito de memoria con fuente.
 *
 *   const lienzo = TDH_POSTAL.dibujar(document.createElement('canvas'), {
 *     mapa, objetos, ruta: [[x, y], ...], explorado: (x, y) => bool,
 *     generacion: 2, llego: true, destino: 'la ballena varada', pasos: 34,
 *     saberes: ['El fuego viaja en la canoa', ...], pueblo: 'yagán',
 *   });
 *   TDH_POSTAL.descargar(lienzo, 'tierra-de-los-humos-generacion-2.png');
 *
 *   // Con la partida del núcleo (juego/nucleo/partida.js), los datos salen solos:
 *   const datos = TDH_POSTAL.datosDe(partida.estado, { generacion: 2, saberes: TDH_SABERES.SABERES });
 *   TDH_POSTAL.dibujar(lienzo, datos);
 *
 * Requiere arte/fuente/arte.js y arte/corteza/corteza.js. Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  // Sin Corteza (por ejemplo, en Node) solo funciona datosDe: dibujar necesita el navegador.
  const CZ = raiz.TDH_CORTEZA, C = raiz.TDH_ARTE ? raiz.TDH_ARTE.COLOR : null, rgba = CZ ? CZ.rgba : null;
  const W = 1200, H = 800;

  function papel(x, a, b, w, h, r, color) {
    x.fillStyle = rgba(C.A, 0.55); x.beginPath(); x.roundRect(a + 8, b + 11, w, h, r); x.fill();
    x.fillStyle = color || C.i; x.beginPath(); x.roundRect(a, b, w, h, r); x.fill();
    x.setLineDash([7, 7]); x.lineWidth = 2; x.strokeStyle = rgba(C.r, 0.35); x.beginPath(); x.roundRect(a + 10, b + 10, w - 20, h - 20, Math.max(2, r - 6)); x.stroke(); x.setLineDash([]);
  }
  function renglones(x, texto, a, b, ancho, alto) { // texto con cortes de línea
    const palabras = texto.split(' '); let linea = '', y = b;
    for (const p of palabras) { const prueba = linea ? linea + ' ' + p : p; if (x.measureText(prueba).width > ancho && linea) { x.fillText(linea, a, y); linea = p; y += alto; } else linea = prueba; }
    if (linea) x.fillText(linea, a, y);
    return y + alto;
  }

  function dibujar(canvas, d) {
    d = Object.assign({ generacion: 1, llego: false, pasos: 0, saberes: [], pueblo: 'yagán', fecha: new Date() }, d);
    const dpr = 2; canvas.width = W * dpr; canvas.height = H * dpr;
    const x = canvas.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const F = (px, peso, it) => (it ? 'italic ' : '') + (peso || 400) + ' ' + px + 'px "Atkinson Hyperlegible", system-ui, sans-serif';
    // Fondo: papel crudo
    x.fillStyle = C.g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 1800; i++) { x.fillStyle = i % 2 ? rgba(C.R, 0.07) : rgba(C.W, 0.12); x.fillRect((i * 97) % W, (i * 61) % H, 2, 2); }
    // Mapa del viaje, a la izquierda
    const mapa = d.mapa, cols = mapa[0].length, filas = mapa.length;
    const MW = 700, celda = Math.floor(MW / cols), MH = celda * filas, mx = 40, my = 88;
    const cv = document.createElement('canvas'), m = CZ.crear(cv, { celda, dpr });
    const ultimo = d.ruta.length ? d.ruta[d.ruta.length - 1] : [0, 0];
    m.escena({ mapa, objetos: d.objetos || [], explorado: d.explorado, estacion: 'verano', clima: 'calma', hora: 'tarde', canoa: { x: ultimo[0], y: ultimo[1], fuego: d.llego ? 4 : 0, mira: 1 } });
    m.dibujar(2.2);
    papel(x, mx - 14, my - 14, MW + 28, MH + 28, 18);
    x.save(); x.beginPath(); x.roundRect(mx, my, MW, MH, 10); x.clip(); x.drawImage(cv, mx, my, cols * celda, MH);
    // El recorrido: un hilo punteado de papel
    if (d.ruta.length > 1) {
      const P = ([a, b]) => [mx + (a + 0.5) * celda, my + (b + 0.55) * celda];
      x.lineCap = 'round'; x.lineJoin = 'round';
      x.strokeStyle = rgba(C.z, 0.55); x.lineWidth = 7; x.beginPath(); d.ruta.forEach((p, i) => { const [a, b] = P(p); i ? x.lineTo(a + 2, b + 3) : x.moveTo(a + 2, b + 3); }); x.stroke();
      x.strokeStyle = C.Y; x.lineWidth = 4; x.setLineDash([2, 10]); x.beginPath(); d.ruta.forEach((p, i) => { const [a, b] = P(p); i ? x.lineTo(a, b) : x.moveTo(a, b); }); x.stroke(); x.setLineDash([]);
      const [sa, sb] = P(d.ruta[0]); x.fillStyle = C.i; x.strokeStyle = C.z; x.lineWidth = 3; x.beginPath(); x.arc(sa, sb, 9, 0, Math.PI * 2); x.fill(); x.stroke();
    }
    x.restore();
    // Arriba, el título del recorrido; abajo, dónde queda en el mapa real (si está cargado)
    x.fillStyle = C.I; x.font = F(22, 700); x.fillText('El viaje por los canales', mx, my - 34);
    if (raiz.TDH_MAPA && raiz.TDH_COSTAS) {
      const iw = 300, mini = document.createElement('canvas');
      const r = raiz.TDH_MAPA.dibujar(mini, { ancho: iw, territorios: true, nombres: false, hoy: false, destacar: d.pueblo === 'yagán' ? 'yagan' : null, dpr: 2 });
      const iy = my + MH + 34, ih = Math.min(r.alto, H - iy - 26);
      if (ih > 120) {
        papel(x, mx - 8, iy - 8, iw + 16, ih + 16, 12);
        x.save(); x.beginPath(); x.roundRect(mx, iy, iw, ih, 8); x.clip(); x.drawImage(mini, mx, iy, iw, r.alto); x.restore();
        x.fillStyle = C.I; x.font = F(16, 700); renglones(x, 'Los canales del sur de Tierra del Fuego, territorio del pueblo ' + d.pueblo + '.', mx + iw + 30, iy + 30, MW - iw - 30, 22);
        x.font = F(14, 400, true); x.fillStyle = '#5b524a'; renglones(x, 'Zonas aproximadas según Cooper (1946) y Bird (1946). Costas: Natural Earth.', mx + iw + 30, iy + 100, MW - iw - 30, 19);
      }
    }
    // Texto, a la derecha
    const tx = 790, tw = W - tx - 40;
    papel(x, tx - 20, 40, tw + 40, H - 80, 22);
    // Sello: la canoa con su fuego
    x.save(); x.translate(tx + tw - 70, 110);
    x.strokeStyle = C.q; x.lineWidth = 3; x.setLineDash([5, 4]); x.beginPath(); x.arc(0, 0, 54, 0, Math.PI * 2); x.stroke(); x.setLineDash([]);
    x.fillStyle = C.B; x.beginPath(); x.arc(0, 0, 46, 0, Math.PI * 2); x.fill();
    x.save(); x.beginPath(); x.arc(0, 0, 46, 0, Math.PI * 2); x.clip(); CZ.humo(x, 0, -6, 0.55, 2, 0.5, 6, 40); CZ.canoa(x, 0, 22, 0.8, d.llego ? 4 : 1, 2.2, 1, false); x.restore();
    x.restore();
    x.fillStyle = C.q; x.font = F(15, 700); x.fillText('TIERRA DE LOS HUMOS · POSTAL', tx, 92);
    x.fillStyle = C.I; x.font = F(34, 700);
    let y = renglones(x, 'La generación ' + d.generacion + ' de una familia ' + d.pueblo, tx, 140, tw - 130, 38);
    x.font = F(19); x.fillStyle = '#3b342e';
    const final = d.llego ? 'Llegaron a ' + (d.destino || 'su destino') + ' con el fuego encendido, después de ' + d.pasos + ' remadas.' : 'El fuego se apagó después de ' + d.pasos + ' remadas. Lo aprendido pasa a la generación ' + (d.generacion + 1) + '.';
    y = renglones(x, final, tx, y + 10, tw, 26);
    x.fillStyle = C.q; x.font = F(15, 700); x.fillText('LO QUE APRENDIERON', tx, y + 22); y += 52;
    x.font = F(19, 700); x.fillStyle = C.I;
    const lista = d.saberes.length ? d.saberes.slice(0, 5) : ['Esta vez, nada nuevo: el humo todavía guarda mucho.'];
    lista.forEach((s) => { x.fillStyle = C.y; x.beginPath(); x.arc(tx + 7, y - 6, 6, 0, Math.PI * 2); x.fill(); x.fillStyle = C.I; y = renglones(x, s, tx + 22, y, tw - 22, 24) + 6; });
    if (d.saberes.length > 5) { x.font = F(16, 400, true); x.fillText('y ' + (d.saberes.length - 5) + ' más.', tx + 22, y); y += 26; }
    x.font = F(15, 400, true); x.fillStyle = '#5b524a';
    renglones(x, 'Cada saber tiene su fuente en el códice del juego. La familia y el mapa son ficción; los saberes, no.', tx, H - 110, tw, 21);
    x.font = F(14, 700); x.fillStyle = C.q;
    const f = d.fecha; x.fillText(String(f.getDate()).padStart(2, '0') + '/' + String(f.getMonth() + 1).padStart(2, '0') + '/' + f.getFullYear() + ' · SoberaníaTech 2026', tx, H - 60);
    return canvas;
  }
  function descargar(canvas, nombre) {
    canvas.toBlob((blob) => {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre || 'tierra-de-los-humos-postal.png';
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    }, 'image/png');
  }
  // Nombre del pueblo como va en la postal («una familia yagán»).
  const PUEBLOS = { yagan: 'yagán', kawesqar: 'kawésqar' };
  /**
   * Arma los datos de la postal a partir de partida.estado.
   * opciones: generacion (número), saberes (el catálogo TDH_SABERES.SABERES), fecha.
   */
  function datosDe(estado, opciones) {
    const e = estado || {}, op = opciones || {}, catalogo = op.saberes || {};
    const ruta = e.ruta && e.ruta.length ? e.ruta : [[e.canoa ? e.canoa.x : 0, e.canoa ? e.canoa.y : 0]];
    return {
      mapa: e.mapa, objetos: e.objetos || [], ruta, explorado: e.explorado,
      generacion: op.generacion || 1,
      llego: !!e.gano,
      destino: e.destino && e.destino.nombre ? e.destino.nombre : null,
      pasos: e.pasos != null ? e.pasos : Math.max(0, ruta.length - 1),
      saberes: (e.aprendidos || []).map((id) => (catalogo[id] && catalogo[id].titulo) || id),
      pueblo: PUEBLOS[e.pueblo] || e.pueblo || 'yagán',
      fecha: op.fecha || new Date(),
    };
  }
  const api = { dibujar, descargar, datosDe };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_POSTAL = api;
})(typeof window !== 'undefined' ? window : globalThis);
