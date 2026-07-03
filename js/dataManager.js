/* ==========================================
   ZAIRA
   Data Manager（統合データ層）
========================================== */

"use strict";

/* ==========================================
   汎用ユーティリティ
========================================== */

function getData(key) {

    try {

        return JSON.parse(localStorage.getItem(key)) || [];

    } catch (e) {

        console.error("getData error:", key, e);

        return [];

    }

}

function setData(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

}

/* ==========================================
   商品データ
========================================== */

function getProducts() {

    return getData("products");

}

function saveProducts(products) {

    setData("products", products);

}

/* ==========================================
   売上データ
========================================== */

function getSales() {

    return getData("sales");

}

function saveSales(sales) {

    setData("sales", sales);

}

/* ==========================================
   経費データ
========================================== */

function getExpenses() {

    return getData("expenses");

}

function saveExpenses(expenses) {

    setData("expenses", expenses);

}

/* ==========================================
   ID生成
========================================== */

function createId() {

    return "id_" + Math.random().toString(36).substr(2, 9);

}

/* ==========================================
   通貨フォーマット
========================================== */

function yen(value) {

    return "¥" + Number(value || 0).toLocaleString();

}

/* ==========================================
   メッセージUI（簡易通知）
========================================== */

function showMessage(text) {

    console.log("[ZAIRA]", text);

    alert(text);

}

/* ==========================================
   確認ダイアログ
========================================== */

function confirmAction(text) {

    return confirm(text);

}
