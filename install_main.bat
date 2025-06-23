@echo off
setlocal enabledelayedexpansion

echo ===================================
echo FastAPI Project Setup with uv
echo ===================================

REM プロジェクト名を引数から取得、なければデフォルト値を使用
set PROJECT_NAME=%1
if "%PROJECT_NAME%"=="" set PROJECT_NAME=fastapi-project

echo Creating project: %PROJECT_NAME%
echo.

REM uvがインストールされているかチェック
uv --version >nul 2>&1
if errorlevel 1 (
    echo Error: uv is not installed or not in PATH
    echo Please install uv first: https://docs.astral.sh/uv/getting-started/installation/
    pause
    exit /b 1
)

REM プロジェクトディレクトリが既に存在するかチェック
if exist "%PROJECT_NAME%" (
    echo Directory %PROJECT_NAME% already exists
    set /p CONTINUE="Continue anyway? (y/N): "
    if /i not "!CONTINUE!"=="y" (
        echo Setup cancelled
        pause
        exit /b 1
    )
    cd "%PROJECT_NAME%"
) else (
    REM 新しいプロジェクトを作成
    echo Initializing new project...
    uv init "%PROJECT_NAME%"
    if errorlevel 1 (
        echo Error: Failed to initialize project
        pause
        exit /b 1
    )
    cd "%PROJECT_NAME%"
)

REM 既存ディレクトリの場合はuv initを実行
if not exist "pyproject.toml" (
    echo Initializing project in existing directory...
    uv init
)

echo Syncing virtual environment...
uv sync
if errorlevel 1 (
    echo Error: Failed to sync virtual environment
    pause
    exit /b 1
)

echo Installing FastAPI dependencies...
uv add fastapi uvicorn[standard] requests ollama python-dotenv python-multipart
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ===================================
echo Setup completed successfully!
echo ===================================
echo Project name: %PROJECT_NAME%
echo Virtual environment: .venv
echo.
echo To activate the environment:
echo   uv shell
echo.
echo To run Python scripts:
echo   uv run python your_script.py
echo.
echo To start FastAPI development server:
echo   uv run uvicorn main:app --reload
echo ===================================

pause