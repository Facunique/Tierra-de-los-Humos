# Herramientas

Páginas de apoyo que no son el juego. Se abren con doble clic, sin internet.

## Editor de saberes

[`editor-de-saberes.html`](editor-de-saberes.html) sirve para **escribir una carta de saber nueva o corregir una que ya está, sin programar**. Está pensado para el equipo y para las personas de la comunidad que quieran corregir o sumar saberes.

- **Se ve igual que en el juego:** la carta se dibuja con el estilo Corteza mientras se escribe, con su ilustración.
- **Se revisa con las mismas reglas que el juego:**
  - que tenga dato, recurso de juego y fuente con página;
  - que el identificador no esté repetido;
  - que no diga «extinguido» ni «desaparecido».
- **Acepta tres tipos de fuente:** Cooper (1946), otro libro o documento, o **un relato de una persona de la comunidad**. El relato solo se puede sumar con el permiso de quien lo contó, y su nombre aparece solo si lo autorizó; si no, figura por su rol. No se anotan teléfonos, mails ni direcciones.
- **La ilustración solo usa escenas y objetos ya revisados** contra las fuentes (`docs/05-rigor-historico.md`). Si hace falta dibujar otra cosa, se le pide al equipo de arte.
- **Para corregir una carta,** se la elige arriba: se cargan sus textos y se conserva su ilustración.
- **Nada se publica solo.** Lo escrito queda guardado en esa computadora. Para sumarlo, «Copiar para el juego» o «Guardar en un archivo» da el texto con el formato de [`datos/saberes.js`](../datos/saberes.js). Alguien del equipo lo pega ahí y corre `node --test`. La Persona C lo revisa y recién entonces pasa de «borrador» a «revisado».
- **También se puede imprimir la carta** sola, en A5, para llevarla a una reunión o al aula.

La lógica está en [`editor-saberes.js`](editor-saberes.js), sin pantalla, y se prueba con `pruebas/editor-saberes.test.cjs`. Una de las pruebas abre cada carta del juego en el editor y verifica que sale igual.

Licencia: código MIT; las cartas que se escriben, CC BY-SA 4.0.
