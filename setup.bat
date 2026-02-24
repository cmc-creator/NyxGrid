@echo off
REM setup.bat - Download Node, install deps, run Prisma migrate

setlocal enabledelayedexpansion

set "nodeVersion=v18.18.1"
set "nodeZipUrl=https://nodejs.org/dist/%nodeVersion%/node-%nodeVersion%-win-x64.zip"
set "nodeZip=%TEMP%\node-%nodeVersion%.zip"
set "nodeDir=%USERPROFILE%\portable-node\node-%nodeVersion%-win-x64"
set "extractDir=%USERPROFILE%\portable-node"

echo === Universal Scheduler Setup ===
echo.

if not exist "%nodeDir%" (
    echo Downloading Node %nodeVersion%...
    powershell -Command "Invoke-WebRequest -Uri '%nodeZipUrl%' -OutFile '%nodeZip%'"
    
    echo Extracting to %extractDir%...
    if exist "%extractDir%" rmdir /s /q "%extractDir%"
    powershell -Command "Expand-Archive -Path '%nodeZip%' -DestinationPath '%extractDir%'"
    echo Extracted.
) else (
    echo Node already downloaded at %nodeDir%
)

echo.
set "PATH=%nodeDir%;%PATH%"
call node --version

cd /d "\\192.168.168.182\Folder Redirection\Ccooper\Desktop\universal-scheduler"

echo.
echo Installing npm dependencies...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Running Prisma migrate...
call npx prisma migrate dev --name init

echo.
echo === Setup complete! ===
echo.
pause