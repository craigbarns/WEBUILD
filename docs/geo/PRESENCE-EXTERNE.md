# Présence externe, Google Business Profile et avis

Plan du 13 septembre 2026. Aucun profil externe n’a été modifié, aucune fiche créée, aucun message envoyé. L’existence et la propriété des fiches WEBUILD restent à confirmer ; une absence de résultat dans notre recherche ne prouve pas leur inexistence.

## Une fiche de référence avant toute synchronisation

Tenir un registre unique, validé par le responsable WEBUILD : nom commercial réellement utilisé, société contractante, SIREN, adresse et conditions d’accueil, téléphone, email, site canonique, prestations, communes réellement desservies, horaires réels, liens des profils détenus, date et personne ayant validé chaque champ. Conserver les justificatifs hors du dépôt public.

Le site historique affiche `07 66 01 88 26`, `contact@webuildmarseille.fr`, WEBUILD SAS et le 41 rue Fongate à Marseille. Ces éléments doivent être confirmés ensemble, en particulier le lien entre l’activité de travaux et la société recensée comme opérateur immobilier. Ils ne doivent pas être recopiés automatiquement dans des dizaines d’annuaires. Après confirmation, renseigner `verifiedContact`, `verifiedAddress` et `verifiedSameAs` dans `site.config.json`, mettre à jour les textes visibles et adapter les contrôles correspondants.

`sameAs` doit pointer vers des pages identifiant réellement la même entreprise : profil Google public, compte social officiel, fiche d’annuaire confirmée. Ne pas y placer un partenaire, un concurrent ou une simple page de recherche.

## Google Business Profile : proposition à appliquer dans le compte

