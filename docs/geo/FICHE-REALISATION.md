# Gabarit de référence — aucune fiche ne sera publiée par défaut

Statut : brouillon interne. Responsable de validation à nommer par WEBUILD. L’adresse précise d’un logement ou le nom d’un client n’est pas nécessaire pour démontrer une expérience.

## Données à réunir

| Champ | Valeur | Pièce/source | Autorisation de publication |
|---|---|---|---|
| Identifiant interne et type de bien | À renseigner | Dossier chantier | À vérifier |
| Secteur/arrondissement affichable | À renseigner | Dossier + accord | À vérifier |
| Surface, méthode de mesure | Omettre si inconnue | Plan/relevé | À vérifier |
| État initial | À décrire | Photos/compte rendu | À vérifier |
| Problème à résoudre | À décrire | Demande initiale | À vérifier |
| Périmètre réellement exécuté par WEBUILD | À décrire | Devis/avenants/réception | À vérifier |
| Corps d’état mobilisés | À décrire | Dossier | À vérifier |
| Contraintes et décisions | À décrire | Comptes rendus | À vérifier |
| Solutions réalisées | À décrire | Photos/constats | À vérifier |
| Dates/durée | Omettre si non vérifiées | Planning réel/réception | À vérifier |
| Photos avant/pendant/après | Fichiers originaux à identifier | Auteur, date, phase | Droits, client et éléments identifiables à contrôler |
| Budget | Facultatif, omis par défaut | Montant, périmètre, HT/TTC, exclusions | Validation expresse nécessaire |

## Structure de la page

URL : `/realisations/renovation-appartement-marseille-[secteur]/`, uniquement lorsque secteur et projet sont validés. Un autre type de bien reçoit une URL adaptée. Deux projets dans le même secteur doivent rester distinguables.

H1 : type de rénovation + localisation générale vérifiée.

Introduction : WEBUILD, nature du bien, lieu général, travaux et objectif réel. Puis une synthèse factuelle en liste ou tableau avec seulement les champs connus.

H2 : état initial et demande ; travaux effectués ; contrainte et solution ; photos légendées par phase ; résultat observable ; projet comparable et demande de devis.

Chaque image reçoit un ALT décrivant son contenu réel et une légende avec phase confirmée. Pas de comparaison avant/après si les deux images ne sont pas le même bien. Pas de vidéo fictive ou d’image générée présentée comme preuve.

Liens : depuis la page commerciale correspondante et la galerie ; retour vers appartement/immeuble/investisseurs selon l’intervention, puis contact. Pas de maillage automatique vers tous les services si le chantier ne les concerne pas.

Schema : WebPage + BreadcrumbList ; ImageObject pour photos réellement présentes et validées ; Article seulement pour une étude de cas éditoriale. Aucune note, prix, durée ou surface dans le schéma si la page ne l’affiche pas et si la source manque.

## Publication

1. Validation des faits et des droits, enregistrée dans le dossier interne.
2. Rédaction et contrôle par la personne ayant suivi le chantier.
3. Contrôle des liens, ALT, données structurées et rendu mobile.
4. Ajout à `site.config.json` et au maillage ; reconstruction du sitemap.
5. Réindexation de la galerie après remplacement des illustrations par les références validées.
