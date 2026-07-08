# stianglomsrod.no v2 — prosjekthukommelse

Nybygg av stianglomsrod.no: personlig utviklerportefølje + sandbox, «et kjørende
program, ikke en brosjyre». Bygges med goal-loop i Claude Code.

## Goal

`docs/handoff/PRD-stianglomsrod-no-v2.md` er `/goal`. Done-kriteriene 1–22 er
suksesskriteriene; goalen er ikke oppfylt før alle passerer.

## Kildeprioritet ved konflikt

**PRD > tokens.css > Endelig Guide v2 > Endelig Guide v1 > README** (alle i `docs/handoff/`).

## Tre overstyringer (PRD-en overstyrer guidene)

1. Hero-kommentarene er `// WIP:` (ikke `// TODO:`) og rendres fra `now.json`
   i låst format `// WIP: <verdi>`.
2. Terminalen går via Node-REPL: `$ node` → `> jobb` → `Promise { <pending> }` → `>▮`.
3. Navnetrekket slutter med blinkende blokkmarkør ▮ (ikke grønt punktum), og
   tickeren skal ha pausekontroll (≥ 44 px, `aria-pressed`).

## Invarianter (gjelder hver iterasjon)

- **Rødt blokkerer:** nye/endrede features sjekkes mot compliance-porten
  (skill: `norwegian-software-guardrails`) før kode. Status per 08.07.2026:
  🟢 GRØNT — se `docs/compliance/compliance_register.md`.
- **Grønn release-gate før done:** Done-kriterium 20 må passere før prod-deploy.
- Secrets (`GITHUB_TOKEN`, `RESEND_API_KEY`) kun i miljøvariabler — aldri i
  repo eller klient. Ingen cookies, ingen tredjeparts-requests fra klient,
  ingen analytics.
- Bruk av lagret legitimasjon og irreversible remote-operasjoner (branch-/tag-
  sletting, force-push, repo-innstillinger, prod-deploy) krever eksplisitt
  ja fra Stian i sanntid — oppdraget alene er ikke nok.

## Rapportformat

Etter hver økt: status per kriterienummer, `✓`/`✗` med konkret årsak.

## Endringsregel for spesifikasjonen

Filene i `docs/handoff/` er spesifikasjon og endres KUN når Stian eksplisitt
godkjenner det i økta. Hver godkjent endring får:

- (a) egen commit med prefiks `spec:` og kort beskrivelse — aldri blandet med kode,
- (b) oppføring i `docs/BESLUTNINGER.md` (append-only): tidspunkt, endring,
  begrunnelse, commit-hash og reverseringskommando (`git revert <hash>`),
- (c) umiddelbar push til GitHub (når remote finnes).

## Praktisk

- `now.json` i repo-rota er levende data (hero + ticker), ikke dokumentasjon —
  redigeres fritt uten spec-prosess.
- `_baseline/` er gitignored arbeidsområde for Fase 0 (klon av dagens
  portfolio-site + QA-verktøy). Fase 0-leveransene ligger i `docs/innsikt/`.
- All tekst i guidene er sample (lo-fi); struktur/stil/tilstander er hi-fi og
  følger `docs/handoff/tokens.css` 1:1.
- Redaksjonell tone: brief §10 — tørt, presist, selvironisk der det passer;
  aldri hype, aldri løfter uten kvittering. Klarspråk i alt som ikke er kode.
