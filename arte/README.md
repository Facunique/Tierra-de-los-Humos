# Arte · Tierra de los Humos

Todo el arte del juego es **propio** y sale de un solo archivo de texto: [`fuente/arte.js`](fuente/arte.js). Los PNG se generan a partir de ese archivo. La dirección de arte completa (por qué cada color, fuentes, propuestas) está en [`docs/04-direccion-de-arte.md`](../docs/04-direccion-de-arte.md).

## Qué hay

| Ruta | Qué es |
|---|---|
| `fuente/arte.js` | **La fuente única:** paleta de 42 colores y cada sprite dibujado letra por letra. Funciona en el navegador y en Node. |
| `generar.cjs` | Genera todos los PNG. `node arte/generar.cjs` desde la raíz del repo. No hay que instalar nada. |
| `sprites/*.png` | Cada sprite suelto, con sus cuadros uno al lado del otro. |
| `hoja-sprites.png` | Todos los sprites juntos (verano). También `hoja-sprites-otono.png` y `hoja-sprites-invierno.png`. |
| `hoja-sprites.json` | El atlas: dónde está cada cuadro dentro de la hoja. Sirve para las tres estaciones. |
| `paleta/` | La paleta en `.gpl` (Aseprite, GIMP, Krita), `.hex` (Lospec), `.json` y `.png`. |
| `logo/` | Logo (`logo.svg`, `logo.png`), favicon (`favicon.svg`, `favicon-32.png`), ícono para celular (`icono-192.png`) e imagen para compartir en redes (`compartir.png`, 1200 × 630). |
| `tipografia/` | Atkinson Hyperlegible (licencia OFL) y su CSS, para usar sin internet. |
| `propuestas/index.html` | Las tres propuestas de estilo, interactivas. Doble clic para abrir. |

## Cómo dibujar o corregir un sprite

Cada sprite es una lista de filas de texto. Cada letra es un color de la paleta y el punto (`.`) es transparente. Por ejemplo, la leña:

```js
'.....RRRRRRgR...',
'....RgrrrrrrR...',
'....RRRRRRRRR...',
```

`R` es corteza clara, `r` es corteza, `g` es grava. La tabla completa de letras está al principio de `fuente/arte.js` (y en la página de propuestas, con muestras de color).

1. Abrí `arte/fuente/arte.js` y buscá el sprite por su nombre.
2. Cambiá las letras. Todas las filas tienen que tener el mismo largo (16 para la mayoría).
3. Corré el generador:

```bash
node arte/generar.cjs
```

4. Abrí `arte/propuestas/index.html` para verlo en la escena, o mirá el PNG en `arte/sprites/`.

Si algo está mal (una fila más corta, una letra que no existe), el generador avisa qué sprite y qué fila.

**¿Preferís un programa de dibujo?** Cargá `paleta/paleta.gpl` en Aseprite, Krita o GIMP, dibujá con esos colores y pasá el resultado al equipo: se puede convertir a texto. Lo importante es no salirse de la paleta.

## Cómo usarlo en el juego (Personas A y B)

**Opción 1: hoja de sprites + atlas** (lo más común con Canvas).

```js
const hoja = new Image();
hoja.src = 'arte/hoja-sprites.png';            // o hoja-sprites-otono.png / -invierno.png
const atlas = await (await fetch('arte/hoja-sprites.json')).json();

function dibujar(ctx, id, cuadro, x, y, escala) {
  const c = atlas.sprites[id].cuadros[cuadro % atlas.sprites[id].cuadros.length];
  ctx.imageSmoothingEnabled = false;            // ¡importante para que no se vea borroso!
  ctx.drawImage(hoja, c.x, c.y, c.w, c.h, x, y, c.w * escala, c.h * escala);
}
```

**Opción 2: sin imágenes**, directo desde la fuente (sirve si el juego se abre con doble clic, sin servidor):

```html
<script src="arte/fuente/arte.js"></script>
<script>
  const canoa = TDH_ARTE.aCanvas('canoa', 0, 'verano', 3); // devuelve un <canvas> listo para drawImage
</script>
```

Reglas:

- **Escala entera siempre** (×2, ×3, ×4). Con escalas como ×2,5 los píxeles quedan desparejos.
- **Animaciones:** el agua, el cachiyuyo y la niebla tienen 2 cuadros; la canoa y el fuego del HUD, 3. Ritmo sugerido: un cuadro cada 0,45 s para el agua y cada 0,15 s para el fuego.
- **Costa:** donde la tierra toca el agua, dibujar una línea de espuma (`#9db3b6`). El agua y el guindo casi no se distinguen sin color (ver accesibilidad en `docs/04`).
- **Orilla con el agua arriba:** usar `orilla` dada vuelta verticalmente.
- **Luz y niebla:** el ejemplo completo (luz tramada que sale del fuego, humo de lo no explorado, lluvia, viento y nieve) está en `propuestas/index.html`, en la función `dibujarA()`. Se puede copiar.
- **Fuego del HUD:** `fuego-vivo` (4), `fuego-parejo` (3), `fuego-debil` (2), `fuego-brasas` (1), `fuego-apagado` (0). Siempre con el número al lado.

## Licencia

Arte: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es), equipo Tierra de los Humos. Código de `generar.cjs` y `fuente/arte.js`: MIT. La tipografía de `tipografia/` tiene su propia licencia (SIL OFL 1.1, ver `tipografia/OFL.txt`).
