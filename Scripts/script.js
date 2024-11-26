document.getElementById('inventoryForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Capturar datos del formulario
    const weeklyDemand = parseFloat(document.getElementById('weeklyDemand').value);
    const leadTime = parseFloat(document.getElementById('leadTime').value);
    const stdDev = parseFloat(document.getElementById('stdDev').value);
    const zValue = parseFloat(document.getElementById('zValue').value);
  
    // Cálculos
    const demandPerWeek = weeklyDemand / 4; // Conversión si necesario
    const stdDevLeadTime = stdDev * Math.sqrt(leadTime); // Desviación durante tiempo de entrega
    const safetyStock = zValue * stdDevLeadTime; // Inventario de seguridad
  
    // Mostrar resultados
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <h3>Resultados</h3>
      <p><strong>Demanda semanal promedio:</strong> ${demandPerWeek.toFixed(2)} unidades</p>
      <p><strong>Desviación estándar durante el tiempo de entrega:</strong> ${stdDevLeadTime.toFixed(2)} unidades</p>
      <p><strong>Inventario de seguridad:</strong> ${safetyStock.toFixed(2)} unidades</p>
    `;
    resultDiv.style.display = 'block';
  });
  