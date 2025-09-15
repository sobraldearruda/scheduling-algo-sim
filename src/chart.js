// Função para desenhar o diagrama de Gantt
function drawGantt(ganttData, title = "Diagrama de Gantt", canvasId = "gantt") {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let margin = 50;
    let barHeight = 40;
    let barY = 60;
    let totalTime = ganttData[ganttData.length - 1].end;
    let scale = (canvas.width - margin - 20) / totalTime;

    let colors = {};
    let palette = ["#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0", "#FF5722", "#795548", "#00BCD4"];
    let colorIndex = 0;

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 20);

    ganttData.forEach(block => {
        if (!(block.id in colors)) {
            colors[block.id] = palette[colorIndex % palette.length];
            colorIndex++;
        }

        let x = margin + block.start * scale;
        let width = (block.end - block.start) * scale;

        ctx.fillStyle = colors[block.id];
        ctx.fillRect(x, barY, width, barHeight);

        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(block.id, x + width / 2, barY + barHeight / 2 + 5);
    });

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(margin, barY + barHeight);
    ctx.lineTo(margin + totalTime * scale, barY + barHeight);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    for (let t = 0; t <= totalTime; t++) {
        let x = margin + t * scale;
        ctx.beginPath();
        ctx.moveTo(x, barY + barHeight);
        ctx.lineTo(x, barY + barHeight + 5);
        ctx.stroke();
        if (t % Math.ceil(totalTime / 10) === 0 || t === totalTime) {
            ctx.fillText(t, x, barY + barHeight + 20);
        }
    }
}
