const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function addMessage(message, isUser = false, isWelcome = false) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    chatBox.appendChild(messageElement);
    
    if (!isUser) {
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
        }, isWelcome ? 50 : 10); // Slower for welcome message, faster for chatbot responses
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

async function sendMessageToBot(userMessage) {
    const response = await fetch('https://graduate-school-ai-consultant.onrender.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    return data.response;
}

document.querySelector('#chat-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const userMessage = document.querySelector('#user-input').value;
    const botResponse = await sendMessageToBot(userMessage);
    document.querySelector('#chat-output').textContent = botResponse;
});

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

// Initial welcome message with typing animation
addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?", false, true);
