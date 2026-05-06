export interface FAQItem {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  category: "trilhas" | "horarios" | "guias" | "grupos" | "geral";
  link?: string;
  linkText?: string;
}

export const FAQ: FAQItem[] = [
  // Categoria: Trilhas
  {
    id: "faq-1",
    keywords: [
      "trilha",
      "trilhas",
      "melhor",
      "popular",
      "populares",
      "famosa",
      "famosas",
      "recomendada",
      "recomendadas",
    ],
    question: "Quais são as trilhas mais populares?",
    answer:
      "No Trilhas Brasil temos várias trilhas incríveis! Você pode explorar nossa seção de Trilhas para ver todas as opções disponíveis, com dificuldade, localização e avaliações.",
    category: "trilhas",
    link: "/trilhas",
    linkText: "Ver todas as trilhas",
  },
  {
    id: "faq-2",
    keywords: [
      "dificuldade",
      "fácil",
      "difícil",
      "iniciante",
      "intermediária",
      "avançada",
      "nível",
      "classificação",
    ],
    question: "Como são classificadas as dificuldades das trilhas?",
    answer:
      "Nossas trilhas são classificadas em níveis de dificuldade: Fácil (iniciantes), Intermediária (intermediário) e Avançada (experientes). Você pode filtrar por dificuldade na seção de Trilhas.",
    category: "trilhas",
    link: "/trilhas",
    linkText: "Explorar por dificuldade",
  },
  {
    id: "faq-3",
    keywords: [
      "localização",
      "localizado",
      "onde",
      "fica",
      "região",
      "estado",
      "endereço",
      "cidade",
      "local",
      "informações",
    ],
    question: "Onde posso encontrar as informações de localização das trilhas?",
    answer:
      "Cada trilha tem informações completas de localização. Acesse a seção Trilhas, clique em uma trilha de interesse e você verá a localização, mapa, instruções de chegada e referências.",
    category: "trilhas",
    link: "/trilhas",
    linkText: "Buscar trilhas por localização",
  },

  // Categoria: Horários
  {
    id: "faq-4",
    keywords: ["horário", "abre", "fecha", "funciona", "aberto", "disponível"],
    question: "Qual é o horário de funcionamento?",
    answer:
      "Os horários variam de acordo com cada trilha e período do ano. Consulte a página específica de cada trilha para ver os horários atualizados de acesso.",
    category: "horarios",
  },
  {
    id: "faq-5",
    keywords: [
      "melhor",
      "época",
      "melhor",
      "período",
      "quando",
      "ir",
      "estação",
    ],
    question: "Qual é a melhor época para visitar as trilhas?",
    answer:
      "A melhor época depende de cada trilha. Geralmente a estação seca (maio a setembro) é ideal. Verifique a página da trilha específica para recomendações de melhor período.",
    category: "horarios",
  },

  // Categoria: Guias
  {
    id: "faq-6",
    keywords: [
      "guia",
      "guias",
      "contratar",
      "contratação",
      "turístico",
      "acompanhante",
      "especialidade",
    ],
    question: "Como contratar um guia?",
    answer:
      "Acesse a seção Guias para ver todos os guias turísticos disponíveis. Cada guia tem seu perfil, especialidades, avaliações e você pode entrar em contato diretamente.",
    category: "guias",
    link: "/guias",
    linkText: "Ver guias disponíveis",
  },
  {
    id: "faq-7",
    keywords: [
      "guia",
      "guias",
      "qualificado",
      "qualificados",
      "qualificação",
      "experiência",
      "credencial",
      "certificado",
      "treinado",
    ],
    question: "Os guias são qualificados?",
    answer:
      "Sim! Todos os guias em nossa plataforma possuem experiência comprovada e avaliações de usuários. Você pode verificar as qualificações e comentários na página de cada guia.",
    category: "guias",
    link: "/guias",
    linkText: "Verificar qualificações",
  },

  // Categoria: Grupos
  {
    id: "faq-8",
    keywords: [
      "grupo",
      "comunidade",
      "participar",
      "criar",
      "trilha",
      "juntos",
    ],
    question: "Como funcionam os grupos?",
    answer:
      "Os grupos son comunidades de personas interesadas en trilhas. Você pode navegar grupos existentes, se juntar aos que interessam ou criar um novo na seção Grupos.",
    category: "grupos",
    link: "/grupos",
    linkText: "Explorar grupos",
  },
  {
    id: "faq-9",
    keywords: ["entrar", "grupo", "participação", "membro", "aderir"],
    question: "Como entrar em um grupo?",
    answer:
      "Acesse a seção Grupos, encontre um grupo de seu interesse e clique em 'Participar'. Alguns grupos podem ter aprovação do moderador antes de sua entrada.",
    category: "grupos",
    link: "/grupos",
    linkText: "Procurar grupos",
  },

  // Categoria: Geral
  {
    id: "faq-10",
    keywords: [
      "cadastro",
      "conta",
      "registrar",
      "usuário",
      "criar",
      "inscrição",
    ],
    question: "Como faço para criar uma conta?",
    answer:
      "Clique no botão de login no canto superior direito, depois em 'Criar conta'. Preencha seus dados, confirme o email e pronto! Sua conta está criada.",
    category: "geral",
  },
  {
    id: "faq-11",
    keywords: ["contato", "suporte", "ajuda", "problema", "dúvida"],
    question: "Como entro em contato com o suporte?",
    answer:
      "Estou aqui para ajudar! Use este chat para tirar dúvidas sobre trilhas, guias e grupos. Para problemas técnicos, verifique a página de Contato no site.",
    category: "geral",
  },
  {
    id: "faq-12",
    keywords: ["segurança", "seguro", "proteção", "privacidade", "dados"],
    question: "Minhas informações estão seguras?",
    answer:
      "Sua segurança é prioridade! Todos os seus dados são criptografados e protegidos. Nunca compartilhamos informações pessoais com terceiros.",
    category: "geral",
  },
  {
    id: "faq-13",
    keywords: [
      "são paulo",
      "sp",
      "rio de janeiro",
      "rio",
      "rj",
      "minas gerais",
      "minas",
      "bahia",
      "estado",
      "região",
    ],
    question: "Tem trilhas em meu estado?",
    answer:
      "Sim! Temos trilhas em várias regiões do Brasil. Use os filtros de localização na seção Trilhas para ver as opções disponíveis em sua região. Qual estado você procura?",
    category: "trilhas",
  },
];

