import { JSX } from "react";
import img from "/img/baixados_compressed.webp";
import Chatbot from "../components/ChatBot/chatbot";

export default function HomePage(): JSX.Element {
  return (
    <section>
      <header className="bg-bg px-4 py-8">
        <img
          src={img}
          alt="imagen de tres personas en la cima de una montaña con mochilas y equipo de senderismo"
          width="218"
          height="199"
          className="mx-auto block h-auto w-[90%] max-h-[30vh] max-w-[470px] object-contain [aspect-ratio:218/199] max-[700px]:w-full"
          fetchPriority="high"
        />
        <h1 className="mt-4 text-text">Bem-vindo(a) ao Trilhas Brasil</h1>
        <p className="text-muted">
          Use o menu para navegar entre Trilhas, Guias, Grupos e Usuários.
        </p>
      </header>
      <div>
        <Chatbot />
      </div>
    </section>
  );
}
