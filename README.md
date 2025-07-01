作成して一年以上経過し、何かと古くなってきたため、作り直しました。
コードはやモデルは整理したのち、再アップロードする予定です。

# 技術スタック

### UI

gradio→FastAPI & uvicorn

### チャットボット部分

llama2 baseの日本語モデルをqloraでファインチューニング → Qwen3 8B をunslothを利用しトレーニング
transformersで推論(huggingface形式)→ollamaでの推論(GGUF)

Fast APIサーバーを利用した style bert vits での日本語TTS

# インストール方法
ollamaをインストールした後、

install_mainを実行

その後style_bert_vits2をインストールするかインストーラーをクリックしてください。

