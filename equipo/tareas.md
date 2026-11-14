# Reparto de tareas · Tierra de los Humos

> Equipo de 4 personas. Fechas clave: **13/11, 11:00** entrevista realizada con el referente de la comunidad yagán (fecha confirmada por Dani; antes estaba prevista para el 14/11) · **16/11, hasta las 23:00** primer avance documentado · **18/11, hasta las 21:00** entrega final y ensayo (meta interna: terminar el 17) · **19/11** evaluación del jurado · **viernes 20/11, 15:00 a 19:00** demo y premiación en Fábrica de Talento (al menos 2 integrantes). Fechas del cronograma definitivo de la organización (mails del 9/11).
> Los documentos nombran a cada integrante por su letra. Una persona puede cubrir dos roles si hace falta.
> **Última actualización:** 13/11/2026.

## Resumen

| Persona | Rol | Foco |
|---|---|---|
| **A: Mati** | Programación núcleo | Motor, mapa, fuego, ciclo de partida |
| **B: Facu** | Programación de interfaz, contenido y deploy | Cartas, códice, accesibilidad, GitHub Pages |
| **C: Dani** | Investigación cultural y consulta | Fuentes, comunidad, textos de las cartas |
| **D: Nacho** | Arte, sonido y comunicación | Estilo visual, sonido, README, video y pitch |

El 40 % del puntaje (pertinencia + rigor) depende del trabajo de la Persona C. No es relleno.

## Estado al 13/11

