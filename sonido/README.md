# Sonido · Tierra de los Humos

El sonido se **genera con código** en el navegador (Web Audio). No hay archivos de audio: pesa unos 18 KB, anda sin internet y no hay licencias de terceros.

- [`ambiente.js`](ambiente.js): el módulo. Sin dependencias.
- [`demo.html`](demo.html): para escucharlo y probarlo. Doble clic y "Encender el sonido".

## Uso en el juego

```html
<script src="sonido/ambiente.js"></script>
<script>
  const sonido = TDH_SONIDO.crear();

  // 1. El navegador solo deja sonar después de un toque o clic:
  botonJugar.addEventListener('click', () => sonido.iniciar());

  // 2. En cada turno, pasarle el estado (cambia suave, sin cortes):
  sonido.ambiente({ viento: 0.4, mar: 0.6, lluvia: 0, fuego: 3 }); // 0 a 1; fuego de 0 a 4

  // 2b. El lugar: bosque, playa y mar según lo que rodea a la canoa
  const lugar = TDH_SONIDO.lugarDe(mapa, canoa.x, canoa.y);       // { bosque, playa, mar }, de 0 a 1
  sonido.ambiente(Object.assign({ viento: 0.4, lluvia: 0, fuego: 3 }, lugar));

  // 3. Efectos puntuales:
  sonido.efecto('remo');       // también: ola, lena, comida, saber, apagado, generacion

  // 4. Subtítulos de sonido (accesibilidad): mostrar el texto en pantalla
  sonido.alSonar((texto) => mostrarSubtitulo(texto));  // "[Aprendiste un saber]"

  // 5. Opciones
  sonido.volumen(0.8);
  sonido.silenciar(true);
</script>
```

Sugerencia de cuándo usar cada efecto:

| Efecto | Cuándo |
|---|---|
| `remo` | Cada movimiento de la canoa |
| `ola` | Al cruzar mar hondo con viento |
| `lena` | Al sumar leña al fuego |
| `comida` | Al juntar mariscos |
| `saber` | Al aparecer una carta de saber |
| `apagado` | Cuando el fuego se apaga (fin del viaje) |
| `generacion` | Al empezar el viaje de la siguiente generación |

## Sonido según el lugar

El mismo viento no suena igual en el canal abierto que pegado a la costa. `TDH_SONIDO.lugarDe(mapa, x, y)` mira las casillas que rodean a la canoa (a dos casillas, con más peso las más cercanas) en un mapa del motor Corteza y devuelve tres valores de 0 a 1:

| Valor | Sale de | Cómo suena |
|---|---|---|
| `bosque` | Casillas de lenga (`L`) o guindo (`G`) | Las hojas suenan con cada ráfaga. Con viento fuerte, cruje alguna rama. |
| `playa` | Casillas de playa (`.`) | Después de cada ola, la resaca arrastra piedritas y valvas: golpecitos que se van espaciando. |
| `mar` | Agua alrededor; la honda (`~`) pesa más | El rumor del mar y las olas, más fuerte en el canal abierto. |

En la maqueta y en la vitrina, el ambiente se actualiza cada vez que la canoa se mueve. En [`demo.html`](demo.html) hay botones para escuchar cada lugar: *Orilla del bosque*, *Playa de piedras* y *Canal abierto*.

Medido en el navegador con el mismo viento, el bosque suma unos 6 dB de agudos (2 a 7 kHz) y el canal abierto unos 8 dB de graves (menos de 500 Hz). La diferencia se nota con los parlantes de un celular.

Es diseño de sonido, no un dato: no imitamos aves ni animales, para no inventar qué especie se oye en cada lugar.

## Lectura en voz alta de las cartas

[`voz.js`](voz.js) lee las cartas de saber con la voz que ya trae el sistema (Web Speech API), en castellano y de preferencia rioplatense. No usa archivos ni hace falta internet en la mayoría de los equipos. Sirve a quien lee con dificultad, a quien ve poco y a los chicos más chicos.

```js
if (TDH_VOZ.disponible()) botonEscuchar.hidden = false;
TDH_VOZ.leerCarta({ tipo, titulo, dato, juego, fuente });
TDH_VOZ.detener();
```

La voz del sistema no sabe pronunciar palabras en lengua yagán: si alguna carta las incluye, tiene que ir con una grabación hecha junto con la comunidad. En la maqueta, cada carta tiene el botón «Escuchar la carta».

## Decisiones

- **Sin música ni cantos inventados.** Los cantos yaganes son patrimonio de la comunidad. Solo suena el territorio y el fuego. Si la comunidad comparte y autoriza algo, se suma con su crédito.
- **El lugar suena distinto** (bosque, playa, canal), para que se pueda «leer» el mapa con el oído.
- **Todo efecto tiene subtítulo**, para quien juega sin sonido o no oye.
- **Volumen moderado y compresor**: nunca satura, aunque suenen muchas cosas juntas.

Licencia: código MIT; los sonidos que produce, CC BY-SA 4.0.
