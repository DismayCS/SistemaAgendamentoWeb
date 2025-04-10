document.addEventListener("DOMContentLoaded", function () {
    const paginaAtual = window.location.pathname;

    // Garante que este script só rode na rota de clientes
    if (!paginaAtual.includes("/clientes")) return;

    const modal = document.getElementById("modalCliente");
    const form = document.getElementById("formCliente");
    const clientesContainer = document.getElementById("clientes-container");
    const mensagemSucesso = document.getElementById("mensagemSucesso");
    const botaoAbrir = document.getElementById("abrirModalCliente");
    const botaoFechar = document.getElementById("fecharModalCliente");
    const pesquisaInput = document.getElementById("pesquisaClientes");

    if (botaoAbrir) {
        botaoAbrir.addEventListener("click", () => abrirModal());
    }

    if (botaoFechar) {
        botaoFechar.addEventListener("click", () => {
            modal.classList.remove("open");
        });
    }

    if (clientesContainer) {
        clientesContainer.addEventListener("click", function (event) {
            let card = event.target.closest(".cliente-card");

            if (card && !event.target.classList.contains("editarCliente") && !event.target.classList.contains("excluirCliente")) {
                card.classList.toggle("expanded");
            }

            if (event.target.classList.contains("editarCliente")) {
                preencherModal(event.target.dataset);
            } else if (event.target.classList.contains("excluirCliente")) {
                excluirCliente(event.target.dataset.id);
            }
        });
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            salvarCliente();
        });
    }

    if (pesquisaInput) {
        pesquisaInput.addEventListener("keyup", pesquisarClientes);
    }

    function abrirModal() {
        form.reset();
        document.getElementById("clienteId").value = "";
        modal.classList.add("open");
    }

    function preencherModal(data) {
        document.getElementById("clienteId").value = data.id;
        document.getElementById("nome_completo").value = data.nome_completo;
        document.getElementById("cpf").value = data.cpf;
        document.getElementById("data_nascimento").value = data.data_nascimento;
        document.getElementById("endereco").value = data.endereco;
        document.getElementById("telefone_fixo").value = data.telefone_fixo;
        document.getElementById("celular").value = data.celular;
        document.getElementById("email").value = data.email;
        modal.classList.add("open");
    }

    function salvarCliente() {
        const id = document.getElementById("clienteId").value;
        const dados = {
            nome_completo: document.getElementById("nome_completo").value,
            cpf: document.getElementById("cpf").value,
            data_nascimento: document.getElementById("data_nascimento").value,
            endereco: document.getElementById("endereco").value,
            telefone_fixo: document.getElementById("telefone_fixo").value,
            celular: document.getElementById("celular").value,
            email: document.getElementById("email").value
        };

        if (!dados.nome_completo || !dados.cpf || !dados.email) {
            alert("Nome completo, CPF e E-mail são obrigatórios!");
            return;
        }

        const url = id ? `/clientes/atualizar/${id}` : "/clientes/criar";
        const metodo = id ? "PUT" : "POST";

        fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
            .then(response => response.json())
            .then(data => {
                mensagemSucesso.textContent = data.message;
                mensagemSucesso.style.display = "block";
                setTimeout(() => {
                    mensagemSucesso.style.display = "none";
                }, 3000);
                modal.classList.remove("open");
                atualizarListaClientes(data.clientes);
            })
            .catch(error => {
                console.error(error);
                alert("Erro ao salvar cliente: " + error);
            });
    }

    function excluirCliente(id) {
        if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

        fetch(`/clientes/excluir/${id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                document.getElementById(`cliente-${id}`).remove();
                mensagemSucesso.textContent = data.message;
                mensagemSucesso.style.display = "block";
                setTimeout(() => {
                    mensagemSucesso.style.display = "none";
                }, 3000);
            })
            .catch(error => alert("Erro ao excluir cliente: " + error));
    }

    function pesquisarClientes() {
        const termo = pesquisaInput.value.trim();

        if (termo === "") {
            fetch("/clientes")
                .then(response => response.json())
                .then(data => {
                    if (data.clientes) {
                        atualizarListaClientes(data.clientes);
                    } else {
                        alert('Nenhum cliente encontrado');
                    }
                })
                .catch(error => {
                    console.error("Erro ao pesquisar clientes:", error);
                });
            return;
        }

        fetch(`/clientes/pesquisar?termo=${encodeURIComponent(termo)}`)
            .then(response => response.json())
            .then(data => {
                if (data.clientes) {
                    atualizarListaClientes(data.clientes);
                } else {
                    alert('Nenhum cliente encontrado');
                }
            })
            .catch(error => {
                console.error("Erro ao pesquisar clientes:", error);
            });
    }

    function atualizarListaClientes(clientes) {
        const container = document.getElementById("clientes-container");
        container.innerHTML = "";

        if (!Array.isArray(clientes)) {
            console.error("A variável clientes não é um array!");
            return;
        }

        clientes.forEach(cliente => {
            const card = document.createElement("div");
            card.classList.add("card", "cliente-card");
            card.id = `cliente-${cliente.id}`;

            const dataNascimentoFormatada = cliente.data_nascimento
                ? new Date(cliente.data_nascimento).toLocaleDateString('pt-BR', {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit'
                  })
                : "Data não disponível";

            card.innerHTML = `
                <h5 class="titulo">${cliente.nome_completo}</h5>
                <div class="conteudo">
                    <p><strong>CPF:</strong> ${cliente.cpf}</p>
                    <p><strong>Nascimento:</strong> ${dataNascimentoFormatada}</p>
                    <p><strong>Endereço:</strong> ${cliente.endereco}</p>
                    <p><strong>Telefone Fixo:</strong> ${cliente.telefone_fixo}</p>
                    <p><strong>Celular:</strong> ${cliente.celular}</p>
                    <p><strong>E-mail:</strong> ${cliente.email}</p>
                </div>
                <div class="card-buttons">
                    <button class="editarCliente" 
                            data-id="${cliente.id}" 
                            data-nome_completo="${cliente.nome_completo}" 
                            data-cpf="${cliente.cpf}" 
                            data-data_nascimento="${cliente.data_nascimento}" 
                            data-endereco="${cliente.endereco}" 
                            data-telefone_fixo="${cliente.telefone_fixo}" 
                            data-celular="${cliente.celular}" 
                            data-email="${cliente.email}">Editar</button>
                    <button class="excluirCliente" data-id="${cliente.id}">Excluir</button>
                </div>
            `;

            container.appendChild(card);
        });
    }
});
