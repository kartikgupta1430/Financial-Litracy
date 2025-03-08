// script.js
// Replace with your actual API key
const API_KEY = "AIzaSyCrw0By_ciJMnSxbKFNDrbeRrkKwhJ9vI8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");

    // Auto-resize the textarea
    userInput.addEventListener("input", () => {
        userInput.style.height = "auto";
        userInput.style.height = userInput.scrollHeight + "px";
    });

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true); // Add user message to chat
        userInput.value = "";
        userInput.style.height = "auto";
        sendButton.disabled = true;

        const typingIndicator = showTypingIndicator();

        try {
            const response = await generateResponse(message);
            typingIndicator.remove();
            addMessage(response, false);
        } catch (error) {
            typingIndicator.remove();
            addErrorMessage(error.message);
        } finally {
            sendButton.disabled = false;
        }
    });

    // Generate response
    async function generateResponse(prompt) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Try to get more detailed error info
                let errorMessage = `Failed to generate response. Status: ${response.status}`;
                if (errorData && errorData.error && errorData.error.message) {
                    errorMessage += ` - ${errorData.error.message}`; // Include API error message if available
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
                throw new Error("Invalid response format from the API.");
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Error generating response:", error); // Log the error for debugging
            throw error; // Re-throw the error to be caught by the calling function
        }
    }


    // Add user message to chat
    function addMessage(text, isUser) {
        const message = document.createElement("div");
        message.className = `message ${isUser ? "user-message" : ""}`;
        message.innerHTML = `
      <div class="avatar ${isUser ? "user-avatar" : ""}">
      ${isUser ? "U" : "AI"}
      </div>
      <div class='message-content'>${text}</div>
      `;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show indicator
    function showTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.className = "message";
        indicator.innerHTML = `
      <div class="avatar">AI</div>
      <div class="typing-indicator">
      <div class='dot'></div>
      <div class='dot'></div>
      <div class='dot'></div>
      </div>
      `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    // Error message function
    function addErrorMessage(text) {
        const message = document.createElement("div");
        message.className = "message";
        message.innerHTML = `
          <div class="avatar">AI</div>
      <div class="message-content" style="color:red">
        Error: ${text}
      </div>
        `;
        chatMessages.appendChild(message); // Corrected: Append the error message to the chat
        chatMessages.scrollTop = chatMessages.scrollHeight; // Corrected: Scroll to the bottom
    }
});