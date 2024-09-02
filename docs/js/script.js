document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const apiUrl = 'https://graduate-school-ai-consultant.onrender.com/chat'; // Replace with your actual backend API URL

    function formatMessage(message) {
        const lines = message.split('\n');
        let formattedHTML = '';
        let inList = false;
        let inSubList = false;
    
        function formatBold(text) {
            return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
    
        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('- ')) {
                if (!inList) {
                    formattedHTML += '<ul>';
                    inList = true;
                }
                
                if (line.includes('Admission Requirements:')) {
                    inSubList = true;
                    formattedHTML += `<li>${formatBold(line.substring(2))}<ul>`;
                } else if (inSubList) {
                    formattedHTML += `<li>${formatBold(line.substring(2))}</li>`;
                } else {
                    formattedHTML += `<li>${formatBold(line.substring(2))}</li>`;
                }
            } else {
                if (inSubList) {
                    formattedHTML += '</ul></li>';
                    inSubList = false;
                }
                if (inList) {
                    formattedHTML += '</ul>';
                    inList = false;
                }
                if (line) {
                    formattedHTML += `<p>${formatBold(line)}</p>`;
                }
            }
        });
    
        if (inSubList) {
            formattedHTML += '</ul></li>';
        }
        if (inList) {
            formattedHTML += '</ul>';
        }
    
        return formattedHTML;
    }
    
    function addMessage(message, isUser = false, isWelcome = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        chatBox.appendChild(messageElement);
        
        if (!isUser) {
            let formattedMessage = '';
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < message.length) {
                    formattedMessage += message[i];
                    messageElement.innerHTML = formatMessage(formattedMessage);
                    const typingCursor = document.createElement('span');
                    typingCursor.className = 'typing-cursor';
                    messageElement.appendChild(typingCursor);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    messageElement.innerHTML = formatMessage(formattedMessage);
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

    sendButton.addEventListener('click', handleUserInput);

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Insert a newline character at the current cursor position
                const start = userInput.selectionStart;
                const end = userInput.selectionEnd;
                userInput.value = userInput.value.substring(0, start) + "\n" + userInput.value.substring(end);
                userInput.selectionStart = userInput.selectionEnd = start + 1;
                e.preventDefault(); // Prevent the default Enter behavior
            } else {
                // Submit the form (execute the handleUserInput function)
                handleUserInput();
                e.preventDefault(); // Prevent the default Enter behavior
            }
        }
    });
    
    // Initial welcome message with typing animation
    addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?", false, true);
});
