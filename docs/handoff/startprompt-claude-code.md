# Startprompt til Claude Code — stianglomsrod.no v2

*Pakk ut startpakken i prosjektmappa, start Claude Code der, og lim inn teksten under som første melding.*

---

Du skal bygge **stianglomsrod.no v2** fra bunnen. Den vedlagte PRD-en er din `/goal`: Done-kriteriene 1–22 er suksesskriteriene, og goalen er ikke oppfylt før alle passerer. Hvis skillene `goal-prd`, `norwegian-software-guardrails` og `secure-dev-guardrails` er installert i miljøet, bruk dem.

**Kildeprioritet ved konflikt:** PRD > tokens.css > Endelig Guide v2 > Endelig Guide v1 > README.

Guidene inneholder tre utdaterte detaljer som PRD-en overstyrer: (1) hero-kommentarene er `// WIP:` (ikke TODO) og rendres fra now.json; (2) terminalen går via Node-REPL: `$ node` → `> jobb` → `Promise { <pending> }` → `>▮`; (3) navnetrekket slutter med blinkende blokkmarkør ▮ (ikke grønt punktum), og tickeren skal ha pausekontroll (≥ 44 px, aria-pressed).

All tekst og data i guidene er **sample (lo-fi)**: struktur, stil og tilstander er hi-fi og gjenskapes nøyaktig etter tokens.css, men innholdsverdier styres av now.json/PRD, og endelig copy leveres separat — bruk nøytrale plassholdere der copy mangler.

**Fase 0 — innsikt og baseline (ingen tidsfrist; grundighet foran fart):**
Klon https://github.com/stianglomsrod/portfolio-site og kjør dagens side lokalt. QA både lokal kjøring og de deployede sidene — https://stianglomsrod.no/ og spillet på https://stianglomsrod.no/skamlos-rpg — siden deploy er fasiten for hva brukere faktisk møter. Gjennomfør full visuell og UX-QA av både siden og spillet «Skamløs pitch», og commit alt til `docs/innsikt/`:
- `skjermbilder/` — Playwright-screenshots av alle sider og spilltilstander ved 375/768/1440 px (+ lys/mørk der det finnes). Se på bildene, ikke bare ta dem: vurder hvert bilde som en UX-kritiker.
- `BASELINE.md` — Lighthouse (alle kategorier) og axe/pa11y-funn per side på dagens side. Dette blir før/etter-beviset i v2-kolofonen.
- `SPILL-ANALYSE.md` — kodekart for spillet, inventar over hardkodet innhold som må bli datadrevet (kriterium 22), touch/mobil-problemer (kriterium 21), tastatur- og reduced-motion-status.
- `INNHOLD-INVENTAR.md` — alt innhold på dagens side som skal migreres eller bevisst droppes, inkludert hva som i dag er publisert om Lori Frisør (kriterium 19).
- `QA-RAPPORT.md` — funn med alvorlighetsgrad og anbefaling, avsluttet med «dette tar vi med til v2».

**Start slik:**
1. Opprett `docs/handoff/` i repoet og flytt filene fra startpakken (denne mappa) dit, kildeversjonert. Filene i docs/handoff/ er spesifikasjon: de endres KUN når Stian eksplisitt godkjenner det i økta. Hver godkjent endring får (a) egen commit med prefiks `spec:` og kort beskrivelse — aldri blandet med kodeendringer, (b) en oppføring i `docs/BESLUTNINGER.md`: append-only logg med tidspunkt, hva som ble endret, begrunnelse, commit-hash og reverseringskommando (`git revert <hash>`), og (c) umiddelbar push til GitHub, slik at historikk og angremulighet er tilgjengelig fra alle enheter. Opprett deretter `CLAUDE.md` i repo-rota som varig prosjekthukommelse, med: peker til PRD-en som `/goal`, kildeprioriteten, de tre overstyringene, invariantene (rødt blokkerer; grønn release-gate = kriterium 20), rapportformatet (✓/✗ per kriterienummer) og endringsregelen over.
2. Kjør Fase 0 over, og presenter funnene sammen med en anbefaling om gjenbruk av repoet vs. nytt repo, FØR du scaffolder.
3. Scaffold Astro-prosjektet (Vercel-adapter), implementer tokens.css 1:1 (fyll `[data-theme="light"]` reelt), og legg vedlagte now.json i repoet: `{ "fullstack": "Full Stack Open: del 1/13", "ki": "fikser gamle prosjekter med Claude Code", "soker": "utvikler / ux" }` — now.json er levende data, ikke dokumentasjon, og redigeres fritt.
4. Bygg i denne rekkefølgen: designsystem/tokens → hero (kriterium 2–5) → nav + sideskjelett → ticker/GitHub med statisk fallback → kontaktskjema → spillet (kriterium 21–22) → kolofon-innhold.
5. `GITHUB_TOKEN` og `RESEND_API_KEY` finnes kanskje ikke ennå — bygg fallback-først og si tydelig fra når du trenger dem (se PRD-ens Vedlegg A).

**Arbeidsform:** kjør goal-loopen i små iterasjoner, og rapporter status per kriterienummer (✓/✗ med konkret årsak) etter hver økt. To invarianter gjelder hver iterasjon: nye eller endrede features sjekkes mot compliance-porten (rødt blokkerer), og kriterium 20 — grønn release-gate — må passere før produksjonsdeploy. Secrets kun i miljøvariabler, aldri i repo eller klient. Ingen cookies, ingen tredjeparts-requests fra klienten, ingen analytics.

---

## Innhold i startpakken (skal ligge i mappa der Claude Code startes)

1. `PRD-stianglomsrod-no-v2.md` — goalen
2. `tokens.css` — fasit for alle verdier
3. `Endelig_Guide_v2_dc.html` — kanonisk styling guide
4. `Endelig_Guide_v1_dc.html` — vedlegg (dagmodus, modul B, sjekkliste)
5. `README.md` — handoff fra Claude Design
6. `kreativ-brief-stianglomsrod-no-v2.md` — bakgrunn (guidene refererer til §-ene)
7. `stian.png` — portrett (byste-utsnitt brukes)
8. De tre skillene installert i Claude Code-miljøet: goal-prd, norwegian-software-guardrails, secure-dev-guardrails

Lenker som ligger i prompten: repoet med spillet (github.com/stianglomsrod/portfolio-site). Når du har ordnet Vedlegg A-oppgavene (GitHub-token og Resend), legges nøklene i Vercel — ikke i chatten og ikke i repoet.
