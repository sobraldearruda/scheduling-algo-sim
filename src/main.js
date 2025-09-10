let processes = []; // Array que armazena todos os processos criados pelo usuário
let processCount = 0; // Contador para gerar IDs automáticos (P1, P2, ...)

// Captura o envio do formulário de processos
document.getElementById("process-form").addEventListener("submit", e => {
    e.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)

    // Lê os valores dos campos do formulário
    // Se o campo "pid" estiver vazio, cria um ID automático (P1, P2, ...)
    let pid = document.getElementById("pid").value || `P${++processCount}`;
    let arrival = parseInt(document.getElementById("arrival").value); // Tempo de chegada (número inteiro)
    let burst = parseInt(document.getElementById("burst").value); // Tempo de execução (número inteiro)
    let priority = parseInt(document.getElementById("priority").value); // Prioridade (inteiro)

    // Adiciona o novo processo ao array de processos
    processes.push({id: pid, arrival, burst, priority});

    // Atualiza a tabela exibida na tela para refletir o novo processo
    updateTable();

    // Reseta os campos do formulário
    e.target.reset();
});

// Função para atualizar a tabela de processos
function updateTable() {
    let tbody = document.querySelector("#process-table tbody"); // Seleciona o corpo da tabela
    tbody.innerHTML = ""; // Limpa o conteúdo anterior

    // Para cada processo, cria uma linha na tabela com seus valores
    processes.forEach(p => {
        let row = `<tr>
            <td>${p.id}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.priority}</td>
        </tr>`;
        tbody.innerHTML += row; // Adiciona a linha ao corpo da tabela
    });
}

// Botão para iniciar a simulação
document.getElementById("simulate-btn").addEventListener("click", () => {
    // Se não há processos, alerta o usuário e interrompe a execução
    if (!processes.length) {
        alert("Nenhum processo para simular.");
        return;
    }

    // Captura o algoritmo selecionado e o quantum (se for Round Robin)
    let algo = document.getElementById("algorithm").value;
    let quantum = parseInt(document.getElementById("quantum").value);
    let gantt, results; // Variáveis para armazenar o diagrama e os resultados

    // Executa o algoritmo escolhido
    if (algo === "FIFO") {
        ({gantt, results} = fifo(processes));
    } else if (algo === "SJF") {
        ({gantt, results} = sjf(processes));
    } else if (algo === "RoundRobin") {
        // Se quantum inválido, alerta o usuário
        if (quantum <= 0) {
            alert("Defina um quantum válido (>0).");
            return;
        }
        ({gantt, results} = roundRobin(processes, quantum));
    } else if (algo === "Prioridade") {
        ({gantt, results} = prioridade(processes));
    }

    // Desenha o diagrama de Gantt no canvas
    drawGantt(gantt);

    // Monta a tabela de métricas para exibir ao usuário
    let html = "<h3>Métricas por processo</h3><table><tr><th>ID</th><th>Espera</th><th>Turnaround</th><th>Resposta</th></tr>";
    results.forEach(r => {
        html += `<tr><td>${r.id}</td><td>${r.waiting}</td><td>${r.turnaround}</td><td>${r.response}</td></tr>`;
    });
    html += "</table>";

    // Calcula as médias de cada métrica
    let avg = {
        waiting: (results.reduce((s,r) => s+r.waiting,0)/results.length).toFixed(2),
        turnaround: (results.reduce((s,r) => s+r.turnaround,0)/results.length).toFixed(2),
        response: (results.reduce((s,r) => s+r.response,0)/results.length).toFixed(2),
    };
    // Adiciona as médias abaixo da tabela
    html += `<p><strong>Médias:</strong> Espera = ${avg.waiting}, Turnaround = ${avg.turnaround}, Resposta = ${avg.response}</p>`;

    // Insere o HTML montado na div de resultados
    document.getElementById("results").innerHTML = html;
});

// Botão para comparar algoritmos
document.getElementById("compare-btn").addEventListener("click", () => {
    // Se não há processos, alerta o usuário e interrompe a execução
    if (!processes.length) {
        alert("Nenhum processo para comparar.");
        return;
    }

    // Objeto que armazena os resultados de cada algoritmo
    let comparisons = {};

    // Executa cada algoritmo e armazena os resultados
    comparisons["FIFO"] = fifo(processes).results;
    comparisons["SJF"] = sjf(processes).results;

    // Executa Round Robin apenas se quantum válido foi definido
    let q = parseInt(document.getElementById("quantum").value);
    if (q > 0) comparisons[`RoundRobin (Q = ${q})`] = roundRobin(processes, q).results;

    comparisons["Prioridade"] = prioridade(processes).results;

    // Monta uma tabela comparativa
    let html = "<h3>Comparação</h3><table><tr><th>Algoritmo</th><th>Espera Média</th><th>Turnaround Médio</th><th>Resposta Média</th></tr>";

    // Para cada algoritmo, calcula as médias e adiciona uma linha na tabela
    for (let algo in comparisons) {
        let arr = comparisons[algo];
        let avgWait = (arr.reduce((s,r)=>s+r.waiting,0)/arr.length).toFixed(2);
        let avgTurn = (arr.reduce((s,r)=>s+r.turnaround,0)/arr.length).toFixed(2);
        let avgResp = (arr.reduce((s,r)=>s+r.response,0)/arr.length).toFixed(2);
        html += `<tr><td>${algo}</td><td>${avgWait}</td><td>${avgTurn}</td><td>${avgResp}</td></tr>`;
    }
    html += "</table>";

    // Insere o HTML da comparação na div correspondente
    document.getElementById("comparison").innerHTML = html;
});
