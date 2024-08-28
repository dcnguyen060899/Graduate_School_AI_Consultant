const welcomeMessage = "Welcome! I'm your AI consultant for graduate school applications. How can I assist you today?";
const messageElement = document.getElementById('welcome-message');
const startButton = document.getElementById('start-button');
let charIndex = 0;

function typeMessage() {
    if (charIndex < welcomeMessage.length) {
        messageElement.textContent += welcomeMessage.charAt(charIndex);
        charIndex++;
        setTimeout(typeMessage, 50);
    } else {
        document.querySelector('.typing-cursor').style.display = 'none';
    }
}

window.addEventListener('load', typeMessage);

startButton.addEventListener('click', function() {
    this.textContent = 'Connecting...';
    this.style.backgroundColor = '#27ae60';
    setTimeout(() => {
        messageElement.textContent = "Great! Let's begin your consultation. What specific area of graduate school applications do you need help with?";
        this.textContent = 'Send Message';
        this.style.backgroundColor = '#3498db';
    }, 2000);
});
