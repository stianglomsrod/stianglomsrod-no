# Innholdsinventar — stianglomsrod.no (dagens side)

> **UTKAST** fra Fase 0-agent, 2026-07-08. Basert på klonet baseline i
> `C:\Users\x_ray\kode 2026\Claude\hjemmeside\_baseline\portfolio-site\`
> (github.com/stianglomsrod/portfolio-site, Next.js 16.2.9 / React 19.2.4 / Phaser 3.90).
> Ikke kvalitetssikret av menneske ennå. Alle filstier under er relative til baseline-rota
> med mindre annet er oppgitt.

---

## 1. Sidestruktur og metadata

### Ruter

| Rute | Fil | Innhold |
|---|---|---|
| `/` | `app\page.tsx` | Forside: SkipLink → GameTab → LanguageToggle → `<main>` med Hero, Workflow, KlarCase, Method, Capacity → Contact (`<footer>` utenfor `<main>`, bevisst for contentinfo-landemerke) |
| `/skamlos-rpg` | `app\skamlos-rpg\page.tsx` | Spillbart 2D RPG-prolog («Skamløs Pitch: Kompetansebyen»), Phaser lastes kun klient-side, `robots: noindex, nofollow` |
| 404 | — | **Finnes ikke.** Ingen `not-found.tsx`; Next-standard 404 brukes |

Ankere på forsiden: `#innhold` (main), `#arbeidsflyt`, `#klar`, `#metode`, `#kapasitet`, `#kontakt`.

### Metadata (`app\layout.tsx`)

- `<title>`: «Stian Glomsrød — AI-first utvikler»
- Description: «Fullstack produktbygging med AI-agenter, disiplinert arbeidsflyt og tydelig kvalitetssikring.»
- `metadataBase`: `NEXT_PUBLIC_SITE_URL` → fallback `VERCEL_PROJECT_PRODUCTION_URL` → `http://localhost:3000`
- OpenGraph: `type: website`, `locale: nb_NO`, bilde `/images/avatar/stian-portrait.webp` (760×919, alt «Portrett av Stian Glomsrød»). Twitter-kort: `summary`, samme bilde
- Keywords: fullstack, AI-first, AI-agenter, produktutvikling, Next.js, React, TypeScript, portefølje
- `robots: index, follow` (forsiden), canonical `/`
- `themeColor: #0e1012` (viewport)
- Favicon: `app\favicon.ico` (Next konvensjonsbasert)
- Inline `<script>` i `<head>` setter `html.js`-klasse før first paint (progressive enhancement for scroll-reveal)

### Språkløsning (NO/EN)

- Klient-side toggle, ingen ruter per språk. `app\components\LanguageContext.tsx`:
  `useSyncExternalStore` mot **localStorage-nøkkel `site-lang`** (verdier `"no"`/`"en"`, default `no`; SSR/første render alltid `no`)
- `LanguageProvider` synker `document.documentElement.lang` (`nb`/`en`)
- `app\components\LanguageToggle.tsx`: fast segmented control NO/EN øverst til høyre
- All copy ligger inline i komponentene som `{ no, en }`-objekter — ingen i18n-bibliotek, ingen CMS
- README bekrefter: kun localStorage-nøkler er `site-lang` + spillets save-state. Ingen analytics/sporing

### Fonter og tema

- Fonter: Geist + Geist Mono via `next/font/google` (`--font-geist-sans`, `--font-geist-mono`)
- Tema (`app\globals.css`): **mørkt som hovedretning** (`#0e1012`-bakgrunn, blå aksent `#6aa6ee`), lys variant kun via `@media (prefers-color-scheme: light)`. Ingen manuell tema-toggle
- `prefers-reduced-motion` respekteres globalt (animasjoner slås av; `Reveal` viser innhold umiddelbart)

### Hjelpekomponenter (ikke innhold, men mønstre)

