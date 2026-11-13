# Reparto de tareas · Tierra de los Humos

> Equipo de 4 personas. Fechas clave: **14/11, 11:00** reunión con el referente de la comunidad yagán · **14/11** primer avance documentado · **17/11, 20:00** entrega final (meta interna: terminar el 16) · **19/11** demo en Fábrica de Talento (al menos 2 integrantes).
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
- **Sin decidir:** el destino del viaje y el alcance del MVP (`docs/02-alcance-mvp.md`).

---

## Persona A: Programación núcleo (Mati)

- [x] Decidir el stack con B: JavaScript sin build (13/11).
- [ ] Acordar con B la estructura de carpetas del juego, para no pisarse.
- [ ] Motor por turnos con grilla. Dibujar con el motor Corteza (`TDH_CORTEZA.crear(canvas).escena({...})`), no desde cero. Ver `docs/04-direccion-de-arte.md`, sección 6.
- [ ] Mapa de agua e islas generado al azar, que se revela a medida que se avanza (el humo del motor tapa lo no explorado).
- [ ] Sistema del fuego: se gasta con frío, viento y lluvia.
- [ ] Recursos (leña, comida, refugio) y clima.
- [ ] Condición de victoria (llegar al destino con el fuego encendido) y de derrota (se apaga).
- [ ] Ciclo completo de una partida: explorar, encontrar, volver.
- [ ] **Meta 14/11:** una partida jugable de punta a punta con una carta de saber al final.

## Persona B: Programación de interfaz, contenido y deploy (Facu)

- [ ] **14/11, 11:00:** reunión con el referente de la comunidad yagán. Registrarla el mismo día en `equipo/comunicaciones.md` (la entrada ya está armada, con huecos ✏️).
- [x] Decidir el stack: JavaScript sin build (13/11).
- [ ] Acordar con A la estructura de carpetas y el contrato entre núcleo e interfaz (propuesta en `memory.md`, *Por decidir*).
- [ ] Definir la estructura de datos de cartas de saber y especies, para que la Persona C solo cargue contenido. **Cartas:** hecho en `datos/saberes.js` (suma `id`, `pueblo`, `alt` y `estado`, con plantilla para cargar sin programar). Faltan las especies.
- [ ] Pantalla de carta de saber, con la fuente citada visible. La maqueta (`arte/pantallas/`) y `arte/corteza/carta.css` ya tienen el diseño.
- [ ] Herencia entre partidas (localStorage): los saberes pasan a la siguiente generación del mismo pueblo.
- [ ] Códice (modo museo) separado por pueblo, que se pueda recorrer sin jugar.
- [ ] Controles táctiles y de teclado (los de la sección *Cómo jugar* del README).
- [ ] Accesibilidad: contraste, textos alternativos, tipografía legible, funciona en celular y con conexión lenta. Sumar los módulos de D que ya están: modo alto contraste, voz para leer las cartas (`sonido/voz.js`) y subtítulos del sonido.
- [ ] Deploy en GitHub Pages lo antes posible, aunque sea con una pantalla.
- [ ] Versión que funcione sin internet para la demo del 19/11.
- [ ] Sección **Tecnologías** del README (D dejó un borrador; falta el stack final y el enlace de GitHub Pages).
- [ ] Completar la parte de programación del avance del 14/11 (`equipo/avance-14-11.md`), con A.

## Persona C: Investigación cultural y consulta (Dani)

