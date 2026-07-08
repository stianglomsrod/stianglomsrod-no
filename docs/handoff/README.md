# Handoff: stianglomsrod.no v2 — styling guide

## Oversikt
Komplett designsystem for Stian Glomsrøds personlige nettside: en utviklerportefølje som er «et kjørende program, ikke en brosjyre». Siden skal (1) vise at Stian aktivt søker utvikler/UX-jobb, (2) fungere som playground for agentisk KI og ny web-teknologi, og (3) bevise alt den påstår ett klikk unna. Merkevare: ærlighet fremfor overselging; tørr, nerdete humor.

## Om designfilene
Filene i denne mappa er **designreferanser laget i HTML** — prototyper som viser tilsiktet utseende og oppførsel, ikke produksjonskode. Oppgaven er å **gjenskape designet i valgt målmiljø**. Stackvalg er bevisst åpent (avgjøres i PRD/goal-loop); kravene er cookiefritt, Lighthouse ≥ 95 i alle kategorier og WCAG 2.1 AA. Systemet er designet for å klare dette: 3 selvhostede fonter, ren CSS, minimal JS.

## Presedens (viktig)
- **`Endelig Guide v2.dc.html` er kanonisk** for: mørk modus (standard), hero, navnetrekk, ticker, badges, portrett, man-side, tilgjengelig-kort, nav, skjema, respons, motion.
- **`Endelig Guide v1.dc.html` (vedlegg) gjelder KUN for**: dagmodus-tokens (papirtemaet, §02), modul B korrektur-dialekt (§07), sjekklista (§09) og kontrastdokumentasjonen for lys modus.
- `tokens.css` er den maskinlesbare fasiten for alle verdier. Ved konflikt: tokens.css > v2 > v1.

## Fidelity
**Hi-fi for stilsystemet**: farger, typografi, spacing, radius, komponentutseende og tilstander skal gjenskapes nøyaktig (verdier i tokens.css).
**Lo-fi for innhold**: all tekst/data i guidene er sample (commit-meldinger, «353 contributions», «uke 7/12»). Endelig tekstinnhold er utenfor scope og leveres separat. Levende data hentes fra API-ene under.

## Sider (informasjonsarkitektur fra briefen)
1. **Forside** — hero (låst spec, se under) + 2–3 utvalgte bevis (case-kort)
2. **Prosjekter** — case-kort: problem → innsikt → valg → resultat → læring. Klar er hovedcase (demo + video); deretter Companion, Lori Frisør (krever skriftlig kundegodkjenning FØR navn/skjermbilder brukes), Figma-prototyper
3. **Læringsreisen** — CHANGELOG-format: kuraterte milepæler + levende commit-feed + contribution-heatmap. Korrektur-dialekt (modul B) er lov KUN her + i kolofonen
4. **/sandbox** — eksperimenter. Hue-parameteren bor her (og på 404)
5. **Slik jobber jeg** — README-format: goals / guardrails / human_review
6. **Kolofon** — hvordan siden ble bygget, tilgjengelighetserklæring, personvern
7. **Om/kontakt** — kort; portrett + man-siden STIAN(1) + kontaktskjema
8. **404** — leken robot (arver hue-parameteren)

## Hero (LÅST spec — briefens §5, verifiserbare krav)
- Kodeblokk med eksakt innhold (se v2 §04 hero) — engelsk kode, norske `// TODO:`-kommentarer
- `lærProgrammering()` og `lærKI()` klikkbare + tastatur → ekspanderer «nå:»-status med `aria-expanded`
- «nå:»-data: `now.json` (manuelt felt) + GitHub API (siste commit), cachet — kan aldri bli stale
- Terminal: `dev@null MINGW64 ~/src (HEAD detached)` + `$ jobb` → `Promise { <pending> }`
- `<pending>` er klikkbar og er sidens **primære CTA** → kontaktskjema («resolve promisen»)
- Blinkende blokk-markør etter siste prompt (1.06s steps(2); reduced motion → statisk)
- Skjult semantisk H1 i klartekst for skjermlesere; synlig fokus; full tastaturnav
- Navnetrekk: «stian glomsrød.» i Anybody 900, clamp(52px, 8.5vw, 96px), line-height 1.05, bredde-akse scroll-drevet (CSS scroll-driven animations; fallback hover; reduced motion → statisk wdth 100). Grønt punktum.

