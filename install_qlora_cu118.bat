git clone https://github.com/artidoro/qlora
cd qlora

python -m venv venv
call venv\Scripts\activate

pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt
pip install gradio

rem ELYZA-japanese-Llama-2-13b-instructのダウンロード
cd ..
cd models
git clone https://huggingface.co/elyza/ELYZA-japanese-Llama-2-13b-instruct