// chat.js
import { domElements, showScreen } from './domHandler.js';
import { login, signup, sendMessage, clearHistory } from './socketHandler.js';

// Evento de login
domElements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o envio do formulário
    handleLogin();
});

// Evento de cadastro
domElements.signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o envio do formulário
    handleSignup();
});

// Evento para ir para a tela de cadastro
domElements.goToSignupButton.addEventListener('click', () => {
    showScreen('signup');
});

// Evento para voltar para a tela de login
domElements.goToLoginButton.addEventListener('click', () => {
    showScreen('login');
});

// chat.js
function handleLogin() {
    const username = domElements.usernameInput.value;
    const password = domElements.passwordInput.value;

    console.log('Tentando fazer login com:', username, password); // Log de depuração

    if (username && password) {
        login({ username, password }, (success) => {
            console.log('Resposta do servidor:', success); // Log de depuração
            if (success) {
                showScreen('chat');
                setTimeout(() => {
                    console.log('Focando no campo de mensagem após login.'); // Log de depuração
                    domElements.messageInput.focus();
                }, 0);
            } else {
                alert('Nome de usuário ou senha incorretos.');
                setTimeout(() => {
                    console.log('Focando no campo de usuário após erro de login.'); // Log de depuração
                    domElements.usernameInput.focus();
                }, 0);
            }
        });
    }
}

// chat.js
function handleSendMessage() {
    const message = domElements.messageInput.value;
    if (message) {
        console.log('Enviando mensagem:', message); // Log de depuração
        sendMessage(message, domElements.usernameInput.value);
        domElements.messageInput.value = '';
        setTimeout(() => {
            console.log('Estado do campo de mensagem:', {
                disabled: domElements.messageInput.disabled,
                readOnly: domElements.messageInput.readOnly,
                value: domElements.messageInput.value
            });
            domElements.messageInput.focus();
        }, 0);
    }
}
function handleSignup() {
    const username = domElements.signupUsernameInput.value;
    const password = domElements.signupPasswordInput.value;
    const sector = domElements.signupSectorInput.value;

    if (username && password && sector) {
        signup({ username, password, sector }, (success) => {
            if (success) {
                alert('Conta criada com sucesso! Faça login.');
                showScreen('login');
                domElements.usernameInput.focus(); // Focar no campo de usuário após cadastro
            } else {
                alert('Erro ao criar conta. Tente novamente.');
                domElements.signupUsernameInput.focus(); // Focar no campo de usuário após erro
            }
        });
    }
}

// Evento de enviar mensagem
domElements.sendButton.addEventListener('click', () => {
    handleSendMessage();    
});

// chat.js
// chat.js
domElements.messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
        // e.preventDefault(); // Remova esta linha se existir
    }
});

