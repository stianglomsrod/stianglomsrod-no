# Compliance-register

> Register over regulatoriske vurderinger for prosjektet. Oppdateres ved hver
> vesentlig ny feature. Ikke juridisk rådgivning.

**Prosjekt:** stianglomsrod.no v2  **Samlet trafikklys:** 🟢 GRØNT  **Sist oppdatert:** 2026-07-08

| # | Område | Relevant? | Farge | Vurdering / status | Nødvendig tiltak/dokument | Ansvarlig |
|---|---|---|---|---|---|---|
| 1 | Personvern – roller | Ja | 🟢 | Stian er behandlingsansvarlig for kontaktskjemaet (navn/e-post/melding). Ingenting lagres — kun videresending som e-post. | Personverntekst m/ behandlingsgrunnlag i kolofon (Done 17) | Stian |
| 2 | Databehandleravtale | Ja | 🟢 | Resend (e-postutsending) og Vercel (hosting/serverless) behandler skjemadata i transitt. | Aksepter Resend + Vercel DPA (standardvilkår); navngi begge i personvernteksten | Stian |
| 3 | DPIA | Nei | 🟢 | Screening: lav risiko — ingen lagring, ingen profilering, ingen særlige kategorier, liten skala. Full DPIA ikke påkrevd. | — | — |
| 4 | Tredjelandsoverføring | Ja | 🟢 | Resend/Vercel er US-selskaper (DPF/SCC). Kun kontaktskjemadata i transitt. | Velg EU-region der tilgjengelig; dokumenter overføringsgrunnlag i personvernteksten | Claude Code |
| 5 | Cookies/sporing | Ja | 🟢 | Mål: 0 cookies, ingen analytics. localStorage for tema/hue er funksjonelt og brukerinitiert — utenfor samtykkekrav. | Done 10 verifiserer (DevTools: 0 cookies, ingen tredjeparts-requests) | Claude Code |
| 6 | Universell utforming (WCAG) | Ja | 🟢 | Privat personlig nettside — utenfor uu-tilsynets pliktsubjekter, men WCAG 2.1 AA er selvpålagt hardt krav. | Done 14 (axe/pa11y, tastatur, kontrast per tokenpar) | Claude Code |
| 7 | IKT-sikkerhet | Ja | 🟢 | /api/kontakt: allowlist-validering, lengdegrenser, output-encoding, rate-limit, trygg feiling. Secrets kun i env. | Done 9 + 18; secure-dev-guardrails ved bygging | Claude Code |
| 8 | Digitalsikkerhetsloven | Nei | 🟢 | Ikke samfunnskritisk tjeneste. | — | — |
| 9 | KI-forordningen | Nei | 🟢 | KI brukes som utviklingsverktøy, ikke som funksjon i produktet. Ingen KI-beslutninger mot brukere. | Kolofonen beskriver arbeidsflyten (transparens, frivillig) | — |
| 10 | Helse / medisinsk utstyr | Nei | 🟢 | Ikke relevant. Klar omtales kun som case. | — | — |
| 11 | Betaling/finans | Nei | 🟢 | Ingen salgslogikk (brief §3). | — | — |
| 12 | DSA / plattform / UGC | Nei | 🟢 | Ingen brukergenerert innhold. | — | — |
| 13 | Forbruker/markedsføring | Nei | 🟢 | Ingen e-handel, intet nyhetsbrev. | — | — |
| 14 | Barn / skole / elevdata | Nei | 🟢 | Ingen elevdata på siden. Klar-casen omtales uten persondata (jf. profilregler). | — | — |
| 15 | eID / eIDAS | Nei | 🟢 | Ingen innlogging. | — | — |
| 16 | IP / opphavsrett / lisens | Ja | 🟢 | Fonter: SIL OFL 1.1 ×3 (dokumenteres, Done 17). Spillmotor Phaser: MIT. Portrett: egeneid. Lori Frisør: navn/skjermbilder krever arkivert skriftlig godkjenning (Done 19), ellers plassholderkort. | Lisensdokumentasjon i kolofon; Lori-sjekk før deploy | Stian (Lori-OK) |
| 17 | Offentlig anskaffelse | Nei | 🟢 | Privat prosjekt. | — | — |

**Konklusjon:** Ingen gule/røde områder. Release-gate (Done 20) kjøres før
prod-deploy; avvik dokumenteres i `docs/BESLUTNINGER.md`.
