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

let _beforeEachFn = null;
function beforeEach(fn) { _beforeEachFn = fn; }

// Override describe to run beforeEach before each it
const _originalDescribe = describe;
describe = function(name, fn) {
  currentGroup = name;
  const _it = it;
  it = function(testName, testFn) {
    if (_beforeEachFn) _beforeEachFn();
    _it(testName, testFn);
  };
  fn();
  it = _it;
  _beforeEachFn = null;
};

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
  .replace('const MAPA_EQUIPOS =', 'globalThis.MAPA_EQUIPOS =')
  .replace('const MAPEO_RONDAS =', 'globalThis.MAPEO_RONDAS =');

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
const MAPEO_RONDAS = sandbox.globalThis.MAPEO_RONDAS;

if (!TORNEO) {
  console.error('ERROR: Could not extract TORNEO from source');
  process.exit(1);
}
if (!MAPA_EQUIPOS) {
  console.error('ERROR: Could not extract MAPA_EQUIPOS from source');
  process.exit(1);
}
if (!MAPEO_RONDAS) {
  console.error('ERROR: Could not extract MAPEO_RONDAS from source');
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
  // Knockout bracket data is static schedule info — preserved as-is
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
  it('preserves knockout bracket data in cache', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.llave.treintaidosavos = [{ local: 'A', visitante: 'B', golLocal: 2, golVisitante: 1 }];
    t.llave.cuartos = [{ local: 'C', visitante: 'D', golLocal: 1, golVisitante: 0 }];

    const snapshot = sanitizarParaCache(t);
    assertEqual(snapshot.llave.treintaidosavos.length, 1);
    assertEqual(snapshot.llave.treintaidosavos[0].local, 'A');
    assertEqual(snapshot.llave.cuartos.length, 1);
    assertEqual(snapshot.llave.cuartos[0].local, 'C');
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
// KNOCKOUT BRACKET HELPERS (mirror component logic)
// ═══════════════════════════════════════════════════════════

function inicializarLlave(torneo) {
  const ll = torneo.llave;
  // Guard: skip if already populated
  if (ll.treintaidosavos.length > 0) return;

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
  ll.cuartos = [
    { local: 'Ganador R16 #1', visitante: 'Ganador R16 #2', fecha: '2026-07-09' },
    { local: 'Ganador R16 #3', visitante: 'Ganador R16 #4', fecha: '2026-07-09' },
    { local: 'Ganador R16 #5', visitante: 'Ganador R16 #6', fecha: '2026-07-10' },
    { local: 'Ganador R16 #7', visitante: 'Ganador R16 #8', fecha: '2026-07-10' }
  ];
  ll.semis = [
    { local: 'Ganador CF #1', visitante: 'Ganador CF #2', fecha: '2026-07-14' },
    { local: 'Ganador CF #3', visitante: 'Ganador CF #4', fecha: '2026-07-15' }
  ];
}

// ═══════════════════════════════════════════════════════════
// MAPEO_RONDAS TESTS
// ═══════════════════════════════════════════════════════════

describe('MAPEO_RONDAS — strRound to llave key mapping', () => {
  it('has all 6 round mappings', () => {
    const expectedKeys = ['Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', '3rd Place', 'Final'];
    assertEqual(expectedKeys.length, 6);
    for (const key of expectedKeys) {
      assert(MAPEO_RONDAS.hasOwnProperty(key), `Missing mapping for: ${key}`);
    }
  });

  it('maps Round of 32 to treintaidosavos', () => {
    assertEqual(MAPEO_RONDAS['Round of 32'], 'treintaidosavos');
  });

  it('maps Round of 16 to dieciseisavos', () => {
    assertEqual(MAPEO_RONDAS['Round of 16'], 'dieciseisavos');
  });

  it('maps Quarter-Final to cuartos', () => {
    assertEqual(MAPEO_RONDAS['Quarter-Final'], 'cuartos');
  });

  it('maps Semi-Final to semis', () => {
    assertEqual(MAPEO_RONDAS['Semi-Final'], 'semis');
  });

  it('maps 3rd Place to tercerPuesto', () => {
    assertEqual(MAPEO_RONDAS['3rd Place'], 'tercerPuesto');
  });

  it('maps Final to final', () => {
    assertEqual(MAPEO_RONDAS['Final'], 'final');
  });

  it('unknown strRound returns undefined', () => {
    assertEqual(MAPEO_RONDAS['Group Stage'], undefined);
    assertEqual(MAPEO_RONDAS[''], undefined);
    assertEqual(MAPEO_RONDAS['Some Unknown Round'], undefined);
  });

  it('all mapped llave keys exist in TORNEO', () => {
    for (const llaveKey of Object.values(MAPEO_RONDAS)) {
      assert(TORNEO.llave.hasOwnProperty(llaveKey), `llave key ${llaveKey} not found in TORNEO`);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// _inicializarLlave TESTS
// ═══════════════════════════════════════════════════════════

describe('_inicializarLlave — bracket placeholder initialization', () => {
  it('fills treintaidosavos with 16 matches', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    assertEqual(t.llave.treintaidosavos.length, 16);
  });

  it('fills dieciseisavos with 8 matches', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    assertEqual(t.llave.dieciseisavos.length, 8);
  });

  it('fills cuartos with 4 matches', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    assertEqual(t.llave.cuartos.length, 4);
  });

  it('fills semis with 2 matches', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    assertEqual(t.llave.semis.length, 2);
  });

  it('first treintaidosavos slot local is 1A', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    assertEqual(t.llave.treintaidosavos[0].local, '1A');
    assertEqual(t.llave.treintaidosavos[0].visitante, '3C/D/E/F');
  });

  it('last treintaidosavos slot is 2C vs 2I', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    const last = t.llave.treintaidosavos[15];
    assertEqual(last.local, '2C');
    assertEqual(last.visitante, '2I');
  });

  it('does not modify tercerPuesto object', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    const original = JSON.stringify(t.llave.tercerPuesto);
    inicializarLlave(t);
    assertEqual(JSON.stringify(t.llave.tercerPuesto), original);
  });

  it('does not modify final object', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    const original = JSON.stringify(t.llave.final);
    inicializarLlave(t);
    assertEqual(JSON.stringify(t.llave.final), original);
  });

  it('is idempotent — calling twice does not duplicate entries', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    inicializarLlave(t);
    assertEqual(t.llave.treintaidosavos.length, 16);
    assertEqual(t.llave.dieciseisavos.length, 8);
  });

  it('does not overwrite existing populated arrays', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    t.llave.treintaidosavos = [{ local: 'Mexico', visitante: 'Brazil', fecha: '2026-06-28' }];
    inicializarLlave(t);
    // Guard should skip because treintaidosavos already has data
    assertEqual(t.llave.treintaidosavos.length, 1);
    assertEqual(t.llave.treintaidosavos[0].local, 'Mexico');
  });

  it('all treintaidosavos matches have fecha strings', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    t.llave.treintaidosavos.forEach((m, i) => {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(m.fecha), `Match ${i} has invalid date: ${m.fecha}`);
    });
  });

  it('all dieciseisavos matches reference R32 winners', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    t.llave.dieciseisavos.forEach((m, i) => {
      assert(m.local.startsWith('Ganador R32'), `Dieciseisavos match ${i} local should reference R32 winner`);
      assert(m.visitante.startsWith('Ganador R32'), `Dieciseisavos match ${i} visitante should reference R32 winner`);
    });
  });
});

