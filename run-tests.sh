#!/bin/bash
set -e

echo "Running test suite..."
echo "===================="

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run tests
echo "Running unit tests..."
npm test

echo "===================="
echo "Test suite completed!"