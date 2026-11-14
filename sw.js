/*
 * Tierra de los Humos · Juego sin internet (service worker)
 * ---------------------------------------------------------
 * La primera vez que alguien abre el juego publicado (GitHub Pages), el
 * navegador guarda todos sus archivos. Desde ahí, el juego abre aunque no haya
 * internet: en la demo, en una escuela sin conexión o en el colectivo.
 *
 * Cómo decide qué mostrar (primero la red):
 *   - Con internet, baja siempre la versión nueva y la guarda. Así nadie se
 *     queda jugando una versión vieja mientras el equipo sigue cambiando cosas.
 *   - Si la red no contesta en 3,5 segundos (wifi malo en la demo) o no hay
 *     internet, usa lo guardado.
 *
 * Con doble clic en index.html (file://) no hace falta: los navegadores no
 * usan service workers ahí, y el juego ya anda sin internet.
 *
 * ARCHIVOS tiene que listar todo lo que carga index.html, más la tipografía y
 * los íconos. pruebas/sin-internet.test.cjs revisa que no falte ninguno.
 * Si cambia la lista, subí VERSION para que se borre lo guardado antes.
 *
 * Licencia: MIT.
 */
'use strict';
const VERSION = 'tdh-v1';
const ESPERA_RED = 3500;
const ARCHIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  // Estilos y tipografía
  'arte/tipografia/atkinson.css',
  'arte/tipografia/atkinson-hyperlegible-latin-400-normal.woff2',
  'arte/tipografia/atkinson-hyperlegible-latin-700-normal.woff2',
  'arte/tipografia/atkinson-hyperlegible-latin-400-italic.woff2',
  'arte/corteza/carta.css',
  'juego/interfaz/juego.css',
  'juego/interfaz/pantallas.css',
  // Íconos
  'arte/logo/favicon-32.png',
  'arte/logo/icono-192.png',
  'arte/logo/icono-512.png',
  // Arte, sonido y datos
  'arte/fuente/arte.js',
  'arte/corteza/corteza.js',
  'arte/corteza/transiciones.js',
  'arte/corteza/luz-real.js',
  'arte/mapa/costas.js',
  'arte/mapa/mapa.js',
  'arte/postal/postal.js',
  'datos/saberes.js',
  'sonido/ambiente.js',
  'sonido/voz.js',
  'sonido/juego.js',
  'sonido/narrador.js',
  // Núcleo
  'juego/nucleo/azar.js',
  'juego/nucleo/reglas.js',
  'juego/nucleo/territorio/elementos.js',
  'juego/nucleo/territorio/destinos.js',
  'juego/nucleo/territorio/pueblos.js',
  'juego/nucleo/mapa.js',
  'juego/nucleo/partida.js',
  // Interfaz
  'juego/interfaz/herencia.js',
  'juego/interfaz/carta.js',
  'juego/interfaz/juego.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS.map((a) => new Request(a, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((claves) => Promise.all(claves.filter((k) => k.startsWith('tdh-') && k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const pedido = e.request;
  if (pedido.method !== 'GET' || new URL(pedido.url).origin !== self.location.origin) return;
  e.respondWith(primeroLaRed(pedido));
});

async function primeroLaRed(pedido) {
  const cache = await caches.open(VERSION);
  // La página se guarda sin lo que va después del «?» (?semilla=5 abre el mismo index.html).
  const guardado = () => cache.match(pedido, { ignoreSearch: pedido.mode === 'navigate' });
  const red = fetch(pedido).then((r) => {
    if (r && r.ok && r.type === 'basic') cache.put(pedido.mode === 'navigate' ? new URL(pedido.url).pathname : pedido, r.clone());
    return r;
  });
  red.catch(() => {});                // si la red falla después de usar lo guardado, no es un error
  const tarde = new Promise((ok) => setTimeout(ok, ESPERA_RED, 'tarde'));
  try {
    const r = await Promise.race([red, tarde]);
    if (r !== 'tarde') return r;
    const g = await guardado();
    return g || await red;            // la red tarda y no hay nada guardado: se sigue esperando
  } catch (err) {
    const g = await guardado();
    if (g) return g;
    if (pedido.mode === 'navigate') { const inicio = await cache.match('index.html'); if (inicio) return inicio; }
    throw err;
  }
}
