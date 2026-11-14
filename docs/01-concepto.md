# 01 · Concepto

> Documento para alinear al equipo. Actualizado el 13/11/2026: Dani define el nomadismo como enfoque del viaje, con motivos que combinan clima, comida y ambiente. Su traducción a mecánicas queda pendiente con A y B. Lo que está marcado con 🔍 todavía hay que confirmarlo con fuentes y con las comunidades (ver `03-contenido-cultural.md`).

## Premisa

**Tierra de los Humos** es un roguelike web por turnos en el que cada partida es **un viaje por los canales fueguinos**. Al empezar elegís a qué pueblo acompañar, y cada uno vive el territorio a su manera: otros recursos, otros saberes, otros riesgos. La primera versión se centra en una familia **Yagán**. Si el tiempo alcanza, se suma una familia **Kawésqar**, sus vecinos canoeros del oeste.

En todos los casos hay algo que no puede faltar: **el fuego**. Se gasta con el frío, el viento y la lluvia, y se mantiene con lo que el territorio da. Si el fuego se apaga, el viaje termina. Pero lo aprendido no se pierde: **pasa a la siguiente generación** como *saberes*, cada uno con su fuente citada.

🔍 **Origen del nombre pendiente de verificar:** el equipo lo relaciona con relatos sobre los fuegos y el humo que veían los navegantes europeos en la costa. Falta una fuente histórica con autor, obra, año y página; no se presenta esta explicación como un dato confirmado.

## Pueblos

| Prioridad | Pueblo | Estado |
|---|---|---|
| 1 | **Yagán** | Entra en el MVP. Es el que juega en la demo del 20/11. |
| 2 | **Kawésqar** | Extra, si llegamos. Comparte la vida en canoa, así que reutiliza casi todos los sistemas. |
| Futuro | Selk'nam | Fuera de la hackatón. Pide otro tipo de mapa (a pie, estepa y bosque). |
| No | Haush | No se incluye: hay muy poca documentación para sostenerlo con rigor. |

| | Yagán | Kawésqar (extra) |
|---|---|---|
| Dónde | Canales del sur: Onashaga — Canal Beagle, islas hasta el cabo de Hornos | Canales e islas del oeste, desde el estrecho de Magallanes hacia el norte (hoy en territorio chileno) |
| Cómo se mueve | En canoa, con el fuego encendido a bordo | En canoa, con el fuego a bordo |
| Qué busca | Mariscos (mejillones, cholgas), lobos marinos, aves, leña en la orilla | A confirmar |
| Riesgo principal | Viento y oleaje en los canales, cruces largos, mantener el fuego en la canoa | A confirmar |
| Mecánica propia (idea) | Desplazamiento por agua entre islas. En el prototipo, el clima modifica el gasto del fuego | Se define cuando tengamos la investigación |

**Cotejo documental parcial de la columna Yagán:** las referencias ya registradas de Cooper, J. M. (1946), «The Yahgan», *Handbook of South American Indians*, vol. 1, Smithsonian Institution, aportan territorio y clima (p. 81), alimentos (p. 84) y canoa y fuego (pp. 88 y 91). 🔍 La mención de cholgas, los riesgos específicos de cruces y las afirmaciones de la columna Kawésqar requieren su cotejo propio antes de darse por revisadas. La mecánica del gasto es un recurso de juego. Las fuentes escritas no sustituyen las consultas pendientes de representación; la consulta Kawésqar es aparte.

**Nombres de lugares:** se presenta primero el nombre utilizado por Víctor y luego su correspondencia, según el criterio confirmado por la Persona C el 14/11: **Onashaga — Canal Beagle**. Fuente: Vargas Filgueira, Víctor (2019), *Mi sangre yagán (ahua saapa yagan)*, primera edición digital, Editora Cultural Tierra del Fuego, nota 1, pp. 86–88 del visor. Las demás correspondencias, las verificaciones cartográficas y los permisos pendientes están en [`06-toponimia.md`](06-toponimia.md).

## Bucle central: explorar, encontrar, volver

1. **Explorar**: salir del campamento hacia lo desconocido. El mapa se genera al azar en cada partida y se va revelando a medida que avanzás.
2. **Encontrar**: leña, comida, refugio, materiales. También *saberes*: momentos en que el viaje te enseña algo (por qué conviene acampar en tal lugar, qué se come en qué estación).
3. **Volver**: regresar al fuego antes de que se apague o antes de que cambie el clima. Cada paso gasta, así que alejarse es una apuesta.

Varias vueltas de este ciclo forman **una etapa**, y varias etapas forman **el viaje** en el diseño propuesto. El prototipo actual tiene un solo tramo y termina al llegar a un destino con el fuego encendido o cuando se apaga. Con el enfoque decidido por Dani, A y B deben acordar los objetivos y el cierre de la partida. No se definieron nuevas condiciones de victoria, cantidades de etapas ni duración; se documentarán en `02-alcance-mvp.md`.

### Enfoque del viaje: nomadismo

**Decisión de diseño de Dani (13/11/2026):** el viaje acompaña desplazamientos con motivos que combinan el clima, la comida y el ambiente. La ballena varada es uno de los motivos posibles. Los objetivos concretos y la forma de cerrar una partida quedan pendientes de acuerdo con A y B.

