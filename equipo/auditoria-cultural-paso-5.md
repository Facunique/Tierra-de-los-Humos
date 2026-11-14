# Auditoría cultural · Paso 5

Fecha: 14/11/2026. Responsable: Persona C.

**Resultado:** revisión de los textos y sus dependencias completada; no equivale a validación comunitaria ni a cierre de todas las observaciones. Se aplicaron cuatro ajustes editoriales menores en el README con la autorización de esta sesión. Las propuestas de contenido importante y las piezas de otras personas quedan registradas para su decisión e implementación. No se modificaron código, números, cartas, reglas, actividades ni archivos de arte.

## Criterios y fuentes

La revisión usa las líneas rojas de `docs/00-guia-hackathon.md` y AGENTS.md, el registro de `equipo/comunicaciones.md` y las referencias ya aportadas en `docs/03-contenido-cultural.md`, `docs/05-rigor-historico.md` y `docs/06-toponimia.md`. No se incorporó una fuente cultural nueva ni se completaron datos de memoria.

Se distingue una falta de referencia de una afirmación demostrada falsa. Las palabras «extinguidos» o «desaparecidos» en una indicación que pide evitarlas no son una infracción; los títulos históricos de obras se conservan como citas bibliográficas. Describir una práctica del pasado con autor y contexto tampoco equivale a afirmar que el pueblo no existe hoy.

## Cobertura

| Área | Archivos y salida revisados | Alcance |
|---|---|---|
| Cartas | `datos/saberes.js`; PDF de cartas de 6 páginas | Nueve cartas: dato, juego, fuente y alt ya revisados en el paso 3. Se mantiene su estado actual; este paso no agrega datos ni permisos. |
| Sonido | `sonido/juego.js`, `sonido/narrador.js`; dependencias `voz.js`, `ambiente.js`, demo y README | Textos de eventos, nombres del entorno, lectura de cartas y generación del ambiente. Revisión de texto y código fuente; no se hizo una validación de pronunciación con hablantes. |
| Mesa | `README.md`, `reglas.html`, `tablero.html`, `fichas.html`, `mesa.js`, exportador y tres PDF | Texto impreso, leyendas, pautas de juego y separación de ficción. No se tocaron reglas ni cantidades. |
| Escuelas | `actividades.js`, `guia.html`, README, exportador y PDF de 8 páginas | Las nueve actividades, sus cuidados y las partes estáticas de fuentes y mapa. La revisión no sustituye la de docentes ni una consulta pedagógica. |
| Presentación | `index.html`, notas del orador, exportador, nueve JPG y PDF de 9 páginas | Texto visible y guion completo del HTML. Inspección visual de las nueve diapositivas JPG y de la página 4 del PDF para verificar la diferencia con la carta actual. El PDF no permite extraer texto. |
| Stand | `cartel.html`, `vidriera.html`, README, exportador, QR y cartel PDF | Textos fijos, leyendas generadas por escenas, tarjetas y mapa compartidos. |
| Presentación pública del repo | `README.md` completo | Fuentes, ficción, consulta, nombres y alt. Los cuatro ajustes menores se detallan como R01–R04. |
| Dependencias visibles | `index.html`, `juego/interfaz/juego.js`, `arte/mapa/mapa.js`, maqueta de pantallas y logo | Se siguieron las referencias desde las piezas anteriores para identificar el cierre «Hoy», los rótulos y las imágenes. Las propuestas se dejan para B y D; no se editó su código. |

## Hallazgos por archivo y línea

Las líneas señalan la versión de esta revisión. En los casos R01–R04, el enlace apunta al texto ya corregido. **Alta** indica una decisión o revisión necesaria antes de presentar esa pieza; **Media**, una referencia o precisión a resolver. Una observación de tono no se presenta como prueba de una violación de las bases.

### P01 · Alta · Decisión de tono pendiente

