# 🛒 ClicVente — Marketplace Mobile

> Application mobile de petites annonces avec messagerie temps réel, construite en **React Native (Expo)** et propulsée par **Firebase**.

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
![NativeWind](https://img.shields.io/badge/NativeWind-4-38BDF8?logo=tailwindcss&logoColor=white)

---

## 📱 À propos

**ClicVente** est une marketplace mobile qui permet à n'importe quel utilisateur de publier des annonces (avec photo, prix, catégorie et localisation), de parcourir les annonces des autres et d'entrer directement en contact avec les vendeurs grâce à un chat temps réel. Toute la couche backend — authentification, base de données, stockage des images et synchronisation des messages — est gérée par **Firebase**.

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription par email / mot de passe
- Connexion sécurisée et persistance de session via Firebase Auth
- Déconnexion depuis le profil

### 🛍️ Annonces
- 📸 Publication d'annonces avec photo (sélection depuis la galerie via `expo-image-picker`)
- 📝 Titre, description, prix, catégorie et localisation
- 🔍 Recherche en temps réel depuis l'écran d'accueil
- 👁️ Vue détaillée de chaque annonce
- ✏️ Édition et suppression de ses propres annonces (écran *Mes annonces*)

### 💬 Messagerie temps réel
- Chat 1-to-1 entre un acheteur et un vendeur, lié à une annonce précise
- Identifiant de conversation déterministe (`postId_uidA_uidB`) — pas de doublons
- Synchronisation instantanée via Firestore (`onSnapshot`)
- Liste des conversations triées par dernière activité

### 👤 Profil
- Affichage des infos utilisateur
- Accès rapide à ses propres annonces

---

## 🧱 Stack technique

| Couche | Outils |
|---|---|
| **Framework** | React Native 0.81 + Expo 54 (New Architecture activée) |
| **Langage** | JavaScript (ES6+) |
| **Navigation** | React Navigation 7 (Stack + Bottom Tabs) |
| **Styles** | NativeWind 4 (Tailwind CSS pour React Native) |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **Médias** | `expo-image-picker` |
| **Icônes** | `@expo/vector-icons` (Ionicons) |
| **State global** | React Context (`PostProvider`) |

---

## 📁 Structure du projet

```
Projet-de-Marketplace-Mobile/
├── App.js                      # Point d'entrée racine
├── index.js                    # Bootstrap Expo
├── firebase.js                 # ⚠️ À créer — config Firebase (non versionné)
├── navigation/
│   └── AppNavigator.js         # Stack + Tabs
├── screens/
│   ├── LoginScreen.js
│   ├── SignupScreen.js
│   ├── HomeScreen.js           # Feed + recherche
│   ├── ExplorerScreen.js
│   ├── CreatePostScreen.js     # Publication d'annonce
│   ├── EditPostScreen.js
│   ├── PostScreen.js           # Détail d'une annonce
│   ├── MyPostsScreen.js
│   ├── MessagesScreen.js       # Liste des conversations
│   ├── ChatScreen.js           # Conversation
│   ├── ProfileScreen.js
│   └── components/
│       ├── BottomNav.js
│       └── PostComponent.js
├── context/
│   └── PostProvider.js
├── lib/
│   └── chat.js                 # getOrCreateChat()
├── assets/                     # icônes, splash
├── global.css                  # Tailwind base
├── tailwind.config.js
└── app.json                    # Config Expo
```

---

## 🚀 Installation

### Prérequis
- **Node.js** ≥ 18
- **npm** ou **yarn**
- **Expo Go** sur votre téléphone (iOS / Android) **ou** un simulateur
- Un **projet Firebase** (voir étape 3)

### 1. Cloner le dépôt
```bash
git clone https://github.com/ChemsEddineRebouh/Projet-de-Marketplace-Mobile.git
cd Projet-de-Marketplace-Mobile
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer Firebase

Sur la [console Firebase](https://console.firebase.google.com/) :

1. Créez un nouveau projet.
2. Activez **Authentication → Email/Mot de passe**.
3. Activez **Firestore Database** (mode test pour commencer).
4. Activez **Storage** (pour les images d'annonces).
5. Ajoutez une application **Web** au projet et copiez la config.

Créez ensuite un fichier **`firebase.js`** à la racine du projet :

```javascript
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            "VOTRE_API_KEY",
  authDomain:        "votre-projet.firebaseapp.com",
  projectId:         "votre-projet",
  storageBucket:     "votre-projet.appspot.com",
  messagingSenderId: "XXXXXXXXX",
  appId:             "1:XXXX:web:XXXX",
};

const app = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
```

> ⚠️ Le fichier `firebase.js` est listé dans `.gitignore` — **ne le commitez jamais**.

### 4. Lancer l'application
```bash
npx expo start
```

Scannez le QR code avec **Expo Go**, ou appuyez sur `a` (Android), `i` (iOS), ou `w` (Web).

---

## 🗄️ Modèle de données Firestore

### Collection `posts`
```js
{
  title: string,
  description: string,
  price: string,
  category: string,
  location: string,
  imageUrl: string,        // URL Firebase Storage
  authorId: string,        // uid du vendeur
  authorName: string,
  createdAt: timestamp,
}
```

### Collection `chats`
```js
{
  postId: string,
  postTitle: string,
  participants: [uidA, uidB],
  buyerId: string,
  sellerId: string,
  sellerName: string,
  lastMessage: string,
  updatedAt: timestamp,
}
```

### Sous-collection `chats/{chatId}/messages`
```js
{
  text: string,
  senderId: string,
  createdAt: timestamp,
}
```

---

## 📜 Scripts disponibles

| Commande | Description |
|---|---|
| `npm start` | Démarre le serveur Expo |
| `npm run android` | Lance sur émulateur Android |
| `npm run ios` | Lance sur simulateur iOS |
| `npm run web` | Lance la version web |

---

## 🛣️ Pistes d'amélioration

- [ ] Notifications push (Expo Notifications)
- [ ] Filtres avancés (par catégorie, prix, distance)
- [ ] Favoris / annonces sauvegardées
- [ ] Système d'évaluation des vendeurs
- [ ] Support multi-images par annonce
- [ ] Internationalisation (FR / EN / AR)
- [ ] Mode hors ligne (cache Firestore)

---

## 👤 Auteur

**Chems-Eddine Rebouh**
- GitHub : [@ChemsEddineRebouh](https://github.com/ChemsEddineRebouh)
- LinkedIn : [@chemseddinerebouh](https://www.linkedin.com/in/chemseddinerebouh)