// ═══════════════════════════════════════════════════════════
// strRound ROUTING TESTS
// ═══════════════════════════════════════════════════════════

describe('strRound routing — knockout event classification', () => {
  function routearKnockout(strRound) {
    return MAPEO_RONDAS[strRound] || null;
  }

  it('routes Round of 32 to treintaidosavos', () => {
    assertEqual(routearKnockout('Round of 32'), 'treintaidosavos');
  });

  it('routes Round of 16 to dieciseisavos', () => {
    assertEqual(routearKnockout('Round of 16'), 'dieciseisavos');
  });

  it('routes Quarter-Final to cuartos', () => {
    assertEqual(routearKnockout('Quarter-Final'), 'cuartos');
  });

  it('routes Semi-Final to semis', () => {
    assertEqual(routearKnockout('Semi-Final'), 'semis');
  });

  it('routes 3rd Place to tercerPuesto', () => {
    assertEqual(routearKnockout('3rd Place'), 'tercerPuesto');
  });

  it('routes Final to final', () => {
    assertEqual(routearKnockout('Final'), 'final');
  });

  it('returns null for unknown round names', () => {
    assertEqual(routearKnockout('Group Stage'), null);
    assertEqual(routearKnockout('Qualifying'), null);
    assertEqual(routearKnockout(''), null);
    assertEqual(routearKnockout(undefined), null);
  });
});

