# Script PowerShell pour tester react-native-camera avec configuration corrigée
Write-Host "🎯 Test react-native-camera - Configuration corrigée" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

# Nettoyer et rebuilder Android
Write-Host "1. Nettoyage et reconstruction Android..." -ForegroundColor Yellow
if (Test-Path "android\build") { Remove-Item -Recurse -Force "android\build" }
if (Test-Path "android\app\build") { Remove-Item -Recurse -Force "android\app\build" }

Set-Location "android"
& ".\gradlew.bat" clean
& ".\gradlew.bat" assembleDebug
Set-Location ".."

Write-Host "✅ Test react-native-camera corrigé terminé !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Redémarrez Metro : npm start" -ForegroundColor White
Write-Host "2. Lancez l'app : npm run android" -ForegroundColor White
Write-Host "3. Vérifiez les logs : adb logcat | findstr 'DashCamAuto ReactNative Camera'" -ForegroundColor White
Write-Host ""
Write-Host "Si ça fonctionne, l'application devrait se lancer sans crash !" -ForegroundColor Green
