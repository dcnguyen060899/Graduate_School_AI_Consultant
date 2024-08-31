const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const apiUrl = 'https://graduate-school-ai-consultant.onrender.com/chat'; // Replace with your actual backend API URL

// Function to add messages to the chat
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


// Function to fetch AI response from the backend
async function fetchAIResponse(message) {
    try {
        const response = await fetch(apiUrl, {
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

// Event listeners for sending messages
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

function formatAIResponse(message) {
    const formattedElements = [];
    
    // Split the message into paragraphs
    const paragraphs = message.split('\n\n');
    
    paragraphs.forEach((paragraph, index) => {
        if (paragraph.includes(':')) {
            // Handle key-value pairs or lists
            const [key, value] = paragraph.split(':');
            const keyElement = document.createElement('strong');
            keyElement.textContent = key + ':';
            formattedElements.push(keyElement);
            formattedElements.push(document.createElement('br'));
            
            // Check if the value contains list items
            if (value.includes('-')) {
                const ulElement = document.createElement('ul');
                value.split('-').filter(item => item.trim()).forEach(item => {
                    const liElement = document.createElement('li');
                    liElement.textContent = item.trim();
                    ulElement.appendChild(liElement);
                });
                formattedElements.push(ulElement);
            } else {
                formattedElements.push(document.createTextNode(value.trim()));
            }
        } else {
            // Regular paragraph
            const pElement = document.createElement('p');
            pElement.textContent = paragraph;
            formattedElements.push(pElement);
        }
        
        // Add spacing between paragraphs
        if (index < paragraphs.length - 1) {
            formattedElements.push(document.createElement('br'));
        }
    });
    
    return formattedElements;
}

// Initial welcome message with typing animation
addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?", false, true);
