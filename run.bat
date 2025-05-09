@echo off
echo ===================================
echo    Portfolio Project Starter
echo ===================================
echo.

REM Check if we're in the correct directory
if not exist "project" (
    echo Error: Please run this script from the root directory of the project.
    echo Current directory: %CD%
    echo.
    echo Please make sure you see a 'project' folder in this directory.
    pause
    exit /b 1
)

REM Change to project directory
cd project

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo.
echo Starting development server...
echo Once started, open http://localhost:5173 in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause 