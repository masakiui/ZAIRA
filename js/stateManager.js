/* ==========================================
   ZAIRA
   State Manager（リアクティブ層）
========================================== */

"use strict";

/* ==========================================
   状態本体
========================================== */

const state = {

    products: getProducts(),
    sales: getSales(),
    expenses: getExpenses()

};

/* ==========================================
   リスナー登録
========================================== */

const listeners = {};

/* ==========================================
   監視登録
========================================== */

function subscribe(key, callback){

    if(!listeners[key]){

        listeners[key] = [];

    }

    listeners[key].push(callback);

}

/* ==========================================
   状態更新
========================================== */

function setState(key, value){

    state[key] = value;

    // dataManagerに保存
    if(key === "products") saveProducts(value);
    if(key === "sales") saveSales(value);
    if(key === "expenses") saveExpenses(value);

    // 通知
    notify(key);

}

/* ==========================================
   状態取得
========================================== */

function getState(key){

    return state[key];

}

/* ==========================================
   通知処理
========================================== */

function notify(key){

    if(listeners[key]){

        listeners[key].forEach(fn => fn(state[key]));

    }

}
