# Script PowerShell pour arrêter l'application
Write-Host "🛑 Arrêt de DashCam Auto" -ForegroundColor Red
Write-Host "=======================" -ForegroundColor Red

# 1. Arrêter Metro
Write-Host "1. Arrêt de Metro..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "✅ Metro arrêté" -ForegroundColor Green

# 2. Arrêter l'application sur l'émulateur
Write-Host "2. Arrêt de l'application..." -ForegroundColor Yellow
adb shell am force-stop com.dashcamauto
Write-Host "✅ Application arrêtée" -ForegroundColor Green

# 3. Nettoyer les logs
Write-Host "3. Nettoyage des logs..." -ForegroundColor Yellow
adb logcat -c
Write-Host "✅ Logs nettoyés" -ForegroundColor Green

Write-Host ""
Write-Host "🛑 Application arrêtée avec succès !" -ForegroundColor Green
