/* ==========================================
   ZAIRA AI ENGINE
   擬似経営AI（ルールベース）
========================================== */

"use strict";

/* ==========================================
   データ取得
========================================== */

const products = loadData("products") || [];
const sales = loadData("sales") || [];
const expenses = loadData("expenses") || [];

/* ==========================================
   初期化
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    runAIAnalysis();

});

/* ==========================================
   メインAI分析
========================================== */

function runAIAnalysis(){

    const insights = [];

    insights.push(...checkLowStock());
    insights.push(...checkBestSellers());
    insights.push(...checkDeadStock());
    insights.push(...checkProfitability());
    insights.push(...generateMarketingTips());

    renderAI(insights);

}

/* ==========================================
   在庫不足検知
========================================== */

function checkLowStock(){

    const results = [];

    products.forEach(p => {

        if(p.stock <= p.minimumStock){

            results.push({

                type: "danger",

                title: "在庫アラート",

                message: `${p.name} の在庫が危険水準です（残り ${p.stock}）`

            });

        }

    });

    return results;
}

/* ==========================================
   売れ筋分析
========================================== */

function checkBestSellers(){

    const map = {};

    sales.forEach(s => {

        if(!map[s.productId]){

            map[s.productId] = {
                name: s.productName,
                qty: 0
            };

        }

        map[s.productId].qty += s.quantity;

    });

    const sorted = Object.values(map)
        .sort((a,b) => b.qty - a.qty);

    const top = sorted[0];

    if(!top) return [];

    return [{

        type: "success",

        title: "売れ筋商品",

        message: `${top.name} が最も売れています（${top.qty}個）`

    }];
}

/* ==========================================
   死に筋商品検出
========================================== */

function checkDeadStock(){

    const results = [];

    products.forEach(p => {

        const sold = p.sold || 0;

        if(sold === 0 && p.stock > 0){

            results.push({

                type: "warning",

                title: "改善提案",

                message: `${p.name} は売上がありません。値下げ or SNS告知を推奨`

            });

        }

    });

    return results;
}

/* ==========================================
   利益率チェック
========================================== */

function checkProfitability(){

    const totalSales = sales.reduce((sum,s)=>sum+s.total,0);

    const totalCost = sales.reduce((sum,s)=>{

        const p = products.find(p=>p.id===s.productId);

        return sum + ((p?.cost || 0) * s.quantity);

    },0);

    const profitRate = totalSales === 0
        ? 0
        : ((totalSales - totalCost) / totalSales) * 100;

    if(profitRate < 10){

        return [{

            type: "danger",

            title: "利益警告",

            message: `利益率が低いです（${profitRate.toFixed(1)}%）`

        }];

    }

    return [{

        type: "success",

        title: "利益状況",

        message: `利益率は安定しています（${profitRate.toFixed(1)}%）`

    }];

}

/* ==========================================
   マーケティング提案（SNS広告生成）
========================================== */

function generateMarketingTips(){

    const tips = [];

    const top = sales.reduce((map,s)=>{

        map[s.productName] = (map[s.productName] || 0) + s.quantity;

        return map;

    },{});

    const best = Object.entries(top)
        .sort((a,b)=>b[1]-a[1])[0];

    if(best){

        tips.push({

            type: "info",

            title: "SNS投稿案（LINE / X）",

            message:
`🔥人気商品情報🔥

今もっとも売れているのは「${best[0]}」！

在庫わずかの可能性あり⚠

気になる方はお早めに！`
        });

    }

    return tips;
}

/* ==========================================
   表示
========================================== */

function renderAI(insights){

    const container = document.getElementById("aiContainer");

    if(!container) return;

    container.innerHTML = "";

    insights.forEach(i => {

        const div = document.createElement("div");

        div.className = `ai-box ${i.type}`;

        div.innerHTML = `

            <h3>${i.title}</h3>

            <p>${i.message}</p>

        `;

        container.appendChild(div);

    });

}
