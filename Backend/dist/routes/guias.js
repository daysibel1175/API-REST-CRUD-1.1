"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guias_1 = __importDefault(require("../models/guias"));
const router = express_1.default.Router();
router.post("/guias", async (req, res) => {
    try {
        const { nome, contato } = req.body;
        if (!nome || typeof nome !== "string")
            return res.status(400).json({ message: "nome é obrigatório" });
        if (typeof contato !== "number")
            return res.status(400).json({ message: "contato deve ser numérico" });
        const item = await guias_1.default.create(req.body);
        return res.status(201).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.get("/guias", async (_req, res) => {
    try {
        const items = await guias_1.default.find()
            .populate({ path: "trilha", select: "nome" })
            .populate({ path: "grupo" });
        return res.status(200).json(items);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.get("/guias/:id", async (req, res) => {
    try {
        const item = await guias_1.default.findById(req.params.id)
            .populate("grupo")
            .populate({ path: "trilha", select: "nome" });
        if (!item)
            return res.status(404).json({ message: "Guia não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.patch("/guias/:id", async (req, res) => {
    try {
        const item = await guias_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!item)
            return res.status(404).json({ message: "Guia não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.delete("/guias/:id", async (req, res) => {
    try {
        const result = await guias_1.default.findByIdAndDelete(req.params.id);
        if (!result)
            return res.status(404).json({ message: "Guia não encontrado" });
        return res.status(200).json({ message: "Deletado com sucesso" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
exports.default = router;