- [x] Encontrar a quién consultar: hay reunión acordada con el referente de la comunidad yagán (14/11, 11:00).
- [ ] Ir a la reunión del 14/11 (conviene que esté C) y llevar las 7 preguntas de `equipo/comunicaciones.md`.
- [ ] Escribirle a Mónica Alvarado, si se la puede contactar.
- [ ] Registrar cada contacto el mismo día en `equipo/comunicaciones.md` (sin teléfonos, mails ni datos personales; es un repo público).
- [ ] Escribir `docs/03-contenido-cultural.md` con las fuentes verificadas (Gusinde, Chapman, Calderón y Zárraga, Cooper, museos, CADIC).
- [ ] Resolver los puntos marcados con 🔍, en especial el **destino del viaje**. Ya hay base documental: la ballena varada, la pirita o la corteza para canoas (Cooper 1946, p. 94-99; ver `memory.md`).
- [ ] Revisar los 9 borradores de cartas que dejó D (ahora en `datos/saberes.js`, con plantilla arriba para cargar cartas nuevas; `node --test` revisa que no falte nada) y sumar las que falten: texto breve, qué es dato y qué es recurso de juego, y fuente citada.
- [ ] Revisar las actividades de la guía para docentes (`escuelas/actividades.js`).
- [ ] Redactar el cierre del códice, en presente, mencionando las comunidades vivas.
- [ ] Armar la sección **Fuentes** del README (D dejó las que usó el arte).
- [ ] Revisar todo el contenido contra las líneas rojas de `docs/00-guia-hackathon.md`.
- [ ] Completar la parte de consulta del avance del 14/11 (`equipo/avance-14-11.md`).

## Persona D: Arte, sonido y comunicación (Nacho)

- [x] Preparar 3 propuestas de estilo visual y elegir una con el equipo: **Corteza**.
- [x] Paleta del paisaje de los canales (42 colores).
- [x] Sprites, tiles e íconos propios, y el motor de dibujo Corteza. Nada de fotos históricas de Gusinde.
- [x] Sonido ambiente, que cambia según el lugar.
- [x] Registrar las licencias de recursos de terceros en el README.
- [x] Presentación del pitch (`presentacion/`) y storyboard del video (`equipo/video/`).
- [ ] Ayudar a A y B a integrar el motor, el sonido y los demás módulos.
- [ ] Desde el 15/11: README completo (quedan los huecos ✏️: enlaces, integrantes, números del juego).
- [ ] Video de hasta 3 minutos con capturas del juego real (el 16/11).
- [ ] Ensayar el pitch de hasta 5 minutos.
- [ ] La persona referente (+18) coordina con la organización, sea cual sea su rol. ✏️ Falta decir quién es.

---

## Cronograma

| Cuándo | A (Mati) | B (Facu) | C (Dani) | D (Nacho) |
|---|---|---|---|---|
| **12/11** | Cerrar stack y armar el esqueleto | Cerrar stack, estructura de datos, deploy | Conseguir el contacto con la comunidad ✅ | Propuestas de estilo ✅ |
| **13/11** | Stack, esqueleto, mapa, fuego y turnos | Stack, estructura de datos, deploy, pantalla de carta | Revisar los borradores de cartas | Arte, sonido y módulos ✅ |
| **14/11** | Integrar y probar la partida | 11:00 reunión. Integrar y probar | 11:00 reunión. Documentar la consulta | Escribir el avance documentado |
| **15/11** | Pulido y balance | Herencia, códice y accesibilidad | Cartas restantes y fuentes | Integración, README |
| **16/11** | Corrección de errores | Versión offline | Revisión cultural final | Video y pitch |
| **17/11** | Margen. **Entrega antes de las 20:00** | Margen | Margen | Margen |
| **19/11** | Demo (al menos 2 integrantes presentes) | | | |

**Obligatorios de la hackatón:** al menos 1 integrante en el taller del eje y al menos 2 encuentros con la mentoría durante la semana.

## Pendientes del repo

- [ ] Escribir `docs/02-alcance-mvp.md` (cuántas etapas, cuántos peligros). Sin eso, A y B no tienen contra qué medir.
- [ ] Escribir `docs/03-contenido-cultural.md` (Persona C).
- [x] Decidir el stack: JavaScript sin build (13/11).
- [x] Decidir el estilo visual: Corteza (12/11).
- [x] Asignar las letras a cada integrante (ver la tabla de arriba).
- [ ] Completar la sección **Integrantes** del README con los nombres que el equipo quiera publicar, y decir quién es la persona referente.
- [ ] Completar el avance del 14/11 (`equipo/avance-14-11.md`).
- [ ] Declarar en el README cualquier aporte nuevo de IA (cláusula 7.4).
- [ ] Anotar cada decisión nueva en `equipo/memory.md`, con fecha.
