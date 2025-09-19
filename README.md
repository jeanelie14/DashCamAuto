# DashCam Auto 🚗

Une application mobile React Native développée avec TypeScript pour la sécurité routière et la conduite responsable.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Tests](#tests)
- [Build et déploiement](#build-et-déploiement)
- [Architecture](#architecture)
- [Composants UI](#composants-ui)
- [État du projet](#état-du-projet)
- [Contribution](#contribution)
- [Licence](#licence)

## 🎯 Aperçu

DashCam Auto est une application mobile cross-platform développée avec React Native et TypeScript. L'application vise à promouvoir la sécurité routière et fournir des outils pour une conduite plus responsable grâce à la détection automatique d'incidents et l'enregistrement vidéo intelligent.

## ✨ Fonctionnalités

### 🚨 Fonctionnalités principales

#### Détection automatique d'incidents
- **Détection par accéléromètre/gyroscope** : Identification des secousses anormales et mouvements brusques
- **Détection par traitement d'image** : Analyse en temps réel pour détecter collisions ou mouvements suspects
- **Switch automatique caméra** :
  - **Caméra frontale** : Surveillance du comportement du conducteur (intérieur véhicule)
  - **Caméra arrière** : Enregistrement des incidents routiers (extérieur véhicule)
- **Enregistrement automatique** : Buffer intelligent (10 sec avant + 20 sec après l'événement)

#### Gestion vidéo avancée
- **Enregistrement continu** avec buffer circulaire
- **Qualité vidéo optimisée** pour la reconnaissance d'incidents
- **Compression intelligente** pour économiser l'espace de stockage
- **Métadonnées GPS** intégrées à chaque enregistrement

### 💡 Fonctionnalités avancées (à venir)

#### Mode surveillance stationnement
- **Mode sentinelle** : Détection de mouvement autour du véhicule à l'arrêt
- **Détection d'intrusion** : Alerte en cas de mouvement suspect
- **Enregistrement déclenché** par détection de mouvement

#### Détection de fatigue/somnolence
- **Reconnaissance faciale** : Analyse des clignements d'yeux et du regard
- **Détection de signes de fatigue** : Alerte préventive au conducteur
- **Analyse comportementale** : Patterns de conduite anormaux

#### Commandes vocales
- **Reconnaissance vocale** : "Hey DashCam, enregistre ça !"
- **Commandes hands-free** : Contrôle vocal de l'application
- **Alertes vocales** : Notifications audio pour les incidents

#### Cloud et synchronisation
- **Upload automatique** : Sauvegarde sécurisée dans le cloud
- **Protection contre le vol** : Données sécurisées même en cas de destruction du téléphone
- **Synchronisation multi-appareils** : Accès aux enregistrements depuis n'importe où

#### Dashboard et historique
- **Interface de relecture** : Visualisation des enregistrements classés
- **Historique d'incidents** : Tri par date, lieu, type d'incident
- **Statistiques de conduite** : Analyse des patterns de conduite
- **Export de données** : Génération de rapports d'incidents

### 🛠 Fonctionnalités techniques
- **Support Android et iOS** : Application cross-platform native
- **Architecture moderne** : TypeScript + Redux Toolkit
- **Tests automatisés** : Jest + React Test Renderer
- **Linting et qualité** : ESLint + TypeScript strict
- **Performance optimisée** : Hermes + Metro bundler
- **Nouvelle architecture RN** : Support des dernières fonctionnalités

## 🛠 Technologies utilisées

### Frontend Core
- **React Native** 0.81.4 - Framework mobile cross-platform
- **React** 19.1.0 - Bibliothèque UI
- **TypeScript** 5.9.2 - Langage de programmation typé
- **Redux Toolkit** 2.9.0 - Gestion d'état global
- **React Navigation** 7.x - Navigation entre écrans

### 📹 Gestion caméra et vidéo
- **react-native-vision-camera** - Caméra ultra-performante avec Frame Processors ✅
- **react-native-video** - Lecture et traitement vidéo (à installer)
- **@react-native-community/camera** - API caméra native (à installer)

### 🧠 Détection d'incidents et IA
- **@react-native-community/sensors** - Accéléromètre/gyroscope (à installer)
- **@tensorflow-models/blazeface** - Reconnaissance faciale (à installer)
- **react-native-tensorflow** - Machine Learning (à installer)
- **react-native-voice** - Reconnaissance vocale (à installer)

### 📍 Géolocalisation et permissions
- **react-native-geolocation-service** - Géolocalisation précise (à installer)
- **react-native-permissions** - Gestion des permissions système (à installer)
- **@react-native-community/geolocation** - API GPS native (à installer)

### ☁️ Cloud et stockage
- **aws-sdk** - Intégration AWS S3 (à installer)
- **react-native-firebase** - Firebase Storage (à installer)
- **react-native-fs** - Système de fichiers local (à installer)

### 🔧 Utilitaires
- **react-native-qrcode-scanner** - Scanner QR codes (à installer)
- **@react-native-async-storage/async-storage** - Stockage asynchrone (à installer)
- **react-native-device-info** - Informations appareil (à installer)

### Outils de développement
- **Jest** 29.6.3 - Framework de tests
- **ESLint** 8.19.0 - Linter de code
- **Prettier** 3.0.0 - Formateur de code
- **Babel** 7.25.2 - Transpilation JavaScript
- **Metro** 0.81.4 - Bundler React Native
- **Flipper** - Debugging et profiling

## 📋 Prérequis

### Développement général
- **Node.js** (version 20 ou supérieure)
- **npm** ou **yarn**
- **React Native CLI**
- **Git** pour le contrôle de version

### Android
- **Android Studio** (dernière version)
- **Java Development Kit (JDK)** 11 ou supérieur
- **Android SDK** (API 21-34)
- **Android Emulator** ou appareil physique

### iOS (macOS uniquement)
- **Xcode** (dernière version)
- **CocoaPods** pour la gestion des dépendances
- **iOS Simulator** ou appareil physique
- **Command Line Tools** pour Xcode

### Services cloud (optionnel)
- **Compte AWS** pour S3 Storage
- **Compte Firebase** pour les services Google
- **Clés API** pour les services de géolocalisation

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd DashCamAuto
   ```

2. **Installer les dépendances de base**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Installer les dépendances natives supplémentaires** (Phase 3+)
   ```bash
   # Caméra et vision
   npm install react-native-vision-camera @react-native-community/camera
   
   # Détection et IA
   npm install @react-native-community/sensors @tensorflow-models/blazeface react-native-tensorflow react-native-voice
   
   # Géolocalisation et stockage
   npm install @react-native-community/geolocation @react-native-async-storage/async-storage react-native-device-info
   
   # Cloud et Firebase
   npm install @react-native-firebase/app @react-native-firebase/storage
   ```

4. **Installation des dépendances iOS** (macOS uniquement)
   ```bash
   cd ios && pod install && cd ..
   ```

5. **Configuration des variables d'environnement** (Phase 4+)
   ```bash
   cp .env.example .env
   # Éditer le fichier .env avec vos configurations
   ```

6. **Configuration des permissions natives**
   - **Android** : Mettre à jour `android/app/src/main/AndroidManifest.xml`
   - **iOS** : Mettre à jour `ios/DashCamAuto/Info.plist`

## ⚙️ Configuration

### Android
- Configuration minimale : API 21 (Android 5.0)
- Configuration cible : API 34 (Android 14)
- Architecture supportée : armeabi-v7a, x86, arm64-v8a, x86_64

### iOS
- Version minimale : iOS 12.4
- Support des architectures : arm64, x86_64
- Hermes activé par défaut

### Permissions requises

#### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

#### iOS (Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>Cette app utilise la caméra pour enregistrer des vidéos de conduite et détecter automatiquement les incidents</string>
<key>NSMicrophoneUsageDescription</key>
<string>Cette app utilise le microphone pour enregistrer l'audio des vidéos de conduite</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Cette app utilise la localisation pour géolocaliser les incidents et fournir des informations de sécurité routière</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Cette app utilise la localisation pour la surveillance continue et la détection d'incidents en arrière-plan</string>
```

## 🏗 Développement

### Scripts disponibles

```bash
# Développement
npm start                 # Démarrer le serveur Metro
npm run android          # Lancer sur Android
npm run ios              # Lancer sur iOS

# Tests
npm test                 # Exécuter les tests
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Tests avec couverture

# Qualité de code
npm run lint             # Linter le code
npm run lint:fix         # Corriger automatiquement
npm run format           # Formater le code
npm run format:check     # Vérifier le formatage

# Build
npm run build:android    # Build Android release
npm run build:ios        # Build iOS release
npm run clean            # Nettoyer le projet

# Utilitaires
npm run check:deps       # Vérifier les dépendances
npm run start:reset      # Démarrer avec reset cache
```

### Structure de développement

1. **Développement local**
   ```bash
   npm start
   # Dans un autre terminal
   npm run android  # ou npm run ios
   ```

2. **Mode debug**
   - Utilise Flipper pour le debugging
   - Hot reload activé
   - Logs détaillés

3. **Mode release**
   - Optimisations activées
   - Hermes activé
   - Minification du code

## 🧪 Tests

### Exécution des tests
```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

### Structure des tests
- Tests unitaires avec Jest
- Tests de composants avec React Test Renderer
- Configuration TypeScript pour les tests

## 📦 Build et déploiement

### Android

1. **Build debug**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

2. **Build release**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Signer l'APK** (production)
   - Configurer les clés de signature
   - Mettre à jour `android/app/build.gradle`

### iOS

1. **Build via Xcode**
   - Ouvrir `ios/DashCamAuto.xcworkspace`
   - Sélectionner le schéma de build
   - Archiver et distribuer

2. **Build via CLI**
   ```bash
   cd ios
   xcodebuild -workspace DashCamAuto.xcworkspace -scheme DashCamAuto -configuration Release
   ```

## 🏛 Architecture

### Architecture générale
- **MVVM Pattern** avec Redux
- **Component-based** architecture
- **TypeScript** pour la sécurité des types
- **Modular** structure

### Gestion d'état
- **Redux Toolkit** pour la gestion d'état global
- **React Redux** pour la connexion des composants
- **Slices** pour l'organisation des reducers

### Navigation
- **React Navigation** 7.x
- **Bottom Tab Navigator** pour la navigation principale
- **Stack Navigator** pour les détails
- **Type-safe** navigation avec TypeScript

## 📁 Structure du projet

```
DashCamAuto/
├── __tests__/                 # Tests unitaires
├── android/                   # Configuration Android
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/         # Code Java natif
│   │   │   ├── jni/          # Code C++ natif
│   │   │   └── res/          # Ressources Android
│   │   └── build.gradle      # Configuration build Android
│   └── gradle/               # Configuration Gradle
├── ios/                      # Configuration iOS
│   ├── DashCamAuto/          # Projet Xcode
│   └── Podfile              # Dépendances CocoaPods
├── src/                      # Code source principal
│   ├── components/           # Composants réutilisables
│   │   ├── camera/          # Composants caméra
│   │   ├── sensors/         # Composants capteurs
│   │   ├── ui/              # Composants UI génériques
│   │   └── common/          # Composants communs
│   ├── screens/             # Écrans de l'application
│   │   ├── Dashboard/       # Écran principal
│   │   ├── Camera/          # Écran caméra
│   │   ├── History/         # Historique des incidents
│   │   ├── Settings/        # Paramètres
│   │   └── Playback/        # Lecture des enregistrements
│   ├── navigation/           # Configuration navigation
│   │   ├── AppNavigator.tsx # Navigateur principal
│   │   └── types.ts         # Types de navigation
│   ├── store/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   │   ├── cameraSlice.ts
│   │   │   ├── incidentSlice.ts
│   │   │   ├── locationSlice.ts
│   │   │   └── settingsSlice.ts
│   │   └── store.ts         # Configuration store
│   ├── services/            # Services API
│   │   ├── camera/          # Service caméra
│   │   ├── sensors/         # Service capteurs
│   │   ├── storage/         # Service stockage
│   │   ├── cloud/           # Service cloud
│   │   └── ai/              # Service IA/ML
│   ├── utils/               # Utilitaires
│   │   ├── permissions.ts   # Gestion permissions
│   │   ├── storage.ts       # Utilitaires stockage
│   │   ├── location.ts      # Utilitaires géolocalisation
│   │   └── constants.ts     # Constantes
│   ├── types/               # Types TypeScript
│   │   ├── camera.ts        # Types caméra
│   │   ├── incident.ts      # Types incidents
│   │   └── common.ts        # Types communs
│   ├── hooks/               # Hooks personnalisés
│   │   ├── useCamera.ts     # Hook caméra
│   │   ├── useSensors.ts    # Hook capteurs
│   │   └── useLocation.ts   # Hook géolocalisation
│   ├── context/             # Contexts React
│   │   └── ThemeContext.tsx # Gestion des thèmes
│   └── theme/               # Système de design
│       ├── colors.ts        # Palette de couleurs
│       ├── typography.ts    # Système typographique
│       └── spacing.ts       # Espacements et ombres
├── assets/                   # Ressources statiques
│   ├── images/              # Images
│   ├── icons/               # Icônes
│   └── sounds/              # Sons et alertes
├── App.tsx                   # Point d'entrée principal
├── package.json             # Dépendances et scripts
├── tsconfig.json            # Configuration TypeScript
├── babel.config.js          # Configuration Babel
├── metro.config.js          # Configuration Metro
├── .env.example             # Variables d'environnement exemple
└── README.md               # Documentation
```

## 🎨 Composants UI

### Composants disponibles
- **Button** : Bouton avec 5 variants (primary, secondary, outline, ghost, danger)
- **Card** : Carte avec 3 variants (elevated, outlined, filled)
- **Input** : Champ de saisie avec icônes et validation
- **Switch** : Interrupteur personnalisé avec animations
- **List & ListItem** : Composants de liste pour les paramètres
- **Icon** : Système d'icônes Unicode avec composants prédéfinis

### Système de thème
- **ThemeProvider** : Context React pour la gestion des thèmes
- **Thèmes** : Light, Dark et Auto (suivi système)
- **Hooks** : `useTheme()` et `useThemedStyles()` pour l'utilisation
- **Design tokens** : Couleurs, typographie, espacements, ombres

## 🚨 Dépannage

### Problèmes courants

1. **Erreur Metro**
   ```bash
   npm run start:reset
   ```

2. **Problème de permissions Android**
   - Vérifier `android/app/src/main/AndroidManifest.xml`
   - Ajouter les permissions manquantes

3. **Problème iOS**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Problème de cache**
   ```bash
   npm start -- --reset-cache
   ```

5. **Crash VisionCamera (RÉSOLU)**
   - ✅ Architecture native corrigée (arm64-v8a, x86_64)
   - ✅ Configuration Gradle mise à jour
   - ✅ Frame Processors activés
   - ✅ Gestion d'erreurs onWindowFocusChanged

6. **Problème d'architecture native**
   - Vérifier que l'émulateur correspond à l'architecture compilée
   - Nettoyer et recompiler : `cd android && ./gradlew clean && cd .. && npx react-native run-android`

## 📊 Métriques et performance

### Optimisations incluses
- **Hermes** activé pour de meilleures performances
- **Proguard** pour l'optimisation Android
- **Metro** configuré pour l'optimisation
- **Tree shaking** automatique

### Monitoring
- Intégration Flipper pour le debugging
- Logs structurés
- Métriques de performance

## 📊 État du projet

### ✅ Phase 1 : INITIALISATION (Terminée)
- [x] Projet React Native TypeScript créé
- [x] Structure de dossiers configurée
- [x] Redux Toolkit avec slices de base
- [x] Navigation configurée avec écrans placeholder
- [x] Permissions système configurées
- [x] ESLint, Prettier, tests Jest configurés

### ✅ Phase 2 : INTERFACE UTILISATEUR (Terminée)
- [x] Composants UI réutilisables (Button, Card, Input, Switch, List, Icon)
- [x] Système de thème complet (light/dark/auto) avec ThemeProvider
- [x] Navigation fluide avec icônes thématiques
- [x] Design system cohérent (couleurs, typographie, espacements)
- [x] Interface responsive et moderne

### 📋 Phase 3 : INTÉGRATION CAMÉRA ET INTERFACE PRINCIPALE (En cours)

#### 🎯 Objectifs de la Phase 3
Créer une interface caméra professionnelle avec overlays temps réel pour une expérience de conduite optimale.

#### ✅ Progrès actuel
- [x] Intégration react-native-vision-camera
- [x] Configuration architecture native (arm64-v8a, x86_64)
- [x] Frame Processors activés pour l'analyse d'image
- [x] Correction des problèmes de crash et architecture

#### 📋 Tâches restantes

**🎨 Logo et identité visuelle**
- [ ] **Logo de l'application** - Icône caméra vectorielle moderne et professionnelle
- [ ] **Configuration icônes** - Android (mipmap) et iOS (AppIcon) avec toutes les résolutions
- [ ] **Splash screen** - Écran de démarrage avec logo

**📱 Interface caméra principale**
- [ ] **Écran d'accueil = Caméra** - Caméra arrière par défaut au lancement
- [ ] **Overlays professionnels** - Interface semi-transparente, lisible en conduite
- [ ] **Vitesse en temps réel** - Compteur digital (km/h) en haut à gauche
- [ ] **Accès paramètres** - Icône réglages (⚙️) en haut à droite
- [ ] **Barre d'état** - Statut enregistrement (🔴/🟢), GPS, batterie en bas

**🎨 Design système et UX**
- [ ] **Couleurs thématiques** - Vert=vitesse, blanc=infos système, gris=réglages
- [ ] **Overlays semi-transparents** - Lisibles sans gêner la caméra
- [ ] **Typographie adaptée** - Compteur digital, textes système
- [ ] **Animations fluides** - Transitions et indicateurs d'état

**⚙️ Architecture et intégration**
- [ ] **Hook useLocation** - Calcul vitesse avec react-native-geolocation-service
- [ ] **Redux integration** - Connexion vitesse et capteurs aux slices
- [ ] **Navigation** - Redirection vers SettingsScreen depuis l'icône réglages
- [ ] **État global** - Gestion statut enregistrement, GPS, batterie

#### 🛠 Spécifications techniques

**Composants à créer :**
- `Speedometer.tsx` - Compteur de vitesse digital
- `StatusBar.tsx` - Barre d'état (enregistrement, GPS, batterie)
- `CameraOverlay.tsx` - Interface overlays principale
- `SettingsButton.tsx` - Bouton d'accès aux paramètres

**Hooks à implémenter :**
- `useSpeed.ts` - Calcul vitesse en temps réel
- `useBattery.ts` - Monitoring niveau batterie
- `useGPSStatus.ts` - Statut GPS et précision

**Redux slices à étendre :**
- `locationSlice.ts` - Ajout vitesse et statut GPS
- `cameraSlice.ts` - Statut enregistrement et métadonnées
- `systemSlice.ts` - État batterie et système

#### 🎨 Palette de couleurs Phase 3

**Couleurs principales :**
- **Vert vitesse** (`#00FF88`) - Compteur de vitesse et indicateurs actifs
- **Blanc système** (`#FFFFFF`) - Informations système et textes principaux
- **Gris réglages** (`#CCCCCC`) - Boutons et éléments secondaires
- **Rouge enregistrement** (`#FF4444`) - Statut d'enregistrement actif
- **Vert GPS** (`#44FF44`) - Statut GPS actif
- **Orange batterie** (`#FFAA00`) - Niveau batterie faible
- **Overlay sombre** (`rgba(0,0,0,0.6)`) - Arrière-plan des overlays

**Typographie :**
- **Compteur vitesse** - Font monospace, taille 48px, gras
- **Textes système** - Font système, taille 16px, normal
- **Indicateurs** - Font système, taille 14px, semi-gras

### ✅ Phase 4 : DÉTECTION D'INCIDENTS (Terminée)
- [x] Intégration des capteurs (accéléromètre/gyroscope)
- [x] Système de détection d'incidents basique
- [x] Buffer circulaire pour l'enregistrement
- [x] Tests de détection de mouvement

**Fonctionnalités implémentées :**
- **SensorService** : Service complet pour la gestion des capteurs (accéléromètre/gyroscope)
- **Détection d'incidents** : Algorithmes de détection pour collisions, freinages brusques, virages serrés
- **CircularBufferService** : Système de buffer circulaire pour l'enregistrement continu
- **Hook useSensors** : Hook React pour l'intégration facile des capteurs
- **Types d'incidents** : Support pour différents types d'incidents avec métadonnées
- **Interface utilisateur** : Contrôles de surveillance et affichage du statut
- **Tests complets** : Suite de tests pour tous les services

### 📋 Phase 5 : IA ET RECONNAISSANCE (Planifiée)
- [ ] Intégration TensorFlow
- [ ] Détection de fatigue/somnolence
- [ ] Reconnaissance faciale
- [ ] Commandes vocales
- [ ] Optimisation des algorithmes

### 📋 Phase 6 : STOCKAGE ET CLOUD (Planifiée)
- [ ] Système de stockage local
- [ ] Upload automatique vers AWS S3
- [ ] Synchronisation Firebase
- [ ] Gestion de l'espace de stockage
- [ ] Compression vidéo

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines
- Suivre les conventions de code TypeScript
- Ajouter des tests pour les nouvelles fonctionnalités
- Documenter les changements majeurs
- Respecter les règles ESLint

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation React Native
- Vérifier les logs de debug

---

**Développé avec ❤️ pour la sécurité routière**

*DashCam Auto - Votre partenaire intelligent pour une conduite plus sûre* 🚗✨