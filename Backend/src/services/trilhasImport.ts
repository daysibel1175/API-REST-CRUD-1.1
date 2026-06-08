import Trilha from "../models/trilhas";
import { fetchOverpassTrilhas, ImportedTrilha } from "./overpass";
import { isLowQualityImportedTrail } from "./trilhaQuality";

export interface ImportLogger {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export interface ImportStats {
  total: number;
  inseridas: number;
  ignoradas: number;
}

const defaultLogger: ImportLogger = {
  info: (message: string) => console.log(message),
  warn: (message: string) => console.warn(message),
  error: (message: string) => console.error(message),
};

async function importSingleTrilha(
  trilha: ImportedTrilha,
  logger: ImportLogger,
) {
  if (isLowQualityImportedTrail(trilha)) {
    logger.warn(`[skip] osm_id=${trilha.osm_id} descartada por baixa qualidade`);
    return false;
  }

  const existente = await Trilha.findOne({ osm_id: trilha.osm_id }).select(
    "_id",
  );

  if (existente) {
    logger.warn(`[skip] osm_id=${trilha.osm_id} já existe no banco`);
    return false;
  }

  await Trilha.create({
    ...trilha,
    guia: [],
    grupo: [],
  });

  logger.info(`[insert] osm_id=${trilha.osm_id} nome="${trilha.nome}"`);
  return true;
}

export async function importarTrilhasOverpass(
  logger: ImportLogger = defaultLogger,
): Promise<ImportStats> {
  logger.info("[start] iniciando importação do Overpass");

  const trilhasExternas = await fetchOverpassTrilhas();
  logger.info(
    `[fetch] ${trilhasExternas.length} trilhas recebidas da API externa`,
  );

  let inseridas = 0;
  let ignoradas = 0;

  for (const trilha of trilhasExternas) {
    const foiInserida = await importSingleTrilha(trilha, logger);
    if (foiInserida) {
      inseridas += 1;
      continue;
    }

    ignoradas += 1;
  }

  logger.info(
    `[done] importação finalizada: total=${trilhasExternas.length} inseridas=${inseridas} ignoradas=${ignoradas}`,
  );

  return {
    total: trilhasExternas.length,
    inseridas,
    ignoradas,
  };
}
