"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importarTrilhasOverpass = importarTrilhasOverpass;
const trilhas_1 = __importDefault(require("../models/trilhas"));
const overpass_1 = require("./overpass");
const defaultLogger = {
    info: (message) => console.log(message),
    warn: (message) => console.warn(message),
    error: (message) => console.error(message),
};
async function importSingleTrilha(trilha, logger) {
    const existente = await trilhas_1.default.findOne({ osm_id: trilha.osm_id }).select("_id");
    if (existente) {
        logger.warn(`[skip] osm_id=${trilha.osm_id} já existe no banco`);
        return false;
    }
    await trilhas_1.default.create({
        ...trilha,
        guia: [],
        grupo: [],
    });
    logger.info(`[insert] osm_id=${trilha.osm_id} nome="${trilha.nome}"`);
    return true;
}
async function importarTrilhasOverpass(logger = defaultLogger) {
    logger.info("[start] iniciando importação do Overpass");
    const trilhasExternas = await (0, overpass_1.fetchOverpassTrilhas)();
    logger.info(`[fetch] ${trilhasExternas.length} trilhas recebidas da API externa`);
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
    logger.info(`[done] importação finalizada: total=${trilhasExternas.length} inseridas=${inseridas} ignoradas=${ignoradas}`);
    return {
        total: trilhasExternas.length,
        inseridas,
        ignoradas,
    };
}
