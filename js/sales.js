"use strict";

/* ==========================================
   初期データ（state経由）
========================================== */

let products = getState("products");
let sales = getState("sales");

const salesForm = document.getElementById("salesForm");

/* ==========================================
   初期化
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    renderSales();

    updateSummary();

    /* state監視（リアルタイム反映） */
    subscribe("sales", (data) => {
        sales = data;
        renderSales();
        updateSummary();
    });

    subscribe("products", (data) => {
        products = data;
        loadProducts();
    });

});

/* ==========================================
   商品ロード
========================================== */

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

/* ==========================================
   売上登録
========================================== */

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

    /* ==========================================
       在庫更新（state経由）
    ========================================== */

    const updatedProducts = products.map(p => {

        if(p.id === productId){

            return {
                ...p,
                stock: p.stock - qty,
                sold: (p.sold || 0) + qty
            };

        }

        return p;

    });

    setState("products", updatedProducts);

    /* ==========================================
       売上作成
    ========================================== */

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

    const updatedSales = [...sales, sale];

    setState("sales", updatedSales);

    /* ==========================================
       イベント発火（AI連動）
    ========================================== */

    emit("SALE_CREATED", {
        productId,
        productName: product.name,
        quantity: qty,
        total: sale.total
    });

    showMessage("売上登録完了");

});

/* ==========================================
   表示
========================================== */

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

/* ==========================================
   今日サマリー
========================================== */

function updateSummary(){

    const today = new Date().toISOString().slice(0,10);

    const todaySales = sales.filter(s => s.date === today);

    const total = todaySales.reduce((sum, s) => sum + s.total, 0);

    document.getElementById("todaySales").textContent = yen(total);
    document.getElementById("todayCount").textContent = todaySales.length;

}
