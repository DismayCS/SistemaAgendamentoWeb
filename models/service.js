const db = require('../config/db'); // Arquivo de configuração de banco de dados

const Service = {
  // Método para adicionar um novo serviço
  addService: (nome, duracao, observacao) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO servicos (nome, duracao, observacao, created_at)
        VALUES (?, ?, ?, NOW())
      `;
      console.log('Executando query:', query, [nome, duracao, observacao]); // Log para verificar
      db.query(query, [nome, duracao, observacao], (err, result) => {
        if (err) {
          console.error('Erro ao executar query:', err);  // Log do erro
          return reject(err);  // Retorna o erro para o controller
        }
        resolve(result);  // Retorna o resultado caso a query tenha sido bem-sucedida
      });
    });
  },

  // Método para buscar todos os serviços
  getAllServices: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM servicos';
      db.query(query, (err, result) => {
        if (err) {
          console.error('Erro ao buscar serviços:', err);  // Log do erro
          return reject(err);  // Retorna o erro para o controller
        }
        resolve(result);  // Retorna os resultados da consulta
      });
    });
  }
};

module.exports = Service;
