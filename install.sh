#!/bin/bash

echo "Installing dependencies from package.json..."

# Ensure Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "Node.js is missing. Installing now..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install dependencies
echo "Running npm install..."
npm install

echo "Installation complete!"
