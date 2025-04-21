@echo off
echo 3D-LLM Development Environment Startup

REM Check if node_modules exists, if not install dependencies
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

REM Check if the data directory exists
if not exist data (
  echo Creating data directory...
  mkdir data
)

REM Initialize the database if dev.db doesn't exist
if not exist data\dev.db (
  echo Initializing development database...
  call npm run init:db
)

REM Start the development server
echo Starting development server...
call npm run dev 