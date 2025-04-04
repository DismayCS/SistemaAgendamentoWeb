const db = require('../config/db');

const Agendamento = {
    // Função para criar um novo agendamento
    criar: async (cliente_id, servico_id, data_hora) => {
        try{
        const query = 'INSERT INTO agendamentos (cliente_id, servico_id, data_hora) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [cliente_id, servico_id, data_hora]);
        return { id: result.insertId, cliente_id, servico_id, data_hora };
        }catch(error){
            console.error('Erro ao criar agendamentos:', error);
            throw new Error("Erro ao criar agendamentos");
        }
    },

    // Função para listar todos os agendamentos
    listar: async () => {
        const sql = `
            SELECT a.id, a.data_hora, c.nome_completo AS cliente_nome
            FROM agendamentos a
            JOIN clientes c ON a.cliente_id = c.id
        `;
        try {
            const [agendamentos] = await db.query(sql);
            return agendamentos;
        } catch (error) {
            console.error('Erro ao listar agendamentos:', error);
            throw new Error("Erro ao listar agendamentos");
        }
    },


    editar: async (id, cliente_id, servico_id, data_hora) => {
        try {
            const query = `UPDATE agendamentos SET cliente_id = ?, servico_id = ?, data_hora = ? WHERE id = ?`;
            await db.query(query, [cliente_id, servico_id, data_hora, id]);
            return { id, cliente_id, servico_id, data_hora };
        } catch (error) {
            console.error('Erro ao editar agendamento:', error);
            throw new Error('Erro ao editar agendamento');
        }
    },

    // Função para excluir um agendamento
    excluir: async (id) => {
        try {
            const query = `DELETE FROM agendamentos WHERE id = ?`;
            await db.query(query, [id]);
            return { message: 'Agendamento excluído com sucesso!' };
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
            throw new Error('Erro ao excluir agendamento');
        }
    }
};

module.exports = Agendamento;
