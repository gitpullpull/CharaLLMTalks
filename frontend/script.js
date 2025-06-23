document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const llmResponseElem = document.getElementById('llm-response');
    const audioPlayer = document.getElementById('audio-player');
    const loadingOverlay = document.getElementById('loading-overlay');
    const responseContainer = document.getElementById('response-container');

    // --- API Configuration ---
    const API_URL = 'http://127.0.0.1:8000/api/chat';

    // --- Event Listeners ---

    // Send button click
    sendButton.addEventListener('click', handleSend);

    // Enter key to send (Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            handleSend();
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = `${userInput.scrollHeight}px`;
    });


    // --- Core Functions ---

    /**
     * Handles sending the user's message to the backend.
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
            userInput.value = ''; // Clear input after sending
            userInput.style.height = 'auto'; // Reset textarea height
        }
    };

    /**
     * Toggles the loading state of the UI.
     * @param {boolean} isLoading - Whether to show or hide the loading state.
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
     * Displays the response from the AI.
     * @param {string} text - The text response from the LLM.
     * @param {string} audioBase64 - The Base64 encoded audio data.
     */
    const displayResponse = (text, audioBase64) => {
        llmResponseElem.textContent = text;
        
        const audioBlob = b64toBlob(audioBase64, 'audio/wav');
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;

        responseContainer.style.display = 'block';
    };

    /**
     * Displays an error message in the response area.
     * @param {string} errorMessage - The error message to display.
     */
    const displayError = (errorMessage) => {
        llmResponseElem.textContent = errorMessage;
        audioPlayer.src = '';
        responseContainer.style.display = 'block';
    };

    // --- Helper Functions ---

    /**
     * Converts a Base64 string to a Blob object.
     * @param {string} b64Data - The Base64 encoded data.
     * @param {string} contentType - The content type of the data.
     * @param {number} sliceSize - The size of the slices to process.
     * @returns {Blob} The resulting Blob object.
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
});