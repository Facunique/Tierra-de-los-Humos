#!/usr/bin/env node
/*
 * Tierra de los Humos · ¿Qué hizo el resto del equipo?
 * ---------------------------------------------------
 * Trae lo nuevo de GitHub y muestra, desde la última vez que se corrió:
 *   - los commits nuevos de cada rama (quién, cuándo, qué), y las ramas nuevas o borradas;
 *   - qué partes del repo tocaron;
 *   - qué conviene hacer por eso: qué regenerar, qué probar, qué idea de
 *     equipo/ideas.md mirar. Así cada uno se acopla a lo que hacen los demás.
 *
 * Uso, desde la raíz del repo:
 *   node herramientas/novedades.cjs            # desde la última vez
 *   node herramientas/novedades.cjs --todo     # las últimas 48 horas, aunque ya se hayan visto
 *   node herramientas/novedades.cjs --no-marcar  # mostrar sin marcar como visto
 *   node herramientas/novedades.cjs --mias     # incluir también la rama en la que estás
 *
 * Solo lee: no cambia ningún archivo del repo. Lo visto se guarda en
 * .git/tdh-novedades.json (no se sube). Necesita git. Licencia: MIT.
 */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const todo = args.includes('--todo');
const marcar = !args.includes('--no-marcar');
const mias = args.includes('--mias');
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const raiz = git('rev-parse', '--show-toplevel');
process.chdir(raiz);
const VISTO = path.join(git('rev-parse', '--git-dir'), 'tdh-novedades.json');