- `app\components\Reveal.tsx` — IntersectionObserver-basert scroll-inn-fade, reduced-motion-safe
- `app\components\SkipLink.tsx` — «Hopp til innholdet» / «Skip to content»
- `app\components\ImageLightbox.tsx` — portal-basert lightbox med piltast-/Escape-navigasjon, fokushåndtering
- `app\components\GameTab.tsx` — fast pille øverst til venstre, «🎮 Skamløs pitch» → `/skamlos-rpg`

---

## 2. Innhold per seksjon (forsiden)

All tekst finnes i både NO og EN i samme fil. NO-versjonen gjengis her.

### Hero (`app\components\Hero.tsx`)

- Eyebrow: «Stian Glomsrød»
- H1: «Jeg bygger AI-first programvare som gjør sammensatte behov om til noe folk faktisk kan bruke.»
- Intro: jobber fullstack, bruker AI-agenter aktivt med tydelige sjekkpunkter for kvalitet; fra uklar problemstilling til noe som virker og tåler testing
- Tre kulepunkter: (1) Bygget Klar — fullstack PWA-prototype med roller, arbeidsflyt, innlogging og AI-assistert import med menneske-i-løkka; (2) AI-agenter som utviklingspartnere med krav, review-løkker, QA og aktiv korreksjon; (3) dokumenterer beslutninger, handoff og sikkerhetsgrenser
- CTA-er: «Slik bygger jeg med AI» (→ `#arbeidsflyt`) og «Ta kontakt» (mailto:stianglomsrod@gmail.com)
- Bilde: `/images/avatar/stian-portrait.webp` (priority)

### Workflow (`app\components\Workflow.tsx`) — `#arbeidsflyt`

- Tittel: «Slik bygger jeg med AI». Lede: «AI-agenter gjør meg raskere, men de får ikke siste ord. […] hvert steg har en eier og en tydelig grense.»
- **8 steg**: 01 Kontekst · 02 Krav · 03 Menneskelig gjennomgang · 04 Korreksjon · 05 QA · 06 Dokumentasjon · 07 Overlevering · 08 Kontrollpunkter (hver med én setnings beskrivelse)
- Relevans-linje: arbeidsmåten er skrevet ned slik at et team kan plukke den opp — «enablement i praktisk skala»
- **Prosjektstripe «Tre prosjekter · samme mønster»** (tre kort):
  1. **Klar** — tag «Fullstack AI-produkt». Proof: Next.js · React · TypeScript · Supabase/PostgreSQL · innlogging/rolletilgang · AI-assistert import med forhåndsvisning. Lenker: https://klar-sigma.vercel.app/ + https://github.com/stianglomsrod/klar
  2. **Companion** — tag «Dokumentert utviklingsflyt». Proof: Flutter · Dart · Drift/SQLite · lokal-first · PROJECT_DNA, planer, epics og tester. Lenke: https://github.com/stianglomsrod/nikkoprogging (ingen egen live-lenke)
  3. **Lori Frisør** — se seksjon 3
- Grenselinje: «Eksemplene viser arbeidsmåte og tekniske vurderinger, i prototypeskala.»

### KlarCase (`app\components\KlarCase.tsx`) — `#klar`

- Tittel: «Klar — et fullstack AI-produkt, bygget i praksis». Lede: fullstack PWA-prototype for struktur, prioritering og hjelp i skolehverdagen
- **«Systemet»** (definisjonsliste): Frontend (React/Next.js/TypeScript, én kodebase → to grensesnitt lærer/elev), Backend og data (Supabase/PostgreSQL), Innlogging og roller (rollebasert tilgang), Plattform (responsiv PWA — PC/Chromebook/nettbrett/mobil)
- Argumentasjons-avsnitt: valgene henger sammen — fungerer på utstyret skolene har, lav terskel
- **«Smart Import — AI som et bevisst produktvalg»** (4 steg): Flaskehalsen (ukebrev → strukturert oversikt) → AI som valgt verktøy → Menneske i løkka (redigerbar forhåndsvisning før publisering) → Evaluert med lærere (sterkeste funn i evalueringen)
- **Galleri «Fra produktet»** — 6 skjermbilder via `CaseScreenshotGallery` (caseId `klar`), klikkbare til lightbox
- Personvern-notis: dataminimering, ansvarlig AI-bruk, forhåndsvisning som kontroll
- Disclaimer: fungerende prototype, ikke ferdig plattform i skala; evaluert med lærere, ikke elever (bevisst avgrensning)

