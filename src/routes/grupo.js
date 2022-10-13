
const express = require("express");
const grupo = require("../models/grupo.js")
const router = express.Router();



// Create - Inserir novos dados ao banco de dados
router.post("/grupo/insert", (req, res) =>{
    try{
    const grupos = grupo(req.body);
    const pessoa = req.body.pessoa1
    const pessoa2 = req.body.pessoa2
    if(!pessoa){ res.status(422).json('O campo pessoa ainda nao foi preenchido')
      return}
    if(!pessoa2){ res.status(422).json('Precisa mais de uma pessoa para o grupo ser validado')
      return}
    grupos
       .save()
       .then((data) => res.status(201).send(data + 'Dados inseridos com susseso!!' ))
       .catch((error) => res.status(400).json({ message: error}))
    }catch(error){
        res.status(500).send('Erro do servidor')
        console.error({ error: error })
    }
  });

// Read - leitura de todos os grupos que existem no banco de datos
router.get("/grupo/read", (req, res) => {
  try{
    grupo
    .find()
    .then((data) => res.status(200).json((data)))
    .catch((error) => res.status(404).json({ message: error }))
  }catch(error){
    res.status(500)
    console.error({ error: error })
  }
});

  // Read - leitura de um dado especifico usando o parametro ID
router.get('/grupo/read/:id', (req, res) => {
    try{
      const { id } = req.params;
      if(!id) return res.status(404).send({ error: 'Grupo não encontrado'})
      grupo
      .findById(id)
      .then((data) => res.status(200).send(data))
      .catch((error) => res.status(404).json({message: error + 'Ups! Não foi possivel encontrar esse Id'}))
    }catch(error){
      res.status(500).send('Erro do servidor')
      console.error({ error: error })
    }
  });

  // Update - atualizar dados ou inserir valores faltantes
router.patch('/grupo/update/:id', (req, res) => {
    try {
      const { id } = req.params;
      const dados = (req.body);
  
      grupo
      .updateOne({ _id: id }, { $set: dados })
      .then((data) => res.status(200).json(data + 'Atualizado com susseso'))
      .catch((error) => res.status(304).json({message: error + 'Nao foi possivel fazer atualizacao dos dados! O ID não existe'}))
    
    } catch (error) {
      res.status(500).send('Erro do servidor')
      console.error({ error: error })
    }
  
  });

    // Update - atualizar dados
router.put('/grupo/update/:id', (req, res) => {
  try {
    const { id } = req.params;
    const dados = (req.body);
    const turma = req.body.grupo
    const pessoa = req.body.pessoa1;
    const pessoa2 = req.body.pessoa2

    if(!pessoa){ res.status(422).json('O campo pessoa ainda nao foi preenchido')
    return}
    if(!pessoa2){ res.status(422).json('Precisa mais de uma pessoa para o grupo ser validado')
    return}
    if(!turma){ res.status(422).json('O numero do grupo ainda nao foi preenchido')
    return}
    grupo
    .updateOne({ _id: id }, { $set: dados })
    .then((data) => res.status(200).json(data + 'Atualizado com susseso'))
    .catch((error) => res.status(304).json({message: error + 'Nao foi possivel fazer atualizacao dos dados! O ID não existe'}))
  
  } catch (error) {
    res.status(500).send('Erro do servidor')
    console.error({ error: error })
  }

});

  //Delete - deletar dados do banco de dados 
router.delete("/grupo/delete/:id", (req, res) => {
    try{
    const { id } = req.params;
    grupo
      .deleteOne({ _id: id })
      .then((data) => res.status(200).json(data + 'Deletado com susseso!!'))
      .catch((error) => res.status(400).json({ message: error + 'Error ao deletar os dados selecionados, ID ainda nao foi inserido ou ID invalido'}))
    }catch(error){
      res.status(500).send('Erro do servidor')
      console.error({ error: error })
    }
  });
  module.exports = router;