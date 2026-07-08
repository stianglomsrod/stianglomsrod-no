# SPILL-ANALYSE — «Skamløs pitch» (Kompetansebyen)

> **UTKAST fra Fase 0-agent, 2026-07-08.** Basert på kodelesing av baseline-klonen
> `C:\Users\x_ray\kode 2026\Claude\hjemmeside\_baseline\portfolio-site\` (Next 16.2.9,
> React 19.2.4, Phaser ^3.90.0). Ingen filer i baseline er endret. Skal kvalitetssikres
> før beslutninger tas.

---

## 1. Kodekart

### Lagdeling

Alt spillrelatert ligger under `app/skamlos-rpg/` og er tydelig delt i fire lag:

| Lag | Filer | Ansvar |
|---|---|---|
| **Route/oppstart** | `page.tsx` (12 l.), `SkamlosRpgClient.tsx` (31 l.), `game/GameMount.tsx` (99 l.) | Next-side (metadata, `robots: noindex`), klient-wrapper med `next/dynamic` `ssr:false` + canvas-probe, Phaser.Game-oppsett |
| **Motor** (`game/engine/`) | `bridge.ts`, `commands.ts`, `runtime.ts`, `requirements.ts`, `save.ts`, `i18n.ts`, `audio.ts`, `config.ts`, `types.ts`, `scenes/BootScene.ts`, `scenes/WorldScene.ts`, `systems/grid.ts` — ~2 400 linjer | Gjenbrukbar, innholdsagnostisk. Alle filer merket `=== REUSABLE ENGINE ===` |
| **Innholdspakke** (`game/content/kompetansebyen/`) | 13 filer + `content/index.ts` — ~2 250 linjer | Én `ContentPack` (`pack.ts`): meta, theme/assets, tiles, maps, npcs, interactables, quests, skills, artifacts, minigames, dialogue, endgame, claims |
| **React-UI** (`game/ui/`) | 15 filer — ~1 750 linjer | `GameUI.tsx` (orkestrator, 326 l.), StartScreen, Hud, GameBox (dialog/CTA-boks), PauseMenu, MinigameModal + 3 minigames (ForLoop/GitCommit/Choice), EndgameScreen, Toasts, RewardBanner, VirtualPad, Fallback, `bell.ts` |

Pluss `skamlos-rpg.module.css` (1 345 linjer, all overlay-/route-styling).

**Størrelse totalt:** 45 filer, **~7 900 linjer** i `app/skamlos-rpg/`. I tillegg:
`scripts/build-skamlos-rpg-assets.mjs` (968 linjer — genererer *alle* pikselgrafikk-PNG-er
prosedyrelt med null avhengigheter, egen PNG-encoder på zlib+CRC32) og
`scripts/check-skamlos-content.mjs` (91 linjer, innholdsvalidering).
Assets i `public/skamlos-rpg/`: 60 små PNG-er (0,1–0,9 kB hver, tiles/props/buildings/sprites)
+ **`audio/laeringsreisen-loop.mp3` på 9,2 MB** (BGM).

### Hvor Phaser-scenen bor

- `GameMount.tsx` bygger `new Phaser.Game(makeConfig(...))` (480×320 base, `Scale.FIT`,
  arcade physics, `audio: { noAudio: true }`) og legger `pack`, `runtime`, `bridge`,
  `reducedMotion`, `startMap`/`startSpawn` i Phaser-registry. StrictMode-dobbelmontering
  håndteres med utsatt oppretting (setTimeout 0).
- `BootScene.ts` preloader assets fra `pack.assets` og definerer animasjoner.
- `WorldScene.ts` (~1 060 linjer) rendrer vilkårlig `MapDef` (char-grid-lag, ingen Tiled),
  driver bevegelse/kollisjon/interaksjon/exits/quest-markører («!»/«?» + kantpil),
  timed cue (skoleklokka) og ambient-wander (badeand, sommerfugl).

### React ↔ Phaser-kommunikasjon (bridge)

`engine/bridge.ts` er en liten typet event-bus, bevisst rammeverksfri (importerer verken
Phaser eller React). Én `GameBridge`-instans deles av begge sider:

- **Motor → UI** (`GameEvents`): `phase`, `state` (StateSnapshot), `objective`, `prompt`
  (CTA), `dialogue`, `subtitle`, `toast`, `reward`, `locked`, `bell`, `openMinigame`,
  `closeMinigame`, `endgame`, samt scene-interne `scene:loadMap`/`scene:teleport`.
- **UI → motor** (`GameCommands`): `cmd:start`, `cmd:restart`, `cmd:closeDialogue`,
  `cmd:minigameComplete`, `cmd:minigameCancel`, `cmd:setLang`, `cmd:interact`,
  `cmd:move` (virtuell D-pad, {-1,0,1}-vektorer), `cmd:pause`, `cmd:resume`.

`engine/commands.ts` (`wireCommands`) ruter UI-kommandoer til `GameRuntime`;
`WorldScene.registerBridge()` lytter på pause/resume/interact/move.
`GameRuntime` (`runtime.ts`) er autoritativ tilstandsholder: quests/skills/artifacts/flags,
`activeQuest()` (laveste `order` med oppfylt `requires`), gate-evaluering, og pusher
`StateSnapshot` til UI. `requirements.ts` er en ren evaluator (flag/allSkills/anySkills/
allQuests/and/or/not).

### Lagring (`save.ts`)

localStorage, navneromdelt per pakke: nøkkel **`skamlos-rpg:save:kompetansebyen`**.
`SaveState` inneholder: `packId`, `flags` (Record<string,boolean>), `skills[]`,
`completedQuests[]`, `artifacts[]`, `foundEggs[]`, `currentMap`, `player {x,y}`,
`facing`, `lang`. Feiler stille i privat modus. I tillegg **`skamlos:muted`** (audio.ts).
Ingen skjemaversjon i lagringen — gamle saves lastes rått etter innholdsendringer.
Kun lokale spilldata, ingen sporing/PII.

### Lyd (`audio.ts`, 443 linjer + `ui/bell.ts`)

- Phaser-lyd er avslått; alt går via WebAudio i DOM-laget (singleton `GameAudio`).
- 8 SFX syntetiseres runtime (step/door/blip/confirm/deny/reward/bell/quest) — ingen filer.
- **BGM-loop:** «Læringsreisen» (egenkomponert), lastes lazy ved første spillstart via
  `fetch` + `decodeAudioData`. Loop-punkter detekteres ved å skanne encoder-padding
  (stillhetsterskel ≈ −60 dB innen ytterste 2 s), og en ~8 ms seam-rampe legges på så
  loopen er klikkfri (`findLoopPoints`/`smoothLoopSeam`). Stoppes på `pagehide` og unmount.
- Mute persisteres; BGM fortsetter stille gjennom mutet master-bus.

### i18n (`engine/i18n.ts`, 11 linjer)

Minimal: tekster er `Loc`-objekter `{ no: string; en?: string }`; `t()`/`tList()` faller
tilbake til `no`. Språkvalg ligger i save-staten og byttes via `cmd:setLang`.
**Uavhengig av sidens egen `LanguageContext`** — spillet og siden har hver sin
NO/EN-mekanisme som ikke snakker sammen.

---

## 2. Hardkodet innhold som må bli datadrevet (Done 22)

V2-kravet: spillet leser samme kilder som siden (now.json + prosjekt-/profilinnhold) —
én sannhet. Status i baseline: **alt innhold er hardkodet i TypeScript-filer i
`content/kompetansebyen/` og delvis i UI-koden**, med reell drift mot sidens innhold.

### Duplisert mot siden (må bli datadrevet)

| Fil | Duplisert innhold | Sidens kilde i baseline |
|---|---|---|
| `content/kompetansebyen/artifacts.ts` (107 l.) | CS50x-sertifikat, Ordkryss-demo (YouTube), master OsloMet, Klar, lærerworkshop, pd-app-frontend/-backend (GitHub-lenker), porteføljeside, nikkoprogging | `components/Capacity.tsx` (CS50x-cert + pd-app-lenker), `components/Workflow.tsx` (klar/nikkoprogging/lori-frisor-repoer), `components/KlarCase.tsx` |
| — **konkret driftsbevis** | Spillet lenker cert til `https://certificates.cs50.io/0e9210d1-….pdf`; siden lenker `https://cs50.harvard.edu/certificates/0e9210d1-…`. To ulike URL-er til samme bevis | `artifacts.ts:13` vs `Capacity.tsx:40` |
| `content/kompetansebyen/skills.ts` (174 l.) | Kompetanselister (C, Python, SQL, Flask, JavaScript, HTML/CSS, web-grunnmur; Django/Vue; deltakende design; agentisk arbeidsflyt; Flutter/Dart; lokal-first) | Samme påstander i `Capacity.tsx` («Lærte grunnmuren gjennom CS50x …») og `Workflow.tsx` |
| `game/ui/EndgameScreen.tsx:18-25` | Kontaktlenker (e-post, LinkedIn, GitHub) hardkodet som `CONTACT`-konstant **i UI-koden** | `components/Contact.tsx` (identiske lenker). `endgame.ts` deklarerer `contactSource: "reuse-site-contact"`, men gjenbruket er *ikke* implementert — det er en manuell kopi |
| `content/kompetansebyen/quests.ts` (216 l.) | Faktapåstander i quest-tekster: CS50x-sluttprosjekt, OsloMet/master i digital læringsdesign, pd-app (Django+Vue), Klar, nikkoprogging | Hero/Capacity/KlarCase/Workflow |
| `content/kompetansebyen/dialogue.ts` (193 l.) | Faktabærende dialog: «CS50x dekket …»-grensene, Klar-beskrivelse («prototype, ikke ferdig plattform»), workshop-innsikter (hjelpekø, opt-in) | KlarCase/Method |
| `content/kompetansebyen/minigames.ts` (448 l.) | Outro-tekster gjentar prosjektfakta (pd-app-stack, nikkoprogging-beskrivelse, porteføljens claim-disiplin) | Workflow/Capacity |
| `content/kompetansebyen/claims.ts` (30 l.) | Claim-policy (deny-liste + boundary-tekster) som speiler sidens claim-disiplin | Sidens claim-kilder (i v2: felles claim-register) |
| `content/kompetansebyen/pack.ts` meta | `company: "Drømmejobben"`, `role: "Utvikler"` | Symbolsk mål — men navnet «Drømmejobben» gjentas i maps.ts (bygning + label + lås-tekst), quests.ts, dialogue.ts |

