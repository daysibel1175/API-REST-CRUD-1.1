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
    required:true
 },
 localizacao:{
    type:String,
    required: false
 },
 dica: {
   type: String,
   required: false
},
 guia:[{
   type: mongoose.Types.ObjectId,
   ref: 'guias',
   autopopulate: true
},],
 equipamento: [{
   type: mongoose.Types.ObjectId,
   ref: 'Equipamento',
   autopopulate: true
},],
});

module.exports = mongoose.model('Trilhas', trilhasSchema);