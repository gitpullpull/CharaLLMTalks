import gradio as gr
import torch
import requests
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

# ベースモデルのロード
model_id = r"E:\free_soft\LLM\ELYZA-japanese-Llama-2-13b-instruct"
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

tokenizer = AutoTokenizer.from_pretrained(model_id)
base_model = AutoModelForCausalLM.from_pretrained(model_id, quantization_config=bnb_config, device_map={"":0})

# LoRAの適用
peft_name = r"D:\program\CharaLLMTalks\qlora\output\checkpoint-1000"
model = PeftModel.from_pretrained(
    base_model,
    peft_name,
    device_map={"":0}
)
model.eval()

# 推論用関数
def generate_text_and_synthesize_voice(user_input, chat_log=None):
    # LLMからのテキスト応答を生成
    prompt = f"#Q: {user_input} #A:"
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=256)
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    response_text = response_text.replace(prompt, "").strip()  # プロンプトの削除

    # 音声合成APIへのリクエスト
    api_url = "http://127.0.0.1:5000/voice"
    params = {
        "text": response_text,
        "model_id": 4,  # model_nahida3のモデルID
        "speaker_id": 0,  # model_nahida3のspeaker_id
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
    response = requests.get(api_url, params=params)

    # 応答の処理
    if response.status_code == 200:
        # 音声ファイルを一時ファイルとして保存
        with open("temp_output.wav", "wb") as f:
            f.write(response.content)

        # 音声ファイルのパスを返す
        return response_text, "temp_output.wav"
    else:
        return response_text, None

# Gradioインターフェースの設定
demo = gr.Interface(
    generate_text_and_synthesize_voice,
    inputs=["text"],
    outputs=["text", "audio"],
    title="Japanese chatbot with voice synthesis",
    description="Ask any question in Japanese and listen to the response.",
    examples=["あなたについて教えて。"]
)

# Gradioインターフェースの起動
demo.launch(debug=True, share=False, max_threads=5)
