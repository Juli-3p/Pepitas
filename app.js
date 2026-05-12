const express = require ('express');

const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/',(req,res) => res.render("../views/paginas/index")); //inicio

app.post('/', (req, res) => {
    res.redirect('/vistProd');
});

app.get('/logeo',(req,res) => res.render("../views/paginas/logeo")); //login

app.post('/logeo', (req, res) => {
    res.redirect('/');
});

app.get('/registro',(req,res) => res.render("../views/paginas/registro")); //registro

app.post('/registro', (req, res) => {
    res.redirect('/');
});

app.get('/carrito',(req,res) => res.render("../views/paginas/carrito")); //carrito

app.get('/pago',(req,res) => res.render("../views/paginas/pago")); //pago

app.get('/vistProd',(req,res) => res.render("../views/paginas/vistProd")); //pago

app.listen(port, () =>{
    console.log("Aplicacion funcionando en el puerto");
});