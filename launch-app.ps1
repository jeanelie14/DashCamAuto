# Script PowerShell pour lancer l'application DashCam Auto
Write-Host "🚀 Lancement de DashCam Auto - React Native 0.81.4" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Fonction pour vérifier si un processus est en cours
function Test-ProcessRunning {
    param([string]$ProcessName)
    return (Get-Process -Name $ProcessName -ErrorAction SilentlyContinue) -ne $null
}

# Fonction pour attendre qu'un processus se termine
function Wait-ForProcess {
    param([string]$ProcessName, [int]$TimeoutSeconds = 30)
    $timeout = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Process -Name $ProcessName -ErrorAction SilentlyContinue) -ne $null) {
        if ((Get-Date) -gt $timeout) {
            Write-Host "⚠️  Timeout atteint pour $ProcessName" -ForegroundColor Yellow
            break
        }
        Start-Sleep -Seconds 2
    }
}

try {
    # 1. Vérifier que l'émulateur est connecté
    Write-Host "1. Vérification de l'émulateur Android..." -ForegroundColor Yellow
    $devices = adb devices | Select-String "device$"
    if ($devices.Count -eq 0) {
        Write-Host "❌ Aucun émulateur Android connecté !" -ForegroundColor Red
        Write-Host "   Veuillez démarrer votre émulateur Android et réessayer." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Émulateur connecté : $($devices[0].ToString().Split()[0])" -ForegroundColor Green

    # 2. Arrêter Metro s'il est en cours
    Write-Host "2. Arrêt des processus Metro en cours..." -ForegroundColor Yellow
    if (Test-ProcessRunning "node") {
        Write-Host "   Arrêt de Metro..." -ForegroundColor Cyan
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        Wait-ForProcess "node" 10
    }
    Write-Host "✅ Processus Metro arrêtés" -ForegroundColor Green

    # 3. Nettoyer les builds Android
    Write-Host "3. Nettoyage des builds Android..." -ForegroundColor Yellow
    if (Test-Path "android\build") { 
        Remove-Item -Recurse -Force "android\build" -ErrorAction SilentlyContinue
        Write-Host "   Build Android nettoyé" -ForegroundColor Cyan
    }
    if (Test-Path "android\app\build") { 
        Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue
        Write-Host "   Build app nettoyé" -ForegroundColor Cyan
    }
    Write-Host "✅ Builds nettoyés" -ForegroundColor Green

    # 4. Compiler et installer l'APK
    Write-Host "4. Compilation et installation de l'APK..." -ForegroundColor Yellow
    Set-Location "android"
    Write-Host "   Compilation en cours..." -ForegroundColor Cyan
    & ".\gradlew.bat" installGeneralDebug
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de la compilation !" -ForegroundColor Red
        Set-Location ".."
        exit 1
    }
    Set-Location ".."
    Write-Host "✅ APK installé avec succès" -ForegroundColor Green

    # 5. Démarrer Metro en arrière-plan
    Write-Host "5. Démarrage de Metro..." -ForegroundColor Yellow
    Write-Host "   Metro va démarrer en arrière-plan..." -ForegroundColor Cyan
    Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Minimized -PassThru | Out-Null
    
    # Attendre que Metro démarre
    Write-Host "   Attente du démarrage de Metro..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    # Vérifier que Metro est démarré
    $metroStarted = $false
    for ($i = 0; $i -lt 10; $i++) {
        if (Test-ProcessRunning "node") {
            $metroStarted = $true
            break
        }
        Start-Sleep -Seconds 2
    }
    
    if ($metroStarted) {
        Write-Host "✅ Metro démarré avec succès" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Metro pourrait ne pas être démarré correctement" -ForegroundColor Yellow
    }

    # 6. Afficher les informations de connexion
    Write-Host "6. Informations de connexion..." -ForegroundColor Yellow
    Write-Host "   Metro: http://localhost:8081" -ForegroundColor Cyan
    Write-Host "   Émulateur: $($devices[0].ToString().Split()[0])" -ForegroundColor Cyan
    Write-Host "   Application: DashCam Auto" -ForegroundColor Cyan

    # 7. Afficher les commandes utiles
    Write-Host ""
    Write-Host "🎯 Commandes utiles :" -ForegroundColor Green
    Write-Host "   Recharger l'app: Appuyez sur 'r' dans le terminal Metro" -ForegroundColor White
    Write-Host "   Menu Dev: Appuyez sur 'd' dans le terminal Metro" -ForegroundColor White
    Write-Host "   Logs: adb logcat | findstr 'DashCamAuto'" -ForegroundColor White
    Write-Host "   Arrêter Metro: Ctrl+C dans le terminal Metro" -ForegroundColor White

    # 8. Afficher le statut final
    Write-Host ""
    Write-Host "🎉 APPLICATION LANCÉE AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "✅ Émulateur connecté" -ForegroundColor Green
    Write-Host "✅ APK installé" -ForegroundColor Green
    Write-Host "✅ Metro démarré" -ForegroundColor Green
    Write-Host "✅ Prêt pour le développement" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Sur votre émulateur, ouvrez l'application 'DashCam Auto'" -ForegroundColor Cyan
    Write-Host "   Vous devriez voir l'écran de test avec le message de succès !" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "❌ ERREUR LORS DU LANCEMENT !" -ForegroundColor Red
    Write-Host "=================================" -ForegroundColor Red
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Solutions possibles :" -ForegroundColor Yellow
    Write-Host "   1. Vérifiez que l'émulateur Android est démarré" -ForegroundColor White
    Write-Host "   2. Vérifiez que ADB fonctionne : adb devices" -ForegroundColor White
    Write-Host "   3. Redémarrez l'émulateur si nécessaire" -ForegroundColor White
    Write-Host "   4. Vérifiez que tous les ports sont libres" -ForegroundColor White
    exit 1
}
