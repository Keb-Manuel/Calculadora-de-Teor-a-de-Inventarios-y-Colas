document.getElementById("calculateButton").addEventListener("click", () => {
    const A = parseFloat(document.getElementById("arrivalRate").value);
    const B = parseFloat(document.getElementById("serviceRate").value);
    const n = 5; // Valor predeterminado para la probabilidad de exceder n
    const nClientes = 10; // Valor fijo para calcular probabilidad de 10 clientes

    if (A <= 0 || B <= 0 || A >= B) {
        alert("Por favor, asegúrate de que 0 < A < B.");
        return;
    }

    const utilization = A / B; // Utilización de la instalación
    const Lq = (A ** 2) / (B * (B - A)); // Longitud promedio de la línea
    const Wq = Lq / A;                   // Tiempo promedio de espera en la línea
    const L = Lq + (A / B);              // Longitud promedio del sistema
    const W = L / A;                     // Tiempo promedio de espera en el sistema
    const P_idle = 1 - utilization;      // Porcentaje de ocio
    const P_exceed_n = (A / B) ** (L + 1); // Probabilidad de que la línea exceda n
    const Prob10 = (1 - A / B) * (A / B) ** nClientes; // Probabilidad de 10 clientes en la cola

    // Crear tabla de resultados
    document.getElementById("results").innerHTML = `
        <h3>Resultados:</h3>
        <table border="1">
            <tr>
                <th>Métrica</th>
                <th>Resultado</th>
            </tr>
            <tr>
                <td>Utilización de la instalación (U)</td>
                <td>${(utilization * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td>Longitud promedio de la línea (Lq)</td>
                <td>${Lq.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Tiempo promedio de espera en la línea (Wq)</td>
                <td>${Wq.toFixed(2)} unidades de tiempo (${(Wq * 60).toFixed(2)} minutos)</td>
            </tr>
            <tr>
                <td>Longitud promedio del sistema (Ls)</td>
                <td>${L.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Tiempo promedio de espera en el sistema (Ws)</td>
                <td>${W.toFixed(2)} horas (${(W * 60).toFixed(2)} minutos)</td>
            </tr>
            <tr>
                <td>Porcentaje de ocio</td>
                <td>${(P_idle * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td>Probabilidad de que la línea exceda ${n}</td>
                <td>${P_exceed_n.toFixed(4)} (${(P_exceed_n * 100).toFixed(2)}%)</td>
            </tr>
            <tr>
                <td>Probabilidad de que haya 10 clientes en la cola</td>
                <td>${(Prob10 * 100).toFixed(2)}%</td>
            </tr>
        </table>
    `;

    // Generar recomendaciones basadas en los resultados
    let recommendations = [];

    if (utilization > 0.8) {
        recommendations.push(
            "La utilización es muy alta. Considere contratar personal adicional o añadir más estaciones de servicio para evitar demoras."
        );
    } else if (utilization > 0.5) {
        recommendations.push(
            "La utilización es moderada. Mantenga un monitoreo regular para evitar posibles saturaciones."
        );
    } else {
        recommendations.push(
            "La utilización es baja. El sistema opera eficientemente y no requiere ajustes inmediatos."
        );
    }

    if (Lq > 5) {
        recommendations.push(
            "La longitud promedio de la línea es alta. Podría ser útil optimizar los procesos o aumentar el personal para reducir el tiempo de espera."
        );
    }

    if (P_idle > 0.5) {
        recommendations.push(
            "El porcentaje de ocio es elevado. Considere aumentar la llegada de clientes o ajustar la capacidad del sistema."
        );
    }

    if (P_exceed_n > 0.1) {
        recommendations.push(
            `Existe una alta probabilidad (${(P_exceed_n * 100).toFixed(2)}%) de que la línea exceda ${n} clientes. Evalúe estrategias para manejar picos de demanda.`
        );
    }

    if (Wq > 0.5) {
        recommendations.push(
            "El tiempo promedio de espera en la línea es alto. Considere reducir los tiempos de servicio o aumentar los recursos disponibles."
        );
    }

    document.getElementById("results").innerHTML += `
        <h4>Recomendaciones:</h4>
        <ul>
            ${recommendations.map((rec) => `<li>${rec}</li>`).join("")}
        </ul>
    `;
});
