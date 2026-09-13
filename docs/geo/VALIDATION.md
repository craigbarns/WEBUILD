# Validation technique et conditions de publication

Contrôles du 13 septembre 2026 sur `codex/geo-seo-marseille`. La production n’a pas été modifiée par ces contrôles.

## Vérifications réalisées

| Contrôle | Résultat | Portée |
|---|---|---|
| Construction statique | 21 pages HTML, 18 URL de sitemap | `npm run build` ; contenu accessible sans rendu React |
| HTML et syntaxe JS | Réussite | `npm run lint`, validation HTML et syntaxe des scripts |
| Tests automatisés | 9 réussis | Metadata, H1, liens/fragments/ressources, graphe, sitemap/robots, formulaires, assertions non documentées, mesure GEO et file d’avis |
| Responsive | 84 combinaisons réussies | 21 pages × 320, 390, 768, 1440 px ; aucun débordement horizontal détecté ni erreur JS relevée |
| Interactions | Réussite | Menu mobile/Escape, comparateur au clavier, FAQ native, refus conservé et acceptation de la mesure |
| Formulaire et fichier | Erreur, nouvelle tentative, multipart et succès simulés | POST interceptés localement : aucune demande ni notification envoyée à Netlify |
| Conversions | Visite directe/rechargement de merci sans faux lead ; succès simulé compté une fois | Événements navigateur, pas le compte GA4/Ads distant |
| Données des événements | Valeurs du formulaire et paramètres libres exclus ; campagnes locales connues conservées | Contrôle de `dataLayer` ; ne remplace pas une revue complète du fournisseur tiers |
| Sans JavaScript | Contenu investisseur et formulaire HTML accessibles | Réception réelle sans JS à vérifier chez Netlify |
| Images | Dimensions réelles vérifiées ; ALT et statut d’illustration corrigés | Origine et réalité des références non établies |

Résultats datés : [browser-check.json](browser-check.json). Captures dans `.artifacts/`, dossier local ignoré par Git. Ces tests ne constituent pas un audit d’accessibilité exhaustif sur tous les lecteurs d’écran et appareils.

Le JSON-LD est contrôlé pour sa syntaxe, ses types attendus, ses identifiants, son rattachement aux pages et sa correspondance au contenu validé. Il n’a pas été soumis au validateur distant sur une URL déployée. GeneralContractor est le type retenu ; ses super-types couvrent Organization et LocalBusiness. Sans adresse vérifiée, ne pas revendiquer l’éligibilité à un enrichissement Google LocalBusiness. Aucun rating, avis, certificat ou profil non confirmé n’a été ajouté.

`llms.txt` est factuel et généré à partir des pages indexables. Il n’est ni un signal de classement démontré ni une condition nécessaire à la présence dans les réponses IA. Les FAQ restent visibles ; aucun bénéfice de résultat enrichi FAQ n’est promis. [Documentation Google des fonctions IA](https://developers.google.com/search/docs/appearance/ai-features), [mises à jour Search Central](https://developers.google.com/search/updates).

## Performance et limites

Relevé mobile local : Lighthouse 13.4.1, `http://127.0.0.1:4173/`, 13 septembre 2026 à 14:28 UTC.

| Indicateur | Mesure |
|---|---:|
| Performance | 85/100 |
| Accessibilité automatisée | 100/100 |
| Bonnes pratiques automatisées | 100/100 |
| SEO technique Lighthouse | 100/100 |
| First Contentful Paint | 1,32 s |
| Largest Contentful Paint | 4,28 s |
| Total Blocking Time | 15,9 ms |
| Cumulative Layout Shift | 0 |

Le LCP simulé reste à améliorer. Les alertes concernent notamment les images, le CSS et la compression/cache du serveur local. Le score SEO Lighthouse ne mesure ni la pertinence commerciale ni l’indexation ni les citations IA. TBT n’est pas l’INP terrain.

Le relevé de production conservé dans [performance-lab.json](performance-lab.json) utilise un autre environnement, avec réseau et tags différents. Les essais de production ont fluctué : ne pas présenter la différence de scores comme un gain causal de la branche. Le serveur local n’applique pas les en-têtes CDN Netlify. PageSpeed Insights a répondu 429 et aucune donnée CrUX n’a été obtenue : les Core Web Vitals terrain restent non mesurés.

Améliorations appliquées : polices locales avec licences et préchargement latin, dimensions d’images, chargement différé des images secondaires, débordements mobiles corrigés, comparaison sans animation automatique, absence de chargement Google avant consentement. Les CSS/JS reçoivent une version dérivée de leur contenu pour renouveler aussi les fichiers anciennement conservés un an en cache ; les règles serveur demandent leur revalidation.

Suite : mesurer la version servie par Netlify, examiner tailles et formats d’images adaptés sans modifier la nature des visuels, puis suivre les données terrain. Aucune nouvelle image de chantier n’a été générée.

## Hébergement et indexation

Netlify construit et publie uniquement `dist`, avec Node 22. Rapports, scripts, ancien JSX et configuration interne ne sont pas copiés dans le site. Les anciennes URL publiques du rapport et du JSX reçoivent une règle 404. Les variantes www/http et alias `index.html` connus sont redirigés vers les URL canoniques.

`robots.txt` autorise le crawl et indique le sitemap canonique. Galerie, merci et 404 ne figurent pas au sitemap. La galerie est temporairement `noindex` jusqu’à l’intégration de cas vérifiés. Les contextes Netlify `deploy-preview` et `branch-deploy` reçoivent un `noindex` dans le HTML et X-Robots-Tag ; leurs sitemaps utilisent les URL de production.

Le crawl initial confirme les huit pages du sitemap en 200, la redirection www et un chemin réellement inconnu en 404. L’indexation effective, le canonical choisi et les exclusions restent à vérifier dans Search Console et Bing.

Après déploiement : contrôler accueil, nouvelles pages, variantes de domaine, alias `index.html`, chemin inconnu, robots/sitemap, metas téléchargées, cache et versions des ressources. Le serveur local n’exécute pas les règles Netlify.

## Points à résoudre avant publication

1. Confirmer société contractante, SIREN/SIRET/TVA, directeur de publication, adresse et contacts. L’audit explique le recoupement incomplet avec une société d’activité immobilière.
2. Valider les dossiers de chantiers et droits des photos. Les anciens chiffres et témoignages ont été retirés ; ne pas les rétablir sans preuve. Confirmer aussi le droit de conserver les images comme illustrations.
3. Relire les mentions et compléter la politique de données selon les pratiques réelles : conservation, base de traitement, destinataires, pièces et prestataires. Aucune durée interne n’a été inventée.
4. Vérifier la détection Forms et les notifications Netlify. Effectuer un test opérationnel identifié avec pièce jointe, constater la réception puis retirer le test. Limite navigateur : un JPG/PNG/PDF de 7 Mo ; contraintes du service à contrôler dans le compte. [Documentation Netlify Forms](https://docs.netlify.com/manage/forms/setup/).
5. Vérifier comptes analytics/Ads, objectifs et campagnes. Les événements locaux sont contrôlés, pas l’attribution distante. Le label Ads WhatsApp reste absent.
6. Confirmer les URL des profils avant `sameAs` et demandes d’avis. Le dispositif d’avis prépare des brouillons ; aucun envoi actif.

Les corrections et les livrables sont prêts à être relus ; ces points portent sur les faits et services externes manquants.
