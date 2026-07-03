"use strict";

let products = getProducts();
let sales = getSales();

const salesForm = document.getElementById("salesForm");

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    renderSales();

    updateSummary();

});

function loadProducts(){

    const select = document.getElementById("productSelect");

    select.innerHTML = '<option value="">選択</option>';

    products.forEach(p => {

        select.innerHTML += `
            <option value="${p.id}">
                ${p.name}
            </option>
        `;

    });

}

salesForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const productId = document.getElementById("productSelect").value;

    const qty = Number(document.getElementById("quantity").value);

    const product = products.find(p => p.id === productId);

    if(!product) return;

    if(product.stock < qty){

        showMessage("在庫不足");

        return;

    }

    // 在庫更新
    product.stock -= qty;
    product.sold = (product.sold || 0) + qty;

    const sale = {

        id: createId(),
        date: document.getElementById("saleDate").value,
        productId,
        productName: product.name,
        quantity: qty,
        price: product.price,
        total: product.price * qty,
        payment: document.getElementById("payment").value

    };

    sales.push(sale);

    saveProducts(products);
    saveSales(sales);

    renderSales();
    updateSummary();

    showMessage("売上登録完了");

});

function renderSales(){

    const table = document.getElementById("salesTable");

    table.innerHTML = "";

    sales.forEach(s => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${s.date}</td>
            <td>${s.productName}</td>
            <td>${s.quantity}</td>
            <td>${yen(s.price)}</td>
            <td>${yen(s.total)}</td>
            <td>${s.payment}</td>
        `;

        table.appendChild(tr);

    });

}

function updateSummary(){

    const today = new Date().toISOString().slice(0,10);

    let total = 0;
    let count = 0;

    sales.forEach(s => {

        if(s.date === today){

            total += s.total;
            count++;

        }

    });

    document.getElementById("todaySales").textContent = yen(total);
    document.getElementById("todayCount").textContent = count;

}
