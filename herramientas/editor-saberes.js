/*
 * Tierra de los Humos · Editor de saberes (la lógica, sin pantalla)
 * -----------------------------------------------------------------
 * Arma una carta de saber con el mismo formato de datos/saberes.js, la revisa
 * con las mismas reglas que pruebas/datos.test.cjs y escribe el texto listo
 * para pegar en datos/saberes.js. La pantalla está en editor-de-saberes.html.
 *
 *   const carta  = TDH_EDITOR.armar(formulario);
 *   const avisos = TDH_EDITOR.revisar(carta, formulario, TDH_SABERES.SABERES);
 *   const texto  = TDH_EDITOR.codigo(carta, formulario);
 *
 * Las ilustraciones solo usan escenas y objetos que ya están revisados contra
 * las fuentes en docs/05-rigor-historico.md. No se puede dibujar otra cosa.
 * Licencia: MIT.
 */
(function (raiz) {
  'use strict';

  // ── Escenas para la ilustración (letras del mapa de Corteza) ─────────────
  // playa / agua: en qué fila van los objetos de tierra y los de agua.
  const ESCENAS = {
    playa: { nombre: 'Playa con bosque', mapa: ['GGLGGLGG', '........', ',,,,,,,,'], playa: 1, agua: 2, alt: 'Una playa con bosque detrás y agua baja adelante' },
    canoa: { nombre: 'La canoa en una bahía', mapa: ['GGLGGLGG', '..,,,,..', ',,,--,,,'], playa: 0, agua: 2, canoa: { x: 3, y: 2, fuego: 4 }, alt: 'Una canoa de corteza con el fuego encendido en el medio navega por una bahía, frente a una playa con bosque. Van dos personas en silueta: una con el arpón y otra con el remo' },
    campamento: { nombre: 'Campamento en la playa', mapa: ['LLGGLLGL', 'Gp..p.GG', '........', ',,,,,,,,'], playa: 2, agua: 3, objetos: [{ id: 'choza', x: 3, y: 1 }], alt: 'Una choza de domo en la playa, con el bosque detrás' },
    cachiyuyo: { nombre: 'Agua baja con cachiyuyo', mapa: ['GGLLGGGG', '........', ',,k,k,,,'], playa: 1, agua: 2, alt: 'Agua baja con cachiyuyo frente a una playa con bosque' },
    canal: { nombre: 'El canal abierto', mapa: ['GGLGGGLG', ',,,,,,,,', '--------', '~~~~~~~~'], playa: 0, agua: 2, alt: 'El canal abierto, con la costa y el bosque al fondo' },
  };

  // ── Objetos que se pueden sumar (todos auditados en docs/05) ─────────────
  const OBJETOS = {
    '': { nombre: 'Ninguno' },
    mejillones: { nombre: 'Mejillones', donde: 'playa', alt: 'mejillones' },
    pescado: { nombre: 'Pescado', donde: 'agua', alt: 'un pescado' },
    hongos: { nombre: 'Hongos de árbol', donde: 'playa', alt: 'hongos de árbol' },
    erizos: { nombre: 'Erizos', donde: 'playa', alt: 'erizos' },
    huevos: { nombre: 'Huevos', donde: 'playa', alt: 'huevos' },
    pirita: { nombre: 'Pirita y pedernal', donde: 'playa', alt: 'una piedra de pirita con su pedernal' },
    lena: { nombre: 'Leña', donde: 'playa', alt: 'leña' },
    conchal: { nombre: 'Conchal', donde: 'playa', alt: 'un conchal, un montículo de valvas' },
    'choza-conica': { nombre: 'Choza cónica', donde: 'playa', alt: 'una choza cónica' },
    'guindo-grande': { nombre: 'Guindo grande', donde: 'playa', alt: 'un guindo grande, de buena corteza' },
    'ballena-varada': { nombre: 'Ballena varada', donde: 'playa', alt: 'una ballena varada en la playa' },
    'lobo-marino': { nombre: 'Lobo marino', donde: 'playa', alt: 'un lobo marino' },
    cormoran: { nombre: 'Cormorán', donde: 'playa', alt: 'un cormorán' },
    'pato-vapor': { nombre: 'Pato vapor', donde: 'agua', alt: 'un pato vapor' },
    cauquen: { nombre: 'Cauquén', donde: 'playa', alt: 'un cauquén' },
    gaviota: { nombre: 'Gaviota', donde: 'playa', alt: 'una gaviota' },
  };
  const ESTACIONES = { verano: 'Verano', otono: 'Otoño', invierno: 'Invierno', primavera: 'Primavera' };
  const HORAS = { dia: 'Día', tarde: 'Atardecer', noche: 'Noche' };
  const TIPOS = ['Fuego', 'Canoa', 'Alimento', 'Refugio', 'Encuentro', 'Herramienta', 'Territorio'];
  const PUEBLOS = { yagan: 'Yagán' };

  // ── Fuentes ──────────────────────────────────────────────────────────────
  // cooper usa la constante COOPER de datos/saberes.js, igual que las cartas que ya existen.
  const COOPER = 'Cooper, J. M. (1946). «The Yahgan». <i>Handbook of South American Indians</i>, vol. 1. Smithsonian Institution';
  const FUENTES = {
    cooper: 'Cooper (1946), «The Yahgan»',
    libro: 'Otro libro, artículo o documento',
    oral: 'Lo contó una persona de la comunidad',
  };

  const limpio = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
  const html = (v) => limpio(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /** De «Pescar sin anzuelo» a «pescar-sin-anzuelo»: minúsculas, sin tildes ni espacios. */
  function idDe(titulo) {
    return limpio(titulo).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 4).join('-');
  }

  /** La fuente como texto (con <i> para el título de la obra), y si es de memoria, con 🔍. */
  function fuenteDe(f) {
    // Todo lo que escribe la persona se escapa: la fuente se muestra como HTML en el juego (por la <i> de la obra).
    const pag = limpio(f.pagina) ? ', p. ' + html(limpio(f.pagina).replace(/^p\.?\s*/i, '')) : '';
    let texto;
    if (f.tipoFuente === 'cooper') texto = COOPER + pag + '.';
    else if (f.tipoFuente === 'oral') {
      // Sin permiso, la persona figura solo por su rol (AGENTS.md: privacidad).
      const quien = f.permisoNombre && limpio(f.nombrePersona) ? html(f.nombrePersona) + ', ' + (html(f.rolPersona) || 'integrante de la comunidad') : (html(f.rolPersona) || 'Integrante de la comunidad');
      texto = 'Relato de ' + quien + (limpio(f.comunidad) ? ', ' + html(f.comunidad) : '') + (limpio(f.fecha) ? ', ' + html(f.fecha) : '') + '. Publicado con su permiso.';
      texto = texto.charAt(0).toUpperCase() + texto.slice(1);
    } else {
      const partes = [];
      if (limpio(f.autor)) partes.push(html(f.autor) + (limpio(f.anio) ? ' (' + html(f.anio) + ')' : ''));
      if (limpio(f.obra)) partes.push('<i>' + html(f.obra) + '</i>');
      if (limpio(f.editorial)) partes.push(html(f.editorial));
      texto = partes.join('. ') + pag + '.';
    }
    if (f.deMemoria) texto += ' 🔍 de memoria, falta verificar.';
    return texto;
  }

  /** Arma la carta (el mismo formato que datos/saberes.js) a partir del formulario. */
  function armar(f) {
    // Al corregir una carta, «original» conserva su ilustración tal cual.
    if (f.escena === 'original' && f.mapaOriginal) return Object.assign(armar(Object.assign({}, f, { escena: 'playa', objeto: '' })), { mapa: f.mapaOriginal.slice(), extra: Object.assign(JSON.parse(JSON.stringify(f.extraOriginal || {})), f.hora && f.hora !== 'dia' ? { hora: f.hora } : {}, f.estacion && f.estacion !== 'verano' ? { estacion: f.estacion } : {}) });
    const esc = ESCENAS[f.escena] || ESCENAS.playa;
    const obj = OBJETOS[f.objeto || ''] || OBJETOS[''];
    const extra = {};
    const objetos = (esc.objetos || []).map((o) => Object.assign({}, o));
    if (f.objeto && obj.donde) objetos.push({ id: f.objeto, x: f.objeto === 'ballena-varada' ? 4 : 5, y: obj.donde === 'agua' ? esc.agua : esc.playa });
    if (objetos.length) extra.objetos = objetos;
    if (esc.canoa) extra.canoa = Object.assign({}, esc.canoa);
    if (f.estacion && f.estacion !== 'verano') extra.estacion = f.estacion;
    if (f.hora && f.hora !== 'dia') extra.hora = f.hora;
    const id = limpio(f.id) || idDe(f.titulo);
    return {
      id, pueblo: f.pueblo || 'yagan', estado: 'borrador',
      tipo: html(f.tipo) || 'Territorio',
      titulo: html(f.titulo), dato: html(f.dato), juego: html(f.juego),
      fuente: fuenteDe(f),
      alt: html(limpio(f.alt) || altSugerido(f)),
      mapa: esc.mapa.slice(), extra,
    };
  }

  /** Texto alternativo: describe solo lo que se dibuja. */
  function altSugerido(f) {
    const esc = ESCENAS[f.escena] || ESCENAS.playa, obj = OBJETOS[f.objeto || ''];
    const cuando = { tarde: ', al atardecer', noche: ', de noche' }[f.hora] || '';
    const estacion = { otono: ' Es otoño y el bosque está rojo y anaranjado.', invierno: ' Es invierno y hay nieve.', primavera: ' Es primavera y el bosque tiene hojas nuevas.' }[f.estacion] || '';
    return esc.alt + (obj && obj.alt ? '. En ' + (obj.donde === 'agua' ? 'el agua' : 'la orilla') + ' hay ' + obj.alt : '') + cuando + '.' + estacion;
  }

  // ── Revisión: las mismas reglas que pruebas/datos.test.cjs, y algunas más ──
  const PROHIBIDAS = /\b(extinguid|extint|desaparecid)[oa]s?\b/i;
  function revisar(carta, f, existentes) {
    const avisos = [];
    const error = (texto) => avisos.push({ nivel: 'error', texto });
    const aviso = (texto) => avisos.push({ nivel: 'aviso', texto });
    const editando = f && f.editando;
    if (!carta.titulo) error('Falta el título.');
    if (!carta.dato) error('Falta el dato: lo que dice la fuente.');
    if (!carta.juego) error('Falta «En el juego»: qué hace este saber en el juego.');
    if (!/^[a-z0-9-]+$/.test(carta.id)) error('El identificador va en minúsculas, sin tildes ni espacios (por ejemplo, «pescar-sin-anzuelo»).');
    if (existentes && existentes[carta.id] && editando !== carta.id) error('Ya hay una carta con el identificador «' + carta.id + '». Cambiá el título o el identificador, o elegí esa carta arriba para corregirla.');
    if (f.tipoFuente === 'cooper' && !limpio(f.pagina)) error('Falta la página de Cooper (1946).');
    if (f.tipoFuente === 'libro' && (!limpio(f.autor) || !limpio(f.obra))) error('Falta el autor o el título de la obra.');
    if (f.tipoFuente === 'libro' && !limpio(f.pagina)) aviso('Si se puede, sumá la página.');
    if (f.tipoFuente === 'oral' && !f.permisoPublicar) error('Para publicar un relato hace falta el permiso de quien lo contó.');
    if (f.tipoFuente === 'oral' && !f.permisoNombre) aviso('La persona va a figurar solo por su rol, sin su nombre.');
    for (const [campo, valor] of Object.entries({ título: carta.titulo, dato: carta.dato, 'en el juego': carta.juego, fuente: carta.fuente })) {
      const m = String(valor).match(PROHIBIDAS);
      if (m) error('En «' + campo + '» dice «' + m[0] + '». Los pueblos se nombran en presente: hay comunidades vivas.');
    }
    if (carta.titulo.length > 60) aviso('El título es largo: conviene que entre en una línea (menos de 60 letras).');
    if (carta.dato.length > 320) aviso('El dato es largo para una carta (más de 320 letras). Se puede partir en dos cartas.');
    if (f.deMemoria) aviso('Está marcado como de memoria: la carta lleva 🔍 hasta verificarlo.');
    return avisos;
  }

  // ── El texto para pegar en datos/saberes.js ────────────────────────────
  const js = (v) => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ') + "'";
  function codigoObjeto(o) {
    if (Array.isArray(o)) return '[' + o.map(codigoObjeto).join(', ') + ']';
    if (o && typeof o === 'object') return '{ ' + Object.entries(o).map(([k, v]) => (/^[a-z]+$/i.test(k) ? k : js(k)) + ': ' + codigoObjeto(v)).join(', ') + ' }';
    return typeof o === 'string' ? js(o) : String(o);
  }
  function codigo(carta, f) {
    // Las fuentes de Cooper se escriben con la constante COOPER, como las cartas que ya existen.
    const fuente = f && f.tipoFuente === 'cooper' && carta.fuente.indexOf(COOPER) === 0 ? 'COOPER + ' + js(carta.fuente.slice(COOPER.length)) : js(carta.fuente);
    const id = /^[a-z][a-z0-9]*$/.test(carta.id) ? carta.id : js(carta.id);
    return [
      '    ' + id + ': {',
      '      id: ' + js(carta.id) + ', pueblo: ' + js(carta.pueblo) + ', estado: ' + js(carta.estado) + ',',
      '      tipo: ' + js(carta.tipo) + ', titulo: ' + js(carta.titulo) + ',',
      '      dato: ' + js(carta.dato) + ',',
      '      juego: ' + js(carta.juego) + ',',
      '      fuente: ' + fuente + ',',
      '      alt: ' + js(carta.alt) + ',',
      '      mapa: ' + codigoObjeto(carta.mapa) + ', extra: ' + codigoObjeto(carta.extra) + ',',
      '    },',
    ].join('\n');
  }

  /** Para corregir una carta que ya existe: lleva sus datos al formulario. */
  function desdeCarta(c) {
    const f = { editando: c.id, id: c.id, pueblo: c.pueblo, tipo: c.tipo, titulo: c.titulo, dato: c.dato, juego: c.juego, alt: c.alt, objeto: '', escena: 'original', estacion: (c.extra && c.extra.estacion) || 'verano', hora: (c.extra && c.extra.hora) || 'dia' };
    if (c.fuente.indexOf(COOPER) === 0) {
      f.tipoFuente = 'cooper';
      f.pagina = c.fuente.slice(COOPER.length).replace(/^,\s*p\.\s*/, '').replace(/\.\s*$/, '');
    } else { f.tipoFuente = 'libro'; f.obra = c.fuente.replace(/<[^>]+>/g, ''); }
    f.mapaOriginal = c.mapa; f.extraOriginal = c.extra;
    return f;
  }

  const api = { ESCENAS, OBJETOS, ESTACIONES, HORAS, TIPOS, PUEBLOS, FUENTES, COOPER, idDe, fuenteDe, armar, altSugerido, revisar, codigo, desdeCarta };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.TDH_EDITOR = api;
})(typeof window !== 'undefined' ? window : globalThis);
