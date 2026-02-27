$NODE = "$env:USERPROFILE\portable-node\node-v20.11.0-win-x64\node.exe"
$DEV  = "C:\noxshift-dev"

Write-Host ""
Write-Host "  Starting NyxGrid..." -ForegroundColor Cyan
Write-Host ""

# Kill any leftover node processes on these ports
$ports = @(3001, 5173)
foreach ($port in $ports) {
    $pid_ = (netstat -ano | Select-String ":$port " | Where-Object { $_ -match "LISTENING" } | ForEach-Object { ($_ -split "\s+")[-1] } | Select-Object -First 1)
    if ($pid_) {
        try { Stop-Process -Id $pid_ -Force -ErrorAction Stop; Write-Host "  Cleared port $port" -ForegroundColor Yellow } catch {}
    }
}

Start-Sleep -Seconds 1

# Start API server
$api = Start-Process -FilePath $NODE -ArgumentList "server/index.js" -WorkingDirectory $DEV -PassThru -WindowStyle Hidden
Write-Host "  API server starting (PID $($api.Id))..." -ForegroundColor Green

Start-Sleep -Seconds 2

# Start Vite
$vite = Start-Process -FilePath $NODE -ArgumentList ".\node_modules\vite\bin\vite.js","--port","5173" -WorkingDirectory $DEV -PassThru -WindowStyle Hidden
Write-Host "  Vite dev server starting (PID $($vite.Id))..." -ForegroundColor Green

Start-Sleep -Seconds 3

# Verify both are up
$apiOk   = (netstat -ano | Select-String ":3001.*LISTENING").Count -gt 0
$viteOk  = (netstat -ano | Select-String ":5173.*LISTENING").Count -gt 0

Write-Host ""
if ($apiOk)  { Write-Host "  ✅  API   → http://localhost:3001/api/health" -ForegroundColor Green }
else         { Write-Host "  ❌  API failed to start" -ForegroundColor Red }

if ($viteOk) { Write-Host "  ✅  App   → http://localhost:5173" -ForegroundColor Green }
else         { Write-Host "  ❌  Vite failed to start" -ForegroundColor Red }

Write-Host ""
Write-Host "  Both processes are running in the background." -ForegroundColor DarkGray
Write-Host "  To stop everything: Get-Process node | Stop-Process" -ForegroundColor DarkGray
Write-Host ""
