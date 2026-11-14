# AGENTS.md — Instrucciones para agentes de IA

Este archivo es para cualquier asistente de IA (Claude Code, Copilot, Codex, etc.) que trabaje en este repositorio. Las personas del equipo también pueden leerlo: resume las reglas de trabajo.

## Antes de empezar

1. Leé [`equipo/memory.md`](equipo/memory.md): tiene las decisiones tomadas, el estado actual y los pendientes. **No vuelvas a discutir lo que ya está decidido ahí** salvo que el equipo lo pida.
2. Leé [`docs/01-concepto.md`](docs/01-concepto.md) para entender el juego.
3. Si la tarea toca contenido cultural, leé también las líneas rojas de [`docs/00-guia-hackathon.md`](docs/00-guia-hackathon.md#líneas-rojas-cuidado-cultural) y el registro de [`equipo/comunicaciones.md`](equipo/comunicaciones.md).

## Coordinación: acoplarse a lo que hacen los demás (regla)

Cuatro personas trabajan en paralelo, cada una con sus asistentes. Para que nadie tenga que avisar todo a mano:

1. **Antes de empezar cualquier tarea**, y de nuevo antes de subir cambios, corré `node herramientas/novedades.cjs`. Muestra qué hizo el resto del equipo desde la última vez y qué conviene hacer por eso.
2. **Acoplate a lo nuevo:**
   - si cambiaron las cartas, regenerá lo que depende de ellas;
   - si el juego avanzó, probá que lo tuyo siga andando con lo de ellos;
   - si la comunidad corrigió algo, aplicalo en tu parte;
   - si una señal de `equipo/ideas.md` se cumplió, proponé la idea.
3. **Si algo tuyo choca con lo de otra persona, adaptá lo tuyo.** Lo de otra persona no se toca: se le avisa (en `equipo/memory.md` o en su PR, si tu persona lo pide) con el problema y una propuesta.
4. **Antes de abrir o actualizar un PR,** fijate que no tenga conflictos con `main` ni con los PR abiertos del equipo.

## El proyecto en tres líneas

Roguelike web por turnos para la hackatón SoberaníaTech 2026 (eje 04, Memoria y Cultura). Cada partida es un viaje en canoa por los canales fueguinos acompañando a una familia **Yagán**; el fuego es la vida y lo aprendido pasa a la siguiente generación como saberes con fuente citada. Entrega final: **17/11/2026, 20:00**.

## Reglas de contenido cultural (las más importantes)

- **Nunca inventes datos culturales, históricos, de especies o de lugares.** Si no hay fuente, no va, o va marcado con 🔍 como pendiente de verificar.
- **Toda afirmación cultural lleva fuente** (autor, obra, año, página si se puede). Si citás de memoria, decilo y marcalo 🔍.
- Distinguí siempre **dato** de **recurso de juego**. Lo ficticio (la familia, el mapa, los eventos) se presenta como ficción.
- Hablá de los pueblos **en presente**: hay comunidades vivas. Nunca "extinguidos" ni "desaparecidos".
- **Sin violencia** entre personas ni contra pueblos, y **sin seres ceremoniales** como enemigos o personajes.
- **Sin nombres propios en lengua originaria** para personajes hasta que la comunidad lo autorice.
- **No uses fotos históricas** (por ejemplo, las de Gusinde) como arte del juego. Solo como referencia interna, y con los derechos revisados si alguna se publica.
- Nombres de los pueblos: **Yagán** (o Yámana), **Kawésqar**, **Selk'nam**, **Haush**. Usá siempre estas grafías salvo que la comunidad indique otra.

## Privacidad

El repositorio es **público**. No subas teléfonos, mails, direcciones ni datos personales de nadie, tampoco de las personas consultadas. En `equipo/comunicaciones.md` se registra **qué se habló y qué se acordó**, no cómo contactar a la persona. Las citas textuales de una persona solo se publican si dio su permiso.

## Idioma y estilo

- Todo en **castellano rioplatense** (voseo): docs, textos del juego, commits y comentarios de código.
- Frases cortas y claras. El público incluye estudiantes de secundaria.
- Los identificadores de código pueden ir en inglés o castellano, pero sin mezclar dentro de un mismo archivo.

## Estructura del repositorio

| Ruta | Qué hay |
|---|---|
| `docs/` | Diseño del juego: guía de la hackatón, concepto, alcance, contenido cultural, dirección de arte |
| `arte/` | Arte propio. Estilo **Corteza**: `corteza/corteza.js` es el motor de dibujo del juego; `fuente/arte.js` tiene la paleta y las pegatinas pixel (`node arte/generar.cjs` genera los PNG). Ver `arte/README.md` |
| `datos/` | Datos del juego en `.js`: las cartas de saber (`saberes.js`, con plantilla para cargar cartas sin programar). Los datos del territorio están en `juego/nucleo/territorio/` |
| `juego/` | El juego: `nucleo/` (Persona A, sin DOM; el contrato con la interfaz está al principio de `partida.js`), `nucleo/territorio/` (lo que hay en el mapa, las especies y el destino, con su fuente; se editan sin programar) e `interfaz/` (Persona B: `juego.js` une todo, `herencia.js` guarda lo aprendido, `carta.js`, `juego.css` y `pantallas.css`) |
| `pruebas/` | Pruebas con `node --test` (sin dependencias), desde la raíz del repo, y la partida falsa para probar la interfaz (`carta.html`). `de-punta-a-punta.cjs` juega partidas enteras en cinco pantallas con Playwright |
| `sonido/` | Sonido generado por código (Web Audio), sin archivos de audio: ambiente según el lugar, efectos y voz para leer las cartas. Ver `sonido/README.md` |
| `mesa/` | Versión de mesa para imprimir (tablero, fichas, reglas) |
| `escuelas/` | Guía para docentes: una actividad por carta (`actividades.js`), en A4 |
| `herramientas/` | Páginas de apoyo, como el editor de saberes: escribir o corregir una carta sin programar |
| `presentacion/` y `stand/` | Pitch en HTML y PDF; vidriera y cartel para la demo del 19/11 |
| `equipo/` | Trabajo interno del equipo: memoria del proyecto, reparto de tareas (`tareas.md`), ideas para más adelante de todo el equipo (`ideas.md`), registro de comunicaciones con comunidades y plan de comunicación (video, pitch, demo) |
| `AGENTS.md` | Este archivo |
| `README.md` | Presentación pública del proyecto (lo evalúa el jurado) |

El juego está en `index.html`: el núcleo (`juego/nucleo/`, ver su `README.md`) conectado a la interfaz (`juego/interfaz/juego.js`). `window.TDH_JUEGO` deja mirar la partida para las pruebas. **Stack decidido (13/11):** HTML, CSS y JavaScript **sin build**, con `<script>` clásicos que cuelgan globales `TDH_*`, como `arte/corteza/corteza.js`. Nada de `import`/`export`, `fetch` de archivos locales ni librerías externas: el juego tiene que abrir con doble clic (`file://`) y sin internet. Se publica en GitHub Pages desde `main`, carpeta raíz. Detalle en `equipo/memory.md`.

## Cómo trabajar

- **Cuando el equipo tome una decisión**, anotala en `equipo/memory.md` (sección *Decisiones*, con fecha). Si cambia algo del diseño, actualizá también el documento de `docs/` que corresponda.
- **Cuando haya un contacto con una comunidad o persona consultada**, agregá una entrada en `equipo/comunicaciones.md` usando la plantilla.
- Commits chicos, con mensaje en castellano que diga qué cambió y por qué.
- **Uso de IA**: las bases obligan a declararlo (cláusula 7.4). Si hacés un aporte nuevo (código, textos, arte, música), sumalo a la sección *Uso de inteligencia artificial* del README.
- Licencias: código MIT, contenidos CC BY-SA 4.0. Todo recurso de terceros va con su licencia en el README.
- **Arte:** el estilo es Corteza (`docs/04-direccion-de-arte.md`). No edites los PNG a mano; cambiá `arte/fuente/arte.js` o `arte/corteza/corteza.js` y regenerá. Usá solo colores de la paleta. Las personas van como siluetas sin rasgos hasta que la comunidad diga otra cosa.
- **Rigor histórico del arte:** antes de dibujar o cambiar un objeto, una persona o una escena, buscalo en `docs/05-rigor-historico.md`. Si no está, buscá la fuente (autor, obra, página) y sumá la fila. No dibujes nada que las fuentes no respalden: ni perros, ni anzuelos, ni redes, ni escenas de caza.
- Priorizá lo que sume puntos según los criterios de evaluación (sección 5 de la guía): que se pueda jugar de punta a punta, en el celular, y con contenido citado.
