# Script PowerShell simple pour corriger le crash au lancement de DashCam Auto
Write-Host "🔧 Correction simple du crash au lancement de DashCam Auto" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green

# Arrêter tous les processus Node
Write-Host "1. Arrêt des processus Node..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Nettoyer complètement
Write-Host "2. Nettoyage complet..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
if (Test-Path "android\build") { Remove-Item -Recurse -Force "android\build" }
if (Test-Path "android\app\build") { Remove-Item -Recurse -Force "android\app\build" }

# Installer avec résolution de conflits
Write-Host "3. Installation avec résolution de conflits..." -ForegroundColor Yellow
npm install --legacy-peer-deps --force

# Vérifier l'installation
Write-Host "4. Vérification de l'installation..." -ForegroundColor Yellow
if (Test-Path "node_modules\react-native") {
    Write-Host "✅ React Native installé" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur d'installation React Native" -ForegroundColor Red
    Write-Host "Tentative d'installation manuelle..." -ForegroundColor Yellow
    npm install react-native@0.81.4 --legacy-peer-deps --force
}

# Nettoyer et rebuilder Android
Write-Host "5. Reconstruction Android..." -ForegroundColor Yellow
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
