# DOOM for ServiceNow

Shareware DOOM running in a ServiceNow UI Page, with the game backed by real platform records, and a
**Doomguy** you can switch on and off who runs around the classic UI.

* **Play Doom** (`/x_doom_play.do`): the Chocolate Doom WebAssembly engine plus the shareware
  episode 1 WAD. Each run is a record; level statistics are read from the engine's own `-statdump`
  output when the run ends.
* **Custom tables** (scope `x_doom`): players, runs, per-level stats, achievement definitions and
  earned achievements. A Scripted REST API (`/api/x_doom/doom`) is the only writer; business rules bank
  completed runs, keep ranks current and award achievements.
* **Leaderboard**, **My runs**, **Level stats** and friends are ordinary list modules under the *Doom*
  application menu, so filtering, reporting, export and ACLs all work as normal.
* **Doomguy**: the real marine sprites and sounds, decoded from the WAD at runtime. `Ctrl+Alt+D`
  summons or dismisses him from any page. WASD or arrows move him in eight directions, `Shift` runs,
  `Space` or `F` fires. His steps and shots feed achievements.

## Build and deploy

```bash
npm install
npx now-sdk auth --add https://<instance>.service-now.com --type basic   # once
npm run build      # fetches and verifies the engine and WAD (npm run assets), then builds
npm run deploy
```

`npm run assets` downloads `@nicejsisverycool/tizendoom@0.1.6` from npm, checks every file against
pinned SHA-256 sums, and writes gzip+base64 TypeScript modules into `src/client/generated/` (git-ignored).
The Now SDK bundles those as UI assets, about 3.3 MB for the game and 3.3 MB of source maps.

### Deploying from a machine that already has `now-sdk` set up

```bash
git clone <repo> && cd <repo> && git checkout claude/doom-for-servicenow
npm install
npm test                 # optional, no instance needed
npm run build            # needs npm access once, to fetch and verify the engine and WAD
npm run deploy           # uses your existing now-sdk auth, or the now-sdk MCP server's deploy tool
```

After installing, open **Doom > Play Doom** in the navigator. Check that the engine loads, a run appears
in **Doom > All runs**, and `Ctrl+Alt+D` summons Doomguy on a form or list.

## Develop and test without an instance

```bash
npm test                       # parser and server logic (fast)
npm run build && node dev/test-browser.mjs   # real engine, real bundles, headless Chromium
npm run dev                    # http://localhost:8080/ : fake classic UI + the real handlers
```

`dev/` runs the **real** `src/server/doom/*` handlers, and the table, business rule, REST route, property and
seed definitions read straight from the Fluent sources, on a small in-memory Glide emulator
(`dev/mock-glide.mjs`). It is only as faithful as that emulator: it is not a ServiceNow instance.

## How a run is scored and trusted

Score per level: kills x 100, items x 20, secrets x 500, +1000 for finishing, +2500 if kills, items and
secrets are all 100%, +10 per second under par; multiplied by skill (0.5 to 2.0).

The game executes in the player's browser, so a determined player can fake anything it reports. The server
therefore only rejects the implausible: more kills/items/secrets than the level has, levels faster than
`x_doom.min_level_seconds`, unknown maps, and more game time than wall-clock time since the server created
the run. Suspect runs are `rejected` (kept for audit, never scored or ranked), or kept and flagged if
`x_doom.reject_suspect_runs` is false. Do not use this leaderboard for anything that matters.

## Where things live

| | |
|---|---|
| `src/fluent/tables/` | the five tables |
| `src/fluent/acls.now.ts`, `roles.now.ts` | signed-in users read; `x_doom.admin` writes; the REST API writes server-side |
| `src/server/doom/` | scoring, REST handlers, business rules, achievements |
| `src/client/` | game page (`doom.ts`), engine wrapper, Doomguy (`doomguy.ts`), WAD reader |
| `src/scripts/ui-script/` | the global UI Script that loads Doomguy |
| `x_doom_achievement` rows | add or tune achievements without a deploy (`metric` + `threshold`) |

## Known limits

* **Not yet run on a live instance.** Everything was verified locally (above). First-deploy things worth
  checking: that `/uxasset/externals/x_doom/*.jsdbx` assets load, that the instance CSP allows the
  inline-injected engine script, and that `g_ck` is available on the direct UI pages.
* A run is banked only when it ends. Close the tab mid-level and the run is recorded as abandoned.
* Only completed levels have statistics (the engine's `-statdump` only records those).
* Doomguy appears wherever the global UI Script runs: forms, lists and UI pages in the classic UI and the
  content frames of Next Experience. Pure Next Experience pages (such as Workspace) do not load global UI
  Scripts, so he will not appear there.
* The engine is a singleton: *Play again* reloads the page.

## Licences

The engine is GPL-2.0-or-later (Chocolate Doom, via Cloudflare's doom-wasm). `DOOM1.WAD` is id Software's
shareware release, freely redistributable unmodified; this project reads it but never alters it, and the
sprites and sounds are decoded in the browser, not copied out of it.
