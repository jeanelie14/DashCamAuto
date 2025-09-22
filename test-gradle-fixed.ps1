# Script PowerShell pour tester la configuration Gradle corrigée
Write-Host "🧪 Test configuration Gradle corrigée" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Nettoyer complètement
Write-Host "1. Nettoyage complet..." -ForegroundColor Yellow
if (Test-Path "android\build") { Remove-Item -Recurse -Force "android\build" }
if (Test-Path "android\app\build") { Remove-Item -Recurse -Force "android\app\build" }

# Tester la compilation
Write-Host "2. Test compilation avec Gradle 7.5.1 + AGP 7.3.1..." -ForegroundColor Yellow
Set-Location "android"
& ".\gradlew.bat" clean
& ".\gradlew.bat" assembleDebug
Set-Location ".."

Write-Host "✅ Test configuration Gradle terminé !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Redémarrez Metro : npm start" -ForegroundColor White
Write-Host "2. Lancez l'app : npm run android" -ForegroundColor White
Write-Host "3. Vérifiez les logs : adb logcat | findstr 'DashCamAuto ReactNative VisionCamera'" -ForegroundColor White
