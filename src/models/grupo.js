const mongoose = require("mongoose");

const grupo = mongoose.Schema({
   grupo:{
    type: Number,
    required: true
   },
   pessoa1: {
      type: String, Number,
      required: true
   },
   pessoa2: {
    type: String, Number,
    required: true
 },
   pessoa3: {
    type: String, Number,
    required: false
 }

});

module.exports = mongoose.model('grupo', grupo)