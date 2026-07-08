# Kreativ brief — stianglomsrod.no v2

**Versjon:** 1.0 · 08.07.2026
**Eier:** Stian Glomsrød
**Mottaker:** Claude Design
**Formål:** Grunnlag for en komplett styling guide (design tokens, typografi, farger, komponentstiler, motion-prinsipper) som deretter bygges av Claude Code. Bygging er utenfor scope her.

---

## 1. Leveransen fra Claude Design

En styling guide som minimum inneholder:

1. Navngitte design tokens (farger, typografi, spacing, radius, motion) i **både lys og mørk modus**
2. Full spesifikasjon av **kodeblokken som identitetsbærer** (se §5): syntaksfarger, mono-font, markør, interaktive tilstander
3. Eksempelkomponenter: hero, case-kort, CHANGELOG-innslag, README-seksjon, footer/kolofon
4. Motion-prinsipper med definerte `prefers-reduced-motion`-fallbacks
5. Kontrastdokumentasjon: WCAG-kontrast per tokenpar, inkludert syntaksfarger på kodeflaten

---

## 2. Hvem siden handler om

Stian Glomsrød, Halden. Lærer med fersk master i digital læringsdesign (OsloMet, 2026) som er på vei inn i utviklerrollen. Lærer seg programmering i dybden (nå: Java-grunnkurs) **parallelt med** de nyeste agentiske KI-arbeidsflytene (Claude Code, egne skills, goal-loops, guardrails). Bygger ekte ting underveis: Klar (masterprosjekt, fungerende PWA for elever med eksekutive vansker), Companion-app, kundeleveranse for Lori Frisør, Figma-prototyper.

Merkevare: **ærlighet fremfor overselging.** Små påstander, tung dokumentasjon. Humor: tørr, nerdete, selvironisk.

## 3. Målgrupper (rangert)

1. **Arbeidsgivere** — AI-first- og utviklerroller. Siden er selv hovedbeviset: den skal demonstrere både håndverk og moderne KI-arbeidsflyt.
2. **Stian selv** — siden er en sandbox for lek og læring, og skal aldri være «ferdig».
3. **Fagfeller og nettverk.**
4. Kunder/oppdrag — lav prioritet; et separat selskapsnettsted dekker dem. **Ingen salgslogikk her.**

## 4. Konsept

