/*
 * Tierra de los Humos · Luz real de Ushuaia
 * -----------------------------------------
 * Calcula dónde está el sol en Ushuaia para una fecha y hora, sin internet
 * (algoritmo de posición solar de la NOAA, precisión de un par de minutos),
 * y lo traduce a la hora y la estación del motor Corteza.
 *
 * Así el juego "respira" con el día real del canal Beagle: en la demo del 20/11
 * se juega con la luz que hay afuera, y en junio la noche es larga.
 *
 *   const luz = TDH_LUZ_REAL.ahora();            // o TDH_LUZ_REAL.en(new Date(...))
 *   motor.escena({ hora: luz.hora, estacion: luz.estacion });
 *   luz.texto  // "En Ushuaia ahora: de día. El sol se pone a las 21:32."
 *
 * hora:     'dia' (sol a más de 6° sobre el horizonte) · 'tarde' (entre 6° y −6°:
 *           amanecer o atardecer) · 'noche' (más de 6° bajo el horizonte).
 * estacion: hemisferio sur. Primavera (sep a nov), verano (dic a feb),
 *           otoño (mar a may), invierno (jun a ago).
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const USHUAIA = { lat: -54.8019, lon: -68.3030, zona: -3 }; // hora oficial argentina: UTC−3
  const rad = Math.PI / 180;

  function diaJuliano(fecha) { return fecha.getTime() / 86400000 + 2440587.5; }
  function posicionSolar(fecha, lat, lon) {
    const jc = (diaJuliano(fecha) - 2451545) / 36525;
    const l0 = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360;
    const m = 357.52911 + jc * (35999.05029 - 0.0001537 * jc);
    const e = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
    const c = Math.sin(m * rad) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) + Math.sin(2 * m * rad) * (0.019993 - 0.000101 * jc) + Math.sin(3 * m * rad) * 0.000289;
    const lonVerd = l0 + c;
    const omega = 125.04 - 1934.136 * jc;
    const lonAparente = lonVerd - 0.00569 - 0.00478 * Math.sin(omega * rad);
    const oblic = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(omega * rad);
    const decl = Math.asin(Math.sin(oblic * rad) * Math.sin(lonAparente * rad)) / rad;
    const y = Math.tan(oblic / 2 * rad) ** 2;
    const ecTiempo = 4 / rad * (y * Math.sin(2 * l0 * rad) - 2 * e * Math.sin(m * rad) + 4 * e * y * Math.sin(m * rad) * Math.cos(2 * l0 * rad) - 0.5 * y * y * Math.sin(4 * l0 * rad) - 1.25 * e * e * Math.sin(2 * m * rad));
    const minutosUTC = fecha.getUTCHours() * 60 + fecha.getUTCMinutes() + fecha.getUTCSeconds() / 60;
    const tiempoSolar = (minutosUTC + ecTiempo + 4 * lon + 1440) % 1440;
    const angHorario = tiempoSolar / 4 < 0 ? tiempoSolar / 4 + 180 : tiempoSolar / 4 - 180;
    const cenit = Math.acos(Math.sin(lat * rad) * Math.sin(decl * rad) + Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(angHorario * rad)) / rad;
    return { altura: 90 - cenit, declinacion: decl, ecTiempo };
  }
  // Salida y puesta del sol (altura −0,833°, con la refracción), en minutos desde la medianoche local
  function salidaPuesta(fecha, lugar) {
    const local = new Date(fecha.getTime() + lugar.zona * 3600000); // el día del calendario en Ushuaia
    const mediodia = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 12 - lugar.zona, 0));
    const { declinacion, ecTiempo } = posicionSolar(mediodia, lugar.lat, lugar.lon);
    const cosH = (Math.cos(90.833 * rad) - Math.sin(lugar.lat * rad) * Math.sin(declinacion * rad)) / (Math.cos(lugar.lat * rad) * Math.cos(declinacion * rad));
    if (cosH > 1) return { salida: null, puesta: null, nunca: 'sale' };
    if (cosH < -1) return { salida: null, puesta: null, nunca: 'se pone' };
    const H = Math.acos(cosH) / rad;
    const mediodiaSolar = 720 - 4 * lugar.lon - ecTiempo + lugar.zona * 60;
    return { salida: mediodiaSolar - 4 * H, puesta: mediodiaSolar + 4 * H };
  }
  const hhmm = (min) => { if (min == null) return '—'; const m = Math.round(((min % 1440) + 1440) % 1440); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  function estacionDe(fecha, lugar) {
    const mes = new Date(fecha.getTime() + lugar.zona * 3600000).getUTCMonth(); // 0 = enero, en hora local
    if (mes === 11 || mes <= 1) return 'verano';
    if (mes <= 4) return 'otono';
    if (mes <= 7) return 'invierno';
    return 'primavera';
  }

  function en(fecha, lugar) {
    lugar = lugar || USHUAIA; fecha = fecha || new Date();
    const { altura } = posicionSolar(fecha, lugar.lat, lugar.lon);
    const hora = altura > 6 ? 'dia' : altura > -6 ? 'tarde' : 'noche';
    const sp = salidaPuesta(fecha, lugar);
    const estacion = estacionDe(fecha, lugar);
    const nombreHora = { dia: 'de día', tarde: altura > 0 || new Date(fecha.getTime() + lugar.zona * 3600000).getUTCHours() < 12 ? 'amanece o atardece' : 'atardece', noche: 'de noche' }[hora];
    const local = new Date(fecha.getTime() + lugar.zona * 3600000), minutosLocal = local.getUTCHours() * 60 + local.getUTCMinutes();
    const momento = hora === 'tarde' ? (minutosLocal < 720 ? 'amanece' : 'atardece') : nombreHora;
    const proximo = minutosLocal < sp.salida ? 'El sol sale a las ' + hhmm(sp.salida) + '.' : minutosLocal < sp.puesta ? 'El sol se pone a las ' + hhmm(sp.puesta) + '.' : 'Mañana el sol sale cerca de las ' + hhmm(sp.salida) + '.';
    return {
      hora, estacion, altura: Math.round(altura * 10) / 10,
      salida: hhmm(sp.salida), puesta: hhmm(sp.puesta),
      horasDeLuz: sp.salida != null ? Math.round((sp.puesta - sp.salida) / 6) / 10 : null,
      texto: 'En Ushuaia ahora: ' + momento + '. ' + proximo,
    };
  }
  const api = { en, ahora: () => en(new Date()), USHUAIA };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_LUZ_REAL = api;
})(typeof window !== 'undefined' ? window : globalThis);
