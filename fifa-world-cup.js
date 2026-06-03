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

  const MAPEO_RONDAS = {
    'Round of 32': 'treintaidosavos',
    'Round of 16': 'dieciseisavos',
    'Quarter-Final': 'cuartos',
    'Semi-Final': 'semis',
    '3rd Place': 'tercerPuesto',
    'Final': 'final'
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
      width: 520px;
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
      overflow: hidden;
      max-width: 400px;
    }
    .live-pill.activo { display: flex; }
    .live-pill:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(76,175,80,0.3); }

    /* Live pill collapsed */
    .live-pill.colapsado {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
      max-width: 40px;
      justify-content: center;
      align-items: center;
      gap: 0;
    }
    .live-pill.colapsado .live-equipos,
    .live-pill.colapsado .live-marcador,
    .live-pill.colapsado .live-minuto {
      display: none;
    }

    /* Goal celebration animation */
    @keyframes golCelebracion {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76,175,80,0.6); }
      25% { transform: scale(1.15); box-shadow: 0 0 20px 8px rgba(76,175,80,0.4); }
      50% { transform: scale(1.05); box-shadow: 0 0 10px 4px rgba(76,175,80,0.3); }
      75% { transform: scale(1.1); box-shadow: 0 0 15px 6px rgba(76,175,80,0.2); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76,175,80,0); }
    }
    .live-pill.gol-animado {
      animation: golCelebracion 1.5s ease-out;
    }

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

    /* Pelota animada en live-pill */
    .live-pill .pelota {
      font-size: 1rem;
      animation: giroLento 4s linear infinite;
      flex-shrink: 0;
      line-height: 1;
    }
    .live-pill:hover .pelota { animation: girar 0.8s linear infinite; }
    .live-pill.colapsado .pelota {
      animation: giroLento 60s linear infinite;
      font-size: 1.2rem;
    }
    .live-pill.colapsado .live-dot { display: none; }

    /* Dirección inteligente al expandir */
    .live-pill.expand-left .pelota { order: 5; }
    .idle-pill.expand-left .pelota { order: 2; }

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
      overflow: hidden;
      max-width: 400px;
    }
    .idle-pill:hover {
      background: rgba(26,58,92,0.45);
      border-color: rgba(255,255,255,0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(26,58,92,0.4);
    }

    /* Collapsed state — only ball visible */
    .idle-pill.colapsado {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
      max-width: 40px;
      justify-content: center;
      align-items: center;
      gap: 0;
    }
    .idle-pill.colapsado .texto-cuenta {
      display: none;
    }

    .idle-pill .pelota {
      font-size: 1.2rem; display: inline-block; transition: transform 0.3s ease;
      flex-shrink: 0;
    }
    .idle-pill:hover .pelota { animation: girar 0.8s linear infinite; }
    .idle-pill.colapsado .pelota { animation: giroLento 60s linear infinite; }
    @keyframes girar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes giroLento { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .idle-pill .texto-cuenta {
      font-size: 0.8rem; color: rgba(255,255,255,0.7); font-weight: 500; white-space: nowrap;
      transition: all 0.3s ease;
    }
    .idle-pill:hover .texto-cuenta { color: #fff; }

    :host([theme="light"]) .idle-pill .texto-cuenta { color: rgba(0,0,0,0.6); }
    :host([theme="light"]) .idle-pill:hover .texto-cuenta { color: #333; }
    :host([theme="light"]) .idle-pill.colapsado { background: rgba(0,0,0,0.08); }

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

    /* Grupo de cerrar + snooze */
    .cerrar-grupo { display: flex; align-items: center; gap: 0.3rem; }
    .btn-snooze {
      background: rgba(255,255,255,0.08); border: none; color: #8899aa;
      width: 26px; height: 26px; border-radius: 50%; font-size: 1.1rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; line-height: 1;
    }
    .btn-snooze:hover { background: rgba(255,255,255,0.15); color: #fff; }

    /* Panel de snooze */
    .snooze-panel {
      display: none;
      padding: 1rem;
      border-bottom: 1px solid var(--fwc-border);
      background: rgba(0,0,0,0.15);
    }
    .snooze-panel.visible { display: block; }
    .snooze-titulo {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--fwc-text);
      margin-bottom: 0.8rem;
    }
    .snooze-opciones { display: flex; flex-direction: column; gap: 0.5rem; }
    .snooze-btn {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.8rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--fwc-border);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      color: var(--fwc-text);
    }
    .snooze-btn:hover {
      background: rgba(79,195,247,0.1);
      border-color: rgba(79,195,247,0.3);
    }
    .snooze-icono { font-size: 1.2rem; flex-shrink: 0; }
    .snooze-texto { display: flex; flex-direction: column; gap: 0.1rem; }
    .snooze-texto strong { font-size: 0.75rem; font-weight: 600; }
    .snooze-desc { font-size: 0.65rem; color: var(--fwc-text-dim); }

    /* Confirmación */
    .snooze-confirm {
      margin-top: 0.8rem;
      padding: 0.8rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(79,195,247,0.3);
      border-radius: 8px;
    }
    .snooze-confirm-texto {
      font-size: 0.75rem;
      color: var(--fwc-text);
      margin-bottom: 0.6rem;
      text-align: center;
    }
    .snooze-confirm-botones { display: flex; gap: 0.5rem; justify-content: center; }
    .snooze-confirm-btn {
      padding: 0.4rem 1rem;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .snooze-confirm-btn.cancelar {
      background: rgba(255,255,255,0.1);
      color: var(--fwc-text-dim);
    }
    .snooze-confirm-btn.cancelar:hover { background: rgba(255,255,255,0.15); }
    .snooze-confirm-btn.confirmar {
      background: rgba(79,195,247,0.3);
      color: var(--fwc-accent);
    }
    .snooze-confirm-btn.confirmar:hover { background: rgba(79,195,247,0.5); }

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
      transition: all 0.2s;
      border-bottom: 2px solid transparent;
    }
    .pestana:hover { color: var(--fwc-text); background: rgba(255,255,255,0.03); }
    .pestana.activa { color: var(--fwc-accent); border-bottom-color: var(--fwc-accent); }
    .pestana.activa::after { display: none; }

    /* Contenido */
    .contenido { flex: 1; overflow-y: auto; padding: 0; min-height: 320px; }
    .contenido::-webkit-scrollbar { width: 6px; height: 6px; }
    .contenido::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
    .contenido::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
    .contenido::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.35); }

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
      transition: all 0.2s;
    }
    .escudo:hover { transform: scale(1.1); border-color: var(--fwc-accent); }
    .vs { font-size: 0.85rem; font-weight: 700; color: var(--fwc-accent); }

    .meta-partido { display: flex; flex-direction: column; gap: 0.4rem; }
    .meta-fila {
      display: flex; justify-content: space-between; font-size: 0.75rem;
      padding: 0.35rem 0.4rem; border-radius: 4px;
      transition: background 0.15s;
    }
    .meta-fila:hover { background: rgba(255,255,255,0.03); }
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
      transition: background 0.15s;
    }
    .evento-fila:hover { background: rgba(255,255,255,0.03); }
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

    /* Highlights button */
    .btn-highlights {
      display: inline-flex; align-items: center; gap: 0.3rem;
      padding: 0.35rem 0.8rem;
      background: rgba(255,0,0,0.1);
      border: 1px solid rgba(255,0,0,0.2);
      border-radius: 20px;
      color: #ff6b6b;
      font-size: 0.65rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-highlights:hover {
      background: rgba(255,0,0,0.2);
      border-color: rgba(255,0,0,0.4);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255,0,0,0.15);
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
      transition: background 0.15s;
    }
    .tabla-posiciones tbody tr { transition: background 0.15s; }
    .tabla-posiciones tbody tr:hover { background: rgba(255,255,255,0.04); }
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
      border-radius: 4px; transition: background 0.15s;
    }
    .fila-calendario:hover { background: rgba(255,255,255,0.04); }
    .fila-calendario .hora { color: var(--fwc-text-dim); font-weight: 500; min-width: 45px; }
    .fila-calendario .equipos { flex: 1; color: var(--fwc-text); }
    .fila-calendario .marcador { color: var(--fwc-accent); font-weight: 600; }
    .fila-calendario .etiqueta-grupo {
      font-size: 0.6rem; color: var(--fwc-text-dim);
      background: rgba(255,255,255,0.05); padding: 0.1rem 0.4rem; border-radius: 3px;
    }

    /* ── Panel: Eliminatorias (Bracket Tree) ── */
    .panel-eliminatorias {
      padding: 0.6rem;
      overflow-x: auto;
      overflow-y: auto;
      max-height: 65vh;
    }
    .panel-eliminatorias::-webkit-scrollbar { width: 6px; height: 6px; }
    .panel-eliminatorias::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 3px; }
    .panel-eliminatorias::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 3px; }
    .panel-eliminatorias::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }

    .bracket-tree {
      display: flex;
      gap: 0;
      min-width: 680px;
      position: relative;
    }

    .bracket-ronda {
      flex: 0 0 auto;
      width: 160px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      position: relative;
      padding: 0 0.3rem;
    }

    .bracket-ronda:last-child {
      width: 180px;
    }

    .bracket-ronda-titulo {
      font-size: 0.6rem;
      font-weight: 600;
      color: var(--fwc-accent);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-align: center;
      padding: 0.3rem 0;
      margin-bottom: 0.3rem;
      position: sticky;
      top: 0;
      background: var(--fwc-bg);
      z-index: 2;
    }

    .bracket-partidos {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 1;
      gap: 0.3rem;
    }

    /* Match card */
    .bracket-match {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--fwc-border);
      border-radius: 6px;
      overflow: hidden;
      transition: all 0.25s ease;
      animation: bracketFadeIn 0.4s ease both;
    }
    .bracket-match:hover {
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.15);
      transform: scale(1.02);
    }

    .bracket-match.final-match {
      border-color: rgba(255,215,0,0.3);
      background: rgba(255,215,0,0.05);
    }
    .bracket-match.final-match:hover {
      border-color: rgba(255,215,0,0.5);
      background: rgba(255,215,0,0.08);
    }

    .bracket-equipo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0.5rem;
      font-size: 0.65rem;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      transition: background 0.2s;
    }
    .bracket-equipo:last-child { border-bottom: none; }

    .bracket-equipo.ganador {
      background: rgba(79,195,247,0.08);
    }

    .bracket-nombre {
      color: var(--fwc-text);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }
    .bracket-equipo.ganador .bracket-nombre {
      color: var(--fwc-accent);
      font-weight: 700;
    }
    .bracket-nombre.placeholder {
      color: var(--fwc-text-dim);
      font-style: italic;
      font-size: 0.6rem;
    }

    .bracket-goles {
      color: var(--fwc-text-dim);
      font-weight: 600;
      font-size: 0.65rem;
      min-width: 18px;
      text-align: right;
    }
    .bracket-equipo.ganador .bracket-goles {
      color: var(--fwc-accent);
    }

    /* Connector lines between rounds */
    .bracket-ronda:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(79,195,247,0.15) 10%,
        rgba(79,195,247,0.15) 90%,
        transparent 100%
      );
    }

    /* Empty state */
    .llave-vacia {
      text-align: center;
      padding: 1.5rem 0.5rem;
      color: var(--fwc-text-dim);
      font-size: 0.7rem;
      line-height: 1.5;
    }
    .llave-vacia .icono-fase {
      font-size: 1.5rem;
      display: block;
      margin-bottom: 0.5rem;
      opacity: 0.5;
    }

    /* Animations */
    @keyframes bracketFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .bracket-match:nth-child(1) { animation-delay: 0.05s; }
    .bracket-match:nth-child(2) { animation-delay: 0.1s; }
    .bracket-match:nth-child(3) { animation-delay: 0.15s; }
    .bracket-match:nth-child(4) { animation-delay: 0.2s; }
    .bracket-match:nth-child(5) { animation-delay: 0.25s; }
    .bracket-match:nth-child(6) { animation-delay: 0.3s; }
    .bracket-match:nth-child(7) { animation-delay: 0.35s; }
    .bracket-match:nth-child(8) { animation-delay: 0.4s; }
    .bracket-match:nth-child(9) { animation-delay: 0.45s; }
    .bracket-match:nth-child(10) { animation-delay: 0.5s; }
    .bracket-match:nth-child(11) { animation-delay: 0.55s; }
    .bracket-match:nth-child(12) { animation-delay: 0.6s; }
    .bracket-match:nth-child(13) { animation-delay: 0.65s; }
    .bracket-match:nth-child(14) { animation-delay: 0.7s; }
    .bracket-match:nth-child(15) { animation-delay: 0.75s; }
    .bracket-match:nth-child(16) { animation-delay: 0.8s; }

    /* Champion badge */
    .campeon-badge {
      text-align: center;
      padding: 0.5rem;
      margin-top: 0.3rem;
      background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.03));
      border: 1px solid rgba(255,215,0,0.2);
      border-radius: 8px;
      animation: bracketFadeIn 0.5s ease both;
      animation-delay: 0.9s;
    }
    .campeon-badge .trofeo { font-size: 1.2rem; }
    .campeon-badge .campeon-nombre {
      font-size: 0.75rem;
      font-weight: 700;
      color: #ffd700;
      margin-top: 0.2rem;
    }

    /* ── Panel: Acerca de ── */
    .panel-acerca { padding: 1.2rem; }
    .acerca-contenido {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .acerca-header {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem;
      background: linear-gradient(135deg, rgba(79,195,247,0.1), rgba(79,195,247,0.03));
      border: 1px solid rgba(79,195,247,0.15);
      border-radius: 12px;
    }
    .acerca-logo {
      font-size: 2rem;
      animation: giroLento 10s linear infinite;
    }
    .acerca-titulo { display: flex; flex-direction: column; }
    .acerca-nombre {
      font-size: 1rem;
      font-weight: 700;
      color: var(--fwc-accent);
    }
    .acerca-creador {
      font-size: 0.75rem;
      color: var(--fwc-text-dim);
      font-weight: 500;
    }
    .acerca-seccion { display: flex; flex-direction: column; gap: 0.4rem; }
    .acerca-subtitulo {
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--fwc-text-dim);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .acerca-provider {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.4rem 0.8rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--fwc-border);
      border-radius: 8px;
      color: var(--fwc-text);
      font-size: 0.8rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }
    .acerca-provider:hover {
      background: rgba(79,195,247,0.1);
      border-color: rgba(79,195,247,0.3);
      color: var(--fwc-accent);
      transform: translateY(-1px);
    }
    .acerca-provider::after {
      content: '↗';
      font-size: 0.7rem;
      color: var(--fwc-text-dim);
    }
    .acerca-tech {
      font-size: 0.75rem;
      color: var(--fwc-text-dim);
      padding: 0.4rem 0.8rem;
      background: rgba(255,255,255,0.02);
      border-radius: 8px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.7rem;
    }
    .acerca-version {
      text-align: center;
      font-size: 0.65rem;
      color: var(--fwc-text-dim);
      padding-top: 0.5rem;
      border-top: 1px solid var(--fwc-border);
    }

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
    @media (max-width: 560px) {
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
      this._inicializarLlave();
      this._apiOk = false;
      this._dragging = false;
      this._dragOffset = { x: 0, y: 0 };
      this._dragMoved = false;
      this._desdeCache = false;
      // Collapse state
      this._colapsado = true; // start collapsed
      this._hoverActivo = false;
      this._timeoutColapsar = null;
      this._timeoutExpand = null;
      this._ultimoGoles = { local: null, visitante: null }; // track goals for animation
      // Anchor side for expand/collapse
      this._posicionLado = 'right'; // default: bottom-right
      // Snooze state
      this._snoozePendiente = null; // action pending confirmation
    }

    _inicializarLlave() {
      const ll = this._torneo.llave;
      // Guard: skip if already populated
      if (ll.treintaidosavos.length > 0) return;

      // Round of 32 — 16 matches with FIFA 2026 slot notation
      ll.treintaidosavos = [
        { local: '1A', visitante: '3C/D/E/F', fecha: '2026-06-28' },
        { local: '2B', visitante: '2E', fecha: '2026-06-28' },
        { local: '1C', visitante: '3A/B/F/H', fecha: '2026-06-28' },
        { local: '1D', visitante: '3B/E/F/I', fecha: '2026-06-29' },
        { local: '1E', visitante: '3A/B/C/D', fecha: '2026-06-29' },
        { local: '1F', visitante: '3A/B/C', fecha: '2026-06-29' },
        { local: '1G', visitante: '3C/D/E/F', fecha: '2026-06-29' },
        { local: '2H', visitante: '2G', fecha: '2026-06-30' },
        { local: '1I', visitante: '3A/B/C/D', fecha: '2026-06-30' },
        { local: '2L', visitante: '2K', fecha: '2026-06-30' },
        { local: '1J', visitante: '3I/J/K/L', fecha: '2026-06-30' },
        { local: '1K', visitante: '3G/H/I/J', fecha: '2026-07-01' },
        { local: '2F', visitante: '2J', fecha: '2026-07-01' },
        { local: '2A', visitante: '2D', fecha: '2026-07-01' },
        { local: '1B', visitante: '3A/D/E/F', fecha: '2026-07-01' },
        { local: '2C', visitante: '2I', fecha: '2026-07-02' }
      ];
      // Round of 16 — 8 matches
      ll.dieciseisavos = [
        { local: 'Ganador R32 #1', visitante: 'Ganador R32 #2', fecha: '2026-07-03' },
        { local: 'Ganador R32 #3', visitante: 'Ganador R32 #4', fecha: '2026-07-03' },
        { local: 'Ganador R32 #5', visitante: 'Ganador R32 #6', fecha: '2026-07-04' },
        { local: 'Ganador R32 #7', visitante: 'Ganador R32 #8', fecha: '2026-07-04' },
        { local: 'Ganador R32 #9', visitante: 'Ganador R32 #10', fecha: '2026-07-04' },
        { local: 'Ganador R32 #11', visitante: 'Ganador R32 #12', fecha: '2026-07-05' },
        { local: 'Ganador R32 #13', visitante: 'Ganador R32 #14', fecha: '2026-07-05' },
        { local: 'Ganador R32 #15', visitante: 'Ganador R32 #16', fecha: '2026-07-05' }
      ];
      // Quarter-finals — 4 matches
      ll.cuartos = [
        { local: 'Ganador R16 #1', visitante: 'Ganador R16 #2', fecha: '2026-07-09' },
        { local: 'Ganador R16 #3', visitante: 'Ganador R16 #4', fecha: '2026-07-09' },
        { local: 'Ganador R16 #5', visitante: 'Ganador R16 #6', fecha: '2026-07-10' },
        { local: 'Ganador R16 #7', visitante: 'Ganador R16 #8', fecha: '2026-07-10' }
      ];
      // Semi-finals — 2 matches
      ll.semis = [
        { local: 'Ganador CF #1', visitante: 'Ganador CF #2', fecha: '2026-07-14' },
        { local: 'Ganador CF #3', visitante: 'Ganador CF #4', fecha: '2026-07-15' }
      ];
      // tercerPuesto and final already have placeholder objects — not modified
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
        this._torneo = data;
        this._inicializarLlave();
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
            <span class="pelota">⚽</span>
          </div>
          <div class="idle-pill" id="idlePill">
            <span class="pelota">⚽</span>
            <span class="texto-cuenta" id="textoCuenta">Cargando...</span>
          </div>
          <div class="tarjeta" id="tarjeta">
            <div class="cabecera">
              <h2><span>🏆</span><span>${this._torneo.nombre}</span><span class="fase-badge" id="faseBadge">by raas</span></h2>
              <div class="cerrar-grupo">
                <button class="btn-snooze" id="btnSnooze" title="Opciones para no mostrar">⋯</button>
                <button class="btn-cerrar" id="btnCerrar">&times;</button>
              </div>
            </div>
            <!-- Panel de snooze (oculto por defecto) -->
            <div class="snooze-panel" id="snoozePanel">
              <div class="snooze-titulo">¿Querés que no se muestre más?</div>
              <div class="snooze-opciones">
                <button class="snooze-btn" data-action="cerrar" title="Cierra la tarjeta. Vuelve a aparecer al recargar la página.">
                  <span class="snooze-icono">✕</span>
                  <span class="snooze-texto">
                    <strong>Cerrar</strong>
                    <span class="snooze-desc">Vuelve al recargar</span>
                  </span>
                </button>
                <button class="snooze-btn" data-action="hasta-proximo" title="Oculta la tarjeta hasta que llegue la fecha del próximo partido.">
                  <span class="snooze-icono">⏰</span>
                  <span class="snooze-texto">
                    <strong>No mostrar hasta el próximo partido</strong>
                    <span class="snooze-desc">Se muestra nuevamente cuando llegue la fecha</span>
                  </span>
                </button>
                <button class="snooze-btn" data-action="nunca" title="Oculta la tarjeta permanentemente. Solo vuelve a aparecer si borras los datos del navegador.">
                  <span class="snooze-icono">🚫</span>
                  <span class="snooze-texto">
                    <strong>No mostrar más</strong>
                    <span class="snooze-desc">Permanente (se borra limpiando localStorage)</span>
                  </span>
                </button>
              </div>
              <div class="snooze-confirm" id="snoozeConfirm" style="display:none;">
                <div class="snooze-confirm-texto" id="snoozeConfirmTexto"></div>
                <div class="snooze-confirm-botones">
                  <button class="snooze-confirm-btn cancelar" id="snoozeCancelar">Cancelar</button>
                  <button class="snooze-confirm-btn confirmar" id="snoozeConfirmar">Confirmar</button>
                </div>
              </div>
            </div>
            <div class="pestanas">
              <div class="pestana activa" data-panel="proximo">Próximo</div>
              <div class="pestana" data-panel="posiciones">Posiciones</div>
              <div class="pestana" data-panel="calendario">Calendario</div>
              <div class="pestana" data-panel="eliminatorias">Eliminatorias</div>
              <div class="pestana" data-panel="acerca">Acerca de</div>
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
              <div class="panel panel-acerca" id="panel-acerca">
                <div class="acerca-contenido">
                  <div class="acerca-header">
                    <span class="acerca-logo">⚡</span>
                    <div class="acerca-titulo">
                      <div class="acerca-nombre">Equipo de Strix</div>
                      <div class="acerca-creador">by raas</div>
                    </div>
                  </div>
                  <div class="acerca-seccion">
                    <div class="acerca-subtitulo">Datos en vivo</div>
                    <a href="https://www.thesportsdb.com" target="_blank" rel="noopener" class="acerca-provider">TheSportsDB</a>
                  </div>
                  <div class="acerca-seccion">
                    <div class="acerca-subtitulo">Tecnología</div>
                    <div class="acerca-tech">Web Components · Shadow DOM · Vanilla JS</div>
                  </div>
                  <div class="acerca-version">v1.0.0 — Copa Mundial FIFA 2026</div>
                </div>
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
        apiStatus: this._shadow.getElementById('apiStatus'),
        btnSnooze: this._shadow.getElementById('btnSnooze'),
        snoozePanel: this._shadow.getElementById('snoozePanel'),
        snoozeConfirm: this._shadow.getElementById('snoozeConfirm'),
        snoozeConfirmTexto: this._shadow.getElementById('snoozeConfirmTexto'),
        snoozeCancelar: this._shadow.getElementById('snoozeCancelar'),
        snoozeConfirmar: this._shadow.getElementById('snoozeConfirmar')
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
      if (this._timeoutColapsar) clearTimeout(this._timeoutColapsar);
      if (this._timeoutExpand) clearTimeout(this._timeoutExpand);
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
          await this._mezclarDesdeTheSportsDB(data.events);
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

    async _mezclarDesdeTheSportsDB(eventosAPI) {
      for (const evt of eventosAPI) {
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

        if (!partido) continue;

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

        // Fetch timeline for live matches
        if (partido.estado === 'en-vivo' && evt.idEvent) {
          const timeline = await this._cargarTimeline(evt.idEvent);
          if (timeline) {
            partido.eventos = this._parsearTimeline(timeline, partido);
          }
        }
      }

      // Knockout pass: route API events by strRound
      for (const evt of eventosAPI) {
        const strRound = evt.strRound || '';
        const llaveKey = MAPEO_RONDAS[strRound];
        if (!llaveKey) continue;

        // Map status (same mapping as group stage)
        const strStatus = evt.strStatus || '';
        let mappedStatus = 'programado';
        if (strStatus === 'FT' || strStatus === 'AET' || strStatus === 'Pen') {
          mappedStatus = 'finalizado';
        } else if (strStatus === 'NS') {
          mappedStatus = 'programado';
        } else if (['HT', 'LIVE', '1H', '2H', 'ET', 'P'].includes(strStatus)) {
          mappedStatus = 'en-vivo';
        }

        const golLocal = parseInt(evt.intHomeScore);
        const golVisitante = parseInt(evt.intAwayScore);

        const matchData = {
          idEvent: evt.idEvent,
          local: MAPA_EQUIPOS[evt.strHomeTeam] || evt.strHomeTeam,
          visitante: MAPA_EQUIPOS[evt.strAwayTeam] || evt.strAwayTeam,
          golLocal: isNaN(golLocal) ? null : golLocal,
          golVisitante: isNaN(golVisitante) ? null : golVisitante,
          fecha: evt.dateEvent,
          sede: evt.strVenue || null,
          estado: mappedStatus
        };

        if (Array.isArray(this._torneo.llave[llaveKey])) {
          // Update existing match by idEvent or push new
          const idx = this._torneo.llave[llaveKey].findIndex(m => m.idEvent === evt.idEvent);
          if (idx >= 0) Object.assign(this._torneo.llave[llaveKey][idx], matchData);
          else this._torneo.llave[llaveKey].push(matchData);
        } else {
          // Single object (tercerPuesto, final)
          Object.assign(this._torneo.llave[llaveKey], matchData);
        }
      }

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

      // Detectar goles → animación de celebración
      this._verificarGol();

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

      // Actualizar pill de en vivo y detectar goles
      this._verificarEnVivo();
      this._verificarGol();

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

      // Snooze handlers
      r.btnSnooze.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleSnoozePanel();
      });

      this._shadow.querySelectorAll('.snooze-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._seleccionarSnooze(btn.dataset.action);
        });
      });

      r.snoozeCancelar.addEventListener('click', (e) => {
        e.stopPropagation();
        this._cancelarSnooze();
      });

      r.snoozeConfirmar.addEventListener('click', (e) => {
        e.stopPropagation();
        this._confirmarSnooze();
      });

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

      // ── Collapse/Expand handlers ──
      this._bindCollapse();
    }

    // ═══════════════════════════════════════════════════════════
    // COLLAPSE / EXPAND — auto-hide after 10s, expand on hover
    // ═══════════════════════════════════════════════════════════
    _bindCollapse() {
      const pills = [this._refs.idlePill, this._refs.livePill];

      pills.forEach(pill => {
        pill.addEventListener('mouseenter', () => this._onPillHover());
        pill.addEventListener('mouseleave', () => this._onPillLeave());
        pill.addEventListener('touchstart', () => this._onPillHover(), { passive: true });
      });

      // Start collapse timer
      this._programarColapsar();
    }

    _onPillHover() {
      // No expandir mientras se está arrastrando
      if (this._dragging) return;

      this._hoverActivo = true;
      clearTimeout(this._timeoutColapsar);

      // Expand immediately with smart direction
      this._expandir();

      // Auto-collapse after 1 minute of no hover
      clearTimeout(this._timeoutExpand);
      this._timeoutExpand = setTimeout(() => this._programarColapsar(), 60000);
    }

    _onPillLeave() {
      this._hoverActivo = false;
      // Start 10s countdown to collapse
      this._programarColapsar();
    }

    _programarColapsar() {
      // No colapsar si la tarjeta está abierta
      if (this._refs.widget.classList.contains('tarjeta-abierta')) return;
      clearTimeout(this._timeoutColapsar);
      this._timeoutColapsar = setTimeout(() => this._colapsar(), 3000);
    }

    _colapsar() {
      this._colapsado = true;
      this._refs.idlePill.classList.add('colapsado');
      this._refs.livePill.classList.add('colapsado');
    }

    _expandir() {
      this._colapsado = false;
      this._refs.idlePill.classList.remove('colapsado');
      this._refs.livePill.classList.remove('colapsado');

      // Dirección inteligente según posición en pantalla
      const rect = this.getBoundingClientRect();
      const centro = rect.left + rect.width / 2;
      const mitadPantalla = window.innerWidth / 2;
      const margenBorde = 16; // px mínimos desde el borde

      [this._refs.idlePill, this._refs.livePill].forEach(pill => {
        pill.classList.remove('expand-right', 'expand-left');
        if (centro < mitadPantalla) {
          pill.classList.add('expand-right');
        } else {
          pill.classList.add('expand-left');
        }
      });

      // Si está cerca del borde derecho, ajustar posición para que no se salga
      if (rect.right + 200 > window.innerWidth) {
        // Necesita espacio a la izquierda — usar right en vez de left
        this._posicionLado = 'right';
        this.style.left = 'auto';
        this.style.right = (window.innerWidth - rect.right) + 'px';
      } else if (rect.left < margenBorde) {
        // Está a la izquierda — usar left
        this._posicionLado = 'left';
        this.style.right = 'auto';
        this.style.left = rect.left + 'px';
      }
    }

    _colapsar() {
      this._colapsado = true;
      this._refs.idlePill.classList.add('colapsado');
      this._refs.livePill.classList.add('colapsado');

      // Restaurar posición al colapsar
      if (this._posicionLado === 'right') {
        // Mantener right, limpiar left
        this.style.left = 'auto';
      } else {
        // Mantener left, limpiar right
        this.style.right = 'auto';
      }
    }

    // Check if goals changed → trigger celebration
    _verificarGol() {
      const enVivo = this._torneo.partidos.find(m => m.estado === 'en-vivo');
      if (!enVivo) return;

      const golesActuales = { local: enVivo.golLocal, visitante: enVivo.golVisitante };
      const golesAnteriores = this._ultimoGoles;

      // Detect new goal
      if (golesActuales.local !== golesAnteriores.local || golesActuales.visitante !== golesAnteriores.visitante) {
        this._animarGol();
      }

      this._ultimoGoles = golesActuales;
    }

    _animarGol() {
      const pill = this._refs.livePill;
      pill.classList.remove('gol-animado');
      // Force reflow
      void pill.offsetHeight;
      pill.classList.add('gol-animado');

      // Expand on goal
      this._expandir();
      clearTimeout(this._timeoutExpand);
      this._timeoutExpand = setTimeout(() => this._programarColapsar(), 60000);

      // Remove animation class after it finishes
      setTimeout(() => pill.classList.remove('gol-animado'), 1500);
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

      // Colapsar durante el drag para mejor experiencia
      this._wasColapsado = this._colapsado;
      if (!this._colapsado) {
        this._colapsar();
      }

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

      // Fijar posición según el lado de la pantalla
      const rect = this.getBoundingClientRect();
      const centro = rect.left + rect.width / 2;
      const mitadPantalla = window.innerWidth / 2;

      if (centro >= mitadPantalla) {
        // Lado derecho — usar right para que el contenido fluya hacia adentro
        this._posicionLado = 'right';
        this.style.right = (window.innerWidth - rect.right) + 'px';
        this.style.left = 'auto';
      } else {
        // Lado izquierdo — usar left
        this._posicionLado = 'left';
        this.style.left = rect.left + 'px';
        this.style.right = 'auto';
      }

      // Restaurar estado después del drag
      if (!this._wasColapsado && !this._dragMoved) {
        // Era un click, no un drag — re-expandir
        this._expandir();
      }
      // Si fue un drag real, queda colapsado (el hover lo re-expandirá)
      delete this._wasColapsado;
    }

    // ═══════════════════════════════════════════════════════════
    // ABRIR / CERRAR
    // ═══════════════════════════════════════════════════════════
    _abrirTarjeta() {
      const r = this._refs;

      // Verificar snooze antes de abrir
      const snooze = this._verificarSnooze();
      if (!snooze.permitido) {
        if (snooze.razon === 'permanente') {
          console.log('[FIFA Widget] Tarjeta oculta permanentemente. Borrá localStorage para reactivar.');
        } else if (snooze.razon === 'temporal') {
          console.log(`[FIFA Widget] Tarjeta oculta hasta ${snooze.hasta.toLocaleString()}.`);
        }
        return; // No abrir
      }

      // Pausar timer de colapso mientras la tarjeta está abierta
      clearTimeout(this._timeoutColapsar);

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
        // Reanudar timer de colapso al cerrar la tarjeta
        this._programarColapsar();
      }, 300);
    }

    // ═══════════════════════════════════════════════════════════
    // SNOOZE — "No mostrar más" options
    // ═══════════════════════════════════════════════════════════

    _cacheKey() {
      return 'fifa-widget:' + (this.getAttribute('api-url') || 'default');
    }

    _verificarSnooze() {
      const key = this._cacheKey();

      // Check permanent snooze
      const permanente = localStorage.getItem(`${key}:snooze-permanente`);
      if (permanente === 'true') {
        return { permitido: false, razon: 'permanente' };
      }

      // Check until-next-match snooze
      const hasta = localStorage.getItem(`${key}:snooze-hasta`);
      if (hasta) {
        const ahora = new Date();
        const fechaLimite = new Date(hasta);
        if (ahora < fechaLimite) {
          return { permitido: false, razon: 'temporal', hasta: fechaLimite };
        }
        // Expired — clear it
        localStorage.removeItem(`${key}:snooze-hasta`);
      }

      return { permitido: true };
    }

    _guardarSnooze(accion) {
      const key = this._cacheKey();

      if (accion === 'nunca') {
        localStorage.setItem(`${key}:snooze-permanente`, 'true');
      } else if (accion === 'hasta-proximo') {
        const proximo = this._proximoPartido();
        if (proximo) {
          const fecha = new Date(proximo.fecha + 'T' + proximo.hora + ':00Z');
          localStorage.setItem(`${key}:snooze-hasta`, fecha.toISOString());
        } else {
          // No hay próximo partido — guardar 24 horas
          const manana = new Date(Date.now() + 24 * 60 * 60 * 1000);
          localStorage.setItem(`${key}:snooze-hasta`, manana.toISOString());
        }
      }
      // 'cerrar' no guarda nada
    }

    _toggleSnoozePanel() {
      const panel = this._refs.snoozePanel;
      const visible = panel.classList.toggle('visible');
      // Hide confirmation when toggling
      this._refs.snoozeConfirm.style.display = 'none';
    }

    _seleccionarSnooze(accion) {
      this._snoozePendiente = accion;
      const confirmDiv = this._refs.snoozeConfirm;
      const texto = this._refs.snoozeConfirmTexto;

      const mensajes = {
        'cerrar': '¿Cerrar la tarjeta? Volverá a aparecer al recargar la página.',
        'hasta-proximo': '¿No mostrar hasta el próximo partido? La tarjeta se ocultará hasta que llegue la fecha del próximo partido.',
        'nunca': '¿No mostrar más? La tarjeta no volverá a aparecer. Solo podés revertirlo borrando los datos del navegador (localStorage).'
      };

      texto.textContent = mensajes[accion] || '¿Confirmar acción?';
      confirmDiv.style.display = 'block';
    }

    _cancelarSnooze() {
      this._snoozePendiente = null;
      this._refs.snoozeConfirm.style.display = 'none';
    }

    _confirmarSnooze() {
      if (this._snoozePendiente) {
        this._guardarSnooze(this._snoozePendiente);
        this._snoozePendiente = null;
      }
      this._refs.snoozeConfirm.style.display = 'none';
      this._refs.snoozePanel.classList.remove('visible');
      this._cerrarTarjeta();
    }

    // Export for testing (pure functions)
    static _parseSnoozeKey(key) {
      return key;
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
      const hayGoles = partido.golLocal > 0 || partido.golVisitante > 0;

      // Highlight link — busca en YouTube los highlights del partido
      const highlightQuery = encodeURIComponent(`${partido.local} vs ${partido.visitante} highlights ${partido.fecha || ''}`);
      const highlightUrl = `https://www.youtube.com/results?search_query=${highlightQuery}`;
      const highlightBtn = hayGoles
        ? `<div style="text-align:center; padding:0.4rem 0;">
            <a href="${highlightUrl}" target="_blank" rel="noopener" class="btn-highlights">
              ▶ Ver highlights
            </a>
          </div>`
        : '';

      if (eventos.length === 0) {
        // Sin eventos detallados — mostrar resumen básico si hay goles
        if (hayGoles) {
          r.seccionEventos.style.display = 'block';
          let html = highlightBtn;
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

      r.contenidoEventos.innerHTML = highlightBtn + ordenados.map(ev => {
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
    // CARGAR + PARSEAR TIMELINE (reemplaza a _parsearDetallesGoles)
    // TheSportsDB lookuptimeline.php?id={idEvent} devuelve:
    // { timeline: [{ strTimeline, strPlayer, strAssist, intTime, strTeam, strTimelineDetail }] }
    // ═══════════════════════════════════════════════════════════

    async _cargarTimeline(idEvent) {
      try {
        const res = await fetch(API_THE_SPORTS_DB.base + '/lookuptimeline.php?id=' + idEvent);
        if (!res.ok) return null;
        const data = await res.json();
        return data.timeline || null;
      } catch (e) {
        console.warn('[FIFA Widget] Timeline no disponible:', e.message);
        return null;
      }
    }

    _parsearTimeline(timeline, partido) {
      if (!Array.isArray(timeline)) return [];

      return timeline.map(entry => {
        const type = entry.strTimeline;
        // Mapear nombre del equipo a español y emparejar contra partido
        const teamEN = entry.strTeam || '';
        const teamES = MAPA_EQUIPOS[teamEN] || teamEN;
        const equipo = (teamES === partido.local) ? partido.local :
                       (teamES === partido.visitante) ? partido.visitante :
                       teamES;

        switch (type) {
          case 'Goal':
            return {
              tipo: 'gol',
              minuto: String(entry.intTime || ''),
              jugador: entry.strPlayer || '',
              asistencia: entry.strAssist || null,
              equipo: equipo
            };
          case 'Card': {
            const isRed = /red/i.test(entry.strTimelineDetail || '');
            return {
              tipo: isRed ? 'roja' : 'amarilla',
              minuto: String(entry.intTime || ''),
              jugador: entry.strPlayer || '',
              equipo: equipo
            };
          }
          case 'subst':
            return {
              tipo: 'sustitucion',
              minuto: String(entry.intTime || ''),
              salio: entry.strPlayer || '',
              entro: entry.strAssist || '',
              equipo: equipo
            };
          default:
            return null;
        }
      }).filter(Boolean);
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
    // ELIMINATORIAS — Bracket Tree
    // ═══════════════════════════════════════════════════════════
    _renderEliminatorias() {
      const r = this._refs;
      const llave = this._torneo.llave;

      // Check if bracket is completely empty (all arrays empty, final/3rd TBD)
      const isEmpty =
        llave.treintaidosavos.length === 0 &&
        llave.dieciseisavos.length === 0 &&
        llave.cuartos.length === 0 &&
        llave.semis.length === 0 &&
        llave.tercerPuesto.local === 'Por definir' &&
        llave.final.local === 'Por definir';

      if (isEmpty) {
        r.contenidoEliminatorias.innerHTML = `
          <div class="llave-vacia">
            <span class="icono-fase">🏟️</span>
            La fase eliminatoria se definirá<br>al terminar la fase de grupos
          </div>`;
        return;
      }

      const _renderEquipo = (nombre, goles, esGanador, isPlaceholder) => {
        const cls = esGanador ? 'bracket-equipo ganador' : 'bracket-equipo';
        const nombreCls = isPlaceholder ? 'bracket-nombre placeholder' : 'bracket-nombre';
        return `<div class="${cls}">
          <span class="${nombreCls}">${nombre}</span>
          <span class="bracket-goles">${goles !== null && goles !== undefined ? goles : '-'}</span>
        </div>`;
      };

      const _renderMatch = (m, isFinal) => {
        const isPlaceholder = m.local.match(/^\d/) || m.local.includes('Ganador') || m.local === 'Por definir';
        const localGanador = m.golLocal !== null && m.golVisitante !== null && m.golLocal > m.golVisitante;
        const visitanteGanador = m.golLocal !== null && m.golVisitante !== null && m.golVisitante > m.golLocal;

        return `<div class="bracket-match ${isFinal ? 'final-match' : ''}">
          ${_renderEquipo(m.local, m.golLocal, localGanador, isPlaceholder)}
          ${_renderEquipo(m.visitante, m.golVisitante, visitanteGanador, isPlaceholder)}
        </div>`;
      };

      const _renderRonda = (partidos, titulo, isFinal) => {
        if (!partidos || (Array.isArray(partidos) && partidos.length === 0)) return '';
        const matches = Array.isArray(partidos)
          ? partidos.map(m => _renderMatch(m, false)).join('')
          : _renderMatch(partidos, isFinal);
        return `<div class="bracket-ronda">
          <div class="bracket-ronda-titulo">${titulo}</div>
          <div class="bracket-partidos">${matches}</div>
        </div>`;
      };

      // Build champion badge if final is finished
      let campeonHtml = '';
      if (llave.final.estado === 'finalizado' && llave.final.golLocal !== null) {
        const ganador = llave.final.golLocal > llave.final.golVisitante
          ? llave.final.local : llave.final.visitante;
        campeonHtml = `<div class="campeon-badge">
          <span class="trofeo">🏆</span>
          <div class="campeon-nombre">${ganador}</div>
        </div>`;
      }

      // Build bracket columns — show R32, R16, QF, SF, Final
      // Third place is shown below SF
      let html = '<div class="bracket-tree">';

      // Only show R32 if it has data
      if (llave.treintaidosavos.length > 0) {
        html += _renderRonda(llave.treintaidosavos, 'R32', false);
      }
      if (llave.dieciseisavos.length > 0) {
        html += _renderRonda(llave.dieciseisavos, 'R16', false);
      }
      if (llave.cuartos.length > 0) {
        html += _renderRonda(llave.cuartos, 'Cuartos', false);
      }
      if (llave.semis.length > 0) {
        html += _renderRonda(llave.semis, 'Semis', false);
      }

      // Final column
      html += _renderRonda(llave.final, 'Final', true);

      html += '</div>';

      // Add third place below
      if (llave.tercerPuesto.local !== 'Por definir') {
        html += `<div style="margin-top:0.5rem;">
          <div class="bracket-ronda-titulo" style="text-align:left;">Tercer Puesto</div>
          ${_renderMatch(llave.tercerPuesto, false)}
        </div>`;
      }

      // Add champion badge
      html += campeonHtml;

      r.contenidoEliminatorias.innerHTML = html;
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
        this._verificarGol();
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