// ── Qué significa que alguien toque cada parte, y qué conviene hacer ──
const SEÑALES = [
  { si: /^juego\/nucleo\//, area: 'Núcleo del juego (A)', hacer: ['Correr `node --test` y `node pruebas/de-punta-a-punta.cjs pruebas/nucleo.html`.', 'Revisar que sonido/juego.js, sonido/narrador.js y la vidriera sigan leyendo bien los eventos (ideas.md, sección «Cuando el núcleo esté unido»).'] },
  { si: /^juego\/interfaz\/|^index\.html$/, area: 'Interfaz y pantalla del juego (B)', hacer: ['Si index.html ya muestra el viaje real: `node pruebas/de-punta-a-punta.cjs`, volver a grabar el video (`node equipo/video/grabar.cjs`) y actualizar capturas del README y del pitch (ideas 4, 5, 18, 19, 20).', 'Ver si ya se conectaron la luz real, el sonido, el narrador y la postal; si no, ofrecer ayuda (idea 9).'] },
  { si: /^datos\//, area: 'Datos de las cartas (B y C)', hacer: ['Las cartas cambiaron: regenerar las cartas para imprimir (`node arte/cartas/exportar.cjs`), la guía para docentes (`node escuelas/exportar.cjs`) y revisar que cada carta nueva tenga su actividad en escuelas/actividades.js.', 'Si hay una carta nueva, ver si necesita ilustración o pegatina nueva (y su fila en docs/05).'] },
  { si: /^juego\/nucleo\/territorio\//, area: 'Datos del territorio (A y C)', hacer: ['Si aparece un elemento nuevo en el mapa, revisar que tenga dibujo en Corteza y fila en docs/05-rigor-historico.md.'] },
  { si: /^equipo\/comunicaciones\.md$/, area: 'Consulta con la comunidad (C)', hacer: ['Leer qué se habló y qué se corrigió: aplicarlo en arte, cartas, pitch, guía, mesa y vidriera (ideas 1, 2 y 3).', 'Revisar los permisos: quién se puede nombrar y qué se puede citar.'] },
  { si: /^equipo\/memory\.md$/, area: 'Memoria del equipo', hacer: ['Leer las decisiones nuevas y no volver a discutirlas.'] },
  { si: /^equipo\/tareas\.md$/, area: 'Reparto de tareas', hacer: ['Revisar si cambió lo que te toca o el cronograma.'] },
  { si: /^equipo\/ideas\.md$/, area: 'Ideas para más adelante', hacer: ['Ver si alguien sumó o activó una idea.'] },
  { si: /^docs\/0[23]-/, area: 'Alcance o contenido cultural (docs/02, docs/03)', hacer: ['Si hay fuentes nuevas, sumarlas al README y mirar la bibliografía automática (idea 16).', 'Si se definió el alcance, ajustar las ideas a lo que entra para el 17/11.'] },
  { si: /^docs\/05-|^arte\//, area: 'Arte o rigor histórico', hacer: ['Si alguien cambió el arte, regenerar lo que lo usa (`node arte/generar.cjs`) y revisar la vitrina.'] },
  { si: /^sonido\//, area: 'Sonido', hacer: ['Probar `sonido/demo.html`.'] },
  { si: /^README\.md$/, area: 'README', hacer: ['Revisar que la sección de uso de IA y los ✏️ sigan al día.'] },
  { si: /^pruebas\//, area: 'Pruebas', hacer: ['Correr `node --test`.'] },
];

function leerVisto() { try { return JSON.parse(fs.readFileSync(VISTO, 'utf8')); } catch (e) { return {}; } }

try { execFileSync('git', ['fetch', '--all', '--prune', '--quiet'], { stdio: 'ignore' }); }
catch (e) { console.log('No se pudo traer lo nuevo de GitHub (¿sin conexión?). Se muestra lo que ya estaba bajado.\n'); }

const visto = todo ? {} : leerVisto();
const actual = (() => { try { return 'origin/' + git('rev-parse', '--abbrev-ref', 'HEAD'); } catch (e) { return ''; } })();
const ramas = git('for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin').split('\n').filter((r) => r && r !== 'origin/HEAD' && r !== 'origin' && (mias || r !== actual));
const ahora = {};
const areas = new Map();
let hayAlgo = false;

console.log('Novedades del equipo' + (visto._cuando ? ' desde ' + new Date(visto._cuando).toLocaleString('es-AR', { timeZone: 'America/Argentina/Ushuaia' }) : '') + '\n');

for (const rama of ramas) {
  const punta = git('rev-parse', rama);
  ahora[rama] = punta;
  const antes = visto[rama];
  if (antes === punta) continue;
  let rango;
  if (antes) {
    try { git('cat-file', '-e', antes + '^{commit}'); rango = antes + '..' + rama; }
    catch (e) { rango = null; }
  }
  // Una rama que no es main muestra solo lo suyo (lo que todavía no está en main).
  if (!rango && rama !== 'origin/main') rango = 'origin/main..' + rama;
  const desde = todo || !antes ? ['--since=48.hours'] : [];
  const lista = git('log', '--no-merges', '--format=%h|%an|%ad|%s', '--date=format:%d/%m %H:%M', ...(rango ? [rango] : [rama]), ...desde, '-n', '15');
  const nueva = !antes && !todo && Object.keys(visto).length > 1;
  if (!lista && !nueva) continue;
  hayAlgo = true;
  console.log('■ ' + rama.replace('origin/', '') + (nueva ? '  (rama nueva)' : ''));
  lista.split('\n').filter(Boolean).forEach((l) => { const [h, quien, cuando, que] = l.split('|'); console.log('   ' + cuando + ' · ' + quien + ' · ' + que + ' (' + h + ')'); });
  // Qué partes tocaron (contra main, o desde lo último visto)
  const base = antes && rango && rango.startsWith(antes) ? antes : (rama === 'origin/main' ? null : git('merge-base', 'origin/main', rama));
  const archivos = base ? git('diff', '--name-only', base, rama).split('\n').filter(Boolean) : git('log', '--since=48.hours', '--name-only', '--format=', rama).split('\n').filter(Boolean);
  for (const a of new Set(archivos)) for (const s of SEÑALES) if (s.si.test(a)) {
    if (!areas.has(s.area)) areas.set(s.area, { s, ramas: new Set(), archivos: new Set() });
    areas.get(s.area).ramas.add(rama.replace('origin/', '')); areas.get(s.area).archivos.add(a);
  }
  console.log('');
}
for (const rama of Object.keys(visto)) if (rama !== '_cuando' && !ahora[rama]) { hayAlgo = true; console.log('■ ' + rama.replace('origin/', '') + '  (rama borrada: probablemente se unió a main)\n'); }

if (!hayAlgo) console.log('Nada nuevo. Todo sigue igual que la última vez.\n');
else if (areas.size) {
  console.log('Qué conviene hacer por esto\n');
  for (const [area, { s, ramas: rs, archivos }] of areas) {
    console.log('▸ ' + area + ' (' + [...rs].join(', ') + '): ' + [...archivos].slice(0, 4).join(', ') + (archivos.size > 4 ? ' y ' + (archivos.size - 4) + ' más' : ''));
    s.hacer.forEach((h) => console.log('    - ' + h));
  }
  console.log('');
}
// ¿El núcleo ya está en main? Es la señal más importante para el resto.
let nucleoEnMain = false; try { git('cat-file', '-e', 'origin/main:juego/nucleo/partida.js'); nucleoEnMain = true; } catch (e) { /* todavía no */ }
console.log('Estado: el núcleo del juego ' + (nucleoEnMain ? 'YA está en main.' : 'todavía no está en main.'));
console.log('Recordá: nadie avanza sobre la parte de otro sin acordarlo (AGENTS.md).');

if (marcar) { ahora._cuando = Date.now(); fs.writeFileSync(VISTO, JSON.stringify(ahora, null, 2)); }