**Base documental aportada:** Vargas Filgueira, Víctor (2019), *Mi sangre yagán (ahua saapa yagan)*, primera edición digital, Editora Cultural Tierra del Fuego, relata desplazamientos para acudir a una ballena varada (pp. 16–17), recuperar corteza conservada para reparar una canoa (pp. 31–32, con estacionalidad de extracción en p. 23) y recuperar reservas de grasa para el invierno (pp. 53–54). Las páginas son las del visor de 90 páginas. Las notas iniciales de la Persona C se contrastaron con esos pasajes del PDF aportado, localizado el 14/11 fuera del repositorio.

**Dato y recurso de juego:** cada episodio conserva su fuente. La combinación de motivos, la familia, el mapa y las situaciones de cada partida son decisiones de ficción. «Nomadismo» nombra aquí el enfoque elegido por Dani; no se atribuye como expresión del entrevistado ni como descripción de la vida actual de todo el pueblo yagán. 🔍 Completar las páginas y el cotejo de las afirmaciones específicas sobre vientos, mareas y elección de refugio antes de trasladarlas a cartas o datos del territorio.

**Para A y B:** revisar el destino fijo del prototipo, los objetivos y los avisos de llegada según la propuesta registrada en `equipo/memory.md`. Este cambio de documentación todavía no implementa desplazamientos con objetivos variables.

## Entre partidas: la transmisión

- En la **mecánica ficticia de herencia**, cuando un viaje termina, bien o mal, los saberes descubiertos pasan a la siguiente generación del mismo pueblo. El juego guarda catálogos separados por pueblo. Esta separación de datos no es una afirmación sobre la utilidad o el intercambio de conocimientos entre pueblos.
- La partida siguiente empieza con esos saberes, que dan ventajas concretas (por ejemplo: el fuego dura más en la canoa, se reconoce dónde hay mariscos).
- Cada saber es una **carta** con un texto breve, una aclaración de qué es dato y qué es recurso de juego, y **la fuente citada**.
- Todas las cartas se juntan en un **códice** (modo museo), separado por pueblo, que se puede recorrer sin jugar. Es la parte pensada para escuelas.

**Lo aprendido se transmite.** Al terminar un viaje y empezar otro, la generación siguiente conserva los saberes. El fin de la partida no se presenta como la muerte de la familia.

## Personajes

- **Sin nombres propios** por ahora. Hablamos de "la familia", "la abuela", "el que rema", hasta saber si corresponde usar nombres y cuáles.
- **Primero se pregunta** a las comunidades si están de acuerdo con que se juegue "como" alguien de su pueblo. Si la respuesta es no, el enfoque cambia (por ejemplo, acompañar en vez de encarnar), y eso se decide antes de dibujar personajes.

## Tono

- **Sereno y respetuoso.** Más cerca de la contemplación que de la acción. El desafío es el clima y el territorio, no un enemigo.
- **Sin violencia** entre personas ni contra pueblos. Sin seres ceremoniales como monstruos (ver las líneas rojas de la [guía](00-guia-hackathon.md#líneas-rojas-cuidado-cultural)).
- **En presente.** El juego reconoce la continuidad del pueblo yagán y el códice debe cerrar con las comunidades de hoy. Vargas Filgueira (2019), *Mi sangre yagán (ahua saapa yagan)*, agradecimientos, p. 4, y epílogo, pp. 85–86 del visor, documenta su referencia a la Comunidad Yagán Paiakoala de Ushuaia y la continuidad de su pueblo. 🔍 La participación comunitaria en el proyecto y las prácticas actuales específicas requieren su propia confirmación; el libro no sustituye esa consulta.
- **Honesto sobre la ficción.** La familia, el mapa y los eventos son inventados; los saberes no. El juego lo dice.
- Visual a definir (pixel art u otras propuestas, ver tarea 6), con paleta del paisaje de los canales: mar gris, bosque de lenga, piedra, humo.

## Por qué aporta al eje 04 (memoria y cultura)

- **Enseña saberes concretos** sobre cómo se vivía y se vive en los canales (navegar, recolectar, cuidar el fuego, adaptarse al clima), no solo usa la cultura como decorado.
- **La mecánica es el mensaje**: la progresión del roguelike *es* la transmisión entre generaciones, y cada pueblo guarda la suya.
- **Profundidad antes que cantidad**: un pueblo bien contado y validado vale más que cuatro a medias.
- **Rigor visible**: cada carta tiene su fuente, y el códice funciona como material para escuelas.
- **Consulta en curso:** se realizó la entrevista a Víctor Vargas Filgueira (13/11/2026, Museo del Fin del Mundo, Ushuaia), registrada por Dani en `equipo/comunicaciones.md`. Las respuestas y permisos pendientes siguen abiertos; no se presenta esta entrevista como validación de todo el juego por la comunidad.

## Pendientes que salen de este documento

1. Acordar con A y B cómo se juega el enfoque de nomadismo decidido por Dani; verificar cada motivo concreto con su fuente y definir el cierre de la partida. 🔍
2. Consultar a la comunidad si podemos jugar como alguien de su pueblo, y si podemos usar nombres.
3. Confirmar la tabla de pueblos con las fuentes.
4. 🔍 Verificar el origen del nombre del juego y completar las páginas del epílogo y los agradecimientos de Vargas Filgueira (2019). Las restantes referencias incompletas están en `docs/05-rigor-historico.md` y `equipo/revision-cultural-paso-3.md`.
