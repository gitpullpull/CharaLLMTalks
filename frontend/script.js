document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const llmResponseElem = document.getElementById('llm-response');
    const audioPlayer = document.getElementById('audio-player');
    const loadingOverlay = document.getElementById('loading-overlay');
    const responseContainer = document.getElementById('response-container');

    // --- API設定 ---
    const API_URL = 'http://127.0.0.1:8000/api/chat';

    // --- コア機能の関数定義 ---

    /**
     * ユーザーのメッセージをバックエンドに送信し、応答を処理します。
     */
    const handleSend = async () => {
        const message = userInput.value.trim();
        if (!message) return;

        setLoadingState(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ user_input: message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `サーバーエラー: ${response.status}`);
            }

            const data = await response.json();
            displayResponse(data.llm_response, data.audio_base64);

        } catch (error) {
            console.error('Error:', error);
            displayError(`エラーが発生しました: ${error.message}`);
        } finally {
            setLoadingState(false);
            userInput.value = ''; // 送信後にテキストエリアをクリア
            userInput.style.height = 'auto'; // テキストエリアの高さをリセット
        }
    };

    /**
     * UIのローディング状態を切り替えます。
     * @param {boolean} isLoading - ローディング状態にするかどうか。
     */
    const setLoadingState = (isLoading) => {
        loadingOverlay.style.display = isLoading ? 'flex' : 'none';
        sendButton.disabled = isLoading;
        userInput.disabled = isLoading;
        if (!isLoading) {
            userInput.focus();
        }
    };

    /**
     * AIからの応答を画面に表示します。
     * @param {string} text - LLMからのテキスト応答。
     * @param {string} audioBase64 - Base64エンコードされた音声データ。
     */
    const displayResponse = (text, audioBase64) => {
        llmResponseElem.textContent = text;

        const audioBlob = b64toBlob(audioBase64, 'audio/wav');
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;

        responseContainer.style.display = 'block';
    };

    /**
     * エラーメッセージを応答エリアに表示します。
     * @param {string} errorMessage - 表示するエラーメッセージ。
     */
    const displayError = (errorMessage) => {
        llmResponseElem.textContent = errorMessage;
        audioPlayer.src = '';
        responseContainer.style.display = 'block';
    };

    // --- ヘルパー関数 ---

    /**
     * Base64文字列をBlobオブジェクトに変換します。
     * @param {string} b64Data - Base64エンコードされたデータ。
     * @param {string} contentType - データのコンテントタイプ。
     * @param {number} sliceSize - 処理するスライスのサイズ。
     * @returns {Blob} 変換後のBlobオブジェクト。
     */
    function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    // --- イベントリスナーの設定 --- (全ての関数定義の後)

    // 送信ボタンのクリックイベント
    sendButton.addEventListener('click', handleSend);

    // Enterキーで送信 (Shift+Enterで改行)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // デフォルトの改行動作をキャンセル
            handleSend();
        }
    });

    // テキストエリアの自動リサイズ
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = `${userInput.scrollHeight}px`;
    });
});