git clone https://github.com/litagin02/Style-Bert-VITS2.git

cd Style-Bert-VITS2

python -m venv venv
call venv\Scripts\activate

rem PyTorch 2.2.x系は今のところは学習エラーが出るので前のバージョンを使う
pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt

python initialize.py
rem 必要なモデルとデフォルトTTSモデルをダウンロード