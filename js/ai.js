async function runAIAnalysis(){

    const container = document.getElementById("aiContainer");

    container.innerHTML = "分析中...";

    const res = await fetch("http://localhost:3000/api/ai", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            products: getProducts(),
            sales: getSales(),
            expenses: getExpenses()
        })

    });

    const data = await res.json();

    container.innerHTML = `
        <div class="ai-box success">
            <pre>${data.result}</pre>
        </div>
    `;

}

document.addEventListener("DOMContentLoaded", runAIAnalysis);
