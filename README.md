# DOOM for ServiceNow

Shareware DOOM running in a ServiceNow UI Page, with the game backed by real platform records, and a
**Doomguy** who can run around the classic UI on his own, fighting imps and blasting record links.

**[Watch the demo](docs/doomguy-autopilot.mp4)**: Doomguy on autopilot over an incident list.

* **Play Doom** (`/x_417611_doom_play.do`): the Chocolate Doom WebAssembly engine plus the shareware
  episode 1 WAD. Each run is a record; level statistics are read from the engine's own `-statdump`
  output when the run ends.
* **Custom tables** (scope `x_417611_doom`): players, runs, per-level stats, achievement definitions and
  earned achievements. A Scripted REST API (`/api/x_417611_doom/doom`) is the only writer; business rules bank
  completed runs, keep ranks current and award achievements.
* **Leaderboard**, **My runs**, **Level stats** and friends are ordinary list modules under the *Doom*
  application menu, so filtering, reporting, export and ACLs all work as normal.
* **Doomguy**: the real marine sprites and sounds, decoded from the WAD at runtime. `Ctrl+Alt+D`
  summons or dismisses him from any page. See below.

## Doomguy

Two modes, remembered per user. Switch with `Ctrl+Alt+M` or the button on **Doom > Doomguy**.

**Autopilot (default)**

* He wanders around the screen, walking or running between spots.
* Every 7 to 15 seconds a monster teleports in: imps, zombiemen, shotgun guys, demons, and now and then a
  baron of hell. He turns, shoots, and it plays its pain and death (or gib) animation. They are harmless
  and fade away.
* **Weapons drop.** Shotgun guys leave their shotgun, the baron a rocket launcher, and every 25 to 55 seconds
  a weapon is airdropped in. He walks over to grab it (ahead of blasting links), uses it until the ammo runs
  out, then falls back to the next best gun and finally the pistol.
* He walks up to **record links** in lists and forms (incident numbers, callers, anything that links to a
  record), stands off about 190 px, and shoots until it explodes into flying letters.
* Each weapon wrecks the page differently (see the table below).
* Blasting is **purely visual**. The link is hidden with an inline `visibility` style, nothing is clicked,
  edited or deleted, and it reappears (in a puff of teleport fog) after 30 seconds, when Doomguy is
  dismissed, or on a page reload.
* Pressing a movement or fire key takes over while it is held.

| Weapon | Where it comes from | What it does to the page |
|---|---|---|
| Pistol | always has it | One bullet, one **bullet hole**. A link survives a few hits, then shatters into flying letters |
| Shotgun | shotgun guys, airdrops | A spread of pellets: a cluster of holes, and it takes a link apart quickly |
| Chaingun | zombiemen (sometimes), airdrops | Rapid fire: a spray of holes across whatever it is aimed at |
| Rocket launcher | baron, airdrops | The rocket explodes: **every link in a wide blast radius is blown away at once**, leaving a scorch mark, and monsters nearby are gibbed |
| Chainsaw | demons (sometimes), airdrops | Melee: he walks right up and **shreds** a link, leaving saw cuts on whatever survives |

Doom's own marine sprite looks the same whatever he carries, so the gun he is holding is drawn over his hands. Fast guns (chaingun, chainsaw) play their sound at a throttled rate, and both run dry after a few seconds.

Bullet holes, scorch marks and saw cuts are small click-through marks laid over the page. They scroll with
the content, fade after about 90 seconds, disappear when the link they were on is blasted, and never
change the page's own elements. The shareware WAD has no plasma rifle or BFG, so there are none here.

**Manual**

* `W A S D` or arrows move him in eight directions, `Shift` runs, `Space` or `F` fires. His shots still
  blast links and monsters, but no monsters spawn.

He stays out of text fields. Steps and shots feed the achievements (*Marathon Marine*, *Trigger Happy*).
He lives in the top window, so he survives navigating between pages. Pure Next Experience pages
(such as Workspace) do not load global UI Scripts, so he does not appear there.

## Build and deploy

```bash
npm install
npx now-sdk auth --add https://<instance>.service-now.com --type oauth --alias <alias>   # once
node scripts/set-scope.mjs x_<your company code>_doom                                    # see "Scope" below
npm run build      # fetches and verifies the engine and WAD (npm run assets), then builds
npx now-sdk install --auth <alias>
```

`npm run assets` downloads `@nicejsisverycool/tizendoom@0.1.6` from npm, checks every file against
pinned SHA-256 sums, and writes gzip+base64 TypeScript modules into `src/client/generated/` (git-ignored).
The Now SDK bundles those as UI assets, about 3.3 MB for the game and 3.3 MB of source maps. It works on
Windows, macOS and Linux.

After installing, open **Doom > Play Doom** in the navigator, press **Start run**, and check that a run
appears in **Doom > All runs** with a number. Press `Ctrl+Alt+D` on any list to summon Doomguy.

> Pass `--auth <alias>` explicitly. `now-sdk install` otherwise deploys to whatever your *default*
> credential is.

### Scope

