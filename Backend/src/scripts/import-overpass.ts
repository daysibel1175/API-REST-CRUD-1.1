import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  importarTrilhasOverpass,
  ImportLogger,
} from "../services/trilhasImport";

const envPaths = [
  path.resolve(__dirname, "../../../.env"),
  path.resolve(__dirname, "../../.env"),
];

const envLoaded = dotenv.config({ path: envPaths[0] }).parsed
  ? envPaths[0]
  : dotenv.config({ path: envPaths[1] }).parsed
    ? envPaths[1]
    : undefined;

const logDirectory = path.resolve(__dirname, "../../logs");
const logFilePath = path.join(logDirectory, "import-overpass.log");
const pendingWrites: Promise<void>[] = [];

function formatLine(level: string, message: string): string {
  return `${new Date().toISOString()} [${level}] ${message}`;
}

async function appendLog(level: string, message: string): Promise<void> {
  await fs.mkdir(logDirectory, { recursive: true });
  await fs.appendFile(logFilePath, `${formatLine(level, message)}\n`, "utf8");
}

const logger: ImportLogger = {
  info: (message: string) => {
    console.log(message);
    pendingWrites.push(appendLog("INFO", message));
  },
  warn: (message: string) => {
    console.warn(message);
    pendingWrites.push(appendLog("WARN", message));
  },
  error: (message: string) => {
    console.error(message);
    pendingWrites.push(appendLog("ERROR", message));
  },
};

async function main(): Promise<void> {
  if (!process.env.KEY_URI) {
    throw new Error(
      `KEY_URI não definido. Caminhos verificados: ${envPaths.join(", ")}${envLoaded ? "" : ". Nenhum arquivo .env válido foi carregado."}`,
    );
  }

  logger.info("[boot] script de importação iniciado");
  logger.info(`[boot] log em ${logFilePath}`);

  try {
    await mongoose.connect(process.env.KEY_URI);
    logger.info("[mongo] conectado ao banco de dados");

    const stats = await importarTrilhasOverpass(logger);
    logger.info(`[result] ${JSON.stringify(stats)}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.stack || error.message : String(error);
    logger.error(`[fatal] ${message}`);
    process.exitCode = 1;
  } finally {
    await Promise.allSettled(pendingWrites);
    await mongoose.connection.close().catch(() => undefined);
    logger.info("[mongo] conexão encerrada");
    await Promise.allSettled(pendingWrites);
  }
}

main().catch((error) => {
  const message =
    error instanceof Error ? error.stack || error.message : String(error);
  console.error(message);
  process.exit(1);
});
