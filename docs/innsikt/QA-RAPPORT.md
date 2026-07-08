# QA-RAPPORT — Fase 0, dagens stianglomsrod.no

**Dato:** 2026-07-08 · **Grunnlag:** deployet produksjon (fasit) + lokal kjøring
av main-klonen (identisk innhold, ren konsoll). Metode og rådata: se
[BASELINE.md](BASELINE.md); innhold: [INNHOLD-INVENTAR.md](INNHOLD-INVENTAR.md);
spillet: [SPILL-ANALYSE.md](SPILL-ANALYSE.md); bilder: `skjermbilder/`.
De to HØY-funnene og HUD-målene er verifisert manuelt i koden, ikke bare av agent.

## Overordnet vurdering

Dagens side er en gjennomarbeidet, ærlig one-pager med et påkostet spill.
Kvalitetsnivået er høyt: Lighthouse 96/100/100/100 på forsida, 0 cookies, ingen
tredjeparter, reduced motion respektert, skip-link og fokushåndtering på plass.
v2 river ikke en ruin — den erstatter et solid, smalt nettsted med en bredere
arkitektur. Baselinen forplikter: v2 kan ikke gå under dagens nivå på noe punkt.

## Funn

### Høy alvorlighet

| # | Funn | Belegg | Anbefaling |
|---|---|---|---|
| H1 | **Duplisert sannhet spill ↔ side, med påvist drift.** CS50-sertifikatet har to ulike URL-er (spill: `certificates.cs50.io/….pdf`, side: `cs50.harvard.edu/certificates/…`); kontaktlenker er håndkopiert inn i `EndgameScreen.tsx` selv om `endgame.ts` deklarerer `contactSource: "reuse-site-contact"`. Ingen sjekk fanger dette (claim-lint er kun warnings). | `artifacts.ts:13` vs `Capacity.tsx:40`; `EndgameScreen.tsx:18–25` | Kjernen i Done 22: generer/utled spillets faktainnhold fra samme kilder som siden ved bygg, og gjør konsistenssjekken til en hard gate |
| H2 | **`stian.jpg` på 7,3 MB (3024×4032) ligger offentlig** i `public/images/` — kildefil for byggeskript, aldri vist i UI, men fritt nedlastbar. | `public/images/stian.jpg` | Ikke migrer kildefiler til webrota i v2; portrettkilder holdes utenfor `public/` |

### Middels alvorlighet

| # | Funn | Belegg | Anbefaling |
|---|---|---|---|
| M1 | Spillsida: Performance 65 (TBT 970 ms) og SEO 54; 9,2 MB BGM-MP3 lastes ved spillstart — tungt på mobilnett. | Lighthouse; `audio/laeringsreisen-loop.mp3` | Re-encode lyd (lavere bitrate, evt. OGG+MP3), code-split Phaser; SEO-tallet er delvis villet (`noindex`), men canonical bør på plass |
| M2 | HUD-klikkflater i spillet er ~28 px høye (meny/språk/lyd-chips) — under 44-pikselkravet, og menyknappen er eneste vei til pause på touch. | `.hudChip { min-height: 28px }` | Done 21: hev chippene til ≥ 44 px på touch |
| M3 | Startkortet i spillet klippes ved 375 px (kontroll-lista kuttes; startknapp under folden). Spillbart, men førsteinntrykket på mobil er skjemmet. | `deploy-spill-start-375.png` | Del av mobiloptimaliseringsrunden (Done 21) |
| M4 | HTTP-hygiene: mangler CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy; `Access-Control-Allow-Origin: *` settes globalt; robots.txt og sitemap.xml → 404. | BASELINE.md | Settes riktig i v2 (headers + sitemap er allerede PRD-krav) |
| M5 | EN-modus: 5 av 6 Klar-galleribilder rendres som tomme plassholdere (norske oppslagsnøkler mot engelske labels). | `KlarCase.tsx` + `caseScreenshotData.ts` | Bekrefter PRD-valget om å droppe EN i v2; ikke verdt å fikse i v1 |
| M6 | `window.__skamlos`-debughook (scene, runtime, posisjon) eksponeres ubetinget i produksjon. | `WorldScene.create` | Gates på dev ved portering |
| M7 | Spill-lagringen mangler skjemaversjon — v2s innholdsendringer kan strande gamle localStorage-saves. | `save.ts` | Legg inn versjonsfelt + migrering/reset ved portering |

### Lav alvorlighet

- **L1** axe: 1–2 moderate landmark-brudd per side (GameTab/språktoggle utenfor
  landmarks; spillsida mangler `<main>`). Lighthouse: `label-content-name-mismatch`.
- **L2** 14 uavklarte kontrast-noder over spill-canvasen — må måles manuelt i v2-porten.
- **L3** Dialoger i spillet har initial fokus, men ingen fokusfelle; endgame mangler
  Esc-lukking; startknappen autofokuseres ikke.
- **L4** To ukoblede i18n-systemer (side vs. spill) — irrelevant når EN droppes, men
  spillets `Loc`-struktur beholdes.
- **L5** VirtualPad: slipp av én retningsknapp stopper all bevegelse ved multi-touch;
  pausemenyen viser kun tastaturkontroller på touch.
