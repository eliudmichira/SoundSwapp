$ErrorActionPreference = 'Stop'

$sdk = 'C:/Users/User/.bubblewrap/android_sdk'
$btDir = Get-ChildItem "$sdk/build-tools" -Directory | Sort-Object Name -Descending | Select-Object -First 1
if (-not $btDir) { Write-Host "No build-tools found at $sdk/build-tools"; exit 1 }
$bt = $btDir.FullName

$zipalign = Join-Path $bt 'zipalign.exe'
$apksigner = Join-Path $bt 'apksigner.bat'
$adb = 'C:/Users/User/.bubblewrap/android_sdk/platform-tools/adb.exe'

$unsigned = 'app/build/outputs/apk/release/app-release-unsigned.apk'
$aligned = 'app-release-unsigned-aligned.apk'
$signed1 = 'app-release-signed-new.apk'
$signed2 = 'app-release-signed.apk'

# Align unsigned APK if present
if (Test-Path $unsigned) {
  & $zipalign -f -v -p 4 $unsigned $aligned
} else {
  Write-Host "Missing $unsigned"
}

# Verify signed APK(s)
if (Test-Path $signed1) {
  & $apksigner verify --print-certs $signed1 | Tee-Object -FilePath 'apk_verify_new.txt'
} else {
  Write-Host "Missing $signed1"
}

if (Test-Path $signed2) {
  & $apksigner verify --print-certs $signed2 | Tee-Object -FilePath 'apk_verify_old.txt'
}

# List devices
if (Test-Path $adb) {
  & $adb devices | Tee-Object -FilePath 'adb_devices.txt'
} else {
  Write-Host "adb not found at $adb"
} 