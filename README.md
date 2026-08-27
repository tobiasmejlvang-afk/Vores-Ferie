# Vores Ferie

**Planlæg lidt. Oplev mere.** En privat dansk ferieapp til mobil, tablet og computer, bygget som en installerbar PWA til GitHub Pages.

Version **0.1.0** er en fungerende første udgave af den lokale feriekerne. Den er ikke den fulde implementering af alle fire faser i produkt- og designrapporten.

## Det kan appen

- Opret, redigér, start, afslut og genåbn ferier. Højst én ferie er aktiv.
- Planlæg oplevelser, ophold, transport og reservationer med dato, tid, varighed, noter og reservationsnummer.
- Brug pakkelister, udgiftsoversigt i DKK, gemte steder og favoritter.
- Gem billeder og tekst i et privat feriealbum. Udskriv til papir eller PDF via browseren.
- Gem PDF- og billedbilag, når arkivlås er aktiveret.
- Søg i eget arkiv. Se forklarlige tidskonflikter og budgetadvarsler.
- Fortryd de seneste 60 dataændringer i rækkefølge.
- Slå AES-GCM-kryptering af hele det lokale arkiv til med en adgangssætning.
- Eksportér og gendan en krypteret, integritetskontrolleret backup inklusive medier, bilag og historik.
- Brug kernefunktionerne offline efter første indlæsning. Indlæs et valgfrit OpenFreeMap-kort med MapLibre, efter samtykke.

Første åbning viser en tydeligt markeret **eksempel-ferie**. Den er kun i hukommelsen. Når du opretter din egen ferie, begynder et tomt personligt arkiv – eksemplerne følger ikke med.

## Udgiv på GitHub Pages

Kilden er beregnet til [tobiasmejlvang-afk/Vores-Ferie](https://github.com/tobiasmejlvang-afk/Vores-Ferie).

1. Åbn repositoryets **Settings → Pages**.
2. Vælg **GitHub Actions** under **Source**.
3. Åbn **Actions → Test and publish Vores Ferie → Run workflow**, eller push en ændring til `main`.
4. Workflowet tester og bygger appen og publicerer kun mappen `dist`.
5. GitHub viser udgivelsesadressen under Pages. Den forventede adresse for dette repository er `https://tobiasmejlvang-afk.github.io/Vores-Ferie/`.

Adressen er ikke et bevis på, at udgivelsen er aktiv; kontrollér workflowets deploy-job. Ingen API-nøgler eller repository-secrets er nødvendige.

Appens kildekode og medfølgende illustrationer er offentlige, når repositoryet er offentligt. Dine indtastede feriedata bliver på din enhed og kommer ikke med i GitHub-udgivelsen.

## Start lokalt

Installér Node.js 22 eller nyere; Node.js 24 bruges i GitHub Actions. Appen har ingen npm-afhængigheder, så `npm install` er ikke nødvendig.

```sh
npm test
npm run check
npm start
```

Åbn `http://127.0.0.1:4173`. `npm run build` opretter den statiske udgave i `dist`. Ved kildeændringer: byg igen, luk appfanerne, og genåbn. Service worker holder den forrige komplette version, indtil fanerne lukkes.

Alle URL'er er relative. Hash-navigation fungerer både på et domænes rod og under `/Vores-Ferie/`. Appen skal serveres via HTTPS eller localhost; dobbeltklik på `index.html` giver ikke et understøttet miljø til modules, IndexedDB og service worker.

## Beskyt dine data

**Slå arkivlås til og tag en backup, før du bruger appen til personlige oplysninger.** Uden arkivlås er browserlageret ikke krypteret. Med lås bruges AES-256-GCM og PBKDF2-SHA-256 med 600.000 iterationer, tilfældigt salt og IV. Adgangssætningen holdes kun i den åbne sessions hukommelse.

- Der er ingen konto, nulstilling af adgangssætning eller cloudsynkronisering.
- Browserdata kan blive fjernet af browseren eller ved enhedsproblemer. Installation og “Beskyt browserlager” erstatter ikke backup.
- Backupfilen er krypteret med sin egen adgangssætning. Ved gendannelse bliver denne også arkivets nye adgangssætning.
- Adgangssætninger skal gemmes sikkert. En glemt adgangssætning kan ikke gendannes.
- App-lås beskytter data i browserlageret, ikke en ulåst session, browserudvidelser med adgang eller en kompromitteret enhed.
- Appen deler origin med andre sider under samme `*.github.io`-konto. Brug et særskilt domæne, hvis der findes andre, mindre betroede apps på den origin. Det er ikke muligt at isolere IndexedDB sikkert ved hjælp af URL-stier alene.
- Enkeltvis fjernelse kan fortrydes og bevarer derfor tidligere data i historikken. “Ryd ændringshistorik” fjerner dem fra appens log. “Slet ferie” rydder hele historikken. “Slet alle lokale data” tømmer appens lager. Sikker fysisk overskrivning af browserens lager, OS-backups eller flashhukommelse kan ikke garanteres.
- Eksporterede filer ligger uden for appens kontrol og skal slettes separat. Dokumentdownload giver en ukrypteret kopi efter særskilt godkendelse.

## Bevidste begrænsninger

Ingen generativ AI, semantiske embeddings, automatisk billedfortolkning, live-vejr, rute- eller køretøjsberegning, trafikinformation, POI-søgning, geokodning, automatisk booking, betaling, cloudsynkronisering eller deling. Ingen valutaomregning. Rejsefæller og kæledyr er fritekst pr. ferie, ikke genbrugelige profiler. Steder er genbrugelige; ophold er endnu almindelige planpunkter.

Tidspunkter indtastes i lokal destinationstid. Tidszonekonvertering og etaper over midnat er ikke implementeret. Hver etape skal slutte senest kl. 24.00. Konfliktkontrol inkluderer ikke rejsetid eller åbningstider. Billeder tilknyttes manuelt. Kun JPG, PNG og WebP; ingen HEIC eller video. Maksimum 5 MB pr. fil, backupimport 100 MB. Store mediearkiver kræver næste lagringsversion; hele arkivet behandles samlet i hukommelsen. Første version erstatter ikke originale billeder eller dokumenters egen backup.

Læs [arkitektur og kildegrundlag](docs/ARCHITECTURE.md), [korttjenester](docs/MAPS.md) og [test og udgivelseskontrol](docs/QUALITY.md).

## Licenser og aktiver

MapLibre GL JS **5.12.0** er medtaget lokalt sammen med BSD-licensen i `public/vendor/MAPLIBRE-LICENSE.txt`. Navigationsikoner er et statisk udvalg af Lucide **1.8.0**, med licens i `public/vendor/LUCIDE-LICENSE.txt`.

Sisi- og Misser-illustrationerne stammer fra de brugerleverede designpakker; de er skaleret og komprimeret uden indholdsmæssig ændring. De oprindelige pakker, rapporten, API-filer, private testdata og gamle logoer med personportrætter publiceres ikke. Ingen ny distributionslicens tildeles brugerens illustrationer eller appkilde med dette repository. Ejeren bør kontrollere rettighederne til illustrationerne før bred distribution.
