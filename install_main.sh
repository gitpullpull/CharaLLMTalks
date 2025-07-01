#!/bin/bash

echo "Setting up environment for WebUI app..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Error: uv not found. Install from: https://docs.astral.sh/uv/"
    read -p "Press any key to continue..."
    exit 1
fi

# Create virtual environment
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    uv venv
fi

# Install dependencies via pip interface
echo "Installing dependencies..."
uv pip install fastapi uvicorn[standard] requests ollama python-dotenv python-multipart

echo "Environment setup complete!"
read -p "Press any key to continue..."