## Interaksjoner og oppførsel
- **Trykk-tilstand (modul A, hele siden)**: knapper har `box-shadow: 0 2px 0` og presses ned 2px ved :active (80ms). Fungerer med reduced motion (skiftet beholdes uten transition)
- **Ticker**: 30s lineær loop av now.json + GitHub-data; pauser ved hover/fokus; statisk ved reduced motion
- **Puls-dot** («tilgjengelig nå»): 2.4s, maks 9px radius; statisk grønn ved reduced motion
- **Intro-sekvens** (< 600ms totalt): 0ms tekst + terminal (LCP) → 120ms badges staggered → 280ms navnetrekk wdth 60→basis → 480ms ticker/puls. Reduced motion: alt ferdig ved 0ms
- **Badges**: kun `status` og `build` har grønn fylling; resten outline (#3a4553). Grønn = alltid «aktiv/åpen»
- **Kontaktskjema**: navn (valgfri), e-post (påkrevd), melding (påkrevd). Validering i klarspråk + ikon, aldri farge alene. Feil = --aksent-2 kant + beskrivelse koblet med aria-describedby. Spam: honeypot + tidssjekk (ingen captcha/cookies). Suksesmelding: «Promise resolved. Svarer innen 24t.» Backend: serverless endepunkt uten sporing som sender e-postvarsel
- **Navigasjon**: synlig rad alle flater (ingen hamburger); mobil = overflow-x scroll med fade-kant; aktiv side = grønn dot + aria-current="page"

## State og data
- **Tema**: prefers-color-scheme + manuell toggle → `data-theme` på `<html>`, persistert i localStorage
- **Hue** (/sandbox + 404): tall 0–360 i localStorage; registrert med `@property` for animerbarhet; L/C låst i oklch så AA-kontrast holder uansett tone
- **now.json** (manuelt vedlikeholdt, f.eks. `{ "java": "uke 7/12", "ki": "fikser gamle prosjekter med Claude Code", "soker": "utvikler / ux" }`)
- **GitHub API** (bruker: `stianglomsrod`):
  - Siste commits: REST `GET /users/stianglomsrod/events` — cache 1–6t, fallback statisk snapshot
  - Heatmap: GraphQL `contributionsCollection` — cache 6t; skjermlesere får summen i klartekst
  - All henting server-side/ved bygg der mulig (ytelse + ingen klient-tokens)
- **Kontakt**: skjema-POST til serverless endepunkt → e-post til stianglomsrod@gmail.com

## Design tokens
Se **`tokens.css`** — maskinlesbar fasit (mørk standard, dagmodus, kodeflate-anker, syntaks, heatmap-ramper, typografi, spacing, radius, motion, reduced-motion). Alle kontraster er beregnet; verdiene i kommentarene er dokumentasjonen.

## Typografi og fontlisenser (self-host alle tre)
- **Atkinson Hyperlegible** (SIL OFL 1.1, Braille Institute) — all lesetekst
- **Cascadia Code** (SIL OFL 1.1, Microsoft) — kode, data, labels; aldri lange avsnitt
- **Anybody** (SIL OFL 1.1, Etcetera Type Co) — KUN navnetrekket + badge-tall; variabel wdth 50–150
- Fallback-stack med size-adjust for CLS-fri lasting. Google Fonts-lenkene i guidene er kun for prototypene — produksjon self-hoster (cookiefritt-kravet)

## Assets
- `stian.png` — portrett (ekte foto, ingen filter; radius-md, 1px --linje; object-position ca. 50% 10% for ansiktsutsnitt)
- Ingen andre bilder i systemet; imagery i caser leveres senere (Lori Frisør krever godkjenning først)

## Filer i denne mappa
- `README.md` — dette dokumentet
- `tokens.css` — maskinlesbare tokens (fasit)
- `Endelig Guide v2.dc.html` — kanonisk styling guide (åpnes i nettleser)
- `Endelig Guide v1.dc.html` — vedlegg: dagmodus, modul B, sjekkliste
- `stian.png` — portrett

## Harde krav (fra briefen — ufravikelige)
- WCAG 2.1 AA: semantikk, tastatur, synlig fokus, kontrast per tokenpar (dokumentert)
- prefers-reduced-motion respektert overalt
- Cookiefritt; ingen sporing
- Lighthouse ≥ 95 alle kategorier; rask LCP
- Identiteten holdes adskilt fra eierens selskapsprofil (intet gult punktum-motiv, intet tusj-språk)
