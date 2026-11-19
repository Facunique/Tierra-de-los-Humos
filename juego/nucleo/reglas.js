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
    // 19/11: el fuego ×1,5 (máximo 16 → 24, leña 6 → 9). Había que avivarlo cada pocas remadas y cansaba.
    // El inicial queda en 18 (no 21): el saber del fuego heredado suma 3 y lo lleva a 21.
    ENERGIA_MAX: 24,
    ENERGIA_POR_FUEGO: 6,         // 24 de energía = fuego 4 de 4
    ENERGIA_INICIAL: 18,          // fuego 3 de 4 al salir; heredar el saber del fuego lo sube a 4
    ENERGIA_POR_HEREDADO: 0,      // lo heredado ya no suma fuego parejo: cada saber deja algo propio (HERENCIA)

    // Gasto por cada casilla remada
    GASTO_REMAR: 1,
    GASTO_VIENTO_HONDO: 1,        // extra con viento en el canal hondo (~)
    GASTO_LLUVIA: 1,              // extra con lluvia
    GASTO_NOCHE: 1,               // extra de noche: el frío
    GASTO_TOPE: 2,                // una remada nunca gasta más que esto, aunque se sumen noche, lluvia y viento (19/11)
    // Lo que ahorra estar cerca de una choza está en su elemento (territorio/elementos.js, `cerca`).

    // ── Brasas (19/11) ────────────────────────────────────────────────────
    // Cuando el fuego llega a 0 y no hay pirita, quedan brasas: unas remadas para avivarlo con leña
    // (o acampar con comida). Si se acaban, termina el viaje. Perder ya no es de golpe.
    BRASAS_PASOS: 3,

    // ── Recursos ──────────────────────────────────────────────────────────
    // Cuánto suma cada cosa que se junta está en su elemento (territorio/elementos.js, `efecto`).
    RECURSOS_INICIALES: { lena: 2, comida: 0, pirita: 0 },   // 2 leñas (antes 1): da tiempo de llegar a juntar (18/11)
    RECURSOS_MAX: { lena: 5, comida: 5, pirita: 1 },   // con el máximo, lo que se junta queda en el mapa
    AVIVAR: 9,                    // energía que suma una leña: unas 9 remadas de día, 4 o 5 de noche
    COMER_AL_ACAMPAR: 4,          // energía que suma comer al pasar la noche
    GASTO_ACAMPAR: 3,             // energía que gasta cuidar el fuego toda la noche: acampar no es gratis
                                  // (con comida queda en +1; sin comida, cada noche lo baja)
    PIRITA_REENCIENDE: 6,         // energía con la que vuelve el fuego (fuego 1)

    // ── Minijuego perfecto (19/11) ────────────────────────────────────────
    // Si el minijuego sale perfecto (sin errar y rápido), la interfaz manda la acción con `bien: true`.
    BIEN_JUNTAR: 1,               // juntar: una unidad más de lo mismo (hasta el máximo)
    BIEN_AVIVAR: 3,               // avivar: la leña rinde más
    BIEN_AMARRAR: 2,              // amarrar: la noche gasta menos

    // ── Las tres marcas del viaje (19/11) ─────────────────────────────────
    MARCA_COMIDA: 3,              // «para compartir»: llegar con 3 de comida o más
    MARCA_TIEMPO: 1.6,            // «a tiempo»: llegar en no más de 1,6 veces el camino más corto

    // ── Lo que deja cada saber heredado (19/11) ───────────────────────────
    // Recurso de juego, no dato: lo dice el texto «En el juego» de cada carta (datos/saberes.js).
    //   energia: suma al salir · ver: lo que se ve a través del humo desde el principio
    //   comida: comida al salir · pirita: energía con la que reenciende · cerca: ahorro junto a la choza
    //   viento: el viento del canal hondo no gasta de más · destino: se ve el destino desde el principio
    HERENCIA: {
      fuego: { energia: 3 },
      amarre: { ver: 'amarre' },
      mejillones: { ver: 'mejillones' },
      pescado: { ver: 'pescado' },
      hongos: { comida: 1 },
      pirita: { pirita: 12 },
      choza: { cerca: 2 },
      corteza: { viento: true },
      ballena: { destino: true },
    },

    // ── El día ────────────────────────────────────────────────────────────
    // Pasos remados desde que amanece hasta que cae la tarde, la noche y vuelve a amanecer.
    // En invierno los días son más cortos y las noches, más largas. Acampar hace amanecer enseguida;
    // sin acampar, la noche dura hasta `amanece` (18/11: antes duraba hasta acampar, y empezar de
    // noche con la luz real apagaba el fuego en unas 6 casillas).
    HORA: {
      normal: { tarde: 12, noche: 18, amanece: 22 },
      invierno: { tarde: 8, noche: 12, amanece: 18 },
    },

    // ── El clima ──────────────────────────────────────────────────────────
    CLIMA_MIN_PASOS: 4,           // un clima dura al menos estos pasos
    CLIMA_PROB_CAMBIO: 0.12,      // después, en cada paso puede cambiar con esta chance
    CLIMA_AVISO_PASOS: 1,         // el cambio se anuncia estos pasos antes («se ven nubes»); 0 = sin aviso
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
