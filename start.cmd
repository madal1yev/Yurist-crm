@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist node_modules (
  echo [1/2] Paketlar o'rnatilmoqda (bir marta)...
  call npm install
)

echo [2/2] LawCRM ishga tushmoqda: http://localhost:5173/
start "" "http://localhost:5173/"
call npm run dev
