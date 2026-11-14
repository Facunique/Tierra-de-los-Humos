# Auditoría cultural · Paso 5

Fecha: 14/11/2026. Responsable: Persona C.

**Resultado de la primera pasada:** 23 observaciones y cuatro ajustes menores del README. **Actualización posterior, también del 14/11:** con la aprobación de C del lema «Lo aprendido se transmite» y su pedido de actualizar la guía, se aplican las correcciones indicadas abajo. No se modifican lógica, reglas, números ni ilustraciones. Se mantienen las consultas y permisos abiertos; una corrección editorial no equivale a validación comunitaria.

## Estado después de las correcciones aprobadas

| Estado | Observaciones | Qué cambió o qué falta |
|---|---|---|
| Aplicadas | P01, P04, P05, P06, P08, P09, P10, P11, P12, P14, P15, P21 y P23 | Lema y fin del viaje; apertura y consulta del pitch; bibliografía, contexto y pautas de la guía; ejercicios con fuentes e hipótesis separadas; regeneración de las piezas afectadas. Se retiró la afirmación jurídica sin referencia, sin proponer una interpretación nueva. |
| Parciales | P07 y P22 | Se actualizan la guía y el pitch; quedan las formulaciones de tareas y consulta en `mesa/reglas.html`. |
| Pendientes | P02, P03, P13, P16, P17, P18, P19 y P20 | Representación de la familia, cierre «Hoy», cartografía, fuente y ficción del stand, alcance de voz colectiva, fauna y pronunciación. |

**Fuentes ya localizadas para P03:** Vargas Filgueira (2019), *Mi sangre yagán*, agradecimientos p. 4 y epílogo pp. 85–86 del visor de 90 páginas. El cierre aún no se cambió: esos pasajes no verifican por sí solos cestería, situación lingüística, un cargo actual ni permiso de representación. Las pp. 8–9 identifican protagonistas del relato, no roles genéricos para nombrar a la familia ficticia.

**Autorización:** C aprobó el lema y pidió actualizar la guía docente. Se mantienen las preguntas de `equipo/comunicaciones.md`. No se publica el PDF del libro ni se incorporan respuestas de entrevista a partir de su lectura.

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

## Hallazgos de la primera pasada, por archivo y línea

Los enlaces de esta sección apuntan a la versión auditada de la primera pasada (commit `204d1a1`), para conservar las líneas originales aunque el texto se haya corregido después. La tabla de estado anterior indica qué sigue abierto. En R01–R04 se muestra el texto corregido durante esa primera pasada. **Alta** indica una decisión o revisión necesaria antes de presentar esa pieza; **Media**, una referencia o precisión a resolver. Una observación de tono no se presenta como prueba de una violación de las bases.

### P01 · Aplicada · Alta · Decisión de tono pendiente

