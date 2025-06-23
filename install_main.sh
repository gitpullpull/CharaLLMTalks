#!/bin/bash

# 色の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================${NC}"
echo -e "${BLUE}FastAPI Project Setup with uv${NC}"
echo -e "${BLUE}===================================${NC}"

# プロジェクト名を引数から取得、なければデフォルト値を使用
PROJECT_NAME=${1:-fastapi-project}

echo -e "Creating project: ${YELLOW}$PROJECT_NAME${NC}"
echo

# uvがインストールされているかチェック
if ! command -v uv &> /dev/null; then
    echo -e "${RED}Error: uv is not installed or not in PATH${NC}"
    echo "Please install uv first: https://docs.astral.sh/uv/getting-started/installation/"
    exit 1
fi

# プロジェクトディレクトリが既に存在するかチェック
if [ -d "$PROJECT_NAME" ]; then
    echo -e "${YELLOW}Directory $PROJECT_NAME already exists${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled"
        exit 1
    fi
    cd "$PROJECT_NAME" || exit 1
else
    # 新しいプロジェクトを作成
    echo "Initializing new project..."
    if ! uv init "$PROJECT_NAME"; then
        echo -e "${RED}Error: Failed to initialize project${NC}"
        exit 1
    fi
    cd "$PROJECT_NAME" || exit 1
fi

# 既存ディレクトリの場合はuv initを実行
if [ ! -f "pyproject.toml" ]; then
    echo "Initializing project in existing directory..."
    uv init
fi

echo "Syncing virtual environment..."
if ! uv sync; then
    echo -e "${RED}Error: Failed to sync virtual environment${NC}"
    exit 1
fi

echo "Installing FastAPI dependencies..."
if ! uv add fastapi uvicorn[standard] requests ollama python-dotenv python-multipart; then
    echo -e "${RED}Error: Failed to install dependencies${NC}"
    exit 1
fi

echo
echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}===================================${NC}"
echo -e "Project name: ${YELLOW}$PROJECT_NAME${NC}"
echo -e "Virtual environment: ${YELLOW}.venv${NC}"
echo
echo -e "${BLUE}To activate the environment:${NC}"
echo "  uv shell"
echo
echo -e "${BLUE}To run Python scripts:${NC}"
echo "  uv run python your_script.py"
echo
echo -e "${BLUE}To start FastAPI development server:${NC}"
echo "  uv run uvicorn main:app --reload"
echo -e "${GREEN}===================================${NC}"