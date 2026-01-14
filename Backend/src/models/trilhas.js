const mongoose = require("mongoose");

const TrilhaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    tipo_de_trilha: { type: String, required: true },
    descricao: { type: String },
    localizacao: { type: String },
    dica: { type: String },
    guia: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guia" }],
    grupo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Grupo" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trilha", TrilhaSchema);
