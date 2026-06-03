# FIFA World Cup 2026 Widget

A zero-dependency **Web Component** that renders a floating widget with live match countdown, standings, schedule, and knockout bracket for the FIFA World Cup 2026.

## Features

- **Zero dependencies** — vanilla JavaScript, no frameworks, no build step
- **Shadow DOM** — fully encapsulated styles, no CSS conflicts with your page
- **Floating pill** — compact countdown badge that expands into a full card on click
- **Auto-collapse** — pill collapses after 3s, expands on hover, pauses when card is open
- **Goal celebration** — animated pulse + auto-expand when a goal is scored
- **Smart positioning** — card opens left or right based on widget position, auto-adjusts near screen edges
- **Draggable** — drag the pill to any screen corner
- **Live indicator** — animated "EN VIVO" pill with score and minute during active matches
- **5 tabs**: Next Match, Standings, Schedule, Knockout Bracket, About
- **Dark / Light theme** via attribute
- **Configurable position** — 4 corners of the viewport
- **Snooze options** — hide widget until reload, next match, or permanently
- **Smart API polling** — only queries the API on match days (saves bandwidth)
- **TheSportsDB integration** — free live data, no API key required
- **Custom API endpoint** — plug in your own backend for custom data

## Quick Start

```html
<!-- 1. Load the script -->
<script src="fifa-world-cup.js"></script>

<!-- 2. Use the custom element -->
<fifa-world-cup></fifa-world-cup>
```

That's it. The widget appears as a floating pill in the bottom-right corner.

## Configuration

### HTML Attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `position` | `top-left`, `top-right`, `bottom-left`, `bottom-right` | `bottom-right` | Widget corner position |
| `theme` | `dark`, `light` | `dark` | Color theme |
| `api-url` | Any valid URL | *(uses TheSportsDB)* | Custom API endpoint for match data |
| `floating` | *(boolean attribute)* | — | Forces `position: fixed` behavior |
| `draggable` | *(boolean attribute)* | — | Allows dragging the pill to any screen position |

### Examples

```html
<!-- Top-left, light theme -->
<fifa-world-cup position="top-left" theme="light"></fifa-world-cup>

<!-- Custom API -->
<fifa-world-cup api-url="https://my-server.com/api/mundial"></fifa-world-cup>

<!-- Bottom-left, dark theme (explicit) -->
<fifa-world-cup position="bottom-left" theme="dark"></fifa-world-cup>

<!-- Draggable — arrastralo a cualquier esquina -->
<fifa-world-cup floating draggable></fifa-world-cup>
```

## JavaScript API

Once the component is registered, access it via `document.querySelector`:

```js
const widget = document.querySelector('fifa-world-cup');
```

### `actualizarPartido(index, datos)`

Manually update a match by its index in the schedule array.

```js
// Update match 0: México 2 - 1 Sudáfrica (finished)
widget.actualizarPartido(0, {
  golLocal: 2,
  golVisitante: 1,
  estado: 'finalizado'
});
```

Accepted match states:
- `'programado'` — scheduled (not yet started)
- `'en-vivo'` — live / in progress
- `'finalizado'` — finished

### `obtenerDatos()`

Returns the full tournament data object (groups, matches, bracket).

```js
const data = widget.obtenerDatos();
console.log(data.grupos.A);  // Group A standings
console.log(data.partidos);  // All matches
```

### `forzarActualizacion()`

Force an immediate API refresh (returns a Promise).

```js
await widget.forzarActualizacion();
```

## Custom API

If you provide `api-url`, the widget expects a JSON response with this shape:

```json
{
  "partidos": [
    {
      "golLocal": 2,
      "golVisitante": 1,
      "estado": "finalizado"
    }
  ],
  "grupos": {
    "A": [
      { "equipo": "México", "pj": 1, "pg": 1, "pe": 0, "pp": 0, "gf": 2, "gc": 1, "pts": 3 }
    ]
  }
}
```

The widget merges incoming data with its static tournament model. Only fields you provide are updated — the rest stays as-is.

## How It Works

### LocalStorage Caching

The widget caches **static tournament data** (groups, teams, schedule, venues, bracket structure) in `localStorage` under the key `fifa-widget-v1:{api-url}`.

| Scenario | Behavior |
|---|---|
| **No cache** | Fetches API immediately → saves static data to cache |
| **Has cache** | Loads from cache instantly → checks API every **1 hour** for updates → merges and re-saves if changes found |
| **Live match** | Polls every **60 seconds** while a match is in progress |
| **Live data is NOT cached** | Scores, match status, and minute are always fresh from the API |

This means the widget loads fast on repeat visits, only queries the API hourly for updates, and ramps up to real-time polling only when a match is actually live.

### Data Model

The widget ships with a **static tournament model** (`TORNEO`) that includes:

