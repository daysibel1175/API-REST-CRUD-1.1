import mongoose, { Document, Schema } from "mongoose";

export interface IGuia extends Document {
  nome: string;
  contato: number;
  trilha?: mongoose.Types.ObjectId;
  grupo?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const GuiaSchema: Schema<IGuia> = new Schema(
  {
    nome: { type: String, required: true },
    contato: { type: Number, required: true },
    trilha: { type: Schema.Types.ObjectId, ref: "Trilha" },
    grupo: { type: Schema.Types.ObjectId, ref: "Grupo" },
  },
  { timestamps: true },
);

export default mongoose.model<IGuia>("Guia", GuiaSchema);
