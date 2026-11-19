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

  /**
   * La mejor voz en castellano que tenga el dispositivo (19/11). Antes se tomaba la primera
   * del idioma, que suele ser la más robótica. Ahora suman puntos las voces «naturales» o
   * neuronales (Edge, Chrome, Android, iOS) y la variante rioplatense; pierden las de baja calidad.
   */
  function puntaje(v) {
    const lang = (v.lang || '').replace('_', '-').toLowerCase(), n = (v.name || '').toLowerCase();
    if (!lang.startsWith('es')) return -1;
    let p = 0;
    if (/natural|neural|online|premium|enhanced|mejorad|siri/.test(n)) p += 50;
    if (/google/.test(n)) p += 25;
    p += { 'es-ar': 20, 'es-uy': 18, 'es-419': 15, 'es-us': 12, 'es-mx': 10, 'es-cl': 10, 'es-es': 6 }[lang.slice(0, 6)] || 4;
    if (/compact|espeak|low/.test(n)) p -= 30;
    if (v.localService) p += 2;   // anda sin internet
    return Math.max(0, p);          // una voz en castellano, aunque sea mala, es mejor que ninguna
  }
  function elegirVoz() {
    if (!sintesis) return null;
    const voces = sintesis.getVoices().filter((v) => puntaje(v) >= 0);
    voces.sort((a, b) => puntaje(b) - puntaje(a));
    return voces[0] || null;
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
      const op = Object.assign({ velocidad: 1, tono: 1 }, opciones || {});
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
    /**
     * Lee una carta: el título y el dato (19/11). Antes leía también el tipo, «En el juego»
     * y la fuente entera, con páginas y editorial: se hacía largo y sonaba a máquina.
     * La fuente sigue escrita en la carta.
     */
    leerCarta(c) {
      return api.leer(limpiar(c.titulo) + '. ' + limpiar(c.dato));
    },
    detener() { if (sintesis) sintesis.cancel(); },
    get hablando() { return !!(sintesis && sintesis.speaking); },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.assign(api, { puntaje }); else raiz.TDH_VOZ = api;
})(typeof window !== 'undefined' ? window : globalThis);
