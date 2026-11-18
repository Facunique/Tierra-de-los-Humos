# Minijuegos

Antes de juntar algo, avivar el fuego o amarrar la canoa, se juega un momento corto. Si sale bien, la acción se hace igual que siempre: el núcleo no cambia, con los mismos números y las mismas reglas. Si no sale (se acaban los intentos o el tiempo, o se vuelve después de errar), se pierde el turno: se les fue el tiempo y el fuego baja como al remar, sin moverse (`{ tipo: 'demora' }` del núcleo). Volver al viaje antes de probar no cuesta nada.

| Acción | Minijuego | Dónde |
|---|---|---|
| Juntar leña | Tocar tres ramas antes de que se haga tarde | Bajan a tierra, en la playa |
| Juntar mejillones | Juntar cuatro a mano mientras la marea está baja; cuando el agua sube, esperar | Bajan a tierra, en la costa |
| Juntar hongos | Tocar tres hongos de los árboles | Bajan a tierra, al borde del bosque |
| Juntar pirita | Encontrar las dos piedras de fuego (las doradas) entre las grises | Bajan a tierra, en la playa |
| Juntar pescado | Levantar la línea cuando el pez llega a la carnada (sin anzuelo) | En la canoa |
| Avivar el fuego | Sumar la leña cuando la llama está baja | En la canoa |
| Amarrar y acampar | Amarrar cuando la canoa pasa sobre el cachiyuyo | En la canoa |

Cada minijuego muestra el dato de las fuentes que lo acompaña, el mismo de las cartas y de los elementos del territorio. También aclara que la mecánica es recurso de juego. Qué dibuja cada uno y de qué fuente sale está en [`docs/05-rigor-historico.md`](../docs/05-rigor-historico.md#los-minijuegos-minijuegos-1811-d).

## Racha

Cada minijuego que sale al primer intento suma a la racha; fallar, tocar una piedra común o volver al viaje la corta. La racha se ve arriba del minijuego, y la mejor se guarda en el dispositivo. Es un reto propio: no cambia nada del viaje.

## Para todos

- Se juegan con el dedo, el mouse o el teclado. Las cosas para juntar son botones (<kbd>Tab</kbd> y <kbd>Enter</kbd>); en los de tiempo, alcanza con la barra espaciadora. <kbd>Esc</kbd> vuelve al viaje.
- Con movimiento reducido no hay apuro: el tiempo no se acaba y la marca va más lenta.
- Con el narrador encendido no hay minijuegos, porque son para ver.
- En la pantalla de título, **Minijuegos: sí / no** los apaga.

## Para programar

```js
if (TDH_MINIJUEGOS.cual('juntar', 'mejillones')) {
  const ok = await TDH_MINIJUEGOS.jugar('juntar', 'mejillones', { estacion, altoContraste, reducido });
  if (ok) partida.hacer({ tipo: 'juntar' });
}
```

El gancho está en `juego/interfaz/juego.js` (función `minijuego`). Para sumar un minijuego, copiá una entrada de `JUEGOS` en `minijuegos.js`. `node --test` revisa que tenga textos, escena, dibujo y fuente, y que no use anzuelos, redes ni escenas de caza (`pruebas/minijuegos.test.cjs`). `pruebas/de-punta-a-punta.cjs` los juega tocando, como una persona.

**Fallar cuesta (18/11, decisión del equipo):** si no sale, el núcleo hace `{ tipo: 'demora' }`: gasta lo mismo que una remada (más con lluvia o de noche) y pasa el tiempo, pero la canoa no se mueve. El número lo puede ajustar A en `demora()` de `juego/nucleo/partida.js`.

Licencia: MIT (el código); CC BY-SA 4.0 (los textos).
