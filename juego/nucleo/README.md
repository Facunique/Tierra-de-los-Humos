# Núcleo del juego

Es la parte que hace funcionar el viaje: el mapa, el fuego, lo que se junta, el clima y cómo termina. No dibuja pantallas ni guarda nada en el navegador: eso es de la interfaz. La interfaz le pregunta al núcleo qué pasó y lo muestra.

**Última actualización:** 18/11/2026.

---

## Estado actual

### Qué se puede jugar hoy

- **Un viaje completo**, de la salida al destino, en un canal que va de oeste a este, como el Beagle.
- **El mapa cambia en cada partida**, con costas, islas, playas, bosque, cachiyuyo y rocas. Lo que no se exploró queda tapado por el humo y se descubre al remar.
- **El fuego es la vida.** Se gasta al remar, y más con viento en el canal hondo, con lluvia y de noche. Cerca de una choza se gasta menos. Si llega a cero, el viaje termina.
- **Se junta** leña, comida (mejillones, pescado y hongos), pirita, el saber de la choza y la corteza del guindo grande.
- **La leña aviva el fuego**, y la pirita lo vuelve a prender una vez cuando se apaga.
- **Amarrar y acampar** en el cachiyuyo, al lado de una playa: pasan la noche, vuelve la calma y comen lo que juntaron. **Acampar no es gratis:** cuidar el fuego toda la noche gasta, así que sin comida cada noche lo baja y una partida no puede durar para siempre.
- **El día pasa:** día, tarde y noche. En invierno los días son más cortos y las noches, más largas. La noche termina al acampar o, si no se acampa, sola, unos pasos después.
- **Fallar un minijuego cuesta un turno** (acción `demora`): el fuego gasta como al remar y pasa el tiempo, pero la canoa no se mueve. Los minijuegos son de la Persona D (`minijuegos/`); el núcleo solo pone el costo.
- **El clima cambia solo:** calma, viento y lluvia. **Cada cambio se avisa un paso antes** («se ven nubes»), para decidir si acampar o seguir.
- **Las cartas de saber** salen la primera vez que se junta cada cosa, la primera vez que se acampa y al llegar al destino.
- **El motivo del viaje** sale de la semilla y de la estación, entre los destinos documentados que no están en «propuesta» (ver *Los datos del territorio*). Pueden salir la ballena varada o las piedras de fuego (pirita). Dani habilitó este último motivo el 18/11. La corteza sigue como propuesta.
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

**Destinos:** cada viaje elige su motivo entre los destinos del pueblo que **no** están en `'propuesta'` y que son de la estación del viaje (campo `estaciones`, opcional y solo con fuente). Entran la ballena varada (Cooper, 1946, p. 84, 94-95 y 99) y las piedras de fuego (Cooper, 1946, p. 94-95), habilitadas por Dani el 18/11 a pedido de Mati en el PR 39. La corteza buena para canoas sigue como propuesta (Cooper, p. 94-95; solo en primavera, p. 88). Para sumarla, la Persona C la pasa a `'borrador'`: no hay que programar nada. El juego funciona con los tres.

### Los números

Están todos en [`reglas.js`](reglas.js). Son recursos de juego y se ajustan jugando.

| Qué | Cuánto |
|---|---|
| Fuego al empezar | 18 de 24 (se ve como «Fuego 3 de 4»). Con el saber del fuego heredado, 21 (fuego 4) |
| Al salir se lleva | 2 atados de leña (y 1 de comida si se heredó el saber de los hongos) |
| Remar una casilla | Gasta 1 |
| Fallar un minijuego | Gasta como remar una casilla, sin moverse |
| Viento en el canal hondo, lluvia, noche | Cada uno gasta 1 más, pero una remada nunca gasta más de 2 |
| Cerca de una choza | Gasta 1 menos (2 si se heredó el saber de la choza) |
| Leña | Cada atado da 2; avivar el fuego con una suma 9 (unas 9 remadas de día). Se lleva hasta 5 |
| Comida | Se lleva hasta 5. Al acampar se come 1 y suma 4 de fuego |
| Acampar | Cuidar el fuego toda la noche gasta 3 (con comida, queda en +1) |
| Brasas | Con el fuego en 0 y sin pirita, quedan brasas por 3 remadas: avivar (o acampar con comida) lo vuelve a prender |
| Pirita | Se lleva 1. Si el fuego se apaga, vuelve a 6 (fuego 1); con el saber de la pirita heredado, a 12 |
| Minijuego perfecto | Sin errar y rápido: juntar da 1 más, avivar suma 3 más y acampar gasta 2 menos |
| El día | Cae la tarde a las 12 casillas, la noche a las 18 y amanece a las 22. En invierno, a las 8, a las 12 y a las 18. Acampar hace amanecer enseguida |
| El clima | Dura al menos 4 pasos; después cambia con 12 % de chance por paso, y se avisa 1 paso antes |
| Las tres marcas | Llegar · llegar con 3 de comida · llegar a tiempo (1,6 veces el camino más corto) |

