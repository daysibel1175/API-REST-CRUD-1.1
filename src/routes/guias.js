const { application } = require("express");
const express = require("express");
const guias = require("../models/guias.js");
const guia = require("../models/guias.js")

const router = express.Router();


// Create - Inserir novos dados ao banco de dados
router.post("/guias/insert", (req, res) => {
  try{
    const guia =  guias(req.body)
    const {nome, contato} = req.body
    if(!nome || typeof nome == 'number'){ res.status(422).json('O nome é obrigatorio')
      return}
    if(!contato || typeof contato == 'string'){ res.status(422).json('Por segurança o campo contato precisa ser preenchido')
      return}
     guia
    .save()
    .then((data) => res.status(201).send(data + 'Dados inseridos com sucesso!'))
    .catch((error) => res.status(400).json({ message: error }))
  }catch(error){
    res.status(500).send('Erro do servidor')
    console.error({ error: error })
  }
});

// Read - leitura de todos os guias que existem no banco de datos
router.get("/guias/read", (req, res) => {
  try{
    guia
    .find()
    .populate({path: 'trilha', select: 'nome'})
    .populate({path: 'grupo', select: 'nome'})
    .then((data) => res.status(200).json((data)))
    .catch((error) => res.status(404).json({ message: error }))
  }catch(error){
    res.status(500)
    console.error({ error: error })
  }
});

// Read - leitura de um dado especifico usando o parametro ID
router.get('/guias/read/:id', (req, res) => {
  try{
    const { id } = req.params;
    if(!id) return res.status(400).send({ error: 'Id ainda nao foi inserido'})
    guia
    .findById(id)
    .populate('grupo')
    .populate({path:'trilha', select:'nome'})
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(404).json({message: error + 'Guia não foi encontrado'}))
  }catch(error){
    res.status(500)
    console.error({ error: error })
  }
});

// Update - atualizar dados ou inserir valores faltantes
router.patch('/guias/update/:id', (req, res) => {
  try {
    const { id } = req.params;
    const dados = (req.body);
    if(typeof req.body.nome == 'number'){ res.status(422).json('O nome não pode ser numeros')
      return}
    if(typeof req.body.contato == 'string'){ res.status(422).json('O contato não pode ser string')
      return}
    
    guia
    .updateOne({ _id: id }, { $set: dados })
    .then((data) => res.status(200).send('Dados do guia atualizado com sucesso'))
    .catch((error) => res.status(304).json({message: error + 'Nao foi possivel fazer atualizacao dos dados! O ID não existe'}))
  
    console.log(dados);
  } catch (error) {
    res.status(500)
    console.error({ error: error })
  }

});

//Delete - deletar dados do banco de dados 
router.delete("/guias/delete/:id", (req, res) => {
  try{
  const { id } = req.params;
  guia
    .deleteOne({ _id: id })
    .then((data) => res.status(200).send('Deletado com sucesso!!'))
    .catch((error) => res.status(400).json({ message: error + 'Error ao deletar os dados selecionados, ID ainda nao foi inserido ou ID invalido'}))
  }catch(error){
    res.status(500)
    console.error({ error: error })
  }
});

module.exports = router;
