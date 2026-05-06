"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grupo_1 = __importDefault(require("../models/grupo"));
const usuario_1 = __importDefault(require("../models/usuario"));
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
// Registrar usuario en un grupo
router.post("/grupos/:id/registrar", async (req, res) => {
    try {
        const { usuarioId } = req.body;
        if (!usuarioId)
            return res.status(400).json({ message: "usuarioId é obrigatório" });
        const grupo = await grupo_1.default.findById(req.params.id);
        if (!grupo)
            return res.status(404).json({ message: "Grupo não encontrado" });
        // Verificar si el usuario ya está en el grupo
        if (grupo.usuario?.includes(usuarioId)) {
            return res
                .status(400)
                .json({ message: "Usuario já está registrado neste grupo" });
        }
        // Agregar usuario al grupo
        grupo.usuario?.push(usuarioId);
        await grupo.save();
        // Agregar grupo al usuario
        await usuario_1.default.findByIdAndUpdate(usuarioId, {
            $addToSet: { grupos: req.params.id },
        });
        const updated = await grupo_1.default.findById(req.params.id)
            .populate("usuario")
            .populate("guia");
        return res.status(200).json(updated);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
// Remover usuario del grupo
router.post("/grupos/:id/desregistrar", async (req, res) => {
    try {
        const { usuarioId } = req.body;
        if (!usuarioId)
            return res.status(400).json({ message: "usuarioId é obrigatório" });
        const grupo = await grupo_1.default.findById(req.params.id);
        if (!grupo)
            return res.status(404).json({ message: "Grupo não encontrado" });
        // Remover usuario del grupo
        grupo.usuario = grupo.usuario?.filter((id) => id.toString() !== usuarioId);
        await grupo.save();
        // Remover grupo del usuario
        await usuario_1.default.findByIdAndUpdate(usuarioId, {
            $pull: { grupos: req.params.id },
        });
        const updated = await grupo_1.default.findById(req.params.id)
            .populate("usuario")
            .populate("guia");
        return res.status(200).json(updated);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erro interno", error: String(error) });
    }
});
exports.default = router;
