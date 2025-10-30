# Projet : Marketplace Mobile (React Native)

Ce projet est une application mobile de type **marketplace** développée en **React Native** et **Expo**. Il permet aux utilisateurs de créer des comptes, de publier des annonces et de communiquer en temps réel via un chat.

L'authentification et les services backend (base de données, chat) sont entièrement gérés à l'aide de **Google Firebase**.

---

## Fonctionnalités principales

### Authentification des utilisateurs
- Création de compte (email/mot de passe).
- Connexion et déconnexion sécurisées.
- Gestion de session (via Firebase Authentication).

### Marketplace
- Consultation des annonces publiées par d'autres utilisateurs.
- Publication de nouvelles annonces (vendeurs).

### Chat en temps réel
- Messagerie instantanée entre acheteurs et vendeurs.
- Construit avec Firebase Firestore pour une synchronisation instantanée des messages.

---

## Technologies utilisées

- **Framework** : React Native (avec Expo)
- **Backend & Services** : Firebase  
  - **Firebase Authentication** : Pour la gestion des utilisateurs.
  - **Firebase Firestore** : Pour la base de données (annonces, profils) et le chat en temps réel.
- **Navigation** : React Navigation
- **Langage** : JavaScript (ES6+)

---

## Installation et Démarrage

Instructions pour lancer le projet en local :

### Cloner le dépôt
~~~bash
git clone https://github.com/ChemsEddineRebouh/VOTRE-REPO-NOM.git
cd VOTRE-REPO-NOM
~~~

### Installer les dépendances
~~~bash
npm install
# ou
yarn install
~~~

> Note : Pour Expo, `expo install [nom-du-paquet]` est recommandé pour les paquets avec du code natif.

### Configurer Firebase
- Créez un nouveau projet sur la **console Firebase**.
- Activez **Authentication** (Email/Mot de passe).
- Activez **Firestore Database**.
- Ajoutez vos fichiers de configuration Firebase (**google-services.json** pour Android et **GoogleService-Info.plist** pour iOS) à la racine de votre projet Expo.

### Lancer l'application
~~~bash
expo start
~~~

Cela lancera le serveur de développement Expo. Vous pouvez ensuite scanner le code QR avec l'application **Expo Go** sur votre téléphone ou lancer l'application sur un simulateur (Android/iOS).

---

## Auteur

**Chems-Eddine Rebouh**  
GitHub: @ChemsEddineRebouh  
LinkedIn: @chemseddinerebouh
