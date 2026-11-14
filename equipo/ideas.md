# Ideas para más adelante (todo el equipo)

> Ideas que **todavía no se hicieron**, guardadas por si hacen falta. Es un lugar para coordinar: **cualquiera del equipo puede sumar, acomodar o descartar ideas** a medida que el proyecto avanza. No son tareas asignadas ni decisiones: cada una dice **qué señal indica que conviene hacerla**.
>
> **Cómo usarla:**
> - Cuando pase algo de la señal, se mira la idea y se decide entre todos.
> - Si se hace, se pasa a `tareas.md` con su responsable. Si es una decisión, va a `memory.md`.
> - Lo descartado se tacha, sin borrarlo, con el motivo.
> - Las propuestas de diseño del núcleo están en `juego/nucleo/README.md` (Mati). Acá solo se anota lo que cada una pediría de las otras partes.
>
> **Para sumar una idea**, copiar este formato:
> **N. Nombre.** *Qué:* … *Suma a:* (criterio de evaluación) … *Señal:* qué tiene que pasar … *Propone:* letra … *Le tocaría a:* letra o letras … *Esfuerzo:* aproximado.
>
> **Regla:** nadie avanza sobre la parte de otro sin acordarlo. Todo lo cultural pasa antes por la Persona C y, si corresponde, por la comunidad.
>
> Última revisión: 14/11/2026. Las ideas 1 a 27 las propuso la Persona D; salvo que se diga otra cosa, le tocarían a D. El esfuerzo es aproximado.

## Resumen: qué mirar y cuándo

| Cuándo | Ideas |
|---|---|
| Hoy, después de la reunión con la comunidad | 1, 2, 3 |
| Cuando se una el núcleo (PR 10) o se conecte a `index.html` | 4, 5, 6, 7, 8, 9 |
| Si el equipo aprueba una propuesta de Mati (`juego/nucleo/README.md`) | 10, 11, 12, 13, 14 |
| Cuando lleguen las fotos del libro de Goodall o avance la Persona C | 15, 16, 17 |
| Cierre: 16 y 17/11 | 18, 19, 20, 21 |
| Si el proyecto sigue después de la hackatón | 22 a 27 |

---

## Después de la reunión con la comunidad

**1. Aplicar lo que diga la comunidad, en todo a la vez.**
- **Qué:** si cambia algo, se corrige en todos lados el mismo día. Por ejemplo: jugar «como» o «acompañando», las siluetas, quién rema, nombres, colores u objetos que no van, la pantalla del presente. Hay que tocar el arte (`arte/corteza/corteza.js`), las cartas, el pitch, el storyboard, la guía para docentes, la versión de mesa, la vidriera y el cartel.
- **Suma a:** pertinencia (25) y rigor (20).
- **Señal:** la entrada de la reunión en `comunicaciones.md` tiene una corrección.
- **Esfuerzo:** de 1 a 3 horas, según el cambio.

**2. La pantalla «Hoy», escrita con la comunidad.**
- **Qué:** el cierre del códice en presente ya tiene lugar en la maqueta, con texto provisorio. Si la comunidad comparte qué quiere decir (y si autoriza nombrarse), armar el diseño con sus palabras tal cual. Puede llevar imágenes propias de la comunidad, nunca fotos históricas.
- **Suma a:** pertinencia, que también desempata.
- **Señal:** la comunidad dice qué quiere mostrar, o lo escribe la Persona C con su permiso.
- **Esfuerzo:** 1 hora.

**3. Grabaciones con la comunidad, solo si las ofrecen.**
- **Qué:** si la comunidad quiere grabar palabras en yagán, una frase o un sonido propio, sumar a `sonido/voz.js` la posibilidad de reproducir esos archivos. Sería la única excepción a «sin archivos de audio», con su crédito y su licencia.
- **Suma a:** pertinencia e innovación.
- **Señal:** respuesta afirmativa a las preguntas 9 y 10 de la hoja de la reunión.
- **Esfuerzo:** 2 horas.

## Cuando el núcleo esté unido o conectado

**4. Revisión de accesibilidad del juego real.**
- **Qué:** pasar una revisión automática (contraste, textos alternativos, orden del foco, etiquetas de botones) sobre el juego integrado, y corregir lo que sea del arte.
- **Suma a:** accesibilidad (10).
- **Señal:** `index.html` ya muestra el viaje real.
- **Esfuerzo:** 1 a 2 horas.

