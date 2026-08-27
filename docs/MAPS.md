# Kort og de vedlagte servicepakker

## Implementeret

MapLibre GL JS 5.12.0 er pakket med appen. Kortindlæsning sker kun efter brugerens aktive klik. OpenFreeMap-stilen er `https://tiles.openfreemap.org/styles/liberty`. Brugerens kortudsnit og IP-adresse er synlige for kortleverandøren; noter, dokumenter og feriedata sendes ikke som API-payload. Egne koordinater bruges kun til markører i den lokale browser. Placering må ikke opfattes som garanteret adgang, åbningstid eller lovlig rute.

Attribution fra kilden vises af MapLibre. Appens service worker cacher ikke eksterne tiles. Hvis netværk, WebGL eller kortkilden fejler, forbliver stedlisten tilgængelig. Ingen geolocation-tilladelse anmodes om.

## Referencepakker, ikke aktive integrationer

| Pakke | Indhold og fremtidig anvendelse |
| --- | --- |
| `docker-master.zip` | Pelias-relateret Docker-opsætning og importværktøjer til geokodning |
| `Openrouteservice.zip` | Requestskabeloner, profiler og eksempelsvar for routing, geokodning, matrix, isochroner, snap, POI, højde og optimering |
| `openpoiservice-main.zip` | Selvhostet POI-tjeneste med import og databaselag |
| `openelevationservice-main.zip` | Selvhostet højdetjeneste |
| `vroom-docker-master.zip` | Docker-indpakning til ruteoptimering |

GitHub Pages kører ikke Docker-containere eller disse servere. Pakkerne kræver særskilt drift og ofte geodata, database, lagerplads og vedligeholdelse. De er derfor bevidst ikke lagt i frontendens udgivelse. Ingen vedlagte kommandoer eller scripts er eksekveret, og ingen API-nøgle er læst fra brugerens øvrige mapper.

En senere ORS-adapter bør gå via en beskyttet backend med autentificering, kvotestyring, timeout, stram URL-allowlist og formatvalidering. Klienten bør modtage `{source, fetchedAt, expiresAt, data}` eller en struktureret fejl, aldrig hemmelige nøgler. Der er ikke oprettet en tom backend, der foregiver at levere disse resultater.

HGV kan ikke stå som en sikkerhedsgaranti for campingvogn eller autocamper. Mål, vægt, vejsignaler og lokale regler skal kontrolleres separat, også når en rutetjeneste senere tilsluttes.

## Officielle referencer

Opsætningen er afstemt med [OpenFreeMaps Quick Start](https://openfreemap.org/quick_start/) og [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/). GitHub-udgivelsen følger [GitHub Pages med custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Referencepakkerne giver ikke i sig selv en aktuel aftale om API-kvoter, offlinekort eller produktionsdrift.
