# Minijuegos

Antes de juntar algo, avivar el fuego o amarrar la canoa, se juega un momento corto. Si sale bien, la acción se hace igual que siempre: el núcleo no cambia, con los mismos números y las mismas reglas. Si no sale, se puede probar de nuevo o volver al viaje, y no se pierde nada.

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

**Por decidir (Persona A):** hoy fallar no cuesta nada. Si se quiere que cueste, por ejemplo una casilla de fuego, se decide con los números del núcleo.

Licencia: MIT (el código); CC BY-SA 4.0 (los textos).
