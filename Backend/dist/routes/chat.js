"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const router = express_1.default.Router();
const apiKey = process.env.GEMINI_API_KEY;
router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || message.trim().length === 0) {
            res.status(400).json({ error: "Mensagem vazia" });
            return;
        }
        if (!apiKey) {
            res.status(500).json({ error: "GEMINI_API_KEY não configurada" });
            return;
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Você é um assistente do site Trilhas Brasil e deve responder somente sobre trilhas, horários, guias, grupos e viagens. " +
            "Se a pergunta não for desse assunto, responda que não pode ajudar nesse tema. " +
            "Mantenha as respostas concisas e úteis. " +
            "Pergunta do usuário: " +
            message;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const response = {
            response: responseText,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Erro no endpoint /chat:", error);
        res.status(500).json({
            error: "Erro ao processar a mensagem. Tente novamente mais tarde.",
        });
    }
});
exports.default = router;
