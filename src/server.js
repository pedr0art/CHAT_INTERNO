// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./database'); // Importar o banco de dados

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {};

// Quando um usuário se conecta
io.on('connection', (socket) => {
    console.log('a user connected');

    // Enviar mensagens antigas para o usuário
    db.all('SELECT user, text, timestamp FROM messages ORDER BY timestamp', (err, rows) => {
        if (err) {
            console.error('Erro ao buscar mensagens:', err.message);
        } else {
            socket.emit('load messages', rows);
        }
    });

    // Quando um usuário faz login
    socket.on('login', (credentials, callback) => {
        const { username, password } = credentials;
    
        console.log('Recebido pedido de login para:', username); // Log de depuração
    
        db.get(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (err, row) => {
                if (err) {
                    console.error('Erro ao buscar usuário:', err.message);
                    callback(false);
                } else if (row) {
                    console.log('Usuário encontrado:', row); // Log de depuração
                    if (row.password === password) {
                        users[socket.id] = username;
                        io.emit('user joined', `${username} entrou no chat.`);
                        callback(true);
                    } else {
                        console.log('Senha incorreta para:', username); // Log de depuração
                        callback(false);
                    }
                } else {
                    console.log('Usuário não encontrado:', username); // Log de depuração
                    callback(false);
                }
            }
        );
    });
    // Quando um usuário faz cadastro
    socket.on('signup', (credentials, callback) => {
        const { username, password, sector } = credentials;

        // Verificar se o usuário já existe
        db.get(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (err, row) => {
                if (err) {
                    console.error('Erro ao buscar usuário:', err.message);
                    callback(false);
                } else if (row) {
                    callback(false); // Usuário já existe
                } else {
                    // Criar novo usuário
                    db.run(
                        'INSERT INTO users (username, password, sector) VALUES (?, ?, ?)',
                        [username, password, sector],
                        (err) => {
                            if (err) {
                                console.error('Erro ao criar usuário:', err.message);
                                callback(false);
                            } else {
                                callback(true);
                            }
                        }
                    );
                }
            }
        );
    });

    // Quando uma mensagem é enviada
    socket.on('chat message', (data) => {
        const username = users[socket.id];
        if (username) {
            // Salvar a mensagem no banco de dados
            db.run(
                'INSERT INTO messages (user, text) VALUES (?, ?)',
                [username, data.text],
                (err) => {
                    if (err) {
                        console.error('Erro ao salvar mensagem:', err.message);
                    } else {
                        // Enviar a mensagem para todos os usuários
                        io.emit('chat message', { user: username, text: data.text });
                    }
                }
            );
        }
    });

    // Quando um usuário desconecta
    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            io.emit('user left', `${username} saiu do chat.`);
            delete users[socket.id];
        }
    });

});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});