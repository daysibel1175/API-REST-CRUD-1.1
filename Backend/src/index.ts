import express, { Request, Response, Application } from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import trilhasRoutes from "./routes/trilhas";
import guiaRoutes from "./routes/guias";
import grupoRoutes from "./routes/grupo";
import usuarioRoutes from "./routes/usuario";

const app: Application = express();
const basePort: number = Number(process.env.PORT) || 9000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const maxPortAttempts = 10;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (localhostRegex.test(origin)) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  }),
);
app.use("/trilhasbrasil.com", trilhasRoutes);
app.use("/trilhasbrasil.com", guiaRoutes);
app.use("/trilhasbrasil.com", grupoRoutes);
app.use("/trilhasbrasil.com", usuarioRoutes);

app.get("/", (_req: Request, res: Response): void => {
  res.send("Welcome to my API");
});

app.get("/teste", (_req: Request, res: Response): void => {
  res.send("Aplicacion OK");
});

app.use((_req: Request, res: Response): void => {
  res.status(404).send("Opa! Essa rota não existe");
});

mongoose
  .connect(process.env.KEY_URI as string)
  .then(() => console.log("Conectado a MongoBD Atlas!"))
  .catch((error: Error) => console.error(error));

const startServer = (port: number, attempts = 0): void => {
  const server = app.listen(port, (): void => {
    console.log(
      `Servidor Express Escutando... API REST funcionando en http://localhost:${port}`,
    );
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE" && attempts < maxPortAttempts) {
      const nextPort = port + 1;
      console.warn(`Porta ${port} em uso. Tentando ${nextPort}...`);
      startServer(nextPort, attempts + 1);
      return;
    }
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  });
};

startServer(basePort);