Merk: «Drømmejobben»-bygningen er *fiktiv* (claims.ts noterer eksplisitt «symbolsk mål,
ikke en reell arbeidsgiver») — selve bygningen kan forbli spillinnhold, men navn/rolle bør
komme fra samme profildata som siden hvis v2 gjør drømmejobb-målet konfigurerbart.

### Rent spillinnhold (kan forbli hardkodet)

- `maps.ts` (620 l.) — char-grid-kart, spawns, exits, kollisjon; `tiles.ts` (38 l.);
  `theme.ts` (89 l., palett + asset-manifest); `npcs.ts` (25 l., fiktive/kompositt-elever,
  bevisst uten ekte navn).
- Minigame-*mekanikk* (for-loop-blanks, git-commit-flyt, choice-struktur) og ren
  scenedialog uten faktapåstander (badeanda, «PC-en surrer», egg-easteregg).
- All engine-kode og UI-komponenter (unntatt `CONTACT` i EndgameScreen og
  tagline/labels i StartScreen som bør følge felles i18n/profil).

### Eksisterende validering: `scripts/check-skamlos-content.mjs`

Kjøres med `npm run check:skamlos`. Skanner alle `.ts/.tsx` under `app/skamlos-rpg/`:
1. **Stavefeil-gate (hard fail, exit 1):** «Ordryss» må aldri forekomme (skal være
   «Ordkryss»); sanity-sjekk at «Ordkryss» finnes minst ett sted.
