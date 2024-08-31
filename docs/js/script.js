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
        const formattedMessage = formatAIMessage(message);
        const typingCursor = document.createElement('span');
        typingCursor.className = 'typing-cursor';
        messageElement.appendChild(typingCursor);

        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < formattedMessage.length) {
                if (formattedMessage[i] === '<') {
                    // Find the closing '>' and insert the whole tag at once
                    const closingIndex = formattedMessage.indexOf('>', i);
                    if (closingIndex !== -1) {
                        messageElement.insertAdjacentHTML('beforeend', formattedMessage.substring(i, closingIndex + 1));
                        i = closingIndex + 1;
                    }
                } else {
                    messageElement.insertAdjacentHTML('beforeend', formattedMessage[i]);
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

function formatAIMessage(message) {
    // Split into paragraphs
    let paragraphs = message.split('\n\n');
    
    // Process each paragraph
    paragraphs = paragraphs.map(para => {
        // Convert numbered lists to bullet points
        para = para.replace(/^\d+\.\s/gm, '• ');
        
        // Highlight key phrases
        para = para.replace(/(Application Deadline|GRE|TOEFL|Statement of Purpose|Letters of Recommendation|Transcripts|Resume)/g, '<strong>$1</strong>');
        
        // Convert lines starting with dash or asterisk to bullet points
        para = para.replace(/^[-*]\s/gm, '• ');
        
        return `<p>${para}</p>`;
    });
    
    return paragraphs.join('');
}

// Initial welcome message with typing animation
addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?", false, true);
