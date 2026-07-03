"use strict";

let sales = getSales();
let expenses = getExpenses();

document.addEventListener("DOMContentLoaded", () => {

    renderExpenses();

    updateSummary();

});

function updateSummary(){

    const totalSales = sales.reduce((a,b)=>a+b.total,0);

    const totalExpense = expenses.reduce((a,b)=>a+b.amount,0);

    const profit = totalSales - totalExpense;

    document.getElementById("totalSales").textContent = yen(totalSales);
    document.getElementById("totalExpense").textContent = yen(totalExpense);
    document.getElementById("netProfit").textContent = yen(profit);

}
