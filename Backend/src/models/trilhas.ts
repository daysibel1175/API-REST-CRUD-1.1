import mongoose, { Document, Schema } from "mongoose";

export interface ITrilha extends Document {
  osm_id?: number;
  nome: string;
  tipo_de_trilha: string;
  tipo_de_rota?: string;
  distancia?: string;
  descricao?: string;
  localizacao?: string;
  dica?: string;
  duracao?: string;
  fonte?: string;
  img?: string;
  guia?: mongoose.Types.ObjectId[];
  grupo?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TrilhaSchema: Schema<ITrilha> = new Schema(
  {
    osm_id: { type: Number, unique: true, sparse: true },
    nome: { type: String, required: true },
    tipo_de_trilha: { type: String, required: true },
    tipo_de_rota: { type: String },
    distancia: { type: String },
    descricao: { type: String },
    localizacao: { type: String },
    dica: { type: String },
    duracao: { type: String },
    fonte: { type: String },
    img: { type: String },
    guia: [{ type: Schema.Types.ObjectId, ref: "Guia" }],
    grupo: [{ type: Schema.Types.ObjectId, ref: "Grupo" }],
  },
  { timestamps: true },
);

export default mongoose.model<ITrilha>("Trilha", TrilhaSchema);
