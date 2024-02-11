@echo off
REM style_bert_vitのパスを記述してください。(これは一例です。)
SET bert_vits_path="D:\CharaLLMTalks\Style-Bert-VITS2"

REM venvのある場所に移動
cd /d %bert_vits_path%

CALL venv\Scripts\activate.bat

REM スクリプトを実行する
start venv\Scripts\python.exe server_fastapi.py