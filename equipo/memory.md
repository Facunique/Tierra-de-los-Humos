# Memoria del proyecto

> La memoria compartida del equipo y de los asistentes de IA. Acá va **lo que ya se decidió, lo que se sabe y lo que falta**. Se actualiza cada vez que hay una decisión. Lo más nuevo va arriba en cada sección.

## Estado actual

- **Fecha de la última actualización:** 13/11/2026 (día 5 de desarrollo).
- **Fase:** arranca la programación. Todavía no hay código del juego, pero el motor de dibujo (`arte/corteza/corteza.js`) y los módulos de abajo ya están listos para usar. Quién hace qué está en [`tareas.md`](tareas.md).
- **13/11:** se decidió el stack: JavaScript sin build, con `<script>` clásicos, en GitHub Pages (ver *Decisiones*).
- **13/11:** se mergeó el trabajo de arte de la Persona D (PR 2), se agendó la reunión del 14/11 con el referente de la comunidad yagán y se actualizó el reparto de tareas con los nombres.
- **Hecho:** `docs/00-guia-hackathon.md`, `docs/01-concepto.md`, `docs/04-direccion-de-arte.md` (con tres propuestas de estilo en `arte/propuestas/`), paleta y primer set de 42 sprites (`arte/`), sonido generado por código (`sonido/`), logo, plan de comunicación (`equipo/comunicacion.md`) y borrador del avance del 14/11 (`equipo/avance-14-11.md`).
- **También hecho (12/11):** estilo **Corteza** con motor de dibujo, vitrina, cartas, HUD, logo e imagen para compartir; auditoría histórica del arte contra el *Handbook of South American Indians* (`docs/05-rigor-historico.md`).
- **También hecho (12/11, noche):** maqueta navegable de las pantallas (`arte/pantallas/`), elementos nuevos con fuente, 9 borradores de cartas (`arte/cartas/saberes-borrador.js`) con su versión para imprimir, presentación del pitch (`presentacion/`), storyboard del video (`equipo/video/`) y README con huecos ✏️.
- **También hecho (12/11, cierre):** voz para leer las cartas (`sonido/voz.js`), postal del viaje (`arte/postal/`), versión de mesa (`mesa/`), modo alto contraste, stand de la demo (`stand/`), luz real de Ushuaia (`arte/corteza/luz-real.js`), sonido según el lugar y guía para docentes (`escuelas/`).
- **Módulos listos para que A y B los sumen al juego** (todos sin dependencias, ya probados en la maqueta `arte/pantallas/`):

  | Módulo | Qué hace | Cómo se usa |
  |---|---|---|
  | `arte/corteza/corteza.js` | Dibuja el mapa, la canoa, el humo y la luz | `TDH_CORTEZA.crear(canvas).escena({...})` |
  | `arte/corteza/transiciones.js` | Paso del fuego y aparición de carta | ver `docs/04`, sección 6 |
  | `arte/corteza/luz-real.js` | Hora y estación reales de Ushuaia | `TDH_LUZ_REAL.ahora()` → `{ hora, estacion, texto }` |
  | `sonido/ambiente.js` | Ambiente, efectos y sonido por lugar | `TDH_SONIDO.lugarDe(mapa, x, y)` |
  | `sonido/narrador.js` | Cuenta el viaje en voz alta, para jugar sin ver | `TDH_NARRADOR.conectar(TDH_VOZ).tras(eventos, partida.estado, partida.puede())` |
  | `sonido/juego.js` | Conecta el sonido con la partida: cada evento suena con su subtítulo | `TDH_SONIDO_JUEGO.conectar(sonido).eventos(partida.hacer(accion))` |
  | `sonido/voz.js` | Lee las cartas en voz alta | `TDH_VOZ.leerCarta(carta)` |
  | `arte/postal/postal.js` | Postal del viaje en PNG | `TDH_POSTAL.dibujar(canvas, TDH_POSTAL.datosDe(partida.estado, { generacion, saberes }))` |
  | `datos/saberes.js` | Las 9 cartas, con fuente, página y texto alternativo (antes `arte/cartas/saberes-borrador.js`) | `TDH_SABERES.SABERES` |

