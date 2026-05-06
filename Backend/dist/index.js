"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const trilhas_1 = __importDefault(require("./routes/trilhas"));
const guias_1 = __importDefault(require("./routes/guias"));
const grupo_1 = __importDefault(require("./routes/grupo"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const app = (0, express_1.default)();
const basePort = Number(process.env.PORT) || 9000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const maxPortAttempts = 10;
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (localhostRegex.test(origin))
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
}));
app.use("/trilhasbrasil.com", trilhas_1.default);
app.use("/trilhasbrasil.com", guias_1.default);
app.use("/trilhasbrasil.com", grupo_1.default);
app.use("/trilhasbrasil.com", usuario_1.default);
app.get("/", (_req, res) => {
    res.send("Welcome to my API");
});
app.get("/teste", (_req, res) => {
    res.send("Aplicacion OK");
});
app.use((_req, res) => {
    res.status(404).send("Opa! Essa rota não existe");
});
mongoose_1.default
    .connect(process.env.KEY_URI)
    .then(() => console.log("Conectado a MongoBD Atlas!"))
    .catch((error) => console.error(error));
const startServer = (port, attempts = 0) => {
    const server = app.listen(port, () => {
        console.log(`Servidor Express Escutando... API REST funcionando en http://localhost:${port}`);
    });
    server.on("error", (error) => {
        if (error.code === "EADDRINUSE" && attempts < maxPortAttempts) {
            const nextPort = port + 1;
            console.warn(`Porta ${port} em uso. Tentando ${nextPort}...`);
            startServer(nextPort, attempts + 1);
            return;
        }
        console.error("Erro ao iniciar servidor:", error);
        process.exit(1);
    });
};
startServer(basePort);
