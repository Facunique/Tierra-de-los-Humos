# Tierra de los Humos · versión de mesa

El mismo juego, **en papel**: para escuelas sin computadoras ni conexión, para jugar en ronda en el aula o para el stand de la demo. Es cooperativo, para 1 a 4 personas desde 9 años, y dura unos 20 minutos.

| Qué imprimir | Archivo | Papel |
|---|---|---|
| Tablero | [`tablero-A3.pdf`](tablero-A3.pdf) | A3 apaisado, o dos A4 unidas con cinta |
| Fichas (recurso de un lado, humo del otro), canoa y brasa | [`fichas-A4.pdf`](fichas-A4.pdf) | A4 doble faz, «girar por el borde largo», mejor en cartulina |
| Reglas y Libro de la familia | [`reglas-A4.pdf`](reglas-A4.pdf) | A4 |
| Cartas de saber | [`../arte/cartas/cartas-para-imprimir.pdf`](../arte/cartas/cartas-para-imprimir.pdf) | A4 doble faz |

Además hace falta un dado común.

## Cómo funciona

- **El fuego es la vida.** Se lleva en el medidor del tablero. Remar lo gasta, y más con viento en el canal hondo o con lluvia. La leña lo aviva.
- **El humo se explora.** Las fichas empiezan con el humo hacia arriba y se dan vuelta cuando la canoa llega al lado.
- **Cada saber se lee en voz alta** y se guarda.
- **Morir es transmitir.** Si el fuego se apaga, la familia anota en el Libro de la familia los saberes que juntó. La generación siguiente empieza con 1 de fuego más por cada saber heredado.

Las reglas completas entran en una página: [`reglas.html`](reglas.html).

## Notas

- Los números (fuego, remo, dado) son **recursos de juego, de prueba**. Se ajustan jugando.
- Los saberes son los mismos borradores de `datos/saberes.js`, con su fuente y página. Los revisa la Persona C.
- Para usarla en clase, la [guía para docentes](../escuelas/README.md) propone una actividad por carta y una clase de 80 minutos.
- Las fuentes de los PDF son `tablero.html`, `fichas.html` y `reglas.html`, con los datos en `mesa.js`. Para regenerarlos: `node mesa/exportar.cjs` (necesita Playwright).

Licencia: CC BY-SA 4.0 (juego, textos y arte); MIT (código).
