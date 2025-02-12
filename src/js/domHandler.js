// domHandler.js
export const domElements = {
    loginDiv: document.getElementById('login'),
    signupDiv: document.getElementById('signup'),
    chatDiv: document.getElementById('chat'),
    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    signupUsernameInput: document.getElementById('signupUsernameInput'),
    signupPasswordInput: document.getElementById('signupPasswordInput'),
    signupSectorInput: document.getElementById('signupSectorInput'),
    goToSignupButton: document.getElementById('goToSignupButton'),
    goToLoginButton: document.getElementById('goToLoginButton'),
    messagesDiv: document.getElementById('messages'),
    messageInput: document.getElementById('messageInput'),
    sendButton: document.getElementById('sendButton'),
    // Remova a referência ao botão de apagar histórico
};
// Função para adicionar uma mensagem ao chat
export function addMessage(data, currentUsername) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.user}: ${data.text}`;

    if (data.user === currentUsername) {
        messageElement.classList.add('message', 'user'); // Remetente (direita)
    } else {
        messageElement.classList.add('message', 'other'); // Destinatário (esquerda)
    }

    domElements.messagesDiv.appendChild(messageElement);
    domElements.messagesDiv.scrollTop = domElements.messagesDiv.scrollHeight; // Rolagem automática
}

// domHandler.js
export function addNotification(message) {
    const notificationElement = document.createElement('div');
    notificationElement.textContent = message;
    notificationElement.classList.add('notification');
    domElements.messagesDiv.appendChild(notificationElement);
    domElements.messagesDiv.scrollTop = domElements.messagesDiv.scrollHeight; // Rolagem automática

    // Devolver o foco ao campo de mensagem
    setTimeout(() => {
        domElements.messageInput.focus();
    }, 0); // Usar setTimeout para garantir que o foco seja aplicado após a atualização do DOM
}

// Função para limpar o histórico de mensagens
export function clearMessages() {
    domElements.messagesDiv.innerHTML = '';
}

// Função para alternar entre telas
export function showScreen(screen) {
    domElements.loginDiv.style.display = screen === 'login' ? 'block' : 'none';
    domElements.signupDiv.style.display = screen === 'signup' ? 'block' : 'none';
    domElements.chatDiv.style.display = screen === 'chat' ? 'block' : 'none';
}