# Núcleo del juego

Es la parte que hace funcionar el viaje: el mapa, el fuego, lo que se junta, el clima y cómo termina. No dibuja pantallas ni guarda nada en el navegador: eso es de la interfaz. La interfaz le pregunta al núcleo qué pasó y lo muestra.

**Última actualización:** 13/11/2026.

---

## Estado actual

### Qué se puede jugar hoy

- **Un viaje completo**, de la salida al destino, en un canal que va de oeste a este, como el Beagle.
- **El mapa cambia en cada partida**, con costas, islas, playas, bosque, cachiyuyo y rocas. Lo que no se exploró queda tapado por el humo y se descubre al remar.
- **El fuego es la vida.** Se gasta al remar, y más con viento en el canal hondo, con lluvia y de noche. Cerca de una choza se gasta menos. Si llega a cero, el viaje termina.
- **Se junta** leña, comida (mejillones, pescado y hongos), pirita, el saber de la choza y la corteza del guindo grande.
- **La leña aviva el fuego**, y la pirita lo vuelve a prender una vez cuando se apaga.
- **Amarrar y acampar** en el cachiyuyo, al lado de una playa: pasan la noche, vuelve la calma y comen lo que juntaron.
- **El día pasa:** día, tarde y noche. En invierno los días son más cortos.
- **El clima cambia solo:** calma, viento y lluvia.
- **Las cartas de saber** salen la primera vez que se junta cada cosa, la primera vez que se acampa y al llegar al destino.
- **Ganar** es llegar al destino con el fuego encendido. **Perder** es que se apague. En los dos casos se sabe por qué terminó y qué se aprendió.
- **La herencia:** lo aprendido pasa a la generación siguiente. Esas cartas no vuelven a salir, y cada saber heredado suma un poco de fuego al arrancar, como en la versión de mesa.

### Cómo probarlo

Abrir [`pruebas/nucleo.html`](../../pruebas/nucleo.html) en el navegador, con doble clic alcanza. Se rema con las flechas, con los botones o tocando el agua. Agregando cosas al final de la dirección:

| Agregado | Qué hace |
|---|---|
| `?semilla=5` | Repite siempre el mismo mapa (sirve para mostrar o para reportar un error) |
| `?destino=corteza` | Juega con otro destino (`ballena`, `corteza` o `pirita`) |
| `?revision=1` | Muestra el mapa entero, sin humo, y al costado cada cosa del territorio con su dato, su fuente, su estado y cuántas hay en el mapa |
| `?mapa=fijo` | Usa el mapa de la maqueta de pantallas, que no cambia |

Se pueden combinar: `?semilla=5&revision=1`.

### Los datos del territorio

Todo lo que puede cambiar con la investigación está **aparte del código**, en [`territorio/`](territorio/), y se cambia sin programar. Cada archivo tiene arriba una explicación y una plantilla.

| Archivo | Qué tiene |
|---|---|
| [`elementos.js`](territorio/elementos.js) | Cada cosa que aparece en el mapa: qué es, dónde va (playa, agua baja, orilla del bosque…), en qué parte del viaje, cuántas hay, qué hace en el juego, qué carta da, el dato, la fuente y si ya se revisó |
| [`destinos.js`](territorio/destinos.js) | Los destinos posibles, cada uno con su fuente. **El destino se cambia en una sola línea** (`ACTIVO`) |
| [`pueblos.js`](territorio/pueblos.js) | Qué elementos y destinos tiene cada pueblo. Hoy solo el yagán |

Cada entrada separa el **dato** (lo que dice la fuente) del **juego** (dónde va, cuántas hay y qué hace, que son recursos de juego). Lo que todavía no tiene fuente está marcado con 🔍.

**Destino actual:** la ballena varada (Cooper, 1946, p. 84, 94-95 y 99). Quedan cargados como propuesta, también de Cooper (p. 94-95), la corteza buena para canoas y las piedras de fuego. El juego funciona con los tres.

### Los números

Están todos en [`reglas.js`](reglas.js). Son recursos de juego y se ajustan jugando.

| Qué | Cuánto |
|---|---|
| Fuego al empezar | 12 de 16 (se ve como «Fuego 3 de 4»), más 1 por cada saber heredado, hasta 16 |
| Remar una casilla | Gasta 1 |
| Viento en el canal hondo, lluvia, noche | Cada uno gasta 1 más |
| Cerca de una choza | Gasta 1 menos |
| Leña | Cada atado da 2; avivar el fuego con una suma 6. Se lleva hasta 5 |
| Comida | Se lleva hasta 5. Al acampar se come 1 y suma 3 de fuego |
| Pirita | Se lleva 1. Si el fuego se apaga, vuelve a 4 |
| El día | Cae la tarde a las 12 casillas y la noche a las 18. En invierno, a las 8 y a las 12 |

Son los mismos números de la versión de mesa, salvo la leña: el mapa es el doble de ancho que el tablero.

### Qué se revisa solo

Al correr `node --test` en la raíz del repo se revisa:

- **Que el juego se pueda ganar.** Un jugador automático que junta y acampa llega el 84 % de las veces, y uno que va derecho sin juntar nada no llega nunca. Esto se mide con cada destino.
- **Que cada mapa sea jugable.** Se prueban 500 mapas: todos tienen camino por agua hasta el destino, todo lo que se junta queda al alcance de la canoa y hay lugares para amarrar. Salen 500 mapas distintos.
- **Que los datos del territorio sean consistentes:**
  - cada cosa tiene fuente (o 🔍), dibujo en el estilo Corteza y un lugar válido;
  - cada carta que nombra existe;
  - nada dice «extinguido» ni «desaparecido».
