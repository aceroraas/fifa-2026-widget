# FIFA World Cup 2026 Widget

A zero-dependency **Web Component** that renders a floating widget with live match countdown, standings, schedule, and knockout bracket for the FIFA World Cup 2026.

## Features

- **Zero dependencies** — vanilla JavaScript, no frameworks, no build step
- **Shadow DOM** — fully encapsulated styles, no CSS conflicts with your page
- **Floating pill** — compact countdown badge that expands into a full card on click
- **Live indicator** — animated "EN VIVO" pill with score and minute during active matches
- **4 tabs**: Next Match, Standings, Schedule, Knockout Bracket
- **Dark / Light theme** via attribute
- **Configurable position** — 4 corners of the viewport
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

### Smart Polling

The widget doesn't waste requests:

| Scenario | Behavior |
|---|---|
| No match today | Schedules next API call for 3 hours before the next match |
| Match today | Polls every 60 seconds |
| Next match in < 3 hours | Starts polling immediately |

### Live Detection

When a match status is `'en-vivo'`, the idle countdown pill is replaced by a green animated live pill showing the score and minute. Clicking it opens the expanded card.

## Tabs

| Tab | Content |
|---|---|
| **Próximo** | Countdown, next match details (teams, date, time, venue, group) |
| **Posiciones** | Group standings table with selector (PJ, PG, PE, PP, GF, GC, GD, Pts). Top 2 rows highlighted in green |
| **Calendario** | All matches grouped by date, with scores for finished/live games |
| **Eliminatorias** | Knockout bracket — shows "pending" until group stage completes |

## File Structure

```
fifa-widget/
├── fifa-world-cup.js   # Web Component (IIFE, ~1160 lines)
├── fifa-card.html      # Demo page with examples
└── README.md           # This file
```

## Browser Support

Works in any browser that supports **Custom Elements v1** and **Shadow DOM**:

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

No polyfills included. If you need IE11 support, add the `@webcomponents/custom-elements` polyfill before loading the script.

## License

MIT
