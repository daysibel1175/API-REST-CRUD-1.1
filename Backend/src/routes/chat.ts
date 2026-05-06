import express, { Request, Response, Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router: Router = express.Router();

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  response: string;
}

const apiKey = process.env.GEMINI_API_KEY;

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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Você é um assistente do site Trilhas Brasil e deve responder somente sobre trilhas, horários, guias, grupos e viagens. " +
      "Se a pergunta não for desse assunto, responda que não pode ajudar nesse tema. " +
      "Mantenha as respostas concisas e úteis. " +
      "Pergunta do usuário: " +
      message;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const response: ChatResponse = {
      response: responseText,
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
