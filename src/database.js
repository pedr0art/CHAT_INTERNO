const sqlite3 = require('sqlite3').verbose();

// Conectar ao banco de dados (ou criar se não existir)
const db = new sqlite3.Database('chat.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Criar a tabela de mensagens se não existir
        db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT NOT NULL,
                text TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela:', err.message);
            } else {
                console.log('Tabela de mensagens pronta.');
            }
        });
    }
});

module.exports = db;