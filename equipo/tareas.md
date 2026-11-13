# Reparto de tareas · Tierra de los Humos

> Equipo de 4 personas. Fechas clave: **14/11** primer avance documentado · **17/11, 20:00** entrega final (meta interna: terminar el 16) · **19/11** demo en Fábrica de Talento (al menos 2 integrantes).
> Reemplazá cada letra por el nombre de la persona. Una persona puede cubrir dos roles si hace falta.

## Resumen

| Persona | Rol | Foco |
|---|---|---|
| **A: ______** | Programación núcleo | Motor, mapa, fuego, ciclo de partida |
| **B: ______** | Programación de interfaz, contenido y deploy | Cartas, códice, accesibilidad, GitHub Pages |
| **C: ______** | Investigación cultural y consulta | Fuentes, comunidad, textos de las cartas |
| **D: ______** | Arte, sonido y comunicación | Estilo visual, sonido, README, video y pitch |

El 40 % del puntaje (pertinencia + rigor) depende del trabajo de la Persona C. No es relleno.

---

## Persona A: Programación núcleo

- [ ] Decidir y armar el stack hoy (propuesta: HTML + JS con Canvas, con Vite o sin build).
- [ ] Motor por turnos con grilla.
- [ ] Mapa de agua e islas generado al azar, que se revela a medida que se avanza.
- [ ] Sistema del fuego: se gasta con frío, viento y lluvia.
- [ ] Recursos (leña, comida, refugio) y clima.
- [ ] Condición de victoria (llegar al destino con el fuego encendido) y de derrota (se apaga).
- [ ] Ciclo completo de una partida: explorar, encontrar, volver.
- [ ] **Meta 14/11:** una partida jugable de punta a punta con una carta de saber al final.

## Persona B: Programación de interfaz, contenido y deploy

- [ ] Definir la estructura de datos de cartas de saber y especies, para que la Persona C solo cargue contenido (JSON o Markdown).
- [ ] Pantalla de carta de saber, con la fuente citada visible.
- [ ] Herencia entre partidas (localStorage): los saberes pasan a la siguiente generación del mismo pueblo.
- [ ] Códice (modo museo) separado por pueblo.
- [ ] Controles táctiles y de teclado.
- [ ] Accesibilidad: contraste, textos alternativos, tipografía legible, funciona en celular y con conexión lenta.
- [ ] Deploy en GitHub Pages desde el día 1.
- [ ] Versión que funcione sin internet para la demo del 19/11.
- [ ] Sección **Tecnologías** del README.

## Persona C: Investigación cultural y consulta

- [ ] **Hoy:** mandar el mensaje de presentación a la comunidad Yagán Paiakoala y a Mónica Alvarado, sin esperar a que responda una para escribirle a la otra. Usar las 7 preguntas de `equipo/comunicaciones.md`.
- [ ] Registrar cada contacto el mismo día en `equipo/comunicaciones.md` (sin teléfonos, mails ni datos personales; es un repo público).
- [ ] Escribir `docs/03-contenido-cultural.md` con las fuentes verificadas (Gusinde, Chapman, Calderón y Zárraga, museos, CADIC).
- [ ] Resolver los puntos marcados con 🔍, en especial el **destino del viaje**.
- [ ] Redactar las cartas de saber: texto breve, aclaración de qué es dato y qué es recurso de juego, y fuente citada.
- [ ] Redactar el cierre del códice, en presente, mencionando las comunidades vivas.
- [ ] Armar la sección **Fuentes** del README.
- [ ] Revisar todo el contenido contra las líneas rojas de `docs/00-guia-hackathon.md`.

## Persona D: Arte, sonido y comunicación

- [ ] Preparar 2 o 3 propuestas de estilo visual (pixel art y otras) y elegir una con el equipo.
- [ ] Paleta del paisaje de los canales: mar gris, bosque de lenga, piedra, humo.
- [ ] Sprites, tiles e íconos propios. Nada de fotos históricas de Gusinde.
- [ ] Sonido ambiente.
- [ ] Registrar todas las licencias de recursos de terceros para el README.
- [ ] Desde el 15/11: README completo (problema, eje, solución, cómo jugar, integrantes, uso de IA).
- [ ] Video de hasta 3 minutos mostrando el juego.
- [ ] Presentación del pitch de hasta 5 minutos y ensayo.
- [ ] La persona referente (+18) coordina con la organización, sea cual sea su rol.

---

## Cronograma

| Cuándo | A | B | C | D |
|---|---|---|---|---|
| **12/11 (hoy)** | Cerrar stack y armar el esqueleto | Cerrar stack, estructura de datos, deploy | Mensajes a la comunidad y a Mónica Alvarado | Propuestas de estilo |
| **13/11** | Mapa, fuego y turnos | Pantalla de carta y herencia | Primeras 5 a 8 cartas verificadas | Paleta y primeros sprites |
| **14/11** | Integrar y probar la partida | Integrar y probar | Documentar la consulta | Escribir el avance documentado |
| **15/11** | Pulido y balance | Códice y accesibilidad | Cartas restantes y fuentes | Arte, sonido, README |
| **16/11** | Corrección de errores | Versión offline | Revisión cultural final | Video y pitch |
| **17/11** | Margen. **Entrega antes de las 20:00** | Margen | Margen | Margen |
| **19/11** | Demo (al menos 2 integrantes presentes) | | | |

**Obligatorios de la hackatón:** al menos 1 integrante en el taller del eje y al menos 2 encuentros con la mentoría durante la semana.

## Pendientes del repo

- [ ] Escribir `docs/02-alcance-mvp.md` (cuántas etapas, cuántos peligros). Sin eso, A y B no tienen contra qué medir.
- [ ] Escribir `docs/03-contenido-cultural.md` (Persona C).
- [ ] Decidir el stack (Persona A y B, hoy).
- [ ] Decidir el estilo visual (Persona D, con el equipo).
- [ ] Completar nombres y roles en la sección **Integrantes** del README.
- [ ] Declarar en el README cualquier aporte nuevo de IA (cláusula 7.4).
- [ ] Anotar cada decisión nueva en `equipo/memory.md`, con fecha.
