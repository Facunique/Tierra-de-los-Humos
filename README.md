# Tierra de los Humos — roguelike fueguino

![Tierra de los Humos: costa fueguina en otoño recortada en papel, con una choza y un conchal, y en primer plano una canoa de corteza con el fuego encendido, el hombre adelante con el arpón y la mujer atrás remando](arte/logo/compartir.png)

Videojuego web de tipo roguelike sobre los saberes de los pueblos originarios de Tierra del Fuego. Lo desarrolla el equipo **Tierra de los Humos** para la hackatón [SoberaníaTech 2026](https://soberaniatech.com.ar/), organizada por la Agencia de Innovación de Tierra del Fuego.

> 🚧 **En desarrollo** (9 al 17 de noviembre de 2026). Por ahora el repositorio tiene la documentación de planificación; el código del juego se suma durante la hackatón.

## Eje

**04 · Memoria, Cultura e Innovación Comunitaria**

## Problema

Los saberes de los pueblos Selk'nam, Haush y Yagán sobre la vida en el territorio fueguino (navegar los canales, recolectar, cuidar el fuego, adaptarse al clima) son poco conocidos por jóvenes y escuelas. Cuando aparecen, suelen contarse en pasado, como si esos pueblos ya no existieran.

## Solución propuesta

Un juego web que se juega desde el navegador, también en el celular. Cada partida es un viaje en el que el fuego es tu vida: se gasta con el frío y el viento, y se mantiene con lo que el territorio ofrece. Lo que se aprende en un viaje pasa a la siguiente generación como **cartas de saber**, cada una con su fuente citada. La mecánica del roguelike (morir, volver a empezar, avanzar) representa así la **transmisión de la memoria**.

El concepto completo está en [docs/01-concepto.md](docs/01-concepto.md).

## Documentación

| Documento | Contenido |
|---|---|
| [00 · Guía de la hackatón](docs/00-guia-hackathon.md) | Bases, fechas, criterios de evaluación, cuidados culturales y plan por fases |
| [01 · Concepto](docs/01-concepto.md) | Premisa, pueblos (Yagán primero), bucle central, transmisión entre partidas, tono y aporte al eje |
| [04 · Dirección de arte y sonido](docs/04-direccion-de-arte.md) | El estilo Corteza: principios, motor de dibujo, cartas, paleta, sonido y accesibilidad |
| [05 · Rigor histórico del arte](docs/05-rigor-historico.md) | Cada elemento dibujado contrastado con las fuentes etnográficas, con página |

Arte y sonido:

| Recurso | Contenido |
|---|---|
| [Estilo Corteza](arte/corteza/index.html) | El estilo elegido, en vivo: tocá el agua y la canoa rema (abrir el archivo en el navegador) |
| [Pantallas del juego](arte/pantallas/index.html) | Maqueta navegable de todo el recorrido: título, viaje, cartas, fin del viaje, códice y cierre en presente |
| [`arte/`](arte/README.md) | Motor de dibujo, paleta, pegatinas pixel, logo y tipografía. Todo propio |
| [Propuestas de estilo](arte/propuestas/index.html) | Las tres propuestas que votó el equipo (registro) |
| [`sonido/`](sonido/README.md) | Sonido ambiente y efectos generados por código, con demo |

Trabajo interno del equipo:

| Documento | Contenido |
|---|---|
| [Memoria del proyecto](equipo/memory.md) | Decisiones tomadas, estado actual, pendientes y glosario |
| [Comunicaciones con comunidades](equipo/comunicaciones.md) | Registro de la consulta a comunidades y personas, con permisos y correcciones |
| [Comunicación](equipo/comunicacion.md) | Plan del video, el pitch, el avance del 14/11 y la demo del 19/11 |
| [AGENTS.md](AGENTS.md) | Reglas de trabajo para asistentes de IA (y para el equipo) |

## Cómo jugar

*Pendiente: se completa cuando haya un prototipo publicado.*

## Tecnologías

*Pendiente.* La propuesta es un juego web HTML5 por turnos, publicado en GitHub Pages.

## Fuentes

*Pendiente.* Acá se listan todas las fuentes de los contenidos culturales, de especies y de lugares que usa el juego.

## Recursos de terceros

| Recurso | Autor | Licencia | Dónde se usa |
|---|---|---|---|
| Tipografía [Atkinson Hyperlegible](https://github.com/googlefonts/atkinson-hyperlegible) | Braille Institute of America | [SIL Open Font License 1.1](arte/tipografia/OFL.txt) | Todos los textos. Archivos en `arte/tipografia/` |

El resto del arte (motor de dibujo, pegatinas, paleta, logo) y todo el sonido son **propios del equipo** (CC BY-SA 4.0). No se usan fotos históricas, ilustraciones, sonidos ni música de terceros. *Se completa si se suma alguna librería o recurso nuevo.*

## Uso de inteligencia artificial

Las bases piden declararlo (cláusula 7.4).

- **Claude (Anthropic), a través de Claude Code:** se usó para resumir las bases de la hackatón, proponer un plan de trabajo y armar la estructura inicial de este repositorio y de su documentación. El equipo revisa y decide todo el contenido.
- **Arte y sonido (12/11):** a pedido de la persona a cargo del arte, Claude Code buscó fuentes sobre el paisaje fueguino y la cultura material yagán, y propuso la dirección de arte (`docs/04-direccion-de-arte.md`). También escribió el código que define y genera la paleta, los sprites en pixel art, el logo y la página de propuestas (`arte/`), y el código que sintetiza el sonido (`sonido/`), junto con el plan de video y pitch (`equipo/comunicacion.md`). El equipo revisa los dibujos y elige el estilo. Los datos culturales marcados con 🔍 los verifica la persona de investigación con las fuentes y la comunidad.
- **Estilo Corteza y rigor histórico (12/11):** el equipo eligió el estilo. Claude Code escribió el motor de dibujo (`arte/corteza/`), las cartas, el HUD y el logo. También leyó el capítulo «The Yahgan» del *Handbook of South American Indians* (Cooper, 1946) y *The Gold Diggings of Cape Horn* (Spears, 1895), auditó cada elemento del arte contra esas fuentes, con página (`docs/05-rigor-historico.md`), y corrigió lo que no coincidía. La validación final es del equipo y de la comunidad.
- **Pantallas y elementos nuevos (12/11):** Claude Code armó la maqueta navegable de las pantallas (`arte/pantallas/`) y dibujó los elementos nuevos con su fuente: ballena varada, guindo de corteza, aves, toninas, pescado, erizos y huevos. También redactó borradores de cartas de saber a partir de Cooper (1946), con página, que revisa la persona de investigación.

## Integrantes

Equipo **Tierra de los Humos**:

- *Pendiente: nombres y roles*

## Licencias

- **Código:** [MIT](LICENSE).
- **Contenidos** (textos, arte, sonido y documentación): [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es), salvo que se indique otra cosa.
