@echo off
echo Killing all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Cleaning Next.js cache...
rmdir /s /q .next 2>nul

echo Starting dev server...
npm run dev