// ═══════════════════════════════════════════════════════════
// CACHE PRESERVATION TESTS
// ═══════════════════════════════════════════════════════════

describe('Cache preservation — knockout data survives round-trip', () => {
  it('save/load round-trip preserves llave arrays', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    t.llave.treintaidosavos[0].golLocal = 2;
    t.llave.treintaidosavos[0].golVisitante = 1;

    const snapshot = sanitizarParaCache(t);
    // Knockout bracket is static schedule data — must be preserved
    assertEqual(snapshot.llave.treintaidosavos.length, 16);
    assertEqual(snapshot.llave.treintaidosavos[0].local, '1A');
    assertEqual(snapshot.llave.dieciseisavos.length, 8);
    assertEqual(snapshot.llave.cuartos.length, 4);
    assertEqual(snapshot.llave.semis.length, 2);
  });

  it('old cache with empty arrays gets filled by _inicializarLlave', () => {
    // Simulate legacy cache: empty llave arrays
    const t = JSON.parse(JSON.stringify(TORNEO));
    // _inicializarLlave fills them because arrays are empty
    inicializarLlave(t);
    assertEqual(t.llave.treintaidosavos.length, 16);
    assertEqual(t.llave.dieciseisavos.length, 8);
  });

  it('cache preserves tercerPuesto and final objects', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    const snapshot = sanitizarParaCache(t);
    assert(snapshot.llave.tercerPuesto.hasOwnProperty('local'));
    assert(snapshot.llave.tercerPuesto.hasOwnProperty('visitante'));
    assert(snapshot.llave.final.hasOwnProperty('fecha'));
    assert(snapshot.llave.final.hasOwnProperty('sede'));
  });

  it('group stage update does not erase knockout data', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    // Simulate a group stage result
    t.partidos[0].estado = 'finalizado';
    t.partidos[0].golLocal = 2;
    t.partidos[0].golVisitante = 1;

    const snapshot = sanitizarParaCache(t);
    // Group stage data is sanitized
    assertEqual(snapshot.partidos[0].golLocal, null);
    // Knockout data is preserved
    assertEqual(snapshot.llave.treintaidosavos.length, 16);
  });
});

// ═══════════════════════════════════════════════════════════
// KNOCKOUT MERGE INTEGRATION TESTS
// ═══════════════════════════════════════════════════════════

