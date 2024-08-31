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

        const structuredMessage = parseAIMessage(message);
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < structuredMessage.length) {
                if (structuredMessage[i] === '<') {
                    // Find the closing '>' and insert the whole tag at once
                    const tagEnd = structuredMessage.indexOf('>', i);
                    if (tagEnd !== -1) {
                        messageElement.insertAdjacentHTML('beforeend', structuredMessage.substring(i, tagEnd + 1));
                        i = tagEnd + 1;
                    }
                } else {
                    messageElement.insertAdjacentText('beforeend', structuredMessage[i]);
                    i++;
                }
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

function parseAIMessage(message) {
    // Split the message into paragraphs
    const paragraphs = message.split('\n').filter(p => p.trim() !== '');
    
    let structuredHTML = '';
    let inList = false;

    paragraphs.forEach(paragraph => {
        if (paragraph.startsWith('1.') || paragraph.startsWith('•')) {
            if (!inList) {
                structuredHTML += '<ul>';
                inList = true;
            }
            structuredHTML += `<li>${paragraph.substring(paragraph.indexOf(' ') + 1)}</li>`;
        } else {
            if (inList) {
                structuredHTML += '</ul>';
                inList = false;
            }
            if (paragraph.toLowerCase().includes('contact')) {
                structuredHTML += `<p class="contact-info">${paragraph}</p>`;
            } else {
                structuredHTML += `<p>${paragraph}</p>`;
            }
        }
    });

    if (inList) {
        structuredHTML += '</ul>';
    }

    // Add some basic formatting
    structuredHTML = structuredHTML.replace(/(\w+:)/g, '<strong>$1</strong>');

    return structuredHTML;
}

// Initial welcome message with typing animation
addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?", false, true);
