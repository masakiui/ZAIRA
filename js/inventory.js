/* ==========================================
   ZAIRA
   在庫管理
========================================== */

"use strict";

/* ==========================================
   データ取得
========================================== */

let products = loadData("products") || [];

/* ==========================================
   DOM
========================================== */

const inventoryTable = document.getElementById("inventoryTable");

const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");
const lowStockCount = document.getElementById("lowStockCount");
const orderRecommend = document.getElementById("orderRecommend");

const searchInput = document.getElementById("searchProduct");

/* ==========================================
   初期化
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderInventory(products);

    updateSummary();

});

/* ==========================================
   一覧表示
========================================== */

function renderInventory(data){

    inventoryTable.innerHTML = "";

    data.forEach(product=>{

        const tr = document.createElement("tr");

        const previousOrder = product.previousOrder ?? 0;

        const sold = product.sold ?? 0;

        let status = "正常";
        let statusClass = "status-good";

        if(product.stock <= product.minimumStock){

            status = "在庫不足";
            statusClass = "status-danger";

        }

        let aiComment = "在庫は十分です。";

        if(product.stock <= product.minimumStock){

            aiComment = "発注をおすすめします。";

            tr.classList.add("low-stock");

        }

        tr.innerHTML = `

            <td>${product.name}</td>

            <td>${previousOrder}</td>

            <td>${sold}</td>

            <td class="stock-number">${product.stock}</td>

            <td>${product.minimumStock}</td>

            <td class="${statusClass}">
                ${status}
            </td>

            <td class="ai-comment">
                ${aiComment}
            </td>

        `;

        inventoryTable.appendChild(tr);

    });

}

/* ==========================================
   サマリー更新
========================================== */

function updateSummary(){

    totalProducts.textContent = products.length;

    let stock = 0;

    let low = 0;

    products.forEach(product=>{

        stock += product.stock;

        if(product.stock <= product.minimumStock){

            low++;

        }

    });

    totalStock.textContent = stock;

    lowStockCount.textContent = low;

    orderRecommend.textContent = low;

}

/* ==========================================
   商品検索
========================================== */

searchInput.addEventListener("input", ()=>{

    const keyword = searchInput.value.toLowerCase();

    const result = products.filter(product=>{

        return product.name.toLowerCase().includes(keyword);

    });

    renderInventory(result);

});
