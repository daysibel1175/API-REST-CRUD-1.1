import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fazerPergunta } from "./pergunta";

async function run(): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não encontrada no .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const nome = await fazerPergunta("Me diga seu nome: ");

  let prompt =
    "Você é um assistente do site Trilhas Brasil e deve responder somente sobre trilhas, horários, guias, grupos e viagens. " +
    "Se a pergunta não for desse assunto, responda que não pode ajudar nesse tema. " +
    (nome.trim()
      ? `Chame o usuário pelo nome ${nome.trim()} quando fizer sentido. `
      : "") +
    "Pergunta do usuário: ";

  prompt += await fazerPergunta("Como posso ajudar você hoje? ");

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  console.log("\nResposta:\n");
  console.log(text);
}

run().catch((error: unknown) => {
  console.error("Erro ao executar Gemini:", error);
  process.exit(1);
});
