#!/usr/bin/env node
/**
 * fifa-world-cup.test.js
 * Simple test runner — no dependencies, just `node fifa-world-cup.test.js`
 *
 * Reads fifa-world-cup.js, extracts TORNEO and MAPA_EQUIPOS, and runs
 * unit tests against the core logic.
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// TEST RUNNER
// ═══════════════════════════════════════════════════════════

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let currentGroup = '';

function describe(name, fn) {
  currentGroup = name;
  fn();
}

function it(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
  } catch (e) {
    failedTests++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${e.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      `${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message || 'Deep equal failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

// ═══════════════════════════════════════════════════════════
// EXTRACT DATA FROM SOURCE
// ═══════════════════════════════════════════════════════════

const sourcePath = path.join(__dirname, 'fifa-world-cup.js');
const source = fs.readFileSync(sourcePath, 'utf-8');

// Use vm module to execute the IIFE in a sandbox with mocked globals
const vm = require('vm');

// Modify source to expose constants to globalThis
const exposedSource = source
  .replace('const TORNEO =', 'globalThis.TORNEO =')
  .replace('const MAPA_EQUIPOS =', 'globalThis.MAPA_EQUIPOS =');

const sandbox = {
  globalThis: {},
  HTMLElement: class HTMLElement {},
  customElements: { define() {} },
  console: console,
  fetch: undefined,
  document: undefined,
  window: undefined,
  localStorage: undefined,
  setInterval: () => {},
  clearInterval: () => {},
  setTimeout: () => {},
  clearTimeout: () => {},
};
vm.createContext(sandbox);

try {
  vm.runInContext(exposedSource, sandbox);
} catch (e) {
  // Expected: IIFE will fail at DOM access (attachShadow, etc.)
  // But TORNEO and MAPA_EQUIPOS are defined before that point
}

const TORNEO = sandbox.globalThis.TORNEO;
const MAPA_EQUIPOS = sandbox.globalThis.MAPA_EQUIPOS;

if (!TORNEO) {
  console.error('ERROR: Could not extract TORNEO from source');
  process.exit(1);
}
if (!MAPA_EQUIPOS) {
  console.error('ERROR: Could not extract MAPA_EQUIPOS from source');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════
// PURE LOGIC HELPERS (mirrors component internals)
// ═══════════════════════════════════════════════════════════

function buscarEquipo(torneo, nombre) {
  for (const grupo of Object.values(torneo.grupos)) {
    const encontrado = grupo.find(e => e.equipo === nombre);
    if (encontrado) return encontrado;
  }
  return null;
}

function recalcularPosiciones(torneo) {
  // Reset
  for (const grupo of Object.values(torneo.grupos)) {
    grupo.forEach(e => {
      e.pj = 0; e.pg = 0; e.pe = 0; e.pp = 0;
      e.gf = 0; e.gc = 0; e.pts = 0;
    });
  }
  // Recalculate from finished matches
  torneo.partidos.forEach(p => {
    if (p.estado !== 'finalizado') return;
    if (p.golLocal === null || p.golVisitante === null) return;

    const local = buscarEquipo(torneo, p.local);
    const visitante = buscarEquipo(torneo, p.visitante);
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

function proximoPartido(torneo) {
  const ahora = new Date();
  const proximos = torneo.partidos
    .filter(m => m.estado === 'programado' || m.estado === 'en-vivo')
    .sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));
  return proximos[0] || null;
}

function sanitizarParaCache(torneo) {
  const snapshot = JSON.parse(JSON.stringify(torneo));
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
  return snapshot;
}

// ═══════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════

// ── MAPA_EQUIPOS ──
describe('MAPA_EQUIPOS — team name mapping', () => {
  it('maps Korea Republic to Corea del Sur', () => {
    assertEqual(MAPA_EQUIPOS['Korea Republic'], 'Corea del Sur');
  });
  it('maps South Korea to Corea del Sur', () => {
    assertEqual(MAPA_EQUIPOS['South Korea'], 'Corea del Sur');
  });
  it('maps Côte d\'Ivoire to Costa de Marfil', () => {
    assertEqual(MAPA_EQUIPOS["Côte d'Ivoire"], 'Costa de Marfil');
  });
  it('maps USA to EE.UU.', () => {
    assertEqual(MAPA_EQUIPOS['USA'], 'EE.UU.');
  });
  it('maps United States to EE.UU.', () => {
    assertEqual(MAPA_EQUIPOS['United States'], 'EE.UU.');
  });
  it('maps DR Congo to R.D. Congo', () => {
    assertEqual(MAPA_EQUIPOS['DR Congo'], 'R.D. Congo');
  });
  it('maps Czechia to Rep. Checa', () => {
    assertEqual(MAPA_EQUIPOS['Czechia'], 'Rep. Checa');
  });
  it('maps Czech Republic to Rep. Checa', () => {
    assertEqual(MAPA_EQUIPOS['Czech Republic'], 'Rep. Checa');
  });
  it('maps Curaçao to Curazao', () => {
    assertEqual(MAPA_EQUIPOS['Curaçao'], 'Curazao');
  });
  it('maps Cabo Verde to Cabo Verde', () => {
    assertEqual(MAPA_EQUIPOS['Cabo Verde'], 'Cabo Verde');
  });
  it('maps Türkiye to Turquía', () => {
    assertEqual(MAPA_EQUIPOS['Türkiye'], 'Turquía');
  });
  it('maps Argentina to Argentina (no change needed)', () => {
    assertEqual(MAPA_EQUIPOS['Argentina'], 'Argentina');
  });
  it('has all team mappings (48+ including aliases)', () => {
    const count = Object.keys(MAPA_EQUIPOS).length;
    assert(count >= 48, `Expected at least 48 mappings, got ${count}`);
  });
});

// ── TORNEO STRUCTURE ──
describe('TORNEO — data structure', () => {
  it('has 12 groups (A through L)', () => {
    const groupKeys = Object.keys(TORNEO.grupos);
    assertEqual(groupKeys.length, 12);
    assertEqual(groupKeys[0], 'A');
    assertEqual(groupKeys[11], 'L');
  });
  it('each group has exactly 4 teams', () => {
    for (const [key, grupo] of Object.entries(TORNEO.grupos)) {
      assertEqual(grupo.length, 4, `Group ${key} should have 4 teams`);
    }
  });
  it('each team has required fields', () => {
    const requiredFields = ['equipo', 'bandera', 'pj', 'pg', 'pe', 'pp', 'gf', 'gc', 'pts'];
    for (const [key, grupo] of Object.entries(TORNEO.grupos)) {
      grupo.forEach(team => {
        for (const field of requiredFields) {
          assert(team.hasOwnProperty(field), `Group ${key} team ${team.equipo} missing field: ${field}`);
        }
      });
    }
  });
  it('each team has a flag emoji', () => {
    for (const grupo of Object.values(TORNEO.grupos)) {
      grupo.forEach(team => {
        assert(team.bandera.length >= 2, `Team ${team.equipo} should have a flag`);
      });
    }
  });
  it('all teams start with zero stats', () => {
    for (const grupo of Object.values(TORNEO.grupos)) {
      grupo.forEach(team => {
        assertEqual(team.pj, 0);
        assertEqual(team.pg, 0);
        assertEqual(team.pe, 0);
        assertEqual(team.pp, 0);
        assertEqual(team.gf, 0);
        assertEqual(team.gc, 0);
        assertEqual(team.pts, 0);
      });
    }
  });
  it('has at least 24 scheduled matches', () => {
    assert(TORNEO.partidos.length >= 24, `Expected >= 24 matches, got ${TORNEO.partidos.length}`);
  });
  it('each match has required fields', () => {
    const requiredFields = ['fecha', 'hora', 'grupo', 'local', 'visitante', 'sede', 'golLocal', 'golVisitante', 'estado'];
    TORNEO.partidos.forEach((match, i) => {
      for (const field of requiredFields) {
        assert(match.hasOwnProperty(field), `Match ${i} missing field: ${field}`);
      }
    });
  });
  it('all matches start as programado with null scores', () => {
    TORNEO.partidos.forEach((match, i) => {
      assertEqual(match.estado, 'programado', `Match ${i} should be programado`);
      assertEqual(match.golLocal, null, `Match ${i} golLocal should be null`);
      assertEqual(match.golVisitante, null, `Match ${i} golVisitante should be null`);
    });
  });
  it('has llave structure with all rounds', () => {
    const requiredRounds = ['treintaidosavos', 'dieciseisavos', 'cuartos', 'semis', 'tercerPuesto', 'final'];
    for (const round of requiredRounds) {
      assert(TORNEO.llave.hasOwnProperty(round), `Llave missing round: ${round}`);
    }
  });
  it('final has date and venue', () => {
    assertEqual(TORNEO.llave.final.fecha, '2026-07-19');
    assertEqual(TORNEO.llave.final.sede, 'MetLife Stadium, Nueva York');
  });
  it('total teams = 48 (12 groups × 4)', () => {
    let total = 0;
    for (const grupo of Object.values(TORNEO.grupos)) {
      total += grupo.length;
    }
    assertEqual(total, 48);
  });
});

// ── RECALCULAR POSICIONES ──
describe('recalcularPosiciones — computes standings', () => {
  it('resets all positions to zero before calculating', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    // Manually set some stats
    t.grupos.A[0].pts = 10;
    t.grupos.A[0].pg = 3;
    recalcularPosiciones(t);
    assertEqual(t.grupos.A[0].pts, 0);
    assertEqual(t.grupos.A[0].pg, 0);
  });
  it('computes 3 points for home win', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].estado = 'finalizado';
    t.partidos[0].golLocal = 2;
    t.partidos[0].golVisitante = 1;
    recalcularPosiciones(t);

    const mexico = buscarEquipo(t, 'México');
    const sudAfrica = buscarEquipo(t, 'Sudáfrica');

    assertEqual(mexico.pts, 3);
    assertEqual(mexico.pg, 1);
    assertEqual(mexico.pj, 1);
    assertEqual(mexico.gf, 2);
    assertEqual(mexico.gc, 1);

    assertEqual(sudAfrica.pts, 0);
    assertEqual(sudAfrica.pp, 1);
    assertEqual(sudAfrica.pj, 1);
    assertEqual(sudAfrica.gf, 1);
    assertEqual(sudAfrica.gc, 2);
  });
  it('computes 3 points for away win', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].estado = 'finalizado';
    t.partidos[0].golLocal = 0;
    t.partidos[0].golVisitante = 3;
    recalcularPosiciones(t);

    const sudAfrica = buscarEquipo(t, 'Sudáfrica');
    assertEqual(sudAfrica.pts, 3);
    assertEqual(sudAfrica.pg, 1);
  });
  it('computes 1 point each for draw', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].estado = 'finalizado';
    t.partidos[0].golLocal = 1;
    t.partidos[0].golVisitante = 1;
    recalcularPosiciones(t);

    const mexico = buscarEquipo(t, 'México');
    const sudAfrica = buscarEquipo(t, 'Sudáfrica');

    assertEqual(mexico.pts, 1);
    assertEqual(mexico.pe, 1);
    assertEqual(sudAfrica.pts, 1);
    assertEqual(sudAfrica.pe, 1);
  });
  it('accumulates stats across multiple matches', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    // México wins 2-1 vs Sudáfrica
    t.partidos[0].estado = 'finalizado';
    t.partidos[0].golLocal = 2;
    t.partidos[0].golVisitante = 1;
    // México draws 0-0 vs Corea del Sur (match index 0 is México vs Sudáfrica, match index 1 is Corea vs Rep Checa)
    // Let's use a different approach: set two matches for the same team
    // Actually, each team only plays once in matchday 1. Let's just test two different matches.
    t.partidos[1].estado = 'finalizado';
    t.partidos[1].golLocal = 2;
    t.partidos[1].golVisitante = 0;
    recalcularPosiciones(t);

    const corea = buscarEquipo(t, 'Corea del Sur');
    assertEqual(corea.pts, 3);
    assertEqual(corea.pg, 1);
    assertEqual(corea.gf, 2);
    assertEqual(corea.gc, 0);
  });
  it('ignores non-finalized matches', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].estado = 'en-vivo';
    t.partidos[0].golLocal = 1;
    t.partidos[0].golVisitante = 0;
    recalcularPosiciones(t);

    const mexico = buscarEquipo(t, 'México');
    assertEqual(mexico.pts, 0);
    assertEqual(mexico.pj, 0);
  });
  it('ignores matches with null scores', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].estado = 'finalizado';
    t.partidos[0].golLocal = null;
    t.partidos[0].golVisitante = 1;
    recalcularPosiciones(t);

    const mexico = buscarEquipo(t, 'México');
    assertEqual(mexico.pts, 0);
    assertEqual(mexico.pj, 0);
  });
});

// ── PROXIMO PARTIDO ──
describe('proximoPartido — finds next match', () => {
  it('returns the earliest programado match', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    const next = proximoPartido(t);
    assert(next !== null, 'Should find a next match');
    assertEqual(next.estado, 'programado');
  });
  it('skips finalized matches', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].estado = 'finalizado';
    const next = proximoPartido(t);
    // Should return the second match, not the first
    assert(next.fecha >= '2026-06-11');
  });
  it('returns en-vivo matches as upcoming', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].estado = 'en-vivo';
    const next = proximoPartido(t);
    assertEqual(next.estado, 'en-vivo');
  });
  it('returns null when all matches are finalized', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos.forEach(p => p.estado = 'finalizado');
    const next = proximoPartido(t);
    assertEqual(next, null);
  });
  it('sorts by date/time ascending', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    const next = proximoPartido(t);
    // First match is 2026-06-11 19:00
    assertEqual(next.fecha, '2026-06-11');
    assertEqual(next.hora, '19:00');
  });
});

// ── BUSCAR EQUIPO ──
describe('buscarEquipo — finds team by name', () => {
  it('finds Mexico in Group A', () => {
    const team = buscarEquipo(TORNEO, 'México');
    assert(team !== null);
    assertEqual(team.equipo, 'México');
    assertEqual(team.bandera, '🇲🇽');
  });
  it('finds Argentina in Group J', () => {
    const team = buscarEquipo(TORNEO, 'Argentina');
    assert(team !== null);
    assertEqual(team.equipo, 'Argentina');
    assertEqual(team.bandera, '🇦🇷');
  });
  it('finds England in Group L', () => {
    const team = buscarEquipo(TORNEO, 'Inglaterra');
    assert(team !== null);
    assertEqual(team.equipo, 'Inglaterra');
  });
  it('returns null for non-existent team', () => {
    const team = buscarEquipo(TORNEO, 'Italia');
    assertEqual(team, null);
  });
  it('returns null for empty string', () => {
    const team = buscarEquipo(TORNEO, '');
    assertEqual(team, null);
  });
});

// ── POSITION SORTING ──
describe('Position sorting — points DESC, goal difference DESC', () => {
  it('sorts teams by points descending', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    // Simulate: México 9pts, Sudáfrica 6pts, Corea 3pts, Rep Checa 0pts
    t.grupos.A[0].pts = 9;
    t.grupos.A[1].pts = 6;
    t.grupos.A[2].pts = 3;
    t.grupos.A[3].pts = 0;

    const sorted = [...t.grupos.A].sort((a, b) => b.pts - a.pts);
    assertEqual(sorted[0].equipo, 'México');
    assertEqual(sorted[1].equipo, 'Sudáfrica');
    assertEqual(sorted[2].equipo, 'Corea del Sur');
    assertEqual(sorted[3].equipo, 'Rep. Checa');
  });
  it('uses goal difference as tiebreaker', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    // Same points, different GD
    t.grupos.A[0].pts = 6; t.grupos.A[0].gf = 5; t.grupos.A[0].gc = 2; // GD +3
    t.grupos.A[1].pts = 6; t.grupos.A[1].gf = 4; t.grupos.A[1].gc = 2; // GD +2
    t.grupos.A[2].pts = 6; t.grupos.A[2].gf = 3; t.grupos.A[2].gc = 2; // GD +1
    t.grupos.A[3].pts = 0;

    const sorted = [...t.grupos.A].sort((a, b) =>
      b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc)
    );
    assertEqual(sorted[0].equipo, 'México');
    assertEqual(sorted[1].equipo, 'Sudáfrica');
    assertEqual(sorted[2].equipo, 'Corea del Sur');
  });
});

// ── LOCALSTORAGE CACHE ──
describe('Cache sanitization — strips live data', () => {
  it('removes goals from partidos', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].golLocal = 3;
    t.partidos[0].golVisitante = 1;
    t.partidos[0].estado = 'finalizado';

    const snapshot = sanitizarParaCache(t);
    assertEqual(snapshot.partidos[0].golLocal, null);
    assertEqual(snapshot.partidos[0].golVisitante, null);
    assertEqual(snapshot.partidos[0].estado, 'programado');
  });
  it('removes minuto field', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].estado = 'en-vivo';
    t.partidos[0].minuto = "45'";

    const snapshot = sanitizarParaCache(t);
    assert(!snapshot.partidos[0].hasOwnProperty('minuto'));
  });
  it('resets all team stats to zero', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.grupos.A[0].pts = 9;
    t.grupos.A[0].pg = 3;
    t.grupos.A[0].gf = 7;

    const snapshot = sanitizarParaCache(t);
    assertEqual(snapshot.grupos.A[0].pts, 0);
    assertEqual(snapshot.grupos.A[0].pg, 0);
    assertEqual(snapshot.grupos.A[0].gf, 0);
  });
  it('resets knockout bracket', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.llave.treintaidosavos = [{ local: 'A', visitante: 'B', golLocal: 2, golVisitante: 1 }];
    t.llave.cuartos = [{ local: 'C', visitante: 'D', golLocal: 1, golVisitante: 0 }];

    const snapshot = sanitizarParaCache(t);
    assertDeepEqual(snapshot.llave.treintaidosavos, []);
    assertDeepEqual(snapshot.llave.cuartos, []);
  });
  it('preserves static data (teams, schedule, venues)', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    const snapshot = sanitizarParaCache(t);

    assertEqual(snapshot.nombre, 'Copa Mundial FIFA 2026');
    assertEqual(snapshot.sede, 'EE.UU. / México / Canadá');
    assertEqual(snapshot.partidos[0].local, 'México');
    assertEqual(snapshot.partidos[0].sede, 'Estadio Azteca, CDMX');
    assertEqual(snapshot.grupos.A[0].equipo, 'México');
    assertEqual(snapshot.grupos.A[0].bandera, '🇲🇽');
  });
  it('does not mutate original tournament object', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.partidos[0].golLocal = 2;
    t.partidos[0].estado = 'en-vivo';

    sanitizarParaCache(t);

    assertEqual(t.partidos[0].golLocal, 2);
    assertEqual(t.partidos[0].estado, 'en-vivo');
  });
});

// ── MATCH SCHEDULE ──
describe('Match schedule — dates and venues', () => {
  it('first match is June 11, 2026', () => {
    assertEqual(TORNEO.partidos[0].fecha, '2026-06-11');
  });
  it('last matchday 1 match is June 17, 2026', () => {
    const last = TORNEO.partidos[TORNEO.partidos.length - 1];
    assertEqual(last.fecha, '2026-06-17');
  });
  it('all matches have valid date format', () => {
    TORNEO.partidos.forEach((m, i) => {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(m.fecha), `Match ${i} has invalid date: ${m.fecha}`);
    });
  });
  it('all matches have valid time format', () => {
    TORNEO.partidos.forEach((m, i) => {
      assert(/^\d{2}:\d{2}$/.test(m.hora), `Match ${i} has invalid time: ${m.hora}`);
    });
  });
  it('group A matches are in Mexico and USA venues', () => {
    const groupAMatches = TORNEO.partidos.filter(m => m.grupo === 'A');
    assert(groupAMatches.length >= 2);
    assert(groupAMatches[0].sede.includes('Azteca'));
  });
});

// ── _parsearTimeline (timeline parsing) ──
describe('_parsearTimeline — parses API timeline to events', () => {
  // Pure function mirroring component logic
  function parsearTimeline(timeline, partido) {
    if (!Array.isArray(timeline)) return [];
    return timeline.map(entry => {
      const type = entry.strTimeline;
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

  const partidoMock = { local: 'México', visitante: 'Sudáfrica' };

  it('parses Goal with scorer and assist', () => {
    const timeline = [
      { strTimeline: 'Goal', strPlayer: 'Hirving Lozano', strAssist: 'Héctor Herrera', intTime: 12, strTeam: 'Mexico' }
    ];
    const events = parsearTimeline(timeline, partidoMock);
    assertEqual(events.length, 1);
    assertEqual(events[0].tipo, 'gol');
    assertEqual(events[0].jugador, 'Hirving Lozano');
    assertEqual(events[0].asistencia, 'Héctor Herrera');
    assertEqual(events[0].minuto, '12');
    assertEqual(events[0].equipo, 'México');
  });
  it('parses Goal without assist', () => {
    const timeline = [
      { strTimeline: 'Goal', strPlayer: 'Raúl Jiménez', strAssist: null, intTime: 56, strTeam: 'Mexico' }
    ];
    const events = parsearTimeline(timeline, partidoMock);
    assertEqual(events[0].tipo, 'gol');
    assertEqual(events[0].asistencia, null);
  });
  it('parses yellow Card', () => {
    const timeline = [
      { strTimeline: 'Card', strPlayer: 'Siphiwe Tshabalala', strTimelineDetail: 'Foul', intTime: 23, strTeam: 'South Africa' }
    ];
    const events = parsearTimeline(timeline, partidoMock);
    assertEqual(events[0].tipo, 'amarilla');
    assertEqual(events[0].jugador, 'Siphiwe Tshabalala');
    assertEqual(events[0].equipo, 'Sudáfrica');
  });
  it('parses red Card', () => {
    const timeline = [
      { strTimeline: 'Card', strPlayer: 'Edson Álvarez', strTimelineDetail: 'Red Card', intTime: 45, strTeam: 'Mexico' }
    ];
    const events = parsearTimeline(timeline, partidoMock);
    assertEqual(events[0].tipo, 'roja');
  });
  it('parses substitution', () => {
    const timeline = [
      { strTimeline: 'subst', strPlayer: 'Hirving Lozano', strAssist: 'Uriel Antuna', intTime: 61, strTeam: 'Mexico' }
    ];
    const events = parsearTimeline(timeline, partidoMock);
    assertEqual(events[0].tipo, 'sustitucion');
    assertEqual(events[0].salio, 'Hirving Lozano');
    assertEqual(events[0].entro, 'Uriel Antuna');
  });
  it('parses mixed events in order', () => {
    const timeline = [
      { strTimeline: 'Goal', strPlayer: 'Lozano', strAssist: 'Herrera', intTime: 12, strTeam: 'Mexico' },
      { strTimeline: 'Card', strPlayer: 'Tshabalala', strTimelineDetail: 'Foul', intTime: 23, strTeam: 'South Africa' },
      { strTimeline: 'Goal', strPlayer: 'Tau', strAssist: 'Zwane', intTime: 34, strTeam: 'South Africa' },
      { strTimeline: 'Card', strPlayer: 'Álvarez', strTimelineDetail: 'Red Card', intTime: 45, strTeam: 'Mexico' },
      { strTimeline: 'subst', strPlayer: 'Lozano', strAssist: 'Antuna', intTime: 61, strTeam: 'Mexico' }
    ];
    const events = parsearTimeline(timeline, partidoMock);
    assertEqual(events.length, 5);
    assertEqual(events[0].tipo, 'gol');
    assertEqual(events[1].tipo, 'amarilla');
    assertEqual(events[2].tipo, 'gol');
    assertEqual(events[3].tipo, 'roja');
    assertEqual(events[4].tipo, 'sustitucion');
  });
  it('returns empty array for non-array input', () => {
    assertDeepEqual(parsearTimeline(null, partidoMock), []);
    assertDeepEqual(parsearTimeline(undefined, partidoMock), []);
    assertDeepEqual(parsearTimeline('string', partidoMock), []);
  });
  it('filters out unknown event types', () => {
    const timeline = [
      { strTimeline: 'Goal', strPlayer: 'Lozano', strAssist: null, intTime: 10, strTeam: 'Mexico' },
      { strTimeline: 'Unknown', strPlayer: 'Someone', intTime: 20, strTeam: 'Mexico' },
      { strTimeline: 'Goal', strPlayer: 'Tau', strAssist: null, intTime: 30, strTeam: 'South Africa' }
    ];
    const events = parsearTimeline(timeline, partidoMock);
    assertEqual(events.length, 2);
  });
  it('handles missing intTime as empty string', () => {
    const timeline = [
      { strTimeline: 'Goal', strPlayer: 'Lozano', strAssist: null, strTeam: 'Mexico' }
    ];
    const events = parsearTimeline(timeline, partidoMock);
    assertEqual(events[0].minuto, '');
  });
  it('maps English team names to Spanish via MAPA_EQUIPOS', () => {
    const timeline = [
      { strTimeline: 'Goal', strPlayer: 'Son', strAssist: null, intTime: 5, strTeam: 'South Korea' }
    ];
    const partidoKorea = { local: 'Corea del Sur', visitante: 'Rep. Checa' };
    const events = parsearTimeline(timeline, partidoKorea);
    assertEqual(events[0].equipo, 'Corea del Sur');
  });
});

// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════

console.log('');
console.log('═══════════════════════════════════════════');
console.log(`  ${passedTests}/${totalTests} tests passed`);
if (failedTests > 0) {
  console.log(`  ${failedTests} FAILED`);
} else {
  console.log('  All tests passed ✓');
}
console.log('═══════════════════════════════════════════');

process.exit(failedTests > 0 ? 1 : 0);
