@echo off
REM カレントディレクトリを取得
SET "CURRENT_DIR=%~dp0"

REM カレントディレクトリに移動
cd /d "%CURRENT_DIR%"

CALL venv\Scripts\activate.bat

REM スクリプトを実行する
start venv\Scripts\python.exe app.py

REM 仮想環境をデアクティブにする（オプション）
rem remCALL venv\Scripts\deactivate.bat