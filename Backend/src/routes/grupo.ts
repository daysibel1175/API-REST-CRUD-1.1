import express, { Request, Response, Router } from "express";
import Grupo from "../models/grupo";
import Usuario from "../models/usuario";

const router: Router = express.Router();

router.post(
  "/grupos",
  async (req: Request, res: Response): Promise<Response> => {
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
  },
);

router.get(
  "/grupos",
  async (_req: Request, res: Response): Promise<Response> => {
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
  },
);

router.get(
  "/grupos/:id",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await Grupo.findById(req.params.id)
        .populate("usuario")
        .populate({ path: "guia", select: "nome" });
      if (!item)
        return res.status(404).json({ message: "Grupo não encontrado" });
      return res.status(200).json(item);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

router.patch(
  "/grupos/:id",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await Grupo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!item)
        return res.status(404).json({ message: "Grupo não encontrado" });
      return res.status(200).json(item);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

router.delete(
  "/grupos/:id",
  async (req: Request, res: Response): Promise<Response> => {
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
  },
);

// Registrar usuario en un grupo
router.post(
  "/grupos/:id/registrar",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { usuarioId } = req.body;
      if (!usuarioId)
        return res.status(400).json({ message: "usuarioId é obrigatório" });

      const grupo = await Grupo.findById(req.params.id);
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
      await Usuario.findByIdAndUpdate(usuarioId, {
        $addToSet: { grupos: req.params.id },
      });

      const updated = await Grupo.findById(req.params.id)
        .populate("usuario")
        .populate("guia");
      return res.status(200).json(updated);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

// Remover usuario del grupo
router.post(
  "/grupos/:id/desregistrar",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { usuarioId } = req.body;
      if (!usuarioId)
        return res.status(400).json({ message: "usuarioId é obrigatório" });

      const grupo = await Grupo.findById(req.params.id);
      if (!grupo)
        return res.status(404).json({ message: "Grupo não encontrado" });

      // Remover usuario del grupo
      grupo.usuario = grupo.usuario?.filter(
        (id) => id.toString() !== usuarioId,
      );
      await grupo.save();

      // Remover grupo del usuario
      await Usuario.findByIdAndUpdate(usuarioId, {
        $pull: { grupos: req.params.id },
      });

      const updated = await Grupo.findById(req.params.id)
        .populate("usuario")
        .populate("guia");
      return res.status(200).json(updated);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno", error: String(error) });
    }
  },
);

export default router;
