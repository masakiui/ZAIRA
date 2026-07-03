"use strict";

let products = getProducts();

document.addEventListener("DOMContentLoaded", () => {

    renderInventory(products);

    updateSummary();

});

function renderInventory(data){

    const table = document.getElementById("inventoryTable");

    table.innerHTML = "";

    data.forEach(product => {

        const tr = document.createElement("tr");

        let status = "正常";

        let statusClass = "status-good";

        if(product.stock <= product.minimumStock){

            status = "在庫不足";

            statusClass = "status-danger";

        }

        tr.innerHTML = `

            <td>${product.name}</td>
            <td>${product.previousOrder || 0}</td>
            <td>${product.sold || 0}</td>
            <td class="stock-number">${product.stock}</td>
            <td>${product.minimumStock}</td>
            <td class="${statusClass}">${status}</td>

        `;

        table.appendChild(tr);

    });

}

function updateSummary(){

    const totalProducts = document.getElementById("totalProducts");
    const totalStock = document.getElementById("totalStock");
    const lowStockCount = document.getElementById("lowStockCount");

    totalProducts.textContent = products.length;

    totalStock.textContent =
        products.reduce((sum,p)=>sum+p.stock,0);

    lowStockCount.textContent =
        products.filter(p=>p.stock<=p.minimumStock).length;

}
