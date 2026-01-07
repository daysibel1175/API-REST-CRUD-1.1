const mongoose = require("mongoose");

const GrupoSchema = new mongoose.Schema(
  {
    guia: { type: mongoose.Schema.Types.ObjectId, ref: "Guia", required: true },
    familiar: { type: Boolean, default: false },
    usuario: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grupo", GrupoSchema);
