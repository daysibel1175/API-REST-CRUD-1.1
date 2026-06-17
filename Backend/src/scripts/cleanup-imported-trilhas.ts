import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  CleanupLogger,
  deleteLowQualityImportedTrails,
  findLowQualityImportedTrails,
} from "../services/trilhasCleanup";

const envPaths = [
  path.resolve(__dirname, "../../../.env"),
  path.resolve(__dirname, "../../.env"),
];

dotenv.config({ path: envPaths[0] });
if (!process.env.KEY_URI) {
  dotenv.config({ path: envPaths[1] });
}

const logDirectory = path.resolve(__dirname, "../../logs");
const logFilePath = path.join(logDirectory, "cleanup-imported-trilhas.log");
const pendingWrites: Promise<void>[] = [];
const shouldApply = process.argv.includes("--apply");

function formatLine(level: string, message: string): string {
  return `${new Date().toISOString()} [${level}] ${message}`;
}

async function appendLog(level: string, message: string): Promise<void> {
  await fs.mkdir(logDirectory, { recursive: true });
  await fs.appendFile(logFilePath, `${formatLine(level, message)}\n`, "utf8");
}

const logger: CleanupLogger = {
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
      `KEY_URI não definido. Caminhos verificados: ${envPaths.join(", ")}`,
    );
  }

  logger.info("[boot] script de limpeza iniciado");
  logger.info(`[boot] modo=${shouldApply ? "apply" : "dry-run"}`);
  logger.info(`[boot] log em ${logFilePath}`);

  try {
    await mongoose.connect(process.env.KEY_URI);
    logger.info("[mongo] conectado ao banco de dados");

    const preview = await findLowQualityImportedTrails();
    logger.info(`[scan] candidatos encontrados: ${preview.length}`);

    preview.slice(0, 20).forEach((trilha, index) => {
      logger.warn(
        `[candidate:${index + 1}] osm_id=${trilha.osm_id ?? "-"} nome="${trilha.nome}" localizacao="${trilha.localizacao ?? "-"}"`,
      );
    });

    if (!shouldApply) {
      logger.info("[dry-run] nenhuma exclusão foi executada. Use --apply para remover.");
      return;
    }

    const result = await deleteLowQualityImportedTrails(logger);
    logger.info(`[result] ${JSON.stringify(result)}`);
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