**Et kjørende program, ikke en brosjyre.** Hero-en er kode som står suspendert midt i en `await` — nettsiden dokumenterer et menneske og et løp som pågår. Alt siden påstår, skal den bevise ett klikk unna (show, don't tell). Sandbox-preget er en feature: uferdighet med hensikt.

## 5. Hero — LÅST spesifikasjon

Hero-en skal være **faktisk interaktiv**, ikke stilisert tekst. Innholdet er låst:

```js
const jobb = await Promise.all([
  lærProgrammering(),   // nå: Java-grunnkurs, Coursera
  lærKI(),              // nå: fikser gamle prosjekter med Claude Code
]);
```

Under kodeblokken vises runtime-tilstanden, som i en konsoll:

```
> jobb
Promise { <pending> }
```

**Funksjonskrav (blir verifiserbare Done-kriterier i PRD-en):**

- `lærProgrammering()` og `lærKI()` kan klikkes/aktiveres med tastatur og ekspanderer en «nå:»-status
- «nå:»-data er datadrevet: `now.json` (manuelt felt, f.eks. kursprogresjon) + GitHub API (siste commit/repo, cachet) — hero-en kan aldri bli stale
- Blinkende markør etter `]);` — programmet står suspendert
- `<pending>` er klikkbar og er sidens **primære CTA** → kontakt («leseren kan resolve promisen»)
- Skjult semantisk H1 i klartekst for skjermlesere
- `aria-expanded` på ekspanderbare elementer, synlig fokus, full tastaturnavigasjon
- All animasjon respekterer `prefers-reduced-motion`

**Kommentarregel (redaksjonell):** kommentarer i kode skal være tørre og faktiske, som ekte kodekommentarer. Kunne linjen stått på en motivasjonsplakat → stryk. Engelsk kode, norske kommentarer.

## 6. Innholdsarkitektur (for omfang og komponentbehov)

- **Forside** — hero (§5) + to–tre utvalgte bevis
- **Prosjekter** — case-kort i formatet problem → innsikt → valg → resultat → læring. Klar er hovedcase med demo og video; deretter Companion, Lori Frisør og Figma-prototypene
- **Læringsreisen** — formatert som CHANGELOG/release notes: `v0.1 (2007): Introduction to Programming — karakter D, dokumentert som known issue` → `v2.0 (2026): Klar i produksjon` → `v2.x-beta: nå`
- **/sandbox** — verkstedet: eksperimenter, egne skills, lekne prosjekter
- **Slik jobber jeg** — README-format: goals, guardrails, menneske i loopen
- **Kolofon** — slik ble denne siden bygget (agentisk arbeidsflyt, tilgjengelighetsvalg, ytelsestall) + tilgjengelighetserklæring + personvern
- **Om/kontakt** — kort
- **404** — reservert en leken robot-easter-egg

Kodespråket brukes som **krydder, ikke temapark**: navigasjon, brødtekst og kontakt i klart norsk.

## 7. Designretning

- **Stemning:** verksted. Presist, ærlig, rolig — med lekenhet i detaljene. Senioritet gjennom ro, ikke støy.
- **Typografi:** mono-font som identitetsbærer (hero, labels, annotasjoner, CHANGELOG); varm/humanistisk sans for brødtekst. Begrunn paret. **Ikke** Lexend, Sora, Space Grotesk, Manrope, Bricolage eller Outfit (reservert annet prosjekt). Kun fonter med åpen lisens; lisens dokumenteres.
- **Farge:** kodeflaten (mørk) er ankerkomponent i *begge* sidetemaer; syntakspaletten kan gjerne være kilde til sidens aksentfarger. Full lys/mørk-modus.
- **Unngå KI-standardlookene:** (1) krem bakgrunn + kontrastserif + terracotta/clay-aksent, (2) nesten-svart + én acid-grønn/vermilion aksent, (3) broadsheet med hairlines og null radius. Den mørke kodeblokken er en komponent — ikke en unnskyldning for look 2.
- **Signatur:** velg ÉN og bruk dristigheten der. Kandidater: (a) pending-promisen som leseren kan resolve, (b) «stillas-uttrekking»-reveal ved sidelast — designannotasjoner/grid som demonteres og etterlater det rene resultatet (reduced motion → rett til sluttbildet). Alt annet holdes stramt.
- **Motion:** formålsdrevet, orkestrert heller enn spredt. Alt bak `prefers-reduced-motion`.
- **Avgrensning:** identiteten skal være tydelig adskilt fra eierens selskapsprofil (intet gult punktum/nagle-motiv, intet tusj-markeringsspråk).

## 8. Harde krav (ufravikelige)

- WCAG 2.1 AA: semantisk HTML, tastatur, synlig fokus, kontrast dokumentert per tokenpar — også syntaksfarger mot kodeflaten
- `prefers-reduced-motion` respektert overalt
- Cookiefritt som standard; ingen sporingscookies
- Ytelsesmål: rask LCP, Lighthouse ≥ 95 på alle kategorier som ambisjon
- Fontlisenser dokumentert i styling-guiden
- Lori Frisør-casen: skriftlig kundegodkjenning bekreftes før navn/skjermbilder designes inn

## 9. Utenfor scope for Claude Design

Endelig tekstinnhold, stackvalg, endringer i informasjonsarkitekturen og selve byggingen (håndteres i PRD/goal-loop med Claude Code). Styling-guiden regnes som komplett når alle punktene i §1 er levert.

## 10. Stemme og tone (kort)

Tørt, presist, selvironisk der det passer. Aldri «10x», aldri hype, aldri løfter uten kvittering. Klarspråk i alt som ikke er kode.
