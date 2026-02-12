import mongoose, { Document, Schema } from "mongoose";

export interface ITrilha extends Document {
  nome: string;
  tipo_de_trilha: string;
  descricao?: string;
  localizacao?: string;
  dica?: string;
  duracao?: string;
  img?: string;
  guia?: mongoose.Types.ObjectId[];
  grupo?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TrilhaSchema: Schema<ITrilha> = new Schema(
  {
    nome: { type: String, required: true },
    tipo_de_trilha: { type: String, required: true },
    descricao: { type: String },
    localizacao: { type: String },
    dica: { type: String },
    duracao: { type: String },
    img: { type: String },
    guia: [{ type: Schema.Types.ObjectId, ref: "Guia" }],
    grupo: [{ type: Schema.Types.ObjectId, ref: "Grupo" }],
  },
  { timestamps: true },
);

export default mongoose.model<ITrilha>("Trilha", TrilhaSchema);
