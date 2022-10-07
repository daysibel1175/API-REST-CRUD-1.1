const mongoose = require("mongoose");

const guias = mongoose.Schema({
   nome: {
      type: String,
      required: true
   },
   contato: {
      type: Number,
      required: true
   },
   trilha: [{
      type: mongoose.Types.ObjectId,
      ref: 'Trilhas',
      autopopulate: true
   },],

});

module.exports = mongoose.model('guias', guias)