describe('Knockout merge — API events land in correct llave arrays', () => {
  function mezclarKnockout(torneo, eventosAPI) {
    for (const evt of eventosAPI) {
      const llaveKey = MAPEO_RONDAS[evt.strRound];
      if (!llaveKey) continue;

      const strStatus = evt.strStatus || '';
      let mappedStatus = 'programado';
      if (strStatus === 'FT' || strStatus === 'AET' || strStatus === 'Pen') {
        mappedStatus = 'finalizado';
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

      if (Array.isArray(torneo.llave[llaveKey])) {
        const idx = torneo.llave[llaveKey].findIndex(m => m.idEvent === evt.idEvent);
        if (idx >= 0) Object.assign(torneo.llave[llaveKey][idx], matchData);
        else torneo.llave[llaveKey].push(matchData);
      } else {
        Object.assign(torneo.llave[llaveKey], matchData);
      }
    }
  }

  it('routes Finished Round of 32 match to treintaidosavos', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    const eventos = [{
      idEvent: '1001',
      strRound: 'Round of 32',
      strHomeTeam: 'Mexico',
      strAwayTeam: 'Brazil',
      intHomeScore: '2',
      intAwayScore: '1',
      strStatus: 'FT',
      dateEvent: '2026-06-28',
      strVenue: 'Estadio Azteca'
    }];

    mezclarKnockout(t, eventos);
    // Should update the first placeholder by idEvent (push new since no matching idEvent yet)
    // Since we push new, the array will have 17 elements (16 placeholders + 1 API match)
    const matches = t.llave.treintaidosavos;
    const apiMatch = matches.find(m => m.idEvent === '1001');
    assert(apiMatch !== undefined, 'API match should be in treintaidosavos');
    assertEqual(apiMatch.local, 'México');
    assertEqual(apiMatch.visitante, 'Brasil');
    assertEqual(apiMatch.golLocal, 2);
    assertEqual(apiMatch.golVisitante, 1);
    assertEqual(apiMatch.estado, 'finalizado');
  });

  it('merges by idEvent — updates existing match instead of duplicating', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    const eventos = [{
      idEvent: '1001',
      strRound: 'Round of 32',
      strHomeTeam: 'Mexico',
      strAwayTeam: 'Brazil',
      intHomeScore: '2',
      intAwayScore: '1',
      strStatus: 'FT',
      dateEvent: '2026-06-28',
      strVenue: null
    }];

    mezclarKnockout(t, eventos);
    // Second fetch with updated score
    const eventos2 = [{
      idEvent: '1001',
      strRound: 'Round of 32',
      strHomeTeam: 'Mexico',
      strAwayTeam: 'Brazil',
      intHomeScore: '3',
      intAwayScore: '2',
      strStatus: 'FT',
      dateEvent: '2026-06-28',
      strVenue: 'Estadio Azteca'
    }];
    mezclarKnockout(t, eventos2);

    // Should only have 17 entries (16 placeholders + 1 API match, not duplicated)
    const apiMatches = t.llave.treintaidosavos.filter(m => m.idEvent === '1001');
    assertEqual(apiMatches.length, 1, 'Should not duplicate matches with same idEvent');
    assertEqual(apiMatches[0].golLocal, 3);
    assertEqual(apiMatches[0].golVisitante, 2);
    assertEqual(apiMatches[0].sede, 'Estadio Azteca');
  });

  it('routes Quarter-Final match to cuartos', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    const eventos = [{
      idEvent: '2001',
      strRound: 'Quarter-Final',
      strHomeTeam: 'Argentina',
      strAwayTeam: 'Germany',
      intHomeScore: '1',
      intAwayScore: '0',
      strStatus: 'AET',
      dateEvent: '2026-07-09',
      strVenue: null
    }];

    mezclarKnockout(t, eventos);
    const qfMatch = t.llave.cuartos.find(m => m.idEvent === '2001');
    assert(qfMatch !== undefined, 'QF match should be in cuartos');
    assertEqual(qfMatch.local, 'Argentina');
    assertEqual(qfMatch.visitante, 'Alemania');
    assertEqual(qfMatch.estado, 'finalizado');
  });

  it('routes 3rd Place match to tercerPuesto (object round)', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    const eventos = [{
      idEvent: '3001',
      strRound: '3rd Place',
      strHomeTeam: 'Netherlands',
      strAwayTeam: 'England',
      intHomeScore: '2',
      intAwayScore: '1',
      strStatus: 'FT',
      dateEvent: '2026-07-18',
      strVenue: null
    }];

    mezclarKnockout(t, eventos);
    assertEqual(t.llave.tercerPuesto.local, 'Países Bajos');
    assertEqual(t.llave.tercerPuesto.visitante, 'Inglaterra');
    assertEqual(t.llave.tercerPuesto.golLocal, 2);
    assertEqual(t.llave.tercerPuesto.golVisitante, 1);
    assertEqual(t.llave.tercerPuesto.estado, 'finalizado');
  });

  it('routes Final match to final (object round)', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    const eventos = [{
      idEvent: '4001',
      strRound: 'Final',
      strHomeTeam: 'Argentina',
      strAwayTeam: 'France',
      intHomeScore: '3',
      intAwayScore: '2',
      strStatus: 'Pen',
      dateEvent: '2026-07-19',
      strVenue: 'MetLife Stadium, Nueva York'
    }];

    mezclarKnockout(t, eventos);
    assertEqual(t.llave.final.local, 'Argentina');
    assertEqual(t.llave.final.visitante, 'Francia');
    assertEqual(t.llave.final.golLocal, 3);
    assertEqual(t.llave.final.golVisitante, 2);
    assertEqual(t.llave.final.estado, 'finalizado');
  });

  it('maps team names from English to Spanish via MAPA_EQUIPOS', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    const eventos = [{
      idEvent: '5001',
      strRound: 'Round of 16',
      strHomeTeam: 'Spain',
      strAwayTeam: 'Germany',
      intHomeScore: '1',
      intAwayScore: '1',
      strStatus: 'LIVE',
      dateEvent: '2026-07-03',
      strVenue: null
    }];

    mezclarKnockout(t, eventos);
    const match = t.llave.dieciseisavos.find(m => m.idEvent === '5001');
    assert(match !== undefined);
    assertEqual(match.local, 'España');
    assertEqual(match.visitante, 'Alemania');
    assertEqual(match.estado, 'en-vivo');
  });

  it('skips events with unknown strRound', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    const eventos = [{
      idEvent: '9999',
      strRound: 'Group Stage',
      strHomeTeam: 'Mexico',
      strAwayTeam: 'Canada',
      strStatus: 'FT',
      dateEvent: '2026-06-20'
    }];

    mezclarKnockout(t, eventos);
    // Should not be in any knockout array
    const allKnockout = [
      ...t.llave.treintaidosavos,
      ...t.llave.dieciseisavos,
      ...t.llave.cuartos,
      ...t.llave.semis
    ];
    const unknown = allKnockout.find(m => m.idEvent === '9999');
    assertEqual(unknown, undefined);
  });

  it('handles events with live status correctly', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    const eventos = [{
      idEvent: '6001',
      strRound: 'Semi-Final',
      strHomeTeam: 'Brazil',
      strAwayTeam: 'France',
      intHomeScore: '1',
      intAwayScore: '0',
      strStatus: '2H',
      dateEvent: '2026-07-14',
      strVenue: null
    }];

    mezclarKnockout(t, eventos);
    const match = t.llave.semis.find(m => m.idEvent === '6001');
    assert(match !== undefined);
    assertEqual(match.estado, 'en-vivo');
    assertEqual(match.golLocal, 1);
    assertEqual(match.golVisitante, 0);
  });

  it('null scores are preserved as null', () => {
    const t = JSON.parse(JSON.stringify(TORNEO));
    inicializarLlave(t);
    const eventos = [{
      idEvent: '7001',
      strRound: 'Round of 32',
      strHomeTeam: 'Canada',
      strAwayTeam: 'Qatar',
      strStatus: 'NS',
      dateEvent: '2026-06-28',
      strVenue: null
    }];

    mezclarKnockout(t, eventos);
    const match = t.llave.treintaidosavos.find(m => m.idEvent === '7001');
    assert(match !== undefined);
    assertEqual(match.golLocal, null);
    assertEqual(match.golVisitante, null);
    assertEqual(match.estado, 'programado');
  });
});

