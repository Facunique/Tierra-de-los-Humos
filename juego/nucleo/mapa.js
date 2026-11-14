/*
 * Tierra de los Humos · Mapa del viaje
 * ------------------------------------
 * Genera el canal de cada viaje al azar, con semilla: costa norte arriba, costa
 * sur abajo y el canal en el medio, de oeste a este, como el Beagle. El mapa es
 * el que dibuja el motor Corteza: filas de letras (ver arte/corteza/corteza.js).
 *
 *   const m = TDH_MAPA.generar(semilla, { pueblo: 'yagan', destino: 'ballena' });
 *   // → { mapa, objetos, inicio: { x, y }, destino: { x, y, id, nombre }, humos, fijo }
 *   TDH_MAPA.fijo()                         // el mapa de la maqueta (arte/pantallas)
 *   TDH_MAPA.navegable(mapa, x, y)          // ¿la canoa puede estar ahí?
 *   TDH_MAPA.camino(mapa, desde, llegar)    // búsqueda en anchura por el agua
 *
 * QUÉ va en el mapa y DÓNDE no está acá: sale de los datos del territorio
 * (juego/nucleo/territorio/): elementos.js, destinos.js y pueblos.js. Este
 * archivo solo sabe dibujar un canal y repartir lo que los datos le piden.
 *
 * Cada sistema usa su propia semilla (TDH_AZAR.derivar): el terreno, el destino
 * y cada elemento. Así, sumar o sacar un elemento de los datos no mueve las
 * costas ni los demás elementos.
 *
 * Todo mapa generado se valida: tiene que haber camino por agua hasta el
 * destino, todo lo que se junta tiene que quedar al lado de agua alcanzable y
 * cada elemento tiene que llegar a su mínimo. Si una semilla no da un mapa
 * válido se prueba con otra, y si nada sirve se usa el mapa fijo de la maqueta.
 *
 * Objetos del mapa: { id: dibujo de Corteza, x, y, elemento?, junta?, meta? }
 *   elemento: id de elementos.js · junta: id del elemento que se junta ahí
 *   meta: true en el destino. El mapa es ficción: recurso de juego.
 *
 * Sin DOM: anda en el navegador (global TDH_MAPA) y en Node (require).
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const pedir = (ruta) => (typeof require === 'function' ? require(ruta) : null);
  const AZAR = raiz.TDH_AZAR || pedir('./azar.js');
  const T_ELEMENTOS = raiz.TDH_ELEMENTOS || pedir('./territorio/elementos.js');
  const T_DESTINOS = raiz.TDH_DESTINOS || pedir('./territorio/destinos.js');
  const T_PUEBLOS = raiz.TDH_PUEBLOS || pedir('./territorio/pueblos.js');

  // ── Utilidades del mapa ──────────────────────────────────────────────────
  const NAVEGABLE = '~-,k';       // la roca (r) es agua pero no se rema por ahí
  const V4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const V8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

  function letra(mapa, x, y) { return y >= 0 && y < mapa.length && x >= 0 && x < mapa[0].length ? mapa[y][x] : null; }
  function navegable(mapa, x, y) { const l = letra(mapa, x, y); return l != null && NAVEGABLE.includes(l); }
  const esBosque = (l) => l === 'G' || l === 'L';

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
      { id: 'choza', x: 8, y: 4, elemento: 'choza' }, { id: 'conchal', x: 10, y: 4, elemento: 'choza' },
      { id: 'lena', x: 6, y: 4, elemento: 'lena', junta: 'lena' }, { id: 'saber', x: 9, y: 4, elemento: 'choza', junta: 'choza' },
      { id: 'mejillones', x: 16, y: 4, elemento: 'mejillones', junta: 'mejillones' }, { id: 'hongos', x: 17, y: 11, elemento: 'hongos', junta: 'hongos' },
      { id: 'pirita', x: 20, y: 11, elemento: 'pirita', junta: 'pirita' }, { id: 'lena', x: 2, y: 11, elemento: 'lena', junta: 'lena' },
      { id: 'pescado', x: 13, y: 10, elemento: 'pescado', junta: 'pescado' },
      { id: 'lobo-marino', x: 8, y: 5, elemento: 'lobo-marino' }, { id: 'cormoran', x: 18, y: 10, elemento: 'cormoran' },
      { id: 'pato-vapor', x: 5, y: 9, elemento: 'pato-vapor' }, { id: 'tonina', x: 21, y: 8, elemento: 'tonina' },
      { id: 'guindo-grande', x: 24, y: 4, elemento: 'corteza', junta: 'corteza' },
      { id: 'ballena-varada', x: 26, y: 11, meta: true }, { id: 'lena', x: 22, y: 4, elemento: 'lena', junta: 'lena' },
    ],
    inicio: { x: 2, y: 6 },
    destino: { x: 26, y: 11, id: 'ballena', nombre: 'la ballena varada' },
    humos: [{ x: 27.5, y: 9.6 }, { x: 25.2, y: 1.5 }],
  };

  function fijo() {
    return {
      mapa: FIJO.mapa.slice(), objetos: FIJO.objetos.map((o) => Object.assign({}, o)),
      inicio: Object.assign({}, FIJO.inicio), destino: Object.assign({}, FIJO.destino),
      humos: FIJO.humos.map((h) => Object.assign({}, h)), fijo: true,
    };
  }

  // ── El terreno ───────────────────────────────────────────────────────────
  const limitar = (v, a, b) => Math.max(a, Math.min(b, v));
  function rango(a, b) { const l = []; for (let i = a; i <= b; i++) l.push(i); return l; }

  /** Costas, islas, profundidad, rocas y cachiyuyo. Solo usa la semilla del terreno. */
  function terreno(al, W, H) {
    const g = Array.from({ length: H }, () => Array(W).fill('~'));
    const tierra = (x, y) => y >= 0 && y < H && x >= 0 && x < W && !'~-,kr'.includes(g[y][x]);

    // 1. Las dos costas: la costa cambia de fila cada 3 columnas como mínimo, sin dientes sueltos.
    const norte = [], sur = [];
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
    // Al menos un tramo de bosque que llega al agua en la segunda mitad del canal.
    const hayAcantilado = rango(Math.floor(W / 2), W - 6).some((x) => g[norte[x]][x] === 'G');
    if (!hayAcantilado) {
      const x = AZAR.elegir(al, rango(Math.floor(W / 2), W - 6).filter((xx) => g[norte[xx]][xx] === '.'));
      if (x != null) g[norte[x]][x] = 'G';
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

    // 3. La profundidad sale de la distancia a la tierra.
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (tierra(x, y)) continue;
      let d = 9;
      for (let yy = y - 2; yy <= y + 2; yy++) for (let xx = x - 2; xx <= x + 2; xx++) if (tierra(xx, yy)) d = Math.min(d, Math.max(Math.abs(xx - x), Math.abs(yy - y)));
      g[y][x] = d <= 1 ? ',' : d === 2 ? '-' : '~';
    }

    // 4. Rocas sueltas en el agua baja (lejos de la salida).
    for (let y = 0; y < H; y++) for (let x = 5; x < W - 3; x++) if (g[y][x] === ',' && al() < 0.035) g[y][x] = 'r';

    // 5. Cachiyuyo pegado a la playa, cada tantas columnas, en las dos costas. Ahí se amarra (Cooper 1946, p. 88).
    const amarres = [];
    function cachiyuyo(desde, playaY, aguaY) {
      for (let x = desde; x < W - 1; x += AZAR.entero(al, 5, 8)) {
        for (const xx of [x, x + 1, x - 1]) {
          if (xx < 0 || xx >= W) continue;
          const py = playaY(xx), ay = aguaY(xx);
          if (g[py][xx] === '.' && g[ay][xx] === ',') { g[ay][xx] = 'k'; amarres.push({ x: xx, y: ay }); break; }
        }
      }
    }
    cachiyuyo(2, (x) => norte[x], (x) => norte[x] + 1);
    cachiyuyo(AZAR.entero(al, 4, 7), (x) => sur[x], (x) => sur[x] - 1);

    return { mapa: g.map((f) => f.join('')), norte, sur, amarres };
  }

  // ── Los lugares donde puede ir cada cosa (ver LUGARES en elementos.js) ───
  function lugares(t) {
    const { mapa, norte, sur } = t, H = mapa.length, W = mapa[0].length;
    const L = { playa: [], 'playa-bosque': [], 'bosque-costa': [], 'agua-baja': [], 'agua-media': [], 'agua-honda': [], roca: [] };
    const costa = (x, y) => (y === norte[x] ? 'norte' : y === sur[x] ? 'sur' : 'isla');
    const alAgua = (x, y) => V4.some(([dx, dy]) => navegable(mapa, x + dx, y + dy));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const l = mapa[y][x], c = { x, y, costa: costa(x, y) };
      if (l === '.' && alAgua(x, y)) {
        L.playa.push(c);
        if (V4.some(([dx, dy]) => esBosque(letra(mapa, x + dx, y + dy)))) L['playa-bosque'].push(c);
      }
      if (esBosque(l) && alAgua(x, y)) L['bosque-costa'].push(c);
      if (l === ',') L['agua-baja'].push(c);
      if (l === '-') L['agua-media'].push(c);
      if (l === '~') L['agua-honda'].push(c);
      if (l === 'r') L.roca.push(c);
    }
    return L;
  }

  // ── Repartir lo que piden los datos ──────────────────────────────────────
  function columnas(zona, W) {
    const z = zona || { desde: 0, hasta: 1 };
    return [Math.round(z.desde * W), Math.min(W - 1, Math.round(z.hasta * W))];
  }

  function intentar(base, intento, pueblo, destino) {
    const W = pueblo.canal.ancho, H = pueblo.canal.alto;
    const semilla = (s) => AZAR.crear(AZAR.derivar(base, s, intento));
    const t = terreno(semilla('terreno'), W, H);
    const { mapa, norte, sur } = t;

    // La salida, al oeste, en el medio del canal.
    let inicio = null;
    const medio = Math.round((norte[1] + sur[1]) / 2);
    for (const dy of [0, 1, -1, 2, -2]) if (navegable(mapa, 1, medio + dy)) { inicio = { x: 1, y: medio + dy }; break; }
    if (!inicio) return null;

    const L = lugares(t);
    const objetos = [], usado = new Set();
    const libre = (c) => !usado.has(c.x + ',' + c.y);
    const poner = (o) => { objetos.push(o); usado.add(o.x + ',' + o.y); return o; };
    const candidatos = (donde, zona, costa) => {
      const [a, b] = columnas(zona, W);
      const todos = (L[donde] || []).filter((c) => c.x >= a && c.x <= b && libre(c));
      const deLaCosta = costa ? todos.filter((c) => c.costa === costa) : todos;
      return deLaCosta.length ? deLaCosta : todos;
    };

    // El destino primero, con su propia semilla.
    const alD = semilla('destino:' + destino.id);
    const d = AZAR.mezclar(alD, candidatos(destino.donde, destino.zona, destino.costa))[0];
    if (!d) return null;
    poner({ id: destino.dibujo, x: d.x, y: d.y, meta: true });

    // Después cada elemento del pueblo, cada uno con su propia semilla.
    for (const idEl of pueblo.elementos) {
      const el = T_ELEMENTOS.ELEMENTOS[idEl];
      if (!el) continue;
      const al = semilla('elemento:' + el.id);
      const objeto = (c) => {
        const o = { id: el.dibujo, x: c.x, y: c.y, elemento: el.id };
        if (el.tipo === 'recurso') o.junta = el.id;
        return o;
      };
      if (el.donde === 'campamento') {
        // Tres playas seguidas de la misma costa: el elemento y su grupo (la choza, el saber y el conchal).
        const [a, b] = columnas(el.zona, W), largo = 1 + Math.max(0, ...(el.grupo || []).map((g) => g.dx));
        for (let i = 0; i < (el.cantidad || 1); i++) {
          for (const x of AZAR.mezclar(al, rango(a, b - largo + 1))) {
            const y = norte[x];
            if (!rango(0, largo - 1).every((k) => norte[x + k] === y && mapa[y][x + k] === '.' && libre({ x: x + k, y }))) continue;
            poner({ id: el.dibujo, x, y, elemento: el.id });
            for (const g of el.grupo || []) {
              const o = { id: g.dibujo, x: x + g.dx, y, elemento: el.id };
              if (g.junta) o.junta = el.id;
              poner(o);
            }
            break;
          }
        }
      } else if (el.cantidad && el.cantidad.cada) {
        // Repartido a lo largo del canal: uno cada tantas columnas.
        const [a, b] = columnas(el.zona, W), cada = el.cantidad.cada;
        for (let x = a; x <= b; x += cada) {
          const c = AZAR.mezclar(al, candidatos(el.donde, { desde: x / W, hasta: Math.min(b, x + cada - 1) / W }))[0];
          if (c) poner(objeto(c));
        }
      } else {
        for (let i = 0; i < (el.cantidad || 0); i++) {
          const c = AZAR.mezclar(al, candidatos(el.donde, el.zona))[0];
          if (c) poner(objeto(c));
        }
      }
    }

    // Humo de los fogones de otras familias, que se acercan al destino (Cooper 1946, p. 99).
    // Sale de la tierra, detrás de la playa.
    const humos = [];
    if (destino.humos) {
      humos.push({ x: d.x + 1.5, y: d.y + (d.y === sur[d.x] ? 1.6 : -0.6) }, { x: W - 3.5, y: 1.5 });
    }

    return { mapa, objetos, inicio, destino: { x: d.x, y: d.y, id: destino.id, nombre: destino.nombre }, humos, amarres: t.amarres, pueblo: pueblo.id, fijo: false };
  }

  /** ¿Se puede jugar? Camino hasta el destino, todo lo que se junta al alcance, los mínimos y lugar para amarrar. */
  function valido(m, pueblo) {
    const agua = alcanzables(m.mapa, m.inicio);
    const alAlcance = (o) => agua.has(o.x + ',' + o.y) || V4.some(([dx, dy]) => agua.has((o.x + dx) + ',' + (o.y + dy)));
    if (!V8.some(([dx, dy]) => agua.has((m.destino.x + dx) + ',' + (m.destino.y + dy)))) return false;
    if (!m.objetos.filter((o) => o.junta).every(alAlcance)) return false;
    for (const id of pueblo.elementos) {
      const el = T_ELEMENTOS.ELEMENTOS[id];
      if (el && el.minimo && m.objetos.filter((o) => o.elemento === id && o.id === el.dibujo).length < el.minimo) return false;
    }
    return m.amarres.filter((k) => agua.has(k.x + ',' + k.y)).length >= 3;
  }

  /**
   * Genera un mapa válido. opciones: { pueblo, destino } (ids de los datos del territorio).
   * Devuelve el mapa fijo si ninguna de las semillas derivadas sirve.
   */
  function generar(semilla, opciones) {
    const op = opciones || {};
    const pueblo = T_PUEBLOS.PUEBLOS[op.pueblo || T_PUEBLOS.POR_DEFECTO];
    const destino = T_DESTINOS.DESTINOS[op.destino || T_DESTINOS.ACTIVO];
    if (!pueblo) throw new Error('Pueblo desconocido: ' + op.pueblo);
    if (!destino) throw new Error('Destino desconocido: ' + op.destino);
    const base = (semilla == null ? 1 : semilla) >>> 0;
    for (let intento = 0; intento < 30; intento++) {
      const m = intentar(base, intento, pueblo, destino);
      if (m && valido(m, pueblo)) { delete m.amarres; m.semilla = base; m.intento = intento; return m; }
    }
    return fijo();
  }

  const api = { generar, fijo, navegable, camino, alcanzables, letra, LUGARES: Object.keys(lugares({ mapa: ['~'], norte: [0], sur: [0] })).concat('campamento') };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.TDH_MAPA = api;
})(typeof window !== 'undefined' ? window : globalThis);
