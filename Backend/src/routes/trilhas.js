const express = require("express");
const router = express.Router();
const Trilha = require("../models/trilhas");

router.post("/trilhas", async (req, res) => {
  try {
    const { nome, tipo_de_trilha } = req.body;
    if (!nome || typeof nome !== "string")
      return res.status(400).json({ message: "nome é obrigatório" });
    if (!tipo_de_trilha || typeof tipo_de_trilha !== "string")
      return res.status(400).json({ message: "tipo_de_trilha é obrigatório" });

    const trilha = await Trilha.create(req.body);
    return res.status(201).json(trilha);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

router.get("/trilhas", async (req, res) => {
  try {
    const items = await Trilha.find()
      .populate({ path: "guia", select: "nome" })
      .populate({ path: "grupo" });
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

router.get("/trilhas/:id", async (req, res) => {
  try {
    const item = await Trilha.findById(req.params.id)
      .populate("guia")
      .populate("grupo");
    if (!item)
      return res.status(404).json({ message: "Trilha não encontrada" });
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

router.patch("/trilhas/:id", async (req, res) => {
  try {
    const item = await Trilha.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item)
      return res.status(404).json({ message: "Trilha não encontrada" });
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

router.delete("/trilhas/:id", async (req, res) => {
  try {
    const result = await Trilha.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Trilha não encontrada" });
    return res.status(200).json({ message: "Deletado com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: String(error) });
  }
});

module.exports = router;
