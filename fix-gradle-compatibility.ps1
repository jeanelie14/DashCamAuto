# Script PowerShell pour corriger la compatibilité Gradle
Write-Host "🔧 Correction compatibilité Gradle pour React Native 0.81.4" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green

# 1. Mettre à jour gradle-wrapper.properties
Write-Host "1. Downgrade Gradle vers 7.6.3..." -ForegroundColor Yellow
$gradleWrapperContent = @"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.3-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
"@
Set-Content -Path "android\gradle\wrapper\gradle-wrapper.properties" -Value $gradleWrapperContent

# 2. Mettre à jour build.gradle avec Android Gradle Plugin 7.4.2
Write-Host "2. Downgrade Android Gradle Plugin vers 7.4.2..." -ForegroundColor Yellow
$buildGradleContent = @"
buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 24
        compileSdkVersion = 33
        targetSdkVersion = 33
        ndkVersion = "23.1.7779620"
        kotlinVersion = "1.7.22"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:7.4.2")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
    }
}

apply plugin: "com.facebook.react.rootproject"
"@
Set-Content -Path "android\build.gradle" -Value $buildGradleContent

# 3. Nettoyer et rebuilder
Write-Host "3. Nettoyage et reconstruction..." -ForegroundColor Yellow
if (Test-Path "android\build") { Remove-Item -Recurse -Force "android\build" }
if (Test-Path "android\app\build") { Remove-Item -Recurse -Force "android\app\build" }

Set-Location "android"
& ".\gradlew.bat" clean
& ".\gradlew.bat" assembleDebug
Set-Location ".."

Write-Host "✅ Correction Gradle terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Redémarrez Metro : npm start" -ForegroundColor White
Write-Host "2. Lancez l'app : npm run android" -ForegroundColor White
Write-Host "3. Vérifiez les logs : adb logcat | findstr 'DashCamAuto ReactNative VisionCamera'" -ForegroundColor White