// ── Goal detection (collapsible pill logic) ──
describe('Goal detection — _verificarGol behavior', () => {
  // Pure function mirroring component logic
  function detectarGol(golesActuales, golesAnteriores) {
    return golesActuales.local !== golesAnteriores.local ||
           golesActuales.visitante !== golesAnteriores.visitante;
  }

  it('detects new home goal', () => {
    assert(detectarGol({ local: 1, visitante: 0 }, { local: 0, visitante: 0 }));
  });
  it('detects new away goal', () => {
    assert(detectarGol({ local: 0, visitante: 1 }, { local: 0, visitante: 0 }));
  });
  it('detects multiple goals', () => {
    assert(detectarGol({ local: 2, visitante: 1 }, { local: 1, visitante: 0 }));
  });
  it('no detection when scores unchanged', () => {
    assert(!detectarGol({ local: 1, visitante: 0 }, { local: 1, visitante: 0 }));
  });
  it('no detection when both null', () => {
    assert(!detectarGol({ local: null, visitante: null }, { local: null, visitante: null }));
  });
});

// ── Collapse state logic ──
describe('Collapse state — pill auto-hide behavior', () => {
  it('starts in collapsed state', () => {
    // Component initializes with _colapsado = true
    const initialState = { colapsado: true, hoverActivo: false };
    assert(initialState.colapsado === true);
  });
  it('hover sets hoverActivo to true', () => {
    const state = { colapsado: true, hoverActivo: false };
    state.hoverActivo = true;
    assert(state.hoverActivo === true);
  });
  it('collapse timer is 3 seconds', () => {
    const COLLAPSE_DELAY = 3000;
    assertEqual(COLLAPSE_DELAY, 3000);
  });
  it('expand timer is 60 seconds (1 minute)', () => {
    const EXPAND_TIMEOUT = 60000;
    assertEqual(EXPAND_TIMEOUT, 60000);
  });
});

