const mongoose = require("mongoose");

const guias = mongoose.Schema({
   // NOME DO GUIA
   nome: {
      type: String,
      required: true
   },
   // CONTATO DO GUIA
   contato: {
      type: Number,
      required: true
   },
   // TRILHA NA QUAL O GUIA VAI TRABALHAR
   trilha: {
      type: mongoose.Types.ObjectId,
      ref: 'Trilhas',
      autopopulate: true
   },
   // GRUPO DO QUAL O GUIA SERA RESPONSAVEL
   grupo:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "grupo"
   }

});

module.exports = mongoose.model('guias', guias)