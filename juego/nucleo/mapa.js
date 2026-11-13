/*
 * Tierra de los Humos · Mapa del viaje
 * ------------------------------------
 * Genera el canal de cada viaje al azar, con semilla: costa norte arriba, costa
 * sur abajo y el canal en el medio, de oeste a este, como el Beagle. El mapa es
 * el que dibuja el motor Corteza: filas de letras (ver arte/corteza/corteza.js).
 *
 *   const m = TDH_MAPA.generar(semilla);
 *   // → { mapa, objetos, inicio: { x, y }, destino: { x, y }, humos, fijo }
 *   TDH_MAPA.fijo()                         // el mapa de la maqueta (arte/pantallas)
 *   TDH_MAPA.navegable(mapa, x, y)          // ¿la canoa puede estar ahí?
 *   TDH_MAPA.camino(mapa, desde, llegar)    // búsqueda en anchura por el agua
 *
 * Todo mapa generado se valida: tiene que haber camino por agua hasta el
 * destino, y todo lo que se junta tiene que quedar al lado de agua alcanzable.
 * Si una semilla no da un mapa válido se prueba con otra, y si nada sirve se
 * usa el mapa fijo de la maqueta.
 *
 * Los objetos van donde dicen las cartas (datos/saberes.js): el pescado en el
 * agua baja, los hongos en la orilla del bosque, la choza en la playa (Corteza
 * le pone la puerta hacia el mar), el cachiyuyo pegado a la playa. El mapa es
 * ficción: recurso de juego.
 *
 * Sin DOM: anda en el navegador (global TDH_MAPA) y en Node (require).
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const AZAR = raiz.TDH_AZAR || (typeof require === 'function' ? require('./azar.js') : null);

  // ── Utilidades del mapa ──────────────────────────────────────────────────
  const NAVEGABLE = '~-,k';       // la roca (r) es agua pero no se rema por ahí
  const V4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const V8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

  function letra(mapa, x, y) { return y >= 0 && y < mapa.length && x >= 0 && x < mapa[0].length ? mapa[y][x] : null; }
  function navegable(mapa, x, y) { const l = letra(mapa, x, y); return l != null && NAVEGABLE.includes(l); }

  /**
   * Búsqueda en anchura por el agua. desde: { x, y }. llegar: (x, y) => bool.
   * Devuelve las casillas del camino (sin la de salida) o null si no hay.
   */
  function camino(mapa, desde, llegar) {
    const W = mapa[0].length, clave = (x, y) => y * W + x;
    const previo = new Map([[clave(desde.x, desde.y), -1]]);
    const cola = [[desde.x, desde.y]];
    while (cola.length) {
      const [x, y] = cola.shift();
      if (llegar(x, y) && !(x === desde.x && y === desde.y)) {
        const ruta = [];
        for (let k = clave(x, y); k !== clave(desde.x, desde.y); k = previo.get(k)) ruta.unshift({ x: k % W, y: Math.floor(k / W) });
        return ruta;
      }
      for (const [dx, dy] of V4) {
        const nx = x + dx, ny = y + dy, k = clave(nx, ny);
        if (!previo.has(k) && navegable(mapa, nx, ny)) { previo.set(k, clave(x, y)); cola.push([nx, ny]); }
      }
    }
    return null;
  }

  /** Todas las casillas de agua alcanzables desde una casilla, como Set de 'x,y'. */
  function alcanzables(mapa, desde) {
    const vistos = new Set([desde.x + ',' + desde.y]), cola = [[desde.x, desde.y]];
    while (cola.length) {
      const [x, y] = cola.shift();
      for (const [dx, dy] of V4) {
        const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
        if (!vistos.has(k) && navegable(mapa, nx, ny)) { vistos.add(k); cola.push([nx, ny]); }
      }
    }
    return vistos;
  }

  // ── El mapa fijo (el de la maqueta arte/pantallas) ───────────────────────
  const FIJO = {
    mapa: [
      'MMLMMMLLMMMMLLMMMLLMMMMMLLMMM',
      'LLLLtLLLpLLLttLLLLGGLLLLtLLLL',
      'GLLttLLppLGGLLLLGGGLGLLGGGGLG',
      'GGGGpGGGGpGGGGGGGGGGGGGGGGGGG',
      '...GG.......GGG...G.....GG...',
      ',,k,,,,,r,,,,,,,,,k,,,,,,,k,,',
      '-,,-------------,,-----------',
      '~--~~~~~-------~~~~~~~--~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '----~~~~~~~~~~~~~-------~~---',
      ',,,k,----~~~---,,,r,k,,,,,,k,',
      '..,,,,,,----,,,,,.......,....',
      'GGL...,,,--,,,..LLGGGtGGG..GG',
    ],
    objetos: [
      { id: 'choza', x: 8, y: 4 }, { id: 'conchal', x: 10, y: 4 }, { id: 'lena', x: 6, y: 4, junta: 'lena' }, { id: 'saber', x: 9, y: 4, junta: 'choza' },
      { id: 'mejillones', x: 16, y: 4, junta: 'mejillones' }, { id: 'hongos', x: 17, y: 11, junta: 'hongos' },
      { id: 'pirita', x: 20, y: 11, junta: 'pirita' }, { id: 'lena', x: 2, y: 11, junta: 'lena' }, { id: 'pescado', x: 13, y: 10, junta: 'pescado' },
      { id: 'lobo-marino', x: 8, y: 5 }, { id: 'cormoran', x: 18, y: 10 }, { id: 'pato-vapor', x: 5, y: 9 }, { id: 'tonina', x: 21, y: 8 },
      { id: 'guindo-grande', x: 24, y: 4, junta: 'corteza' }, { id: 'ballena-varada', x: 26, y: 11, meta: true }, { id: 'lena', x: 22, y: 4, junta: 'lena' },
    ],
    inicio: { x: 2, y: 6 },
    destino: { x: 26, y: 11 },
    humos: [{ x: 27.5, y: 9.6 }, { x: 25.2, y: 1.5 }],
  };

  function fijo() {
    return {
      mapa: FIJO.mapa.slice(), objetos: FIJO.objetos.map((o) => Object.assign({}, o)),
      inicio: Object.assign({}, FIJO.inicio), destino: Object.assign({}, FIJO.destino),
      humos: FIJO.humos.map((h) => Object.assign({}, h)), fijo: true,
    };
  }

  // ── Generador ────────────────────────────────────────────────────────────
  const limitar = (v, a, b) => Math.max(a, Math.min(b, v));

  function intentar(al, op) {
    const W = op.ancho || 32, H = op.alto || 13;
    const g = Array.from({ length: H }, () => Array(W).fill('~'));
    const tierra = (x, y) => y >= 0 && y < H && x >= 0 && x < W && !'~-,kr'.includes(g[y][x]);

    // 1. Las dos costas: una caminata al azar suave por columna.
    const norte = [], sur = [];
    // La costa cambia de fila cada 3 columnas como mínimo: sin dientes sueltos.
    let n = AZAR.entero(al, 3, 4), s = AZAR.entero(al, H - 3, H - 2), cn = 0, cs = 0;
    for (let x = 0; x < W; x++) {
      if (x > 0 && ++cn >= 3 && al() < 0.45) { n = limitar(n + (al() < 0.5 ? -1 : 1), 3, 5); cn = 0; }
      if (x > 0 && ++cs >= 3 && al() < 0.45) { s = limitar(s + (al() < 0.5 ? -1 : 1), H - 4, H - 2); cs = 0; }
      norte.push(n); sur.push(s);
    }
    const interior = { L: 5, G: 2, t: 1.5, p: 1 };
    for (let x = 0; x < W; x++) {
      for (let y = 0; y <= norte[x]; y++) {
        if (y === norte[x]) g[y][x] = al() < 0.12 ? 'G' : '.';                  // playa (a veces el bosque llega al agua)
        else if (y === norte[x] - 1) g[y][x] = al() < 0.8 ? 'G' : 'L';          // el guindo domina hacia la costa
        else if (y === 0) g[y][x] = al() < 0.75 ? 'M' : 'L';                    // las cumbres al fondo
        else g[y][x] = AZAR.ponderado(al, interior);
      }
      for (let y = sur[x]; y < H; y++) {
        if (y === sur[x]) g[y][x] = al() < 0.12 ? 'G' : '.';
        else g[y][x] = AZAR.ponderado(al, { G: 3, L: 3, t: 1 });
      }
    }

    // 2. Islas chicas donde el canal es ancho.
    const islas = AZAR.entero(al, 0, 2);
    for (let i = 0; i < islas; i++) {
      const cx = AZAR.entero(al, 7, W - 9), w = AZAR.entero(al, 2, 3), h = AZAR.entero(al, 1, 2);
      let arriba = 0, abajo = H;
      for (let x = cx - 1; x <= cx + w; x++) { arriba = Math.max(arriba, norte[x]); abajo = Math.min(abajo, sur[x]); }
      if (abajo - arriba - 1 < h + 4) continue;                                 // dejar al menos 2 de agua a cada lado
      const cy = AZAR.entero(al, arriba + 3, abajo - 2 - h);
      for (let y = cy; y < cy + h; y++) for (let x = cx; x < cx + w; x++) g[y][x] = '.';
      if (w * h >= 3) g[cy][cx + AZAR.entero(al, 0, w - 1)] = 'G';
    }

    // 3. El guindo grande (carta «corteza»): el bosque llega a la playa del norte.
    let guindo = null;
    for (const x of AZAR.mezclar(al, rango(Math.floor(W / 2), W - 6))) {
      if (g[norte[x]][x] === '.') { g[norte[x]][x] = 'G'; guindo = { x, y: norte[x] }; break; }
    }

    // 4. La profundidad sale de la distancia a la tierra.
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (tierra(x, y)) continue;
      let d = 9;
      for (let yy = y - 2; yy <= y + 2; yy++) for (let xx = x - 2; xx <= x + 2; xx++) if (tierra(xx, yy)) d = Math.min(d, Math.max(Math.abs(xx - x), Math.abs(yy - y)));
      g[y][x] = d <= 1 ? ',' : d === 2 ? '-' : '~';
    }

    // 5. Rocas sueltas en el agua baja (lejos de la salida).
    for (let y = 0; y < H; y++) for (let x = 5; x < W - 3; x++) if (g[y][x] === ',' && al() < 0.035) g[y][x] = 'r';

    // 6. Cachiyuyo pegado a la playa, cada tantas columnas, en las dos costas.
    const amarres = [];
    function cachiyuyo(desde, playaY, aguaY) {
      for (let x = desde; x < W - 1; x += AZAR.entero(al, 5, 8)) {
        for (const xx of [x, x + 1, x - 1]) {
          const py = playaY(xx), ay = aguaY(xx);
          if (xx >= 0 && xx < W && g[py][xx] === '.' && g[ay][xx] === ',') { g[ay][xx] = 'k'; amarres.push({ x: xx, y: ay }); break; }
        }
      }
    }
    cachiyuyo(2, (x) => norte[x], (x) => norte[x] + 1);
    cachiyuyo(AZAR.entero(al, 4, 7), (x) => sur[x], (x) => sur[x] - 1);

    const mapa = g.map((f) => f.join(''));

    // 7. La salida, al oeste, en el medio del canal.
    let inicio = null;
    const medio = Math.round((norte[1] + sur[1]) / 2);
    for (const dy of [0, 1, -1, 2, -2]) if (navegable(mapa, 1, medio + dy)) { inicio = { x: 1, y: medio + dy }; break; }
    if (!inicio) return null;

    // 8. Los objetos.
    const objetos = [], usado = new Set();
    const libre = (x, y) => !usado.has(x + ',' + y);
    const poner = (o) => { objetos.push(o); usado.add(o.x + ',' + o.y); return o; };
    const playas = [];
    for (let x = 0; x < W; x++) {
      for (const y of [norte[x], sur[x]]) if (mapa[y][x] === '.' && V4.some(([dx, dy]) => navegable(mapa, x + dx, y + dy))) playas.push({ x, y });
    }
    // islas: playas con agua al lado que no son de ninguna costa
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (mapa[y][x] === '.' && y !== norte[x] && y !== sur[x] && V4.some(([dx, dy]) => navegable(mapa, x + dx, y + dy))) playas.push({ x, y });
    }
    const playaEntre = (a, b, filtro) => AZAR.mezclar(al, playas.filter((p) => p.x >= a && p.x <= b && libre(p.x, p.y) && (!filtro || filtro(p))))[0] || null;

    // El destino: la ballena varada en una playa del este (destino de ejemplo, ver memory.md).
    const destino = playaEntre(W - 5, W - 2, (p) => p.y === sur[p.x]) || playaEntre(W - 5, W - 2);
    if (!destino) return null;
    poner({ id: 'ballena-varada', x: destino.x, y: destino.y, meta: true });

    // El campamento: choza, saber y conchal en tres playas seguidas del norte.
    for (const x of AZAR.mezclar(al, rango(5, Math.floor(W / 2)))) {
      const y = norte[x];
      if ([0, 1, 2].every((i) => norte[x + i] === y && mapa[y][x + i] === '.' && libre(x + i, y))) {
        poner({ id: 'choza', x, y }); poner({ id: 'saber', x: x + 1, y, junta: 'choza' }); poner({ id: 'conchal', x: x + 2, y });
        break;
      }
    }
    if (guindo) poner({ id: 'guindo-grande', x: guindo.x, y: guindo.y, junta: 'corteza' });

    // Leña: una cada 5 columnas, más o menos, en cualquiera de las dos costas.
    for (let x = 3; x < W - 4; x += 5) { const p = playaEntre(x, x + 4); if (p) poner({ id: 'lena', x: p.x, y: p.y, junta: 'lena' }); }
    for (let i = 0; i < 2; i++) { const p = playaEntre(5, W - 5); if (p) poner({ id: 'mejillones', x: p.x, y: p.y, junta: 'mejillones' }); }
    for (let i = 0; i < 2; i++) { const p = playaEntre(8, W - 4); if (p) poner({ id: 'hongos', x: p.x, y: p.y, junta: 'hongos' }); }
    { const p = playaEntre(Math.floor(W / 3), W - 4); if (p) poner({ id: 'pirita', x: p.x, y: p.y, junta: 'pirita' }); }
    // El pescado, en el agua baja.
    const bajas = [];
    for (let y = 0; y < H; y++) for (let x = 5; x < W - 4; x++) if (mapa[y][x] === ',' && libre(x, y)) bajas.push({ x, y });
    for (const p of AZAR.mezclar(al, bajas).slice(0, 2)) poner({ id: 'pescado', x: p.x, y: p.y, junta: 'pescado' });

    // Fauna de paisaje (no se junta ni se caza).
    const rocas = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mapa[y][x] === 'r' && libre(x, y)) rocas.push({ x, y });
    const r1 = AZAR.mezclar(al, rocas);
    if (r1[0]) poner({ id: 'lobo-marino', x: r1[0].x, y: r1[0].y });
    if (r1[1]) poner({ id: 'cormoran', x: r1[1].x, y: r1[1].y });
    const hondas = [], medias = [];
    for (let y = 0; y < H; y++) for (let x = 4; x < W - 2; x++) { if (mapa[y][x] === '~' && libre(x, y)) hondas.push({ x, y }); if (mapa[y][x] === '-' && libre(x, y)) medias.push({ x, y }); }
    const h1 = AZAR.mezclar(al, hondas)[0]; if (h1) poner({ id: 'tonina', x: h1.x, y: h1.y });
    const m1 = AZAR.mezclar(al, medias)[0]; if (m1) poner({ id: 'pato-vapor', x: m1.x, y: m1.y });

    // Humo de los fogones de otras familias: se acercan a la ballena (Cooper 1946, p. 99).
    // El humo sale de la tierra, detrás de la playa de la ballena.
    const haciaTierra = destino.y === sur[destino.x] ? 1.6 : -0.6;
    const humos = [{ x: destino.x + 1.5, y: destino.y + haciaTierra }, { x: W - 3.5, y: 1.5 }];

    return { mapa, objetos, inicio, destino: { x: destino.x, y: destino.y }, humos, amarres, fijo: false };
  }

  function rango(a, b) { const l = []; for (let i = a; i <= b; i++) l.push(i); return l; }

  /** ¿Se puede jugar? Camino hasta el destino, todo lo que se junta al alcance y lugar para amarrar. */
  function valido(m) {
    const agua = alcanzables(m.mapa, m.inicio);
    const alAlcance = (o) => agua.has(o.x + ',' + o.y) || V4.some(([dx, dy]) => agua.has((o.x + dx) + ',' + (o.y + dy)));
    if (!V8.some(([dx, dy]) => agua.has((m.destino.x + dx) + ',' + (m.destino.y + dy)))) return false;
    if (!m.objetos.filter((o) => o.junta).every(alAlcance)) return false;
    if (m.objetos.filter((o) => o.junta === 'lena').length < 4) return false;
    if (!m.objetos.some((o) => o.id === 'choza')) return false;
    const amarres = m.amarres.filter((k) => agua.has(k.x + ',' + k.y));
    return amarres.length >= 3;
  }

  function generar(semilla, opciones) {
    const base = (semilla == null ? 1 : semilla) >>> 0;
    for (let intento = 0; intento < 30; intento++) {
      const m = intentar(AZAR.crear((base + intento * 7919) >>> 0), opciones || {});
      if (m && valido(m)) { delete m.amarres; m.semilla = base; m.intento = intento; return m; }
    }
    return fijo();
  }

  const api = { generar, fijo, navegable, camino, alcanzables, letra };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_MAPA = api;
})(typeof window !== 'undefined' ? window : globalThis);
