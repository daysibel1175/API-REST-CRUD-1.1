import express, { Request, Response, Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Trilha from "../models/trilhas";
import Guia from "../models/guias";
import Grupo from "../models/grupo";

const router: Router = express.Router();

interface ChatRequest {
  message: string;
  userName?: string;
  history?: Array<{ role: "user" | "bot"; content: string }>;
  lang?: string;
}

interface ChatResponse {
  response: string;
  tokensUsedEntrada?: number;
  tokensUsedSalida?: number;
  tokensTotales?: number;
  modelUsed?: string;
}

const apiKey = process.env.GEMINI_API_KEY;

// Limites de tokens por modelo
const TOKEN_LIMITS = {
  "gemini-1.5-flash": 1000000,
  "gemini-1.5-pro": 2000000,
};

const TEXTS: Record<string, Record<string, string>> = {
  pt: {
    greetingWithName: "Olá, %s! Em que posso ajudar?",
    greeting: "Olá! Em que posso ajudar?",
    trails_found: "Trilhas encontradas:",
    trails_found_ordered_sp:
      "Trilhas encontradas (ordenadas por proximidade de São Paulo):",
    trails_found_ordered_rj:
      "Trilhas encontradas (ordenadas por proximidade do Rio de Janeiro):",
    guides_found: "Guias encontrados:",
    groups_found: "Grupos encontrados:",
    no_groups_create:
      "Não encontrei grupos agora. Para participar, crie sua conta.",
    create_account: "Criar conta",
    fallback_explore:
      "No momento tive uma instabilidade, mas aqui vão algumas trilhas para você:",
  },
  es: {
    greetingWithName: "¡Hola, %s! ¿En qué puedo ayudar?",
    greeting: "¡Hola! ¿En qué puedo ayudar?",
    trails_found: "Rutas encontradas:",
    trails_found_ordered_sp:
      "Rutas encontradas (ordenadas por proximidad a São Paulo):",
    trails_found_ordered_rj:
      "Rutas encontradas (ordenadas por proximidad a Río de Janeiro):",
    guides_found: "Guías encontradas:",
    groups_found: "Grupos encontrados:",
    no_groups_create:
      "No encontré grupos ahora. Para participar, crea tu cuenta.",
    create_account: "Crear cuenta",
    fallback_explore:
      "He tenido una inestabilidad, pero aquí tienes algunas rutas:",
  },
};

// Porcentaje de límite para cambiar de modelo (80%)
const SWITCH_THRESHOLD = 0.8;

type Coordinate = { lat: number; lon: number };

const REFERENCE_POINTS: Record<"sao_paulo" | "rio_de_janeiro", Coordinate> = {
  sao_paulo: { lat: -23.55052, lon: -46.633308 },
  rio_de_janeiro: { lat: -22.906847, lon: -43.172897 },
};

const LOCATION_COORDINATES: Array<{ key: string; coordinate: Coordinate }> = [
  { key: "sao paulo", coordinate: { lat: -23.55052, lon: -46.633308 } },
  { key: "ubatuba", coordinate: { lat: -23.433, lon: -45.0836 } },
  {
    key: "campos do jordao",
    coordinate: { lat: -22.7392, lon: -45.5916 },
  },
  {
    key: "sao bento do sapucai",
    coordinate: { lat: -22.6885, lon: -45.7312 },
  },
  { key: "santos", coordinate: { lat: -23.9608, lon: -46.3336 } },
  { key: "guaruja", coordinate: { lat: -23.9938, lon: -46.2564 } },
  { key: "sao sebastiao", coordinate: { lat: -23.8067, lon: -45.4012 } },
  { key: "ilha bela", coordinate: { lat: -23.778, lon: -45.3588 } },
  { key: "ilhabela", coordinate: { lat: -23.778, lon: -45.3588 } },
  { key: "rio de janeiro", coordinate: { lat: -22.906847, lon: -43.172897 } },
  { key: "niteroi", coordinate: { lat: -22.8832, lon: -43.1034 } },
  { key: "petropolis", coordinate: { lat: -22.505, lon: -43.1787 } },
  { key: "teresopolis", coordinate: { lat: -22.4167, lon: -42.9782 } },
  { key: "tijuca", coordinate: { lat: -22.9249, lon: -43.2343 } },
];

const normalizeText = (value: string): string =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const toRadians = (value: number): number => (value * Math.PI) / 180;

const haversineKm = (from: Coordinate, to: Coordinate): number => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const estimateDistanceFromLocation = (
  location: string | undefined,
  referencePoint: Coordinate,
): number | null => {
  const normalizedLocation = normalizeText(location || "");

  for (const entry of LOCATION_COORDINATES) {
    if (normalizedLocation.includes(entry.key)) {
      return haversineKm(referencePoint, entry.coordinate);
    }
  }

  return null;
};

interface ParsedTrilhaFromList {
  nome: string;
  localizacao: string;
  duracaoRaw: string;
  minutosEstimados: number | null;
}

const formatTrailLine = (t: any, reference?: Coordinate): string => {
  const distanceKm = reference
    ? estimateDistanceFromLocation(t.localizacao, reference)
    : null;
  const distanceLabel =
    distanceKm !== null ? `, ~${Math.round(distanceKm)} km` : "";
  const guias = (t.guia || []).map((g: any) => g.nome).join(", ");
  return `- ${t.nome} (${t.localizacao}) — ${t.tipo_de_trilha}${t.duracao ? `, ${t.duracao}` : ""}${distanceLabel}${guias ? ` — Guia: ${guias}` : ""}`;
};

const buildFallbackTrailsResponse = async (lang = "pt"): Promise<string> => {
  const fallbackTrails = await Trilha.find({})
    .limit(6)
    .populate({ path: "guia", select: "nome" });

  if (!fallbackTrails || fallbackTrails.length === 0) {
    return lang === "es"
      ? "En este momento no pude procesar tu consulta, pero puedes explorar nuestras rutas en /trilhas."
      : "No momento não consegui processar sua pergunta, mas você pode explorar nossas trilhas em /trilhas.";
  }

  const summary = fallbackTrails.map((t) => formatTrailLine(t)).join("\n");
  return lang === "es"
    ? `He tenido una inestabilidad, pero aquí tienes algunas rutas:\n${summary}\n\nTambién puedes ver todas en /trilhas.`
    : `No momento tive uma instabilidade, mas aqui vão algumas trilhas para você:\n${summary}\n\nVocê também pode ver todas em /trilhas.`;
};

const parseDurationToMinutes = (duracao: string): number | null => {
  const text = (duracao || "").toLowerCase().replace(/,/g, ".");

  const range = text.match(/(\d+(?:\.\d+)?)\s*[\-–]\s*(\d+(?:\.\d+)?)\s*h/);
  if (range) {
    const start = Number(range[1]);
    const end = Number(range[2]);
    if (!Number.isNaN(start) && !Number.isNaN(end)) {
      return Math.round(((start + end) / 2) * 60);
    }
  }

  const hourMinute = text.match(/(\d+)\s*h\s*(\d+)\s*min/);
  if (hourMinute) {
    return Number(hourMinute[1]) * 60 + Number(hourMinute[2]);
  }

  const onlyHours = text.match(/(\d+(?:\.\d+)?)\s*h/);
  if (onlyHours) {
    return Math.round(Number(onlyHours[1]) * 60);
  }

  const onlyMinutes = text.match(/(\d+)\s*min/);
  if (onlyMinutes) {
    return Number(onlyMinutes[1]);
  }

  return null;
};

const parseTrilhasFromSummary = (
  summaryText: string,
): ParsedTrilhaFromList[] => {
  const lines = summaryText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "));

  return lines
    .map((line) => {
      const cleanLine = line.replace(/^-\s*/, "");
      const nameLocMatch = cleanLine.match(/^(.*?)\s*\((.*?)\)\s*—\s*(.*)$/);
      if (!nameLocMatch) return null;

      const nome = nameLocMatch[1].trim();
      const localizacao = nameLocMatch[2].trim();
      const afterLoc = nameLocMatch[3].trim();

      const splitByGuide = afterLoc.split(/—\s*guia\s*:/i)[0].trim();
      const parts = splitByGuide
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const duracaoRaw = parts.length >= 2 ? parts.slice(1).join(", ") : "";

      return {
        nome,
        localizacao,
        duracaoRaw,
        minutosEstimados: parseDurationToMinutes(duracaoRaw),
      } as ParsedTrilhaFromList;
    })
    .filter((item): item is ParsedTrilhaFromList => Boolean(item));
};

const getLastListSummaryFromHistory = (
  history: Array<{ role: "user" | "bot"; content: string }>,
): { type: "trilhas" | "guias" | "grupos"; content: string } | null => {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const item = history[i];
    if (item.role === "bot") {
      if (/trilhas encontradas/i.test(item.content))
        return { type: "trilhas", content: item.content };
      if (
        /guias encontrados|guias encontrados:/i.test(item.content) ||
        /guias encontrados/i.test(item.content)
      )
        return { type: "guias", content: item.content };
      if (
        /grupos encontrados|grupos encontrados:/i.test(item.content) ||
        /grupos encontrados/i.test(item.content)
      )
        return { type: "grupos", content: item.content };
    }
  }

  return null;
};

