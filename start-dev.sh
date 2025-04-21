#!/bin/bash

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Check if the data directory exists
if [ ! -d "data" ]; then
  echo "Creating data directory..."
  mkdir -p data
fi

# Initialize the database if dev.db doesn't exist
if [ ! -f "data/dev.db" ]; then
  echo "Initializing development database..."
  npm run init:db
fi

# Start the development server
echo "Starting development server..."
npm run dev 