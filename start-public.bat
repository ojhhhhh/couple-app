@echo off
chcp 65001 >nul
title 情侣空间 · 小窝 (公网模式)

cd /d "%~dp0"

echo.
echo   💑  情侣空间 · 小窝
echo   ═══════════════════════════════
echo.

REM 启动后端
start "couple-server" /min node server.js
timeout /t 2 >nul

echo   🌐 正在创建公网隧道...
echo.
npx localtunnel --port 3456 2>&1

pause
