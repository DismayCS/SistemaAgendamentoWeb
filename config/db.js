const mysql = require('mysql2/promise'); // Importando a versão com promises do mysql2

// Criando a conexão com promessas
const db = mysql.createPool({
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports = db;  // Exportando a pool de conexões para ser utilizada nas rotas
