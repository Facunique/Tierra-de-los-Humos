# Tierra de los Humos — roguelike fueguino

![Tierra de los Humos: costa fueguina en otoño recortada en papel, con una choza y un conchal, y en primer plano una canoa de corteza con el fuego encendido, el hombre adelante con el arpón y la mujer atrás remando](arte/logo/compartir.png)

Videojuego web de tipo roguelike sobre los saberes de los pueblos originarios de Tierra del Fuego. Lo desarrolla el equipo **Tierra de los Humos** para la hackatón [SoberaníaTech 2026](https://soberaniatech.com.ar/), organizada por la Agencia de Innovación de Tierra del Fuego.

> 🚧 **En desarrollo** (9 al 17 de noviembre de 2026). Ya están el estilo visual, el motor de dibujo, el sonido y una maqueta navegable de todas las pantallas; el código del juego se suma durante la hackatón.

**Jugalo:** ✏️ *[enlace de GitHub Pages]* · **Video:** ✏️ *[enlace]* · **Presentación:** [`presentacion/`](presentacion/index.html) ([PDF](presentacion/pitch.pdf))

## Eje

**04 · Memoria, Cultura e Innovación Comunitaria**

## Problema

Los saberes de los pueblos Selk'nam, Haush y Yagán sobre la vida en el territorio fueguino (navegar los canales, recolectar, cuidar el fuego, adaptarse al clima) son poco conocidos por jóvenes y escuelas. Cuando aparecen, suelen contarse en pasado, como si esos pueblos ya no existieran.

## Solución propuesta

Un juego web que se juega desde el navegador, también en el celular. Cada partida es un viaje en el que el fuego es tu vida: se gasta con el frío y el viento, y se mantiene con lo que el territorio ofrece. Lo que se aprende en un viaje pasa a la siguiente generación como **cartas de saber**, cada una con su fuente citada. La mecánica del roguelike (morir, volver a empezar, avanzar) representa así la **transmisión de la memoria**.

Tres ideas lo sostienen:

1. **El fuego es la vida.** Las familias yaganes llevaban el fuego encendido en el medio de la canoa (Cooper, 1946, p. 88 y 91). En el juego, ese fuego es la barra de vida.
2. **Morir es transmitir.** Cuando el fuego se apaga, los saberes encontrados pasan a la siguiente generación del mismo pueblo.
3. **Cada saber tiene fuente, y los pueblos están vivos.** Nada inventado presentado como real: cada carta separa el *dato* del *recurso de juego* y cita su fuente con página. Todo se cuenta en presente, con consulta a la comunidad.

El concepto completo está en [docs/01-concepto.md](docs/01-concepto.md).

| El viaje | Una carta de saber | Fin del viaje y herencia |
|---|---|---|
| ![El viaje: la canoa con su fuego rema por el canal; en la playa hay una choza, leña y un saber como pegatinas; a la derecha, humo](equipo/video/04-viaje.jpg) | ![Carta «Piedras de fuego» con su dato, su recurso de juego y la fuente con página](equipo/video/05-carta.jpg) | ![Pantalla «El viaje termina acá»: lo aprendido pasa a la siguiente generación](equipo/video/06-fin.jpg) |

*Capturas de la maqueta de pantallas. Se reemplazan por capturas del juego el 16/11.*

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
| [Cartas para imprimir](arte/cartas/cartas-para-imprimir.pdf) | Cartas de saber en A4, doble faz, para la demo |
| [Propuestas de estilo](arte/propuestas/index.html) | Las tres propuestas que votó el equipo (registro) |
| [`sonido/`](sonido/README.md) | Sonido ambiente y efectos generados por código, con demo |

Trabajo interno del equipo:

| Documento | Contenido |
|---|---|
| [Memoria del proyecto](equipo/memory.md) | Decisiones tomadas, estado actual, pendientes y glosario |
| [Comunicaciones con comunidades](equipo/comunicaciones.md) | Registro de la consulta a comunidades y personas, con permisos y correcciones |
| [Comunicación](equipo/comunicacion.md) | Plan del video, el pitch, el avance del 14/11 y la demo del 19/11 |
| [Storyboard del video](equipo/video/README.md) | Un cuadro por tramo, con la voz y el sonido |
| [AGENTS.md](AGENTS.md) | Reglas de trabajo para asistentes de IA (y para el equipo) |

## Cómo jugar

**Objetivo:** llegar al destino con el fuego encendido. Si el fuego se apaga, el viaje termina y lo aprendido pasa a la siguiente generación.

| Qué | En el celular | Con teclado |
|---|---|---|
| Remar | Tocar una casilla de agua al lado de la canoa | Flechas o <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> |
| Juntar (leña, comida, pirita, saberes) | Botón «Juntar» | <kbd>Enter</kbd> |
| Avivar el fuego con leña | Botón «Avivar el fuego» | <kbd>F</kbd> |
| Amarrar en el cachiyuyo y acampar | Botón «Amarrar y acampar» | <kbd>M</kbd> |

- **El fuego** se gasta al remar, y más con viento en el canal hondo o con lluvia. Siempre se muestra su número («Fuego 3 de 4»).
- **Lo que tiene borde de papel (las pegatinas) se puede juntar.** El resto es paisaje.
- **El humo** cubre lo que todavía no exploraste.
- **El códice** junta todas las cartas de saber, separadas por pueblo, y se puede recorrer sin jugar.

✏️ *Completar con los números finales del juego (Personas A y B).*

## Tecnologías

- **Juego web** en HTML, CSS y JavaScript, dibujado en Canvas 2D. Sin librerías externas. ✏️ *Stack final y publicación en GitHub Pages: Persona B.*
- **Arte:** motor de dibujo propio, «Corteza» (`arte/corteza/corteza.js`), y pegatinas pixel definidas como texto (`arte/fuente/arte.js`).
- **Sonido:** sintetizado con Web Audio (`sonido/ambiente.js`), sin archivos de audio.
- **Sin internet:** todo, tipografía incluida, se sirve desde el repositorio.
- **Herramientas de apoyo** (solo para regenerar imágenes): Node.js y Playwright.

## Fuentes

✏️ *La lista completa la arma la Persona C en `docs/03-contenido-cultural.md`.* Fuentes ya usadas en el arte y en los borradores de cartas (el detalle, con página, está en [`docs/05-rigor-historico.md`](docs/05-rigor-historico.md)):

- Cooper, J. M. (1946). «The Yahgan». En J. H. Steward (ed.), *Handbook of South American Indians*, vol. 1, pp. 81-106. Smithsonian Institution, Bureau of American Ethnology, Bulletin 143.
- Spears, J. R. (1895). *The Gold Diggings of Cape Horn*. Nueva York: Putnam.
- Museo Marítimo de Ushuaia. *La canoa yagán* (reconstrucción de una canoa de corteza).
- Multequina n.º 10 (IADIZA-CONICET), sobre los bosques de *Nothofagus* de Tierra del Fuego.
- Goodall, R. N. P. (1979). *Tierra del Fuego*. Buenos Aires: Ediciones Shanamaiim. *(En proceso de cotejo.)*

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
- **Presentación, cartas impresas y video (12/11):** Claude Code armó la presentación del pitch (`presentacion/`), las cartas para imprimir (`arte/cartas/`) y el storyboard del video (`equipo/video/`), y redactó este README con huecos marcados (✏️) para que los complete el equipo.
- **Pantallas y elementos nuevos (12/11):** Claude Code armó la maqueta navegable de las pantallas (`arte/pantallas/`) y dibujó los elementos nuevos con su fuente: ballena varada, guindo de corteza, aves, toninas, pescado, erizos y huevos. También redactó borradores de cartas de saber a partir de Cooper (1946), con página, que revisa la persona de investigación.

## Integrantes

Equipo **Tierra de los Humos**:

| Integrante | Rol |
|---|---|
| ✏️ *[nombre]* | Programación núcleo: motor, mapa, fuego, ciclo de partida |
| ✏️ *[nombre]* | Programación de interfaz, contenido y publicación |
| ✏️ *[nombre]* | Investigación cultural y consulta con comunidades |
| ✏️ *[nombre]* | Arte, sonido y comunicación |

✏️ *Indicar quién es la persona referente.*

## Licencias

- **Código:** [MIT](LICENSE).
- **Contenidos** (textos, arte, sonido y documentación): [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es), salvo que se indique otra cosa.
