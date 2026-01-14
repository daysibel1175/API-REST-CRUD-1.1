const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const trilhasRoutes = require("./routes/trilhas");
const guiaRoutes = require("./routes/guias");
const grupoRoutes = require("./routes/grupo");
const usuarioRoutes = require("./routes/usuario");

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(",") || [
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use("/trilhasbrasil.com", trilhasRoutes);
app.use("/trilhasbrasil.com", guiaRoutes);
app.use("/trilhasbrasil.com", grupoRoutes);
app.use("/trilhasbrasil.com", usuarioRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.get("/teste", (req, res) => {
  res.send("Aplicacion OK");
});

app.use((req, res) => {
  res.status(404).send("Opa! Essa rota não existe");
});

mongoose
  .connect(process.env.KEY_URI)
  .then(() => console.log("Conectado a MongoBD Atlas!"))
  .catch((error) => console.error(error));

app.listen(port, () => {
  console.log(
    `Servidor Express Escutando... API REST funcionando en http://localhost:${port}`
  );
});
