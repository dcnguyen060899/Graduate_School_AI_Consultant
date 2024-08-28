const welcomeMessage = "Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?";
const messageElement = document.getElementById('welcome-message');
const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const chatBox = document.querySelector('.chat-box');
let charIndex = 0;

function typeMessage(message, element) {
    element.textContent = '';
    let index = 0;
    function type() {
        if (index < message.length) {
            element.textContent += message.charAt(index);
            index++;
            setTimeout(type, 50);
        } else {
            document.querySelector('.typing-cursor').style.display = 'none';
        }
    }
    type();
}

window.addEventListener('load', () => typeMessage(welcomeMessage, messageElement));

sendButton.addEventListener('click', function() {
    if (this.textContent === 'Start Consultation') {
        this.textContent = 'Send Message';
        userInput.style.display = 'block';
        typeMessage("Great! Let's begin your consultation. What specific area of graduate school applications do you need help with?", messageElement);
    } else {
        sendMessage();
    }
});

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        appendMessage('You: ' + message);
        userInput.value = '';
        // Here you would typically send the message to your backend
        // For now, we'll just simulate a response
        setTimeout(() => {
            appendMessage('AI: Thank you for your question. I'm processing your request...');
        }, 1000);
    }
}

function appendMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}