- **Que un cambio en los datos no mueva el resto.** Sacar un elemento no cambia las costas ni dónde está la leña.
- **Que la misma semilla dé siempre el mismo mapa.** Si un cambio en el código los altera, la prueba avisa.
- **Que el contrato con la interfaz se cumpla:** las mismas pruebas de la partida falsa, corridas contra el núcleo.

### Lo que todavía no está

- **No está conectado al juego real.** Se juega en la página de prueba; falta conectarlo a la interfaz, en lugar de la partida falsa.
- **La herencia no se guarda** al cerrar el navegador: eso es de la interfaz. La página de prueba la recuerda solo mientras está abierta.
- **La corteza no tiene efecto en el juego:** su carta dice que permite arreglar la canoa, pero la canoa no se daña.
- **El viaje es un solo tramo**, no tiene etapas.

### Para quien programa

| Archivo | Qué hace |
|---|---|
| [`partida.js`](partida.js) | El viaje. **El contrato con la interfaz está escrito al principio del archivo:** qué se le pasa, qué acciones acepta y qué eventos devuelve |
| [`mapa.js`](mapa.js) | Genera y valida el mapa a partir de los datos del territorio |
| [`reglas.js`](reglas.js) | Los números |
| [`azar.js`](azar.js) | Azar con semilla, con una semilla propia por sistema (terreno, destino, cada elemento, clima) |
| [`territorio/`](territorio/) | Los datos del territorio |

Se cargan con `<script>` clásicos, en este orden: `azar.js`, `reglas.js`, `territorio/elementos.js`, `territorio/destinos.js`, `territorio/pueblos.js`, `mapa.js` y `partida.js`. Ver [`pruebas/nucleo.html`](../../pruebas/nucleo.html).

---

## Propuestas de mejora

Nada de esto está hecho. Son ideas para charlar en el grupo.

- **El viaje dividido en 3 partes.** Hoy el viaje es un solo canal largo, de la salida al destino. La propuesta es partirlo en 3 tramos con un campamento entre uno y otro. Así se nota más el ciclo de *explorar, encontrar y volver* que pide el concepto, y cada partida tiene momentos de respiro.

- **Qué deja cada saber heredado.** Hoy, cuando una generación termina, cada saber que aprendió le da a la siguiente un poco más de fuego al arrancar. La propuesta es que cada saber deje un conocimiento concreto. Por ejemplo, quien heredó el de los mejillones ve dónde hay comida aunque esté tapada por el humo, y quien heredó el del amarre ve dónde se puede acampar. Va más con la idea de que lo que pasa de generación en generación es la memoria. Si se aprueba, hay que ajustar el texto «En el juego» de algunas cartas.

- **Las brasas.** Hoy, cuando el fuego llega a cero, el viaje termina de golpe. La propuesta es que quede unos pasos en brasas y que, si se aviva a tiempo con leña, vuelva. Es menos frustrante y ya existe el dibujo de las brasas.

- **El aviso antes de que cambie el clima.** Hoy el viento y la lluvia aparecen sin aviso y gastan más fuego. La propuesta es avisar un paso antes («se ven nubes», «se levanta el viento»), para que quien juega pueda decidir si acampa o sigue. Así perder se siente justo y no de mala suerte.

- **El destino del viaje.** Hoy la familia viaja hacia una ballena varada. Hay otras dos opciones documentadas en Cooper (1946, p. 94-95): buscar corteza buena para canoas o buscar piedras de fuego (pirita), que solo se encontraban en algunos lugares. El juego ya está preparado para cambiar de destino sin reprogramar nada. Falta elegir cuál, idealmente con lo que diga la comunidad.

- **La carta de la corteza.** La carta dice que encontrar un guindo grande «permite arreglar la canoa», pero en el juego la canoa nunca se rompe. Así la carta promete algo que no pasa. Hay dos caminos: cambiar el texto de la carta o agregar que la canoa se pueda dañar, por ejemplo al chocar con rocas.

- **Las fuentes que faltan.** Cada cosa que aparece en el mapa tiene su fuente con página, salvo tres: la leña (no hay una cita propia), los conchales (falta la cita exacta) y la tonina (falta confirmar qué especie vive en el Beagle). Están marcadas como pendientes.

- **El juego de mesa.** Es la versión en papel que ya está en el repo, con tablero, fichas, dado y reglas, pensada para escuelas sin computadoras y para el stand. Hoy tiene las mismas reglas que el juego de la compu. Si se aprueban los cambios de arriba, las dos versiones dejan de coincidir: hay que decidir si se actualiza la de papel o si se presenta como una versión más simple.

- **Cómo se conecta el juego con las pantallas.** La parte que hace funcionar el viaje ya está armada para encajar con la pantalla de cartas que existe. Falta revisar juntos que le sirva a quien hace las pantallas y conectarla al juego real, en lugar de la versión de prueba.

- **Dónde se guardan los datos del territorio.** Todo lo que puede cambiar con la investigación (qué hay en el mapa, dónde aparece, qué hace, de qué fuente sale y el destino) quedó en unos archivos aparte, que se pueden editar sin programar. Hoy están en la carpeta del motor del juego. Se puede dejar así o pasarlos a la carpeta de datos, junto con las cartas.

- **El alcance del juego.** Falta escribir en un documento qué entra sí o sí para el 17/11 y qué se deja afuera si no llega el tiempo: cuántas partes tiene el viaje, qué peligros hay y qué se recorta primero. Las tareas del equipo ya lo marcan como pendiente, porque sin eso no hay contra qué medir si el juego está terminado.
