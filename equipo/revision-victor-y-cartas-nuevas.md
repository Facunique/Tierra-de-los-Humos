# Cartas con Víctor como fuente principal y cierre del códice

14/11/2026 · Persona C. Revisión posterior al paso 5 y propuesta del paso 6.

## Criterio de atribución

La Persona C pidió priorizar a Víctor y usar a Cooper para lo que no pueda contrastarse con él. En esta revisión se usa **Vargas Filgueira, Víctor (2019), *Mi sangre yagán (ahua saapa yagan)*, primera edición digital, Editora Cultural Tierra del Fuego**. Todas sus páginas son las del visor del PDF de 90 páginas aportado fuera del repositorio.

La entrevista del 13/11/2026 se mantiene separada: las notas todavía señaladas con 🔍 no se convierten en confirmaciones por estar relacionadas con el libro. No se publican citas textuales ni respuestas nuevas atribuidas al referente.

Para presentar la perspectiva, se propone «Víctor Vargas Filgueira, autor yagán» y «en su memoria familiar, Vargas Filgueira relata…». Las pp. 8 y 85–86 documentan el vínculo del relato con su familia. No se lo renombra con el nombre de su bisabuelo ni se inventa un apellido, clan o denominación familiar. La elección final de esa presentación y los nombres de personajes quedan pendientes, como pidió C.

## Las nueve cartas actuales

Se actualizan `dato`, `fuente` y tres títulos, manteniendo IDs, estado, textos de juego, mapas e ilustraciones. Las nueve siguen en `borrador`: revisar fuentes no equivale a aprobación comunitaria. Siete cartas se sostienen con Vargas; amarre y pirita conservan a Cooper para el dato técnico que Vargas no documenta. Ambas también citan los pasajes pertinentes de Vargas, con su alcance separado.

La referencia complementaria es **Cooper, J. M. (1946), «The Yahgan», *Handbook of South American Indians*, vol. 1, Smithsonian Institution, pp. 81–106**, según los pasajes registrados por el equipo. No se atribuyen sus detalles al relato de Vargas.

| Carta | Dato de Vargas Filgueira (2019) | Alcance de Cooper en la carta o en la actividad complementaria |
|---|---|---|
| Fuego | p. 33: fuego dispuesto en la canoa | La carta usa Vargas. La actividad complementaria cita pp. 88 y 91 para la base del fogón. |
| Amarre | p. 33: mujeres remando | pp. 88 y 96: amarre en cachiyuyo. El pasaje de Vargas no lo verifica. |
| Mejillones | pp. 30 y 44: recolección de mariscos con marea baja; título «Recolectar en la costa» | La carta usa Vargas. La actividad cita p. 84, según Lothrop (1928), p. 32. No se equiparan nombres de especies por intuición. |
| Pescado | pp. 30 y 39: pesca para el campamento; título «Pescar para el campamento» | La carta usa Vargas. La actividad cita pp. 84 y 96 para línea, lazo y mano, sin atribuir esa técnica al relato de Vargas. |
| Hongos | p. 54: hongos de los árboles como alimento en un invierno difícil | La carta usa Vargas. La actividad conserva p. 84 para la técnica de conservación en seco. |
| Pirita | p. 66: pedernal y plumas conservadas secas | pp. 91 y 95: pirita, percusión, yesca y disponibilidad. El libro no confirma por sí solo la pirita. |
| Choza | pp. 30 y 33: armado y desarmado de campamentos; título «Preparar el campamento» | La carta usa Vargas. La actividad conserva pp. 85–86 para construcción y orientación. |
| Corteza | pp. 23 y 31–32: extracción estacional y material conservado | La carta usa Vargas. La actividad conserva p. 88 para comparar la descripción técnica. No se agrega una reparación al juego. |
| Ballena | pp. 16–17: viaje, alimento y encuentro de familias | La carta ya se sostiene con Vargas. Cooper permanece en la bibliografía para los otros usos registrados. |

## Ocho cartas nuevas, completas y todavía fuera del catálogo activo

Archivo: [`datos/saberes-propuestos.js`](../datos/saberes-propuestos.js). Cada carta tiene ID, estado, título, dato, propuesta de juego, fuente, alt y escena con la plantilla del repositorio. Se usan escenas existentes; no se afirma que sus dibujos representen reservas, ríos, mareas o clases de construcción que no están dibujados.

Para revisar sin abrir datos: [`cartas-propuestas-victor.pdf`](../arte/cartas/cartas-propuestas-victor.pdf), cuatro páginas con frentes y dorsos, marcadas como propuestas sin integrar. El PDF activo conserva sus nueve cartas y seis páginas.

| Carta | Episodio y página del visor | Relación con el nomadismo elegido |
|---|---|---|
| Volver por las reservas | pp. 53–54: expedición de ida y vuelta por provisiones de invierno | Abastecimiento y regreso, en vez de un único destino. |
| Buscar reparo del viento | p. 56: cambio a una bahía más protegida del viento del oeste | Elegir dónde descansar según el entorno. |
| Llegar con luz | pp. 33 y 44: atención a la luz y viajes por tramos cortos | Planificar recorrido y campamento. |
| Aprender con las personas mayores | pp. 39 y 44: construcción de pequeñas canoas y experiencia junto al grupo | Transmisión mediante práctica y acompañamiento. |
| Conversar el próximo rumbo | pp. 46 y 50: tareas compartidas, consejo de mayores y decisión del viaje | Elegir motivos del recorrido sin afirmar ausencia absoluta de autoridades. |
| La marea también abre paso | p. 61: cruce de una zona de algas con marea alta | Momento de paso durante el recorrido; distinto de la recolección con marea baja ya incluida en la carta actual. |
| Buscar agua fresca | pp. 46 y 61: tarea del campamento y búsqueda cuando se secan cursos pequeños | Considerar el agua al planificar una parada. |
| Guardar material para otro viaje | pp. 31–32: retirar corteza necesaria y conservar el resto | Previsión y disponibilidad para otras personas. |

La propuesta de reservas del paso 3 se concreta ahora en `reservas-invierno`; no se agrega una segunda carta con el mismo episodio. No se incorporan seres, ceremonias, cantos, nombres de personajes, escenas de violencia ni caza.

## Integración que necesita A y B

El núcleo descubre cartas por IDs concretos en eventos de remar, recolectar, amarrar y llegar al destino. Añadir ocho IDs al catálogo sin esos eventos dejaría cartas imposibles de encontrar y afectaría el cómputo del códice. Por eso las ocho cartas se entregan completas en un catálogo separado, sin cargarlo en `index.html`, cambiar efectos ni alterar la partida.

- A y B deben acordar los eventos de descubrimiento y, donde corresponda, los motivos de viaje. Marea, agua, reservas y orientación del reparo no son simulaciones ya implementadas.
- No se fijan costos, premios, porcentajes, duración ni beneficios heredados nuevos.
- Al incorporar cada carta al catálogo activo, sumar su actividad docente y regenerar los impresos. Las actividades actuales y los materiales activos se mantienen en nueve cartas.
- Las escenas reutilizadas no son reconstrucciones literales del pasaje. D puede proponer ilustraciones nuevas solo con su fuente y registro en docs/05.

## Cierre del paso 6

Texto y referencias en [`docs/07-cierre-del-codice.md`](../docs/07-cierre-del-codice.md). Está redactado en presente y conserva el vínculo con Paiakoala sin atribuir prácticas actuales específicas ni validación del juego. Queda listo para que C lo apruebe antes de que B y D sustituyan sus cierres provisorios.
