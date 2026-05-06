"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trilhas_1 = __importDefault(require("../models/trilhas"));
const router = express_1.default.Router();
router.post("/trilhas", async (req, res) => {
    try {
        const { nome, tipo_de_trilha } = req.body;
        if (!nome || typeof nome !== "string")
            return res.status(400).json({ message: "nome é obrigatório" });
        if (!tipo_de_trilha || typeof tipo_de_trilha !== "string")
            return res
                .status(400)
                .json({ message: "tipo_de_trilha é obrigatório" });
        const trilha = await trilhas_1.default.create(req.body);
        return res.status(201).json(trilha);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.get("/trilhas", async (_req, res) => {
    try {
        const items = await trilhas_1.default.find()
            .populate({ path: "guia", select: "nome" })
            .populate({ path: "grupo" });
        return res.status(200).json(items);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.get("/trilhas/:id", async (req, res) => {
    try {
        const item = await trilhas_1.default.findById(req.params.id)
            .populate("guia")
            .populate("grupo");
        if (!item)
            return res.status(404).json({ message: "Trilha não encontrada" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.patch("/trilhas/:id", async (req, res) => {
    try {
        const item = await trilhas_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!item)
            return res.status(404).json({ message: "Trilha não encontrada" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.delete("/trilhas/:id", async (req, res) => {
    try {
        const result = await trilhas_1.default.findByIdAndDelete(req.params.id);
        if (!result)
            return res.status(404).json({ message: "Trilha não encontrada" });
        return res.status(200).json({ message: "Deletado com sucesso" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
exports.default = router;
