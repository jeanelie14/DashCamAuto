# Script PowerShell pour corriger les erreurs JavaScript
Write-Host "🔧 Correction des erreurs JavaScript" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# 1. Arrêter tous les processus
Write-Host "1. Arrêt des processus..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Nettoyer tous les caches
Write-Host "2. Nettoyage des caches..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
if (Test-Path "android\build") { Remove-Item -Recurse -Force "android\build" }
if (Test-Path "android\app\build") { Remove-Item -Recurse -Force "android\app\build" }

# 3. Nettoyer le cache Metro
Write-Host "3. Nettoyage du cache Metro..." -ForegroundColor Yellow
npx react-native start --reset-cache --port 8081 &
Start-Sleep -Seconds 3
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 4. Réinstaller les dépendances
Write-Host "4. Réinstallation des dépendances..." -ForegroundColor Yellow
npm install --legacy-peer-deps --force

# 5. Compiler et installer
Write-Host "5. Compilation et installation..." -ForegroundColor Yellow
Set-Location "android"
& ".\gradlew.bat" installGeneralDebug
Set-Location ".."

# 6. Démarrer Metro proprement
Write-Host "6. Démarrage de Metro..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Correction terminée !" -ForegroundColor Green
Write-Host "Ouvrez l'application sur votre émulateur" -ForegroundColor Cyan
Write-Host "Si l'erreur persiste, appuyez sur 'r' dans le terminal Metro" -ForegroundColor Yellow