**5. Medir cuánto pesa y cuánto tarda en abrir.**
- **Qué:** un script que mida los KB que baja `index.html` y el tiempo hasta poder jugar con una conexión 3G simulada. Las bases recomiendan que funcione con conexiones lentas.
- **Suma a:** funcionalidad (20) y accesibilidad.
- **Señal:** juego conectado, o si la Persona B suma recursos pesados.
- **Esfuerzo:** 1 hora.

**6. Niebla que se actualiza solo donde se abre.**
- **Qué:** hoy el humo se rearma entero en cada remada (unos 35 ms en un celular lento). Se puede borrar solo el pedazo que se descubre.
- **Suma a:** funcionalidad.
- **Señal:** `node pruebas/de-punta-a-punta.cjs` muestra que cada toque tarda más de 300 ms en los celulares.
- **Esfuerzo:** 2 horas.

**7. Modo ahorro automático en celulares muy viejos.**
- **Qué:** si el juego anda a menos de 20 cuadros por segundo, el motor baja solo la resolución y saca el grano de papel.
- **Suma a:** funcionalidad.
- **Señal:** alguien prueba en un celular de gama baja y anda lento.
- **Esfuerzo:** 1 hora.

**8. «Tocá para jugar» en la vidriera del stand.**
- **Qué:** si alguien toca la pantalla del stand mientras la partida se juega sola, toma el control.
- **Suma a:** la demo del 19/11.
- **Señal:** juego conectado y una pantalla táctil en el stand.
- **Esfuerzo:** 1 hora.

**9. Conectar la luz real al arranque de la partida.**
- **Qué:** el núcleo ya acepta `hora` y `estacion`; falta que la interfaz le pase `TDH_LUZ_REAL.ahora()` cuando el botón «Luz real» está encendido. Son dos líneas, para la Persona B.
- **Suma a:** innovación.
- **Señal:** la Persona B conecta el núcleo a `index.html`.
- **Le tocaría a:** B.
- **Esfuerzo:** 15 minutos.

## Si el equipo aprueba una propuesta de Mati

**10. «Lo que la abuela sabía»: que la herencia se vea.**
- **Qué:** para la propuesta «Qué deja cada saber heredado». Lo heredado se ve como silueta tenue a través del humo; por ejemplo, la comida para quien heredó el saber de los mejillones. El motor dibujaría `objetos` con `presentido: true`.
- **Suma a:** pertinencia: la herencia se ve en la pantalla, no solo en un texto.
- **Señal:** el equipo aprueba la propuesta.
- **Le tocaría a:** A decide la regla; D, el dibujo en el motor.
- **Esfuerzo:** 1 a 2 horas en el motor.

**11. Las brasas.**
- **Qué:** para la propuesta del fuego en brasas. El motor ya dibuja el fuego en 5 niveles; falta un estado de brasa que late, con su sonido (crepitar que se apaga) y un subtítulo.
- **Suma a:** funcionalidad, porque perder se siente menos de golpe.
- **Señal:** se aprueba la propuesta.
- **Esfuerzo:** 1 hora.

**12. El aviso de que cambia el tiempo.**
- **Qué:** para la propuesta del aviso un paso antes. En el arte: nubes que oscurecen un borde del mapa o líneas de viento lejanas. En el sonido: una ráfaga lejana. Con su subtítulo («Se ven nubes al oeste»).
- **Suma a:** funcionalidad, porque perder se siente justo.
- **Señal:** se aprueba la propuesta.
- **Esfuerzo:** 1 hora.

**13. El viaje en tramos: la noche en el campamento.**
- **Qué:** si el viaje se parte en tramos, una escena corta entre uno y otro: la choza en la playa, el fuego y el humo, con el sonido de la noche. Ya están todos los dibujos.
- **Suma a:** pertinencia: se ve el ciclo de explorar, encontrar y volver.
- **Señal:** se aprueba la propuesta.
- **Esfuerzo:** 2 horas.

**14. La canoa que hace agua y el balde de corteza.**
- **Qué:** si la canoa se puede dañar (propuesta de «La carta de la corteza»). Cooper dice que la canoa hacía mucha agua y se achicaba con baldes de corteza que hacía la mujer (p. 88-89; fila «Baldes» de `docs/05`). Se puede sumar la pegatina del balde, el sonido de achicar y una carta.
- **Suma a:** rigor: la carta deja de prometer algo que no pasa.
- **Señal:** se decide que la canoa se daña.
- **Le tocaría a:** A, la regla; D, el arte y el sonido; C, la carta.
- **Esfuerzo:** 2 horas.

