import Trilha from "../models/trilhas";
import { isLowQualityImportedTrail } from "./trilhaQuality";

export interface CleanupLogger {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export interface CleanupStats {
  scanned: number;
  matched: number;
  deleted: number;
}

export interface CleanupTrailPreview {
  _id: string;
  osm_id?: number;
  nome: string;
  localizacao?: string;
  tipo_de_trilha: string;
}

export async function findLowQualityImportedTrails(): Promise<CleanupTrailPreview[]> {
  const trilhas = await Trilha.find({ tipo_de_trilha: "Importada" }).select(
    "_id osm_id nome localizacao tipo_de_trilha descricao dica duracao distancia img guia grupo",
  );

  return trilhas
    .filter((trilha) => isLowQualityImportedTrail(trilha))
    .map((trilha) => ({
      _id: String(trilha._id),
      osm_id: trilha.osm_id,
      nome: trilha.nome,
      localizacao: trilha.localizacao,
      tipo_de_trilha: trilha.tipo_de_trilha,
    }));
}

export async function deleteLowQualityImportedTrails(
  logger: CleanupLogger,
): Promise<CleanupStats> {
  const matches = await findLowQualityImportedTrails();
  const ids = matches.map((trilha) => trilha._id);

  logger.info(`[scan] trilhas importadas analisadas: ${matches.length}`);

  if (ids.length === 0) {
    logger.info("[done] nenhum registro de baixa qualidade encontrado");
    return { scanned: matches.length, matched: 0, deleted: 0 };
  }

  const result = await Trilha.deleteMany({ _id: { $in: ids } });
  logger.warn(`[delete] registros removidos: ${result.deletedCount ?? ids.length}`);

  return {
    scanned: matches.length,
    matched: matches.length,
    deleted: result.deletedCount ?? ids.length,
  };
}
