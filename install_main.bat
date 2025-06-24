@echo off

echo Setting up environment for WebUI app...

REM Check if uv is installed
uv --version >nul 2>&1
if errorlevel 1 (
    echo Error: uv not found. Install from: https://docs.astral.sh/uv/
    pause
    exit /b 1
)

REM Initialize project if pyproject.toml doesn't exist
if not exist "pyproject.toml" (
    echo Initializing project...
    uv init --no-workspace
)

REM Create virtual environment
if not exist ".venv" (
    echo Creating virtual environment...
    uv venv
)

REM Install dependencies using uv add
echo Installing dependencies...
uv add fastapi uvicorn[standard] requests ollama python-dotenv python-multipart

echo.
echo Environment setup complete!
echo.
echo To run the backend:
echo   uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause