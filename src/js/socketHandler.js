// socketHandler.js
import { domElements, addMessage, addNotification, clearMessages } from './domHandler.js';

const socket = io('http://localhost:3000');

// Eventos recebidos do servidor
socket.on('chat message', (data) => {
    addMessage(data, domElements.usernameInput.value);
});

socket.on('user joined', (message) => {
    addNotification(message);
});

socket.on('user left', (message) => {
    addNotification(message);
});

socket.on('load messages', (messages) => {
    messages.forEach((msg) => {
        addMessage({ user: msg.user, text: msg.text }, domElements.usernameInput.value);
    });
});

socket.on('history cleared', () => {
    clearMessages();
    alert('Histórico de mensagens apagado com sucesso!');
});

socket.on('clear history error', (errorMessage) => {
    alert(errorMessage);
});

// Funções para enviar eventos ao servidor
// socketHandler.js
export function login(credentials, callback) {
    socket.emit('login', credentials, (success) => {
        if (success) {
            callback(true); // Login bem-sucedido
        } else {
            callback(false); // Login falhou
        }
    });
}

export function signup(credentials, callback) {
    socket.emit('signup', credentials, callback);
}

export function sendMessage(message, username) {
    socket.emit('chat message', { text: message, user: username });
}

export function clearHistory() {
    socket.emit('clear history');
}