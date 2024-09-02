document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const apiUrl = 'https://graduate-school-ai-consultant.onrender.com/chat'; // Replace with your actual backend API URL

    function formatMessage(message) {
        const lines = message.split('\n');
        let formattedHTML = '';
        let currentLevel = 0;
        let listStack = [{ level: -1, html: '' }];
    
        function formatBold(text) {
            return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
    
        function getIndentLevel(line) {
            return line.search(/\S|$/) / 2;
        }
    
        function closeList(toLevel) {
            while (listStack.length > 1 && listStack[listStack.length - 1].level >= toLevel) {
                const list = listStack.pop();
                listStack[listStack.length - 1].html += `${list.html}</li></ul>`;
            }
        }
    
        lines.forEach((line) => {
            const indentLevel = getIndentLevel(line);
            line = line.trim();
    
            if (line.startsWith('#')) {
                closeList(0);
                const level = line.split(' ')[0].length;
                formattedHTML += `<h${level}>${formatBold(line.substring(level + 1))}</h${level}>`;
                currentLevel = 0;
            } else if (line.startsWith('- ') || line.startsWith('• ')) {
                const content = formatBold(line.substring(2));
    
                if (indentLevel > currentLevel) {
                    listStack.push({ level: indentLevel, html: `<ul><li>${content}` });
                } else {
                    closeList(indentLevel);
                    listStack[listStack.length - 1].html += `<li>${content}`;
                }
    
                if (!content.endsWith(':')) {
                    listStack[listStack.length - 1].html += '</li>';
                }
    
                currentLevel = indentLevel;
            } else if (line) {
                closeList(0);
                formattedHTML += `<p>${formatBold(line)}</p>`;
                currentLevel = 0;
            }
        });
    
        closeList(0);
        formattedHTML += listStack[0].html;
    
        return formattedHTML;
    }
    
    function formatUserMessage(message) {
        return message.split('\n').map(line => `<p>${line}</p>`).join('');
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
            messageElement.innerHTML = formatUserMessage(message);
        }
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function handleUserInput() {
        const message = userInput.value.split('\n').map(line => line.trim()).join('\n').trim();
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

    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Allow newline when Shift+Enter is pressed
                return;
            } else {
                e.preventDefault(); // Prevent default Enter behavior
                handleUserInput();
            }
        }
    });
    
    // Initial welcome message with typing animation
    addMessage("Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?", false, true);
});
