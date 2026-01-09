@echo off
echo ========================================
echo   BlockHost - Cloudflare Upload Script
echo ========================================
echo.

echo [1/4] Installiere Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo FEHLER: npm install fehlgeschlagen!
    pause
    exit /b 1
)
echo.

echo [2/4] Baue Projekt...
call npm run build
if %errorlevel% neq 0 (
    echo FEHLER: Build fehlgeschlagen!
    pause
    exit /b 1
)
echo.

echo [3/4] Kopiere wichtige Dateien...
if exist "public\_headers" (
    copy /Y "public\_headers" "dist\_headers"
    echo _headers kopiert
)
if exist "public\_redirects" (
    copy /Y "public\_redirects" "dist\_redirects"
    echo _redirects kopiert
)
echo.

echo [4/4] Uploade zu Cloudflare...
echo.
echo WICHTIG: Waehle eine Option:
echo   1) Mit Wrangler (automatisch)
echo   2) Manuell (oeffnet dist/ Ordner)
echo.
set /p choice="Deine Wahl (1 oder 2): "

if "%choice%"=="1" (
    echo.
    echo Pruefe ob Wrangler installiert ist...
    where wrangler >nul 2>&1
    if %errorlevel% neq 0 (
        echo Wrangler nicht gefunden! Installiere...
        call npm install -g wrangler
    )
    echo.
    echo Melde dich bei Cloudflare an...
    call wrangler login
    echo.
    echo Uploade Projekt...
    call wrangler pages deploy dist --project-name=blockhosts
) else (
    echo.
    echo Oeffne dist/ Ordner...
    start dist
    echo.
    echo Gehe zu: https://dash.cloudflare.com
    echo 1. Workers ^& Pages ^> Create application ^> Pages ^> Upload assets
    echo 2. Ziehe den kompletten dist/ Ordner rein
    echo 3. Project name: blockhosts
    echo 4. Deploy site klicken
)

echo.
echo ========================================
echo   Upload abgeschlossen!
echo ========================================
echo.
pause