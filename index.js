const express = require('express');
const path = require('path');
const { convert, toMoney } = require('./lib/convert');
const apiBCB = require('./lib/api.bcb');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
  const cotacao = await apiBCB.getCotacao();

  res.render('home', {
    cotacao
  });
})

app.get('/cotacao', (req, res) => {
  const { cotacao, quantidade } = req.query;
  if(cotacao && quantidade){
    const conversao = convert(cotacao, quantidade)
    res.render('cotacao', {
      cotacao: toMoney(cotacao),
      quantidade: toMoney(quantidade),
      conversao: toMoney(conversao),
      error: false
    });
  } else {
    res.render('cotacao', {
      error: 'Valores invalidos'
    })
  }
})

app.listen(3000, err => {
  if(err){
    console.log('Houve um erro ao subir servidor.', err)
  } else {
    console.log('Servidor ativado com sucesso.')
  }
})