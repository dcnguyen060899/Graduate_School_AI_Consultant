const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    chatBox.appendChild(messageElement);
    
    if (!isUser) {
        // Typing animation for AI messages
        const typingCursor = document.createElement('span');
        typingCursor.className = 'typing-cursor';
        messageElement.appendChild(typingCursor);

        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < message.length) {
                messageElement.insertBefore(document.createTextNode(message[i]), typingCursor);
                i++;
            } else {
                clearInterval(typingInterval);
                messageElement.removeChild(typingCursor);
            }
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 50);
    } else {
        messageElement.textContent = message;
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleUserInput() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        fetchAIResponse(message);
    }
}

async function fetchAIResponse(message) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });
        const data = await response.json();
        addMessage(data.response);
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.');
    }
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

// Initial welcome message with typing animation
addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?");
