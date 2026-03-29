@echo off
:: FlexSeller Icon Cache Fix Script for Windows
:: Run this as Administrator if the taskbar icon shows as Electron instead of FlexSeller

echo ==========================================
echo   FlexSeller Icon Cache Fix Tool
echo ==========================================
echo.
echo This will clear Windows icon cache and restart Explorer.
echo Your taskbar icons will refresh.
echo.
pause

echo.
echo [Step 1] Stopping Explorer process...
taskkill /f /im explorer.exe

echo [Step 2] Clearing icon cache database...
:: Delete icon cache files
del /f /q "%localappdata%\IconCache.db" 2>nul
del /f /q "%localappdata%\Microsoft\Windows\Explorer\iconcache*" 2>nul
del /f /q "%localappdata%\Microsoft\Windows\Explorer\thumbcache*" 2>nul

echo [Step 3] Clearing taskbar pinned data for Electron apps...
:: Remove any cached pinned app data that might reference old Electron icons
for /f "tokens=*" %%a in ('dir /b /s "%appdata%\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar" ^| findstr /i "flexseller"') do (
    echo   - Refreshing pinned shortcut: %%a
)

echo [Step 4] Rebuilding icon cache...
:: Force Windows to rebuild icon cache
ie4uinit.exe -show 2>nul
ie4uinit.exe -ClearIconCache 2>nul

echo [Step 5] Starting Explorer...
start explorer.exe

echo.
echo ==========================================
echo   Icon cache cleared successfully!
echo ==========================================
echo.
echo IMPORTANT: If the icon still shows incorrectly:
echo 1. Unpin FlexSeller from taskbar
echo 2. Close FlexSeller
echo 3. Restart FlexSeller
echo 4. Pin it to taskbar again
echo.
echo Press any key to exit...
pause > nul
