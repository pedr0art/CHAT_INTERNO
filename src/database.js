// database.js
const sqlite3 = require('sqlite3').verbose();

// Conectar ao banco de dados (ou criar se não existir)
const db = new sqlite3.Database('chat.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');

        // Habilitar o modo WAL
        db.run('PRAGMA journal_mode=WAL;', (err) => {
            if (err) {
                console.error('Erro ao habilitar o modo WAL:', err.message);
            } else {
                console.log('Modo WAL habilitado.');
            }
        });

        // Criar a tabela de mensagens se não existir
        db.run(
            `CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT NOT NULL,
                text TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            (err) => {
                if (err) {
                    console.error('Erro ao criar tabela de mensagens:', err.message);
                } else {
                    console.log('Tabela de mensagens pronta.');
                }
            }
        );

        // Criar a tabela de usuários se não existir
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                sector TEXT NOT NULL
            )`,
            (err) => {
                if (err) {
                    console.error('Erro ao criar tabela de usuários:', err.message);
                } else {
                    console.log('Tabela de usuários pronta.');
                }
            }
        );
    }
});

module.exports = db;