const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    chatBox.appendChild(messageElement);
    
    if (!isUser) {
        typeMessage(message, messageElement);
    } else {
        messageElement.textContent = message;
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function typeMessage(message, element) {
    let index = 0;
    element.classList.add('typing-indicator');
    
    function type() {
        if (index < message.length) {
            element.textContent += message[index];
            index++;
            setTimeout(type, 30 + Math.random() * 50); // Randomize typing speed slightly
        } else {
            element.classList.remove('typing-indicator');
        }
    }
    
    type();
}

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            addMessage(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage('Sorry, there was an error processing your request.');
        });
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initial bot message with typing effect
addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?");