- **12 groups** (A–L) with 4 teams each (48 teams total)
- **24 scheduled matches** for Matchday 1 (June 11–17, 2026)
- **Knockout bracket** structure (Round of 32, Round of 16, Quarter-finals, Semi-finals, 3rd Place, Final)
- **Team name mapping** (English API names → Spanish display names)

All data is static by default and updates when:
1. The API returns live results (TheSportsDB or custom endpoint)
2. You call `actualizarPartido()` manually
3. The smart scheduler detects a match day and polls automatically

Static data (groups, schedule, teams) is cached in `localStorage` so repeat visits load instantly.

### Smart Polling

The widget adapts its polling frequency to the situation:

| Scenario | Interval |
|---|---|
| Match in progress (`en-vivo`) | Every 60 seconds |
| No live match (normal) | Every 1 hour |

When there's no cache, the first API call happens immediately on load.

### Live Detection

When a match status is `'en-vivo'`, the idle countdown pill is replaced by a green animated live pill showing the score and minute. Clicking it opens the expanded card.

Inside the card, the "Próximo" tab transforms to show:
- **Live badge** — pulsing green indicator with current minute
- **Score display** — large score between team names
- **Match events** — goals (with scorers and assists), yellow/red cards, substitutions
- Events are sorted chronologically and show which team they belong to

When detailed event data is available (from TheSportsDB or a custom API), individual goal scorers, assists, and cards are displayed. If only scores are available, a summary is shown instead.

## Tabs

| Tab | Content |
|---|---|
| **Próximo** | Countdown, next match details (teams, date, time, venue, group) |
| **Posiciones** | Group standings table with selector (PJ, PG, PE, PP, GF, GC, GD, Pts). Top 2 rows highlighted in green |
| **Calendario** | All matches grouped by date, with scores for finished/live games |
| **Eliminatorias** | Knockout bracket — shows "pending" until group stage completes |
| **Acerca de** | Credits, API provider links, tech stack info |

## Snooze Options

Click the `⋯` button next to the close button (`×`) in the card header to hide the widget:

| Option | Behavior |
|---|---|
| **Ocultar hasta recargar** | Hides widget until page reload (F5). No localStorage used. |
| **Ocultar hasta el próximo partido** | Hides until the next match date/time arrives. Uses localStorage. |
| **Ocultar permanentemente** | Hides permanently. Only reversible by clearing browser localStorage. |

## Pill Behavior

- **Auto-collapse**: Pill collapses to a small circle after 3 seconds of no hover
- **Hover**: Expands immediately, collapses after 3s when mouse leaves
- **Card open**: Collapse timer is paused, resumes when card closes
- **Goal scored**: Triggers celebration animation + auto-expand
- **Drag**: Drag the pill anywhere on screen; it remembers its position
- **Smart direction**: If widget is on the left, content flows right; if on the right, content flows left

## File Structure

```
fifa-widget/
├── fifa-world-cup.js       # Web Component (IIFE, ~2600 lines)
├── fifa-card.html          # Demo page with examples
├── fifa-demo.html          # Interactive state demo with mock data
├── fifa-world-cup.test.js  # Unit tests (129 tests, no dependencies)
└── README.md               # This file
```

## Testing

Run unit tests with no dependencies:

```bash
node fifa-world-cup.test.js
```

Tests cover (129 total):
- Team name mapping (MAPA_EQUIPOS) — 13 tests
- Tournament data structure (TORNEO) — 11 tests
- Position recalculation logic — 7 tests
- Next match finder — 5 tests
- Team search — 5 tests
- Position sorting (points + goal difference) — 2 tests
- Cache sanitization (strips live data) — 6 tests
- Match schedule validation — 5 tests
- Timeline parsing (_parsearTimeline) — 10 tests
- MAPEO_RONDAS completeness — 1 test
- Bracket initialization — 5 tests
- strRound routing — 5 tests
- Cache preservation — 3 tests
- Knockout merge integration — 6 tests
- Goal detection — 5 tests
- Collapse state logic — 4 tests
- Header badge branding — 1 test
- Acerca de tab — 5 tests
- Snooze functionality — 9 tests

## Interactive Demo

Open `fifa-demo.html` in a browser to see the widget in different states:

- **Idle** — countdown pill
- **Same day** — hours before kickoff
- **Live** — en vivo with score
- **Live with goals** — multiple live matches
- **Finished** — completed matches with recalculated standings
- **Tournament done** — all 24 matches finished
- **Light theme** — alternate color scheme
- **Top-left position** — different corner placement
- **Acerca de** — about panel with Strix branding and API provider links
- **Simulate goal** — trigger goal animation on a live match

## Browser Support

Works in any browser that supports **Custom Elements v1** and **Shadow DOM**:

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

No polyfills included. If you need IE11 support, add the `@webcomponents/custom-elements` polyfill before loading the script.

## License

MIT