- **Archivo y línea:** [README.md:28](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/README.md#L28)<br>[mesa/README.md:19](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/mesa/README.md#L19)<br>[mesa/reglas.html:90](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/mesa/reglas.html#L90)<br>[presentacion/index.html:148](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L148)<br>[stand/cartel.html:58](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/stand/cartel.html#L58)
- **Observación inicial:** Se asocia el apagado del fuego y el cambio de generación con morir. El núcleo informa el fin del viaje, sin describir una muerte. Es una cuestión importante de tono; no se clasifica por sí sola como una escena de violencia.
- **Propuesta o ajuste inicial:** Propuesta consultada: «Lo aprendido se transmite» y «Al terminar un viaje, lo aprendido pasa a la generación siguiente». Mantener la mecánica actual. Esperar la respuesta a la consulta antes de sustituir esta formulación en piezas del equipo.
- **Responsable y fuente:** C decide el tono; D y B aplican en sus piezas. Fuentes de contexto: docs/01, contrato de fin de partida y consulta abierta.

### P02 · Pendiente · Alta · Permiso pendiente

- **Archivo y línea:** [mesa/reglas.html:43](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/mesa/reglas.html#L43)<br>[index.html:52](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/index.html#L52)
- **Observación inicial:** La versión de mesa dice que quienes juegan son la familia; el concepto usa acompañar. La entrevista registrada todavía no responde el alcance de la representación.
- **Propuesta o ajuste inicial:** Unificar el texto propuesto como «Juegan en cooperación y acompañan a una familia ficticia». Mantener abierta la consulta sobre representación y no afirmar que ya fue autorizada.
- **Responsable y fuente:** C con la consulta; D y B en sus textos. Registro: equipo/comunicaciones.md, preguntas 1 y 2.

### P03 · Pendiente · Alta · Fuente y consulta pendientes

- **Archivo y línea:** [index.html:147](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/index.html#L147)<br>[arte/pantallas/index.html:222](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/arte/pantallas/index.html#L222)
- **Observación inicial:** El cierre «Hoy» atribuye prácticas actuales de lengua, memoria y oficios sin una fuente actual localizada. El aviso de texto provisorio no aporta la referencia.
- **Propuesta o ajuste inicial:** Resolver en el paso 6 con las páginas del epílogo y agradecimientos de Vargas Filgueira (2019) y con lo que la consulta autorice comunicar. Mientras tanto, proponer un texto general sobre continuidad sin atribuir prácticas concretas a toda la comunidad.
- **Responsable y fuente:** C redacta; B y D integran. No se modificó el cierre ni se inventaron páginas.

### P04 · Aplicada · Alta · Fuente pendiente

- **Archivo y línea:** [presentacion/index.html:79](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L79)<br>[presentacion/index.html:88](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L88)<br>[presentacion/index.html:89](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L89)
- **Observación inicial:** La nota del orador cuenta un episodio sobre navegantes, humo y el estrecho como hecho histórico. No hay una fuente completa para esa explicación del nombre en el material aportado. La diapositiva 2 agrega afirmaciones generales sobre cómo se cuenta a los pueblos y cuánto conocen jóvenes y escuelas, sin una investigación localizada.
- **Propuesta o ajuste inicial:** Propuesta de apertura del equipo: «Cada partida acompaña a una familia ficticia por los canales fueguinos. El fuego sostiene el viaje y las cartas guardan lo aprendido». Reservar la historia del nombre hasta tener autor, obra, año y página. Presentar el problema como el propósito de acercar fuentes a jóvenes y escuelas, siguiendo el ajuste R02 del README, sin dar por medida la situación.
- **Responsable y fuente:** D, con revisión de C. docs/01 mantiene el origen del nombre con 🔍.

### P05 · Aplicada · Alta · Datos de consulta sin completar

- **Archivo y línea:** [presentacion/index.html:103](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L103)<br>[presentacion/index.html:104](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L104)<br>[presentacion/index.html:110](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L110)
- **Observación inicial:** La diapositiva de consulta y su guía oral conservan huecos pese a que la entrevista ya se realizó. Tampoco separan los aportes de la entrevista, los del libro y las decisiones del equipo.
- **Propuesta o ajuste inicial:** Completar con la entrevista a Víctor Vargas Filgueira del 13/11, su permiso de atribución y la consulta abierta. Describir la corrección de corteza y el enfoque de nomadismo como trabajo y decisiones del equipo; no atribuirlos al entrevistado sin respuesta registrada.
- **Responsable y fuente:** D con C. Fuente: equipo/comunicaciones.md y docs/03. El permiso permite nombrar al referente; no equivale a validación comunitaria.

### P06 · Aplicada · Alta · Guía y bibliografía desactualizadas

- **Archivo y línea:** [escuelas/guia.html:135](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L135)<br>[escuelas/guia.html:253](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L253)<br>[escuelas/README.md:23](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/README.md#L23)
- **Observación inicial:** La guía presenta todas las cartas como una mirada externa de Cooper y su bibliografía estática solo enumera ese capítulo. Las cartas de amarre y ballena ya incluyen Vargas Filgueira (2019).
- **Propuesta o ajuste inicial:** Distinguir las fuentes históricas de la obra de Vargas Filgueira y de la entrevista; remitir al documento de fuentes completo. Propuesta de título: «Cada fuente tiene autor y contexto». Regenerar la guía después.
- **Responsable y fuente:** C propone los textos; D mantiene la guía. Fuentes: docs/03 y datos/saberes.js.

### P07 · Parcial · Media · Contexto de las tareas

- **Archivo y línea:** [escuelas/actividades.js:33](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/actividades.js#L33)<br>[mesa/reglas.html:78](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/mesa/reglas.html#L78)<br>[presentacion/index.html:129](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L129)
- **Observación inicial:** Se formula la distribución de tareas de manera general, aunque esté citada. La advertencia de la actividad de amarre habla de observadores externos sin distinguir las fuentes nuevas.
- **Propuesta o ajuste inicial:** Introducir «Cooper describe…» y comparar con Vargas Filgueira (2019), p. 33 del visor, para el remo, sin usarlo como prueba de todas las otras tareas. La observación de un dibujo no establece una regla de todas las familias actuales.
- **Responsable y fuente:** C con D. Cooper (1946), pp. 88 y 96; Vargas Filgueira (2019), p. 33 del visor.

### P08 · Aplicada · Media · Referencia arqueológica pendiente en la actividad

- **Archivo y línea:** [escuelas/actividades.js:44](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/actividades.js#L44)<br>[escuelas/actividades.js:45](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/actividades.js#L45)
- **Observación inicial:** La actividad agrega una explicación de formación y ubicación de conchales sin citar a Bird. La simulación con envoltorios necesita quedar distinguida del sitio arqueológico.
- **Propuesta o ajuste inicial:** Propuesta: «Comparen la carta con Bird (1946), “The Archeology of Patagonia”, pp. 20–21. ¿Qué preguntas podrían investigar sobre alimentación y ocupación?». Identificar el registro de meriendas como una simulación de aula, sin presentarlo como explicación completa de un conchal.
- **Responsable y fuente:** C, con D para el PDF. Bird documenta la presencia de conchales; no se le atribuye la disposición exacta de casas y valvas.

### P09 · Aplicada · Media · Generalización de un método

- **Archivo y línea:** [escuelas/actividades.js:60](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/actividades.js#L60)
- **Observación inicial:** El cuidado de la actividad puede leerse como una regla sobre toda la pesca, mientras la carta actual describe un método documentado.
- **Propuesta o ajuste inicial:** Propuesta: «Dibujen el método que describe esta carta: línea, lazo y mano. No agreguen herramientas que ese pasaje no menciona». Mantener pendientes las notas orales sobre otros métodos hasta revisar la grabación.
- **Responsable y fuente:** C. Cooper (1946), pp. 84 y 96; entrevista pendiente de revisión.

### P10 · Aplicada · Media · Explicaciones añadidas sin referencia

- **Archivo y línea:** [escuelas/actividades.js:27](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/actividades.js#L27)<br>[escuelas/actividades.js:77](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/actividades.js#L77)
- **Observación inicial:** La dificultad de volver a encender fuego se infiere sin una referencia localizada. La definición mineralógica se añade como dato sin fuente propia.
- **Propuesta o ajuste inicial:** Sustituir la primera por preguntas sobre los materiales que describen las fuentes y la segunda por una búsqueda documentada de geología. No usar la rareza o distribución de la pirita como prueba automática de dificultad.
- **Responsable y fuente:** C. Las cartas citan Cooper (1946), pp. 91 y 95; una explicación mineralógica necesita una referencia adicional.

### P11 · Aplicada · Media · Referencia normativa incompleta

- **Archivo y línea:** [escuelas/actividades.js:49](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/actividades.js#L49)<br>[escuelas/README.md:26](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/README.md#L26)
- **Observación inicial:** Se hace una afirmación jurídica sobre los conchales sin una referencia primaria enlazada ni localización del pasaje. Las fuentes culturales aportadas no verifican ese alcance legal.
- **Propuesta o ajuste inicial:** Completar la referencia primaria antes de mantener la afirmación jurídica, o conservar solo una pauta de actividad: «Trabajen con registros e imágenes y dejen los materiales de los sitios en su lugar». No se evaluó aquí la interpretación de la norma.
- **Responsable y fuente:** C con docentes. No se incorporan referencias legales de memoria.

### P12 · Aplicada · Media · Derechos de imágenes en la pauta docente

- **Archivo y línea:** [escuelas/guia.html:137](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L137)
- **Observación inicial:** La pauta pide autor, fecha y contexto para mostrar fotos históricas, pero no menciona revisar los derechos y las autorizaciones. No se detectaron fotos históricas usadas como arte del juego en las piezas examinadas.
- **Propuesta o ajuste inicial:** Agregar a la pauta la revisión de derechos y permisos antes de usar una imagen. Mantener el arte propio del juego y no proponer escaneos o fotografías del libro como recursos publicados.
- **Responsable y fuente:** C con D. Regla explícita de AGENTS.md y líneas rojas; no es una conclusión sobre la licencia de una foto concreta.

### P13 · Pendiente · Alta · Cartografía, rótulos e implementación pendientes

- **Archivo y línea:** [arte/mapa/mapa.js:42](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/arte/mapa/mapa.js#L42)<br>[escuelas/guia.html:172](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L172)<br>[stand/cartel.html:62](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/stand/cartel.html#L62)<br>[stand/vidriera.html:160](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/stand/vidriera.html#L160)
- **Observación inicial:** Las piezas comparten el mapa basado en Natural Earth. Sigue abierta la verificación con el IGN. El rótulo todavía no aplica el orden Onashaga — Canal Beagle confirmado por C.
- **Propuesta o ajuste inicial:** D debe implementar los rótulos documentados de docs/06, con sus verificaciones y permisos pendientes, y revisar la cartografía exigida por la guía. No renombrar lugares sin equivalencia ni mover coordenadas para hacerlos coincidir por intuición.
- **Responsable y fuente:** C aporta fuentes; D implementa. No se modificó código ni se declaró oficial un nombre del libro.

### P14 · Aplicada · Media · Territorio ancestral y presente

- **Archivo y línea:** [escuelas/guia.html:116](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L116)<br>[escuelas/guia.html:165](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L165)
- **Observación inicial:** La pregunta sobre dónde viven hoy se responde mostrando un mapa de territorios ancestrales. Las ciudades actuales dibujadas no verifican la distribución actual de las comunidades.
- **Propuesta o ajuste inicial:** Propuesta: «¿Qué territorios describen estas fuentes históricas? ¿Qué sabemos, con fuentes actuales, de las comunidades de hoy?». Conservar ambas preguntas separadas.
- **Responsable y fuente:** C con D. Cooper (1946) y Bird (1946) contextualizan el mapa; faltan referencias actuales localizadas para la segunda pregunta.

### P15 · Aplicada · Media · Alcance de la revisión exagerado

- **Archivo y línea:** [escuelas/guia.html:255](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L255)<br>[presentacion/index.html:123](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L123)
- **Observación inicial:** Se puede interpretar que todo el arte ya está verificado, aunque docs/05 conserva fuentes y especies pendientes.
- **Propuesta o ajuste inicial:** Propuesta: «El proyecto registra fuentes y pendientes para cada elemento del arte en docs/05». En el pitch, usar ejemplos concretos con referencia y mantener visibles las dudas que aún importan.
- **Responsable y fuente:** C con D. Registro de fuentes y pendientes en docs/05 y docs/03.

### P16 · Pendiente · Media · Fuente del dato en el cartel

- **Archivo y línea:** [stand/cartel.html:57](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/stand/cartel.html#L57)
- **Observación inicial:** El cartel presenta el dato del fuego en la canoa sin autor, obra ni página en ese bloque. La referencia al mapa del pie no documenta ese dato.
- **Propuesta o ajuste inicial:** Agregar una referencia breve a Cooper (1946), «The Yahgan», pp. 88 y 91, y el acceso a la bibliografía del proyecto. Conservar como recurso de juego la comparación entre fuego y barra de vida.
- **Responsable y fuente:** D, con C. No se atribuye al referente una afirmación que solo se tomó del capítulo escrito.

### P17 · Pendiente · Media · Ficción insuficientemente señalada en piezas autónomas

- **Archivo y línea:** [stand/cartel.html:54](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/stand/cartel.html#L54)<br>[stand/vidriera.html:136](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/stand/vidriera.html#L136)<br>[presentacion/index.html:75](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L75)
- **Observación inicial:** El juego principal y las reglas de mesa explican la ficción. El cartel, la vidriera y el pitch pueden circular de forma independiente sin ese aviso explícito.
- **Propuesta o ajuste inicial:** Propuesta breve para cada pieza: «La familia, el mapa y los eventos son ficción. Cada dato cultural conserva su fuente». Mantener el aviso legible también al imprimir o reproducir en bucle.
- **Responsable y fuente:** D con C. Criterio de dato y recurso de juego de AGENTS.md.

### P18 · Pendiente · Media · Voz colectiva sugerida sin alcance de consulta

- **Archivo y línea:** [stand/vidriera.html:180](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/stand/vidriera.html#L180)
- **Observación inicial:** El cierre puede presentar el juego como voz de los pueblos en conjunto, sin explicar que la consulta registrada corresponde a un referente y continúa abierta.
- **Propuesta o ajuste inicial:** Propuesta: «Conocé las fuentes y la consulta que acompañan este proyecto», enlazada al registro público. No presentar una voz colectiva o validación que no está registrada.
- **Responsable y fuente:** D con C. Fuente oral y alcance de permisos en equipo/comunicaciones.md.

### P19 · Pendiente · Media · Identificación de fauna en el texto audible

- **Archivo y línea:** [sonido/narrador.js:37](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/sonido/narrador.js#L37)<br>[sonido/narrador.js:38](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/sonido/narrador.js#L38)<br>[juego/nucleo/territorio/elementos.js:134](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/juego/nucleo/territorio/elementos.js#L134)
- **Observación inicial:** El narrador usa nombres de fauna cuyos datos del territorio todavía tienen identificación o distribución pendiente. Los registros de alimento de Cooper no verifican por sí solos cada dibujo o especie local.
- **Propuesta o ajuste inicial:** B y D deben acordar con C los nombres provisionales y la identificación de los dibujos. No asignar un nombre científico o una especie del Beagle sin la fuente correspondiente.
- **Responsable y fuente:** C aporta la fuente; B mantiene el narrador; D verifica el arte. Permanecen los 🔍 de tonina, pato vapor y cormorán.

### P20 · Pendiente · Media · Pronunciación no revisada

- **Archivo y línea:** [sonido/voz.js:27](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/sonido/voz.js#L27)<br>[sonido/voz.js:70](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/sonido/voz.js#L70)
- **Observación inicial:** La lectura automática en castellano también lee el título de la obra con palabras en lengua yagán. La elección de voz no verifica pronunciación ni aporta una grabación de la comunidad.
- **Propuesta o ajuste inicial:** Antes de sumar topónimos a la lectura, revisar con la consulta el modo de pronunciarlos y cómo identificar la lectura automática. No presentar la síntesis del sistema como una voz o pronunciación validada por la comunidad.
- **Responsable y fuente:** B con C; cualquier grabación exige su permiso y atribución. No se modificó la lógica de voz.

### P21 · Aplicada · Alta · Material exportado desactualizado

- **Archivo y línea:** [presentacion/index.html:268](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/presentacion/index.html#L268)<br>[datos/saberes.js:61](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/datos/saberes.js#L61)
- **Observación inicial:** La diapositiva 4 exportada y la página 4 del PDF conservan el dato antiguo «La mujer manejaba la canoa…» y solo Cooper. El HTML toma la carta actual, que atribuye la descripción y agrega Vargas Filgueira (2019), p. 33 del visor.
- **Propuesta o ajuste inicial:** Después de los cambios acordados del pitch, D debe regenerar las nueve diapositivas y pitch.pdf y comprobar la fuente y la legibilidad de la carta. No basta con corregir solo el HTML.
- **Responsable y fuente:** D. Confirmado visualmente en presentacion/diapositivas/04.jpg y presentacion/pitch.pdf, página 4.

### P22 · Parcial · Media · Consulta futura frente al registro actual

- **Archivo y línea:** [escuelas/guia.html:290](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L290)<br>[mesa/reglas.html:104](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/mesa/reglas.html#L104)
- **Observación inicial:** Las formulaciones no distinguen la entrevista ya realizada de la validación y las respuestas que siguen abiertas.
- **Propuesta o ajuste inicial:** Indicar «La consulta comenzó con una entrevista a un referente y sigue abierta», con acceso al registro. No afirmar que ya se revisó la guía o el juego entero con la comunidad.
- **Responsable y fuente:** C con D. Fecha y alcance de la entrevista en docs/03.

### P23 · Aplicada · Media · Alcance de «todo es libre»

- **Archivo y línea:** [escuelas/guia.html:249](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/escuelas/guia.html#L249)
- **Observación inicial:** El texto puede confundirse con una autorización para copiar las obras citadas, especialmente al agregar la publicación de 2019 a las fuentes.
- **Propuesta o ajuste inicial:** Precisar que la licencia abierta corresponde a los materiales propios del proyecto. Conservar las condiciones de las obras citadas y no publicar el PDF ni escaneos del libro.
- **Responsable y fuente:** C con D. Licencias del proyecto en README y regla de privacidad; no se atribuye una licencia nueva al libro.

### R01 · Menor · Corregido en esta revisión

- **Archivo y línea:** [README.md:3](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/README.md#L3)
- **Observación inicial:** El alt anterior asignaba hombre y mujer a figuras sin rasgos.
- **Propuesta o ajuste inicial:** Se describe lo visible: dos figuras, remo y arpón en reposo. No se modificó la imagen.
- **Responsable y fuente:** Ajuste editorial autorizado. Inspección de arte/logo/compartir.png.

### R02 · Menor · Corregido en esta revisión

- **Archivo y línea:** [README.md:17](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/README.md#L17)
- **Observación inicial:** El problema se formulaba como una afirmación general sobre cuánto conocen los jóvenes y cómo se cuenta a los pueblos, sin una referencia o investigación localizada.
- **Propuesta o ajuste inicial:** Se presenta el desafío y propósito del proyecto, sin dar por medida esa situación en todas las escuelas.
- **Responsable y fuente:** Ajuste editorial autorizado; no se agregó una afirmación cultural nueva.

### R03 · Menor · Corregido en esta revisión

- **Archivo y línea:** [README.md:23](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/README.md#L23)
- **Observación inicial:** La presentación inicial no reunía en un aviso explícito qué componentes son ficción.
- **Propuesta o ajuste inicial:** Se agregó el aviso y se conservó la fuente de cada dato y el marcador de pendientes.
- **Responsable y fuente:** Ajuste editorial autorizado. Criterio de AGENTS.md y docs/01.

### R04 · Menor · Corregido en esta revisión

- **Archivo y línea:** [README.md:29](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/README.md#L29)<br>[README.md:52](https://github.com/Facunique/Tierra-de-los-Humos/blob/204d1a14434c5b5a2dbc614e0c9887229e63b927/README.md#L52)
- **Observación inicial:** La frase «Todo se cuenta en presente, con consulta a la comunidad» no precisaba el alcance de esa consulta. El índice tampoco incluía los documentos nuevos de fuentes y lugares.
- **Propuesta o ajuste inicial:** Se enlazó el alcance de la consulta y se agregaron los documentos 03 y 06 al índice.
- **Responsable y fuente:** Ajuste editorial autorizado. El permiso del referente no se amplió.

## Actividades docentes, una por una: textos actuales

| Carta | Actualización |
|---|---|
| Fuego | Se compara la carta con Vargas Filgueira (2019), p. 66; se retira la dificultad de reencendido como inferencia. El gasto numérico sigue identificado como ficción. |
| Amarre | Se comparan Cooper, pp. 88 y 96, y Vargas Filgueira, p. 33. Se distingue remo de amarre y se evita extender el pasaje a todas las familias actuales. |
| Mejillones | Se incorpora Bird, «The Archeology of Patagonia», pp. 20–21. El registro de meriendas es un ejercicio, no un conchal. Se retira la afirmación jurídica sin referencia. |
| Pescado | El dibujo se limita al método descrito. La tabla de materiales pide fuente y página; no se inventan especies ni recorridos. |
| Hongos | Se conserva la distinción entre conservación documentada y experimento de aula. El ejercicio y sus pautas siguen pendientes de revisión docente. |
| Pirita | La explicación mineralógica se transforma en investigación con fuente; el recorrido propuesto se identifica como ficticio. |
| Choza | Se conservan explícitamente como hipótesis las razones posibles de la orientación de la puerta. |
| Corteza | Se comparan extracción estacional y recuperación de material conservado, con Vargas Filgueira, pp. 23 y 31–32. La tabla astronómica no es un calendario cultural. |
| Ballena | Se comparan Cooper, p. 99, y Vargas Filgueira, pp. 16–17. Los acuerdos de reparto son propuestas de clase; las reservas de pp. 53–54 aportan otro motivo de viaje. |

Los tiempos, áreas y claves de las actividades no cambian. Las publicaciones y la entrevista se presentan por separado.

## PDF y otros archivos exportados

Se extrajo texto de los PDF con `pdftotext` y se comparó con las fuentes HTML y los datos actuales. El PDF del pitch está compuesto por imágenes y no devolvió texto; se revisó visualmente su página 4, además de la diapositiva JPG correspondiente.

| Archivo | Páginas | Resultado |
|---|---|---|
| `mesa/tablero-A3.pdf` | 1 | Conserva la llegada a la ballena; es la regla del prototipo de mesa, no una descripción completa del nomadismo. |
| `mesa/fichas-A4.pdf` | 2 | Etiquetas de recursos; no se identificaron nombres de personas ni contenido ceremonial en sus textos. |
| `mesa/reglas-A4.pdf` | 2 | Regenerado con «Lo aprendido se transmite». Permanecen P02, P07 y P22; no se cambiaron reglas ni cantidades. |
| `escuelas/guia-docente-A4.pdf` | 8 | Regenerada con actividades, fuentes y consulta actualizadas. Sigue marcada la cartografía pendiente de P13; la revisión docente y comunitaria continúan abiertas. |
| `presentacion/pitch.pdf` | 9 | Regenerado junto con las nueve diapositivas JPG: carta de amarre actual con Vargas Filgueira, diapositiva de consulta completa y nuevo lema. P21 aplicada. |
| `stand/cartel-A3.pdf` | 1 | Regenerado con el nuevo lema. Permanecen P13, P16 y P17. |
| `arte/cartas/cartas-para-imprimir.pdf` | 6 | La corrección de corteza y las referencias actuales aparecen en el texto extraído. Las fuentes y estados conservan los límites del paso 3. |

Las referencias de los PDF a una fuente no convierten las pautas de aula o las hipótesis en datos culturales. Los archivos siguen siendo borradores donde corresponda.

## Comprobaciones sin observación nueva

- En las cartas se mantiene la atribución a las fuentes y la distinción entre dato y juego. No se encontraron nombres de personajes en lengua yagán ni seres ceremoniales añadidos al catálogo.
- Los eventos de `sonido/juego.js` describen acciones del juego y fenómenos del entorno. No se encontraron cantos, relatos ceremoniales ni voces presentadas como grabaciones de una comunidad. Sus efectos no se toman como reconstrucciones históricas.
- Los peligros representados son los del entorno. El arpón visible aparece en reposo; no se identificó una escena de violencia entre personas o pueblos en las piezas y recursos examinados.
- Las piezas usan dibujos, mapas y códigos QR del proyecto. No se identificaron fotos históricas o escaneos de libros como arte del juego en los recursos referenciados revisados. Esto no reemplaza la revisión de derechos de imágenes que alguien pudiera agregar después.
- No se identificaron teléfonos, correos o datos de contacto personales en los archivos del alcance. El nombre del referente se usa con el permiso registrado; los lugares públicos no se presentan como datos de contacto.

## Próximas acciones

1. Resolver el alcance de representación y preparar el cierre del paso 6 con las páginas ya localizadas, sin atribuir prácticas actuales específicas sin respaldo.
2. Coordinar con B y D los ocho puntos pendientes y las dos correcciones parciales: mapa, stand, mesa, fauna y pronunciación.
3. Mantener revisión docente y consulta comunitaria abiertas. La lectura del libro y la aprobación editorial de C no incorporan permisos nuevos.
4. Después de cada cambio posterior, regenerar las piezas que dependan de él y verificar fuentes y legibilidad.
