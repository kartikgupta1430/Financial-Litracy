
const API_KEY = "AIzaSyA0EEZUINxwt_vBvONFG8jGRKo0MBOGlAA";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");

    // Auto-resize textarea
    userInput.addEventListener("input", () => {
        userInput.style.height = "auto";
        userInput.style.height = userInput.scrollHeight + "px";
    });

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true); 
        userInput.value = "";
        userInput.style.height = "auto";
        sendButton.disabled = true;

        const typingIndicator = showTypingIndicator();

        try {
            const response = await generateResponse(message);
            typingIndicator.remove();
            addMessage(response, false);
        } catch (error) {
            if (typingIndicator) typingIndicator.remove();
            addErrorMessage(error.message);
        } finally {
            sendButton.disabled = false;
        }
    });

    async function generateResponse(prompt) {
        // We use a POST request, but the Key stays in the URL above
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // This will now catch 403, 400, or 500 errors specifically
            throw new Error(data.error?.message || `Status: ${response.status}`);
        }

        return data.candidates[0].content.parts[0].text;
    }

    function addMessage(text, isUser) {
        const message = document.createElement("div");
        message.className = `message ${isUser ? "user-message" : "ai-message"}`;
        
        // Simple Markdown-style bolding for better readability
        const formattedText = isUser ? text : text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

        message.innerHTML = `
            <div class="avatar">${isUser ? "U" : "AI"}</div>
            <div class='message-content'>${formattedText}</div>
        `;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.className = "message ai-message";
        indicator.innerHTML = `
            <div class="avatar">AI</div>
            <div class="typing-indicator"><span>.</span><span>.</span><span>.</span></div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    function addErrorMessage(text) {
        const message = document.createElement("div");
        message.className = "message";
        message.innerHTML = `
            <div class="avatar" style="background: #ff4d4d">!</div>
            <div class="message-content" style="color: #ff4d4d; font-weight: bold;">
                System Error: ${text}
            </div>
        `;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight; 
    }
});