## Cuando avance la investigación

**15. Cotejar con Goodall y cerrar los 🔍 del arte.**
- **Qué:** especie de la tonina, aves y erizos con nombres oficiales, la lenga y el árbol bandera. La lista de qué buscar está en `docs/05`.
- **Suma a:** rigor (20).
- **Señal:** llegan las fotos del libro.
- **Le tocaría a:** C con D.
- **Esfuerzo:** 1 a 2 horas.

**16. Bibliografía automática.**
- **Qué:** un script que junte todas las fuentes (cartas, territorio, arte, mapa) en una sola lista para el README, y una pantalla «Fuentes» en el juego. Así no se olvida ninguna.
- **Suma a:** rigor y documentación.
- **Señal:** la Persona C escribe `docs/03-contenido-cultural.md`, o la sección Fuentes del README.
- **Esfuerzo:** 1 a 2 horas.

**17. Prueba automática de rigor del arte.**
- **Qué:** una prueba que avise si algo dibujado (figura o pegatina) no tiene su fila en `docs/05-rigor-historico.md`.
- **Suma a:** rigor.
- **Señal:** se suma arte nuevo, o alguien más empieza a dibujar.
- **Esfuerzo:** 1 hora.

## Para el cierre (16 y 17/11)

**18. README final con el juego real.**
- **Qué:** cambiar las capturas de la maqueta por capturas y el GIF del juego (`node equipo/video/grabar.cjs`), y completar los ✏️.
- **Suma a:** documentación (10).
- **Señal:** juego conectado. Ya figura en `tareas.md`.
- **Esfuerzo:** 1 hora.

**19. Video con clips del juego real.**
- **Qué:** volver a correr el grabador sobre `index.html`, grabar las voces y montar.
- **Suma a:** comunicación (10).
- **Señal:** 16/11. Ya está en `tareas.md`.
- **Esfuerzo:** 2 a 3 horas.

**20. Pitch al día.**
- **Qué:** diapositiva 5 (demo) con capturas reales y diapositiva 3 (consulta) con lo autorizado en la reunión. Volver a exportar el PDF.
- **Suma a:** comunicación.
- **Señal:** juego conectado y reunión registrada.
- **Esfuerzo:** 1 hora.

**21. Pruebas automáticas en GitHub.**
- **Qué:** que `node --test` corra solo en cada PR con GitHub Actions (no necesita instalar nada). Es configuración del repositorio, así que se propone a la Persona B.
- **Suma a:** apertura y documentación.
- **Señal:** se suman más personas al repo, o se rompe algo sin que nadie lo note.
- **Le tocaría a:** B.
- **Esfuerzo:** 30 minutos.

## Si el proyecto sigue después de la hackatón

**22. «Cuaderno del viaje» para el aula.** Al terminar una clase, imprimir lo que aprendió el grupo: la postal más las cartas encontradas, en una hoja A4. *Señal:* comentarios de docentes sobre la guía.

**23. Editor de saberes conectado.** Que lo escrito en el editor llegue al equipo sin copiar y pegar, por ejemplo como un PR o un archivo que se manda. *Señal:* la comunidad empieza a usar el editor.

**24. Kawésqar, con su consulta.** El motor y las cartas ya admiten otro pueblo (`pueblo: 'kawesqar'`). El arte de los canales del oeste es otro. *Señal:* solo si hay consulta con sus comunidades. Está decidido que va después del Yagán.

**25. Postal con QR.** Que la postal lleve un código QR al juego, para imprimirla en el stand o en la escuela. *Señal:* se usa la postal en la demo.

**26. Lectura fácil.** Una versión corta de cada carta para primaria. La escribe la Persona C. *Señal:* lo piden docentes.

**27. El mapa del juego sobre el mapa real.** Al final del viaje, mostrar en qué parte de los canales reales podría estar un viaje así, sin decir que es un lugar exacto (el mapa del juego es ficción). *Señal:* el equipo quiere reforzar el vínculo con el territorio.

---

## Descartadas o en espera

- ~~Clima real de Ushuaia~~: necesita internet y el juego tiene que andar sin conexión. La luz real sí se calcula sin internet.
- ~~Imitar aves o animales en el sonido~~: no hay fuente de qué especie se oye en cada lugar.
