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
    socket.on('login', (username) => {
        users[socket.id] = username;
        io.emit('user joined', `${username} entrou no chat.`);
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

        // Apagar o histórico de mensagens
        socket.on('clear history', () => {
            db.run('DELETE FROM messages', (err) => {
                if (err) {
                    console.error('Erro ao apagar o histórico:', err.message);
                    socket.emit('clear history error', 'Erro ao apagar o histórico.');
                } else {
                    console.log('Histórico de mensagens apagado.');
                    io.emit('history cleared'); // Notificar todos os clientes
                }
            });
        });
    });

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});