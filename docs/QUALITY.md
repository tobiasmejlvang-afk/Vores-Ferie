# Test og udgivelseskontrol – 0.1.0

## Automatiseret

`npm test` indeholder 23 beståede tests for kalenderdatoer, heltalsbeløb, én aktiv ferie, datarelationer, uforanderlige historik-snapshots, fortryd, permanent kaskadesletning, planoverlap, reservationsbeskyttelse, budgetkontrol, søgning, HTML-escaping, medieformatvalidering, historikgrænse og krypteret backup.

Backup testes med data, billeder, dokumenter og ændringshistorik: eksport, dekryptering og gendannelse giver samme datamodel. Forkert adgangssætning, ændret ciphertext, ukendt formatversion og manipulerede KDF-parametre afvises. Ingen private brugerdata indgår i testene.

`npm run check` kontrollerer JavaScript-syntaks, sikkerheds-/sprogmetadata, alle nødvendige aktiver og tredjepartslicenser. `npm run build` producerer statiske filer og en indholdshashet service worker. GitHub Actions kører alle tre trin før deployment. Actions er fastlåst til officielle commit-SHA'er.

## Kontrolleret i browseren under udvikling

- Dansk startside, hovednavigation, designreference og tydelig eksempeltilstand.
- Oprettelse af egen ferie uden import af eksempeldata.
- Tilføjelse af planpunkt og pakkepunkt.
- Pakkestatus og ferieoplysninger bevares efter genindlæsning.
- Arkivlås kan aktiveres; genindlæsning viser låseskærmen i stedet for data.
- Forkert adgangssætning afvises. Rigtig adgangssætning åbner arkivet.
- Genindlæsning fra service-worker-cache med den lokale server stoppet; arkivet kunne låses op og navigeres uden serveren.
- Ingen konsolfejl i de kontrollerede grundflows før offline-testen.

Browserkontrollen bruger kun syntetiske testoplysninger og er ikke en fuld certificering af appen.

## Skal afprøves på ejerens målenheder før følsom brug

- Installation og flytilstand på iPhone/iPad/Safari og Android/Chrome.
- Skærmlæser, tekstzoom, udendørs kontrast og hele keyboardforløbet.
- Fuld backup-download og gendannelse via filvælger på de konkrete enheder, herunder en tom installation og alle medietyper.
- Store mediesamlinger, lav lagerkvote, enhedstab og browserens automatiske oprydning.
- Eksternt kort på enheder med forskellige WebGL-drivere og kortleverandørens aktuelle driftsstatus.
- Flere samtidige faner og afbrudte gemninger på de konkrete mobile browsere.
- Uafhængig sikkerhedsgennemgang før arkivering af pas eller andre særligt følsomme dokumenter.

Rapportens samlede kvalitetsport for alle fire produktfaser er **ikke** bestået af denne første version. Ikke-implementerede funktioner er beskrevet i README og står som utilsluttede i appen; der vises ingen opdigtede live-data eller AI-resultater.
