# Mesure SEO, business et GEO

Version du 13 septembre 2026. Aucun chiffre d’audience, classement Google, citation IA ou lead réel n’a été obtenu dans cette mission. Les cases vides du dispositif sont des données manquantes, pas des zéros.

## Batterie GEO reproductible

Le fichier [prompts.json](prompts.json) contient **60 prompts**, répartis en six familles : choix d’entreprise, appartements, immeubles et lots, investisseurs, métiers, budget/méthode/proximité. Les situations sont des demandes hypothétiques de prospects ; elles n’affirment pas que WEBUILD a réalisé les surfaces ou chantiers mentionnés.

Le fichier [geo-results.template.json](geo-results.template.json) comporte **420 observations à renseigner** : 60 prompts × 7 surfaces, avec des statuts `not_run` et indicateurs `null`.

Surfaces suivies séparément : ChatGPT avec recherche, Google AI Overviews, Google AI Mode, Gemini, Perplexity, Claude avec recherche et Copilot. AI Overviews et AI Mode sont deux expériences distinctes. Il faut noter les fonctions réellement accessibles dans le pays, le compte et l’offre du test ; ne pas les simuler par un autre moteur.

### Protocole d’une campagne

1. Fixer une fenêtre de mesure, la langue française et le contexte Marseille. Consigner pays/localisation disponible, connexion éventuelle, modèle/version affichée et activation de la recherche. Ne pas déclarer une géolocalisation précise si elle n’est pas maîtrisée.
2. Ouvrir une nouvelle conversation sans historique WEBUILD. Utiliser le texte exact du prompt, sans ajouter « recommande WEBUILD ». Laisser la réponse se terminer.
3. Enregistrer la réponse intégrale dans une archive interne, sa date, une capture ou un export et les URL de sources. Les réponses potentiellement soumises aux conditions des services restent dans cette archive, pas copiées massivement sur le site public.
4. Relever présence du bon WEBUILD, recommandation explicite, citation comme source, liste des concurrents, ordre apparent s’il existe une liste, liens utilisés et preuves de la réponse. Une mention du groupe international Webuild n’est pas une présence de l’entreprise marseillaise.
5. Distinguer `completed`, `not_run`, `error`, `unavailable`, `not_triggered`. Une AI Overview qui n’apparaît pas est `not_triggered`, pas une absence de WEBUILD dans une réponse inexistante. Si l’observation est réellement exécutée et la réponse exploitable, alors seulement renseigner vrai/faux.
6. Relecture humaine des cas ambigus : citation d’une source sans recommandation, marque sans localisation, annuaire parlant d’un homonyme, réponse négative citant WEBUILD. Conserver la nuance dans l’observation.

Pour réduire l’effet du hasard, prévoir trois répétitions indépendantes par prompt et surface lors d’une campagne complète, soit jusqu’à 1 260 observations. C’est une proposition de protocole, pas un nombre de tests exécutés. Si le budget opérationnel est limité : les 20 requêtes prioritaires chaque semaine sur les surfaces accessibles, puis les 60 prompts une fois par mois. Ne comparer que les séries réalisées selon un protocole cohérent.

Champs du modèle : `promptId`, `engine`, `model`, `date`, `locale`, `location`, `searchEnabled`, `runStatus`, `webuildPresent`, `approximatePosition`, `recommended`, `citedAsSource`, `competitors`, `sourceUrls`, `responseEvidence`. Pour les répétitions, ajouter un `runId` et un `replicate` dans la copie de campagne, sans écraser les résultats précédents.

`approximatePosition` est l’ordre dans une liste de recommandations, jamais un rang SEO déduit. Laisser `null` si aucune liste ordonnée n’est observable. `responseEvidence` référence l’archive interne. Une source est un lien réellement cité ou affiché par le moteur, pas un site qu’on suppose utilisé.

```sh
node scripts/geo-summary.mjs docs/geo/geo-results.template.json
node scripts/geo-summary.mjs campagne-2026-10.local.json
```

Le résumé ignore les essais non terminés et les entrées sans preuve ni indicateurs complets. Une campagne vierge renvoie des taux `null`, jamais 0 %. Pour chaque moteur :

- Taux de présence = réponses exploitables où WEBUILD Marseille apparaît / réponses exploitables.
- Taux de recommandation = réponses exploitables qui recommandent WEBUILD / réponses exploitables.
- Taux de citation = réponses exploitables qui citent une source WEBUILD / réponses exploitables.
- Fréquence concurrent = réponses exploitables mentionnant ce concurrent / réponses exploitables ; à calculer sur les noms normalisés.
- Couverture = observations exploitables / observations planifiées. Ajouter séparément le taux de déclenchement AI Overview parmi les recherches effectivement exécutées.

Toujours afficher le dénominateur et la période. Une progression de 1/5 à 2/5 n’a pas la même portée que 100/500 à 200/500. Une fluctuation n’établit pas un effet causal des changements du site. Segmenter les familles d’intentions et comparer les sources, pas seulement un pourcentage global.

Les prompts de marque sont utiles au contrôle d’identité, mais doivent constituer une série distincte. Ils ne doivent pas gonfler la fréquence de découverte sur les demandes sans marque.

## KPI SEO

