export interface OverpassTagMap {
  name?: string;
  distance?: string;
  route?: string;
  network?: string;
  symbol?: string;
  ref?: string;
  description?: string;
  note?: string;
  wikipedia?: string;
  website?: string;
  operator?: string;
  tourism?: string;
  leisure?: string;
  surface?: string;
  access?: string;
  [key: string]: string | undefined;
}

export interface OverpassElement {
  type?: string;
  id: number;
  tags?: OverpassTagMap;
}

export interface OverpassResponse {
  elements?: OverpassElement[];
}

export interface ImportedTrilha {
  osm_id: number;
  nome: string;
  tipo_de_trilha: string;
  tipo_de_rota?: string;
  distancia?: string;
  descricao?: string;
  localizacao?: string;
  dica?: string;
  duracao?: string;
  fonte?: string;
  img?: string;
}

const DEFAULT_OVERPASS_URL =
  process.env.OVERPASS_API_URL ?? "https://overpass-api.de/api/interpreter";

const DEFAULT_OVERPASS_QUERY = `[out:json][timeout:180];
(
  rel["route"="hiking"](-33.75,-73.98,5.27,-28.84);
  rel["route"="foot"](-33.75,-73.98,5.27,-28.84);
);
out tags;`;

function cleanText(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildLocation(tags: OverpassTagMap): string | undefined {
  return (
    cleanText(tags.name) ||
    cleanText(tags.ref) ||
    cleanText(tags.operator) ||
    cleanText(tags.network)
  );
}

function buildDescription(tags: OverpassTagMap): string | undefined {
  return cleanText(tags.description) || cleanText(tags.note);
}

export function normalizeOverpassElement(
  element: OverpassElement,
): ImportedTrilha {
  const tags = element.tags ?? {};
  const routeType = cleanText(tags.route) ?? "hiking";

  return {
    osm_id: element.id,
    nome: cleanText(tags.name) ?? `Trilha OSM ${element.id}`,
    tipo_de_trilha: "Importada",
    tipo_de_rota: routeType,
    distancia: cleanText(tags.distance),
    descricao: buildDescription(tags),
    localizacao: buildLocation(tags),
    fonte: "overpass-api.de",
  };
}

export async function fetchOverpassTrilhas(): Promise<ImportedTrilha[]> {
  const requestUrl = `${DEFAULT_OVERPASS_URL}?data=${encodeURIComponent(DEFAULT_OVERPASS_QUERY)}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "TrilhasBrasil/1.0 (local import script)",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Overpass respondeu com status ${response.status} ${response.statusText}. Resposta: ${errorBody.slice(0, 300)}`,
    );
  }

  const payload = (await response.json()) as OverpassResponse;
  const elements = payload.elements ?? [];

  return elements
    .filter(
      (element) =>
        element.type === "relation" || typeof element.id === "number",
    )
    .map((element) => normalizeOverpassElement(element));
}
