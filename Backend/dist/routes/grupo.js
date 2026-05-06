"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grupo_1 = __importDefault(require("../models/grupo"));
const router = express_1.default.Router();
router.post("/grupos", async (req, res) => {
    try {
        const { guia } = req.body;
        if (!guia)
            return res.status(400).json({ message: "guia é obrigatório" });
        const item = await grupo_1.default.create(req.body);
        return res.status(201).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.get("/grupos", async (_req, res) => {
    try {
        const items = await grupo_1.default.find()
            .populate({ path: "usuario", select: "nome" })
            .populate({ path: "guia", select: "nome" });
        return res.status(200).json(items);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.get("/grupos/:id", async (req, res) => {
    try {
        const item = await grupo_1.default.findById(req.params.id)
            .populate("usuario")
            .populate({ path: "guia", select: "nome" });
        if (!item)
            return res.status(404).json({ message: "Grupo não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.patch("/grupos/:id", async (req, res) => {
    try {
        const item = await grupo_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!item)
            return res.status(404).json({ message: "Grupo não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.delete("/grupos/:id", async (req, res) => {
    try {
        const result = await grupo_1.default.findByIdAndDelete(req.params.id);
        if (!result)
            return res.status(404).json({ message: "Grupo não encontrado" });
        return res.status(200).json({ message: "Deletado com sucesso" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
exports.default = router;
