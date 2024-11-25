let datos = [];
let agregarNombre = false;
let tieneValorTotal = false;

function configurarFormulario() {
    agregarNombre = document.getElementById("nombre").value === "si";
    tieneValorTotal = document.getElementById("valorProducto").value === "si";

    const formulario = document.getElementById("formulario-dinamico");
    formulario.innerHTML = "";  // Limpiar formulario antes de agregar inputs

    // Crear el primer input
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

        // Remover botones existentes para evitar duplicados
        if (existingAddButton) existingAddButton.remove();
        if (existingDeleteButton) existingDeleteButton.remove();

        // Agregar botón Agregar solo al último input
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
            // Agregar botón Eliminar a los inputs que no sean el último
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

    createParetoChart(valores.map(v => v.nombre), valores.map(v => v.valorTotal));
    createPonderacionChart(valores);
}

// Variables para guardar las instancias de los gráficos
let paretoChartInstance = null;
let ponderacionChartInstance = null;

function reiniciarFormulario() {
    // Limpiar la tabla de resultados y ocultarla
    document.getElementById("tabla-cuerpo").innerHTML = "";
    document.getElementById("tabla-resultados").style.display = "none";

    // Limpiar los datos en el array y el contenedor del formulario
    datos = [];
    document.getElementById("formulario-dinamico").innerHTML = "";

    // Restaurar los selects y resetear sus valores
    const selectNombre = document.getElementById("nombre");
    const selectValorProducto = document.getElementById("valorProducto");
    selectNombre.disabled = false;
    selectNombre.value = "";  // Restablece el valor del select
    selectValorProducto.disabled = false;
    selectValorProducto.value = "";

    // Resetear las variables de configuración
    agregarNombre = false;
    tieneValorTotal = false;

    // Mostrar el botón "Listo" y ocultar los botones de acción
    document.getElementById("btn-listo").style.display = "inline";
    document.getElementById("btn-resolver").style.display = "none";
    document.getElementById("btn-nuevo").style.display = "none";

    // Destruir las instancias existentes de los gráficos, si existen
    if (paretoChartInstance) {
        paretoChartInstance.destroy();
        paretoChartInstance = null;
    }

    if (ponderacionChartInstance) {
        ponderacionChartInstance.destroy();
        ponderacionChartInstance = null;
    }
}

function createParetoChart(labels, data) {
    const ctx = document.getElementById("paretoChart").getContext("2d");
    // Destruir el gráfico anterior si existe
    if (paretoChartInstance) {
        paretoChartInstance.destroy();
    }
    paretoChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{ label: 'Valor Total', data }]
        },
        options: {
            responsive: true
        }
    });
}

function createPonderacionChart(valores) {
    const ctx = document.getElementById("ponderacionChart").getContext("2d");
    const total = valores.reduce((acc, item) => acc + item.valorTotal, 0);
    const acumulado = [];
    let sumaAcumulada = 0;

    valores.forEach(item => {
        sumaAcumulada += (item.valorTotal / total) * 100;
        acumulado.push(sumaAcumulada);
    });

    // Destruir el gráfico anterior si existe
    if (ponderacionChartInstance) {
        ponderacionChartInstance.destroy();
    }

    ponderacionChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: valores.map(v => v.nombre),
            datasets: [{
                label: 'Porcentaje Acumulado',
                data: acumulado,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true
        }
    });
}
