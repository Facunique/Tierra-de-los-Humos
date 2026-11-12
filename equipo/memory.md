# Memoria del proyecto

> La memoria compartida del equipo y de los asistentes de IA. Acá va **lo que ya se decidió, lo que se sabe y lo que falta**. Se actualiza cada vez que hay una decisión. Lo más nuevo va arriba en cada sección.

## Estado actual

- **Fecha de la última actualización:** 12/11/2026 (día 4 de desarrollo).
- **Fase:** diseño y producción de arte. Todavía no hay código del juego, pero el motor de dibujo (`arte/corteza/corteza.js`) ya está listo para usar.
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
  | `sonido/voz.js` | Lee las cartas en voz alta | `TDH_VOZ.leerCarta(carta)` |
  | `arte/postal/postal.js` | Postal del viaje en PNG | `TDH_POSTAL.dibujar(canvas, datos)` |
  | `arte/cartas/saberes-borrador.js` | Las 9 cartas, con fuente y página | `TDH_SABERES.SABERES` |

- **Siguiente:** elegir el destino del viaje con los hallazgos de `docs/05` (lo decide la Persona C), `docs/03-contenido-cultural.md` (fuentes y consulta), `docs/02-alcance-mvp.md`, elegir el stack, cotejar el libro de Goodall.

## Fechas clave

| Fecha | Qué |
|---|---|
| 14/11 | Primer avance documentado (obligatorio). Meta: esqueleto jugable. |
| 17/11, 20:00 | Entrega final: se cierran los repositorios. Meta interna: terminar el 16. |
| 19/11 | Demo pública en Fábrica de Talento, Ushuaia (al menos 2 integrantes). |

## Decisiones

| Fecha | Decisión | Motivo |
|---|---|---|
| 12/11 | **Estilo visual: B · Corteza.** El paisaje va en papel recortado, y lo que se junta (leña, mejillones, hongos, pirita, saberes) va como pegatina en pixel art. Todo lo dibujado se audita contra las fuentes etnográficas (`docs/05-rigor-historico.md`). | Lo eligió el equipo entre tres propuestas (`arte/propuestas/`). Más sereno, cuenta mejor el territorio, y las pegatinas dejan ver de un vistazo qué se puede agarrar. |
| 9/11 | Los personajes van **sin nombre propio** hasta consultar a la comunidad. | Usar nombres en lengua originaria sin permiso puede ser una falta de respeto. |
| 9/11 | Hay que **preguntar a la comunidad** si se puede jugar "como" alguien de su pueblo. Si dicen que no, el enfoque cambia (acompañar en vez de encarnar). | Respeto y requisito del eje 04. |
| 9/11 | Los saberes se **heredan dentro de cada pueblo**, no entre pueblos. El códice se separa por pueblo. | Cada pueblo tenía costumbres distintas. |
| 9/11 | **Yagán** es el pueblo del MVP. **Kawésqar** es el extra si llegamos. **Selk'nam** queda para el futuro. **Haush** no se incluye. | Yagán y Kawésqar eran vecinos y canoeros, así que comparten sistemas. Sobre los Haush hay muy poca documentación. |
| 9/11 | El juego es un **roguelike por turnos**: cada partida es un viaje, el fuego es la vida y lo aprendido pasa a la siguiente generación como cartas de saber con fuente citada. | Une la mecánica del roguelike con el tema del eje (memoria). |
| antes del 9/11 | Equipo inscripto en el **eje 04 · Memoria, Cultura e Innovación Comunitaria** con el nombre **Tierra de los Humos**. | Ver `docs/00-guia-hackathon.md`. |

## Por decidir

- **Stack.** Propuesta: HTML + JavaScript con Canvas, con Vite o sin build, en GitHub Pages. Falta confirmarlo.
- **Destino del viaje.** Tiene que ser un motivo real y documentado. **Ya hay base documental:** un grupo yagán podía entrar al territorio de otro para comer una ballena varada, para buscar piedras de fuego (pirita) o corteza buena para canoas (que solo se hallaban en ciertos lugares), por hambre o para hacer trueque (Cooper 1946, p. 94-95). Los varamientos reunían a muchas familias (p. 99). Falta que el equipo elija uno con la Persona C.
- **Integrantes y roles** para el README.
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
- **A cotejar:** Goodall, R. N. P. (1979), *Tierra del Fuego*, Ediciones Shanamaiim. No está libre en línea; ver la lista de qué buscar en `docs/05`.
- **Para el arte (12/11, Persona D):** la canoa yagán era de corteza de coigüe de Magallanes (guindo), en tres piezas cosidas, con el fuego en el centro; la vivienda, de varas cubiertas con cueros, ramas y cortezas, con salida para el humo. Fuentes y detalle en `docs/04-direccion-de-arte.md`, secciones 1 y 2 (las fuentes son divulgativas: la Persona C las contrasta con Gusinde y Chapman). 🔍
- **El nombre:** las fuentes registran "Tierra de los Humos" y "Tierra de los Fuegos" desde temprano; la anécdota de Carlos V cambiando el nombre no tiene respaldo claro (Billiken). 🔍 fuente primaria.

## Contactos y consulta

El detalle de cada conversación está en [`comunicaciones.md`](comunicaciones.md). Acá solo el resumen.

| Quién | Relación con el proyecto | Estado |
|---|---|---|
| Comunidad Yagán Paiakoala (Ushuaia) | Comunidad yagán viva. Interlocutora principal para validar. | Encontrada. Sin contactar todavía. |
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
