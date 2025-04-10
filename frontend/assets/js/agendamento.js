document.addEventListener("DOMContentLoaded", function () {
    // Função genérica para abrir modais
    window.abrirModal = function (id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = "flex";
    };

    // Função genérica para fechar modais
    window.fecharModal = function (id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = "none";
    };

    // Fecha o modal ao clicar fora dele
    window.addEventListener("click", function (event) {
        document.querySelectorAll(".modal").forEach(modal => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });

    // Abrir o modal de "Adicionar Agendamento"
    document.getElementById('abrirModalAgendamento').addEventListener('click', function () {
        document.getElementById('modalAdicionarAgendamento').style.display = 'block';
    });

    // Fechar o modal de "Adicionar Agendamento"
    document.getElementById('fecharModalAgendamento').addEventListener('click', function () {
        document.getElementById('modalAdicionarAgendamento').style.display = 'none';
    });

    // Fechar o modal de "Editar Agendamento"
    document.getElementById('fecharModalEditar').addEventListener('click', function () {
        document.getElementById('modalEditarAgendamento').style.display = 'none';
    });

    // Enviar os dados do formulário de "Adicionar Agendamento" via AJAX
    document.getElementById('formAdicionarAgendamento').addEventListener('submit', function (event) {
        event.preventDefault();

        const cliente_id = document.getElementById('cliente_id').value;
        const servico_id = document.getElementById('servico_id').value;
        const data_hora = document.getElementById('data_hora').value;

        const dados = { cliente_id, servico_id, data_hora };

        fetch('/agendamentos/criar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Agendamento salvo com sucesso', data);
            document.getElementById('modalAdicionarAgendamento').style.display = 'none';
            $('#calendar').fullCalendar('renderEvent', {
                title: data.title,
                start: moment(data.data_hora).format("YYYY-MM-DDTHH:mm"),
                allDay: false
            });
        })
        .catch(error => {
            console.error('Erro ao salvar o agendamento:', error);
        });
    });

    // Inicializar calendário e carregar agendamentos
    fetch('/agendamentos/todos')
        .then(response => response.json())
        .then(agendamentos => {
            const events = agendamentos.map(agendamento => ({
                id: agendamento.id,
                title: agendamento.title,
                start: moment(agendamento.start).format("YYYY-MM-DDTHH:mm"),
                allDay: false
            }));
            $('#calendar').fullCalendar('renderEvents', events, true);
        })
        .catch(error => {
            console.error('Erro ao carregar agendamentos:', error);
        });

    // Configuração do FullCalendar
    $('#calendar').fullCalendar({
        eventClick: function (event, jsEvent, view) {
            document.getElementById('modalEditarAgendamento').style.display = 'block';

            document.getElementById('editar_cliente_id').value = event.cliente_id;
            document.getElementById('editar_servico_id').value = event.servico_id;
            document.getElementById('editar_data_hora').value = moment(event.start).format('YYYY-MM-DDTHH:mm');
            document.getElementById('editar_agendamento_id').value = event.id;

            document.getElementById('excluirAgendamentoButton').onclick = function () {
                fetch(`/agendamentos/excluir/${event.id}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(() => {
                        console.log('Agendamento excluído');
                        $('#calendar').fullCalendar('removeEvents', event.id);
                        document.getElementById('modalEditarAgendamento').style.display = 'none';
                    })
                    .catch(error => console.error('Erro ao excluir agendamento:', error));
            };
        },
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        views: {
            month: {
                titleFormat: 'MMMM YYYY',
                columnHeaderFormat: 'ddd D'
            },
            agendaWeek: {
                titleFormat: 'Week of YYYY-MM-DD',
                columnHeaderFormat: 'ddd D'
            },
            agendaDay: {
                titleFormat: 'YYYY-MM-DD',
                columnHeaderFormat: 'ddd D'
            }
        }
    });

    // Atualizar agendamento existente
    document.getElementById('formEditarAgendamento').addEventListener('submit', function (event) {
        event.preventDefault();

        const cliente_id = document.getElementById('editar_cliente_id').value;
        const servico_id = document.getElementById('editar_servico_id').value;
        const data_hora = document.getElementById('editar_data_hora').value;
        const agendamentoId = document.getElementById('editar_agendamento_id').value;

        const dados = { cliente_id, servico_id, data_hora };

        fetch(`/agendamentos/editar/${agendamentoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Agendamento editado com sucesso', data);
            $('#calendar').fullCalendar('removeEvents', agendamentoId);
            $('#calendar').fullCalendar('renderEvent', {
                id: agendamentoId,
                title: data.title,
                start: moment(data.data_hora).format("YYYY-MM-DDTHH:mm"),
                allDay: false
            });
            document.getElementById('modalEditarAgendamento').style.display = 'none';
        })
        .catch(error => console.error('Erro ao editar agendamento:', error));
    });
});
