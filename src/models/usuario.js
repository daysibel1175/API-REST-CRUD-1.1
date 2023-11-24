const mongoose = require("mongoose");

const usuario = mongoose.Schema({
   nome: {
      type: String,
      required: true
   },
   dataDeNascimento: {
      type: Number,
      require: true
   },
   contato: {
      type: Number,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   senha: {
      type:String,
      required: true
   },
   // GRUPO AO QUE O USUARIO PERTECE
   grupo:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "grupo"
   }
});

module.exports = mongoose.model('usuario', usuario)