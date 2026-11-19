# Minijuegos

Antes de juntar algo, avivar el fuego o amarrar la canoa, se juega un momento corto. Desde el 19/11 **cada uno se juega distinto** (antes, todos eran tocar cosas o tocar a tiempo). Las mecánicas salen de juegos fáciles de un gesto: arrastrar y soltar, mantener apretado, la memoria, frotar para destapar, el pez que hay que seguir con un solo botón, cargar y soltar, y guiar contra la corriente.

| Acción | Minijuego | Cómo se juega |
|---|---|---|
| Juntar leña | **Arrastrar** | Llevar tres ramas hasta la canoa |
| Juntar mejillones | **Mantener** | Mantener apretado cada mejillón hasta despegarlo; si sube el agua, esperar |
| Juntar hongos | **Memoria** | Mirar dónde están; después las hojas los tapan y hay que encontrarlos (3 errores y no sale) |
| Juntar pirita | **Frotar** | Frotar la arena con el dedo hasta destapar las dos piedras doradas |
| Juntar pescado | **Seguir** | Mantener apretado para subir el lazo y dejarlo sobre el pez hasta llenar la barra |
| Avivar el fuego | **Cargar** | Mantener apretado para sumar leña y soltar dentro de la franja: de menos no prende, de más lo ahoga |
| Amarrar y acampar | **Guiar** | La corriente empuja la canoa: tocar a un lado o al otro para dejarla sobre el cachiyuyo |

- **Si sale bien,** la acción se hace igual que siempre.
- **Si sale perfecto** (sin errar y rápido), suma un poco más: juntar da 1 más, avivar rinde más y la noche gasta menos (`BIEN_*` en `juego/nucleo/reglas.js`).
- **Si no sale** (se acaba el tiempo o los intentos, o se vuelve después de errar), se pierde el turno: el fuego baja como al remar, sin moverse (`{ tipo: 'demora' }`). Volver al viaje antes de probar no cuesta nada.

Los minijuegos no muestran el dato ni la fuente: están en las cartas, completos. La fuente de lo que se dibuja queda en `minijuegos.js` (campo `fuente`) y en [`docs/05-rigor-historico.md`](../docs/05-rigor-historico.md#los-minijuegos-minijuegos-1811-d-cada-uno-con-su-mecánica-desde-el-1911). La mecánica es recurso de juego.

## Racha

Cada minijuego que sale al primer intento suma a la racha; fallar o volver al viaje la corta. La racha se ve arriba del minijuego, la mejor se guarda en el dispositivo y **sube un poco la dificultad** (todo va hasta un 30 % más rápido con racha de 5). Es un reto propio: no cambia nada del viaje.

## Para todos

- Se juegan con el dedo, el mouse o el teclado:
  - arrastrar y memoria: <kbd>Tab</kbd> y <kbd>Enter</kbd>;
  - mantener: <kbd>Tab</kbd> y mantener la barra espaciadora;
  - frotar: las flechas mueven la mano, que va frotando;
  - seguir y cargar: mantener la barra espaciadora (o el botón grande);
  - guiar: las flechas o <kbd>A</kbd> y <kbd>D</kbd> (o los botones «◀ Remar» y «Remar ▶»).
- <kbd>Esc</kbd> vuelve al viaje.
- Con movimiento reducido no hay apuro: el tiempo no se acaba y todo va más lento.
- Con el narrador encendido no hay minijuegos, porque son para ver.
- En la pantalla de título, **Minijuegos: sí / no** los apaga.

## Para programar

```js
const r = await TDH_MINIJUEGOS.jugar('juntar', 'mejillones', { estacion, altoContraste, reducido, sonido });
// r: 'perfecto' | true | false (volvió sin probar) | 'fallo'
if (r === 'perfecto') partida.hacer({ tipo: 'juntar', bien: true });
else if (r === true) partida.hacer({ tipo: 'juntar' });
else if (r === 'fallo') partida.hacer({ tipo: 'demora' });
```

| Archivo | Qué tiene |
|---|---|
| `minijuegos.js` | El marco: la pantalla, el tiempo, la racha, el resultado y los datos de cada minijuego (`JUEGOS`) |
| `juegos-tierra.js` | Arrastrar, mantener, memoria y frotar |
| `juegos-canoa.js` | Seguir, cargar y guiar |
| `minijuegos.css` | Los estilos, con la paleta Corteza |

Cada mecánica recibe `c` (la escena, `ganar`, `perder`, `error`, `progreso`…) y devuelve `{ mover(s, dt), tecla(e, baja), auto(s, dt) }`. Para sumar un minijuego, copiá una entrada de `JUEGOS` y elegí una mecánica (o escribí una nueva). `node --test` revisa que cada uno tenga textos cortos, escena, dibujo, fuente y su propia mecánica, y que no use anzuelos, redes ni escenas de caza (`pruebas/minijuegos.test.cjs`).

`TDH_MINIJUEGOS.auto()` hace que el minijuego abierto se juegue solo, por los mismos caminos que una persona (arrastra la rama, mantiene apretado, sigue al pez). Lo usan `pruebas/de-punta-a-punta.cjs`, que además prueba la primera vez cada uno con el mouse o el teclado de verdad, y el grabador del video.

Licencia: MIT (el código); CC BY-SA 4.0 (los textos).
