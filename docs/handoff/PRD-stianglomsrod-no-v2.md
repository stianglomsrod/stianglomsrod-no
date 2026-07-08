# PRD: stianglomsrod.no v2 — «et kjørende program»

*08.07.2026 · Compliance-port: 🟢 GRØNT (kjørt, grønn-krav foldet inn i Done) · Grunnlag: Kreativ brief v1.0 + Endelig Guide v2 (kanonisk), v1 (vedlegg), tokens.css (fasit), README-handoff*

## Scope
Nybygg: riv og erstatt stianglomsrod.no. Personlig utviklerportefølje + sandbox som selv demonstrerer arbeidsmåten (agentisk KI, guardrails, UU). Designet er ferdig spesifisert; denne PRD-en gjør det byggbart og verifiserbart.

## Stack
- **Astro** (statisk først; islands kun for hero, ticker, tema-toggle, skjema), deploy på **Vercel**
- Ren CSS fra **tokens.css** (fasit ved konflikt); minimal JS, progressive enhancement (View Transitions, scroll-driven animations, @property/oklch, container queries, :has(), popover/dialog — alle med fallback)
- Serverless functions: `/api/kontakt` (Resend-epost) og GitHub-henting server-side/ved bygg med cache
- Tre self-hostede fonter (SIL OFL): Atkinson Hyperlegible, Cascadia Code, Anybody (subsettes)
- Repo: avklares mot github.com/stianglomsrod (gjenbruk `portfolio-site` eller nytt) — **Claude Code sjekker repoet ved oppstart**

## Surfaces
- **Sider (8):** forside · /prosjekter · /laeringsreisen · /sandbox (inkl. spillet «Skamløs pitch») · /slik-jobber-jeg · /kolofon (inkl. tilgjengelighetserklæring + personvern) · /om (portrett-byste, STIAN(1)-manside, kontaktskjema) · 404 (robot, arver hue)
- **Komponenter:** hero (kodeblokk m/ WIP:-kommentarer + Node-REPL-terminal + pending-CTA), navnetrekk «stian glomsrød▮», ticker m/ pausekontroll, badges, case-kort, CHANGELOG m/ commit-feed, contribution-heatmap, README-seksjon, nav (uten hamburger), footer, tema-toggle
- **Filer/infra:** implementert tokens.css (inkl. reelt utfylt `[data-theme="light"]`), `now.json`, statisk GitHub-fallback-snapshot, fonts/ (subset), sitemap + meta/OG

## Data
- **now.json** (manuelt, i repo): `{ "fullstack": "Full Stack Open: del 1/13", "ki": "fikser gamle prosjekter med Claude Code", "soker": "utvikler / ux" }` → hero-«nå:»-rader + ticker
- **GitHub** (bruker stianglomsrod): REST `/users/:user/events` → siste commits (cache 1–6 t); GraphQL `contributionsCollection` → heatmap (krever token, kun server-side, cache 6 t). Begge med statisk fallback; skjermleser får heatmap-sum i klartekst
- **Kontakt:** navn (valgfri), e-post (påkrevd), melding (påkrevd) + honeypot + tidssjekk → `/api/kontakt` → Resend-epost til stianglomsrod@gmail.com. **Ingenting lagres.**
- **localStorage** (funksjonelt, cookiefritt): `data-theme`, sandbox-`hue` (tall, clampes 0–360)
- **Spilldata:** «Skamløs pitch» leser samme kilder som siden (now.json + prosjekt-/profilinnhold) — én sannhet, ingen duplisert tekst i spillkoden der siden eier dataene