- **Editor de saberes (13/11):** `herramientas/editor-de-saberes.html` permite escribir o corregir cartas sin programar, también a partir de un relato de la comunidad (solo con permiso). Se puede mostrar en la reunión del 14/11.
- **Lo que encontraron las pruebas automáticas (13/11, Persona D)**, para que lo revisen A y B. No se tocó su código:
  - Se puede acampar noche tras noche sin gastar fuego, así que una partida podría no terminar nunca. ¿Limitar los acampes seguidos o que cada noche gaste algo?
  - En `pruebas/nucleo.html`, al cerrar una carta la celda cambia en 1 px y el motor vuelve a armar el mapa entero: un tirón de un segundo en un celular lento. Conviene calcular la celda solo al abrir y al cambiar el tamaño de la pantalla.
  - El cartel de «El viaje termina acá» no tiene margen interno, y en el celular el aviso de arriba tapa los íconos del HUD.
  - **Choque de nombres, ya resuelto de este lado:** el mapa de territorios (`arte/mapa/mapa.js`) y el mapa del núcleo (`juego/nucleo/mapa.js`) usaban los dos la global `TDH_MAPA`. El de territorios pasó a llamarse `TDH_TERRITORIOS` (lo usan la postal, el mapa, el cartel, la vidriera y la maqueta). El núcleo no tiene que cambiar nada.
  - **Antes de entregar (16/11):** `node pruebas/de-punta-a-punta.cjs` juega partidas enteras en cinco pantallas tocando los botones y avisa si algo se rompe.
- **Ideas para más adelante:** [`ideas.md`](ideas.md) es el lugar para coordinar ideas que todavía no se hicieron. Cualquiera del equipo puede sumar, acomodar o descartar; cada idea dice qué señal indica cuándo conviene hacerla, quién la propone y a quién le tocaría.
- **Siguiente:** elegir el destino del viaje con los hallazgos de `docs/05` (lo decide la Persona C), `docs/03-contenido-cultural.md` (fuentes y consulta), `docs/02-alcance-mvp.md`, acordar con A la estructura de carpetas y el contrato entre núcleo e interfaz (ver *Por decidir*), cotejar el libro de Goodall.

## Fechas clave

| Fecha | Qué |
|---|---|
| 14/11, 11:00 | Reunión en persona con el referente de la comunidad yagán. Ver `comunicaciones.md`. |
| 14/11 | Primer avance documentado (obligatorio). Meta: esqueleto jugable. |
| 17/11, 20:00 | Entrega final: se cierran los repositorios. Meta interna: terminar el 16. |
| 19/11 | Demo pública en Fábrica de Talento, Ushuaia (al menos 2 integrantes). |

## Decisiones

| Fecha | Decisión | Motivo |
|---|---|---|
| 13/11 | **Stack: HTML, CSS y JavaScript sin build**, con `<script>` clásicos que cuelgan globales `TDH_*`, igual que los módulos de la Persona D. Dibujo con Corteza en Canvas 2D, sin librerías externas. El juego va en `index.html`, en la raíz del repo. **Deploy:** GitHub Pages desde `main`, carpeta raíz, con `.nojekyll`. **Datos** de cartas y especies en archivos `.js`, no JSON ni Markdown. **Herencia** en `localStorage` con número de versión, guardando solo los `id` de las cartas. **Sin internet:** service worker en Pages (desde el 16/11) y, como plan B, la carpeta copiada con doble clic. **Pruebas** con `node --test`, sin dependencias. Sin linter ni formateador hasta después del 17/11. | Es lo único que anda con doble clic y sin internet sin configurar nada, y reusa todo lo que ya existe sin reescribirlo. Pesa unos 230 KB, bien para el celular con mala conexión. El QR del stand y la guía para docentes ya apuntan a la raíz de Pages. Se descartaron los módulos ES y Vite (no andan en `file://` y suman configuración), Phaser y Kaboom (se quedan con el canvas de Corteza) y Preact y Svelte (la maqueta ya resuelve las pantallas). Lo decidió la Persona B; pasar a módulos o a Vite más adelante es mecánico. |
| 13/11 | **Roles asignados:** A Mati, B Facu, C Dani, D Nacho (ver *Equipo* y `tareas.md`). | Cada persona sabe qué le toca y los documentos pueden seguir usando la letra. |
| 13/11 | Hasta que lo autorice, el referente de la comunidad yagán figura en el repo **solo por su rol**, sin su nombre. | El repo es público y todavía no le preguntamos. |
| 12/11 | **Estilo visual: B · Corteza.** El paisaje va en papel recortado, y lo que se junta (leña, mejillones, hongos, pirita, saberes) va como pegatina en pixel art. Todo lo dibujado se audita contra las fuentes etnográficas (`docs/05-rigor-historico.md`). | Lo eligió el equipo entre tres propuestas (`arte/propuestas/`). Más sereno, cuenta mejor el territorio, y las pegatinas dejan ver de un vistazo qué se puede agarrar. |
| 9/11 | Los personajes van **sin nombre propio** hasta consultar a la comunidad. | Usar nombres en lengua originaria sin permiso puede ser una falta de respeto. |
| 9/11 | Hay que **preguntar a la comunidad** si se puede jugar "como" alguien de su pueblo. Si dicen que no, el enfoque cambia (acompañar en vez de encarnar). | Respeto y requisito del eje 04. |
| 9/11 | Los saberes se **heredan dentro de cada pueblo**, no entre pueblos. El códice se separa por pueblo. | Cada pueblo tenía costumbres distintas. |
| 9/11 | **Yagán** es el pueblo del MVP. **Kawésqar** es el extra si llegamos. **Selk'nam** queda para el futuro. **Haush** no se incluye. | Yagán y Kawésqar eran vecinos y canoeros, así que comparten sistemas. Sobre los Haush hay muy poca documentación. |
| 9/11 | El juego es un **roguelike por turnos**: cada partida es un viaje, el fuego es la vida y lo aprendido pasa a la siguiente generación como cartas de saber con fuente citada. | Une la mecánica del roguelike con el tema del eje (memoria). |
| antes del 9/11 | Equipo inscripto en el **eje 04 · Memoria, Cultura e Innovación Comunitaria** con el nombre **Tierra de los Humos**. | Ver `docs/00-guia-hackathon.md`. |

