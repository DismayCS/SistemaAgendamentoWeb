document.addEventListener("DOMContentLoaded", function () {
    // Função para abrir qualquer modal
    window.abrirModal = function (id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = "flex";
    };

    // Função para fechar qualquer modal
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

    // Envio de formulário de agendamento via AJAX
    const formAgendamento = document.getElementById("formAgendamento");
    if (formAgendamento) {
        formAgendamento.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(this);

            fetch("/agendamentos/criar", {
                method: "POST",
                body: new URLSearchParams(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.mensagem) {
                    alert(data.mensagem);
                    fecharModal("agendamentoModal");
                    location.reload(); // Atualiza a página para refletir os agendamentos
                } else {
                    alert("Erro ao criar o agendamento.");
                }
            })
            .catch(error => console.error("Erro ao cadastrar agendamento:", error));
        });
    }

    // Envio de formulário para adicionar serviço via AJAX
    const formServico = document.getElementById("formAdicionarServico");
    if (formServico) {
        formServico.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(this);

            fetch("/servicos/adicionar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: formData.get("nome"),
                    duracao: formData.get("duracao"),
                    observacao: formData.get("observacao")
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.mensagem) {
                    alert(data.mensagem);
                    fecharModal("modalAdicionarServico");
                    atualizarListaServicos(); // Atualiza a lista de serviços sem recarregar a página
                } else {
                    alert("Erro ao adicionar o serviço.");
                }
            })
            .catch(error => console.error("Erro ao adicionar serviço:", error));
        });
    }

    // Função para atualizar a lista de serviços
    function atualizarListaServicos() {
        fetch("/servicos/listar")
            .then(response => response.json())
            .then(servicos => {
                const listaServicos = document.getElementById("listaServicos");
                if (listaServicos) {
                    listaServicos.innerHTML = ''; // Limpa a lista existente
                    servicos.forEach(servico => {
                        const card = document.createElement("div");
                        card.classList.add("servico-card");
                        card.innerHTML = `
                            <h3>${servico.nome}</h3>
                            <p>Duração: ${servico.duracao} min</p>
                            <p>${servico.observacao || "Sem observação"}</p>
                        `;
                        listaServicos.appendChild(card);
                    });
                }
            })
            .catch(error => console.error("Erro ao carregar serviços:", error));
    }
});
