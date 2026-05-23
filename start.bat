@echo off
chcp 65001 >nul
title 情侣空间 · 小窝 后端服务器

cd /d "%~dp0"

echo.
echo   💑  情侣空间 · 小窝 后端启动中...
echo   ═══════════════════════════════
echo.

REM 获取本机IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  for /f "tokens=*" %%b in ("%%a") do set IP=%%b
  goto :found
)
:found

echo   🔗 本机访问:
echo      http://localhost:3456/情侣空间.html
echo.
echo   📱 对方访问 (同WiFi下):
echo      http://%IP%:3456/情侣空间.html
echo.
echo   ═══════════════════════════════
echo   ⚠  两人需要在同一WiFi下才能互通
echo   ═══════════════════════════════
echo.

node server.js
pause
