import { useState, useRef, useEffect, ChangeEvent } from "react";
import Button from "../Button";
import Input from "../Input";
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou o assistente do Trilhas Brasil. Como posso ajudá-lo?",
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

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Buscar na FAQ primeiro
      const faqMatch = searchFAQ(input);

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
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: input }),
          });

          if (!response.ok) {
            throw new Error("Erro ao chamar a API");
          }

          const data = await response.json();

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text:
              data.response || "Desculpe, não consegui processar sua pergunta.",
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setLoading(false);
        } catch (apiError) {
          console.error("Erro ao chamar API:", apiError);
          // Fallback: resposta genérica
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Desculpe, não consegui processar sua pergunta neste momento. Tente novamente mais tarde.",
            sender: "bot",
            timestamp: new Date(),
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
              placeholder="Digite sua pergunta..."
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