export function searchFAQ(userMessage: string): FAQItem | null {
  const messageLower = userMessage.toLowerCase().trim();
  const words = messageLower.split(/\s+/).filter((w) => w.length > 1);

  // Palabras que ignoran (stopwords)
  const stopwords = new Set([
    "a",
    "e",
    "o",
    "de",
    "da",
    "é",
    "em",
    "um",
    "uma",
    "dos",
    "das",
    "do",
  ]);
  const meaningfulWords = words.filter((w) => !stopwords.has(w));

  let bestMatch: { item: FAQItem; score: number } | null = null;

  // Buscar correspondências de palabras-clave con scoring mejorado
  for (const faqItem of FAQ) {
    let score = 0;
    let exactMatches = 0;

    for (const keyword of faqItem.keywords) {
      for (const word of meaningfulWords) {
        // Match exacto completo
        if (word === keyword) {
          score += 10;
          exactMatches++;
        }
        // Match exacto del inicio
        else if (word.startsWith(keyword) && keyword.length > 2) {
          score += 5;
        }
        // Keyword contiene la palabra (menos relevante)
        else if (keyword.includes(word) && word.length > 3) {
          score += 2;
        }
      }
    }

    // Solo retornar si hay match significativo:
    // - 1 exact match o
    // - 2+ matches con score >= 5
    if (
      (exactMatches > 0 && score > 5) ||
      (score >= 10 && meaningfulWords.length > 0)
    ) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { item: faqItem, score };
      }
    }
  }

  return bestMatch ? bestMatch.item : null;
}
