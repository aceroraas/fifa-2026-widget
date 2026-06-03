/**
 * fifa-world-cup.js
 * Web Component: <fifa-world-cup></fifa-world-cup>
 *
 * Uso:
 *   1) <script src="fifa-world-cup.js"></script>
 *   2) <fifa-world-cup></fifa-world-cup>
 *
 * Atributos opcionales:
 *   position="top-left" | "top-right" | "bottom-left" | "bottom-right" (default: bottom-right)
 *   theme="dark" | "light" (default: dark)
 *   api-url="https://tu-servidor/api/mundial" (opcional — si no, usa TheSportsDB gratis)
 */
(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // DATOS ESTÁTICOS DEL TORNEO — Actualizar según avance
  // ═══════════════════════════════════════════════════════════
  const TORNEO = {
    nombre: 'Copa Mundial FIFA 2026',
    sede: 'EE.UU. / México / Canadá',
    fase: 'grupos',
    grupos: {
      A: [
        { equipo: 'México', bandera: '🇲🇽', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Sudáfrica', bandera: '🇿🇦', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Corea del Sur', bandera: '🇰🇷', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Rep. Checa', bandera: '🇨🇿', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      B: [
        { equipo: 'Canadá', bandera: '🇨🇦', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Bosnia-Herzegovina', bandera: '🇧🇦', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Qatar', bandera: '🇶🇦', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Suiza', bandera: '🇨🇭', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      C: [
        { equipo: 'Brasil', bandera: '🇧🇷', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Marruecos', bandera: '🇲🇦', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Haití', bandera: '🇭🇹', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Escocia', bandera: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      D: [
        { equipo: 'EE.UU.', bandera: '🇺🇸', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Paraguay', bandera: '🇵🇾', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Australia', bandera: '🇦🇺', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Turquía', bandera: '🇹🇷', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      E: [
        { equipo: 'Alemania', bandera: '🇩🇪', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Curazao', bandera: '🇨🇼', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Costa de Marfil', bandera: '🇨🇮', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Ecuador', bandera: '🇪🇨', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      F: [
        { equipo: 'Países Bajos', bandera: '🇳🇱', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Japón', bandera: '🇯🇵', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Suecia', bandera: '🇸🇪', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Túnez', bandera: '🇹🇳', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      G: [
        { equipo: 'Bélgica', bandera: '🇧🇪', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Irán', bandera: '🇮🇷', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Egipto', bandera: '🇪🇬', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'N. Zelanda', bandera: '🇳🇿', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      H: [
        { equipo: 'España', bandera: '🇪🇸', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Uruguay', bandera: '🇺🇾', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Arabia Saudita', bandera: '🇸🇦', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Cabo Verde', bandera: '🇨🇻', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      I: [
        { equipo: 'Francia', bandera: '🇫🇷', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Senegal', bandera: '🇸🇳', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Noruega', bandera: '🇳🇴', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Irak', bandera: '🇮🇶', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      J: [
        { equipo: 'Argentina', bandera: '🇦🇷', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Austria', bandera: '🇦🇹', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Argelia', bandera: '🇩🇿', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Jordania', bandera: '🇯🇴', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      K: [
        { equipo: 'Portugal', bandera: '🇵🇹', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Colombia', bandera: '🇨🇴', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Uzbekistán', bandera: '🇺🇿', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'R.D. Congo', bandera: '🇨🇩', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ],
      L: [
        { equipo: 'Inglaterra', bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Croacia', bandera: '🇭🇷', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Panamá', bandera: '🇵🇦', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
        { equipo: 'Ghana', bandera: '🇬🇭', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
      ]
    },
    partidos: [
      { fecha: '2026-06-11', hora: '19:00', grupo: 'A', local: 'México', visitante: 'Sudáfrica', sede: 'Estadio Azteca, CDMX', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-11', hora: '22:00', grupo: 'A', local: 'Corea del Sur', visitante: 'Rep. Checa', sede: 'Rose Bowl, Los Ángeles', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-12', hora: '16:00', grupo: 'B', local: 'Canadá', visitante: 'Bosnia-Herzegovina', sede: 'BMO Field, Toronto', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-12', hora: '19:00', grupo: 'B', local: 'Qatar', visitante: 'Suiza', sede: 'BC Place, Vancouver', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-12', hora: '22:00', grupo: 'C', local: 'Brasil', visitante: 'Marruecos', sede: 'MetLife Stadium, Nueva York', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-13', hora: '13:00', grupo: 'C', local: 'Haití', visitante: 'Escocia', sede: 'Gillette Stadium, Boston', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-13', hora: '16:00', grupo: 'D', local: 'EE.UU.', visitante: 'Paraguay', sede: 'SoFi Stadium, Los Ángeles', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-13', hora: '19:00', grupo: 'D', local: 'Australia', visitante: 'Turquía', sede: 'Lumen Field, Seattle', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-13', hora: '22:00', grupo: 'E', local: 'Alemania', visitante: 'Curazao', sede: 'Levi\'s Stadium, San Francisco', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-14', hora: '13:00', grupo: 'E', local: 'Costa de Marfil', visitante: 'Ecuador', sede: 'NRG Stadium, Houston', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-14', hora: '16:00', grupo: 'F', local: 'Países Bajos', visitante: 'Japón', sede: 'Arrowhead Stadium, Kansas', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-14', hora: '19:00', grupo: 'F', local: 'Suecia', visitante: 'Túnez', sede: 'AT&T Stadium, Dallas', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-14', hora: '22:00', grupo: 'G', local: 'Bélgica', visitante: 'Irán', sede: 'Mercedes-Benz Stadium, Atlanta', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-15', hora: '13:00', grupo: 'G', local: 'Egipto', visitante: 'N. Zelanda', sede: 'Lincoln Financial Field, Filadelfia', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-15', hora: '16:00', grupo: 'H', local: 'España', visitante: 'Uruguay', sede: 'Hard Rock Stadium, Miami', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-15', hora: '19:00', grupo: 'H', local: 'Arabia Saudita', visitante: 'Cabo Verde', sede: 'MetLife Stadium, Nueva York', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-15', hora: '22:00', grupo: 'I', local: 'Francia', visitante: 'Senegal', sede: 'SoFi Stadium, Los Ángeles', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-16', hora: '13:00', grupo: 'I', local: 'Noruega', visitante: 'Irak', sede: 'BC Place, Vancouver', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-16', hora: '16:00', grupo: 'J', local: 'Argentina', visitante: 'Austria', sede: 'Estadio Azteca, CDMX', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-16', hora: '19:00', grupo: 'J', local: 'Argelia', visitante: 'Jordania', sede: 'Rose Bowl, Los Ángeles', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-16', hora: '22:00', grupo: 'K', local: 'Portugal', visitante: 'Colombia', sede: 'Levi\'s Stadium, San Francisco', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-17', hora: '13:00', grupo: 'K', local: 'Uzbekistán', visitante: 'R.D. Congo', sede: 'Arrowhead Stadium, Kansas', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-17', hora: '16:00', grupo: 'L', local: 'Inglaterra', visitante: 'Croacia', sede: 'MetLife Stadium, Nueva York', golLocal: null, golVisitante: null, estado: 'programado' },
      { fecha: '2026-06-17', hora: '19:00', grupo: 'L', local: 'Panamá', visitante: 'Ghana', sede: 'Mercedes-Benz Stadium, Atlanta', golLocal: null, golVisitante: null, estado: 'programado' }
    ],
    llave: {
      treintaidosavos: [],
      dieciseisavos: [],
      cuartos: [],
      semis: [],
      tercerPuesto: { local: 'Por definir', visitante: 'Por definir', golLocal: null, golVisitante: null, fecha: '2026-07-18' },
      final: { local: 'Por definir', visitante: 'Por definir', golLocal: null, golVisitante: null, fecha: '2026-07-19', sede: 'MetLife Stadium, Nueva York' }
    }
  };

  // ═══════════════════════════════════════════════════════════
  // MAPEO DE NOMBRES: API (inglés) → Estático (español)
  // ═══════════════════════════════════════════════════════════
  const MAPA_EQUIPOS = {
    'Mexico': 'México',
    'South Africa': 'Sudáfrica',
    'South Korea': 'Corea del Sur',
    'Korea Republic': 'Corea del Sur',
    'Czechia': 'Rep. Checa',
    'Czech Republic': 'Rep. Checa',
    'Canada': 'Canadá',
    'Bosnia and Herzegovina': 'Bosnia-Herzegovina',
    'Qatar': 'Qatar',
    'Switzerland': 'Suiza',
    'Brazil': 'Brasil',
    'Morocco': 'Marruecos',
    'Haiti': 'Haití',
    'Scotland': 'Escocia',
    'USA': 'EE.UU.',
    'United States': 'EE.UU.',
    'Paraguay': 'Paraguay',
    'Australia': 'Australia',
    'Turkey': 'Turquía',
    'Türkiye': 'Turquía',
    'Germany': 'Alemania',
    'Curacao': 'Curazao',
    'Curaçao': 'Curazao',
    'Ivory Coast': 'Costa de Marfil',
    'Côte d\'Ivoire': 'Costa de Marfil',
    'Ecuador': 'Ecuador',
    'Netherlands': 'Países Bajos',
    'Japan': 'Japón',
    'Sweden': 'Suecia',
    'Tunisia': 'Túnez',
    'Belgium': 'Bélgica',
    'Iran': 'Irán',
    'Egypt': 'Egipto',
    'New Zealand': 'N. Zelanda',
    'Spain': 'España',
    'Uruguay': 'Uruguay',
    'Saudi Arabia': 'Arabia Saudita',
    'Cape Verde': 'Cabo Verde',
    'Cabo Verde': 'Cabo Verde',
    'France': 'Francia',
    'Senegal': 'Senegal',
    'Norway': 'Noruega',
    'Iraq': 'Irak',
    'Argentina': 'Argentina',
    'Austria': 'Austria',
    'Algeria': 'Argelia',
    'Jordan': 'Jordania',
    'Portugal': 'Portugal',
    'Colombia': 'Colombia',
    'Uzbekistan': 'Uzbekistán',
    'DR Congo': 'R.D. Congo',
    'England': 'Inglaterra',
    'Croatia': 'Croacia',
    'Panama': 'Panamá',
    'Ghana': 'Ghana'
  };

  // ═══════════════════════════════════════════════════════════
  // CONFIGURACIÓN DE API
  // ═══════════════════════════════════════════════════════════
  const API_THE_SPORTS_DB = {
    base: 'https://www.thesportsdb.com/api/v1/json/123',
    leagueId: '4429' // World Cup
  };

  // ═══════════════════════════════════════════════════════════
  // ESTILOS
  // ═══════════════════════════════════════════════════════════
  const ESTILOS = `
    :host {
      display: inline-block;
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      --fwc-bg: #1a2332;
      --fwc-bg-light: rgba(26, 58, 92, 0.2);
      --fwc-accent: #4fc3f7;
      --fwc-accent-dark: #1a3a5c;
      --fwc-green: #4caf50;
      --fwc-text: #aabbcc;
      --fwc-text-dim: #556677;
      --fwc-text-bright: #ccddee;
      --fwc-border: rgba(255,255,255,0.08);
      --fwc-radius: 16px;
    }

    :host([floating]),
    :host([position]) {
      position: fixed;
      z-index: 2147483647;
    }

    :host([floating]:not([position])),
    :host([position="bottom-right"]) { bottom: 1.5rem; right: 1.5rem; }
    :host([position="top-left"]) { top: 1.5rem; left: 1.5rem; }
    :host([position="top-right"]) { top: 1.5rem; right: 1.5rem; }
    :host([position="bottom-left"]) { bottom: 1.5rem; left: 1.5rem; }

    :host([theme="light"]) {
      --fwc-bg: #ffffff;
      --fwc-bg-light: rgba(255,255,255,0.7);
      --fwc-accent: #326295;
      --fwc-accent-dark: #e8f0fe;
      --fwc-text: #333333;
      --fwc-text-dim: #888888;
      --fwc-text-bright: #1a1a1a;
      --fwc-border: rgba(0,0,0,0.1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    .widget {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      position: relative;
    }

    /* ── Tarjeta expandida ── */
    .tarjeta {
      position: absolute;
      width: 380px;
      max-height: 80vh;
      background: var(--fwc-bg);
      border: 1px solid var(--fwc-border);
      border-radius: var(--fwc-radius);
      box-shadow: 0 16px 50px rgba(0,0,0,0.5);
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      display: flex;
      flex-direction: column;
      z-index: 10;
    }
    /* Abrir hacia ABAJO (default) */
    .tarjeta.hacia-abajo {
      top: calc(100% + 0.5rem);
      right: 0;
      transform: translateY(-10px) scale(0.95);
    }
    .tarjeta.hacia-abajo.visible { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
    /* Abrir hacia ARRIBA */
    .tarjeta.hacia-arriba {
      bottom: calc(100% + 0.5rem);
      right: 0;
      transform: translateY(10px) scale(0.95);
    }
    .tarjeta.hacia-arriba.visible { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
    .live-pill {
      background: linear-gradient(135deg, #1a5c2e, #0d3318);
      border: 1px solid rgba(76,175,80,0.4);
      border-radius: 50px;
      padding: 0.5rem 1rem;
      display: none;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: live-pulse 2s ease-in-out infinite;
    }
    .live-pill.activo { display: flex; }
    .live-pill:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(76,175,80,0.3); }

    @keyframes live-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(76,175,80,0.3); }
      50% { box-shadow: 0 0 0 8px rgba(76,175,80,0); }
    }

    .live-dot {
      width: 8px; height: 8px;
      background: var(--fwc-green);
      border-radius: 50%;
      animation: blink 1s ease-in-out infinite;
    }
    @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

    .live-equipos { font-size: 0.8rem; font-weight: 600; color: #fff; }
    .live-marcador {
      font-size: 0.9rem; font-weight: 700; color: var(--fwc-green);
      background: rgba(76,175,80,0.15); padding: 0.15rem 0.5rem; border-radius: 4px;
    }
    .live-minuto { font-size: 0.65rem; color: #81c784; font-weight: 500; }

    /* ── Pill idle (cuenta regresiva) ── */
    .idle-pill {
      background: var(--fwc-bg-light);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--fwc-border);
      border-radius: 50px;
      padding: 0.55rem 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
      user-select: none;
    }
    .idle-pill:hover {
      background: rgba(26,58,92,0.45);
      border-color: rgba(255,255,255,0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(26,58,92,0.4);
    }

    .idle-pill .pelota {
      font-size: 1.2rem; display: inline-block; transition: transform 0.3s ease;
    }
    .idle-pill:hover .pelota { animation: girar 0.8s linear infinite; }
    @keyframes girar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .idle-pill .texto-cuenta {
      font-size: 0.8rem; color: rgba(255,255,255,0.7); font-weight: 500; white-space: nowrap;
    }
    .idle-pill:hover .texto-cuenta { color: #fff; }

    :host([theme="light"]) .idle-pill .texto-cuenta { color: rgba(0,0,0,0.6); }
    :host([theme="light"]) .idle-pill:hover .texto-cuenta { color: #333; }

    .cabecera {
      background: linear-gradient(135deg, #1a3a5c, #0d2137);
      padding: 0.9rem 1.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--fwc-border);
    }
    :host([theme="light"]) .cabecera { background: linear-gradient(135deg, #326295, #e8f0fe); }

    .cabecera h2 { font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }
    .cabecera .fase-badge {
      font-size: 0.65rem; background: rgba(255,255,255,0.1);
      padding: 0.15rem 0.5rem; border-radius: 20px; color: #8899aa; font-weight: 500;
    }

    .btn-cerrar {
      background: rgba(255,255,255,0.08); border: none; color: #8899aa;
      width: 26px; height: 26px; border-radius: 50%; font-size: 1rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .btn-cerrar:hover { background: rgba(255,255,255,0.15); color: #fff; }

    /* Tabs */
    .pestanas {
      display: flex; background: rgba(0,0,0,0.2);
      border-bottom: 1px solid var(--fwc-border);
      position: relative;
    }
    :host([theme="light"]) .pestanas { background: rgba(0,0,0,0.05); }

    .pestana {
      flex: 1; padding: 0.65rem 0.4rem; text-align: center;
      font-size: 0.72rem; font-weight: 500; color: var(--fwc-text-dim);
      cursor: pointer; position: relative;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      transition: color 0.2s;
    }
    .pestana:hover { color: var(--fwc-text); }
    .pestana.activa { color: var(--fwc-accent); }
    .pestana.activa::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 10%; right: 10%;
      height: 3px;
      background: var(--fwc-accent);
      border-radius: 2px 2px 0 0;
    }

    /* Contenido */
    .contenido { flex: 1; overflow-y: auto; padding: 0; min-height: 320px; }
    .contenido::-webkit-scrollbar { width: 4px; }
    .contenido::-webkit-scrollbar-track { background: transparent; }
    .contenido::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    .panel { display: none; opacity: 0; transition: opacity 0.25s ease; }
    .panel.activo { display: block; opacity: 1; }

    /* ── Panel: Próximo Partido ── */
    .panel-proximo { padding: 1.2rem; }

    .cuenta-grande { text-align: center; margin-bottom: 1rem; }
    .cuenta-grande .dias-grandes { font-size: 2.2rem; font-weight: 700; color: var(--fwc-accent); }
    .cuenta-grande .sub { font-size: 0.7rem; color: var(--fwc-text-dim); text-transform: uppercase; letter-spacing: 0.08em; }

    .enfrentamiento {
      display: flex; align-items: center; justify-content: center;
      gap: 1rem; padding: 1rem 0; margin-bottom: 1rem;
    }
    .escudo {
      width: 52px; height: 52px; border-radius: 50%;
      background: rgba(255,255,255,0.05); display: flex;
      align-items: center; justify-content: center;
      font-size: 1.5rem; border: 2px solid var(--fwc-border);
    }
    .vs { font-size: 0.85rem; font-weight: 700; color: var(--fwc-accent); }

    .meta-partido { display: flex; flex-direction: column; gap: 0.4rem; }
    .meta-fila {
      display: flex; justify-content: space-between; font-size: 0.75rem;
      padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .meta-fila .etiqueta { color: var(--fwc-text-dim); }
    .meta-fila .valor { color: var(--fwc-text); font-weight: 500; }

    /* ── Badge EN VIVO ── */
    .badge-en-vivo {
      display: flex; align-items: center; justify-content: center;
      gap: 0.5rem; padding: 0.5rem 1rem; margin-bottom: 0.8rem;
      background: linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.05));
      border: 1px solid rgba(76,175,80,0.3); border-radius: 50px;
      animation: live-pulse 2s ease-in-out infinite;
    }
    .badge-en-vivo .live-dot {
      width: 8px; height: 8px; background: var(--fwc-green);
      border-radius: 50%; animation: blink 1s ease-in-out infinite;
    }
    .badge-en-vivo .badge-texto {
      font-size: 0.7rem; font-weight: 700; color: var(--fwc-green);
      letter-spacing: 0.1em;
    }
    .badge-en-vivo .badge-minuto {
      font-size: 0.75rem; font-weight: 600; color: #81c784;
    }

    /* ── Marcador en vivo ── */
    .marcador-en-vivo {
      display: flex; align-items: center; justify-content: center;
      gap: 0.8rem; padding: 0.8rem 0; margin-bottom: 0.8rem;
      background: rgba(76,175,80,0.05); border-radius: 12px;
      border: 1px solid rgba(76,175,80,0.1);
    }
    .marcador-equipo {
      font-size: 0.85rem; font-weight: 600; color: var(--fwc-text-bright);
      max-width: 120px; text-align: center;
    }
    .marcador-goles {
      font-size: 1.5rem; font-weight: 700; color: var(--fwc-green);
      background: rgba(76,175,80,0.1); padding: 0.2rem 0.8rem;
      border-radius: 8px; letter-spacing: 0.1em;
    }

    /* ── Eventos del partido (goles, tarjetas) ── */
    .eventos-partido { padding: 0.5rem 0; margin-bottom: 0.8rem; }
    .evento-fila {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.35rem 0.5rem; font-size: 0.72rem;
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .evento-fila .evento-minuto {
      color: var(--fwc-text-dim); font-weight: 500; min-width: 35px;
    }
    .evento-fila .evento-icono { font-size: 0.9rem; }
    .evento-fila .evento-texto { color: var(--fwc-text); flex: 1; }
    .evento-fila .evento-equipo {
      color: var(--fwc-text-dim); font-size: 0.65rem;
      background: rgba(255,255,255,0.05); padding: 0.1rem 0.4rem;
      border-radius: 3px;
    }

    /* ── Panel: Posiciones ── */
    .panel-posiciones { padding: 0.8rem; }

    .selector-grupo {
      display: flex; gap: 0.3rem; padding: 0 0.4rem;
      margin-bottom: 0.6rem; overflow-x: auto;
    }
    .selector-grupo::-webkit-scrollbar { height: 3px; }
    .selector-grupo::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    .btn-grupo {
      padding: 0.3rem 0.6rem; font-size: 0.68rem; font-weight: 600;
      background: rgba(255,255,255,0.05); border: 1px solid var(--fwc-border);
      border-radius: 6px; color: var(--fwc-text-dim); cursor: pointer;
      white-space: nowrap; transition: all 0.2s;
    }
    .btn-grupo:hover { background: rgba(255,255,255,0.1); }
    .btn-grupo.activo {
      background: rgba(79,195,247,0.15); border-color: rgba(79,195,247,0.3); color: var(--fwc-accent);
    }

    .tabla-posiciones { width: 100%; font-size: 0.72rem; }
    .tabla-posiciones thead th {
      padding: 0.4rem 0.3rem; color: var(--fwc-text-dim); font-weight: 500;
      text-align: center; border-bottom: 1px solid var(--fwc-border);
    }
    .tabla-posiciones thead th:first-child,
    .tabla-posiciones thead th:nth-child(2) { text-align: left; }

    .tabla-posiciones tbody td {
      padding: 0.45rem 0.3rem; text-align: center; color: var(--fwc-text);
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .tabla-posiciones tbody td:first-child { text-align: center; font-weight: 600; color: var(--fwc-text-dim); width: 20px; }
    .tabla-posiciones tbody td:nth-child(2) { text-align: left; font-weight: 500; color: var(--fwc-text-bright); }
    .tabla-posiciones tbody tr:nth-child(1) td:first-child,
    .tabla-posiciones tbody tr:nth-child(2) td:first-child { color: var(--fwc-green); }
    .tabla-posiciones .pts { font-weight: 700; color: var(--fwc-accent); }

    /* ── Panel: Calendario ── */
    .panel-calendario { padding: 0.8rem; }
    .fecha-calendario {
      font-size: 0.7rem; font-weight: 600; color: var(--fwc-accent);
      padding: 0.5rem 0.4rem 0.3rem; border-bottom: 1px solid rgba(79,195,247,0.15);
      margin-bottom: 0.3rem;
    }
    .fila-calendario {
      display: flex; align-items: center; padding: 0.45rem 0.4rem;
      border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.75rem; gap: 0.5rem;
    }
    .fila-calendario .hora { color: var(--fwc-text-dim); font-weight: 500; min-width: 45px; }
    .fila-calendario .equipos { flex: 1; color: var(--fwc-text); }
    .fila-calendario .marcador { color: var(--fwc-accent); font-weight: 600; }
    .fila-calendario .etiqueta-grupo {
      font-size: 0.6rem; color: var(--fwc-text-dim);
      background: rgba(255,255,255,0.05); padding: 0.1rem 0.4rem; border-radius: 3px;
    }

    /* ── Panel: Eliminatorias ── */
    .panel-eliminatorias { padding: 1rem; }
    .ronda-llave { margin-bottom: 1rem; }
    .titulo-ronda {
      font-size: 0.7rem; font-weight: 600; color: var(--fwc-accent);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 0.5rem; padding-bottom: 0.3rem;
      border-bottom: 1px solid rgba(79,195,247,0.2);
    }
    .partido-llave {
      background: rgba(255,255,255,0.03); border: 1px solid var(--fwc-border);
      border-radius: 8px; padding: 0.5rem 0.7rem; margin-bottom: 0.4rem;
      display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;
    }
    .partido-llave .equipos-llave { display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
    .partido-llave .fila-equipo { display: flex; justify-content: space-between; align-items: center; }
    .partido-llave .nombre-equipo { color: var(--fwc-text); }
    .partido-llave .nombre-equipo.ganador { color: var(--fwc-accent); font-weight: 600; }
    .partido-llave .gol-equipo { color: var(--fwc-text-dim); font-weight: 600; min-width: 15px; text-align: right; }
    .partido-llave .gol-equipo.ganador { color: var(--fwc-accent); }
    .partido-llave .hora-partido { font-size: 0.6rem; color: var(--fwc-text-dim); text-align: right; min-width: 60px; }
    .llave-vacia { text-align: center; padding: 1rem 0; color: var(--fwc-text-dim); font-size: 0.75rem; }

    /* ── Indicador de carga API ── */
    .api-status {
      font-size: 0.6rem;
      color: var(--fwc-text-dim);
      text-align: center;
      padding: 0.3rem;
      opacity: 0.6;
    }
    .api-status.error { color: #e57373; }
    .api-status.ok { color: #81c784; }

    /* ── Ocultar pills cuando tarjeta abierta ── */
    .widget.tarjeta-abierta .idle-pill,
    .widget.tarjeta-abierta .live-pill { opacity: 0; pointer-events: none; transform: translateY(10px); }

    /* ── Draggable ── */
    :host([draggable]) .idle-pill,
    :host([draggable]) .live-pill { cursor: grab; }
    :host([draggable]) .idle-pill:active,
    :host([draggable]) .live-pill:active { cursor: grabbing; }

    /* ── Responsive ── */
    @media (max-width: 420px) {
      .tarjeta { width: calc(100vw - 2rem); max-height: 70vh; }
      .tarjeta.hacia-abajo,
      .tarjeta.hacia-arriba { right: auto; left: 50%; transform: translateX(-50%); }
      .tarjeta.hacia-abajo.visible { transform: translateX(-50%) translateY(0) scale(1); }
      .tarjeta.hacia-arriba.visible { transform: translateX(-50%) translateY(0) scale(1); }
    }
  `;

  // ═══════════════════════════════════════════════════════════
  // WEB COMPONENT
  // ═══════════════════════════════════════════════════════════
  class FifaWorldCup extends HTMLElement {
    static get observedAttributes() {
      return ['position', 'theme', 'api-url', 'floating', 'draggable'];
    }

    constructor() {
      super();
      this._grupoActivo = 'A';
      this._torneo = JSON.parse(JSON.stringify(TORNEO));
      this._apiOk = false;
      this._dragging = false;
      this._dragOffset = { x: 0, y: 0 };
      this._dragMoved = false;
      this._desdeCache = false;
    }

    // ═══════════════════════════════════════════════════════════
    // LOCALSTORAGE CACHE — estático, sin datos en vivo
    // ═══════════════════════════════════════════════════════════
    _cacheKey() { return 'fifa-widget-v1'; }

    _loadCache() {
      try {
        const raw = localStorage.getItem(this._cacheKey());
        if (!raw) return false;
        const data = JSON.parse(raw);
        // Restaurar campos dinámicos a estado base
        data.partidos.forEach(p => {
          p.golLocal = null;
          p.golVisitante = null;
          p.estado = 'programado';
          delete p.minuto;
        });
        // Resetear posiciones
        for (const grupo of Object.values(data.grupos)) {
          grupo.forEach(e => {
            e.pj = 0; e.pg = 0; e.pe = 0; e.pp = 0;
            e.gf = 0; e.gc = 0; e.pts = 0;
          });
        }
        // Resetear llave
        data.llave.treintaidosavos = [];
        data.llave.dieciseisavos = [];
        data.llave.cuartos = [];
        data.llave.semis = [];
        data.llave.tercerPuesto = { local: 'Por definir', visitante: 'Por definir', golLocal: null, golVisitante: null, fecha: '2026-07-18' };
        data.llave.final = { local: 'Por definir', visitante: 'Por definir', golLocal: null, golVisitante: null, fecha: '2026-07-19', sede: 'MetLife Stadium, Nueva York' };

        this._torneo = data;
        return true;
      } catch (e) {
        console.warn('[FIFA Widget] Cache inválido, usando datos por defecto:', e.message);
        return false;
      }
    }

    _saveCache() {
      try {
        // Clonar y sanitizar: solo datos estáticos
        const snapshot = JSON.parse(JSON.stringify(this._torneo));
        snapshot.partidos.forEach(p => {
          p.golLocal = null;
          p.golVisitante = null;
          p.estado = 'programado';
          delete p.minuto;
        });
        for (const grupo of Object.values(snapshot.grupos)) {
          grupo.forEach(e => {
            e.pj = 0; e.pg = 0; e.pe = 0; e.pp = 0;
            e.gf = 0; e.gc = 0; e.pts = 0;
          });
        }
        snapshot.llave.treintaidosavos = [];
        snapshot.llave.dieciseisavos = [];
        snapshot.llave.cuartos = [];
        snapshot.llave.semis = [];
        snapshot.llave.tercerPuesto = { local: 'Por definir', visitante: 'Por definir', golLocal: null, golVisitante: null, fecha: '2026-07-18' };
        snapshot.llave.final = { local: 'Por definir', visitante: 'Por definir', golLocal: null, golVisitante: null, fecha: '2026-07-19', sede: 'MetLife Stadium, Nueva York' };

        localStorage.setItem(this._cacheKey(), JSON.stringify(snapshot));
      } catch (e) {
        console.warn('[FIFA Widget] No se pudo guardar cache:', e.message);
      }
    }

    connectedCallback() {
      this._apiUrl = this.getAttribute('api-url') || null;

      // Intentar cargar desde cache primero
      this._desdeCache = this._loadCache();
      if (this._desdeCache) {
        console.log('[FIFA Widget] Datos cargados desde cache local');
      }
      this._shadow = this.attachShadow({ mode: 'open' });
      this._shadow.innerHTML = `
        <style>${ESTILOS}</style>
        <div class="widget" id="widget">
          <div class="live-pill" id="livePill">
            <span class="live-dot"></span>
            <span class="live-equipos" id="liveEquipos"></span>
            <span class="live-marcador" id="liveMarcador"></span>
            <span class="live-minuto" id="liveMinuto"></span>
          </div>
          <div class="idle-pill" id="idlePill">
            <span class="pelota">⚽</span>
            <span class="texto-cuenta" id="textoCuenta">Cargando...</span>
          </div>
          <div class="tarjeta" id="tarjeta">
            <div class="cabecera">
              <h2><span>🏆</span><span>${this._torneo.nombre}</span><span class="fase-badge" id="faseBadge">Fase de Grupos</span></h2>
              <button class="btn-cerrar" id="btnCerrar">&times;</button>
            </div>
            <div class="pestanas">
              <div class="pestana activa" data-panel="proximo">Próximo</div>
              <div class="pestana" data-panel="posiciones">Posiciones</div>
              <div class="pestana" data-panel="calendario">Calendario</div>
              <div class="pestana" data-panel="eliminatorias">Eliminatorias</div>
            </div>
            <div class="contenido">
              <div class="panel panel-proximo activo" id="panel-proximo">
                <!-- Sección: Cuenta regresiva (default) -->
                <div id="seccionCuenta">
                  <div class="cuenta-grande">
                    <div class="dias-grandes" id="diasGrandes">--</div>
                    <div class="sub" id="subCuenta">días para el inicio</div>
                  </div>
                </div>
                <!-- Sección: EN VIVO (se muestra cuando hay partido en curso) -->
                <div id="seccionEnVivo" style="display:none;">
                  <div class="badge-en-vivo">
                    <span class="live-dot"></span>
                    <span class="badge-texto">EN VIVO</span>
                    <span class="badge-minuto" id="vivoMinuto"></span>
                  </div>
                </div>
                <div class="enfrentamiento">
                  <div class="escudo" id="escudoLocal">⚽</div>
                  <span class="vs" id="textoVS">VS</span>
                  <div class="escudo" id="escudoVisitante">⚽</div>
                </div>
                <!-- Marcador en vivo -->
                <div id="seccionMarcador" style="display:none;">
                  <div class="marcador-en-vivo">
                    <span class="marcador-equipo" id="marcadorLocalNombre"></span>
                    <span class="marcador-goles" id="marcadorGoles"></span>
                    <span class="marcador-equipo" id="marcadorVisitanteNombre"></span>
                  </div>
                </div>
                <div style="text-align:center; margin-bottom:1rem;">
                  <span style="font-size:0.85rem; font-weight:600; color:var(--fwc-text-bright);" id="textoEquipos"></span>
                </div>
                <!-- Eventos del partido (goles, tarjetas) -->
                <div id="seccionEventos" style="display:none;">
                  <div class="eventos-partido" id="contenidoEventos"></div>
                </div>
                <div class="meta-partido">
                  <div class="meta-fila"><span class="etiqueta">Fecha</span><span class="valor" id="metaFecha"></span></div>
                  <div class="meta-fila"><span class="etiqueta">Hora</span><span class="valor" id="metaHora"></span></div>
                  <div class="meta-fila"><span class="etiqueta">Sede</span><span class="valor" id="metaSede"></span></div>
                  <div class="meta-fila"><span class="etiqueta">Grupo</span><span class="valor" id="metaGrupo"></span></div>
                </div>
                <div class="api-status" id="apiStatus"></div>
              </div>
              <div class="panel panel-posiciones" id="panel-posiciones">
                <div class="panel-posiciones">
                  <div class="selector-grupo" id="selectorGrupo"></div>
                  <table class="tabla-posiciones">
                    <thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th></tr></thead>
                    <tbody id="cuerpoPosiciones"></tbody>
                  </table>
                </div>
              </div>
              <div class="panel panel-calendario" id="panel-calendario">
                <div class="panel-calendario" id="contenidoCalendario"></div>
              </div>
              <div class="panel panel-eliminatorias" id="panel-eliminatorias">
                <div class="panel-eliminatorias" id="contenidoEliminatorias"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      this._refs = {
        widget: this._shadow.getElementById('widget'),
        idlePill: this._shadow.getElementById('idlePill'),
        textoCuenta: this._shadow.getElementById('textoCuenta'),
        livePill: this._shadow.getElementById('livePill'),
        liveEquipos: this._shadow.getElementById('liveEquipos'),
        liveMarcador: this._shadow.getElementById('liveMarcador'),
        liveMinuto: this._shadow.getElementById('liveMinuto'),
        tarjeta: this._shadow.getElementById('tarjeta'),
        btnCerrar: this._shadow.getElementById('btnCerrar'),
        diasGrandes: this._shadow.getElementById('diasGrandes'),
        subCuenta: this._shadow.getElementById('subCuenta'),
        faseBadge: this._shadow.getElementById('faseBadge'),
        seccionCuenta: this._shadow.getElementById('seccionCuenta'),
        seccionEnVivo: this._shadow.getElementById('seccionEnVivo'),
        vivoMinuto: this._shadow.getElementById('vivoMinuto'),
        textoVS: this._shadow.getElementById('textoVS'),
        seccionMarcador: this._shadow.getElementById('seccionMarcador'),
        marcadorLocalNombre: this._shadow.getElementById('marcadorLocalNombre'),
        marcadorGoles: this._shadow.getElementById('marcadorGoles'),
        marcadorVisitanteNombre: this._shadow.getElementById('marcadorVisitanteNombre'),
        seccionEventos: this._shadow.getElementById('seccionEventos'),
        contenidoEventos: this._shadow.getElementById('contenidoEventos'),
        escudoLocal: this._shadow.getElementById('escudoLocal'),
        escudoVisitante: this._shadow.getElementById('escudoVisitante'),
        textoEquipos: this._shadow.getElementById('textoEquipos'),
        metaFecha: this._shadow.getElementById('metaFecha'),
        metaHora: this._shadow.getElementById('metaHora'),
        metaSede: this._shadow.getElementById('metaSede'),
        metaGrupo: this._shadow.getElementById('metaGrupo'),
        selectorGrupo: this._shadow.getElementById('selectorGrupo'),
        cuerpoPosiciones: this._shadow.getElementById('cuerpoPosiciones'),
        contenidoCalendario: this._shadow.getElementById('contenidoCalendario'),
        contenidoEliminatorias: this._shadow.getElementById('contenidoEliminatorias'),
        apiStatus: this._shadow.getElementById('apiStatus')
      };

      this._bindEvents();
      this._renderSelectorGrupos();
      this._actualizarCuenta();
      this._verificarEnVivo();

      // Si NO hay cache → fetch inmediato; si HAY cache → solo programar verificación
      if (!this._loadCache()) {
        this._cargarAPI();
      }

      // Intervalo de cuenta regresiva (siempre activo, es barato)
      this._intervaloCuenta = setInterval(() => this._actualizarCuenta(), 30000);

      // Programar consultas a la API
      this._programarConsultasAPI();
    }

    disconnectedCallback() {
      if (this._intervaloCuenta) clearInterval(this._intervaloCuenta);
      if (this._intervaloVivo) clearInterval(this._intervaloVivo);
      if (this._timeoutDia) clearTimeout(this._timeoutDia);
      document.removeEventListener('keydown', this._handleKeyDown);
      document.removeEventListener('click', this._handleClickOutside);
      if (this._onDragMoveBound) {
        document.removeEventListener('mousemove', this._onDragMoveBound);
        document.removeEventListener('touchmove', this._onDragMoveBound);
      }
      if (this._onDragEndBound) {
        document.removeEventListener('mouseup', this._onDragEndBound);
        document.removeEventListener('touchend', this._onDragEndBound);
      }
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal === newVal) return;
      if (name === 'api-url') {
        this._apiUrl = newVal || null;
        this._cargarAPI();
      }
      // theme y position se manejan con CSS via :host([attr]) — reactivo automático
    }

    // ═══════════════════════════════════════════════════════════
    // PLANIFICADOR INTELIGENTE DE CONSULTAS API
    // ═══════════════════════════════════════════════════════════

    _programarConsultasAPI() {
      // Limpiar intervalos previos si existen
      if (this._intervaloVivo) clearInterval(this._intervaloVivo);
      if (this._timeoutDia) clearTimeout(this._timeoutDia);

      // ¿Hay algún partido EN VIVO ahora? → poll agresivo cada 60s
      const hayEnVivo = this._torneo.partidos.some(p => p.estado === 'en-vivo');
      if (hayEnVivo) {
        this._intervaloVivo = setInterval(() => this._cargarAPI(), 60000);
        return;
      }

      // No hay partidos en vivo → verificar cada 1 hora por si hubo cambios
      this._intervaloVivo = setInterval(() => this._cargarAPI(), 60 * 60 * 1000);
    }

    // ═══════════════════════════════════════════════════════════
    // CAPA DE API
    // ═══════════════════════════════════════════════════════════

    async _cargarAPI() {
      const statusEl = this._refs.apiStatus;

      // Si hay un api-url personalizado, usarlo
      if (this._apiUrl) {
        try {
          const res = await fetch(this._apiUrl);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const datos = await res.json();
          this._mezclarDatos(datos);
          this._apiOk = true;
          if (statusEl) {
            statusEl.textContent = 'Datos actualizados';
            statusEl.className = 'api-status ok';
          }
        } catch (e) {
          console.warn('[FIFA Widget] Error al cargar API:', e.message);
          if (statusEl) {
            statusEl.textContent = 'Error al cargar datos externos — usando datos locales';
            statusEl.className = 'api-status error';
            setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 5000);
          }
        }
        this._programarConsultasAPI();
        return;
      }

      // TheSportsDB (gratis, sin API key)
      try {
        const res = await fetch(
          API_THE_SPORTS_DB.base + '/eventsnextleague.php?id=' + API_THE_SPORTS_DB.leagueId
        );
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          this._mezclarDesdeTheSportsDB(data.events);
          this._apiOk = true;
          if (statusEl) {
            statusEl.textContent = 'Datos en vivo activos';
            statusEl.className = 'api-status ok';
            setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
          }
        }
      } catch (e) {
        console.log('[FIFA Widget] TheSportsDB no disponible, usando datos estáticos:', e.message);
        this._apiOk = false;
      }

      // Re-evaluar si seguimos en día de partido
      this._programarConsultasAPI();
    }

    _mezclarDesdeTheSportsDB(eventosAPI) {
      eventosAPI.forEach(evt => {
        // Mapear nombres de la API a nombres estáticos
        const localAPI = evt.strHomeTeam || evt.homeTeam || '';
        const visitanteAPI = evt.strAwayTeam || evt.awayTeam || '';
        const local = MAPA_EQUIPOS[localAPI] || localAPI;
        const visitante = MAPA_EQUIPOS[visitanteAPI] || visitanteAPI;

        // Buscar partido estático que coincida
        const partido = this._torneo.partidos.find(p =>
          (p.local === local && p.visitante === visitante) ||
          (p.local === visitante && p.visitante === local)
        );

        if (!partido) return;

        // Actualizar estado
        const strStatus = evt.strStatus || '';
        if (strStatus === 'FT' || strStatus === 'AET' || strStatus === 'Pen') {
          partido.estado = 'finalizado';
        } else if (strStatus === 'NS') {
          partido.estado = 'programado';
        } else if (['HT', 'LIVE', '1H', '2H', 'ET', 'P'].includes(strStatus)) {
          partido.estado = 'en-vivo';
        }

        // Actualizar goles
        const intHomeScore = parseInt(evt.intHomeScore);
        const intAwayScore = parseInt(evt.intAwayScore);
        if (!isNaN(intHomeScore)) partido.golLocal = intHomeScore;
        if (!isNaN(intAwayScore)) partido.golVisitante = intAwayScore;

        // Actualizar minuto si está en vivo
        if (partido.estado === 'en-vivo' && evt.strProgress) {
          partido.minuto = evt.strProgress;
        }
      });

      // Recalcular posiciones basado en resultados
      this._recalcularPosiciones();

      // Actualizar UI si la tarjeta está abierta
      if (this._refs.widget.classList.contains('tarjeta-abierta')) {
        this._renderPosiciones();
        this._renderCalendario();
        // Si hay partido en vivo, actualizar eventos
        const enVivo = this._torneo.partidos.find(m => m.estado === 'en-vivo');
        if (enVivo) this._renderEventos(enVivo);
      }

      // Actualizar pill de en vivo
      this._verificarEnVivo();

      // Guardar estáticos en cache
      this._saveCache();
    }

    _mezclarDatos(datos) {
      // Para endpoint personalizado: espera { partidos: [...], grupos: {...} }
      if (datos.partidos && Array.isArray(datos.partidos)) {
        datos.partidos.forEach((pAPI, i) => {
          if (this._torneo.partidos[i]) {
            Object.assign(this._torneo.partidos[i], pAPI);
          }
        });
      }
      if (datos.grupos) {
        Object.assign(this._torneo.grupos, datos.grupos);
      }

      if (this._refs.widget.classList.contains('tarjeta-abierta')) {
        this._renderPosiciones();
        this._renderCalendario();
      }

      // Guardar estáticos en cache
      this._saveCache();
    }

    _recalcularPosiciones() {
      // Resetear todas las posiciones
      for (const grupo of Object.values(this._torneo.grupos)) {
        grupo.forEach(e => {
          e.pj = 0; e.pg = 0; e.pe = 0; e.pp = 0;
          e.gf = 0; e.gc = 0; e.pts = 0;
        });
      }

      // Recalcular desde partidos finalizados
      this._torneo.partidos.forEach(p => {
        if (p.estado !== 'finalizado') return;
        if (p.golLocal === null || p.golVisitante === null) return;

        const local = this._buscarEquipo(p.local);
        const visitante = this._buscarEquipo(p.visitante);
        if (!local || !visitante) return;

        local.pj++; visitante.pj++;
        local.gf += p.golLocal; local.gc += p.golVisitante;
        visitante.gf += p.golVisitante; visitante.gc += p.golLocal;

        if (p.golLocal > p.golVisitante) {
          local.pg++; local.pts += 3;
          visitante.pp++;
        } else if (p.golLocal < p.golVisitante) {
          visitante.pg++; visitante.pts += 3;
          local.pp++;
        } else {
          local.pe++; local.pts += 1;
          visitante.pe++; visitante.pts += 1;
        }
      });
    }

    // ═══════════════════════════════════════════════════════════
    // EVENTOS
    // ═══════════════════════════════════════════════════════════
    _bindEvents() {
      const r = this._refs;

      // Click handlers — solo abrir si NO hubo arrastre
      r.idlePill.addEventListener('click', (e) => {
        if (!this._dragMoved) this._abrirTarjeta();
        this._dragMoved = false;
      });
      r.livePill.addEventListener('click', (e) => {
        if (!this._dragMoved) this._abrirTarjeta();
        this._dragMoved = false;
      });
      r.btnCerrar.addEventListener('click', () => this._cerrarTarjeta());

      // Drag handlers (solo si tiene atributo draggable)
      if (this.hasAttribute('draggable')) {
        this._bindDrag();
      }

      this._shadow.querySelectorAll('.pestana').forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          this._shadow.querySelectorAll('.pestana').forEach(t => t.classList.remove('activa'));
          this._shadow.querySelectorAll('.panel').forEach(p => p.classList.remove('activo'));
          tab.classList.add('activa');
          this._shadow.getElementById('panel-' + tab.dataset.panel).classList.add('activo');
        });
      });

      this._handleKeyDown = (e) => {
        if (e.key === 'Escape' && r.widget.classList.contains('tarjeta-abierta')) {
          this._cerrarTarjeta();
        }
      };

      document.addEventListener('keydown', this._handleKeyDown);

      // Click fuera de la tarjeta → cerrar
      this._handleClickOutside = (e) => {
        if (!r.widget.classList.contains('tarjeta-abierta')) return;
        // Si el click fue dentro del host (shadow DOM), ignorar
        if (this.contains(e.target)) return;
        this._cerrarTarjeta();
      };
      document.addEventListener('click', this._handleClickOutside);
    }

    // ═══════════════════════════════════════════════════════════
    // DRAG (atributo draggable)
    // ═══════════════════════════════════════════════════════════
    _bindDrag() {
      const pills = [this._refs.idlePill, this._refs.livePill];
      const onStart = (e) => this._onDragStart(e);

      pills.forEach(pill => {
        pill.addEventListener('mousedown', onStart);
        pill.addEventListener('touchstart', onStart, { passive: false });
      });

      this._onDragMoveBound = (e) => this._onDragMove(e);
      this._onDragEndBound = () => this._onDragEnd();
    }

    _getPointerPos(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    _onDragStart(e) {
      if (e.button && e.button !== 0) return; // solo click izquierdo

      const pos = this._getPointerPos(e);
      const rect = this.getBoundingClientRect();

      this._dragOffset = { x: pos.x - rect.left, y: pos.y - rect.top };
      this._dragMoved = false;
      this._dragging = true;

      // Fijar posición actual como top/left inline
      this.style.position = 'fixed';
      this.style.top = rect.top + 'px';
      this.style.left = rect.left + 'px';
      this.style.right = 'auto';
      this.style.bottom = 'auto';

      document.addEventListener('mousemove', this._onDragMoveBound);
      document.addEventListener('mouseup', this._onDragEndBound);
      document.addEventListener('touchmove', this._onDragMoveBound, { passive: false });
      document.addEventListener('touchend', this._onDragEndBound);
    }

    _onDragMove(e) {
      if (!this._dragging) return;
      e.preventDefault();

      const pos = this._getPointerPos(e);
      const newX = pos.x - this._dragOffset.x;
      const newY = pos.y - this._dragOffset.y;

      // Detectar si se movió más de 5px (distinguir click de drag)
      const rect = this.getBoundingClientRect();
      const moved = Math.abs(newX - rect.left) + Math.abs(newY - rect.top);
      if (moved > 5) this._dragMoved = true;

      this.style.left = newX + 'px';
      this.style.top = newY + 'px';
    }

    _onDragEnd() {
      this._dragging = false;
      document.removeEventListener('mousemove', this._onDragMoveBound);
      document.removeEventListener('mouseup', this._onDragEndBound);
      document.removeEventListener('touchmove', this._onDragMoveBound);
      document.removeEventListener('touchend', this._onDragEndBound);
    }

    // ═══════════════════════════════════════════════════════════
    // ABRIR / CERRAR
    // ═══════════════════════════════════════════════════════════
    _abrirTarjeta() {
      const r = this._refs;
      r.widget.classList.add('tarjeta-abierta');

      // Calcular dirección: ¿hay más espacio arriba o abajo?
      const rect = this.getBoundingClientRect();
      const espacioAbajo = window.innerHeight - rect.bottom;
      const espacioArriba = rect.top;
      const tarjetaAlturaEstimada = 480; // ~80vh max

      r.tarjeta.classList.remove('hacia-abajo', 'hacia-arriba');

      if (espacioAbajo < tarjetaAlturaEstimada && espacioArriba > espacioAbajo) {
        // Poco espacio abajo, más espacio arriba → abrir hacia arriba
        r.tarjeta.classList.add('hacia-arriba');
      } else {
        // Espacio suficiente abajo → abrir hacia abajo (default)
        r.tarjeta.classList.add('hacia-abajo');
      }

      // Forzar reflow antes de agregar visible para que la transición funcione
      void r.tarjeta.offsetHeight;
      r.tarjeta.classList.add('visible');

      this._renderPosiciones();
      this._renderCalendario();
      this._renderEliminatorias();

      // Si hay partido en vivo, renderizar eventos
      const enVivo = this._torneo.partidos.find(m => m.estado === 'en-vivo');
      if (enVivo) {
        this._renderEventos(enVivo);
      }
    }

    _cerrarTarjeta() {
      this._refs.tarjeta.classList.remove('visible');
      setTimeout(() => {
        this._refs.widget.classList.remove('tarjeta-abierta');
        this._refs.tarjeta.classList.remove('hacia-abajo', 'hacia-arriba');
      }, 300);
    }

    // ═══════════════════════════════════════════════════════════
    // CUENTA REGRESIVA
    // ═══════════════════════════════════════════════════════════

    _aHoraLocal(fecha, horaUTC) {
      const dt = new Date(fecha + 'T' + horaUTC + ':00Z');
      return dt.toLocaleTimeString('es-419', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    _proximoPartido() {
      const ahora = new Date();
      const proximos = this._torneo.partidos
        .filter(m => m.estado === 'programado' || m.estado === 'en-vivo')
        .sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));
      return proximos[0] || null;
    }

    _buscarEquipo(nombre) {
      for (const grupo of Object.values(this._torneo.grupos)) {
        const encontrado = grupo.find(e => e.equipo === nombre);
        if (encontrado) return encontrado;
      }
      return null;
    }

    _actualizarCuenta() {
      const r = this._refs;
      const proximo = this._proximoPartido();

      if (!proximo) {
        r.textoCuenta.textContent = '¡Torneo terminado!';
        r.diasGrandes.textContent = '🏆';
        r.subCuenta.textContent = 'Torneo Finalizado';
        // Ocultar secciones en vivo
        r.seccionCuenta.style.display = 'block';
        r.seccionEnVivo.style.display = 'none';
        r.seccionMarcador.style.display = 'none';
        r.seccionEventos.style.display = 'none';
        r.textoVS.textContent = 'VS';
        return;
      }

      const fechaPartido = new Date(proximo.fecha + 'T' + proximo.hora + 'Z');
      const diff = fechaPartido - new Date();

      if (proximo.estado === 'en-vivo' || diff <= 0) {
        // Modo EN VIVO: mostrar badge y marcador
        r.seccionCuenta.style.display = 'none';
        r.seccionEnVivo.style.display = 'block';
        r.vivoMinuto.textContent = proximo.minuto ? proximo.minuto : 'EN VIVO';
        r.textoVS.textContent = '-';

        // Marcador
        r.seccionMarcador.style.display = 'block';
        r.marcadorLocalNombre.textContent = proximo.local;
        r.marcadorVisitanteNombre.textContent = proximo.visitante;
        r.marcadorGoles.textContent = `${proximo.golLocal ?? 0} - ${proximo.golVisitante ?? 0}`;

        // Eventos (goles, tarjetas)
        this._renderEventos(proximo);

        r.textoCuenta.textContent = '¡EN VIVO!';
        r.diasGrandes.textContent = 'EN VIVO';
        r.subCuenta.textContent = 'Partido en curso';
      } else {
        // Modo cuenta regresiva: ocultar secciones en vivo
        r.seccionCuenta.style.display = 'block';
        r.seccionEnVivo.style.display = 'none';
        r.seccionMarcador.style.display = 'none';
        r.seccionEventos.style.display = 'none';
        r.textoVS.textContent = 'VS';

        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (dias > 0) {
          r.textoCuenta.textContent = `${dias}d ${horas}h para ${proximo.local} vs ${proximo.visitante}`;
          r.diasGrandes.textContent = dias;
          r.subCuenta.textContent = `días para ${proximo.local} vs ${proximo.visitante}`;
        } else {
          r.textoCuenta.textContent = `¡${horas}h ${mins}m para el saque!`;
          r.diasGrandes.textContent = `${horas}h ${mins}m`;
          r.subCuenta.textContent = 'para el saque inicial';
        }
      }

      const opciones = { month: 'long', day: 'numeric', year: 'numeric' };
      r.metaFecha.textContent = fechaPartido.toLocaleDateString('es-419', opciones);
      r.metaHora.textContent = this._aHoraLocal(proximo.fecha, proximo.hora);
      r.metaSede.textContent = proximo.sede;
      r.metaGrupo.textContent = `Grupo ${proximo.grupo} — Fecha 1`;
      r.textoEquipos.textContent = `${proximo.local} vs ${proximo.visitante}`;

      const local = this._buscarEquipo(proximo.local);
      const visitante = this._buscarEquipo(proximo.visitante);
      r.escudoLocal.textContent = local ? local.bandera : '⚽';
      r.escudoVisitante.textContent = visitante ? visitante.bandera : '⚽';
    }

    // ═══════════════════════════════════════════════════════════
    // VERIFICAR EN VIVO
    // ═══════════════════════════════════════════════════════════
    _verificarEnVivo() {
      const r = this._refs;
      const enVivo = this._torneo.partidos.filter(m => m.estado === 'en-vivo');

      if (enVivo.length > 0) {
        const m = enVivo[0];
        r.liveEquipos.textContent = `${m.local} vs ${m.visitante}`;
        r.liveMarcador.textContent = `${m.golLocal ?? 0} - ${m.golVisitante ?? 0}`;
        r.liveMinuto.textContent = m.minuto ? m.minuto + "'" : 'EN VIVO';
        r.livePill.classList.add('activo');
        r.idlePill.style.display = 'none';
      } else {
        r.livePill.classList.remove('activo');
        r.idlePill.style.display = 'flex';
      }
    }

    // ═══════════════════════════════════════════════════════════
    // EVENTOS DEL PARTIDO (goles, tarjetas)
    // ═══════════════════════════════════════════════════════════
    _renderEventos(partido) {
      const r = this._refs;
      const eventos = partido.eventos || [];

      if (eventos.length === 0) {
        // Sin eventos detallados — mostrar resumen básico si hay goles
        if (partido.golLocal > 0 || partido.golVisitante > 0) {
          r.seccionEventos.style.display = 'block';
          let html = '';
          if (partido.golLocal > 0) {
            html += `<div class="evento-fila"><span class="evento-icono">⚽</span><span class="evento-texto">${partido.golLocal} gol(es) ${partido.local}</span><span class="evento-equipo">Local</span></div>`;
          }
          if (partido.golVisitante > 0) {
            html += `<div class="evento-fila"><span class="evento-icono">⚽</span><span class="evento-texto">${partido.golVisitante} gol(es) ${partido.visitante}</span><span class="evento-equipo">Visitante</span></div>`;
          }
          r.contenidoEventos.innerHTML = html;
        } else {
          r.seccionEventos.style.display = 'none';
        }
        return;
      }

      // Eventos detallados disponibles
      r.seccionEventos.style.display = 'block';

      // Ordenar por minuto
      const ordenados = [...eventos].sort((a, b) => {
        const minA = parseInt(a.minuto) || 0;
        const minB = parseInt(b.minuto) || 0;
        return minA - minB;
      });

      const iconos = { gol: '⚽', amarilla: '🟨', roja: '🟥', sustitucion: '🔄' };

      r.contenidoEventos.innerHTML = ordenados.map(ev => {
        const icono = iconos[ev.tipo] || '•';
        const texto = ev.tipo === 'gol'
          ? `${ev.jugador}${ev.asistencia ? ` (${ev.asistencia})` : ''}`
          : ev.tipo === 'sustitucion'
            ? `${ev.salio} → ${ev.entro}`
            : ev.jugador;
        const equipo = ev.equipo === partido.local ? 'Local' : 'Visitante';

        return `<div class="evento-fila">
          <span class="evento-minuto">${ev.minuto}'</span>
          <span class="evento-icono">${icono}</span>
          <span class="evento-texto">${texto}</span>
          <span class="evento-equipo">${equipo}</span>
        </div>`;
      }).join('');
    }

    // ═══════════════════════════════════════════════════════════
    // PARSEAR EVENTOS (API custom — TheSportsDB no los incluye)
    // Formato esperado: "45';Lozano;Assist:Herrera~67';Jiménez"
    // ═══════════════════════════════════════════════════════════
    _parsearDetallesGoles(detalle, equipo) {
      if (!detalle || detalle.trim() === '') return [];

      return detalle.split('~').map(gol => {
        const partes = gol.split(';');
        const minuto = (partes[0] || '').replace(/[^0-9]/g, '');
        const jugador = partes[1] || '';
        const asistenciaParte = partes[2] || '';
        const asistencia = asistenciaParte.startsWith('Assist:')
          ? asistenciaParte.replace('Assist:', '').trim()
          : null;

        return {
          minuto: minuto,
          tipo: 'gol',
          jugador: jugador,
          asistencia: asistencia,
          equipo: equipo
        };
      }).filter(ev => ev.minuto && ev.jugador);
    }

    // ═══════════════════════════════════════════════════════════
    // POSICIONES
    // ═══════════════════════════════════════════════════════════
    _renderSelectorGrupos() {
      const r = this._refs;
      r.selectorGrupo.innerHTML = '';
      Object.keys(this._torneo.grupos).forEach(g => {
        const btn = document.createElement('button');
        btn.className = 'btn-grupo' + (g === this._grupoActivo ? ' activo' : '');
        btn.textContent = 'Grupo ' + g;
        btn.addEventListener('click', () => {
          this._grupoActivo = g;
          this._renderSelectorGrupos();
          this._renderPosiciones();
        });
        r.selectorGrupo.appendChild(btn);
      });
    }

    _renderPosiciones() {
      const r = this._refs;
      const equipos = [...this._torneo.grupos[this._grupoActivo]].sort((a, b) =>
        b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc)
      );
      r.cuerpoPosiciones.innerHTML = equipos.map((e, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${e.bandera} ${e.equipo}</td>
          <td>${e.pj}</td><td>${e.pg}</td><td>${e.pe}</td><td>${e.pp}</td>
          <td>${e.gf}</td><td>${e.gc}</td>
          <td>${e.gf - e.gc > 0 ? '+' : ''}${e.gf - e.gc}</td>
          <td class="pts">${e.pts}</td>
        </tr>
      `).join('');
    }

    // ═══════════════════════════════════════════════════════════
    // CALENDARIO
    // ═══════════════════════════════════════════════════════════
    _renderCalendario() {
      const r = this._refs;
      const porFecha = {};
      this._torneo.partidos.forEach(m => {
        if (!porFecha[m.fecha]) porFecha[m.fecha] = [];
        porFecha[m.fecha].push(m);
      });

      r.contenidoCalendario.innerHTML = Object.entries(porFecha).map(([fecha, partidos]) => {
        const f = new Date(fecha + 'T00:00:00Z');
        const fechaStr = f.toLocaleDateString('es-419', { weekday: 'short', month: 'short', day: 'numeric' });
        return `
          <div class="fecha-calendario">${fechaStr}</div>
          ${partidos.map(m => `
            <div class="fila-calendario">
              <span class="hora">${this._aHoraLocal(m.fecha, m.hora)}</span>
              <span class="equipos">${m.local} vs ${m.visitante}</span>
              ${m.estado === 'finalizado' ? `<span class="marcador">${m.golLocal} - ${m.golVisitante}</span>` : ''}
              ${m.estado === 'en-vivo' ? `<span class="marcador" style="color:var(--fwc-green)">${m.golLocal ?? 0} - ${m.golVisitante ?? 0}</span>` : ''}
              <span class="etiqueta-grupo">Gr. ${m.grupo}</span>
            </div>
          `).join('')}
        `;
      }).join('');
    }

    // ═══════════════════════════════════════════════════════════
    // ELIMINATORIAS
    // ═══════════════════════════════════════════════════════════
    _renderEliminatorias() {
      const r = this._refs;
      const rondas = [
        { clave: 'treintaidosavos', titulo: 'Treintaidosavos de Final' },
        { clave: 'dieciseisavos', titulo: 'Dieciseisavos de Final' },
        { clave: 'cuartos', titulo: 'Cuartos de Final' },
        { clave: 'semis', titulo: 'Semifinales' },
        { clave: 'tercerPuesto', titulo: 'Tercer Puesto' },
        { clave: 'final', titulo: 'Final' }
      ];

      const _renderPartido = (m) => `
        <div class="partido-llave">
          <div class="equipos-llave">
            <div class="fila-equipo">
              <span class="nombre-equipo ${m.golLocal > m.golVisitante ? 'ganador' : ''}">${m.local}</span>
              <span class="gol-equipo ${m.golLocal > m.golVisitante ? 'ganador' : ''}">${m.golLocal ?? '-'}</span>
            </div>
            <div class="fila-equipo">
              <span class="nombre-equipo ${m.golVisitante > m.golLocal ? 'ganador' : ''}">${m.visitante}</span>
              <span class="gol-equipo ${m.golVisitante > m.golLocal ? 'ganador' : ''}">${m.golVisitante ?? '-'}</span>
            </div>
          </div>
          <div class="hora-partido">${m.fecha ? new Date(m.fecha + 'T00:00:00Z').toLocaleDateString('es-419', { month: 'short', day: 'numeric' }) : ''}</div>
        </div>
      `;

      r.contenidoEliminatorias.innerHTML = rondas.map(ronda => {
        const partidos = this._torneo.llave[ronda.clave];

        // Partido único (objeto): final, tercerPuesto
        if (partidos && !Array.isArray(partidos)) {
          return `<div class="ronda-llave"><div class="titulo-ronda">${ronda.titulo}</div>${_renderPartido(partidos)}</div>`;
        }

        // Array vacío: ronda aún no definida
        if (!partidos || partidos.length === 0) {
          return `<div class="ronda-llave"><div class="titulo-ronda">${ronda.titulo}</div><div class="llave-vacia">Se completará al terminar la fase de grupos</div></div>`;
        }

        // Array con partidos
        return `<div class="ronda-llave"><div class="titulo-ronda">${ronda.titulo}</div>${partidos.map(_renderPartido).join('')}</div>`;
      }).join('');
    }

    // ═══════════════════════════════════════════════════════════
    // API PÚBLICA
    // ═══════════════════════════════════════════════════════════
    actualizarPartido(index, datos) {
      if (this._torneo.partidos[index]) {
        Object.assign(this._torneo.partidos[index], datos);
        this._recalcularPosiciones();
        this._actualizarCuenta();
        this._verificarEnVivo();
        this._renderPosiciones();
        this._renderCalendario();
        this._saveCache();
      }
    }

    obtenerDatos() {
      return this._torneo;
    }

    forzarActualizacion() {
      return this._cargarAPI();
    }
  }

  customElements.define('fifa-world-cup', FifaWorldCup);
})();
