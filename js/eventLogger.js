/* ==========================================
   ZAIRA
   Event Logger（経営ログ基盤）
========================================== */

"use strict";

/* ==========================================
   ログ取得
========================================== */

function getEventLogs(){

    return getData("eventLogs") || [];

}

/* ==========================================
   ログ保存
========================================== */

function saveEventLogs(logs){

    setData("eventLogs", logs);

}

/* ==========================================
   イベント記録
========================================== */

function logEvent(eventName, payload = {}){

    const logs = getEventLogs();

    const log = {

        id: createId(),

        event: eventName,

        payload: payload,

        timestamp: new Date().toISOString()

    };

    logs.push(log);

    saveEventLogs(logs);

    console.log("[LOG]", log);

}
