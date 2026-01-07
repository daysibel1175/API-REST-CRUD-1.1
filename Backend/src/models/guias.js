const mongoose = require("mongoose");

const GuiaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    contato: { type: Number, required: true },
    trilha: { type: mongoose.Schema.Types.ObjectId, ref: "Trilha" },
    grupo: { type: mongoose.Schema.Types.ObjectId, ref: "Grupo" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guia", GuiaSchema);
