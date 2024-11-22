function calculateEOQValues(demand, orderCost, holdingCost, workingDays, leadTime) {
    const eoq = Math.sqrt((2 * demand * orderCost) / holdingCost);
    const numOrders = demand / eoq;
    var tiempo = 0;

    if (!leadTime) {
        leadTime = workingDays / numOrders;
    }
    else{
        tiempo = workingDays/(demand/eoq);
    }

    const avgDemandPerDay = demand / workingDays;
    const reorderPoint = avgDemandPerDay * leadTime;
    const orderingCost = numOrders * orderCost;
    const holdingCostTotal = (eoq / 2) * holdingCost;
    const totalCost = (demand * orderCost + (demand/eoq) * orderCost + (eoq/2) * holdingCost);

    return {
        eoq,
        numOrders,
        leadTime,
        reorderPoint,
        orderingCost,
        holdingCostTotal,
        totalCost,
        tiempo
    };
}
