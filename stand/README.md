# Stand de la demo (19/11, Fábrica de Talento)

Todo funciona **sin internet**: se abre con doble clic desde la carpeta del repositorio.

| Archivo | Para qué |
|---|---|
| [`vidriera.html`](vidriera.html) | Pantalla que se reproduce sola, en bucle (cerca de un minuto): título, la canoa remando mientras se abre el humo, el mapa de territorios, cartas de saber con su fuente, el paso del fuego y el QR para jugar. |
| [`cartel-A3.pdf`](cartel-A3.pdf) | Cartel para imprimir en A3 y colgar en el stand. Su fuente es [`cartel.html`](cartel.html). |
| `qr-juego.svg`, `qr-repositorio.svg` | Los códigos QR del juego (GitHub Pages) y del repositorio. |
| [`../arte/cartas/cartas-para-imprimir.pdf`](../arte/cartas/cartas-para-imprimir.pdf) | Cartas de saber para regalar, A4 doble faz. |
| [`../escuelas/guia-docente-A4.pdf`](../escuelas/guia-docente-A4.pdf) | Guía para docentes. Llevar algunas copias para quienes trabajan en escuelas. |
| [`../mesa/`](../mesa/README.md) | La versión de mesa impresa, para jugar en el stand sin pantalla. |

## Cómo usar la vidriera

**Con el juego de verdad:** cuando el núcleo del juego está en el repositorio (`juego/nucleo/`), la escena del viaje es una partida real que se juega sola durante 45 segundos: rema, junta leña, aviva el fuego y acampa. Muestra como subtítulo lo que pasa y cada saber nuevo con su fuente. Cada vez es un mapa distinto, con la luz de ese momento en Ushuaia. Si el núcleo no está, muestra la escena armada de siempre.


1. Abrir `stand/vidriera.html` en el navegador de la notebook o del televisor.
2. Apretar <kbd>F</kbd> para pantalla completa.
3. Listo: se repite sola. El cursor se esconde a los 3 segundos y la pantalla no se apaga, si el navegador lo permite.

Teclas: <kbd>Espacio</kbd> pausa, <kbd>→</kbd> pasa a la escena siguiente.

## Antes de imprimir

- [ ] **Verificar el QR del juego en un celular.** Apunta a `https://facunique.github.io/Tierra-de-los-Humos/`, que se activa cuando la Persona B publique en GitHub Pages. Si la dirección es otra, regenerar el QR:

  ```bash
  npm i --no-save qrcode@1.5.4
  ```

  ```bash
  node stand/generar-qr.cjs https://la-direccion-correcta/ juego
  ```

  Después volver a exportar el cartel:

  ```bash
  node stand/exportar.cjs
  ```

- [ ] Completar los nombres del equipo en `cartel.html` (marcados con ✏️).
- [ ] La Persona C aprueba los textos de las cartas antes de imprimirlas.
