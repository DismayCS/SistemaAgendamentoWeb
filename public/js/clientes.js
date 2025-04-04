document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modalCliente");
    const form = document.getElementById("formCliente");
    const clientesContainer = document.getElementById("clientes-container");
    const mensagemSucesso = document.getElementById("mensagemSucesso");

    document.getElementById("abrirModalCliente").addEventListener("click", function () {
        abrirModal();
    });

    document.getElementById("fecharModalCliente").addEventListener("click", function () {
        modal.classList.remove("open");
    });

    document.getElementById("clientes-container").addEventListener("click", function (event) {
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

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        salvarCliente();
    });

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
    
        console.log(dados); // Verifique os dados antes de enviar
    
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
            }, 3000); // Esconde a mensagem após 3 segundos
            modal.classList.remove("open");
            // Verifique se o cliente foi criado ou atualizado e depois atualize a lista
            atualizarListaClientes(data.clientes);
        })
        .catch(error => {
            console.error(error); // Log de erro para identificar o problema
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
            }, 3000); // Esconde a mensagem após 3 segundos
        })
        .catch(error => alert("Erro ao excluir cliente: " + error));
    }

    // Adiciona a funcionalidade de pesquisa de clientes
    const pesquisaInput = document.getElementById("pesquisaClientes");
    
    if (pesquisaInput) {
        pesquisaInput.addEventListener("keyup", pesquisarClientes);
    }
    
    function pesquisarClientes() {
        const termo = document.getElementById("pesquisaClientes").value.trim();
    
        if (termo === "") {
            // Quando o campo de pesquisa estiver vazio, faça a requisição para obter todos os clientes
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
            return; // Impede que o restante do código seja executado
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

    // Função para atualizar a lista de clientes no DOM
    function atualizarListaClientes(clientes) {
        const container = document.getElementById("clientes-container");
        container.innerHTML = ""; // Limpa a lista antes de inserir os novos resultados
    
        if (!Array.isArray(clientes)) {
            console.error("A variável clientes não é um array!");
            return;
        }

        clientes.forEach(cliente => {
            const card = document.createElement("div");
            card.classList.add("card", "cliente-card");
            card.id = `cliente-${cliente.id}`;
    
            const dataNascimentoFormatada = cliente.data_nascimento 
                ? new Date(cliente.data_nascimento).toLocaleDateString('pt-BR', { year: '2-digit', month: '2-digit', day: '2-digit' })
                : "Data não disponível";  // Caso a data não exista, exibe uma mensagem de erro
    
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
