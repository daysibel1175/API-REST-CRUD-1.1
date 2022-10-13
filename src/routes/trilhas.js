const express = require("express");
const trilhasSchema = require("../models/trilhas")

const router = express.Router();

// Create - Inserir novos dados ao banco de dados
router.post("/trilhas/insert", (req, res) => {
  try{
      const trilha =  trilhasSchema(req.body)
      const {nome, localizacao} = req.body
      if(!nome){ res.status(422).json('O nome é obrigatorio')
        return}
      if(!localizacao){ res.status(422).json('O campo localizaçao ainda nao foi preenchido')
        return}
       trilha
      .save()
      .then((data) => res.status(201).send(data + 'Dados inseridos com susseso!'))
      .catch((error) => res.status(400).json({ message: error }))
    }catch(error){
      res.status(500)
      console.error({ error: error })
    }
  });
  
  
  // Read - leitura de todas as trilhas que existem no banco de datos(original)
  router.get("/trilhas/read", (req, res) => {
    try{
    trilhasSchema
      .find()
      .populate('guia')
      .populate('grupo')
      .then((data) => res.status(302).json((data)))
      .catch((error) => res.status(404).json({ message: error }))
    }catch(error){ 
      res.status(500).json({ error: error })
    }
  });
  
  // Read - leitura de um dado especifico usando o parametro ID
  router.get('/trilhas/read/:id', (req, res) => {
    try{
      const { id } = req.params;
      if(!id) return res.status(404).send({ error: 'Trilha não encontrada'})
      trilhasSchema
      .findById(id)
      .then((data) => res.status(302).send(data))
      .catch((error) => res.status(404).json({message: error + 'O Id não foi encontrado ou ainda precisa inserir esse dado'}))
    }catch(error){
      res.status(500)
      console.error({ error: error })
    }
  });
  
  // Update - atualizar dados ou inserir valores faltantes
  router.patch('/trilhas/update/:id', (req, res) => {
    try {
      const { id } = req.params;
      const dados = (req.body);
  
      trilhasSchema
      .updateOne({ _id: id }, { $set: dados })
      .then((data) => res.status(200).json(data + 'Atualizado com susseso'))
      .catch((error) => res.status(304).json({message: error + 'Nao foi possivel fazer atualizacao dos dados! O ID não existe ou ainda nao foi inserido'}))
    
      console.log(dados);
    } catch (error) {
      res.status(500)
      console.error({ error: error })
    }
  
  });
  
   // Update - atualizar todos os dados
   router.put('/trilhas/update/:id', (req, res) => {
    try {
      const { id } = req.params;
      const dados = (req.body);
      const nome = req.body.nome
      const descricao = req.body.descricao
      const localizacao = req.body.localizacao

      if(!nome){ res.status(422).json('O nome é obrigatorio')
      return}
      if(!descricao){ res.status(422).json('O nome é obrigatorio')
      return}
      if(!localizacao){ res.status(422).json('O campo localizaçao precisa ser preenchido')
      return}
      
      trilhasSchema
      .updateOne({ _id: id }, { $set: dados })
      .then((data) => res.status(200).json(data + 'Atualizado com susseso'))
      .catch((error) => res.status(304).json({message: error + 'Nao foi possivel fazer atualizacao dos dados! O ID não existe ou ID ainda nao foi inserido'}))
    
      console.log(dados);
    } catch (error) {
      res.status(500)
      console.error({ error: error })
    }
  
  });

  //Delete - deletar dados do banco de dados 
  router.delete("/trilhas/delete/:id", (req, res) => {
    try{
    const { id } = req.params;
    trilhasSchema
      .deleteOne({ _id: id })
      .then((data) => res.status(200).json(data + 'Deletado com susseso!!'))
      .catch((error) => res.status(400).json({ message: error + 'Error ao deletar os dados selecionados, ID ainda nao foi inserido ou ID invalido'}))
    }catch(error){
      res.status(500)
      console.error({ error: error })
    }
  });
  
  module.exports = router;