Google décrit la pertinence, la distance et la notoriété comme facteurs principaux des résultats locaux. Une fiche cohérente et des preuves réelles sont donc prioritaires ; aucune description ne supprime le facteur distance. [Source Google](https://support.google.com/business/answer/7091?hl=en).

| Champ | Proposition | Vérification avant application |
|---|---|---|
| Nom | WEBUILD, selon le nom réellement utilisé sur les documents et supports | Pas d’ajout artificiel de « meilleure rénovation Marseille » au nom |
| Catégorie principale | Choisir la catégorie disponible correspondant à l’entreprise générale de travaux si c’est l’activité dominante | Examiner la liste réelle dans l’interface française et le travail effectivement réalisé ; ne pas présumer du libellé disponible |
| Catégories secondaires | Maçonnerie et spécialités réellement proposées, si des catégories adaptées existent | Choisir peu de catégories utiles ; ne pas ajouter chaque métier coordonné comme une activité principale indépendante |
| Adresse | Adresse officielle confirmée ; affichage seulement si l’entreprise y accueille réellement des clients dans les conditions requises | Si WEBUILD intervient chez les clients sans accueil adapté, configurer une entreprise de zone desservie et masquer l’adresse au public |
| Zone | Marseille confirmée | Ajouter une commune seulement après validation opérationnelle ; pas une liste destinée à élargir artificiellement le classement |
| Horaires | Plages réelles de contact/activité | Aucun « ouvert 24 h/24 » sans service correspondant |
| Téléphone | Numéro officiel contrôlé | Tester le routage et la personne qui répond |
| Site | `https://webuildmarseille.fr/?utm_source=google&utm_medium=organic&utm_campaign=gbp` | URL finale sans redirection inutile ; canonical sans paramètres |
| Lien de demande | `https://webuildmarseille.fr/contact/?utm_source=google&utm_medium=organic&utm_campaign=gbp` | Réception du formulaire et lecture mobile vérifiées |

Les [consignes de représentation des établissements](https://support.google.com/business/answer/3038177?hl=fr) et les [consignes sur les catégories](https://support.google.com/business/answer/7249669?hl=fr) priment sur les listes de catégories proposées par des outils SEO.

### Description proposée

> WEBUILD est une entreprise de travaux et de rénovation à Marseille. L’entreprise intervient sur des rénovations complètes d’appartements, des rénovations d’immeubles et des transformations de biens immobiliers. Les travaux couvrent notamment la maçonnerie, le gros œuvre, le second œuvre, la plomberie, l’électricité, les cloisons, l’isolation et les finitions. WEBUILD accompagne les propriétaires, investisseurs immobiliers, bailleurs et marchands de biens pour définir les travaux à prévoir avant une occupation, une mise en location ou une revente. Le périmètre du chantier est étudié à partir du bien et du projet.

Texte fondé sur l’activité fournie dans la mission. À relire avec le responsable avant insertion. Aucun prix, délai de réponse, assurance ou résultat financier n’est promis.

### Services à renseigner

| Service | Description courte | Page de référence |
|---|---|---|
| Rénovation d’appartement | Travaux de rénovation complète ou de transformation d’un appartement, avec périmètre défini au devis | `/renovation-appartement-marseille/` |
| Rénovation d’immeuble | Travaux sur un immeuble ou plusieurs lots ; accès, réseaux et parties concernées à préciser | `/renovation-immeuble-marseille/` |
| Travaux pour investisseurs | Rénovation avant location ou revente, arbitrage des travaux et organisation de plusieurs lots | `/renovation-investisseur-marseille/` |
| Maçonnerie et gros œuvre | Travaux de maçonnerie et ouvrages structurels selon le projet et les études nécessaires | `/maconnerie-gros-oeuvre-marseille/` |
| Second œuvre | Plomberie, électricité, cloisons, isolation, peinture, sols, cuisines et salles de bains | `/second-oeuvre-marseille/` |

Une spécialité « rénovation maison » ne doit être développée davantage qu’après confirmation de son périmètre réel. Les services affichés ne doivent pas inclure de prix par défaut.

### Photos, publications et questions commerciales

Constituer une photothèque issue des vrais chantiers : vue d’ensemble, problème initial, étape technique utile, résultat terminé. Documenter l’origine, le droit de publication et le chantier associé. Retirer visages, documents clients, plaques et détails privés si leur publication n’est pas autorisée. Ne pas fabriquer une photo de chantier ou une équipe pour remplir la fiche.

Cadence de travail proposée : une mise à jour lorsqu’un chantier documenté apporte quelque chose d’utile, avec une revue mensuelle de la fiche. Une publication peut présenter le besoin, les travaux et une photo réelle, puis renvoyer à la fiche de réalisation. Le volume de publications n’est pas une garantie de classement.

Répondre aux questions effectivement reçues : travaux pris en charge, informations pour un devis, gestion des lots, préparation de la visite, accès et pièces à transmettre. Si l’interface propose une fonction de questions/réponses pertinente au moment de la mise à jour, l’utiliser selon ses règles ; ne pas créer de faux échanges attribués à des clients. La FAQ du site reste accessible indépendamment de cette fonction.

### Collecte d’avis : système préparé, envoi non activé

Google autorise la sollicitation d’avis authentiques et interdit notamment les contreparties destinées à obtenir des avis. Demander un retour à tous les clients éligibles, quelle que soit leur satisfaction. [Consignes Google sur les avis](https://support.google.com/business/answer/3474122?hl=en).

Le script `scripts/review-requests.mjs` prépare une file de messages sans réseau :

1. Le CRM confirme le vrai client, la réception du chantier, l’adresse de contact et la possibilité de le solliciter ; aucune opposition ne doit être présente.
2. Une demande est préparée à partir de J+2 après réception confirmée.
3. Une seule relance est possible au moins sept jours après un premier envoi effectivement journalisé, si aucun avis ou refus n’a été signalé. Une date d’envoi absente ou invalide bloque la relance.
4. Un identifiant stable par chantier et étape permet au connecteur d’envoi de refuser les doublons. L’envoi et la relance ne deviennent actifs qu’après raccordement explicite au CRM et au fournisseur de messagerie.

Le lien d’avis Google doit d’abord être récupéré depuis la fiche WEBUILD vérifiée. La validation de domaine du script ne prouve pas que le lien appartient à WEBUILD. Le journal de livraison, les désinscriptions et l’opposition doivent être appliqués par le connecteur. Aucune autorisation d’envoi à de vrais clients n’a été donnée dans cette mission.

Entrée locale : `reviewUrl`, `customers`, `sent`. Pour chaque client : `projectId`, `email`, `verifiedCustomer`, `receptionConfirmed`, `contactPermission`, `receptionDate`, `optedOut`, `reviewReceived`. Pour un envoi réalisé : `id`, `status: "sent"`, `sentAt`. Les dates sont ISO 8601. Ne pas committer ces données : les fichiers `*.local.json` sont ignorés.

```sh
node scripts/review-requests.mjs customers.local.json outbox.local.json
```

Message proposé : « Merci d’avoir confié vos travaux à WEBUILD. Si vous le souhaitez, vous pouvez partager votre expérience sur Google : [lien vérifié]. Votre avis libre et sincère peut aider d’autres propriétaires à préparer leur projet. Pour ne plus recevoir cette demande, répondez simplement à ce message. »

Réponse à un avis positif : remercier, reprendre uniquement un élément que le client a rendu public et qui est exact. Réponse à un avis critique : reconnaître le retour, proposer un échange privé via le contact officiel, examiner les faits avant toute affirmation. Ne pas divulguer adresse du chantier, montant, litige, coordonnées ou détails contractuels. Ne jamais rédiger un faux avis ni conditionner la sollicitation à une note.

## Corroboration hors Google

| Surface | Action | Ce qu’il faut conserver comme preuve |
|---|---|---|
| Bing Places | Rechercher l’établissement, revendiquer/corriger la fiche appropriée, éviter un doublon | URL publique, propriétaire, NAP et zone comparés au registre |
| Apple Business Connect / Plans | Vérifier l’éligibilité et le compte, compléter le lieu ou la présence selon les options réelles | URL de fiche et captures datées des informations publiques |
| PagesJaunes | Retrouver la fiche de la bonne société et clarifier les activités effectivement exercées | Identité, adresse, téléphone, lien site exact |
| Annuaires locaux reconnus | Examiner l’annuaire municipal et les organismes professionnels réellement pertinents | Critères d’inscription, qualité éditoriale et fiche publiée |
| FFB, CAPEB et réseaux métier | Mention seulement en cas d’adhésion réelle et autorisation correspondante | Adhésion en vigueur et URL du membre ; aucun badge ajouté par déduction |
| Plateformes travaux | Comparer pertinence locale, coût, qualité des demandes et droit d’usage des contenus avant inscription | Coût par lead qualifié, contrat, exactitude des références |
| Réseaux sociaux détenus | Nom, ville, métier, site, coordonnées et projets identiques au registre validé | URL officielle et administrateur ; pas de création de profils fantômes |
| Fournisseurs et partenaires | Proposer une étude de cas commune lorsqu’une relation et un chantier existent réellement | Accord écrit, rôle exact de chacun, source de la mention |
| Presse et médias locaux | Proposer un sujet réel : transformation documentée, contraintes d’un immeuble, parcours de chantier | Photos autorisées, faits vérifiables et article publié |

Ordre conseillé : identité/GBP → Bing/Apple/PagesJaunes → cas réels et profils détenus → mentions éditoriales locales. Une fiche utile et exacte vaut mieux qu’un lot d’inscriptions sans contrôle. Ne pas acheter de faux avis ou de liens destinés à manipuler les résultats.

UTM acceptés par le code pour les profils : `utm_medium=organic`, avec les couples `google/gbp`, `bing/bing_places`, `apple/apple_maps`, `pagesjaunes/pagesjaunes` pour source/campagne. Les codes libres sont volontairement exclus de la collecte pour éviter de transmettre du texte personnel. Valider l’attribution dans GA4 après consentement et après configuration du compte.

Tenir un journal : surface, URL, statut existant/à revendiquer/à corriger, propriétaire, NAP vérifié, activité, date de contrôle, action et résultat. Mesurer la concordance des fiches et les demandes qualifiées, pas seulement le nombre d’annuaires.
