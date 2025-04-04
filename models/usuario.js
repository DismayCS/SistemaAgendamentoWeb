const db = require('../config/db');

const Usuario = {
    criar: (nome, email, senha, callback) => {
        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        db.query(query, [nome, email, senha], callback);
    },
    
    verificarEmail: (email, callback) => {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        db.query(query, [email], callback);
    },
    
    autenticar: (email, senha, callback) => {
        const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
        db.query(query, [email, senha], callback);
    }
};

module.exports = Usuario;
