# Script PowerShell pour tester VisionCamera 2.14.0
Write-Host "🎯 Test VisionCamera 2.14.0 - Version stable" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

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
Write-Host "3. Installation VisionCamera 2.14.0..." -ForegroundColor Yellow
npm install --legacy-peer-deps --force

# Nettoyer et rebuilder Android
Write-Host "4. Reconstruction Android avec VisionCamera 2.14.0..." -ForegroundColor Yellow
Set-Location "android"
& ".\gradlew.bat" clean
& ".\gradlew.bat" assembleDebug
Set-Location ".."

Write-Host "✅ Test VisionCamera 2.14.0 terminé !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Redémarrez Metro : npm start" -ForegroundColor White
Write-Host "2. Lancez l'app : npm run android" -ForegroundColor White
Write-Host "3. Vérifiez les logs : adb logcat | findstr 'DashCamAuto ReactNative VisionCamera'" -ForegroundColor White
Write-Host ""
Write-Host "Si ça fonctionne, l'application devrait se lancer sans crash !" -ForegroundColor Green
