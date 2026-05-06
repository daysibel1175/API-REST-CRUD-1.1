"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const usuario_1 = __importDefault(require("./models/usuario"));
const guias_1 = __importDefault(require("./models/guias"));
const grupo_1 = __importDefault(require("./models/grupo"));
const trilhas_1 = __importDefault(require("./models/trilhas"));
mongoose_1.default
    .connect(process.env.KEY_URI)
    .then(() => console.log("Conectado ao MongoDB Atlas!"))
    .catch((error) => console.error("Erro ao conectar:", error));
async function popularBancoDeDados() {
    try {
        await usuario_1.default.deleteMany({});
        await guias_1.default.deleteMany({});
        await grupo_1.default.deleteMany({});
        await trilhas_1.default.deleteMany({});
        console.log("✅ Dados antigos removidos");
        const usuarios = await usuario_1.default.insertMany([
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
        const guias = await guias_1.default.insertMany([
            { nome: "Carlos Montanha", contato: 11999888777 },
            { nome: "Fernanda Trilhas", contato: 11888777666 },
            { nome: "Ricardo Aventura", contato: 11777666555 },
        ]);
        console.log("✅ Guias criados:", guias.length);
        const grupos = await grupo_1.default.insertMany([
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
        await usuario_1.default.updateMany({}, { $set: { grupos: [] } });
        await usuario_1.default.updateOne({ _id: usuarios[1]._id }, { grupos: [grupos[0]._id] });
        await usuario_1.default.updateOne({ _id: usuarios[2]._id }, { grupos: [grupos[0]._id] });
        await usuario_1.default.updateOne({ _id: usuarios[3]._id }, { grupos: [grupos[1]._id] });
        await usuario_1.default.updateOne({ _id: usuarios[4]._id }, { grupos: [grupos[2]._id] });
        await usuario_1.default.updateOne({ _id: usuarios[5]._id }, { grupos: [grupos[1]._id] });
        const trilhas = await trilhas_1.default.insertMany([
            {
                nome: "Trilha da Cachoeira",
                tipo_de_trilha: "Moderada",
                descricao: "Trilha de 5km que leva a uma bela cachoeira",
                localizacao: "Serra da Mantiqueira - São Paulo",
                dica: "Leve roupa de banho e protetor solar",
                guia: [guias[0]._id],
                grupo: [grupos[0]._id],
            },
            {
                nome: "Trilha do Pico Alto",
                tipo_de_trilha: "Difícil",
                descricao: "Trilha de 8km até o topo da montanha com vista panorâmica",
                localizacao: "Serra dos Órgãos - Rio de Janeiro",
                dica: "Inicie cedo pela manhã e leve bastante água",
                guia: [guias[1]._id],
                grupo: [grupos[1]._id],
            },
            {
                nome: "Trilha da Mata Atlântica",
                tipo_de_trilha: "Fácil",
                descricao: "Caminhada ecológica de 3km pela mata preservada",
                localizacao: "Parque Nacional da Tijuca - Rio de Janeiro",
                dica: "Perfeita para famílias com crianças",
                guia: [guias[2]._id],
                grupo: [grupos[2]._id],
            },
            {
                nome: "Trilha da Praia Secreta",
                tipo_de_trilha: "Moderada",
                descricao: "Trilha de 4km até uma praia isolada",
                localizacao: "Ubatuba - São Paulo",
                dica: "Maré baixa facilita o acesso",
                guia: [guias[0]._id],
                grupo: [],
            },
            {
                nome: "Trilha do Vale Verde",
                tipo_de_trilha: "Fácil",
                descricao: "Caminhada suave de 2km pelo vale",
                localizacao: "Campos do Jordão - São Paulo",
                dica: "Leve casaco, a temperatura pode cair",
                guia: [guias[1]._id],
                grupo: [],
            },
        ]);
        console.log("✅ Trilhas criadas:", trilhas.length);
        await guias_1.default.updateOne({ _id: guias[0]._id }, { trilha: trilhas[0]._id, grupo: grupos[0]._id });
        await guias_1.default.updateOne({ _id: guias[1]._id }, { trilha: trilhas[1]._id, grupo: grupos[1]._id });
        await guias_1.default.updateOne({ _id: guias[2]._id }, { trilha: trilhas[2]._id, grupo: grupos[2]._id });
        console.log("\n🎉 Banco de dados populado com sucesso!");
        console.log(`\n📊 Resumo:`);
        console.log(`   - ${usuarios.length} usuários`);
        console.log(`   - ${guias.length} guias`);
        console.log(`   - ${grupos.length} grupos`);
        console.log(`   - ${trilhas.length} trilhas`);
    }
    catch (error) {
        console.error("❌ Erro ao popular banco de dados:", error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log("\n✅ Conexão fechada");
        process.exit(0);
    }
}
popularBancoDeDados();
