const express = require("express");
const equipamento = require("../models/equipamento.js")

const router = express.Router();

// insert
router.post("/equipamento/insert", (req, res) =>{
    const equipo = equipamento(req.body);
    equipo
       .save()
       .then((data) => res.json(data))
       .catch((error) => res.json({ message: error}))
  });
  
  // get all 
  router.get('/equipamento', (req, res) =>{
      equipamento
         .find()
         .then((data) => res.json(data))
         .catch((error) => res.json({ message: error}))
    });
  
    // get one
  router.get('/equipamento/:id', (req, res) =>{
      const { id } = req.params;
      equipamento
         .findById(id)
         .then((data) => res.json(data))
         .catch((error) => res.json({ message: error}))
    });
    
    // update 
    router.put('/equipamento/update/:id', (req, res) => {
      try {
        const { id } = req.params;
        const requisicao = (req.body);
        const dados = requisicao
        console.log(dados);
        equipamento
          .updateOne({ _id: id }, { $set: dados })
          .then((data) => res.json(data))
          .catch((error) => res.json({ message: error }))
    
      } catch (error) {
        res.status(500)
        console.log({ error: error })
      }
    
    })
    
    //delete 
    router.delete("/equipamento/:id", (req, res) =>{
      const { id } = req.params;
      equipamento
          .deleteOne({_id: id})
         .then((data) => res.json(data))
         .catch((error) => res.json({ message: error}))
    });
  
  module.exports = router;