const express = require('express')
const app = express()
const addToken = require('./fetch_data')

app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

app.get('/', function (req, res) {
  res.render('home')
})
app.get('/list-token', function (req, res) {
    res.json({tokens: ['celo','flux','xrp']})
})
app.get('/add-token', function(req, res) {
    var params = req.query
    addToken(params.name, params.link)
    res.json({})
})
app.listen(3000);