## Por decidir

- **Estructura de carpetas y contrato entre núcleo e interfaz.** Propuesta de B, falta acordarla con A: `juego/nucleo/` (A, sin DOM ni `localStorage`, se prueba con Node), `juego/interfaz/` (B), `datos/` (C con B) y `pruebas/`. El núcleo expone `TDH_PARTIDA.nueva({ semilla, saberes })`, `partida.estado` con la forma que espera `motor.escena` y `partida.hacer(accion)`, que devuelve una lista de eventos (`fuego`, `junto`, `saber`, `fin`). Ese contrato ya está escrito como partida falsa en `pruebas/partida-falsa.js`, con pruebas en `pruebas/partida-falsa.test.cjs` que también sirven para el núcleo. Queda por acordar si `saberes` es el catálogo entero o solo lo que falta heredar. Los datos de cartas suman `id`, `pueblo`, `alt` y `estado` a los campos de `arte/cartas/saberes-borrador.js`.
- **Destino del viaje.** Tiene que ser un motivo real y documentado. **Ya hay base documental:** un grupo yagán podía entrar al territorio de otro para comer una ballena varada, para buscar piedras de fuego (pirita) o corteza buena para canoas (que solo se hallaban en ciertos lugares), por hambre o para hacer trueque (Cooper 1946, p. 94-95). Los varamientos reunían a muchas familias (p. 99). Falta que el equipo elija uno con la Persona C.
- **Integrantes para el README:** los roles ya están (ver *Equipo*). Falta decidir qué nombres publicar y quién es la persona referente.
- **Qué módulos de la Persona D entran al juego final** (luz real, sonido por lugar, voz, postal, alto contraste). La propuesta es sumarlos todos: ya andan en la maqueta y no cambian el diseño. Lo deciden A y B según el tiempo.
- **Revisión de la guía para docentes** (`escuelas/`) por la Persona C y, si se puede, por docentes.

## Lo que sabemos (y de dónde)

Datos ya chequeados o aclarados en el equipo. Lo que no tiene fuente confirmada lleva 🔍.

