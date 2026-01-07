const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const trilhasRoutes = require("./routes/trilhas.js");
const guia = require("./routes/guias.js");
const grupo = require("./routes/grupo.js");
const usuario = require("./routes/usuario.js");

const app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(express.json());
app.use("/trilhasbrasil.com", trilhasRoutes);
app.use("/trilhasbrasil.com", guia);
app.use("/trilhasbrasil.com", grupo);
app.use("/trilhasbrasil.com", usuario);

//routes

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.get("/teste", (req, res) => {
  res.send("Aplicacion OK");
});

app.use((req, res) => {
  const error = new Error();
  error.status = 404;
  res.status(404).send("Opa! Essa rota não existe");
});

//mongoose connection

mongoose
  .connect(process.env.KEY_URI)
  .then(() => console.log("Conectado a MongoBD Atlas!"))
  .catch((error) => console.error(error));

app.listen(port, () => {
  console.log(
    `Servidor Express Escutando... API REST funcionando en http://localhost:${port}`
  );
});
