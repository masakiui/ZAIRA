/* ==========================================
   ZAIRA
   商品管理
========================================== */

"use strict";

/* ===========================
   データ
=========================== */

let products = loadData("products") || [];
let editId = null;

/* ===========================
   DOM
=========================== */

const form = document.getElementById("productForm");
const table = document.getElementById("productTable");

/* ===========================
   初期化
=========================== */

document.addEventListener("DOMContentLoaded", () => {

    renderProducts();

});

/* ===========================
   商品登録
=========================== */

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const product = {

        id: editId ?? createId(),

        name: document.getElementById("productName").value,

        jan: document.getElementById("janCode").value,

        category: document.getElementById("category").value,

        price: Number(document.getElementById("price").value),

        cost: Number(document.getElementById("cost").value),

        stock: Number(document.getElementById("stock").value),

        minimumStock: Number(document.getElementById("minimumStock").value),

        location: document.getElementById("location").value,

        memo: document.getElementById("memo").value

    };

    if (editId) {

        const index = products.findIndex(p => p.id === editId);

        products[index] = product;

        editId = null;

    } else {

        products.push(product);

    }

    saveData("products", products);

    form.reset();

    renderProducts();

});

/* ===========================
   一覧表示
=========================== */

function renderProducts() {

    table.innerHTML = "";

    products.forEach(product => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${product.id.substring(0,8)}</td>

            <td>${product.name}</td>

            <td>${product.stock}</td>

            <td>${yen(product.price)}</td>

            <td>${yen(product.cost)}</td>

            <td>${product.category}</td>

            <td>

                <button onclick="editProduct('${product.id}')">

                    編集

                </button>

                <button class="btn-danger"

                    onclick="deleteProduct('${product.id}')">

                    削除

                </button>

            </td>

        `;

        table.appendChild(tr);

    });

}

/* ===========================
   編集
=========================== */

function editProduct(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    editId = id;

    document.getElementById("productName").value = product.name;

    document.getElementById("janCode").value = product.jan;

    document.getElementById("category").value = product.category;

    document.getElementById("price").value = product.price;

    document.getElementById("cost").value = product.cost;

    document.getElementById("stock").value = product.stock;

    document.getElementById("minimumStock").value = product.minimumStock;

    document.getElementById("location").value = product.location;

    document.getElementById("memo").value = product.memo;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ===========================
   削除
=========================== */

function deleteProduct(id) {

    if (!confirmAction("この商品を削除しますか？")) {

        return;

    }

    products = products.filter(p => p.id !== id);

    saveData("products", products);

    renderProducts();

}

/* ===========================
   検索（将来用）
=========================== */

function searchProducts(keyword){

    return products.filter(product =>

        product.name.includes(keyword)

    );

}
