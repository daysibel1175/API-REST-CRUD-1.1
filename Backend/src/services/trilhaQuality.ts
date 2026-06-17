type TrailValue = string | undefined | null;

export interface TrailQualityLike {
  nome?: TrailValue;
  tipo_de_trilha?: TrailValue;
  descricao?: TrailValue;
  localizacao?: TrailValue;
  dica?: TrailValue;
  duracao?: TrailValue;
  distancia?: TrailValue;
  img?: TrailValue;
  guia?: unknown[];
  grupo?: unknown[];
}

function normalizeText(value?: TrailValue): string {
  return (value ?? "").trim();
}

function isMeaningfulText(value?: TrailValue): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return false;
  if (/^Trilha OSM \d+$/i.test(normalized)) return false;
  return normalized.length >= 4;
}

function isMeaningfulImage(value?: TrailValue): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return false;
  return normalized.length >= 10;
}

function isMeaningfulArray(value?: unknown[]): boolean {
  return Array.isArray(value) && value.length > 0;
}

export function countUsefulTrailFields(trilha: TrailQualityLike): number {
  const fields: Array<boolean> = [
    isMeaningfulText(trilha.descricao),
    isMeaningfulText(trilha.localizacao),
    isMeaningfulText(trilha.dica),
    isMeaningfulText(trilha.duracao),
    isMeaningfulText(trilha.distancia),
    isMeaningfulImage(trilha.img),
    isMeaningfulArray(trilha.guia),
    isMeaningfulArray(trilha.grupo),
  ];

  return fields.filter(Boolean).length;
}

export function isLowQualityImportedTrail(trilha: TrailQualityLike): boolean {
  if (normalizeText(trilha.tipo_de_trilha).toLowerCase() !== "importada") {
    return false;
  }

  const nome = normalizeText(trilha.nome);
  if (/^Trilha OSM \d+$/i.test(nome)) return true;

  return countUsefulTrailFields(trilha) < 2;
}
