# CRUD en Node.js avec TypeScript

Ce projet est un exemple simple mais complet d'une API RESTful implémentée en Node.js et TypeScript, utilisant une architecture orientée objets. Il fournit une base solide pour la création de systèmes CRUD (Create, Read, Update, Delete) en suivant les bonnes pratiques de développement.

## Table des matières

- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Chemin d'exécution](#chemin-dexécution)
- [Comment ajouter d'autres modèles](#comment-ajouter-dautres-modèles)
- [Pourquoi cette architecture ? Les principes SOLID](#pourquoi-cette-architecture--les-principes-solid)
- [Licence](#licence)

## Installation

1. Clonez ce dépôt :
    ```bash
    git clone https://github.com/FlorianBx/crud-typescript.git
    ```
2. Accédez au répertoire du projet :
    ```bash
    cd crud-typescript
    ```
3. Installez les dépendances :
    ```bash
    npm install
    ```
4. Démarrez le serveur en mode développement :
    ```bash
    npm run dev
    ```

## Structure du projet

Le projet est organisé de manière modulaire pour séparer les différentes responsabilités du code.

```
/src
|-- /controllers     # Gère ce qu'il faut faire avec les requêtes du client (comme créer ou supprimer un utilisateur)
|-- /models          # Décrit la structure des données (par exemple, ce qu'est un utilisateur)
|-- /repositories    # Stocke et récupère les données (où sont enregistrés les utilisateurs)
|-- /services        # Contient la logique métier (comment traiter les données)
|-- /routes          # Définit les chemins de l'API (les adresses URL que l'application reconnaît)
|-- server.ts        # Configure et lance le serveur
```

## Fonctionnalités

L'API permet de gérer des utilisateurs avec les fonctionnalités suivantes :

- **Créer un utilisateur** : `POST /api/users`
- **Lire tous les utilisateurs** : `GET /api/users`
- **Lire un utilisateur par ID** : `GET /api/users/:id`
- **Mettre à jour un utilisateur** : `PUT /api/users/:id`
- **Supprimer un utilisateur** : `DELETE /api/users/:id`

## Chemin d'exécution

Voici une explication étape par étape du chemin d'exécution d'une requête typique dans cette API.

### Exemple : Suppression d'un utilisateur

#### 1. Requête HTTP (Client -> Serveur)
Le client envoie une requête `DELETE` à l'URL `/api/users/1` pour supprimer l'utilisateur avec l'ID 1.

#### 2. Route (src/routes/userRoutes.ts)
La requête est capturée par la route définie dans `userRoutes.ts` :
```typescript
router.delete("/users/:id", userController.deleteUser);
```
Cela redirige la requête vers la méthode `deleteUser` du `UserController`.

#### 3. Contrôleur (src/controllers/UserController.ts)
Le `UserController` reçoit la requête et appelle le `UserService` pour effectuer la suppression :
```typescript
public deleteUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    const success = this.userService.deleteUser(Number(id));
    if (success) {
        res.status(200).json({ message: "User successfully deleted" });
    } else {
        res.status(404).send("User not found");
    }
};
```

#### 4. Service (src/services/UserService.ts)
Le `UserService` orchestre la logique métier en appelant le `UserRepository` pour supprimer l'utilisateur dans la fausse base de données :
```typescript
public deleteUser(id: number): boolean {
    return this.userRepository.delete(id);
}
```

#### 5. Répertoire (src/repositories/UserRepository.ts)
Le `UserRepository` supprime l'utilisateur du tableau en mémoire, et retourne un booléen indiquant si l'opération a réussi :
```typescript
public delete(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    this.users.splice(userIndex, 1);
    return true;
}
```

#### 6. Réponse HTTP (Serveur -> Client)
Le `UserController` envoie une réponse HTTP 200 au client avec un message JSON confirmant la suppression :
```json
{
  "message": "User successfully deleted"
}
```

## Comment ajouter d'autres modèles

Pour ajouter un nouveau modèle à cette API (par exemple, un modèle `Product`), suivez ces étapes :

1. **Créer le modèle** : Ajoutez un nouveau fichier `Product.ts` dans le dossier `models`.
2. **Créer le répertoire** : Ajoutez un `ProductRepository` pour gérer les données du produit.
3. **Créer le service** : Ajoutez un `ProductService` pour encapsuler la logique métier du produit.
4. **Créer le contrôleur** : Ajoutez un `ProductController` pour gérer les requêtes HTTP relatives aux produits.
5. **Ajouter les routes** : Définissez de nouvelles routes dans `productRoutes.ts` pour les opérations CRUD du produit.
6. **Brancher les routes** : Ajoutez les nouvelles routes dans `server.ts`.

## Pourquoi cette architecture ? Les principes SOLID

L'architecture de ce projet est basée sur des principes de programmation qui aident à écrire du code plus facile à comprendre et à faire évoluer. Ces principes sont regroupés sous l'acronyme **SOLID**. Voici une version simplifiée de chacun de ces principes, avec des exemples pour mieux comprendre.

### 1. **S : Single Responsibility Principle (Principe de responsabilité unique)**
Chaque classe ou partie du code doit **faire une seule chose**.

**Exemple** :
```typescript
// Mauvais exemple : cette classe fait trop de choses
class UserManager {
    createUser(name: string, email: string) { /* ... */ }
    sendEmail(email: string) { /* ... */ }
    saveUserToDatabase(user: User) { /* ... */ }
}

// Bon exemple : chaque classe a une seule responsabilité
class UserController {
    createUser(req: Request, res: Response) { /* ... */ }
}

class UserRepository {
    saveUserToDatabase(user: User) { /* ... */ }
}

class EmailService {
    sendEmail(email: string) { /* ... */ }
}
```
**Explication** : Ici, chaque classe a un rôle bien défini, ce qui rend le code plus facile à gérer.

### 2. **O : Open/Closed Principle (Principe d'ouverture/fermeture)**
Le code doit être **facile à améliorer sans tout casser**.

**Exemple** :
```typescript
// Mauvais exemple : si on veut ajouter un nouveau type de validation, il faut modifier cette classe
class UserService {
    validateUser(user: User) {
        if (user.email.includes('@')) { /* ... */ }
        if (user.age > 18) { /* ... */ }
    }
}

// Bon exemple : on peut ajouter une nouvelle validation sans changer le code existant
interface Validator {
    validate(user: User): boolean;
}

class EmailValidator implements Validator {
    validate(user: User): boolean {
        return user.email.includes('@');
    }
}

class AgeValidator implements Validator {
    validate(user: User): boolean {
        return user.age > 18;
    }
}
```
**Explication** : On peut ajouter de nouvelles validations simplement en créant de nouvelles classes qui suivent l'interface `Validator`, sans toucher au code existant.

### 3. **L : Liskov Substitution Principle (Principe de substitution de Liskov)**
Les objets d'une classe doivent **fonctionner de la même manière** que ceux de la classe parent.

**Exemple** :
```typescript
// Mauvais exemple : cette classe ne fonctionne pas comme la classe parent
class Animal {
    makeSound() {
        console.log('Generic animal sound');
    }
}

class Dog extends Animal {
    makeSound() {
        console.log('Bark');
    }
}

class Cat extends Animal {
    makeSound() {
        throw new Error('Cats are silent!');
    }
}

// Bon exemple : toutes les classes filles fonctionnent correctement comme la classe parent
class Cat extends Animal {
    makeSound() {
        console.log('Meow');
    }
}
```
**Explication** : La classe `Cat` doit pouvoir être utilisée partout où `Animal` est attendu, sans provoquer d'erreurs.

### 4. **I : Interface Segregation Principle (Principe de ségrégation des interfaces)**
Une classe ne doit avoir **que les méthodes dont elle a besoin**.

**Exemple** :
```typescript
// Mauvais exemple : cette interface force les classes à implémenter des méthodes dont elles n'ont pas besoin
interface Worker {
    work();
    eat();
}

class Developer implements Worker {
    work() { /* ... */ }
    eat() { /* ... */ } // Peut-être inutile pour certaines classes
}

// Bon exemple : on divise l'interface en plusieurs interfaces spécifiques
interface Workable {
    work();
}

interface Eatable {
    eat();
}

class Developer implements Workable {
    work() { /* ...

 */ }
}
```
**Explication** : En divisant les interfaces, chaque classe n'implémente que ce dont elle a besoin, rendant le code plus simple et plus clair.

### 5. **D : Dependency Inversion Principle (Principe d'inversion des dépendances)**
Les grandes parties du code ne doivent pas dépendre des petites parties **directement**.

**Exemple** :
```typescript
// Mauvais exemple : UserService dépend directement de UserRepository
class UserService {
    private userRepository = new UserRepository();
}

// Bon exemple : UserService dépend d'une abstraction (une interface)
interface IUserRepository {
    save(user: User): void;
}

class UserRepository implements IUserRepository {
    save(user: User): void { /* ... */ }
}

class UserService {
    constructor(private userRepository: IUserRepository) { }
}
```
**Explication** : En utilisant une interface (`IUserRepository`), on peut facilement changer la façon dont les données sont stockées sans toucher à `UserService`.


### Justification d'une approche plus simple

Vous remarquerez peut-être que nous n'avons pas strictement appliqué tous les principes SOLID à la lettre dans ce projet. Par exemple, le principe d'inversion des dépendances (le "D" de SOLID) n'a pas été pleinement respecté. Voici pourquoi :

- **Priorité à l'apprentissage des bases** : L'objectif principal est de vous familiariser avec les concepts de base de la programmation orientée objets, TypeScript, et le développement d'API. Introduire des concepts plus complexes comme les interfaces et l'injection de dépendances pourrait rendre le code plus difficile à comprendre au début.
  
- **Éviter la surcharge cognitive** : Nous avons simplifié le code pour que vous puissiez vous concentrer sur l'essentiel : comprendre comment les différentes parties d'une application interagissent. Une fois que vous serez à l'aise avec ces concepts de base, vous pourrez apprendre à appliquer des principes plus avancés.
  
- **Éviter la surcharge cognitive** : Nous avons simplifié le code pour que vous puissiez vous concentrer sur l'essentiel : comprendre comment les différentes parties d'une application interagissent. Une fois que vous serez à l'aise avec ces concepts de base, vous pourrez apprendre à appliquer des principes plus avancés.

- **Introduction progressive des concepts** : Le fait de commencer avec une version simplifiée du code vous permet de construire une base solide. Plus tard, vous pourrez introduire des concepts comme l'inversion des dépendances pour rendre le code encore plus flexible et maintenable.

En somme, l'architecture utilisée ici est conçue pour être simple et accessible, tout en vous préparant à aborder des concepts plus avancés au fur et à mesure que vous progressez.