ServiceNow only lets a scoped app use the vendor prefix of the instance it is built on, so the scope has to
be `x_<company code>_doom`. This repo ships with `x_417611_doom` (the PDI it was developed on). To find your
instance's code:

```bash
npx now-sdk query sys_properties -q "name=glide.appcreator.company.code" -f value -o json --auth <alias>
```

Then rewrite every table, role, property, route and page name in one go (add `--dry-run` to preview):

```bash
node scripts/set-scope.mjs x_123456_doom
```

## Develop and test without an instance

```bash
npm test                       # autopilot brain, parser and server logic (fast, no instance)
npm run build && node dev/test-browser.mjs   # real engine, real bundles, headless Chromium (needs Playwright)
npm run dev                    # http://localhost:8080/ : fake classic UI + the real handlers
```

`dev/` runs the **real** `src/server/doom/*` handlers, and the table, business rule, REST route, property and
seed definitions read straight from the Fluent sources, on a small in-memory Glide emulator
(`dev/mock-glide.mjs`). It is only as faithful as that emulator: it is not a ServiceNow instance. Where it
was found to be more forgiving than the platform it was tightened to match (see
[Platform gotchas](#platform-gotchas)).

## How a run is scored and trusted

Score per level: kills x 100, items x 20, secrets x 500, +1000 for finishing, +2500 if kills, items and
secrets are all 100%, +10 per second under par; multiplied by skill (0.5 to 2.0).

The game executes in the player's browser, so a determined player can fake anything it reports. The server
therefore only rejects the implausible: more kills/items/secrets than the level has, levels faster than
`x_417611_doom.min_level_seconds`, unknown maps, and more game time than wall-clock time since the server created
the run. Suspect runs are `rejected` (kept for audit, never scored or ranked), or kept and flagged if
`x_417611_doom.reject_suspect_runs` is false. Do not use this leaderboard for anything that matters.

## Where things live

| | |
|---|---|
| `src/fluent/tables/` | the five tables |
| `src/fluent/acls.now.ts`, `roles.now.ts` | signed-in users read; `x_417611_doom.admin` writes; the REST API writes server-side |
| `src/server/doom/` | scoring, REST handlers, business rules, achievements |
| `src/client/` | game page (`doom.ts`), engine wrapper, Doomguy (`doomguy.ts`), WAD reader |
| `src/client/lib/autopilot.ts` | Doomguy's brain: wander, pick a target, stand off, shoot (pure logic, unit tested) |
| `src/client/lib/elements.ts` | finds and "blasts" record links across frames, then restores them |
| `src/client/lib/monsters.ts` | the monsters (imp, zombieman, shotgun guy, demon, baron) and what they drop |
| `src/client/lib/weapons.ts` | the arsenal: damage, spread, blast radius, ammo |
| `src/client/lib/pickups.ts` | weapons lying on the floor |
| `src/client/lib/decals.ts` | bullet holes, scorch marks and saw cuts |
| `src/scripts/ui-script/` | the global UI Script that loads Doomguy |
| `scripts/` | `fetch-doom-assets.mjs` (engine + WAD), `set-scope.mjs` (retarget the scope) |
| `x_417611_doom_achievement` rows | add or tune achievements without a deploy (`metric` + `threshold`) |

## Platform gotchas

Things that only showed up on a real instance, and are handled here:

* **Scope prefix** must match the instance's company code (see [Scope](#scope)); otherwise the install
  fails with an unhelpful "Unable to install third party application".
* **REST needs `X-UserToken`.** A direct UI page does not get `g_ck` for free; the client looks for it on
  its own window and then up through parent frames.
* **Server module imports need the `.ts` extension** (`import ... from './players.ts'`). The platform
  resolves modules by exact path, so extension-less relative imports fail at run time.
* **Scoped API limits:** `gs.getPreference` is not allowed in a scope (use `gs.getUser().getPreference`).
* **Scripted REST wraps the body in `{ result: ... }` itself**, so handlers pass the bare value.
* **The auto-number default must be `javascript:global.getNextObjNumberPadded();`**, and the record created
  with `newRecord()` rather than `initialize()`, or the number column stays empty.

## Known limits

* A run is banked only when it ends. Close the tab mid-level and the run is recorded as abandoned.
* Only completed levels have statistics (the engine's `-statdump` only records those).
* The engine is a singleton: *Play again* reloads the page.
* Doomguy only targets links in same-origin frames, and the 30 second respawn is not configurable.
* Verified by hand on a Brazil-release PDI: the page and assets load, the profile and runs work, and Doomguy
  runs in both modes. Finishing a level, and the resulting leaderboard and achievement flow, are covered by
  the automated tests but have not yet been exercised by hand on the instance.

## Licences

The code in this repository is licensed under the **GNU General Public License, version 2 or (at your option) any later version** (see [LICENSE](LICENSE)). That matches the engine it bundles, which is GPL-2.0-or-later (Chocolate Doom, via Cloudflare's doom-wasm). `DOOM1.WAD` is id Software's
shareware release, freely redistributable unmodified; this project reads it but never alters it, and the
sprites and sounds are decoded in the browser, not copied out of it.