### Method (`app\components\Method.tsx`) — `#metode`

- Tittel: «Fra uklare behov til byggbare systemer»
- Metodegrunnlag: **participatory design** (lærere som med-designere) + **design science** (bygg → evaluer → begrunn), workshops; «dokumentert og eksaminert arbeid fra masteroppgaven»
- **5 behov→teknisk-valg-mappinger**: lav terskel/tidssparing → Smart Import; virke på alt utstyr → responsiv PWA/Supabase/én kodebase; lærer vs. elev → rollebasert tilgang, to grensesnitt på samme datalag; hjelp uten stigma → støtte i felles grensesnitt; motivasjon uten press → spillelementer valgfrie, av som standard
- Relevans-linje: metodebakgrunn er relevant for AI-first engineering — presis problemramming

### Capacity (`app\components\Capacity.tsx`) — `#kapasitet`

- Tittel: «Læringshastighet og ærlig vekstretning»
- **«Det jeg kan vise nå»**: rask overgang nytt domene → fungerende prototype (tverrfaglig bakgrunn, ikke primært SE); jevn produksjon over tid; gjør kunnskap om til systemer andre kan bruke
- **«Det jeg vil bygge videre»**: lavnivå-engineering/verktøy/plattform; robusthet/observability/drift; distribuerte systemer, GitHub-automatisering (Actions/API), agentiske rammeverk/MCP
- **«Programmering og veien hit»** (5 punkter): CS50x hos Harvard (C, Python, SQL, HTML/CSS/JS); Python/Django + JS/Vue i forløperprosjektet til Klar (elever som meddesignere); programmering som lærer (micro:bit, Kitronik, Python/JS); lærer nå Java via Coursera; Python og JS sitter løsest
- **3 lenker**: CS50x-sertifikat (https://cs50.harvard.edu/certificates/0e9210d1-86f5-445a-b4d6-46fad1a5fd45), forløper-frontend (https://github.com/stianglomsrod/pd-app-frontend), forløper-backend (https://github.com/stianglomsrod/pd-app-backend)
- Avslutning: driv for å bli virkelig god programmerer. Ærlighetslinje: «Det jeg trygt kan vise i dag […] Resten vil jeg heller være ærlig på enn å overselge.»

### Contact (`app\components\Contact.tsx`) — `#kontakt` (footer)

- Tittel: «Ta kontakt hvis du vil vite mer om hvordan jeg jobber.» + tekst om nysgjerrighet på AI-endret programvareutvikling
- CTA-er: «Send e-post» (mailto) + «Se arbeidsflyten igjen» (→ `#arbeidsflyt`)
- Lenker: E-post (stianglomsrod@gmail.com), LinkedIn (https://www.linkedin.com/in/stian-glomsr%C3%B8d-156968265/), GitHub (https://github.com/stianglomsrod)
- Fotnote: «Ja, denne siden er bygget med AI-agenter. Nei, de fikk ikke styre alene.»
- © {årstall} Stian Glomsrød

### caseScreenshotData.ts (`app\components\caseScreenshotData.ts`)

Fire case-nøkler med skjermbilder (reelle pikseldimensjoner lagret per fil):

| Case | Skjermbilder (nøkler) | Brukt i UI i dag? |
|---|---|---|
| `klar` | Smart Import · Lærerens landingsside · Elevens landingsside · Hjelpekø · Elevadministrasjon med opt-ins · **Level-up-modal** · Blomsterhage / progresjon (alle 1920×871) | Ja, via KlarCase — men «Level-up-modal» er IKKE med i `galleryLabels` og vises aldri |
| `forloper` | «Prototype-skjermbilde» (`forloperprosjektet-til-klar.png`) | **Nei — foreldreløs.** Ingen komponent kaller galleri med denne caseId |
| `fagtekst` | «Figma-prototype» (`ai-og-fagtekstforstaelse.png`, Warp Read) | **Nei — foreldreløs** |
| `ask-away` | «Figma-prototype» (`ask-away.png`, ASK-symbolstøtte) | **Nei — foreldreløs** |

**Observert bug i dagens side (EN-modus):** `KlarCase` sender engelske `galleryLabels`
(«Teacher landing page» osv.) som oppslagsnøkler, men `screenshotMap.klar` har norske
nøkler. I EN-modus matcher bare «Smart Import»; de øvrige 5 rendres som tomme
plassholder-bokser med tekstetikett. Irrelevant for v2 hvis galleriet bygges om, men
verdt å vite ved gjenbruk av mønsteret.

### /skamlos-rpg (kort)

- `app\skamlos-rpg\` — Phaser-basert topp-ned RPG-prolog «Kompetansebyen»: engine (innholdsagnostisk) + innholdspakke `game\content\kompetansebyen\` (maps, quests, dialog, NPC-er, minispill: ForLoopGame, GitCommitGame, ChoiceGame)
- Claim-disiplin som data: `claims.ts` har deny-liste (aldri hevde senior-distributed-systems, enterprise-skala, elevresultat-effekt, CS50-Django m.m.) — maskinsjekket av `scripts\check-skamlos-content.mjs`
- `endgame.ts`: sluttbudskap «Søknadspakke levert» — «Jeg søker ikke fordi jeg tror jeg er ferdig utlært. […] stein for stein …», gjenbruker sidens kontaktlenker
- Assets: prosedyregenererte PNG-er i `public\skamlos-rpg\` (`scripts\build-skamlos-rpg-assets.mjs`) + `laeringsreisen-loop.mp3` (9 MB)

---

## 3. Lori Frisør-status (Done 19 i v2-PRD)

Grep etter «lori» (case-insensitiv) i hele baseline-repoet gir **6 treff, alle i én fil**:
`app\components\Workflow.tsx` (3 i NO-blokka, 3 i EN-blokka — samme innhold):

| Linje | Innhold |
|---|---|
| 90 / 188 | `name: "Lori Frisør"` |
| 96 / 194 | `href: "https://lori-frisor.vercel.app/"` (primærlenke «Åpne nettstedet» / «Open the site») |
| 100 / 198 | `href: "https://github.com/stianglomsrod/lori-frisor"` (GitHub-lenke) |

**Alt som er publisert om Lori Frisør i dag** (prosjektkort nr. 3 i Workflow-stripa):

- Tag: «Enablement og overlevering» / «Enablement and handoff»
- Navn: «Lori Frisør»
- Proof-tekst (NO): «Astro · Keystatic (eierredigering) · Vercel · handoff-dokumentasjon · valgte å integrere Timma framfor å bygge booking på nytt.»
- Note (NO): «Pragmatisk leveranse for en ekte eier.»
- To utgående lenker: live-site (vercel.app-subdomene) og offentlig GitHub-repo

**Det som IKKE finnes:** ingen skjermbilder av Lori Frisør (ikke i `caseScreenshotData.ts`,
ikke i `public\images\`), ingen egen case-seksjon, ingen omtale av eieren som person,
ingen priser/åpningstider/kundedata. Ingen treff i README, metadata eller spillet.

**Vurdering for Done 19:** dagens eksponering er navn + teknologiliste + to lenker.
Kundens virksomhetsnavn er altså allerede offentlig markedsført på stianglomsrod.no i dag,
men uten bilder og uten sitater. Hvis v2 skal vise MER (skjermbilder, case-tekst,
kundenavn i større format) trengs skriftlig godkjenning; hvis godkjenning ikke foreligger
ved lansering, er fallback et plassholderkort på samme detaljnivå som i dag (navn +
stack + lenke) — eller anonymisert («frisørsalong i Oslo»-varianten), som er strengere
enn dagens praksis. Beslutningen bør uansett dokumenteres i BESLUTNINGER.md.

---

## 4. Migrasjonsmatrise

V2-IA: forside, /prosjekter, /laeringsreisen, /sandbox, /slik-jobber-jeg, /kolofon, /om, 404.
Hero (lærProgrammering()/lærKI()), CHANGELOG-læringsreise og README-«slik jobber jeg»
(goals/guardrails/human_review) er låst i v2 — dagens innhold mappes inn i disse rammene.

| Innholdselement (kilde) | Anbefaling | Begrunnelse |
|---|---|---|
| Hero H1 + intro (`Hero.tsx`) | **Dropp** (erstattes av låst v2-hero) | v2-hero med lærProgrammering()/lærKI() er låst; dagens posisjonering «AI-first utvikler» kan gjenbrukes som råstoff i /om |
| Hero-kulepunkter (Klar, AI-partner, dokumentasjon) | **Omarbeid** → forside/teasere | Kjernepåstandene er gode, men hører hjemme som korte teasere mot /prosjekter og /slik-jobber-jeg |
| Portrett `stian-portrait.webp` | **Dropp/erstatt** | v2-handoff har ny `stian.png`; behold gamle kildefil kun som arkiv |
| Workflow 8 steg (`Workflow.tsx`) | **Migrer** → /slik-jobber-jeg | Kartlegger nesten 1:1 mot README-formatets goals/guardrails/human_review; steg 03 og 08 er human_review/guardrails direkte |
| Workflow relevans-/enablement-linje | **Migrer** → /slik-jobber-jeg | Rammer inn hvorfor siden finnes |
| Prosjektstripe: Klar-kort | **Migrer** → /prosjekter | Hovedprosjekt; behold lenker (live + GitHub) |
| Prosjektstripe: Companion-kort | **Migrer** → /prosjekter | Uendret innhold fungerer som prosjektkort |
| Prosjektstripe: Lori Frisør-kort | **Migrer betinget** → /prosjekter | Avhenger av Done 19: godkjenning → fullt kort m/skjermbilder; ellers plassholder på dagens detaljnivå (se seksjon 3) |
| «Tre prosjekter · samme mønster»-framing | **Omarbeid** → /prosjekter-ingress | God redaksjonell idé: samme arbeidsmåte, tre ulike leveransetyper |
| KlarCase hele seksjonen (`KlarCase.tsx`) | **Migrer** → /prosjekter (Klar-detalj) | Dagens grundigste innhold; system-spec + Smart Import-arc + galleri er ferdig casestruktur |
| Klar-galleri, 6 skjermbilder + lightbox | **Migrer** → /prosjekter | Bildene finnes og er dimensjonssatt; fiks EN-nøkkelbuggen ved ombygging |
| `Level-up-modal`-skjermbilde (ubrukt i UI) | **Migrer** → /prosjekter | Ligger klar i data + `public\`; ta den inn eller slett bevisst |
| Klar personvern-notis + disclaimer | **Migrer** → /prosjekter | Ærlighetsgrepet er del av merkevaren; hører til casen |
| Method: PD/design science + masteroppgave (`Method.tsx`) | **Omarbeid** → /om (+ kort ekko i Klar-casen) | Metodegrunnlag er biografi/kompetanse, ikke egen side i v2-IA |
| Method: 5 behov→valg-mappinger | **Migrer** → /prosjekter (Klar-detalj) | Konkret Klar-innhold; styrker casen mer enn en generell metodeside |
| Capacity: «Det jeg kan vise nå» / «bygge videre» | **Omarbeid** → /om | Ærlig vekstretning passer /om; MCP/agent-punktene kan også peke mot /sandbox |
| Capacity: «Programmering og veien hit» (CS50x → Django/Vue → lærer → Java) | **Migrer** → /laeringsreisen | Dette ER læringsreise-milepæler i prosaform; konverter til tidslinjeposter |
| Capacity: CS50x-sertifikat + forløper-repolenker | **Migrer** → /laeringsreisen (evt. /prosjekter for forløperen) | Dokumentasjonslenker til milepælene |
| Capacity: ærlighetslinjen («heller ærlig enn overselge») | **Migrer** → /om eller /slik-jobber-jeg | Kjerneverdi, matcher guardrails-seksjonen |
| Contact: CTA + e-post/LinkedIn/GitHub (`Contact.tsx`) | **Migrer** → global footer i v2 | Kontakt må finnes på alle 8 sider |
| Contact-fotnote («bygget med AI-agenter … ikke styre alene») | **Migrer** → /kolofon | Perfekt kolofon-setning; kan også stå i footer |
| /skamlos-rpg (hele spillet) | **Migrer** → /sandbox (som eksperiment-oppføring med lenke/innbygging) | Er per definisjon et sandbox-eksperiment; endgame-budskapet («stein for stein») rimer med læringsreisen. Alternativ: behold ruten som deep-link og list den i /sandbox |
| Spillets claims-deny-liste (`claims.ts`) | **Omarbeid** → /slik-jobber-jeg (guardrails) | Maskinsjekket claim-disiplin er et konkret, uvanlig guardrail-eksempel |
| `forloper`/`fagtekst`/`ask-away`-skjermbilder (foreldreløse) | **Migrer** → /prosjekter (støtteprosjekter) eller **dropp bevisst** | Data + bilder finnes allerede, men vises ikke i dag; v2 må ta et aktivt valg |
| SEO-metadata (title/description/OG i `layout.tsx`) | **Omarbeid** | v2 trenger per-side metadata; dagens er én global blokk for én side |
| NO/EN-toggle (`site-lang` + inline `{no,en}`-copy) | **Dropp** (allerede avgjort) | PRD «Ute av v1»: engelsk versjon er eksplisitt ute av v2s første versjon. EN-copyen arkiveres i git-historikken; galleri-nøkkelbuggen bekrefter at EN-vedlikehold var en reell kostnad |
| Reveal/SkipLink/Lightbox/reduced-motion-mønstre | **Omarbeid** (gjenbruk mønster, ny kode) | A11y-nivået (skip-link, focus-trap, reduced motion, progressive enhancement) er en kvalitetsbaseline v2 ikke bør gå under |
| Ingen-sporing-prinsippet (README) | **Migrer** → /kolofon | «Ingen analytics, kun localStorage for språk/save» er kolofon-innhold og compliance-vennlig |

---

## 5. Assets-inventar (`public\`)

### `public\images\`

| Fil | Størrelse | Brukes i dag | v2-anbefaling |
|---|---|---|---|
| `images\stian.jpg` | 7 337,9 KB (3024×4032, EXIF-rotert) | Nei — kun kildefil for `scripts\build-avatar.mjs` og `scripts\build-hero-portrait.mjs`. **7,3 MB ligger offentlig tilgjengelig på nettstedet** | Ikke migrer til `public\` i v2 (arkivér utenfor webrota); v2 bruker ny `stian.png` fra handoff |
| `images\avatar\stian-portrait.webp` | 62,4 KB (760×919) | Hero + OG/Twitter-bilde | Erstattes av ny v2-portrett (`stian.png`); vurder å beholde pipeline-idéen (skript som deriverer webp) |
| `images\avatar\stian-face.png` | 108,7 KB (256px, sirkulær) | Spillets dialogavatar (`theme.ts`, `GameBox.tsx`) | Følger spillet til /sandbox |
| `images\cases\klar\smart-import.png` | 154,6 KB (1920×871) | KlarCase-galleri | Migrer → /prosjekter |
| `images\cases\klar\laererens-landingsside.png` | 112,2 KB (1920×871) | KlarCase-galleri | Migrer |
| `images\cases\klar\elevens-landingsside.png` | 280,6 KB (1920×871) | KlarCase-galleri | Migrer |
| `images\cases\klar\elevadministrasjon-med-opt-ins.png` | 122,4 KB (1920×871) | KlarCase-galleri | Migrer |
| `images\cases\klar\hjelpeko.png` | 172 KB (1920×871) | KlarCase-galleri | Migrer |
| `images\cases\klar\blomsterhage-progresjon.png` | 85,3 KB (1920×871) | KlarCase-galleri | Migrer |
| `images\cases\klar\level-up-modal.png` | 201,2 KB (1920×871) | Nei (i data, aldri i galleryLabels) | Aktivt valg: ta inn eller dropp |
| `images\cases\supporting\forloperprosjektet-til-klar.png` | 51,4 KB (1920×871) | Nei (foreldreløs) | Kandidat til /prosjekter (forløper) eller /laeringsreisen |
| `images\cases\supporting\ai-og-fagtekstforstaelse.png` | 426,7 KB (1888×983) | Nei (foreldreløs; Warp Read Figma) | Kandidat til /prosjekter eller /sandbox; ellers dropp |
| `images\cases\supporting\ask-away.png` | 390,4 KB (1570×1060) | Nei (foreldreløs; ASK Away Figma) | Samme som over |

Ingen Lori Frisør-bilder finnes i `public\`.

### `public\skamlos-rpg\`

Ca. 60 småfiler: prosedyregenererte tiles/sprites/props/bygninger (0,1–0,9 KB hver,
regenererbare via `scripts\build-skamlos-rpg-assets.mjs`) + `audio\laeringsreisen-loop.mp3`
(**9 025 KB** — største asset på hele nettstedet). Følger spillet ved migrering; mp3-en bør
vurderes komprimert.

---

## 6. Hull — det v2-IA-en trenger som dagens side ikke har

| v2-behov | Status i dagens innhold |
|---|---|
| **/sandbox** — liste over eksperimenter | Bare ett reelt eksperiment finnes (skamlos-rpg). Ingen tekst som rammer inn «sandbox» som konsept. De tre foreldreløse Figma-/prototype-bildene kan gi 2–3 oppføringer til, men trenger nyskrevet tekst |
| **/kolofon** — kolofoninnhold | Nesten ingenting: kun footer-fotnoten og READMEs teknologi-/ingen-sporing-avsnitt. Stack-liste, verktøy (Claude Code?), fonts, lisens, kildekode-lenke, personvernerklæring må skrives fra null |
| **/laeringsreisen — milepæler før 2024** | Capacity gir prosa-hint (CS50x, Django/Vue-forløper, læreryrket, Java/Coursera) men **ingen årstall/datoer** på noe. CHANGELOG-formatet krever datering — må rekonstrueres fra sertifikat/repo-historikk/CV |
| **/om — biografisk innhold** | Ingen ren biografi finnes. Method (master, PD) + Capacity (lærerbakgrunn) gir råstoff, men ingen sammenhengende «hvem er Stian»-tekst, ingen tidslinje, ingenting om Grindverk |
| **404-side** | Finnes ikke i dag; må designes fra null |
| **Per-side SEO/OG** | Kun én global metadatablokk + noindex på spillet; v2 trenger 8 unike title/description/OG-sett og trolig OG-bildegenerering |
| **Lori Frisør-case i full bredde** | Ingen skjermbilder, ingen case-tekst utover én proof-linje; hele casen (og godkjenningen) må produseres |
| **Companion-case i full bredde** | Bare kort-tekst (én proof-linje + note); /prosjekter-detalj trenger mer hvis Companion skal ha egen omtale |
| **Navigasjon** | Dagens side har ingen meny (kun to hjørne-piller og ankere). 8-siders IA krever global nav + footer fra null |
| **EN-innhold for 8 sider** | Dagens EN-copy dekker bare forsidens seksjoner; hvis v2 beholder EN, må alt nytt innhold skrives dobbelt (og galleri-nøkkelbuggen viser at EN-vedlikehold allerede glipper) |
