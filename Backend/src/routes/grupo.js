const express = require("express");
const router = express.Router();
const Grupo = require("../models/grupo");

router.post("/grupos", async (req, res) => {
  try {
    const { guia } = req.body;
    if (!guia) return res.status(400).json({ message: "guia é obrigatório" });
    const item = await Grupo.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

router.get("/grupos", async (req, res) => {
  try {
    const items = await Grupo.find()
      .populate({ path: "usuario", select: "nome" })
      .populate({ path: "guia", select: "nome" });
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

router.get("/grupos/:id", async (req, res) => {
  try {
    const item = await Grupo.findById(req.params.id)
      .populate("usuario")
      .populate({ path: "guia", select: "nome" });
    if (!item) return res.status(404).json({ message: "Grupo não encontrado" });
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

router.patch("/grupos/:id", async (req, res) => {
  try {
    const item = await Grupo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ message: "Grupo não encontrado" });
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

router.delete("/grupos/:id", async (req, res) => {
  try {
    const result = await Grupo.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Grupo não encontrado" });
    return res.status(200).json({ message: "Deletado com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});
module.exports = router;
