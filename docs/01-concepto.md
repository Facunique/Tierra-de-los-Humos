# 01 · Concepto

> Documento para alinear al equipo. Actualizado el 13/11/2026: Dani define el nomadismo como enfoque del viaje, con motivos que combinan clima, comida y ambiente. Su traducción a mecánicas queda pendiente con A y B. Lo que está marcado con 🔍 todavía hay que confirmarlo con fuentes y con las comunidades (ver `03-contenido-cultural.md`).

## Premisa

**Tierra de los Humos** es un roguelike web por turnos en el que cada partida es **un viaje por los canales fueguinos**. Al empezar elegís a qué pueblo acompañar, y cada uno vive el territorio a su manera: otros recursos, otros saberes, otros riesgos. La primera versión se centra en una familia **Yagán**. Si el tiempo alcanza, se suma una familia **Kawésqar**, sus vecinos canoeros del oeste.

En todos los casos hay algo que no puede faltar: **el fuego**. Se gasta con el frío, el viento y la lluvia, y se mantiene con lo que el territorio da. Si el fuego se apaga, el viaje termina. Pero lo aprendido no se pierde: **pasa a la siguiente generación** como *saberes*, cada uno con su fuente citada.

El nombre viene del primer nombre que, según la tradición, los navegantes europeos le dieron a la isla por los fuegos y el humo que veían en la costa. 🔍

## Pueblos

| Prioridad | Pueblo | Estado |
|---|---|---|
| 1 | **Yagán** | Entra en el MVP. Es el que juega en la demo del 19/11. |
| 2 | **Kawésqar** | Extra, si llegamos. Comparte la vida en canoa, así que reutiliza casi todos los sistemas. |
| Futuro | Selk'nam | Fuera de la hackatón. Pide otro tipo de mapa (a pie, estepa y bosque). |
| No | Haush | No se incluye: hay muy poca documentación para sostenerlo con rigor. |

| | Yagán | Kawésqar (extra) |
|---|---|---|
| Dónde | Canales del sur: Beagle, islas hasta el cabo de Hornos | Canales e islas del oeste, desde el estrecho de Magallanes hacia el norte (hoy en territorio chileno) |
| Cómo se mueve | En canoa, con el fuego encendido a bordo | En canoa, con el fuego a bordo |
| Qué busca | Mariscos (mejillones, cholgas), lobos marinos, aves, leña en la orilla | A confirmar |
| Riesgo principal | Viento y oleaje en los canales, cruces largos, mantener el fuego en la canoa | A confirmar |
| Mecánica propia (idea) | Mapa de agua e islas. Remar gasta menos que caminar, pero el clima decide cuándo cruzar | Se define cuando tengamos la investigación |

🔍 Toda la tabla es un punto de partida con lo que ya sabe el equipo. **Hay que confirmar cada fila** con las fuentes y con las comunidades. La consulta sobre los Kawésqar es aparte: sus comunidades están del lado chileno.

## Bucle central: explorar, encontrar, volver

1. **Explorar**: salir del campamento hacia lo desconocido. El mapa se genera al azar en cada partida y se va revelando a medida que avanzás.
2. **Encontrar**: leña, comida, refugio, materiales. También *saberes*: momentos en que el viaje te enseña algo (por qué conviene acampar en tal lugar, qué se come en qué estación).
3. **Volver**: regresar al fuego antes de que se apague o antes de que cambie el clima. Cada paso gasta, así que alejarse es una apuesta.

Varias vueltas de este ciclo forman **una etapa**, y varias etapas forman **el viaje** en el diseño propuesto. El prototipo actual tiene un solo tramo y termina al llegar a un destino con el fuego encendido o cuando se apaga. Con el enfoque decidido por Dani, A y B deben acordar los objetivos y el cierre de la partida. No se definieron nuevas condiciones de victoria, cantidades de etapas ni duración; se documentarán en `02-alcance-mvp.md`.

### Enfoque del viaje: nomadismo

**Decisión de diseño de Dani (13/11/2026):** el viaje acompaña desplazamientos con motivos que combinan el clima, la comida y el ambiente. La ballena varada es uno de los motivos posibles. Los objetivos concretos y la forma de cerrar una partida quedan pendientes de acuerdo con A y B.

