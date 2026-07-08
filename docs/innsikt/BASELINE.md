# BASELINE.md — dagens stianglomsrod.no, målt 2026-07-08

Før/etter-beviset for v2-kolofonen. Alle målinger er gjort mot **deployet
produksjon** (https://stianglomsrod.no, Vercel, Next.js 16.2.9) — deploy er
fasiten for hva brukere møter. Lokal kjøring av samme commit (main) ga identisk
innhold og ren konsoll.

**Verktøy:** Lighthouse 12.8 (mobilkonfig, emulert Moto G + throttling, via
Playwright-Chromium), axe-core 4.12 (`@axe-core/playwright`, WCAG 2A/AA + 2.1),
Playwright 1.56 (skjermbilder 375/768/1440, mørk modus, reduced motion,
cookie-/nettverksinspeksjon). Rådata i `_baseline/qa/` (gitignored);
skjermbilder i `docs/innsikt/skjermbilder/`.

## Lighthouse (mobil, prod)

| Side | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Forside `/` | **96** | **100** | **100** | **100** |
| Spill `/skamlos-rpg` | **65** | **100** | **100** | **54** |

Nøkkelmetrikker:

| Metrikk | Forside | Spill |
|---|---|---|
| LCP | 2,3 s | 4,1 s |
| FCP | 1,0 s | 0,8 s |
| TBT | 180 ms | **970 ms** |
| CLS | 0 | 0 |
| Overføring | 267 KiB | 699 KiB |

Feilede audits:

- Forside: `label-content-name-mismatch` (synlig tekst matcher ikke accessible
  name på minst ett element).
- Spill: `valid-source-maps` (store JS-bundler uten source maps),
  `label-content-name-mismatch`, `is-crawlable` (siden er blokkert fra
  indeksering) og `canonical` mangler. Perf-tapet er Phaser-bundelen (TBT 970 ms).

**Mot v2-målet (≥ 95 alle kategorier):** forsida passerer allerede; spillsida
feiler på Performance og SEO. Merk at v2 flytter spillet til /sandbox — kravet
i PRD Done 13 gjelder forside + /prosjekter, men spillsidens tall er baselinen
for mobiloptimaliseringsrunden (Done 21).

## axe-core (WCAG 2.1 A/AA + best practice)

**Forside — 1 brudd (moderate), 41 passes:**

- `region` (2 noder): «Skamløs pitch»-fanen (`GameTab`) og språktoggelen ligger
  utenfor landmark-strukturen.

**Spill — 2 brudd (moderate), 26 passes:**

- `landmark-one-main` (1 node): dokumentet mangler `<main>`.
- `region` (6 noder): canvas, kicker, `<h1>`, tagline og kontroll-`<dl>` ligger
  utenfor landmarks.
- I tillegg 14 **uavklarte** `color-contrast`-noder (serious impact, axe får
  ikke beregnet kontrast over spill-canvasen) — må sjekkes manuelt i v2-porten.

Ingen kritiske eller alvorlige bekreftede brudd på noen av sidene.

## Cookies, sporing og tredjeparter

Etter full navigasjon (forside → språkbytte → spill):

- **Cookies: 0.** Ingen tredjeparts-requests (alle kall til stianglomsrod.no).
- localStorage (funksjonelt): `site-lang` (språkvalg) og
  `skamlos-rpg:save:kompetansebyen` (spill-lagring).

v2-kravet «0 cookies, ingen tredjeparts-requests» (Done 10) er altså et
**behold-krav**, ikke et forbedringskrav.

## HTTP-hygiene (deploy)

- `Strict-Transport-Security: max-age=63072000` ✓
- **Mangler:** `Content-Security-Policy`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` — bør settes i v2 (vercel.json/headers).
- `Access-Control-Allow-Origin: *` settes globalt — unødvendig for HTML-sider,
  bør begrenses i v2.
- `robots.txt` → **404**, `sitemap.xml` → **404** (v2-PRD krever sitemap + meta/OG).
- `favicon.ico` → 200.

## Konsoll og motion

- Konsoll ren på begge sider (kun WebGL-ytelsesadvarsler i headless-miljø og én
  preload-advarsel for en CSS-chunk på forsida).
- `prefers-reduced-motion`: **respekteres på forsida** — scroll-reveal
  (`Reveal`-komponenten) viser alt innhold umiddelbart uten animasjon.
  Verifisert med emulert reduced motion (skjermbilde
  `deploy-forside-1440-reduced-motion.png`). Spillets motion-status dekkes i
  SPILL-ANALYSE.md.
- Merk: uten reduced motion er alt innhold under folden usynlig til det
  scrolles inn (IntersectionObserver-reveal). Fungerer for brukere, men
  innholdet er animasjons-/JS-avhengig for å bli synlig — full-page-verktøy
  (skjermbilder, print) ser en nesten tom side.

## Tema og språk

- Mørk modus finnes (følger `prefers-color-scheme`) og fungerer på forsida.
- Språktoggle NO/EN med `site-lang` i localStorage; EN-versjonen har kjent
  galleribug (se INNHOLD-INVENTAR.md).
