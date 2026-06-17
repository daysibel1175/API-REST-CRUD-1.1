"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuario_1 = __importDefault(require("../models/usuario"));
const router = express_1.default.Router();
router.post("/usuarios", async (req, res) => {
    try {
        const { nome, idade, contato, email } = req.body;
        if (!nome || typeof nome !== "string")
            return res.status(400).json({ message: "nome é obrigatório" });
        if (typeof idade !== "number")
            return res.status(400).json({ message: "idade deve ser numérica" });
        if (typeof contato !== "number")
            return res.status(400).json({ message: "contato deve ser numérico" });
        if (!email || typeof email !== "string")
            return res.status(400).json({ message: "email é obrigatório" });
        const item = await usuario_1.default.create(req.body);
        return res.status(201).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.get("/usuarios", async (_req, res) => {
    try {
        const items = await usuario_1.default.find();
        return res.status(200).json(items);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.get("/usuarios/:id", async (req, res) => {
    try {
        const item = await usuario_1.default.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: "Usuário não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.patch("/usuarios/:id", async (req, res) => {
    try {
        const item = await usuario_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!item)
            return res.status(404).json({ message: "Usuário não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
router.delete("/usuarios/:id", async (req, res) => {
    try {
        const result = await usuario_1.default.findByIdAndDelete(req.params.id);
        if (!result)
            return res.status(404).json({ message: "Usuário não encontrado" });
        return res.status(200).json({ message: "Usuário deletado com sucesso" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
exports.default = router;