**Lo que deja cada saber heredado (19/11).** Antes, cada saber heredado sumaba 1 de fuego, todos igual. Ahora cada uno deja algo propio, y lo dice su carta en «En el juego»:

| Saber | Le deja a la generación siguiente |
|---|---|
| El fuego viaja en la canoa | Sale con 3 más de fuego |
| Amarrar en el cachiyuyo | Los amarres se ven a través del humo |
| Recolectar en la costa | Los mejillones se ven a través del humo |
| Pescar para el campamento | El pescado se ve a través del humo |
| Hongos de los árboles | Sale con 1 de comida |
| Piedras de fuego | La pirita reenciende más alto |
| Preparar el campamento | Cerca de la choza casi no se gasta |
| Una canoa de corteza | El viento del canal hondo no gasta de más |
| La ballena varada | El destino se ve desde el principio |

**Fuego más largo (19/11).** Todo el fuego se multiplicó por 1,5 (energía, leña, comida, acampar y pirita) y una remada gasta 2 como mucho. Había que avivarlo cada pocas remadas y cansaba. Remar sigue gastando 1, así que cada leña rinde unas 9 remadas de día y 4 o 5 de noche (antes, 6 y 2 o 3).

El fuego inicial, las 2 leñas y el amanecer sin acampar son del 18/11 (los ajustó la Persona B a pedido del equipo, para que el viaje no termine a las pocas remadas). La versión de mesa sigue con 12 de fuego y 1 leña: es más simple a propósito. Tampoco tiene el aviso del clima, el gasto de acampar ni los minijuegos, y su leña aviva 5 porque el tablero es la mitad de ancho que el mapa (`docs/02-alcance-mvp.md`, *La versión de mesa*).

### Qué se revisa solo

Al correr `node --test` en la raíz del repo se revisa:

- **Que el juego se pueda ganar.** Un jugador automático que junta, acampa y hace caso al aviso de lluvia llega casi siempre: el 100 % en verano de día y el 98 % en invierno de noche (500 viajes, 19/11; antes, 95 % y 77 %). El reto ahora está en las tres marcas: ese mismo jugador llega con 3 de comida el 35 % de las veces (7 % en invierno de noche) y a tiempo el 26 % (14 %). Uno que va derecho sin juntar nada no llega nunca: el fuego se le apaga en unas 19 casillas (15 en invierno de noche), y el camino más corto tiene unas 29. Esto se mide con cada destino. Los jugadores automáticos no juegan minijuegos: no miden el costo de fallarlos ni el premio de hacerlos perfectos.
- **Que cada mapa sea jugable.** Se prueban 500 mapas: todos tienen camino por agua hasta el destino, todo lo que se junta queda al alcance de la canoa y hay lugares para amarrar. Salen 500 mapas distintos.
- **Que los datos del territorio sean consistentes:**
  - cada cosa tiene fuente (o 🔍), dibujo en el estilo Corteza y un lugar válido;
  - cada carta que nombra existe;
  - nada dice «extinguido» ni «desaparecido».
- **Que un cambio en los datos no mueva el resto.** Sacar un elemento no cambia las costas ni dónde está la leña.
- **Que la misma semilla dé siempre el mismo mapa.** Si un cambio en el código los altera, la prueba avisa.
- **Que acampar cueste y que el clima avise:** acampar sin comida baja el fuego y, noche tras noche, termina el viaje; cada cambio de clima llega después de su aviso; acampar cancela lo anunciado.
- **Que el motivo del viaje respete los datos:** nunca sale un destino en «propuesta», la estación manda cuando el destino la tiene y, si ninguno sirve, va al `ACTIVO`.
- **Que el contrato con la interfaz se cumpla:** las mismas pruebas de la partida falsa, corridas contra el núcleo.

### Lo que todavía no está

- **La corteza no tiene efecto en el juego:** se junta y da su carta, nada más. La carta ya no promete arreglar la canoa, y la canoa no se daña.
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

Son ideas para charlar en el grupo. El aviso del clima ya está (PR 22).

