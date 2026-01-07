const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    idade: { type: Number, required: true },
    contato: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    grupo: { type: mongoose.Schema.Types.ObjectId, ref: "Grupo" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", UsuarioSchema);
