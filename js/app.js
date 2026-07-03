/* ==========================================
   ZAIRA
   あなたの会社に、もう一人。
   共通JavaScript
========================================== */

"use strict";

/* ==========================================
   ZAIRA App
========================================== */

const ZAIRA = {

    version: "0.1.0",

    appName: "ZAIRA",

    init() {

        console.log(`${this.appName} v${this.version} 起動`);

        this.showToday();

    },

    showToday() {

        const today = document.getElementById("today");

        if (!today) return;

        const now = new Date();

        today.textContent = now.toLocaleDateString("ja-JP");

    }

};

/* ==========================================
   Notification
========================================== */

function showMessage(message) {

    alert(message);

}

/* ==========================================
   Confirm
========================================== */

function confirmAction(message) {

    return confirm(message);

}

/* ==========================================
   Number Format
========================================== */

function yen(value) {

    return "¥" + Number(value).toLocaleString();

}

/* ==========================================
   Date Format
========================================== */

function formatDate(date = new Date()) {

    return date.toLocaleDateString("ja-JP");

}

/* ==========================================
   Time Format
========================================== */

function formatTime(date = new Date()) {

    return date.toLocaleTimeString("ja-JP");

}

/* ==========================================
   Loading
========================================== */

function startLoading() {

    console.log("Loading...");

}

function endLoading() {

    console.log("Loading Finished");

}

/* ==========================================
   Theme
========================================== */

function toggleDarkMode() {

    document.body.classList.toggle("dark");

}

/* ==========================================
   LocalStorage
========================================== */

function saveData(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

}

function loadData(key) {

    const data = localStorage.getItem(key);

    if (!data) return null;

    return JSON.parse(data);

}

function removeData(key) {

    localStorage.removeItem(key);

}

/* ==========================================
   UUID
========================================== */

function createId() {

    return crypto.randomUUID();

}

/* ==========================================
   DOM Ready
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    ZAIRA.init();

});
