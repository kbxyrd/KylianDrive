---Cahier des chagres---

!!!! Important!!!!  : Développement en Nuxt, BDD SQL Lite avec drizzle ORM, projet public sur github (avec commit régulier).

Une page de login / register (bonus : idéalement gestion via une bibliothèque comme nuxt auth, pas besoin d'envoie de mail par SMTP pour validation de compte)
2 roles d'accès :
- USER : n'a accès qu'à une page qui lui liste ses fichiers avec possibilité d'uploader des nouveaux fichiers et de télécharger ou supprimer les fichiers existants
(bonus : stockage des fichiers sur un system distant, cloudflare R2 par exemple) Pas de dossiers / catégorisation ou autre des fichiers, juste un espace unique.
- ADMIN : idem mais avec en plus une page lui permettant de lister les utilisateurs et de voir l'espace consommé par utilisateur
(pas d'ajout / édition / suppression d'utilisateurs, juste de l'affichage des statistiques)

Bonus :
- Interface stylisé avec NuxtUI (version gratuite)
- Déploiement effectué sur cloudflare (worker / d1 pour la bdd / r2 pour les fichiers) grâce à nuxthub (version gratuite également)





---Problèmes rencontrés---

Difficultés liées à l’utilisation du répertoire de fichiers (shemas, server, etc.).

Utilisation de technologies et d’environnements inconnus
Découverte et prise en main de nouveaux outils non familiers.

Problèmes de versions et de compatibilité
Conflits entre les différentes librairies et frameworks.

Erreur  du à node_modules
Échecs d’installation ou de réinstallation (npm install, yarn).

Erreur 500 provoquée par BetterSQLite
Remplacement envisagé ou passage à une autre solution (sqlite).

Problème d’authentification à l’import du package “auth”
Import incorrect ou version incompatible du module d’authentification.

Gestion du rôle Administrateur déportée
Rôle Admin défini dans un fichier externe au schéma principal.





---Outils utilisés---

-Documentation officielle : Drizzle, Nuxt, SQLite
-GitHub
-YouTube (tutoriels pour l’installation de Nuxt et l’explication de l’environnement)
-IA : Claude, ChatGPT (m’ont fait gagner du temps pour la conception de code simple et m’ont guidé dans les parties plus complexes)
-Nuxt.js Discord
