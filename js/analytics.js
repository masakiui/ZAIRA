/* ==========================================
   ZAIRA
   分析モジュール
========================================== */

"use strict";

/* ==========================================
   データ取得
========================================== */

const products = loadData("products") || [];
const sales = loadData("sales") || [];
const expenses = loadData("expenses") || [];

/* ==========================================
   DOM
========================================== */

const kpiSales = document.getElementById("kpiSales");
const kpiProfit = document.getElementById("kpiProfit");
const kpiCount = document.getElementById("kpiCount");
const kpiTurnover = document.getElementById("kpiTurnover");

const rankingTable = document.getElementById("rankingTable");
const alertTable = document.getElementById("alertTable");
const trendBox = document.getElementById("trendBox");

/* ==========================================
   初期化
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderKPI();

    renderRanking();

    renderAlerts();

    renderTrend();

});

/* ==========================================
   KPI計算
========================================== */

function renderKPI(){

    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);

    const totalCost = sales.reduce((sum, s) => {
        const p = products.find(p => p.id === s.productId);
        const cost = p?.cost || 0;
        return sum + (cost * s.quantity);
    }, 0);

    const totalProfit = totalSales - totalCost;

    const turnover = calculateTurnover();

    kpiSales.textContent = yen(totalSales);

    kpiProfit.textContent = yen(totalProfit);

    kpiCount.textContent = sales.length;

    kpiTurnover.textContent = turnover.toFixed(1) + "%";
}

/* ==========================================
   売上ランキング
========================================== */

function renderRanking(){

    const map = {};

    sales.forEach(s => {

        if(!map[s.productId]){

            map[s.productId] = {
                name: s.productName,
                total: 0,
                qty: 0
            };

        }

        map[s.productId].total += s.total;
        map[s.productId].qty += s.quantity;

    });

    const ranking = Object.values(map)
        .sort((a,b) => b.total - a.total);

    rankingTable.innerHTML = "";

    ranking.forEach((item, index) => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${yen(item.total)}</td>
            <td>${item.qty}</td>

        `;

        rankingTable.appendChild(tr);

    });

}

/* ==========================================
   在庫アラート
========================================== */

function renderAlerts(){

    alertTable.innerHTML = "";

    products.forEach(p => {

        if(p.stock <= p.minimumStock){

            const tr = document.createElement("tr");

            const status =
                p.stock === 0 ? "在庫切れ" : "在庫不足";

            tr.innerHTML = `

                <td>${p.name}</td>
                <td>${p.stock}</td>
                <td>${p.minimumStock}</td>
                <td class="loss">${status}</td>

            `;

            alertTable.appendChild(tr);

        }

    });

}

/* ==========================================
   トレンド（簡易月別）
========================================== */

function renderTrend(){

    const map = {};

    sales.forEach(s => {

        const month = (s.date || "").slice(0,7);

        if(!map[month]) map[month] = 0;

        map[month] += s.total;

    });

    const months = Object.keys(map).sort();

    let html = "";

    months.forEach(m => {

        html += `
            <div>
                📅 ${m} ： <b>${yen(map[m])}</b>
            </div>
        `;

    });

    trendBox.innerHTML = html || "データがありません";
}

/* ==========================================
   在庫回転率（簡易）
========================================== */

function calculateTurnover(){

    const totalStock = products.reduce((sum,p) => sum + p.stock, 0);

    const sold = products.reduce((sum,p) => sum + (p.sold || 0), 0);

    if(totalStock === 0) return 0;

    return (sold / (sold + totalStock)) * 100;
}
