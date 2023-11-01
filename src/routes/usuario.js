const express = require("express");
const Grupo = require("../models/grupo");
const grupo = require("../models/grupo");
const usuario = require("../models/usuario");
const Usuario = require("../models/usuario")

const router = express.Router();

// Create - Inserir novos dados ao banco de dados
router.post("/usuario/insert", (req, res) => {
  try{
      const usuario =  Usuario(req.body)
      const {nome, idade, contato, email} = req.body
      if(!nome || typeof nome == "number"){ res.status(422).json('O nome é obrigatorio')
        return}
      if(!idade || typeof idade == "string"){ res.status(422).json('É obrigatorio preencher o campo idade')
        return}
      if(idade >= 18 & !contato || typeof contato == "string"){ res.status(422).json('Para sua segurança é obrigatorio preencher o campo contato')
        return}
      if(idade >= 18 & !email || typeof email == "number"){ res.status(422).json('Precisamos de seu email para enviar os dados da trilha')
        return}
       usuario
      .save()
      .then((data) => res.status(201).send( data + ' Cadastrou-se com sucesso!'))
      .catch((error) => res.status(400).json({ message: error }))
    }catch(error){
      res.status(500)
      console.error({ error: error })
    }
  });

  // Read - leitura de todos os usuarios que existem no banco de datos
  router.get("/usuario/read", (req, res) => {
    try{
    Usuario
      .find()
      .then((data) => res.status(302).json((data)))
      .catch((error) => res.status(404).json({ message: error }))
    }catch(error){ 
      res.status(500).json({ error: error })
    }
  });
  
  // Read - leitura de um dado especifico usando o parametro ID
  router.get('/usuario/read/:id', (req, res) => {
    try{
      const { id } = req.params;
      if(!id) return res.status(404).send({ error: 'Usuario não existe'})
      Usuario
      .findById(id)
      .then((data) => res.status(302).send(data))
      .catch((error) => res.status(404).json({message: error + 'O Id não foi encontrado ou ainda precisa inserir esses dados'}))
    }catch(error){
      res.status(500)
      console.error({ error: error })
    }
  });
  
  // Update - atualizar dados ou inserir valores faltantes
  router.patch('/usuario/update/:id', (req, res) => {
    try {
      const { id } = req.params;
      const dados = (req.body);
      
      Usuario
      .updateOne({ _id: id }, { $set: dados })
      .then((data) => res.status(200).json('Seus dados foram atualizados com sucesso'))
      .catch((error) => res.status(304).json({message: error + 'Nao foi possivel fazer atualizacao dos dados! O ID não existe ou ainda nao foi inserido'}))
    
      console.log(dados);
    } catch (error) {
      res.status(500)
      console.error({ error: error })
    }
  
  });

  //Delete - deletar dados do banco de dados 
  router.delete("/usuario/delete/:id", (req, res) => {
    try{
    const { id } = req.params;
    Usuario
      .deleteOne({ _id: id })
      .then((data) => res.status(200).json('Usuario deletado com sucesso!!'))
      .catch((error) => res.status(400).json({ message: error + 'Error ao deletar os dados selecionados, ID ainda nao foi inserido ou ID invalido'}))
    }catch(error){
      res.status(500)
      console.error({ error: error })
    }
  });
  
  module.exports = router;