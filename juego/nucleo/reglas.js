/*
 * Tierra de los Humos · Reglas del viaje (los números)
 * ----------------------------------------------------
 * TODOS los números del juego están acá, para ajustar el balance sin tocar la
 * lógica de juego/nucleo/partida.js. Son recursos de juego, no datos: se
 * ajustan jugando. Arrancan iguales a los de la versión de mesa (mesa/reglas.html)
 * para que las dos versiones se jueguen igual.
 *
 * El fuego se lleva como «energía» de 0 a ENERGIA_MAX. Lo que se ve es el
 * fuego de 0 a 4: Math.ceil(energia / ENERGIA_POR_FUEGO).
 *
 * Sin DOM: anda en el navegador (global TDH_REGLAS) y en Node (require).
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';

  const REGLAS = {
    // ── El fuego ──────────────────────────────────────────────────────────
    ENERGIA_MAX: 16,
    ENERGIA_POR_FUEGO: 4,         // 16 de energía = fuego 4 de 4
    ENERGIA_INICIAL: 12,          // como en la mesa: la brasa empieza en 12…
    ENERGIA_POR_HEREDADO: 1,      // …más 1 por cada saber heredado, hasta ENERGIA_MAX

    // Gasto por cada casilla remada
    GASTO_REMAR: 1,
    GASTO_VIENTO_HONDO: 1,        // extra con viento en el canal hondo (~)
    GASTO_LLUVIA: 1,              // extra con lluvia
    GASTO_NOCHE: 1,               // extra de noche: el frío
    // Lo que ahorra estar cerca de una choza está en su elemento (territorio/elementos.js, `cerca`).

    // ── Recursos ──────────────────────────────────────────────────────────
    // Cuánto suma cada cosa que se junta está en su elemento (territorio/elementos.js, `efecto`).
    RECURSOS_INICIALES: { lena: 1, comida: 0, pirita: 0 },
    RECURSOS_MAX: { lena: 5, comida: 5, pirita: 1 },   // con el máximo, lo que se junta queda en el mapa
    AVIVAR: 6,                    // energía que suma una leña (en la mesa, 5; el mapa es el doble de ancho que el tablero)
    COMER_AL_ACAMPAR: 3,          // energía que suma comer al pasar la noche
    PIRITA_REENCIENDE: 4,         // energía con la que vuelve el fuego (fuego 1)

    // ── El día ────────────────────────────────────────────────────────────
    // Pasos remados desde que amanece hasta que cae la tarde y la noche.
    // En invierno los días son más cortos.
    HORA: {
      normal: { tarde: 12, noche: 18 },
      invierno: { tarde: 8, noche: 12 },
    },

    // ── El clima ──────────────────────────────────────────────────────────
    CLIMA_MIN_PASOS: 4,           // un clima dura al menos estos pasos
    CLIMA_PROB_CAMBIO: 0.12,      // después, en cada paso puede cambiar con esta chance
    CLIMA_SIGUIENTE: {            // a qué clima pasa, con su peso
      calma: { viento: 3, lluvia: 2 },
      viento: { calma: 3, lluvia: 1 },
      lluvia: { calma: 3, viento: 1 },
    },

    // ── Lo que se ve ──────────────────────────────────────────────────────
    REVELAR_RX: 1.7 * 3.4,        // el humo se abre en una elipse alrededor de la canoa
    REVELAR_RY: 1.4 * 3.4,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = REGLAS;
  else raiz.TDH_REGLAS = REGLAS;
})(typeof window !== 'undefined' ? window : globalThis);
