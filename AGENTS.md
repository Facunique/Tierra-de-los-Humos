# AGENTS.md — Instrucciones para agentes de IA

Este archivo es para cualquier asistente de IA (Claude Code, Copilot, Codex, etc.) que trabaje en este repositorio. Las personas del equipo también pueden leerlo: resume las reglas de trabajo.

## Antes de empezar

1. Leé [`equipo/memory.md`](equipo/memory.md): tiene las decisiones tomadas, el estado actual y los pendientes. **No vuelvas a discutir lo que ya está decidido ahí** salvo que el equipo lo pida.
2. Leé [`docs/01-concepto.md`](docs/01-concepto.md) para entender el juego.
3. Si la tarea toca contenido cultural, leé también las líneas rojas de [`docs/00-guia-hackathon.md`](docs/00-guia-hackathon.md#líneas-rojas-cuidado-cultural) y el registro de [`equipo/comunicaciones.md`](equipo/comunicaciones.md).

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
| `sonido/` | Sonido generado por código (Web Audio), sin archivos de audio: ambiente según el lugar, efectos y voz para leer las cartas. Ver `sonido/README.md` |
| `mesa/` | Versión de mesa para imprimir (tablero, fichas, reglas) |
| `escuelas/` | Guía para docentes: una actividad por carta (`actividades.js`), en A4 |
| `presentacion/` y `stand/` | Pitch en HTML y PDF; vidriera y cartel para la demo del 19/11 |
| `equipo/` | Trabajo interno del equipo: memoria del proyecto, registro de comunicaciones con comunidades y plan de comunicación (video, pitch, demo) |
| `AGENTS.md` | Este archivo |
| `README.md` | Presentación pública del proyecto (lo evalúa el jurado) |

El código del juego todavía no existe. Stack propuesto: HTML + JavaScript con Canvas, desplegado en GitHub Pages (pendiente de confirmar; ver `equipo/memory.md`).

## Cómo trabajar

- **Cuando el equipo tome una decisión**, anotala en `equipo/memory.md` (sección *Decisiones*, con fecha). Si cambia algo del diseño, actualizá también el documento de `docs/` que corresponda.
- **Cuando haya un contacto con una comunidad o persona consultada**, agregá una entrada en `equipo/comunicaciones.md` usando la plantilla.
- Commits chicos, con mensaje en castellano que diga qué cambió y por qué.
- **Uso de IA**: las bases obligan a declararlo (cláusula 7.4). Si hacés un aporte nuevo (código, textos, arte, música), sumalo a la sección *Uso de inteligencia artificial* del README.
- Licencias: código MIT, contenidos CC BY-SA 4.0. Todo recurso de terceros va con su licencia en el README.
- **Arte:** el estilo es Corteza (`docs/04-direccion-de-arte.md`). No edites los PNG a mano; cambiá `arte/fuente/arte.js` o `arte/corteza/corteza.js` y regenerá. Usá solo colores de la paleta. Las personas van como siluetas sin rasgos hasta que la comunidad diga otra cosa.
- **Rigor histórico del arte:** antes de dibujar o cambiar un objeto, una persona o una escena, buscalo en `docs/05-rigor-historico.md`. Si no está, buscá la fuente (autor, obra, página) y sumá la fila. No dibujes nada que las fuentes no respalden: ni perros, ni anzuelos, ni redes, ni escenas de caza.
- Priorizá lo que sume puntos según los criterios de evaluación (sección 5 de la guía): que se pueda jugar de punta a punta, en el celular, y con contenido citado.
