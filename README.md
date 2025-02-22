# Compte Rendu - Développement de l'API de gestion des tâches

### Pour lancer la BD :
```bash
docker network create mysql57
docker volume create mysql57
docker compose -f stack.local.yml up -d
```

### Pour exécuter les migrations prisma :
```bash
npx prisma migrate dev
```

### Pour lancer l'API
```bash
yarn install
yarn add eslint --dev
yarn start 
```

## Contexte

Le projet consiste à créer une API de gestion de tâches avec NestJS, Prisma, et MySQL comme base de données. L'objectif est de pouvoir effectuer des opérations CRUD sur les tâches, telles que la création, la mise à jour, la suppression et l'affichage des tâches.

---

## Technologies Utilisées

- **NestJS** : Framework Node.js pour construire des applications côté serveur avec une structure modulaire.
- **Prisma** : ORM pour Node.js, utilisé pour interagir avec la base de données MySQL.
- **MySQL** : Base de données relationnelle utilisée pour stocker les informations sur les tâches.
- **TypeScript** : Langage de programmation utilisé pour développer l'API.

---

## Étapes Réalisées

### 1. Configuration de la base de donnée

```bash
APP_ENV=local
DATABASE_URL="mysql://udb:pdb@localhost:3306/DB_HDM"

MYSQL_ROOT_PASSWORD=rdb
MYSQL_USER=udb
MYSQL_PASSWORD=pdb
MYSQL_DATABASE=DB_HDM
```

### 2. Initialisation du projet

- Installation de Prisma avec `yarn add @prisma/client prisma`.

### 3. Configuration de Prisma

- Mise en place du fichier `schema.prisma` pour définir la structure de la base de données. Un modèle `Task` a été ajouté pour représenter les tâches, avec les champs suivants :
    - `id` (primary key, auto-incrémentée),
    - `name` (string),
    - `createdAt` (DateTime, default now),
    - `updatedAt` (DateTime, default now).

Exemple de `schema.prisma` :

```prisma
model Task {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt
}
```




# Compte Rendu du Projet Todo List

## Contexte

J'ai créé une application de liste de tâches (Todo List) avec un backend en **NestJS** et une interface utilisateur en **React** avec **Material UI**. L'objectif est d'afficher, ajouter, modifier et supprimer des tâches tout en implémentant des règles spécifiques sur la validation des noms de tâches.

---

## Fonctionnalités Implémentées

### 1. **Affichage des tâches**
- **Récupération des tâches depuis le backend :**  
  À chaque chargement de la page, je récupère la liste des tâches depuis le serveur et les affiche sous forme de `TextField` (champ de texte). Si aucune tâche n'est trouvée, un message `"Aucune tâche trouvée"` s'affiche.

### 2. **Ajout d'une tâche**
- **Création d'une nouvelle tâche :**  
  Lors de la création d'une nouvelle tâche, un champ de texte vide avec un `placeholder` "Nouvelle tâche" est affiché. Le nom de la tâche est vide au départ, mais l'utilisateur peut saisir un nom pour la nouvelle tâche. Si le champ est vide lors de la soumission, le bouton de sauvegarde est désactivé.

### 3. **Modification des tâches**
- **Édition des tâches existantes :**  
  Lorsqu'un utilisateur veut modifier une tâche, il peut saisir un nouveau nom dans le champ de texte associé. Si le nom a changé, le bouton de validation devient actif. La tâche est ensuite sauvegardée avec le nouveau nom.  
  - **Contrôle de saisie :** Si le nom devient vide, la tâche ne peut pas être validée. Un `placeholder` "Nouvelle tâche" apparaît alors pour indiquer à l'utilisateur de saisir un nom.

### 4. **Suppression des tâches**
- **Suppression des tâches :**  
  L'utilisateur peut supprimer une tâche en cliquant sur l'icône de suppression. Après la suppression, la liste des tâches est mise à jour.

### 5. **Validation des tâches**
- **Sauvegarde :**  
  Une tâche est validée (enregistrée dans la base de données) uniquement si son nom a été modifié et qu'il n'est pas vide.  
  Le bouton de validation est désactivé tant que la tâche n'a pas été modifiée ou que le champ est vide.

---

## Structure du Code

### Backend (NestJS)

- **Controller des tâches :**
  Le controller du backend gère les endpoints pour créer, mettre à jour et supprimer des tâches.
  - `POST /tasks` : Crée une nouvelle tâche.
  - `PATCH /tasks` : Met à jour une tâche existante.
  - `DELETE /tasks/{id}` : Supprime une tâche par son `id`.

  Le code gère la logique de mise à jour ou de création d'une tâche en fonction de la présence de l'ID.

- **UseCases (Logique métier) :**
  - `SaveTaskUseCase` : Responsable de la création et de la mise à jour des tâches. C'est cette logique qui est utilisée dans les contrôleurs pour interagir avec la base de données via Prisma.
  - `DeleteTaskUseCase` : Responsable de la suppression d'une tâche.
  - `GetAllTasksUseCase` : Permet de récupérer toutes les tâches stockées dans la base de données.

- **Prisma :** Utilisé pour interagir avec la base de données et effectuer des opérations CRUD.

### Frontend (React + Material UI)

- **Composant `TodoPage` :**
  - **État local :** Gère les tâches (`tasks`) et les tâches modifiées (`editedTasks`).
  - **Récupération des données :** Utilisation de `useFetch` pour récupérer les tâches et afficher les données.
  - **Gestion des événements :**
    - **`handleChange`** : Permet de mettre à jour le nom d'une tâche en fonction de l'entrée de l'utilisateur.
    - **`handleSave`** : Sauvegarde une tâche si son nom a changé.
    - **`handleDelete`** : Supprime une tâche.
    - **`handleAddTask`** : Ajoute une nouvelle tâche avec un champ vide (initialisé avec un `placeholder`).

---

## Challenges rencontrés

1. **Gestion du `placeholder` et de la validation des tâches :**
   - J'ai dû gérer l'affichage dynamique du `placeholder` "Nouvelle tâche" lorsque le champ de texte était vide.
   - La validation des tâches était délicate, surtout lorsque l'utilisateur essayait de soumettre une tâche avec un nom vide ou supprimait le nom d'une tâche.

2. **Problèmes de sauvegarde avec des champs vides :**
   - Il était important de s'assurer qu'une tâche ne soit pas enregistrée avec un nom vide tout en permettant à l'utilisateur de supprimer un nom et de réajuster les valeurs si nécessaire.

3. **Problèmes d'actualisation de la page :**
   - Quand je réactualisais la page et que le nom de la tâche avait été modifié, le nom de la tâche réapparaissait vide.  
   - La gestion de l'état local `editedTasks` a permis de résoudre ce problème en affichant correctement le nom modifié après un rechargement de la page.

---

## Conclusion

L'application est désormais fonctionnelle et permet de :
- Ajouter, modifier, supprimer et valider des tâches.
- Gérer les états de modification des tâches avec une validation dynamique.
- Afficher correctement les noms des tâches après modification et actualisation de la page.

Les défis principaux ont été de garantir que les tâches ne soient pas enregistrées avec un nom vide et de gérer correctement l'actualisation de la page sans perdre les informations saisies. La gestion de l'état des tâches modifiées (`editedTasks`) a été la solution pour résoudre ces problèmes.

---

## Étapes suivantes

- Ajouter des fonctionnalités supplémentaires comme la gestion des priorités ou des échéances.
- Tester le projet dans différents environnements pour garantir une expérience utilisateur optimale.
