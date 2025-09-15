let processes = [
    {id: "P1", arrival: 0, burst: 5, priority: 2},
    {id: "P2", arrival: 0, burst: 10, priority: 1},
    {id: "P3", arrival: 5, burst: 5, priority: 1},
    {id: "P4", arrival: 7, burst: 20, priority: 1},
    {id: "P5", arrival: 7, burst: 10, priority: 2}
]; 
let processCount = processes.length;

updateTable();

// Captura o envio do formulário de processos
document.getElementById("process-form").addEventListener("submit", e => {
    e.preventDefault();

    let pid = document.getElementById("pid").value || `P${++processCount}`;
    let arrival = parseInt(document.getElementById("arrival").value);
    let burst = parseInt(document.getElementById("burst").value);
    let priority = parseInt(document.getElementById("priority").value);

    processes.push({id: pid, arrival, burst, priority});
    updateTable();
    e.target.reset();
});

function updateTable() {
    let tbody = document.querySelector("#process-table tbody");
    tbody.innerHTML = "";
    processes.forEach(p => {
        let row = `<tr>
            <td>${p.id}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.priority}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function runSimulation(algoSelectId, quantumInputId, canvasId, resultsDivId) {
    if (!processes.length) {
        alert("Nenhum processo para simular.");
        return;
    }

    let algo = document.getElementById(algoSelectId).value;
    let quantum = parseInt(document.getElementById(quantumInputId).value);
    let gantt, results;

    if (algo === "FIFO") {
        ({gantt, results} = fifo(processes));
    } else if (algo === "SJF") {
        ({gantt, results} = sjf(processes));
    } else if (algo === "RoundRobin") {
        if (quantum <= 0) {
            alert("Defina um quantum válido (>0).");
            return;
        }
        ({gantt, results} = roundRobin(processes, quantum));
    } else if (algo === "Prioridade") {
        ({gantt, results} = prioridade(processes));
    }

    drawGantt(gantt, `Diagrama de Gantt (${algo})`, canvasId);

    let html = `<h3>Métricas por processo</h3>
    <table>
        <tr>
            <th title="Tempo médio que o processo esperou antes de ser executado">Espera</th>
            <th title="Tempo total entre a chegada e a finalização do processo">Turnaround</th>
            <th title="Tempo até a primeira resposta do processo">Resposta</th>
        </tr>`;

    results.forEach(r => {
        html += `<tr><td>${r.waiting}</td><td>${r.turnaround}</td><td>${r.response}</td></tr>`;
    });
    html += "</table>";

    let avg = {
        waiting: (results.reduce((s,r) => s+r.waiting,0)/results.length).toFixed(2),
        turnaround: (results.reduce((s,r) => s+r.turnaround,0)/results.length).toFixed(2),
        response: (results.reduce((s,r) => s+r.response,0)/results.length).toFixed(2),
    };
    html += `<p><strong>Médias:</strong> Espera = ${avg.waiting}, Turnaround = ${avg.turnaround}, Resposta = ${avg.response}</p>`;

    document.getElementById(resultsDivId).innerHTML = html;
}

document.getElementById("simulate-btn-1").addEventListener("click", () => {
    runSimulation("algorithm1", "quantum1", "gantt1", "results1");
});
document.getElementById("simulate-btn-2").addEventListener("click", () => {
    runSimulation("algorithm2", "quantum2", "gantt2", "results2");
});

document.getElementById("compare-btn").addEventListener("click", () => {
    if (!processes.length) {
        alert("Nenhum processo para comparar.");
        return;
    }

    let comparisons = {};
    comparisons["FIFO"] = fifo(processes).results;
    comparisons["SJF"] = sjf(processes).results;

    let q = parseInt(document.getElementById("quantum1").value);
    if (q > 0) comparisons[`RoundRobin`] = roundRobin(processes, q).results;

    comparisons["Prioridade"] = prioridade(processes).results;

    let html = "<h3>Comparação</h3><table><tr><th>Algoritmo</th><th>Espera Média</th><th>Turnaround Médio</th><th>Resposta Média</th></tr>";
    for (let algo in comparisons) {
        let arr = comparisons[algo];
        let avgWait = (arr.reduce((s,r)=>s+r.waiting,0)/arr.length).toFixed(2);
        let avgTurn = (arr.reduce((s,r)=>s+r.turnaround,0)/arr.length).toFixed(2);
        let avgResp = (arr.reduce((s,r)=>s+r.response,0)/arr.length).toFixed(2);
        html += `<tr><td>${algo}</td><td>${avgWait}</td><td>${avgTurn}</td><td>${avgResp}</td></tr>`;
    }
    html += "</table>";

    document.getElementById("comparison").innerHTML = html;
});
