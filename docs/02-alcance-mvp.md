# 02 · Alcance del juego para la entrega

> **Propuesta de la Persona B (14/11/2026), para acordar con la Persona A.** Lo cultural lo confirma la Persona C. Lo marcado con ✏️ espera esa respuesta. Cuando A y B lo acuerden, se anota en `equipo/memory.md` (*Decisiones*) y se saca este aviso.
>
> Sirve para una sola cosa: saber **qué tiene que estar sí o sí** en la entrega y **qué se recorta primero** si no llega el tiempo. Sin esto, no hay contra qué medir si el juego está terminado.

## Fechas (cronograma definitivo de la organización)

| Cuándo | Qué |
|---|---|
| 16/11, hasta las 23:00 | Primer avance documentado |
| **17/11** | **Meta interna: el juego congelado.** Desde acá, solo arreglos |
| **18/11, hasta las 21:00** | **Entrega final**: prototipo, repositorio, README, video y presentación |
| 20/11, de 15:00 a 19:00 | Demo en Fábrica de Talento |

## Qué cuenta como terminado

Cada punto sale de un criterio del jurado (`docs/00-guia-hackathon.md`, sección 5).

1. **Se juega de punta a punta sin errores, en el celular** (funcionalidad, 20). Un viaje entero, la carta al final y la generación siguiente. `node pruebas/de-punta-a-punta.cjs` pasa en las cinco pantallas.
2. **Cada dato que se ve tiene fuente** (rigor, 20). Las cartas, lo que hay en el mapa y el motivo del viaje. Ninguna carta promete algo que el juego no hace.
3. **El juego enseña algo real** (pertinencia, 25). Lo que se aprende sirve para jugar mejor la vez siguiente, y el viaje responde al enfoque de nomadismo que decidió C.
4. **Lo prueban personas que no son del equipo** (al menos tres, una en un celular) y entienden solas por qué se apagó el fuego.
5. **Abre sin internet** en Pages y con doble clic, para la demo y para las escuelas.

## Lo que ya está (14/11)

- El viaje entero en `index.html`, con el núcleo de A y la interfaz de B: mapa al azar, fuego, leña, comida, pirita, clima, día y noche, acampar, cartas, victoria, derrota y herencia guardada.
- Códice por pueblo, postal, sonido con subtítulos, narrador, alto contraste y luz real.
- El juego sin internet en Pages (`sw.js`).
- 92 pruebas automáticas, y un jugador automático que llega al destino el 84 % de las veces.

## Entra sí o sí (para el 17/11)

| Qué | Quién | Por qué |
|---|---|---|
| **El viaje responde al nomadismo**: ver abajo | A, B y C | Es la decisión de C (13/11) y pesa en pertinencia |
| **Arreglar la carta de la corteza**: en `main` todavía promete «arreglar la canoa», que no existe. **Resuelto en el PR 13**, falta mergearlo | C (texto) | Rigor: la carta no puede prometer algo falso |
| **Que acampar no sea gratis**: hoy se puede acampar noche tras noche sin gastar fuego | A | Una partida podría no terminar nunca |
| **El aviso antes de que cambie el clima** («se ven nubes», «se levanta el viento») | A (evento), B (texto y sonido) | Perder se siente justo y no mala suerte. Es barato |
| **Pasar a `elementos.js` las fuentes de la leña y los conchales** que D encontró (Bird, 1946). **Resuelto en el PR 13**, falta mergearlo. Siguen con 🔍 la tonina, el pato vapor y el cormorán (falta la fuente de la especie) | C, con A | Rigor: menos 🔍 en el mapa |
| **Pruebas con personas** y ajuste de los números | A y B | Funcionalidad y balance |
| **La prueba de punta a punta antes de entregar** | B | Funcionalidad |

### El nomadismo, en chico

C decidió que el viaje acompaña desplazamientos con motivos que combinan el clima, la comida y el ambiente, y que la ballena varada es uno de ellos (`docs/01-concepto.md`). La propuesta más chica que lo muestra, sin rearmar el juego:

- **Cada viaje tiene su motivo**, elegido entre los documentados de `juego/nucleo/territorio/destinos.js`. El núcleo ya sabe jugar con cualquiera de los tres que hay (ballena varada, corteza para canoas, piedras de fuego).
- **El motivo depende de la estación**, solo cuando hay fuente para eso. La corteza se sacaba en primavera (Cooper, 1946, p. 88; Vargas Filgueira, 2019, p. 23, según las notas de C). Para los otros dos motivos, los datos del repo no tienen estación: pueden salir en cualquiera hasta que C encuentre otra cosa. ✏️ C confirma cada motivo y su estado (hoy la corteza y la pirita están como «propuesta»).
- **Al empezar, la interfaz cuenta por qué viajan**, con el dato y la fuente del motivo. Al llegar, lo mismo que hoy: el dato del destino con su fuente.
- **El cierre de la partida no cambia:** llegar al lugar del motivo con el fuego encendido, o que se apague. ✏️ A y C confirman que alcanza para la entrega.

Qué cambia en el código: A elige el destino según la estación en `partida.js` (hoy usa `ACTIVO`), y B suma el texto del motivo al empezar. Es medio día de trabajo.

## Entra si llega, en este orden

1. **Las brasas** (propuesta de A): cuando el fuego llega a 0, quedan unos pasos en brasas y se puede avivar. Es menos frustrante y ya existe el dibujo.
2. **Lo heredado deja un saber concreto**, solo en dos o tres cartas (por ejemplo, quien heredó los mejillones los ve aunque estén tapados por el humo). Las demás siguen dando fuego al empezar. ✏️ C ajusta el texto «En el juego» de esas cartas.
3. **El viaje en tres tramos** con un campamento entre uno y otro (propuesta de A). Es lo que más se parece al ciclo del concepto, pero es lo más caro: toca el mapa, el núcleo y la interfaz.

## Queda afuera de la entrega

- **La familia kawésqar.** Se suma solo con la consulta a sus comunidades (decisión del 9/11). En el juego figura como «Próximamente».
- **Que la canoa se dañe.** Se resuelve cambiando el texto de la carta de la corteza.
- **Peligros que no sean el entorno.** Nunca hay enemigos ni violencia (líneas rojas). Las mareas quedan para después.
- **Cuentas, servidor o partidas compartidas.** La herencia vive en cada dispositivo.

## Si no llega el tiempo, se recorta en este orden

1. Los tres tramos.
2. El saber concreto heredado (queda el fuego extra al empezar).
3. Las brasas.
4. El aviso del clima.

**No se recorta nunca:** que se juegue de punta a punta en el celular, que cada dato tenga su fuente y que ninguna carta prometa algo falso.

## La versión de mesa

`mesa/` tiene las mismas reglas que el juego de hoy. Si entran los cambios de arriba, las dos versiones dejan de coincidir. Propuesta: presentar la de mesa como **una versión más simple**, para escuelas sin computadoras, y no actualizarla antes de la entrega. ✏️ D confirma.

## Los números

Están en `juego/nucleo/reglas.js` y los decide A jugando. Hoy: fuego 12 de 16 al empezar, más 1 por cada saber heredado; remar gasta 1, y 1 más con viento en el canal hondo, con lluvia o de noche; cerca de una choza gasta 1 menos; cada leña aviva 6; comer al acampar suma 3; la pirita lo vuelve a prender una vez.
