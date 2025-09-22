# Script PowerShell pour tester rapidement l'application
Write-Host "🧪 Test rapide de DashCam Auto" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# 1. Vérifier l'émulateur
Write-Host "1. Vérification de l'émulateur..." -ForegroundColor Yellow
$devices = adb devices | Select-String "device$"
if ($devices.Count -eq 0) {
    Write-Host "❌ Aucun émulateur connecté !" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Émulateur connecté" -ForegroundColor Green

# 2. Compiler et installer rapidement
Write-Host "2. Compilation rapide..." -ForegroundColor Yellow
Set-Location "android"
& ".\gradlew.bat" installGeneralDebug
Set-Location ".."
Write-Host "✅ APK installé" -ForegroundColor Green

# 3. Démarrer Metro
Write-Host "3. Démarrage de Metro..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Minimized
Write-Host "✅ Metro démarré" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Test terminé ! Ouvrez l'app 'DashCam Auto' sur votre émulateur" -ForegroundColor Green