- **Hecho por D (PR 2):** estilo Corteza con su motor de dibujo, paleta, sprites, sonido, maqueta navegable de todas las pantallas (`arte/pantallas/`), 9 borradores de cartas, pitch, stand, versión de mesa y guía para docentes.
- **Todavía no hay código del juego.** A y B arrancan ahora, sobre los módulos que ya dejó D. La tabla de módulos y cómo se usan está en [`memory.md`](memory.md#estado-actual).
- **Stack decidido (13/11):** JavaScript sin build, con `<script>` clásicos, en GitHub Pages (ver [`memory.md`](memory.md#decisiones)).
- **Enfoque del viaje decidido por C:** nomadismo, con motivos que combinan clima, comida y ambiente. Falta acordar con A y B los objetivos, el cierre y el alcance del MVP (`docs/02-alcance-mvp.md`).

---

## Persona A: Programación núcleo (Mati)

- [x] Decidir el stack con B: JavaScript sin build (13/11).
- [x] Acordar con B la estructura de carpetas del juego, para no pisarse (13/11, al mergear el PR 10: ver `memory.md`, *Decisiones*). El contrato es el de la partida falsa, ampliado sin romperlo ([`juego/nucleo/README.md`](../juego/nucleo/README.md)).
- [x] Motor por turnos con grilla (13/11, `juego/nucleo/partida.js`). Dibujar con el motor Corteza (`TDH_CORTEZA.crear(canvas).escena({...})`), no desde cero. Ver `docs/04-direccion-de-arte.md`, sección 6.
- [x] Mapa de agua e islas generado al azar (13/11, `juego/nucleo/mapa.js`), que se revela a medida que se avanza (el humo del motor tapa lo no explorado).
- [x] Sistema del fuego: se gasta con frío (de noche), viento y lluvia (13/11).
- [x] Recursos (leña, comida, pirita; el refugio es amarrar y acampar, y la choza) y clima (13/11).
- [x] Condición de victoria (llegar al destino con el fuego encendido) y de derrota (se apaga).
- [ ] Ciclo completo de una partida: explorar, encontrar, volver.
- [x] **Meta 14/11:** una partida jugable de punta a punta con una carta de saber al final. Se prueba en `pruebas/nucleo.html` (13/11). Falta que B lo conecte en la interfaz del juego.
- [ ] Pulido y balance jugando con personas (los bots de `pruebas/bots.cjs` ya miden que se pueda ganar).
- [x] Datos del territorio aparte del código (13/11, `juego/nucleo/territorio/`): qué hay en el mapa, dónde va, qué hace, de qué fuente sale y el destino. Se cambian sin programar.

## Persona B: Programación de interfaz, contenido y deploy (Facu)

- [x] **13/11, 11:00:** entrevista con el referente de la comunidad yagán (Facu fue con Dani). Dani la registró en `equipo/comunicaciones.md`.
- [x] Decidir el stack: JavaScript sin build (13/11).
- [x] Acordar con A la estructura de carpetas y el contrato entre núcleo e interfaz (13/11, al mergear el PR 10: ver `memory.md`, *Decisiones*).
- [x] Definir la estructura de datos de cartas de saber y especies, para que la Persona C solo cargue contenido. **Cartas:** en `datos/saberes.js` (suma `id`, `pueblo`, `alt` y `estado`, con plantilla para cargar sin programar). **Especies:** las armó A en `juego/nucleo/territorio/elementos.js`, también con plantilla (13/11).
- [x] Pantalla de carta de saber, con la fuente citada visible (`juego/interfaz/carta.js`), conectada al núcleo en el juego (13/11).
- [x] **Conectar el núcleo al juego real** (13/11): `index.html` es el juego, con la lógica en `juego/interfaz/juego.js` y los estilos en `pantallas.css`. Título, pueblo, viaje, fin o llegada, postal, códice, «Hoy» y cómo se juega.
- [x] Herencia entre partidas (13/11, `juego/interfaz/herencia.js`): se guarda en `localStorage` por pueblo, solo los `id`, con versión. Si no hay almacenamiento, anda mientras la página está abierta.
- [x] Códice (modo museo) separado por pueblo, que se puede recorrer sin jugar, con «Empezar de cero» (13/11).
- [x] Controles táctiles y de teclado (13/11): tocar el agua rema hasta ahí (y se frena si el fuego queda en 1 o cae la noche), tocar una pegatina va y la junta, flechas en pantalla, teclas del README.
- [x] Accesibilidad (13/11): alto contraste, texto alternativo en cartas, códice y postal, el mapa contado en palabras para lector de pantalla, voz para las cartas, narrador, subtítulos del sonido y botones de 44 px. Probado a 375 px, en celular acostado y en la compu. Pesa unos 420 KB sin comprimir.
- [x] Deploy en GitHub Pages: publicado desde `main`, carpeta raíz.
- [ ] Versión que funcione sin internet para la demo del 20/11. Ya abre con doble clic; falta el service worker para Pages (decidido para el 16/11).
- [x] Sección **Tecnologías** del README (13/11).
- [ ] Correr `node pruebas/de-punta-a-punta.cjs` con el juego (necesita `npm i -D playwright`; se probó a mano en el navegador).
- [ ] Completar la parte de programación del avance (`equipo/avance-14-11.md`), con A, antes del 16/11 a las 23:00.

## Persona C: Investigación cultural y consulta (Dani)

- [x] Encontrar a quién consultar: Víctor Vargas Filgueira, referente de la comunidad yagán.
- [x] Realizar la entrevista: 13/11/2026, 11:00, Museo del Fin del Mundo, Ushuaia. 🔍 Quedan pendientes el cotejo con la grabación y las respuestas a las preguntas abiertas de `equipo/comunicaciones.md`.
- [ ] Escribirle a Mónica Alvarado, si se la puede contactar.
- [x] Registrar la primera entrevista en `equipo/comunicaciones.md`, con fecha, síntesis, permisos y pendientes (13/11). Registrar los contactos siguientes sigue siendo una tarea continua.
- [ ] Escribir `docs/03-contenido-cultural.md` con las fuentes verificadas (Gusinde, Chapman, Calderón y Zárraga, Cooper, museos, CADIC).
- [x] Definir el enfoque del viaje (13/11): **nomadismo**, con motivos combinados según clima, comida y ambiente; la ballena varada es uno de ellos. Decisión de Dani registrada en `memory.md` y `docs/01-concepto.md`.
- [ ] Resolver los puntos marcados con 🔍 y revisar con A y B la traducción del nomadismo a objetivos y cierre de partida. Verificar por separado la fuente de cada motivo; las notas de Vargas Filgueira (2019) y las referencias de Cooper (1946) están registradas en `comunicaciones.md` y `docs/05-rigor-historico.md`.
- [x] Cotejar documentalmente las 9 cartas de `datos/saberes.js`, su texto de juego, fuente y alt (13/11). Borradores corregidos y propuesta de carta de reservas en `equipo/revision-cultural-paso-3.md`.
- [ ] Aprobar con Dani cada carta antes de pasarla a `revisado` y decidir la incorporación de cartas nuevas. Las nueve siguen en `borrador`.
- [x] Trasladar las referencias de Bird (1946) a los datos del territorio: conchales (pp. 20–21) y leña Kawésqar (p. 70), sin atribuir esta última como práctica yagán.
- [ ] Completar las fuentes pendientes de leña yagán, especies, botánica y topónimos; la tonina sigue sin identificación documentada.
- [x] Registrar los nombres de lugares aportados de Vargas Filgueira (2019), con notas y páginas: `docs/06-toponimia.md` (14/11). Se distinguen correspondencias, descripciones y nombres sin equivalencia explícita.
- [x] Definir la presentación de los topónimos (14/11): **Onashaga — Canal Beagle**, con el nombre utilizado por Víctor primero y su correspondencia después.
- [ ] Completar la fuente cartográfica y el permiso de uso en el juego; coordinar con D la implementación de los rótulos indicados en `docs/06-toponimia.md`.
- [ ] Revisar las actividades de la guía para docentes (`escuelas/actividades.js`).
- [ ] Redactar el cierre del códice, en presente, mencionando las comunidades vivas.
- [ ] Armar la sección **Fuentes** del README (D dejó las que usó el arte).
- [ ] Revisar todo el contenido contra las líneas rojas de `docs/00-guia-hackathon.md`.
- [x] Completar la parte de consulta del avance del 14/11 (`equipo/avance-14-11.md`): entrevista y cotejo documental aportado, sin dar las cartas ni el juego por validados.

## Persona D: Arte, sonido y comunicación (Nacho)

- [x] Preparar 3 propuestas de estilo visual y elegir una con el equipo: **Corteza**.
- [x] Paleta del paisaje de los canales (42 colores).
- [x] Sprites, tiles e íconos propios, y el motor de dibujo Corteza. Nada de fotos históricas de Gusinde.
- [x] Sonido ambiente, que cambia según el lugar.
- [x] Registrar las licencias de recursos de terceros en el README.
- [x] Presentación del pitch (`presentacion/`) y storyboard del video (`equipo/video/`).
- [ ] Ayudar a A y B a integrar el motor, el sonido y los demás módulos.
- [ ] Desde el 15/11: README completo (quedan los huecos ✏️: enlaces, integrantes, números del juego).
- [ ] Video de hasta 3 minutos con capturas del juego real (el 17/11).
- [ ] Ensayar el pitch de hasta 5 minutos.
- [x] La persona referente (+18) coordina con la organización: es **Facu** (B), según la plataforma de la hackatón.
- [ ] **16/11, antes de las 23:00 (Facu):** cargar en la plataforma (*Mi equipo*) el link del repositorio y el del documento del avance (`equipo/avance-14-11.md` en GitHub, ya mergeado en `main`).
- [ ] **18/11, antes de las 21:00 (Facu):** cargar los cinco links de la entrega final: prototipo (GitHub Pages), repositorio, README, video y presentación. Todos públicos.

---

## Cronograma

| Cuándo | A (Mati) | B (Facu) | C (Dani) | D (Nacho) |
|---|---|---|---|---|
| **12/11** | Cerrar stack y armar el esqueleto | Cerrar stack, estructura de datos, deploy | Conseguir el contacto con la comunidad ✅ | Propuestas de estilo ✅ |
| **13/11** | Stack, esqueleto, mapa, fuego y turnos | Stack, estructura de datos, deploy, pantalla de carta | Revisar los borradores de cartas | Arte, sonido y módulos ✅ |
| **14/11** | Integrar y probar la partida | Integrar y probar | Documentar la consulta (entrevista del 13/11) | Avance documentado (borrador) |
| **15/11** | Pulido y balance | Herencia, códice y accesibilidad | Cartas restantes y fuentes | Integración, README |
| **16/11** | Corrección de errores. **Avance antes de las 23:00** (cada uno completa su parte) | Versión offline | Revisión de cartas con la consulta | Entregar el avance |
| **17/11** | Corrección de errores | Pruebas en celulares | Revisión cultural final | Video y pitch |
| **18/11** | Margen. **Entrega antes de las 21:00** y ensayo | Margen | Margen | Margen |
| **19/11** | Evalúa el jurado (repos cerrados) | | | |
| **20/11, 15:00 a 19:00** | Demo y premiación (al menos 2 integrantes presentes) | | | |

✏️ Las filas del 14 al 18/11 se corrieron por el cambio de fechas (14/11). Cada persona revisa la suya.

**Obligatorios de la hackatón:** al menos 1 integrante en el taller del eje y al menos 2 encuentros con la mentoría durante la semana.

## Pendientes del repo

- [ ] Escribir `docs/02-alcance-mvp.md` (cuántas etapas, cuántos peligros). Sin eso, A y B no tienen contra qué medir.
- [ ] Escribir `docs/03-contenido-cultural.md` (Persona C).
- [x] Decidir el stack: JavaScript sin build (13/11).
- [x] Decidir el estilo visual: Corteza (12/11).
- [x] Asignar las letras a cada integrante (ver la tabla de arriba).
- [ ] Completar la sección **Integrantes** del README con los nombres que el equipo quiera publicar. La persona referente es Facu.
- [ ] Completar el avance documentado (`equipo/avance-14-11.md`) antes del 16/11 a las 23:00.
- [ ] Declarar en el README cualquier aporte nuevo de IA (cláusula 7.4).
- [ ] Anotar cada decisión nueva en `equipo/memory.md`, con fecha.