2. **Claim-lint (kun warnings):** regex-deny-liste (senior/distribuerte systemer,
   enterprise-skala, elevresultater, «CS50x … Django»-implikasjon). `claims.ts` er
   ekskludert fra skann (definerer selv reglene); kommentarlinjer hoppes over.

**Hull:** Ingenting sjekker konsistens *mellom* spilltekst og sidetekst (URL-driften på
CS50-sertifikatet ovenfor ville aldri blitt fanget). Claim-lint failer ikke bygget.
Kommentaren i `claims.ts:5` refererer dessuten feil scriptnavn
(`scripts/check-skamlos-claims.mjs` — finnes ikke).

---

## 3. Touch/mobil-status (Done 21)

### Aktivering

`useCoarsePointer()` i `ui/VirtualPad.tsx`: aktiv når `(pointer: coarse)` matcher
(live-oppdatert via `useSyncExternalStore`) **eller** query-param `?touch` er satt
(hvilken som helst verdi — `?touch=1` fungerer; brukes for å teste med mus).
`GameUI` portalerer padden inn i `padHost`-elementet som ligger **under** spillrammen
(dekker aldri kartet); `padHost:empty { display:none }`.

### Kontroller og klikkflater

- 4-veis D-pad venstre: 3×3-grid med **52×52 px** knapper (`.padBtn`, gap 4 px) —
  opp/ned/venstre/høyre, `onPointerDown`/`Up`/`Cancel` + pointer capture; sender
  `cmd:move` som WorldScene merger med tastaturinput (identisk mekanikk).