const parseGuidesFromSummary = (
  summaryText: string,
): { nome: string; extra?: string }[] => {
  const lines = summaryText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "));
  return lines.map((line) => {
    const clean = line.replace(/^-\s*/, "");
    const match = clean.match(/^(.*?)(?:\s+—\s+Trilha:\s*(.*))?$/i);
    if (!match) return { nome: clean };
    return { nome: match[1].trim(), extra: match[2]?.trim() };
  });
};

const parseGroupsFromSummary = (
  summaryText: string,
): { leader: string; members: number; familiar: boolean }[] => {
  const lines = summaryText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "));
  return lines.map((line) => {
    const clean = line.replace(/^-\s*/, "");
    const leaderMatch = clean.match(/liderado por\s+(.*?)(?:\s|$)/i);
    const membersMatch = clean.match(/Membros:\s*(\d+)/i);
    const fam = /\(familiar\)/i.test(clean);
    return {
      leader: leaderMatch ? leaderMatch[1].trim() : clean,
      members: membersMatch ? Number(membersMatch[1]) : 0,
      familiar: fam,
    };
  });
};

router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  const { message, userName, history, lang } = req.body as ChatRequest;
  const requestedLang = lang === "es" ? "es" : "pt";
  const L = TEXTS[requestedLang];
  try {
    const safeUserName = typeof userName === "string" ? userName.trim() : "";
    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (h) =>
              h &&
              (h.role === "user" || h.role === "bot") &&
              typeof h.content === "string" &&
              h.content.trim().length > 0,
          )
          .slice(-10)
      : [];

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: "Mensagem vazia" });
      return;
    }

    const text = message.toLowerCase().trim();
    const isGreeting =
      /^(hola|ol[aá]|hello|hi|buenas|bom dia|boa tarde|boa noite)\b/.test(text);

    // Intenções e filtros comuns (pré-calculados para uso em handlers prioritários)
    const isNearSP =
      /s[ãa]o paulo|sao paulo|perto de sao paulo|perto de s[ãa]o paulo/.test(
        text,
      );
    const isNearRio =
      /rio de janeiro|rio|perto do rio|perto do rio de janeiro/.test(text);
    const isFamily =
      /famili|familia|para familia|para fami(lias)?|familiar/.test(text);
    const isGuideQuery = /guia|guias|gu\u00eda|gu\u00edas/.test(text);
    const isGroupQuery = /grupo|grupos/.test(text);
    const isShortestFollowUp =
      /mais curta|mas curta|m[áa]s corta|mas corta|mais rapida|mais r[aá]pida|menos tempo|menor duracao|menor duração/.test(
        text,
      );
    const isLongestFollowUp =
      /mais longa|mas longa|m[áa]s larga|mas larga|mais demorada|mais extensa|maior duracao|maior duração/.test(
        text,
      );

    if (isGreeting) {
      res.json({
        response: safeUserName
          ? L.greetingWithName.replace("%s", safeUserName)
          : L.greeting,
      });
      return;
    }

    // Priorizar consultas por guias/grupos quando o usuário pergunta por eles,
    // aplicando filtro por localização se mencionada (ex.: 'em São Paulo').
    if (isGuideQuery) {
      try {
        const guides = await Guia.find({}).populate({
          path: "trilha",
          select: "localizacao nome",
        });

        let filtered = guides;
        if (isNearSP) {
          filtered = guides.filter(
            (g) =>
              !!(
                g.trilha &&
                /s(ã|a)o paulo|sao paulo/i.test(
                  (g.trilha as any).localizacao || "",
                )
              ),
          );
        } else if (isNearRio) {
          filtered = guides.filter(
            (g) =>
              !!(
                g.trilha &&
                /rio de janeiro|rio|tijuca|serra dos/i.test(
                  (g.trilha as any).localizacao || "",
                )
              ),
          );
        }

        if (!filtered || filtered.length === 0) {
          const msg =
            requestedLang === "es"
              ? "No encontré guías para esa ubicación."
              : "Não encontrei guias para essa localização.";
          res.status(200).json({ response: msg });
          return;
        }

        // Agrupar trilhas por nome do guia
        const map = new Map<string, Set<string>>();
        for (const g of filtered) {
          const nome = (g.nome || "").toString();
          const trilhaNome = (g.trilha as any)?.nome;
          if (!map.has(nome)) map.set(nome, new Set());
          if (trilhaNome) map.get(nome)!.add(trilhaNome.toString());
        }

        const lines: string[] = [];
        for (const [nome, trilhas] of map.entries()) {
          const trilhasList = Array.from(trilhas).join("; ");
          lines.push(`- ${nome}: ${trilhasList}`);
        }

        res
          .status(200)
          .json({
            response: `${requestedLang === "es" ? "Sí — hay guías:" : "Sim — há guias:"}\n${lines.join("\n")}`,
          });
        return;
      } catch (err) {
        console.error("Erro ao consultar guias (prioritario):", err);
        // continuar para outros handlers
      }
    }

    // Primeiro, tentar responder com dados do banco quando a pergunta for sobre
    // localização ou preferência (ex.: perto de São Paulo, perto do Rio, para família).

    if ((isShortestFollowUp || isLongestFollowUp) && safeHistory.length > 0) {
      const last = getLastListSummaryFromHistory(safeHistory);
      if (last) {
        if (last.type === "trilhas") {
          const parsed = parseTrilhasFromSummary(last.content).filter(
            (item) => item.minutosEstimados !== null,
          );

          if (parsed.length > 0) {
            const ordered = parsed.sort(
              (a, b) =>
                (a.minutosEstimados ?? Number.MAX_SAFE_INTEGER) -
                (b.minutosEstimados ?? Number.MAX_SAFE_INTEGER),
            );

            const selected = isLongestFollowUp
              ? ordered[ordered.length - 1]
              : ordered[0];

            const label = isLongestFollowUp ? "mais longa" : "mais curta";

            res.status(200).json({
              response:
                `Das trilhas listadas, a ${label} é ${selected.nome} ` +
                `em ${selected.localizacao}, com duração aproximada de ${selected.duracaoRaw}.`,
            });
            return;
          }
        }

        if (last.type === "guias") {
          const parsed = parseGuidesFromSummary(last.content);
          if (parsed.length > 0) {
            const selected = isLongestFollowUp
              ? parsed[parsed.length - 1]
              : parsed[0];
            const label = isLongestFollowUp
              ? "maior/mais relevante"
              : "primeiro";
            res.status(200).json({
              response: `Das guias listadas, ${label} é ${selected.nome}${selected.extra ? ` — ${selected.extra}` : ""}.`,
            });
            return;
          }
        }

        if (last.type === "grupos") {
          const parsed = parseGroupsFromSummary(last.content);
          if (parsed.length > 0) {
            const ordered = parsed.sort((a, b) => a.members - b.members);
            const selected = isLongestFollowUp
              ? ordered[ordered.length - 1]
              : ordered[0];
            const label = isLongestFollowUp ? "maior" : "menor";
            res.status(200).json({
              response: `Dos grupos listados, o ${label} tem líder ${selected.leader} e ${selected.members} membros.`,
            });
            return;
          }
        }
      }
    }

    if (isNearSP || isNearRio || isFamily) {
      try {
        const queries: any[] = [];
        if (isNearSP)
          queries.push({
            localizacao: /s(ã|a)o paulo|sao paulo|ubatuba|campos do jordao/i,
          });
        if (isNearRio)
          queries.push({
            localizacao:
              /rio de janeiro|serra dos \w+|tijuca|serra dos orgaos|serra dos órg/iu,
          });
        if (isFamily)
          queries.push({ tipo_de_trilha: /fácil|facil|média|media/i });

        const filter = queries.length ? { $or: queries } : {};
        let results = await Trilha.find(filter)
          .limit(20)
          .populate({ path: "guia", select: "nome" });

        if (isNearSP || isNearRio) {
          const reference = isNearSP
            ? REFERENCE_POINTS.sao_paulo
            : REFERENCE_POINTS.rio_de_janeiro;

          const withDistance = results.map((trilha) => {
            const distanceKm = estimateDistanceFromLocation(
              trilha.localizacao,
              reference,
            );

            return { trilha, distanceKm };
          });

          withDistance.sort((a, b) => {
            const distA = a.distanceKm ?? Number.MAX_SAFE_INTEGER;
            const distB = b.distanceKm ?? Number.MAX_SAFE_INTEGER;

            if (distA !== distB) return distA - distB;
            return a.trilha.nome.localeCompare(b.trilha.nome, "pt-BR");
          });

          results = withDistance.map((item) => item.trilha);
        }

        if (!results || results.length === 0) {
          res.status(200).json({
            response: "Não encontrei trilhas que atendam a esse filtro.",
          });
          return;
        }

        const summary = results
          .map((t) => {
            const reference = isNearSP
              ? REFERENCE_POINTS.sao_paulo
              : isNearRio
                ? REFERENCE_POINTS.rio_de_janeiro
                : null;
            return formatTrailLine(t, reference ?? undefined);
          })
          .join("\n");

        const prefix = isNearSP
          ? "Trilhas encontradas (ordenadas por proximidade de São Paulo):"
          : isNearRio
            ? "Trilhas encontradas (ordenadas por proximidade do Rio de Janeiro):"
            : "Trilhas encontradas:";

        res.status(200).json({ response: `${prefix}\n${summary}` });
        return;
      } catch (err) {
        console.error("Erro ao consultar trilhas para chat:", err);
        // continua para fallback do LLM
      }
    }

    // Handle guide queries
    if (isGuideQuery) {
      try {
        const guides = await Guia.find({})
          .limit(20)
          .populate({ path: "trilha", select: "localizacao nome" });

        if (!guides || guides.length === 0) {
          res.status(200).json({
            response:
              requestedLang === "es"
                ? "No encontré guías ahora."
                : "Não encontrei guias agora.",
          });
          return;
        }
        const summary = guides
          .map((g) => {
            const trilhaNome = (g.trilha as any)?.nome || "";
            const trilhaLoc = (g.trilha as any)?.localizacao || "";
            return `- ${g.nome}${trilhaNome ? ` — Trilha: ${trilhaNome} (${trilhaLoc})` : ""}`;
          })
          .join("\n");

        res.status(200).json({ response: `${L.guides_found}\n${summary}` });
        return;
      } catch (err) {
        console.error("Erro ao consultar guias:", err);
        // continue to LLM fallback
      }
    }

    // Handle group queries
    if (isGroupQuery) {
      try {
        const groups = await Grupo.find({})
          .limit(20)
          .populate({ path: "guia", select: "nome trilha" })
          .populate({ path: "usuario", select: "nome" });

        if (!groups || groups.length === 0) {
          // instruct frontend to send user to create account when asking about groups
          res.status(200).json({
            response: L.no_groups_create,
            link: "/login",
            linkText: L.create_account,
          });
          return;
        }

        const summary = groups
          .map((gr) => {
            const guiaNome = (gr.guia as any)?.nome || "";
            const size = Array.isArray(gr.usuario) ? gr.usuario.length : 0;
            const fam = gr.familiar ? " (familiar)" : "";
            return `- Grupo liderado por ${guiaNome}${fam} — Membros: ${size}`;
          })
          .join("\n");

        res.status(200).json({ response: `${L.groups_found}\n${summary}` });
        return;
      } catch (err) {
        console.error("Erro ao consultar grupos:", err);
        // continue to LLM fallback
      }
    }

    if (!apiKey) {
      const fallbackResponse = await buildFallbackTrailsResponse(requestedLang);
      res.status(200).json({ response: fallbackResponse });
      return;
    }

    // Se não for uma pergunta coberta pelos filtros locais, delegar ao Gemini
    const genAI = new GoogleGenerativeAI(apiKey);

    const historyContext = safeHistory.length
      ? "Contexto recente da conversa (use para responder perguntas de continuação):\n" +
        safeHistory
          .map(
            (item) =>
              `${item.role === "user" ? "Usuário" : "Assistente"}: ${item.content}`,
          )
          .join("\n") +
        "\n"
      : "";

    const prompt =
      "Você é um assistente do site Trilhas Brasil e deve responder somente sobre trilhas, horários, guias, grupos e viagens. " +
      "Se a pergunta não for desse assunto, responda que não pode ajudar nesse tema. " +
      "Quando o usuário fizer pergunta de continuação (ex.: 'e dessas, qual a mais curta?'), use o contexto recente para inferir a referência. " +
      "Mantenha as respostas concisas e úteis. " +
      (safeUserName
        ? `Chame o usuário pelo nome ${safeUserName} quando fizer sentido. `
        : "") +
      historyContext +
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
      `[TOKENS] Modelo: ${modelName} | Tokens: ${inputTokens}/${modelLimit} | Umbral: ${threshold}`,
    );

    // Si los tokens de entrada superan el 80% del límite, cambiar a modelo pro
    if (inputTokens > threshold) {
      console.log(
        `[CAMBIO MODELO] Tokens (${inputTokens}) superan umbral (${threshold}). Cambiando a gemini-1.5-pro`,
      );
      modelName = "gemini-1.5-pro";
      model = genAI.getGenerativeModel({ model: modelName });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Contar tokens de salida
    const outputTokenCountResult = await model.countTokens(responseText);
    const outputTokens = outputTokenCountResult.totalTokens;
    const totalTokens = inputTokens + outputTokens;

    console.log(
      `[TOKENS TOTALES] Entrada: ${inputTokens} | Salida: ${outputTokens} | Total: ${totalTokens}`,
    );

    const response: ChatResponse = {
      response: responseText,
      tokensUsedEntrada: inputTokens,
      tokensUsedSalida: outputTokens,
      tokensTotales: totalTokens,
      modelUsed: modelName,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro no endpoint /chat:", error);
    try {
      const fallbackResponse = await buildFallbackTrailsResponse(requestedLang);
      res.status(200).json({ response: fallbackResponse });
    } catch (fallbackError) {
      console.error("Erro ao gerar fallback de trilhas:", fallbackError);
      res.status(200).json({
        response:
          requestedLang === "es"
            ? "En este momento tuve una inestabilidad, pero puedes explorar las rutas en /trilhas."
            : "No momento tive uma instabilidade, mas você pode explorar as trilhas em /trilhas.",
      });
    }
  }
});

export default router;
