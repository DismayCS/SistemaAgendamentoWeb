// controllers/clientController.js

const db = require('../../config/db'); // Importando a conexão com o banco de dados
const Client = require('../models/clientModel'); // Certifique-se de importar o model corretamente

const loadPage = async (req, res) => {
    try {
        const [clientes] = await db.query('SELECT * FROM clientes');
        res.render('clientes', { clientes });
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).send(`Erro ao buscar clientes: ${error.message}`);
    }
};


// Função para adicionar um cliente
const addClient = async (req, res) => {
    const { nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email } = req.body;

    if (!nome_completo || !cpf || !email) {
        return res.status(400).json({ message: 'Nome completo, CPF e E-mail são obrigatórios!' });
    }

    if (!isValidCPF(cpf)) {
        return res.status(400).json({ message: 'CPF inválido.' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Email inválido.' });
    }

    try {
        const [existingClient] = await db.query('SELECT * FROM clientes WHERE cpf = ? OR email = ?', [cpf, email]);
        if (existingClient.length > 0) {
            return res.status(400).json({ message: 'Já existe um cliente com esse CPF ou email.' });
        }

        const query = 'INSERT INTO clientes (nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())';
        const values = [nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email];
        await db.query(query, values);

        const [clientes] = await db.query('SELECT * FROM clientes');
        res.status(201).json({
            message: 'Cliente adicionado com sucesso!',
            clientes: clientes
        });
    } catch (error) {
        console.error('Erro ao adicionar cliente:', error);
        res.status(500).json({ message: 'Erro ao salvar o cliente', error: error.message });
    }
};

// Função para listar todos os clientes
const getAllClients = async (req, res) => {
    try {
        const [clientes] = await db.query('SELECT * FROM clientes');
        res.status(200).json({ clientes });
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ message: 'Erro ao buscar clientes', error: error.message });
    }
};

// Função para pesquisar clientes
const searchClient = async (req, res) => {
    const termo = req.query.termo;

    try {
        const clientes = await Client.searchClient(termo); // Chama a função searchClient no model
        res.json({ clientes });
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ message: 'Erro ao pesquisar clientes' });
    }
};

// Função para atualizar um cliente
const updateClient = async (req, res) => {
    const { id } = req.params;
    const { nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email } = req.body;

    try {
        await db.query(
            'UPDATE clientes SET nome_completo = ?, cpf = ?, data_nascimento = ?, endereco = ?, telefone_fixo = ?, celular = ?, email = ? WHERE id = ?',
            [nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email, id]
        );

        res.json({
            message: 'Cliente atualizado com sucesso!',
            cliente: { id, nome_completo, cpf, data_nascimento, endereco, telefone_fixo, celular, email }
        });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ message: 'Erro ao atualizar cliente.' });
    }
};

// Função para excluir um cliente
const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM clientes WHERE id = ?', [id]);
        res.json({ message: 'Cliente excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
    }    
};

// Funções auxiliares de validação (CPF e Email)
function isValidCPF(cpf) {
    return /^\d{11}$/.test(cpf);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = {
    addClient,
    getAllClients,
    searchClient,
    updateClient,
    deleteClient,
    loadPage
};
