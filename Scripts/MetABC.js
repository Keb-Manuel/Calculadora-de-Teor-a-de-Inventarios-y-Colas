let datos = [];
let agregarNombre = false;
let tieneValorTotal = false;

function configurarFormulario() {
    agregarNombre = document.getElementById("nombre").value === "si";
    tieneValorTotal = document.getElementById("valorProducto").value === "si";

    const formulario = document.getElementById("formulario-dinamico");
    formulario.innerHTML = ""; // Limpiar formulario antes de agregar inputs

    agregarInput(formulario, 1);

    document.getElementById("nombre").disabled = true;
    document.getElementById("valorProducto").disabled = true;

    document.getElementById("btn-listo").style.display = "none";
    document.getElementById("btn-resolver").style.display = "inline";
    document.getElementById("btn-nuevo").style.display = "inline";
}

function agregarInput(container, index) {
    const div = document.createElement("div");
    div.classList.add("input-group");
    div.setAttribute("data-index", index);

    if (!agregarNombre) {
        const indice = document.createElement("span");
        indice.textContent = `Dato ${index}: `;
        div.appendChild(indice);
    }

    if (agregarNombre) {
        const inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.placeholder = "Nombre del producto";
        inputNombre.classList.add("input-nombre");
        div.appendChild(inputNombre);
    }

    if (tieneValorTotal) {
        const inputValor = document.createElement("input");
        inputValor.type = "number";
        inputValor.placeholder = "Valor total";
        inputValor.classList.add("input-valor");
        div.appendChild(inputValor);
    } else {
        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.placeholder = "Cantidad";
        inputCantidad.classList.add("input-cantidad");
        div.appendChild(inputCantidad);

        const inputCosto = document.createElement("input");
        inputCosto.type = "number";
        inputCosto.placeholder = "Costo unitario";
        inputCosto.classList.add("input-costo");
        div.appendChild(inputCosto);
    }

    container.appendChild(div);
    datos.push(div);

    actualizarBotonesAgregar();
}

function actualizarBotonesAgregar() {
    datos.forEach((div, index) => {
        const existingAddButton = div.querySelector(".btn-agregar");
        const existingDeleteButton = div.querySelector(".btn-eliminar");

        if (existingAddButton) existingAddButton.remove();
        if (existingDeleteButton) existingDeleteButton.remove();

        if (index === datos.length - 1) {
            const btnAgregar = document.createElement("button");
            btnAgregar.textContent = "Agregar";
            btnAgregar.classList.add("btn-agregar");
            btnAgregar.onclick = () => {
                agregarInput(div.parentElement, datos.length + 1);
                actualizarBotonesAgregar();
            };
            div.appendChild(btnAgregar);
        } else {
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("btn-eliminar");
            btnEliminar.onclick = () => eliminarInput(div);
            div.appendChild(btnEliminar);
        }
    });
}

function eliminarInput(div) {
    div.remove();
    datos = datos.filter(d => d !== div);
    actualizarIndices();
    actualizarBotonesAgregar();
}

function actualizarIndices() {
    datos.forEach((div, index) => {
        const span = div.querySelector("span");
        if (span) {
            span.textContent = `Dato ${index + 1}: `;
        }
    });
}

function calcularABC() {
    const valores = [];
    datos.forEach(div => {
        const nombre = agregarNombre ? div.querySelector(".input-nombre").value : `Dato ${datos.indexOf(div) + 1}`;
        let valorTotal;

        if (tieneValorTotal) {
            valorTotal = parseFloat(div.querySelector(".input-valor").value);
        } else {
            const cantidad = parseFloat(div.querySelector(".input-cantidad").value);
            const costo = parseFloat(div.querySelector(".input-costo").value);
            valorTotal = cantidad * costo;
        }

        valores.push({ nombre, valorTotal });
    });

    mostrarResultados(valores);
}

function mostrarResultados(valores) {
    valores.sort((a, b) => b.valorTotal - a.valorTotal);

    const total = valores.reduce((acc, item) => acc + item.valorTotal, 0);
    let porcentajeAcumulado = 0;

    const cuerpoTabla = document.getElementById("tabla-cuerpo");
    cuerpoTabla.innerHTML = "";

    valores.forEach((item, index) => {
        const porcentaje = (item.valorTotal / total) * 100;
        porcentajeAcumulado += porcentaje;

        const categoria = porcentajeAcumulado <= 75 ? "A" : porcentajeAcumulado <= 95 ? "B" : "C";

        const fila = `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.valorTotal.toFixed(2)}</td>
                <td>${porcentaje.toFixed(2)}%</td>
                <td>${porcentajeAcumulado.toFixed(2)}%</td>
                <td>${categoria}</td>
            </tr>
        `;
        cuerpoTabla.innerHTML += fila;
    });

    document.getElementById("tabla-resultados").style.display = "block";

    createCombinedChart(valores);
}

// Instancia del gráfico combinado
let combinedChartInstance = null;

function createCombinedChart(valores) {
    const ctx = document.getElementById("combinedChart").getContext("2d");

    if (combinedChartInstance) {
        combinedChartInstance.destroy();
    }

    const labels = valores.map(v => v.nombre);
    const dataBar = valores.map(v => v.valorTotal);
    const total = dataBar.reduce((acc, val) => acc + val, 0);
    const dataLine = [];
    let sumaAcumulada = 0;

    // Generar colores de las barras según las categorías
    const barColors = valores.map((item, index) => {
        sumaAcumulada += (item.valorTotal / total) * 100;
        if (sumaAcumulada <= 75) return 'rgba(75, 192, 192, 0.6)'; // Verde para categoría A
        if (sumaAcumulada <= 95) return 'rgba(255, 206, 86, 0.6)'; // Amarillo para categoría B
        return 'rgba(255, 99, 132, 0.6)'; // Rojo para categoría C
    });

    // Calcular porcentaje acumulado para la línea
    sumaAcumulada = 0;
    dataBar.forEach(value => {
        sumaAcumulada += (value / total) * 100;
        dataLine.push(sumaAcumulada);
    });

    combinedChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Valor Total',
                    data: dataBar,
                    backgroundColor: barColors,
                    borderColor: barColors.map(color => color.replace('0.6', '1')), // Borde más oscuro
                    borderWidth: 1
                },
                {
                    type: 'line',
                    label: 'Porcentaje Acumulado',
                    data: dataLine,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y-axis-2'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Valor Total' }
                },
                'y-axis-2': {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    title: { display: true, text: 'Porcentaje Acumulado' },
                    ticks: {
                        callback: value => value + '%'
                    }
                }
            }
        }
    });
}


function reiniciarFormulario() {
    document.getElementById("tabla-cuerpo").innerHTML = "";
    document.getElementById("tabla-resultados").style.display = "none";
    datos = [];
    document.getElementById("formulario-dinamico").innerHTML = "";
    document.getElementById("nombre").disabled = false;
    document.getElementById("valorProducto").disabled = false;
    document.getElementById("nombre").value = "";
    document.getElementById("valorProducto").value = "";
    agregarNombre = false;
    tieneValorTotal = false;

    if (combinedChartInstance) {
        combinedChartInstance.destroy();
        combinedChartInstance = null;
    }
}
