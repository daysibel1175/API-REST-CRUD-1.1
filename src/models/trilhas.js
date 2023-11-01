const mongoose = require("mongoose");

const trilhasSchema = mongoose.Schema({
 nome:{
    type: String,
    required:true
 },
 tipo_de_trilha:{
    type: String,
    required: false
 },
 descricao:{
    type: String,
    required:false
 },
 localizacao:{
    type:String,
    required: true
 },
 dica: {
   type: String,
   required: false
},
// O GUIA RESPONSAVEL NA TRILHA
 guia:[{
   type: mongoose.Types.ObjectId,
   ref: 'guias',
   autopopulate: true
},],
// GRUPO QUE IRA PERCORRER A TRILHA
 grupo: [{
   type: mongoose.Types.ObjectId,
   ref: 'grupo',
   autopopulate: true
},],
});

module.exports = mongoose.model('Trilhas', trilhasSchema);