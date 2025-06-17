# DentalTech Pro - Guide de l'Administrateur

## 1. Introduction

Bienvenue dans le guide de l'administrateur pour DentalTech Pro. Ce document vous aidera à naviguer et à gérer les fonctionnalités clés du tableau de bord d'administration.

## 2. Accès au Tableau de Bord d'Administration

1.  **Connexion :**
    -   Accédez à la page de connexion du site (généralement `https://votre_domaine.com/login`).
    -   Utilisez vos identifiants administrateur fournis pour vous connecter. Votre compte doit avoir le rôle `admin`.
2.  **Navigation :**
    -   Une fois connecté, un lien "Admin" ou "Panel Admin" devrait apparaître dans l'en-tête (header) du site. Cliquez dessus.
    -   Alternativement, vous pouvez naviguer directement vers `https://votre_domaine.com/admin` (ou `https://votre_domaine.com/admin/dashboard`).

Si vous n'avez pas d'identifiants administrateur, veuillez contacter le responsable technique. L'utilisateur admin par défaut créé par le script de seeding (`src/utils/seed.py`) est:
-   Email: `admin@dentaltech.pro`
-   Mot de passe: `adminpass`

## 3. Aperçu du Tableau de Bord (`/admin/dashboard`)

Le tableau de bord principal vous donne un aperçu rapide des activités importantes du site.

-   **Statistiques Clés (Exemples) :**
    -   *Ventes du Mois :* Chiffre d'affaires total pour le mois en cours.
    -   *Nouvelles Commandes :* Nombre de commandes récentes, avec un focus sur celles en attente.
    -   *Utilisateurs Actifs :* Nombre d'utilisateurs actifs ou de nouvelles inscriptions.
-   **Alertes de Stock Bas :**
    -   Cette section affiche en temps réel les produits dont le stock est inférieur à 10 unités.
    -   Chaque alerte indique le nom du produit, son ID, et la quantité restante.
    -   Vous pouvez cliquer sur la croix (X) pour ignorer une alerte spécifique de votre vue actuelle (elle réapparaîtra si la condition de stock bas persiste lors d'une actualisation ou d'un nouveau message du serveur).
-   **Aperçu Rapide :** Informations générales et liens vers les sections de gestion principales.

## 4. Gestion des Produits (`/admin/products`)

Cette section vous permet de gérer le catalogue de produits de la boutique.

-   **Affichage des Produits :**
    -   Les produits sont listés dans un tableau avec les colonnes suivantes :
        -   `ID` : Identifiant unique du produit.
        -   `Nom` : Nom du produit.
        -   `Catégorie` : Catégorie à laquelle le produit appartient.
        -   `Prix` : Prix de vente en MAD.
        -   `Stock` : Quantité actuelle en stock.
        -   `Actif` : Indique si le produit est visible et achetable en boutique (case à cocher).
        -   `Actions` : Boutons pour modifier ou supprimer (désactiver) le produit.
-   **Ajouter un Nouveau Produit :**
    1.  Cliquez sur le bouton "Ajouter un Produit".
    2.  Une fenêtre modale apparaîtra avec les champs suivants :
        -   `Nom du produit` (requis)
        -   `Catégorie` (requis, ex: Équipements, Consommables)
        -   `Description courte` (optionnel)
        -   `Description complète` (optionnel, supporte du HTML simple)
        -   `Prix (MAD)` (requis, numérique)
        -   `Prix Original (MAD)` (optionnel, pour afficher une réduction)
        -   `Quantité en stock` (requis, numérique)
        -   `URL de l'image principale` (optionnel, lien direct vers une image hébergée)
        -   `Badge` (optionnel, ex: Nouveau, Promotion)
        -   `Produit actif` (case à cocher, coché par défaut pour rendre le produit visible)
    3.  Remplissez les informations et cliquez sur "Créer le produit".
-   **Modifier un Produit Existant :**
    1.  Cliquez sur l'icône "Modifier" (crayon) dans la ligne du produit concerné.
    2.  La même fenêtre modale s'ouvrira, pré-remplie avec les informations du produit.
    3.  Modifiez les champs souhaités.
    4.  Cliquez sur "Sauvegarder les modifications".
-   **Activer/Désactiver un Produit (Soft Delete) :**
    -   Utilisez la case à cocher dans la colonne "Actif" pour changer rapidement le statut de visibilité d'un produit. Le changement est sauvegardé automatiquement.
    -   Alternativement, le bouton "Supprimer" (corbeille) désactive également le produit (soft delete). Une confirmation vous sera demandée. Un produit désactivé n'est plus visible pour les clients mais reste dans la base de données.
-   **Suppression Définitive :**
    -   La suppression via l'icône corbeille est une "soft delete" (le produit est marqué comme inactif). Pour une suppression définitive, une intervention directe en base de données ou une fonctionnalité "corbeille" avancée (non implémentée actuellement) serait nécessaire.

## 5. Gestion des Commandes (`/admin/orders`)

Cette section vous permet de visualiser et de gérer les commandes passées par les clients.

