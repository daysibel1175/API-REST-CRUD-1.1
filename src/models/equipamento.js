const mongoose = require("mongoose");

const modelo = mongoose.Schema({
 equipamento:{
    type: String,
    required:true
 },
 descricao:{
    type: String,
    required: true
 },
});

module.exports = mongoose.model('Equipamento', modelo);