- **Martin Gusinde** hizo cuatro expediciones a Tierra del Fuego entre 1918 y 1924 (no en el 1800). Murió en 1969. Obra principal: *Die Feuerland-Indianer*; el tomo II trata sobre los yámana y el III sobre los kawésqar (que él llama *halakwulup*). Hay traducción al castellano: *Los indios de Tierra del Fuego*. 🔍 ediciones y años exactos.
- **Anne Chapman** trabajó desde mediados de los años 60 hasta los 2000 y murió en 2010. Sobre los yaganes: *European Encounters with the Yamana People of Cape Horn, Before and After Darwin* (2010). 🔍 edición.
- **Cristina Calderón** fue la última hablante nativa del yagán. Con Cristina Zárraga publicó *Hai kur mamashu shis* (relatos yaganes). 🔍 datos de la edición.
- Los **Kawésqar** vivían en los canales del oeste, que hoy están en Chile. Su consulta es aparte de la yagán.
- Gusinde y Chapman sirven como **fuentes escritas**, pero la **validación** tiene que venir de personas y comunidades vivas.
- **Manual de referencia (leído el 12/11):** Cooper, J. M. (1946), «The Yahgan», *Handbook of South American Indians*, vol. 1, p. 81-106 (Smithsonian, dominio público, en archive.org). Resume a Bridges, Hyades y Deniker, Lothrop y Gusinde. Lo principal, con página, está en `docs/05-rigor-historico.md`:
  - la mujer remaba, amarraba la canoa en el cachiyuyo y cuidaba el fuego, y el hombre iba adelante con las armas (p. 88 y 96);
  - el mejillón era el alimento principal (p. 84);
  - el fuego se hacía con pirita y pedernal (p. 91);
  - las chozas eran de domo o cónicas, con la puerta hacia el mar (p. 85-86);
  - el perro no está documentado antes de 1823 (p. 83).
- **A cotejar:** Goodall, R. N. P. (1978 o 1979, 3.ª ed. 🔍 confirmar con el ejemplar), *Tierra del Fuego*, Ediciones Shanamaiim. No está libre en línea; ver la lista de qué buscar en `docs/05`.
- **Para el arte (12/11, Persona D):** la canoa yagán era de corteza de coigüe de Magallanes (guindo), en tres piezas cosidas, con el fuego en el centro; la vivienda, de varas cubiertas con cueros, ramas y cortezas, con salida para el humo. Fuentes y detalle en `docs/04-direccion-de-arte.md`, secciones 1 y 2 (las fuentes son divulgativas: la Persona C las contrasta con Gusinde y Chapman). 🔍
- **El nombre:** las fuentes registran "Tierra de los Humos" y "Tierra de los Fuegos" desde temprano; la anécdota de Carlos V cambiando el nombre no tiene respaldo claro (Billiken). 🔍 fuente primaria.

## Contactos y consulta

El detalle de cada conversación está en [`comunicaciones.md`](comunicaciones.md). Acá solo el resumen.

| Quién | Relación con el proyecto | Estado |
|---|---|---|
| Referente de la comunidad yagán | Interlocutor principal para validar. | Reunión en persona el 14/11 a las 11:00. |
| Comunidad Yagán Paiakoala (Ushuaia) | Comunidad yagán viva. | Encontrada. Confirmar si es la comunidad del referente. |
| Mónica Alvarado | Fundadora del parque Yatana. Convivió con Cristina Calderón. Conocida de un integrante. | Hay que ver si se la puede contactar. |

## Glosario y convenciones

- **Saber / carta de saber:** lo que se aprende en un viaje y se hereda. Siempre con fuente.
- **Códice:** el modo museo donde se juntan todas las cartas, separado por pueblo.
- **Humo:** en el arte, la niebla de guerra (lo que todavía no se exploró) y los fogones lejanos.
- **Corteza:** el estilo visual. El paisaje es papel recortado; las **pegatinas** (pixel art con borde de papel) son lo que se puede juntar.
- **Paleta «Canales»:** los 42 colores del juego. Solo el fuego y el saber usan colores cálidos fuertes.
- **Viaje:** una partida. Se compone de **etapas**, y cada etapa de varias vueltas de *explorar, encontrar, volver*.
- **🔍:** pendiente de verificar con fuentes o con la comunidad.
- Grafías: **Yagán** (o Yámana), **Kawésqar**, **Selk'nam**, **Haush**.

## Equipo

Los documentos se refieren a cada integrante por letra.

| Letra | Integrante | Área |
|---|---|---|
| A | Mati | Programación núcleo: motor, mapa, fuego, ciclo de partida |
| B | Facu | Programación de interfaz, contenido y deploy: cartas, códice, accesibilidad, GitHub Pages |
| C | Dani | Consulta a la comunidad e investigación cultural |
| D | Nacho | Arte, sonido y comunicación |

Las tareas de cada uno, el cronograma y los pendientes del repo están en [`tareas.md`](tareas.md).