- **L6** `claims.ts:5` refererer et script som ikke finnes
  (`check-skamlos-claims.mjs` → riktig navn er `check-skamlos-content.mjs`).
- **L7** Innhold under folden er usynlig til det scrolles inn (IntersectionObserver-
  reveal) — fungerer for brukere, men print/skjermbilder/no-JS ser tom side.
- **L8** Tre ferdigdimensjonerte case-skjermbilder (forløper, Warp Read, ASK Away) +
  «Level-up-modal» ligger i data/`public/` men vises aldri — innhold som lekker
  vedlikehold uten å levere verdi.

### Positivt — nivå som IKKE kan gå tapt i v2

- 0 cookies, ingen tredjeparts-requests, ingen analytics (Done 10 = behold).
- `prefers-reduced-motion` respektert på både side (Reveal) og spill (canvas + CSS).
- Skip-link, lightbox med fokushåndtering, aria-labels på spillkontroller.
- Claim-disiplin som data (`claims.ts` deny-liste) + innholdssjekk-script — uvanlig
  og verdt å vise frem i /slik-jobber-jeg.
- Spillets arkitektur: rammeverksfri bridge, motor/innhold-separasjon,
  prosedyregenererte assets (null opphavsrettsrisiko), stille degradering.
- Ærlighetslinjene i copy («prototype, ikke ferdig plattform», «heller ærlig enn
  overselge») — bærebjelke også i v2s stemme.

## Dette tar vi med til v2

1. **Done 22 løses ved generering:** spillets faktainnhold (artefakter, skills,
   kontakt, claims) utledes fra samme kilder som siden ved byggetid; konsistens-
   sjekken blir hard gate i CI, ikke warnings.
2. **Spillporten er liten:** React-island i Astro (`client:only="react"`), 5–6 filer
   endres (next/dynamic ut, 4 × next/link → `<a>`, ny .astro-rute). Motor, innhold,
   CSS-modul urørt. Mobilrunden (Done 21) = HUD-chips ≥ 44 px, startkort-klipp,
   pausemeny-kontroller på touch, lydfil-diett.
3. **Baseline-tall til kolofonen:** 96/100/100/100 (forside) og 65/100/100/54
   (spill) er før-bildet; v2-målet ≥ 95 på forside + /prosjekter er allerede
   innenfor rekkevidde — spillsida er den reelle jobben.
4. **Innhold:** migrasjonsmatrisa i INNHOLD-INVENTAR.md er kjøreplanen. Største
   skrivejobber fra null: /kolofon, /laeringsreisen-milepæler med årstall, /om,
   /sandbox-innramming, 404. Lori Frisør: dagens eksponering er navn + lenker
   (ingen bilder) — plassholderkort på dagens nivå er trygg fallback til skriftlig
   godkjenning er arkivert (Done 19).
5. **Hygiene v2 gjør riktig fra start:** security-headers, robots/sitemap, per-side
   SEO/OG, ingen kildefiler i webrota, debug-hooks bak dev-flagg, save-versjonering.
6. **A11y-gulvet:** landmark-struktur, fokusfeller i dialoger, autofokus på
   primærknapper, 44-pikselflater — alt sammen allerede PRD-krav; baselinen viser
   hvor dagens side glapp.

## Anbefaling: nytt repo (dette repoet), ikke gjenbruk av portfolio-site

**Anbefaling:** bygg v2 i dette nye repoet (`hjemmeside`, opprettes på GitHub når
Stian bekrefter navn), og la `portfolio-site` stå urørt som kjørende fallback til
release-gaten er grønn. Domenet flippes i Vercel ved lansering.

Begrunnelse:

1. **Riv-og-erstatt + stackbytte:** Next.js 16 → Astro deler hverken avhengigheter,
   konfig eller mappestruktur. «Gjenbruk» ville i praksis vært å tømme repoet og
   beholde git-historikk med to urelaterte epoker.
2. **Trygg fallback:** portfolio-site ble nettopp generalisert og redeployet
   (2026-07-08), og manuell gjennomspilling gjenstår. Å bygge v2 i samme repo (selv
   på branch) blander to leveranser med hver sin release-tilstand; separat repo gir
   null risiko for dagens produksjon og triviell rollback (domene-flip tilbake).
3. **Byggehistorien er innhold:** v2s kolofon skal dokumentere hvordan siden ble
   bygget. Et rent repo der historikken starter med spec-import og goal-loopen er
   selv et bevis — commit-historikken blir del av porteføljen.
4. **Ingen kostnad ved splitten:** GitHub-feeden og heatmapen i v2 henter
   brukerdata (alle offentlige repoer), ikke repodata. Spillet porteres fra en
   offentlig klon med kildehenvisning i kolofonen; blame-historikken lever videre i
   portfolio-site.

Det som kreves av Stian ved dette valget (i tillegg til PRD Vedlegg A):
opprette tomt GitHub-repo + koble nytt Vercel-prosjekt, og godkjenne domene-flip
ved release. Alternativet (gjenbruk) sparer bare disse to klikkene og gir ingen
av fordelene over.