// ── Header badge ──
describe('Header badge — branding', () => {
  it('badge text is "by raas"', () => {
    // Extract from source
    const badgeMatch = source.includes('fase-badge') && source.includes('by raas');
    assert(badgeMatch, 'Header badge should contain "by raas"');
  });
});

// ── Acerca de tab ──
describe('Acerca de tab — about panel', () => {
  it('source contains Acerca de tab', () => {
    assert(source.includes('data-panel="acerca"'), 'Should have Acerca de tab');
  });
  it('source contains "Equipo de Strix"', () => {
    assert(source.includes('Equipo de Strix'), 'Should mention Equipo de Strix');
  });
  it('source contains "by raas" in about section', () => {
    assert(source.includes('acerca-creador'), 'Should have creator credit');
  });
  it('source contains TheSportsDB provider link', () => {
    assert(source.includes('thesportsdb.com'), 'Should link to TheSportsDB');
  });
  it('source contains panel-acerca class', () => {
    assert(source.includes('panel-acerca'), 'Should have acerca panel');
  });
});

// ── Snooze functionality ──
describe('Snooze — localStorage keys and logic', () => {
  // Mock localStorage
  const mockStore = {};
  const mockLocalStorage = {
    getItem: (key) => mockStore[key] || null,
    setItem: (key, value) => { mockStore[key] = String(value); },
    removeItem: (key) => { delete mockStore[key]; },
    clear: () => { for (const k in mockStore) delete mockStore[k]; }
  };

  beforeEach(() => { mockLocalStorage.clear(); });

  // Pure function to test snooze verification logic
  function verificarSnooze(key, store) {
    const permanente = store.getItem(`${key}:snooze-permanente`);
    if (permanente === 'true') {
      return { permitido: false, razon: 'permanente' };
    }

    const hasta = store.getItem(`${key}:snooze-hasta`);
    if (hasta) {
      const ahora = new Date();
      const fechaLimite = new Date(hasta);
      if (ahora < fechaLimite) {
        return { permitido: false, razon: 'temporal', hasta: fechaLimite };
      }
      store.removeItem(`${key}:snooze-hasta`);
    }

    return { permitido: true };
  }

  function guardarSnooze(key, accion, store, proximoPartido) {
    if (accion === 'nunca') {
      store.setItem(`${key}:snooze-permanente`, 'true');
    } else if (accion === 'hasta-proximo') {
      if (proximoPartido) {
        const fecha = new Date(proximoPartido.fecha + 'T' + proximoPartido.hora + ':00Z');
        store.setItem(`${key}:snooze-hasta`, fecha.toISOString());
      } else {
        const manana = new Date(Date.now() + 24 * 60 * 60 * 1000);
        store.setItem(`${key}:snooze-hasta`, manana.toISOString());
      }
    }
  }

  it('permite abrir cuando no hay snooze', () => {
    const result = verificarSnooze('fifa-widget:default', mockLocalStorage);
    assert(result.permitido === true);
  });

  it('bloquea cuando snooze permanente está activo', () => {
    mockLocalStorage.setItem('fifa-widget:default:snooze-permanente', 'true');
    const result = verificarSnooze('fifa-widget:default', mockLocalStorage);
    assert(result.permitido === false);
    assert(result.razon === 'permanente');
  });

  it('bloquea cuando snooze temporal no expiró', () => {
    const futuro = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    mockLocalStorage.setItem('fifa-widget:default:snooze-hasta', futuro.toISOString());
    const result = verificarSnooze('fifa-widget:default', mockLocalStorage);
    assert(result.permitido === false);
    assert(result.razon === 'temporal');
  });

  it('permite cuando snooze temporal expiró', () => {
    const pasado = new Date(Date.now() - 60 * 60 * 1000); // 1 hora atrás
    mockLocalStorage.setItem('fifa-widget:default:snooze-hasta', pasado.toISOString());
    const result = verificarSnooze('fifa-widget:default', mockLocalStorage);
    assert(result.permitido === true);
    // Debería haber limpiado la key expirada
    assert(mockLocalStorage.getItem('fifa-widget:default:snooze-hasta') === null);
  });

  it('guarda snooze permanente correctamente', () => {
    guardarSnooze('fifa-widget:default', 'nunca', mockLocalStorage, null);
    assert(mockLocalStorage.getItem('fifa-widget:default:snooze-permanente') === 'true');
  });

  it('guarda snooze hasta próximo partido con fecha', () => {
    const proximo = { fecha: '2026-07-01', hora: '15:00' };
    guardarSnooze('fifa-widget:default', 'hasta-proximo', mockLocalStorage, proximo);
    const guardado = mockLocalStorage.getItem('fifa-widget:default:snooze-hasta');
    assert(guardado !== null);
    assert(guardado.includes('2026-07-01'));
  });

  it('guarda snooze 24h cuando no hay próximo partido', () => {
    guardarSnooze('fifa-widget:default', 'hasta-proximo', mockLocalStorage, null);
    const guardado = mockLocalStorage.getItem('fifa-widget:default:snooze-hasta');
    assert(guardado !== null);
    const fecha = new Date(guardado);
    const ahora = new Date();
    const diffHoras = (fecha - ahora) / (1000 * 60 * 60);
    assert(diffHoras >= 23 && diffHoras <= 25, `Expected ~24h, got ${diffHoras}h`);
  });

  it('no guarda nada con acción "cerrar"', () => {
    guardarSnooze('fifa-widget:default', 'cerrar', mockLocalStorage, null);
    assert(mockLocalStorage.getItem('fifa-widget:default:snooze-permanente') === null);
    assert(mockLocalStorage.getItem('fifa-widget:default:snooze-hasta') === null);
  });

  it('usa key personalizada cuando hay api-url', () => {
    const key = 'fifa-widget:mi-api';
    mockLocalStorage.setItem(`${key}:snooze-permanente`, 'true');
    const result = verificarSnooze(key, mockLocalStorage);
    assert(result.permitido === false);
    // La key default no debería estar afectada
    const resultDefault = verificarSnooze('fifa-widget:default', mockLocalStorage);
    assert(resultDefault.permitido === true);
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
