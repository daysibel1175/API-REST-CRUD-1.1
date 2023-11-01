const express = require("express");
const trilhasSchema = require("../models/trilhas")

const router = express.Router();

// Create - Inserir novos dados ao banco de dados
router.post("/trilhas/insert", (req, res) => {
  try{
      const trilha =  trilhasSchema(req.body)
      const {nome, localizacao, guia} = req.body
      if(!nome || typeof nome == 'number'){ res.status(422).json('O nome é obrigatorio')
        return}
      if(!localizacao || typeof localizacao == 'number'){ res.status(422).json('O campo localizaçao ainda nao foi preenchido')
        return}
      if(!guia){res.status(422).json('A Trilha nao pode começar sem o guia né?')
         return}
       trilha
      .save()
      .then((data) => res.status(201).send(data + 'Dados inseridos com sucesso!'))
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
      .populate({path: 'guia', select: 'nome'})
      .populate({path: 'grupo', select: 'nome'})
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
      .populate('guia')
      .populate('grupo')
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
      .then((data) => res.status(200).send('Atualizado com sucesso'))
      .catch((error) => res.status(304).json({message: error + 'Nao foi possivel fazer atualizacao dos dados! O ID não existe ou ainda nao foi inserido'}))
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
      .then((data) => res.status(200).json('Deletado com sucesso!!'))
      .catch((error) => res.status(400).json({ message: error + 'Error ao deletar os dados selecionados, ID ainda nao foi inserido ou ID invalido'}))
    }catch(error){
      res.status(500)
      console.error({ error: error })
    }
  });
  
  module.exports = router;