"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const generative_ai_1 = require("@google/generative-ai");
const pergunta_1 = require("./pergunta");
async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY não encontrada no .env");
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let prompt = "Você é um assistente do site Trilhas Brasil e deve responder somente sobre trilhas, horários, guias, grupos e viagens. " +
        "Se a pergunta não for desse assunto, responda que não pode ajudar nesse tema. " +
        "Pergunta do usuário: ";
    prompt += await (0, pergunta_1.fazerPergunta)("Me fale como posso ajudar você hoje? ");
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("\nResposta:\n");
    console.log(text);
}
run().catch((error) => {
    console.error("Erro ao executar Gemini:", error);
    process.exit(1);
});