- **Archivo y línea:** [README.md:28](../README.md#L28)<br>[mesa/README.md:19](../mesa/README.md#L19)<br>[mesa/reglas.html:90](../mesa/reglas.html#L90)<br>[presentacion/index.html:148](../presentacion/index.html#L148)<br>[stand/cartel.html:58](../stand/cartel.html#L58)
- **Observación:** Se asocia el apagado del fuego y el cambio de generación con morir. El núcleo informa el fin del viaje, sin describir una muerte. Es una cuestión importante de tono; no se clasifica por sí sola como una escena de violencia.
- **Propuesta o ajuste:** Propuesta consultada: «Lo aprendido se transmite» y «Al terminar un viaje, lo aprendido pasa a la generación siguiente». Mantener la mecánica actual. Esperar la respuesta a la consulta antes de sustituir esta formulación en piezas del equipo.
- **Responsable y fuente:** C decide el tono; D y B aplican en sus piezas. Fuentes de contexto: docs/01, contrato de fin de partida y consulta abierta.

### P02 · Alta · Permiso pendiente

- **Archivo y línea:** [mesa/reglas.html:43](../mesa/reglas.html#L43)<br>[index.html:52](../index.html#L52)
- **Observación:** La versión de mesa dice que quienes juegan son la familia; el concepto usa acompañar. La entrevista registrada todavía no responde el alcance de la representación.
- **Propuesta o ajuste:** Unificar el texto propuesto como «Juegan en cooperación y acompañan a una familia ficticia». Mantener abierta la consulta sobre representación y no afirmar que ya fue autorizada.
- **Responsable y fuente:** C con la consulta; D y B en sus textos. Registro: equipo/comunicaciones.md, preguntas 1 y 2.

### P03 · Alta · Fuente y consulta pendientes

- **Archivo y línea:** [index.html:147](../index.html#L147)<br>[arte/pantallas/index.html:222](../arte/pantallas/index.html#L222)
- **Observación:** El cierre «Hoy» atribuye prácticas actuales de lengua, memoria y oficios sin una fuente actual localizada. El aviso de texto provisorio no aporta la referencia.
- **Propuesta o ajuste:** Resolver en el paso 6 con las páginas del epílogo y agradecimientos de Vargas Filgueira (2019) y con lo que la consulta autorice comunicar. Mientras tanto, proponer un texto general sobre continuidad sin atribuir prácticas concretas a toda la comunidad.
- **Responsable y fuente:** C redacta; B y D integran. No se modificó el cierre ni se inventaron páginas.

### P04 · Alta · Fuente pendiente

- **Archivo y línea:** [presentacion/index.html:79](../presentacion/index.html#L79)<br>[presentacion/index.html:88](../presentacion/index.html#L88)<br>[presentacion/index.html:89](../presentacion/index.html#L89)
- **Observación:** La nota del orador cuenta un episodio sobre navegantes, humo y el estrecho como hecho histórico. No hay una fuente completa para esa explicación del nombre en el material aportado. La diapositiva 2 agrega afirmaciones generales sobre cómo se cuenta a los pueblos y cuánto conocen jóvenes y escuelas, sin una investigación localizada.
- **Propuesta o ajuste:** Propuesta de apertura del equipo: «Cada partida acompaña a una familia ficticia por los canales fueguinos. El fuego sostiene el viaje y las cartas guardan lo aprendido». Reservar la historia del nombre hasta tener autor, obra, año y página. Presentar el problema como el propósito de acercar fuentes a jóvenes y escuelas, siguiendo el ajuste R02 del README, sin dar por medida la situación.
- **Responsable y fuente:** D, con revisión de C. docs/01 mantiene el origen del nombre con 🔍.

### P05 · Alta · Datos de consulta sin completar

- **Archivo y línea:** [presentacion/index.html:103](../presentacion/index.html#L103)<br>[presentacion/index.html:104](../presentacion/index.html#L104)<br>[presentacion/index.html:110](../presentacion/index.html#L110)
- **Observación:** La diapositiva de consulta y su guía oral conservan huecos pese a que la entrevista ya se realizó. Tampoco separan los aportes de la entrevista, los del libro y las decisiones del equipo.
- **Propuesta o ajuste:** Completar con la entrevista a Víctor Vargas Filgueira del 13/11, su permiso de atribución y la consulta abierta. Describir la corrección de corteza y el enfoque de nomadismo como trabajo y decisiones del equipo; no atribuirlos al entrevistado sin respuesta registrada.
- **Responsable y fuente:** D con C. Fuente: equipo/comunicaciones.md y docs/03. El permiso permite nombrar al referente; no equivale a validación comunitaria.

### P06 · Alta · Guía y bibliografía desactualizadas

- **Archivo y línea:** [escuelas/guia.html:135](../escuelas/guia.html#L135)<br>[escuelas/guia.html:253](../escuelas/guia.html#L253)<br>[escuelas/README.md:23](../escuelas/README.md#L23)
- **Observación:** La guía presenta todas las cartas como una mirada externa de Cooper y su bibliografía estática solo enumera ese capítulo. Las cartas de amarre y ballena ya incluyen Vargas Filgueira (2019).
- **Propuesta o ajuste:** Distinguir las fuentes históricas de la obra de Vargas Filgueira y de la entrevista; remitir al documento de fuentes completo. Propuesta de título: «Cada fuente tiene autor y contexto». Regenerar la guía después.
- **Responsable y fuente:** C propone los textos; D mantiene la guía. Fuentes: docs/03 y datos/saberes.js.

### P07 · Media · Contexto de las tareas

- **Archivo y línea:** [escuelas/actividades.js:33](../escuelas/actividades.js#L33)<br>[mesa/reglas.html:78](../mesa/reglas.html#L78)<br>[presentacion/index.html:129](../presentacion/index.html#L129)
- **Observación:** Se formula la distribución de tareas de manera general, aunque esté citada. La advertencia de la actividad de amarre habla de observadores externos sin distinguir las fuentes nuevas.
- **Propuesta o ajuste:** Introducir «Cooper describe…» y comparar con Vargas Filgueira (2019), p. 33 del visor, para el remo, sin usarlo como prueba de todas las otras tareas. La observación de un dibujo no establece una regla de todas las familias actuales.
- **Responsable y fuente:** C con D. Cooper (1946), pp. 88 y 96; Vargas Filgueira (2019), p. 33 del visor.

### P08 · Media · Referencia arqueológica pendiente en la actividad

- **Archivo y línea:** [escuelas/actividades.js:44](../escuelas/actividades.js#L44)<br>[escuelas/actividades.js:45](../escuelas/actividades.js#L45)
- **Observación:** La actividad agrega una explicación de formación y ubicación de conchales sin citar a Bird. La simulación con envoltorios necesita quedar distinguida del sitio arqueológico.
- **Propuesta o ajuste:** Propuesta: «Comparen la carta con Bird (1946), “The Archeology of Patagonia”, pp. 20–21. ¿Qué preguntas podrían investigar sobre alimentación y ocupación?». Identificar el registro de meriendas como una simulación de aula, sin presentarlo como explicación completa de un conchal.
- **Responsable y fuente:** C, con D para el PDF. Bird documenta la presencia de conchales; no se le atribuye la disposición exacta de casas y valvas.

### P09 · Media · Generalización de un método

- **Archivo y línea:** [escuelas/actividades.js:60](../escuelas/actividades.js#L60)
- **Observación:** El cuidado de la actividad puede leerse como una regla sobre toda la pesca, mientras la carta actual describe un método documentado.
- **Propuesta o ajuste:** Propuesta: «Dibujen el método que describe esta carta: línea, lazo y mano. No agreguen herramientas que ese pasaje no menciona». Mantener pendientes las notas orales sobre otros métodos hasta revisar la grabación.
- **Responsable y fuente:** C. Cooper (1946), pp. 84 y 96; entrevista pendiente de revisión.

### P10 · Media · Explicaciones añadidas sin referencia

- **Archivo y línea:** [escuelas/actividades.js:27](../escuelas/actividades.js#L27)<br>[escuelas/actividades.js:77](../escuelas/actividades.js#L77)
- **Observación:** La dificultad de volver a encender fuego se infiere sin una referencia localizada. La definición mineralógica se añade como dato sin fuente propia.
- **Propuesta o ajuste:** Sustituir la primera por preguntas sobre los materiales que describen las fuentes y la segunda por una búsqueda documentada de geología. No usar la rareza o distribución de la pirita como prueba automática de dificultad.
- **Responsable y fuente:** C. Las cartas citan Cooper (1946), pp. 91 y 95; una explicación mineralógica necesita una referencia adicional.

### P11 · Media · Referencia normativa incompleta

- **Archivo y línea:** [escuelas/actividades.js:49](../escuelas/actividades.js#L49)<br>[escuelas/README.md:26](../escuelas/README.md#L26)
- **Observación:** Se hace una afirmación jurídica sobre los conchales sin una referencia primaria enlazada ni localización del pasaje. Las fuentes culturales aportadas no verifican ese alcance legal.
- **Propuesta o ajuste:** Completar la referencia primaria antes de mantener la afirmación jurídica, o conservar solo una pauta de actividad: «Trabajen con registros e imágenes y dejen los materiales de los sitios en su lugar». No se evaluó aquí la interpretación de la norma.
- **Responsable y fuente:** C con docentes. No se incorporan referencias legales de memoria.

### P12 · Media · Derechos de imágenes en la pauta docente

- **Archivo y línea:** [escuelas/guia.html:137](../escuelas/guia.html#L137)
- **Observación:** La pauta pide autor, fecha y contexto para mostrar fotos históricas, pero no menciona revisar los derechos y las autorizaciones. No se detectaron fotos históricas usadas como arte del juego en las piezas examinadas.
- **Propuesta o ajuste:** Agregar a la pauta la revisión de derechos y permisos antes de usar una imagen. Mantener el arte propio del juego y no proponer escaneos o fotografías del libro como recursos publicados.
- **Responsable y fuente:** C con D. Regla explícita de AGENTS.md y líneas rojas; no es una conclusión sobre la licencia de una foto concreta.

### P13 · Alta · Cartografía, rótulos e implementación pendientes

- **Archivo y línea:** [arte/mapa/mapa.js:42](../arte/mapa/mapa.js#L42)<br>[escuelas/guia.html:172](../escuelas/guia.html#L172)<br>[stand/cartel.html:62](../stand/cartel.html#L62)<br>[stand/vidriera.html:160](../stand/vidriera.html#L160)
- **Observación:** Las piezas comparten el mapa basado en Natural Earth. Sigue abierta la verificación con el IGN. El rótulo todavía no aplica el orden Onashaga — Canal Beagle confirmado por C.
- **Propuesta o ajuste:** D debe implementar los rótulos documentados de docs/06, con sus verificaciones y permisos pendientes, y revisar la cartografía exigida por la guía. No renombrar lugares sin equivalencia ni mover coordenadas para hacerlos coincidir por intuición.
- **Responsable y fuente:** C aporta fuentes; D implementa. No se modificó código ni se declaró oficial un nombre del libro.

### P14 · Media · Territorio ancestral y presente

- **Archivo y línea:** [escuelas/guia.html:116](../escuelas/guia.html#L116)<br>[escuelas/guia.html:165](../escuelas/guia.html#L165)
- **Observación:** La pregunta sobre dónde viven hoy se responde mostrando un mapa de territorios ancestrales. Las ciudades actuales dibujadas no verifican la distribución actual de las comunidades.
- **Propuesta o ajuste:** Propuesta: «¿Qué territorios describen estas fuentes históricas? ¿Qué sabemos, con fuentes actuales, de las comunidades de hoy?». Conservar ambas preguntas separadas.
- **Responsable y fuente:** C con D. Cooper (1946) y Bird (1946) contextualizan el mapa; faltan referencias actuales localizadas para la segunda pregunta.

### P15 · Media · Alcance de la revisión exagerado

- **Archivo y línea:** [escuelas/guia.html:255](../escuelas/guia.html#L255)<br>[presentacion/index.html:123](../presentacion/index.html#L123)
- **Observación:** Se puede interpretar que todo el arte ya está verificado, aunque docs/05 conserva fuentes y especies pendientes.
- **Propuesta o ajuste:** Propuesta: «El proyecto registra fuentes y pendientes para cada elemento del arte en docs/05». En el pitch, usar ejemplos concretos con referencia y mantener visibles las dudas que aún importan.
- **Responsable y fuente:** C con D. Registro de fuentes y pendientes en docs/05 y docs/03.

### P16 · Media · Fuente del dato en el cartel

- **Archivo y línea:** [stand/cartel.html:57](../stand/cartel.html#L57)
- **Observación:** El cartel presenta el dato del fuego en la canoa sin autor, obra ni página en ese bloque. La referencia al mapa del pie no documenta ese dato.
- **Propuesta o ajuste:** Agregar una referencia breve a Cooper (1946), «The Yahgan», pp. 88 y 91, y el acceso a la bibliografía del proyecto. Conservar como recurso de juego la comparación entre fuego y barra de vida.
- **Responsable y fuente:** D, con C. No se atribuye al referente una afirmación que solo se tomó del capítulo escrito.

### P17 · Media · Ficción insuficientemente señalada en piezas autónomas

- **Archivo y línea:** [stand/cartel.html:54](../stand/cartel.html#L54)<br>[stand/vidriera.html:136](../stand/vidriera.html#L136)<br>[presentacion/index.html:75](../presentacion/index.html#L75)
- **Observación:** El juego principal y las reglas de mesa explican la ficción. El cartel, la vidriera y el pitch pueden circular de forma independiente sin ese aviso explícito.
- **Propuesta o ajuste:** Propuesta breve para cada pieza: «La familia, el mapa y los eventos son ficción. Cada dato cultural conserva su fuente». Mantener el aviso legible también al imprimir o reproducir en bucle.
- **Responsable y fuente:** D con C. Criterio de dato y recurso de juego de AGENTS.md.

### P18 · Media · Voz colectiva sugerida sin alcance de consulta

- **Archivo y línea:** [stand/vidriera.html:180](../stand/vidriera.html#L180)
- **Observación:** El cierre puede presentar el juego como voz de los pueblos en conjunto, sin explicar que la consulta registrada corresponde a un referente y continúa abierta.
- **Propuesta o ajuste:** Propuesta: «Conocé las fuentes y la consulta que acompañan este proyecto», enlazada al registro público. No presentar una voz colectiva o validación que no está registrada.
- **Responsable y fuente:** D con C. Fuente oral y alcance de permisos en equipo/comunicaciones.md.

### P19 · Media · Identificación de fauna en el texto audible

- **Archivo y línea:** [sonido/narrador.js:37](../sonido/narrador.js#L37)<br>[sonido/narrador.js:38](../sonido/narrador.js#L38)<br>[juego/nucleo/territorio/elementos.js:134](../juego/nucleo/territorio/elementos.js#L134)
- **Observación:** El narrador usa nombres de fauna cuyos datos del territorio todavía tienen identificación o distribución pendiente. Los registros de alimento de Cooper no verifican por sí solos cada dibujo o especie local.
- **Propuesta o ajuste:** B y D deben acordar con C los nombres provisionales y la identificación de los dibujos. No asignar un nombre científico o una especie del Beagle sin la fuente correspondiente.
- **Responsable y fuente:** C aporta la fuente; B mantiene el narrador; D verifica el arte. Permanecen los 🔍 de tonina, pato vapor y cormorán.

### P20 · Media · Pronunciación no revisada

- **Archivo y línea:** [sonido/voz.js:27](../sonido/voz.js#L27)<br>[sonido/voz.js:70](../sonido/voz.js#L70)
- **Observación:** La lectura automática en castellano también lee el título de la obra con palabras en lengua yagán. La elección de voz no verifica pronunciación ni aporta una grabación de la comunidad.
- **Propuesta o ajuste:** Antes de sumar topónimos a la lectura, revisar con la consulta el modo de pronunciarlos y cómo identificar la lectura automática. No presentar la síntesis del sistema como una voz o pronunciación validada por la comunidad.
- **Responsable y fuente:** B con C; cualquier grabación exige su permiso y atribución. No se modificó la lógica de voz.

### P21 · Alta · Material exportado desactualizado

- **Archivo y línea:** [presentacion/index.html:268](../presentacion/index.html#L268)<br>[datos/saberes.js:61](../datos/saberes.js#L61)
- **Observación:** La diapositiva 4 exportada y la página 4 del PDF conservan el dato antiguo «La mujer manejaba la canoa…» y solo Cooper. El HTML toma la carta actual, que atribuye la descripción y agrega Vargas Filgueira (2019), p. 33 del visor.
- **Propuesta o ajuste:** Después de los cambios acordados del pitch, D debe regenerar las nueve diapositivas y pitch.pdf y comprobar la fuente y la legibilidad de la carta. No basta con corregir solo el HTML.
- **Responsable y fuente:** D. Confirmado visualmente en presentacion/diapositivas/04.jpg y presentacion/pitch.pdf, página 4.

### P22 · Media · Consulta futura frente al registro actual

- **Archivo y línea:** [escuelas/guia.html:290](../escuelas/guia.html#L290)<br>[mesa/reglas.html:104](../mesa/reglas.html#L104)
- **Observación:** Las formulaciones no distinguen la entrevista ya realizada de la validación y las respuestas que siguen abiertas.
- **Propuesta o ajuste:** Indicar «La consulta comenzó con una entrevista a un referente y sigue abierta», con acceso al registro. No afirmar que ya se revisó la guía o el juego entero con la comunidad.
- **Responsable y fuente:** C con D. Fecha y alcance de la entrevista en docs/03.

### P23 · Media · Alcance de «todo es libre»

- **Archivo y línea:** [escuelas/guia.html:249](../escuelas/guia.html#L249)
- **Observación:** El texto puede confundirse con una autorización para copiar las obras citadas, especialmente al agregar la publicación de 2019 a las fuentes.
- **Propuesta o ajuste:** Precisar que la licencia abierta corresponde a los materiales propios del proyecto. Conservar las condiciones de las obras citadas y no publicar el PDF ni escaneos del libro.
- **Responsable y fuente:** C con D. Licencias del proyecto en README y regla de privacidad; no se atribuye una licencia nueva al libro.

### R01 · Menor · Corregido en esta revisión

- **Archivo y línea:** [README.md:3](../README.md#L3)
- **Observación:** El alt anterior asignaba hombre y mujer a figuras sin rasgos.
- **Propuesta o ajuste:** Se describe lo visible: dos figuras, remo y arpón en reposo. No se modificó la imagen.
- **Responsable y fuente:** Ajuste editorial autorizado. Inspección de arte/logo/compartir.png.

### R02 · Menor · Corregido en esta revisión

- **Archivo y línea:** [README.md:17](../README.md#L17)
- **Observación:** El problema se formulaba como una afirmación general sobre cuánto conocen los jóvenes y cómo se cuenta a los pueblos, sin una referencia o investigación localizada.
- **Propuesta o ajuste:** Se presenta el desafío y propósito del proyecto, sin dar por medida esa situación en todas las escuelas.
- **Responsable y fuente:** Ajuste editorial autorizado; no se agregó una afirmación cultural nueva.

### R03 · Menor · Corregido en esta revisión

- **Archivo y línea:** [README.md:23](../README.md#L23)
- **Observación:** La presentación inicial no reunía en un aviso explícito qué componentes son ficción.
- **Propuesta o ajuste:** Se agregó el aviso y se conservó la fuente de cada dato y el marcador de pendientes.
- **Responsable y fuente:** Ajuste editorial autorizado. Criterio de AGENTS.md y docs/01.

### R04 · Menor · Corregido en esta revisión

- **Archivo y línea:** [README.md:29](../README.md#L29)<br>[README.md:52](../README.md#L52)
- **Observación:** La frase «Todo se cuenta en presente, con consulta a la comunidad» no precisaba el alcance de esa consulta. El índice tampoco incluía los documentos nuevos de fuentes y lugares.
- **Propuesta o ajuste:** Se enlazó el alcance de la consulta y se agregaron los documentos 03 y 06 al índice.
- **Responsable y fuente:** Ajuste editorial autorizado. El permiso del referente no se amplió.

## Actividades docentes, una por una

| Carta | Resultado de la revisión |
|---|---|
| Fuego | La base del fogón conserva la referencia de la carta. La dificultad de reencendido se infiere sin pasaje localizado: P10. Las explicaciones de ciencias naturales necesitan su propia fuente si se presentan como datos. |
| Amarre | Hay autor y página para las tareas, pero falta mantener el contexto y distinguir la referencia de Vargas Filgueira: P06–P07. |
| Mejillones | La actividad añade conchales y una simulación de aula; requieren distinguir dato, referencia y ejercicio: P08. La cita normativa queda pendiente: P11. |
| Pescado | El método documentado se puede trabajar; el cuidado debe referirse a ese método y no a toda la pesca: P09. |
| Hongos | Se distingue conservación en seco y experimento de aula. No se agrega una especie. La revisión del experimento y de sus pautas corresponde también a docentes; no se lo declara validado por esta auditoría cultural. |
| Pirita | Encendido con fuente y preguntas abiertas sobre abastecimiento. La definición mineralógica añadida necesita referencia: P10. |
| Choza | Se identifican correctamente como hipótesis las razones posibles de la puerta hacia el mar. Mantener ese carácter y evitar presentarlas después como explicación cultural confirmada. |
| Corteza | Se conserva primavera y savia según Cooper, p. 88. La tabla astronómica se distingue expresamente de un calendario cultural. No debe convertirse el número de horas de luz en prueba de cuánto remaba una familia. |
| Ballena | Las propuestas sobre reparto se presentan como ejercicio; falta introducir «según la fuente» y mantenerlas como hipótesis, no como reglas comunitarias confirmadas. La carta actual también cita el episodio de Vargas Filgueira, pp. 16–17 del visor. |

## PDF y otros archivos exportados

Se extrajo texto de los PDF con `pdftotext` y se comparó con las fuentes HTML y los datos actuales. El PDF del pitch está compuesto por imágenes y no devolvió texto; se revisó visualmente su página 4, además de la diapositiva JPG correspondiente.

| Archivo | Páginas | Resultado |
|---|---|---|
| `mesa/tablero-A3.pdf` | 1 | Conserva la llegada a la ballena; es la regla del prototipo de mesa, no una descripción completa del nomadismo. |
| `mesa/fichas-A4.pdf` | 2 | Etiquetas de recursos; no se identificaron nombres de personas ni contenido ceremonial en sus textos. |
| `mesa/reglas-A4.pdf` | 2 | Reproduce los puntos P01, P02, P07 y P22 de sus fuentes HTML. |
| `escuelas/guia-docente-A4.pdf` | 8 | Las cartas toman los textos actuales, pero sus partes estáticas y actividades conservan P06–P15, P22 y P23. Corregir primero las fuentes y luego exportar. |
| `presentacion/pitch.pdf` | 9 | La página 4 conserva el texto antiguo de amarre y omite la referencia agregada de Vargas Filgueira: P21. |
| `stand/cartel-A3.pdf` | 1 | Conserva P01, P13, P16 y P17 del cartel. |
| `arte/cartas/cartas-para-imprimir.pdf` | 6 | La corrección de corteza y las referencias actuales aparecen en el texto extraído. Las fuentes y estados conservan los límites del paso 3. |

Las referencias de los PDF a una fuente no convierten las pautas de aula o las hipótesis en datos culturales. Los archivos siguen siendo borradores donde corresponda.

## Comprobaciones sin observación nueva

- En las cartas se mantiene la atribución a las fuentes y la distinción entre dato y juego. No se encontraron nombres de personajes en lengua yagán ni seres ceremoniales añadidos al catálogo.
- Los eventos de `sonido/juego.js` describen acciones del juego y fenómenos del entorno. No se encontraron cantos, relatos ceremoniales ni voces presentadas como grabaciones de una comunidad. Sus efectos no se toman como reconstrucciones históricas.
- Los peligros representados son los del entorno. El arpón visible aparece en reposo; no se identificó una escena de violencia entre personas o pueblos en las piezas y recursos examinados.
- Las piezas usan dibujos, mapas y códigos QR del proyecto. No se identificaron fotos históricas o escaneos de libros como arte del juego en los recursos referenciados revisados. Esto no reemplaza la revisión de derechos de imágenes que alguien pudiera agregar después.
- No se identificaron teléfonos, correos o datos de contacto personales en los archivos del alcance. El nombre del referente se usa con el permiso registrado; los lugares públicos no se presentan como datos de contacto.

## Próximas acciones

1. Resolver P01 con la respuesta a la consulta de tono. Mantener abiertas las respuestas de representación y el cierre «Hoy» sin inventarlas.
2. C prepara los textos definitivos de actividades y fuentes pendientes; D coordina los cambios del pitch, guía, mesa y stand. B mantiene los textos de interfaz y narrador.
3. Después de aplicar cambios en cada pieza, regenerar sus PDF e imágenes y volver a comprobar fuentes, legibilidad y paridad con el HTML.
4. La auditoría del paso 5 queda hecha. Corregir cada observación y redactar el cierre del paso 6 son tareas separadas; no se marcan como resueltas por completar esta lista.
