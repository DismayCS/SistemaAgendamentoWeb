const express = require('express');
const router = express.Router();
const db = require('../config/db');
const agendamentoController = require('../controllers/agendamentoController');
const agendamento = require('../models/agendamento')

router.get('/principal', async (req, res) => {
    try {
        // Buscando os dados corretamente
        const agendamentos = await agendamento.listar();  // CHAMANDO O MODEL DIRETAMENTE
        const [clientes] = await db.query('SELECT * FROM clientes');
        const [servicos] = await db.query('SELECT * FROM servicos');

        // Renderiza a página com os dados
        res.render('principal', { agendamentos, clientes, servicos });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        if (!res.headersSent) {
            res.status(500).send(`Erro ao buscar dados: ${error.message}`);
        }
    }
});

// Rota para criar agendamento
router.post('/criar', agendamentoController.criarAgendamento);

// Rota para listar todos os agendamentos
router.get('/todos', agendamentoController.listarAgendamentos);

// Rota para editar agendamento
router.put('/editar/:id', agendamentoController.editarAgendamento);

// Rota para excluir agendamentos
router.delete('/excluir/:id', agendamentoController.excluirAgendamento);

module.exports = router;
