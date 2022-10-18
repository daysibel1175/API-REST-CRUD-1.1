
const { json } = require("express");
const express = require("express");
const { ConnectionStates } = require("mongoose");
const { populate} = require("../models/grupo.js");
const grupo = require("../models/grupo.js");
const usuario = require("../models/usuario.js");
const router = express.Router();



// Create - Inserir novos dados ao banco de dados
router.post("/grupo/insert", (req, res) =>{
    try{
    const grupos = grupo(req.body);
    const {guia, usuario, familiar }= req.body
    if(!guia || typeof nome == "number"){res.status(422).json('Opa! Ainda não sabe quem é seu guia, Porfavor veja os dados nas informaçoes da trilha que vc ira participar')
       return}
    if(!familiar){ res.status(422).json('Viaja sozinho ou em familia?')
      return}
    if(!usuario){ res.status(422).json('O grupo ainda nao tem nenhuma pessoa')
      return}
      Array.prototype.push.apply(usuario);
        grupos
       .save()
       .then((data) => res.status(201).send(data + ' Dados inseridos com sucesso!!' ))
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
    .populate({path: 'usuario', select: 'nome'})
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
      if(!id) return res.status(400).send({ error: 'O id ainda não foi inserido'})
      grupo
      .findById(id)
      .populate('usuario')
      .then((data) => res.status(200).send(data))
      .catch((error) => res.status(404).send('Ups! O grupo não existe'))
    }catch(error){
      res.status(500).send('Erro do servidor')
      console.error({ error: error })
    }
  });

  // Update - atualizar dados ou inserir valores faltantes
router.patch('/grupo/update/:id', (req, res) => {
    try {
      const { id } = req.params;
      const dados = req.body
      grupo
      .updateOne({ _id: id }, { $set: dados })
      .then((data) => res.status(200).send('Dados do grupo foram atualizado com sucesso'))
      .catch((error) => res.status(304).json({message: error + 'Nao foi possivel fazer atualizacao dos dados! O grupo nao existe'}))
      console.log(dados)
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
      .then((data) => res.status(200).json('grupo deletado com sucesso!!'))
      .catch((error) => res.status(400).json({ message: error + 'Error ao deletar os dados selecionados, ID ainda nao foi inserido ou ID invalido'}))
    }catch(error){
      res.status(500).send('Erro do servidor')
      console.error({ error: error })
    }
  });
  module.exports = router;