**Qué propone A para la entrega del 19/11 (18/11):** no sumar cambios grandes al núcleo y cerrar lo que ya anda.

| Propuesta | Qué propone A | Depende de |
|---|---|---|
| El viaje en 3 tramos | Para después de la hackatón. Por ahora, el ciclo de *explorar, encontrar y volver* lo cierra la herencia entre generaciones | El equipo |
| Qué deja cada saber heredado | Hecha el 19/11 (rama `jugabilidad/chispa`): ver la tabla de arriba | — |
| Las brasas | Hecha el 19/11 (rama `jugabilidad/chispa`): 3 remadas para avivarlo | — |
| La carta de la corteza | Resuelta: C cambió el texto y la carta ya no promete arreglar la canoa. La canoa no se daña (`docs/02-alcance-mvp.md`, *Queda afuera*) | — |
| El destino del viaje | Resuelto el 18/11: Dani habilitó la pirita como motivo del viaje, junto con la ballena, pasando ese destino a `'borrador'` | — |
| El juego de mesa | Se presenta como una versión más simple, con sus propios números | El equipo |
| Dónde se guardan los datos del territorio | Se quedan donde están: moverlos ahora no suma y puede romper algo | El equipo |

El detalle de cada una:

- **El viaje dividido en 3 partes.** Hoy el viaje es un solo canal largo, de la salida al destino. La propuesta es partirlo en 3 tramos con un campamento entre uno y otro. Así se nota más el ciclo de *explorar, encontrar y volver* que pide el concepto, y cada partida tiene momentos de respiro.

- **Qué deja cada saber heredado (hecha el 19/11).** Antes, cada saber heredado daba un poco más de fuego al arrancar. La propuesta era que cada saber deje un conocimiento concreto. Por ejemplo, quien heredó el de los mejillones ve dónde hay comida aunque esté tapada por el humo, y quien heredó el del amarre ve dónde se puede acampar. Va más con la idea de que lo que pasa de generación en generación es la memoria. Si se aprueba, hay que ajustar el texto «En el juego» de algunas cartas.

- **Las brasas (hecha el 19/11).** Antes, cuando el fuego llegaba a cero, el viaje terminaba de golpe. La propuesta era que quede unos pasos en brasas y que, si se aviva a tiempo con leña, vuelva. Es menos frustrante y ya existe el dibujo de las brasas.

- **El destino del viaje.** La ballena varada y la búsqueda de piedras de fuego (pirita) están habilitadas. La corteza buena para canoas sigue como propuesta. Cada motivo conserva su fuente en [`territorio/destinos.js`](territorio/destinos.js).

- ~~**La carta de la corteza.**~~ Resuelta: C cambió el texto «En el juego» de la carta. Lo que decía antes: la carta decía que encontrar un guindo grande «permite arreglar la canoa», pero en el juego la canoa nunca se rompe. Así la carta promete algo que no pasa. Hay dos caminos: cambiar el texto de la carta o agregar que la canoa se pueda dañar, por ejemplo al chocar con rocas.

- **Las fuentes que faltan.** Cada cosa que aparece en el mapa tiene su fuente con página, salvo tres: la leña (no hay una cita propia), los conchales (falta la cita exacta) y la tonina (falta confirmar qué especie vive en el Beagle). Están marcadas como pendientes.

- **El juego de mesa.** Es la versión en papel que ya está en el repo, con tablero, fichas, dado y reglas, pensada para escuelas sin computadoras y para el stand. Desde el 18/11 ya no tiene los mismos números que el juego de la compu (ver *Los números*). Hay que decidir si se actualiza la de papel o si se presenta como una versión más simple.

- ~~**Cómo se conecta el juego con las pantallas.**~~ Hecho: B lo conectó el 13/11 y el juego se juega de punta a punta en `index.html`.

- **Dónde se guardan los datos del territorio.** Todo lo que puede cambiar con la investigación (qué hay en el mapa, dónde aparece, qué hace, de qué fuente sale y el destino) quedó en unos archivos aparte, que se pueden editar sin programar. Hoy están en la carpeta del motor del juego. Se puede dejar así o pasarlos a la carpeta de datos, junto con las cartas.

- **El alcance del juego.** Falta escribir en un documento qué entra sí o sí para el 18/11 y qué se deja afuera si no llega el tiempo: cuántas partes tiene el viaje, qué peligros hay y qué se recorta primero. Las tareas del equipo ya lo marcan como pendiente, porque sin eso no hay contra qué medir si el juego está terminado.
