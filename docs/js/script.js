const welcomeMessage = "Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?";
const messageElement = document.getElementById('welcome-message');
const startButton = document.getElementById('start-button');
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

startButton.addEventListener('click', function() {
    if (this.textContent === 'Start Consultation') {
        this.textContent = 'Connecting...';
        this.style.backgroundColor = '#27ae60';
        setTimeout(() => {
            typeMessage("Great! Let's begin your consultation. What specific area of graduate school applications do you need help with?", messageElement);
            this.textContent = 'Send Message';
            this.style.backgroundColor = '#3498db';
            userInput.style.display = 'block';
        }, 2000);
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
        fetchResponse(message);
    }
}

function appendMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    chatBox.appendChild(p);
}

function fetchResponse(message) {
    startButton.disabled = true;
    startButton.textContent = 'Thinking...';
    
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
    })
    .then(response => response.json())
    .then(data => {
        typeMessage('AI: ' + data.response, messageElement);
        startButton.disabled = false;
        startButton.textContent = 'Send Message';
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('Error: Unable to get response');
        startButton.disabled = false;
        startButton.textContent = 'Send Message';
    });
}
