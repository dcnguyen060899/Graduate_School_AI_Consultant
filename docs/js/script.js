const chatBox = document.getElementById('chat-box');
        const welcomeMessage = document.getElementById('welcome-message');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const typingCursor = document.querySelector('.typing-cursor');

        const initialMessage = "Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?";

        function typeMessage(message, element) {
            let charIndex = 0;
            element.textContent = '';
            typingCursor.style.display = 'inline-block';

            function type() {
                if (charIndex < message.length) {
                    element.textContent += message.charAt(charIndex);
                    charIndex++;
                    setTimeout(type, 50);
                } else {
                    typingCursor.style.display = 'none';
                }
            }

            type();
        }

        function addMessage(message, isUser = false) {
            const messageElement = document.createElement('p');
            messageElement.textContent = isUser ? `You: ${message}` : `AI: ${message}`;
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function handleUserInput() {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                // Simulate AI response (replace with actual AI logic in a real application)
                setTimeout(() => {
                    const aiResponse = "Thank you for your input. I'm here to help with your graduate school application questions.";
                    addMessage(aiResponse);
                }, 1000);
            }
        }

        window.addEventListener('load', () => typeMessage(initialMessage, welcomeMessage));
        sendButton.addEventListener('click', handleUserInput);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserInput();
        });
