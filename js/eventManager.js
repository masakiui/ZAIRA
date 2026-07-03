/* ==========================================
   ZAIRA
   Event Manager（業務イベント層）
========================================== */

"use strict";

/* ==========================================
   イベントリスト
========================================== */

const eventListeners = {};

/* ==========================================
   イベント登録
========================================== */

function on(eventName, callback){

    if(!eventListeners[eventName]){

        eventListeners[eventName] = [];

    }

    eventListeners[eventName].push(callback);

}

/* ==========================================
   イベント発火
========================================== */

function emit(eventName, payload = null){

    console.log(`[EVENT] ${eventName}`, payload);

    if(eventListeners[eventName]){

        eventListeners[eventName].forEach(fn => fn(payload));

    }

    // AI連動フック（重要）
    triggerAI(eventName, payload);

}

/* ==========================================
   AI連動トリガー
========================================== */

function triggerAI(eventName, payload){

    // 必要最低限だけAIを呼ぶ（コスト制御）

    const importantEvents = [

        "SALE_CREATED",
        "LOW_STOCK",
        "PROFIT_DROP",
        "DEAD_STOCK"

    ];

    if(!importantEvents.includes(eventName)) return;

    if(typeof runAIAnalysis === "function"){

        console.log("[AI] triggered by event:", eventName);

        runAIAnalysis();

    }

}
function emit(eventName, payload = null){

    console.log(`[EVENT] ${eventName}`, payload);

    /* 既存リスナー処理 */
    if(eventListeners[eventName]){

        eventListeners[eventName].forEach(fn => fn(payload));

    }

    /* 🔥 追加：ログ保存 */
    if(typeof logEvent === "function"){

        logEvent(eventName, payload);

    }

    /* AIトリガー */
    triggerAI(eventName, payload);

}
