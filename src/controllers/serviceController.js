const db = require('../../config/db'); // Importando a conexão com o banco de dados


const loadPage = async (req, res) => {
    try {
        const [servicos] = await db.query('SELECT * FROM servicos');
        res.render('servicos', { servicos });
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).send(`Erro ao buscar serviços: ${error.message}`);
    }
};

// Função para adicionar um serviço
const addService = async (req, res) => {
    const { nome, duracao, observacao } = req.body;

    // Verifica se os campos obrigatórios foram preenchidos
    if (!nome || !duracao) {
        return res.status(400).json({ message: 'Nome e duração são obrigatórios!' });
    }

    try {
        // Inserir o serviço no banco de dados
        const query = 'INSERT INTO servicos (nome, duracao, observacao, created_at) VALUES (?, ?, ?, NOW())';
        const values = [nome, duracao, observacao || '']; // Caso a descrição não seja fornecida, ela será vazia
        const [result] = await db.query(query, values); // Executa a query de inserção

        // Buscar o serviço recém-adicionado utilizando o ID gerado
        const [servico] = await db.query('SELECT * FROM servicos WHERE id = ?', [result.insertId]);

        // Enviar resposta de sucesso com a mensagem e o serviço adicionado
        res.status(200).json({
            message: 'Serviço adicionado com sucesso!',
            servico: servico[0]  // Retorna o primeiro (e único) serviço da consulta
        });
    } catch (error) {
        console.error('Erro ao adicionar serviço:', error);
        res.status(500).json({ message: 'Erro ao salvar o serviço', error: error.message });
    }
};

// Função para listar todos os serviços
const getAllServices = async (req, res) => {
    try {
        const [servicos] = await db.query('SELECT * FROM servicos');
        res.status(200).json({ servicos });
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).json({ message: 'Erro ao buscar serviços', error: error.message });
    }
};

// Função para atualizar um serviço
const updateService = async (req, res) => {
    const { id } = req.params; // Obtém o ID da URL
    const { nome, duracao, observacao } = req.body; // Obtém os dados enviados

    try {
        // Atualiza os dados do serviço no banco
        await db.query(
            'UPDATE servicos SET nome = ?, duracao = ?, observacao = ? WHERE id = ?',
            [nome, duracao, observacao, id]
        );

        // Resposta com sucesso
        res.json({
            message: 'Serviço atualizado com sucesso!',
            servico: { id, nome, duracao, observacao } // Retorna os dados atualizados
        });
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        res.status(500).json({ message: 'Erro ao atualizar serviço.' });
    }
};

const deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM servicos WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.json({ message: 'Serviço excluído com sucesso!' });
        } else {
            return res.status(404).json({ message: 'Serviço não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        res.status(500).json({ message: 'Erro ao excluir serviço.' });
    }
};

module.exports = {
    updateService,
    addService,
    getAllServices,
    deleteService,
    loadPage
};
