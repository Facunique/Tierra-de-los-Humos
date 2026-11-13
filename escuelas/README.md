# Escuelas · Tierra de los Humos en el aula

Una guía para docentes que quieran usar el juego en clase. Está pensada para secundaria (ciclo básico) y se adapta a primaria alta.

- [`guia-docente-A4.pdf`](guia-docente-A4.pdf): la guía lista para imprimir (8 hojas A4).
- [`guia.html`](guia.html): la misma guía, para ver en pantalla. Se arma sola con los textos de las cartas.
- [`actividades.js`](actividades.js): una actividad por carta de saber. Es el archivo que se corrige.
- [`exportar.cjs`](exportar.cjs): vuelve a generar el PDF.

## Qué tiene la guía

| Hoja | Contenido |
|---|---|
| 1 | Qué es el juego, tres formas de jugar en clase (con pantallas, con proyector, sin pantallas) y una clase posible de 80 minutos. |
| 2 | Cuidados para el aula (en presente, dato y juego separados, la fuente mira desde afuera, sin disfraces ni ceremonias, fotos con contexto, sin palabras inventadas, sin violencia), cómo leer una carta, cómo leer una fuente y el mapa de territorios. |
| 3 a 5 | Una actividad por carta: el dato con su fuente, una pregunta, tres pasos, el tiempo, las áreas y un cuidado o una idea para pensar. |
| 6 | *El año en los canales*: salida y puesta del sol en Ushuaia el día 21 de cada mes, calculadas con la luz real del juego, con preguntas de Matemática y Geografía. |
| 7 | Hoja para fotocopiar: *Un saber que quiero heredar*, una carta en blanco para un saber de la familia o del barrio. |
| 8 | Fuentes, materiales del juego, accesibilidad, el QR para jugar y la luz de hoy en Ushuaia. |

## Cómo se escribieron las actividades

- **Cada actividad parte solo del dato de su carta**, que cita a Cooper (1946) con página. Lo que la fuente no dice va como pregunta abierta o como «para pensar», nunca como dato. Por ejemplo, la carta de la choza no explica por qué la puerta miraba al mar: la actividad pide hipótesis y que se marquen como hipótesis.
- **Las reglas del juego valen en el aula.** Los cuidados de la hoja 2 son las líneas rojas de [`docs/00-guia-hackathon.md`](../docs/00-guia-hackathon.md#líneas-rojas-cuidado-cultural), dichas para docentes.
- **La hoja para fotocopiar no pide saberes yaganes**: pide un saber de la propia familia. Así se trabaja la idea central del juego (lo que se hereda) sin que nadie invente datos de otro pueblo. También pide no poner nombres completos ni datos de contacto.
- **Seguridad:** las actividades avisan no comer hongos silvestres, no hacer chispas con pirita en el aula, no sacar corteza de árboles vivos y no tocar los conchales (patrimonio arqueológico protegido por la Ley 25.743).
- **Las áreas son orientativas** (Ciencias Sociales, Ciencias Naturales, Educación Tecnológica, Matemática, Geografía, Formación Ética y Ciudadana, ESI). No se citan núcleos de aprendizaje puntuales: eso conviene revisarlo con docentes.

## Cómo actualizarla

1. Si cambia el texto de una carta, se corrige en [`datos/saberes.js`](../datos/saberes.js) y la guía lo toma sola.
2. Si se suma una carta, hay que agregar su actividad en `actividades.js` con la misma clave. Si falta, la guía la muestra como «Actividad pendiente».
3. Para regenerar el PDF, desde la raíz del repositorio:

```bash
node escuelas/exportar.cjs
```

El script avisa si alguna hoja se pasa de largo.

## Pendiente

- Revisar las actividades con la Persona C y, si se puede, con una o dos personas docentes.
- Consultar con la comunidad yagán si está de acuerdo con el enfoque, en especial con la hoja 2.

Licencia: textos CC BY-SA 4.0, código MIT.
