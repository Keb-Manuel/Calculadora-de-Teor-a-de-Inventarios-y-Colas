document.getElementById("calculateButton").addEventListener("click", () => {
    const arrivalRateInput = document.getElementById("arrivalRate").value;
    const serviceRateInput = document.getElementById("serviceRate").value;
    const timeType = document.getElementById("timeType").value; // Total o por persona

    // Función para evaluar fracciones
    const evaluateFraction = (input) => {
        if (input.includes("/")) {
            const [numerator, denominator] = input.split("/").map(Number);
            return numerator / denominator;
        }
        return parseFloat(input);
    };

    // Convertir entradas
    const A = evaluateFraction(arrivalRateInput); // Tasa de llegada
    let B;

    if (timeType === "total") {
        B = evaluateFraction(serviceRateInput); // Si es tiempo total, invierte para obtener tasa
    } else {
        B = (evaluateFraction(serviceRateInput) * 60) * A; // Convierte a minutos si es "por persona"
    }

    // Validar restricción 0 < A < B
    if (A <= 0 || B <= 0 || A >= B) {
        document.getElementById("arrivalRate").classList.add("error");
        document.getElementById("serviceRate").classList.add("error");
        document.getElementById("results").innerHTML = `
            <p style="color: red;">Por favor, asegúrate de que 0 < A < B después de calcular.</p>`;
        return;
    } else {
        document.getElementById("arrivalRate").classList.remove("error");
        document.getElementById("serviceRate").classList.remove("error");
    }

    // Cálculos en minutos
    const utilization = A / B; // Utilización de la instalación
    const Lq = (A ** 2) / (B * (B - A)); // Longitud promedio de la línea
    const Wq = (Lq / A) * 60;            // Tiempo promedio de espera en la línea (minutos)
    const L = Lq + (A / B);              // Longitud promedio del sistema
    const W = (L / A) * 60;              // Tiempo promedio de espera en el sistema (minutos)
    const P_idle = 1 - utilization;      // Porcentaje de ocio
    const nClientes = 10;                // Valor fijo para calcular probabilidad de 10 clientes
    const Prob10 = (1 - utilization) * (utilization ** nClientes); // Probabilidad de 10 clientes en la cola
    const P_exceed_n = Math.pow(utilization,(Lq+1)); // Probabilidad de que la línea exceda cierto número de clientes

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
                <td>${Wq.toFixed(2)} minutos</td>
            </tr>
            <tr>
                <td>Longitud promedio del sistema (Ls)</td>
                <td>${L.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Tiempo promedio de espera en el sistema (Ws)</td>
                <td>${W.toFixed(2)} minutos</td>
            </tr>
            <tr>
                <td>Porcentaje de ocio</td>
                <td>${(P_idle * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td>Probabilidad de que la línea exceda ${L+1} clientes</td>
                <td>${P_exceed_n.toFixed(4)} (${(P_exceed_n * 100).toFixed(2)}%)</td>
            </tr>
            <tr>
                <td>Probabilidad de que haya ${Lq} clientes en la cola</td>
                <td>${Prob10.toFixed(4)} (${(Prob10 * 100).toFixed(2)}%)</td>
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
