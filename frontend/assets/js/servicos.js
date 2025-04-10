if (window.location.pathname.includes("/servicos")) {
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modalServico");
    const form = document.getElementById("formServico");
    const servicosContainer = document.getElementById("servicos-container");
    const mensagemSucesso = document.getElementById("mensagemSucesso");

    document.getElementById("abrirModalServico").addEventListener("click", function () {
        abrirModal();
    });

    document.getElementById("fecharModalServico").addEventListener("click", function () {
        modal.classList.remove("open");
    });

    servicosContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("editarServico")) {
            preencherModal(event.target.dataset);
        } else if (event.target.classList.contains("excluirServico")) {
            excluirServico(event.target.dataset.id);
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        salvarServico();
    });

    function abrirModal() {
        form.reset();
        document.getElementById("servicoId").value = "";
        modal.classList.add("open");
    }

    function preencherModal(data) {
        document.getElementById("servicoId").value = data.id;
        document.getElementById("nome").value = data.nome;
        document.getElementById("duracao").value = data.duracao;
        document.getElementById("descricao").value = data.observacao;
        modal.classList.add("open");
    }

    function salvarServico() {
        const id = document.getElementById("servicoId").value;  // Obtém o ID do serviço
        const dados = {
            nome: document.getElementById("nome").value,
            duracao: document.getElementById("duracao").value,
            observacao: document.getElementById("descricao").value || ""
        };
    
        const url = id ? `/servicos/atualizar/${id}` : "/servicos/criar";  // Rota de atualização ou criação
        const metodo = id ? "PUT" : "POST";  // Se há ID, usa PUT para atualizar
        console.log("ID do serviço:", id);  // Verifique se o id está correto

        console.log('URL da requisição:', url);  // Verifique a URL que está sendo chamada

        fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)  // Envia os dados no corpo da requisição
        })
        .then(response => response.json())
        .then(data => {
            mensagemSucesso.textContent = data.message;
            mensagemSucesso.style.display = "block";
            modal.classList.remove("open");
            atualizarListaServicos(data.servico, id);  // Atualiza o serviço na lista
        })
        .catch(error => alert("Erro ao salvar serviço: " + error));
    }
    
    function excluirServico(id) {
        if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

        fetch(`/servicos/excluir/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            document.getElementById(`servico-${id}`).remove();
            mensagemSucesso.textContent = data.message;
            mensagemSucesso.style.display = "block";
        })
        .catch(error => alert("Erro ao excluir serviço: " + error));
    }

    function atualizarListaServicos(servico, id) {
        if (!servico) return;

        let card = document.getElementById(`servico-${id}`);
        if (!card) {
            card = document.createElement("div");
            card.classList.add("card");
            card.id = `servico-${servico.id}`;
            servicosContainer.prepend(card);
        }

        card.innerHTML = `
            <h5>${servico.nome}</h5>
            <p><strong>Duração:</strong> ${servico.duracao} minutos</p>
            <p><strong>Observações:</strong> ${servico.observacao || "Nenhuma"}</p>
            <button class="editarServico" data-id="${servico.id}" data-nome="${servico.nome}" data-duracao="${servico.duracao}" data-observacao="${servico.observacao}">Editar</button>
            <button class="excluirServico" data-id="${servico.id}">Excluir</button>
        `;
    }
});
}