**Base documental aportada:** las notas de lectura de Dani sobre Vargas Filgueira, Víctor (2019), *Mi sangre yagán (ahua saapa yagan)*, primera edición digital, Editora Cultural Tierra del Fuego, señalan episodios de desplazamiento para acudir a una ballena varada (pp. 16–17), recuperar corteza conservada para reparar una canoa (pp. 31–32, con estacionalidad de la extracción en p. 23) y recuperar reservas de grasa para el invierno (pp. 53–54). Las páginas son las del visor del PDF de 90 páginas. El asistente trabaja con ese cotejo aportado por Dani; no leyó el ejemplar completo.

**Dato y recurso de juego:** cada episodio conserva su fuente. La combinación de motivos, la familia, el mapa y las situaciones de cada partida son decisiones de ficción. «Nomadismo» nombra aquí el enfoque elegido por Dani; no se atribuye como expresión del entrevistado ni como descripción de la vida actual de todo el pueblo yagán. 🔍 Completar las páginas y el cotejo de las afirmaciones específicas sobre vientos, mareas y elección de refugio antes de trasladarlas a cartas o datos del territorio.

**Para A y B:** revisar el destino fijo del prototipo, los objetivos y los avisos de llegada según la propuesta registrada en `equipo/memory.md`. Este cambio de documentación todavía no implementa desplazamientos con objetivos variables.

## Entre partidas: la transmisión

- Cuando un viaje termina, bien o mal, los saberes descubiertos pasan a la **siguiente generación del mismo pueblo**. Cada pueblo tiene su propio linaje y sus propios saberes, porque sus costumbres eran distintas. Un saber yagán no le sirve a una familia kawésqar, ni al revés.
- La partida siguiente empieza con esos saberes, que dan ventajas concretas (por ejemplo: el fuego dura más en la canoa, se reconoce dónde hay mariscos).
- Cada saber es una **carta** con un texto breve, una aclaración de qué es dato y qué es recurso de juego, y **la fuente citada**.
- Todas las cartas se juntan en un **códice** (modo museo), separado por pueblo, que se puede recorrer sin jugar. Es la parte pensada para escuelas.

Así, morir y volver a empezar, que es lo propio del roguelike, deja de ser castigo y se vuelve **memoria que se transmite**.

## Personajes

- **Sin nombres propios** por ahora. Hablamos de "la familia", "la abuela", "el que rema", hasta saber si corresponde usar nombres y cuáles.
- **Primero se pregunta** a las comunidades si están de acuerdo con que se juegue "como" alguien de su pueblo. Si la respuesta es no, el enfoque cambia (por ejemplo, acompañar en vez de encarnar), y eso se decide antes de dibujar personajes.

## Tono

- **Sereno y respetuoso.** Más cerca de la contemplación que de la acción. El desafío es el clima y el territorio, no un enemigo.
- **Sin violencia** entre personas ni contra pueblos. Sin seres ceremoniales como monstruos (ver las líneas rojas de la [guía](00-guia-hackathon.md#líneas-rojas-cuidado-cultural)).
- **En presente.** Los pueblos fueguinos tienen comunidades vivas hoy, como la comunidad yagán Paiakoala en Ushuaia. El juego no los cuenta como "desaparecidos", y el códice debería cerrar con esa realidad actual.
- **Honesto sobre la ficción.** La familia, el mapa y los eventos son inventados; los saberes no. El juego lo dice.
- Visual a definir (pixel art u otras propuestas, ver tarea 6), con paleta del paisaje de los canales: mar gris, bosque de lenga, piedra, humo.

## Por qué aporta al eje 04 (memoria y cultura)

- **Enseña saberes concretos** sobre cómo se vivía y se vive en los canales (navegar, recolectar, cuidar el fuego, adaptarse al clima), no solo usa la cultura como decorado.
- **La mecánica es el mensaje**: la progresión del roguelike *es* la transmisión entre generaciones, y cada pueblo guarda la suya.
- **Profundidad antes que cantidad**: un pueblo bien contado y validado vale más que cuatro a medias.
- **Rigor visible**: cada carta tiene su fuente, y el códice funciona como material para escuelas.
- **Construido con consulta**: el contacto con la comunidad Paiakoala y con quienes conocieron a la última hablante nativa del yagán es parte del proyecto, no un agregado.

## Pendientes que salen de este documento

1. Acordar con A y B cómo se juega el enfoque de nomadismo decidido por Dani; verificar cada motivo concreto con su fuente y definir el cierre de la partida. 🔍
2. Consultar a la comunidad si podemos jugar como alguien de su pueblo, y si podemos usar nombres.
3. Confirmar la tabla de pueblos con las fuentes.
