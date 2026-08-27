# Arkitektur og kildegrundlag

## Valg

Den aktuelle bestilling om en app, der kan udgives via GitHub, styrer leverancen. Produkt- og designrapporten v1.0 er brugt som produktreference; indlejrede procesinstruktioner, versionsbindinger og henvisninger til andre dokumenter er ikke behandlet som brugerordrer.

En statisk klient opfylder rapportens lokale kerne uden at placere hemmelige API-nøgler på GitHub. HTML, CSS og native ES-moduler kræver ingen framework-runtime. De eneste tredjepartsaktiver er fastlåste lokale kort- og ikonfiler.

## Struktur

| Fil | Ansvar |
| --- | --- |
| `public/src/model.js` | Feriedomæne, skemavalidering, regler, søgning, atomiske ændringer og fortryd |
| `public/src/storage.js` | IndexedDB, transaktion og revisionskontrol ved flere faner |
| `public/src/crypto.js` | AES-GCM, PBKDF2, backupmanifest og hashkontrol |
| `public/src/views.js` | Seks visninger, formularhjælpere og HTML-escaping |
| `public/src/app.js` | Hændelser, dialoger, lås, filer og kortsamtykke |
| `public/styles.css` | Skovgrøn/sandfarvet design, responsive layouts, print og fokus |
| `scripts/build.mjs` | Statisk build og versionsmærket offlinecache |
| `.github/workflows/pages.yml` | Tests, kontrol, build og GitHub Pages |

## Datamodel, version 1

`trips` er hovedkonteksten. `plans`, `packing`, `expenses`, `memories` og `files` har `tripId`; planpunkter kan referere til genbrugelige `places`. Alle id'er er UUID'er; kun eksempeldata har læsbare id'er. Validering afviser dubletter og forældreløse relationer, ugyldige datoer, ukendte typer og ulovlige medieformater.

Beløb er heltalsøre i DKK. Ferier er højst 367 dage. Datoer er ISO-kalenderdatoer og ikke implicit UTC-konverterede klokkeslæt. Højst én ferie er aktiv. Afkortning af en ferie afvises, hvis tilknyttede planpunkter eller minder falder udenfor.

Alle ændringer klones og valideres før lagring. Historikken gemmer separate før-/efterbilleder. Fortryd sker i omvendt rækkefølge og verificerer den nuværende værdi før overskrivning. Permanent feriesletning fjerner tilknyttede objekter, rydder historikken og bevarer fælles steder. Indstillinger og afviste forslag har ikke almindelig fortryd.

IndexedDB-opdateringen kontrollerer revisionen i samme readwrite-transaktion som skrivningen. En fane med forældede data får en fejl og kan ikke overskrive nyere data. Ved lagerfejl vises ikke falsk succes; den tidligere gemte udgave forbliver autoritativ. Kryptering udføres før transaktionen. Importer valideres før erstatning og kræver separat godkendelse.

Version 1 er første format. Ukendte versioner afvises; der er endnu ingen migration fra ældre Vores Camping-installationer eller automatisk merge af arkiver.

## Offline og opdateringer

Service worker cacher kun appens egne versionsmærkede ressourcer. Persondata forbliver i IndexedDB; brugerfiler og eksterne kortsvar kommer ikke i appcachen. Ny version overtager efter alle gamle appfaner er lukket. En afbrudt installation aktiverer ikke en halv cache. Kort er en onlinefunktion med en lokal stedliste som fallback.

## Designkilder

- `Tema & Design.zip`: Skovgrøn `#233B2E`, sand `#E7D6B6`, creme `#F5F1E6`, karamel `#C49A58` og roligt hierarki.
- `Sektioner & Elementer.zip`: Mønstre for kort, chips, formularer og navigation. Gamle personlige Camping-logoer er ikke genbrugt.
- `Ferie Administrationen.zip`: Sisi som guide/vagt og Misser som grafiker/meteorolog. To illustrationer bruges som værter; de er ikke selv en AI-implementering.
- Rapport v1.0: De seks områder, lokal lagring, godkendelse, forklaring, eksport og første versions afgrænsning.
- De fem kort-/Docker-pakker: gennemgået som eksterne service- og requestreferencer; de er ikke kørt eller inkluderet i klienten. Se MAPS.md.

## Næste udvidelser

1. Separat bloblager med streaming-backup og nøglehierarki til store mediearkiver; versionsmigration og konfliktsikker merge.
2. Genbrugelige personer og kæledyr, selvstændige ophold, præcis tidszonemodel og reservationer med betalings-/afbestillingsfelter.
3. Afgrænset serveradapter til kortdata og vejr med samtykke, rate limits, fejltilstande og kilde-/friskhedsvisning.
4. Først derefter lokal inferens, valgfri generativ hjælp og krypteret synkronisering.
