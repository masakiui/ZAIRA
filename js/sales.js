/* ==========================================
   ZAIRA
   売上管理
========================================== */

"use strict";

/* ==========================================
   データ
========================================== */

let products = loadData("products") || [];
let sales = loadData("sales") || [];

/* ==========================================
   DOM
========================================== */

const salesForm = document.getElementById("salesForm");
const productSelect = document.getElementById("productSelect");
const salesTable = document.getElementById("salesTable");

const todaySales = document.getElementById("todaySales");
const todayCount = document.getElementById("todayCount");
const averagePrice = document.getElementById("averagePrice");

const saleDate = document.getElementById("saleDate");

/* ==========================================
   初期化
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    saleDate.valueAsDate = new Date();

    loadProducts();

    renderSales();

    updateSummary();

});

/* ==========================================
   商品読込
========================================== */

function loadProducts(){

    productSelect.innerHTML =
        '<option value="">商品を選択してください</option>';

    products.forEach(product=>{

        productSelect.innerHTML +=
        `<option value="${product.id}">
            ${product.name}
        </option>`;

    });

}

/* ==========================================
   売上登録
========================================== */

salesForm.addEventListener("submit", function(e){

    e.preventDefault();

    const id = productSelect.value;

    const quantity = Number(document.getElementById("quantity").value);

    const payment = document.getElementById("payment").value;

    const memo = document.getElementById("memo").value;

    const product = products.find(p=>p.id===id);

    if(!product){

        showMessage("商品を選択してください。");

        return;

    }

    if(quantity > product.stock){

        showMessage("在庫数が不足しています。");

        return;

    }

    product.stock -= quantity;

    product.sold = (product.sold || 0) + quantity;

    product.lastSaleDate = saleDate.value;

    const sale = {

        id:createId(),

        date:saleDate.value,

        productId:product.id,

        productName:product.name,

        quantity,

        price:product.price,

        total:product.price * quantity,

        payment,

        memo

    };

    sales.push(sale);

    saveData("products",products);

    saveData("sales",sales);

    salesForm.reset();

    saleDate.valueAsDate = new Date();

    renderSales();

    updateSummary();

    showMessage("売上を登録しました。");

});

/* ==========================================
   売上一覧
========================================== */

function renderSales(){

    salesTable.innerHTML = "";

    sales.forEach(sale=>{

        const tr = document.createElement("tr");

        tr.innerHTML = `

        <td>${sale.date}</td>

        <td>${sale.productName}</td>

        <td class="quantity">${sale.quantity}</td>

        <td class="money">${yen(sale.price)}</td>

        <td class="money">${yen(sale.total)}</td>

        <td>
            <span class="payment">
                ${sale.payment}
            </span>
        </td>

        <td class="action-buttons">

            <button
                onclick="deleteSale('${sale.id}')"
                class="btn-danger">

                削除

            </button>

        </td>

        `;

        salesTable.appendChild(tr);

    });

}

/* ==========================================
   削除
========================================== */

function deleteSale(id){

    if(!confirmAction("この売上を削除しますか？")){

        return;

    }

    const sale = sales.find(s=>s.id===id);

    if(sale){

        const product = products.find(p=>p.id===sale.productId);

        if(product){

            product.stock += sale.quantity;

            product.sold -= sale.quantity;

        }

    }

    sales = sales.filter(s=>s.id!==id);

    saveData("sales",sales);

    saveData("products",products);

    renderSales();

    updateSummary();

}

/* ==========================================
   サマリー
========================================== */

function updateSummary(){

    const today = new Date().toLocaleDateString("sv-SE");

    let total = 0;

    let count = 0;

    sales.forEach(sale=>{

        if(sale.date===today){

            total += sale.total;

            count++;

        }

    });

    todaySales.textContent = yen(total);

    todayCount.textContent = count;

    averagePrice.textContent =
        count===0
        ? yen(0)
        : yen(Math.round(total/count));

}
