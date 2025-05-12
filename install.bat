@echo off
echo Installing dependencies from package.json...

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is missing. Please install it manually from https://nodejs.org/
    exit /b 1
)

:: Install dependencies
echo Running npm install...
npm install

echo Installation complete!
