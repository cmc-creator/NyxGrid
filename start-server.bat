@echo off
setlocal enabledelayedexpansion

set "nodeDir=%USERPROFILE%\portable-node\node-v18.18.1-win-x64"
set "PATH=%nodeDir%;%PATH%"

cd /d "C:\universal-scheduler"

echo === Starting Universal Scheduler Server ===
echo.
echo Checking Node...
node --version
echo.

echo Starting server...
node src/index.js
pause

echo.
echo If you see an error above, press any key to close this window.
pause