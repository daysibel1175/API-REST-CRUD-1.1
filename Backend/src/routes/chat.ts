import express, { Request, Response, Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router: Router = express.Router();

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  response: string;
  tokensUsed?: number;
  modelUsed?: string;
}

const apiKey = process.env.GEMINI_API_KEY;

// Limites de tokens por modelo
const TOKEN_LIMITS = {
  "gemini-1.5-flash": 1000000,
  "gemini-1.5-pro": 2000000,
};

// Porcentaje de límite para cambiar de modelo (80%)
const SWITCH_THRESHOLD = 0.8;

router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body as ChatRequest;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: "Mensagem vazia" });
      return;
    }

    if (!apiKey) {
      res.status(500).json({ error: "GEMINI_API_KEY não configurada" });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt =
      "Você é um assistente do site Trilhas Brasil e deve responder somente sobre trilhas, horários, guias, grupos e viagens. " +
      "Se a pergunta não for desse assunto, responda que não pode ajudar nesse tema. " +
      "Mantenha as respostas concisas e úteis. " +
      "Pergunta do usuário: " +
      message;

    // Comenzar con gemini-1.5-flash
    let modelName = "gemini-1.5-flash";
    let model = genAI.getGenerativeModel({ model: modelName });

    // Contar tokens de entrada
    const tokenCountResult = await model.countTokens(prompt);
    const inputTokens = tokenCountResult.totalTokens;
    const modelLimit = TOKEN_LIMITS[modelName as keyof typeof TOKEN_LIMITS];
    const threshold = modelLimit * SWITCH_THRESHOLD;

    console.log(
      `[TOKENS] Modelo: ${modelName} | Tokens: ${inputTokens}/${modelLimit} | Umbral: ${threshold}`
    );

    // Si los tokens de entrada superan el 80% del límite, cambiar a modelo pro
    if (inputTokens > threshold) {
      console.log(
        `[CAMBIO MODELO] Tokens (${inputTokens}) superan umbral (${threshold}). Cambiando a gemini-1.5-pro`
      );
      modelName = "gemini-1.5-pro";
      model = genAI.getGenerativeModel({ model: modelName });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const response: ChatResponse = {
      response: responseText,
      tokensUsed: inputTokens,
      modelUsed: modelName,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro no endpoint /chat:", error);
    res.status(500).json({
      error: "Erro ao processar a mensagem. Tente novamente mais tarde.",
    });
  }
});

export default router;
