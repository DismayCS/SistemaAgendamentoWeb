const express = require('express');
const router = express.Router();
const db = require('../config/db');
const clientController = require('../controllers/clientController');

router.get('/clientes', async (req, res) => {
    try {
        const [clientes] = await db.query('SELECT * FROM clientes');
        res.render('clientes', { clientes });
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).send(`Erro ao buscar clientes: ${error.message}`);
    }
});

// Rota para adicionar um novo cliente
router.post('/criar', clientController.addClient);

// Rota para atualizar um cliente existente
router.put('/atualizar/:id', clientController.updateClient);

// Rota para excluir um cliente
router.delete('/excluir/:id', clientController.deleteClient);

// Rota para listar todos os clientes
router.get('/', clientController.getAllClients);

// Rota para pesquisar os clientes
router.get('/pesquisar', clientController.searchClient);

module.exports = router;
