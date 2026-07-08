# BESLUTNINGER.md — append-only beslutningslogg

Regler: nye oppføringer legges ALLTID nederst, eksisterende oppføringer endres
aldri. Spec-endringer (docs/handoff/) skal ha egen `spec:`-commit, oppføring her
med commit-hash og reverseringskommando, og push til GitHub.

---

## 2026-07-08 · Prosjektmappe og repo-oppsett

- **Hva:** Startpakken for v2 importert til `docs/handoff/` (kildeversjonert).
  Prosjektmappe: `C:\Users\x_ray\kode 2026\Claude\hjemmeside` — valgt eksplisitt
  av Stian i økta (i stedet for standardforslaget om søskenmappe til lori).
- **Begrunnelse:** Startprompten krever handoff-filene versjonert i repoet før
  bygging. Spørsmålet om gjenbruk av portfolio-site-repoet vs. nytt repo avgjøres
  først etter Fase 0 (jf. startprompt punkt 2); inntil da er dette et lokalt repo
  uten remote.
- **Commit:** (fylles inn etter første commit)
- **Reversering:** `git revert <hash>`

## 2026-07-08 · Guardrails-port kjørt på nytt ved onboarding

- **Hva:** `norwegian-software-guardrails` kjørt; PRD-ens påstand om 🟢 GRØNT
  bekreftet. Register opprettet i `docs/compliance/compliance_register.md`.
- **Begrunnelse:** Fast arbeidsmåte for porteføljeprosjekter (port før kode).
  Ett presiseringspunkt utover PRD-en: Resend/Vercel må dokumenteres som
  databehandlere med EU-region/DPA-vurdering i personvernteksten (Done 17).
- **Commit:** (samme som over)
- **Reversering:** `git revert <hash>`
