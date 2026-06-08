"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const trilhas_1 = __importDefault(require("../models/trilhas"));
const router = express_1.default.Router();
const apiKey = process.env.GEMINI_API_KEY;
// Limites de tokens por modelo
const TOKEN_LIMITS = {
    "gemini-1.5-flash": 1000000,
    "gemini-1.5-pro": 2000000,
};
// Porcentaje de límite para cambiar de modelo (80%)
const SWITCH_THRESHOLD = 0.8;
router.post("/chat", async (req, res) => {
    try {
        const { message, userName } = req.body;
        const safeUserName = typeof userName === "string" ? userName.trim() : "";
        if (!message || message.trim().length === 0) {
            res.status(400).json({ error: "Mensagem vazia" });
            return;
        }
        const text = message.toLowerCase().trim();
        const isGreeting = /^(hola|ol[aá]|hello|hi|buenas|bom dia|boa tarde|boa noite)\b/.test(text);
        if (isGreeting) {
            res.json({
                response: safeUserName
                    ? `Olá, ${safeUserName}! Em que posso ajudar?`
                    : "Hola, en qué puedo ayudar?",
            });
            return;
        }
        // Primeiro, tentar responder com dados do banco quando a pergunta for sobre
        // localização ou preferência (ex.: perto de São Paulo, perto do Rio, para família).
        const isNearSP = /s[ãa]o paulo|sao paulo|perto de sao paulo|perto de s[ãa]o paulo/.test(text);
        const isNearRio = /rio de janeiro|rio|perto do rio|perto do rio de janeiro/.test(text);
        const isFamily = /famili|familia|para familia|para famílias|para familias|familiar/.test(text);
        if (isNearSP || isNearRio || isFamily) {
            try {
                const queries = [];
                if (isNearSP)
                    queries.push({
                        localizacao: /s(ã|a)o paulo|sao paulo|ubatuba|campos do jordao/i,
                    });
                if (isNearRio)
                    queries.push({
                        localizacao: /rio de janeiro|serra dos \w+|tijuca|serra dos orgaos|serra dos órg/iu,
                    });
                if (isFamily)
                    queries.push({ tipo_de_trilha: /fácil|facil|média|media/i });
                const filter = queries.length ? { $or: queries } : {};
                const results = await trilhas_1.default.find(filter)
                    .limit(20)
                    .populate({ path: "guia", select: "nome" });
                if (!results || results.length === 0) {
                    res.status(200).json({
                        response: "Não encontrei trilhas que atendam a esse filtro.",
                    });
                    return;
                }
                const summary = results
                    .map((t) => {
                    const guias = (t.guia || []).map((g) => g.nome).join(", ");
                    return `- ${t.nome} (${t.localizacao}) — ${t.tipo_de_trilha}${t.duracao ? `, ${t.duracao}` : ""}${guias ? ` — Guia: ${guias}` : ""}`;
                })
                    .join("\n");
                res.status(200).json({ response: `Trilhas encontradas:\n${summary}` });
                return;
            }
            catch (err) {
                console.error("Erro ao consultar trilhas para chat:", err);
                // continua para fallback do LLM
            }
        }
        if (!apiKey) {
            res.status(500).json({ error: "GEMINI_API_KEY não configurada" });
            return;
        }
        // Se não for uma pergunta coberta pelos filtros locais, delegar ao Gemini
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const prompt = "Você é um assistente do site Trilhas Brasil e deve responder somente sobre trilhas, horários, guias, grupos e viagens. " +
            "Se a pergunta não for desse assunto, responda que não pode ajudar nesse tema. " +
            "Mantenha as respostas concisas e úteis. " +
            (safeUserName
                ? `Chame o usuário pelo nome ${safeUserName} quando fizer sentido. `
                : "") +
            "Pergunta do usuário: " +
            message;
        // Comenzar con gemini-1.5-flash
        let modelName = "gemini-1.5-flash";
        let model = genAI.getGenerativeModel({ model: modelName });
        // Contar tokens de entrada
        const tokenCountResult = await model.countTokens(prompt);
        const inputTokens = tokenCountResult.totalTokens;
        const modelLimit = TOKEN_LIMITS[modelName];
        const threshold = modelLimit * SWITCH_THRESHOLD;
        console.log(`[TOKENS] Modelo: ${modelName} | Tokens: ${inputTokens}/${modelLimit} | Umbral: ${threshold}`);
        // Si los tokens de entrada superan el 80% del límite, cambiar a modelo pro
        if (inputTokens > threshold) {
            console.log(`[CAMBIO MODELO] Tokens (${inputTokens}) superan umbral (${threshold}). Cambiando a gemini-1.5-pro`);
            modelName = "gemini-1.5-pro";
            model = genAI.getGenerativeModel({ model: modelName });
        }
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        // Contar tokens de salida
        const outputTokenCountResult = await model.countTokens(responseText);
        const outputTokens = outputTokenCountResult.totalTokens;
        const totalTokens = inputTokens + outputTokens;
        console.log(`[TOKENS TOTALES] Entrada: ${inputTokens} | Salida: ${outputTokens} | Total: ${totalTokens}`);
        const response = {
            response: responseText,
            tokensUsedEntrada: inputTokens,
            tokensUsedSalida: outputTokens,
            tokensTotales: totalTokens,
            modelUsed: modelName,
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