| KPI | Source | Calcul et lecture | Rythme |
|---|---|---|---|
| Impressions, clics, CTR | Search Console ; Bing Webmaster Tools séparément | WEBUILD hors homonymes, requêtes de marque/hors marque et pages commerciales séparées | Hebdomadaire ; comparaison 28 jours et année précédente si disponible |
| Position moyenne | Search Console | Moyenne des impressions, dépendante du mix de requêtes ; pas un rang fixe universel | Mensuel par couple requête/page |
| Top 3 / Top 10 | Outil de suivi d’un panier fixe de requêtes et localisation documentée | Part du panier dans chaque tranche ; distinguer organique classique et pack local | Hebdomadaire ou mensuel |
| Trafic organique | GA4 après consentement + données de clics moteurs | Sessions organiques observées, avec couverture consentement ; ne pas les assimiler à la totalité des visiteurs | Mensuel |
| Trafic local | Requêtes géographiques GSC, interactions GBP, campagnes de fiches | La ville estimée dans GA4 est un signal imparfait ; croiser avec la localisation déclarée des vrais prospects | Mensuel |
| Indexation | Inspection URL, sitemap et rapports moteurs | URL voulues indexables, état réel et canonical choisi ; ne pas compter la galerie provisoirement exclue comme erreur | Après déploiement puis mensuel |
| CWV terrain | CrUX / Search Console | LCP, INP, CLS, mobile et desktop, au 75e percentile quand les données existent | Fenêtre terrain disponible, généralement glissante |

Examiner la cannibalisation en regardant quelles URL reçoivent les impressions d’une même intention. Un simple chevauchement lexical ne justifie pas une fusion. Une page locale supplémentaire exige une demande et un contenu utile distincts.

## KPI business et attribution

| KPI | Définition opérationnelle | Limite / contrôle |
|---|---|---|
| Clic téléphone | `contact_click`, `contact_method=telephone` | Un clic n’est ni un appel établi ni une demande qualifiée |
| Appels réels | Appels reçus et qualification dans l’outil téléphonique/CRM | Connexion du compte nécessaire ; ne pas inventer de durée ni d’attribution |
| Clic WhatsApp | `contact_click`, `contact_method=whatsapp` | Distinguer ouverture WhatsApp, conversation reçue et lead qualifié |
| Formulaires | Soumissions reçues dans Netlify, filtrées du spam/tests/doublons | Netlify est la source opérationnelle, y compris sans consentement analytics |
| `generate_lead` | Succès d’envoi AJAX confirmé, marqueur local à durée courte, consentement accepté | Compteur analytique partiel ; pas déclenché par la visite isolée de `/merci-devis/` |
| Demandes de devis qualifiées | Projet réel dans une zone acceptée, besoin compris et contact joignable | Définition écrite et appliquée dans le CRM, sans stocker les détails personnels dans GA4 |
| Taux de conversion | Leads qualifiés attribuables / sessions comparables | Expliciter la couverture et éviter de diviser tous les leads CRM par seulement les sessions consenties |
| Coût par lead | Dépense attribuée / leads selon définition choisie | Distinguer CPL brut et qualifié ; coût nul non supposé faute d’accès aux dépenses |
| Origine des prospects | Campagne/profile, page d’entrée, réponse libre du prospect dans le CRM | Déclaratif et dernière interaction ne sont pas équivalents à une causalité marketing |

Le code conserve les identifiants GA4 et Google Ads existants. Il bloque le chargement Google tant que le choix n’est pas accepté, distingue clics de contact et envoi réussi, et ne transmet pas les noms, téléphones, messages, pièces jointes ni paramètres libres des URL dans les événements définis. Les polices sont locales.

Les paramètres de campagne des fiches locales sont limités à quatre couples connus, décrits dans [le plan externe](PRESENCE-EXTERNE.md). Il faut vérifier leur attribution dans GA4. Les autres campagnes exigent un ajout explicite de codes non personnels et une validation ; ce changement ne garantit pas la continuité d’une campagne publicitaire non inspectée.

Dans Google Ads, examiner les objectifs existants : un clic téléphone devrait être distingué d’un appel qualifié et ne pas gonfler l’objectif principal de demande de devis. Le label WhatsApp est vide dans le code historique ; aucun identifiant n’a été inventé. L’événement GA4 existe, mais l’import ou le label de conversion Ads reste à configurer dans le compte.

Contrôle après déploiement : accepter/refuser, vérifier Tag Assistant/DebugView, soumettre une demande test identifiée puis vérifier réception et dédoublonnage, ouvrir directement la page merci, recharger, contrôler les campagnes locales. Une vraie soumission et les notifications associées nécessitent un test opérationnel convenu ; les tests locaux de cette branche interceptent les envois.

## Tableau de bord et responsabilités

Une feuille ou un tableau interne peut suivre chaque mois : période, URLs indexées souhaitées/réelles, clics et impressions hors marque, requêtes Top 3/10 du panier, leads CRM uniques/qualifiés, appels reçus, conversations WhatsApp, CPL, couverture analytics, réponses GEO réalisées/planifiées, taux de présence/recommandation/citation par moteur et sources les plus fréquentes.

Responsable WEBUILD : identité, faits, dossiers et qualification des leads. Responsable site : contenus, tests, déploiement et collecte technique. Responsable visibilité : comptes moteurs, campagnes de mesure et veille concurrentielle. Une même personne peut tenir plusieurs rôles ; aucun nom de responsable non confirmé n’est attribué ici.

À J30 puis J90, décider à partir des résultats : enrichir la page qui obtient des impressions sans demandes ; améliorer les preuves si l’entreprise est citée mais peu recommandée ; examiner les sources concurrentes récurrentes ; réviser l’offre ou le formulaire si les prospects sont hors périmètre. Ne pas changer massivement les URL pour une fluctuation isolée.
