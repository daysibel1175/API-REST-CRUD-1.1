import express, { Request, Response, Router } from "express";
import Usuario from "../models/usuario";

const router: Router = express.Router();

router.post(
  "/usuarios",
  async (req: Request, res: Response): Promise<Response> => {
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
      const item = await Usuario.create(req.body);
      return res.status(201).json(item);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

router.get(
  "/usuarios",
  async (_req: Request, res: Response): Promise<Response> => {
    try {
      const items = await Usuario.find();
      return res.status(200).json(items);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

router.get(
  "/usuarios/:id",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await Usuario.findById(req.params.id);
      if (!item)
        return res.status(404).json({ message: "Usuário não encontrado" });
      return res.status(200).json(item);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

router.patch(
  "/usuarios/:id",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!item)
        return res.status(404).json({ message: "Usuário não encontrado" });
      return res.status(200).json(item);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

router.delete(
  "/usuarios/:id",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await Usuario.findByIdAndDelete(req.params.id);
      if (!result)
        return res.status(404).json({ message: "Usuário não encontrado" });
      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

export default router;
