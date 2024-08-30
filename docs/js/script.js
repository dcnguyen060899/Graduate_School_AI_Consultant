const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function formatAIMessage(message) {
    // Split the message into lines
    const lines = message.split('\n');
    let formattedMessage = '';
    let inList = false;

    lines.forEach((line, index) => {
        line = line.trim();
        if (line.startsWith('- ') || line.match(/^\d+\./)) {
            if (!inList) {
                formattedMessage += '<ul>';
                inList = true;
            }
            formattedMessage += `<li>${line.replace(/^-\s|^\d+\.\s/, '')}</li>`;
        } else {
            if (inList) {
                formattedMessage += '</ul>';
                inList = false;
            }
            if (line) {
                formattedMessage += `<p>${line}</p>`;
            }
        }
    });

    if (inList) {
        formattedMessage += '</ul>';
    }

    return formattedMessage;
}

function addMessage(message, isUser = false, isWelcome = false) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    chatBox.appendChild(messageElement);
    
    if (!isUser) {
        const typingCursor = document.createElement('span');
        typingCursor.className = 'typing-cursor';
        messageElement.appendChild(typingCursor);

        const formattedMessage = formatAIMessage(message);
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < formattedMessage.length) {
                if (formattedMessage.substr(i, 4) === '<ul>') {
                    messageElement.innerHTML += '<ul>';
                    i += 4;
                } else if (formattedMessage.substr(i, 5) === '</ul>') {
                    messageElement.innerHTML += '</ul>';
                    i += 5;
                } else if (formattedMessage.substr(i, 4) === '<li>') {
                    messageElement.innerHTML += '<li>';
                    i += 4;
                } else if (formattedMessage.substr(i, 5) === '</li>') {
                    messageElement.innerHTML += '</li>';
                    i += 5;
                } else if (formattedMessage.substr(i, 3) === '<p>') {
                    messageElement.innerHTML += '<p>';
                    i += 3;
                } else if (formattedMessage.substr(i, 4) === '</p>') {
                    messageElement.innerHTML += '</p>';
                    i += 4;
                } else {
                    messageElement.lastElementChild.innerHTML += formattedMessage[i];
                    i++;
                }
            } else {
                clearInterval(typingInterval);
                messageElement.removeChild(typingCursor);
            }
            chatBox.scrollTop = chatBox.scrollHeight;
        }, isWelcome ? 50 : 10);
    } else {
        messageElement.textContent = message;
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
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
        addMessage(data.response, false, false); // false for isUser, false for isWelcome
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
addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?", false, true);
