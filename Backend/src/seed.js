const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const Usuario = require("./models/usuario");
const Guia = require("./models/guias");
const Grupo = require("./models/grupo");
const Trilha = require("./models/trilhas");

mongoose
  .connect(process.env.KEY_URI)
  .then(() => console.log("Conectado ao MongoDB Atlas!"))
  .catch((error) => console.error("Erro ao conectar:", error));

async function popularBancoDeDados() {
  try {
    await Usuario.deleteMany({});
    await Guia.deleteMany({});
    await Grupo.deleteMany({});
    await Trilha.deleteMany({});
    console.log("✅ Dados antigos removidos");

    const usuarios = await Usuario.insertMany([
      { nome: "Maria Silva", idade: 28, contato: 11987654321, email: "maria.silva@email.com" },
      { nome: "João Santos", idade: 35, contato: 11876543210, email: "joao.santos@email.com" },
      { nome: "Ana Costa", idade: 42, contato: 11765432109, email: "ana.costa@email.com" },
      { nome: "Pedro Oliveira", idade: 15, contato: 11654321098, email: "pedro.oliveira@email.com" },
      { nome: "Carla Lima", idade: 31, contato: 11543210987, email: "carla.lima@email.com" }
    ]);
    console.log("✅ Usuários criados:", usuarios.length);

    const guias = await Guia.insertMany([
      { nome: "Carlos Montanha", contato: 11999888777 },
      { nome: "Fernanda Trilhas", contato: 11888777666 },
      { nome: "Ricardo Aventura", contato: 11777666555 }
    ]);
    console.log("✅ Guias criados:", guias.length);

    const grupos = await Grupo.insertMany([
      { guia: guias[0]._id, familiar: true, usuario: [usuarios[0]._id, usuarios[1]._id] },
      { guia: guias[1]._id, familiar: false, usuario: [usuarios[2]._id, usuarios[4]._id] },
      { guia: guias[2]._id, familiar: true, usuario: [usuarios[3]._id] }
    ]);
    console.log("✅ Grupos criados:", grupos.length);

    await Usuario.updateOne({ _id: usuarios[0]._id }, { grupo: grupos[0]._id });
    await Usuario.updateOne({ _id: usuarios[1]._id }, { grupo: grupos[0]._id });
    await Usuario.updateOne({ _id: usuarios[2]._id }, { grupo: grupos[1]._id });
    await Usuario.updateOne({ _id: usuarios[3]._id }, { grupo: grupos[2]._id });
    await Usuario.updateOne({ _id: usuarios[4]._id }, { grupo: grupos[1]._id });

    const trilhas = await Trilha.insertMany([
      { nome: "Trilha da Cachoeira", tipo_de_trilha: "Moderada", descricao: "Trilha de 5km que leva a uma bela cachoeira", localizacao: "Serra da Mantiqueira - São Paulo", dica: "Leve roupa de banho e protetor solar", guia: [guias[0]._id], grupo: [grupos[0]._id] },
      { nome: "Trilha do Pico Alto", tipo_de_trilha: "Difícil", descricao: "Trilha de 8km até o topo da montanha com vista panorâmica", localizacao: "Serra dos Órgãos - Rio de Janeiro", dica: "Inicie cedo pela manhã e leve bastante água", guia: [guias[1]._id], grupo: [grupos[1]._id] },
      { nome: "Trilha da Mata Atlântica", tipo_de_trilha: "Fácil", descricao: "Caminhada ecológica de 3km pela mata preservada", localizacao: "Parque Nacional da Tijuca - Rio de Janeiro", dica: "Perfeita para famílias com crianças", guia: [guias[2]._id], grupo: [grupos[2]._id] },
      { nome: "Trilha da Praia Secreta", tipo_de_trilha: "Moderada", descricao: "Trilha de 4km até uma praia isolada", localizacao: "Ubatuba - São Paulo", dica: "Maré baixa facilita o acesso", guia: [guias[0]._id], grupo: [] },
      { nome: "Trilha do Vale Verde", tipo_de_trilha: "Fácil", descricao: "Caminhada suave de 2km pelo vale", localizacao: "Campos do Jordão - São Paulo", dica: "Leve casaco, a temperatura pode cair", guia: [guias[1]._id], grupo: [] }
    ]);
    console.log("✅ Trilhas criadas:", trilhas.length);

    await Guia.updateOne({ _id: guias[0]._id }, { trilha: trilhas[0]._id, grupo: grupos[0]._id });
    await Guia.updateOne({ _id: guias[1]._id }, { trilha: trilhas[1]._id, grupo: grupos[1]._id });
    await Guia.updateOne({ _id: guias[2]._id }, { trilha: trilhas[2]._id, grupo: grupos[2]._id });

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
