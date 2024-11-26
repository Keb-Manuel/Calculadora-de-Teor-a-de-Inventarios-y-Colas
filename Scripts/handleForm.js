document.getElementById("leadTimeYes").addEventListener("change", function() {
    document.getElementById("leadTimeInput").style.display = "block";
});
document.getElementById("leadTimeNo").addEventListener("change", function() {
    document.getElementById("leadTimeInput").style.display = "none";
});

function calculateEOQ() {
    const demand = parseFloat(document.getElementById("demand").value);
    const orderCost = parseFloat(document.getElementById("orderCost").value);
    const holdingCost = parseFloat(document.getElementById("holdingCost").value);
    const workingDays = parseFloat(document.getElementById("workingDays").value);
    let leadTime = parseFloat(document.getElementById("leadTime").value);

    if (isNaN(demand) || isNaN(orderCost) || isNaN(holdingCost) || holdingCost <= 0) {
        document.getElementById("result").innerText = "Por favor, ingrese valores válidos.";
        return;
    }

    // Si el usuario no tiene un Lead Time disponible, calculamos el estimado
    if (document.getElementById("leadTimeNo").checked || isNaN(leadTime)) {
        leadTime = null;
    }

    const result = calculateEOQValues(demand, orderCost, holdingCost, workingDays, leadTime);
    displayEOQResults(result);
    renderEOQInventoryChart(demand, result.eoq, workingDays);
}

function calculateEOQValues(demand, orderCost, holdingCost, workingDays, leadTime) {
    // Cálculo de la EOQ (Cantidad Económica de Pedido)
    const eoq = Math.sqrt((2 * demand * orderCost) / holdingCost);
    const numOrders = demand / eoq;

    let tiempo = 0;

    let l = 0;
    if(!leadTime){
        l = workingDays/(demand / eoq);
    }
    else{
        l = leadTime;
    }

    const avgDemandPerDay = demand / workingDays;
    const reorderPoint = avgDemandPerDay * l;
    const orderingCost = numOrders * orderCost;
    const holdingCostTotal = (eoq / 2) * holdingCost;
    const totalCost = orderingCost + holdingCostTotal;

    return {
        eoq,
        numOrders,
        l,
        reorderPoint,
        orderingCost,
        holdingCostTotal,
        totalCost,
        tiempo,
        avgDemandPerDay
    };
}

function displayEOQResults(result) {
    document.getElementById("result").innerHTML = `
        <h2>Resultados:</h2>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
            <tr><th>Parámetro</th><th>Valor</th></tr>
            <tr><td>EOQ</td><td>${result.eoq.toFixed(2)} unidades</td></tr>
            <tr><td>Número de Pedidos por Año</td><td>${result.numOrders.toFixed(2)}</td></tr>
            <tr><td>Tiempo entre un orden y otro (días)</td><td>${result.l.toFixed(2)}</td></tr>
            <tr><td>Punto de Reorden</td><td>${result.reorderPoint.toFixed(2)} unidades</td></tr>
            <tr><td>Costo de Ordenamiento</td><td>$${result.orderingCost.toFixed(2)}</td></tr>
            <tr><td>Costo de Mantenimiento</td><td>$${result.holdingCostTotal.toFixed(2)}</td></tr>
            <tr><td>Costo Total</td><td>$${result.totalCost.toFixed(2)}</td></tr>
            <tr><td>Demanda Diaria</td><td>${result.avgDemandPerDay.toFixed(2)} unidades</td></tr>
            <tr><td>numOrden</td><td>${result.numOrders.toFixed(2)}</td></tr>
            <tr><td>leadTime</td><td>${result.l.toFixed(2)}</td></tr>
            <tr><td>Demanda diaria</td><td>${result.avgDemandPerDay.toFixed(2)}</td></tr>
        </table>
    `;
}

function renderEOQInventoryChart(demand, eoq, workingDays) {
    const dailyDemand = demand / workingDays; // Demanda diaria
    const cycleTime = eoq / dailyDemand; // Tiempo entre cada pedido en días
    const cycles = 3; // Número de ciclos a mostrar en la gráfica
    const timeValues = [];
    const inventoryValues = [];

    // Genera los puntos para cada ciclo
    for (let i = 0; i < cycles; i++) {
        const startTime = i * cycleTime;

        timeValues.push(startTime);
        inventoryValues.push(eoq);
        timeValues.push(startTime + cycleTime);
        inventoryValues.push(0);
    }

    const avgInventory = eoq / 2;

    const annotations = {
        cantidadOrden: {
            type: "label",
            xValue: timeValues[0],
            yValue: eoq,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            content: ["Cantidad a ordenar (Q)"],
            font: {
                size: 12,
                weight: 'bold',
                color: 'black' // Asegúrate de que el color contraste
            }
        },
        inventarioPromedio: {
            type: "label",
            xValue: timeValues[1] / 2,
            yValue: avgInventory,
            backgroundColor: "rgba(255, 255, 0, 0.8)",
            content: ["Inventario Promedio (Q/2)"],
            font: {
                size: 12,
                weight: 'bold',
                color: 'black' // Asegúrate de que el color contraste
            }
        }
    };

    const canvas = document.getElementById("eoqInventoryChart");
    const ctx = canvas.getContext("2d");

    if (window.eoqChart) {
        window.eoqChart.destroy();
    }

    window.eoqChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: timeValues,
            datasets: [
                {
                    label: "Nivel de Inventario",
                    data: inventoryValues,
                    borderColor: "white",
                    borderWidth: 2,
                    fill: false,
                    tension: 0
                },
                {
                    label: "Inventario Promedio (Q/2)",
                    data: Array(timeValues.length).fill(avgInventory),
                    borderColor: "yellow",
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        color: "white"
                    }
                },
                annotation: {
                    annotations
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Tiempo (días)",
                        color: "white"
                    },
                    ticks: {
                        color: "white"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Nivel de Inventario",
                        color: "white"
                    },
                    ticks: {
                        color: "white"
                    },
                    beginAtZero: true
                }
            }
        }
    });
}