- Rund aksjonsknapp høyre: **74×74 px** (`.actionBtn`) — «E» (snakk/undersøk), bytter til
  «▼» (neste replikk) når dialog er åpen.
- **Kravet ≥ 44×44 px: oppfylt for selve padden** (52 og 74 px).
- **Ikke oppfylt for HUD-en:** `.hudChip` (meny ☰, språk, lyd, tellere) har
  `min-height: 28px` med `padding: 6px 9px` — klart under 44 px. `GameBox`
  (dialog/CTA, tappbar) har `min-height: 58px` ✓, men CTA-modus har `min-height: 0`.
- ARIA-labels på alle pad-knapper (no/en), `role="group"`, disabled-state når
  meny/minigame er åpen, og «aldri la spilleren løpe videre»: pad-unmount/disable
  sender `{x:0, y:0}`.

### Kjente begrensninger

- Kun 4 retninger, ingen diagonal (tastatur kan diagonalt).
- Multi-touch: slippes én retningsknapp mens en annen fortsatt holdes, sendes `{0,0}` —
  bevegelsen stopper (release er global, ikke per knapp).
- Hybride enheter (fin primærpeker + touchskjerm) får ikke padden uten `?touch`.
- Startskjermens kontroll-liste er touch-tilpasset ✓, men PauseMenu-seksjonen
  «Kontroller» viser kun tastaturbindinger også på touch.

### 375 px bredde (`GameBox`-ramma / `skamlos-rpg.module.css`)

- `.canvasFrame { width: min(96vw, 980px); aspect-ratio: 3/2 }` → ved 375 px vindu:
  360×240 px ramme. Phaser `Scale.FIT` + `CENTER_BOTH` skalerer 480×320-canvasen **ned**
  (0,75×) — alt blir mindre enn native piksler; lesbarhet på skilt/labels i canvas er
  marginal, men ingen klipping.
- **Ingen horisontal scroll** (96vw + `padding: clamp(8px, 3vw, 28px)` på `.stage`).
- `@media (pointer: coarse)`: ekstra safe-area-bottom-padding; i landskap begrenses
  ramma til `min(96vw, calc((100dvh − 190px) * 1.5), 980px)` så padden får plass.
- D-pad (164 px) + aksjonsknapp (74 px) med `justify-content: space-between` passer
  innenfor 360 px `padHost`.

---

## 4. Tastatur og reduced motion

### Tastatur alene

