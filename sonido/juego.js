/*
 * Tierra de los Humos · El sonido conectado a la partida
 * ------------------------------------------------------
 * Traduce lo que pasa en el juego a sonido, con su subtítulo. Lee el contrato
 * del núcleo (juego/nucleo/partida.js y la partida falsa de pruebas/):
 *
 *   partida.estado          → el ambiente: viento, lluvia, fuego y el lugar
 *                             (bosque, playa o canal abierto, con TDH_SONIDO.lugarDe)
 *   partida.hacer(accion)   → una lista de eventos: cada uno suena una vez
 *
 * Uso en la interfaz:
 *
 *   const sonido = TDH_SONIDO.crear();
 *   const oido = TDH_SONIDO_JUEGO.conectar(sonido, { saberes: TDH_SABERES.SABERES });
 *   botonSonido.onclick = () => sonido.iniciar().then(() => oido.estado(partida.estado));
 *   const eventos = partida.hacer(accion);
 *   oido.eventos(eventos);          // suenan los efectos, con subtítulo
 *   oido.estado(partida.estado);    // el ambiente se acomoda al lugar y al clima
 *   oido.generacion();              // al empezar la generación siguiente
 *   sonido.alSonar((texto) => mostrarSubtitulo(texto));
 *
 * Las funciones ambienteDe y efectosDe no tocan el audio: se prueban con Node
 * (pruebas/sonido-juego.test.cjs).
 *
 * Qué NO suena: música ni voces inventadas (ver sonido/README.md).
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';
  const SONIDO = raiz.TDH_SONIDO || (typeof require === 'function' ? require('./ambiente.js') : null);

  // Lo que se come: suena a valvas. El resto, a algo que se levanta.
  const COMIDA = ['comida', 'mejillones', 'pescado', 'hongos', 'erizos', 'huevos'];
  const PIEDRA = ['pirita'];
  const VIENTO = { calma: 0.15, viento: 0.85, lluvia: 0.35, nieve: 0.25 };
  const TEXTO_CLIMA = { calma: 'Vuelve la calma', viento: 'Se levanta el viento', lluvia: 'Empieza a llover', nieve: 'Empieza a nevar' };
  const TEXTO_HORA = { dia: 'Amanece', tarde: 'Cae la tarde', noche: 'Cae la noche' };
  const TEXTO_APAGADO = {
    viento: 'El viento apagó el fuego',
    lluvia: 'La lluvia apagó el fuego',
    noche: 'El frío de la noche apagó el fuego',
    remar: 'El fuego se apagó',
  };

  /** El ambiente para sonido.ambiente(), a partir de partida.estado. */
  function ambienteDe(estado) {
    const e = estado || {};
    const canoa = e.canoa || { x: 0, y: 0, fuego: 3 };
    const lugar = e.mapa && SONIDO ? SONIDO.lugarDe(e.mapa, canoa.x, canoa.y) : { bosque: 0, playa: 0, mar: 0.5 };
    const clima = e.clima || 'calma';
    return {
      viento: VIENTO[clima] != null ? VIENTO[clima] : 0.2,
      lluvia: clima === 'lluvia' ? 0.8 : 0,
      mar: Math.min(1, Math.round((lugar.mar + (clima === 'viento' ? 0.25 : 0)) * 100) / 100),
      bosque: lugar.bosque,
      playa: lugar.playa,
      fuego: Math.max(0, Math.min(4, Math.round(canoa.fuego == null ? 3 : canoa.fuego))),
    };
  }

  /**
   * Qué suena por cada evento de partida.hacer(). Devuelve [{ efecto, texto }],
   * en orden. Cada evento da como mucho un sonido; los que no suenan se saltean.
   * opciones.saberes: el catálogo de cartas (para decir el título del saber).
   */
  function efectosDe(eventos, opciones) {
    const saberes = (opciones && opciones.saberes) || {};
    const lista = [];
    const sumar = (efecto, texto) => lista.push({ efecto, texto });
    (eventos || []).forEach((ev) => {
      switch (ev.tipo) {
        case 'remo': sumar('remo', 'Remada'); break;
        case 'fuego':
          // El viento en el canal hondo se oye como una ola contra la canoa.
          if (ev.motivo === 'remar' && ev.causas && ev.causas.indexOf('viento') >= 0) sumar('ola', 'Una ola golpea la canoa');
          break;
        case 'junto': {
          const nombre = ev.nombre || ev.que;
          if (COMIDA.indexOf(ev.que) >= 0) sumar('comida', 'Juntaste ' + nombre);
          else if (PIEDRA.indexOf(ev.que) >= 0) sumar('piedra', 'Juntaste ' + nombre);
          else sumar('junto', 'Juntaste ' + nombre);
          break;
        }
        case 'avivo': sumar('lena', 'Se agrega leña al fuego'); break;
        case 'saber': {
          const carta = saberes[ev.id];
          sumar('saber', carta && carta.titulo ? 'Aprendiste un saber: ' + carta.titulo : 'Aprendiste un saber');
          break;
        }
        case 'reencendido': sumar('chispa', 'La pirita vuelve a encender el fuego'); break;
        case 'acampe': sumar('acampe', ev.comio ? 'Amarran la canoa, comen y pasan la noche' : 'Amarran la canoa y pasan la noche'); break;
        case 'clima': if (TEXTO_CLIMA[ev.clima]) sumar('clima', TEXTO_CLIMA[ev.clima]); break;
        case 'hora': if (TEXTO_HORA[ev.hora]) sumar('hora', TEXTO_HORA[ev.hora]); break;
        case 'fin':
          if (ev.gano) sumar('llegada', 'Llegaron con el fuego encendido');
          else sumar('apagado', TEXTO_APAGADO[ev.causa] || 'El fuego se apagó');
          break;
        default: break;
      }
    });
    return lista;
  }

  /** Conecta un sonido (TDH_SONIDO.crear()) a la partida. */
  function conectar(sonido, opciones) {
    const op = Object.assign({ separacion: 160 }, opciones || {});
    let cola = []; let reloj = null;
    function siguiente() {
      const e = cola.shift();
      if (!e) { reloj = null; return; }
      sonido.efecto(e.efecto, e.texto);
      reloj = setTimeout(siguiente, op.separacion);
    }
    return {
      /** Llamar después de cada acción y al empezar: acomoda el ambiente. */
      estado(estado) { const a = ambienteDe(estado); sonido.ambiente(a); return a; },
      /** Llamar con lo que devolvió partida.hacer(): suenan en orden, un poco separados. */
      eventos(eventos) {
        const lista = efectosDe(eventos, op);
        if (!sonido.activo) return lista;
        cola = cola.concat(lista);
        if (!reloj) siguiente();
        return lista;
      },
      /** Al empezar la generación siguiente. */
      generacion() { return sonido.efecto('generacion'); },
      /** Corta lo que falta sonar (por ejemplo, al salir del viaje). */
      callar() { cola = []; if (reloj) { clearTimeout(reloj); reloj = null; } },
    };
  }

  const api = { ambienteDe, efectosDe, conectar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_SONIDO_JUEGO = api;
})(typeof window !== 'undefined' ? window : globalThis);
