// Função para desenhar o diagrama de Gantt

function drawGantt(ganttData, title = "Diagrama de Gantt") {
    // Obtém o elemento <canvas> do HTML com id "gantt"
    let canvas = document.getElementById("gantt");

    // Obtém o contexto 2D do canvas, necessário para desenhar formas e textos
    let ctx = canvas.getContext("2d");

    // Limpa todo o conteúdo do canvas antes de desenhar um novo Gantt
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define margens e tamanhos
    let margin = 50; // margem esquerda para a linha do tempo
    let barHeight = 40; // altura da barra de processos
    let barY = 60; // posição vertical da barra
    let totalTime = ganttData[ganttData.length - 1].end; // tempo total (último fim)
    let scale = (canvas.width - margin - 20) / totalTime; // escala para converter tempo -> pixels

    // Objeto que guarda a cor associada a cada processo
    let colors = {};

    // Paleta de cores usada para diferenciar visualmente os processos
    let palette = ["#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0", "#FF5722", "#795548", "#00BCD4"];
    
    // Índice da paleta, para alternar as cores a cada processo novo
    let colorIndex = 0;

    // Desenha o título no topo
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 20);

    // Desenha cada bloco
    ganttData.forEach(block => {
        // Define cor do processo se ainda não foi atribuído
        if (!(block.id in colors)) {
            colors[block.id] = palette[colorIndex % palette.length];
            colorIndex++;
        }

        let x = margin + block.start * scale; // posição inicial no eixo X
        let width = (block.end - block.start) * scale; // largura proporcional ao tempo de execução

        // Desenha o retângulo
        ctx.fillStyle = colors[block.id];
        ctx.fillRect(x, barY, width, barHeight);

        // Escreve o ID do processo no centro do bloco
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(block.id, x + width / 2, barY + barHeight / 2 + 5);
    });

    // Desenha a linha do tempo
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(margin, barY + barHeight);
    ctx.lineTo(margin + totalTime * scale, barY + barHeight);
    ctx.stroke();

    // Desenha marcações no eixo do tempo
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    for (let t = 0; t <= totalTime; t++) {
        let x = margin + t * scale;
        ctx.beginPath();
        ctx.moveTo(x, barY + barHeight);
        ctx.lineTo(x, barY + barHeight + 5); // pequena linha para marcar o tempo
        ctx.stroke();
        if (t % Math.ceil(totalTime / 10) === 0 || t === totalTime) {
            ctx.fillText(t, x, barY + barHeight + 20); // escreve o valor de tempo
        }
    }
}
