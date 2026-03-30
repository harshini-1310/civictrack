@echo off
REM Citizen Connect - Start Both Servers
REM This script starts both backend and frontend servers

echo.
echo ================================
echo   Citizen Connect - Startup
echo ================================
echo.

REM Check if Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo Checking MongoDB connection...
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017', {serverSelectionTimeoutMS: 5000}).then(() => { console.log('✓ MongoDB connected'); process.exit(0); }).catch(() => { console.log('⚠ MongoDB not running - please start it'); process.exit(1); });" 2>nul
if %errorlevel% equ 0 (
    echo ✓ MongoDB is running
) else (
    echo.
    echo ⚠ WARNING: MongoDB is not running!
    echo Please start MongoDB before continuing (run: mongod)
    echo.
)

echo.
echo ================================
echo   Starting Backend Server
echo ================================
cd backend
start "Citizen Connect - Backend" cmd /k "npm start"
timeout /t 3

echo.
echo ================================
echo   Starting Frontend Server
echo ================================
cd ..\frontend
start "Citizen Connect - Frontend" cmd /k "npm run dev"
timeout /t 2

echo.
echo ================================
echo   ✓ Both servers starting...
echo ================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Close this window when done
echo.

pause
