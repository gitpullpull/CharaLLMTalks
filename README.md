# CharaTalkLLM
### CharaTalkLLMは、Windows上で動作する、あなたの好きなキャラクターを学習してエミュレートできる高精度な日本語TTS（テキスト・トゥ・スピーチ）システムです。


特徴
Windows 対応: このシステムはWindowsを前提に設計されており、手軽にセットアップできます。
ウェブユーザーインターフェース: 使いやすいウェブUIを通じて、トレーニングや音声合成を行えます。
高精度な日本語TTS: Style Bert Vits技術により、自然な日本語のテキスト・トゥ・スピーチを実現。
カスタマイズ可能: あなたの好きなキャラクターの声を学習し、エミュレートすることが可能です。


## セットアップ
### 1.リポジトリのクローン

```
https://github.com/gitpullpull/CharaLLMTalks
```

### 2.style bert vitsのインストール
#### style bert vitsをインストールされていない場合
install_style_bert_vits_cu118.bat  
をクリックしてください。自動でインストールされます。  
cu118以外の場合は手動でインストールしてください。  
https://github.com/litagin02/Style-Bert-VITS2

#### 既にstyle bert vitsがインストールされている場合
launch_api.batをテキストエディタで開いてbert_vits_pathにStyle_bert_vitsのパスを入力してください。

### 3.qloraのインストール
install_qlora_cu118.bat  
をクリックしてください。自動でインストールされます。

cu118以外のcudaが入っている場合は手動でインストールしてください。  
https://github.com/artidoro/qlora  

その後qlora内のvenvで
```
pip install gradio
```
を貼り付けてgradioをインストールしてください。

### 4.Elyzaやキャラクターモデルのダウンロード
bert vitsモデルのダウンロード  
style bert vitsのフォルダに入れてください。
https://huggingface.co/gitpullpull/nahida_bert_vits2_jp  

https://huggingface.co/gitpullpull/nahida_lora_jp  

## 使い方
### 1. style bert vitsのAPI起動
launch_api.bat  
をクリックしてください。  

### 2. WebUIの起動
launch.bat  
をクリックしてください。
その後表示されるURLをブラウザにコピペしてください。

## 将来的な実装について
webUI上でのbert vitsモデル切り替え  

webUI上でのファインチューニング機能  


