import mongoose, { Document, Schema } from "mongoose";

export interface IGrupo extends Document {
  guia: mongoose.Types.ObjectId;
  familiar: boolean;
  horaPartida?: string;
  horaChegada?: string;
  usuario?: mongoose.Types.ObjectId[];
  admin: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const GrupoSchema: Schema<IGrupo> = new Schema(
  {
    guia: { type: Schema.Types.ObjectId, ref: "Guia", required: true },
    familiar: { type: Boolean, default: false },
    horaPartida: { type: String },
    horaChegada: { type: String },
    usuario: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
    admin: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IGrupo>("Grupo", GrupoSchema);