-   **Affichage des Commandes :**
    -   Les commandes sont listées dans un tableau :
        -   `ID Commande` : Identifiant unique de la commande.
        -   `Client` : Nom du client.
        -   `Date` : Date et heure de création de la commande.
        -   `Total` : Montant total de la commande en MAD.
        -   `Articles (Résumé)` : Un aperçu des articles et quantités.
        -   `Statut` : Statut actuel de la commande (modifiable).
        -   `Actions` : Bouton pour voir les détails (fonctionnalité future).
-   **Filtrer les Commandes :**
    -   Utilisez le menu déroulant "Filtrer par statut" pour afficher les commandes ayant un statut spécifique (ex: 'En attente', 'Confirmée').
-   **Mettre à Jour le Statut d'une Commande :**
    1.  Dans la colonne "Statut" de la commande concernée, cliquez sur le statut actuel.
    2.  Un menu déroulant apparaîtra. Sélectionnez le nouveau statut parmi les options :
        -   `En attente`
        -   `Confirmée`
        -   `Expédiée`
        -   `Livrée`
        -   `Annulée`
    3.  Le statut est mis à jour automatiquement. Une notification confirmera le changement.
-   **Exporter les Commandes en CSV :**
    1.  Cliquez sur le bouton "Exporter CSV".
    2.  Un fichier CSV (`orders_export_JJJJ-MM-DD.csv`) contenant toutes les commandes (selon les filtres actifs au moment du clic, ou toutes si pas de filtre) sera téléchargé par votre navigateur.
    3.  Le CSV inclut des détails comme l'ID, le nom du client, l'ID utilisateur (si applicable), le statut, le montant total, un résumé des articles, l'aperçu du message WhatsApp, et les dates de création/mise à jour.

## 6. Gestion des Articles (`/admin/articles`)

Cette section vous permet de gérer les articles de blog ou d'actualités du site.

-   **Affichage des Articles :**
    -   Les articles sont listés dans un tableau :
        -   `ID` : Identifiant unique.
        -   `Image` : Miniature de l'image de couverture.
        -   `Titre` : Titre de l'article.
        -   `Auteur` : Nom de l'auteur.
        -   `Catégorie` : Catégorie de l'article.
        -   `Date Création` : Date de publication ou création.
        -   `Actions` : Boutons pour modifier ou supprimer l'article.
-   **Ajouter un Nouvel Article :**
    1.  Cliquez sur "Nouvel Article".
    2.  Remplissez le formulaire dans la modale :
        -   `Titre` (requis)
        -   `Slug` (requis, auto-généré à partir du titre si laissé vide, mais peut être personnalisé. Doit être unique et au format `mot-cle-mot-cle`.)
        -   `Auteur` (optionnel)
        -   `Catégorie` (optionnel)
        -   `Contenu` (requis, éditeur de texte simple, peut supporter du Markdown ou HTML simple selon la configuration du frontend pour l'affichage public)
        -   `Image de couverture` (optionnel) : Cliquez pour sélectionner un fichier image (PNG, JPG, GIF). Un aperçu s'affichera. Pour retirer l'image, cliquez sur la petite corbeille sur l'aperçu.
    3.  Cliquez sur "Créer".
-   **Modifier un Article Existant :**
    1.  Cliquez sur l'icône "Modifier" (crayon) pour l'article souhaité.
    2.  La modale s'ouvrira avec les données de l'article.
    3.  Modifiez les informations. Pour l'image :
        -   Pour changer l'image : téléchargez un nouveau fichier. L'ancienne image sera remplacée (et supprimée du serveur).
        -   Pour supprimer l'image existante sans en ajouter une nouvelle : cliquez sur la petite corbeille sur l'aperçu de l'image actuelle. Cela effacera le chemin de l'image.
        -   Pour conserver l'image actuelle : ne touchez pas au champ image ou à l'aperçu.
    4.  Cliquez sur "Sauvegarder".
-   **Supprimer un Article :**
    1.  Cliquez sur l'icône "Supprimer" (corbeille).
    2.  Une boîte de dialogue de confirmation apparaîtra.
    3.  Confirmez pour supprimer définitivement l'article et son image associée du serveur.

## 7. Dépannage et Notes

-   **Permissions :** Si vous ne voyez pas certaines options ou ne pouvez pas effectuer certaines actions, vérifiez que votre compte dispose bien des droits d'administrateur.
-   **Alertes de Stock :** Les alertes de stock bas sur le Dashboard sont mises à jour en temps réel. Si un produit est en rupture mais que vous venez de mettre à jour son stock, l'alerte peut prendre quelques secondes pour disparaître.
-   **Images d'Articles :** Les images téléversées pour les articles sont stockées sur le serveur. Assurez-vous qu'elles sont optimisées pour le web avant de les téléverser pour de meilleures performances.
-   **Contact Support :** En cas de problème technique persistant, contactez le support technique ou l'équipe de développement.

Ce guide devrait vous aider à démarrer avec la gestion de la plateforme DentalTech Pro. Les fonctionnalités peuvent évoluer ; référez-vous toujours à la version la plus à jour de cette documentation.
