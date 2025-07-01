import requests
import ollama
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import os

# --- 設定項目 ---
# Ollamaに登録したモデル名
OLLAMA_MODEL_NAME = "qwen3-14b-nahida2:q4km"
# style-bert-vits2のAPIのURL
VOICE_API_URL = "http://127.0.0.1:5000/voice"
# ----------------

# FastAPIアプリケーションの初期化
app = FastAPI(
    title="AI Chatbot API",
    description="An API that uses Ollama for LLM inference and a separate service for voice synthesis.",
    version="1.0.0",
)

# CORSミドルウェアの設定（Vercelなど外部からのアクセスを許可するため）
# 本番環境では、セキュリティのため "*" の代わりに実際のフロントエンドのURLを指定してください。
# 例: "https://your-frontend-domain.vercel.app"
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://127.0.0.1:5500",  # VSCode Live Server
    "null",                   # ローカルファイル(file://)からのアクセス
    "*",                      # 将来的なホスティングのために一旦すべて許可
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# リクエストとレスポンスのデータモデル定義
class ChatRequest(BaseModel):
    user_input: str

class ChatResponse(BaseModel):
    llm_response: str
    audio_base64: str

@app.post("/api/chat", response_model=ChatResponse, summary="Process a chat message")
async def chat_endpoint(request: ChatRequest):
    """
    ユーザーからのチャット入力受け取り、LLMからのテキスト応答と合成音声を生成します。

    - **user_input**: ユーザーが入力したテキスト。
    - **returns**: LLMの応答テキストと、Base64エンコードされたWAV形式の音声データ。
    """
    print("--- [1] Received request for /api/chat ---") # 追加
    print(f"User input: {request.user_input}") # 追加
    # 1. LLMからのテキスト応答を生成 (Ollama)
    try:
        # Modelfileでテンプレートが定義されているため、ユーザーの入力をそのまま渡す
        print("--- [2] Calling Ollama... ---") # 追加
        ollama_response = ollama.generate(
            model=OLLAMA_MODEL_NAME,
            prompt=request.user_input,
            stream=False,
        )
        print("--- [3] Ollama response received ---") # 追加
        response_text = ollama_response['response'].strip()
        print(f"Ollama response: {response_text}") # 追加

    except Exception as e:
        print(f"Error during Ollama inference: {e}")
        raise HTTPException(status_code=500, detail=f"Ollamaでの推論中にエラーが発生しました: {e}")

    # 2. 音声合成APIへのリクエスト
    try:
        # style-bert-vits2 APIのパラメータ
        params = {
            "text": response_text,
            "model_id": 4,
            "speaker_id": 0,
            "sdp_ratio": 0.2,
            "noise": 0.6,
            "noisew": 0.8,
            "length": 1.0,
            "language": "JP",
            "auto_split": True,
            "split_interval": 0.5,
            "assist_text": "",
            "assist_text_weight": 1.0,
            "style": "Neutral",
            "style_weight": 5.0,
            "reference_audio_path": ""
        }
        voice_response = requests.get(VOICE_API_URL, params=params, timeout=60) # タイムアウトを設定
        voice_response.raise_for_status()

        # 音声データをBase64形式にエンコード
        audio_base64 = base64.b64encode(voice_response.content).decode('utf-8')

    except requests.exceptions.RequestException as e:
        print(f"Error during voice synthesis: {e}")
        raise HTTPException(status_code=500, detail=f"音声合成APIへの接続中にエラーが発生しました: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during voice synthesis: {e}")
        raise HTTPException(status_code=500, detail=f"音声合成中に予期せぬエラーが発生しました: {e}")


    # 3. テキストと音声データをフロントエンドに返す
    return ChatResponse(
        llm_response=response_text,
        audio_base64=audio_base64
    )

# frontendフォルダ内の静的ファイル（HTML, CSS, JS）を配信する設定
# main.pyの場所を基準にfrontendディレクトリのパスを解決します
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="static")