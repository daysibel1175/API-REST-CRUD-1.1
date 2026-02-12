import mongoose, { Document, Schema } from "mongoose";

export interface IGrupo extends Document {
  guia: mongoose.Types.ObjectId;
  familiar: boolean;
  usuario?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const GrupoSchema: Schema<IGrupo> = new Schema(
  {
    guia: { type: Schema.Types.ObjectId, ref: "Guia", required: true },
    familiar: { type: Boolean, default: false },
    usuario: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  },
  { timestamps: true },
);

export default mongoose.model<IGrupo>("Grupo", GrupoSchema);
