const agendamento = require('../models/agendamento');
const moment = require("moment-timezone");

// Função para criar um agendamento
const criarAgendamento = async (req, res) => {
    try {
        console.log("📥 Dados recebidos:", req.body);  // Depuração

        const { cliente_id, servico_id, data_hora } = req.body;

        if (!cliente_id || !servico_id || !data_hora) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        // Criar um novo agendamento no banco de dados
        const novoAgendamento = await agendamento.criar(cliente_id, servico_id, data_hora);

        console.log("✅ Agendamento criado:", novoAgendamento);

        res.json(novoAgendamento);
    } catch (error) {
        console.error("❌ Erro ao criar agendamento:", error);
        res.status(500).json({ error: "Erro ao criar o agendamento." });
    }
};

// Função para listar os agendamentos
const listarAgendamentos = async (req, res) => {
    try {
        const agendamentos = await agendamento.listar();
        res.json(agendamentos.map(a => ({
            id: a.id,
            title: a.cliente_nome, // Exibir o nome do cliente
            start: moment(a.data_hora).tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss")
        })));
    } catch (error) {
        console.error("❌ Erro ao buscar agendamentos:", error);
        res.status(500).json({ error: "Erro ao buscar agendamentos." });
    }
};

// Função para excluir um agendamento
const excluirAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await agendamento.excluir(id);
        return res.json(resultado);  // O return garante que nenhuma resposta extra será enviada
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {  // Só responde se os headers ainda não foram enviados
            return res.status(500).json({ error: error.message });
        }
    }
};

// Função para editar um agendamento
const editarAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        const { cliente_id, servico_id, data_hora } = req.body;

        if (!cliente_id || !servico_id || !data_hora) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        // Editar o agendamento no banco de dados
        const agendamentoAtualizado = await agendamento.editar(id, cliente_id, servico_id, data_hora);

        console.log("✅ Agendamento editado:", agendamentoAtualizado);

        res.json(agendamentoAtualizado);
    } catch (error) {
        console.error("❌ Erro ao editar agendamento:", error);
        res.status(500).json({ error: "Erro ao editar o agendamento." });
    }
};

module.exports = {
    excluirAgendamento,
    listarAgendamentos,
    criarAgendamento,
    editarAgendamento // Não esquecer de exportar a função de edição
};
