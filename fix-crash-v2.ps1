# Script PowerShell amélioré pour corriger le crash au lancement de DashCam Auto
Write-Host "🔧 Correction du crash au lancement de DashCam Auto (v2)" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green

# Nettoyer le cache Metro
Write-Host "1. Nettoyage du cache Metro..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Nettoyer les caches npm
Write-Host "2. Nettoyage des caches npm..." -ForegroundColor Yellow
npm cache clean --force

# Supprimer node_modules et package-lock.json
Write-Host "3. Suppression des dépendances existantes..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

# Nettoyer le build Android
Write-Host "4. Nettoyage du build Android..." -ForegroundColor Yellow
if (Test-Path "android\build") { Remove-Item -Recurse -Force "android\build" }
if (Test-Path "android\app\build") { Remove-Item -Recurse -Force "android\app\build" }

# Nettoyer le build iOS
Write-Host "5. Nettoyage du build iOS..." -ForegroundColor Yellow
if (Test-Path "ios\build") { Remove-Item -Recurse -Force "ios\build" }
if (Test-Path "ios\Pods") { Remove-Item -Recurse -Force "ios\Pods" }
if (Test-Path "ios\Podfile.lock") { Remove-Item -Force "ios\Podfile.lock" }

# Réinstaller les dépendances avec --legacy-peer-deps
Write-Host "6. Réinstallation des dépendances avec résolution de conflits..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Vérifier l'installation
Write-Host "7. Vérification de l'installation..." -ForegroundColor Yellow
if (Test-Path "node_modules\react-native") {
    Write-Host "✅ React Native installé" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur d'installation React Native" -ForegroundColor Red
    exit 1
}

# Installer les pods iOS (si sur macOS)
if ($IsMacOS -or $env:OS -eq "Darwin") {
    Write-Host "8. Installation des pods iOS..." -ForegroundColor Yellow
    Set-Location "ios"
    pod install
    Set-Location ".."
}

# Nettoyer et rebuilder Android
Write-Host "9. Reconstruction Android..." -ForegroundColor Yellow
Set-Location "android"
& ".\gradlew.bat" clean
& ".\gradlew.bat" assembleDebug
Set-Location ".."

Write-Host "✅ Correction terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Redémarrez Metro : npm start" -ForegroundColor White
Write-Host "2. Lancez l'app : npm run android" -ForegroundColor White
Write-Host "3. Vérifiez les logs : adb logcat | findstr 'DashCamAuto ReactNative VisionCamera'" -ForegroundColor White
Write-Host ""
Write-Host "Si le problème persiste, essayez :" -ForegroundColor Yellow
Write-Host "npm install --legacy-peer-deps --force" -ForegroundColor White