I praksis **fullt spillbart med tastatur**:
- Start: global `Enter`-listener på StartScreen (men Spill-knappen autofokuseres ikke).
- Bevegelse: WASD + piltaster; interaksjon: E/Space (`kb.addCapture` preventDefaulter
  piler/Space/E globalt mens spillet kjører — hindrer side-scroll; grei på dedikert rute).
- Dialog: E/Space/Enter/Esc avanserer (window-listener i GameBox).
- Meny: Esc/Q/K åpner og lukker PauseMenu (pauser motoren via `cmd:pause`).
- Minigames: rene knapper/valg — fokuserbare og Enter/Space-opererbare; Esc avbryter
  (MinigameModal-listener).
- Endgame/pause/minigame-paneler: `role="dialog"`, `aria-modal="true"`, `tabIndex={-1}`
  + `focus()` ved åpning. **Men ingen fokusfelle** — Tab kan vandre ut av dialogen til
  underliggende innhold; Esc-lukk finnes for meny/minigame, ikke for endgame.

### Fokushåndtering ved montering

Ingen eksplisitt fokusflytting når spillet monteres; Phaser-canvasen tar ikke fokus
(input via window-listenere). Skjermleser-brukere får ingen beskjed om at et spill
startet — kun `Fallback` (uten canvas-støtte) er tekstlig.

### prefers-reduced-motion

Respekteres på to nivåer:
1. **JS:** `GameMount` leser `matchMedia("(prefers-reduced-motion: reduce)")` én gang
   ved montering → Phaser-registry → `WorldScene.reducedMotion` skrur av: vann-/
   ambient-animasjoner, wander/flit (and/sommerfugl), NPC-puls-tweens, interakt-glint-
   tween, avatar-bob/squash, camera shake (låst dør) og camera flash (skoleklokke).
   Kamera-fade ved kartbytte beholdes.
2. **CSS:** `@media (prefers-reduced-motion: reduce)` nuller animasjon på promptPill/
   dialogue/rewardBanner/toast/subtitle/dialogueHint.

Begrensning: JS-verdien er ikke reaktiv (endring midt i økten krever remount);
CSS-delen er reaktiv. BGM/SFX påvirkes ikke (korrekt — det er lyd, ikke bevegelse).

---

## 5. Porteringsvurdering til Astro

### Next-spesifikke avhengigheter (uttømmende)

| Avhengighet | Hvor | Erstatning i Astro |
|---|---|---|
| `next/dynamic` (`ssr:false`) | `SkamlosRpgClient.tsx:4` | Unødvendig: `client:only="react"` på øya gjør samme jobb |
| `import type { Metadata }` + App Router-side | `page.tsx` | `.astro`-side med `<meta name="robots" content="noindex, nofollow">` |
| `next/link` | `StartScreen.tsx:3`, `PauseMenu.tsx:3`, `EndgameScreen.tsx:3`, `Fallback.tsx:1` — alle bare `href="/"` | Vanlig `<a href="/">` (ingen prefetch-behov) |
| CSS-variabler `--font-geist-sans/mono` | `skamlos-rpg.module.css` (fallbacks finnes overalt) | Mappes til v2-fontene eller beholder fallback |

**Ikke brukt:** `next/image`, `next/navigation`/router, server actions, API-ruter,
env-vars (kun `process.env.NODE_ENV` for dev-kartvalidering i WorldScene — Vite
erstatter med `import.meta.env.DEV` eller la bundleren definere den).

### React-island vs. omskriving

- **React-island (anbefalt):** `@astrojs/react` + én `<SkamlosRpg client:only="react" />`
  på en egen Astro-rute. Endringsomfang: 5–6 filer (fjern next/dynamic-wrapperen, bytt
  4 Link-imports, ny .astro-side). Motor, innholdspakke, CSS-modul (Vite støtter CSS
  Modules) og Phaser er urørte. Statiske assets kopieres til `public/skamlos-rpg/`
  og scriptene (`assets:skamlos`, `check:skamlos`) flyttes med som npm-scripts.
  Hele spillet forblir client-only, så Astros SSR-fordeler tapes ikke — ruta er uansett
  en fullskjermsapplikasjon.
