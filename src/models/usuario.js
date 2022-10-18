const mongoose = require("mongoose");

const usuario = mongoose.Schema({
   nome: {
      type: String,
      required: true
   },
   edade: {
      type: Number,
      require: true
   },
   contato: {
      type: Number,
      required: false
   },
   email: {
      type: String,
      required: false
   },
   // GRUPO AO QUE O USUARIO PERTECE
   grupo:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "grupo"
   }
});

module.exports = mongoose.model('usuario', usuario)