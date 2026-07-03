/* ==========================================
   ZAIRA
   会計管理
========================================== */

"use strict";

/* ==========================================
   データ
========================================== */

let sales = loadData("sales") || [];
let expenses = loadData("expenses") || [];

/* ==========================================
   DOM
========================================== */

const expenseForm = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");
const monthlyTable = document.getElementById("monthlyTable");

const totalSalesEl = document.getElementById("totalSales");
const totalProfitEl = document.getElementById("totalProfit");
const totalExpenseEl = document.getElementById("totalExpense");
const netProfitEl = document.getElementById("netProfit");

/* ==========================================
   初期化
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("expenseDate").valueAsDate = new Date();

    renderExpenses();

    renderMonthly();

    updateSummary();

});

/* ==========================================
   経費登録
========================================== */

expenseForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const expense = {

        id: createId(),

        date: document.getElementById("expenseDate").value,

        name: document.getElementById("expenseName").value,

        amount: Number(document.getElementById("expenseAmount").value),

        payment: document.getElementById("expensePayment").value,

        memo: document.getElementById("expenseMemo").value

    };

    expenses.push(expense);

    saveData("expenses", expenses);

    expenseForm.reset();

    document.getElementById("expenseDate").valueAsDate = new Date();

    renderExpenses();

    renderMonthly();

    updateSummary();

    showMessage("経費を登録しました。");

});

/* ==========================================
   経費一覧
========================================== */

function renderExpenses() {

    expenseTable.innerHTML = "";

    expenses.forEach(exp => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${exp.date}</td>

            <td>${exp.name}</td>

            <td class="money">${yen(exp.amount)}</td>

            <td>${exp.payment}</td>

            <td>${exp.memo || ""}</td>

            <td>

                <button class="btn-danger"
                    onclick="deleteExpense('${exp.id}')">

                    削除

                </button>

            </td>

        `;

        expenseTable.appendChild(tr);

    });

}

/* ==========================================
   削除
========================================== */

function deleteExpense(id) {

    if (!confirmAction("この経費を削除しますか？")) return;

    expenses = expenses.filter(e => e.id !== id);

    saveData("expenses", expenses);

    renderExpenses();

    renderMonthly();

    updateSummary();

}

/* ==========================================
   サマリー更新
========================================== */

function updateSummary() {

    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const totalProfit = sales.reduce((sum, s) => sum + (s.price - (s.price * 0.6)) * s.quantity, 0);

    const netProfit = totalSales - totalExpense;

    totalSalesEl.textContent = yen(totalSales);

    totalExpenseEl.textContent = yen(totalExpense);

    totalProfitEl.textContent = yen(totalProfit);

    netProfitEl.textContent = yen(netProfit);

}

/* ==========================================
   月次集計
========================================== */

function renderMonthly() {

    monthlyTable.innerHTML = "";

    const map = {};

    sales.forEach(s => {

        const month = s.date?.slice(0, 7);

        if (!map[month]) {

            map[month] = { sales: 0 };

        }

        map[month].sales += s.total;

    });

    expenses.forEach(e => {

        const month = e.date?.slice(0, 7);

        if (!map[month]) {

            map[month] = { sales: 0 };

        }

        map[month].expense = (map[month].expense || 0) + e.amount;

    });

    Object.keys(map).forEach(month => {

        const salesTotal = map[month].sales || 0;

        const expenseTotal = map[month].expense || 0;

        const profit = salesTotal - expenseTotal;

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${month}</td>

            <td class="money">${yen(salesTotal)}</td>

            <td class="${profit >= 0 ? 'profit' : 'loss'}">

                ${yen(profit)}

            </td>

            <td class="money">${yen(expenseTotal)}</td>

            <td class="${profit >= 0 ? 'profit' : 'loss'}">

                ${yen(profit)}

            </td>

        `;

        monthlyTable.appendChild(tr);

    });

}