- **Omskrive UI-laget (frarådes):** bridge.ts er allerede rammeverksfri, så en
  Preact/vanilla-port er *mulig*, men UI-laget er ~1 750 linjer gjennomarbeidet React
  (portaler, useSyncExternalStore, fokus-håndtering). Gevinsten (mindre bundle) står
  ikke i forhold til risiko/arbeid i v2-tidslinjen.

**Anbefaling:** Porter som React-island med `client:only`, lazy-lastet bak samme
canvas-probe. Gjør Done 22-datadrivingen (seksjon 2) i samme operasjon: la pakka
importere fra v2-innholdskildene (now.json/prosjektdata) på byggetidspunkt, slik at
`ContentPack` blir generert/utledet i stedet for håndskrevet der siden eier dataene.

---

## 6. Funn/risikoer

- **HØY — Duplisert sannhet med påvist drift:** CS50-sertifikatet har to ulike URL-er
  (spill: `certificates.cs50.io/...pdf`, side: `cs50.harvard.edu/certificates/...`), og
  kontaktlenker er kopiert inn i `EndgameScreen.tsx` til tross for at `endgame.ts`
  deklarerer `contactSource: "reuse-site-contact"`. Kjernen i Done 22.
- **MIDDELS — 9,2 MB BGM-MP3** (`public/skamlos-rpg/audio/laeringsreisen-loop.mp3`).
  Lastes lazy først ved spillstart, men er tung på mobilnett; vurder re-encode
  (lavere bitrate/OGG+MP3-fallback) — loop-maskineriet i audio.ts er format-tolerant.
- **MIDDELS — HUD-klikkflater under 44 px på touch:** `.hudChip` er ~28 px høy
  (meny/språk/mute). Padden selv er OK (52/74 px), men menyen *må* nås via chippen
  på touch (Q/K/Esc finnes ikke der).
- **MIDDELS — Debug-hook i produksjon:** `window.__skamlos` (scene, runtime, pos, keys)
  settes ubetinget i `WorldScene.create` (linje ~131) — eksponerer mutérbar runtime
  globalt. Bør gates på dev.
- **MIDDELS — Ingen save-versjonering:** `SaveState` mangler skjemaversjon; endrede
  quest-id-er i v2 kan strande eksisterende localStorage-saves (spilleren blir stående
  med inkonsistent progresjon). Legg inn versjonsfelt + migrering/reset ved port.
- **LAV — Claim-lint failer ikke:** deny-listen i `check-skamlos-content.mjs` gir kun
  warnings; bare Ordkryss-stavingen er en hard gate. Ingen sjekk av samsvar spill↔side.
- **LAV — Feilreferanse i kommentar:** `claims.ts:5` peker på ikke-eksisterende
  `scripts/check-skamlos-claims.mjs` (riktig: `check-skamlos-content.mjs`).
- **LAV — Ingen fokusfelle i dialoger** (pause/minigame/endgame har initial fokus, men
  Tab kan rømme); endgame mangler Esc-lukking; StartScreen autofokuserer ikke.
- **LAV — reduced-motion ikke reaktiv i canvas-laget** (leses én gang ved mount).
- **LAV — VirtualPad multi-touch:** slipp av én retningsknapp stopper all bevegelse
  selv om en annen holdes; PauseMenu viser tastaturkontroller på touch-enheter.
- **LAV — To parallelle i18n-systemer:** spillets `Loc`/`t()` og sidens
  `LanguageContext` deler ikke språkvalg; en bruker som leser siden på engelsk starter
  spillet på norsk (pack-default). Bør kobles i v2.
- **INFO — Positivt å bevare:** rammeverksfri bridge, pakke-arkitektur (ny søknad = ny
  ContentPack), null eval i minigames (token-sammenlikning + bounded simulering),
  claim-policy som data, prosedyregenererte assets uten opphavsrettsrisiko, stille
  degradering uten canvas/localStorage/lyd, `noindex` på ruta.
