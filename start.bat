@echo off
title Tool_CV - Smart CV Builder
echo ===================================================
echo       🚀 កំពុងដំណើរការកម្មវិធី TOOL_CV ...
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/2] កំពុងបើក Backend Server (MySQL & AI API)...
start "Tool_CV Backend Server" cmd /k "node server/src/server.js"

echo [2/2] កំពុងបើក Frontend Web App (Vite)...
start "Tool_CV Frontend Web" cmd /k "npm run dev"

echo.
echo ===================================================
echo  ✅ ជោគជ័យ! សូមបើក Browser ទៅកាន់:
echo  👉 http://localhost:3000 ឬ http://localhost:5173
echo ===================================================
timeout /t 3 >nul
start http://localhost:3000
