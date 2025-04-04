// models/client.js

const db = require('../config/db'); // Arquivo de configuração de banco de dados

const Client = {
  // Método para adicionar um novo cliente
  addClient: async (nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email) => {
    const query = `
      INSERT INTO clientes (nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    try {
      const [result] = await db.query(query, [nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  // Método para buscar todos os clientes
  getAllClients: async () => {
    const query = 'SELECT * FROM clientes';
    try {
      const [result] = await db.query(query);
      return result;
    } catch (err) {
      throw err;
    }
  },

  // Função para pesquisar clientes com base no termo
  searchClient: async (termo) => {
    const query = `SELECT * FROM clientes WHERE nome_completo LIKE ? LIMIT 50`; // Limita para melhorar desempenho

    try {
      const [result] = await db.query(query, [`%${termo}%`]); // Remove espaços extras
      return result;
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      throw err;
    }
  }
};

module.exports = Client;
