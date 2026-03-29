@echo off
:: FlexSeller Quick Icon Fix (Faster Version)
echo ==========================================
echo   FlexSeller Quick Icon Fix
echo ==========================================
echo.

echo [Step 1] Stopping Explorer...
taskkill /f /im explorer.exe

echo [Step 2] Clearing icon cache...
del /f /q "%localappdata%\IconCache.db" 2>nul
del /f /q "%localappdata%\Microsoft\Windows\Explorer\iconcache_*.db" 2>nul

echo [Step 3] Starting Explorer...
start explorer.exe

echo.
echo ==========================================
echo   Done! Restart FlexSeller and re-pin it.
echo ==========================================
pause
