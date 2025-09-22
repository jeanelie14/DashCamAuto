# Script PowerShell pour corriger le crash au lancement de DashCam Auto
Write-Host "🔧 Correction du crash au lancement de DashCam Auto" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Nettoyer le cache Metro
Write-Host "1. Nettoyage du cache Metro..." -ForegroundColor Yellow
Start-Process -FilePath "npx" -ArgumentList "react-native", "start", "--reset-cache" -WindowStyle Hidden
Start-Sleep -Seconds 3
Get-Process | Where-Object {$_.ProcessName -like "*node*" -and $_.CommandLine -like "*react-native start*"} | Stop-Process -Force

# Nettoyer les caches npm
Write-Host "2. Nettoyage des caches npm..." -ForegroundColor Yellow
npm cache clean --force

# Supprimer node_modules et package-lock.json
Write-Host "3. Suppression des dépendances existantes..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

# Nettoyer le build Android
Write-Host "4. Nettoyage du build Android..." -ForegroundColor Yellow
Set-Location "android"
& ".\gradlew.bat" clean
Set-Location ".."

# Nettoyer le build iOS
Write-Host "5. Nettoyage du build iOS..." -ForegroundColor Yellow
Set-Location "ios"
if (Test-Path "build") { Remove-Item -Recurse -Force "build" }
if (Test-Path "Pods") { Remove-Item -Recurse -Force "Pods" }
if (Test-Path "Podfile.lock") { Remove-Item -Force "Podfile.lock" }
Set-Location ".."

# Réinstaller les dépendances
Write-Host "6. Réinstallation des dépendances..." -ForegroundColor Yellow
npm install

# Installer les pods iOS (si sur macOS)
if ($IsMacOS -or $env:OS -eq "Darwin") {
    Write-Host "7. Installation des pods iOS..." -ForegroundColor Yellow
    Set-Location "ios"
    pod install
    Set-Location ".."
}

# Nettoyer et rebuilder Android
Write-Host "8. Reconstruction Android..." -ForegroundColor Yellow
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