## Constraints
- Hero-innhold LÅST (brief §5 + rettelser 08.07): terminal `$ node` → `> jobb` → `Promise { <pending> }`; `// WIP:`-kommentarene rendres fra now.json i låst format `// WIP: <verdi>` (per nå: «Full Stack Open, React» og «fikser gamle prosjekter med Claude Code») — tørre og faktiske, aldri slagord
- Kodeflate-tokens (#1b212b / #12161e) identiske i begge temaer — endres aldri
- Ingen cookies, ingen sporing/analytics, ingen captcha, ingen tredjeparts-requests i klient
- Ingen Grindverk-motiver (gult punktum/nagle/tusj); punktum i navnetrekk erstattet av markør ▮
- Secrets (GITHUB_TOKEN, RESEND_API_KEY) kun i miljøvariabler — aldri i repo/klient
- Sikkerhet (/api/kontakt): allowlist-validering + lengdegrenser, output-encoding i e-post (ingen HTML-injeksjon), enkel rate-limit, feiler trygt uten detaljer. GitHub-kall har faste URL-er (ingen brukerstyrt fetch)
- «Skamløs pitch» BEHOLDES: porteres fra github.com/stianglomsrod/portfolio-site (Claude Code finner spillkoden der) og får en egen mobiloptimaliseringsrunde; spillmekanikken bevares
- Lori Frisør-innhold m/ navn/skjermbilder KUN hvis skriftlig godkjenning er arkivert; ellers nøytralt plassholderkort
- **Ute av v1:** engelsk versjon, CMS, blogg, kommentarer, analytics, Klar-innbygging (kun lenker/demo-peker)

## Done
1. `npm run build` uten feil; alle 8 ruter svarer 200 i `npm run preview` (curl-sjekk per rute)
2. Hero-kodeblokk: statisk del matcher låst spec tegn for tegn; `// WIP:`-kommentarene rendres fra now.json (diff mot now-verdiene); terminalen viser `$ node` / `> jobb` / `Promise { <pending> }` / `>▮`
3. `lærProgrammering()`/`lærKI()` togglbare med mus og Enter/Space; `aria-expanded` skifter; «nå:»-rad viser now.json-verdier — verifiser ved å endre now.json og rebuilde
4. `<pending>` er sidens primære CTA → kontakt; 2 px synlig fokus; skjult semantisk H1 finnes i DOM på forsiden
5. Navnetrekk: Anybody, markør ▮ blinker 1,06 s steps(2); ved emulert reduced motion: statisk fylt markør + statisk wdth
6. Ticker viser now.json + siste commit; pausekontroll ≥ 44×44 px m/ `aria-pressed` stopper loopen; reduced motion → statisk
7. GitHub-feed + heatmap rendrer fra cache/bygg; uten token/nettverk vises fallback-snapshot uten konsollfeil; heatmap-sum i klartekst for skjermlesere
8. Skjema: klarspråkvalidering m/ ikon (aldri farge alene), feil koblet via `aria-describedby`; honeypot/for-rask innsending avvises stille; gyldig innsending gir «Promise resolved. Svarer innen 24t.» og e-post mottas (manuell test)
9. Testpayloads mot `/api/kontakt` (HTML/script i felter, 100 kB melding, tom body) avvises/escapes; svar lekker ikke stacktrace
10. 0 cookies etter full navigasjon (DevTools) og ingen tredjeparts-requests (Network)
11. Tema følger prefers-color-scheme, toggle persisterer; kodeflaten identisk i begge; dagmodus = v1-papirtokens; `[data-theme="light"]` reelt utfylt
12. Sandbox-hue persisterer, gjelder kun /sandbox + 404; AA-kontrast holder ved hue 0/90/180/270 (stikkprøve)
13. Lighthouse ≥ 95 i alle fire kategorier på forside + /prosjekter (mobil, prod-bygg); rapport arkiveres til kolofonen
14. axe/pa11y uten kritiske funn på alle 8 sider; full tastaturvandring på forsiden uten feller; klikkflater ≥ 44×44 px
15. Emulert reduced motion: intro, ticker, puls, markør, navnetrekk og scroll-effekter statiske fra 0 ms
16. tokens.css implementert 1:1 (stikkprøve-diff på 10 tokens, begge moduser)
17. Fonter: 3 self-hostede filer; Anybody subsettet til navneglyfer + sifre (mål < 15 kB); lisenser + byggehistorie + tilgjengelighetserklæring + personverntekst (behandlingsgrunnlag for skjema) på plass i kolofonen, lenket fra footer
18. `git grep` etter nøkler/tokens gir null treff; endepunkter leser kun env-variabler
19. Lori Frisør-sjekk før deploy: godkjenning arkivert ELLER plassholderkort aktivt
20. Grønn release-gate (norwegian-software-guardrails) gjennomgått og OK før prod-deploy; avvik dokumentert
21. «Skamløs pitch» kjører fra /sandbox: spillbart ved 375 px bredde uten horisontal scroll, touch-kontroller ≥ 44×44 px, kan pauses/avsluttes med både touch og tastatur
22. Spillet reflekterer sidens innhold: endre now.json og ett prosjektfelt → rebuild → spillet viser de nye verdiene uten at spillkoden endres

---

## Vedlegg A — Forutsetninger: Stians oppgaver
1. **GitHub-token:** github.com → Settings → Developer settings → Fine-grained personal access tokens → generer (ingen repo-tilganger nødvendig — offentlige data holder; utløp f.eks. 12 mnd) → Vercel: Project → Settings → Environment Variables → `GITHUB_TOKEN` (Production + Preview)
2. **Resend:** opprett konto → Domains → legg til stianglomsrod.no → legg inn SPF/DKIM-DNS-postene hos domeneleverandøren → API Keys → `RESEND_API_KEY` i Vercel. Avsender: f.eks. kontakt@stianglomsrod.no
3. **now.json:** rediger fila i repo-roten når status endres; commit → deploy oppdaterer hero + ticker
4. **Lori Frisør:** innhent skriftlig OK (e-post/melding holder) og arkiver den; si fra når den finnes
5. **Portrett:** lever byste-utsnitt av stian.png (eller la bygget beskjære)

## Vedlegg B — Goal-loop
Gi Claude Code denne PRD-en som `/goal`. Loop: forsøk → sjekk output mot Done 1–22 → mat konkrete mangler tilbake → gjenta til alt passerer. Invarianter per iterasjon: **rødt blokkerer** (nye/endrede features sjekkes mot compliance-porten før kode) og **grønn release-gate før done** (kriterium 20).
