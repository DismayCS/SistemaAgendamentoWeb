const express = require('express');
const router = express.Router();
const db = require('../config/db');
const serviceController = require('../controllers/serviceController');

router.get('/servicos', async (req, res) => {
    try {
        const [servicos] = await db.query('SELECT * FROM servicos');
        res.render('servicos', { servicos });
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).send(`Erro ao buscar serviços: ${error.message}`);
    }
});


// Rota para adicionar um novo serviço
router.post('/criar', serviceController.addService);

// Rota para atualizar um serviço existente
router.put('/atualizar/:id', serviceController.updateService);

// Rota para excluir um serviço
router.delete('/excluir/:id', serviceController.deleteService);

// Rota para listar todos os serviços
router.get('/', serviceController.getAllServices);

module.exports = router;
