document.getElementById('calcularBtn').addEventListener('click', function() {
    const costoMantener = 0; // Costo de mantener será 0
    const costoOrdenar = parseFloat(document.getElementById('costoOrdenar').value);
    const semanasInput = document.getElementById('semanas').value;
    
    // Convertir las necesidades brutas a un array de números
    const necesidadesBrutas = semanasInput.split(',').map(num => parseInt(num.trim()));
    
    let totalCostoOrdenar = 0;
    let inventarioDisponible = 0;
    let ordenes = [];

    for (let i = 0; i < necesidadesBrutas.length; i++) {
        const necesidadBruta = necesidadesBrutas[i];
        const necesidadNeta = necesidadBruta - inventarioDisponible;

        // Realizar el pedido para la necesidad neta
        if (i > 0) { // No hay pedido en la semana 1
            ordenes.push(necesidadBruta);
            totalCostoOrdenar += costoOrdenar;
        } else {
            ordenes.push(necesidadBruta);
        }

        // Actualizar el inventario
        inventarioDisponible = necesidadNeta;

        // El costo de mantener se ha establecido como cero
    }

    // Calcular costo total de inventario
    const costoTotalInventario = totalCostoOrdenar; // Solo los costos de ordenar

    // Mostrar resultados
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <h2>Resultados</h2>
        <p>Total de Órdenes: ${ordenes.length}</p>
        <p>Costos de Ordenar: $${totalCostoOrdenar.toFixed(2)}</p>
        <p>Costos de Mantener: $${(0).toFixed(2)}</p>
        <p>Costo Total de Inventario: $${costoTotalInventario.toFixed(2)}</p>
    `;
});
