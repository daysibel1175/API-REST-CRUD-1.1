import { useState, useRef, useEffect, ChangeEvent } from "react";
import Button from "../Button";
import Input from "../Input";
import { chatApi } from "../../services/api";
import { searchFAQ } from "../../utils/faq";
import "./chatbot.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  link?: string;
  linkText?: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(() => {
    return sessionStorage.getItem("trilhasbrasil.chat.userName") ?? "";
  });
  const [awaitingName, setAwaitingName] = useState(() => {
    return !sessionStorage.getItem("trilhasbrasil.chat.userName");
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: userName
        ? `Olá, ${userName}! Como posso ajudar você hoje?`
        : "Olá! Antes de continuarmos, como você se chama?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (userName.trim()) {
      sessionStorage.setItem("trilhasbrasil.chat.userName", userName.trim());
    } else {
      sessionStorage.removeItem("trilhasbrasil.chat.userName");
    }
  }, [userName]);

  const detectLanguage = (text: string): "es" | "pt" => {
    const t = text.toLowerCase();
    const spanishIndicators =
      /\b(cual|cuál|esas|estas|mas corta|más corta|mas larga|más larga|por favor|gracias|hola|cuanto|cuánto)\b/i;
    return spanishIndicators.test(t) ? "es" : "pt";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    const normalizedInput = messageText.toLowerCase();
    const isGreeting =
      /^(hola|ol[aá]|hello|hi|buenas|bom dia|boa tarde|boa noite)\b/.test(
        normalizedInput,
      );

    if (awaitingName) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      if (isGreeting) {
        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Olá! Antes de continuarmos, como você se chama?",
            sender: "bot",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botMessage]);
          setLoading(false);
        }, 150);

        return;
      }

      const name = messageText.replace(/\s+/g, " ");
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Prazer, ${name}! Como posso ajudar você hoje?`,
          sender: "bot",
          timestamp: new Date(),
        };

        setUserName(name);
        setAwaitingName(false);
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
      }, 300);

      return;
    }

    const isLocationOrFamilyQuery =
      /s[ãa]o paulo|sao paulo|rio de janeiro|perto do rio|perto de sao paulo|perto de s[ãa]o paulo|famili|familia|para familia|para famílias|para familias|familiar|qual trilha|quais trilhas|que trilhas|trilhas.*perto|perto.*trilhas|dificil|difícil|facil|fácil|media|média/.test(
        normalizedInput,
      );

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    if (isGreeting) {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: userName
            ? `Olá, ${userName}! Em que posso ajudar?`
            : "Hola, en qué puedo ayudar?",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
      }, 150);
      return;
    }

    try {
      // Buscar na FAQ primeiro, mas evitar respostas genéricas em perguntas dinâmicas
      const faqMatch = !isLocationOrFamilyQuery ? searchFAQ(messageText) : null;

      if (faqMatch) {
        // Se encontrar na FAQ, responde com a resposta da FAQ
        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: faqMatch.answer,
            sender: "bot",
            timestamp: new Date(),
            link: faqMatch.link,
            linkText: faqMatch.linkText,
          };
          setMessages((prev) => [...prev, botMessage]);
          setLoading(false);
        }, 500);
      } else {
        // Se não encontrar, chama a API (Gemini)
        try {
          const historyForApi = [...messages, userMessage]
            .slice(-10)
            .map((m) => ({
              role: m.sender === "user" ? "user" : "bot",
              content: m.text,
            }));

          const langToSend = detectLanguage(messageText);

          const response = await chatApi.post("/chat", {
            message: messageText,
            userName: userName || undefined,
            history: historyForApi,
            lang: langToSend,
          });

          const data = response.data;
          const responseText =
            typeof data.response === "string"
              ? data.response.replace(/^"|"$/g, "")
              : "Resposta recebida.";

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: "bot",
            timestamp: new Date(),
            link: data.link ?? undefined,
            linkText: data.linkText ?? undefined,
          };
          setMessages((prev) => [...prev, botMessage]);
          setLoading(false);
        } catch (apiError) {
          console.error("Erro ao chamar API:", apiError);
          // Fallback: manter resposta útil com acesso direto às trilhas
          const langToSend = detectLanguage(messageText);
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text:
              langToSend === "es"
                ? "He tenido una inestabilidad, pero no te dejaré sin respuesta. Aquí tienes algunas rutas:"
                : "Tive uma instabilidade agora, mas não vou te deixar sem resposta. Vamos direto para as trilhas disponíveis:",
            sender: "bot",
            timestamp: new Date(),
            link: "/trilhas",
            linkText:
              langToSend === "es"
                ? "Ver todas las rutas"
                : "Ver todas as trilhas",
          };
          setMessages((prev) => [...prev, botMessage]);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`chatbot-container ${isOpen ? "" : "chatbot-container--collapsed"}`}
    >
      <div className="chatbot-header">
        <h2>Trilhas Brasil - Chat</h2>
        <button
          type="button"
          className="chatbot-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
          aria-expanded={isOpen}
        >
          <span aria-hidden="true">{isOpen ? "▾" : "▴"}</span>
        </button>
      </div>

      {isOpen ? (
        <>
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message chatbot-message--${message.sender}`}
              >
                <div className="chatbot-message-bubble">
                  <p>{message.text}</p>
                  {message.link && message.linkText && (
                    <a
                      href={message.link}
                      style={{
                        display: "inline-block",
                        marginTop: "0.5rem",
                        padding: "0.4rem 0.8rem",
                        backgroundColor: "var(--color-primary)",
                        color: "white",
                        borderRadius: "0.25rem",
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        cursor: "pointer",
                        fontWeight: 500,
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-text)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-primary)")
                      }
                    >
                      → {message.linkText}
                    </a>
                  )}
                  <span className="chatbot-message-time">
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message chatbot-message--bot">
                <div className="chatbot-message-bubble">
                  <div className="chatbot-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <Input
              type="text"
              placeholder={
                awaitingName ? "Digite seu nome..." : "Digite sua pergunta..."
              }
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              onKeyPress={handleKeyPress}
              size="md"
              fullWidth
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              variant="primary"
              size="md"
            >
              Enviar
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
