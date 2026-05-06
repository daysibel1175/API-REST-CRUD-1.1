import mongoose, { Document, Schema } from "mongoose";

export interface IUsuario extends Document {
  nome: string;
  idade: number;
  contato: number;
  email: string;
  isAdmin: boolean;
  grupos?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UsuarioSchema: Schema<IUsuario> = new Schema(
  {
    nome: { type: String, required: true },
    idade: { type: Number, required: true },
    contato: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    grupos: [{ type: Schema.Types.ObjectId, ref: "Grupo" }],
  },
  { timestamps: true },
);

export default mongoose.model<IUsuario>("Usuario", UsuarioSchema);
