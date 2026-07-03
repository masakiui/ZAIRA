import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/* =========================
   ZAIRA AI API
========================= */

app.post("/api/ai", async (req, res) => {

    try {

        const { sales, products, expenses } = req.body;

        const prompt = `
あなたは経営分析AIです。

以下のデータをもとに
①経営状況の要約
②問題点
③改善提案
④今すぐやるべき行動
を日本語で簡潔に出してください。

# 売上データ
${JSON.stringify(sales)}

# 商品データ
${JSON.stringify(products)}

# 経費データ
${JSON.stringify(expenses)}
`;

        const response = await client.responses.create({

            model: "gpt-4.1-mini",

            input: prompt

        });

        res.json({
            result: response.output_text
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "AI生成に失敗しました"
        });

    }

});

app.listen(3000, () => {

    console.log("ZAIRA AI server running on port 3000");

});
