#!/bin/bash

echo "🔧 Correction du crash au lancement de DashCam Auto"
echo "=================================================="

# Nettoyer le cache Metro
echo "1. Nettoyage du cache Metro..."
npx react-native start --reset-cache &
sleep 3
pkill -f "react-native start"

# Nettoyer les caches npm
echo "2. Nettoyage des caches npm..."
npm cache clean --force

# Supprimer node_modules et package-lock.json
echo "3. Suppression des dépendances existantes..."
rm -rf node_modules
rm -f package-lock.json

# Nettoyer le build Android
echo "4. Nettoyage du build Android..."
cd android
./gradlew clean
cd ..

# Nettoyer le build iOS
echo "5. Nettoyage du build iOS..."
cd ios
rm -rf build
rm -rf Pods
rm -f Podfile.lock
cd ..

# Réinstaller les dépendances
echo "6. Réinstallation des dépendances..."
npm install

# Installer les pods iOS
echo "7. Installation des pods iOS..."
cd ios
pod install
cd ..

# Nettoyer et rebuilder Android
echo "8. Reconstruction Android..."
cd android
./gradlew clean
./gradlew assembleDebug
cd ..

echo "✅ Correction terminée !"
echo ""
echo "Prochaines étapes :"
echo "1. Redémarrez Metro : npm start"
echo "2. Lancez l'app : npm run android"
echo "3. Vérifiez les logs : adb logcat | grep -E '(DashCamAuto|ReactNative|VisionCamera)'"
