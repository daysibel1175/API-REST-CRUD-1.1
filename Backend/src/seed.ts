import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import Usuario from "./models/usuario";
import Guia from "./models/guias";
import Grupo from "./models/grupo";
import Trilha from "./models/trilhas";

mongoose
  .connect(process.env.KEY_URI as string)
  .then(() => console.log("Conectado ao MongoDB Atlas!"))
  .catch((error: Error) => console.error("Erro ao conectar:", error));

async function popularBancoDeDados(): Promise<void> {
  try {
    await Usuario.deleteMany({});
    await Guia.deleteMany({});
    await Grupo.deleteMany({});
    await Trilha.deleteMany({});
    console.log("✅ Dados antigos removidos");

    const usuarios = await Usuario.insertMany([
      {
        nome: "Admin Trilhas Brasil",
        idade: 40,
        contato: 11999999999,
        email: "admin@trilhasbrasil.com",
        isAdmin: true,
      },
      {
        nome: "Maria Silva",
        idade: 28,
        contato: 11987654321,
        email: "maria.silva@email.com",
      },
      {
        nome: "João Santos",
        idade: 35,
        contato: 11876543210,
        email: "joao.santos@email.com",
      },
      {
        nome: "Ana Costa",
        idade: 42,
        contato: 11765432109,
        email: "ana.costa@email.com",
      },
      {
        nome: "Pedro Oliveira",
        idade: 15,
        contato: 11654321098,
        email: "pedro.oliveira@email.com",
      },
      {
        nome: "Carla Lima",
        idade: 31,
        contato: 11543210987,
        email: "carla.lima@email.com",
      },
    ]);
    console.log("✅ Usuários criados:", usuarios.length);

    const guias = await Guia.insertMany([
      { nome: "Carlos Montanha", contato: 11999888777 },
      { nome: "Fernanda Trilhas", contato: 11888777666 },
      { nome: "Ricardo Aventura", contato: 11777666555 },
    ]);
    console.log("✅ Guias criados:", guias.length);

    const grupos = await Grupo.insertMany([
      {
        guia: guias[0]._id,
        familiar: true,
        horaPartida: "08:00",
        horaChegada: "12:00",
        usuario: [usuarios[1]._id, usuarios[2]._id],
        admin: usuarios[0]._id,
      },
      {
        guia: guias[1]._id,
        familiar: false,
        horaPartida: "06:00",
        horaChegada: "16:00",
        usuario: [usuarios[3]._id, usuarios[5]._id],
        admin: usuarios[0]._id,
      },
      {
        guia: guias[2]._id,
        familiar: true,
        horaPartida: "09:00",
        horaChegada: "13:00",
        usuario: [usuarios[4]._id],
        admin: usuarios[0]._id,
      },
    ]);
    console.log("✅ Grupos criados:", grupos.length);

    await Usuario.updateMany({}, { $set: { grupos: [] } });
    await Usuario.updateOne(
      { _id: usuarios[1]._id },
      { grupos: [grupos[0]._id] },
    );
    await Usuario.updateOne(
      { _id: usuarios[2]._id },
      { grupos: [grupos[0]._id] },
    );
    await Usuario.updateOne(
      { _id: usuarios[3]._id },
      { grupos: [grupos[1]._id] },
    );
    await Usuario.updateOne(
      { _id: usuarios[4]._id },
      { grupos: [grupos[2]._id] },
    );
    await Usuario.updateOne(
      { _id: usuarios[5]._id },
      { grupos: [grupos[1]._id] },
    );

    const trilhas = await Trilha.insertMany([
      {
        nome: "Pedra do Sino",
        tipo_de_trilha: "Difícil",
        descricao:
          "Pico mais alto da Serra dos Órgãos (2.275 m). Subida longa e técnica com trechos íngremes.",
        localizacao: "Serra dos Órgãos - Rio de Janeiro",
        dica: "Inicie cedo, leve equipamentos de montanhismo e roupas para frio. Boa forma física é essencial.",
        duracao: "6h",
        guia: [guias[0]._id],
        grupo: [],
      },
      {
        nome: "Travessia Petrópolis–Teresópolis",
        tipo_de_trilha: "Difícil",
        descricao:
          "Travessia de cerca de 27–30 km, realizada em 2–3 dias; terreno variado e trechos expostos.",
        localizacao: "Serra dos Órgãos - Rio de Janeiro",
        dica: "Planeje pernoites, leve equipamento para camping e cheque condições climáticas.",
        duracao: "2–3 dias",
        guia: [guias[0]._id],
        grupo: [],
      },
      {
        nome: "Castelos do Açu",
        tipo_de_trilha: "Difícil",
        descricao:
          "Rota de aproximadamente 15 km com trechos técnicos e possibilidade de pernoite em campo.",
        localizacao: "Serra dos Órgãos - Rio de Janeiro",
        dica: "Recomenda-se pernoite e acompanhamento por guia experiente.",
        duracao: "1–2 dias",
        guia: [guias[0]._id],
        grupo: [],
      },
      {
        nome: "Trilha Cartão Postal",
        tipo_de_trilha: "Moderada",
        descricao:
          "Curta (2,7 km) com mirante para o Dedo de Deus, trecho pedregoso perto do final.",
        localizacao: "Serra dos Órgãos - Rio de Janeiro",
        dica: "Use calçado com boa aderência e aproveite o mirante no final.",
        duracao: "~1,5–2h",
        guia: [guias[1]._id],
        grupo: [],
      },
      {
        nome: "Pico da Tijuca",
        tipo_de_trilha: "Difícil",
        descricao:
          "Rota de subida ao ponto mais alto do Parque Nacional da Tijuca com vistas panorâmicas da cidade.",
        localizacao: "Parque Nacional da Tijuca - Rio de Janeiro",
        dica: "Leve água e faça a subida cedo; ocorrem trechos íngremes e escorregadios.",
        duracao: "5h",
        guia: [guias[1]._id],
        grupo: [],
      },
      {
        nome: "Trilha do Corcovado",
        tipo_de_trilha: "Difícil",
        descricao:
          "Caminhada de cerca de 9,3 km que termina no monumento do Cristo Redentor; subida constante.",
        localizacao: "Parque Nacional da Tijuca - Rio de Janeiro",
        dica: "Evite horários de pico e cheque o fechamento do parque. Leve câmera para a vista final.",
        duracao: "4–4,5h",
        guia: [guias[1]._id],
        grupo: [],
      },
      {
        nome: "Pedra Bonita",
        tipo_de_trilha: "Moderada",
        descricao:
          "Trilha curta (3,4 km) com mirante famoso, visão para São Conrado e a orla.",
        localizacao: "Parque Nacional da Tijuca - Rio de Janeiro",
        dica: "Boa opção para vôo livre (parapente); leve água e protetor solar.",
        duracao: "2h",
        guia: [guias[2]._id],
        grupo: [],
      },
      {
        nome: "Cachoeira das Almas",
        tipo_de_trilha: "Moderada",
        descricao:
          "Caminho por rios e grutas até uma bela cachoeira dentro da Tijuca.",
        localizacao: "Parque Nacional da Tijuca - Rio de Janeiro",
        dica: "Calçado para trilha e atenção em trechos molhados e escorregadios.",
        duracao: "2–2,5h",
        guia: [guias[2]._id],
        grupo: [],
      },
      {
        nome: "Trilha das Sete Praias",
        tipo_de_trilha: "Difícil",
        descricao:
          "Percurso costeiro de 16 km ligando praias isoladas como Bonete e Cedro; variação de terreno.",
        localizacao: "Ubatuba - São Paulo",
        dica: "Verificar condições de maré e levar água suficiente; caminhada costeira com trechos de areia e pedra.",
        duracao: "5–5,5h",
        guia: [guias[0]._id],
        grupo: [],
      },
      {
        nome: "Praia da Fortaleza – Cedro do Sul",
        tipo_de_trilha: "Moderada",
        descricao:
          "Caminhada de 5,8 km até praia de águas cristalinas, com trechos de mata e costão.",
        localizacao: "Ubatuba - São Paulo",
        dica: "Proteger-se do sol e checar horários de transporte marítimo quando aplicável.",
        duracao: "2–2,5h",
        guia: [guias[0]._id],
        grupo: [],
      },
      {
        nome: "Praia da Enseada – Praia de Fora",
        tipo_de_trilha: "Moderada",
        descricao:
          "Caminho costeiro de 4 km pela Mata Atlântica entre praias cenográficas.",
        localizacao: "Ubatuba - São Paulo",
        dica: "Ótima para observação da natureza; leve repelente e água.",
        duracao: "1,5h",
        guia: [guias[1]._id],
        grupo: [],
      },
      {
        nome: "Praia do Prumirim – Cachoeira do Prumirim",
        tipo_de_trilha: "Fácil",
        descricao:
          "Rota curta (2,3 km) que combina praia e cachoeira, ideal para quem busca passeio leve.",
        localizacao: "Ubatuba - São Paulo",
        dica: "Trajeto curto; bom para famílias e iniciantes.",
        duracao: "1h",
        guia: [guias[1]._id],
        grupo: [],
      },
      {
        nome: "Cachoeira da Galharada (Horto Florestal)",
        tipo_de_trilha: "Fácil",
        descricao:
          "Caminhada de 4,7 km dentro do Horto Florestal, cachoeira de fácil acesso.",
        localizacao: "Campos do Jordão - São Paulo",
        dica: "Ótima para famílias; leve lanche e roupa para banho.",
        duracao: "1h30–2h",
        guia: [guias[2]._id],
        grupo: [],
      },
      {
        nome: "Trilha das Quatro Pontes",
        tipo_de_trilha: "Fácil",
        descricao:
          "Curta (2 km) com pontes suspensas e trechos de mata rasteira; passeio tranquilo.",
        localizacao: "Campos do Jordão - São Paulo",
        dica: "Boa para famílias e fotos; calçado confortável recomendado.",
        duracao: "45min",
        guia: [guias[2]._id],
        grupo: [],
      },
      {
        nome: "Pico do Itapeva",
        tipo_de_trilha: "Média",
        descricao:
          "Subida de 3 km com bela vista do Vale do Paraíba; em dias claros vê-se várias cidades.",
        localizacao: "Campos do Jordão - São Paulo",
        dica: "Leve casaco e água; chegada oferece mirantes panorâmicos.",
        duracao: "2h",
        guia: [guias[0]._id],
        grupo: [],
      },
      {
        nome: "Pedra do Baú",
        tipo_de_trilha: "Difícil",
        descricao:
          "Formação rochosa a 1.950 m que exige trilha e trechos de escalada; experiência técnica recomendada.",
        localizacao:
          "Campos do Jordão (região de São Bento do Sapucaí) - São Paulo",
        dica: "Exige equipamentos de escalada e guia especializado para as partes técnicas.",
        duracao: "Varia (meio-dia a 1 dia)",
        guia: [guias[1]._id],
        grupo: [],
      },
    ]);
    console.log("✅ Trilhas criadas:", trilhas.length);

    await Guia.updateOne(
      { _id: guias[0]._id },
      { trilha: trilhas[0]._id, grupo: grupos[0]._id },
    );
    await Guia.updateOne(
      { _id: guias[1]._id },
      { trilha: trilhas[1]._id, grupo: grupos[1]._id },
    );
    await Guia.updateOne(
      { _id: guias[2]._id },
      { trilha: trilhas[2]._id, grupo: grupos[2]._id },
    );

    console.log("\n🎉 Banco de dados populado com sucesso!");
    console.log(`\n📊 Resumo:`);
    console.log(`   - ${usuarios.length} usuários`);
    console.log(`   - ${guias.length} guias`);
    console.log(`   - ${grupos.length} grupos`);
    console.log(`   - ${trilhas.length} trilhas`);
  } catch (error) {
    console.error("❌ Erro ao popular banco de dados:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Conexão fechada");
    process.exit(0);
  }
}

popularBancoDeDados();
