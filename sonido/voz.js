/*
 * Tierra de los Humos · Lectura en voz alta de las cartas de saber
 * ----------------------------------------------------------------
 * Usa la voz que ya trae el sistema (Web Speech API): no hay archivos de audio,
 * no hace falta internet en la mayoría de los celulares y computadoras, y no
 * suma licencias. Elige una voz en castellano, de preferencia rioplatense.
 *
 * Para quién: quien lee con dificultad, quien ve poco, y los chicos más chicos.
 *
 *   if (TDH_VOZ.disponible()) boton.hidden = false;
 *   TDH_VOZ.leerCarta(carta);   // { tipo, titulo, dato, juego, fuente }
 *   TDH_VOZ.leer('Cualquier texto');
 *   TDH_VOZ.detener();
 *
 * La voz del sistema no sabe pronunciar palabras en lengua yagán: por eso las
 * cartas no deberían incluirlas sin una grabación hecha con la comunidad.
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const sintesis = raiz.speechSynthesis;
  let vozElegida = null;

  function elegirVoz() {
    if (!sintesis) return null;
    const voces = sintesis.getVoices();
    const orden = ['es-AR', 'es-UY', 'es-419', 'es-US', 'es-MX', 'es-CL', 'es-ES', 'es'];
    for (const lang of orden) {
      const v = voces.find((x) => x.lang && x.lang.replace('_', '-').toLowerCase().startsWith(lang.toLowerCase()));
      if (v) return v;
    }
    return null;
  }
  if (sintesis && 'onvoiceschanged' in sintesis) sintesis.addEventListener('voiceschanged', () => { vozElegida = elegirVoz(); });

  const limpiar = (t) => String(t || '').replace(/<[^>]+>/g, '').replace(/🔍/g, '').replace(/\s+/g, ' ').trim()
    // abreviaturas que la voz lee mal
    .replace(/\bp\. (\d)/g, 'página $1').replace(/\bvol\. (\d)/g, 'volumen $1').replace(/\bJ\. M\./g, 'John M')
    .replace(/\((\d{4})\)\./g, '$1,').replace(/[«»]/g, '');

  const api = {
    /** true si el navegador puede leer en voz alta. */
    disponible() { return !!(sintesis && raiz.SpeechSynthesisUtterance); },
    /** Lee un texto. Devuelve una promesa que se cumple al terminar (o al detener). */
    leer(texto, opciones) {
      if (!api.disponible()) return Promise.resolve(false);
      const op = Object.assign({ velocidad: 0.95, tono: 1 }, opciones || {});
      sintesis.cancel();
      vozElegida = vozElegida || elegirVoz();
      return new Promise((ok) => {
        const partes = limpiar(texto).split(/(?<=[.!?])\s+/).filter(Boolean); // frase por frase: algunos sistemas cortan textos largos
        partes.forEach((frase, i) => {
          const u = new SpeechSynthesisUtterance(frase);
          u.lang = vozElegida ? vozElegida.lang : 'es-AR';
          if (vozElegida) u.voice = vozElegida;
          u.rate = op.velocidad; u.pitch = op.tono;
          if (i === partes.length - 1) { u.onend = () => ok(true); u.onerror = () => ok(false); }
          sintesis.speak(u);
        });
        if (!partes.length) ok(true);
      });
    },
    /** Lee una carta en el mismo orden en que se ve: tipo, título, dato, en el juego, fuente. */
    leerCarta(c) {
      return api.leer([
        'Saber. ' + limpiar(c.tipo) + '.',
        limpiar(c.titulo) + '.',
        'Dato: ' + limpiar(c.dato),
        'En el juego: ' + limpiar(c.juego),
        'Fuente: ' + limpiar(c.fuente),
      ].join(' '));
    },
    detener() { if (sintesis) sintesis.cancel(); },
    get hablando() { return !!(sintesis && sintesis.speaking); },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_VOZ = api;
})(typeof window !== 'undefined' ? window : globalThis);
