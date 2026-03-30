#!/bin/bash

# Citizen Connect - Start Both Servers
# Usage: bash start-servers.sh

echo ""
echo "================================"
echo "  Citizen Connect - Startup"
echo "================================"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is running
echo "Checking MongoDB connection..."
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017', {serverSelectionTimeoutMS: 5000}).then(() => { console.log('✓ MongoDB connected'); process.exit(0); }).catch(() => { console.log('⚠ MongoDB not running'); process.exit(1); });" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ MongoDB is running"
else
    echo ""
    echo "⚠ WARNING: MongoDB is not running!"
    echo "Please start MongoDB before continuing (run: mongod)"
    echo ""
fi

echo ""
echo "================================"
echo "  Starting Backend Server"
echo "================================"
cd backend
npm start &
BACKEND_PID=$!

sleep 3

echo ""
echo "================================"
echo "  Starting Frontend Server"
echo "================================"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

sleep 2

echo ""
echo "================================"
echo "  ✓ Both servers starting..."
echo "================================"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
