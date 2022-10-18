const mongoose = require("mongoose");

const grupo = mongoose.Schema({
   // O GUIA DA TRILHA
   guia:{
    type: mongoose.Types.ObjectId,
    ref: 'guia',
    autopopulate: true
   },
   // PARA SABER SI O GRUPO SERA DE UMA FAMILIA E TERÁ CRIANÇAS
   familiar:{
   type: Boolean,
   required: true
   },
   // OS USUARIOS DA TRILHA
   usuario:[{
      type: mongoose.Types.ObjectId,
      ref: 'usuario',
      autopopulate: true
   },],
   
});

module.exports = mongoose.model('grupo', grupo)