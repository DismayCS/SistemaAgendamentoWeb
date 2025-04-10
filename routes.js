const express = require('express');
const router = express.Router();
const db = require('./config/db');
const agendamentoController = require('./src/controllers/agendamentoController');
const serviceController = require('./src/controllers/serviceController');
const clientController = require('./src/controllers/clientController');

//Aba Agendamentos
router.get('/agendamentos', agendamentoController.loadPage);
router.get('/agendamentos/todos', agendamentoController.listarAgendamentos);
router.post('/agendamentos/criar', agendamentoController.criarAgendamento);
router.put('/agendamentos/editar/:id', agendamentoController.editarAgendamento);
router.delete('/agendamentos/excluir/:id', agendamentoController.excluirAgendamento);

//Aba Serviços
router.post('/servicos/criar', serviceController.addService);
router.put('/servicos/atualizar/:id', serviceController.updateService);
router.delete('/servicos/excluir/:id', serviceController.deleteService);
router.get('/servicos', serviceController.loadPage);
router.get('/servicos/todos', serviceController.getAllServices);

//Aba Clientes
router.post('/clientes/criar', clientController.addClient);
router.put('/clientes/atualizar/:id', clientController.updateClient);
router.delete('/clientes/excluir/:id', clientController.deleteClient);
router.get('/clientes', clientController.loadPage);
router.get('/clientes/todos', clientController.getAllClients);
router.get('/clientes/pesquisar', clientController.searchClient);

//pagina padrão
router.get('/', (req, res) => {
res.redirect('/agendamentos')
});

module.exports = router;