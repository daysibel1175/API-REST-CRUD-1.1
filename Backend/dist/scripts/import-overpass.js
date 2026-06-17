"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const trilhasImport_1 = require("../services/trilhasImport");
const envPaths = [
    path_1.default.resolve(__dirname, "../../../.env"),
    path_1.default.resolve(__dirname, "../../.env"),
];
const envLoaded = dotenv_1.default.config({ path: envPaths[0] }).parsed
    ? envPaths[0]
    : dotenv_1.default.config({ path: envPaths[1] }).parsed
        ? envPaths[1]
        : undefined;
const logDirectory = path_1.default.resolve(__dirname, "../../logs");
const logFilePath = path_1.default.join(logDirectory, "import-overpass.log");
const pendingWrites = [];
function formatLine(level, message) {
    return `${new Date().toISOString()} [${level}] ${message}`;
}
async function appendLog(level, message) {
    await promises_1.default.mkdir(logDirectory, { recursive: true });
    await promises_1.default.appendFile(logFilePath, `${formatLine(level, message)}\n`, "utf8");
}
const logger = {
    info: (message) => {
        console.log(message);
        pendingWrites.push(appendLog("INFO", message));
    },
    warn: (message) => {
        console.warn(message);
        pendingWrites.push(appendLog("WARN", message));
    },
    error: (message) => {
        console.error(message);
        pendingWrites.push(appendLog("ERROR", message));
    },
};
async function main() {
    if (!process.env.KEY_URI) {
        throw new Error(`KEY_URI não definido. Caminhos verificados: ${envPaths.join(", ")}${envLoaded ? "" : ". Nenhum arquivo .env válido foi carregado."}`);
    }
    logger.info("[boot] script de importação iniciado");
    logger.info(`[boot] log em ${logFilePath}`);
    try {
        await mongoose_1.default.connect(process.env.KEY_URI);
        logger.info("[mongo] conectado ao banco de dados");
        const stats = await (0, trilhasImport_1.importarTrilhasOverpass)(logger);
        logger.info(`[result] ${JSON.stringify(stats)}`);
    }
    catch (error) {
        const message = error instanceof Error ? error.stack || error.message : String(error);
        logger.error(`[fatal] ${message}`);
        process.exitCode = 1;
    }
    finally {
        await Promise.allSettled(pendingWrites);
        await mongoose_1.default.connection.close().catch(() => undefined);
        logger.info("[mongo] conexão encerrada");
        await Promise.allSettled(pendingWrites);
    }
}
main().catch((error) => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error(message);
    process.exit(1);
});
