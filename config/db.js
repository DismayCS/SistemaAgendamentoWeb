const mysql = require('mysql2/promise'); // Importando a versão com promises do mysql2

// Criando a conexão com promessas
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '280705',
    database: 'salon_db'
});

module.exports = db;  // Exportando a pool de conexões para ser utilizada nas rotas
