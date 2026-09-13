# WEBUILD Marseille

Site statique HTML/CSS/JavaScript sur Netlify. [Audit GEO/SEO et plan 7/30/90 jours](docs/geo/AUDIT-2026-09-13.md).

## Construire et vérifier

Node.js 22 ou plus récent. Dépendances verrouillées par `package-lock.json`.

```sh
npm ci
npm run build
npm run lint
npm test
npm run preview
```

Aperçu : `http://127.0.0.1:4173/`. Le serveur local refuse les soumissions et n’émule pas les règles Netlify. Les fichiers publics sont construits dans `dist/` ; rapports, scripts et configuration interne en sont exclus.

Avec l’aperçu démarré, dans un autre terminal :

```sh
npm run test:browser
node scripts/performance-check.mjs
```

Chrome utilise son chemin macOS par défaut ; définir `CHROME_PATH` sur une autre plateforme. `PREVIEW_URL` change l’origine des tests navigateur. Les tests interceptent les POST et les requêtes Google : aucune demande réelle n’est envoyée. Captures et rapports Lighthouse complets dans `.artifacts/`. Les comptes distants et les CWV terrain ne sont pas validés par ces tests.

## Modifier une page

Éditer le HTML et l’entrée de `site.config.json` : title, description, rôle, indexabilité, parent et date réelle. Le build remplace metadata/JSON-LD, met à jour les fils d’Ariane, versionne CSS/JS et génère sitemap, robots et llms.txt. Pour reporter les éléments générés dans les sources suivies :

```sh
node scripts/build.mjs --write-source
npm run lint
npm test
```

Enregistrer toute nouvelle page dans `site.config.json` et ajouter son maillage. Ne pas modifier `dist/` directement. Les coordonnées/profils JSON-LD restent absents jusqu’à validation de `verifiedContact`, `verifiedAddress` et `verifiedSameAs`. Mettre alors à jour les textes visibles et tests du registre de faits. Les réalisations attendent de vrais dossiers : [gabarit](docs/geo/FICHE-REALISATION.md).

Outfit et Syne sont hébergées localement avec licences OFL dans `fonts/`. L’origine des photographies n’est pas confirmée : ne pas les attribuer à un chantier sans validation.

## Netlify et publication

La configuration utilise Node 22 et exécute build, lint et tests avant publication de `dist`. Les aperçus de branche/PR sont `noindex`. Une fusion peut déclencher la production : effectuer d’abord la [revue de validation](docs/geo/VALIDATION.md), notamment les faits administratifs et les images.

Les deux formulaires portent le nom `devis` et les mêmes champs. FormData préserve une pièce jointe. L’interception locale ne prouve pas la réception Netlify : vérifier le compte, les notifications et les pièces lors d’un test opérationnel convenu.

## Opérations GEO et avis

- [Plan éditorial](docs/geo/PLAN-EDITORIAL.md) : 16 briefs et quatre guides rédigés.
- [Présence externe et avis](docs/geo/PRESENCE-EXTERNE.md) : NAP, profils et file de demandes sans envoi.
- [Mesure](docs/geo/MESURE.md) : KPI et protocole de 60 prompts sur sept surfaces.
- `node scripts/geo-summary.mjs docs/geo/geo-results.template.json` : taux inconnus jusqu’aux tests réels.
- `node scripts/review-requests.mjs customers.local.json outbox.local.json` : brouillons après réception confirmée, sans réseau ni message envoyé.

Ne pas committer de fichier client ou export nominatif. `*.local.json` et `.env*` sont ignorés ; conserver justificatifs et exports privés hors du dépôt public. Le crawl HTTP en lecture seule `scripts/audit-live.py` utilise `requirements-dev.txt` ; préciser `--output` pour conserver l’état initial.
